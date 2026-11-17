import assert from "node:assert/strict";
import test from "node:test";
import {
  getPromotionResetTodayRange,
  isPromotionResetTarget,
} from "./promotion-tracker-utils";

test("promotion reset accepts all requested scopes", () => {
  for (const target of ["today", "all", "x", "meta", "insta", "ads", "direct"]) {
    assert.equal(isPromotionResetTarget(target), true);
  }
  assert.equal(isPromotionResetTarget("yesterday"), false);
  assert.equal(isPromotionResetTarget("ad_redirect_events"), false);
  assert.equal(isPromotionResetTarget(null), false);
});

test("promotion reset today uses the Europe/Istanbul calendar day", () => {
  const { from, to } = getPromotionResetTodayRange(new Date("2026-08-28T00:30:00.000Z"));
  assert.equal(from.toISOString(), "2026-08-27T21:00:00.000Z");
  assert.equal(to.toISOString(), "2026-08-28T20:59:59.999Z");
});