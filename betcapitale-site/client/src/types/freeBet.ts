export type FreeBetResult = "won" | "lost" | "void" | "pending";

export type FreeBet = {
  id: string;
  date: string;
  publishedAt: string;
  kickoffAt: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  selection: string;
  publishedOdds: number;
  result: FreeBetResult;
  analysis?: string[];
  revision?: {
    changedAt: string;
    reason: string;
  };
};
