import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, XAxis, YAxis, Tooltip as RechartTooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import SiteHeader from "@/components/SiteHeader";
import type { FreeBet, FreeBetResult } from "@/types/freeBet";
import {
  calcPeriodStats, buildChartPoints, filterByBetCount, filterBySettledBetCount,
  fmtEur, isSettled, groupByPeriod,
} from "@/utils/freeBetCalculations";
import type { HistoryPeriod } from "@/utils/freeBetCalculations";
import { TrendingUp, Shield, BarChart2, Coins, Info, MapPin, Clock } from "lucide-react";

/* ── Design tokens ──────────────────────────────────────────────── */
const BG      = "#FCFCFB";
const SOFT    = "#F4F7F8";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const BORDER  = "#E4EAEE";
const ORANGE  = "#E8771F";
const SUCCESS = "#129A63";
const DANGER  = "#D95A68";
const FONT    = "'Manrope', sans-serif";

/* ── Result badge config ─────────────────────────────────────────── */
const RESULT_CFG: Record<FreeBetResult, { label: string; bg: string; color: string }> = {
  won:     { label: "Won",       bg: "#ECFAF3", color: SUCCESS },
  lost:    { label: "Lost",      bg: "#FEF0F2", color: DANGER },
  void:    { label: "Void",      bg: "#FFF8F0", color: "#B45309" },
  pending: { label: "Pending",   bg: "#F0F4FF", color: "#3B5BDB" },
};

/* ── Helpers ────────────────────────────────────────────────────── */
const STAKE_OPTIONS = [10, 25, 50, 100, 200, 500];
const LS_KEY = "bc_free_bet_stake";

function getInitialStake(): number {
  if (typeof window === "undefined") return 100;
  const v = parseInt(localStorage.getItem(LS_KEY) ?? "100");
  return STAKE_OPTIONS.includes(v) ? v : 100;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    timeZone: "Europe/Istanbul",
    day: "numeric", month: "long", year: "numeric",
  });
}
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit",
  });
}
function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    timeZone: "Europe/Istanbul", day: "numeric", month: "short",
  });
}

function ResultBadge({ result }: { result: FreeBetResult }) {
  const c = RESULT_CFG[result];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: "11px", fontWeight: 700,
      padding: "3px 10px", borderRadius: "20px",
      background: c.bg, color: c.color,
      fontFamily: FONT,
    }}>
      {c.label}
    </span>
  );
}

/* ── Section label ──────────────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: "11px", fontWeight: 700, color: ORANGE,
      textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px",
      fontFamily: FONT,
    }}>{children}</p>
  );
}

/* ══════════════════════════════════════════════════════════════════
   1. TODAY'S FREE BET CARD — sub-components
══════════════════════════════════════════════════════════════════ */

function FreeBetMetaHeader({ bet }: { bet: FreeBet }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${ORANGE}10 0%, ${ORANGE}05 100%)`,
      borderBottom: `1px solid ${BORDER}`,
      padding: "18px 24px 16px",
    }}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p style={{
            fontSize: "10px", fontWeight: 800, color: ORANGE,
            textTransform: "uppercase", letterSpacing: "0.14em",
            marginBottom: "5px", fontFamily: FONT,
          }}>
            Today's Free Bet
          </p>
          <p style={{ fontSize: "12px", color: TEXT2, fontFamily: FONT, lineHeight: 1.4, margin: 0 }}>
            Free analysis pick · Not a betting balance
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "5px", marginBottom: "3px" }}>
            <MapPin size={11} color={TEXT2} />
            <p style={{ fontSize: "12px", fontWeight: 600, color: TEXT, fontFamily: FONT, margin: 0 }}>
              {bet.league}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "5px" }}>
            <Clock size={11} color={TEXT2} />
            <p style={{ fontSize: "11px", color: TEXT2, fontFamily: FONT, margin: 0 }}>
              Published: {fmtDate(bet.publishedAt)} · {fmtTime(bet.publishedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FreeBetMatchHeader({ bet }: { bet: FreeBet }) {
  return (
    <div style={{
      padding: "36px 24px 28px",
      borderBottom: `1px solid ${BORDER}`,
      textAlign: "center",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "12px", flexWrap: "nowrap", marginBottom: "14px",
        minWidth: 0, width: "100%",
      }}>
        <span style={{
          fontSize: "clamp(18px, 4.5vw, 32px)", fontWeight: 800, color: TEXT,
          fontFamily: FONT, letterSpacing: "-0.02em", lineHeight: 1.1,
          minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          flex: "1 1 0", textAlign: "right",
        }}>
          {bet.homeTeam}
        </span>
        <span style={{
          fontSize: "10px", fontWeight: 800, color: TEXT2,
          border: `1.5px solid ${BORDER}`, padding: "6px 12px",
          borderRadius: "50px", background: "#fff",
          fontFamily: FONT, letterSpacing: "0.1em", flexShrink: 0,
        }}>
          VS
        </span>
        <span style={{
          fontSize: "clamp(18px, 4.5vw, 32px)", fontWeight: 800, color: TEXT,
          fontFamily: FONT, letterSpacing: "-0.02em", lineHeight: 1.1,
          minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          flex: "1 1 0", textAlign: "left",
        }}>
          {bet.awayTeam}
        </span>
      </div>
      <p style={{ fontSize: "12px", color: TEXT2, fontFamily: FONT, margin: 0 }}>
        Kick-off: {fmtDate(bet.kickoffAt)} · {fmtTime(bet.kickoffAt)}
      </p>
    </div>
  );
}

function FreeBetSelectionPanel({ bet }: { bet: FreeBet }) {
  return (
    <div className="flex flex-col sm:flex-row" style={{ borderBottom: `1px solid ${BORDER}` }}>
      {/* Selection ~75% */}
      <div style={{
        flex: "3 1 0", padding: "28px 24px",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", borderRight: `1px solid ${BORDER}`,
        minHeight: "120px",
      }}>
        <p style={{
          fontSize: "10px", fontWeight: 700, color: TEXT2,
          textTransform: "uppercase", letterSpacing: "0.12em",
          marginBottom: "10px", fontFamily: FONT,
        }}>
          {bet.market}
        </p>
        <p style={{
          fontSize: "clamp(40px, 7vw, 56px)", fontWeight: 900, color: TEXT,
          lineHeight: 1, margin: 0, fontFamily: FONT, letterSpacing: "-0.02em",
        }}>
          {bet.selection}
        </p>
        <div style={{
          width: "28px", height: "2px",
          background: `${ORANGE}60`, borderRadius: "2px",
          margin: "14px auto 0",
        }} />
      </div>

      {/* Odds ~25% */}
      <div style={{
        flex: "1 1 0", padding: "28px 20px",
        background: `${ORANGE}0B`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", minHeight: "120px",
      }}>
        <p style={{
          fontSize: "10px", fontWeight: 700, color: ORANGE,
          textTransform: "uppercase", letterSpacing: "0.1em",
          marginBottom: "8px", fontFamily: FONT,
        }}>
          Odds
        </p>
        <p style={{
          fontSize: "clamp(34px, 5vw, 44px)", fontWeight: 900, color: ORANGE,
          lineHeight: 1, margin: 0,
          fontFamily: FONT, fontVariantNumeric: "tabular-nums",
        }}>
          {bet.publishedOdds.toFixed(2)}
        </p>
        <p style={{ fontSize: "10px", color: TEXT2, fontFamily: FONT, marginTop: "8px" }}>
          Published odds
        </p>
      </div>
    </div>
  );
}

function FreeBetInfoNote() {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "10px",
      background: "#F8FAFC", border: `1px solid ${BORDER}`,
      borderRadius: "8px", padding: "10px 14px",
      margin: "20px 24px 0",
    }}>
      <Info size={14} color={TEXT2} style={{ flexShrink: 0, marginTop: "2px" }} />
      <p style={{ fontSize: "11.5px", color: TEXT2, lineHeight: "1.6", fontFamily: FONT, margin: 0 }}>
        The odds recorded at the moment the pick was published are used in performance calculations.
      </p>
    </div>
  );
}

function FreeBetActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-3" style={{ padding: "20px 24px 24px" }}>
      <Link
        href="/today"
        style={{
          flex: "1 1 0", textAlign: "center",
          fontSize: "13.5px", fontWeight: 700, color: "#fff",
          padding: "14px 20px", borderRadius: "10px",
          background: ORANGE, textDecoration: "none",
          boxShadow: "0 2px 16px rgba(232,119,31,0.30)",
          fontFamily: FONT, display: "block", minHeight: "44px",
          lineHeight: "1.4",
        }}
        data-testid="button-today-selections"
      >
        View Today's Member Picks
      </Link>
      <a
        href="#free-bet-history"
        style={{
          flex: "1 1 0", textAlign: "center",
          fontSize: "13.5px", fontWeight: 600, color: ORANGE,
          padding: "14px 20px", borderRadius: "10px",
          border: `1.5px solid ${ORANGE}`, textDecoration: "none",
          background: "#fff", fontFamily: FONT,
          display: "block", minHeight: "44px", lineHeight: "1.4",
        }}
        data-testid="button-view-history"
      >
        View Past Free Bets
      </a>
    </div>
  );
}

/* ── Main card ──────────────────────────────────────────────────── */
function DailyFreeBetCard({ bet, stake }: { bet: FreeBet | null; stake: number }) {
  if (!bet) {
    return (
      <div style={{
        background: "#fff", border: `1px solid ${BORDER}`,
        borderRadius: "20px", padding: "36px 28px",
        boxShadow: "0 4px 32px rgba(14,23,38,0.06)",
      }}>
        <p style={{
          fontSize: "10px", fontWeight: 800, color: ORANGE,
          textTransform: "uppercase", letterSpacing: "0.14em",
          marginBottom: "6px", fontFamily: FONT,
        }}>
          Today's Free Bet
        </p>
        <p style={{ fontSize: "13px", color: TEXT2, marginBottom: "4px", fontFamily: FONT }}>
          Free analysis pick · Not a betting balance
        </p>
        <p style={{
          fontSize: "20px", fontWeight: 700, color: TEXT,
          margin: "20px 0 8px", fontFamily: FONT,
        }}>
          Today's Free Bet has not been published yet.
        </p>
        <p style={{ fontSize: "14px", color: TEXT2, marginBottom: "28px", fontFamily: FONT }}>
          When a new pick is published it will appear here with its publication time and recorded odds.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#free-bet-history"
            style={{
              flex: "1 1 0", textAlign: "center",
              fontSize: "13.5px", fontWeight: 600, color: ORANGE,
              padding: "14px 20px", borderRadius: "10px",
              border: `1.5px solid ${ORANGE}`, textDecoration: "none",
              fontFamily: FONT, display: "block", minHeight: "44px",
            }}
          >
            View Past Free Bets
          </a>
          <Link
            href="/today"
            style={{
              flex: "1 1 0", textAlign: "center",
              fontSize: "13.5px", fontWeight: 600, color: TEXT2,
              padding: "14px 20px", borderRadius: "10px",
              border: `1px solid ${BORDER}`, textDecoration: "none",
              fontFamily: FONT, display: "block", minHeight: "44px",
            }}
          >
            View Today's Content
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#fff", border: `1px solid ${BORDER}`,
      borderRadius: "20px",
      boxShadow: "0 4px 40px rgba(14,23,38,0.07), 0 1px 4px rgba(14,23,38,0.04)",
      overflow: "hidden",
    }}>
      <FreeBetMetaHeader bet={bet} />
      <FreeBetMatchHeader bet={bet} />
      <FreeBetSelectionPanel bet={bet} />
      <FreeBetInfoNote />

      {/* Analysis */}
      {(bet.analysis?.length ?? 0) > 0 && (
        <div style={{ padding: "20px 24px 0" }}>
          <p style={{
            fontSize: "11px", fontWeight: 700, color: TEXT,
            textTransform: "uppercase", letterSpacing: "0.08em",
            marginBottom: "10px", fontFamily: FONT,
          }}>
            Data Behind the Pick
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {(bet.analysis ?? []).slice(0, 3).map((point, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "8px",
                fontSize: "13px", color: TEXT2,
                marginBottom: i < (bet.analysis?.length ?? 0) - 1 ? "8px" : 0,
                lineHeight: "1.55", fontFamily: FONT,
              }}>
                <span style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: ORANGE, flexShrink: 0, marginTop: "6px",
                }} />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Revision note */}
      {bet.revision && (
        <div style={{
          background: "#FFF8F0", border: "1px solid #FDE8C8",
          borderRadius: "8px", padding: "10px 14px", margin: "16px 24px 0",
        }}>
          <p style={{ fontSize: "11.5px", color: "#92400E", fontFamily: FONT }}>
            <strong>Revision note:</strong> {bet.revision.reason}
          </p>
        </div>
      )}

      <FreeBetActions />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2. INTRODUCTION
══════════════════════════════════════════════════════════════════ */
const INTRO_BENEFITS = [
  {
    icon: <TrendingUp size={18} />,
    title: "Real picks experience",
    desc: "Follow real picks published daily, not demos or retrospectively chosen examples.",
  },
  {
    icon: <Shield size={18} />,
    title: "Review before buying",
    desc: "See the pick approach and past results before making a membership decision.",
  },
  {
    icon: <Coins size={18} />,
    title: "Odds at time of publication",
    desc: "Each pick is recorded with the odds available at the moment it is shared.",
  },
  {
    icon: <BarChart2 size={18} />,
    title: "Periodic evaluation",
    desc: "Look at total performance over 7, 30 and 90 days, not a single result.",
  },
];

function FreeBetIntroduction() {
  return (
    <div style={{
      background: "#fff", border: `1px solid ${BORDER}`,
      borderRadius: "16px", padding: "28px",
      boxShadow: "0 2px 12px rgba(14,23,38,0.04)",
    }}>
      <Eyebrow>Try the Bet Capitale System for Free</Eyebrow>
      <p style={{
        fontSize: "15px", fontWeight: 700, color: TEXT,
        marginBottom: "8px", fontFamily: FONT,
      }}>
        The Free Bet is not just a free betting pick.
      </p>
      <p style={{ fontSize: "13.5px", color: TEXT2, marginBottom: "8px", lineHeight: "1.65", fontFamily: FONT }}>
        It is offered so you can review Bet Capitale's match evaluation approach, selection standard and periodic performance
        before purchasing a membership.
      </p>
      <p style={{
        fontSize: "13px", fontWeight: 600, color: ORANGE,
        marginBottom: "20px", fontFamily: FONT,
      }}>
        Instead of just explaining the system, we demonstrate it every day with a real pick.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INTRO_BENEFITS.map((b, i) => (
          <div key={i} style={{
            display: "flex", gap: "12px",
            background: SOFT, borderRadius: "12px",
            padding: "14px 16px",
          }}>
            <div style={{ color: ORANGE, flexShrink: 0, marginTop: "1px" }}>{b.icon}</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: TEXT, marginBottom: "3px", fontFamily: FONT }}>
                {b.title}
              </p>
              <p style={{ fontSize: "12px", color: TEXT2, lineHeight: "1.55", fontFamily: FONT }}>
                {b.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3. STAKE SELECTOR
══════════════════════════════════════════════════════════════════ */
function FreeBetStakeSelector({
  stake,
  onChange,
}: {
  stake: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p style={{
        fontSize: "16px", fontWeight: 700, color: TEXT,
        marginBottom: "4px", fontFamily: FONT,
      }}>
        See Performance With Your Own Budget
      </p>
      <p style={{ fontSize: "13px", color: TEXT2, marginBottom: "16px", fontFamily: FONT }}>
        Calculate past Free Bet results assuming you played the same stake every day.
      </p>

      <div className="flex flex-wrap gap-2" style={{ marginBottom: "12px" }}>
        {STAKE_OPTIONS.map((opt) => {
          const active = stake === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                minWidth: "64px", minHeight: "44px",
                padding: "8px 16px", borderRadius: "10px",
                fontSize: "13.5px", fontWeight: active ? 700 : 500,
                color: active ? "#fff" : TEXT,
                background: active ? ORANGE : "#fff",
                border: `1.5px solid ${active ? ORANGE : BORDER}`,
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: FONT,
                outline: active ? `2px solid ${ORANGE}30` : "none",
              }}
              data-testid={`button-stake-${opt}`}
            >
              €{opt}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: "11.5px", color: TEXT2, fontFamily: FONT }}>
        Calculation is a simulation of past Free Bet results adapted to the selected fixed stake amount.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4. PERIOD PERFORMANCE
══════════════════════════════════════════════════════════════════ */
function PeriodCard({
  label,
  bets,
  stakeCents,
}: {
  label: string;
  bets: FreeBet[];
  stakeCents: number;
}) {
  const s = calcPeriodStats(bets, stakeCents);
  const netPositive = s.netCents >= 0;

  return (
    <div style={{
      background: "#fff", border: `1px solid ${BORDER}`,
      borderRadius: "14px", padding: "20px",
      boxShadow: "0 2px 8px rgba(14,23,38,0.04)",
    }}>
      <p style={{
        fontSize: "12px", fontWeight: 700, color: TEXT2,
        textTransform: "uppercase", letterSpacing: "0.08em",
        marginBottom: "14px", fontFamily: FONT,
      }}>{label}</p>

      {/* Net result — hero number */}
      <p style={{
        fontSize: "28px", fontWeight: 900,
        color: netPositive ? SUCCESS : DANGER,
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1, marginBottom: "4px",
        fontFamily: FONT,
      }}>
        {fmtEur(s.netCents)}
      </p>
      <p style={{ fontSize: "11px", color: TEXT2, marginBottom: "16px", fontFamily: FONT }}>
        Net result
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {[
          { label: "Published",           value: String(s.publishedCount) },
          { label: "Settled",             value: String(s.settledCount) },
          { label: "Pending",             value: String(s.pendingCount) },
          { label: "Won",               value: String(s.wonCount), color: SUCCESS },
          { label: "Lost",                value: String(s.lostCount), color: DANGER },
          { label: "Void",                value: String(s.voidCount), color: "#B45309" },
          { label: "Total staked",        value: fmtEur(s.totalInvestedCents, false) },
          { label: "Total return",        value: fmtEur(s.totalReturnCents, false) },
        ].map((row) => (
          <div key={row.label}>
            <p style={{ fontSize: "10px", color: TEXT2, fontFamily: FONT, marginBottom: "1px" }}>
              {row.label}
            </p>
            <p style={{
              fontSize: "13px", fontWeight: 600,
              color: row.color ?? TEXT, fontFamily: FONT,
              fontVariantNumeric: "tabular-nums",
            }}>
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FreeBetPeriodPerformance({ stake, bets }: { stake: number; bets: FreeBet[] }) {
  const stakeCents = stake * 100;
  const bets7  = filterBySettledBetCount(bets, 7);
  const bets30 = filterBySettledBetCount(bets, 30);
  const bets90 = filterBySettledBetCount(bets, 90);

  return (
    <div>
      <p style={{
        fontSize: "18px", fontWeight: 700, color: TEXT,
        marginBottom: "4px", fontFamily: FONT,
      }}>
        How Much Did the Free Bet Return?
      </p>
      <p style={{ fontSize: "13px", color: TEXT2, marginBottom: "20px", lineHeight: "1.6", fontFamily: FONT }}>
        Results are calculated assuming a fixed stake of your choice is placed on the daily Free Bet
        using the odds recorded at the time of publication.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PeriodCard label="Last 7 Free Bets"  bets={bets7}  stakeCents={stakeCents} />
        <PeriodCard label="Last 30 Free Bets" bets={bets30} stakeCents={stakeCents} />
        <PeriodCard label="Last 90 Free Bets" bets={bets90} stakeCents={stakeCents} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   5. PROFIT CHART
══════════════════════════════════════════════════════════════════ */
type ChartRange = "7" | "30" | "90" | "all";

function FreeBetProfitChart({ stake, bets }: { stake: number; bets: FreeBet[] }) {
  const [range, setRange] = useState<ChartRange>("30");
  const stakeCents = stake * 100;

  const points = useMemo(() => {
    const betCount = range === "7" ? 7 : range === "30" ? 30 : range === "90" ? 90 : 0;
    const filtered = betCount > 0 ? filterByBetCount(bets, betCount) : bets;
    return buildChartPoints(filtered, stakeCents);
  }, [range, stakeCents, bets]);

  const labelInterval = points.length > 30 ? Math.ceil(points.length / 10) : points.length > 14 ? 2 : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{
        background: "#fff", border: `1px solid ${BORDER}`,
        borderRadius: "10px", padding: "12px 16px",
        boxShadow: "0 4px 20px rgba(14,23,38,0.12)",
        minWidth: "200px",
      }}>
        <p style={{ fontSize: "11px", color: TEXT2, marginBottom: "6px", fontFamily: FONT }}>
          {fmtDate(d.date)}
        </p>
        <p style={{ fontSize: "13px", fontWeight: 600, color: TEXT, marginBottom: "2px", fontFamily: FONT }}>
          {d.homeTeam} – {d.awayTeam}
        </p>
        <p style={{ fontSize: "12px", color: TEXT2, marginBottom: "8px", fontFamily: FONT }}>
          {d.selection} · @{d.publishedOdds.toFixed(2)}
        </p>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "8px" }}>
          <p style={{ fontSize: "12px", color: TEXT2, fontFamily: FONT }}>
            Stake: <strong style={{ color: TEXT }}>{fmtEur(d.stakeCents, false)}</strong>
          </p>
          <p style={{ fontSize: "12px", color: d.dailyNetCents >= 0 ? SUCCESS : DANGER, fontFamily: FONT }}>
            Daily net: <strong>{fmtEur(d.dailyNetCents)}</strong>
          </p>
          <p style={{ fontSize: "12px", color: d.cumulativeNetCents >= 0 ? SUCCESS : DANGER, fontFamily: FONT }}>
            Cumulative: <strong>{fmtEur(d.cumulativeNetCents)}</strong>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: "#fff", border: `1px solid ${BORDER}`,
      borderRadius: "16px", padding: "24px",
      boxShadow: "0 2px 12px rgba(14,23,38,0.04)",
    }}>
      <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "16px", fontWeight: 700, color: TEXT, fontFamily: FONT }}>
          Free Bet Performance Over Time
        </p>
        <div className="flex gap-1 flex-wrap">
          {(["7", "30", "90", "all"] as ChartRange[]).map((r) => {
            const labels: Record<ChartRange, string> = { "7": "7 Free Bets", "30": "30 Free Bets", "90": "90 Free Bets", all: "All Time" };
            const active = range === r;
            return (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  fontSize: "12px", fontWeight: active ? 700 : 500,
                  padding: "6px 12px", borderRadius: "8px",
                  color: active ? "#fff" : TEXT2,
                  background: active ? ORANGE : "transparent",
                  border: `1.5px solid ${active ? ORANGE : BORDER}`,
                  cursor: "pointer", fontFamily: FONT, minHeight: "34px",
                }}
                data-testid={`button-chart-range-${r}`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>
      </div>

      {points.length === 0 ? (
        <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: "13px", color: TEXT2, fontFamily: FONT }}>
            No settled picks for this period yet.
          </p>
        </div>
      ) : (
        <>
          <p className="sr-only">
            {range === "all" ? "All time" : `Last ${range} Free Bets`} cumulative net result chart summary:
            {points.length} settled picks, total {fmtEur(points[points.length - 1].cumulativeNetCents)}.
          </p>
          <div style={{ height: "220px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={BORDER} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: TEXT2, fontFamily: FONT }}
                  tickLine={false} axisLine={false}
                  interval={labelInterval}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: TEXT2, fontFamily: FONT }}
                  tickLine={false} axisLine={false} width={52}
                  tickFormatter={(v) =>
                    Math.abs(v) >= 100
                      ? `${(v / 100).toFixed(0)}€`
                      : `${(v / 100).toFixed(2)}€`
                  }
                />
                <ReferenceLine y={0} stroke={BORDER} strokeWidth={1.5} />
                <RechartTooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="cumulativeNetCents"
                  stroke={ORANGE}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: ORANGE, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   6. HISTORY
══════════════════════════════════════════════════════════════════ */
type HistoryFilter = "all" | FreeBetResult;
const HISTORY_FILTERS: { key: HistoryFilter; label: string }[] = [
  { key: "all",     label: "All" },
  { key: "won",     label: "Won" },
  { key: "lost",    label: "Lost" },
  { key: "void",    label: "Void" },
  { key: "pending", label: "Pending" },
];
const HISTORY_PERIODS: { key: HistoryPeriod; label: string }[] = [
  { key: "week",    label: "Weekly" },
  { key: "month",   label: "Monthly" },
  { key: "quarter", label: "Quarterly" },
];

function FreeBetHistory({ stake, bets }: { stake: number; bets: FreeBet[] }) {
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [period, setPeriod] = useState<HistoryPeriod>("week");

  const stakeCents = stake * 100;

  const filtered = useMemo(() => {
    const sorted = [...bets].sort((a, b) => b.date.localeCompare(a.date));
    return filter === "all" ? sorted : sorted.filter((b) => b.result === filter);
  }, [filter, bets]);

  const groups = useMemo(() => groupByPeriod(filtered, period), [filtered, period]);

  return (
    <div id="free-bet-history">
      <div className="flex items-start justify-between flex-wrap gap-3" style={{ marginBottom: "12px" }}>
        <div>
          <p style={{ fontSize: "18px", fontWeight: 700, color: TEXT, marginBottom: "4px", fontFamily: FONT }}>
            Transparent Performance History
          </p>
          <p style={{ fontSize: "13px", color: TEXT2, fontFamily: FONT }}>
            Review all winning, losing, voided and pending Free Bet picks — every pick is shown, grouped by period.
          </p>
        </div>
      </div>

      {/* Result filters */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: "10px" }}>
        {HISTORY_FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                fontSize: "12.5px", fontWeight: active ? 700 : 500,
                padding: "7px 14px", borderRadius: "8px",
                color: active ? "#fff" : TEXT2,
                background: active ? ORANGE : "#fff",
                border: `1.5px solid ${active ? ORANGE : BORDER}`,
                cursor: "pointer", minHeight: "36px",
                fontFamily: FONT,
              }}
              data-testid={`button-history-filter-${key}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Period grouping */}
      <div className="flex items-center flex-wrap gap-2" style={{ marginBottom: "14px" }}>
        <span style={{ fontSize: "12px", color: TEXT2, fontFamily: FONT, marginRight: "2px" }}>
          Group by:
        </span>
        {HISTORY_PERIODS.map(({ key, label }) => {
          const active = period === key;
          return (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              style={{
                fontSize: "12px", fontWeight: active ? 700 : 500,
                padding: "6px 12px", borderRadius: "8px",
                color: active ? "#fff" : TEXT2,
                background: active ? ORANGE : "transparent",
                border: `1.5px solid ${active ? ORANGE : BORDER}`,
                cursor: "pointer", minHeight: "32px",
                fontFamily: FONT,
              }}
              data-testid={`button-history-period-${key}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: "11.5px", color: TEXT2, fontFamily: FONT, marginBottom: "12px" }}>
        Showing all {filtered.length} pick{filtered.length !== 1 ? "s" : ""}
        {filter !== "all" ? ` · ${HISTORY_FILTERS.find((f) => f.key === filter)?.label}` : ""}.
      </p>

      {/* Desktop table */}
      <div className="hidden md:block" style={{
        background: "#fff", border: `1px solid ${BORDER}`,
        borderRadius: "14px", overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: SOFT, borderBottom: `1px solid ${BORDER}` }}>
              {["Date", "Match", "Market", "Pick", "Pub. Odds", "Result", "Net Result"].map((h) => (
                <th key={h} style={{
                  padding: "10px 14px", textAlign: "left",
                  fontSize: "11px", fontWeight: 700, color: TEXT2,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  fontFamily: FONT, whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: TEXT2, fontSize: "13px", fontFamily: FONT }}>
                  No picks found for this filter.
                </td>
              </tr>
            ) : (
              groups.flatMap((group) => [
                <tr key={`h-${group.key}`}>
                  <td colSpan={7} style={{
                    padding: "9px 14px", background: SOFT,
                    borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
                    fontSize: "11.5px", fontWeight: 700, color: TEXT, fontFamily: FONT,
                  }}>
                    {group.label}
                    <span style={{ color: TEXT2, fontWeight: 500 }}>
                      {" "}· {group.bets.length} pick{group.bets.length !== 1 ? "s" : ""}
                    </span>
                  </td>
                </tr>,
                ...group.bets.map((bet) => {
                  const net = isSettled(bet)
                    ? (bet.result === "void" ? 0 : bet.result === "won"
                        ? Math.round(stakeCents * bet.publishedOdds) - stakeCents
                        : -stakeCents)
                    : null;
                  return (
                    <tr
                      key={bet.id}
                      style={{ borderBottom: `1px solid ${BORDER}` }}
                    >
                      <td style={{ padding: "11px 14px", fontSize: "12px", color: TEXT2, fontFamily: FONT, whiteSpace: "nowrap" }}>
                        {shortDate(bet.date)}
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "13px", fontWeight: 600, color: TEXT, fontFamily: FONT }}>
                        {bet.homeTeam} – {bet.awayTeam}
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "12px", color: TEXT2, fontFamily: FONT }}>
                        {bet.market}
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "13px", color: TEXT, fontFamily: FONT }}>
                        {bet.selection}
                      </td>
                      <td style={{
                        padding: "11px 14px", fontSize: "13px", fontWeight: 700,
                        color: ORANGE, fontFamily: FONT,
                        fontVariantNumeric: "tabular-nums",
                      }}>
                        {bet.publishedOdds.toFixed(2)}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <ResultBadge result={bet.result} />
                        {bet.revision && (
                          <span style={{ marginLeft: "6px", fontSize: "10px", color: "#B45309", fontFamily: FONT }}>
                            *revision
                          </span>
                        )}
                      </td>
                      <td style={{
                        padding: "11px 14px", fontSize: "13px", fontWeight: 700,
                        color: net === null ? TEXT2 : net >= 0 ? SUCCESS : DANGER,
                        fontFamily: FONT, fontVariantNumeric: "tabular-nums",
                      }}>
                        {net === null ? "—" : fmtEur(net)}
                      </td>
                    </tr>
                  );
                }),
              ])
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {groups.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: TEXT2, fontSize: "13px", fontFamily: FONT }}>
            No picks found for this filter.
          </div>
        ) : (
          groups.flatMap((group, groupIdx) => [
            <p key={`h-${group.key}`} style={{
              fontSize: "12.5px", fontWeight: 700, color: TEXT, fontFamily: FONT,
              margin: groupIdx === 0 ? "0 0 2px" : "10px 0 2px",
            }}>
              {group.label}
              <span style={{ color: TEXT2, fontWeight: 500 }}>
                {" "}· {group.bets.length} pick{group.bets.length !== 1 ? "s" : ""}
              </span>
            </p>,
            ...group.bets.map((bet) => {
              const net = isSettled(bet)
                ? (bet.result === "void" ? 0 : bet.result === "won"
                    ? Math.round(stakeCents * bet.publishedOdds) - stakeCents
                    : -stakeCents)
                : null;
              return (
                <div key={bet.id} style={{
                  background: "#fff", border: `1px solid ${BORDER}`,
                  borderRadius: "12px", padding: "14px 16px",
                }}>
                  <div className="flex items-start justify-between gap-2" style={{ marginBottom: "8px" }}>
                    <p style={{ fontSize: "12px", color: TEXT2, fontFamily: FONT }}>
                      {shortDate(bet.date)} · {bet.league}
                    </p>
                    <ResultBadge result={bet.result} />
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: TEXT, marginBottom: "3px", fontFamily: FONT }}>
                    {bet.homeTeam} – {bet.awayTeam}
                  </p>
                  <p style={{ fontSize: "12.5px", color: TEXT2, marginBottom: "8px", fontFamily: FONT }}>
                    {bet.selection} · {bet.market}
                  </p>
                  <div className="flex items-center justify-between">
                    <p style={{ fontSize: "12px", color: TEXT2, fontFamily: FONT }}>
                      Odds: <strong style={{ color: ORANGE }}>{bet.publishedOdds.toFixed(2)}</strong>
                    </p>
                    <p style={{
                      fontSize: "13px", fontWeight: 700,
                      color: net === null ? TEXT2 : net >= 0 ? SUCCESS : DANGER,
                      fontFamily: FONT, fontVariantNumeric: "tabular-nums",
                    }}>
                      {net === null ? "—" : fmtEur(net)}
                    </p>
                  </div>
                  {bet.revision && (
                    <p style={{ fontSize: "10.5px", color: "#B45309", marginTop: "6px", fontFamily: FONT }}>
                      Revision note: {bet.revision.reason}
                    </p>
                  )}
                </div>
              );
            }),
          ])
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   7. WHY FREE BET
══════════════════════════════════════════════════════════════════ */
const WHY_CARDS = [
  {
    title: "Discover the system through real picks",
    desc: "The Free Bet is not an artificial demo — it is a real example of Bet Capitale's daily pick approach.",
  },
  {
    title: "Base your decision on periodic results",
    desc: "Evaluate based on 7, 30 and 90-day performance, not a single pick.",
  },
  {
    title: "See odds and total return",
    desc: "Performance is measured not just by the number of winning picks, but by published odds and net result.",
  },
  {
    title: "Review with your own budget",
    desc: "Change the fixed daily amount to see a simulation of past results with your own budget.",
  },
];

function FreeBetBenefits() {
  return (
    <div>
      <Eyebrow>Why Do We Publish a Free Bet Every Day?</Eyebrow>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {WHY_CARDS.map((c, i) => (
          <div key={i} style={{
            background: "#fff", border: `1px solid ${BORDER}`,
            borderRadius: "14px", padding: "20px",
          }}>
            <p style={{
              fontSize: "13px", fontWeight: 700, color: ORANGE,
              marginBottom: "6px", fontFamily: FONT,
            }}>
              {i + 1}. {c.title}
            </p>
            <p style={{ fontSize: "13px", color: TEXT2, lineHeight: "1.6", fontFamily: FONT }}>
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   8. MEMBERSHIP CTA
══════════════════════════════════════════════════════════════════ */
function MembershipCTA() {
  return (
    <div style={{
      background: TEXT, borderRadius: "20px",
      padding: "40px 36px", textAlign: "center",
    }}>
      <p style={{
        fontSize: "24px", fontWeight: 800, color: "#fff",
        marginBottom: "12px", fontFamily: FONT,
      }}>
        The Free Bet is just the beginning.
      </p>
      <p style={{
        fontSize: "14px", color: "rgba(255,255,255,0.65)",
        maxWidth: "480px", margin: "0 auto 28px",
        lineHeight: "1.65", fontFamily: FONT,
      }}>
        Follow the free pick published every day. For more picks, coupons and detailed analysis
        move to a Bet Capitale membership.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/plans"
          style={{
            fontSize: "14px", fontWeight: 700, color: "#fff",
            padding: "13px 28px", borderRadius: "12px",
            background: ORANGE, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(232,119,31,0.35)",
            fontFamily: FONT,
          }}
          data-testid="button-cta-packages"
        >
          View Membership Plans
        </Link>
        <Link
          href="/today"
          style={{
            fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)",
            padding: "13px 28px", borderRadius: "12px",
            border: "1.5px solid rgba(255,255,255,0.2)",
            background: "transparent", textDecoration: "none",
            fontFamily: FONT,
          }}
          data-testid="button-cta-today"
        >
          View Today's Member Picks
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   9. DISCLAIMER
══════════════════════════════════════════════════════════════════ */
function FreeBetDisclaimer() {
  return (
    <div style={{
      borderTop: `1px solid ${BORDER}`, paddingTop: "24px",
    }}>
      <p style={{
        fontSize: "11.5px", color: TEXT2, lineHeight: "1.8",
        fontFamily: FONT, maxWidth: "720px",
      }}>
        The Free Bet is an analysis pick shared by Bet Capitale at no cost.
        It does not provide the user with a free betting balance, bonus or cash.{" "}
        Displayed financial values are a historical performance simulation generated with the selected fixed stake.{" "}
        Past performance does not guarantee future results.
        No guarantee of results or profit. 18+.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
function getIstanbulToday(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}

export default function FreeBetPage() {
  const [stake, setStake] = useState<number>(getInitialStake);

  const { data: bets = [], isLoading } = useQuery<FreeBet[]>({
    queryKey: ["/api/free-bets"],
  });

  const todayBet = useMemo(() => {
    const today = getIstanbulToday();
    return bets.find((b) => b.date === today) ?? null;
  }, [bets]);

  const handleStakeChange = useCallback((v: number) => {
    setStake(v);
    localStorage.setItem(LS_KEY, String(v));
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <SiteHeader />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 16px 64px" }}>
        {/* Section title */}
        <div style={{ marginBottom: "28px" }}>
          <p style={{
            fontSize: "11px", fontWeight: 700, color: ORANGE,
            textTransform: "uppercase", letterSpacing: "0.12em",
            marginBottom: "6px", fontFamily: FONT,
          }}>
            Free Bet
          </p>
          <h1 style={{
            fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: TEXT,
            margin: 0, fontFamily: FONT,
          }}>
            Free Daily Analysis Pick
          </h1>
        </div>

        {isLoading ? (
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            minHeight: "200px",
          }}>
            <p style={{ fontSize: "14px", color: TEXT2, fontFamily: FONT }}>
              Loading…
            </p>
          </div>
        ) : (
          <>
            {/* 1. Today's Free Bet */}
            <section style={{ marginBottom: "32px" }}>
              <DailyFreeBetCard bet={todayBet} stake={stake} />
            </section>

            {/* 2. Introduction */}
            <section style={{ marginBottom: "32px" }}>
              <FreeBetIntroduction />
            </section>

            {/* 3. Stake selector + 4. Period performance */}
            <section style={{
              background: "#fff", border: `1px solid ${BORDER}`,
              borderRadius: "16px", padding: "28px",
              marginBottom: "32px",
              boxShadow: "0 2px 12px rgba(14,23,38,0.04)",
            }}>
              <FreeBetStakeSelector stake={stake} onChange={handleStakeChange} />
              <div style={{ borderTop: `1px solid ${BORDER}`, margin: "24px 0" }} />
              <FreeBetPeriodPerformance stake={stake} bets={bets} />
            </section>

            {/* 5. Chart */}
            <section style={{ marginBottom: "32px" }}>
              <FreeBetProfitChart stake={stake} bets={bets} />
            </section>

            {/* 6. History */}
            <section style={{ marginBottom: "48px" }}>
              <FreeBetHistory stake={stake} bets={bets} />
            </section>

            {/* 7. Why */}
            <section style={{ marginBottom: "40px" }}>
              <FreeBetBenefits />
            </section>

            {/* 8. Membership CTA */}
            <section style={{ marginBottom: "40px" }}>
              <MembershipCTA />
            </section>

            {/* 9. Disclaimer */}
            <FreeBetDisclaimer />
          </>
        )}
      </div>
    </div>
  );
}
