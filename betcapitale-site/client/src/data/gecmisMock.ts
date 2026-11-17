/* ── Mock data for /gecmis page ─────────────────────────────────────────────
   Uses the same schema as DB tables (fixtures, history_coupons, history_coupon_legs)
   covering the last 14 active days. Replace with real API calls when DB is wired up.
   ─────────────────────────────────────────────────────────────────────────── */

export interface GMFixture {
  id: number;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  kickoffAt: string; // ISO datetime string (Europe/Istanbul)
}

export interface GMCouponLeg {
  id: number;
  couponId: number;
  fixtureId: number;
  selection: string;
  market: string;
  odds: number;
  result: "won" | "lost" | "void";
}

export interface GMCoupon {
  id: number;
  couponDate: string; // YYYY-MM-DD grouping key
  reference: string;
  label: string;
  stake: number;
  totalOdds: number;
  potentialReturn: number;
  returnAmount: number | null;
  netResult: number | null;
  status: "open" | "settled";
  result: "won" | "lost" | "void" | null;
  preMatchImage: string | null;
  settledImage: string | null;
  publishedAt: string;
  firstKickoffAt: string;
  settledAt: string | null;
}

export type GMCouponWithLegs = GMCoupon & { legs: (GMCouponLeg & { fixture: GMFixture })[] };

/* ── Fixtures ───────────────────────────────────────────────────────────── */
export const gmFixtures: GMFixture[] = [
  { id: 1,  homeTeam: "Galatasaray",      awayTeam: "Fenerbahçe",       competition: "Süper Lig",      kickoffAt: "2026-07-06T20:00:00+03:00" },
  { id: 2,  homeTeam: "Liverpool",         awayTeam: "Arsenal",           competition: "Premier League", kickoffAt: "2026-07-06T18:30:00+03:00" },
  { id: 3,  homeTeam: "Man United",        awayTeam: "Chelsea",           competition: "Premier League", kickoffAt: "2026-07-06T16:00:00+03:00" },
  { id: 4,  homeTeam: "Barcelona",         awayTeam: "Real Madrid",       competition: "La Liga",        kickoffAt: "2026-07-07T21:00:00+03:00" },
  { id: 5,  homeTeam: "Bayern München",    awayTeam: "Borussia Dortmund", competition: "Bundesliga",     kickoffAt: "2026-07-07T19:30:00+03:00" },
  { id: 6,  homeTeam: "Ajax",              awayTeam: "PSV",               competition: "Eredivisie",     kickoffAt: "2026-07-07T18:30:00+03:00" },
  { id: 7,  homeTeam: "PSG",               awayTeam: "Monaco",            competition: "Ligue 1",        kickoffAt: "2026-07-08T22:00:00+03:00" },
  { id: 8,  homeTeam: "Inter Milan",       awayTeam: "AC Milan",          competition: "Serie A",        kickoffAt: "2026-07-08T21:45:00+03:00" },
  { id: 9,  homeTeam: "Beşiktaş",          awayTeam: "Trabzonspor",       competition: "Süper Lig",      kickoffAt: "2026-07-09T20:00:00+03:00" },
  { id: 10, homeTeam: "Man City",          awayTeam: "Tottenham",         competition: "Premier League", kickoffAt: "2026-07-09T18:30:00+03:00" },
  { id: 11, homeTeam: "Atletico Madrid",   awayTeam: "Sevilla",           competition: "La Liga",        kickoffAt: "2026-07-10T21:00:00+03:00" },
  { id: 12, homeTeam: "Juventus",          awayTeam: "Napoli",            competition: "Serie A",        kickoffAt: "2026-07-10T21:45:00+03:00" },
  { id: 13, homeTeam: "Dortmund",          awayTeam: "RB Leipzig",        competition: "Bundesliga",     kickoffAt: "2026-07-10T19:30:00+03:00" },
  { id: 14, homeTeam: "Fenerbahçe",        awayTeam: "Beşiktaş",          competition: "Süper Lig",      kickoffAt: "2026-07-11T20:00:00+03:00" },
  { id: 15, homeTeam: "Arsenal",           awayTeam: "Tottenham",         competition: "Premier League", kickoffAt: "2026-07-11T18:30:00+03:00" },
  { id: 16, homeTeam: "Lyon",              awayTeam: "Marseille",         competition: "Ligue 1",        kickoffAt: "2026-07-11T21:00:00+03:00" },
  { id: 17, homeTeam: "Galatasaray",       awayTeam: "Trabzonspor",       competition: "Süper Lig",      kickoffAt: "2026-07-12T20:00:00+03:00" },
  { id: 18, homeTeam: "Real Madrid",       awayTeam: "Valencia",          competition: "La Liga",        kickoffAt: "2026-07-12T21:00:00+03:00" },
  { id: 19, homeTeam: "Napoli",            awayTeam: "Roma",              competition: "Serie A",        kickoffAt: "2026-07-12T21:45:00+03:00" },
];

/* ── Coupons ────────────────────────────────────────────────────────────── */
export const gmCoupons: GMCoupon[] = [
  // July 6
  { id: 1,  couponDate: "2026-07-06", reference: "SB-0706-A", label: "Pazar Ana Kuponu",    stake: 100, totalOdds: 3.55, potentialReturn: 355,  returnAmount: 355,  netResult: 255,   status: "settled", result: "won",  preMatchImage: null, settledImage: null, publishedAt: "2026-07-06T14:00:00+03:00", firstKickoffAt: "2026-07-06T16:00:00+03:00", settledAt: "2026-07-06T22:30:00+03:00" },
  { id: 2,  couponDate: "2026-07-06", reference: "SB-0706-B", label: "Pazar İkinci Kupon",  stake: 50,  totalOdds: 3.20, potentialReturn: 160,  returnAmount: 0,    netResult: -50,   status: "settled", result: "lost", preMatchImage: null, settledImage: null, publishedAt: "2026-07-06T14:30:00+03:00", firstKickoffAt: "2026-07-06T16:00:00+03:00", settledAt: "2026-07-06T22:30:00+03:00" },
  // July 7
  { id: 3,  couponDate: "2026-07-07", reference: "SB-0707-A", label: "Pazartesi Kuponu",    stake: 75,  totalOdds: 3.57, potentialReturn: 267.75, returnAmount: 267.75, netResult: 192.75, status: "settled", result: "won", preMatchImage: null, settledImage: null, publishedAt: "2026-07-07T15:00:00+03:00", firstKickoffAt: "2026-07-07T18:30:00+03:00", settledAt: "2026-07-07T23:00:00+03:00" },
  // July 8
  { id: 4,  couponDate: "2026-07-08", reference: "SB-0708-A", label: "Salı Ana Kuponu",     stake: 100, totalOdds: 1.55, potentialReturn: 155,  returnAmount: 0,    netResult: -100,  status: "settled", result: "lost", preMatchImage: null, settledImage: null, publishedAt: "2026-07-08T18:00:00+03:00", firstKickoffAt: "2026-07-08T21:45:00+03:00", settledAt: "2026-07-08T23:45:00+03:00" },
  { id: 5,  couponDate: "2026-07-08", reference: "SB-0708-B", label: "Salı Güvenli Kupon",  stake: 50,  totalOdds: 3.40, potentialReturn: 170,  returnAmount: 50,   netResult: 0,     status: "settled", result: "void", preMatchImage: null, settledImage: null, publishedAt: "2026-07-08T18:30:00+03:00", firstKickoffAt: "2026-07-08T22:00:00+03:00", settledAt: "2026-07-09T00:30:00+03:00" },
  // July 9
  { id: 6,  couponDate: "2026-07-09", reference: "SB-0709-A", label: "Çarşamba Kuponu",     stake: 80,  totalOdds: 3.80, potentialReturn: 304,  returnAmount: 304,  netResult: 224,   status: "settled", result: "won",  preMatchImage: null, settledImage: null, publishedAt: "2026-07-09T16:00:00+03:00", firstKickoffAt: "2026-07-09T18:30:00+03:00", settledAt: "2026-07-09T22:30:00+03:00" },
  // July 10
  { id: 7,  couponDate: "2026-07-10", reference: "SB-1007-A", label: "Perşembe Ana Kupon",  stake: 100, totalOdds: 2.00, potentialReturn: 200,  returnAmount: 200,  netResult: 100,   status: "settled", result: "won",  preMatchImage: null, settledImage: null, publishedAt: "2026-07-10T17:00:00+03:00", firstKickoffAt: "2026-07-10T19:30:00+03:00", settledAt: "2026-07-10T23:45:00+03:00" },
  { id: 8,  couponDate: "2026-07-10", reference: "SB-1007-B", label: "Perşembe İkili Kupon", stake: 60, totalOdds: 3.33, potentialReturn: 200,  returnAmount: 200,  netResult: 140,   status: "settled", result: "won",  preMatchImage: null, settledImage: null, publishedAt: "2026-07-10T17:30:00+03:00", firstKickoffAt: "2026-07-10T19:30:00+03:00", settledAt: "2026-07-10T23:45:00+03:00" },
  // July 11
  { id: 9,  couponDate: "2026-07-11", reference: "SB-1107-A", label: "Cuma Ana Kuponu",     stake: 100, totalOdds: 3.78, potentialReturn: 378,  returnAmount: 0,    netResult: -100,  status: "settled", result: "lost", preMatchImage: null, settledImage: null, publishedAt: "2026-07-11T15:00:00+03:00", firstKickoffAt: "2026-07-11T18:30:00+03:00", settledAt: "2026-07-11T23:00:00+03:00" },
  { id: 10, couponDate: "2026-07-11", reference: "SB-1107-B", label: "Cuma Tek Seçim",      stake: 50,  totalOdds: 1.70, potentialReturn: 85,   returnAmount: 85,   netResult: 35,    status: "settled", result: "won",  preMatchImage: null, settledImage: null, publishedAt: "2026-07-11T15:30:00+03:00", firstKickoffAt: "2026-07-11T21:00:00+03:00", settledAt: "2026-07-11T23:00:00+03:00" },
  // July 12
  { id: 11, couponDate: "2026-07-12", reference: "SB-1207-A", label: "Cumartesi Büyük Kupon", stake: 120, totalOdds: 2.88, potentialReturn: 345.6, returnAmount: 345.6, netResult: 225.6, status: "settled", result: "won", preMatchImage: null, settledImage: null, publishedAt: "2026-07-12T16:00:00+03:00", firstKickoffAt: "2026-07-12T20:00:00+03:00", settledAt: "2026-07-12T23:45:00+03:00" },
  { id: 12, couponDate: "2026-07-12", reference: "SB-1207-B", label: "Cumartesi Risk Kuponu", stake: 80, totalOdds: 5.50, potentialReturn: 440,  returnAmount: 0,    netResult: -80,   status: "settled", result: "lost", preMatchImage: null, settledImage: null, publishedAt: "2026-07-12T16:30:00+03:00", firstKickoffAt: "2026-07-12T21:00:00+03:00", settledAt: "2026-07-12T23:45:00+03:00" },
  // July 13 - today (no results yet)
  { id: 13, couponDate: "2026-07-13", reference: "SB-1307-A", label: "Ana Kupon",            stake: 100, totalOdds: 6.72, potentialReturn: 672,  returnAmount: null, netResult: null,  status: "open",    result: null,  preMatchImage: null, settledImage: null, publishedAt: "2026-07-13T14:00:00+03:00", firstKickoffAt: "2026-07-13T18:30:00+03:00", settledAt: null },
  { id: 14, couponDate: "2026-07-13", reference: "SB-1307-B", label: "Garanti Kupon",        stake: 50,  totalOdds: 2.68, potentialReturn: 134,  returnAmount: null, netResult: null,  status: "open",    result: null,  preMatchImage: null, settledImage: null, publishedAt: "2026-07-13T14:30:00+03:00", firstKickoffAt: "2026-07-13T20:00:00+03:00", settledAt: null },
];

/* ── Coupon legs ────────────────────────────────────────────────────────── */
export const gmLegs: GMCouponLeg[] = [
  // c1 (won): f1 KG Var won, f2 Liverpool won, f3 Chelsea won
  { id: 1,  couponId: 1,  fixtureId: 1,  selection: "Karşılıklı Gol Var", market: "KG",            odds: 1.60, result: "won" },
  { id: 2,  couponId: 1,  fixtureId: 2,  selection: "Liverpool",           market: "Maç Sonucu",    odds: 2.20, result: "won" },
  // c2 (lost): f3 Beraberlik
  { id: 3,  couponId: 2,  fixtureId: 3,  selection: "Beraberlik",          market: "Maç Sonucu",    odds: 3.20, result: "lost" },
  // c3 (won): f4 Barcelona won, f5 Bayern won, f6 Ajax won
  { id: 4,  couponId: 3,  fixtureId: 4,  selection: "Barcelona",           market: "Maç Sonucu",    odds: 2.10, result: "won" },
  { id: 5,  couponId: 3,  fixtureId: 5,  selection: "Bayern München",      market: "Maç Sonucu",    odds: 1.70, result: "won" },
  // c4 (lost): f7 PSG
  { id: 6,  couponId: 4,  fixtureId: 7,  selection: "PSG",                 market: "Maç Sonucu",    odds: 1.55, result: "lost" },
  // c5 (void): f8 beraberlik (void)
  { id: 7,  couponId: 5,  fixtureId: 8,  selection: "Beraberlik",          market: "Maç Sonucu",    odds: 3.40, result: "void" },
  // c6 (won): f9 Beşiktaş won, f10 Man City won
  { id: 8,  couponId: 6,  fixtureId: 9,  selection: "Beşiktaş",            market: "Maç Sonucu",    odds: 2.30, result: "won" },
  { id: 9,  couponId: 6,  fixtureId: 10, selection: "Man City",            market: "Maç Sonucu",    odds: 1.65, result: "won" },
  // c7 (won): f11 Atletico won
  { id: 10, couponId: 7,  fixtureId: 11, selection: "Atletico Madrid",     market: "Maç Sonucu",    odds: 2.00, result: "won" },
  // c8 (won): f12 Juventus won, f13 Dortmund won
  { id: 11, couponId: 8,  fixtureId: 12, selection: "Juventus",            market: "Maç Sonucu",    odds: 1.90, result: "won" },
  { id: 12, couponId: 8,  fixtureId: 13, selection: "Dortmund",            market: "Maç Sonucu",    odds: 1.75, result: "won" },
  // c9 (lost): f14 Fenerbahçe lost, f15 Arsenal
  { id: 13, couponId: 9,  fixtureId: 14, selection: "Fenerbahçe",          market: "Maç Sonucu",    odds: 2.10, result: "lost" },
  { id: 14, couponId: 9,  fixtureId: 15, selection: "Arsenal",             market: "Maç Sonucu",    odds: 1.80, result: "won" },
  // c10 (won): f16 Lyon won
  { id: 15, couponId: 10, fixtureId: 16, selection: "Lyon",                market: "Maç Sonucu",    odds: 1.70, result: "won" },
  // c11 (won): f17 Galatasaray won, f19 Napoli won
  { id: 16, couponId: 11, fixtureId: 17, selection: "Galatasaray",         market: "Maç Sonucu",    odds: 1.80, result: "won" },
  { id: 17, couponId: 11, fixtureId: 19, selection: "Napoli",              market: "Maç Sonucu",    odds: 1.60, result: "won" },
  // c12 (lost): f18 Valencia
  { id: 18, couponId: 12, fixtureId: 18, selection: "Valencia",            market: "Maç Sonucu",    odds: 5.50, result: "lost" },
  // c13 (open): today coupons
  { id: 19, couponId: 13, fixtureId: 2,  selection: "Liverpool",           market: "Maç Sonucu",    odds: 2.40, result: "won" },
  { id: 20, couponId: 13, fixtureId: 4,  selection: "KG Var",              market: "KG",            odds: 1.60, result: "won" },
  { id: 21, couponId: 13, fixtureId: 5,  selection: "Bayern München",      market: "Maç Sonucu",    odds: 1.75, result: "won" },
  { id: 22, couponId: 14, fixtureId: 1,  selection: "Alt 2.5",             market: "Toplam Gol",    odds: 1.85, result: "won" },
  { id: 23, couponId: 14, fixtureId: 7,  selection: "PSG",                 market: "Maç Sonucu",    odds: 1.45, result: "won" },
];

/* ── Build enriched coupons ─────────────────────────────────────────────── */
const fixtureMap = new Map(gmFixtures.map((f) => [f.id, f]));

export const gmCouponsWithLegs: GMCouponWithLegs[] = gmCoupons.map((c) => ({
  ...c,
  legs: gmLegs
    .filter((l) => l.couponId === c.id)
    .map((l) => ({ ...l, fixture: fixtureMap.get(l.fixtureId)! })),
}));

/* ── Period computation helpers ─────────────────────────────────────────── */
export function computeStats(coupons: GMCoupon[], legs: (GMCouponLeg & { fixture: GMFixture })[]) {
  const settled = coupons.filter((c) => c.status === "settled" && c.result !== null);
  const won     = settled.filter((c) => c.result === "won");
  const lost    = settled.filter((c) => c.result === "lost");
  const void_   = settled.filter((c) => c.result === "void");

  const totalStake  = settled.reduce((s, c) => s + c.stake, 0);
  const totalReturn = settled.reduce((s, c) => s + (c.returnAmount ?? 0), 0);
  const netResult   = totalReturn - totalStake;
  const roi         = totalStake > 0 ? (netResult / totalStake) * 100 : 0;

  const denom = won.length + lost.length;
  const couponHitRate = denom > 0 ? (won.length / denom) * 100 : 0;

  const settledLegs   = legs.filter((l) => l.result !== "void" && coupons.some((c) => c.id === l.couponId && c.status === "settled"));
  const wonLegs       = settledLegs.filter((l) => l.result === "won");
  const lostLegs      = settledLegs.filter((l) => l.result === "lost");
  const voidLegs      = legs.filter((l) => l.result === "void" && coupons.some((c) => c.id === l.couponId && c.status === "settled"));

  const legDenom = wonLegs.length + lostLegs.length;
  const selectionHitRate = legDenom > 0 ? (wonLegs.length / legDenom) * 100 : 0;

  const uniqueFixtureIds = new Set(legs.filter((l) => coupons.some((c) => c.id === l.couponId)).map((l) => l.fixtureId));

  return {
    totalCoupons: settled.length,
    wonCoupons: won.length,
    lostCoupons: lost.length,
    voidCoupons: void_.length,
    couponHitRate,
    totalStake,
    totalReturn,
    netResult,
    roi,
    totalLegs: settledLegs.length + voidLegs.length,
    wonLegs: wonLegs.length,
    lostLegs: lostLegs.length,
    voidLegs: voidLegs.length,
    selectionHitRate,
    uniqueFixtures: uniqueFixtureIds.size,
  };
}

export type PeriodStats = ReturnType<typeof computeStats>;
