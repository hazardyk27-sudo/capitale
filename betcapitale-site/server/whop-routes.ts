import crypto from "crypto";
import type { Express, Request } from "express";
import { Webhook } from "svix";
import { storage } from "./storage";
import { db } from "./db";
import { counterDailyPlan, users, whopCheckouts } from "@shared/schema";
import { eq, sql, isNotNull, isNull } from "drizzle-orm";
import { hasAcceptedCurrentTerms } from "./terms-routes";

import { WHOP_PLANS, LEGACY_WHOP_PLANS, isWhopMembershipValid } from "./whop-contract.js";
export { WHOP_PLANS } from "./whop-contract.js";

const ALL_WHOP_PLANS = [...WHOP_PLANS, ...LEGACY_WHOP_PLANS];

const PLAN_TIER_MAP: Record<string, "select" | "unlimited"> = {};
for (const plan of ALL_WHOP_PLANS) {
  PLAN_TIER_MAP[plan.id] = plan.tier === "standard" ? "select" : "unlimited";
}

const WHOP_API_BASE = process.env.WHOP_ENVIRONMENT === "sandbox" ? "https://sandbox-api.whop.com/api/v1" : "https://api.whop.com/api/v1";
const WHOP_API_VERSION_DATE = process.env.WHOP_API_VERSION_DATE || "2026-11-17-3";
class WhopApiError extends Error { constructor(readonly status: number, message: string) { super(message); this.name = "WhopApiError"; } }
export function getWhopAccountId(): string {
  const id = process.env.WHOP_ACCOUNT_ID?.trim();
  if (!id) throw new Error("WHOP_ACCOUNT_ID not set");
  return id;
}
async function whopFetch(path: string, options: RequestInit = {}) {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) throw new Error("WHOP_API_KEY not set");
  const res = await fetch(`${WHOP_API_BASE}${path}`, { ...options, headers: {
    "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json",
    "Api-Version-Date": WHOP_API_VERSION_DATE, ...(options.headers ?? {}),
  }});
  const body = await res.text();
  let data: any = {};
  try { data = body ? JSON.parse(body) : {}; } catch { data = { message: body.slice(0, 200) }; }
  if (!res.ok) {
    const message = typeof data?.error?.message === "string" ? data.error.message : typeof data?.message === "string" ? data.message : `Whop API returned HTTP ${res.status}`;
    throw new WhopApiError(res.status, message);
  }
  return data;
}
async function getWhopMemberEmail(memberId: string | undefined): Promise<string | undefined> {
  if (!memberId) return undefined;
  const member = await whopFetch(`/members/${encodeURIComponent(memberId)}`);
  return typeof member?.email === "string" ? member.email : undefined;
}
async function listWhopMemberships(statuses: string[], maxPages = 10): Promise<Record<string, unknown>[]> {
  const rows: Record<string, unknown>[] = []; let after: string | undefined;
  for (let page = 0; page < maxPages; page++) {
    const query = new URLSearchParams({ account_id: getWhopAccountId(), first: "100" });
    statuses.forEach(status => query.append("statuses", status)); if (after) query.set("after", after);
    const data = await whopFetch(`/memberships?${query.toString()}`);
    rows.push(...((data?.data ?? []) as Record<string, unknown>[]));
    const info = data?.page_info as Record<string, unknown> | undefined;
    if (info?.has_next_page !== true || typeof info.end_cursor !== "string" || !info.end_cursor) break;
    after = info.end_cursor;
  }
  return rows;
}

/** Normalizes Whop API timestamps (ISO strings or Unix seconds/milliseconds) to milliseconds. */
function whopTimestampToMs(raw: number | string | Date | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  if (raw instanceof Date) return isNaN(raw.getTime()) ? null : raw.getTime();
  if (typeof raw === "number") return raw < 1e12 ? raw * 1000 : raw;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d.getTime();
}

/** Days remaining until expiresAtMs, rounded up. Null when there is no expiry on file. */
function computeDaysLeft(expiresAtMs: number | null): number | null {
  if (expiresAtMs === null) return null;
  return Math.ceil((expiresAtMs - Date.now()) / (1000 * 60 * 60 * 24));
}

/**
 * Membership access ends at 00:01 Istanbul time on the calendar date after
 * the plan's final day, rather than exactly N*24 hours after purchase.
 * Example: Aug 23 13:09 + 7-day plan => Aug 30 00:01.
 */
export function calendarExpiryFromStart(startRaw: number | string | Date | null | undefined, planDays: number): Date | null {
  const startMs = whopTimestampToMs(startRaw);
  if (startMs === null) return null;
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date(startMs));
  const expiry = new Date(`${date}T00:01:00+03:00`);
  expiry.setUTCDate(expiry.getUTCDate() + planDays);
  return expiry;
}

/**
 * Converts a provider period end to the site's access boundary. Whop may return
 * the end of a period at any time during a calendar day; the site closes access
 * at 00:01 Istanbul on that displayed end date.
 */
export function calendarExpiryFromProviderEnd(endRaw: number | string | Date | null | undefined): Date | null {
  const endMs = whopTimestampToMs(endRaw);
  if (endMs === null) return null;
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date(endMs));
  return new Date(`${date}T00:01:00+03:00`);
}

/**
 * Resolves the local access boundary without allowing a provider's later
 * renewal window to extend a cancelled membership. Active/renewed memberships
 * use the provider's current period date, normalized to 00:01 Istanbul; an
 * initial plan-length fallback uses the plan start date and calendar days.
 */
export function localMembershipExpiry(options: {
  valid?: boolean | null;
  createdAt?: number | string | Date | null;
  providerExpiry?: number | string | Date | null;
  planDays?: number | null;
}): Date | null {
  const { valid = null, createdAt, providerExpiry, planDays } = options;
  if (valid === false && planDays) {
    const cancelledExpiry = calendarExpiryFromStart(createdAt, planDays);
    if (cancelledExpiry) return cancelledExpiry;
  }
  return calendarExpiryFromProviderEnd(providerExpiry)
    ?? (planDays ? calendarExpiryFromStart(createdAt, planDays) : null);
}

export type WhopRenewalStatus = "active" | "cancel_pending" | "cancelled";
export type MembershipAccessStatus = "active" | "expired" | "unknown";

export function getWhopRenewalStatus(
  valid: boolean | null | undefined,
  cancelAtPeriodEnd: boolean,
  fallbackStatus: "active" | "cancelled",
): WhopRenewalStatus {
  if (valid === false || fallbackStatus === "cancelled") return "cancelled";
  return cancelAtPeriodEnd ? "cancel_pending" : "active";
}

export function getMembershipAccessStatus(
  expiresAtMs: number | null,
  nowMs = Date.now(),
): MembershipAccessStatus {
  if (expiresAtMs === null) return "unknown";
  return expiresAtMs <= nowMs ? "expired" : "active";
}

/**
 * Extends a Whop membership's own billing period/expiry using Whop's official
 * "add free days" action. This is the only membership-length mutation Whop's API
 * exposes — there is no equivalent endpoint to remove days, so reductions can only
 * ever be applied to the locally stored access window, never mirrored on Whop's side.
 */
async function addFreeDaysToWhopMembership(membershipId: string, freeDays: number): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await whopFetch(`/memberships/${encodeURIComponent(membershipId)}/extend`, {
      method: "POST",
      body: JSON.stringify({ days: freeDays }),
    });
    if (result && typeof result === "object" && "error" in result && result.error) {
      return { ok: false, error: typeof result.error === "string" ? result.error : JSON.stringify(result.error) };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/**
 * Verifies that a Whop membership id actually belongs to the given email before it is
 * trusted for a mutation. The client supplies `whopMembershipId` alongside the target
 * email, and an admin-authenticated request is not sufficient reason to trust that
 * pairing blindly — a stale row, a copy/paste mistake, or a mismatched bulk-selection
 * payload could otherwise extend a completely unrelated person's Whop subscription.
 */
async function verifyWhopMembershipEmail(membershipId: string, expectedEmail: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const m = await whopFetch(`/memberships/${encodeURIComponent(membershipId)}`);
    const member = (m?.member ?? {}) as Record<string, unknown>;
    const memberId = (m?.member_id ?? member.id) as string | undefined;
    const actualEmail = (typeof member.email === "string" ? member.email : await getWhopMemberEmail(memberId) ?? "").toLowerCase().trim();
    if (!actualEmail) {
      return { ok: false, error: "Whop üyeliğine ait e-posta doğrulanamadı." };
    }
    if (actualEmail !== expectedEmail.toLowerCase().trim()) {
      return { ok: false, error: "Whop üyelik kimliği bu e-postaya ait değil; senkronizasyon reddedildi." };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Shared admin guard for the plain (non-middleware) routes in this file. Responds and returns false when not authorized. */
async function assertAdmin(req: Request & { session?: any }, res: any): Promise<boolean> {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Giriş yapılmamış." });
    return false;
  }
  const adminUser = await storage.getUserById(req.session.userId);
  if (!adminUser?.isAdmin) {
    res.status(403).json({ error: "Admin yetkisi gerekli." });
    return false;
  }
  return true;
}

// ── Counter increment helper ──────────────────────────────────────────────────
/** Called when a real Whop membership becomes valid.
 *  - Increments member_count_base by 1 (site_settings)
 *  - Upserts today's counter_daily_plan row, adding 1 to whopCount, totalIncrement, appliedCount
 */
/**
 * Increments member_count_base and today's counter_daily_plan whop_count by 1.
 * Idempotent: uses eventId as a unique key in whop_processed_events — duplicate
 * deliveries of the same webhook are silently skipped.
 * Returns: "incremented" | "duplicate" | "error"
 */
/**
 * Fetches the authoritative membership expiry directly from Whop's API, keyed by the
 * membership id carried in the webhook payload. Using Whop's own value (rather than
 * computing `now + plan.days` locally) makes expiry sync naturally idempotent: no matter
 * how many grant-class events fire for one purchase (went_valid, activated, payment.succeeded,
 * …) or how many times any of them is redelivered, re-applying the same authoritative
 * value never over-extends the membership the way additive local math would.
 * Returns null if the id is missing or the lookup fails — callers must not treat that as
 * "no expiry" and must avoid extending an already-set expiry in that case.
 */
function parseWhopTimestamp(raw: number | string | null | undefined): Date | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") {
    // Numeric provider timestamps can be Unix seconds or milliseconds.
    const ms = raw < 1e12 ? raw * 1000 : raw;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Fetches a membership's CURRENT state directly from Whop — the source of truth,
 * not the webhook event type. Webhooks can arrive out of order or be retried, so a
 * "grant" event delivered after a "revoke" event for the same membership (or a
 * revoke that was queued for an account that didn't exist yet, then later
 * re-delivered as a stale grant) must never be trusted at face value. Every
 * grant-class event — for an already-matched user or a queued pending grant —
 * re-checks live status here before applying anything.
 *
 * `valid` is `false` whenever Whop authoritatively says so — including a 404,
 * which means the membership was deleted (`membership.deleted` doesn't leave a
 * fetchable record behind). It's `null` (not `false`) ONLY when the check
 * couldn't be completed at all — no membership id, or a transient network/5xx
 * error — so a temporary Whop API hiccup never itself revokes real access.
 * Callers must treat `false` as "definitely not valid — do not grant", and
 * `null` as "unknown — fall back to existing behavior", never the same thing.
 */
export async function fetchMembershipState(membershipId: string | undefined): Promise<{ valid: boolean | null; expiresAt: Date | null }> {
  if (!membershipId) return { valid: null, expiresAt: null };
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) {
    console.error("[whop-webhook] WHOP_API_KEY not set — cannot verify membership state");
    return { valid: null, expiresAt: null };
  }
  try {
    const m = await whopFetch(`/memberships/${encodeURIComponent(membershipId)}`);
    const expiresAt = parseWhopTimestamp((m?.expires_at ?? m?.current_period_end ?? null) as number | string | null);
    const status = typeof m?.status === "string" ? m.status : null;
    const valid = isWhopMembershipValid(status, expiresAt);
    return { valid, expiresAt };
  } catch (err) {
    if (err instanceof WhopApiError && err.status === 404) return { valid: false, expiresAt: null };
    console.error(`[whop-webhook] failed to fetch membership state for membership=${membershipId}:`, (err as Error).message);
    return { valid: null, expiresAt: null };
  }
}

/**
 * Idempotency guard shared by all webhook side-effects: INSERT … ON CONFLICT DO NOTHING
 * into whop_processed_events. Returns true the first time a given eventId is seen, false
 * on every retry/duplicate delivery of the same eventId. Callers should skip their
 * side-effect entirely when this returns false — critical for additive updates like
 * extending membership expiry, where re-applying the same delivery would double-count it.
 */
async function markProcessedOnce(eventId: string, eventType: string): Promise<boolean> {
  const guard = await db.execute(
    sql`
      INSERT INTO whop_processed_events (event_id, event_type, processed_at)
      VALUES (${eventId}, ${eventType}, NOW())
      ON CONFLICT (event_id) DO NOTHING
    `,
  );
  const rowCount = (guard as unknown as { rowCount?: number }).rowCount ?? 1;
  return rowCount !== 0;
}

async function incrementCounterFromWhop(
  todayDate: string,
  eventId: string,
  eventType: string,
): Promise<"incremented" | "duplicate" | "error"> {
  try {
    let incremented = false;
    await db.transaction(async (tx) => {
      // Idempotency guard: INSERT … ON CONFLICT DO NOTHING; rowCount=0 means duplicate
      const guard = await tx.execute(
        sql`
          INSERT INTO whop_processed_events (event_id, event_type, processed_at)
          VALUES (${eventId}, ${eventType}, NOW())
          ON CONFLICT (event_id) DO NOTHING
        `,
      );
      // Drizzle wraps the result; rowCount lives in the underlying pg result
      const rowCount = (guard as unknown as { rowCount?: number }).rowCount ?? 1;
      if (rowCount === 0) {
        // Already processed — skip counter update
        return;
      }

      // Upsert today's plan row: bump whopCount, totalIncrement, and appliedCount each by 1
      await tx.execute(
        sql`
          INSERT INTO counter_daily_plan (date, total_increment, scheduled_times, applied_count, whop_count, created_at, updated_at)
          VALUES (${todayDate}, 1, '[]', 1, 1, NOW(), NOW())
          ON CONFLICT (date) DO UPDATE
            SET total_increment = counter_daily_plan.total_increment + 1,
                applied_count   = counter_daily_plan.applied_count   + 1,
                whop_count      = counter_daily_plan.whop_count      + 1,
                updated_at      = NOW()
        `,
      );
      // Increment member_count_base (insert default if missing)
      await tx.execute(
        sql`
          INSERT INTO site_settings (key, value) VALUES ('member_count_base', '1248')
          ON CONFLICT (key) DO UPDATE
            SET value = (CAST(site_settings.value AS INTEGER) + 1)::TEXT
        `,
      );
      incremented = true;
    });

    if (incremented) {
      console.log(`[whop-webhook] Counter incremented for ${todayDate} (event=${eventId})`);
      return "incremented";
    } else {
      console.log(`[whop-webhook] Duplicate event skipped: ${eventId}`);
      return "duplicate";
    }
  } catch (err) {
    console.error("[whop-webhook] WARN: Failed to increment counter — tier was still granted:", err);
    return "error";
  }
}

// Verify Whop webhook signature using the official Svix library
function verifyWhopSignature(req: Request, rawBody: Buffer): boolean {
  const secret = process.env.WHOP_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[whop-webhook] WHOP_WEBHOOK_SECRET not set — rejecting");
    return false;
  }

  // Svix requires whsec_<base64>. Whop has issued ws_ secrets in two formats:
  // older dashboard secrets represent hex bytes, while its API test deliveries
  // sign with the literal ws_ string. Both forms are derived only from the
  // configured secret and remain fail-closed.
  const svixSecrets: string[] = [];
  if (secret.startsWith("whsec_")) {
    svixSecrets.push(secret);
  } else if (secret.startsWith("ws_")) {
    const hexPart = secret.slice(3); // strip "ws_"
    svixSecrets.push(`whsec_${Buffer.from(hexPart, "hex").toString("base64")}`);
    svixSecrets.push(`whsec_${Buffer.from(secret, "utf8").toString("base64")}`);
    svixSecrets.push(`whsec_${Buffer.from(hexPart, "utf8").toString("base64")}`);
  } else {
    svixSecrets.push(`whsec_${secret}`);
  }

  let verificationError: Error | undefined;
  for (const svixSecret of svixSecrets) {
    try {
      const wh = new Webhook(svixSecret);
      wh.verify(rawBody, {
        "webhook-id":        req.headers["webhook-id"] as string,
        "webhook-timestamp": req.headers["webhook-timestamp"] as string,
        "webhook-signature": req.headers["webhook-signature"] as string,
      });
      return true;
    } catch (err) {
      verificationError = err as Error;
    }
  }

  {
    const signature = req.headers["webhook-signature"];
    const signatureScheme = typeof signature === "string"
      ? signature.split(",")[0]?.trim().slice(0, 16) || "empty"
      : "missing";
    console.warn("[whop-webhook] Svix verification failed:", verificationError?.message, {
      rawBodyBytes: rawBody.length,
      webhookIdPresent: typeof req.headers["webhook-id"] === "string",
      timestampPresent: typeof req.headers["webhook-timestamp"] === "string",
      signatureScheme,
    });
    return false;
  }
}

/**
 * Applies (and clears) any Whop grants queued for this email because no local
 * account existed when the webhook fired (see the GRANT_EVENTS handler below).
 * Call right after a user registers or logs in.
 *
 * Each queued grant is re-verified against LIVE Whop status before being
 * applied — a queued grant can be arbitrarily old by the time someone finally
 * registers, and the membership may have been revoked/refunded/cancelled in
 * the meantime (independently of whether a revoke webhook happened to reach
 * this server and find/clear it). Grants with no stored membership id (older
 * rows, or genuinely undeterminable) are applied as-is, matching prior behavior.
 */
export async function reconcilePendingWhopGrants(userId: number, email: string): Promise<void> {
  const pending = await storage.getWhopPendingGrantsByEmail(email);
  if (pending.length === 0) return;

  // Pair each still-valid grant with its freshest known expiry — re-fetched from
  // Whop just now when a membership id is on file, so a membership renewed (or
  // whose period shifted) between the original webhook and this later
  // registration/login is applied with its CURRENT expiry, not a stale one
  // captured back when the grant was first queued.
  const stillValid: { grant: (typeof pending)[number]; expiresAt: Date | null }[] = [];
  for (const grant of pending) {
    if (!grant.membershipId) {
      if (grant.expiresAt) {
        stillValid.push({ grant, expiresAt: grant.expiresAt });
      } else {
        console.log(`[whop-pending-grant] discarding pending grant id=${grant.id} email=${email} — no safe expiry stored`);
      }
      continue;
    }
    const state = await fetchMembershipState(grant.membershipId);
    if (state.valid === false) {
      console.log(`[whop-pending-grant] discarding pending grant id=${grant.id} email=${email} — membership=${grant.membershipId} no longer valid per Whop`);
      continue;
    }
    // Keep queued access on the same Istanbul 00:01 boundary as direct grants.
    // Whop's period end may contain a later clock time on the same date.
    const refreshedExpiry = calendarExpiryFromProviderEnd(state.expiresAt);
    const effectiveExpiry = refreshedExpiry ?? grant.expiresAt;
    if (effectiveExpiry) {
      stillValid.push({ grant, expiresAt: effectiveExpiry });
    } else {
      console.log(`[whop-pending-grant] discarding pending grant id=${grant.id} email=${email} — no safe expiry available`);
    }
  }

  if (stillValid.length > 0) {
    // Multiple valid pending rows can exist (retries/duplicate deliveries, or a
    // renewal queued before a cancellation of the prior period); apply the most
    // recently created one — same "set, don't add" idempotency as the webhook.
    const latest = stillValid.reduce((a, b) => (a.grant.createdAt > b.grant.createdAt ? a : b));
    // applyWhopGrantToUser is guarded: WHERE tier_override=false — atomic no-op if admin locked.
    const applied = await storage.applyWhopGrantToUser(userId, latest.grant.tier, latest.expiresAt);
    if (applied) {
      console.log(`[whop-pending-grant] applied pending tier=${latest.grant.tier} to userId=${userId} (${email})`);
    } else {
      console.log(`[whop-pending-grant] skipping pending grant for userId=${userId} (${email}) — tier_override=true (atomic guard)`);
    }
  }

  await storage.deleteWhopPendingGrantsByIds(pending.map((g) => g.id));
}

/**
 * Backup for missed webhook deliveries. Whop's webhook delivery to this server has
 * been found to silently stop entirely for extended periods (confirmed by comparing
 * "no webhook log lines for weeks" against "the endpoint itself is reachable and
 * verifies signatures correctly") — a Whop-dashboard-side issue this app cannot fix
 * directly. Rather than depend solely on webhooks arriving, this periodically pulls
 * every currently-active membership straight from Whop's API and makes sure each one
 * is reflected locally, so a missed/undelivered grant self-heals within the polling
 * interval instead of requiring a support ticket and manual SQL.
 *
 * Deliberately GRANT-side only (never revokes): naturally expiring memberships are
 * already treated as inactive by getUserMemberTier's expiry-aware check regardless of
 * the raw stored tier, and revoking early (before natural expiry) risks undoing a
 * manual admin-granted tier that has no corresponding Whop membership at all. If a
 * revoke webhook is also missed, that gap remains — see task follow-ups.
 */
export async function reconcileAllActiveWhopMemberships(): Promise<{
  checked: number; corrected: number; queued: number; skipped: number; errors: number;
}> {
  const summary = { checked: 0, corrected: 0, queued: 0, skipped: 0, errors: 0 };
  if (!process.env.WHOP_API_KEY) {
    console.error("[whop-sync] WHOP_API_KEY not set — skipping periodic reconciliation");
    return summary;
  }

  let rows: Record<string, unknown>[] = [];
  try {
    rows = await listWhopMemberships(["active", "trialing", "past_due", "canceling", "expiring", "one_time", "canceled"]);
  } catch (err) {
    console.error("[whop-sync] failed to list active memberships:", (err as Error).message);
    summary.errors++;
    return summary;
  }

  for (const m of rows) {
    summary.checked++;
    try {
      const member = (m.member && typeof m.member === "object" ? m.member : {}) as Record<string, unknown>;
      const email = ((member.email ?? m.email) as string | undefined) ?? await getWhopMemberEmail((m.member_id ?? member.id) as string | undefined);
      const planId = (m.variant_id ?? m.plan_id ?? m.plan) as string | undefined;
      const membershipId = m.id as string | undefined;
      const checkoutConfigId = (m.checkout_configuration_id ?? m.checkout_session) as string | undefined;
      const tier = planId ? PLAN_TIER_MAP[planId] : undefined;
      if (!tier || (!email && !checkoutConfigId)) {
        summary.skipped++;
        continue;
      }
      const planMeta = planId ? ALL_WHOP_PLANS.find(p => p.id === planId) : undefined;
      const providerExpiry = parseWhopTimestamp((m.expires_at ?? m.current_period_end ?? null) as number | string | null);
      const expiresAt = localMembershipExpiry({
        valid: true,
        createdAt: m.created_at as number | string | null | undefined,
        providerExpiry,
        planDays: planMeta?.days,
      });
      const normalizedEmail = email ? email.toLowerCase().trim() : undefined;

      let dbUser: Awaited<ReturnType<typeof storage.getUserByEmail>> | undefined;
      if (checkoutConfigId) {
        const [mapping] = await db.select().from(whopCheckouts).where(eq(whopCheckouts.id, checkoutConfigId)).limit(1);
        if (mapping) dbUser = await storage.getUser(mapping.userId);
      }
      if (!dbUser && normalizedEmail) {
        dbUser = await storage.getUserByEmail(normalizedEmail);
      }

      if (dbUser) {
        const expiryDriftMs = expiresAt
          ? Math.abs((dbUser.membershipExpiresAt?.getTime() ?? 0) - expiresAt.getTime())
          : 0;
        const needsCorrection = dbUser.memberTier !== tier || (expiresAt !== null && expiryDriftMs > 60_000);
        if (needsCorrection) {
          // Never turn an active local account into an indefinite membership
          // merely because a valid Whop row omitted its period end.
          if (!expiresAt && !dbUser.membershipExpiresAt) {
            summary.skipped++;
            console.log(`[whop-sync] skipping userId=${dbUser.id} (${dbUser.email}) — no safe expiry available`);
            continue;
          }
          // Both writes are guarded (WHERE tier_override=false) — atomic no-op if admin locked.
          const tierApplied = await storage.applyWhopTierIfNotOverridden(dbUser.id, tier);
          if (tierApplied) {
            if (expiresAt) {
              await storage.applyWhopExpiryIfNotOverridden(dbUser.id, expiresAt);
            }
            summary.corrected++;
            console.log(`[whop-sync] corrected userId=${dbUser.id} (${dbUser.email}) → tier=${tier}, expiresAt=${expiresAt?.toISOString() ?? "null"} (membership=${membershipId})`);
          } else {
            summary.skipped++;
            console.log(`[whop-sync] skipping userId=${dbUser.id} (${dbUser.email}) — tier_override=true (atomic guard)`);
          }
        }
      } else if (normalizedEmail) {
        // No local account yet — queue it (once per membership id) so it applies
        // automatically at registration, same as the webhook's own unmatched path.
        const existing = await storage.getWhopPendingGrantsByEmail(normalizedEmail);
        if (!expiresAt) {
          summary.skipped++;
          console.log(`[whop-sync] skipping pending grant for email=${normalizedEmail} — no safe expiry available`);
        } else if (!existing.some((g) => g.membershipId === membershipId)) {
          await storage.createWhopPendingGrant(normalizedEmail, tier, expiresAt, membershipId ?? null);
          summary.queued++;
          console.log(`[whop-sync] queued pending grant for unregistered email=${normalizedEmail}, tier=${tier}, membership=${membershipId}`);
        }
      } else {
        summary.skipped++;
      }
    } catch (err) {
      summary.errors++;
      console.error("[whop-sync] error reconciling membership row:", (err as Error).message);
    }
  }

  if (summary.corrected > 0 || summary.queued > 0 || summary.errors > 0) {
    console.log(`[whop-sync] reconciliation summary: checked=${summary.checked} corrected=${summary.corrected} queued=${summary.queued} skipped=${summary.skipped} errors=${summary.errors}`);
  }
  return summary;
}

export function registerWhopRoutes(app: Express) {
  /* GET /api/whop/plans — return static plan catalog */
  app.get("/api/whop/plans", (_req, res) => {
    res.json(WHOP_PLANS);
  });

  /* POST /api/admin/whop/reconcile — manually trigger the periodic backup sync
   * (see reconcileAllActiveWhopMemberships) instead of waiting for the next
   * scheduled run. Useful for verifying it works and for on-demand recovery. */
  app.post("/api/admin/whop/reconcile", async (req, res) => {
    if (!(await assertAdmin(req, res))) return;
    try {
      const summary = await reconcileAllActiveWhopMemberships();
      return res.json({ ok: true, ...summary });
    } catch (err) {
      console.error("[whop-sync] manual reconcile trigger failed:", err);
      return res.status(500).json({ error: "Senkronizasyon başarısız oldu." });
    }
  });

  /* GET /api/admin/whop/members — real member list (Whop API + local DB fallback) */
  app.get("/api/admin/whop/members", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Giriş yapılmamış." });
    const adminUser = await storage.getUserById(req.session.userId);
    if (!adminUser?.isAdmin) return res.status(403).json({ error: "Admin yetkisi gerekli." });

    // ── 1. Try Whop API ───────────────────────────────────────────
    let whopActive: Record<string, unknown>[] = [];
    let whopCancelled: Record<string, unknown>[] = [];
    let whopWorked = false;

    try {
      whopActive = await listWhopMemberships(["active", "trialing", "past_due", "canceling", "expiring", "one_time", "canceled"]);
      whopCancelled = await listWhopMemberships(["completed", "canceled", "expired"]);
      whopWorked = true;
    } catch (err) {
      console.error("[whop-admin] membership list failed:", (err as Error).message);
      whopWorked = false;
    }

    // ── Helper: shape a Whop API membership row ───────────────────
    // NOTE on Whop's actual `/api/v2/memberships` row shape (verified against a live
    // payment): `user` is just a user-id string, not an object — email lives at the
    // top level as `m.email`. The plan id is under `m.plan`, not `m.plan_id`. And an
    // active (not-yet-expired) subscription's real expiry lives in `renewal_period_end`
    // — `expires_at` is null until the membership actually lapses/cancels. This mirrors
    // the fallback `fetchAuthoritativeExpiry` already uses for the webhook path.
    // Keep the local site-access tier alongside the provider membership. A user can
    // legitimately have more than one Whop membership, while the site still needs
    // one admin-controlled access tier.
    const localAccessRows = await db.select({
      email: users.email,
      memberTier: users.memberTier,
      membershipExpiresAt: users.membershipExpiresAt,
      tierOverride: users.tierOverride,
    }).from(users).where(isNotNull(users.memberTier));
    const localAccessByEmail = new Map(
      localAccessRows.map(row => [row.email.toLowerCase().trim(), row]),
    );

    async function shapeWhopRow(m: Record<string, unknown>, defaultStatus: "active" | "cancelled") {
      const user = (m.member && typeof m.member === "object" ? m.member : {}) as Record<string, unknown>;
      const memberId = (m.member_id ?? user.id) as string | undefined;
      const email = ((user.email ?? m.email ?? null) as string | null) ?? await getWhopMemberEmail(memberId) ?? null;
      const planId = (m.variant_id ?? m.plan_id ?? m.plan) as string | undefined;
      const planMeta = ALL_WHOP_PLANS.find(p => p.id === planId);
      const tier = planId ? PLAN_TIER_MAP[planId] : undefined;
      const cancelAtEnd = !!m.cancel_at_period_end || m.status === "canceling";
      const authoritativeExpiry = (m.expires_at ?? m.current_period_end ?? null) as number | string | null;
      const membershipValid = isWhopMembershipValid(String(m.status), parseWhopTimestamp(authoritativeExpiry));
      const localExpiry = localMembershipExpiry({
        valid: membershipValid,
        createdAt: m.created_at as number | string | null | undefined,
        providerExpiry: authoritativeExpiry,
        planDays: planMeta?.days,
      });
      const rawExpiry = localExpiry?.toISOString() ?? authoritativeExpiry;
      const expiresAtMs = whopTimestampToMs(rawExpiry);
      const localAccess = email ? localAccessByEmail.get(email.toLowerCase().trim()) : undefined;
      const siteExpiresAtMs = localAccess?.membershipExpiresAt?.getTime() ?? null;
      const status = getWhopRenewalStatus(
        isWhopMembershipValid(String(m.status), parseWhopTimestamp(authoritativeExpiry)),
        cancelAtEnd,
        defaultStatus,
      );
      return {
        id:              m.id as string ?? String(Math.random()),
        email:           email ?? "—",
        username:        (user.username as string | undefined) ?? (email ? email.split("@")[0] : "—"),
        planId:          planId ?? null,
        planLabel:       planMeta ? `${planMeta.tier === "elite" ? "Unlimited" : "Select"} ${planMeta.label}` : (planId ?? "Bilinmiyor"),
        tier:            tier === "unlimited" ? "Unlimited" : "Select",
        status,
        accessStatus:    getMembershipAccessStatus(expiresAtMs),
        cancelAtPeriodEnd: cancelAtEnd,
        expiresAt:       rawExpiry,
        daysLeft:        computeDaysLeft(expiresAtMs),
        siteTier:        localAccess?.memberTier === "unlimited" ? "unlimited" : localAccess?.memberTier === "select" ? "select" : null,
        siteAccessStatus: getMembershipAccessStatus(siteExpiresAtMs),
        siteExpiresAt:   siteExpiresAtMs !== null ? Math.floor(siteExpiresAtMs / 1000) : null,
        siteDaysLeft:    computeDaysLeft(siteExpiresAtMs),
        siteTierOverride: localAccess?.tierOverride ?? false,
        createdAt:       (m.created_at ?? null) as number | null,
      };
    }

    if (whopWorked) {
      const members   = await Promise.all(whopActive.map(m => shapeWhopRow(m, "active")));
      const cancelled = await Promise.all(whopCancelled.map(m => shapeWhopRow(m, "cancelled")));

      const byCounts: Record<string, number> = {};
      for (const m of members.filter(m => m.accessStatus === "active")) {
        byCounts[m.planLabel] = (byCounts[m.planLabel] ?? 0) + 1;
      }

      return res.json({
        members,
        cancelledMembers: cancelled,
        total:  members.filter(m => m.accessStatus === "active").length,
        byCounts,
        source: "whop",
      });
    }

    // ── 2. Fallback: local DB ─────────────────────────────────────
    const activeLocal = await db.select({
      id:                  users.id,
      email:               users.email,
      memberTier:          users.memberTier,
      membershipExpiresAt: users.membershipExpiresAt,
      tierOverride:        users.tierOverride,
      createdAt:           users.createdAt,
    }).from(users).where(isNotNull(users.memberTier));

    const members = activeLocal.map(u => {
      const expiresAtMs = u.membershipExpiresAt ? u.membershipExpiresAt.getTime() : null;
      return {
        id:              String(u.id),
        email:           u.email,
        username:        u.email.split("@")[0],
        planId:          null,
        planLabel:       u.memberTier === "unlimited" ? "Unlimited" : "Select",
        tier:            u.memberTier === "unlimited" ? "Unlimited" : "Select",
        status:          "active" as const,
        accessStatus:    getMembershipAccessStatus(expiresAtMs),
        cancelAtPeriodEnd: false,
        // Kept in the same unit (Unix seconds) as the Whop-sourced rows so the shared
        // frontend formatter/day-math works without branching on `source`.
        expiresAt:       expiresAtMs !== null ? Math.floor(expiresAtMs / 1000) : null,
        daysLeft:        computeDaysLeft(expiresAtMs),
        siteTier:        u.memberTier === "unlimited" ? "unlimited" : "select",
        siteAccessStatus: getMembershipAccessStatus(expiresAtMs),
        siteExpiresAt:   expiresAtMs !== null ? Math.floor(expiresAtMs / 1000) : null,
        siteDaysLeft:    computeDaysLeft(expiresAtMs),
        siteTierOverride: u.tierOverride,
        createdAt:       u.createdAt?.toISOString() ?? null,
      };
    });

    const byCounts: Record<string, number> = {};
    for (const m of members) {
      byCounts[m.planLabel] = (byCounts[m.planLabel] ?? 0) + 1;
    }

    return res.json({
      members,
      cancelledMembers: [],
      total:  members.length,
      byCounts,
      source: "local",
    });
  });

  /**
   * POST /api/admin/whop/members/adjust-days — extend or reduce one or more members'
   * local access window by a fixed number of days (positive = extend, negative = reduce).
   * When a member carries a real Whop membership id (only true for Whop-sourced rows —
   * see shapeWhopRow), a positive adjustment is also mirrored onto Whop via its official
   * "add free days" action, keeping the site and Whop's own record in sync. Whop has no
   * matching "remove days" action, so negative adjustments only ever change the local record.
   */
  app.post("/api/admin/whop/members/adjust-days", async (req, res) => {
    if (!(await assertAdmin(req, res))) return;

    const { members: targets, days } = req.body as {
      members?: { email?: string; whopMembershipId?: string | null }[];
      days?: number;
    };
    if (!Array.isArray(targets) || targets.length === 0) {
      return res.status(400).json({ error: "members array is required" });
    }
    if (typeof days !== "number" || !Number.isInteger(days) || days === 0) {
      return res.status(400).json({ error: "days must be a nonzero integer" });
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const results: Record<string, unknown>[] = [];

    for (const target of targets) {
      const email = target.email?.toLowerCase().trim();
      if (!email) {
        results.push({ email: target.email ?? null, ok: false, error: "E-posta eksik." });
        continue;
      }

      const dbUser = await storage.getUserByEmail(email);
      let ok = false;
      let newExpiresAt: string | null = null;
      let error: string | undefined;

      if (!dbUser) {
        error = "Yerel hesap bulunamadı (bu Whop üyesi siteye henüz kayıt olmamış).";
      } else if (!dbUser.memberTier) {
        error = "Bu kullanıcının atanmış bir üyelik paketi yok; önce Tier Yönetimi'nden paket atayın.";
      } else {
        const currentMs = dbUser.membershipExpiresAt ? new Date(dbUser.membershipExpiresAt).getTime() : null;
        let baseMs: number;
        if (days > 0) {
          // Extending: count from the later of "now" and the current expiry, so an
          // already-expired account starts its extension from today, not from the past.
          baseMs = currentMs !== null && currentMs > Date.now() ? currentMs : Date.now();
        } else {
          // Reducing: there must be an existing expiry to shorten.
          if (currentMs === null) {
            error = "Azaltılacak aktif bir süre yok.";
          }
          baseMs = currentMs ?? 0;
        }
        if (!error) {
          const updated = new Date(baseMs + days * msPerDay);
          await storage.setUserMembershipExpiry(dbUser.id, updated);
          ok = true;
          newExpiresAt = updated.toISOString();
        }
      }

      // Only ever touch Whop after the local update has actually succeeded — a failed
      // local adjustment (no account, no tier, nothing to reduce) must never still
      // mutate the member's real Whop subscription.
      let whopSynced: boolean | null = null;
      let whopError: string | undefined;
      if (ok && target.whopMembershipId) {
        if (days > 0) {
          const verified = await verifyWhopMembershipEmail(target.whopMembershipId, email);
          if (!verified.ok) {
            whopSynced = false;
            whopError = verified.error;
          } else {
            const r = await addFreeDaysToWhopMembership(target.whopMembershipId, days);
            whopSynced = r.ok;
            if (!r.ok) whopError = r.error;
          }
        } else {
          // By design: Whop's API has no "remove free days" action.
          whopSynced = false;
        }
      }

      results.push({
        email,
        ok,
        newExpiresAt,
        whopSynced,
        ...(error ? { error } : {}),
        ...(whopError ? { whopError } : {}),
      });
    }

    return res.json({ results });
  });

  /**
   * POST /api/admin/whop/members/cancel — revoke one or more members' local access
   * (clears memberTier + membershipExpiresAt), the same effect as the REVOKE webhook
   * path. This does not touch Whop billing/subscription state — cancelling a Whop
   * subscription itself must still be done from Whop, this only removes site access.
   */
  app.post("/api/admin/whop/members/cancel", async (req, res) => {
    if (!(await assertAdmin(req, res))) return;

    const { emails } = req.body as { emails?: string[] };
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "emails array is required" });
    }

    const results: Record<string, unknown>[] = [];
    for (const raw of emails) {
      const email = raw?.toLowerCase().trim();
      if (!email) {
        results.push({ email: raw ?? null, ok: false, error: "E-posta eksik." });
        continue;
      }
      const dbUser = await storage.getUserByEmail(email);
      if (!dbUser) {
        results.push({ email, ok: false, error: "Yerel hesap bulunamadı." });
        continue;
      }
      await storage.setUserMemberTier(dbUser.id, null);
      await storage.setUserMembershipExpiry(dbUser.id, null);
      results.push({ email, ok: true });
    }

    return res.json({ results });
  });

  // Pages that initiate checkout and know how to render the post-payment
  // verification banner. Any other/unknown value falls back to /plans.
  const ALLOWED_CHECKOUT_RETURN_PATHS = new Set(["/plans", "/instagram"]);

  /* POST /api/whop/checkout — create checkout config, return purchase_url (auth required) */
  app.post("/api/whop/checkout", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Önce giriş yapmalısınız." });
    }

    const { plan_id, return_to } = req.body as { plan_id?: string; return_to?: string };
    if (!plan_id) return res.status(400).json({ error: "plan_id gerekli." });

    const validPlan = WHOP_PLANS.find((p) => p.id === plan_id);
    if (!validPlan) return res.status(400).json({ error: "Geçersiz plan." });

    // Defense-in-depth: the client redirects to /terms before ever reaching this
    // endpoint, but the server never trusts that alone — a purchase must never
    // be created for a user without a recorded terms acceptance.
    const acceptedTerms = await hasAcceptedCurrentTerms(req.session.userId);
    if (!acceptedTerms) {
      return res.status(403).json({
        error: "Devam etmeden önce Kullanım, Üyelik ve Hizmet Şartları'nı kabul etmelisiniz.",
        code: "terms_required",
      });
    }

    const replitDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS;
    const baseUrl = replitDomain
      ? `https://${replitDomain}`
      : `https://${req.headers["x-forwarded-host"] || req.headers.host}`;

    const returnPath = return_to && ALLOWED_CHECKOUT_RETURN_PATHS.has(return_to) ? return_to : "/plans";

    try {
      const data = await whopFetch("/checkout_configurations", {
        method: "POST",
        headers: { "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({
          account_id: getWhopAccountId(),
          variant_id: plan_id,
          redirect_url: `${baseUrl}${returnPath}?success=true`,
          metadata: { betcapitale_user_id: String(req.session.userId), betcapitale_plan_id: plan_id },
        }),
      });

      if (!data.purchase_url || !data.id) {
        console.error("Whop checkout error:", data);
        return res.status(500).json({ error: "Ödeme linki oluşturulamadı." });
      }

      // Record who initiated this checkout so the webhook can resolve the exact
      // purchasing account by checkout id, not just by the email typed into
      // Whop's checkout screen (which can differ from the site account's email).
      try {
        await db.insert(whopCheckouts).values({
          id: data.id as string,
          userId: req.session.userId,
          planId: plan_id,
        });
      } catch (mapErr) {
        // Non-fatal — webhook still has the email fallback.
        console.error("[whop-checkout] failed to record checkout mapping:", mapErr);
      }

      return res.json({ purchase_url: data.purchase_url });
    } catch (err) {
      console.error("Whop checkout error:", err);
      return res.status(500).json({ error: "Ödeme servisi hatası." });
    }
  });

/* POST /api/whop/webhook — Whop membership event → auto-sync memberTier
   *
   * Events handled:
   *   GRANT:  membership.went_valid, membership.was_made_valid, membership.created,
   *           membership.activated, membership.was_renewed, payment.succeeded
   *   REVOKE: membership.went_invalid, membership.was_cancelled, membership.deleted,
   *           membership.expired, membership.cancelled, membership.was_refunded
   *
   * Signature verification: x-whop-signature: sha256=<hex>  (WHOP_WEBHOOK_SECRET required)
   *
   * Setup: In Whop dashboard → Webhooks → add endpoint URL:
   *   https://<your-domain>/api/whop/webhook
   *   Copy the generated secret → WHOP_WEBHOOK_SECRET env var
   */
  app.post("/api/whop/webhook", async (req: Request & { rawBody?: unknown }, res) => {
    // ── 1. Signature verification (fail-closed) ───────────────────
    const rawBody = req.rawBody instanceof Buffer
      ? req.rawBody
      : Buffer.from(JSON.stringify(req.body));

    // In development, skip signature verification to allow dashboard test events.
    // In production, always verify.
    const skipVerify = process.env.NODE_ENV !== "production" && process.env.WHOP_SKIP_SIG_VERIFY === "1";
    if (!skipVerify && !verifyWhopSignature(req, rawBody)) {
      console.warn("[whop-webhook] Signature verification failed");
      return res.status(401).json({ error: "Invalid signature" });
    }
    if (skipVerify) console.log("[whop-webhook] ⚠️  Signature verification skipped (dev mode)");

    // ── 2. Parse event ────────────────────────────────────────────
    // webhook-id (Svix) is the canonical idempotency key for this delivery
    const webhookId = (req.headers["webhook-id"] as string | undefined) ?? `fallback-${Date.now()}`;
    const payload = req.body as Record<string, unknown>;
    const event   = (payload.type ?? payload.action ?? payload.event) as string | undefined;
    const data    = (payload.data ?? payload.membership ?? payload) as Record<string, unknown>;
    console.log(`[whop-webhook] event=${event ?? "unknown"} id=${String(payload.id ?? webhookId)}`);
    const user = (data.user && typeof data.user === "object" ? data.user : {}) as Record<string, unknown>;
    const member = (data.member && typeof data.member === "object" ? data.member : {}) as Record<string, unknown>;
    const memberId = (data.member_id ?? member.id ?? (typeof data.user === "string" && data.user.startsWith("mber_") ? data.user : undefined)) as string | undefined;
    const linkedMembership = (data.membership && typeof data.membership === "object" ? data.membership : {}) as Record<string, unknown>;
    const membershipIdFromEvent = (data.membership_id ?? linkedMembership.id ?? (event?.startsWith("membership.") ? data.id : undefined)) as string | undefined;
    let email = (member.email ?? user.email_address ?? user.email ?? data.email ?? data.user_email) as string | undefined;
    if (!email && memberId) {
      try { email = await getWhopMemberEmail(memberId); }
      catch (err) { console.warn("[whop-webhook] member email lookup failed:", (err as Error).message); }
    }
    // Whop's live membership payload carries the plan reference as a bare plan-id
    // STRING under `data.plan` (not an object) — confirmed against live membership
    // data elsewhere in this module. `data.plan_id` and `data.plan.id` are also
    // accepted for any payload shapes that do use an object/alternate key.
    const rawPlan = data.plan;
    const planId = (
      data.variant_id ??
      linkedMembership.variant_id ??
      data.plan_id ??
      (typeof rawPlan === "string" ? rawPlan : (rawPlan as Record<string, unknown> | undefined)?.id)
    ) as string | undefined;

    // Whop membership objects carry back the checkout_configuration id that created
    // them as `checkout_session` (confirmed against live membership data). When present,
    // this resolves the *exact* local account that clicked "buy" — reliable even when
    // the buyer typed a different/misspelled email into Whop's own checkout screen.
    const checkoutConfigId = (data.checkout_configuration_id ?? data.checkout_session ?? data.checkout_config_id) as string | undefined;
    const metadata = (data.metadata && typeof data.metadata === "object" ? data.metadata : {}) as Record<string, unknown>;
    const metadataUserId = Number(metadata.betcapitale_user_id);

    if (!email && !checkoutConfigId && !(Number.isSafeInteger(metadataUserId) && metadataUserId > 0)) {
      console.log("[whop-webhook] No email or checkout id in payload — skipping");
      return res.json({ received: true, skipped: "no_email" });
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : undefined;

    // Looked up once and cached here so both resolveDbUser() and the planId fallback
    // below can reuse the same checkout mapping row without querying twice.
    let checkoutMapping: { userId: number; planId: string | null } | undefined;
    async function getCheckoutMapping() {
      if (checkoutMapping !== undefined) return checkoutMapping;
      if (!checkoutConfigId) return undefined;
      try {
        const [mapping] = await db.select().from(whopCheckouts).where(eq(whopCheckouts.id, checkoutConfigId)).limit(1);
        checkoutMapping = mapping;
        return mapping;
      } catch (mapErr) {
        console.error("[whop-webhook] checkout mapping lookup failed:", mapErr);
        return undefined;
      }
    }

    // The webhook's own plan reference is authoritative when present. Only when
    // it's missing entirely, fall back to the plan recorded at checkout-creation
    // time (server/whop-routes.ts's /api/whop/checkout persists it per-checkout) —
    // trusted because it's what our own server told Whop to charge for, not
    // anything client-suppliable.
    let resolvedPlanId = planId;
    if (!resolvedPlanId) {
      const mapping = await getCheckoutMapping();
      if (mapping?.planId) {
        resolvedPlanId = mapping.planId;
        console.log(`[whop-webhook] planId missing from webhook payload — using checkout mapping's planId=${resolvedPlanId}`);
      }
    }

    /** Resolves the local user this webhook event is about: checkout-id mapping first
     *  (exact, immune to email typos/mismatches), falling back to email lookup. */
    async function resolveDbUser() {
      const mapping = await getCheckoutMapping();
      if (mapping) {
        const byMapping = await storage.getUser(mapping.userId);
        if (byMapping) {
          console.log(`[whop-webhook] resolved user via checkout mapping id=${checkoutConfigId} → userId=${mapping.userId}`);
          return byMapping;
        }
      }
      if (Number.isSafeInteger(metadataUserId) && metadataUserId > 0) {
        const byMetadata = await storage.getUser(metadataUserId);
        if (byMetadata) return byMetadata;
      }
      if (normalizedEmail) return storage.getUserByEmail(normalizedEmail);
      return undefined;
    }

    // ── 4. Grant or revoke tier ───────────────────────────────────
    // membership.went_valid is the canonical "new valid membership" event
    const COUNTER_EVENTS = new Set([
      "membership.went_valid",  "membership_went_valid",
    ]);

    const GRANT_EVENTS = new Set([
      "membership.went_valid",  "membership_went_valid",
      "membership.activated",   "membership_activated",
      "membership.was_renewed", "membership_was_renewed",
      "payment.succeeded",      "payment_succeeded",
    ]);

    // Only genuine invalidation events revoke access. `cancel_at_period_end_changed` is
    // NOT here — it just toggles whether auto-renew is on, and can fire when a member
    // undoes a cancellation. The member keeps access through Whop's authoritative period
    // end either way; that end date is what setUserMembershipExpiry already tracks.
    const REVOKE_EVENTS = new Set([
      "membership.deactivated",   "membership_deactivated",
      "membership.went_invalid",  "membership_went_invalid",
      "membership.was_cancelled", "membership_was_cancelled",
      "membership.deleted",       "membership_deleted",
      "membership.expired",       "membership_expired",
      "membership.cancelled",     "membership_cancelled",
      "membership.was_refunded",  "membership_was_refunded",
    ]);

    const CANCEL_TOGGLE_EVENTS = new Set([
      "membership.cancel_at_period_end_changed", "membership_cancel_at_period_end_changed",
      "membership.updated",
    ]);

    if (CANCEL_TOGGLE_EVENTS.has(event ?? "")) {
      // Auto-renew was turned on/off (or a cancellation was undone). Access is unaffected;
      // just re-sync the authoritative expiry in case Whop's period end moved.
      const membershipId = membershipIdFromEvent;
      const dbUser = await resolveDbUser();
      const logEmail = dbUser?.email ?? normalizedEmail ?? "unknown";
      if (dbUser) {
        const state = await fetchMembershipState(membershipId);
        const planMeta = resolvedPlanId ? ALL_WHOP_PLANS.find((p) => p.id === resolvedPlanId) : undefined;
        const expiresAt = localMembershipExpiry({
          valid: state.valid,
          createdAt: data.created_at as number | string | null | undefined,
          providerExpiry: state.expiresAt,
          planDays: planMeta?.days,
        });
        if (expiresAt) {
          // Guarded write — atomic no-op if admin locked.
          const applied = await storage.applyWhopExpiryIfNotOverridden(dbUser.id, expiresAt);
          if (applied) {
            console.log(`[whop-webhook] CANCEL_TOGGLE ${logEmail} — synced local expiresAt=${expiresAt.toISOString()}, access unchanged`);
          } else {
            console.log(`[whop-webhook] CANCEL_TOGGLE ${logEmail} — tier_override=true, expiry sync skipped (atomic guard)`);
          }
        } else {
          console.log(`[whop-webhook] CANCEL_TOGGLE ${logEmail} — Whop expiry unavailable, access and expiry left unchanged`);
        }
      }
      return res.json({ received: true, action: "cancel_toggle", email: normalizedEmail ?? null });
    }

    if (GRANT_EVENTS.has(event ?? "")) {
      const tier = (resolvedPlanId ? PLAN_TIER_MAP[resolvedPlanId] : undefined) ?? "select";
      const membershipId = membershipIdFromEvent;
      const dbUser = await resolveDbUser();
      const logEmail = dbUser?.email ?? normalizedEmail ?? "unknown";

      // Webhooks can arrive out of order or be retried well after the fact (a
      // grant-class delivery re-sent, or delayed, after the membership was already
      // revoked/refunded/cancelled). Trusting the event TYPE alone would let a stale
      // grant re-activate access that Whop no longer considers valid. Check live
      // status first — `valid === false` is authoritative and short-circuits the
      // grant; `null` (no membership id, or a transient API error) falls through to
      // the existing behavior so a Whop API hiccup never itself blocks a real grant.
      const state = await fetchMembershipState(membershipId);
      if (state.valid === false) {
        console.log(`[whop-webhook] GRANT ${logEmail} — membership=${membershipId} is no longer valid per Whop (likely revoked/refunded after this event was queued) — skipping grant`);
        return res.json({ received: true, action: "grant_skipped_invalid", email: normalizedEmail ?? null });
      }

      const planMeta = resolvedPlanId ? ALL_WHOP_PLANS.find((p) => p.id === resolvedPlanId) : undefined;
      const localExpiry = localMembershipExpiry({
        valid: state.valid,
        createdAt: data.created_at as number | string | null | undefined,
        providerExpiry: state.expiresAt,
        planDays: planMeta?.days,
      });
      const currentExpiryMs = dbUser?.membershipExpiresAt ? new Date(dbUser.membershipExpiresAt).getTime() : 0;

      if (dbUser && !localExpiry && currentExpiryMs <= Date.now()) {
        console.log(`[whop-webhook] GRANT ${logEmail} — no safe expiry available, refusing indefinite access`);
        return res.json({ received: true, action: "grant_skipped_no_expiry", email: normalizedEmail ?? null });
      }

      if (dbUser) {
        // Guarded write — atomic no-op (returns false) if admin has locked this user's tier.
        const tierApplied = await storage.applyWhopTierIfNotOverridden(dbUser.id, tier);
        if (!tierApplied) {
          console.log(`[whop-webhook] GRANT ${logEmail} — tier_override=true, skipping automated grant (tier=${tier}, atomic guard)`);
          return res.json({ received: true, action: "grant_skipped_override", email: normalizedEmail ?? null });
        }

        // Tier was applied — proceed with expiry sync.

        // Expiry sync: prefer Whop's own authoritative expires_at/renewal_period_end for
        // this membership. Because we SET this value rather than extend it, applying it
        // repeatedly — across retries of the same webhook, or across the several distinct
        // event types Whop can fire for one purchase (went_valid, activated,
        // payment.succeeded, was_renewed) — always converges to the same correct date
        // instead of compounding a plan-length extension per event.
        if (localExpiry) {
          // Guarded write — atomic no-op if admin override was set between tier write and here.
          await storage.applyWhopExpiryIfNotOverridden(dbUser.id, localExpiry);
          console.log(`[whop-webhook] GRANT ${logEmail} → tier=${tier} (plan=${resolvedPlanId}), local expiresAt=${localExpiry.toISOString()} (membership=${membershipId})`);
        } else {
          // Whop's authoritative value isn't reachable (e.g. dev/test webhooks with no
          // real membership id, or a transient API error). Only fall back to a fresh
          // plan-length grant when there's no membership *currently active* on file —
          // i.e. never seen before, or its last known expiry has already elapsed. If a
          // previous event for this same purchase already recorded a future expiry, leave
          // it alone so a second event type (or a retry) can't double-count the period.
          const currentExpiryMs = dbUser.membershipExpiresAt ? new Date(dbUser.membershipExpiresAt).getTime() : 0;
          const isCurrentlyActive = currentExpiryMs > Date.now();
          if (!isCurrentlyActive && planMeta) {
            const newExpiresAt = calendarExpiryFromStart(
              data.created_at as number | string | null | undefined ?? Date.now(),
              planMeta.days,
            );
            if (!newExpiresAt) {
              await storage.applyWhopTierIfNotOverridden(dbUser.id, null);
              return res.json({ received: true, action: "grant_skipped_no_expiry", email: normalizedEmail ?? null });
            }
            // Guarded write — atomic no-op if admin override was set between tier write and here.
            await storage.applyWhopExpiryIfNotOverridden(dbUser.id, newExpiresAt);
            console.log(`[whop-webhook] GRANT ${logEmail} → tier=${tier} (plan=${resolvedPlanId}), expiresAt=${newExpiresAt.toISOString()} (fallback: Whop expiry unavailable, seeding from plan length; previous expiry was ${dbUser.membershipExpiresAt ? new Date(dbUser.membershipExpiresAt).toISOString() : "unset"})`);
          } else if (!isCurrentlyActive) {
            console.log(`[whop-webhook] GRANT ${logEmail} → tier=${tier} (plan=${resolvedPlanId}) — no matching plan and no Whop expiry available; expiry left unset`);
          } else {
            console.log(`[whop-webhook] GRANT ${logEmail} → tier=${tier} (plan=${resolvedPlanId}) — Whop expiry unavailable; leaving existing active expiry (${new Date(dbUser.membershipExpiresAt!).toISOString()}) unchanged to avoid double-counting`);
          }
        }
      } else if (normalizedEmail) {
        // Neither the checkout mapping nor the email matched a registered account yet.
        // Persist the grant — along with the membership id — so it isn't silently
        // lost, and so it can be re-verified against live Whop status (not just
        // trusted blindly) whenever this email registers or logs in later. See
        // reconcilePendingWhopGrants below.
        const fallbackExpiry = planMeta
          ? calendarExpiryFromStart(data.created_at as number | string | null | undefined ?? Date.now(), planMeta.days)
          : null;
        const pendingExpiry = localExpiry ?? fallbackExpiry;
        if (!pendingExpiry) {
          console.log(`[whop-webhook] GRANT — no local account for email=${normalizedEmail} and no safe expiry; not queueing indefinite access`);
          return res.json({ received: true, action: "grant_skipped_no_expiry", email: normalizedEmail });
        }
        await storage.createWhopPendingGrant(normalizedEmail, tier, pendingExpiry, membershipId ?? null);
        console.log(`[whop-webhook] GRANT — no local account for checkoutId=${checkoutConfigId ?? "n/a"} email=${normalizedEmail} — queued as pending grant, tier=${tier}, membership=${membershipId ?? "n/a"}`);
      } else {
        console.log(`[whop-webhook] GRANT — no local account and no email for checkoutId=${checkoutConfigId ?? "n/a"} — event dropped, nothing to reconcile against`);
      }

      // Increment member counter when a new valid membership arrives (idempotent)
      let counterResult: "incremented" | "duplicate" | "error" | undefined;
      if (COUNTER_EVENTS.has(event ?? "")) {
        const todayDate = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
        counterResult = await incrementCounterFromWhop(todayDate, webhookId, event ?? "unknown");
        if (counterResult === "error") {
          console.error(`[whop-webhook] counter_increment_failed event=${event} webhookId=${webhookId} email=${logEmail}`);
        }
      }

      return res.json({
        received: true,
        action: "grant",
        email: normalizedEmail ?? null,
        tier,
        ...(counterResult !== undefined ? { counterResult } : {}),
      });
    }

    if (REVOKE_EVENTS.has(event ?? "")) {
      const dbUser = await resolveDbUser();
      const logEmail = dbUser?.email ?? normalizedEmail ?? "unknown";
      if (dbUser) {
        // Both writes are guarded (WHERE tier_override=false) — atomic no-op if admin locked.
        const tierApplied = await storage.applyWhopTierIfNotOverridden(dbUser.id, null);
        if (tierApplied) {
          await storage.applyWhopExpiryIfNotOverridden(dbUser.id, null);
          console.log(`[whop-webhook] REVOKE ${logEmail} → tier=null`);
        } else {
          console.log(`[whop-webhook] REVOKE ${logEmail} — tier_override=true, skipping automated revoke (atomic guard)`);
        }
      }
      // Also discard any still-queued pending grant for this email — otherwise a
      // grant that arrived (or arrives later, out of order) for an account that
      // doesn't exist yet would get applied on registration despite the
      // membership having since been revoked/refunded/cancelled.
      if (normalizedEmail) {
        const discarded = await storage.deleteWhopPendingGrantsByEmail(normalizedEmail);
        if (discarded > 0) {
          console.log(`[whop-webhook] REVOKE ${logEmail} — discarded ${discarded} queued pending grant(s)`);
        }
      }
      return res.json({ received: true, action: "revoke", email: normalizedEmail ?? null });
    }

    console.log(`[whop-webhook] Unhandled event: ${event}`);
    return res.json({ received: true, skipped: "unhandled_event", event });
  });
}
