import type { FreeBet, FreeBetResult } from "@/types/freeBet";

/** All monetary values in integer cents to avoid floating-point drift */

export function calcReturnCents(result: FreeBetResult, stakeCents: number, publishedOdds: number): number {
  if (result === "won")     return Math.round(stakeCents * publishedOdds);
  if (result === "void")    return stakeCents;
  if (result === "lost")    return 0;
  return 0; // pending
}

export function calcNetCents(result: FreeBetResult, stakeCents: number, publishedOdds: number): number {
  if (result === "pending") return 0;
  return calcReturnCents(result, stakeCents, publishedOdds) - (result === "void" ? 0 : stakeCents);
}

export function isSettled(bet: FreeBet): boolean {
  return bet.result === "won" || bet.result === "lost" || bet.result === "void";
}

/** Return the N most recently published Free Bet records. */
export function filterByBetCount(bets: FreeBet[], count: number): FreeBet[] {
  if (count <= 0) return bets;

  return [...bets]
    .sort((a, b) => {
      const timeDifference = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      return timeDifference || b.id.localeCompare(a.id);
    })
    .slice(0, count);
}

/** Return the N most recently published settled Free Bet records. */
export function filterBySettledBetCount(bets: FreeBet[], count: number): FreeBet[] {
  return filterByBetCount(bets.filter(isSettled), count);
}

export interface PeriodStats {
  publishedCount: number;
  settledCount: number;
  pendingCount: number;
  wonCount: number;
  lostCount: number;
  voidCount: number;
  totalInvestedCents: number;
  totalReturnCents: number;
  netCents: number;
}

export function calcPeriodStats(bets: FreeBet[], stakeCents: number): PeriodStats {
  const settled = bets.filter(isSettled);
  const pending = bets.filter((b) => b.result === "pending");
  const won     = settled.filter((b) => b.result === "won");
  const lost    = settled.filter((b) => b.result === "lost");
  const voidB   = settled.filter((b) => b.result === "void");

  const totalInvestedCents = (won.length + lost.length) * stakeCents;
  const totalReturnCents   = settled.reduce((s, b) => s + calcReturnCents(b.result, stakeCents, b.publishedOdds), 0);
  const netCents           = totalReturnCents - totalInvestedCents;

  return {
    publishedCount:   bets.length,
    settledCount:     settled.length,
    pendingCount:     pending.length,
    wonCount:         won.length,
    lostCount:        lost.length,
    voidCount:        voidB.length,
    totalInvestedCents,
    totalReturnCents,
    netCents,
  };
}

export interface ChartPoint {
  date: string;
  label: string;
  homeTeam: string;
  awayTeam: string;
  selection: string;
  publishedOdds: number;
  stakeCents: number;
  dailyNetCents: number;
  cumulativeNetCents: number;
}

/** Build cumulative chart points for settled bets sorted by date asc. */
export function buildChartPoints(bets: FreeBet[], stakeCents: number): ChartPoint[] {
  const settled = bets.filter(isSettled).sort((a, b) => a.date.localeCompare(b.date));
  let cumulative = 0;
  return settled.map((b) => {
    const dailyNet = calcNetCents(b.result, stakeCents, b.publishedOdds);
    cumulative += dailyNet;
    return {
      date:               b.date,
      label:              b.date.slice(5).replace("-", "/"),
      homeTeam:           b.homeTeam,
      awayTeam:           b.awayTeam,
      selection:          b.selection,
      publishedOdds:      b.publishedOdds,
      stakeCents,
      dailyNetCents:      dailyNet,
      cumulativeNetCents: cumulative,
    };
  });
}

/** Format cents as EUR string, e.g. "+123,45 €" */
export function fmtEur(cents: number, sign = true): string {
  const val = cents / 100;
  const str = Math.abs(val).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (!sign) return `${str} €`;
  return `${val >= 0 ? "+" : "-"}${str} €`;
}

/* ── Period grouping (Weekly / Monthly / Quarterly) ────────────────
   `bet.date` is a plain "YYYY-MM-DD" calendar-day string (already the
   Istanbul calendar day), so grouping parses the string components
   directly rather than going through a timezone-sensitive Date. */

export type HistoryPeriod = "week" | "month" | "quarter";

export interface HistoryGroup {
  key: string;
  label: string;
  bets: FreeBet[];
}

function mondayOfWeek(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const day = date.getUTCDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

function fmtShortUTC(date: Date): string {
  return date.toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "short" });
}

function getPeriodKey(dateStr: string, period: HistoryPeriod): string {
  const [y, m] = dateStr.split("-").map(Number);
  if (period === "month") return `${y}-${String(m).padStart(2, "0")}`;
  if (period === "quarter") return `${y}-Q${Math.ceil(m / 3)}`;
  return mondayOfWeek(dateStr).toISOString().slice(0, 10);
}

function getPeriodLabel(key: string, period: HistoryPeriod): string {
  if (period === "month") {
    const [y, m] = key.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, 1));
    return date.toLocaleDateString("en-GB", { timeZone: "UTC", month: "long", year: "numeric" });
  }
  if (period === "quarter") {
    const [yStr, qStr] = key.split("-Q");
    const y = Number(yStr);
    const startMonth = (Number(qStr) - 1) * 3;
    const start = new Date(Date.UTC(y, startMonth, 1));
    const end = new Date(Date.UTC(y, startMonth + 2, 1));
    const startLabel = start.toLocaleDateString("en-GB", { timeZone: "UTC", month: "short" });
    const endLabel = end.toLocaleDateString("en-GB", { timeZone: "UTC", month: "short" });
    return `${startLabel}–${endLabel} ${y}`;
  }
  const [y, m, d] = key.split("-").map(Number);
  const monday = new Date(Date.UTC(y, m - 1, d));
  const sunday = new Date(monday);
  sunday.setUTCDate(sunday.getUTCDate() + 6);
  return `${fmtShortUTC(monday)} – ${fmtShortUTC(sunday)} ${y}`;
}

/** Group bets (any order) into period buckets, ordered newest period first.
 *  Bets within each group keep their relative input order. */
export function groupByPeriod(bets: FreeBet[], period: HistoryPeriod): HistoryGroup[] {
  const map = new Map<string, FreeBet[]>();
  for (const bet of bets) {
    const key = getPeriodKey(bet.date, period);
    const list = map.get(key);
    if (list) list.push(bet);
    else map.set(key, [bet]);
  }
  return Array.from(map.keys())
    .sort((a, b) => b.localeCompare(a))
    .map((key) => ({ key, label: getPeriodLabel(key, period), bets: map.get(key)! }));
}
