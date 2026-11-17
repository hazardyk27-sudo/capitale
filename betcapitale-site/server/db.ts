import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

/* Prevent Node from crashing on idle connection drops (pg error 57P01 etc.) */
pool.on("error", (err) => {
  console.error("[db-pool] idle client error — connection will be replaced automatically:", err.message);
});

export const db = drizzle(pool, { schema });

export async function runMigrations() {
  const client = await pool.connect();
  try {
    // Guard: only run ALTER TABLE mutations on tables that already exist.
    // On a fresh schema (first boot after provisioning) Drizzle-kit push has
    // already created all tables correctly, so these ALTER statements are
    // no-ops for new installs and only needed for in-place upgrades.
    await client.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'today_published'
        ) THEN
          ALTER TABLE today_published ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
        END IF;
      END $$;
    `);

    // Recreate users table for email-based auth
    await client.query(`
      CREATE TABLE IF NOT EXISTS users_new (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        email_verified BOOLEAN NOT NULL DEFAULT false,
        verification_token TEXT,
        token_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    // If old users table exists with username column, rename it and use users_new
    const { rows } = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'username';
    `);
    if (rows.length > 0) {
      // Old schema — drop and recreate
      await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
      await client.query(`ALTER TABLE users_new RENAME TO users;`);
    } else {
      // Already new schema or users_new is redundant
      await client.query(`DROP TABLE IF EXISTS users_new;`);
      // Add any missing columns
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;`);
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT;`);
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;`);
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();`);
    }

    // Membership expiry — auto-set by Whop webhook, optionally overridden by admin
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;`);

    // Password-reset tokens — dedicated columns, separate from email-verification tokens
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT;`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ;`);

    // membership_daily_summaries — admin-managed summary per date+tier
    await client.query(`
      CREATE TABLE IF NOT EXISTS membership_daily_summaries (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        tier TEXT NOT NULL,
        total_coupons INTEGER NOT NULL DEFAULT 0,
        total_matches INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE(date, tier)
      );
    `);

    // site_settings — key/value store for admin-configurable settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    await client.query(`
      INSERT INTO site_settings (key, value) VALUES ('member_count_base', '1247')
      ON CONFLICT (key) DO NOTHING;
    `);
    await client.query(`
      INSERT INTO site_settings (key, value) VALUES ('community_active', '128')
      ON CONFLICT (key) DO NOTHING;
    `);
    await client.query(`
      INSERT INTO site_settings (key, value) VALUES ('community_today_inc', '4')
      ON CONFLICT (key) DO NOTHING;
    `);
    await client.query(`
      INSERT INTO site_settings (key, value) VALUES ('community_week_inc', '19')
      ON CONFLICT (key) DO NOTHING;
    `);

    // counter_daily_plan — autonomous member counter schedule
    await client.query(`
      CREATE TABLE IF NOT EXISTS counter_daily_plan (
        date           TEXT PRIMARY KEY,
        total_increment INTEGER NOT NULL DEFAULT 0,
        scheduled_times TEXT    NOT NULL DEFAULT '[]',
        applied_count   INTEGER NOT NULL DEFAULT 0,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // Add missing columns to membership_daily_summaries if needed
    await client.query(`ALTER TABLE membership_daily_summaries ADD COLUMN IF NOT EXISTS title TEXT;`);

    // Add whop_count column to counter_daily_plan (added for Whop webhook auto-increment)
    await client.query(`ALTER TABLE counter_daily_plan ADD COLUMN IF NOT EXISTS whop_count INTEGER NOT NULL DEFAULT 0;`);

    // Idempotency table for Whop webhook events — prevents double-counting on retries
    await client.query(`
      CREATE TABLE IF NOT EXISTS whop_processed_events (
        event_id    TEXT PRIMARY KEY,
        event_type  TEXT NOT NULL,
        processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // terms_acceptances — append-only Terms & Conditions acceptance log (never
    // updated/deleted; a new row is written for every version a user accepts).
    await client.query(`
      CREATE TABLE IF NOT EXISTS terms_acceptances (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        terms_version TEXT NOT NULL,
        terms_effective_date TEXT NOT NULL,
        accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        order_id TEXT,
        ip_address TEXT,
        user_agent TEXT
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS terms_acceptances_user_version_idx ON terms_acceptances (user_id, terms_version);`);

    // membership_publications.target — distinguishes /today "Members Only" content
    // from /membership "Profile" content; existing rows default/backfill to
    // members_only so /today does not regress.
    await client.query(`ALTER TABLE membership_publications ADD COLUMN IF NOT EXISTS target TEXT NOT NULL DEFAULT 'members_only';`);

    // whop_checkouts — maps a Whop checkout_configuration id (the webhook's
    // `checkout_session` field) back to the exact local user who initiated it,
    // so grant/revoke webhooks can resolve the account even when the Whop
    // account email differs from the site's login email.
    await client.query(`
      CREATE TABLE IF NOT EXISTS whop_checkouts (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        plan_id TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // whop_pending_grants — holds a grant that arrived before any matching
    // local account existed (e.g. payment completed before registration
    // finished); applied automatically on the next register/login for that email.
    await client.query(`
      CREATE TABLE IF NOT EXISTS whop_pending_grants (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        tier TEXT NOT NULL,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS whop_pending_grants_email_idx ON whop_pending_grants (email);`);
    await client.query(`ALTER TABLE whop_pending_grants ADD COLUMN IF NOT EXISTS membership_id TEXT;`);
    // Admin tier override lock — prevents Whop automation from overwriting manually-set tiers.
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS tier_override BOOLEAN NOT NULL DEFAULT false;`);

    // ad_redirect_events — Meta → Telegram click tracker (append-only, no raw IPs)
    // CREATE TABLE covers fresh installs; ALTER TABLE covers in-place upgrades.
    // Indexes are created AFTER the ALTER TABLE so the columns exist on both paths.
    await client.query(`
      CREATE TABLE IF NOT EXISTS ad_redirect_events (
        id              SERIAL PRIMARY KEY,
        slug            TEXT NOT NULL,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
        user_agent      TEXT,
        referrer        TEXT,
        device_category TEXT NOT NULL DEFAULT 'unknown',
        event_type      TEXT NOT NULL DEFAULT 'REQUEST_SEEN',
        classification  TEXT NOT NULL DEFAULT 'BROWSER_LIKE_REQUEST',
        parent_event_id INTEGER,
        hashed_ip       TEXT,
        is_qa           BOOLEAN NOT NULL DEFAULT false
      );
    `);

    // Migrate existing columns on already-provisioned databases (no-ops on fresh installs)
    await client.query(`ALTER TABLE ad_redirect_events ADD COLUMN IF NOT EXISTS event_type      TEXT NOT NULL DEFAULT 'REQUEST_SEEN';`);
    await client.query(`ALTER TABLE ad_redirect_events ADD COLUMN IF NOT EXISTS parent_event_id INTEGER;`);
    await client.query(`ALTER TABLE ad_redirect_events ADD COLUMN IF NOT EXISTS is_qa BOOLEAN NOT NULL DEFAULT false;`);
    // Drop old session_id column if it exists (no longer used)
    await client.query(`ALTER TABLE ad_redirect_events DROP COLUMN IF EXISTS session_id;`);
    // Rename old classification values to new ones (idempotent WHERE clauses)
    await client.query(`UPDATE ad_redirect_events SET classification = 'KNOWN_BOT_OR_PREFETCH' WHERE classification = 'BOT_OR_PREFETCH';`);
    await client.query(`UPDATE ad_redirect_events SET classification = 'BROWSER_LIKE_REQUEST'  WHERE classification = 'HUMAN_CANDIDATE';`);

    // Indexes created after ALTER TABLE so event_type column is guaranteed to exist
    await client.query(`CREATE INDEX IF NOT EXISTS ad_redirect_events_slug_idx       ON ad_redirect_events (slug);`);
    await client.query(`CREATE INDEX IF NOT EXISTS ad_redirect_events_created_at_idx ON ad_redirect_events (created_at);`);
    await client.query(`CREATE INDEX IF NOT EXISTS ad_redirect_events_event_type_idx ON ad_redirect_events (event_type);`);

    // promotion_sessions — anonymous Promotion page session analytics
    await client.query(`
      CREATE TABLE IF NOT EXISTS promotion_sessions (
        id                  SERIAL PRIMARY KEY,
        session_id          TEXT NOT NULL UNIQUE,
        created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
        last_seen_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
        duration_seconds    INTEGER NOT NULL DEFAULT 0,
        did_scroll          BOOLEAN NOT NULL DEFAULT false,
        max_scroll_percent  INTEGER NOT NULL DEFAULT 0,
        device_category     TEXT NOT NULL DEFAULT 'unknown',
        referrer            TEXT,
        user_agent          TEXT,
        hashed_visitor_id   TEXT,
        source              TEXT NOT NULL DEFAULT 'direct',
        browser_confirmed   BOOLEAN NOT NULL DEFAULT false,
        visible_seconds     INTEGER NOT NULL DEFAULT 0,
        trusted_interaction BOOLEAN NOT NULL DEFAULT false,
        trusted_interaction_count INTEGER NOT NULL DEFAULT 0,
        trusted_scroll      BOOLEAN NOT NULL DEFAULT false,
        known_bot_ua        BOOLEAN NOT NULL DEFAULT false,
        human_score         INTEGER NOT NULL DEFAULT 0,
        classification      TEXT NOT NULL DEFAULT 'SUSPICIOUS',
        country             TEXT,
        city                TEXT,
        cta                 TEXT,
        is_qa               BOOLEAN NOT NULL DEFAULT false
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS promotion_sessions_created_at_idx ON promotion_sessions (created_at);`);
    await client.query(`CREATE INDEX IF NOT EXISTS promotion_sessions_hashed_visitor_idx ON promotion_sessions (hashed_visitor_id);`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'direct';`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS browser_confirmed BOOLEAN NOT NULL DEFAULT false;`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS visible_seconds INTEGER NOT NULL DEFAULT 0;`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS trusted_interaction BOOLEAN NOT NULL DEFAULT false;`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS trusted_interaction_count INTEGER NOT NULL DEFAULT 0;`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS trusted_scroll BOOLEAN NOT NULL DEFAULT false;`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS known_bot_ua BOOLEAN NOT NULL DEFAULT false;`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS human_score INTEGER NOT NULL DEFAULT 0;`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS classification TEXT NOT NULL DEFAULT 'SUSPICIOUS';`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS country TEXT;`);
    await client.query(`ALTER TABLE promotion_sessions ADD COLUMN IF NOT EXISTS city TEXT;`);

    // ad_redirect_tokens — one-time tokens for two-step browser confirmation
    await client.query(`
      CREATE TABLE IF NOT EXISTS ad_redirect_tokens (
        token           TEXT PRIMARY KEY,
        slug            TEXT NOT NULL,
        parent_event_id INTEGER NOT NULL,
        expires_at      TIMESTAMPTZ NOT NULL,
        consumed_at     TIMESTAMPTZ,
        is_qa           BOOLEAN NOT NULL DEFAULT false,
        page_confirmed_event_id INTEGER,
        two_second_recorded_at TIMESTAMPTZ,
        telegram_click_recorded_at TIMESTAMPTZ
      );
    `);
    await client.query(`ALTER TABLE ad_redirect_tokens ADD COLUMN IF NOT EXISTS is_qa BOOLEAN NOT NULL DEFAULT false;`);
    await client.query(`ALTER TABLE ad_redirect_tokens ADD COLUMN IF NOT EXISTS page_confirmed_event_id INTEGER;`);
    await client.query(`ALTER TABLE ad_redirect_tokens ADD COLUMN IF NOT EXISTS two_second_recorded_at TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE ad_redirect_tokens ADD COLUMN IF NOT EXISTS telegram_click_recorded_at TIMESTAMPTZ;`);
    // Human challenge columns (added for press-and-hold experiment)
    await client.query(`ALTER TABLE ad_redirect_tokens ADD COLUMN IF NOT EXISTS challenge_shown_at TIMESTAMPTZ;`);
    // Recorded at the instant the user's pointer/touch first presses the hold button.
    // /go-challenge/verify requires this column to be set AND at least 1.5 s to have
    // elapsed from it — ensuring the server measures elapsed time from hold-start,
    // not just from page load.
    await client.query(`ALTER TABLE ad_redirect_tokens ADD COLUMN IF NOT EXISTS challenge_hold_start_at TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE ad_redirect_tokens ADD COLUMN IF NOT EXISTS challenge_passed_at TIMESTAMPTZ;`);
    // Hash of the challenge token nonce — consumed (set to NULL) on first /go-telegram/ use
    // so the challenge token is truly single-use.
    await client.query(`ALTER TABLE ad_redirect_tokens ADD COLUMN IF NOT EXISTS challenge_token_hash TEXT;`);
    await client.query(`CREATE INDEX IF NOT EXISTS ad_redirect_tokens_expires_at_idx ON ad_redirect_tokens (expires_at);`);
  } finally {
    client.release();
  }
}
