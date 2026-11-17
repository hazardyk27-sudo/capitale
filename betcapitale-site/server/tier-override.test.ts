/**
 * Targeted tests for the tier_override protection mechanism.
 *
 * These run against the real dev database.  Run with:
 *   npm run test:tier-override
 *
 * Covers:
 *  - setUserMemberTier with override:true  → tierOverride=true (admin lock set)
 *  - setUserMemberTier without override    → tierOverride unchanged
 *  - setUserMemberTier with tier=null      → tierOverride=false (lock cleared)
 *  - applyWhopTierIfNotOverridden          → no-op when tierOverride=true (atomic DB guard)
 *  - applyWhopExpiryIfNotOverridden        → no-op when tierOverride=true (atomic DB guard)
 *  - applyWhopGrantToUser (conditional)    → no-op when tierOverride=true (atomic DB guard)
 *  - Simulated race: admin lock set mid-flight cannot be overwritten by a Whop write
 */

import assert from "node:assert/strict";
import test from "node:test";
import { db } from "./db.js";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import { DatabaseStorage } from "./storage.js";
import bcrypt from "bcryptjs";

const storage = new DatabaseStorage();
const TEST_EMAIL = `tier-override-test-${Date.now()}@example.invalid`;

async function getUser(id: number) {
  const [row] = await db
    .select({
      memberTier: users.memberTier,
      membershipExpiresAt: users.membershipExpiresAt,
      tierOverride: users.tierOverride,
    })
    .from(users)
    .where(eq(users.id, id));
  return row;
}

let testUserId: number;

test("setup: create test user", async () => {
  const hash = await bcrypt.hash("test-password", 4);
  const [inserted] = await db
    .insert(users)
    .values({ email: TEST_EMAIL, passwordHash: hash, emailVerified: true })
    .returning({ id: users.id });
  assert.ok(inserted.id, "test user should be created");
  testUserId = inserted.id;
});

// ── Admin override flag management ───────────────────────────────────────────

test("setUserMemberTier with override:true sets tierOverride=true", async () => {
  await storage.setUserMemberTier(testUserId, "unlimited", { override: true });
  const row = await getUser(testUserId);
  assert.equal(row?.memberTier, "unlimited");
  assert.equal(row?.tierOverride, true);
});

test("setUserMemberTier without override does not change tierOverride", async () => {
  // tierOverride is currently true. A Whop-style write must not touch the flag.
  await storage.setUserMemberTier(testUserId, "select");
  const row = await getUser(testUserId);
  assert.equal(row?.memberTier, "select");
  assert.equal(row?.tierOverride, true, "tierOverride must remain true after a non-override write");
});

test("setUserMemberTier with tier=null clears tierOverride (admin removes membership)", async () => {
  await storage.setUserMemberTier(testUserId, null);
  const row = await getUser(testUserId);
  assert.equal(row?.memberTier, null);
  assert.equal(row?.tierOverride, false, "tierOverride must be cleared when tier is removed");
});

// ── Atomic DB guards: Whop automation writes are no-ops when tierOverride=true ──

test("applyWhopTierIfNotOverridden: no-op and returns false when tierOverride=true", async () => {
  // Lock the user first via admin override.
  await storage.setUserMemberTier(testUserId, "unlimited", { override: true });

  // Simulate a Whop automation write arriving concurrently.
  const applied = await storage.applyWhopTierIfNotOverridden(testUserId, "select");

  assert.equal(applied, false, "guarded write must return false for a locked user");
  const row = await getUser(testUserId);
  assert.equal(row?.memberTier, "unlimited", "locked user's tier must not change");
  assert.equal(row?.tierOverride, true, "lock must remain intact");
});

test("applyWhopExpiryIfNotOverridden: no-op and returns false when tierOverride=true", async () => {
  // tierOverride is still true from the previous test.
  const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const applied = await storage.applyWhopExpiryIfNotOverridden(testUserId, futureDate);

  assert.equal(applied, false, "guarded expiry write must return false for a locked user");
  const row = await getUser(testUserId);
  assert.equal(row?.membershipExpiresAt, null, "locked user's expiry must not change");
});

test("applyWhopGrantToUser: no-op and returns false when tierOverride=true", async () => {
  const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const applied = await storage.applyWhopGrantToUser(testUserId, "select", futureDate);

  assert.equal(applied, false, "guarded grant must return false for a locked user");
  const row = await getUser(testUserId);
  assert.equal(row?.memberTier, "unlimited", "locked user's tier must not change via grant");
});

// ── Simulated race: admin sets override while Whop write is in flight ────────

test("race simulation: Whop write cannot overwrite a lock set concurrently", async () => {
  // Start: user is NOT locked (tierOverride=false) with tier=select.
  await storage.setUserMemberTier(testUserId, null); // clears override first
  await storage.setUserMemberTier(testUserId, "select"); // normal write, no override

  // Whop automation checks the DB, sees tierOverride=false, and is about to write.
  // Between the check and the write, the admin sets the override.
  await storage.setUserMemberTier(testUserId, "unlimited", { override: true });

  // Now the Whop automation's write hits the DB — the WHERE tier_override=false guard
  // makes it a no-op even though the check earlier read false.
  const applied = await storage.applyWhopTierIfNotOverridden(testUserId, "select");

  assert.equal(applied, false, "concurrent Whop write must be rejected by DB guard");
  const row = await getUser(testUserId);
  assert.equal(row?.memberTier, "unlimited", "admin's tier must survive the concurrent Whop write");
  assert.equal(row?.tierOverride, true);
});

// ── Whop writes succeed when tierOverride=false ──────────────────────────────

test("applyWhopTierIfNotOverridden: applies and returns true when NOT locked", async () => {
  await storage.setUserMemberTier(testUserId, null); // clears override
  const applied = await storage.applyWhopTierIfNotOverridden(testUserId, "select");

  assert.equal(applied, true, "guarded write must return true when user is not locked");
  const row = await getUser(testUserId);
  assert.equal(row?.memberTier, "select");
  assert.equal(row?.tierOverride, false, "tierOverride must remain false after a Whop write");
});

test("getUserMemberTier returns no access after membershipExpiresAt", async () => {
  await db
    .update(users)
    .set({ membershipExpiresAt: new Date(Date.now() - 1_000) })
    .where(eq(users.id, testUserId));

  const effectiveTier = await storage.getUserMemberTier(testUserId);
  assert.equal(effectiveTier, null, "expired memberships must not access member content");
});

test("teardown: remove test user", async () => {
  await db.delete(users).where(eq(users.id, testUserId));
});
