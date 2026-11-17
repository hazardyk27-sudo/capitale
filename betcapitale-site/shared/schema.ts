import { pgTable, text, varchar, real, date, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
  // Dedicated password-reset token — separate from email-verification token
  resetToken: text("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  memberTier: text("member_tier"),
  membershipExpiresAt: timestamp("membership_expires_at", { withTimezone: true }),
  // When true, Whop webhook grant/revoke and reconciliation leave this user's
  // tier untouched. Set by the admin set-tier endpoint; cleared when tier is
  // set to null (i.e. membership removed) so Whop automation re-engages.
  tierOverride: boolean("tier_override").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
});

// Correlates a Whop checkout_configuration id (returned when we create the
// checkout on /api/whop/checkout) to the local user who initiated it. The
// webhook handler uses this to resolve the exact purchasing user even when
// the email typed into Whop's checkout screen doesn't match the account's
// registered email — closing the "paid but membership never activated" gap.
export const whopCheckouts = pgTable("whop_checkouts", {
  id: text("id").primaryKey(), // Whop checkout_configuration id, e.g. "ch_xxx"
  userId: integer("user_id").notNull(),
  planId: text("plan_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// A Whop grant event whose email didn't match any registered local account at
// delivery time (e.g. the buyer hasn't finished registering, or typed a
// different email into Whop's checkout than their site account). Applied
// automatically the next time a matching email registers or logs in, instead
// of being silently dropped.
export const whopPendingGrants = pgTable("whop_pending_grants", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  tier: text("tier").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  // Whop membership id, when known — lets reconciliation re-verify live status
  // against Whop before applying an old queued grant (see reconcilePendingWhopGrants).
  membershipId: text("membership_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const profitEntries = pgTable("profit_entries", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  value: real("value").notNull(),
});

export const insertProfitEntrySchema = createInsertSchema(profitEntries).omit({
  id: true,
});

export type InsertProfitEntry = z.infer<typeof insertProfitEntrySchema>;
export type ProfitEntry = typeof profitEntries.$inferSelect;

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  result: text("result").notNull(),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
});

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Coupons
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  betId: text("bet_id").notNull().unique(),
  betType: text("bet_type").notNull().default("Accumulator"),
  placedAt: text("placed_at").notNull(),
  stake: real("stake").notNull().default(1),
  totalOdds: real("total_odds").notNull().default(1),
  potentialReturn: real("potential_return").notNull().default(1),
  actualReturn: real("actual_return"),
  status: text("status").notNull().default("Open"),
  settlementDate: text("settlement_date"),
  analysisScore: real("analysis_score"),
  riskLevel: text("risk_level"),
  notes: text("notes"),
});

export const insertCouponSchema = createInsertSchema(coupons).omit({ id: true });
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

// Coupon Selections
export const couponSelections = pgTable("coupon_selections", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").notNull(),
  selectionName: text("selection_name").notNull(),
  market: text("market").notNull(),
  matchName: text("match_name").notNull(),
  league: text("league").notNull(),
  kickoffTime: text("kickoff_time").notNull(),
  odds: real("odds").notNull(),
  result: text("result").notNull().default("pending"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertCouponSelectionSchema = createInsertSchema(couponSelections).omit({ id: true });
export type InsertCouponSelection = z.infer<typeof insertCouponSelectionSchema>;
export type CouponSelection = typeof couponSelections.$inferSelect;

export type CouponWithSelections = Coupon & { selections: CouponSelection[] };

// ── History tables for /gecmis page ──────────────────────────────────────────

export const fixtures = pgTable("fixtures", {
  id: serial("id").primaryKey(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  competition: text("competition").notNull(),
  kickoffAt: text("kickoff_at").notNull(),
});

export const insertFixtureSchema = createInsertSchema(fixtures).omit({ id: true });
export type InsertFixture = z.infer<typeof insertFixtureSchema>;
export type Fixture = typeof fixtures.$inferSelect;

export const historyCoupons = pgTable("history_coupons", {
  id: serial("id").primaryKey(),
  couponDate: date("coupon_date").notNull(),
  reference: text("reference").notNull(),
  label: text("label").notNull(),
  stake: real("stake").notNull(),
  totalOdds: real("total_odds").notNull(),
  potentialReturn: real("potential_return").notNull(),
  returnAmount: real("return_amount"),
  netResult: real("net_result"),
  status: text("status").notNull().default("open"),
  result: text("result"),
  preMatchImage: text("pre_match_image"),
  settledImage: text("settled_image"),
  publishedAt: text("published_at").notNull(),
  firstKickoffAt: text("first_kickoff_at").notNull(),
  settledAt: text("settled_at"),
});

export const insertHistoryCouponSchema = createInsertSchema(historyCoupons).omit({ id: true });
export type InsertHistoryCoupon = z.infer<typeof insertHistoryCouponSchema>;
export type HistoryCoupon = typeof historyCoupons.$inferSelect;

export const historyCouponLegs = pgTable("history_coupon_legs", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").notNull().references(() => historyCoupons.id, { onDelete: "cascade" }),
  fixtureId: integer("fixture_id").notNull().references(() => fixtures.id),
  selection: text("selection").notNull(),
  market: text("market").notNull(),
  odds: real("odds").notNull(),
  result: text("result").notNull(),
});

export const insertHistoryCouponLegSchema = createInsertSchema(historyCouponLegs).omit({ id: true });
export type InsertHistoryCouponLeg = z.infer<typeof insertHistoryCouponLegSchema>;
export type HistoryCouponLeg = typeof historyCouponLegs.$inferSelect;

export type HistoryCouponWithLegs = HistoryCoupon & {
  legs: (HistoryCouponLeg & { fixture: Fixture })[];
};

// ── Bugün ("Today") tables ────────────────────────────────────────────────────

export const todayMatches = pgTable("today_matches", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  competition: text("competition").notNull(),
  kickoffAt: text("kickoff_at").notNull(),
  result: text("result"),
});

export const insertTodayMatchSchema = createInsertSchema(todayMatches).omit({ id: true });
export type InsertTodayMatch = z.infer<typeof insertTodayMatchSchema>;
export type TodayMatch = typeof todayMatches.$inferSelect;

export const todayCoupons = pgTable("today_coupons", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  reference: text("reference").notNull(),
  label: text("label").notNull(),
  matchCount: integer("match_count").notNull().default(1),
  stake: real("stake").notNull(),
  totalOdds: real("total_odds").notNull(),
  firstKickoffAt: text("first_kickoff_at").notNull(),
  preMatchImage: text("pre_match_image"),
  settledImage: text("settled_image"),
  status: text("status").notNull().default("PRE_MATCH"),
  result: text("result"),
  returnAmount: real("return_amount"),
  matchNames: text("match_names"), // JSON string of string[]
});

export const insertTodayCouponSchema = createInsertSchema(todayCoupons).omit({ id: true });
export type InsertTodayCoupon = z.infer<typeof insertTodayCouponSchema>;
export type TodayCoupon = typeof todayCoupons.$inferSelect;

export const todayPublicPick = pgTable("today_public_pick", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  competition: text("competition").notNull().default(""),
  market: text("market").notNull(),
  selection: text("selection").notNull(),
  odds: real("odds").notNull(),
  kickoffAt: text("kickoff_at").notNull(),
  status: text("status").notNull().default("PRE_MATCH"),
  result: text("result"),
});

export const insertTodayPublicPickSchema = createInsertSchema(todayPublicPick).omit({ id: true });
export type InsertTodayPublicPick = z.infer<typeof insertTodayPublicPickSchema>;
export type TodayPublicPick = typeof todayPublicPick.$inferSelect;

export const todayPublished = pgTable("today_published", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

export const insertTodayPublishedSchema = createInsertSchema(todayPublished).omit({ id: true });
export type InsertTodayPublished = z.infer<typeof insertTodayPublishedSchema>;
export type TodayPublished = typeof todayPublished.$inferSelect;

// ── Membership publication tables ─────────────────────────────────────────────

export const membershipPublications = pgTable("membership_publications", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  tier: text("tier").notNull(),           // "select" | "unlimited"
  target: text("target").notNull().default("members_only"), // "members_only" | "profile"
  title: text("title").notNull(),
  analysis: text("analysis"),
  // Publication lifecycle (controls member visibility)
  pubStatus: text("pub_status").notNull().default("draft"),  // draft | scheduled | published | unpublished
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  // Match lifecycle
  status: text("status").notNull().default("PRE_MATCH"),     // PRE_MATCH | SETTLED
  result: text("result"),                // WON | LOST | VOID | null
  // Scheduling metadata
  firstKickoffAt: text("first_kickoff_at"),
  matchCount: integer("match_count"),
  // Notes / revision history
  note: text("note"),
  revisionNote: text("revision_note"),
  revisionAt: timestamp("revision_at", { withTimezone: true }),
  // Summary metrics (from coupon import or manual)
  couponRef: text("coupon_ref"),
  stake: real("stake"),
  totalOdds: real("total_odds"),
  potentialReturn: real("potential_return"),
  // Coupon images (base64 data URLs or external URLs)
  preMatchImage: text("pre_match_image"),
  settledImage: text("settled_image"),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMembershipPublicationSchema = createInsertSchema(membershipPublications).omit({ id: true, createdAt: true });
export type InsertMembershipPublication = z.infer<typeof insertMembershipPublicationSchema>;
export type MembershipPublication = typeof membershipPublications.$inferSelect;

export const membershipPubLegs = pgTable("membership_pub_legs", {
  id: serial("id").primaryKey(),
  publicationId: integer("publication_id").notNull().references(() => membershipPublications.id, { onDelete: "cascade" }),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  competition: text("competition").notNull().default(""),
  kickoffAt: text("kickoff_at").notNull(),
  market: text("market").notNull(),
  selection: text("selection").notNull(),
  odds: real("odds").notNull(),
  result: text("result"),               // won | lost | void | null
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertMembershipPubLegSchema = createInsertSchema(membershipPubLegs).omit({ id: true });
export type InsertMembershipPubLeg = z.infer<typeof insertMembershipPubLegSchema>;
export type MembershipPubLeg = typeof membershipPubLegs.$inferSelect;

export type MembershipPublicationWithLegs = MembershipPublication & {
  legs: MembershipPubLeg[];
};

// ── Counter daily plan (autonomous member counter) ────────────────────────────

export const counterDailyPlan = pgTable("counter_daily_plan", {
  date:           text("date").primaryKey(),           // YYYY-MM-DD (Istanbul time)
  totalIncrement: integer("total_increment").notNull().default(0),
  scheduledTimes: text("scheduled_times").notNull().default("[]"), // JSON ["HH:MM", ...]
  appliedCount:   integer("applied_count").notNull().default(0),
  whopCount:      integer("whop_count").notNull().default(0),      // auto-incremented by Whop webhooks
  createdAt:      timestamp("created_at",  { withTimezone: true }).notNull().defaultNow(),
  updatedAt:      timestamp("updated_at",  { withTimezone: true }).notNull().defaultNow(),
});

export type CounterDailyPlan = typeof counterDailyPlan.$inferSelect;

// ── Site-wide settings (key-value store) ─────────────────────────────────────

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings);
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

// ── Membership daily summary (admin-managed, per date+tier) ───────────────────

export const membershipDailySummaries = pgTable("membership_daily_summaries", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  tier: text("tier").notNull(),           // "select" | "unlimited"
  title: text("title"),
  totalCoupons: integer("total_coupons").notNull().default(0),
  totalMatches: integer("total_matches").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [{ name: "membership_daily_summaries_date_tier_unique", columns: [t.date, t.tier], unique: true }]);

export const insertMembershipDailySummarySchema = createInsertSchema(membershipDailySummaries).omit({ id: true });
export type InsertMembershipDailySummary = z.infer<typeof insertMembershipDailySummarySchema>;
export type MembershipDailySummary = typeof membershipDailySummaries.$inferSelect;

// ── Terms & Conditions acceptance log ─────────────────────────────────────────
// Append-only: a row is written every time a user accepts a terms version. Rows
// are never updated or deleted — accepting a new version adds a new row rather
// than overwriting the previous acceptance, so full history is always available
// as delivery/consent evidence (e.g. for payment/chargeback disputes).

export const termsAcceptances = pgTable("terms_acceptances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  termsVersion: text("terms_version").notNull(),
  termsEffectiveDate: text("terms_effective_date").notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }).notNull().defaultNow(),
  orderId: text("order_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const insertTermsAcceptanceSchema = createInsertSchema(termsAcceptances).omit({ id: true, acceptedAt: true });
export type InsertTermsAcceptance = z.infer<typeof insertTermsAcceptanceSchema>;
export type TermsAcceptance = typeof termsAcceptances.$inferSelect;

// ── Meta → Telegram ad redirect tracker ──────────────────────────────────────
// Append-only. Experiment event types:
//   REQUEST_SEEN             — initial /go/:slug hit (bot or browser-like)
//   CONFIRMED_BROWSER_REDIRECT — legacy browser confirm before the experiment
//   PAGE_CONFIRMED           — JS-confirmed page visit (bot filter passed)
//   CHALLENGE_SHOWN          — press-and-hold challenge became visible
//   HUMAN_CHALLENGE_PASSED   — visitor completed 2-second press-and-hold
//   TELEGRAM_BUTTON_CLICK    — visitor manually clicked OPEN TELEGRAM
// Raw IPs are never stored; hashedIp is SHA-256(rawIp + userAgent).

export const adRedirectEvents = pgTable("ad_redirect_events", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  // mobile | desktop | tablet | unknown
  deviceCategory: text("device_category").notNull().default("unknown"),
  // REQUEST_SEEN | CONFIRMED_BROWSER_REDIRECT
  eventType: text("event_type").notNull().default("REQUEST_SEEN"),
  // KNOWN_BOT_OR_PREFETCH | BROWSER_LIKE_REQUEST | CONFIRMED_BROWSER_REDIRECT
  classification: text("classification").notNull().default("BROWSER_LIKE_REQUEST"),
  // for CONFIRMED events: references the REQUEST_SEEN parent row
  parentEventId: integer("parent_event_id"),
  // SHA-256(ip + userAgent) — used for unique-visitor estimation; not reversible
  hashedIp: text("hashed_ip"),
  // Manual experiment visits use ?qa=1 and are excluded from normal totals.
  isQa: boolean("is_qa").notNull().default(false),
});

export const insertAdRedirectEventSchema = createInsertSchema(adRedirectEvents).omit({ id: true, createdAt: true });
export type InsertAdRedirectEvent = z.infer<typeof insertAdRedirectEventSchema>;
export type AdRedirectEvent = typeof adRedirectEvents.$inferSelect;

// ── Promotion page analytics ─────────────────────────────────────────────────
// One row per browser session. Raw IPs are never stored; hashedVisitorId is
// derived from the request IP and user agent for anonymous unique estimates.
export const promotionSessions = pgTable("promotion_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  didScroll: boolean("did_scroll").notNull().default(false),
  maxScrollPercent: integer("max_scroll_percent").notNull().default(0),
  deviceCategory: text("device_category").notNull().default("unknown"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  hashedVisitorId: text("hashed_visitor_id"),
  source: text("source").notNull().default("direct"),
  browserConfirmed: boolean("browser_confirmed").notNull().default(false),
  visibleSeconds: integer("visible_seconds").notNull().default(0),
  trustedInteraction: boolean("trusted_interaction").notNull().default(false),
  trustedInteractionCount: integer("trusted_interaction_count").notNull().default(0),
  trustedScroll: boolean("trusted_scroll").notNull().default(false),
  knownBotUa: boolean("known_bot_ua").notNull().default(false),
  humanScore: integer("human_score").notNull().default(0),
  classification: text("classification").notNull().default("SUSPICIOUS"),
  country: text("country"),
  city: text("city"),
  cta: text("cta"),
  isQa: boolean("is_qa").notNull().default(false),
});

export const insertPromotionSessionSchema = createInsertSchema(promotionSessions).omit({
  id: true,
  createdAt: true,
  lastSeenAt: true,
});
export type InsertPromotionSession = z.infer<typeof insertPromotionSessionSchema>;
export type PromotionSession = typeof promotionSessions.$inferSelect;

// ── One-time confirmation tokens ─────────────────────────────────────────────
// Created at /go/:slug time; consumed once at /go-confirm/:token.
// Prevents bots that don't execute JS from ever producing a confirmed event.

export const adRedirectTokens = pgTable("ad_redirect_tokens", {
  token: text("token").primaryKey(),          // base64url HMAC-signed payload
  slug: text("slug").notNull(),
  parentEventId: integer("parent_event_id").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  isQa: boolean("is_qa").notNull().default(false),
  pageConfirmedEventId: integer("page_confirmed_event_id"),
  // Legacy — kept for old rows; new sessions use challengeShownAt instead
  twoSecondRecordedAt: timestamp("two_second_recorded_at", { withTimezone: true }),
  // Human challenge (press-and-hold experiment)
  challengeShownAt: timestamp("challenge_shown_at", { withTimezone: true }),
  // Set on the first pointerdown on the hold button; /go-challenge/verify
  // requires this AND that ≥1.5 s have elapsed — measuring from hold-start,
  // not from page-show, so a direct HTTP caller cannot fake the hold duration
  // by only sending CHALLENGE_SHOWN.
  challengeHoldStartAt: timestamp("challenge_hold_start_at", { withTimezone: true }),
  challengePassedAt: timestamp("challenge_passed_at", { withTimezone: true }),
  // SHA-256 of the challenge token nonce — atomically set to NULL on first
  // /go-telegram/ use so the challenge token is truly single-use.
  challengeTokenHash: text("challenge_token_hash"),
  telegramClickRecordedAt: timestamp("telegram_click_recorded_at", { withTimezone: true }),
});

export type AdRedirectToken = typeof adRedirectTokens.$inferSelect;
