import {
  type User,
  type InsertUser,
  type ProfitEntry,
  type InsertProfitEntry,
  type Match,
  type InsertMatch,
  type Coupon,
  type InsertCoupon,
  type CouponSelection,
  type InsertCouponSelection,
  type CouponWithSelections,
  type Fixture,
  type InsertFixture,
  type HistoryCoupon,
  type InsertHistoryCoupon,
  type HistoryCouponLeg,
  type InsertHistoryCouponLeg,
  type TodayMatch,
  type InsertTodayMatch,
  type TodayCoupon,
  type InsertTodayCoupon,
  type TodayPublicPick,
  type InsertTodayPublicPick,
  type MembershipPublication,
  type InsertMembershipPublication,
  type MembershipPubLeg,
  type InsertMembershipPubLeg,
  type MembershipPublicationWithLegs,
  type MembershipDailySummary,
  type InsertMembershipDailySummary,
  type TermsAcceptance,
  type InsertTermsAcceptance,
  users,
  profitEntries,
  matches,
  coupons,
  couponSelections,
  fixtures,
  historyCoupons,
  historyCouponLegs,
  todayMatches,
  todayCoupons,
  todayPublicPick,
  todayPublished,
  membershipPublications,
  membershipPubLegs,
  membershipDailySummaries,
  siteSettings,
  termsAcceptances,
  whopPendingGrants,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, gte, lte, and, isNotNull, inArray } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllEntries(): Promise<ProfitEntry[]>;
  getEntryByDate(date: string): Promise<ProfitEntry | undefined>;
  createEntry(entry: InsertProfitEntry): Promise<ProfitEntry>;
  upsertProfitEntry(date: string, value: number): Promise<ProfitEntry>;
  deleteEntry(id: number): Promise<void>;
  getAllMatches(): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  deleteMatch(id: number): Promise<void>;
  // Coupons
  getAllCoupons(): Promise<CouponWithSelections[]>;
  getCoupon(id: number): Promise<CouponWithSelections | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: number, coupon: Partial<InsertCoupon>): Promise<Coupon>;
  deleteCoupon(id: number): Promise<void>;
  // Coupon Selections
  getSelectionsForCoupon(couponId: number): Promise<CouponSelection[]>;
  createSelection(selection: InsertCouponSelection): Promise<CouponSelection>;
  updateSelection(id: number, selection: Partial<InsertCouponSelection>): Promise<CouponSelection>;
  deleteSelection(id: number): Promise<void>;
  recalculateCouponFinancials(couponId: number): Promise<Coupon>;
  // History (Geçmiş page)
  getAllFixtures(): Promise<Fixture[]>;
  createFixture(data: InsertFixture): Promise<Fixture>;
  getAllHistoryCoupons(startDate?: string, endDate?: string): Promise<HistoryCoupon[]>;
  getHistoryCouponById(id: number): Promise<HistoryCoupon | undefined>;
  createHistoryCoupon(data: InsertHistoryCoupon): Promise<HistoryCoupon>;
  deleteHistoryCouponsByDate(date: string): Promise<void>;
  getAllHistoryCouponLegs(): Promise<HistoryCouponLeg[]>;
  getHistoryCouponLegsForCoupon(couponId: number): Promise<HistoryCouponLeg[]>;
  createHistoryCouponLeg(data: InsertHistoryCouponLeg): Promise<HistoryCouponLeg>;
  // Today (Bugün page)
  getAllSettledTodayMatches(): Promise<TodayMatch[]>;
  getTodayMatches(date: string): Promise<TodayMatch[]>;
  createTodayMatch(data: InsertTodayMatch): Promise<TodayMatch>;
  upsertTodayMatch(data: InsertTodayMatch): Promise<TodayMatch | null>;
  updateTodayMatch(id: number, result: string | null): Promise<TodayMatch>;
  deleteTodayMatch(id: number): Promise<void>;
  getTodayCoupons(date: string): Promise<TodayCoupon[]>;
  getTodayCouponById(id: number): Promise<TodayCoupon | undefined>;
  createTodayCoupon(data: InsertTodayCoupon): Promise<TodayCoupon>;
  updateTodayCoupon(id: number, data: Partial<InsertTodayCoupon>): Promise<TodayCoupon>;
  deleteTodayCoupon(id: number): Promise<void>;
  getAllPublicPicks(): Promise<TodayPublicPick[]>;
  getAllPublishedDates(): Promise<Record<string, Date | null>>;
  getTodayPublicPick(date: string): Promise<TodayPublicPick | undefined>;
  upsertTodayPublicPick(data: InsertTodayPublicPick): Promise<TodayPublicPick>;
  updateTodayPublicPick(id: number, data: Partial<InsertTodayPublicPick>): Promise<TodayPublicPick>;
  deleteTodayPublicPick(id: number): Promise<void>;
  // Publish gating
  isTodayPublished(date: string): Promise<{ published: boolean; publishedAt: Date | null }>;
  publishToday(date: string, publishedAt?: Date): Promise<void>;
  updatePublishedAt(date: string, publishedAt: Date): Promise<void>;
  unpublishToday(date: string): Promise<void>;
  getLatestPublishedDate(): Promise<string | null>;
  // Membership publications
  getMembershipPublications(date?: string, tier?: string, publishedOnly?: boolean): Promise<MembershipPublicationWithLegs[]>;
  getMembershipPublicationById(id: number): Promise<MembershipPublicationWithLegs | undefined>;
  createMembershipPublication(data: InsertMembershipPublication): Promise<MembershipPublication>;
  updateMembershipPublication(id: number, data: Partial<InsertMembershipPublication>): Promise<MembershipPublication>;
  publishMembershipPublication(id: number): Promise<MembershipPublication>;
  unpublishMembershipPublication(id: number): Promise<MembershipPublication>;
  scheduleMembershipPublication(id: number, scheduledAt: Date): Promise<MembershipPublication>;
  deleteMembershipPublication(id: number): Promise<void>;
  createMembershipPubLeg(data: InsertMembershipPubLeg): Promise<MembershipPubLeg>;
  updateMembershipPubLeg(id: number, data: Partial<InsertMembershipPubLeg>): Promise<MembershipPubLeg>;
  deleteMembershipPubLeg(id: number): Promise<void>;
  setUserMemberTier(userId: number, tier: string | null, options?: { override?: boolean }): Promise<void>;
  // Whop-automation writes — each guards atomically via `WHERE tier_override = false`
  // so a concurrent admin override always wins regardless of read-then-write timing.
  applyWhopTierIfNotOverridden(userId: number, tier: string | null): Promise<boolean>;
  applyWhopExpiryIfNotOverridden(userId: number, expiresAt: Date | null): Promise<boolean>;
  // Authoritative access check: treats an elapsed membershipExpiresAt as "no tier",
  // regardless of what's still stored in member_tier. Every access-gating check
  // (publications, images, /api/auth/me/tier) must go through this, not a raw column read.
  getUserMemberTier(userId: number): Promise<string | null>;
  // Raw membership state for display purposes (e.g. showing "Unlimited — expired" on the
  // account page). Does NOT imply access — use getUserMemberTier for that.
  getUserMembership(userId: number): Promise<{ tier: string | null; effectiveTier: string | null; expiresAt: Date | null }>;
  setUserMembershipExpiry(userId: number, expiresAt: Date | null): Promise<void>;
  updateUserEmail(userId: number, email: string): Promise<void>;
  updateUserPasswordHash(userId: number, passwordHash: string): Promise<void>;
  getUserById(id: number): Promise<{ id: number; email: string; isAdmin: boolean } | undefined>;
  setUserAdmin(id: number, isAdmin: boolean): Promise<void>;
  hasAnyAdmin(): Promise<boolean>;
  // Membership daily summaries
  getMembershipSummary(date: string, tier: string): Promise<MembershipDailySummary | null>;
  upsertMembershipSummary(data: InsertMembershipDailySummary): Promise<MembershipDailySummary>;
  // Site settings
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
  // Terms & Conditions acceptance (append-only)
  createTermsAcceptance(data: InsertTermsAcceptance): Promise<TermsAcceptance>;
  hasAcceptedTermsVersion(userId: number, version: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllEntries(): Promise<ProfitEntry[]> {
    return db.select().from(profitEntries).orderBy(desc(profitEntries.date));
  }

  async getEntryByDate(date: string): Promise<ProfitEntry | undefined> {
    const [entry] = await db.select().from(profitEntries).where(eq(profitEntries.date, date));
    return entry;
  }

  async createEntry(entry: InsertProfitEntry): Promise<ProfitEntry> {
    const [created] = await db.insert(profitEntries).values(entry).returning();
    return created;
  }

  async upsertProfitEntry(date: string, value: number): Promise<ProfitEntry> {
    const existing = await this.getEntryByDate(date);
    if (existing) {
      const [updated] = await db.update(profitEntries).set({ value }).where(eq(profitEntries.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(profitEntries).values({ date, value }).returning();
    return created;
  }

  async deleteEntry(id: number): Promise<void> {
    await db.delete(profitEntries).where(eq(profitEntries.id, id));
  }

  async getAllMatches(): Promise<Match[]> {
    return db.select().from(matches).orderBy(desc(matches.date));
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [created] = await db.insert(matches).values(match).returning();
    return created;
  }

  async deleteMatch(id: number): Promise<void> {
    await db.delete(matches).where(eq(matches.id, id));
  }

  async getAllCoupons(): Promise<CouponWithSelections[]> {
    const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.id));
    const result: CouponWithSelections[] = [];
    for (const coupon of allCoupons) {
      const sels = await db
        .select()
        .from(couponSelections)
        .where(eq(couponSelections.couponId, coupon.id))
        .orderBy(asc(couponSelections.sortOrder));
      result.push({ ...coupon, selections: sels });
    }
    return result;
  }

  async getCoupon(id: number): Promise<CouponWithSelections | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id));
    if (!coupon) return undefined;
    const sels = await db
      .select()
      .from(couponSelections)
      .where(eq(couponSelections.couponId, id))
      .orderBy(asc(couponSelections.sortOrder));
    return { ...coupon, selections: sels };
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const [created] = await db.insert(coupons).values(coupon).returning();
    return created;
  }

  async updateCoupon(id: number, coupon: Partial<InsertCoupon>): Promise<Coupon> {
    const [updated] = await db.update(coupons).set(coupon).where(eq(coupons.id, id)).returning();
    return updated;
  }

  async deleteCoupon(id: number): Promise<void> {
    await db.delete(couponSelections).where(eq(couponSelections.couponId, id));
    await db.delete(coupons).where(eq(coupons.id, id));
  }

  async getSelectionsForCoupon(couponId: number): Promise<CouponSelection[]> {
    return db
      .select()
      .from(couponSelections)
      .where(eq(couponSelections.couponId, couponId))
      .orderBy(asc(couponSelections.sortOrder));
  }

  async createSelection(selection: InsertCouponSelection): Promise<CouponSelection> {
    const [created] = await db.insert(couponSelections).values(selection).returning();
    return created;
  }

  async updateSelection(id: number, selection: Partial<InsertCouponSelection>): Promise<CouponSelection> {
    const [updated] = await db
      .update(couponSelections)
      .set(selection)
      .where(eq(couponSelections.id, id))
      .returning();
    return updated;
  }

  async deleteSelection(id: number): Promise<void> {
    await db.delete(couponSelections).where(eq(couponSelections.id, id));
  }

  async recalculateCouponFinancials(couponId: number): Promise<Coupon> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.id, couponId));
    if (!coupon) throw new Error(`Coupon ${couponId} not found`);
    const sels = await db.select().from(couponSelections).where(eq(couponSelections.couponId, couponId));
    const totalOdds = sels.reduce((acc, s) => acc * s.odds, 1);
    const potentialReturn = totalOdds * coupon.stake;
    const [updated] = await db
      .update(coupons)
      .set({ totalOdds, potentialReturn })
      .where(eq(coupons.id, couponId))
      .returning();
    return updated;
  }

  // ── History (Geçmiş page) ─────────────────────────────────────────────────

  async getAllFixtures(): Promise<Fixture[]> {
    return db.select().from(fixtures).orderBy(asc(fixtures.kickoffAt));
  }

  async createFixture(data: InsertFixture): Promise<Fixture> {
    const [created] = await db.insert(fixtures).values(data).returning();
    return created;
  }

  async getAllHistoryCoupons(startDate?: string, endDate?: string): Promise<HistoryCoupon[]> {
    const conditions = [];
    if (startDate) conditions.push(gte(historyCoupons.couponDate, startDate));
    if (endDate)   conditions.push(lte(historyCoupons.couponDate, endDate));
    const query = conditions.length
      ? db.select().from(historyCoupons).where(and(...conditions))
      : db.select().from(historyCoupons);
    return query.orderBy(desc(historyCoupons.couponDate));
  }

  async getHistoryCouponById(id: number): Promise<HistoryCoupon | undefined> {
    const [row] = await db.select().from(historyCoupons).where(eq(historyCoupons.id, id));
    return row;
  }

  async createHistoryCoupon(data: InsertHistoryCoupon): Promise<HistoryCoupon> {
    const [created] = await db.insert(historyCoupons).values(data).returning();
    return created;
  }

  async deleteHistoryCouponsByDate(date: string): Promise<void> {
    await db.delete(historyCoupons).where(eq(historyCoupons.couponDate, date));
  }

  async getAllHistoryCouponLegs(): Promise<HistoryCouponLeg[]> {
    return db.select().from(historyCouponLegs).orderBy(asc(historyCouponLegs.id));
  }

  async getHistoryCouponLegsForCoupon(couponId: number): Promise<HistoryCouponLeg[]> {
    return db.select().from(historyCouponLegs).where(eq(historyCouponLegs.couponId, couponId));
  }

  async createHistoryCouponLeg(data: InsertHistoryCouponLeg): Promise<HistoryCouponLeg> {
    const [created] = await db.insert(historyCouponLegs).values(data).returning();
    return created;
  }

  // ── Today (Bugün page) ────────────────────────────────────────────────────

  async getAllSettledTodayMatches(): Promise<TodayMatch[]> {
    return db.select().from(todayMatches)
      .where(isNotNull(todayMatches.result))
      .orderBy(desc(todayMatches.date), asc(todayMatches.kickoffAt));
  }

  async getTodayMatches(date: string): Promise<TodayMatch[]> {
    return db.select().from(todayMatches)
      .where(eq(todayMatches.date, date))
      .orderBy(asc(todayMatches.kickoffAt));
  }

  async upsertTodayMatch(data: InsertTodayMatch): Promise<TodayMatch | null> {
    const existing = await db.select().from(todayMatches)
      .where(and(
        eq(todayMatches.date, data.date),
        eq(todayMatches.homeTeam, data.homeTeam),
        eq(todayMatches.awayTeam, data.awayTeam),
      ));
    if (existing.length > 0) return null;
    const [created] = await db.insert(todayMatches).values(data).returning();
    return created;
  }

  async createTodayMatch(data: InsertTodayMatch): Promise<TodayMatch> {
    const [created] = await db.insert(todayMatches).values(data).returning();
    return created;
  }

  async updateTodayMatch(id: number, result: string | null): Promise<TodayMatch> {
    const [updated] = await db.update(todayMatches).set({ result }).where(eq(todayMatches.id, id)).returning();
    return updated;
  }

  async deleteTodayMatch(id: number): Promise<void> {
    await db.delete(todayMatches).where(eq(todayMatches.id, id));
  }

  async getTodayCoupons(date: string): Promise<TodayCoupon[]> {
    return db.select().from(todayCoupons)
      .where(eq(todayCoupons.date, date))
      .orderBy(asc(todayCoupons.id));
  }

  async getTodayCouponById(id: number): Promise<TodayCoupon | undefined> {
    const [row] = await db.select().from(todayCoupons).where(eq(todayCoupons.id, id));
    return row;
  }

  async createTodayCoupon(data: InsertTodayCoupon): Promise<TodayCoupon> {
    const [created] = await db.insert(todayCoupons).values(data).returning();
    return created;
  }

  async updateTodayCoupon(id: number, data: Partial<InsertTodayCoupon>): Promise<TodayCoupon> {
    const [updated] = await db.update(todayCoupons).set(data).where(eq(todayCoupons.id, id)).returning();
    return updated;
  }

  async deleteTodayCoupon(id: number): Promise<void> {
    await db.delete(todayCoupons).where(eq(todayCoupons.id, id));
  }

  async getAllPublicPicks(): Promise<TodayPublicPick[]> {
    return db.select().from(todayPublicPick).orderBy(desc(todayPublicPick.date));
  }

  async getAllPublishedDates(): Promise<Record<string, Date | null>> {
    const rows = await db.select({ date: todayPublished.date, publishedAt: todayPublished.publishedAt }).from(todayPublished);
    const map: Record<string, Date | null> = {};
    for (const row of rows) map[row.date] = row.publishedAt ?? null;
    return map;
  }

  async getTodayPublicPick(date: string): Promise<TodayPublicPick | undefined> {
    const [pick] = await db.select().from(todayPublicPick)
      .where(eq(todayPublicPick.date, date))
      .orderBy(desc(todayPublicPick.id))
      .limit(1);
    return pick;
  }

  async upsertTodayPublicPick(data: InsertTodayPublicPick): Promise<TodayPublicPick> {
    const existing = await this.getTodayPublicPick(data.date);
    if (existing) {
      const [updated] = await db.update(todayPublicPick).set(data).where(eq(todayPublicPick.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(todayPublicPick).values(data).returning();
    return created;
  }

  async updateTodayPublicPick(id: number, data: Partial<InsertTodayPublicPick>): Promise<TodayPublicPick> {
    const [updated] = await db.update(todayPublicPick).set(data).where(eq(todayPublicPick.id, id)).returning();
    return updated;
  }

  async deleteTodayPublicPick(id: number): Promise<void> {
    await db.delete(todayPublicPick).where(eq(todayPublicPick.id, id));
  }

  async isTodayPublished(date: string): Promise<{ published: boolean; publishedAt: Date | null }> {
    const [row] = await db.select().from(todayPublished).where(eq(todayPublished.date, date));
    return { published: !!row, publishedAt: row?.publishedAt ?? null };
  }

  async publishToday(date: string, publishedAt?: Date): Promise<void> {
    await db
      .insert(todayPublished)
      .values({ date, publishedAt: publishedAt ?? new Date() })
      .onConflictDoNothing();
  }

  async updatePublishedAt(date: string, publishedAt: Date): Promise<void> {
    await db
      .update(todayPublished)
      .set({ publishedAt })
      .where(eq(todayPublished.date, date));
  }

  async unpublishToday(date: string): Promise<void> {
    await db.delete(todayPublished).where(eq(todayPublished.date, date));
  }

  async getLatestPublishedDate(): Promise<string | null> {
    const [row] = await db
      .select({ date: todayPublished.date })
      .from(todayPublished)
      .orderBy(desc(todayPublished.date))
      .limit(1);
    return row?.date ?? null;
  }

  // ── Membership publications ────────────────────────────────────────────────

  async getMembershipPublications(date?: string, tier?: string, publishedOnly?: boolean, target?: string): Promise<MembershipPublicationWithLegs[]> {
    const conditions = [];
    if (date) conditions.push(eq(membershipPublications.date, date));
    if (tier) conditions.push(eq(membershipPublications.tier, tier));
    if (publishedOnly) conditions.push(eq(membershipPublications.pubStatus, "published"));
    if (target) conditions.push(eq(membershipPublications.target, target));

    const pubs = conditions.length
      ? await db.select().from(membershipPublications).where(and(...conditions)).orderBy(desc(membershipPublications.createdAt))
      : await db.select().from(membershipPublications).orderBy(desc(membershipPublications.createdAt));

    if (!pubs.length) return [];
    const pubIds = pubs.map((p) => p.id);
    const allLegs = await db.select().from(membershipPubLegs)
      .where(inArray(membershipPubLegs.publicationId, pubIds))
      .orderBy(asc(membershipPubLegs.sortOrder));

    // Group legs by publicationId
    const legsByPub = new Map<number, MembershipPubLeg[]>();
    for (const leg of allLegs) {
      if (!legsByPub.has(leg.publicationId)) legsByPub.set(leg.publicationId, []);
      legsByPub.get(leg.publicationId)!.push(leg);
    }

    return pubs.map((p) => ({ ...p, legs: legsByPub.get(p.id) ?? [] }));
  }

  async getMembershipPublicationById(id: number): Promise<MembershipPublicationWithLegs | undefined> {
    const [pub] = await db.select().from(membershipPublications).where(eq(membershipPublications.id, id));
    if (!pub) return undefined;
    const legs = await db.select().from(membershipPubLegs)
      .where(eq(membershipPubLegs.publicationId, id))
      .orderBy(asc(membershipPubLegs.sortOrder));
    return { ...pub, legs };
  }

  async createMembershipPublication(data: InsertMembershipPublication): Promise<MembershipPublication> {
    const [pub] = await db.insert(membershipPublications).values(data).returning();
    return pub;
  }

  async updateMembershipPublication(id: number, data: Partial<InsertMembershipPublication>): Promise<MembershipPublication> {
    const [updated] = await db.update(membershipPublications).set(data).where(eq(membershipPublications.id, id)).returning();
    return updated;
  }

  async publishMembershipPublication(id: number): Promise<MembershipPublication> {
    const [updated] = await db.update(membershipPublications)
      .set({ pubStatus: "published", publishedAt: new Date() })
      .where(eq(membershipPublications.id, id)).returning();
    return updated;
  }

  async unpublishMembershipPublication(id: number): Promise<MembershipPublication> {
    const [updated] = await db.update(membershipPublications)
      .set({ pubStatus: "unpublished", publishedAt: null, updatedAt: new Date() })
      .where(eq(membershipPublications.id, id)).returning();
    return updated;
  }

  async scheduleMembershipPublication(id: number, scheduledAt: Date): Promise<MembershipPublication> {
    const [updated] = await db.update(membershipPublications)
      .set({ pubStatus: "scheduled", scheduledAt, publishedAt: null, updatedAt: new Date() })
      .where(eq(membershipPublications.id, id)).returning();
    return updated;
  }

  async deleteMembershipPublication(id: number): Promise<void> {
    await db.delete(membershipPublications).where(eq(membershipPublications.id, id));
  }

  async createMembershipPubLeg(data: InsertMembershipPubLeg): Promise<MembershipPubLeg> {
    const [leg] = await db.insert(membershipPubLegs).values(data).returning();
    return leg;
  }

  async updateMembershipPubLeg(id: number, data: Partial<InsertMembershipPubLeg>): Promise<MembershipPubLeg> {
    const [updated] = await db.update(membershipPubLegs).set(data).where(eq(membershipPubLegs.id, id)).returning();
    return updated;
  }

  async deleteMembershipPubLeg(id: number): Promise<void> {
    await db.delete(membershipPubLegs).where(eq(membershipPubLegs.id, id));
  }

  async setUserMemberTier(userId: number, tier: string | null, options?: { override?: boolean }): Promise<void> {
    if (options?.override) {
      // Admin manually set this tier — lock it against Whop automation.
      await db.update(users).set({ memberTier: tier, tierOverride: true }).where(eq(users.id, userId));
    } else if (tier === null) {
      // Membership explicitly removed — release the lock so Whop can re-engage.
      await db.update(users).set({ memberTier: null, tierOverride: false }).where(eq(users.id, userId));
    } else {
      await db.update(users).set({ memberTier: tier }).where(eq(users.id, userId));
    }
  }

  async getUserMembership(userId: number): Promise<{ tier: string | null; effectiveTier: string | null; expiresAt: Date | null }> {
    const [row] = await db.select({ memberTier: users.memberTier, membershipExpiresAt: users.membershipExpiresAt })
      .from(users).where(eq(users.id, userId));
    if (!row) return { tier: null, effectiveTier: null, expiresAt: null };
    const isExpired = row.membershipExpiresAt !== null && row.membershipExpiresAt.getTime() <= Date.now();
    return {
      tier: row.memberTier ?? null,
      effectiveTier: isExpired ? null : (row.memberTier ?? null),
      expiresAt: row.membershipExpiresAt ?? null,
    };
  }

  async getUserMemberTier(userId: number): Promise<string | null> {
    const { effectiveTier } = await this.getUserMembership(userId);
    return effectiveTier;
  }

  async setUserMembershipExpiry(userId: number, expiresAt: Date | null): Promise<void> {
    await db.update(users).set({ membershipExpiresAt: expiresAt }).where(eq(users.id, userId));
  }

  async updateUserEmail(userId: number, email: string): Promise<void> {
    await db.update(users).set({ email }).where(eq(users.id, userId));
  }

  async updateUserPasswordHash(userId: number, passwordHash: string): Promise<void> {
    await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
  }

  async getUserById(id: number): Promise<{ id: number; email: string; isAdmin: boolean } | undefined> {
    const [row] = await db.select({ id: users.id, email: users.email, isAdmin: users.isAdmin }).from(users).where(eq(users.id, id));
    return row;
  }

  async setUserAdmin(id: number, isAdmin: boolean): Promise<void> {
    await db.update(users).set({ isAdmin }).where(eq(users.id, id));
  }

  async hasAnyAdmin(): Promise<boolean> {
    const [row] = await db.select({ id: users.id }).from(users).where(eq(users.isAdmin, true));
    return !!row;
  }

  async getMembershipSummary(date: string, tier: string): Promise<MembershipDailySummary | null> {
    const [row] = await db.select().from(membershipDailySummaries)
      .where(and(eq(membershipDailySummaries.date, date), eq(membershipDailySummaries.tier, tier)));
    return row ?? null;
  }

  async upsertMembershipSummary(data: InsertMembershipDailySummary): Promise<MembershipDailySummary> {
    const [row] = await db
      .insert(membershipDailySummaries)
      .values({ ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [membershipDailySummaries.date, membershipDailySummaries.tier],
        set: { title: data.title ?? null, totalCoupons: data.totalCoupons, totalMatches: data.totalMatches, updatedAt: new Date() },
      })
      .returning();
    return row;
  }

  async getSetting(key: string): Promise<string | null> {
    const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return row?.value ?? null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
  }

  // ── Terms & Conditions acceptance (append-only — never update/delete) ──────
  async createTermsAcceptance(data: InsertTermsAcceptance): Promise<TermsAcceptance> {
    const [row] = await db.insert(termsAcceptances).values(data).returning();
    return row;
  }

  async hasAcceptedTermsVersion(userId: number, version: string): Promise<boolean> {
    const [row] = await db
      .select({ id: termsAcceptances.id })
      .from(termsAcceptances)
      .where(and(eq(termsAcceptances.userId, userId), eq(termsAcceptances.termsVersion, version)))
      .limit(1);
    return !!row;
  }

  // ── Whop grant events that couldn't be matched to a local account yet ──────
  async createWhopPendingGrant(email: string, tier: string, expiresAt: Date | null, membershipId: string | null = null): Promise<void> {
    await db.insert(whopPendingGrants).values({ email: email.toLowerCase().trim(), tier, expiresAt, membershipId });
  }

  /** All queued pending grants for this email, oldest first. Callers (see
   *  reconcilePendingWhopGrants in whop-routes.ts) re-verify each one's live Whop
   *  status before applying — this only reads, it never mutates state. */
  async getWhopPendingGrantsByEmail(email: string) {
    const normalized = email.toLowerCase().trim();
    return db.select().from(whopPendingGrants).where(eq(whopPendingGrants.email, normalized));
  }

  /** Sets a user's tier/expiry directly — used once reconcilePendingWhopGrants has
   *  decided which (still-valid) pending grant, if any, should be applied.
   *  Guarded: returns false (no-op) when tier_override=true. */
  async applyWhopGrantToUser(userId: number, tier: string, expiresAt: Date | null): Promise<boolean> {
    const rows = await db
      .update(users)
      .set({ memberTier: tier, membershipExpiresAt: expiresAt })
      .where(and(eq(users.id, userId), eq(users.tierOverride, false)))
      .returning({ id: users.id });
    return rows.length > 0;
  }

  /** Atomically updates memberTier for Whop automation only when tier_override=false.
   *  Returns true if applied, false if the user is locked by an admin override. */
  async applyWhopTierIfNotOverridden(userId: number, tier: string | null): Promise<boolean> {
    const rows = await db
      .update(users)
      .set({ memberTier: tier })
      .where(and(eq(users.id, userId), eq(users.tierOverride, false)))
      .returning({ id: users.id });
    return rows.length > 0;
  }

  /** Atomically updates membershipExpiresAt for Whop automation only when tier_override=false.
   *  Returns true if applied, false if the user is locked by an admin override. */
  async applyWhopExpiryIfNotOverridden(userId: number, expiresAt: Date | null): Promise<boolean> {
    const rows = await db
      .update(users)
      .set({ membershipExpiresAt: expiresAt })
      .where(and(eq(users.id, userId), eq(users.tierOverride, false)))
      .returning({ id: users.id });
    return rows.length > 0;
  }

  /** Deletes specific pending grant rows by id — used once reconciliation has
   *  either applied or discarded (as no-longer-valid) each one. */
  async deleteWhopPendingGrantsByIds(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    await db.delete(whopPendingGrants).where(inArray(whopPendingGrants.id, ids));
  }

  /** Discards any queued pending grant(s) for this email — call on an
   *  unmatched revoke/refund/cancel webhook so a payment reversed before the
   *  buyer ever registered can't later be resurrected and applied on signup. */
  async deleteWhopPendingGrantsByEmail(email: string): Promise<number> {
    const normalized = email.toLowerCase().trim();
    const deleted = await db.delete(whopPendingGrants).where(eq(whopPendingGrants.email, normalized)).returning({ id: whopPendingGrants.id });
    return deleted.length;
  }
}

export const storage = new DatabaseStorage();
