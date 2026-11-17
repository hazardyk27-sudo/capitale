import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import SiteHeader from "@/components/SiteHeader";
import CommunityVoicesSection from "@/components/CommunityVoicesSection";
import LiveCommunityPanel from "@/components/LiveCommunityPanel";
import { ArrowRight, MessageSquare, Calendar, BarChart2, Users, CircleDollarSign } from "lucide-react";
import MobileHomePage from "@/components/MobileHomePage";

/* ── Design tokens ──────────────────────────────────────────────── */
const BG      = "#FCFCFB";
const SOFT    = "#F4F7F8";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const BORDER  = "#E4EAEE";
const CYAN    = "#E8771F";
const SUCCESS = "#129A63";
const DANGER  = "#D95A68";

/* ── Helpers ────────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: "11px", fontWeight: 700, color: CYAN,
      textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px",
    }}>
      {children}
    </p>
  );
}



/* ── Profit period summary card ─────────────────────────────────── */
function ProfitPeriodCard({
  label,
  entries,
  stake,
  days,
}: {
  label: string;
  entries: { date: string; value: number }[];
  stake: number;
  days: number;
}) {
  const mult = stake / 100;
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const filtered = sorted.slice(-days);
  const scaled = filtered.map((e) => e.value * mult);

  const net = scaled.reduce((s, v) => s + v, 0);
  const positive = scaled.filter((v) => v > 0);
  const negative = scaled.filter((v) => v < 0);
  const profitTotal = positive.reduce((s, v) => s + v, 0);
  const lossTotal = Math.abs(negative.reduce((s, v) => s + v, 0));
  const bestDay = scaled.length > 0 ? Math.max(...scaled) : null;
  const worstDay = scaled.length > 0 ? Math.min(...scaled) : null;

  const fmtV = (v: number) =>
    `${v >= 0 ? "+" : ""}${v.toLocaleString("en-US", { maximumFractionDigits: 0 })} €`;

  const netPos = net >= 0;
  const FONT = "'Manrope', sans-serif";

  const rows: { label: string; value: string; color?: string }[] = [
    { label: "Winning Days",    value: String(positive.length),                                             color: SUCCESS },
    { label: "Losing Days",     value: String(negative.length),                                             color: DANGER  },
    { label: "Best Day",        value: bestDay  !== null ? fmtV(bestDay)  : "—",                            color: SUCCESS },
    { label: "Worst Day",       value: worstDay !== null ? fmtV(worstDay) : "—",                            color: DANGER  },
    { label: "Profit Total", value: profitTotal > 0 ? fmtV(profitTotal) : "—",                           color: SUCCESS },
    { label: "Loss Total",  value: lossTotal  > 0 ? `-${lossTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} €` : "—", color: DANGER },
  ];

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

      <p style={{
        fontSize: "28px", fontWeight: 900,
        color: netPos ? SUCCESS : DANGER,
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1, marginBottom: "4px", fontFamily: FONT,
      }}>
        {fmtV(net)}
      </p>
      <p style={{ fontSize: "11px", color: TEXT2, marginBottom: "16px", fontFamily: FONT }}>
        Net result · €{stake} / coupon
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {rows.map((row) => (
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

/* ── Simulation chart tooltip ───────────────────────────────────── */
function SimTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const daily = d.value as number;
  const stake = d.stake as number;
  return (
    <div style={{
      background: "#FFFFFF", border: `1px solid ${BORDER}`,
      borderRadius: "9px", padding: "11px 14px",
      boxShadow: "0 4px 16px rgba(14,23,38,0.08)", minWidth: "160px",
    }}>
      <p style={{ fontSize: "11px", color: TEXT2, marginBottom: "6px", fontWeight: 600 }}>{d.day}</p>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", color: TEXT2 }}>Stake per coupon</span>
        <span style={{ fontSize: "11px", fontWeight: 600, color: TEXT }}>€{stake}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
        <span style={{ fontSize: "11px", color: TEXT2 }}>Net Result</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: daily >= 0 ? SUCCESS : DANGER }}>
          {daily >= 0 ? "+" : ""}{daily.toLocaleString("en-US", { maximumFractionDigits: 2 })} €
        </span>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function Landing() {
  const [simRange, setSimRange] = useState<"7d" | "14d" | "30d" | "90d">("30d");
  const [simStake, setSimStake] = useState<number>(100);

  const { data: entries = [] } = useQuery<{ id: number; date: string; value: number }[]>({
    queryKey: ["/api/entries"],
  });

  const simData = (() => {
    const daysMap: Record<string, number> = { "7d": 7, "14d": 14, "30d": 30, "90d": 90 };
    const n = daysMap[simRange];
    const mult = simStake / 100;
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const filtered = sorted.slice(-n);

    const points = filtered.map((e) => ({
      date: e.date,
      day: new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      value: e.value * mult,
      stake: simStake,
    }));

    const scaled = filtered.map((e) => e.value * mult);
    const periodNetResult  = scaled.reduce((s, v) => s + v, 0);
    const activeDataDays   = filtered.length;
    const positiveDayCount = scaled.filter((v) => v > 0).length;
    const negativeDayCount = scaled.filter((v) => v < 0).length;
    const breakEvenDayCount = scaled.filter((v) => v === 0).length;
    const bestDayVal       = scaled.length > 0 ? Math.max(...scaled) : null;
    const worstDayVal      = scaled.length > 0 ? Math.min(...scaled) : null;
    const profitableTotal  = scaled.filter((v) => v > 0).reduce((s, v) => s + v, 0);
    const lossTotal        = Math.abs(scaled.filter((v) => v < 0).reduce((s, v) => s + v, 0));
    const dataShortfall    = filtered.length < n;

    return {
      points, periodNetResult, activeDataDays,
      positiveDayCount, negativeDayCount, breakEvenDayCount,
      bestDayVal, worstDayVal, profitableTotal, lossTotal,
      dataShortfall, requestedDays: n,
    };
  })();

  const STAKE_OPTIONS = [10, 25, 50, 100, 150, 200, 300, 500];
  const simRangeLabels: Record<string, string> = { "7d": "7 Days", "14d": "14 Days", "30d": "30 Days", "90d": "90 Days" };

  return (
    <>
    <div className="desktopHome" style={{ background: "#FFFFFF", color: TEXT, minHeight: "100vh" }}>
      <SiteHeader />

      {/* ═══ HERO ════════════════════════════════════════════════ */}
      <section style={{ background: "#FFFFFF", padding: "38px 24px 100px" }}>

        <div className="hero-grid mx-auto" style={{ maxWidth: "1160px" }}>

          {/* ── Left: copy ──────────────────────────────────────── */}
          <div style={{ maxWidth: "500px" }}>


            {/* Headline — serif, 6 controlled lines */}
            <h1 className="hero-headline" data-testid="text-hero-headline">
              <span className="line dark">We do the planning.</span>
              <span className="line orange">You enjoy the winning.</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: "17px", color: TEXT2, lineHeight: 1.5,
              marginTop: "28px", marginBottom: "34px", maxWidth: "440px",
              fontFamily: "'Manrope', sans-serif",
            }}>
              Built on the right strategy for consistent long-term profits.
            </p>

            {/* Desktop CTA buttons */}
            <div
              className="desktopActions items-center"
              style={{ gap: "10px", flexWrap: "nowrap" }}
            >
              <Link href="/today">
                <button
                  data-testid="button-hero-today"
                  style={{
                    background: CYAN, color: "#fff", fontWeight: 700, fontSize: "15px",
                    height: "56px", padding: "0 22px", borderRadius: "12px", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                    fontFamily: "'Manrope', sans-serif",
                    boxShadow: "0 4px 14px rgba(232,119,31,0.28)",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.transform = "translateY(-2px)";
                    b.style.boxShadow = "0 8px 22px rgba(232,119,31,0.40)";
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.transform = "translateY(0)";
                    b.style.boxShadow = "0 4px 14px rgba(232,119,31,0.28)";
                  }}
                >
                  <Calendar size={15} />
                  Today's Matches
                  <ArrowRight size={14} />
                </button>
              </Link>

              <a
                href="#community-voices"
                data-testid="button-hero-community"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("community-voices")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: "#fff", color: TEXT, fontWeight: 600, fontSize: "15px",
                  height: "56px", padding: "0 20px", borderRadius: "12px",
                  border: `1.5px solid ${BORDER}`,
                  cursor: "pointer", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  fontFamily: "'Manrope', sans-serif",
                  boxShadow: "0 2px 6px rgba(14,23,38,0.05)",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.transform = "translateY(-2px)";
                  a.style.borderColor = "#b8c0c8";
                }}
                onMouseLeave={(e) => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.transform = "translateY(0)";
                  a.style.borderColor = BORDER;
                }}
              >
                <MessageSquare size={14} style={{ flexShrink: 0, color: TEXT2 }} />
                Community Voice
              </a>

              <a
                href="#profit-simulation"
                data-testid="button-hero-simulate"
                style={{
                  background: "#0E1726", color: "#FFFFFF", fontWeight: 600, fontSize: "15px",
                  height: "56px", padding: "0 20px", borderRadius: "12px",
                  border: "1.5px solid #0E1726",
                  cursor: "pointer", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  fontFamily: "'Manrope', sans-serif",
                  transition: "transform 0.18s ease, background 0.18s ease, border-color 0.18s ease",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(14,23,38,0.18)",
                }}
                onMouseEnter={(e) => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.transform = "translateY(-2px)";
                  a.style.background = "#1a2d4a";
                  a.style.borderColor = "#1a2d4a";
                }}
                onMouseLeave={(e) => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.transform = "translateY(0)";
                  a.style.background = "#0E1726";
                  a.style.borderColor = "#0E1726";
                }}
              >
                <CircleDollarSign size={15} style={{ flexShrink: 0 }} />
                Calculate Profit
              </a>
            </div>
          </div>

          {/* ── Right: membership panel ─────────────────────────── */}
          <div
            className="hero-right-col"
            style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0 }}
          >
            <LiveCommunityPanel />
          </div>
        </div>

        {/* ── Mobile actions panel (inside section, below grid) ── */}
        <div
          className="mobileActions"
          style={{
            maxWidth: "1160px",
            margin: "18px auto 0",
            background: "#FFFFFF",
            border: `1px solid ${BORDER}`,
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            minHeight: "128px",
          }}
        >
          {/* Today's Matches */}
          <Link
            href="/today"
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "10px", padding: "20px 8px",
              textDecoration: "none",
            }}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: "rgba(232,119,31,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Calendar size={18} color={CYAN} />
            </div>
            <span style={{
              fontSize: "12px", fontWeight: 700, color: TEXT,
              textAlign: "center", lineHeight: 1.35,
              fontFamily: "'Manrope', sans-serif",
            }}>
              Today's<br />Matches
            </span>
          </Link>

          <div style={{ width: "1px", background: BORDER }} />

          {/* Community Voice */}
          <a
            href="#community-voices"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("community-voices")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "10px", padding: "20px 8px",
              textDecoration: "none",
            }}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: "rgba(14,23,38,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MessageSquare size={18} color={TEXT2} />
            </div>
            <span style={{
              fontSize: "12px", fontWeight: 700, color: TEXT,
              textAlign: "center", lineHeight: 1.35,
              fontFamily: "'Manrope', sans-serif",
            }}>
              Community<br />Voice
            </span>
          </a>

          <div style={{ width: "1px", background: BORDER }} />

          {/* Calculate Profit */}
          <a
            href="#profit-simulation"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("profit-simulation")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "10px", padding: "20px 8px",
              textDecoration: "none",
            }}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: "rgba(232,119,31,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BarChart2 size={18} color={CYAN} />
            </div>
            <span style={{
              fontSize: "12px", fontWeight: 700, color: TEXT,
              textAlign: "center", lineHeight: 1.35,
              fontFamily: "'Manrope', sans-serif",
            }}>
              Calculate<br />Profit
            </span>
          </a>
        </div>
      </section>

      {/* ═══ COMMUNITY VOICES ════════════════════════════════════ */}
      <CommunityVoicesSection />

      {/* ═══ SIMULATION ══════════════════════════════════════════ */}
      <section id="profit-simulation" style={{ background: SOFT, padding: "72px 24px", borderTop: `1px solid ${BORDER}`, overflowX: "hidden" }}>
        <div className="mx-auto" style={{ maxWidth: "1100px" }}>

          {/* Section header */}
          <div style={{ marginBottom: "32px" }}>
            <Label>PROFIT SIMULATION</Label>
            <h2 style={{
              fontSize: "clamp(20px, 2.8vw, 30px)", fontWeight: 800,
              color: TEXT, lineHeight: 1.15, fontFamily: "'Manrope', sans-serif",
              marginBottom: "10px",
            }}>
              What would have happened with your chosen stake?
            </h2>
            <p style={{ fontSize: "14px", color: TEXT2, maxWidth: "520px" }}>
              Choose the stake per coupon and the period you want to examine.
            </p>
          </div>

          {/* ── Selector card ──────────────────────────────────── */}
          <div className="p-4 sm:p-7" style={{
            background: "#fff", border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(14,23,38,0.04)",
            marginBottom: "16px",
          }}>
            <p style={{ fontSize: "16px", fontWeight: 700, color: TEXT, marginBottom: "4px", fontFamily: "'Manrope', sans-serif" }}>
              See Performance With Your Own Budget
            </p>
            <p style={{ fontSize: "13px", color: TEXT2, marginBottom: "20px", fontFamily: "'Manrope', sans-serif" }}>
              Simulate your profit based on the amount you stake per coupon.
            </p>

            {/* Stake row */}
            <div style={{ marginBottom: "6px" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                Stake Per Coupon
              </p>
              <div className="flex flex-wrap gap-2" style={{ marginBottom: "16px" }}>
                {STAKE_OPTIONS.map((s) => {
                  const active = simStake === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSimStake(s)}
                      data-testid={`button-sim-stake-${s}`}
                      style={{
                        minWidth: "64px", minHeight: "44px",
                        padding: "8px 16px", borderRadius: "10px",
                        fontSize: "13.5px", fontWeight: active ? 700 : 500,
                        color: active ? "#fff" : TEXT,
                        background: active ? CYAN : "#fff",
                        border: `1.5px solid ${active ? CYAN : BORDER}`,
                        cursor: "pointer", transition: "all 0.15s",
                        fontFamily: "'Manrope', sans-serif",
                        outline: active ? `2px solid ${CYAN}30` : "none",
                      }}
                    >
                      €{s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Period row */}
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                Period
              </p>
              <div className="flex flex-wrap gap-2" style={{ marginBottom: "16px" }}>
                {(["7d", "14d", "30d", "90d"] as const).map((r) => {
                  const active = simRange === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setSimRange(r)}
                      data-testid={`button-sim-${r}`}
                      style={{
                        minWidth: "64px", minHeight: "44px",
                        padding: "8px 16px", borderRadius: "10px",
                        fontSize: "13.5px", fontWeight: active ? 700 : 500,
                        color: active ? "#fff" : TEXT,
                        background: active ? CYAN : "#fff",
                        border: `1.5px solid ${active ? CYAN : BORDER}`,
                        cursor: "pointer", transition: "all 0.15s",
                        fontFamily: "'Manrope', sans-serif",
                        outline: active ? `2px solid ${CYAN}30` : "none",
                      }}
                    >
                      {simRangeLabels[r]}
                    </button>
                  );
                })}
              </div>
            </div>

            <p style={{ fontSize: "11.5px", color: TEXT2, fontFamily: "'Manrope', sans-serif" }}>
              Calculation is a simulation of past coupon results adapted to the selected fixed stake amount.
            </p>
          </div>

          {/* ── Period summary cards ───────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: "24px" }}>
            <ProfitPeriodCard label="Last 7 Days"  entries={entries} stake={simStake} days={7}  />
            <ProfitPeriodCard label="Last 30 Days" entries={entries} stake={simStake} days={30} />
            <ProfitPeriodCard label="Last 90 Days" entries={entries} stake={simStake} days={90} />
          </div>

          {/* Ledger card */}
          <div style={{
            background: "#FFFFFF", border: `1px solid ${BORDER}`,
            borderRadius: "20px", boxShadow: "0 4px 32px rgba(14,23,38,0.07), 0 1px 4px rgba(14,23,38,0.04)",
            overflow: "hidden",
          }}>

            {/* Top row: center big result | right table */}
            <div className="flex flex-col lg:flex-row">

              {/* Center — big net result */}
              <div
                className="border-b lg:border-b-0 lg:border-r w-full lg:max-w-[280px]"
                style={{
                  flex: "0 0 auto",
                  padding: "20px 20px",
                  borderColor: BORDER,
                  display: "flex", flexDirection: "column", justifyContent: "flex-start",
                  minWidth: 0,
                }}
              >
                {simData.activeDataDays === 0 ? (
                  <p style={{ fontSize: "13px", color: TEXT2 }}>No data recorded for this period.</p>
                ) : (
                  <>
                    <p style={{
                      fontSize: "10px", fontWeight: 700, color: TEXT2,
                      textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px",
                    }}>
                      Net Result
                    </p>
                    <p
                      data-testid="text-sim-net-result"
                      style={{
                        fontSize: "clamp(22px, 2.8vw, 36px)", fontWeight: 800, lineHeight: 1,
                        color: simData.periodNetResult >= 0 ? SUCCESS : DANGER,
                        fontVariantNumeric: "tabular-nums", fontFamily: "'Manrope', sans-serif",
                        letterSpacing: "-0.02em", marginBottom: "14px",
                        wordBreak: "break-word",
                      }}
                    >
                      {simData.periodNetResult >= 0 ? "+" : ""}
                      {simData.periodNetResult.toLocaleString("en-US", { maximumFractionDigits: 0 })} €
                    </p>
                    <p style={{
                      fontSize: "11px", color: TEXT2,
                      background: SOFT, borderRadius: "6px",
                      padding: "5px 10px", display: "inline-block",
                    }}>
                      €{simStake} per coupon · Last {simData.activeDataDays} data days
                    </p>
                    {simData.dataShortfall && (
                      <p style={{ fontSize: "10px", color: TEXT2, marginTop: "10px", lineHeight: 1.5 }}>
                        {simData.activeDataDays} data days available for the selected period were included in the calculation.
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Right — detail table */}
              <div style={{ flex: "1 1 0", padding: "20px 20px", minWidth: 0 }}>
                {simData.activeDataDays === 0 ? null : (() => {
                  const fmt = (v: number) =>
                    `${v >= 0 ? "+" : ""}${v.toLocaleString("en-US", { maximumFractionDigits: 0 })} €`;
                  const rows: { label: string; value: string; color: string; bold?: boolean }[] = [
                    { label: "Selected Stake", value: `€${simStake}`, color: TEXT },
                    { label: "Selected Period", value: simRangeLabels[simRange], color: TEXT },
                    { label: "Days With Data", value: String(simData.activeDataDays), color: TEXT },
                    { label: "Winning Days", value: String(simData.positiveDayCount), color: SUCCESS },
                    { label: "Losing Days", value: String(simData.negativeDayCount), color: DANGER },
                    {
                      label: "Best Day",
                      value: simData.bestDayVal !== null ? fmt(simData.bestDayVal) : "—",
                      color: SUCCESS,
                    },
                    {
                      label: "Worst Day",
                      value: simData.worstDayVal !== null ? fmt(simData.worstDayVal) : "—",
                      color: DANGER,
                    },
                    {
                      label: "Total Profit Days",
                      value: simData.profitableTotal > 0 ? `+${simData.profitableTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} €` : "—",
                      color: SUCCESS,
                    },
                    {
                      label: "Total Loss Days",
                      value: simData.lossTotal > 0 ? `-${simData.lossTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} €` : "—",
                      color: DANGER,
                    },
                    {
                      label: "Net Result",
                      value: fmt(simData.periodNetResult),
                      color: simData.periodNetResult >= 0 ? SUCCESS : DANGER,
                      bold: true,
                    },
                  ];
                  return (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {rows.map((row, i) => (
                        <div key={row.label} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "baseline",
                          gap: "8px",
                          padding: "9px 0",
                          borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}` : "none",
                        }}>
                          <span style={{ fontSize: "11px", color: TEXT2, minWidth: 0 }}>{row.label}</span>
                          <span style={{
                            fontSize: row.bold ? "14px" : "12px",
                            fontWeight: row.bold ? 800 : 700,
                            color: row.color,
                            fontVariantNumeric: "tabular-nums",
                            fontFamily: "'Manrope', sans-serif",
                            flexShrink: 0,
                          }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: `1px solid ${BORDER}` }} />

            {/* Bottom — daily bar chart */}
            <div style={{ padding: "24px 28px 20px" }}>
              <p style={{
                fontSize: "10px", fontWeight: 700, color: TEXT2,
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px",
              }}>
                Daily Net Result
              </p>
              <div style={{ height: "220px" }}>
                {simData.points.length === 0 ? (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: "13px", color: TEXT2 }}>No recorded performance data for this period.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={simData.points} margin={{ top: 4, right: 8, left: 8, bottom: 0 }} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={BORDER} />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 10, fill: TEXT2 }}
                        tickLine={false} axisLine={false}
                        interval={simData.points.length > 20 ? Math.floor(simData.points.length / 8) : 0}
                      />
                      <YAxis hide width={0} />
                      <Tooltip content={<SimTooltip />} cursor={{ fill: "rgba(14,23,38,0.04)" }} />
                      <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                        {simData.points.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.value >= 0 ? SUCCESS : DANGER}
                            fillOpacity={0.85}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* CTA row */}
            <div style={{
              borderTop: `1px solid ${BORDER}`,
              padding: "18px 28px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: "12px",
              background: SOFT,
            }}>
              <p style={{ fontSize: "12px", color: TEXT2, margin: 0, lineHeight: 1.5 }}>
                View all winning and losing periods in detail.
              </p>
              <Link
                href="/history"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "13px", fontWeight: 700, color: CYAN,
                  padding: "10px 18px", borderRadius: "8px",
                  border: `1.5px solid ${CYAN}`, textDecoration: "none",
                  background: "#fff", whiteSpace: "nowrap",
                  minHeight: "44px",
                }}
                data-testid="link-gecmis-all-performance"
              >
                View Full Performance
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ════════════════════════════════════════ */}
      <section id="how-it-works" style={{ background: SOFT, padding: "80px 24px", borderTop: `1px solid ${BORDER}` }}>
        <div className="mx-auto" style={{ maxWidth: "1100px" }}>
          <div style={{ marginBottom: "60px" }}>
            <Label>How It Works</Label>
            <h2 style={{
              fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 800, color: TEXT,
              lineHeight: 1.15, fontFamily: "'Manrope', sans-serif", maxWidth: "440px",
            }}>
              Three Core Principles
            </h2>
            <p style={{ fontSize: "15px", color: TEXT2, marginTop: "10px", maxWidth: "400px" }}>
              The analysis system behind Bet Capitale is built on these three principles.
            </p>
          </div>

          {/* Editorial principle blocks — each with distinct visual rhythm */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              {
                num: "01",
                title: "Software Analysis",
                desc: "The day's matches are scanned by the software. Options that do not meet the defined criteria are automatically filtered out; only those that qualify from hundreds of matches make the shortlist.",
                numAlign: "flex-start" as const,
                lineAlign: "flex-start" as const,
              },
              {
                num: "02",
                title: "Algorithmic Filtering",
                desc: "Shortlisted matches are compared according to the algorithm's scoring rules. The options with the strongest data fit enter the coupon pool; the rest are eliminated.",
                numAlign: "center" as const,
                lineAlign: "center" as const,
              },
              {
                num: "03",
                title: "Transparent Measurement",
                desc: "Every coupon is documented and results are recorded once matches are completed. Daily, weekly and monthly hit rates are published openly; the archive is always accessible.",
                numAlign: "flex-end" as const,
                lineAlign: "flex-end" as const,
              },
            ].map((p, i) => (
              <div
                key={p.num}
                style={{
                  borderTop: `1px solid ${BORDER}`,
                  padding: "44px 0",
                }}
                data-testid={`card-system-${p.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  {/* Number column */}
                  <div style={{
                    flex: "0 0 auto", width: "100px",
                    display: "flex", flexDirection: "column",
                    alignItems: p.numAlign,
                  }}>
                    <span style={{
                      fontSize: "80px", fontWeight: 800,
                      color: "rgba(14,23,38,0.055)",
                      lineHeight: 1, fontFamily: "'Manrope', sans-serif",
                      letterSpacing: "-0.04em",
                      userSelect: "none",
                    }}>
                      {p.num}
                    </span>
                    <span style={{
                      display: "block", width: "28px", height: "2px",
                      background: CYAN, borderRadius: "2px", marginTop: "8px",
                      alignSelf: p.lineAlign,
                    }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: "10px" }}>
                    <h3 style={{
                      fontSize: "20px", fontWeight: 800, color: TEXT,
                      marginBottom: "12px", fontFamily: "'Manrope', sans-serif",
                    }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: "15px", color: TEXT2, lineHeight: 1.72, maxWidth: "520px" }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Link to detail page */}
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "36px" }}>
            <a
              href="/how-it-works"
              data-testid="link-nasil-calisir-detail"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontSize: "14px", fontWeight: 700, color: CYAN,
                textDecoration: "none", letterSpacing: "-0.01em",
              }}
            >
              Learn How It Works →
              <span style={{ fontSize: "16px" }}>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═════════════════════════════════════════════════ */}
      <section style={{ background: SOFT, padding: "80px 24px", borderTop: `1px solid ${BORDER}` }}>
        <div className="mx-auto" style={{ maxWidth: "520px", textAlign: "center" }}>
          <Label>GET STARTED FREE</Label>
          <h2 style={{
            fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 800, color: TEXT,
            lineHeight: 1.2, marginBottom: "14px", fontFamily: "'Manrope', sans-serif",
          }}>
            Understand the system,{" "}
            <span style={{ color: CYAN }}>follow the data.</span>
          </h2>
          <p style={{ fontSize: "15px", color: TEXT2, lineHeight: 1.7, marginBottom: "32px" }}>
            Review today's coupons and analyse past performance.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/today">
              <button
                style={{
                  background: CYAN, color: TEXT, fontWeight: 700, fontSize: "14px",
                  padding: "13px 28px", borderRadius: "8px", border: "none", cursor: "pointer",
                  fontFamily: "'Manrope', sans-serif",
                }}
                data-testid="button-cta-today"
              >
                View Today
              </button>
            </Link>
            <Link href="/history">
              <button
                style={{
                  background: "transparent", color: TEXT2, fontWeight: 500, fontSize: "14px",
                  padding: "13px 28px", borderRadius: "8px",
                  border: `1px solid ${BORDER}`, cursor: "pointer",
                }}
                data-testid="button-cta-history"
              >
                Past Coupons
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
    <div className="mobileHome">
      <MobileHomePage />
    </div>
    </>
  );
}
