import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { usePostCheckoutStatus } from "@/hooks/usePostCheckoutStatus";
import logoImg from "@assets/bet-capitale-wordmark.webp";
import brandSymbolImg from "@assets/bet-capitale-symbol.webp";
import type { TodayMatch, TodayCoupon, HistoryCouponLeg, Fixture } from "@shared/schema";

/* ── Brand tokens — sourced from client/src/index.css --sb-* vars ─── */
const NAVY    = "#0E1726";
const ORANGE  = "#E8771F";
const BG      = "#FCFCFB";
const SOFT    = "#F4F7F8";
const BLACK   = "#111111";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const TEXT3   = "#94A3B8";
const BORDER  = "#E4EAEE";
const BORDER_STRONG = "#C8D3DD";
const SUCCESS = "#129A63";
const TELEGRAM_BLUE = "#229ED9";
const DANGER  = "#D95A68";
const FONT    = "'Manrope', sans-serif";
/* Editorial display face — the same serif already used for the real
   homepage hero headline (see .hero-headline in index.css). Reused here
   for every "big data" number so the whole page reads as one
   typographic system rather than a bag of ad-hoc landing-page styles. */
const SERIF   = "'DM Serif Display', 'Playfair Display', Georgia, serif";
/* Reserved for the single largest figure on the page — the hero net
   result. Source Serif 4 is an optical-size-aware editorial serif with
   restrained, high-contrast numerals: at display weight/size it reads
   as a refined printed ledger figure rather than a decorative display
   headline, so it's kept as its own token instead of overloading SERIF. */
const SERIF_HERO_NUMBER = "'Source Serif 4', 'DM Serif Display', Georgia, serif";

/* Real official Telegram channel — confirmed by site owner. */
const TELEGRAM_URL = "https://t.me/betcapitale";
const PROMOTION_TELEGRAM_URLS = {
  x: "https://t.me/+JDqhwCr9q9xkOGU0",
  insta: "https://t.me/+bKcS4rtVsnUzNDY0",
  ads: "https://t.me/+aCoX26z3DdtjOTI0",
  meta: "https://t.me/+Z5LEiY2ThjxiOTc0",
  direct: TELEGRAM_URL,
} as const;

/* ── Date / time helpers (same Istanbul convention as the rest of the app) ── */
function todayISODate(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}

function useIstanbulToday(): string {
  const [date, setDate] = useState(() => todayISODate());
  useEffect(() => {
    const id = setInterval(() => setDate(todayISODate()), 60_000);
    return () => clearInterval(id);
  }, []);
  return date;
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatShortDate(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", timeZone: "Europe/Istanbul" }).toUpperCase();
}

function formatWeekdayShort(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString("en-US", { weekday: "short", timeZone: "Europe/Istanbul" }).toUpperCase();
}

/** Splits a date into a day/month pair for the asymmetric date rail (Today
 * section). Presentation-only — no data logic involved. */
function splitDate(dateStr: string): { day: string; month: string } {
  const d = parseDate(dateStr);
  return {
    day: d.toLocaleDateString("en-US", { day: "numeric", timeZone: "Europe/Istanbul" }),
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "Europe/Istanbul" }).toUpperCase(),
  };
}

/** Formats a real ISO timestamp (e.g. history_coupons.settledAt) into a
 * short Istanbul-local date+time string. Returns "" if the value doesn't
 * parse — callers must treat that as "omit this detail", never fabricate. */
function fmtDateTimeIstanbul(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Istanbul",
  });
}

/** Minutes between two same-day "HH:MM" wall-clock strings (b − a). Both
 * values already come from Europe/Istanbul-formatted app data, so no
 * timezone conversion is needed — just wall-clock arithmetic. */
function diffMinutesHHMM(hhmmA: string, hhmmB: string): number {
  const [h1, m1] = hhmmA.split(":").map(Number);
  const [h2, m2] = hhmmB.split(":").map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}

function fmtDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/* ── Number formatting ─────────────────────────────────────────── */
function fmtBigEuro(n: number): string {
  const sign = n >= 0 ? "+" : "−";
  return `${sign}€${Math.round(Math.abs(n)).toLocaleString("en-US")}`;
}

function fmtEur(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Types ─────────────────────────────────────────────────────── */
interface RealEntry { id: number; date: string; value: number; }
interface RealMatch { id: number; date: string; homeTeam: string; awayTeam: string; result: string; }

interface WindowStats {
  netResult: number;
  totalMatches: number;
  wonMatches: number;
  lostMatches: number;
  profitableDays: number;
  losingDays: number;
  recordedDays: number;
  bars: { label: string; value: number }[];
  /** Same window as `bars`, but carrying enough detail (real date, weekday,
   * running total) to render the "7-day build receipt" — never fabricated,
   * derived from the same day-by-day entries as everything else here. */
  dailyBreakdown: { date: string; dateLabel: string; weekday: string; value: number; cumulative: number }[];
}

/**
 * Mirrors the exact "last N recorded days" logic used on the History page:
 * group entries by date (in case of multiple rows per day), take the most
 * recent N recorded dates, and compute stats only from that window. Matches
 * are filtered to the same date range. Never manufactures data — if fewer
 * than N recorded days exist, the honest smaller window is used.
 */
function computeWindowStats(entries: RealEntry[], matches: RealMatch[], windowSize: number): WindowStats {
  const byDay = new Map<string, number>();
  for (const e of entries) byDay.set(e.date, (byDay.get(e.date) ?? 0) + e.value);

  const sortedDates = Array.from(byDay.keys()).sort((a, b) => a.localeCompare(b));
  const windowDates = sortedDates.slice(-windowSize);
  const dateSet = new Set(windowDates);

  let netResult = 0;
  let profitableDays = 0;
  let losingDays = 0;
  for (const d of windowDates) {
    const v = byDay.get(d) ?? 0;
    netResult += v;
    if (v > 0) profitableDays++;
    else if (v < 0) losingDays++;
  }

  const startDate = windowDates[0];
  const endDate = windowDates[windowDates.length - 1];
  const windowMatches = (startDate && endDate)
    ? matches.filter((m) => m.date >= startDate && m.date <= endDate)
    : [];

  const bars = windowDates.map((d) => ({ label: formatShortDate(d), value: byDay.get(d) ?? 0 }));

  let running = 0;
  const dailyBreakdown = windowDates.map((d) => {
    const value = byDay.get(d) ?? 0;
    running += value;
    return { date: d, dateLabel: formatShortDate(d), weekday: formatWeekdayShort(d), value, cumulative: running };
  });

  return {
    netResult,
    totalMatches: windowMatches.length,
    wonMatches: windowMatches.filter((m) => m.result === "won").length,
    lostMatches: windowMatches.filter((m) => m.result === "lost").length,
    profitableDays,
    losingDays,
    recordedDays: windowDates.length,
    bars,
    dailyBreakdown,
  };
}

function smoothScrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── Premium motion helpers ────────────────────────────────────────
   Restrained, purposeful motion only: a soft entrance per section and
   a count-up on the headline numbers. No bounce, no glow, no parallax. ── */
const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function useCountUp(target: number, active: boolean, duration = 900): number {
  const [value, setValue] = useState(0);
  // Tracks the last displayed value via ref (not state) so that if `target`
  // changes again — e.g. React Query refetches on window focus — the next
  // animation restarts smoothly from what's currently on screen instead of
  // being permanently skipped, which would leave a stale/partial number
  // shown for a performance metric.
  const displayedRef = useRef(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    const from = startedRef.current ? displayedRef.current : 0;
    startedRef.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      displayedRef.current = v;
      setValue(v);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        displayedRef.current = target;
        setValue(target);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

/* ── Shared editorial primitives ──────────────────────────────────
   These mirror the real site's primitives (landing.tsx `Label`,
   history.tsx section rhythm, today.tsx dividers) rather than
   introducing a new card-and-pill vocabulary. ── */

function Section({ id, children, bg, style }: { id: string; children: React.ReactNode; bg?: string; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ background: bg ?? BG, padding: "44px 20px", scrollMarginTop: "16px", ...style }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}

function Label({ children, color = ORANGE }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: 700, color, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px", fontFamily: FONT }}>
      {children}
    </p>
  );
}

/** "01 / How Did We Do It" style index marker used to open each numbered
 * section, so the page still reads as a counted sequence even without a
 * separate quick-jump index. */
function Index({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: 800, color: TEXT2, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px", fontFamily: FONT }}>
      <span style={{ color: ORANGE }}>{n}</span> / {children}
    </p>
  );
}

function Rule({ margin = "22px 0", dark = false }: { margin?: string; dark?: boolean }) {
  return <div style={{ height: "1px", background: dark ? "rgba(255,255,255,0.12)" : BORDER, margin }} />;
}

function TextAction({
  children, onClick, href, target, testId, dark = false,
}: {
  children: React.ReactNode; onClick?: () => void; href?: string; target?: string; testId: string; dark?: boolean;
}) {
  const style: React.CSSProperties = {
    fontSize: "13.5px", fontWeight: 700, color: dark ? "#FFFFFF" : TEXT, textDecoration: "none",
    fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: "6px",
    cursor: "pointer", background: "none", border: "none", padding: 0,
  };
  if (href) {
    return (
      <a href={href} target={target} rel={target ? "noopener noreferrer" : undefined} data-testid={testId} style={style} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button data-testid={testId} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

/** Narrative link-forward row: the short "see X ↓" text that connects one
 * section to the next, per the proof-driven-narrative brief. Optionally
 * paired with a smaller secondary action (e.g. "Open full history →"). */
function NextLink({ children, primaryTestId, onClick, secondary }: {
  children: React.ReactNode; primaryTestId: string; onClick: () => void;
  secondary?: { label: React.ReactNode; testId: string; onClick: () => void };
}) {
  return (
    <div style={{ marginTop: "26px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <TextAction testId={primaryTestId} onClick={onClick}>{children}</TextAction>
      {secondary && (
        <span style={{ opacity: 0.75 }}>
          <TextAction testId={secondary.testId} onClick={secondary.onClick}>{secondary.label}</TextAction>
        </span>
      )}
    </div>
  );
}

/* ── Promotion top bar ─────────────────────────────────────────── */
function TopBar() {
  return (
    <div style={{ background: BLACK, padding: "14px 20px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", display: "flex", alignItems: "center" }}>
        <div style={{ width: "150px", height: "26px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <img
            src={logoImg}
            alt="Bet Capitale"
            style={{
              position: "absolute", width: "150px", height: "auto",
              top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Integrated 7-day rhythm — a compact but readable daily bar chart.
   Taller than a purely decorative sparkline on purpose: each bar carries
   its own value label (bottom-anchored above the bar, so short and tall
   days line up the same way) and the best day is called out in orange,
   so the day-to-day spread is legible at a glance, not just on hover. ── */
function DayRhythm({ bars, margin = "24px 0 6px", height = 132 }: { bars: { label: string; value: number }[]; margin?: string; height?: number }) {
  if (!bars.length) return null;
  const max = Math.max(1, ...bars.map((b) => Math.abs(b.value)));
  const bestIdx = bars.reduce((best, b, i) => (b.value > bars[best].value ? i : best), 0);
  const labelSpace = 22;
  const barArea = height - labelSpace;
  return (
    <div style={{ margin }}>
      <div
        style={{
          display: "flex", alignItems: "flex-end", gap: "7px", height: `${height}px`,
          borderBottom: `1px solid ${BORDER}`, paddingBottom: "1px",
        }}
      >
        {bars.map((b, i) => {
          const h = Math.max(6, Math.round((Math.abs(b.value) / max) * (barArea - 4)));
          const isBest = i === bestIdx && b.value > 0;
          return (
            <div
              key={i}
              title={`${b.label}: ${b.value >= 0 ? "+" : ""}${Math.round(b.value)} €`}
              style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}
            >
              <span
                style={{
                  fontSize: "9px", fontWeight: 800, marginBottom: "5px", fontFamily: FONT,
                  color: isBest ? ORANGE : TEXT3, whiteSpace: "nowrap",
                }}
              >
                {b.value >= 0 ? "+" : "−"}
                {Math.round(Math.abs(b.value)).toLocaleString("en-US")}
              </span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${h}px` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
                style={{
                  width: "100%", borderRadius: "3px 3px 0 0",
                  background: isBest ? ORANGE : b.value >= 0 ? SUCCESS : DANGER,
                  opacity: b.value === 0 ? 0.25 : isBest ? 1 : 0.82,
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7px" }}>
        <span style={{ fontSize: "9.5px", fontWeight: 700, color: TEXT3, letterSpacing: "0.06em", fontFamily: FONT }}>{bars[0].label}</span>
        <span style={{ fontSize: "9.5px", fontWeight: 700, color: TEXT3, letterSpacing: "0.06em", fontFamily: FONT }}>{bars[bars.length - 1].label}</span>
      </div>
    </div>
  );
}

/* ── "7-day build" result receipt — the hero's centerpiece. Renders the
   real daily breakdown (never fabricated) as a numbered, timeline-linked
   ledger with a running cumulative total, closing on the same net result
   shown above it. The header is plain text, with no brand mark — per the
   site owner's instruction not to show that graphic here. ── */
function ResultReceipt({ stats }: { stats: WindowStats }) {
  const rows = stats.dailyBreakdown;
  if (!rows.length) return null;
  const lineColor = "rgba(14,23,38,0.14)";

  return (
    <div
      data-testid="block-result-receipt"
      style={{
        background: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: "12px",
        boxShadow: "0 10px 22px -16px rgba(14,23,38,0.28)",
        padding: "11px 14px 7px",
        margin: "10px 0 6px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <span style={{ fontSize: "9.5px", fontWeight: 800, color: TEXT2, letterSpacing: "0.09em", fontFamily: FONT }}>
          7-DAY BUILD
        </span>
        <span style={{ fontSize: "9.5px", fontWeight: 800, color: TEXT2, letterSpacing: "0.09em", fontFamily: FONT }}>
          RESULT RECEIPT
        </span>
      </div>

      <Rule margin="9px 0 2px" />

      <div>
        {rows.map((row, i) => {
          const isLast = i === rows.length - 1;
          const positive = row.value >= 0;
          return (
            <div key={row.date} style={{ position: "relative", display: "flex", alignItems: "center", gap: "8px", padding: "5.5px 0" }}>
              {i > 0 && (
                <div aria-hidden="true" style={{ position: "absolute", left: "10px", top: 0, height: "50%", width: "2px", background: lineColor }} />
              )}
              {!isLast && (
                <div aria-hidden="true" style={{ position: "absolute", left: "10px", top: "50%", height: "50%", width: "2px", background: lineColor }} />
              )}
              <div
                style={{
                  width: "21px", height: "21px", borderRadius: "50%", flexShrink: 0, zIndex: 1,
                  background: NAVY, color: "#FFFFFF", fontSize: "8.5px", fontWeight: 800, fontFamily: FONT,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ width: "50px", flexShrink: 0, zIndex: 1, lineHeight: 1.15 }}>
                <div style={{ fontSize: "10.5px", fontWeight: 800, color: TEXT, fontFamily: FONT }}>{row.dateLabel}</div>
                <div style={{ fontSize: "8px", fontWeight: 700, color: TEXT3, letterSpacing: "0.04em", fontFamily: FONT }}>{row.weekday}</div>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ fontSize: "11.5px", fontWeight: 800, color: positive ? SUCCESS : DANGER, fontFamily: FONT, fontVariantNumeric: "tabular-nums", zIndex: 1 }}>
                {fmtBigEuro(row.value)}
              </div>
              <div
                style={{
                  width: "68px", textAlign: "right", fontFamily: FONT, fontVariantNumeric: "tabular-nums", zIndex: 1,
                  fontSize: isLast ? "12px" : "11px", fontWeight: isLast ? 800 : 600, color: isLast ? TEXT : TEXT2,
                }}
              >
                {fmtBigEuro(row.cumulative)}
              </div>
            </div>
          );
        })}
      </div>

      <Rule margin="2px 0 7px" />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "8.5px", fontWeight: 700, color: TEXT3, letterSpacing: "0.06em", fontFamily: FONT }}>
          START: {rows[0].dateLabel}
        </span>
        <span style={{ fontSize: "8.5px", fontWeight: 700, color: TEXT3, letterSpacing: "0.06em", fontFamily: FONT }}>
          END: {rows[rows.length - 1].dateLabel}
        </span>
      </div>
    </div>
  );
}

/** Small inline check mark used only for the "published before kickoff"
 * credibility line — a plain stroke icon, not a decorative badge. */
function CheckMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke={SUCCESS} strokeWidth="2" />
      <path d="M7.5 12.5L10.5 15.5L16.5 9" stroke={SUCCESS} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── 01 Hero — the result, and the curiosity hook into the proof ─── */
function Hero({ stats7, loading }: { stats7: WindowStats | null; loading: boolean }) {
  const target = stats7?.netResult ?? 0;
  const ready = !loading && !!stats7;
  const animated = useCountUp(target, ready);

  return (
    <Section id="hero" style={{ paddingTop: "14px", paddingBottom: "14px" }}>
      <div style={{ textAlign: "center", marginBottom: "11px" }}>
        <Label>
          <span style={{ display: "block", textAlign: "center" }}>Bet Capitale / Result</span>
        </Label>
        <p style={{ fontSize: "11.5px", fontWeight: 700, color: TEXT2, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0, fontFamily: FONT }}>
          Last 7 Days
        </p>
      </div>

      {loading ? (
        <div style={{ height: "66px", width: "76%", margin: "0 auto", background: "rgba(14,23,38,0.06)", borderRadius: "10px" }} />
      ) : (
        <h1
          data-testid="text-hero-net-result"
          style={{
            fontFamily: SERIF_HERO_NUMBER, fontWeight: 700, fontStyle: "normal",
            fontSize: "clamp(50px, 16vw, 82px)", lineHeight: 0.88,
            letterSpacing: "-0.015em", margin: 0, textAlign: "center",
            color: BLACK,
            fontVariantNumeric: "tabular-nums lining-nums",
          }}
        >
          {fmtBigEuro(animated)}
        </h1>
      )}
      <p style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, letterSpacing: "0.14em", textTransform: "uppercase", margin: "7px 0 8px", textAlign: "center", fontFamily: FONT }}>
        Recorded Net Result
      </p>

      {!loading && stats7 && (
        <div style={{ textAlign: "center" }}>
          <div
            data-testid="text-hero-supporting"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "linear-gradient(135deg, rgba(18,154,99,0.09), rgba(18,154,99,0.02))",
              border: "1px solid rgba(18,154,99,0.28)",
              padding: "5px 12px 5px 6px", borderRadius: "9px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                background: "#FFFFFF", border: `1.5px solid ${SUCCESS}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <CheckMark />
            </div>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: "15px", color: SUCCESS, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
              {stats7.profitableDays}/{stats7.recordedDays}
            </span>
            <span style={{ fontSize: "9.5px", fontWeight: 800, color: TEXT2, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FONT }}>
              Profitable Days
            </span>
          </div>
        </div>
      )}

      {!loading && stats7 && stats7.totalMatches > 0 && (
        <p style={{ fontSize: "11px", color: TEXT3, margin: "5px 0 0", textAlign: "center", fontFamily: FONT }}>
          {stats7.totalMatches} selections · {stats7.wonMatches} won · {stats7.lostMatches} lost
        </p>
      )}

      {!loading && stats7 && <ResultReceipt stats={stats7} />}

      <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 10px" }}>
        <CheckMark />
        <span style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, fontFamily: FONT }}>
          Published before kickoff <span style={{ color: TEXT3 }}>•</span> Settled after the match
        </span>
      </div>

      <motion.a
        data-testid="button-how-did-we-do-it"
        href={PROMOTION_TELEGRAM_URLS.meta}
        target="_blank"
        rel="noopener noreferrer"
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          fontSize: "14px", fontWeight: 800, color: "#FFFFFF", fontFamily: FONT,
          background: ORANGE, border: "none", borderRadius: "11px", cursor: "pointer",
          textDecoration: "none",
          padding: "11px 20px", boxShadow: "0 10px 24px -8px rgba(232,119,31,0.45)",
        }}
      >
        Discover now on Telegram <span aria-hidden="true">→</span>
      </motion.a>

      <div style={{ textAlign: "center", margin: "6px 0 6px" }}>
        <span style={{ opacity: 0.75 }}>
          <TextAction testId="button-view-record" onClick={() => smoothScrollTo("proof")}>
            View the record <span aria-hidden="true">→</span>
          </TextAction>
        </span>
      </div>

      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "10.5px", fontWeight: 700, color: TEXT3, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FONT }}>
          Proof <span aria-hidden="true">↓</span>
        </span>
      </div>
    </Section>
  );
}

/* ── Shared proof-data hook ────────────────────────────────────────
   Powers both "How Did We Do It" and "Proof": real settled coupons for
   the record list, and a genuine day-level "published before kickoff"
   example computed from today_published (the real per-day publish
   moment) vs. the earliest real fixture kickoff among that day's
   settled matches.

   IMPORTANT data-model caveat (see .agents/memory/history-coupon-data-model.md):
   /api/today/push-to-history attaches EVERY settled match of a date as a
   leg of EVERY coupon settled that same date — legs are NOT a record of
   that specific coupon's own selections. So a coupon's matchNames/kickoff
   can never be honestly attributed to that individual coupon. We
   therefore never show a per-coupon match name or per-coupon "before
   kickoff" duration (proof rows use only the coupon's own real fields:
   label, stake, odds, result, settledAt). The one "before kickoff"
   example lives in "How Did We Do It" and is deliberately framed at the
   DAY level ("the day's first kickoff"), which the fixture data can
   support honestly regardless of the per-coupon leg bug. history_coupons'
   own publishedAt/firstKickoffAt fields are NOT used at all: they are
   populated at "push to history" time (after settlement), not at the
   real pre-kickoff publish moment, so using them would fabricate the
   claim. Any item lacking real, positive data for a given detail simply
   omits that detail — never invents it. React Query dedupes identical
   queries, so calling this hook from two sections costs no extra
   network requests. ── */
interface ProofCoupon {
  id: number;
  couponDate: string;
  label: string;
  stake: number;
  totalOdds: number;
  result: string | null;
  status: string;
  settledAt: string | null;
}

interface DayExample {
  date: string;
  publishedHHMM: string;
  firstKickoffHHMM: string;
  beforeKickoffMinutes: number;
  settledAt: string | null;
}

function useProofData(): { loading: boolean; candidates: ProofCoupon[]; dayExample: DayExample | null } {
  const end = todayISODate();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 60);
  const start = startDate.toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });

  const { data: coupons = [], isLoading: couponsLoading } = useQuery<ProofCoupon[]>({
    queryKey: ["/api/history/coupons", start, end],
    queryFn: () => fetch(`/api/history/coupons?start=${start}&end=${end}`).then((r) => r.json()),
  });
  const { data: legs = [], isLoading: legsLoading } = useQuery<HistoryCouponLeg[]>({
    queryKey: ["/api/history/legs"],
    queryFn: () => fetch("/api/history/legs").then((r) => r.json()),
  });
  const { data: fixtures = [], isLoading: fixturesLoading } = useQuery<Fixture[]>({
    queryKey: ["/api/history/fixtures"],
    queryFn: () => fetch("/api/history/fixtures").then((r) => r.json()),
  });

  // Most recent settled coupons — a small candidate pool is enough to find
  // 3 proof rows and 1 "how did we do it" example without fetching publish
  // times for the entire 60-day window.
  const settled = useMemo(() => {
    return coupons
      .filter((c) => c.result === "won" || c.result === "lost" || c.result === "void")
      .sort((a, b) => (b.settledAt ?? b.couponDate).localeCompare(a.settledAt ?? a.couponDate))
      .slice(0, 10);
  }, [coupons]);

  const uniqueDates = useMemo(() => Array.from(new Set(settled.map((c) => c.couponDate))), [settled]);

  const publishedQueries = useQueries({
    queries: uniqueDates.map((d) => ({
      queryKey: ["/api/today/published", d],
      queryFn: () =>
        fetch(`/api/today/published?date=${d}`).then((r) => r.json()) as Promise<{ date: string; published: boolean; publishedAt: string | null }>,
    })),
  });
  const publishedLoading = publishedQueries.some((q) => q.isLoading);
  const publishedByDate = useMemo(() => {
    const map = new Map<string, string | null>();
    publishedQueries.forEach((q, i) => {
      const d = uniqueDates[i];
      if (d) map.set(d, q.data?.publishedAt ?? null);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueDates, publishedQueries.map((q) => q.data?.publishedAt).join(",")]);

  const fixtureById = useMemo(() => new Map(fixtures.map((f) => [f.id, f])), [fixtures]);
  const legsByCoupon = useMemo(() => {
    const map = new Map<number, HistoryCouponLeg[]>();
    for (const l of legs) {
      if (!map.has(l.couponId)) map.set(l.couponId, []);
      map.get(l.couponId)!.push(l);
    }
    return map;
  }, [legs]);

  // Day-level fixture set: since every coupon settled on a date shares the
  // same legs (the data-model caveat above), we union fixtureIds by date
  // rather than trust any single coupon's legs as "its own" matches — this
  // gives an honest "that day's settled matches" set, not a per-coupon one.
  const fixtureIdsByDate = useMemo(() => {
    const map = new Map<string, Set<number>>();
    for (const c of settled) {
      const couponLegs = legsByCoupon.get(c.id) ?? [];
      if (!map.has(c.couponDate)) map.set(c.couponDate, new Set());
      const set = map.get(c.couponDate)!;
      for (const l of couponLegs) set.add(l.fixtureId);
    }
    return map;
  }, [settled, legsByCoupon]);

  const dayInfoByDate = useMemo(() => {
    const map = new Map<string, { firstKickoffHHMM: string | null; publishedHHMM: string | null; beforeKickoffMinutes: number | null }>();
    for (const [date, fixtureIds] of Array.from(fixtureIdsByDate.entries())) {
      const kickoffs = Array.from(fixtureIds)
        .map((id) => fixtureById.get(id)?.kickoffAt)
        .filter((k): k is string => !!k);
      const firstKickoffHHMM = kickoffs.length ? kickoffs.sort()[0] : null;
      const publishedHHMM = publishedByDate.get(date) ?? null;
      let beforeKickoffMinutes: number | null = null;
      if (firstKickoffHHMM && publishedHHMM) {
        const diff = diffMinutesHHMM(publishedHHMM, firstKickoffHHMM);
        if (diff > 0) beforeKickoffMinutes = diff;
      }
      map.set(date, { firstKickoffHHMM, publishedHHMM, beforeKickoffMinutes });
    }
    return map;
  }, [fixtureIdsByDate, fixtureById, publishedByDate]);

  // Pick the most recent date with a fully valid, positive day-level
  // example to power "How Did We Do It" — never a specific coupon's match.
  const dayExample = useMemo<DayExample | null>(() => {
    const sortedDates = Array.from(dayInfoByDate.keys()).sort((a, b) => b.localeCompare(a));
    for (const date of sortedDates) {
      const info = dayInfoByDate.get(date)!;
      if (info.beforeKickoffMinutes != null && info.publishedHHMM && info.firstKickoffHHMM) {
        const settledAt = settled.find((c) => c.couponDate === date)?.settledAt ?? null;
        return { date, publishedHHMM: info.publishedHHMM, firstKickoffHHMM: info.firstKickoffHHMM, beforeKickoffMinutes: info.beforeKickoffMinutes, settledAt };
      }
    }
    return null;
  }, [dayInfoByDate, settled]);

  return { loading: couponsLoading || legsLoading || fixturesLoading || publishedLoading, candidates: settled, dayExample };
}

/* ── 02 How Did We Do It — a real, verifiable process timeline ─────── */
interface TimelineStep { title: string; text: string; }

const GENERIC_STEPS: TimelineStep[] = [
  { title: "Select",  text: "Matches meeting the strategy criteria." },
  { title: "Publish", text: "Before kickoff, for members." },
  { title: "Record",  text: "Every settled result — win or lose — stays visible." },
];

function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "18px 1fr", columnGap: "18px" }}>
      {steps.map((s, i) => (
        <div key={s.title} style={{ display: "contents" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: ORANGE, flexShrink: 0, marginTop: "6px" }} />
            {i < steps.length - 1 && <div style={{ width: "1px", flex: 1, background: BORDER, marginTop: "4px" }} />}
          </div>
          <div style={{ paddingBottom: i < steps.length - 1 ? "26px" : "0" }}>
            <p style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "20px", color: TEXT, margin: "0 0 4px", letterSpacing: "-0.01em" }}>{s.title}</p>
            <p style={{ fontSize: "13px", color: TEXT2, margin: 0, fontFamily: FONT }}>{s.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function HowDidWeDoIt() {
  const { loading, dayExample } = useProofData();

  const steps: TimelineStep[] = dayExample
    ? [
        { title: "Published", text: `${formatShortDate(dayExample.date)}, ${dayExample.publishedHHMM} — before kickoff` },
        { title: "First kickoff", text: `${dayExample.firstKickoffHHMM} that day · ${fmtDuration(dayExample.beforeKickoffMinutes)} after publishing` },
        { title: "Added to record", text: dayExample.settledAt ? fmtDateTimeIstanbul(dayExample.settledAt) : "Once results settle" },
      ]
    : GENERIC_STEPS;

  return (
    <Section id="how-it-works">
      <Index n="01">How Did We Do It</Index>
      <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "27px", color: TEXT, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
        Nothing published after the fact.
      </h2>
      <p style={{ fontSize: "12.5px", color: TEXT2, margin: "0 0 26px", lineHeight: 1.6, fontFamily: FONT, maxWidth: "420px" }}>
        {dayExample
          ? "A real day from the record below — the same publish-before-kickoff routine every day."
          : "Selections are published before kickoff, and every settled result stays in the public record."}
      </p>

      {loading ? (
        <div style={{ height: "140px", background: "rgba(14,23,38,0.04)", borderRadius: "8px" }} />
      ) : (
        <Timeline steps={steps} />
      )}

      <NextLink primaryTestId="button-see-proof" onClick={() => smoothScrollTo("proof")}>
        See the proof <span aria-hidden="true">↓</span>
      </NextLink>
    </Section>
  );
}

/* ── 03 Proof / Record — real matches, real timing, wins and losses ── */
function ProofBadge({ result }: { result: string | null }) {
  const cfg =
    result === "won"  ? { color: SUCCESS, label: "WON" } :
    result === "lost" ? { color: DANGER,  label: "LOST" } :
                         { color: TEXT2,   label: "VOID" };
  return (
    <span style={{ fontSize: "11.5px", fontWeight: 800, color: cfg.color, letterSpacing: "0.04em", flexShrink: 0, fontFamily: FONT }}>
      {cfg.label}
    </span>
  );
}

function ProofSection() {
  const [, navigate] = useLocation();
  const { loading, candidates } = useProofData();
  const settled = candidates.slice(0, 3);

  return (
    <Section id="proof" bg={SOFT}>
      <Index n="02">Proof</Index>
      <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "27px", color: TEXT, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
        A record you can verify.
      </h2>
      <p style={{ fontSize: "12.5px", color: TEXT2, margin: "0 0 26px", lineHeight: 1.6, fontFamily: FONT, maxWidth: "420px" }}>
        Real matches, real timing. Winning and losing results remain visible in the same history.
      </p>

      {loading ? (
        <div style={{ height: "140px", background: "rgba(14,23,38,0.04)", borderRadius: "8px" }} />
      ) : settled.length === 0 ? (
        <p style={{ fontSize: "13px", color: TEXT2, fontFamily: FONT, marginBottom: "22px" }}>
          No settled results recorded yet for this period.
        </p>
      ) : (
        <div style={{ marginBottom: "6px" }}>
          {settled.map((c, i) => (
            <div
              key={c.id}
              data-testid={`proof-row-${c.id}`}
              style={{
                display: "flex", gap: "14px",
                paddingTop: i > 0 ? "18px" : 0, paddingBottom: "18px",
                borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
              }}
            >
              <div style={{
                flexShrink: 0, width: "3px", borderRadius: "2px",
                background: c.result === "won" ? SUCCESS : c.result === "lost" ? DANGER : BORDER_STRONG,
              }} />
              <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "10.5px", fontWeight: 700, color: TEXT3, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 5px", fontFamily: FONT }}>
                    {formatShortDate(c.couponDate)} · {c.settledAt ? "Settled" : "Prematch"}
                  </p>
                  <p style={{ fontSize: "14.5px", fontWeight: 700, color: TEXT, margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT }}>
                    {c.label}
                  </p>
                  <p style={{ fontSize: "11.5px", color: TEXT2, margin: 0, fontFamily: FONT }}>
                    €{fmtEur(c.stake)} staked · @{c.totalOdds.toFixed(2)}
                  </p>
                </div>
                <ProofBadge result={c.result} />
              </div>
            </div>
          ))}
        </div>
      )}

      <NextLink
        primaryTestId="button-see-repeats"
        onClick={() => smoothScrollTo("system")}
        secondary={{ label: <>Open full history <span aria-hidden="true">→</span></>, testId: "button-check-full-history", onClick: () => navigate("/history") }}
      >
        See how this repeats every day <span aria-hidden="true">↓</span>
      </NextLink>
    </Section>
  );
}

/* ── 04 Repeated Daily / The System — a process, not a one-off ────── */
const SYSTEM_POINTS = [
  "Selections prepared and published before kickoff.",
  "Results recorded after settlement — win or lose.",
  "Public record updated continuously, never edited after the fact.",
  "Repeated every day the markets are open, not just when it works.",
];

function RepeatedSystemSection({ stats7, stats30, loading }: { stats7: WindowStats | null; stats30: WindowStats | null; loading: boolean }) {
  const [, navigate] = useLocation();
  return (
    <Section id="system">
      <Index n="03">Repeated Daily</Index>
      <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "27px", color: TEXT, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
        A daily process, not a one-off result.
      </h2>
      <p style={{ fontSize: "12.5px", color: TEXT2, margin: "0 0 22px", lineHeight: 1.6, fontFamily: FONT, maxWidth: "420px" }}>
        The record above isn't a lucky day — it's what the same routine produces every day.
      </p>

      <div style={{ marginBottom: "8px" }}>
        {SYSTEM_POINTS.map((p, i) => (
          <div key={p} style={{ display: "flex", gap: "10px", padding: "9px 0", borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: ORANGE, flexShrink: 0, marginTop: "7px" }} />
            <span style={{ fontSize: "13px", color: TEXT, fontFamily: FONT, lineHeight: 1.5 }}>{p}</span>
          </div>
        ))}
      </div>

      {loading || !stats7 ? (
        <div style={{ height: "80px", background: "rgba(14,23,38,0.04)", borderRadius: "8px", marginTop: "16px" }} />
      ) : (
        <>
          <DayRhythm bars={stats7.bars} />
          <p style={{ fontSize: "12.5px", color: TEXT2, margin: "0 0 4px", fontFamily: FONT }}>
            {stats7.profitableDays}/{stats7.recordedDays} of the last {stats7.recordedDays} recorded days profitable
          </p>
          {stats30 && (
            <p style={{ fontSize: "11.5px", color: TEXT3, margin: 0, fontFamily: FONT }}>
              Last 30 days: {fmtBigEuro(stats30.netResult)} · {stats30.profitableDays}/{stats30.recordedDays} profitable days
            </p>
          )}
        </>
      )}

      <NextLink
        primaryTestId="button-see-today-plan"
        onClick={() => smoothScrollTo("today-plan")}
        secondary={{ label: <>Full performance history <span aria-hidden="true">→</span></>, testId: "button-see-full-performance", onClick: () => navigate("/history") }}
      >
        See today's plan <span aria-hidden="true">↓</span>
      </NextLink>
    </Section>
  );
}

/* ── 05 Today's Plan — asymmetric date rail beside the content ───── */
function TodayPlan() {
  const date = useIstanbulToday();
  const { day, month } = splitDate(date);
  const { data: publishedData, isLoading: pubLoading } = useQuery<{ date: string; published: boolean }>({
    queryKey: ["/api/today/published", date],
    queryFn: () => fetch(`/api/today/published?date=${date}`).then((r) => r.json()),
  });
  const isPublished = publishedData?.published ?? false;

  const { data: matches = [], isLoading: matchesLoading } = useQuery<TodayMatch[]>({
    queryKey: ["/api/today/matches", date],
    queryFn: () => fetch(`/api/today/matches?date=${date}`).then((r) => r.json()),
    enabled: !pubLoading && isPublished,
  });
  const { data: coupons = [], isLoading: couponsLoading } = useQuery<TodayCoupon[]>({
    queryKey: ["/api/today/coupons", date],
    queryFn: () => fetch(`/api/today/coupons?date=${date}`).then((r) => r.json()),
    enabled: !pubLoading && isPublished,
  });

  const loading = pubLoading || (isPublished && (matchesLoading || couponsLoading));
  const hasContent = isPublished && (matches.length > 0 || coupons.length > 0);

  return (
    <Section id="today-plan" bg={SOFT}>
      <Index n="04">Today</Index>

      <div style={{ display: "flex", gap: "22px" }}>
        <div style={{ flexShrink: 0, width: "54px", textAlign: "center", borderRight: `1px solid ${BORDER_STRONG}`, paddingRight: "20px" }}>
          <p style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "30px", color: TEXT, margin: 0, lineHeight: 1 }}>{day}</p>
          <p style={{ fontSize: "10px", fontWeight: 800, color: TEXT2, letterSpacing: "0.1em", margin: "5px 0 0", fontFamily: FONT }}>{month}</p>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ height: "72px", background: "rgba(14,23,38,0.05)", borderRadius: "8px" }} />
          ) : hasContent ? (
            <>
              <div style={{ display: "flex", alignItems: "baseline", gap: "26px", marginBottom: "14px" }}>
                <div>
                  <p data-testid="text-today-match-count" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "38px", color: TEXT, margin: "0 0 2px", letterSpacing: "-0.01em" }}>{matches.length}</p>
                  <p style={{ fontSize: "11.5px", fontWeight: 700, color: TEXT2, letterSpacing: "0.05em", margin: 0, fontFamily: FONT }}>Matches</p>
                </div>
                <div>
                  <p data-testid="text-today-coupon-count" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "24px", color: TEXT, margin: "0 0 2px", letterSpacing: "-0.01em" }}>{coupons.length}</p>
                  <p style={{ fontSize: "11.5px", fontWeight: 700, color: TEXT2, letterSpacing: "0.05em", margin: 0, fontFamily: FONT }}>Coupons</p>
                </div>
              </div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: SUCCESS, margin: "0 0 6px", fontFamily: FONT }}>
                Prematch plan prepared
              </p>
              <p style={{ fontSize: "12.5px", color: TEXT2, margin: "0 0 20px", fontFamily: FONT }}>
                Selections available to members before kickoff.
              </p>
            </>
          ) : (
            <p data-testid="text-today-preparing" style={{ fontSize: "13px", color: TEXT2, margin: "0 0 20px", fontFamily: FONT }}>
              Today's plan is being prepared.
            </p>
          )}

          <NextLink primaryTestId="button-get-full-access" onClick={() => smoothScrollTo("membership")}>
            Get full access <span aria-hidden="true">↓</span>
          </NextLink>
        </div>
      </div>
    </Section>
  );
}

/* ── 06 Membership — typographic list, not SaaS pricing cards ────── */
type Tier = "standard" | "premium";
type Days = 7 | 30 | 90;
const TIER_LABEL: Record<Tier, string> = { standard: "Capitale Select", premium: "Capitale Unlimited" };
const DAYS_LABEL: Record<Days, string> = { 7: "7 Days", 30: "30 Days", 90: "90 Days" };
const DAYS_BADGE: Record<Days, string | null> = { 7: null, 30: "MOST POPULAR", 90: "BEST VALUE" };

interface WhopPlan { id: string; tier: "standard" | "elite"; label: string; days: number; price: number; currency: string; }

function fmtPrice(p: number) { return "€" + p.toFixed(2).replace(".", ","); }

function MembershipSection() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [tier, setTier] = useState<Tier>("standard");
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const checkoutStatus = usePostCheckoutStatus();

  const { data: plans = [] } = useQuery<WhopPlan[]>({ queryKey: ["/api/whop/plans"] });

  const checkoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      const r = await fetch("/api/whop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId, return_to: "/promotion" }),
      });
      const data = await r.json();
      if (!r.ok) {
        const error = new Error(data.error || "Payment could not be initiated.") as Error & { code?: string };
        error.code = data.code;
        throw error;
      }
      return data as { purchase_url: string };
    },
    onSuccess: (data) => {
      setLoadingPlanId(null);
      window.open(data.purchase_url, "_blank", "noopener,noreferrer");
    },
    onError: (err: Error & { code?: string }, planId) => {
      setLoadingPlanId(null);
      if (err.code === "terms_required") {
        navigate(`/terms?redirect=/promotion&plan=${encodeURIComponent(planId)}`);
        return;
      }
      setErrorMsg(err.message);
    },
  });

  function handleBuy(planId: string) {
    setErrorMsg(null);
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/terms?redirect=/promotion&plan=${planId}`)}`);
      return;
    }
    setLoadingPlanId(planId);
    checkoutMutation.mutate(planId);
  }

  const apiTier = tier === "premium" ? "elite" : "standard";
  const tierPlans = plans.filter((p) => p.tier === apiTier && [7, 30, 90].includes(p.days));
  const orderedDays: Days[] = [7, 30, 90];

  return (
    <Section id="membership">
      <Index n="05">Membership</Index>

      <div style={{ display: "flex", gap: "18px", marginBottom: "26px", borderBottom: `1px solid ${BORDER}` }}>
        {(["standard", "premium"] as Tier[]).map((t) => {
          const active = tier === t;
          return (
            <button
              key={t}
              data-testid={`button-ig-tier-${t}`}
              onClick={() => setTier(t)}
              style={{
                padding: "0 0 12px", border: "none", background: "transparent",
                fontSize: "13px", fontWeight: 800, letterSpacing: "0.02em",
                cursor: "pointer", fontFamily: FONT,
                color: active ? TEXT : TEXT2,
                borderBottom: active ? `2px solid ${ORANGE}` : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {t === "standard" ? "Select" : "Unlimited"}
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <p role="alert" style={{ fontSize: "12px", color: DANGER, marginBottom: "18px", fontFamily: FONT }}>
          {errorMsg}
        </p>
      )}

      {checkoutStatus === "checking" && (
        <p style={{ fontSize: "12.5px", color: TEXT2, margin: "0 0 18px", fontFamily: FONT }}>
          ⏳ Confirming your payment… this usually takes a few seconds.
        </p>
      )}
      {checkoutStatus === "confirmed" && (
        <p style={{ fontSize: "12.5px", color: "#129A63", fontWeight: 700, margin: "0 0 18px", fontFamily: FONT }}>
          ✅ Payment received — your membership is now active. Enjoy!
        </p>
      )}
      {checkoutStatus === "timeout" && (
        <p style={{ fontSize: "12.5px", color: ORANGE, margin: "0 0 18px", fontFamily: FONT }}>
          ⚠️ Payment received, but activation is taking longer than usual. Refresh in a minute, or reach us on{" "}
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ color: ORANGE, fontWeight: 700 }}>Telegram</a>.
        </p>
      )}

      {!user && (
        <p style={{ fontSize: "12.5px", color: TEXT2, margin: "0 0 20px", fontFamily: FONT }}>
          To purchase, <Link href="/login?redirect=/promotion" style={{ color: ORANGE, fontWeight: 700, textDecoration: "none" }}>sign in</Link> or{" "}
          <Link href="/register?redirect=/promotion" style={{ color: ORANGE, fontWeight: 700, textDecoration: "none" }}>register</Link>.
        </p>
      )}

      <div>
        {orderedDays.map((d, i) => {
          const plan = tierPlans.find((p) => p.days === d);
          if (!plan) return null;
          const featured = d === 30;
          const badge = DAYS_BADGE[d];
          return (
            <div key={d}>
              {i > 0 && <Rule margin="18px 0" />}
              <div
                data-testid={`ig-plan-card-${d}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px",
                  padding: featured ? "16px" : "4px 0",
                  background: featured ? "rgba(232,119,31,0.06)" : "transparent",
                  borderRadius: featured ? "10px" : 0,
                  borderLeft: featured ? `3px solid ${ORANGE}` : "none",
                  marginLeft: featured ? "-16px" : 0,
                  paddingLeft: featured ? "13px" : 0,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: TEXT, letterSpacing: "0.02em", fontFamily: FONT }}>
                      {DAYS_LABEL[d]}
                    </span>
                    {badge && (
                      <span style={{ fontSize: "9.5px", fontWeight: 800, color: ORANGE, letterSpacing: "0.05em", fontFamily: FONT }}>
                        {badge}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: SERIF, fontWeight: 400, fontSize: featured ? "30px" : "23px", color: TEXT, margin: 0, letterSpacing: "-0.01em" }}>
                    {fmtPrice(plan.price)}
                  </p>
                </div>
                <motion.button
                  data-testid={`ig-button-buy-${plan.id}`}
                  onClick={() => handleBuy(plan.id)}
                  disabled={loadingPlanId === plan.id && checkoutMutation.isPending}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    fontSize: "13px", fontWeight: 800, color: ORANGE,
                    background: "none", border: "none", cursor: "pointer", fontFamily: FONT,
                    flexShrink: 0, padding: "8px 0",
                    opacity: (loadingPlanId === plan.id && checkoutMutation.isPending) ? 0.6 : 1,
                  }}
                >
                  {loadingPlanId === plan.id && checkoutMutation.isPending ? "Loading…" : "Get access →"}
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: "11px", color: TEXT3, margin: "22px 0 0", fontFamily: FONT }}>
        {TIER_LABEL[tier]} · Secure checkout via Whop
      </p>

      <div style={{ marginTop: "20px" }}>
        <TextAction testId="button-not-ready-follow-first" onClick={() => smoothScrollTo("non-buyer-exit")}>
          Not ready? Follow first <span aria-hidden="true">↓</span>
        </TextAction>
      </div>
    </Section>
  );
}

/* ── 07 Final choice — one closing composition, not a CTA block ──── */
function NonBuyerExit() {
  return (
    <Section id="non-buyer-exit" bg={BLACK} style={{ paddingBottom: "60px" }}>
      <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "29px", color: "#FFFFFF", margin: "0 0 10px", letterSpacing: "-0.01em" }}>
        Want to watch first?
      </h2>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.58)", margin: "0 0 28px", lineHeight: 1.6, fontFamily: FONT, maxWidth: "380px" }}>
        Follow today's Free Bet and daily updates before deciding.
      </p>
      <Rule margin="0 0 20px" dark />
      <a href="/" data-testid="link-explore-website-bottom" style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.42)", textDecoration: "none", fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: "3px" }}>
        Explore BetCapitale.com <span aria-hidden="true">↗</span>
      </a>
    </Section>
  );
}

/* Bet Capitale symbol — real brand asset, transparent PNG on white panel */
function BrandMark() {
  return (
    <img
      src={brandSymbolImg}
      width={45}
      height={45}
      alt=""
      aria-hidden="true"
      style={{
        display: "block",
        objectFit: "contain",
        filter: "brightness(0) saturate(100%) invert(53%) sepia(57%) saturate(669%) hue-rotate(356deg) brightness(102%)",
      }}
    />
  );
}

/* Telegram send-arrow mark — stroke-based, same visual weight */
function TelegramMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" stroke="#229ED9" strokeWidth="1.5" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#229ED9" strokeWidth="1.5" />
    </svg>
  );
}

type MetaPixelWindow = Window & {
  fbq?: (...args: unknown[]) => void;
};

type RedditPixelWindow = Window & {
  rdt?: (...args: unknown[]) => void;
};

function trackMetaPixel(eventName: "QualifiedVisit" | "Contact") {
  const pixelWindow = window as MetaPixelWindow;
  if (eventName === "QualifiedVisit") {
    pixelWindow.fbq?.("trackCustom", eventName);
  } else {
    pixelWindow.fbq?.("track", eventName);
  }
}

function trackRedditLead() {
  const pixelWindow = window as RedditPixelWindow;
  pixelWindow.rdt?.("track", "Lead");
}

function PromotionActionPanel() {
  const cellClass = "promotion-action-cell";
  const trackCta = (cta: "home" | "telegram" | "register", event?: React.MouseEvent<HTMLAnchorElement>) => {
    trackPromotion("cta", { cta });
    if (cta === "telegram" && promotionSource() === "meta" && event?.isTrusted) {
      trackMetaPixel("Contact");
    }
    if (cta === "telegram" && promotionSource() === "ads" && event?.isTrusted) {
      trackRedditLead();
    }
  };
  return (
    <nav className="promotion-action-panel" aria-label="Promotion navigation">
      <a href="/" onClick={(event) => trackCta("home", event)} className={cellClass} data-testid="button-promotion-home">
        <div className="promotion-action-icon"><BrandMark /></div>
        <span className="promotion-action-label">Go<br />Home</span>
        <i aria-hidden="true" />
      </a>
      <a href={PROMOTION_TELEGRAM_URLS[promotionSource()]} onClick={(event) => trackCta("telegram", event)} target="_blank" rel="noopener noreferrer" className={cellClass} data-testid="button-promotion-telegram">
        <div className="promotion-action-icon"><TelegramMark /></div>
        <span className="promotion-action-label">Join Telegram<br />Free</span>
        <i aria-hidden="true" />
      </a>
      <a href="/register?redirect=/promotion" onClick={(event) => trackCta("register", event)} className={cellClass} data-testid="button-promotion-register">
        <div className="promotion-action-icon"><BrandMark /></div>
        <span className="promotion-action-label">Register<br />Free</span>
      </a>
    </nav>
  );
}

const promotionSessionId = `promotion-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
function promotionSource(): "x" | "meta" | "insta" | "ads" | "direct" {
  const path = window.location.pathname;
  if (path === "/promotion/x") return "x";
  if (path === "/promotion/meta") return "meta";
  if (path === "/promotion/insta") return "insta";
  if (path === "/promotion/ads") return "ads";
  return "direct";
}

const META_QUALIFIED_VISIT_SESSION_KEY = "bet-capitale:meta-qualified-visit";

function wasMetaQualifiedVisitSent() {
  try {
    return window.sessionStorage.getItem(META_QUALIFIED_VISIT_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberMetaQualifiedVisit() {
  try {
    window.sessionStorage.setItem(META_QUALIFIED_VISIT_SESSION_KEY, "1");
  } catch {
    // Pixel tracking must not interrupt the promotion page.
  }
}

function useMetaPixelPromotionEvents() {
  const [location] = useLocation();
  const path = location.split(/[?#]/, 1)[0];

  useEffect(() => {
    if (path !== "/promotion/meta") return;

    let visibleMilliseconds = 0;
    let visibleStartedAt = document.visibilityState === "visible" ? performance.now() : null;
    let hasTrustedInteraction = false;
    let qualifiedVisitSent = wasMetaQualifiedVisitSent();

    const maybeSendQualifiedVisit = () => {
      if (qualifiedVisitSent || !hasTrustedInteraction) return;

      const now = performance.now();
      const currentVisibleMilliseconds = visibleStartedAt === null
        ? 0
        : Math.max(0, now - visibleStartedAt);
      if (visibleMilliseconds + currentVisibleMilliseconds < 15_000) return;

      qualifiedVisitSent = true;
      rememberMetaQualifiedVisit();
      trackMetaPixel("QualifiedVisit");
    };

    const onTrustedInteraction = (event: Event) => {
      if (!event.isTrusted) return;
      hasTrustedInteraction = true;
      maybeSendQualifiedVisit();
    };

    const onVisibilityChange = () => {
      const now = performance.now();
      if (document.visibilityState === "hidden") {
        if (visibleStartedAt !== null) {
          visibleMilliseconds += Math.max(0, now - visibleStartedAt);
          visibleStartedAt = null;
        }
      } else {
        visibleStartedAt = now;
      }
      maybeSendQualifiedVisit();
    };

    const timer = window.setInterval(maybeSendQualifiedVisit, 250);
    window.addEventListener("pointerdown", onTrustedInteraction, { passive: true });
    window.addEventListener("touchstart", onTrustedInteraction, { passive: true });
    window.addEventListener("mousedown", onTrustedInteraction, { passive: true });
    window.addEventListener("mousemove", onTrustedInteraction, { passive: true });
    window.addEventListener("keydown", onTrustedInteraction, { passive: true });
    window.addEventListener("wheel", onTrustedInteraction, { passive: true });
    window.addEventListener("scroll", onTrustedInteraction, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    maybeSendQualifiedVisit();

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pointerdown", onTrustedInteraction);
      window.removeEventListener("touchstart", onTrustedInteraction);
      window.removeEventListener("mousedown", onTrustedInteraction);
      window.removeEventListener("mousemove", onTrustedInteraction);
      window.removeEventListener("keydown", onTrustedInteraction);
      window.removeEventListener("wheel", onTrustedInteraction);
    window.removeEventListener("scroll", onTrustedInteraction);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [path]);
}

let promotionTrackerState: {
  startedAt: number;
  maxScrollPercent: number;
  visibleSeconds: number;
  visibleStartedAt: number | null;
  trustedInteractionCount: number;
  trustedScroll: boolean;
  lastScrollSentAt: number;
} | null = null;

function promotionDeviceCategory() {
  const width = window.innerWidth;
  return width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";
}

function promotionVisibleSeconds() {
  if (!promotionTrackerState) return 0;
  const activeNow = promotionTrackerState.visibleStartedAt === null
    ? 0
    : performance.now() - promotionTrackerState.visibleStartedAt;
  return Math.min(3600, Math.round((promotionTrackerState.visibleSeconds * 1000 + activeNow) / 1000));
}

function trackPromotion(event: "pageview" | "heartbeat" | "scroll" | "cta" | "end" | "browser_confirmed" | "signal", extra: Record<string, unknown> = {}) {
  if (!promotionTrackerState) {
    const now = performance.now();
    promotionTrackerState = {
      startedAt: now,
      maxScrollPercent: 0,
      visibleSeconds: 0,
      visibleStartedAt: document.visibilityState === "visible" ? now : null,
      trustedInteractionCount: 0,
      trustedScroll: false,
      lastScrollSentAt: 0,
    };
  }
  const durationSeconds = Math.min(3600, Math.round((performance.now() - promotionTrackerState.startedAt) / 1000));
  const payload = JSON.stringify({
    sessionId: promotionSessionId,
    event,
    durationSeconds,
    maxScrollPercent: promotionTrackerState.maxScrollPercent,
    deviceCategory: promotionDeviceCategory(),
    qa: new URLSearchParams(window.location.search).get("qa") === "1",
    visibleSeconds: promotionVisibleSeconds(),
    trustedInteraction: promotionTrackerState.trustedInteractionCount > 0,
    trustedInteractionCount: promotionTrackerState.trustedInteractionCount,
    trustedScroll: promotionTrackerState.trustedScroll,
    ...extra,
    source: promotionSource(),
  });
  try {
    if (event === "end" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/promotion/track", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/promotion/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: event === "end" || event === "cta",
      });
    }
  } catch {
    // Analytics must never interrupt the Promotion page or its navigation.
  }
}

function usePromotionTracking() {
  useEffect(() => {
    const now = performance.now();
    promotionTrackerState = {
      startedAt: now,
      maxScrollPercent: 0,
      visibleSeconds: 0,
      visibleStartedAt: document.visibilityState === "visible" ? now : null,
      trustedInteractionCount: 0,
      trustedScroll: false,
      lastScrollSentAt: 0,
    };
    trackPromotion("pageview");
    const onTrustedInteraction = (event: Event) => {
      if (!event.isTrusted || !promotionTrackerState) return;
      promotionTrackerState.trustedInteractionCount = Math.min(1000, promotionTrackerState.trustedInteractionCount + 1);
      trackPromotion("signal");
    };
    const onNativeScroll = (event: Event) => {
      if (!promotionTrackerState) return;
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      promotionTrackerState.maxScrollPercent = max > 0
        ? Math.min(100, Math.round((window.scrollY / max) * 100))
        : 100;
      if (event.isTrusted) promotionTrackerState.trustedScroll = true;
      const current = performance.now();
      if (current - promotionTrackerState.lastScrollSentAt >= 750 || promotionTrackerState.maxScrollPercent >= 100) {
        promotionTrackerState.lastScrollSentAt = current;
        trackPromotion("scroll");
      }
    };
    const onVisibility = () => {
      if (!promotionTrackerState) return;
      const current = performance.now();
      if (document.visibilityState === "hidden") {
        if (promotionTrackerState.visibleStartedAt !== null) {
          promotionTrackerState.visibleSeconds += Math.max(0, (current - promotionTrackerState.visibleStartedAt) / 1000);
          promotionTrackerState.visibleStartedAt = null;
        }
        trackPromotion("signal");
      } else {
        promotionTrackerState.visibleStartedAt = current;
        trackPromotion("signal");
      }
    };
    const heartbeat = window.setInterval(() => trackPromotion("heartbeat"), 15000);
    const browserConfirmation = window.requestAnimationFrame(() => trackPromotion("browser_confirmed", { browserConfirmed: true }));
    window.addEventListener("pointerdown", onTrustedInteraction, { passive: true });
    window.addEventListener("touchstart", onTrustedInteraction, { passive: true });
    window.addEventListener("mousedown", onTrustedInteraction, { passive: true });
    window.addEventListener("keydown", onTrustedInteraction, { passive: true });
    const onWheel = (event: Event) => {
      if (event.isTrusted && promotionTrackerState) promotionTrackerState.trustedScroll = true;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(heartbeat);
      window.cancelAnimationFrame(browserConfirmation);
      window.removeEventListener("pointerdown", onTrustedInteraction);
      window.removeEventListener("touchstart", onTrustedInteraction);
      window.removeEventListener("mousedown", onTrustedInteraction);
      window.removeEventListener("keydown", onTrustedInteraction);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onNativeScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      const state = promotionTrackerState;
      if (state?.visibleStartedAt !== null && state?.visibleStartedAt !== undefined) {
        state.visibleSeconds += Math.max(0, (performance.now() - state.visibleStartedAt) / 1000);
        state.visibleStartedAt = null;
      }
      trackPromotion("end");
      promotionTrackerState = null;
    };
  }, []);
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function Promotion() {
  usePromotionTracking();
  useMetaPixelPromotionEvents();
  const { data: entries = [], isLoading: entriesLoading } = useQuery<RealEntry[]>({ queryKey: ["/api/entries"] });
  const { data: matches = [], isLoading: matchesLoading } = useQuery<RealMatch[]>({ queryKey: ["/api/matches"] });
  const loading = entriesLoading || matchesLoading;

  const stats7 = useMemo(() => (loading ? null : computeWindowStats(entries, matches, 7)), [entries, matches, loading]);
  const stats30 = useMemo(() => (loading ? null : computeWindowStats(entries, matches, 30)), [entries, matches, loading]);

  return (
    <div style={{ minHeight: "100vh", background: BG, paddingBottom: "80px" }}>
      <TopBar />
      <Hero stats7={stats7} loading={loading} />
      <HowDidWeDoIt />
      <ProofSection />
      <RepeatedSystemSection stats7={stats7} stats30={stats30} loading={loading} />
      <TodayPlan />
      <MembershipSection />
      <NonBuyerExit />
      <PromotionActionPanel />
    </div>
  );
}
