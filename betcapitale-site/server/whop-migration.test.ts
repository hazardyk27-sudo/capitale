import assert from "node:assert/strict";
import test from "node:test";
import { WHOP_PLANS, isKnownWhopPlanId, isWhopMembershipValid } from "./whop-routes";

test("the checkout catalog exposes the nine canonical one-time variants only", () => {
  assert.equal(WHOP_PLANS.length, 9);
  assert.equal(new Set(WHOP_PLANS.map((plan) => plan.id)).size, 9);
  assert.deepEqual(WHOP_PLANS.map((plan) => plan.days), [3, 7, 14, 30, 90, 7, 14, 30, 90]);
  assert.equal(WHOP_PLANS[0].price, 1);
});

test("previously sold plan IDs remain recognized for membership reconciliation", () => {
  const legacyIds = [
    "plan_lBt72kE1sk3Jf", "plan_1Ty9Fqp2UAFLz", "plan_zw42pDTHWJ4zu", "plan_a9dQJJ06lNI5m",
    "plan_UbJysF7UeVvBE", "plan_IyW3QRXibb3jL", "plan_TWqTvjQAa9TS9", "plan_MpIeqiuyzO4KP",
    "plan_5TJSkdk8Xhx9o", "plan_Ikppjr71XVqxh", "plan_sBQtSPgR7sdVL", "plan_mII3DkdkWfXTW",
  ];
  for (const id of legacyIds) assert.equal(isKnownWhopPlanId(id), true, id);
});

test("current active and trial memberships remain valid while their expiry is future", () => {
  const now = Date.parse("2026-11-19T00:00:00.000Z");
  assert.equal(isWhopMembershipValid("active", new Date(now + 60_000), now), true);
  assert.equal(isWhopMembershipValid("trialing", null, now), true);
  assert.equal(isWhopMembershipValid("active", new Date(now - 60_000), now), false);
});

test("cancellation at period end preserves access through the paid period", () => {
  const now = Date.parse("2026-11-19T00:00:00.000Z");
  assert.equal(isWhopMembershipValid("canceled", new Date(now + 86_400_000), now), true);
  assert.equal(isWhopMembershipValid("canceled", new Date(now - 1), now), false);
});

test("never-expiring one-time membership stays valid without an expiry timestamp", () => {
  assert.equal(isWhopMembershipValid("one_time", null), true);
  assert.equal(isWhopMembershipValid("expired", null), false);
  assert.equal(isWhopMembershipValid("unrecognized-provider-state", null), null);
});
