import assert from "node:assert/strict";
import test from "node:test";
import type { FreeBet, FreeBetResult } from "@/types/freeBet";
import { calcPeriodStats, filterByBetCount, filterBySettledBetCount } from "./freeBetCalculations";

function createBet(id: string, publishedAt: string, result: FreeBetResult = "won"): FreeBet {
  return {
    id,
    date: publishedAt.slice(0, 10),
    publishedAt,
    kickoffAt: publishedAt,
    league: "Test League",
    homeTeam: "Home",
    awayTeam: "Away",
    market: "Test market",
    selection: "Test selection",
    publishedOdds: 2,
    result,
  };
}

test("selects exactly the requested number of newest Free Bets", () => {
  const bets = Array.from({ length: 8 }, (_, index) =>
    createBet(String(index + 1), `2026-08-${String(index + 1).padStart(2, "0")}T12:00:00.000Z`)
  );

  const selected = filterByBetCount(bets, 7);

  assert.deepEqual(selected.map((bet) => bet.id), ["8", "7", "6", "5", "4", "3", "2"]);
});

test("orders mixed UTC and offset timestamps chronologically", () => {
  const bets = [
    createBet("offset-older", "2026-08-20T10:30:00+03:00", "pending"), // 07:30 UTC
    createBet("utc-middle", "2026-08-20T08:00:00.000Z"),
    createBet("offset-newest", "2026-08-20T12:00:00+03:00"), // 09:00 UTC
  ];

  const selected = filterByBetCount(bets, 2);

  assert.deepEqual(selected.map((bet) => bet.id), ["offset-newest", "utc-middle"]);
  assert.equal(selected.some((bet) => bet.result === "pending"), false);
});

test("selects the newest settled Free Bets without filling the window with pending picks", () => {
  const bets = [
    createBet("pending-newest", "2026-08-23T12:00:00.000Z", "pending"),
    createBet("settled-newest", "2026-08-22T12:00:00.000Z", "won"),
    createBet("settled-older", "2026-08-21T12:00:00.000Z", "lost"),
  ];

  const selected = filterBySettledBetCount(bets, 2);

  assert.deepEqual(selected.map((bet) => bet.id), ["settled-newest", "settled-older"]);
  assert.equal(calcPeriodStats(selected, 1000).pendingCount, 0);
  assert.equal(calcPeriodStats(selected, 1000).publishedCount, 2);
  assert.equal(calcPeriodStats(selected, 1000).settledCount, 2);
});