import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, ReferenceLine,
} from "recharts";
import SiteHeader from "@/components/SiteHeader";
import { CouponImageDialog } from "@/components/CouponImageDialog";
import {
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Calendar, Search, X, ArrowLeft,
} from "lucide-react";

function truncOdds(n: number): string {
  return (Math.floor(n * 100) / 100).toFixed(2);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

/* ── Design tokens ──────────────────────────────────────────────────────── */
const BG      = "#FCFCFB";
const SOFT    = "#F4F7F8";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const BORDER  = "#E4EAEE";
const CYAN    = "#E8771F";
const SUCCESS = "#129A63";
const DANGER  = "#D95A68";

/* ── Types ──────────────────────────────────────────────────────────────── */
type View   = "daily" | "weekly" | "monthly";
type Filter = "all" | "won" | "lost" | "void";
type Tab    = "coupons" | "matches";

interface RealMatch {
  id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  result: string;
}

interface RealEntry {
  id: number;
  date: string;
  value: number;
}

interface AvailablePeriod {
  date: string;   // daily: YYYY-MM-DD; weekly/monthly: windowIndex as string ("0","1",...)
  label: string;
  netResult: number;
  count: number;
}

interface DateWindow {
  startDate: string;     // first recorded date in window
  endDate: string;       // last recorded date in window
  recordedDays: string[]; // sorted asc
  windowIndex: number;   // 0 = latest
}

/* ── Date helpers ───────────────────────────────────────────────────────── */
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getMonday(d: Date): Date {
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return mon;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function formatTR(d: Date, opts: Intl.DateTimeFormatOptions): string {
  return d.toLocaleDateString("tr-TR", { ...opts, timeZone: "Europe/Istanbul" });
}

function shortDate(dateStr: string): string {
  return formatTR(parseDate(dateStr), { day: "numeric", month: "short" });
}

function shortDateYear(dateStr: string): string {
  return formatTR(parseDate(dateStr), { day: "numeric", month: "short", year: "numeric" });
}

/* ── Window builder ─────────────────────────────────────────────────────── */
/**
 * Splits sortedDates (asc) into non-overlapping windows of `size` recorded dates.
 * Returns newest-first (index 0 = latest window).
 */
function makeWindows(sortedDates: string[], size: number): DateWindow[] {
  if (sortedDates.length === 0) return [];
  const windows: DateWindow[] = [];
  // Work from the end (newest) backwards
  const reversed = [...sortedDates].reverse();
  for (let i = 0; i < reversed.length; i += size) {
    const chunk = reversed.slice(i, i + size).reverse(); // restore asc order
    windows.push({
      startDate: chunk[0],
      endDate: chunk[chunk.length - 1],
      recordedDays: chunk,
      windowIndex: windows.length,
    });
  }
  return windows;
}

/* ── Period serialization ───────────────────────────────────────────────── */
/**
 * Internal key → URL period string.
 * daily: YYYY-MM-DD unchanged.
 * weekly/monthly: window index integer string (e.g. "0", "1").
 */
function toPeriodStr(_view: View, key: string): string {
  return key;
}

/** URL period string → internal key */
function fromPeriodStr(view: View, period: string): string {
  if (view === "daily") {
    return /^\d{4}-\d{2}-\d{2}$/.test(period) ? period : toDateStr(new Date());
  }
  // weekly/monthly: just an integer string
  const n = parseInt(period);
  return isNaN(n) ? "0" : String(Math.max(0, n));
}

/* ── Period label ───────────────────────────────────────────────────────── */
/** Returns { line1, line2 } for the period header. */
function buildPeriodLabel(view: View, key: string, win: DateWindow | null): { line1: string; line2?: string } {
  if (view === "daily") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return { line1: "Geçersiz tarih" };
    return { line1: formatTR(parseDate(key), { day: "numeric", month: "long", year: "numeric", weekday: "long" }) };
  }
  if (!win) return { line1: "Veri yok" };
  const line1 = `${shortDate(win.startDate)} – ${shortDateYear(win.endDate)}`;
  const line2  = view === "weekly" ? "Son 7 kayıt günü" : "Son 30 kayıt günü";
  return { line1, line2 };
}

/* ── URL state ──────────────────────────────────────────────────────────── */
function useQueryState() {
  const [, navigate] = useLocation();
  const today = toDateStr(new Date());

  /* hasExplicitPeriod: true when the URL already carries a period/window key */
  const hasExplicitPeriodRef = useRef(
    typeof window !== "undefined" && (() => {
      const p = new URLSearchParams(window.location.search);
      const v = (p.get("view") as View | null) ?? "monthly";
      return v === "daily" ? p.has("period") : p.has("window");
    })()
  );
  const hasExplicitPeriod = hasExplicitPeriodRef.current;

  function readFromURL(): { view: View; date: string; filter: Filter; tab: Tab } {
    if (typeof window === "undefined") {
      return { view: "monthly", date: "0", filter: "all", tab: "coupons" };
    }
    const p    = new URLSearchParams(window.location.search);
    const view = (p.get("view") as View | null) ?? "monthly";
    let date: string;
    if (view === "daily") {
      const periodStr = p.get("period");
      date = periodStr ? fromPeriodStr(view, periodStr) : today;
    } else {
      /* weekly/monthly use ?window=N */
      const windowStr = p.get("window");
      date = windowStr ? fromPeriodStr(view, windowStr) : "0";
    }
    return {
      view,
      date,
      filter: (p.get("filter") as Filter | null) ?? "all",
      tab:    (p.get("tab")    as Tab    | null) ?? "coupons",
    };
  }

  const [state, setState] = useState(readFromURL);

  const set = useCallback((updates: Record<string, string>) => {
    setState((prev) => {
      const next = { ...prev, ...updates } as typeof prev;
      const p = new URLSearchParams();
      p.set("view", next.view);
      if (next.view === "daily") {
        p.set("period", toPeriodStr(next.view, next.date));
      } else {
        /* weekly/monthly → ?window=N */
        p.set("window", toPeriodStr(next.view, next.date));
      }
      if (next.filter !== "all")     p.set("filter", next.filter);
      if (next.tab    !== "coupons") p.set("tab",    next.tab);
      navigate(`/history?${p.toString()}`);
      return next;
    });
  }, [navigate]);

  return { ...state, set, today, hasExplicitPeriod };
}

/* ── Shared UI ──────────────────────────────────────────────────────────── */
function StatusBadge({ result }: { result: string | null }) {
  const cfg =
    result === "won"       ? { bg: "rgba(22,166,106,0.10)",  color: SUCCESS, label: "Kazandı"    } :
    result === "lost"      ? { bg: "rgba(217,74,90,0.10)",   color: DANGER,  label: "Kaybetti"   } :
    result === "postponed" ? { bg: "rgba(91,102,117,0.10)",  color: TEXT2,   label: "Ertelendi"  } :
    result === "void"      ? { bg: "rgba(91,102,117,0.10)",  color: TEXT2,   label: "İptal"      } :
                             { bg: "rgba(232,119,31,0.10)",  color: CYAN,    label: "Bekleniyor" };
  return (
    <span style={{ fontSize: "10px", fontWeight: 700, background: cfg.bg, color: cfg.color, padding: "3px 10px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ padding: "40px 24px", textAlign: "center" }}>
      <p style={{ fontSize: "14px", color: TEXT2 }}>{text}</p>
    </div>
  );
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value as number;
  return (
    <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px" }}>
      <p style={{ color: TEXT2, marginBottom: "3px" }}>{label}</p>
      <p style={{ fontWeight: 700, color: val >= 0 ? SUCCESS : DANGER }}>
        {val >= 0 ? "+" : ""}{val.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} €
      </p>
    </div>
  );
}

/* ── Stats ──────────────────────────────────────────────────────────────── */
interface RealStats {
  netResult: number;
  wonDays: number;
  lostDays: number;
  totalEntries: number;
  totalMatches: number;
  wonMatches: number;
  lostMatches: number;
  postponedMatches: number;
  matchHitRate: number;
}

function computeRealStats(matches: RealMatch[], entries: RealEntry[]): RealStats {
  const netResult   = entries.reduce((s, e) => s + e.value, 0);
  const wonDays     = entries.filter((e) => e.value > 0).length;
  const lostDays    = entries.filter((e) => e.value < 0).length;
  const wonMatches  = matches.filter((m) => m.result === "won").length;
  const lostMatches = matches.filter((m) => m.result === "lost").length;
  const postponed   = matches.filter((m) => m.result === "postponed").length;
  const denom       = wonMatches + lostMatches;
  return {
    netResult, wonDays, lostDays,
    totalEntries: entries.length,
    totalMatches: matches.length,
    wonMatches, lostMatches,
    postponedMatches: postponed,
    matchHitRate: denom > 0 ? (wonMatches / denom) * 100 : 0,
  };
}

function RealStatGrid({ stats }: { stats: RealStats }) {
  const fmt    = (n: number) => n.toLocaleString("tr-TR", { maximumFractionDigits: 1 });
  const fmtEur = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cells = [
    { label: "Net Kazanç",    value: (stats.netResult >= 0 ? "+" : "") + fmtEur(stats.netResult) + " €", color: stats.netResult >= 0 ? SUCCESS : DANGER },
    { label: "Kazançlı Gün", value: String(stats.wonDays),    color: SUCCESS },
    { label: "Kayıplı Gün",  value: String(stats.lostDays),   color: DANGER },
    { label: "Toplam Kayıt", value: String(stats.totalEntries), color: TEXT },
    { label: "Toplam Maç",   value: String(stats.totalMatches), color: TEXT },
    { label: "Kazanan Maç",  value: String(stats.wonMatches),   color: SUCCESS },
    { label: "Kaybeden Maç", value: String(stats.lostMatches),  color: DANGER },
    { label: "Ertelenen",    value: String(stats.postponedMatches), color: TEXT2 },
    { label: "Maç İsabet",  value: fmt(stats.matchHitRate) + "%",  color: CYAN },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", marginBottom: "24px" }}>
      {cells.map((c) => (
        <div key={c.label} style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px 16px", boxShadow: "0 1px 3px rgba(11,20,32,0.04)" }}>
          <p style={{ fontSize: "10px", fontWeight: 600, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "5px" }}>{c.label}</p>
          <p style={{ fontSize: "18px", fontWeight: 800, color: c.color, fontVariantNumeric: "tabular-nums" }}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Charts ─────────────────────────────────────────────────────────────── */
function ChartsSection({ entries, matches, isMobile = false }: { entries: RealEntry[]; matches: RealMatch[]; isMobile?: boolean }) {
  const byDay = new Map<string, number>();
  entries.forEach((e) => byDay.set(e.date, (byDay.get(e.date) ?? 0) + e.value));

  const netBars = Array.from(byDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({
      label: formatTR(parseDate(date), { day: "numeric", month: "short" }),
      value,
    }));

  let cum = 0;
  const cumLine = netBars.map((b) => { cum += b.value; return { label: b.label, cumulative: cum }; });

  const wonM  = matches.filter((m) => m.result === "won").length;
  const lostM = matches.filter((m) => m.result === "lost").length;
  const postM = matches.filter((m) => m.result === "postponed").length;
  const compData = [
    { label: "Kazandı",   value: wonM,  fill: SUCCESS },
    { label: "Kaybetti",  value: lostM, fill: DANGER },
    { label: "Ertelendi", value: postM, fill: TEXT2 },
  ];

  const hasE = netBars.length > 0;
  const hasM = matches.length > 0;
  if (!hasE && !hasM) return null;

  const chartH = isMobile ? 140 : 160;
  const xTick  = { fontSize: isMobile ? 8 : 9, fill: TEXT2 };
  const yTick  = { fontSize: isMobile ? 8 : 9, fill: TEXT2 };
  const xInterval: any = isMobile ? "preserveStartEnd" : undefined;

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
        {hasE && (
          <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "16px 14px 10px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Net Sonuç (€)</p>
            <div style={{ height: `${chartH}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={netBars} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} />
                  <XAxis dataKey="label" tick={xTick} tickLine={false} axisLine={false} interval={xInterval} />
                  <YAxis hide />
                  <Tooltip content={<ChartTip />} />
                  <ReferenceLine y={0} stroke={BORDER} strokeWidth={1} />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {netBars.map((b, i) => <Cell key={i} fill={b.value >= 0 ? SUCCESS : DANGER} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {hasE && (
          <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "16px 14px 10px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Kümülatif Kazanç</p>
            <div style={{ height: `${chartH}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumLine} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} />
                  <XAxis dataKey="label" tick={xTick} tickLine={false} axisLine={false} interval={xInterval} />
                  <YAxis hide />
                  <Tooltip content={<ChartTip />} formatter={(v: any) => [v, "Kümülatif"]} />
                  <ReferenceLine y={0} stroke={BORDER} strokeWidth={1} />
                  <Line type="monotone" dataKey="cumulative" stroke={CYAN} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: CYAN, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {hasM && (
          <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "16px 14px 10px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Maç Karşılaştırma</p>
            <div style={{ height: `${chartH}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={BORDER} />
                  <XAxis type="number" tick={yTick} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="label" tick={xTick} tickLine={false} axisLine={false} width={56} />
                  <Tooltip formatter={(v: any) => [v, "Maç"]} contentStyle={{ fontSize: "12px", border: `1px solid ${BORDER}`, borderRadius: "8px" }} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                    {compData.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
      <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "20px 16px 12px", boxShadow: "0 1px 4px rgba(11,20,32,0.04)" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Net Sonuç (€)</p>
        {hasE ? (
          <div style={{ height: "160px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={netBars} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={BORDER} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: TEXT2 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: TEXT2 }} tickLine={false} axisLine={false} width={44} />
                <Tooltip content={<ChartTip />} />
                <ReferenceLine y={0} stroke={BORDER} strokeWidth={1} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {netBars.map((b, i) => <Cell key={i} fill={b.value >= 0 ? SUCCESS : DANGER} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <EmptyState text="Veri yok" />}
      </div>

      <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "20px 16px 12px", boxShadow: "0 1px 4px rgba(11,20,32,0.04)" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Kümülatif Kazanç</p>
        {hasE ? (
          <div style={{ height: "160px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumLine} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={BORDER} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: TEXT2 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: TEXT2 }} tickLine={false} axisLine={false} width={44} />
                <Tooltip content={<ChartTip />} formatter={(v: any) => [v, "Kümülatif"]} />
                <ReferenceLine y={0} stroke={BORDER} strokeWidth={1} />
                <Line type="monotone" dataKey="cumulative" stroke={CYAN} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: CYAN, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <EmptyState text="Veri yok" />}
      </div>

      <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "20px 16px 12px", boxShadow: "0 1px 4px rgba(11,20,32,0.04)" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Maç Karşılaştırma</p>
        {hasM ? (
          <div style={{ height: "160px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke={BORDER} />
                <XAxis type="number" tick={{ fontSize: 9, fill: TEXT2 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 9, fill: TEXT2 }} tickLine={false} axisLine={false} width={60} />
                <Tooltip formatter={(v: any) => [v, "Maç"]} contentStyle={{ fontSize: "12px", border: `1px solid ${BORDER}`, borderRadius: "8px" }} />
                <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                  {compData.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <EmptyState text="Veri yok" />}
      </div>
    </div>
  );
}

/* ── Compact coupon row ──────────────────────────────────────────────────── */
function CouponRow({ coupon }: { coupon: any }) {
  const net = Number(coupon.netResult ?? 0);
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px", background: "#fff", borderRadius: "8px", border: `1px solid ${BORDER}` }}
      data-testid={`card-coupon-${coupon.id}`}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontWeight: 700, fontSize: "13px", color: TEXT }}>{coupon.label}</span>
        <span style={{ fontSize: "11px", color: TEXT2, marginLeft: "8px" }}>{coupon.stake}€ · @{truncOdds(Number(coupon.totalOdds))}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {coupon.netResult !== null && (
          <span style={{ fontWeight: 700, fontSize: "12px", color: net >= 0 ? SUCCESS : DANGER }}>
            {net >= 0 ? "+" : ""}{net.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </span>
        )}
        <StatusBadge result={coupon.result} />
        <CouponImageDialog couponId={coupon.id} source="history" label={coupon.label} buttonLabel="📷" />
      </div>
    </div>
  );
}

/* ── Day accordion row ──────────────────────────────────────────────────── */
function DayAccordion({ date, coupons }: { date: string; coupons: any[] }) {
  const [open, setOpen] = useState(false);
  const wonCount  = coupons.filter((c) => c.result === "won").length;
  const lostCount = coupons.filter((c) => c.result === "lost").length;
  const hasNet    = coupons.some((c) => c.netResult !== null);
  const netSum    = coupons.reduce((s, c) => s + Number(c.netResult ?? 0), 0);
  const fmt = new Date(date + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
  const isPositive = netSum >= 0;

  return (
    <div style={{ border: `1px solid ${open ? "#D0D8E0" : BORDER}`, borderRadius: "12px", overflow: "hidden", background: "#fff", transition: "border-color 0.15s" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr auto auto auto",
          alignItems: "center",
          gap: "0",
          padding: "14px 16px",
          background: open ? SOFT : "#fff",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s",
        }}
        data-testid={`button-day-accordion-${date}`}
      >
        {/* Col 1: Date */}
        <span style={{ fontWeight: 700, fontSize: "14px", color: TEXT, paddingRight: "12px" }}>{fmt}</span>

        {/* Col 2: Coupon count + win/loss badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingRight: "16px" }}>
          <span style={{ fontSize: "12px", color: TEXT2, whiteSpace: "nowrap" }}>{coupons.length} kupon</span>
          <span style={{ width: "1px", height: "12px", background: BORDER, flexShrink: 0 }} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: SUCCESS, whiteSpace: "nowrap" }}>
            ✓{wonCount}
          </span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: DANGER, whiteSpace: "nowrap" }}>
            ✗{lostCount}
          </span>
        </div>

        {/* Col 3: Net result */}
        <span style={{
          fontSize: "13px",
          fontWeight: 800,
          color: hasNet ? (isPositive ? SUCCESS : DANGER) : TEXT2,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
          paddingRight: "12px",
          minWidth: "90px",
          textAlign: "right",
        }}>
          {hasNet
            ? `${isPositive ? "+" : ""}${netSum.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
            : "—"}
        </span>

        {/* Col 4: Chevron */}
        <span style={{ flexShrink: 0, color: TEXT2, display: "flex", alignItems: "center" }}>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {open && (
        <div style={{ padding: "10px 16px 14px", borderTop: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", gap: "6px" }}>
          {coupons.map((c) => <CouponRow key={c.id} coupon={c} />)}
        </div>
      )}
    </div>
  );
}

/* ── Coupons tab ────────────────────────────────────────────────────────── */
function CouponsView({ start, end }: { start: string; end: string }) {
  const { data: coupons = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/history/coupons", start, end],
    queryFn: () =>
      fetch(`/api/history/coupons?start=${start}&end=${end}`)
        .then((r) => r.json()),
    enabled: start <= end,
  });

  if (isLoading) return <EmptyState text="Yükleniyor..." />;

  if (!coupons.length) {
    return (
      <div style={{ padding: "52px 24px", textAlign: "center", background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "14px" }}>
        <div style={{ width: "56px", height: "56px", background: SOFT, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "26px" }}>🎫</div>
        <p style={{ fontSize: "15px", fontWeight: 700, color: TEXT, marginBottom: "6px" }}>Kupon bulunamadı</p>
        <p style={{ fontSize: "13px", color: TEXT2 }}>Bu dönemde kayıtlı kupon yok.</p>
      </div>
    );
  }

  /* Daily (single day): show inline */
  if (start === end) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {coupons.map((c: any) => <CouponRow key={c.id} coupon={c} />)}
      </div>
    );
  }

  /* Weekly/Monthly: group by day → accordion */
  const byDate = new Map<string, any[]>();
  for (const c of coupons) {
    if (!byDate.has(c.couponDate)) byDate.set(c.couponDate, []);
    byDate.get(c.couponDate)!.push(c);
  }
  const sortedDates = Array.from(byDate.keys()).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {sortedDates.map((d) => (
        <DayAccordion key={d} date={d} coupons={byDate.get(d)!} />
      ))}
    </div>
  );
}

/* ── Matches tab ────────────────────────────────────────────────────────── */
function MatchesView({ matches, filter }: { matches: RealMatch[]; filter: Filter }) {
  const [query, setQuery] = useState("");
  const resultTarget = filter === "void" ? "postponed" : filter;

  const filtered = matches
    .filter((m) => {
      const q = query.toLowerCase();
      const matchesQuery  = !q || m.homeTeam.toLowerCase().includes(q) || m.awayTeam.toLowerCase().includes(q);
      const matchesResult = filter === "all" || m.result === resultTarget;
      return matchesQuery && matchesResult;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div style={{ position: "relative", marginBottom: "16px", maxWidth: "380px" }}>
        <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: TEXT2 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Takım ara..."
          style={{ width: "100%", padding: "9px 12px 9px 34px", fontSize: "13px", borderRadius: "8px", border: `1px solid ${BORDER}`, outline: "none", color: TEXT, background: "#FFFFFF", boxSizing: "border-box" }}
          data-testid="input-match-search"
        />
      </div>
      <p style={{ fontSize: "12px", color: TEXT2, marginBottom: "12px" }}>{filtered.length} maç</p>
      <div className="hidden md:block" style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(11,20,32,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: SOFT, borderBottom: `1px solid ${BORDER}` }}>
              {["Tarih", "Ev Sahibi", "Deplasman", "Sonuç"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "10px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} style={{ borderBottom: `1px solid ${BORDER}` }} data-testid={`row-match-${m.id}`}>
                <td style={{ padding: "11px 16px", color: TEXT2, whiteSpace: "nowrap", fontSize: "11px" }}>{m.date}</td>
                <td style={{ padding: "11px 16px", fontWeight: 700, color: TEXT }}>{m.homeTeam}</td>
                <td style={{ padding: "11px 16px", color: TEXT }}>{m.awayTeam}</td>
                <td style={{ padding: "11px 16px" }}><StatusBadge result={m.result} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState text="Bu dönemde maç bulunamadı." />}
      </div>
      <div className="md:hidden" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {filtered.map((m) => (
          <div key={m.id} style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px 16px" }} data-testid={`card-match-mobile-${m.id}`}>
            <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "4px" }}>
              <div>
                <p style={{ fontWeight: 700, color: TEXT }}>{m.homeTeam} — {m.awayTeam}</p>
                <p style={{ fontSize: "11px", color: TEXT2 }}>{m.date}</p>
              </div>
              <StatusBadge result={m.result} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState text="Bu dönemde maç bulunamadı." />}
      </div>
    </div>
  );
}

/* ── Recorded days summary (desktop weekly/monthly Maçlar tab) ──────────── */
function RecordedDaysSummary({ matches, entries, recordedDays }: {
  matches: RealMatch[];
  entries: RealEntry[];
  recordedDays: string[];
}) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  function toggle(s: string) {
    setExpandedDays((p) => { const n = new Set(p); n.has(s) ? n.delete(s) : n.add(s); return n; });
  }

  const byDay = new Map<string, number>();
  entries.forEach((e) => byDay.set(e.date, (byDay.get(e.date) ?? 0) + e.value));

  const days = [...recordedDays].sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <p style={{ fontSize: "14px", fontWeight: 700, color: TEXT, marginBottom: "12px" }}>Kayıt Günleri</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {days.map((ds) => {
          const dayMatches = matches.filter((m) => m.date === ds);
          const net = byDay.get(ds);
          const isOpen = expandedDays.has(ds);
          const won = dayMatches.filter((m) => m.result === "won").length;
          const lost = dayMatches.filter((m) => m.result === "lost").length;
          const hasSomething = dayMatches.length > 0 || net !== undefined;

          return (
            <div key={ds} style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
              <button
                onClick={() => toggle(ds)}
                style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}
                data-testid={`button-day-${ds}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: TEXT, minWidth: "160px" }}>
                    {formatTR(parseDate(ds), { weekday: "long", day: "numeric", month: "short" })}
                  </span>
                  {hasSomething ? (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                      {dayMatches.length > 0 && <span style={{ fontSize: "12px", color: TEXT2 }}>{dayMatches.length} maç</span>}
                      {won > 0 && <span style={{ fontSize: "11px", fontWeight: 700, color: SUCCESS }}>✓ {won}</span>}
                      {lost > 0 && <span style={{ fontSize: "11px", fontWeight: 700, color: DANGER }}>✗ {lost}</span>}
                      {net !== undefined && (
                        <span style={{ fontSize: "12px", fontWeight: 800, color: net >= 0 ? SUCCESS : DANGER }}>
                          {net >= 0 ? "+" : ""}{net.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} €
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: "12px", color: TEXT2 }}>Veri yok</span>
                  )}
                </div>
                {isOpen ? <ChevronUp size={15} style={{ color: TEXT2 }} /> : <ChevronDown size={15} style={{ color: TEXT2 }} />}
              </button>
              {isOpen && dayMatches.length > 0 && (
                <div style={{ borderTop: `1px solid ${BORDER}`, padding: "10px 16px" }}>
                  {dayMatches.map((m) => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${SOFT}` }}>
                      <span style={{ fontSize: "13px", color: TEXT }}>{m.homeTeam} — {m.awayTeam}</span>
                      <StatusBadge result={m.result} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {days.length === 0 && <EmptyState text="Bu dönemde maç bulunamadı." />}
      </div>
    </div>
  );
}

/* ── Constants ──────────────────────────────────────────────────────────── */
const TR_DAYS   = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"];
const TR_MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

/* ── Enhanced MiniCalendar ──────────────────────────────────────────────── */
function MiniCalendar({
  selected, onSelect, dataDates, dayInfo, onClose,
}: {
  selected: string;
  onSelect: (date: string) => void;
  dataDates: Set<string>;
  dayInfo: Map<string, { net: number; count: number }>;
  onClose: () => void;
}) {
  const selDate = parseDate(selected);
  const [calMonth, setCalMonth] = useState(new Date(selDate.getFullYear(), selDate.getMonth(), 1));
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const year  = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const firstDow    = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr    = toDateStr(new Date());

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{
      position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100,
      background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(11,20,32,0.12)", padding: "16px", minWidth: "262px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <button onClick={() => setCalMonth(new Date(year, month - 1, 1))}
          style={{ background: "none", border: "none", cursor: "pointer", color: TEXT2, padding: "4px 6px", borderRadius: "6px" }}>
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontSize: "13px", fontWeight: 700, color: TEXT }}>{TR_MONTHS[month]} {year}</span>
        <button onClick={() => setCalMonth(new Date(year, month + 1, 1))}
          style={{ background: "none", border: "none", cursor: "pointer", color: TEXT2, padding: "4px 6px", borderRadius: "6px" }}>
          <ChevronRight size={14} />
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
        {TR_DAYS.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", fontWeight: 700, color: TEXT2, padding: "2px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr    = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = dateStr === selected;
          const isToday    = dateStr === todayStr;
          const hasData    = dataDates.has(dateStr);
          const info       = dayInfo.get(dateStr);
          const net        = info?.net ?? 0;
          const dotColor   = net > 0 ? SUCCESS : net < 0 ? DANGER : CYAN;
          const isHovered  = hoveredDate === dateStr;

          return (
            <div key={i} style={{ position: "relative" }}>
              <button
                onClick={hasData ? () => { onSelect(dateStr); onClose(); } : undefined}
                onMouseEnter={() => hasData ? setHoveredDate(dateStr) : undefined}
                onMouseLeave={() => setHoveredDate(null)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: "4px 2px", borderRadius: "6px", border: "none", width: "100%",
                  cursor: hasData ? "pointer" : "not-allowed",
                  opacity: hasData ? 1 : 0.3,
                  background: isSelected ? CYAN : isToday ? "rgba(232,119,31,0.08)" : "transparent",
                  color: isSelected ? "#0B1420" : TEXT,
                  fontWeight: isSelected || isToday ? 700 : 400,
                  fontSize: "12px", minHeight: "30px",
                  transition: "background 0.1s",
                }}
              >
                {day}
                {hasData && (
                  <span style={{
                    width: "4px", height: "4px", borderRadius: "50%",
                    background: isSelected ? "#0B1420" : dotColor,
                    display: "block", marginTop: "1px",
                  }} />
                )}
              </button>
              {isHovered && hasData && info && (
                <div style={{
                  position: "absolute", bottom: "calc(100% + 5px)", left: "50%",
                  transform: "translateX(-50%)",
                  background: TEXT, color: "#FFFFFF", fontSize: "11px",
                  padding: "6px 9px", borderRadius: "7px", whiteSpace: "nowrap",
                  zIndex: 200, pointerEvents: "none",
                  lineHeight: 1.5,
                }}>
                  <div style={{ fontWeight: 600 }}>{formatTR(parseDate(dateStr), { day: "numeric", month: "short" })}</div>
                  <div style={{ color: "#C8D0DA" }}>{info.count} kayıt</div>
                  <div style={{ color: net > 0 ? "#4ADE80" : net < 0 ? "#FC8383" : "#FFFFFF", fontWeight: 700 }}>
                    {net > 0 ? "+" : ""}{net.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} €
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "10px", borderTop: `1px solid ${BORDER}` }}>
        <button onClick={onClose} style={{ fontSize: "12px", color: TEXT2, background: "none", border: "none", cursor: "pointer" }}>Kapat</button>
        <button
          onClick={() => { if (dataDates.has(todayStr)) { onSelect(todayStr); onClose(); } }}
          style={{ fontSize: "12px", fontWeight: 600, color: dataDates.has(todayStr) ? CYAN : TEXT2, background: "none", border: "none", cursor: dataDates.has(todayStr) ? "pointer" : "default" }}
        >
          Bugün
        </button>
      </div>
    </div>
  );
}

/* ── Period list panel ──────────────────────────────────────────────────── */
function PeriodListPanel({
  periods, selected, onSelect, onClose,
}: {
  periods: AvailablePeriod[];
  selected: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}) {
  return (
    <div style={{
      position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100,
      background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(11,20,32,0.12)", minWidth: "240px",
      maxHeight: "320px", overflowY: "auto",
    }}>
      <div style={{ padding: "6px" }}>
        {periods.map((p) => {
          const isActive = p.date === selected;
          const net = p.netResult;
          return (
            <button
              key={p.date}
              onClick={() => { onSelect(p.date); onClose(); }}
              style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 12px", borderRadius: "8px", border: "none", cursor: "pointer", textAlign: "left",
                background: isActive ? SOFT : "transparent",
                borderBottom: isActive ? `2px solid ${CYAN}` : "2px solid transparent",
              }}
              data-testid={`button-period-list-${p.date}`}
            >
              <span style={{ fontSize: "13px", fontWeight: isActive ? 700 : 500, color: isActive ? TEXT : TEXT2 }}>
                {p.label}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: net >= 0 ? SUCCESS : DANGER, marginLeft: "16px", flexShrink: 0 }}>
                {net >= 0 ? "+" : ""}{net.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
            </button>
          );
        })}
        {periods.length === 0 && (
          <p style={{ padding: "16px 12px", fontSize: "13px", color: TEXT2, textAlign: "center" }}>Veri yok</p>
        )}
      </div>
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "8px 12px" }}>
        <button onClick={onClose} style={{ fontSize: "12px", color: TEXT2, background: "none", border: "none", cursor: "pointer" }}>Kapat</button>
      </div>
    </div>
  );
}

/* ── Period rail ────────────────────────────────────────────────────────── */
function PeriodRail({
  periods, selected, onSelect,
}: {
  periods: AvailablePeriod[];
  selected: string;
  onSelect: (date: string) => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selected]);

  if (periods.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: "4px", overflowX: "auto", flex: 1, paddingBottom: "2px", scrollbarWidth: "none" }}>
      {[...periods].reverse().map((p) => {
        const isActive = p.date === selected;
        const net = p.netResult;
        return (
          <button
            key={p.date}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelect(p.date)}
            style={{
              flexShrink: 0, whiteSpace: "nowrap",
              padding: "6px 12px", borderRadius: "7px", cursor: "pointer",
              fontSize: "12px", fontWeight: isActive ? 700 : 500,
              background: isActive ? SOFT : "transparent",
              color: isActive ? TEXT : TEXT2,
              border: "none",
              borderBottom: isActive ? `2px solid ${CYAN}` : "2px solid transparent",
              transition: "all 0.12s",
            }}
            data-testid={`button-period-${p.date}`}
          >
            {p.label}
            {" · "}
            <span style={{ color: net >= 0 ? SUCCESS : DANGER, fontWeight: 700 }}>
              {net >= 0 ? "+" : ""}
              {net.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Mobile bottom sheet ────────────────────────────────────────────────── */
function BottomSheet({
  open, onClose, periods, selected, onSelect, viewLabel,
}: {
  open: boolean;
  onClose: () => void;
  periods: AvailablePeriod[];
  selected: string;
  onSelect: (date: string) => void;
  viewLabel: string;
}) {
  if (!open) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(14,23,38,0.45)", zIndex: 1000,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
    >
      <div style={{ background: "#FFFFFF", borderRadius: "16px 16px 0 0", maxHeight: "70vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: "36px", height: "4px", background: BORDER, borderRadius: "2px" }} />
        </div>
        <div style={{ padding: "4px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: TEXT }}>{viewLabel}</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT2, padding: "4px" }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "0 8px 24px" }}>
          {periods.map((p) => {
            const isActive = p.date === selected;
            const net = p.netResult;
            return (
              <button
                key={p.date}
                onClick={() => { onSelect(p.date); onClose(); }}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "13px 12px", borderRadius: "10px", border: "none", cursor: "pointer", textAlign: "left",
                  background: isActive ? SOFT : "transparent", marginBottom: "2px",
                }}
              >
                <div>
                  <p style={{ fontSize: "14px", fontWeight: isActive ? 700 : 500, color: isActive ? TEXT : TEXT2 }}>{p.label}</p>
                  <p style={{ fontSize: "11px", color: TEXT2 }}>{p.count} kayıt</p>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: net >= 0 ? SUCCESS : DANGER }}>
                  {net >= 0 ? "+" : ""}{net.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </span>
              </button>
            );
          })}
          {periods.length === 0 && (
            <p style={{ padding: "24px", textAlign: "center", fontSize: "14px", color: TEXT2 }}>Henüz veri yok</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Mobile metric grid ─────────────────────────────────────────────────── */
function MobileMetricGrid({ stats }: { stats: RealStats }) {
  const fmtEur = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmt    = (n: number) => n.toLocaleString("tr-TR", { maximumFractionDigits: 1 });
  const cells = [
    { label: "Kazançlı Gün", value: String(stats.wonDays),    color: SUCCESS },
    { label: "Kayıplı Gün",  value: String(stats.lostDays),   color: DANGER },
    { label: "Toplam Kayıt", value: String(stats.totalEntries), color: TEXT },
    { label: "Toplam Maç",   value: String(stats.totalMatches), color: TEXT },
    { label: "Kazanan Maç",  value: String(stats.wonMatches),   color: SUCCESS },
    { label: "Kaybeden Maç", value: String(stats.lostMatches),  color: DANGER },
    { label: "Ertelenen",    value: String(stats.postponedMatches), color: TEXT2 },
    { label: "Maç İsabet",  value: fmt(stats.matchHitRate) + "%",  color: CYAN },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
      {cells.map((c) => (
        <div key={c.label} style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "14px 14px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", minHeight: "72px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <p style={{ fontSize: "10px", fontWeight: 600, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.3 }}>{c.label}</p>
          <p style={{ fontSize: "20px", fontWeight: 800, color: c.color, fontVariantNumeric: "tabular-nums", marginTop: "6px" }}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Mobile day accordion (matches + entries combined) ──────────────────── */
function MobileDayAccordion({
  date, matches, entry,
}: {
  date: string;
  matches: RealMatch[];
  entry: number | undefined;
}) {
  const [open, setOpen] = useState(false);
  const won  = matches.filter((m) => m.result === "won").length;
  const lost = matches.filter((m) => m.result === "lost").length;
  const fmt  = formatTR(parseDate(date), { weekday: "short", day: "numeric", month: "short" });

  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", background: "#FFFFFF" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "13px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
        data-testid={`button-mobile-day-${date}`}
      >
        <span style={{ fontWeight: 700, fontSize: "13px", color: TEXT, flexShrink: 0, minWidth: "96px" }}>{fmt}</span>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {matches.length > 0 && <span style={{ fontSize: "11px", color: TEXT2 }}>{matches.length} maç</span>}
          {won > 0 && <span style={{ fontSize: "11px", fontWeight: 700, color: SUCCESS }}>✓{won}</span>}
          {lost > 0 && <span style={{ fontSize: "11px", fontWeight: 700, color: DANGER }}>✗{lost}</span>}
        </div>
        {entry !== undefined && (
          <span style={{ fontSize: "13px", fontWeight: 800, color: entry >= 0 ? SUCCESS : DANGER, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
            {entry >= 0 ? "+" : ""}{entry.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} €
          </span>
        )}
        <span style={{ flexShrink: 0, color: TEXT2, marginLeft: "2px" }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      {open && (matches.length > 0 || entry !== undefined) && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "10px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {matches.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ fontSize: "12px", color: TEXT }}>{m.homeTeam} — {m.awayTeam}</span>
              <StatusBadge result={m.result} />
            </div>
          ))}
          {entry !== undefined && (
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "6px", borderTop: matches.length > 0 ? `1px solid ${BORDER}` : "none", marginTop: matches.length > 0 ? "2px" : 0 }}>
              <span style={{ fontSize: "12px", color: TEXT2 }}>Gün sonu</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: entry >= 0 ? SUCCESS : DANGER }}>
                {entry >= 0 ? "+" : ""}{entry.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function Gecmis() {
  const isMobile = useIsMobile();
  const { view, date: activePeriodKey, filter, tab, set, today, hasExplicitPeriod } = useQueryState();

  /* ── Data queries ───────────────────────────────────────────────────────── */
  const { data: oldMatches = [], isLoading: loadingOld } = useQuery<RealMatch[]>({ queryKey: ["/api/matches"] });
  const { data: settledTodayRaw = [], isLoading: loadingToday } = useQuery<{ id: number; date: string; homeTeam: string; awayTeam: string; result: string | null }[]>({ queryKey: ["/api/today/matches/settled"] });
  const loadingM = loadingOld || loadingToday;
  const allMatches = useMemo<RealMatch[]>(() => {
    const normalized = settledTodayRaw
      .filter((m) => m.result !== null)
      .map((m) => ({
        id: m.id + 1_000_000,
        date: m.date,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        result: m.result === "void" ? "postponed" : (m.result as string),
      }));
    const oldIds = new Set(oldMatches.map((m) => `${m.date}-${m.homeTeam}-${m.awayTeam}`));
    const deduped = normalized.filter((m) => !oldIds.has(`${m.date}-${m.homeTeam}-${m.awayTeam}`));
    return [...oldMatches, ...deduped];
  }, [oldMatches, settledTodayRaw]);
  const { data: allEntries = [], isLoading: loadingE } = useQuery<RealEntry[]>({ queryKey: ["/api/entries"] });

  /* ── Recorded dates ─────────────────────────────────────────────────────── */
  /** All unique dates that have at least one entry or match, sorted asc */
  const recordedDates = useMemo<string[]>(() => {
    const s = new Set<string>();
    allEntries.forEach((e) => s.add(e.date));
    return Array.from(s).sort();
  }, [allEntries]);

  /* ── Windows ────────────────────────────────────────────────────────────── */
  const weekWindows  = useMemo(() => makeWindows(recordedDates, 7),  [recordedDates]);
  const monthWindows = useMemo(() => makeWindows(recordedDates, 30), [recordedDates]);

  /* ── Active window ──────────────────────────────────────────────────────── */
  const activeWindow: DateWindow | null = useMemo(() => {
    if (view === "daily") return null;
    const windows = view === "weekly" ? weekWindows : monthWindows;
    const idx = Math.max(0, Math.min(parseInt(activePeriodKey) || 0, windows.length - 1));
    return windows[idx] ?? null;
  }, [view, activePeriodKey, weekWindows, monthWindows]);

  /* ── Period bounds ──────────────────────────────────────────────────────── */
  const { start, end } = useMemo(() => {
    if (view === "daily") {
      return /^\d{4}-\d{2}-\d{2}$/.test(activePeriodKey)
        ? { start: activePeriodKey, end: activePeriodKey }
        : { start: "9999-12-31", end: "0000-01-01" };
    }
    if (!activeWindow) return { start: "9999-12-31", end: "0000-01-01" };
    return { start: activeWindow.startDate, end: activeWindow.endDate };
  }, [view, activePeriodKey, activeWindow]);

  /* ── Period label ───────────────────────────────────────────────────────── */
  const currentPeriodLabel = buildPeriodLabel(view, activePeriodKey, activeWindow);

  /* ── Per-day info map ───────────────────────────────────────────────────── */
  const dayInfoByDate = useMemo(() => {
    const m = new Map<string, { net: number; count: number }>();
    allEntries.forEach((e) => {
      const cur = m.get(e.date) ?? { net: 0, count: 0 };
      m.set(e.date, { net: cur.net + e.value, count: cur.count + 1 });
    });
    allMatches.forEach((match) => {
      const cur = m.get(match.date) ?? { net: 0, count: 0 };
      m.set(match.date, { net: cur.net, count: cur.count + 1 });
    });
    return m;
  }, [allEntries, allMatches]);

  const dataDates = useMemo(() => {
    const s = new Set<string>();
    allMatches.forEach((m) => s.add(m.date));
    allEntries.forEach((e) => s.add(e.date));
    return s;
  }, [allMatches, allEntries]);

  /* ── Available periods ──────────────────────────────────────────────────── */
  const availableDays = useMemo((): AvailablePeriod[] => {
    return Array.from(dayInfoByDate.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([d, { net, count }]) => ({
        date: d,
        label: formatTR(parseDate(d), { day: "numeric", month: "short" }),
        netResult: net,
        count,
      }));
  }, [dayInfoByDate]);

  const availableWeeks = useMemo((): AvailablePeriod[] => {
    return weekWindows.map((w) => {
      const entries = allEntries.filter((e) => e.date >= w.startDate && e.date <= w.endDate);
      const matches = allMatches.filter((m) => m.date >= w.startDate && m.date <= w.endDate);
      const net = entries.reduce((s, e) => s + e.value, 0);
      return {
        date: String(w.windowIndex),
        label: `${shortDate(w.startDate)} – ${shortDate(w.endDate)}`,
        netResult: net,
        count: entries.length + matches.length,
      };
    });
  }, [weekWindows, allEntries, allMatches]);

  const availableMonths = useMemo((): AvailablePeriod[] => {
    return monthWindows.map((w) => {
      const entries = allEntries.filter((e) => e.date >= w.startDate && e.date <= w.endDate);
      const matches = allMatches.filter((m) => m.date >= w.startDate && m.date <= w.endDate);
      const net = entries.reduce((s, e) => s + e.value, 0);
      return {
        date: String(w.windowIndex),
        label: `${shortDate(w.startDate)} – ${shortDate(w.endDate)}`,
        netResult: net,
        count: entries.length + matches.length,
      };
    });
  }, [monthWindows, allEntries, allMatches]);

  const activePeriods = view === "daily" ? availableDays : view === "weekly" ? availableWeeks : availableMonths;
  const currentIdx    = activePeriods.findIndex((p) => p.date === activePeriodKey);
  const canGoPrev     = currentIdx < activePeriods.length - 1;
  const canGoNext     = currentIdx > 0;

  const goPrev = useCallback(() => {
    if (currentIdx < activePeriods.length - 1) set({ date: activePeriods[currentIdx + 1].date });
  }, [currentIdx, activePeriods, set]);

  const goNext = useCallback(() => {
    if (currentIdx > 0) set({ date: activePeriods[currentIdx - 1].date });
  }, [currentIdx, activePeriods, set]);

  /* ── Smart view switching ───────────────────────────────────────────────── */
  const switchView = useCallback((newView: View) => {
    if (newView === view) return;
    if (newView === "daily") {
      // Find a day within the current window, or fall back to latest
      let newDate = availableDays[0]?.date ?? today;
      if (activeWindow) {
        const dayInWindow = availableDays.find((d) => d.date >= activeWindow.startDate && d.date <= activeWindow.endDate);
        if (dayInWindow) newDate = dayInWindow.date;
      }
      set({ view: newView, date: newDate });
    } else {
      // weekly or monthly → always start at window 0 (latest)
      set({ view: newView, date: "0" });
    }
  }, [view, activeWindow, availableDays, today, set]);

  /* ── Initialization effect ──────────────────────────────────────────────── */
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    if (loadingM || loadingE) return;
    if (allMatches.length === 0 && allEntries.length === 0) {
      initialized.current = true;
      return;
    }
    initialized.current = true;

    if (!hasExplicitPeriod) {
      /* Respect existing ?view= param; just set the default period key for that view */
      if (view === "daily") {
        if (availableDays.length > 0) set({ date: availableDays[0].date });
      } else {
        /* weekly or monthly → latest window (index 0) */
        set({ date: "0" });
      }
    } else {
      /* URL had an explicit period/window — validate it */
      if (view === "daily") {
        if (availableDays.length > 0 && !dataDates.has(activePeriodKey)) {
          set({ date: availableDays[0].date });
        }
      } else {
        const windows = view === "weekly" ? weekWindows : monthWindows;
        const idx = parseInt(activePeriodKey) || 0;
        if (idx >= windows.length && windows.length > 0) {
          set({ date: "0" });
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingM, loadingE, allMatches.length, allEntries.length]);

  /* ── Son veriye git ─────────────────────────────────────────────────────── */
  const latestPeriod = activePeriods[0];
  const isOnLatest   = latestPeriod?.date === activePeriodKey;
  const goLatest     = useCallback(() => {
    if (latestPeriod) set({ date: latestPeriod.date });
  }, [latestPeriod, set]);

  /* ── Period data ────────────────────────────────────────────────────────── */
  const periodMatches = useMemo(
    () => allMatches.filter((m) => m.date >= start && m.date <= end),
    [allMatches, start, end]
  );
  const periodEntries = useMemo(
    () => allEntries.filter((e) => e.date >= start && e.date <= end),
    [allEntries, start, end]
  );
  const filteredMatches = useMemo(() => {
    if (filter === "all") return periodMatches;
    const target = filter === "void" ? "postponed" : filter;
    return periodMatches.filter((m) => m.result === target);
  }, [periodMatches, filter]);

  const stats     = useMemo(() => computeRealStats(filteredMatches, periodEntries), [filteredMatches, periodEntries]);
  const isLoading = loadingM || loadingE;

  /* ── Picker state ───────────────────────────────────────────────────────── */
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);

  const [bottomOpen, setBottomOpen] = useState(false);

  const viewLabels:   Record<View,   string> = { daily: "Günlük", weekly: "7 Gün", monthly: "30 Gün" };
  const filterLabels: Record<Filter, string> = { all: "Tümü", won: "Kazandı", lost: "Kaybetti", void: "İptal" };

  /* ── Net result for summary card ────────────────────────────────────────── */
  const periodNetResult = periodEntries.reduce((s, e) => s + e.value, 0);
  const fmtNet = (n: number) =>
    (n >= 0 ? "+" : "") + n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

  /* ── Per-day net map (for mobile accordion) ─────────────────────────────── */
  const netByDay = useMemo(() => {
    const m = new Map<string, number>();
    periodEntries.forEach((e) => m.set(e.date, (m.get(e.date) ?? 0) + e.value));
    return m;
  }, [periodEntries]);

  const recordedDaysInPeriod = useMemo(() => {
    const s = new Set<string>();
    periodEntries.forEach((e) => s.add(e.date));
    periodMatches.forEach((m) => s.add(m.date));
    return Array.from(s).sort((a, b) => b.localeCompare(a));
  }, [periodEntries, periodMatches]);

  /* ── Summary label ──────────────────────────────────────────────────────── */
  const summaryRangeLabel = useMemo(() => {
    if (view === "daily" && /^\d{4}-\d{2}-\d{2}$/.test(activePeriodKey)) {
      return formatTR(parseDate(activePeriodKey), { day: "numeric", month: "long", year: "numeric", weekday: "long" });
    }
    if (!activeWindow) return "Veri yok";
    return `${shortDate(activeWindow.startDate)} – ${shortDateYear(activeWindow.endDate)}`;
  }, [view, activePeriodKey, activeWindow]);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <SiteHeader />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE LAYOUT (<768px) */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Page title */}
        <div style={{ background: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, padding: "20px 16px 16px" }}>
          <Link href="/">
            <button style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 500, color: TEXT2, background: "transparent", border: "none", cursor: "pointer", padding: 0, marginBottom: "8px" }} data-testid="button-back-home-mobile">
              <ArrowLeft size={13} /> Ana Sayfa
            </button>
          </Link>
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: TEXT, fontFamily: "'Manrope', sans-serif" }}>
            Geçmiş
          </h1>
          <p style={{ fontSize: "12px", color: TEXT2, marginTop: "2px" }}>
            Kayıt günleri bazında maç ve kazanç analizi
          </p>
        </div>

        <div style={{ padding: "14px 14px 48px" }}>

          {/* Segmented control + nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            {/* Prev */}
            <button
              onClick={goPrev}
              disabled={!canGoPrev}
              style={{ flexShrink: 0, width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "10px", cursor: canGoPrev ? "pointer" : "not-allowed", color: canGoPrev ? TEXT : TEXT2, opacity: canGoPrev ? 1 : 0.35 }}
              data-testid="button-prev-period-mobile"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Segmented control */}
            <div style={{ flex: 1, display: "flex", background: SOFT, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "3px" }}>
              {(["daily", "weekly", "monthly"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => switchView(v)}
                  style={{
                    flex: 1, fontSize: "12px", fontWeight: 600, padding: "6px 4px", borderRadius: "8px", border: "none", cursor: "pointer",
                    background: view === v ? "#FFFFFF" : "transparent",
                    color: view === v ? TEXT : TEXT2,
                    boxShadow: view === v ? "0 1px 4px rgba(14,23,38,0.07)" : "none",
                    transition: "all 0.15s",
                  }}
                  data-testid={`button-view-mobile-${v}`}
                >
                  {viewLabels[v]}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={goNext}
              disabled={!canGoNext}
              style={{ flexShrink: 0, width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "10px", cursor: canGoNext ? "pointer" : "not-allowed", color: canGoNext ? TEXT : TEXT2, opacity: canGoNext ? 1 : 0.35 }}
              data-testid="button-next-period-mobile"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Summary card */}
          <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "18px 18px", marginBottom: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>
                  {view === "daily" ? "Günlük" : view === "weekly" ? "Son 7 kayıt günü" : "Son 30 kayıt günü"}
                </p>
                <p style={{ fontSize: "14px", fontWeight: 700, color: TEXT, lineHeight: 1.4 }}>{summaryRangeLabel}</p>
                <p style={{ fontSize: "11px", color: TEXT2, marginTop: "4px" }}>
                  {recordedDaysInPeriod.length} gün · {periodEntries.length} kayıt · {periodMatches.length} maç
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Net</p>
                <p style={{ fontSize: "24px", fontWeight: 900, color: periodNetResult >= 0 ? SUCCESS : DANGER, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                  {fmtNet(periodNetResult)}
                </p>
              </div>
            </div>
          </div>

          {/* Filter strip */}
          <div style={{ display: "flex", background: SOFT, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "3px", marginBottom: "10px" }}>
            {(["all", "won", "lost", "void"] as Filter[]).map((f) => {
              const activeBg:    Record<Filter, string> = { all: "#FFFFFF", won: "rgba(18,154,99,0.10)",  lost: "rgba(217,90,104,0.10)", void: "rgba(93,107,122,0.10)" };
              const activeColor: Record<Filter, string> = { all: TEXT,      won: SUCCESS,                  lost: DANGER,                  void: TEXT2 };
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => set({ filter: f })}
                  style={{ flex: 1, fontSize: "11px", fontWeight: 600, padding: "6px 2px", borderRadius: "8px", cursor: "pointer", transition: "all 0.15s", background: isActive ? activeBg[f] : "transparent", color: isActive ? activeColor[f] : TEXT2, border: "none" }}
                  data-testid={`button-filter-mobile-${f}`}
                >
                  {filterLabels[f]}
                </button>
              );
            })}
          </div>

          {/* Kuponlar / Maçlar toggle */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
            {(["coupons", "matches"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => set({ tab: t })}
                style={{ flex: 1, fontSize: "13px", fontWeight: 600, padding: "8px", borderRadius: "10px", cursor: "pointer", transition: "all 0.15s", background: tab === t ? CYAN : "#FFFFFF", color: tab === t ? "#0E1726" : TEXT2, border: `1px solid ${tab === t ? CYAN : BORDER}` }}
                data-testid={`button-tab-mobile-${t}`}
              >
                {t === "coupons" ? "Kuponlar" : "Maçlar"}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: TEXT2, fontSize: "13px" }}>Yükleniyor...</p>
            </div>
          ) : (
            <>
              {/* Charts — only mount when actually mobile to avoid recharts measuring hidden divs */}
              {isMobile && <ChartsSection entries={periodEntries} matches={periodMatches} isMobile={true} />}

              {/* Metric grid */}
              <MobileMetricGrid stats={stats} />

              {/* Record list (day accordions) */}
              <p style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
                Günlük Döküm
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" }}>
                {tab === "coupons" ? (
                  <CouponsView start={start} end={end} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {recordedDaysInPeriod.map((d) => (
                      <MobileDayAccordion
                        key={d}
                        date={d}
                        matches={filteredMatches.filter((m) => m.date === d)}
                        entry={netByDay.get(d)}
                      />
                    ))}
                    {recordedDaysInPeriod.length === 0 && <EmptyState text="Bu dönemde veri bulunamadı." />}
                  </div>
                )}
              </div>

              {/* Son veriye git */}
              {!isOnLatest && latestPeriod && (
                <button
                  onClick={goLatest}
                  style={{ width: "100%", fontSize: "13px", fontWeight: 600, color: CYAN, background: "rgba(232,119,31,0.08)", border: `1px solid rgba(232,119,31,0.2)`, borderRadius: "10px", padding: "10px", cursor: "pointer", marginTop: "8px" }}
                  data-testid="button-go-latest-mobile"
                >
                  Son Veriye Git
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DESKTOP LAYOUT (≥768px) */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        {/* Page header */}
        <div style={{ background: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, padding: "32px 24px 28px" }}>
          <div className="mx-auto" style={{ maxWidth: "1100px" }}>
            <Link href="/">
              <button
                style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: 500, color: TEXT2, background: "transparent", border: "none", cursor: "pointer", padding: 0, marginBottom: "12px" }}
                data-testid="button-back-home"
              >
                <ArrowLeft size={14} /> Ana Sayfa
              </button>
            </Link>
            <h1 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 900, color: TEXT, marginBottom: "6px", fontFamily: "'Manrope', sans-serif" }} data-testid="text-gecmis-title">
              Geçmiş
            </h1>
            <p style={{ fontSize: "14px", color: TEXT2, maxWidth: "560px" }}>
              Günlük, haftalık ve aylık tüm maç ve kâr/zarar sonuçları.
            </p>
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-6" style={{ maxWidth: "1100px", paddingTop: "24px", paddingBottom: "60px" }}>

          {/* Controls card */}
          <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px 18px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(11,20,32,0.04)" }}>

            {/* Row 1: view tabs + nav + Tüm Dönemler + Son Veriye Git */}
            <div className="flex flex-wrap items-center justify-between gap-3" style={{ marginBottom: activePeriods.length > 0 ? "14px" : 0 }}>

              {/* View toggle */}
              <div style={{ display: "inline-flex", background: SOFT, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "3px" }}>
                {(["daily", "weekly", "monthly"] as View[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => switchView(v)}
                    style={{
                      fontSize: "13px", fontWeight: 600, padding: "6px 16px", borderRadius: "6px", border: "none", cursor: "pointer",
                      background: view === v ? "#FFFFFF" : "transparent",
                      color: view === v ? TEXT : TEXT2,
                      boxShadow: view === v ? "0 1px 4px rgba(14,23,38,0.07)" : "none",
                      transition: "all 0.15s",
                    }}
                    data-testid={`button-view-${v}`}
                  >
                    {v === "daily" ? "Günlük" : v === "weekly" ? "Haftalık" : "Aylık"}
                  </button>
                ))}
              </div>

              {/* Date nav + picker */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <button
                  onClick={goPrev}
                  disabled={!canGoPrev}
                  style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "7px", cursor: canGoPrev ? "pointer" : "not-allowed", color: canGoPrev ? TEXT : TEXT2, opacity: canGoPrev ? 1 : 0.35, transition: "opacity 0.15s" }}
                  data-testid="button-prev-period"
                >
                  <ChevronLeft size={15} />
                </button>
                <div style={{ padding: "0 8px", textAlign: "center", minWidth: "0", flex: "1 1 auto" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3 }}>
                    {currentPeriodLabel.line1}
                  </p>
                  {currentPeriodLabel.line2 && (
                    <p style={{ fontSize: "11px", color: TEXT2, whiteSpace: "nowrap", marginTop: "1px" }}>
                      {currentPeriodLabel.line2}
                    </p>
                  )}
                </div>
                <button
                  onClick={goNext}
                  disabled={!canGoNext}
                  style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "7px", cursor: canGoNext ? "pointer" : "not-allowed", color: canGoNext ? TEXT : TEXT2, opacity: canGoNext ? 1 : 0.35, transition: "opacity 0.15s" }}
                  data-testid="button-next-period"
                >
                  <ChevronRight size={15} />
                </button>

                {/* Tüm Dönemler */}
                <div ref={pickerRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setPickerOpen((o) => !o)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: 600, borderRadius: "7px", border: `1px solid ${BORDER}`, color: TEXT, background: "#FFFFFF", cursor: "pointer" }}
                    data-testid="button-all-periods"
                  >
                    <Calendar size={13} style={{ color: TEXT2 }} />
                    <span className="hidden sm:inline">Tüm Dönemler</span>
                    <span className="sm:hidden">Dönemler</span>
                  </button>
                  {pickerOpen && view === "daily" && (
                    <MiniCalendar
                      selected={/^\d{4}-\d{2}-\d{2}$/.test(activePeriodKey) ? activePeriodKey : today}
                      onSelect={(d) => set({ date: d })}
                      dataDates={dataDates}
                      dayInfo={dayInfoByDate}
                      onClose={() => setPickerOpen(false)}
                    />
                  )}
                  {pickerOpen && view !== "daily" && (
                    <PeriodListPanel
                      periods={activePeriods}
                      selected={activePeriodKey}
                      onSelect={(d) => set({ date: d })}
                      onClose={() => setPickerOpen(false)}
                    />
                  )}
                </div>

                {/* Son Veriye Git */}
                {!isOnLatest && latestPeriod && (
                  <button
                    onClick={goLatest}
                    style={{ fontSize: "12px", fontWeight: 600, color: CYAN, background: "rgba(232,119,31,0.08)", border: `1px solid rgba(232,119,31,0.2)`, borderRadius: "7px", padding: "6px 12px", cursor: "pointer", whiteSpace: "nowrap" }}
                    data-testid="button-go-latest"
                  >
                    Son Veriye Git
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: period rail */}
            {activePeriods.length > 0 && (
              <>
                <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: "10px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <PeriodRail
                    periods={activePeriods}
                    selected={activePeriodKey}
                    onSelect={(d) => set({ date: d })}
                  />
                </div>
              </>
            )}
          </div>

          {/* Filter + tab */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div style={{ display: "inline-flex", flexWrap: "wrap", background: SOFT, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "3px" }}>
              {(["all", "won", "lost", "void"] as Filter[]).map((f) => {
                const activeBg:     Record<Filter, string> = { all: "#FFFFFF", won: "rgba(18,154,99,0.10)",  lost: "rgba(217,90,104,0.10)", void: "rgba(93,107,122,0.10)" };
                const activeColor:  Record<Filter, string> = { all: TEXT,      won: SUCCESS,                  lost: DANGER,                  void: TEXT2 };
                const activeBorder: Record<Filter, string> = { all: BORDER,    won: "rgba(18,154,99,0.25)",   lost: "rgba(217,90,104,0.25)", void: "rgba(93,107,122,0.20)" };
                const isActive = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => set({ filter: f })}
                    style={{
                      fontSize: "12px", fontWeight: 600, padding: "5px 14px", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s",
                      background: isActive ? activeBg[f] : "transparent",
                      color: isActive ? activeColor[f] : TEXT2,
                      border: isActive ? `1px solid ${activeBorder[f]}` : "1px solid transparent",
                    }}
                    data-testid={`button-filter-${f}`}
                  >
                    {filterLabels[f]}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              {(["coupons", "matches"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => set({ tab: t })}
                  style={{
                    fontSize: "13px", fontWeight: 600, padding: "7px 18px", borderRadius: "8px", cursor: "pointer", transition: "all 0.15s",
                    background: tab === t ? CYAN : "#FFFFFF",
                    color: tab === t ? "#0E1726" : TEXT2,
                    border: `1px solid ${tab === t ? CYAN : BORDER}`,
                  }}
                  data-testid={`button-tab-${t}`}
                >
                  {t === "coupons" ? "Kuponlar" : "Maçlar"}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <p style={{ color: TEXT2 }}>Veriler yükleniyor...</p>
            </div>
          ) : (
            <>
              {!isMobile && <ChartsSection entries={periodEntries} matches={periodMatches} />}
              <RealStatGrid stats={stats} />
              {tab === "coupons" ? (
                <CouponsView start={start} end={end} />
              ) : (view === "weekly" || view === "monthly") ? (
                <RecordedDaysSummary
                  matches={periodMatches}
                  entries={periodEntries}
                  recordedDays={activeWindow?.recordedDays ?? recordedDaysInPeriod}
                />
              ) : (
                <MatchesView matches={periodMatches} filter={filter} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <BottomSheet
        open={bottomOpen}
        onClose={() => setBottomOpen(false)}
        periods={activePeriods}
        selected={activePeriodKey}
        onSelect={(d) => set({ date: d })}
        viewLabel={viewLabels[view]}
      />
    </div>
  );
}
