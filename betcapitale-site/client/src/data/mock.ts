/* ─────────────────────────────────────────────────────────────────
   Existing types + exports — kept for landing.tsx compatibility
   ──────────────────────────────────────────────────────────────── */

export interface MockMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  kickoffAt: string;
}

export interface MockCouponLeg {
  matchName: string;
  market: string;
  selection: string;
  odds: number;
}

export interface MockCoupon {
  id: string;
  ref: string;
  label: string;
  legs: MockCouponLeg[];
  stake: number;
  totalOdds: number;
  potentialReturn: number;
  status: "pre-match" | "won" | "lost" | "void";
}

export interface PerfPoint {
  day: string;
  profit: number;
  cumulative: number;
}

export const todayMatches: MockMatch[] = [
  { id: "m1", homeTeam: "Galatasaray",   awayTeam: "Fenerbahçe",       competition: "Süper Lig",      kickoffAt: "20:00" },
  { id: "m2", homeTeam: "Real Madrid",   awayTeam: "Barcelona",         competition: "La Liga",        kickoffAt: "21:00" },
  { id: "m3", homeTeam: "Liverpool",     awayTeam: "Man City",          competition: "Premier League", kickoffAt: "18:30" },
  { id: "m4", homeTeam: "Bayern München",awayTeam: "Borussia Dortmund", competition: "Bundesliga",     kickoffAt: "19:30" },
  { id: "m5", homeTeam: "PSG",           awayTeam: "Marseille",         competition: "Ligue 1",        kickoffAt: "22:00" },
  { id: "m6", homeTeam: "Inter Milan",   awayTeam: "Juventus",          competition: "Serie A",        kickoffAt: "21:45" },
];

export const todayCoupons: MockCoupon[] = [
  {
    id: "c1", ref: "SB-2407-A", label: "Ana Kupon",
    legs: [
      { matchName: "Liverpool - Man City",      market: "Maç Sonucu",  selection: "Liverpool", odds: 2.40 },
      { matchName: "Real Madrid - Barcelona",   market: "KG Var",      selection: "Var",       odds: 1.60 },
      { matchName: "Bayern - Dortmund",         market: "Maç Sonucu",  selection: "Bayern",    odds: 1.75 },
    ],
    stake: 100, totalOdds: 6.72, potentialReturn: 672, status: "pre-match",
  },
  {
    id: "c2", ref: "SB-2407-B", label: "Garanti Kupon",
    legs: [
      { matchName: "Galatasaray - Fenerbahçe",  market: "Toplam Gol",  selection: "Alt 2.5",   odds: 1.85 },
      { matchName: "PSG - Marseille",           market: "Maç Sonucu",  selection: "PSG",       odds: 1.45 },
    ],
    stake: 50, totalOdds: 2.68, potentialReturn: 134, status: "pre-match",
  },
];

export const perfData7d: PerfPoint[] = [
  { day: "8 Tem",  profit: 150,  cumulative: 150  },
  { day: "9 Tem",  profit: -80,  cumulative: 70   },
  { day: "10 Tem", profit: 220,  cumulative: 290  },
  { day: "11 Tem", profit: -50,  cumulative: 240  },
  { day: "12 Tem", profit: 310,  cumulative: 550  },
  { day: "13 Tem", profit: 180,  cumulative: 730  },
  { day: "14 Tem", profit: 0,    cumulative: 730  },
];

export const perfData30d: PerfPoint[] = [
  { day: "14 Haz", profit: 200,  cumulative: 200  },
  { day: "15 Haz", profit: -120, cumulative: 80   },
  { day: "16 Haz", profit: 350,  cumulative: 430  },
  { day: "17 Haz", profit: 180,  cumulative: 610  },
  { day: "18 Haz", profit: -90,  cumulative: 520  },
  { day: "19 Haz", profit: 420,  cumulative: 940  },
  { day: "20 Haz", profit: -200, cumulative: 740  },
  { day: "21 Haz", profit: 310,  cumulative: 1050 },
  { day: "22 Haz", profit: 150,  cumulative: 1200 },
  { day: "23 Haz", profit: -80,  cumulative: 1120 },
  { day: "24 Haz", profit: 260,  cumulative: 1380 },
  { day: "25 Haz", profit: 190,  cumulative: 1570 },
  { day: "26 Haz", profit: -140, cumulative: 1430 },
  { day: "27 Haz", profit: 380,  cumulative: 1810 },
  { day: "28 Haz", profit: -60,  cumulative: 1750 },
  { day: "29 Haz", profit: 290,  cumulative: 2040 },
  { day: "30 Haz", profit: 210,  cumulative: 2250 },
  { day: "1 Tem",  profit: -170, cumulative: 2080 },
  { day: "2 Tem",  profit: 440,  cumulative: 2520 },
  { day: "3 Tem",  profit: 150,  cumulative: 2670 },
  { day: "4 Tem",  profit: -90,  cumulative: 2580 },
  { day: "5 Tem",  profit: 320,  cumulative: 2900 },
  { day: "6 Tem",  profit: 180,  cumulative: 3080 },
  { day: "7 Tem",  profit: -100, cumulative: 2980 },
  { day: "8 Tem",  profit: 150,  cumulative: 3130 },
  { day: "9 Tem",  profit: -80,  cumulative: 3050 },
  { day: "10 Tem", profit: 220,  cumulative: 3270 },
  { day: "11 Tem", profit: -50,  cumulative: 3220 },
  { day: "12 Tem", profit: 310,  cumulative: 3530 },
  { day: "13 Tem", profit: 180,  cumulative: 3710 },
];

export const overallStats = {
  totalCoupons: 84,
  wonCoupons:   61,
  lostCoupons:  23,
  netResult:    3710,
  roi:          18.4,
  totalStake:   20160,
  winRate:      72.6,
};

/* ─────────────────────────────────────────────────────────────────
   New types + exports — used by today.tsx (/bugun redesign)
   ──────────────────────────────────────────────────────────────── */

export interface BugunMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  kickoffAt: string;
  couponIds: string[];
  homeLogo: string | null;
  awayLogo: string | null;
}

export interface BugunCoupon {
  id: string;
  reference: string;
  label: string;
  matchCount: number;
  stake: number;
  totalOdds: number;
  preMatchImage: string | null;
  settledImage: string | null;
  status: "PRE_MATCH" | "SETTLED";
  result: "WON" | "LOST" | "VOID" | null;
  publishedAt: string;
  firstKickoffAt: string;
  settledAt: string | null;
  returnAmount: number | null;
}

export interface PublicPick {
  id: string;
  homeTeam: string;
  awayTeam: string;
  selection: string;
  market: string;
  odds: number;
  kickoffAt: string;
  status: "PRE_MATCH" | "SETTLED";
  result: "WON" | "LOST" | "VOID" | null;
}

export const bugunMatches: BugunMatch[] = [
  { id: "m1", homeTeam: "Liverpool",      awayTeam: "Man City",          competition: "Premier League", kickoffAt: "18:30", couponIds: ["c1"], homeLogo: null, awayLogo: null },
  { id: "m2", homeTeam: "Bayern München", awayTeam: "Borussia Dortmund", competition: "Bundesliga",     kickoffAt: "19:30", couponIds: ["c1"], homeLogo: null, awayLogo: null },
  { id: "m3", homeTeam: "Galatasaray",    awayTeam: "Fenerbahçe",        competition: "Süper Lig",      kickoffAt: "20:00", couponIds: ["c2"], homeLogo: null, awayLogo: null },
  { id: "m4", homeTeam: "Real Madrid",    awayTeam: "Barcelona",         competition: "La Liga",        kickoffAt: "21:00", couponIds: ["c1"], homeLogo: null, awayLogo: null },
  { id: "m5", homeTeam: "Inter Milan",    awayTeam: "Juventus",          competition: "Serie A",        kickoffAt: "21:45", couponIds: [],     homeLogo: null, awayLogo: null },
  { id: "m6", homeTeam: "PSG",            awayTeam: "Marseille",         competition: "Ligue 1",        kickoffAt: "22:00", couponIds: ["c2"], homeLogo: null, awayLogo: null },
];

export const bugunCoupons: BugunCoupon[] = [
  {
    id: "c1",
    reference: "SB-2407-A",
    label: "Kupon 01",
    matchCount: 3,
    stake: 100,
    totalOdds: 4.92,
    preMatchImage: "https://placehold.co/600x820/0E1726/12CFE3?text=KUPON+01%0ASB-2407-A%0A%0A%E2%9A%BD+Liverpool+%E2%80%94+Man+City%0A%E2%9A%BD+Bayern+%E2%80%94+Dortmund%0A%E2%9A%BD+Real+Madrid+%E2%80%94+Barcelona%0A%0AToplam+Oran%3A+4.92x%0AStake%3A+%E2%82%AC100",
    settledImage: null,
    status: "PRE_MATCH",
    result: null,
    publishedAt: "2026-07-14T09:00:00",
    firstKickoffAt: "18:30",
    settledAt: null,
    returnAmount: null,
  },
  {
    id: "c2",
    reference: "SB-2407-B",
    label: "Kupon 02",
    matchCount: 2,
    stake: 100,
    totalOdds: 5.69,
    preMatchImage: "https://placehold.co/600x820/0E1726/12CFE3?text=KUPON+02%0ASB-2407-B%0A%0A%E2%9A%BD+Galatasaray+%E2%80%94+Fenerbahce%0A%E2%9A%BD+PSG+%E2%80%94+Marseille%0A%0AToplam+Oran%3A+5.69x%0AStake%3A+%E2%82%AC100",
    settledImage: null,
    status: "PRE_MATCH",
    result: null,
    publishedAt: "2026-07-14T09:30:00",
    firstKickoffAt: "20:00",
    settledAt: null,
    returnAmount: null,
  },
];

export const publicPick: PublicPick = {
  id: "pp1",
  homeTeam: "Liverpool",
  awayTeam: "Arsenal",
  selection: "2.5 Gol Üstü",
  market: "Toplam Gol",
  odds: 1.72,
  kickoffAt: "20:00",
  status: "PRE_MATCH",
  result: null,
};
