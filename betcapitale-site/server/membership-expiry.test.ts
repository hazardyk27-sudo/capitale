import assert from "node:assert/strict";
import test from "node:test";
import {
  calendarExpiryFromProviderEnd,
  calendarExpiryFromStart,
  getMembershipAccessStatus,
  getWhopRenewalStatus,
  localMembershipExpiry,
} from "./whop-routes";

test("plan expiry is 00:01 Istanbul on the calendar end date", () => {
  const expiry = calendarExpiryFromStart("2026-08-21T15:00:00+03:00", 7);
  assert.equal(expiry?.toISOString(), "2026-08-27T21:01:00.000Z");
});

test("provider period end is normalized to 00:01 Istanbul", () => {
  const expiry = calendarExpiryFromProviderEnd("2026-08-28T23:59:00+03:00");
  assert.equal(expiry?.toISOString(), "2026-08-27T21:01:00.000Z");
});

test("cancelled memberships do not use a later provider renewal window", () => {
  const expiry = localMembershipExpiry({
    valid: false,
    createdAt: "2026-08-21T15:00:00+03:00",
    providerExpiry: "2026-09-28T23:59:00+03:00",
    planDays: 7,
  });
  assert.equal(expiry?.toISOString(), "2026-08-27T21:01:00.000Z");
});

test("active memberships use the current provider period date", () => {
  const expiry = localMembershipExpiry({
    valid: true,
    createdAt: "2026-08-21T15:00:00+03:00",
    providerExpiry: "2026-09-04T23:59:00+03:00",
    planDays: 7,
  });
  assert.equal(expiry?.toISOString(), "2026-09-03T21:01:00.000Z");
});

test("missing provider and plan dates never create an indefinite expiry", () => {
  assert.equal(localMembershipExpiry({ valid: true }), null);
});

test("renewal status stays separate from access status", () => {
  assert.equal(getWhopRenewalStatus(true, false, "active"), "active");
  assert.equal(getWhopRenewalStatus(true, true, "active"), "cancel_pending");
  assert.equal(getWhopRenewalStatus(false, true, "cancelled"), "cancelled");
});

test("access status is active while days remain and expired after the boundary", () => {
  const now = Date.parse("2026-08-27T21:00:00.000Z");
  assert.equal(getMembershipAccessStatus(Date.parse("2026-08-27T21:01:00.000Z"), now), "active");
  assert.equal(getMembershipAccessStatus(Date.parse("2026-08-27T21:01:00.000Z"), now + 60_000), "expired");
  assert.equal(getMembershipAccessStatus(null, now), "unknown");
});