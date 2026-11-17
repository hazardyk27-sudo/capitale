import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import SiteHeader from "@/components/SiteHeader";
import { CouponImageDialog } from "@/components/CouponImageDialog";
import type { TodayMatch, TodayCoupon, TodayPublicPick, MembershipPublicationWithLegs } from "@shared/schema";
import { X, Lock, Crown, Star, ChevronDown, ChevronUp } from "lucide-react";

/* ── Design tokens ─────────────────────────────────────────────── */
const BG      = "#FCFCFB";
const SOFT    = "#F4F7F8";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const BORDER  = "#E4EAEE";
const CYAN    = "#E8771F";
const SUCCESS = "#129A63";
const DANGER    = "#D95A68";
const POSTPONED = "#D4820A";

/* ── Helpers ───────────────────────────────────────────────────── */
function todayISODate(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}

function truncOdds(n: number): string {
  return (Math.floor(n * 100) / 100).toFixed(2);
}

function msUntilIstanbulMidnight(): number {
  const now = new Date();
  const istanbulDateStr = now.toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
  const [y, m, d] = istanbulDateStr.split("-").map(Number);
  // Tomorrow 00:00 Istanbul → UTC: Istanbul is UTC+3 so subtract 3h
  const tomorrowMidnightUTC = new Date(Date.UTC(y, m - 1, d + 1, 0, 0, 0) - 3 * 60 * 60 * 1000);
  return Math.max(0, tomorrowMidnightUTC.getTime() - now.getTime());
}

function useIstanbulToday(): string {
  const [date, setDate] = useState(() => todayISODate());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function schedule() {
      timer = setTimeout(() => {
        setDate(todayISODate());
        schedule();
      }, msUntilIstanbulMidnight() + 500);
    }
    schedule();
    return () => clearTimeout(timer);
  }, []);

  return date;
}

function formatEnglishDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", weekday: "long",
    timeZone: "Europe/Istanbul",
  });
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isDesktop;
}

function getDailyStatus(coupons: TodayCoupon[]): { label: string; active: boolean } {
  if (!coupons.length) return { label: "AWAITING CONTENT", active: false };
  const allSettled = coupons.every((c) => c.status === "SETTLED");
  if (allSettled) return { label: "DAY SETTLED", active: false };
  const now = new Date();
  const earliest = coupons.map((c) => c.firstKickoffAt).sort()[0];
  if (earliest) {
    const [h, m] = earliest.split(":").map(Number);
    const kickoff = new Date();
    kickoff.setHours(h, m, 0, 0);
    if (now >= kickoff) return { label: "LIVE NOW", active: true };
    return { label: "PRE-MATCH ACTIVE", active: true };
  }
  return { label: "PRE-MATCH ACTIVE", active: true };
}

function fmt(n: number) {
  return n.toLocaleString("en-EU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(isoOrText: string) {
  try {
    const d = new Date(isoOrText);
    if (isNaN(d.getTime())) return isoOrText;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Istanbul" });
  } catch { return isoOrText; }
}

/* ── Shared badge ──────────────────────────────────────────────── */
function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: "9px", fontWeight: 700, color, background: bg,
      padding: "3px 8px", borderRadius: "4px",
      textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function CouponBadge({ coupon }: { coupon: TodayCoupon }) {
  if (coupon.status === "SETTLED") {
    if (coupon.result === "WON")  return <Badge color={SUCCESS} bg="rgba(18,154,99,0.1)">WON</Badge>;
    if (coupon.result === "LOST") return <Badge color={DANGER}  bg="rgba(217,90,104,0.1)">LOST</Badge>;
    if (coupon.result === "VOID") return <Badge color={TEXT2}   bg="rgba(93,107,122,0.1)">VOID</Badge>;
  }
  return <Badge color={CYAN} bg="rgba(232,119,31,0.1)">PRE-MATCH</Badge>;
}

function PickBadge({ pick }: { pick: TodayPublicPick }) {
  if (pick.status === "SETTLED") {
    if (pick.result === "WON")  return <Badge color={SUCCESS} bg="rgba(18,154,99,0.1)">WON</Badge>;
    if (pick.result === "LOST") return <Badge color={DANGER}  bg="rgba(217,90,104,0.1)">LOST</Badge>;
    if (pick.result === "VOID") return <Badge color={TEXT2}   bg="rgba(93,107,122,0.1)">VOID</Badge>;
  }
  return <Badge color={CYAN} bg="rgba(232,119,31,0.1)">PRE-MATCH</Badge>;
}

/* ── Section label ─────────────────────────────────────────────── */
function SectionLabel({ title, count }: { title: string; count?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
      <span style={{
        fontSize: "9px", fontWeight: 800, color: TEXT2,
        textTransform: "uppercase", letterSpacing: "0.12em",
      }}>
        {title}
      </span>
      {count && (
        <span style={{ fontSize: "10px", fontWeight: 600, color: TEXT2 }}>{count}</span>
      )}
    </div>
  );
}

/* ── Lightbox ──────────────────────────────────────────────────── */
function Lightbox({ coupon, onClose, prematch = false }: { coupon: TodayCoupon; onClose: () => void; prematch?: boolean }) {
  const { data, isLoading } = useQuery<{ preMatchImage: string | null; settledImage: string | null }>({
    queryKey: [`/api/today/coupons/${coupon.id}/image`],
    queryFn: () => fetch(`/api/today/coupons/${coupon.id}/image`).then((r) => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const img = prematch
    ? (data?.preMatchImage ?? null)
    : (data?.settledImage ?? data?.preMatchImage ?? null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(14,23,38,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={onClose}
      data-testid="lightbox-overlay"
      role="dialog" aria-modal="true" aria-label={`${coupon.label} coupon image`}
    >
      <div style={{ position: "relative", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflow: "auto", borderRadius: "10px", background: "#fff" }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10, background: "rgba(14,23,38,0.65)", border: "none", borderRadius: "6px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
          aria-label="Close" data-testid="button-lightbox-close"
        >
          <X size={16} />
        </button>
        {isLoading ? (
          <div style={{ padding: "48px 32px", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: TEXT2, margin: 0 }}>Loading image…</p>
          </div>
        ) : img ? (
          <img src={img} alt={`${coupon.label} coupon image`} style={{ width: "100%", height: "auto", objectFit: "contain", display: "block", borderRadius: "10px" }} />
        ) : (
          <div style={{ padding: "48px 32px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: TEXT, marginBottom: "8px" }}>{coupon.label}</p>
            <p style={{ fontSize: "13px", color: TEXT2, margin: 0 }}>Image not yet added.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Daily Summary Strip ───────────────────────────────────────── */
function DailySummaryStrip({
  matches,
  coupons,
  publishedAt,
}: {
  matches: TodayMatch[];
  coupons: TodayCoupon[];
  publishedAt: string | null;
}) {
  const totalStake          = coupons.reduce((s, c) => s + c.stake, 0);
  const totalPotentialReturn = coupons.reduce((s, c) => s + c.stake * c.totalOdds, 0);
  const potentialProfit     = totalPotentialReturn - totalStake;
  const { label: statusLabel, active: statusActive } = getDailyStatus(coupons);

  const items = [
    { label: "Matches",          value: String(matches.length),          color: TEXT },
    { label: "Coupons",          value: String(coupons.length),          color: TEXT },
    { label: "Total Stake",      value: `€${fmt(totalStake)}`,           color: TEXT },
    { label: "Potential Return", value: `€${fmt(totalPotentialReturn)}`, color: TEXT },
    { label: "Potential Profit", value: `+€${fmt(potentialProfit)}`,     color: SUCCESS },
  ];

  return (
    <div style={{ background: "#FFFFFF", borderBottom: `1px solid ${BORDER}` }}>
      <div className="mx-auto" style={{ maxWidth: "1280px", padding: "0 16px" }}>

        {/* Mobile: 2-column grid */}
        <div className="grid grid-cols-2 sm:hidden" style={{ padding: "10px 0", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0" }}>
          {items.map((item, i) => (
            <div
              key={item.label}
              style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "8px 10px",
                borderRight: i % 2 === 0 ? `1px solid ${BORDER}` : "none",
                borderBottom: i < items.length - 2 ? `1px solid ${BORDER}` : "none",
              }}
            >
              <span style={{ fontSize: "8px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>
                {item.label}
              </span>
              <span style={{ fontSize: "13px", fontWeight: 800, color: item.color, fontVariantNumeric: "tabular-nums", fontFamily: "'Manrope', sans-serif" }}>
                {item.value}
              </span>
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1", borderTop: `1px solid ${BORDER}`, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {publishedAt && (
              <span style={{ fontSize: "10px", color: TEXT2 }}>Published {publishedAt}</span>
            )}
            <span style={{
              fontSize: "9px", fontWeight: 800,
              color: statusActive ? CYAN : TEXT2,
              background: statusActive ? "rgba(232,119,31,0.08)" : "rgba(93,107,122,0.06)",
              border: `1px solid ${statusActive ? "rgba(232,119,31,0.22)" : BORDER}`,
              padding: "4px 10px", borderRadius: "4px",
              textTransform: "uppercase", letterSpacing: "0.09em", whiteSpace: "nowrap",
              marginLeft: "auto",
            }} data-testid="text-daily-status">
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Desktop: single row flex */}
        <div className="hidden sm:flex" style={{ alignItems: "center", flexWrap: "nowrap", minHeight: "48px" }}>
          {items.map((item, i) => (
            <div
              key={item.label}
              style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "10px 16px",
                borderRight: i < items.length - 1 ? `1px solid ${BORDER}` : "none",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "2px" }}>
                {item.label}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 800, color: item.color, fontVariantNumeric: "tabular-nums", fontFamily: "'Manrope', sans-serif" }}>
                {item.value}
              </span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px", padding: "10px 0 10px 20px", flexShrink: 0 }}>
            {publishedAt && (
              <span style={{ fontSize: "10px", color: TEXT2 }}>Published {publishedAt}</span>
            )}
            <span style={{
              fontSize: "9px", fontWeight: 800,
              color: statusActive ? CYAN : TEXT2,
              background: statusActive ? "rgba(232,119,31,0.08)" : "rgba(93,107,122,0.06)",
              border: `1px solid ${statusActive ? "rgba(232,119,31,0.22)" : BORDER}`,
              padding: "4px 10px", borderRadius: "4px",
              textTransform: "uppercase", letterSpacing: "0.09em", whiteSpace: "nowrap",
            }} data-testid="text-daily-status">
              {statusLabel}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Smart Match Navigator (left) ──────────────────────────────── */
function SmartMatchNavigator({
  matches,
  coupons,
  publicPick,
  highlightedCouponId,
  onMatchClick,
}: {
  matches: TodayMatch[];
  coupons: TodayCoupon[];
  publicPick: TodayPublicPick | null | undefined;
  highlightedCouponId: number | null;
  onMatchClick: (couponId: number | null) => void;
}) {

  function isFreePick(m: TodayMatch): boolean {
    return !!(publicPick && m.homeTeam === publicPick.homeTeam && m.awayTeam === publicPick.awayTeam);
  }

  function getCouponForMatch(m: TodayMatch): TodayCoupon | undefined {
    return coupons.find((c) => c.firstKickoffAt === m.kickoffAt);
  }

  function getMatchLabels(m: TodayMatch): string[] {
    const labels: string[] = [];
    if (isFreePick(m)) labels.push("Free Pick");
    const matchingCoupons = coupons.filter((c) => c.firstKickoffAt === m.kickoffAt);
    matchingCoupons.forEach((c) => labels.push(c.label || "Coupon"));
    return labels;
  }

  const filtered = matches;

  if (!matches.length) {
    return (
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "16px" }}>
        <SectionLabel title="Today's Matches" count="0 matches" />
        <p style={{ fontSize: "13px", color: TEXT2, textAlign: "center", padding: "24px 0", margin: 0 }}>
          No matches entered for today.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${BORDER}` }}>
        <SectionLabel title="Today's Matches" count={`${matches.length} matches`} />
      </div>

      {/* Match rows */}
      <div>
        {filtered.length === 0 ? (
          <p style={{ fontSize: "12px", color: TEXT2, textAlign: "center", padding: "20px 16px", margin: 0 }}>
            No matches for this filter.
          </p>
        ) : filtered.map((m, i) => {
          const coupon = getCouponForMatch(m);
          const fp = isFreePick(m);
          const labels = getMatchLabels(m);
          const isHighlighted = coupon && highlightedCouponId === coupon.id;

          return (
            <div
              key={m.id}
              data-testid={`match-item-${m.id}`}
              onClick={() => onMatchClick(coupon?.id ?? null)}
              style={{
                padding: "11px 16px",
                borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                borderLeft: isHighlighted ? `3px solid ${CYAN}` : "3px solid transparent",
                background: isHighlighted ? "rgba(232,119,31,0.04)" : "transparent",
                cursor: coupon || fp ? "pointer" : "default",
                transition: "all 0.15s",
              }}
            >
              {/* Top row: competition + kickoff */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {m.competition}
                </span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: CYAN, fontVariantNumeric: "tabular-nums" }}>
                  {m.kickoffAt}
                </span>
              </div>
              {/* Teams */}
              <p style={{ fontSize: "12px", fontWeight: 700, color: TEXT, lineHeight: 1.3, margin: "0 0 5px" }}>
                {m.homeTeam} — {m.awayTeam}
              </p>
              {/* Labels */}
              {labels.length > 0 && (
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {labels.map((lbl) => (
                    <span
                      key={lbl}
                      style={{
                        fontSize: "8px", fontWeight: 700,
                        color: lbl === "Free Pick" ? SUCCESS : TEXT2,
                        background: lbl === "Free Pick" ? "rgba(18,154,99,0.08)" : "rgba(93,107,122,0.07)",
                        padding: "2px 6px", borderRadius: "3px",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                      }}
                    >
                      {lbl}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Coupon Card (receipt-style) ───────────────────────────────── */
function CouponCard({
  coupon,
  index,
  onLightbox,
  highlighted,
  couponRef,
  prematch = false,
}: {
  coupon: TodayCoupon;
  index: number;
  onLightbox: (c: TodayCoupon) => void;
  highlighted: boolean;
  couponRef: (el: HTMLDivElement | null) => void;
  prematch?: boolean;
}) {
  const potentialReturn = coupon.stake * coupon.totalOdds;
  const potentialProfit = potentialReturn - coupon.stake;
  const isSettled = !prematch && coupon.status === "SETTLED";

  const { data: imgData, isLoading: imgLoading } = useQuery<{ preMatchImage: string | null; settledImage: string | null }>({
    queryKey: [`/api/today/coupons/${coupon.id}/image`],
    queryFn: () => fetch(`/api/today/coupons/${coupon.id}/image`).then((r) => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const inlineImg = prematch
    ? (imgData?.preMatchImage ?? null)
    : (imgData?.settledImage ?? imgData?.preMatchImage ?? null);

  return (
    <div
      ref={couponRef}
      data-testid={`coupon-card-${coupon.id}`}
      style={{
        background: "#fff",
        border: highlighted ? `1.5px solid ${CYAN}` : `1px solid ${BORDER}`,
        borderRadius: "8px", overflow: "hidden",
        boxShadow: highlighted
          ? `0 0 0 3px rgba(232,119,31,0.12), 0 2px 8px rgba(14,23,38,0.07)`
          : "0 1px 4px rgba(14,23,38,0.05)",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* ── Receipt header ── */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${BORDER}` }}>
        {/* Row 1: label + badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 800, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Stake {index + 1}
            </span>
            {coupon.stake > 0 && (
              <div style={{ marginTop: "3px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", color: TEXT2 }}>{coupon.matchCount} Matches</span>
                <span style={{ fontSize: "10px", color: BORDER }}>·</span>
                <span style={{ fontSize: "10px", color: TEXT2 }}>Odds {truncOdds(coupon.totalOdds)}</span>
                <span style={{ fontSize: "10px", color: BORDER }}>·</span>
                <span style={{ fontSize: "10px", color: TEXT2 }}>€{fmt(coupon.stake)} Stake</span>
              </div>
            )}
          </div>
          {!prematch && <CouponBadge coupon={coupon} />}
        </div>

      </div>

      {/* ── Coupon image — inline, auto-loaded ── */}
      <div
        onClick={() => onLightbox(coupon)}
        role="button" tabIndex={0}
        aria-label={`View ${coupon.label} coupon image`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onLightbox(coupon); }}
        style={{ cursor: "zoom-in", background: SOFT, borderTop: `1px solid ${BORDER}` }}
        data-testid={`coupon-image-${coupon.id}`}
      >
        {imgLoading ? (
          <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "120px" }}>
            <p style={{ fontSize: "12px", color: TEXT2, margin: 0 }}>Loading image…</p>
          </div>
        ) : inlineImg ? (
          <img
            src={inlineImg}
            alt={`${coupon.label} coupon image`}
            style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
          />
        ) : (
          <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "120px" }}>
            <div style={{ width: "36px", height: "36px", border: `1px solid ${BORDER}`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", fontSize: "18px", background: "#fff" }}>
              🎫
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: TEXT2, margin: 0 }}>Image not yet added</p>
          </div>
        )}
      </div>

      {/* ── Member-only selections area ── */}
      <div style={{ position: "relative", borderTop: `1px solid ${BORDER}` }}>
        {/* Blurred content hint */}
        <div style={{ padding: "12px 16px", filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}>
          {[1, 2, 3].map((j) => (
            <div key={j} style={{ display: "flex", justifyContent: "space-between", marginBottom: j < 3 ? "8px" : 0 }}>
              <div style={{ height: "10px", background: SOFT, borderRadius: "4px", width: `${55 + j * 10}%` }} />
              <div style={{ height: "10px", background: SOFT, borderRadius: "4px", width: "15%" }} />
            </div>
          ))}
        </div>
        {/* Frosted overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(252,252,251,0.88)",
          backdropFilter: "blur(2px)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        }}>
          <Lock size={12} style={{ color: TEXT2, flexShrink: 0 }} />
          <span style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Members Only
          </span>
        </div>
      </div>

      {/* ── Financial summary ── */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORDER}`, background: SOFT }}>
        {[
          { label: "Total Odds",       value: truncOdds(coupon.totalOdds),   color: TEXT,    bold: false },
          { label: "Stake",            value: `€${fmt(coupon.stake)}`,        color: TEXT,    bold: false },
          { label: "Potential Return", value: `€${fmt(potentialReturn)}`,     color: TEXT,    bold: false },
          ...(isSettled && coupon.returnAmount != null ? [
            { label: "Actual Return",  value: `€${fmt(coupon.returnAmount)}`, color: coupon.result === "WON" ? SUCCESS : DANGER, bold: true },
            { label: "Net Result",     value: `${coupon.result === "WON" ? "+" : "−"}€${fmt(Math.abs((coupon.returnAmount ?? 0) - coupon.stake))}`, color: coupon.result === "WON" ? SUCCESS : DANGER, bold: true },
          ] : [
            { label: "Potential Profit", value: `+€${fmt(potentialProfit)}`,  color: SUCCESS, bold: true },
          ]),
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: row.bold ? "6px 0 0" : "3px 0",
              borderTop: row.bold ? `1px solid ${BORDER}` : "none",
              marginTop: row.bold ? "6px" : 0,
            }}
          >
            <span style={{ fontSize: "10px", color: TEXT2 }}>{row.label}</span>
            <span style={{
              fontSize: row.bold ? "13px" : "11px",
              fontWeight: row.bold ? 800 : 600,
              color: row.color,
              fontVariantNumeric: "tabular-nums",
              fontFamily: row.bold ? "'Manrope', sans-serif" : undefined,
            }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Action ── */}
      <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORDER}` }}>
        <button
          onClick={() => onLightbox(coupon)}
          data-testid={`button-view-coupon-${coupon.id}`}
          style={{
            width: "100%", padding: "7px 12px",
            fontSize: "11px", fontWeight: 700,
            color: TEXT, background: SOFT,
            border: `1px solid ${BORDER}`,
            borderRadius: "5px", cursor: "pointer",
            letterSpacing: "0.04em",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#E9EDF0"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = SOFT; }}
        >
          COUPON IMAGE
        </button>
      </div>
    </div>
  );
}

/* ── Coupon Stage (center) ─────────────────────────────────────── */
function CouponStage({
  coupons,
  onLightbox,
  activeCouponId,
  onCouponSwitch,
  couponRefs,
  prematch = false,
}: {
  coupons: TodayCoupon[];
  onLightbox: (c: TodayCoupon) => void;
  activeCouponId: number | null;
  onCouponSwitch: (id: number) => void;
  couponRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
  prematch?: boolean;
}) {
  const activeCoupon = coupons.find((c) => c.id === activeCouponId) ?? coupons[0];

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px", overflow: "hidden" }}>
      {/* Header: label + stake tabs */}
      <div style={{ padding: "14px 16px 0", borderBottom: `1px solid ${BORDER}` }}>
        <SectionLabel title="Published Coupons" count={coupons.length > 0 ? `${coupons.length} coupon${coupons.length !== 1 ? "s" : ""}` : "0 coupons"} />
        {coupons.length > 1 && (
          <div style={{ display: "flex", gap: "4px", paddingBottom: "12px" }}>
            {coupons.map((c, i) => {
              const isActive = activeCoupon?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onCouponSwitch(c.id)}
                  data-testid={`coupon-tab-${c.id}`}
                  style={{
                    padding: "5px 14px",
                    fontSize: "10px", fontWeight: 700,
                    color: isActive ? CYAN : TEXT2,
                    background: isActive ? "rgba(232,119,31,0.09)" : "transparent",
                    border: `1px solid ${isActive ? "rgba(232,119,31,0.3)" : BORDER}`,
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "all 0.12s",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}
                >
                  Stake {i + 1}
                </button>
              );
            })}
          </div>
        )}
        {coupons.length === 0 && <div style={{ paddingBottom: "12px" }} />}
      </div>

      {/* Active coupon or empty state */}
      {coupons.length === 0 ? (
        <div style={{ padding: "52px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: TEXT2, margin: 0 }}>No coupons published for today.</p>
        </div>
      ) : activeCoupon ? (
        <CouponCard
          key={activeCoupon.id}
          coupon={activeCoupon}
          index={coupons.indexOf(activeCoupon)}
          onLightbox={onLightbox}
          highlighted={false}
          prematch={prematch}
          couponRef={(el) => {
            if (el) couponRefs.current.set(activeCoupon.id, el);
            else couponRefs.current.delete(activeCoupon.id);
          }}
        />
      ) : null}
    </div>
  );
}

/* ── Daily Balance Panel (right) ───────────────────────────────── */
function DailyBalancePanel({
  coupons,
  onCouponClick,
  prematch = false,
}: {
  coupons: TodayCoupon[];
  onCouponClick: (id: number) => void;
  prematch?: boolean;
}) {
  const totalStake          = coupons.reduce((s, c) => s + c.stake, 0);
  const totalPotentialReturn = coupons.reduce((s, c) => s + c.stake * c.totalOdds, 0);
  const potentialProfit     = totalPotentialReturn - totalStake;

  const hasSettled = !prematch && coupons.some((c) => c.status === "SETTLED");
  const totalActualReturn = coupons.filter((c) => c.result === "WON").reduce((s, c) => s + (c.returnAmount ?? c.stake * c.totalOdds), 0);
  const netProfit = totalActualReturn - totalStake;

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${BORDER}` }}>
        <SectionLabel title="Today's Balance" />
      </div>

      {/* Section A: Daily Totals */}
      {!coupons.length ? (
        <p style={{ fontSize: "12px", color: TEXT2, textAlign: "center", padding: "24px 0", margin: 0 }}>No data yet.</p>
      ) : (
        <div style={{ padding: "0 16px 14px" }}>
          {hasSettled ? (
            <>
              <div style={{ textAlign: "center", padding: "16px 0 12px" }}>
                <p style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 8px" }}>Net Result</p>
                <p style={{ fontSize: "36px", fontWeight: 900, color: netProfit >= 0 ? SUCCESS : DANGER, fontVariantNumeric: "tabular-nums", fontFamily: "'Manrope', sans-serif", margin: 0, lineHeight: 1 }}>
                  {netProfit >= 0 ? "+" : "−"}€{fmt(Math.abs(netProfit))}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Total Stake",   value: `€${fmt(totalStake)}`,        color: TEXT    },
                  { label: "Total Return",  value: `€${fmt(totalActualReturn)}`, color: TEXT    },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "11px", color: TEXT2 }}>{row.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: row.color, fontVariantNumeric: "tabular-nums" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              {[
                { label: "Total Stake",        value: `€${fmt(totalStake)}`,           color: TEXT    },
                { label: "Potential Return",    value: `€${fmt(totalPotentialReturn)}`, color: TEXT    },
                { label: "Potential Profit",    value: `+€${fmt(potentialProfit)}`,     color: SUCCESS },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "11px", color: TEXT2 }}>{row.label}</span>
                  <span style={{
                    fontSize: row.label === "Potential Profit" ? "15px" : "13px",
                    fontWeight: row.label === "Potential Profit" ? 800 : 700,
                    color: row.color,
                    fontVariantNumeric: "tabular-nums",
                    fontFamily: row.label === "Potential Profit" ? "'Manrope', sans-serif" : undefined,
                  }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section B: Breakdown */}
      {coupons.length > 0 && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 16px" }}>
          <p style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 10px" }}>Breakdown</p>
          {coupons.map((c, i) => (
            <div key={c.id} style={{ marginBottom: i < coupons.length - 1 ? "8px" : 0, paddingBottom: i < coupons.length - 1 ? "8px" : 0, borderBottom: i < coupons.length - 1 ? `1px solid ${SOFT}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                <button
                  onClick={() => onCouponClick(c.id)}
                  style={{ fontSize: "11px", fontWeight: 700, color: CYAN, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: "2px" }}
                  data-testid={`link-balance-coupon-${c.id}`}
                >
                  Stake {i + 1}
                </button>
                {!prematch && <CouponBadge coupon={c} />}
              </div>
              <p style={{ fontSize: "10px", color: TEXT2, margin: 0, fontVariantNumeric: "tabular-nums" }}>
                €{fmt(c.stake)} × {truncOdds(c.totalOdds)} = €{fmt(c.stake * c.totalOdds)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: "8px 16px 10px", borderTop: `1px solid ${BORDER}` }}>
        <p style={{ fontSize: "9px", color: TEXT2, lineHeight: 1.5, fontStyle: "italic", margin: 0, opacity: 0.7 }}>
          Potential values are mathematical calculations and do not guarantee outcomes.
        </p>
      </div>
    </div>
  );
}

/* ── Result view components (preserved) ───────────────────────── */
function ResultMatchBadge({ result }: { result: string | null }) {
  if (result === "won")       return <Badge color={SUCCESS}   bg="rgba(18,154,99,0.1)">Won</Badge>;
  if (result === "lost")      return <Badge color={DANGER}    bg="rgba(217,90,104,0.1)">Lost</Badge>;
  if (result === "void")      return <Badge color={TEXT2}     bg="rgba(93,107,122,0.1)">Void</Badge>;
  if (result === "postponed") return <Badge color={POSTPONED} bg="rgba(212,130,10,0.1)">Postponed</Badge>;
  return <Badge color={TEXT2} bg="rgba(93,107,122,0.07)">Pending</Badge>;
}

function ResultMatchesColumn({ matches }: { matches: TodayMatch[] }) {
  if (!matches.length) {
    return (
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "16px" }}>
        <SectionLabel title="Match Results" count="0 matches" />
        <p style={{ fontSize: "13px", color: TEXT2, textAlign: "center", padding: "24px 0", margin: 0 }}>No matches entered.</p>
      </div>
    );
  }
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "16px" }}>
      <SectionLabel title="Match Results" count={`${matches.length} matches`} />
      <div>
        {matches.map((m, i) => (
          <div key={m.id} data-testid={`result-match-${m.id}`} style={{ paddingTop: i > 0 ? "11px" : 0, paddingBottom: i < matches.length - 1 ? "11px" : 0, borderBottom: i < matches.length - 1 ? `1px solid ${BORDER}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.competition}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: CYAN, fontVariantNumeric: "tabular-nums" }}>{m.kickoffAt}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: TEXT, lineHeight: 1.3, margin: 0 }}>{m.homeTeam} — {m.awayTeam}</p>
              <ResultMatchBadge result={m.result} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultCouponRow({ coupon, onLightbox }: { coupon: TodayCoupon; onLightbox: (c: TodayCoupon) => void }) {
  const { data: imgData, isLoading } = useQuery<{ preMatchImage: string | null; settledImage: string | null }>({
    queryKey: [`/api/today/coupons/${coupon.id}/image`],
    queryFn: () => fetch(`/api/today/coupons/${coupon.id}/image`).then((r) => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const img = imgData?.settledImage ?? imgData?.preMatchImage ?? null;

  return (
    <div
      style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 4px rgba(14,23,38,0.05)" }}
      data-testid={`result-coupon-${coupon.id}`}
    >
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, gap: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: TEXT }}>{coupon.label}</span>
        <CouponBadge coupon={coupon} />
      </div>
      <div
        onClick={() => onLightbox(coupon)}
        role="button" tabIndex={0}
        aria-label={`View ${coupon.label} coupon image`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onLightbox(coupon); }}
        style={{ cursor: "zoom-in", background: SOFT }}
        data-testid={`result-coupon-image-${coupon.id}`}
      >
        {isLoading ? (
          <div style={{ padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100px" }}>
            <p style={{ fontSize: "12px", color: TEXT2, margin: 0 }}>Loading image…</p>
          </div>
        ) : img ? (
          <img
            src={img}
            alt={`${coupon.label} coupon image`}
            style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
          />
        ) : (
          <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100px" }}>
            <div style={{ width: "36px", height: "36px", border: `1px solid ${BORDER}`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", fontSize: "18px", background: "#fff" }}>
              🎫
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: TEXT2, margin: 0 }}>Image not yet added</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCouponsColumn({ coupons, onLightbox }: { coupons: TodayCoupon[]; onLightbox: (c: TodayCoupon) => void }) {
  if (!coupons.length) {
    return (
      <div>
        <SectionLabel title="Settled Coupons" count="0 coupons" />
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "48px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: TEXT2, margin: "0 0 6px" }}>No settled coupon images yet.</p>
          <p style={{ fontSize: "11px", color: TEXT2, opacity: 0.6, margin: 0 }}>They will appear here as coupons settle.</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <SectionLabel title="Settled Coupons" count={`${coupons.length} coupon${coupons.length !== 1 ? "s" : ""}`} />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {coupons.map((c) => (
          <ResultCouponRow key={c.id} coupon={c} onLightbox={onLightbox} />
        ))}
      </div>
    </div>
  );
}

function ResultBalanceColumn({ coupons }: { coupons: TodayCoupon[] }) {
  const settled    = coupons.filter((c) => c.status === "SETTLED");
  const hasSettled = settled.length > 0;

  const totalStake  = coupons.reduce((s, c) => s + c.stake, 0);
  /* Sum returnAmount for ALL settled coupons — covers WON and VOID/refund */
  const totalReturn = settled.reduce((s, c) => s + (c.returnAmount ?? 0), 0);
  const netProfit   = totalReturn - totalStake;
  const roi         = totalStake > 0 ? (netProfit / totalStake) * 100 : 0;

  const wonCount    = settled.filter((c) => c.result === "WON").length;
  const lostCount   = settled.filter((c) => c.result === "LOST").length;
  const voidCount   = settled.filter((c) => c.result === "VOID").length;

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px 0", borderBottom: `1px solid ${BORDER}`, paddingBottom: "12px" }}>
        <SectionLabel title="Daily Balance" />
      </div>

      {!hasSettled ? (
        <div style={{ textAlign: "center", padding: "24px 16px" }}>
          <p style={{ fontSize: "13px", color: TEXT2, margin: 0 }}>
            {coupons.length === 0 ? "No coupons entered for today." : "Awaiting coupon results…"}
          </p>
        </div>
      ) : (
        <>
          {/* Hero: Net Result + ROI */}
          <div style={{ padding: "16px 16px 14px", textAlign: "center" }}>
            <p style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 8px" }}>
              Net Result
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              <p style={{
                fontSize: "36px", fontWeight: 900,
                color: netProfit >= 0 ? SUCCESS : DANGER,
                fontVariantNumeric: "tabular-nums",
                fontFamily: "'Manrope', sans-serif",
                margin: 0, lineHeight: 1,
              }}>
                {netProfit >= 0 ? "+" : "−"}€{fmt(Math.abs(netProfit))}
              </p>
              <span style={{
                fontSize: "12px", fontWeight: 800,
                color: roi >= 0 ? SUCCESS : DANGER,
                background: roi >= 0 ? "rgba(18,154,99,0.1)" : "rgba(217,90,104,0.1)",
                padding: "3px 8px", borderRadius: "5px",
                fontVariantNumeric: "tabular-nums",
                marginBottom: "5px",
              }}>
                {roi >= 0 ? "+" : "−"}{Math.abs(roi).toFixed(0)}% ROI
              </span>
            </div>
          </div>

          {/* Summary rows */}
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Total Stake",  value: `€${fmt(totalStake)}`,  color: TEXT },
              { label: "Total Return", value: `€${fmt(totalReturn)}`, color: TEXT },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "11px", color: TEXT2 }}>{row.label}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: row.color, fontVariantNumeric: "tabular-nums" }}>{row.value}</span>
              </div>
            ))}

            {/* WON / LOST / VOID counts */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "6px", borderTop: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: "11px", color: TEXT2 }}>Coupon Results</span>
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {wonCount  > 0 && <Badge color={SUCCESS} bg="rgba(18,154,99,0.1)">{wonCount} WON</Badge>}
                {lostCount > 0 && <Badge color={DANGER}  bg="rgba(217,90,104,0.1)">{lostCount} LOST</Badge>}
                {voidCount > 0 && <Badge color={TEXT2}   bg="rgba(93,107,122,0.1)">{voidCount} VOID</Badge>}
              </div>
            </div>
          </div>

          {/* Per-coupon breakdown */}
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 16px" }}>
            <p style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 10px" }}>
              Coupon Breakdown
            </p>
            {settled.map((c, i) => {
              const ret    = c.returnAmount ?? 0;
              const profit = ret - c.stake;
              const isWon  = c.result === "WON";
              const isVoid = c.result === "VOID";

              return (
                <div
                  key={c.id}
                  style={{
                    paddingBottom: i < settled.length - 1 ? "10px" : 0,
                    marginBottom:  i < settled.length - 1 ? "10px" : 0,
                    borderBottom:  i < settled.length - 1 ? `1px solid ${BORDER}` : "none",
                  }}
                >
                  {/* Row 1: label + badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: TEXT }}>
                      {c.label || `Stake ${i + 1}`}
                    </span>
                    <CouponBadge coupon={c} />
                  </div>
                  {/* Row 2: stake + profit/return */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "10px", color: TEXT2 }}>
                      €{fmt(c.stake)} stake · {c.matchCount} match{c.matchCount !== 1 ? "es" : ""}
                    </span>
                    <span style={{
                      fontSize: "11px", fontWeight: 700, fontVariantNumeric: "tabular-nums",
                      color: isVoid ? TEXT2 : isWon ? SUCCESS : DANGER,
                    }}>
                      {isVoid
                        ? `€${fmt(ret)} refund`
                        : isWon
                          ? `+€${fmt(profit)}`
                          : `−€${fmt(c.stake)}`
                      }
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Public pick strip (center column, plan view) ──────────────── */
function PublicPickStrip({ pick }: { pick: TodayPublicPick }) {
  return (
    <div style={{ background: "rgba(232,119,31,0.04)", border: `1px solid rgba(232,119,31,0.18)`, borderRadius: "8px", padding: "16px 20px", marginTop: "24px" }} data-testid="public-pick-strip">
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ flex: 1, minWidth: "180px" }}>
          <span style={{ fontSize: "9px", fontWeight: 800, color: CYAN, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "5px" }}>
            Public · Free Pick of the Day
          </span>
          <p style={{ fontSize: "14px", fontWeight: 700, color: TEXT, margin: "0 0 2px", lineHeight: 1.35 }}>
            {pick.homeTeam} — {pick.awayTeam}
          </p>
          <p style={{ fontSize: "11px", color: TEXT2, margin: 0 }}>{pick.market}</p>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "8px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "2px" }}>Selection</p>
            <p style={{ fontSize: "13px", fontWeight: 700, color: TEXT, margin: 0 }}>{pick.selection}</p>
          </div>
          <div>
            <p style={{ fontSize: "8px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "2px" }}>Odds</p>
            <p style={{ fontSize: "22px", fontWeight: 800, color: CYAN, fontVariantNumeric: "tabular-nums", fontFamily: "'Manrope', sans-serif", margin: 0 }}>
              {truncOdds(pick.odds)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "8px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "2px" }}>Kickoff</p>
            <p style={{ fontSize: "13px", fontWeight: 700, color: TEXT, margin: 0 }}>{pick.kickoffAt}</p>
          </div>
          <PickBadge pick={pick} />
        </div>
      </div>
      <p style={{ fontSize: "9px", color: TEXT2, margin: "10px 0 0", opacity: 0.7 }}>Visible before kickoff · Public, no membership required</p>
    </div>
  );
}

/* ── Membership Section ────────────────────────────────────────── */
function MemberPubCard({ pub, couponIndex }: { pub: MembershipPublicationWithLegs; couponIndex: number }) {
  const [open, setOpen] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);
  const isSelect    = pub.tier === "select";
  const isSettled   = pub.status === "SETTLED";

  const { data: imgData } = useQuery<{ preMatchImage: string | null; settledImage: string | null }>({
    queryKey: [`/api/membership/publications/${pub.id}/image`],
    queryFn: () => fetch(`/api/membership/publications/${pub.id}/image`).then(r => r.ok ? r.json() : { preMatchImage: null, settledImage: null }),
    enabled: true,
    staleTime: 10 * 60 * 1000,
  });
  const pubImg = imgData?.settledImage ?? imgData?.preMatchImage ?? null;

  const tierColor  = isSelect ? CYAN    : "#7C3AED";
  const tierBg     = isSelect ? "rgba(232,119,31,0.06)"  : "rgba(139,92,246,0.06)";
  const tierBorder = isSelect ? "rgba(232,119,31,0.22)" : "rgba(139,92,246,0.22)";

  const resultColor = pub.result === "WON" ? SUCCESS : pub.result === "LOST" ? DANGER : TEXT2;

  const computedOdds = pub.legs.length > 0
    ? pub.legs.reduce((a, l) => a * l.odds, 1)
    : pub.totalOdds ?? null;

  return (
    <div
      data-testid={`member-pub-${pub.id}`}
      style={{
        background: "#fff", border: `1px solid ${BORDER}`,
        borderLeft: `3px solid ${tierColor}`,
        borderRadius: "8px", overflow: "hidden",
        boxShadow: "0 1px 4px rgba(14,23,38,0.04)",
        marginBottom: "12px",
      }}
    >
      <div
        style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
            {isSettled && pub.result && (
              <span style={{
                fontSize: "8px", fontWeight: 800, color: resultColor,
                background: pub.result === "WON" ? "rgba(18,154,99,0.08)" : pub.result === "LOST" ? "rgba(217,90,104,0.08)" : "rgba(93,107,122,0.07)",
                padding: "2px 7px", borderRadius: "3px", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>{pub.result}</span>
            )}
            {!isSettled && (
              <span style={{ fontSize: "8px", fontWeight: 700, color: CYAN, background: "rgba(232,119,31,0.08)", padding: "2px 7px", borderRadius: "3px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                PRE-MATCH
              </span>
            )}
          </div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: TEXT, margin: 0, lineHeight: 1.35 }}>{pub.title}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "4px", flexWrap: "wrap" }}>
            {pub.stake && (
              <span style={{ fontSize: "10px", color: TEXT2 }}>€{pub.stake} stake</span>
            )}
            {computedOdds && (
              <span style={{ fontSize: "10px", color: TEXT2, fontVariantNumeric: "tabular-nums" }}>
                @{computedOdds.toFixed(2)} oran
              </span>
            )}
            {pub.legs.length > 0 && (
              <span style={{ fontSize: "10px", color: TEXT2 }}>{pub.legs.length} picks</span>
            )}
          </div>
        </div>
        <div style={{ flexShrink: 0, paddingTop: "2px", color: TEXT2 }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          {pub.analysis && (
            <div style={{ padding: "10px 14px", background: tierBg, borderBottom: `1px solid ${tierBorder}` }}>
              <p style={{ fontSize: "11px", color: TEXT, margin: 0, lineHeight: 1.6 }}>{pub.analysis}</p>
            </div>
          )}
          {pubImg && (
            <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "16px 14px 14px" }}>
              {/* Metadata row */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: tierColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {isSelect ? "Capitale Select" : "Capitale Unlimited"}
                </span>
                <span style={{ fontSize: "10px", color: TEXT2 }}>·</span>
                <span style={{ fontSize: "10px", fontWeight: 700, color: TEXT }}>{pub.title || `Coupon ${couponIndex + 1}`}</span>
                {pub.publishedAt && (
                  <>
                    <span style={{ fontSize: "10px", color: TEXT2 }}>·</span>
                    <span style={{ fontSize: "10px", color: TEXT2 }}>
                      {new Date(pub.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                      {" "}
                      {new Date(pub.publishedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </>
                )}
                {pub.legs.length > 0 && (
                  <>
                    <span style={{ fontSize: "10px", color: TEXT2 }}>·</span>
                    <span style={{ fontSize: "10px", color: TEXT2 }}>{pub.legs.length} matches</span>
                  </>
                )}
              </div>
              {/* Image frame */}
              <div style={{
                maxWidth: "476px", margin: "0 auto", background: "#fff",
                border: `1px solid ${BORDER}`, borderRadius: "12px",
                boxShadow: "0 1px 6px rgba(14,23,38,0.05)", overflow: "hidden",
                position: "relative",
              }}>
                {!imgLoaded && !imgError && (
                  <div style={{ width: "100%", minHeight: "200px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "11px", color: TEXT2 }}>Loading…</span>
                  </div>
                )}
                {imgError && (
                  <div style={{ width: "100%", minHeight: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "12px", color: TEXT2 }}>Coupon image could not be loaded.</span>
                  </div>
                )}
                <img
                  src={pubImg}
                  alt={`${isSelect ? "Capitale Select" : "Capitale Unlimited"} Coupon ${couponIndex + 1} image`}
                  data-testid={`member-pub-image-${pub.id}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => { setImgError(true); setImgLoaded(true); }}
                  style={{
                    width: "100%", height: "auto", display: imgError ? "none" : "block",
                    objectFit: "contain", verticalAlign: "bottom",
                  }}
                />
              </div>
            </div>
          )}
          {pub.legs.map((leg, i) => {
            const legResultColor = leg.result === "won" ? SUCCESS : leg.result === "lost" ? DANGER : TEXT2;
            return (
              <div key={leg.id} style={{ padding: "10px 14px", borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: TEXT, margin: "0 0 2px", lineHeight: 1.3, overflowWrap: "break-word", wordBreak: "break-word" }}>
                      {leg.homeTeam} — {leg.awayTeam}
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", rowGap: "2px" }}>
                      {leg.competition && <span style={{ fontSize: "10px", color: TEXT2 }}>{leg.competition}</span>}
                      {leg.kickoffAt  && <span style={{ fontSize: "10px", color: CYAN, fontWeight: 700 }}>{leg.kickoffAt}</span>}
                      <span style={{ fontSize: "10px", color: TEXT2 }}>{leg.market}: <strong style={{ color: TEXT }}>{leg.selection}</strong></span>
                      <span style={{ fontSize: "10px", color: TEXT2, fontVariantNumeric: "tabular-nums" }}>@{leg.odds.toFixed(2)}</span>
                    </div>
                  </div>
                  {leg.result && (
                    <span style={{
                      fontSize: "8px", fontWeight: 800, flexShrink: 0, color: legResultColor,
                      background: leg.result === "won" ? "rgba(18,154,99,0.08)" : leg.result === "lost" ? "rgba(217,90,104,0.08)" : "rgba(93,107,122,0.07)",
                      padding: "3px 7px", borderRadius: "3px", textTransform: "uppercase", letterSpacing: "0.07em",
                    }}>{leg.result}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MembershipSection({
  tier,
  publications,
  isLoading,
  date,
}: {
  tier: string | null | undefined;
  publications: MembershipPublicationWithLegs[];
  isLoading: boolean;
  date: string;
}) {
  const [activeGroup, setActiveGroup] = useState<"select" | "unlimited">("select");
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => { setSelectedIdx(0); }, [activeGroup]);

  const { data: summaryData } = useQuery<{ totalCoupons: number; totalMatches: number }>({
    queryKey: ["/api/membership-summary", date, activeGroup],
    queryFn: () => fetch(`/api/membership-summary?date=${date}&tier=${activeGroup}`).then(r => r.json()),
    staleTime: 60 * 1000,
    enabled: !!tier,
  });

  // Non-members: show access denied message
  if (!tier) {
    return (
      <div style={{
        background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "10px",
        padding: "32px 16px", textAlign: "center", maxWidth: "520px", margin: "0 auto",
        width: "100%", boxSizing: "border-box",
      }}>
        <div style={{ marginBottom: "12px", fontSize: "32px", lineHeight: 1 }}>🔒</div>
        <p style={{ fontSize: "15px", fontWeight: 800, color: TEXT, marginBottom: "8px", fontFamily: "'Manrope', sans-serif" }}>
          This section is exclusive to Capitale members
        </p>
        <p style={{ fontSize: "12px", color: TEXT2, marginBottom: "20px", lineHeight: 1.6, maxWidth: "340px", margin: "0 auto 20px" }}>
          With a Capitale Select or Capitale Unlimited membership you can access daily analysis and coupon publications.
        </p>
        <a
          href="/plans"
          style={{
            display: "inline-block", background: "#7C3AED", color: "#fff",
            fontWeight: 700, fontSize: "13px", padding: "10px 22px",
            borderRadius: "6px", textDecoration: "none",
          }}
        >
          Membership Plans →
        </a>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: TEXT2, margin: 0 }}>Loading membership…</p>
      </div>
    );
  }

  const selectPubs      = publications.filter(p => p.tier === "select");
  const unlimitedPubs   = publications.filter(p => p.tier === "unlimited");
  const canSeeUnlimited = tier === "unlimited";
  const visiblePubs     = activeGroup === "select" ? selectPubs : unlimitedPubs;
  const safeIdx         = Math.min(selectedIdx, Math.max(visiblePubs.length - 1, 0));
  const accent          = activeGroup === "unlimited" ? "#7C3AED" : CYAN;

  return (
    <div>
      {/* Sub-tabs: Select always shown; Unlimited only if tier=unlimited */}
      <div className="scrollbar-hide" style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, marginBottom: "14px", overflowX: "auto", WebkitOverflowScrolling: "touch" as any }}>
        <button
          data-testid="member-tab-select"
          onClick={() => setActiveGroup("select")}
          style={{
            display: "flex", alignItems: "center", gap: "4px",
            padding: "8px 14px", fontSize: "11px", fontWeight: 700,
            color: activeGroup === "select" ? CYAN : TEXT2,
            background: "transparent", border: "none", cursor: "pointer",
            borderBottom: activeGroup === "select" ? `2px solid ${CYAN}` : "2px solid transparent",
            marginBottom: "-1px", transition: "color 0.12s", whiteSpace: "nowrap",
          }}
        >
          <Star size={11} /> Capitale Select
        </button>
        {canSeeUnlimited && (
          <button
            data-testid="member-tab-unlimited"
            onClick={() => setActiveGroup("unlimited")}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "8px 14px", fontSize: "11px", fontWeight: 700,
              color: activeGroup === "unlimited" ? "#7C3AED" : TEXT2,
              background: "transparent", border: "none", cursor: "pointer",
              borderBottom: activeGroup === "unlimited" ? "2px solid #7C3AED" : "2px solid transparent",
              marginBottom: "-1px", transition: "color 0.12s", whiteSpace: "nowrap",
            }}
          >
            <Crown size={11} /> Capitale Unlimited
          </button>
        )}
      </div>

      {/* Summary: Toplam Kupon + Toplam Maç */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px", marginBottom: "14px" }}>
        {[
          { label: "Total Coupons", value: summaryData != null ? String(summaryData.totalCoupons) : "—" },
          { label: "Total Matches",   value: summaryData != null ? String(summaryData.totalMatches)  : "—" },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px",
            padding: "12px 14px",
          }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{label}</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: accent, fontVariantNumeric: "tabular-nums" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Coupon selector */}
      {visiblePubs.length > 0 && (
        <div
          role="tablist"
          aria-label="Coupon selector"
          className="scrollbar-hidden"
          style={{ display: "flex", gap: "8px", overflowX: "auto", WebkitOverflowScrolling: "touch" as any, marginBottom: "14px", paddingBottom: "2px" }}
        >
          {visiblePubs.map((p, i) => {
            const isActive = i === safeIdx;
            return (
              <button
                key={i}
                role="tab"
                aria-selected={isActive}
                aria-controls={`coupon-panel-${i}`}
                data-testid={`coupon-btn-${i}`}
                onClick={() => setSelectedIdx(i)}
                style={{
                  flexShrink: 0, padding: "8px 18px", fontSize: "12px", fontWeight: 700,
                  borderRadius: "6px", border: `1px solid ${isActive ? accent : BORDER}`,
                  background: isActive ? (activeGroup === "unlimited" ? "rgba(124,58,237,0.1)" : "rgba(232,119,31,0.1)") : "#fff",
                  color: isActive ? accent : TEXT2,
                  cursor: "pointer", transition: "all 0.12s",
                  minHeight: "44px",
                  outline: "none",
                  whiteSpace: "nowrap",
                }}
                onFocus={e => { if (!isActive) (e.target as HTMLElement).style.boxShadow = `0 0 0 2px ${accent}40`; }}
                onBlur={e => { (e.target as HTMLElement).style.boxShadow = "none"; }}
              >
                {p.title || `Coupon ${i + 1}`}
              </button>
            );
          })}
        </div>
      )}

      {/* Coupon content */}
      {visiblePubs.length === 0 ? (
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "24px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: TEXT2, margin: 0 }}>No coupons have been published for this membership tier yet.</p>
        </div>
      ) : (
        <div role="tabpanel" id={`coupon-panel-${safeIdx}`}>
          <MemberPubCard key={visiblePubs[safeIdx].id} pub={visiblePubs[safeIdx]} couponIndex={safeIdx} />
        </div>
      )}
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
type ViewKey = "plan" | "results" | "members";
type TabKey = "coupons" | "matches" | "balance";

export default function Today() {
  const isDesktop = useIsDesktop();
  const [, navigate] = useLocation();
  const date = useIstanbulToday();

  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (typeof window !== "undefined") {
      const t = new URLSearchParams(window.location.search).get("tab");
      if (t === "matches" || t === "balance") return t as TabKey;
    }
    return "coupons";
  });

  const [view, setView] = useState<ViewKey>(() => {
    if (typeof window !== "undefined") {
      const v = new URLSearchParams(window.location.search).get("view");
      if (v === "results" || v === "members") return v as ViewKey;
    }
    return "plan";
  });

  const [lightboxCoupon, setLightboxCoupon]   = useState<TodayCoupon | null>(null);
  const [highlightedCouponId, setHighlightId] = useState<number | null>(null);
  const [activeCouponId, setActiveCouponId]   = useState<number | null>(null);
  const couponRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Check today's publish status first ── */
  const { data: publishedData, isLoading: publishedLoading } = useQuery<{ date: string; published: boolean; publishedAt: string | null }>({
    queryKey: ["/api/today/published", date],
    queryFn: () => fetch(`/api/today/published?date=${date}`).then((r) => r.json()),
  });
  const isPublished = publishedData?.published ?? false;
  const publishedAt = publishedData?.publishedAt ?? null;

  /* ── Fallback: if today not published, find latest published date ── */
  const { data: latestDateData, isLoading: latestLoading } = useQuery<{ date: string | null }>({
    queryKey: ["/api/today/latest-published-date"],
    queryFn: () => fetch("/api/today/latest-published-date").then((r) => r.json()),
    enabled: !publishedLoading && !isPublished,
    staleTime: 2 * 60 * 1000,
  });
  const fallbackDate = (!isPublished && latestDateData?.date && latestDateData.date !== date)
    ? latestDateData.date
    : null;
  const activeDate = fallbackDate ?? date;
  const isFallback = fallbackDate !== null;

  const { data: matches = [], isLoading: matchesLoading } = useQuery<TodayMatch[]>({
    queryKey: ["/api/today/matches", activeDate],
    queryFn: () => fetch(`/api/today/matches?date=${activeDate}`).then((r) => r.json()),
    enabled: !publishedLoading && (!latestLoading || isPublished),
  });

  const { data: coupons = [], isLoading: couponsLoading } = useQuery<TodayCoupon[]>({
    queryKey: ["/api/today/coupons", activeDate],
    queryFn: () => fetch(`/api/today/coupons?date=${activeDate}`).then((r) => r.json()),
    enabled: !publishedLoading && (!latestLoading || isPublished),
  });

  const { data: publicPick, isLoading: pickLoading } = useQuery<TodayPublicPick | null>({
    queryKey: ["/api/today/public-pick", activeDate],
    queryFn: () => fetch(`/api/today/public-pick?date=${activeDate}`).then((r) => r.json()),
    enabled: !publishedLoading && (!latestLoading || isPublished),
  });

  /* Fallback's own publishedAt (to show correct time in header) */
  const { data: fallbackPublishedData } = useQuery<{ date: string; published: boolean; publishedAt: string | null }>({
    queryKey: ["/api/today/published", fallbackDate],
    queryFn: () => fetch(`/api/today/published?date=${fallbackDate}`).then((r) => r.json()),
    enabled: isFallback,
  });
  const displayPublishedAt = isFallback ? (fallbackPublishedData?.publishedAt ?? null) : publishedAt;

  /* Membership: user identity + publications (Members only tab is limited to a single allowed account) */
  const { data: meData } = useQuery<{ id: number; email: string; memberTier: string | null } | null>({
    queryKey: ["/api/auth/me"],
    queryFn: () => fetch("/api/auth/me").then(r => r.ok ? r.json() : null),
    staleTime: 60 * 1000,
  });
  const memberTier = meData?.memberTier ?? null;
  const isAllowedMembersViewer = meData?.email === "hazardyk27@gmail.com";

  const { data: memberData, isLoading: memberLoading } = useQuery<{ tier: string; publications: MembershipPublicationWithLegs[] } | null>({
    queryKey: ["/api/membership/publications", activeDate, "members_only"],
    queryFn: () => fetch(`/api/membership/publications?date=${activeDate}&target=members_only`).then(r => r.ok ? r.json() : null),
    enabled: isAllowedMembersViewer,
    staleTime: 2 * 60 * 1000,
  });
  const memberPublications: MembershipPublicationWithLegs[] = memberData?.publications ?? [];

  const isLoading = publishedLoading || latestLoading || matchesLoading || couponsLoading || pickLoading;
  const hasContent = isFallback || isPublished;

  const switchToCoupon = useCallback((couponId: number) => {
    setActiveCouponId(couponId);
    setHighlightId(couponId);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightId(null), 2200);
  }, []);

  const handleMatchClick = useCallback((couponId: number | null) => {
    if (couponId == null) return;
    switchToCoupon(couponId);
  }, [switchToCoupon]);

  const handleSetTab  = useCallback((tab: TabKey)   => { setActiveTab(tab);  navigate(`/today?view=${view}&tab=${tab}`); }, [navigate, view]);
  const handleSetView = useCallback((v: ViewKey)     => { setView(v);         navigate(`/today?view=${v}`); }, [navigate]);

  const tabLabels: Record<TabKey, string> = {
    coupons: "Coupons",
    matches: view === "results" ? "Match Results" : "Matches",
    balance: "Balance",
  };

  /* ── Sticky column wrapper (desktop only) ── */
  const stickyWrap: React.CSSProperties = isDesktop
    ? { position: "sticky", top: "84px" }
    : {};

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <SiteHeader />

      {lightboxCoupon && (
        <Lightbox coupon={lightboxCoupon} onClose={() => setLightboxCoupon(null)} prematch={view === "plan"} />
      )}

      {/* ── Page header ─────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "16px 24px 0" }}>
        <div className="mx-auto" style={{ maxWidth: "1280px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", paddingBottom: "12px" }}>
            <div>
              <h1
                style={{ fontSize: "20px", fontWeight: 900, color: TEXT, lineHeight: 1.1, marginBottom: "3px", fontFamily: "'Manrope', sans-serif" }}
                data-testid="text-today-title"
              >
                Today
              </h1>
              <p style={{ fontSize: "12px", color: TEXT2, textTransform: "capitalize", margin: 0 }}>
                {formatEnglishDate()}
                {displayPublishedAt && (
                  <span style={{ textTransform: "none" }}>
                    {" · "}
                    <span data-testid="text-published-at">Published: {displayPublishedAt}</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* View toggle */}
          <div style={{ display: "flex", flexWrap: "wrap" }} role="tablist" aria-label="View">
            {(["plan", "results"] as ViewKey[]).map((v) => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                onClick={() => handleSetView(v)}
                style={{
                  padding: "10px 16px", fontSize: "12px", fontWeight: 700,
                  color: view === v ? CYAN : TEXT2,
                  background: "transparent", border: "none", cursor: "pointer",
                  borderBottom: view === v ? `2px solid ${CYAN}` : "2px solid transparent",
                  marginBottom: "-1px", transition: "color 0.15s", whiteSpace: "nowrap",
                }}
                data-testid={`view-tab-${v}`}
              >
                {v === "plan" ? "Today's Plan" : "Today's Results"}
              </button>
            ))}
            <button
              role="tab"
              aria-selected={view === "members"}
              onClick={() => handleSetView("members")}
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                padding: "10px 16px", fontSize: "12px", fontWeight: 700,
                color: view === "members" ? "#7C3AED" : TEXT2,
                background: "transparent", border: "none", cursor: "pointer",
                borderBottom: view === "members" ? "2px solid #7C3AED" : "2px solid transparent",
                marginBottom: "-1px", transition: "color 0.15s", whiteSpace: "nowrap",
              }}
              data-testid="view-tab-members"
            >
              <Crown size={11} /> Members only
            </button>
          </div>
        </div>
      </div>

      {/* ── Daily summary strip (only when has content, plan view) ── */}
      {hasContent && view === "plan" && (
        <DailySummaryStrip matches={matches} coupons={coupons} publishedAt={displayPublishedAt} />
      )}

      {/* ── Fallback banner ───────────────────────────────────────── */}
      {isFallback && (
        <div style={{
          background: "rgba(232,119,31,0.08)", borderBottom: `1px solid rgba(232,119,31,0.18)`,
          padding: "8px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        }}>
          <span style={{ fontSize: "13px", color: "#B85A00" }}>
            📅 No content published for today yet —{" "}
            <strong>
              {new Date(fallbackDate + "T12:00:00").toLocaleDateString("en-GB", {
                day: "numeric", month: "long", weekday: "long",
              })}
            </strong>{" "}
            plan is shown
          </span>
        </div>
      )}

      {/* ── Main workspace ───────────────────────────────────────── */}
      <div className="mx-auto" style={{ maxWidth: "1280px", padding: "20px 16px 60px" }}>

        {!hasContent ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "32px", marginBottom: "12px", lineHeight: 1 }}>⏸</p>
            <p style={{ fontSize: "16px", fontWeight: 800, color: TEXT, marginBottom: "8px", fontFamily: "'Manrope', sans-serif" }}>
              Content not yet published
            </p>
            <p style={{ fontSize: "13px", color: TEXT2, maxWidth: "320px", margin: "0 auto", lineHeight: 1.6 }}>
              Today's plan will appear here once it goes live.
            </p>
          </div>
        ) : isLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "10px", color: TEXT2 }}>
            <div style={{ width: "20px", height: "20px", border: `2px solid ${BORDER}`, borderTopColor: CYAN, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            <span style={{ fontSize: "13px" }}>Loading…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>

        ) : view === "members" ? (
          isAllowedMembersViewer ? (
            /* ── MEMBERSHIP VIEW (restricted to a single allowed account) ── */
            <div style={{ maxWidth: "700px", margin: "0 auto", width: "100%" }}>
              <MembershipSection
                tier={memberTier}
                publications={memberPublications}
                isLoading={memberLoading}
                date={activeDate}
              />
            </div>
          ) : (
            /* ── MEMBERSHIP VIEW (disabled for everyone else) ── */
            <div style={{ maxWidth: "700px", margin: "0 auto", width: "100%" }}>
              <div style={{
                background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "10px",
                padding: "48px 16px", textAlign: "center", width: "100%", boxSizing: "border-box",
              }}>
                <div style={{ marginBottom: "12px", fontSize: "32px", lineHeight: 1 }}>⚠️</div>
                <p style={{ fontSize: "15px", fontWeight: 800, color: TEXT, marginBottom: "6px", fontFamily: "'Manrope', sans-serif" }}>
                  This page could not be loaded
                </p>
                <p style={{ fontSize: "12px", color: TEXT2, lineHeight: 1.6, maxWidth: "340px", margin: "0 auto" }}>
                  Please try again later.
                </p>
              </div>
            </div>
          )

        ) : view === "plan" ? (
          isDesktop ? (
            /* ── DESKTOP PLAN: 3-column grid ─────────────────── */
            <div style={{ display: "grid", gridTemplateColumns: "280px minmax(520px, 1fr) 300px", gap: "20px", alignItems: "start" }}>
              {/* Left: sticky */}
              <div style={stickyWrap}>
                <SmartMatchNavigator
                  matches={matches}
                  coupons={coupons}
                  publicPick={publicPick}
                  highlightedCouponId={highlightedCouponId}
                  onMatchClick={handleMatchClick}
                />
                {publicPick && <PublicPickStrip pick={publicPick} />}
              </div>
              {/* Center */}
              <div>
                <CouponStage
                  coupons={coupons}
                  onLightbox={setLightboxCoupon}
                  activeCouponId={activeCouponId ?? (coupons[0]?.id ?? null)}
                  onCouponSwitch={switchToCoupon}
                  couponRefs={couponRefs}
                  prematch={true}
                />
              </div>
              {/* Right: sticky — potential balance only */}
              <div style={stickyWrap}>
                <DailyBalancePanel
                  coupons={coupons}
                  onCouponClick={switchToCoupon}
                  prematch={true}
                />
              </div>
            </div>
          ) : (
            /* ── MOBILE PLAN: tabbed ──────────────────────────── */
            <div>
              <div style={{ display: "flex", borderBottom: `2px solid ${BORDER}`, marginBottom: "20px" }} role="tablist" aria-label="Page sections">
                {(["coupons", "matches", "balance"] as TabKey[]).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => handleSetTab(tab)}
                    style={{
                      flex: 1, padding: "11px 6px", fontSize: "12px", fontWeight: 700,
                      color: activeTab === tab ? CYAN : TEXT2,
                      background: "transparent", border: "none", cursor: "pointer",
                      borderBottom: activeTab === tab ? `2px solid ${CYAN}` : "2px solid transparent",
                      marginBottom: "-2px", transition: "color 0.15s",
                    }}
                    data-testid={`tab-${tab}`}
                  >
                    {tabLabels[tab]}
                  </button>
                ))}
              </div>
              <div role="tabpanel">
                {activeTab === "coupons" && (
                  <CouponStage
                    coupons={coupons}
                    onLightbox={setLightboxCoupon}
                    activeCouponId={activeCouponId ?? (coupons[0]?.id ?? null)}
                    onCouponSwitch={switchToCoupon}
                    couponRefs={couponRefs}
                    prematch={true}
                  />
                )}
                {activeTab === "matches" && (
                  <div>
                    <SmartMatchNavigator
                      matches={matches}
                      coupons={coupons}
                      publicPick={publicPick}
                      highlightedCouponId={highlightedCouponId}
                      onMatchClick={handleMatchClick}
                    />
                    {publicPick && <PublicPickStrip pick={publicPick} />}
                  </div>
                )}
                {activeTab === "balance" && (
                  <DailyBalancePanel
                    coupons={coupons}
                    onCouponClick={switchToCoupon}
                    prematch={true}
                  />
                )}
              </div>
            </div>
          )

        ) : (
          isDesktop ? (
            /* ── DESKTOP RESULTS: 3-column grid ──────────────── */
            <div style={{ display: "grid", gridTemplateColumns: "280px minmax(520px, 1fr) 300px", gap: "20px", alignItems: "start" }}>
              <div style={stickyWrap}>
                <ResultMatchesColumn matches={matches} />
              </div>
              <div>
                <ResultCouponsColumn coupons={coupons} onLightbox={setLightboxCoupon} />
              </div>
              <div style={stickyWrap}>
                <ResultBalanceColumn coupons={coupons} />
              </div>
            </div>
          ) : (
            /* ── MOBILE RESULTS: tabbed ───────────────────────── */
            <div>
              <div style={{ display: "flex", borderBottom: `2px solid ${BORDER}`, marginBottom: "20px" }} role="tablist" aria-label="Results sections">
                {(["coupons", "matches", "balance"] as TabKey[]).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => handleSetTab(tab)}
                    style={{
                      flex: 1, padding: "11px 6px", fontSize: "12px", fontWeight: 700,
                      color: activeTab === tab ? CYAN : TEXT2,
                      background: "transparent", border: "none", cursor: "pointer",
                      borderBottom: activeTab === tab ? `2px solid ${CYAN}` : "2px solid transparent",
                      marginBottom: "-2px", transition: "color 0.15s",
                    }}
                    data-testid={`result-tab-${tab}`}
                  >
                    {tabLabels[tab]}
                  </button>
                ))}
              </div>
              <div role="tabpanel">
                {activeTab === "coupons"  && <ResultCouponsColumn coupons={coupons} onLightbox={setLightboxCoupon} />}
                {activeTab === "matches"  && <ResultMatchesColumn matches={matches} />}
                {activeTab === "balance"  && <ResultBalanceColumn coupons={coupons} />}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
