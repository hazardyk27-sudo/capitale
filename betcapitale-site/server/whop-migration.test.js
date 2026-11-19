import assert from "node:assert/strict";
import test from "node:test";
import { WHOP_PLANS, LEGACY_WHOP_PLANS, isKnownWhopPlanId, isWhopMembershipValid } from "./whop-contract.js";

test("checkout catalog exposes the nine canonical one-time variants only", () => {
  assert.equal(WHOP_PLANS.length, 9);
  assert.equal(new Set(WHOP_PLANS.map((plan) => plan.id)).size, 9);
  assert.deepEqual(WHOP_PLANS.map((plan) => plan.days), [3, 7, 14, 30, 90, 7, 14, 30, 90]);
  assert.equal(WHOP_PLANS[0].price, 1);
});

test("all historical variants remain available for reconciliation", () => {
  assert.equal(LEGACY_WHOP_PLANS.length, 12);
  for (const plan of LEGACY_WHOP_PLANS) assert.equal(isKnownWhopPlanId(plan.id), true, plan.id);
});

test("active and trial memberships respect their expiry", () => {
  const now = Date.parse("2026-11-19T00:00:00.000Z");
  assert.equal(isWhopMembershipValid("active", new Date(now + 60_000), now), true);
  assert.equal(isWhopMembershipValid("trialing", null, now), true);
  assert.equal(isWhopMembershipValid("active", new Date(now - 60_000), now), false);
});

test("cancelled memberships retain access until the paid period ends", () => {
  const now = Date.parse("2026-11-19T00:00:00.000Z");
  assert.equal(isWhopMembershipValid("canceled", new Date(now + 86_400_000), now), true);
  assert.equal(isWhopMembershipValid("canceled", new Date(now - 1), now), false);
});

test("a non-expiring one-time membership remains valid without an expiry timestamp", () => {
  assert.equal(isWhopMembershipValid("one_time", null), true);
  assert.equal(isWhopMembershipValid("expired", null), false);
  assert.equal(isWhopMembershipValid("unknown", null), null);
});
