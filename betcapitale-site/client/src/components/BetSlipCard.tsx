import { forwardRef } from "react";
import type { CouponWithSelections } from "@shared/schema";

/* ─── design tokens ─────────────────────────────────────────────────────── */

const T = {
  card: "#FFFFFF",
  primary: "#111827",
  secondary: "#6B7280",
  muted: "#94A3B8",
  divider: "#E5E7EB",
  summaryDivider: "#D1D5DB",
  success: "#22C55E",
  failure: "#DC2626",
  voidColor: "#94A3B8",
  accent: "#16844A",
  wonBadge: "#16844A",
  lostBadge: "#C9342E",
  voidBadge: "#94A3B8",
  font: "Inter, Arial, sans-serif",
} as const;

/* ─── helpers ──────────────────────────────────────────────────────────── */

function foldLabel(count: number) {
  if (count === 1) return "Single";
  if (count === 2) return "Double";
  if (count === 3) return "Treble";
  return "Accumulator";
}

/** Hiç yuvarlama yapmadan 2 ondalık basamağa keser: 1.905 → "1.90" */
function truncOdds(n: number): string {
  return (Math.floor(n * 100) / 100).toFixed(2);
}

/** Sadece baştaki/sondaki ve fazla boşlukları temizler; orijinal harf
 * büyüklüğünü (ör. "UEFA") korur — zorla Title Case'e çevirmez. */
function cleanLabel(str: string) {
  return str.trim().replace(/\s+/g, " ");
}

function formatMatch(name: string) {
  if (!name) return "";
  return name
    .trim()
    .replace(/\s*\bvs?\b\s*/gi, " v ")  // "vs" / "v" normalise
    .replace(/\s+-\s+/g, " v ");         // " - " → " v "
}

/** Split "Arsenal v Fulham" → ["Arsenal", "Fulham"] */
function parseTeams(matchName: string): [string, string] {
  const norm = formatMatch(matchName);
  const idx = norm.indexOf(" v ");
  if (idx === -1) return [norm.trim(), ""];
  return [norm.slice(0, idx).trim(), norm.slice(idx + 3).trim()];
}

const RESULT_CODE_MARKETS = new Set([
  "Full Time Result", "Half Time", "Draw No Bet",
]);
const DOUBLE_CHANCE_MARKET = "Double Chance";
const HTFT_MARKET = "Half Time/Full Time";

/**
 * Translates stored 1/X/2 codes into human-readable labels using
 * the match teams when the market supports it.
 */
function resolveSelectionName(
  selectionName: string,
  market: string,
  matchName: string,
): string {
  const [home, away] = parseTeams(matchName);

  if (RESULT_CODE_MARKETS.has(market)) {
    if (selectionName === "1" && home) return home;
    if (selectionName === "X") return "Draw";
    if (selectionName === "2" && away) return away;
    return selectionName;
  }

  if (market === DOUBLE_CHANCE_MARKET) {
    if (selectionName === "1X" && home) return `${home} or Draw`;
    if (selectionName === "X2" && away) return `Draw or ${away}`;
    if (selectionName === "12" && home && away) return `${home} or ${away}`;
    return selectionName;
  }

  if (market === HTFT_MARKET && home && away) {
    // "1/1" → "Home/Home", "X/2" → "Draw/Away" etc.
    const part = (code: string) =>
      code === "1" ? home : code === "X" ? "Draw" : code === "2" ? away : code;
    const slash = selectionName.indexOf("/");
    if (slash !== -1) {
      return part(selectionName.slice(0, slash)) + "/" + part(selectionName.slice(slash + 1));
    }
  }

  return selectionName;
}

/* ─── status logic ───────────────────────────────────────────────────────── */

export type SettledStatus = "Won" | "Lost" | "Void";

/** Returns Won/Lost/Void for fully settled; "Open" when any leg is pending/pre-match; null only when empty */
export function deriveSettledStatus(coupon: CouponWithSelections): SettledStatus | "Open" | null {
  const sels = coupon.selections;
  if (sels.length === 0) return null;
  if (sels.some((s) => s.result === "pending" || s.result === "pre-match")) return "Open";
  if (sels.some((s) => s.result === "lost")) return "Lost";
  if (sels.every((s) => s.result === "void")) return "Void";
  if (
    sels.every((s) => s.result === "won" || s.result === "void") &&
    sels.some((s) => s.result === "won")
  )
    return "Won";
  return null;
}

/** Effective total odds (only void legs treated as 1.00; pending/pre-match count at full odds) */
function effectiveOdds(coupon: CouponWithSelections): number {
  return coupon.selections
    .filter((s) => s.result !== "void")
    .reduce((acc, s) => acc * s.odds, 1);
}

function calcReturn(coupon: CouponWithSelections, status: SettledStatus | "Open"): number {
  if (status === "Lost") return 0;
  if (status === "Void") return coupon.stake;
  if (status === "Open") return coupon.stake * effectiveOdds(coupon); // potential
  return coupon.actualReturn ?? coupon.stake * effectiveOdds(coupon);
}

/* ─── result icon ────────────────────────────────────────────────────────── */

function ResultIcon({ result }: { result: string }) {
  if (result === "won") {
    return (
      <span
        style={{
          width: 18, height: 18, borderRadius: "50%",
          backgroundColor: T.success,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginTop: 1,
        }}
      >
        <svg viewBox="0 0 12 12" width={11} height={11} fill="none">
          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (result === "void") {
    return (
      <span
        style={{
          width: 18, height: 18, borderRadius: "50%",
          backgroundColor: T.voidColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginTop: 1,
        }}
      >
        <svg viewBox="0 0 12 12" width={10} height={10} fill="none">
          <path d="M3 6h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (result === "pending" || result === "pre-match") {
    return (
      <span
        style={{
          width: 18, height: 18, borderRadius: "50%",
          backgroundColor: "#CBD5E1",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginTop: 1,
        }}
      >
        {/* clock icon */}
        <svg viewBox="0 0 12 12" width={10} height={10} fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="#fff" strokeWidth="1.5" />
          <path d="M6 3.5V6l1.5 1.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  // lost
  return (
    <span
      style={{
        width: 18, height: 18, borderRadius: "50%",
        backgroundColor: T.failure,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1,
      }}
    >
      <svg viewBox="0 0 12 12" width={10} height={10} fill="none">
        <path d="M3 3l6 6M9 3l-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */

export interface BetSlipCardProps {
  coupon: CouponWithSelections;
  actionBar?: React.ReactNode;
}

export const BetSlipCard = forwardRef<HTMLDivElement, BetSlipCardProps>(
  function BetSlipCard({ coupon, actionBar }, ref) {
    const status = deriveSettledStatus(coupon);
    const selCount = coupon.selections.length;

    // Guard: do not render a receipt for unsettled coupons
    if (status === null) {
      return (
        <div
          ref={ref}
          style={{
            width: "100%", backgroundColor: T.card,
            borderRadius: 3, overflow: "hidden",
            border: `1px solid ${T.divider}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            fontFamily: T.font,
          }}
        >
          <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: T.muted }}>Pending settlement…</span>
            {actionBar}
          </div>
        </div>
      );
    }

    const toReturn = calcReturn(coupon, status);
    const netResult = toReturn - coupon.stake;
    const badgeBg = status === "Won" ? T.wonBadge : status === "Lost" ? T.failure : status === "Open" ? "#94A3B8" : T.voidBadge;
    // Use void-adjusted odds only when at least one leg is actually void
    const hasVoidLegs = coupon.selections.some((s) => s.result === "void");
    const effectiveTotalOdds = hasVoidLegs ? effectiveOdds(coupon) : coupon.totalOdds;

    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          backgroundColor: T.card,
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${T.divider}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          fontFamily: T.font,
        }}
      >
        {/* ── top summary ─────────────────────────────────────────────────── */}
        <div style={{ padding: "8px 14px 6px" }}>
          {/* Row 1: stake + type + badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontSize: 16, lineHeight: "20px", fontWeight: 700, color: T.primary, fontVariantNumeric: "tabular-nums lining-nums", fontFeatureSettings: '"tnum" 1, "lnum" 1' }}>
                €{coupon.stake.toFixed(2)}
              </span>
              <span style={{ fontSize: 14, lineHeight: "20px", fontWeight: 400, color: "#64748B", marginLeft: 5 }}>
                {foldLabel(selCount)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span
                style={{
                  height: 22, padding: "0 8px", borderRadius: 3,
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.2px",
                  display: "inline-flex", alignItems: "center",
                  backgroundColor: badgeBg, color: "#FFFFFF",
                }}
              >
                {status.toUpperCase()}
              </span>
              {actionBar}
            </div>
          </div>

          {/* Metadata lines */}
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 10, lineHeight: "14px", color: "#475569" }}>Reference: {coupon.betId}</div>
            <div style={{ fontSize: 10, lineHeight: "14px", color: "#475569" }}>Placed: {coupon.placedAt}</div>
          </div>
        </div>

        {/* ── selection rows ───────────────────────────────────────────────── */}
        {coupon.selections.map((sel) => (
          <div
            key={sel.id}
            data-testid={`selection-row-${sel.id}`}
            style={{
              borderTop: `1px solid ${T.divider}`,
              padding: "10px 14px",
              minHeight: 68,
              display: "grid",
              gridTemplateColumns: "20px 1fr 52px",
              columnGap: 8,
              alignItems: "start",
            }}
          >
            {/* icon */}
            <ResultIcon result={sel.result} />

            {/* text block */}
            <div>
              {sel.result === "pre-match" ? (
                <>
                  {/* selectionName blocked */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ display: "inline-block", width: 90, height: 10, borderRadius: 2, backgroundColor: "#CBD5E1" }} />
                  </div>
                  {/* market blocked */}
                  <div style={{ marginTop: 2, marginBottom: 2 }}>
                    <span style={{ display: "inline-block", width: 120, height: 8, borderRadius: 2, backgroundColor: "#E2E8F0" }} />
                  </div>
                  {/* matchName visible */}
                  <div style={{ fontSize: 10, lineHeight: "13px", color: T.secondary }}>
                    {formatMatch(sel.matchName)}
                  </div>
                  {/* league + kickoff visible */}
                  <div style={{ fontSize: 10, lineHeight: "13px", color: T.muted }}>
                    {cleanLabel(sel.league)}{sel.kickoffTime ? ` · ${sel.kickoffTime}` : ""}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 14, lineHeight: "17px", fontWeight: 600, color: T.primary }}>
                    {resolveSelectionName(sel.selectionName, sel.market, sel.matchName)}
                  </div>
                  <div style={{ fontSize: 10, lineHeight: "13px", color: T.secondary, marginTop: 2 }}>
                    {sel.market}
                  </div>
                  <div style={{ fontSize: 10, lineHeight: "13px", color: T.secondary }}>
                    {formatMatch(sel.matchName)}
                  </div>
                  <div style={{ fontSize: 10, lineHeight: "13px", color: T.muted }}>
                    {cleanLabel(sel.league)}{sel.kickoffTime ? ` · ${sel.kickoffTime}` : ""}
                  </div>
                </>
              )}
            </div>

            {/* odds */}
            <div style={{ fontSize: 14, lineHeight: "17px", fontWeight: 700, color: T.primary, textAlign: "right", width: 52, flexShrink: 0, fontVariantNumeric: "tabular-nums lining-nums", fontFeatureSettings: '"tnum" 1, "lnum" 1' }}>
              {sel.result === "pre-match"
                ? <span style={{ display: "inline-block", width: 28, height: 10, borderRadius: 2, backgroundColor: "#CBD5E1", verticalAlign: "middle" }} />
                : truncOdds(sel.odds)
              }
            </div>
          </div>
        ))}

        {/* ── bottom summary ───────────────────────────────────────────────── */}
        <div style={{ borderTop: `1px solid ${T.summaryDivider}`, padding: "9px 14px 11px" }}>
          {/* Total Odds */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 90px", alignItems: "center", minHeight: 27 }}>
            <span style={{ fontSize: 10, lineHeight: "14px", fontWeight: 400, color: T.secondary }}>Total Odds</span>
            <span style={{ fontSize: 13, lineHeight: "17px", fontWeight: 600, color: T.primary, fontVariantNumeric: "tabular-nums lining-nums", fontFeatureSettings: '"tnum" 1, "lnum" 1', textAlign: "right", whiteSpace: "nowrap" }}>
              {truncOdds(effectiveTotalOdds)}
            </span>
          </div>

          {/* Stake */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 90px", alignItems: "center", minHeight: 27 }}>
            <span style={{ fontSize: 10, lineHeight: "14px", fontWeight: 400, color: T.secondary }}>Stake</span>
            <span style={{ fontSize: 13, lineHeight: "17px", fontWeight: 600, color: T.primary, fontVariantNumeric: "tabular-nums lining-nums", fontFeatureSettings: '"tnum" 1, "lnum" 1', textAlign: "right", whiteSpace: "nowrap" }}>
              €{coupon.stake.toFixed(2)}
            </span>
          </div>

          {/* Return */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 90px", alignItems: "center", minHeight: 27 }}>
            <span style={{ fontSize: 10, lineHeight: "14px", fontWeight: 400, color: T.secondary }}>Return</span>
            <span style={{ fontSize: 13, lineHeight: "17px", fontWeight: 600, color: T.primary, fontVariantNumeric: "tabular-nums lining-nums", fontFeatureSettings: '"tnum" 1, "lnum" 1', textAlign: "right", whiteSpace: "nowrap" }}>
              €{toReturn.toFixed(2)}
            </span>
          </div>

          {/* Net Profit / Net Loss / Net (void) */}
          <div
            style={{
              borderTop: `1px solid ${T.divider}`,
              marginTop: 3,
              paddingTop: 7,
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) 90px",
              alignItems: "center",
              minHeight: 27,
            }}
          >
            <span style={{ fontSize: 10, lineHeight: "14px", fontWeight: 400, color: T.secondary }}>
              {status === "Won" ? "Net Profit" : status === "Lost" ? "Net Loss" : status === "Open" ? "Potential Profit" : "Net"}
            </span>
            <span
              style={{
                fontSize: 13,
                lineHeight: "17px",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums lining-nums",
                fontFeatureSettings: '"tnum" 1, "lnum" 1',
                textAlign: "right",
                whiteSpace: "nowrap",
                color: status === "Won" ? T.accent : status === "Lost" ? T.failure : T.muted,
              }}
            >
              {status === "Won" ? "+" : status === "Lost" ? "-" : status === "Open" ? "+" : ""}€{Math.abs(netResult).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
);
