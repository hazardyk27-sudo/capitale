import type { Express } from "express";
import { registerAgentReportRoutes } from "./agent-report-routes";
import { createServer, type Server } from "http";
import { createHash } from "crypto";
import { storage } from "./storage";
import { registerAuthRoutes, resendVerificationEmail } from "./auth";
import { registerWhopRoutes } from "./whop-routes";
import { registerTermsRoutes } from "./terms-routes";
import { registerGoRoutes, AD_SLUG_MAP } from "./go-routes";
import {
  getPromotionResetTodayRange,
  isPromotionResetTarget,
} from "./promotion-tracker-utils";
import {
  insertProfitEntrySchema,
  insertMatchSchema,
  insertCouponSchema,
  insertCouponSelectionSchema,
  insertFixtureSchema,
  insertHistoryCouponSchema,
  insertHistoryCouponLegSchema,
  insertTodayMatchSchema,
  insertTodayCouponSchema,
  insertTodayPublicPickSchema,
  insertMembershipPublicationSchema,
  insertMembershipPubLegSchema,
  type TodayPublicPick,
  counterDailyPlan,
  users,
  adRedirectEvents,
  promotionSessions,
  siteSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, gte, and, sql, lte as lteOp, desc as descOp } from "drizzle-orm";

// ── Counter helpers ──────────────────────────────────────────────────────────
function todayIstanbul(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
}
function nowHHMM_Istanbul(): string {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
  });
}
// Apply pending counter increments for a given date.
// For today: only applies times <= nowTime.
// For past dates: treats all scheduled times as passed.
// For future dates: no-op.
// Returns the number of newly applied increments (0 on no-op or error).
async function applyPendingForDate(date: string, nowTime: string): Promise<number> {
  const today = todayIstanbul();
  if (date > today) return 0; // never pre-apply future plans
  try {
    let applied = 0;
    await db.transaction(async (tx) => {
      const [planRow] = await tx.select().from(counterDailyPlan)
        .where(eq(counterDailyPlan.date, date));
      if (!planRow) return;
      const scheduled: string[] = JSON.parse(planRow.scheduledTimes);
      // Past dates: all times have passed; today: only times <= nowTime
      const passedCount = date < today
        ? scheduled.length
        : scheduled.filter(t => t <= nowTime).length;
      const toApply = passedCount - planRow.appliedCount;
      if (toApply <= 0) return;
      // CAS update
      const updated = await tx.update(counterDailyPlan)
        .set({ appliedCount: passedCount, updatedAt: new Date() })
        .where(and(
          eq(counterDailyPlan.date, date),
          eq(counterDailyPlan.appliedCount, planRow.appliedCount),
        ))
        .returning({ appliedCount: counterDailyPlan.appliedCount });
      if (updated.length === 0) return;
      await tx.execute(
        sql`UPDATE site_settings SET value = (CAST(value AS INTEGER) + ${toApply})::TEXT WHERE key = 'member_count_base'`,
      );
      applied = toApply;
    });
    return applied;
  } catch { return 0; }
}
function generateRandomTimes(count: number): string[] {
  if (count <= 0) return [];
  const times = new Set<string>();
  while (times.size < count) {
    // 08:00 to 22:59
    const totalMinutes = 8 * 60 + Math.floor(Math.random() * (15 * 60));
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const mm = String(totalMinutes % 60).padStart(2, "0");
    times.add(`${hh}:${mm}`);
  }
  return Array.from(times).sort();
}

function mapPickToFreeBet(pick: TodayPublicPick, publishedAt?: Date | null) {
  let result: "won" | "lost" | "void" | "pending";
  if (pick.status === "PRE_MATCH") {
    result = "pending";
  } else if (pick.result === "WON") {
    result = "won";
  } else if (pick.result === "LOST") {
    result = "lost";
  } else {
    result = "void";
  }

  const kickoffFull = pick.kickoffAt.includes("T")
    ? pick.kickoffAt
    : `${pick.date}T${pick.kickoffAt}:00+03:00`;

  const pubAt = publishedAt
    ? publishedAt.toISOString()
    : `${pick.date}T09:00:00+03:00`;

  return {
    id: String(pick.id),
    date: pick.date,
    publishedAt: pubAt,
    kickoffAt: kickoffFull,
    league: pick.competition,
    homeTeam: pick.homeTeam.trim(),
    awayTeam: pick.awayTeam.trim(),
    market: pick.market.trim(),
    selection: pick.selection.trim(),
    publishedOdds: pick.odds,
    result,
    analysis: [] as string[],
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  registerAuthRoutes(app);
  registerWhopRoutes(app);
  registerTermsRoutes(app);
  registerGoRoutes(app);

  app.get("/api/entries", async (_req, res) => {
    const entries = await storage.getAllEntries();
    res.json(entries);
  });

  app.post("/api/entries", async (req, res) => {
    const parsed = insertProfitEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }
    const entry = await storage.createEntry(parsed.data);
    res.status(201).json(entry);
  });

  app.delete("/api/entries/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    await storage.deleteEntry(id);
    res.status(204).send();
  });

  app.get("/api/matches", async (_req, res) => {
    const allMatches = await storage.getAllMatches();
    res.json(allMatches);
  });

  app.post("/api/matches", async (req, res) => {
    const parsed = insertMatchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }
    const validResults = ["won", "lost", "postponed"];
    if (!validResults.includes(parsed.data.result)) {
      return res.status(400).json({ error: "Invalid result. Must be won, lost, or postponed." });
    }
    const match = await storage.createMatch(parsed.data);
    res.status(201).json(match);
  });

  app.delete("/api/matches/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    await storage.deleteMatch(id);
    res.status(204).send();
  });

  // Coupon routes — totalOdds and potentialReturn are always computed server-side
  app.get("/api/coupons", async (_req, res) => {
    const all = await storage.getAllCoupons();
    res.json(all);
  });

  app.get("/api/coupons/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const coupon = await storage.getCoupon(id);
    if (!coupon) return res.status(404).json({ error: "Not found" });
    res.json(coupon);
  });

  app.post("/api/coupons", async (req, res) => {
    // Strip client-sent aggregates — they will be computed server-side after selections are saved
    const { totalOdds: _to, potentialReturn: _pr, ...rest } = req.body;
    const parsed = insertCouponSchema.omit({ totalOdds: true, potentialReturn: true }).safeParse(rest);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    // Create with placeholder aggregates (1 each); will be recalculated below
    const coupon = await storage.createCoupon({
      ...parsed.data,
      totalOdds: 1,
      potentialReturn: parsed.data.stake ?? 1,
    });
    res.status(201).json(coupon);
  });

  app.put("/api/coupons/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const { totalOdds: _to, potentialReturn: _pr, ...rest } = req.body;
    const parsed = insertCouponSchema.omit({ totalOdds: true, potentialReturn: true }).partial().safeParse(rest);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    await storage.updateCoupon(id, parsed.data);
    // Recalculate aggregates from current selections and new stake
    const updated = await storage.recalculateCouponFinancials(id);
    res.json(updated);
  });

  app.delete("/api/coupons/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    await storage.deleteCoupon(id);
    res.status(204).send();
  });

  // Selection routes — each mutation triggers coupon recalculation
  app.get("/api/coupons/:couponId/selections", async (req, res) => {
    const couponId = parseInt(req.params.couponId);
    if (isNaN(couponId)) return res.status(400).json({ error: "Invalid id" });
    const sels = await storage.getSelectionsForCoupon(couponId);
    res.json(sels);
  });

  // ── Helper: parse "DD Mon YYYY" → "YYYY-MM-DD" reliably ─────────────────────
  const FMT_MONTHS: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };
  function parseFmtDate(s: string): string {
    const parts = s.trim().split(" ");
    if (parts.length === 3 && FMT_MONTHS[parts[1]]) {
      const [d, m, y] = parts;
      return `${y}-${FMT_MONTHS[m]}-${d.padStart(2, "0")}`;
    }
    return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
  }

  // ── Helper: sync a selection's match into today_matches (best-effort) ────────
  async function autoSyncTodayMatch(couponId: number, sel: { matchName?: string | null; league?: string | null; kickoffTime?: string | null }) {
    try {
      const coupon = await storage.getCoupon(couponId);
      if (!coupon) return;
      // placedAt format: "23 Jul 2026, 15:30"
      const datePart = coupon.placedAt.split(",")[0].trim();
      const matchDate = parseFmtDate(datePart);
      // matchName format: "Home Team v Away Team"
      const nameParts = (sel.matchName ?? "").split(" v ");
      const homeTeam = nameParts[0]?.trim() ?? "";
      const awayTeam = nameParts.slice(1).join(" v ").trim();
      if (!homeTeam || !awayTeam) return;
      await storage.upsertTodayMatch({
        date: matchDate,
        homeTeam,
        awayTeam,
        competition: sel.league?.trim() ?? "",
        kickoffAt: sel.kickoffTime?.trim() ?? "",
      });
    } catch {
      // best-effort — never block the main request
    }
  }

  app.post("/api/coupons/:couponId/selections", async (req, res) => {
    const couponId = parseInt(req.params.couponId);
    if (isNaN(couponId)) return res.status(400).json({ error: "Invalid id" });
    const parsed = insertCouponSelectionSchema.safeParse({ ...req.body, couponId });
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const sel = await storage.createSelection(parsed.data);
    await storage.recalculateCouponFinancials(couponId);
    await autoSyncTodayMatch(couponId, sel);
    res.status(201).json(sel);
  });

  app.put("/api/coupons/:couponId/selections/:id", async (req, res) => {
    const couponId = parseInt(req.params.couponId);
    const id = parseInt(req.params.id);
    if (isNaN(id) || isNaN(couponId)) return res.status(400).json({ error: "Invalid id" });
    const parsed = insertCouponSelectionSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const sel = await storage.updateSelection(id, parsed.data);
    await storage.recalculateCouponFinancials(couponId);
    await autoSyncTodayMatch(couponId, sel);
    res.json(sel);
  });

  app.delete("/api/coupons/:couponId/selections/:id", async (req, res) => {
    const couponId = parseInt(req.params.couponId);
    const id = parseInt(req.params.id);
    if (isNaN(id) || isNaN(couponId)) return res.status(400).json({ error: "Invalid id" });
    await storage.deleteSelection(id);
    await storage.recalculateCouponFinancials(couponId);
    res.status(204).send();
  });

  // ── History routes (/api/history/*) ───────────────────────────────────────

  // ── History helpers ────────────────────────────────────────────────────────

  /** Derive ISO start/end from view + anchor date string (YYYY-MM-DD). */
  function periodBounds(view: string, date: string): { start: string; end: string } {
    const d = new Date(date + "T00:00:00Z");
    if (view === "monthly") {
      const start = `${date.slice(0, 7)}-01`;
      const last  = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
      return { start, end: last.toISOString().slice(0, 10) };
    }
    if (view === "weekly") {
      const dow  = d.getUTCDay(); // 0=Sun
      const diff = dow === 0 ? -6 : 1 - dow; // shift to Monday
      const mon  = new Date(d.getTime() + diff * 86400000);
      const sun  = new Date(mon.getTime() + 6 * 86400000);
      return { start: mon.toISOString().slice(0, 10), end: sun.toISOString().slice(0, 10) };
    }
    // daily
    return { start: date, end: date };
  }

  /**
   * Derive coupon result from its legs (LOST has precedence).
   * Void legs have their odds treated as 1.00 (i.e. ignored for result).
   * Rules:
   *   - Any non-void leg lost  → "lost"
   *   - All non-void legs won  → "won"
   *   - All legs void          → "void"
   *   - Mix of won + void only → "won"
   */
  function deriveLegResult(legResults: string[]): "won" | "lost" | "void" | null {
    if (!legResults.length) return null;
    const nonVoid = legResults.filter((r) => r !== "void");
    if (!nonVoid.length) return "void";
    if (nonVoid.some((r) => r === "lost")) return "lost";
    if (nonVoid.every((r) => r === "won")) return "won";
    return null; // pending/mixed
  }

  // ── History routes (/api/history/*) ───────────────────────────────────────

  app.get("/api/history/fixtures", async (_req, res) => {
    const all = await storage.getAllFixtures();
    res.json(all);
  });

  app.post("/api/history/fixtures", async (req, res) => {
    const parsed = insertFixtureSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const fixture = await storage.createFixture(parsed.data);
    res.status(201).json(fixture);
  });

  /**
   * GET /api/history/coupons
   * Accepts: view=daily|weekly|monthly, date=YYYY-MM-DD, filter=all|won|lost|void
   *   OR legacy: start=YYYY-MM-DD, end=YYYY-MM-DD
   * Result derivation is performed server-side from legs when view/date supplied.
   */
  app.get("/api/history/coupons", async (req, res) => {
    const q = req.query as Record<string, string | undefined>;
    let start: string | undefined;
    let end: string | undefined;

    if (q.view && q.date) {
      const bounds = periodBounds(q.view, q.date);
      start = bounds.start;
      end   = bounds.end;
    } else {
      start = q.start;
      end   = q.end;
    }

    let coupons = await storage.getAllHistoryCoupons(start, end);

    // Apply result filter when requested
    if (q.filter && q.filter !== "all") {
      const allLegs = await storage.getAllHistoryCouponLegs();
      const legsByCoupon = new Map<number, string[]>();
      for (const l of allLegs) {
        if (!legsByCoupon.has(l.couponId)) legsByCoupon.set(l.couponId, []);
        legsByCoupon.get(l.couponId)!.push(l.result ?? "");
      }
      coupons = coupons.filter((c) => {
        const derived = deriveLegResult(legsByCoupon.get(c.id) ?? []) ?? c.result;
        return derived === q.filter;
      });
    }

    // Strip heavy image fields from list response — lazy-load via /image endpoint
    const stripped = coupons.map(({ preMatchImage: _p, settledImage: _s, ...rest }) => rest);
    res.json(stripped);
  });

  app.get("/api/history/coupons/:id/image", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const coupon = await storage.getHistoryCouponById(id);
    if (!coupon) return res.status(404).json({ error: "not found" });
    res.json({ preMatchImage: coupon.preMatchImage ?? null, settledImage: coupon.settledImage ?? null });
  });

  app.post("/api/history/coupons", async (req, res) => {
    const parsed = insertHistoryCouponSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const coupon = await storage.createHistoryCoupon(parsed.data);
    res.status(201).json(coupon);
  });

  app.get("/api/history/legs", async (_req, res) => {
    const all = await storage.getAllHistoryCouponLegs();
    res.json(all);
  });

  app.post("/api/history/coupons/:couponId/legs", async (req, res) => {
    const couponId = parseInt(req.params.couponId);
    if (isNaN(couponId)) return res.status(400).json({ error: "Invalid couponId" });
    const parsed = insertHistoryCouponLegSchema.safeParse({ ...req.body, couponId });
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const leg = await storage.createHistoryCouponLeg(parsed.data);
    res.status(201).json(leg);
  });

  /**
   * GET /api/history/stats
   * Accepts: view=daily|weekly|monthly, date=YYYY-MM-DD, filter=all|won|lost|void
   *   OR legacy: start=YYYY-MM-DD, end=YYYY-MM-DD
   *
   * Stats computed from legs:
   *   - Coupon result DERIVED from legs (LOST precedence, void odds=1.00 excluded)
   *   - Hit rates: void coupons/legs excluded from denominator
   *   - uniqueFixtures: distinct fixture IDs in period
   *   - totalLegs, wonLegs, lostLegs, voidLegs from relevant leg subset
   */
  app.get("/api/history/stats", async (req, res) => {
    const q = req.query as Record<string, string | undefined>;
    let start: string | undefined;
    let end: string | undefined;

    if (q.view && q.date) {
      const bounds = periodBounds(q.view, q.date);
      start = bounds.start;
      end   = bounds.end;
    } else {
      start = q.start;
      end   = q.end;
    }

    const allCoupons = await storage.getAllHistoryCoupons(start, end);
    const allLegs    = await storage.getAllHistoryCouponLegs();

    // Index legs by couponId
    const legsByCoupon = new Map<number, typeof allLegs>();
    for (const l of allLegs) {
      if (!legsByCoupon.has(l.couponId)) legsByCoupon.set(l.couponId, []);
      legsByCoupon.get(l.couponId)!.push(l);
    }

    // Only legs that belong to coupons in the period
    const couponIds = new Set(allCoupons.map((c) => c.id));
    const relevantLegs = allLegs.filter((l) => couponIds.has(l.couponId));

    // Derive result for each coupon from its legs
    type CouponWithDerived = (typeof allCoupons)[number] & { derivedResult: "won" | "lost" | "void" | null };
    const couponsWithResult: CouponWithDerived[] = allCoupons.map((c) => {
      const legResults = (legsByCoupon.get(c.id) ?? []).map((l) => l.result ?? "");
      const derivedResult = deriveLegResult(legResults) ?? c.result as "won" | "lost" | "void" | null;
      return { ...c, derivedResult };
    });

    // Apply filter if requested
    const filter = q.filter;
    const filtered: CouponWithDerived[] = (filter && filter !== "all")
      ? couponsWithResult.filter((c) => c.derivedResult === filter)
      : couponsWithResult;

    // Settled = has a derived result (not null/pending)
    const settled = filtered.filter((c) => c.derivedResult !== null);
    const won     = settled.filter((c) => c.derivedResult === "won");
    const lost    = settled.filter((c) => c.derivedResult === "lost");
    const voided  = settled.filter((c) => c.derivedResult === "void");

    // Financial totals (settled, non-void for accurate P&L)
    const totalStake  = settled.reduce((s, c) => s + c.stake, 0);
    const totalReturn = settled.reduce((s, c) => s + (c.returnAmount ?? 0), 0);
    const netResult   = totalReturn - totalStake;
    const roi         = totalStake > 0 ? (netResult / totalStake) * 100 : 0;

    // Coupon hit rate: exclude void from denominator
    const couponDenom = won.length + lost.length;
    const couponHitRate = couponDenom > 0 ? (won.length / couponDenom) * 100 : 0;

    // Leg-level stats from relevant legs
    const wonLegs  = relevantLegs.filter((l) => l.result === "won");
    const lostLegs = relevantLegs.filter((l) => l.result === "lost");
    const voidLegs = relevantLegs.filter((l) => l.result === "void");
    const legDenom = wonLegs.length + lostLegs.length;
    const selectionHitRate = legDenom > 0 ? (wonLegs.length / legDenom) * 100 : 0;

    // Unique fixtures in this period
    const uniqueFixtureIds = new Set(relevantLegs.map((l) => l.fixtureId).filter(Boolean));

    res.json({
      // Period
      start: start ?? null,
      end:   end   ?? null,
      // Coupon-level
      totalCoupons:   settled.length,
      wonCoupons:     won.length,
      lostCoupons:    lost.length,
      voidCoupons:    voided.length,
      couponHitRate,                // excl. void
      // Financial
      totalStake,
      totalReturn,
      netResult,
      roi,
      // Leg-level
      totalLegs:     relevantLegs.length,
      wonLegs:       wonLegs.length,
      lostLegs:      lostLegs.length,
      voidLegs:      voidLegs.length,
      selectionHitRate,             // excl. void legs
      // Fixture
      uniqueFixtures: uniqueFixtureIds.size,
    });
  });

  // ── Chart: daily net results by date ────────────────────────────────────
  /**
   * GET /api/admin/chart/daily-results?lastN=7|14|30
   * Returns the last N days that have settled data (not calendar days).
   * netResult is sourced from `profit_entries` — the single continuous daily
   * P&L ledger (goes back much further than `history_coupons`, which only
   * retains recent detailed coupon/leg records for win-rate purposes).
   * Also returns period-level leg stats for win-rate calculation.
   */
  app.get("/api/admin/chart/daily-results", requireAdmin, async (req, res) => {
    const q     = req.query as Record<string, string | undefined>;
    const lastN = q.lastN ? Math.max(1, parseInt(q.lastN) || 14) : 14;

    // Full daily net-result ledger — the long-running source of truth for netResult
    const allEntries = await storage.getAllEntries();
    const sortedEntries = [...allEntries].sort((a, b) => a.date.localeCompare(b.date));
    const selectedEntries = sortedEntries.slice(-lastN);

    // Detailed coupon records (shorter window) — used only for won/lost/total coupon
    // counts and for leg-level win-rate; harmless if absent for older dates.
    const allCoupons = await storage.getAllHistoryCoupons(undefined, undefined);
    const couponsByDate = new Map<string, {
      won: number; lost: number; total: number; couponIds: number[];
    }>();
    for (const c of allCoupons) {
      if (!c.result) continue; // skip unsettled / pending
      const dateKey = c.couponDate;
      if (!couponsByDate.has(dateKey)) {
        couponsByDate.set(dateKey, { won: 0, lost: 0, total: 0, couponIds: [] });
      }
      const entry = couponsByDate.get(dateKey)!;
      entry.total += 1;
      entry.couponIds.push(c.id);
      if (c.result === "won" || c.result === "WON")   entry.won  += 1;
      if (c.result === "lost" || c.result === "LOST") entry.lost += 1;
    }

    const days = selectedEntries.map((e) => {
      const cd = couponsByDate.get(e.date);
      return {
        date: e.date,
        netResult:    e.value,
        wonCoupons:   cd?.won ?? 0,
        lostCoupons:  cd?.lost ?? 0,
        totalCoupons: cd?.total ?? 0,
      };
    });

    const rangeStart = days[0]?.date ?? null;
    const rangeEnd   = days[days.length - 1]?.date ?? null;

    // Leg win-rate: coupons whose date falls within the selected window
    const selectedCouponIds = new Set<number>();
    if (rangeStart && rangeEnd) {
      for (const [date, data] of Array.from(couponsByDate.entries())) {
        if (date >= rangeStart && date <= rangeEnd) {
          for (const id of data.couponIds) selectedCouponIds.add(id);
        }
      }
    }

    const allLegs    = await storage.getAllHistoryCouponLegs();
    const periodLegs = allLegs.filter(l => selectedCouponIds.has(l.couponId));
    const wonLegs    = periodLegs.filter(l => l.result === "won").length;
    const lostLegs   = periodLegs.filter(l => l.result === "lost").length;

    res.json({
      days,
      periodWonLegs:   wonLegs,
      periodTotalLegs: wonLegs + lostLegs,   // void excluded from denominator
      rangeStart,
      rangeEnd,
    });
  });

  // ── Today (Bugün) routes (/api/today/*) ──────────────────────────────────

  /** Helper: get today's date in Istanbul time as YYYY-MM-DD */
  function istanbulToday(): string {
    return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
  }

  // Matches
  // Admin-only read endpoints (no publish gating, intended for admin UI only)
  app.get("/api/admin/today/matches", requireAdmin, async (req, res) => {
    const date = (req.query.date as string) || istanbulToday();
    const data = await storage.getTodayMatches(date);
    res.json(data);
  });

  // Sync matches from Kupon Üretici coupon_selections → today_matches for a given date
  app.post("/api/admin/today/sync-matches-from-coupons", requireAdmin, async (req, res) => {
    const date = (req.query.date as string) || istanbulToday();

    const allCoupons = await storage.getAllCoupons();
    const dateCoupons = allCoupons.filter((c) => {
      const datePart = (c.placedAt ?? "").split(",")[0].trim();
      return parseFmtDate(datePart) === date;
    });

    let added = 0;
    let skipped = 0;

    for (const coupon of dateCoupons) {
      const selections = await storage.getSelectionsForCoupon(coupon.id);
      for (const sel of selections) {
        const nameParts = (sel.matchName ?? "").split(" v ");
        const homeTeam = nameParts[0]?.trim() ?? "";
        const awayTeam = nameParts.slice(1).join(" v ").trim();
        if (!homeTeam || !awayTeam) { skipped++; continue; }
        const result = await storage.upsertTodayMatch({
          date,
          homeTeam,
          awayTeam,
          competition: sel.league?.trim() ?? "",
          kickoffAt: sel.kickoffTime?.trim() ?? "",
        });
        result ? added++ : skipped++;
      }
    }

    // Also fill match_names on today_coupons by matching on totalOdds (unique per coupon)
    try {
      const todayCouponsList = await storage.getTodayCoupons(date);
      for (const tc of todayCouponsList) {
        const match = dateCoupons.find(c => Math.abs(c.totalOdds - tc.totalOdds) < 0.005);
        if (match) {
          const sels  = await storage.getSelectionsForCoupon(match.id);
          const names = sels.map(s => (s.matchName ?? "").replace(" v ", " – ").trim()).filter(Boolean);
          await storage.updateTodayCoupon(tc.id, { matchNames: JSON.stringify(names) } as any);
        }
      }
    } catch (_e) { /* non-fatal */ }

    res.json({ added, skipped, total: added + skipped });
  });

  app.get("/api/admin/today/coupons", requireAdmin, async (req, res) => {
    const date = (req.query.date as string) || istanbulToday();
    const data = await storage.getTodayCoupons(date);

    // Auto-populate matchNames for any coupon that still has them empty.
    // Match today_coupons → coupons by totalOdds (unique per coupon, unlike stake).
    const allCoupons = await storage.getAllCoupons();
    const dateCoupons = allCoupons.filter((c) => {
      const datePart = (c.placedAt ?? "").split(",")[0].trim();
      return parseFmtDate(datePart) === date;
    });

    const enriched = await Promise.all(data.map(async (tc) => {
      let parsed: string[] = [];
      if (tc.matchNames) {
        try { parsed = JSON.parse(tc.matchNames); } catch { parsed = []; }
      }
      if (parsed.length === 0 && dateCoupons.length > 0) {
        const match = dateCoupons.find(c => Math.abs(c.totalOdds - tc.totalOdds) < 0.005);
        if (match) {
          const sels = await storage.getSelectionsForCoupon(match.id);
          parsed = sels.map(s => (s.matchName ?? "").replace(" v ", " – ").trim()).filter(Boolean);
          // Persist so subsequent requests skip the lookup
          if (parsed.length > 0) {
            try { await storage.updateTodayCoupon(tc.id, { matchNames: JSON.stringify(parsed) } as any); } catch { /* non-fatal */ }
          }
        }
      }
      // Extract time from matched coupon's placedAt ("29 Jul 2026, 15:17" → "15:17")
      const matchedCoupon = dateCoupons.find(c => Math.abs(c.totalOdds - tc.totalOdds) < 0.005);
      const placedAtTime = matchedCoupon?.placedAt
        ? (matchedCoupon.placedAt.split(",")[1]?.trim() ?? null)
        : null;

      const { preMatchImage, settledImage, matchNames: _mn, ...rest } = tc;
      return {
        ...rest,
        hasPreMatchImage: !!preMatchImage,
        hasSettledImage:  !!settledImage,
        matchNames: parsed,
        placedAtTime,
      };
    }));

    res.json(enriched);
  });

  app.get("/api/admin/today/public-pick", requireAdmin, async (req, res) => {
    const date = (req.query.date as string) || istanbulToday();
    const pick = await storage.getTodayPublicPick(date);
    res.json(pick ?? null);
  });

  // Public read endpoints — gated by publish status
  app.get("/api/today/matches/settled", async (_req, res) => {
    const data = await storage.getAllSettledTodayMatches();
    res.json(data);
  });

  app.get("/api/today/matches", async (req, res) => {
    const date = (req.query.date as string) || istanbulToday();
    if (!(await storage.isTodayPublished(date)).published) return res.json([]);
    const data = await storage.getTodayMatches(date);
    res.json(data);
  });

  app.post("/api/today/matches", requireAdmin, async (req, res) => {
    const parsed = insertTodayMatchSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const created = await storage.createTodayMatch(parsed.data);
    res.status(201).json(created);
  });

  app.patch("/api/today/matches/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const { result } = req.body;
    const valid = ["won", "lost", "void", "postponed", null];
    if (!valid.includes(result)) return res.status(400).json({ error: "Invalid result" });
    const updated = await storage.updateTodayMatch(id, result);
    res.json(updated);
  });

  app.delete("/api/today/matches/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    await storage.deleteTodayMatch(id);
    res.status(204).send();
  });

  // Coupons
  app.get("/api/today/coupons", async (req, res) => {
    const date = (req.query.date as string) || istanbulToday();
    if (!(await storage.isTodayPublished(date)).published) return res.json([]);
    const data = await storage.getTodayCoupons(date);
    const stripped = data.map(({ preMatchImage: _p, settledImage: _s, ...rest }) => rest);
    res.json(stripped);
  });

  app.get("/api/today/coupons/:id/image", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const coupon = await storage.getTodayCouponById(id);
    if (!coupon) return res.status(404).json({ error: "not found" });
    // Enforce publish gating: only serve image if the day is published
    const published = await storage.isTodayPublished(coupon.date);
    if (!published.published) return res.status(404).json({ error: "not found" });
    res.json({ preMatchImage: coupon.preMatchImage ?? null, settledImage: coupon.settledImage ?? null });
  });

  // Admin-only: serve coupon image regardless of publish status (inline auth — no middleware ref)
  app.get("/api/admin/today/coupons/:id/image", async (req, res) => {
    if (!req.session?.userId) return res.status(401).json({ error: "Giriş yapılmamış." });
    const user = await storage.getUserById(req.session.userId);
    if (!user?.isAdmin) return res.status(403).json({ error: "Admin yetkisi gerekiyor." });
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const coupon = await storage.getTodayCouponById(id);
    if (!coupon) return res.status(404).json({ error: "not found" });
    res.json({ preMatchImage: coupon.preMatchImage ?? null, settledImage: coupon.settledImage ?? null });
  });

  app.post("/api/today/coupons", requireAdmin, async (req, res) => {
    const date = req.body.date || istanbulToday();
    const body = {
      date,
      reference: `SB-${date.replace(/-/g, "")}-${Date.now()}`,
      label: "Kupon",
      matchCount: 0,
      stake: 0,
      totalOdds: 1,
      firstKickoffAt: "00:00",
      status: "PRE_MATCH",
      ...req.body,
    };
    const parsed = insertTodayCouponSchema.safeParse(body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const created = await storage.createTodayCoupon(parsed.data);
    res.status(201).json(created);
  });

  app.put("/api/today/coupons/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    // Field locking: immutable fields cannot be changed after initial publication
    const existing = await storage.getTodayCouponById(id);
    if (existing && existing.status !== "PRE_MATCH") {
      const LOCKED: string[] = ["reference", "date", "firstKickoffAt", "preMatchImage", "publishedAt", "stake", "totalOdds", "potentialReturn", "label", "matchCount"];
      const attempted = LOCKED.filter((f) => f in req.body);
      if (attempted.length > 0) {
        return res.status(400).json({ error: "Bu alanlar yayın sonrası değiştirilemez.", locked: attempted });
      }
    }

    const parsed = insertTodayCouponSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const updated = await storage.updateTodayCoupon(id, parsed.data);
    res.json(updated);
  });

  app.delete("/api/today/coupons/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    await storage.deleteTodayCoupon(id);
    res.status(204).send();
  });

  // ── Free Bets (public) ───────────────────────────────────────────────────
  app.get("/api/free-bets", async (req, res) => {
    try {
      const [picks, publishedMap] = await Promise.all([
        storage.getAllPublicPicks(),
        storage.getAllPublishedDates(),
      ]);
      const bets = picks.map(p => mapPickToFreeBet(p, publishedMap[p.date] ?? null));
      res.json(bets);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/free-bets/today", async (req, res) => {
    try {
      const today = istanbulToday();
      const [pick, { publishedAt }] = await Promise.all([
        storage.getTodayPublicPick(today),
        storage.isTodayPublished(today),
      ]);
      if (!pick) return res.status(404).json(null);
      res.json(mapPickToFreeBet(pick, publishedAt));
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Public Pick
  app.get("/api/today/public-pick", async (req, res) => {
    const date = (req.query.date as string) || istanbulToday();
    if (!(await storage.isTodayPublished(date)).published) return res.json(null);
    const pick = await storage.getTodayPublicPick(date);
    res.json(pick ?? null);
  });

  app.post("/api/today/public-pick", requireAdmin, async (req, res) => {
    const parsed = insertTodayPublicPickSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const pick = await storage.upsertTodayPublicPick(parsed.data);
    res.json(pick);
  });

  app.put("/api/today/public-pick/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const parsed = insertTodayPublicPickSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const updated = await storage.updateTodayPublicPick(id, parsed.data);
    res.json(updated);
  });

  app.delete("/api/today/public-pick/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    await storage.deleteTodayPublicPick(id);
    res.status(204).send();
  });

  // Publish gating — controls visibility on the public Bugün page
  app.get("/api/today/published", async (req, res) => {
    const date = (req.query.date as string) || istanbulToday();
    const { published, publishedAt } = await storage.isTodayPublished(date);
    let publishedAtStr: string | null = null;
    if (publishedAt) {
      publishedAtStr = publishedAt.toLocaleTimeString("tr-TR", {
        hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul",
      });
    }
    res.json({ date, published, publishedAt: publishedAtStr });
  });

  /* Parse HH:MM entered as Istanbul time (UTC+3) into a UTC Date anchored to the given date */
  function parseIstanbulHHMM(date: string, timeStr: string): Date | null {
    const match = /^(\d{2}):(\d{2})$/.exec(timeStr);
    if (!match) return null;
    const hh = parseInt(match[1], 10);
    const mm = parseInt(match[2], 10);
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
    const [y, mo, d] = date.split("-").map(Number);
    if (!y || !mo || !d) return null;
    // Istanbul = UTC+3: subtract 3 hours from the entered local time to get UTC
    const utcMs = Date.UTC(y, mo - 1, d, hh, mm, 0, 0) - 3 * 60 * 60 * 1000;
    return new Date(utcMs);
  }

  app.post("/api/today/publish", requireAdmin, async (req, res) => {
    const { date, publishedAt: publishedAtStr } = req.body;
    if (!date || typeof date !== "string") return res.status(400).json({ error: "date required" });
    let publishedAt: Date | undefined;
    if (publishedAtStr && typeof publishedAtStr === "string") {
      const parsed = parseIstanbulHHMM(date, publishedAtStr);
      if (!parsed) return res.status(400).json({ error: "publishedAt must be HH:MM with valid hour (0-23) and minute (0-59)" });
      publishedAt = parsed;
    }
    await storage.publishToday(date, publishedAt);
    res.json({ date, published: true });
  });

  app.patch("/api/today/publish", requireAdmin, async (req, res) => {
    const { date, publishedAt: publishedAtStr } = req.body;
    if (!date || typeof date !== "string") return res.status(400).json({ error: "date required" });
    if (!publishedAtStr || typeof publishedAtStr !== "string") return res.status(400).json({ error: "publishedAt (HH:MM) required" });
    const parsed = parseIstanbulHHMM(date, publishedAtStr);
    if (!parsed) return res.status(400).json({ error: "publishedAt must be HH:MM with valid hour (0-23) and minute (0-59)" });
    await storage.updatePublishedAt(date, parsed);
    res.json({ date, updated: true });
  });

  app.get("/api/today/latest-published-date", async (_req, res) => {
    const date = await storage.getLatestPublishedDate();
    res.json({ date });
  });

  app.delete("/api/today/publish", requireAdmin, async (req, res) => {
    const date = req.query.date as string;
    if (!date) return res.status(400).json({ error: "date required" });
    await storage.unpublishToday(date);
    res.json({ date, published: false });
  });

  // ── Membership publications (/api/membership/*) ──────────────────────────

  // Admin auth guard — requires session + isAdmin=true on the user record
  async function requireAdmin(req: any, res: any, next: any) {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Bu işlem için giriş yapmanız gerekiyor." });
    }
    const user = await storage.getUserById(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Bu işlem için admin yetkisi gerekiyor." });
    }
    next();
  }

  // ── Promotion analytics (public write, admin-only read) ───────────────────
type PromotionClassification = "HUMAN" | "SUSPICIOUS" | "LIKELY BOT";

function promotionGeoHeader(req: any, names: string[]): string | null {
  for (const name of names) {
    const value = String(req.get(name) ?? "").trim();
    if (value && value.length <= 100) return value;
  }
  return null;
}

function countryName(value: string | null): string | null {
  if (!value) return null;
  const normalized = value.toUpperCase();
  const names: Record<string, string> = {
    TR: "Turkey", DE: "Germany", IT: "Italy", HU: "Hungary", GB: "United Kingdom",
    US: "United States", FR: "France", ES: "Spain", NL: "Netherlands", BE: "Belgium",
    AT: "Austria", CH: "Switzerland", AE: "United Arab Emirates", GR: "Greece",
  };
  return names[normalized] ?? (value.includes(" ") ? value : null);
}

function promotionAssessment(input: {
  browserConfirmed: boolean;
  visibleSeconds: number;
  trustedInteraction: boolean;
  trustedScroll: boolean;
  knownBotUa: boolean;
  durationSeconds: number;
  cta: string | null;
}): { humanScore: number; classification: PromotionClassification } {
  let score = 0;
  if (input.browserConfirmed) score += 20;
  if (input.visibleSeconds >= 5) score += 10;
  if (input.visibleSeconds >= 15) score += 10;
  if (input.trustedInteraction) score += 25;
  if (input.trustedScroll) score += 15;
  if (input.cta) score += 20;
  if (input.knownBotUa) score -= 100;
  if (input.durationSeconds < 1) score -= 20;
  if (!input.browserConfirmed) score -= 20;
  const humanScore = Math.max(0, Math.min(100, score));
  const classification: PromotionClassification = input.knownBotUa
    ? "LIKELY BOT"
    : humanScore >= 60 ? "HUMAN"
      : humanScore >= 30 ? "SUSPICIOUS"
        : "LIKELY BOT";
  return { humanScore, classification };
}

  app.post("/api/promotion/track", async (req, res) => {
    try {
      const body = req.body ?? {};
      const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 100) : "";
      const event = typeof body.event === "string" ? body.event : "";
      const validEvents = new Set(["pageview", "heartbeat", "scroll", "cta", "end", "browser_confirmed", "signal"]);
      if (!sessionId || !validEvents.has(event)) return res.status(400).json({ error: "Invalid analytics event." });

      const ua = String(req.get("user-agent") ?? "").slice(0, 500);
      const isBot = /bot|crawler|spider|slurp|facebookexternalhit|twitterbot|googlebot|bingbot|preview|curl|wget|python-requests|headlesschrome|puppeteer|selenium/i.test(ua);
      const isQa = body.qa === true || req.query.qa === "1";
      const ip = String(req.ip ?? req.socket.remoteAddress ?? "");
      const hashedVisitorId = createHash("sha256").update(`${ip}|${ua}`).digest("hex");
      const deviceCategory = ["mobile", "tablet", "desktop"].includes(body.deviceCategory) ? body.deviceCategory : "unknown";
      const durationSeconds = Math.max(0, Math.min(3600, Math.round(Number(body.durationSeconds) || 0)));
      const visibleSeconds = Math.max(0, Math.min(3600, Math.round(Number(body.visibleSeconds) || 0)));
      const trustedInteraction = body.trustedInteraction === true;
      const trustedInteractionCount = Math.max(0, Math.min(1000, Math.round(Number(body.trustedInteractionCount) || 0)));
      const trustedScroll = body.trustedScroll === true;
      const maxScrollPercent = Math.max(0, Math.min(100, Math.round(Number(body.maxScrollPercent) || 0)));
      const cta = ["home", "telegram", "register"].includes(body.cta) ? body.cta : null;
      const source = ["x", "meta", "insta", "ads", "direct"].includes(body.source) ? body.source : "direct";
      const country = countryName(promotionGeoHeader(req, ["x-country-name", "x-geo-country", "x-geo-country-name", "geoip-country"]));
      const city = promotionGeoHeader(req, ["x-city", "x-geo-city", "x-vercel-ip-city", "geoip-city"]);

      const existing = await db.select({ id: promotionSessions.id }).from(promotionSessions)
        .where(eq(promotionSessions.sessionId, sessionId)).limit(1);
      if (!existing.length) {
        await db.insert(promotionSessions).values({
          sessionId,
          deviceCategory,
          referrer: String(req.get("referer") ?? "").slice(0, 500) || null,
          userAgent: ua || null,
          hashedVisitorId,
          source,
          browserConfirmed: body.browserConfirmed === true,
          visibleSeconds,
          trustedInteraction,
          trustedInteractionCount,
          trustedScroll,
          knownBotUa: isBot,
          country,
          city,
          isQa,
          durationSeconds,
          didScroll: event === "scroll" || maxScrollPercent > 0,
          maxScrollPercent,
          cta,
        });
      } else {
        await db.update(promotionSessions).set({
          lastSeenAt: new Date(),
          durationSeconds: sql`GREATEST(${promotionSessions.durationSeconds}, ${durationSeconds})`,
          visibleSeconds: sql`GREATEST(${promotionSessions.visibleSeconds}, ${visibleSeconds})`,
          browserConfirmed: sql`${promotionSessions.browserConfirmed} OR ${body.browserConfirmed === true}`,
          trustedInteraction: sql`${promotionSessions.trustedInteraction} OR ${trustedInteraction}`,
          trustedInteractionCount: sql`GREATEST(${promotionSessions.trustedInteractionCount}, ${trustedInteractionCount})`,
          trustedScroll: sql`${promotionSessions.trustedScroll} OR ${trustedScroll}`,
          knownBotUa: sql`${promotionSessions.knownBotUa} OR ${isBot}`,
          didScroll: sql`${promotionSessions.didScroll} OR ${event === "scroll" || maxScrollPercent > 0}`,
          maxScrollPercent: sql`GREATEST(${promotionSessions.maxScrollPercent}, ${maxScrollPercent})`,
          source: source === "direct" ? undefined : source,
          cta: cta ?? undefined,
        }).where(eq(promotionSessions.sessionId, sessionId));
      }
      const [session] = await db.select().from(promotionSessions)
        .where(eq(promotionSessions.sessionId, sessionId)).limit(1);
      if (session) {
        const assessment = promotionAssessment({
          browserConfirmed: session.browserConfirmed,
          visibleSeconds: session.visibleSeconds,
          trustedInteraction: session.trustedInteraction,
          trustedScroll: session.trustedScroll,
          knownBotUa: session.knownBotUa,
          durationSeconds: session.durationSeconds,
          cta: session.cta,
        });
        await db.update(promotionSessions).set(assessment)
          .where(eq(promotionSessions.id, session.id));
      }
      res.status(204).end();
    } catch (err) {
      console.error("[promotion-track] error:", err);
      res.status(204).end();
    }
  });

  app.post("/api/admin/promotion-tracker/reset", requireAdmin, async (req, res) => {
    try {
      const target = req.body?.target;
      if (!isPromotionResetTarget(target)) {
        return res.status(400).json({ error: "Geçersiz sıfırlama kapsamı." });
      }
      if (req.body?.confirmation !== target) {
        return res.status(400).json({ error: "Sıfırlama onayı gerekli." });
      }

      let deletedRows;
      if (target === "all") {
        deletedRows = await db.delete(promotionSessions).returning({ id: promotionSessions.id });
      } else if (target === "today") {
        const { from, to } = getPromotionResetTodayRange();
        deletedRows = await db.delete(promotionSessions)
          .where(and(
            gte(promotionSessions.createdAt, from),
            lteOp(promotionSessions.createdAt, to),
          ))
          .returning({ id: promotionSessions.id });
      } else {
        deletedRows = await db.delete(promotionSessions)
          .where(eq(promotionSessions.source, target))
          .returning({ id: promotionSessions.id });
      }

      return res.json({ deletedCount: deletedRows.length, target });
    } catch (err) {
      console.error("[promotion-tracker-reset] error:", err);
      return res.status(500).json({ error: "Promotion tracker verileri sıfırlanamadı." });
    }
  });

  app.get("/api/admin/promotion-tracker/stats", requireAdmin, async (req, res) => {
    try {
      const q = req.query as Record<string, string | undefined>;
      const whereClauses: any[] = [eq(promotionSessions.isQa, false)];
      if (q.source && ["x", "meta", "insta", "ads", "direct"].includes(q.source)) {
        whereClauses.push(eq(promotionSessions.source, q.source));
      }
      if (q.from) whereClauses.push(gte(promotionSessions.createdAt, istanbulDayStart(q.from)));
      if (q.to) whereClauses.push(lteOp(promotionSessions.createdAt, istanbulDayEnd(q.to)));
      const rows = await db.select().from(promotionSessions).where(and(...whereClauses))
        .orderBy(descOp(promotionSessions.createdAt)).limit(5000);
      const uniqueVisitors = new Set(rows.map((r) => r.hashedVisitorId).filter(Boolean)).size;
      const durations = rows.map((r) => r.durationSeconds).sort((a, b) => a - b);
      const avg = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
      const median = durations.length ? durations[Math.floor((durations.length - 1) / 2)] : 0;
      const ctaClicks = {
        home: rows.filter((r) => r.cta === "home").length,
        telegram: rows.filter((r) => r.cta === "telegram").length,
        register: rows.filter((r) => r.cta === "register").length,
      };
      const devices = { mobile: 0, tablet: 0, desktop: 0, unknown: 0 };
      const classifications: Record<PromotionClassification, number> = {
        HUMAN: 0,
        SUSPICIOUS: 0,
        "LIKELY BOT": 0,
      };
      const countries: Record<string, number> = {};
      for (const row of rows) {
        const key = row.deviceCategory as keyof typeof devices;
        devices[key] = (devices[key] ?? 0) + 1;
        const classification = row.classification as PromotionClassification;
        if (classification in classifications) classifications[classification] += 1;
        else classifications.SUSPICIOUS += 1;
        const country = row.country?.trim() || "Unknown";
        countries[country] = (countries[country] ?? 0) + 1;
      }
      res.json({
        totalVisits: rows.length,
        uniqueVisitors,
        scrolledVisitors: rows.filter((r) => r.didScroll).length,
        scrollRate: rows.length ? Number(((rows.filter((r) => r.didScroll).length / rows.length) * 100).toFixed(1)) : 0,
        averageDurationSeconds: Math.round(avg),
        medianDurationSeconds: median,
        ctaClicks,
        ctaRates: {
          home: rows.length ? Number(((ctaClicks.home / rows.length) * 100).toFixed(1)) : 0,
          telegram: rows.length ? Number(((ctaClicks.telegram / rows.length) * 100).toFixed(1)) : 0,
          register: rows.length ? Number(((ctaClicks.register / rows.length) * 100).toFixed(1)) : 0,
        },
        devices,
        classifications,
        countries,
        sessions: rows.slice(0, 100).map((r) => ({
          id: r.id, createdAt: r.createdAt.toISOString(), lastSeenAt: r.lastSeenAt.toISOString(),
          durationSeconds: r.durationSeconds, didScroll: r.didScroll, maxScrollPercent: r.maxScrollPercent,
          visibleSeconds: r.visibleSeconds, browserConfirmed: r.browserConfirmed,
          trustedInteraction: r.trustedInteraction, trustedInteractionCount: r.trustedInteractionCount,
          trustedScroll: r.trustedScroll, knownBotUa: r.knownBotUa,
          humanScore: r.humanScore, classification: r.classification,
          country: r.country, city: r.city,
          deviceCategory: r.deviceCategory, cta: r.cta, referrer: r.referrer, source: r.source,
        })),
      });
    } catch (err) {
      console.error("[promotion-tracker-stats] error:", err);
      res.status(500).json({ error: "Promotion tracker stats could not be loaded." });
    }
  });

  // Quick admin-status check — used by the frontend AdminLoginGate
  app.get("/api/admin/me", requireAdmin, async (req, res) => {
    const user = await storage.getUserById((req as any).session.userId);
    res.json({ isAdmin: true, email: user?.email ?? "" });
  });

  // CAPITALE software analysis feed. It deliberately returns no sample data until a trusted source is connected.
  // Software feed is registered by registerAgentReportRoutes.

  // Registered site users (distinct from Whop paying-member records) — for the
  // admin "Kullanıcılar" tab: who signed up, when, and their member tier.
  app.get("/api/admin/users", requireAdmin, async (_req, res) => {
    const rows = await db.select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      memberTier: users.memberTier,
      isAdmin: users.isAdmin,
    }).from(users).orderBy(sql`${users.createdAt} DESC`);

    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    const total = rows.length;
    const last7d = rows.filter(u => now - new Date(u.createdAt).getTime() <= 7 * DAY).length;
    const last30d = rows.filter(u => now - new Date(u.createdAt).getTime() <= 30 * DAY).length;

    res.json({ users: rows, total, last7d, last30d });
  });

  // Manually re-trigger a verification email for an account that never received
  // (or lost) its original one — e.g. because the email send silently failed.
  app.post("/api/admin/users/resend-verification", requireAdmin, async (req, res) => {
    try {
      const { email } = req.body as { email?: string };
      if (!email) return res.status(400).json({ error: "Email is required." });

      const user = await storage.getUserByEmail(email.toLowerCase());
      if (!user) return res.status(404).json({ error: "No account found with that email." });

      const result = await resendVerificationEmail(user.id);
      if (!result.ok) return res.status(502).json({ error: result.error });

      return res.json({ message: `Verification email resent to ${user.email}.` });
    } catch (err) {
      console.error("Admin resend-verification error:", err);
      return res.status(500).json({ error: "An error occurred. Please try again." });
    }
  });

  // Bootstrap: first logged-in user to call this becomes the admin (one-time only)
  app.post("/api/admin/membership/bootstrap-admin", async (req, res) => {
    if (!req.session?.userId) return res.status(401).json({ error: "Giriş yapılmamış." });
    const alreadyHasAdmin = await storage.hasAnyAdmin();
    if (alreadyHasAdmin) return res.status(409).json({ error: "Admin zaten tanımlı." });
    await storage.setUserAdmin(req.session.userId, true);
    const user = await storage.getUserById(req.session.userId);
    res.json({ ok: true, email: user?.email });
  });

  // Admin: list all (with optional date + tier filter)
  app.get("/api/admin/membership/publications", requireAdmin, async (req, res) => {
    const date = (req.query.date as string) || undefined;
    const tier = (req.query.tier as string) || undefined;
    const target = (req.query.target as string) || undefined;
    const pubs = await storage.getMembershipPublications(date, tier, false, target);
    res.json(pubs);
  });

  app.post("/api/admin/membership/publications", requireAdmin, async (req, res) => {
    const parsed = insertMembershipPublicationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const pub = await storage.createMembershipPublication(parsed.data);
    res.status(201).json(pub);
  });

  app.put("/api/admin/membership/publications/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const parsed = insertMembershipPublicationSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const updated = await storage.updateMembershipPublication(id, parsed.data);
    res.json(updated);
  });

  // Publish / unpublish / schedule a membership publication
  app.post("/api/admin/membership/publications/:id/publish", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const updated = await storage.publishMembershipPublication(id);
    res.json(updated);
  });

  app.post("/api/admin/membership/publications/:id/unpublish", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const updated = await storage.unpublishMembershipPublication(id);
    res.json(updated);
  });

  app.post("/api/admin/membership/publications/:id/schedule", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const { scheduledAt } = req.body as { scheduledAt?: string };
    if (!scheduledAt) return res.status(400).json({ error: "scheduledAt required" });
    const dt = new Date(scheduledAt);
    if (isNaN(dt.getTime())) return res.status(400).json({ error: "scheduledAt must be a valid ISO datetime" });
    const updated = await storage.scheduleMembershipPublication(id, dt);
    res.json(updated);
  });

  app.delete("/api/admin/membership/publications/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    await storage.deleteMembershipPublication(id);
    res.status(204).send();
  });

  // Import snapshot from a today_coupon into a new membership publication (draft)
  app.post("/api/admin/membership/import-coupon", requireAdmin, async (req, res) => {
    const { couponId, tier, target } = req.body as { couponId?: number; tier?: string; target?: string };
    if (!couponId || isNaN(Number(couponId))) return res.status(400).json({ error: "couponId required" });
    if (tier !== "select" && tier !== "unlimited") return res.status(400).json({ error: "tier must be 'select' or 'unlimited'" });
    if (target !== undefined && target !== "members_only" && target !== "profile") {
      return res.status(400).json({ error: "target must be 'members_only' or 'profile'" });
    }
    const coupon = await storage.getTodayCouponById(Number(couponId));
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    const pub = await storage.createMembershipPublication({
      date: coupon.date,
      tier,
      target: target ?? "members_only",
      title: `${coupon.label} · ${coupon.reference}`,
      analysis: null,
      pubStatus: "draft",
      publishedAt: null,
      status: coupon.status,
      result: coupon.result ?? null,
      couponRef: coupon.reference,
      stake: coupon.stake,
      totalOdds: coupon.totalOdds,
      potentialReturn: coupon.stake * coupon.totalOdds,
      matchCount: coupon.matchCount ?? null,
      firstKickoffAt: null, // today_coupons do not store individual kickoff times; set manually via leg editor
    });
    res.status(201).json(pub);
  });

  // Legs
  app.post("/api/admin/membership/publications/:pubId/legs", requireAdmin, async (req, res) => {
    const pubId = parseInt(req.params.pubId);
    if (isNaN(pubId)) return res.status(400).json({ error: "Invalid pubId" });
    const parsed = insertMembershipPubLegSchema.safeParse({ ...req.body, publicationId: pubId });
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const leg = await storage.createMembershipPubLeg(parsed.data);
    res.status(201).json(leg);
  });

  app.put("/api/admin/membership/legs/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const parsed = insertMembershipPubLegSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const updated = await storage.updateMembershipPubLeg(id, parsed.data);
    res.json(updated);
  });

  app.delete("/api/admin/membership/legs/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    await storage.deleteMembershipPubLeg(id);
    res.status(204).send();
  });

  // Admin: quick PNG upload — creates publication + uploads image + publishes in one step
  app.post("/api/admin/membership/quick-png", requireAdmin, async (req, res) => {
    const { tier, date, imageType, imageData, target } = req.body as {
      tier?: string; date?: string; imageType?: string; imageData?: string; target?: string;
    };
    if (tier !== "select" && tier !== "unlimited") return res.status(400).json({ error: "tier required" });
    if (!date) return res.status(400).json({ error: "date required" });
    if (imageType !== "pre_match" && imageType !== "settled") return res.status(400).json({ error: "imageType required" });
    if (!imageData || !imageData.startsWith("data:image/")) return res.status(400).json({ error: "imageData required" });
    if (target !== undefined && target !== "members_only" && target !== "profile") {
      return res.status(400).json({ error: "target must be 'members_only' or 'profile'" });
    }

    const tierLabel = tier === "select" ? "Capitale Select" : "Capitale Unlimited";
    const pub = await storage.createMembershipPublication({
      date,
      tier,
      target: target ?? "members_only",
      title: `${tierLabel} · ${date}`,
      analysis: null,
      pubStatus: "draft",
      publishedAt: null,
      status: "PRE_MATCH",
      result: null,
      couponRef: null,
      stake: null,
      totalOdds: null,
      potentialReturn: null,
      matchCount: null,
      firstKickoffAt: null,
    });

    const field = imageType === "pre_match" ? "preMatchImage" : "settledImage";
    await storage.updateMembershipPublication(pub.id, { [field]: imageData });
    const published = await storage.publishMembershipPublication(pub.id);
    res.status(201).json(published);
  });

  // Admin: upload pre-match or settled image for a membership publication
  app.post("/api/admin/membership/publications/:id/image", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const { imageType, imageData } = req.body as { imageType?: string; imageData?: string };
    if (imageType !== "pre_match" && imageType !== "settled") {
      return res.status(400).json({ error: "imageType must be 'pre_match' or 'settled'" });
    }
    if (!imageData || typeof imageData !== "string") {
      return res.status(400).json({ error: "imageData (base64 data URL) required" });
    }
    if (!imageData.startsWith("data:image/")) {
      return res.status(400).json({ error: "imageData must be a base64 image data URL" });
    }
    const field = imageType === "pre_match" ? "preMatchImage" : "settledImage";
    const updated = await storage.updateMembershipPublication(id, { [field]: imageData });
    res.json({ ok: true, id: updated.id });
  });

  // Admin: delete pre-match or settled image
  app.delete("/api/admin/membership/publications/:id/image", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const { imageType } = req.body as { imageType?: string };
    if (imageType !== "pre_match" && imageType !== "settled") {
      return res.status(400).json({ error: "imageType must be 'pre_match' or 'settled'" });
    }
    const field = imageType === "pre_match" ? "preMatchImage" : "settledImage";
    await storage.updateMembershipPublication(id, { [field]: null });
    res.json({ ok: true });
  });

  // Member-facing: get image for a published membership publication
  app.get("/api/membership/publications/:id/image", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Giriş yapılmamış." });
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const pub = await storage.getMembershipPublicationById(id);
    if (!pub) return res.status(404).json({ error: "Not found" });
    // Only serve images for published publications
    if (pub.pubStatus !== "published") return res.status(403).json({ error: "Yayında değil." });
    // Tier check
    const userTier = await storage.getUserMemberTier(req.session.userId);
    if (!userTier) return res.status(403).json({ error: "Aktif üyeliğiniz yok." });
    if (pub.tier === "unlimited" && userTier !== "unlimited") {
      return res.status(403).json({ error: "Bu içerik Unlimited üyelere özel." });
    }
    res.json({ preMatchImage: pub.preMatchImage ?? null, settledImage: pub.settledImage ?? null });
  });

  // Admin: set a user's member tier and/or membership expiry (by email)
  app.post("/api/admin/membership/set-tier", requireAdmin, async (req, res) => {
    const { email, tier, expiresAt } = req.body as { email?: string; tier?: string | null; expiresAt?: string | null };
    if (!email) return res.status(400).json({ error: "email required" });
    if (tier !== undefined && tier !== null && tier !== "select" && tier !== "unlimited") {
      return res.status(400).json({ error: "tier must be 'select', 'unlimited', or null" });
    }
    let parsedExpiresAt: Date | null = null;
    if (expiresAt !== undefined && expiresAt !== null && expiresAt !== "") {
      parsedExpiresAt = new Date(expiresAt);
      if (isNaN(parsedExpiresAt.getTime())) {
        return res.status(400).json({ error: "expiresAt must be a valid date" });
      }
    }
    const user = await storage.getUserByEmail(email.toLowerCase());
    if (!user) return res.status(404).json({ error: "User not found" });
    if (tier !== undefined) {
      // override: true locks this tier against Whop webhook/reconciliation writes.
      // Passing null explicitly clears the lock so automation re-engages.
      await storage.setUserMemberTier(user.id, tier ?? null, { override: tier !== null && tier !== undefined });
    }
    if (expiresAt !== undefined) {
      await storage.setUserMembershipExpiry(user.id, parsedExpiresAt);
    }
    res.json({
      id: user.id,
      email: user.email,
      memberTier: tier !== undefined ? (tier ?? null) : user.memberTier,
      membershipExpiresAt: expiresAt !== undefined ? parsedExpiresAt : user.membershipExpiresAt,
    });
  });

  // Member-facing: logged-in user's tier
  app.get("/api/auth/me/tier", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Giriş yapılmamış." });
    const tier = await storage.getUserMemberTier(req.session.userId);
    res.json({ tier });
  });

  // Member-facing: get PUBLISHED publications for the logged-in user's tier
  // Supports optional ?group=select|unlimited&date=YYYY-MM-DD
  app.get("/api/membership/publications", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Giriş yapılmamış." });
    const tier = await storage.getUserMemberTier(req.session.userId);
    if (!tier) return res.status(403).json({ error: "Aktif üyeliğiniz yok." });

    const date  = (req.query.date  as string) || istanbulToday();
    const group = (req.query.group as string) || undefined;
    const targetParam = (req.query.target as string) || undefined;
    const target = targetParam === "members_only" || targetParam === "profile" ? targetParam : "members_only";

    // Validate group param against user's tier access
    const allowedGroups = tier === "unlimited" ? ["select", "unlimited"] : ["select"];
    const tierFilter = group && allowedGroups.includes(group) ? group : undefined;

    // Build publication list — only published pubs
    const pubs: import("@shared/schema").MembershipPublicationWithLegs[] = [];
    if (!tierFilter) {
      // No group filter: return all accessible pubs
      const selectPubs = await storage.getMembershipPublications(date, "select", true, target);
      pubs.push(...selectPubs);
      if (tier === "unlimited") {
        const unlimitedPubs = await storage.getMembershipPublications(date, "unlimited", true, target);
        pubs.push(...unlimitedPubs);
      }
    } else {
      const filteredPubs = await storage.getMembershipPublications(date, tierFilter, true, target);
      pubs.push(...filteredPubs);
    }

    res.json({ tier, publications: pubs });
  });

  // Push today's settled coupons + profit to history tables
  app.post("/api/today/push-to-history", requireAdmin, async (req, res) => {
    const { date } = req.body;
    if (!date || typeof date !== "string") {
      return res.status(400).json({ error: "date required (YYYY-MM-DD)" });
    }

    const allCoupons = await storage.getTodayCoupons(date);
    const settled = allCoupons.filter((c) => c.status === "SETTLED");

    if (settled.length === 0) {
      return res.status(400).json({ error: "Sonuçlanmış kupon bulunamadı." });
    }

    // Calculate net profit from settled coupons
    const totalStake  = settled.reduce((s, c) => s + c.stake, 0);
    const wonCoupons  = settled.filter((c) => c.result === "WON");
    const totalReturn = wonCoupons.reduce(
      (s, c) => s + (c.returnAmount ?? c.stake * c.totalOdds),
      0
    );
    const netProfit = totalReturn - totalStake;

    // Upsert profit_entries (safe to re-run)
    const entry = await storage.upsertProfitEntry(date, netProfit);

    // Remove existing history_coupons for this date, then recreate (idempotent)
    await storage.deleteHistoryCouponsByDate(date);

    const now = new Date().toISOString();
    const historyCouponRecords = [];

    // Fetch today_matches to use as coupon legs
    const todayMatchList = await storage.getTodayMatches(date);

    // Map match result values to history leg result values
    function mapMatchResult(r: string | null): string {
      if (!r) return "pending";
      if (r === "postponed") return "void";
      return r; // "won" | "lost" | "void"
    }

    // Create fixtures once for all matches (reused across coupons)
    const fixtureMap: Map<number, number> = new Map(); // todayMatch.id → fixture.id
    for (const m of todayMatchList) {
      if (m.result === null) continue; // skip unsettled matches
      const fixture = await storage.createFixture({
        homeTeam:    m.homeTeam,
        awayTeam:    m.awayTeam,
        competition: m.competition,
        kickoffAt:   m.kickoffAt,
      });
      fixtureMap.set(m.id, fixture.id);
    }

    for (const c of settled) {
      const returnAmt =
        c.result === "WON"
          ? (c.returnAmount ?? c.stake * c.totalOdds)
          : 0;
      const netResult = returnAmt - c.stake;

      const hc = await storage.createHistoryCoupon({
        couponDate:     date,
        reference:      c.reference,
        label:          c.label,
        stake:          c.stake,
        totalOdds:      c.totalOdds,
        potentialReturn: c.stake * c.totalOdds,
        returnAmount:   returnAmt || null,
        netResult:      netResult,
        status:         "settled",
        result:         c.result?.toLowerCase() ?? null,
        preMatchImage:  c.preMatchImage ?? null,
        settledImage:   c.settledImage ?? null,
        publishedAt:    now,
        firstKickoffAt: c.firstKickoffAt,
        settledAt:      now,
      });

      // Create history_coupon_legs from today_matches (settled only)
      for (const m of todayMatchList) {
        const fxId = fixtureMap.get(m.id);
        if (!fxId) continue; // match was unsettled — skip
        await storage.createHistoryCouponLeg({
          couponId:  hc.id,
          fixtureId: fxId,
          selection: `${m.homeTeam} - ${m.awayTeam}`,
          market:    m.competition,
          odds:      1.0,
          result:    mapMatchResult(m.result),
        });
      }

      historyCouponRecords.push(hc);
    }

    res.json({ entry, historyCoupons: historyCouponRecords, netProfit });
  });

  // ── Site settings endpoints ──────────────────────────────────────────────────

  app.get("/api/settings/member-count", async (_req, res) => {
    const raw = await storage.getSetting("member_count_base");
    const base = raw ? parseInt(raw) : 1247;
    res.json({ base: isNaN(base) ? 1247 : base });
  });

  app.get("/api/community/stats", async (_req, res) => {
    const todayDate = todayIstanbul();
    const nowTime   = nowHHMM_Istanbul();

    // ── Apply pending counter increments via shared helper ──────────────────
    await applyPendingForDate(todayDate, nowTime);
    // Read back the now-current appliedCount for todayIncrease
    let currentApplied = 0;
    try {
      const [row] = await db.select({ appliedCount: counterDailyPlan.appliedCount })
        .from(counterDailyPlan).where(eq(counterDailyPlan.date, todayDate));
      currentApplied = row?.appliedCount ?? 0;
    } catch { /* non-fatal */ }

    const rawTotal = await storage.getSetting("member_count_base");
    const totalMembers = rawTotal ? parseInt(rawTotal) : 1247;

    // ── Dynamic "currently active" — hourly % of totalMembers (Istanbul) ──
    // Each entry: [minPct, maxPct] for hours 00–23
    const hourlyPct: [number, number][] = [
      [3.0, 4.5],  // 00
      [2.3, 3.6],  // 01
      [1.5, 2.8],  // 02
      [0.9, 1.8],  // 03
      [0.6, 1.3],  // 04
      [0.5, 1.1],  // 05
      [0.6, 1.3],  // 06
      [0.9, 1.7],  // 07
      [1.5, 2.5],  // 08
      [2.1, 3.2],  // 09
      [2.7, 3.8],  // 10
      [3.1, 4.3],  // 11
      [3.6, 4.8],  // 12
      [3.9, 5.1],  // 13
      [4.1, 5.4],  // 14
      [4.3, 5.7],  // 15
      [4.8, 6.3],  // 16
      [5.4, 7.0],  // 17
      [6.1, 7.8],  // 18
      [6.8, 8.8],  // 19
      [7.2, 9.7],  // 20
      [7.0, 9.4],  // 21
      [6.2, 8.2],  // 22
      [4.6, 6.4],  // 23
    ];
    const nowIst = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
    const h0 = nowIst.getHours();
    const h1 = (h0 + 1) % 24;
    const frac = nowIst.getMinutes() / 60; // 0–1 within the hour

    // Linear interpolation between current and next hour (midpoint %)
    const interpPct = (a: number, b: number) => a + (b - a) * frac;
    const minPct = interpPct(hourlyPct[h0][0], hourlyPct[h1][0]);
    const maxPct = interpPct(hourlyPct[h0][1], hourlyPct[h1][1]);

    // Widen the swing: ±2.5× half-range around midpoint for visible oscillation
    const mid = (minPct + maxPct) / 2;
    const halfRange = (maxPct - minPct) / 2;
    const widenedMin = Math.max(0, mid - halfRange * 2.5);
    const widenedMax = mid + halfRange * 2.5;

    // Deterministic jitter within widened band — slot changes every 10 s
    const slot = Math.floor(Date.now() / 10_000) % 180;
    const t = ((slot * 37 + 13) % 101) / 100; // 0–1, well-distributed
    const pct = widenedMin + (widenedMax - widenedMin) * t;
    const currentlyActive = Math.round(totalMembers * pct / 100);

    // ── Week increase — sum applied_count across last 7 days ──────
    const d7ago = new Date();
    d7ago.setDate(d7ago.getDate() - 6);
    const weekStart = d7ago.toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
    const weekPlans = await db.select({ appliedCount: counterDailyPlan.appliedCount })
      .from(counterDailyPlan)
      .where(gte(counterDailyPlan.date, weekStart));
    const weekIncrease = weekPlans.reduce((s, r) => s + r.appliedCount, 0);

    const recentActivity = [
      { id: "1", occurredAt: "09:15", amount: 1 },
      { id: "2", occurredAt: "12:40", amount: 2 },
      { id: "3", occurredAt: "16:10", amount: 1 },
    ];
    res.json({ totalMembers, currentlyActive, todayIncrease: currentApplied, weekIncrease, recentActivity });
  });

  // ── Admin counter endpoints ──────────────────────────────────────────────────

  // GET /api/admin/counter/plans — last 7 days + today's plan + base count
  app.get("/api/admin/counter/plans", async (req, res) => {
    const session = (req as any).session;
    if (!session?.userId) return res.status(401).json({ error: "Giriş yapılmamış." });
    const user = await storage.getUserById(session.userId);
    if (!user?.isAdmin) return res.status(403).json({ error: "Admin yetkisi gerekli." });

    const d7ago = new Date();
    d7ago.setDate(d7ago.getDate() - 6);
    const weekStart = d7ago.toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });

    const plans = await db.select().from(counterDailyPlan)
      .where(gte(counterDailyPlan.date, weekStart));

    const rawBase = await storage.getSetting("member_count_base");
    const parsedBase = rawBase ? parseInt(rawBase) : NaN;
    const baseCount = !isNaN(parsedBase) ? parsedBase : 1247;

    const result = plans.map(p => ({
      date:           p.date,
      totalIncrement: p.totalIncrement,
      scheduledTimes: JSON.parse(p.scheduledTimes) as string[],
      appliedCount:   p.appliedCount,
      whopCount:      p.whopCount ?? 0,
    }));

    res.json({ plans: result, baseCount, nowTime: nowHHMM_Istanbul() });
  });

  // POST /api/admin/counter/plan — create / replace a daily plan
  app.post("/api/admin/counter/plan", async (req, res) => {
    const session = (req as any).session;
    if (!session?.userId) return res.status(401).json({ error: "Giriş yapılmamış." });
    const user = await storage.getUserById(session.userId);
    if (!user?.isAdmin) return res.status(403).json({ error: "Admin yetkisi gerekli." });

    const { date, totalIncrement } = req.body;
    if (!date || typeof date !== "string") return res.status(400).json({ error: "Geçerli bir tarih gönderin." });
    const n = parseInt(String(totalIncrement ?? ""));
    // Max 900 = total unique HH:MM slots in the 08:00–22:59 window
    if (isNaN(n) || n < 0 || n > 900) {
      return res.status(400).json({ error: "totalIncrement 0–900 arasında olmalı." });
    }

    const nowTime   = nowHHMM_Istanbul();
    const todayDate = todayIstanbul();

    // Generate new schedule
    const times = generateRandomTimes(n);
    // For future dates nothing has passed yet; for today count past slots; for past dates count all.
    const newApplied = date > todayDate
      ? 0
      : times.filter(t => t <= nowTime).length;

    await db.transaction(async (tx) => {
      // Read existing plan to compute the delta for member_count_base
      const [existing] = await tx.select({ appliedCount: counterDailyPlan.appliedCount })
        .from(counterDailyPlan)
        .where(eq(counterDailyPlan.date, date));
      const oldApplied = existing?.appliedCount ?? 0;
      const delta = newApplied - oldApplied;

      // Upsert the plan with the recalculated applied count
      await tx.insert(counterDailyPlan)
        .values({
          date,
          totalIncrement: n,
          scheduledTimes: JSON.stringify(times),
          appliedCount:   newApplied,
          updatedAt:      new Date(),
        })
        .onConflictDoUpdate({
          target: counterDailyPlan.date,
          set: {
            totalIncrement: n,
            scheduledTimes: JSON.stringify(times),
            appliedCount:   newApplied,
            updatedAt:      new Date(),
          },
        });

      // Adjust member_count_base by the delta (may be positive, negative, or zero)
      if (delta !== 0) {
        await tx.execute(
          sql`UPDATE site_settings SET value = GREATEST(0, CAST(value AS INTEGER) + ${delta})::TEXT WHERE key = 'member_count_base'`,
        );
      }
    });

    res.json({ date, totalIncrement: n, scheduledTimes: times, appliedCount: newApplied });
  });

  app.post("/api/admin/settings/member-count", async (req, res) => {
    const session = (req as any).session;
    if (!session?.userId) return res.status(401).json({ error: "Giriş yapılmamış." });
    const user = await storage.getUserById(session.userId);
    if (!user?.isAdmin) return res.status(403).json({ error: "Admin yetkisi gerekli." });
    const { base } = req.body;
    const n = parseInt(String(base ?? ""));
    if (isNaN(n) || n < 0) return res.status(400).json({ error: "Geçerli bir sayı girin." });
    await storage.setSetting("member_count_base", String(n));
    res.json({ base: n });
  });

  // ── Membership daily summary endpoints ───────────────────────────────────────

  app.get("/api/membership-summary", async (req, res) => {
    const date = req.query.date as string;
    const tier = req.query.tier as string;
    if (!date || !tier) return res.status(400).json({ error: "date and tier required" });
    const row = await storage.getMembershipSummary(date, tier);
    res.json(row ? { title: row.title ?? "", totalCoupons: row.totalCoupons, totalMatches: row.totalMatches } : { title: "", totalCoupons: 0, totalMatches: 0 });
  });

  app.post("/api/membership-summary", async (req, res) => {
    const session = (req as any).session;
    if (!session?.userId) return res.status(401).json({ error: "Giriş yapılmamış." });
    const user = await storage.getUserById(session.userId);
    if (!user?.isAdmin) return res.status(403).json({ error: "Admin yetkisi gerekli." });
    const { date, tier, title, totalCoupons, totalMatches } = req.body;
    if (!date || !tier) return res.status(400).json({ error: "date and tier required" });
    const tc = parseInt(String(totalCoupons ?? 0));
    const tm = parseInt(String(totalMatches ?? 0));
    if (isNaN(tc) || isNaN(tm) || tc < 0 || tm < 0) return res.status(400).json({ error: "totalCoupons and totalMatches must be non-negative integers" });
    const row = await storage.upsertMembershipSummary({ date, tier, title: title ?? null, totalCoupons: tc, totalMatches: tm });
    res.json({ title: row.title ?? "", totalCoupons: row.totalCoupons, totalMatches: row.totalMatches });
  });

  // ── Font embed endpoint — returns fully self-contained CSS with fonts as
  //    base64 data URIs. html-to-image uses this via fontEmbedCSS option,
  //    bypassing stylesheet scanning (which fails on cross-origin sheets). ──
  let _fontEmbedCSSCache: string | null = null;
  app.get("/api/font-css", async (_req, res) => {
    try {
      if (_fontEmbedCSSCache) {
        res.set("Content-Type", "text/css; charset=utf-8");
        res.set("Cache-Control", "public, max-age=86400");
        return res.send(_fontEmbedCSSCache);
      }

      const families = [
        "Manrope:wght@400;500;600;700;800",
        "DM+Serif+Display:ital@0;1",
        "Cormorant+Garamond:wght@400;500;600",
        "Montserrat:wght@400;500;600;700",
        "Barlow+Condensed:wght@600;700",
        "Bodoni+Moda:opsz,wght@6..96,400;6..96,500;6..96,600;6..96,700;6..96,800;6..96,900",
        "Inter:wght@300;400;500;600;700;800",
        "Plus+Jakarta+Sans:wght@400;500;600;700",
      ];
      const gfontsUrl = `https://fonts.googleapis.com/css2?family=${families.join("&family=")}&display=swap`;
      const rawCss = await fetch(gfontsUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
      }).then(r => r.text());

      // Filter to Latin subset only (keeps size manageable).
      // A @font-face block is "latin" if its unicode-range contains U+0000 OR has no unicode-range.
      const blocks = rawCss.split(/(?=@font-face\s*\{)/);
      const latinBlocks = blocks.filter(block => {
        if (!block.includes("@font-face")) return true; // header comment etc
        if (!block.includes("unicode-range")) return true; // no range = catch-all
        // Keep latin (U+0000) and latin-ext (U+0100) subsets.
        // latin-ext is required for Turkish diacritics (İ, Ş, Ğ, ğ, ş, ı, ç, ö, ü).
        return block.includes("U+0000") || block.includes("U+0100");
      });
      let filteredCss = latinBlocks.join("");

      // Embed each woff2/woff URL as base64 data URI.
      // Collect all replacements first, then apply sequentially to avoid race conditions.
      const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
      const urlsFound: string[] = [];
      let m;
      while ((m = urlRegex.exec(filteredCss)) !== null) {
        if (!urlsFound.includes(m[1])) urlsFound.push(m[1]);
      }

      // Fetch all font files in parallel, collect results
      const replacements = await Promise.all(urlsFound.map(async (fontUrl) => {
        try {
          const buf = await fetch(fontUrl).then(r => r.arrayBuffer());
          const b64 = Buffer.from(buf).toString("base64");
          const mime = fontUrl.includes(".woff2") ? "font/woff2" : "font/woff";
          return { fontUrl, dataUri: `data:${mime};base64,${b64}` };
        } catch { return null; }
      }));

      // Apply replacements sequentially (no concurrent mutation)
      for (const rep of replacements) {
        if (rep) filteredCss = filteredCss.split(rep.fontUrl).join(rep.dataUri);
      }

      _fontEmbedCSSCache = filteredCss;
      res.set("Content-Type", "text/css; charset=utf-8");
      res.set("Cache-Control", "public, max-age=86400");
      res.send(_fontEmbedCSSCache);
    } catch (err) {
      console.error("Font CSS proxy error:", err);
      res.status(502).send("/* font proxy error */");
    }
  });

  // ── Startup: fix data anomalies + catch up past missed increments ───────────
  (async () => {
    try {
      const todayStr = todayIstanbul();

      // 1. Reset any future-date plans that have premature applied_count > 0
      //    (e.g. July 31 ended up with applied_count=7 due to a past bug)
      const allPlans = await db.select().from(counterDailyPlan);
      for (const plan of allPlans) {
        if (plan.date > todayStr && plan.appliedCount > 0) {
          await db.transaction(async (tx) => {
            const delta = plan.appliedCount;
            const updated = await tx.update(counterDailyPlan)
              .set({ appliedCount: 0, updatedAt: new Date() })
              .where(and(
                eq(counterDailyPlan.date, plan.date),
                eq(counterDailyPlan.appliedCount, delta),
              ))
              .returning();
            if (updated.length > 0) {
              await tx.execute(
                sql`UPDATE site_settings SET value = GREATEST(0, CAST(value AS INTEGER) - ${delta})::TEXT WHERE key = 'member_count_base'`,
              );
            }
          });
        }
      }

      // 2. Apply any missed increments for all past dates
      for (const plan of allPlans) {
        if (plan.date < todayStr) {
          await applyPendingForDate(plan.date, "23:59");
        }
      }
    } catch { /* non-fatal */ }
  })();

  // ── Meta → Telegram tracker admin endpoints ──────────────────────────────────

  // The admin UI sends calendar dates in Europe/Istanbul. Turkey is UTC+03:00,
  // so date-only filters must be interpreted as Istanbul midnight rather than
  // UTC midnight; otherwise 00:00–02:59 Istanbul events disappear from Today.
  const istanbulDayStart = (date: string) => new Date(`${date}T00:00:00+03:00`);
  const istanbulDayEnd = (date: string) => new Date(`${date}T23:59:59.999+03:00`);

  /**
   * GET /api/admin/tracker/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
   * Returns only post-reset data, optionally narrowed by date range.
   * sinceTestStart=1 overrides from/to and uses TRACKER_TEST_START_UTC as the lower bound.
   */
  app.get("/api/admin/tracker/stats", requireAdmin, async (req, res) => {
    try {
      const q = req.query as Record<string, string | undefined>;
      const resetSetting = await db.select({ value: siteSettings.value })
        .from(siteSettings).where(eq(siteSettings.key, "tracker_reset_at"));
      const resetAt = resetSetting[0]?.value ? new Date(resetSetting[0].value) : new Date(0);

      const whereClauses: any[] = [];
      whereClauses.push(gte(adRedirectEvents.createdAt, resetAt));
      // QA visits are retained for auditing but never affect experiment totals.
      whereClauses.push(eq(adRedirectEvents.isQa, false));
      if (q.from) whereClauses.push(gte(adRedirectEvents.createdAt, istanbulDayStart(q.from)));
      if (q.to)   whereClauses.push(lteOp(adRedirectEvents.createdAt, istanbulDayEnd(q.to)));

      const rows = whereClauses.length
        ? await db.select().from(adRedirectEvents).where(and(...whereClauses))
        : await db.select().from(adRedirectEvents);

      // Per-slug aggregation buckets
      interface SlugBucket {
        label: string;
        rawRequests: number;
        knownBot: number;
        browserLike: number;
        confirmedRedirects: number;
        confirmedPageVisitors: number;
        challengeShown: number;
        challengePassed: number;
        telegramButtonClicks: number;
        confirmedHashes: Set<string>;
        lastRequest: string | null;
      }
      const slugStats: Record<string, SlugBucket> = {};
      for (const slug of Object.keys(AD_SLUG_MAP)) {
        slugStats[slug] = {
          label: AD_SLUG_MAP[slug].label,
          rawRequests: 0,
          knownBot: 0,
          browserLike: 0,
          confirmedRedirects: 0,
          confirmedPageVisitors: 0,
          challengeShown: 0,
          challengePassed: 0,
          telegramButtonClicks: 0,
          confirmedHashes: new Set(),
          lastRequest: null,
        };
      }

      for (const row of rows) {
        const s = slugStats[row.slug];
        if (!s) continue;

        const ts = row.createdAt.toISOString();
        if (!s.lastRequest || ts > s.lastRequest) s.lastRequest = ts;

        const evType = (row as any).eventType ?? "REQUEST_SEEN";
        const cls    = row.classification ?? "BROWSER_LIKE_REQUEST";

        if (evType === "CONFIRMED_BROWSER_REDIRECT") {
          s.confirmedRedirects++;
          if ((row as any).hashedIp) s.confirmedHashes.add((row as any).hashedIp as string);
        } else if (evType === "PAGE_CONFIRMED") {
          s.confirmedPageVisitors++;
          if ((row as any).hashedIp) s.confirmedHashes.add((row as any).hashedIp as string);
        } else if (evType === "CHALLENGE_SHOWN" || evType === "PAGE_2_SECOND") {
          // PAGE_2_SECOND is legacy from before the challenge was introduced
          s.challengeShown++;
        } else if (evType === "HUMAN_CHALLENGE_PASSED") {
          s.challengePassed++;
        } else if (evType === "TELEGRAM_BUTTON_CLICK") {
          s.telegramButtonClicks++;
        } else {
          // REQUEST_SEEN
          s.rawRequests++;
          if (cls === "KNOWN_BOT_OR_PREFETCH") s.knownBot++;
          else s.browserLike++;
        }
      }

      const slugResults = Object.entries(slugStats).map(([slug, s]) => ({
        slug,
        label: s.label,
        rawRequests: s.rawRequests,
        knownBot: s.knownBot,
        browserLike: s.browserLike,
        confirmedRedirects: s.confirmedRedirects,
        confirmedUniqueBrowsers: s.confirmedHashes.size,
        confirmedPageVisitors: s.confirmedPageVisitors,
        challengeShown: s.challengeShown,
        challengePassed: s.challengePassed,
        challengePassRate: s.challengeShown
          ? Number(((s.challengePassed / s.challengeShown) * 100).toFixed(1))
          : 0,
        telegramButtonClicks: s.telegramButtonClicks,
        lastRequest: s.lastRequest,
      }));

      // Global unique confirmed browsers — a single browser confirmed on
      // multiple slugs must count once, not once per slug.
      const globalConfirmedHashes = new Set<string>();
      Object.values(slugStats).forEach((s) =>
        s.confirmedHashes.forEach((h) => globalConfirmedHashes.add(h)),
      );

      const overall = {
        rawRequests:             slugResults.reduce((a, b) => a + b.rawRequests, 0),
        knownBot:                slugResults.reduce((a, b) => a + b.knownBot, 0),
        browserLike:             slugResults.reduce((a, b) => a + b.browserLike, 0),
        confirmedRedirects:      slugResults.reduce((a, b) => a + b.confirmedRedirects, 0),
        confirmedUniqueBrowsers: globalConfirmedHashes.size,
        confirmedPageVisitors:   slugResults.reduce((a, b) => a + b.confirmedPageVisitors, 0),
        challengeShown:          slugResults.reduce((a, b) => a + b.challengeShown, 0),
        challengePassed:         slugResults.reduce((a, b) => a + b.challengePassed, 0),
        telegramButtonClicks:    slugResults.reduce((a, b) => a + b.telegramButtonClicks, 0),
        resetAt:                 resetAt.toISOString(),
      };
      const overallWithRate = {
        ...overall,
        challengePassRate: overall.challengeShown
          ? Number(((overall.challengePassed / overall.challengeShown) * 100).toFixed(1))
          : 0,
      };

      res.json({ slugs: slugResults, overall: overallWithRate });
    } catch (err) {
      console.error("[tracker-stats] error:", err);
      res.status(500).json({ error: "Stats could not be loaded." });
    }
  });

  /**
   * GET /api/admin/tracker/events?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=50
   * Returns recent post-reset events. Requires admin session.
   */
  app.get("/api/admin/tracker/events", requireAdmin, async (req, res) => {
    try {
      const q = req.query as Record<string, string | undefined>;
      const maxRows = Math.min(parseInt(q.limit ?? "100", 10) || 100, 500);
      const resetSetting = await db.select({ value: siteSettings.value })
        .from(siteSettings).where(eq(siteSettings.key, "tracker_reset_at"));
      const resetAt = resetSetting[0]?.value ? new Date(resetSetting[0].value) : new Date(0);

      const whereClauses: any[] = [];
      whereClauses.push(gte(adRedirectEvents.createdAt, resetAt));
      if (q.includeQa !== "1") whereClauses.push(eq(adRedirectEvents.isQa, false));
      if (q.from) whereClauses.push(gte(adRedirectEvents.createdAt, istanbulDayStart(q.from)));
      if (q.to)   whereClauses.push(lteOp(adRedirectEvents.createdAt, istanbulDayEnd(q.to)));

      const rows = whereClauses.length
        ? await db.select().from(adRedirectEvents)
            .where(and(...whereClauses))
            .orderBy(descOp(adRedirectEvents.createdAt))
            .limit(maxRows)
        : await db.select().from(adRedirectEvents)
            .orderBy(descOp(adRedirectEvents.createdAt))
            .limit(maxRows);

      const events = rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        label: AD_SLUG_MAP[r.slug]?.label ?? r.slug,
        createdAt: r.createdAt.toISOString(),
        deviceCategory: r.deviceCategory,
        eventType: (r as any).eventType ?? "REQUEST_SEEN",
        classification: r.classification,
        referrer: r.referrer ?? null,
        userAgentSummary: r.userAgent ? r.userAgent.slice(0, 120) : null,
        isQa: r.isQa,
      }));

      res.json({ events });
    } catch (err) {
      console.error("[tracker-events] error:", err);
      res.status(500).json({ error: "Events could not be loaded." });
    }
  });

  registerAgentReportRoutes(app, requireAdmin);

  // ── Background interval: apply increments every 60s without needing traffic ─
  setInterval(async () => {
    try {
      const todayStr  = todayIstanbul();
      const nowTime   = nowHHMM_Istanbul();
      // Today
      await applyPendingForDate(todayStr, nowTime);
      // Yesterday — catch any late-night increments missed at day rollover
      const yd = new Date();
      yd.setDate(yd.getDate() - 1);
      const yesterday = yd.toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
      await applyPendingForDate(yesterday, "23:59");
    } catch { /* non-fatal */ }
  }, 60_000);

  return httpServer;
}
