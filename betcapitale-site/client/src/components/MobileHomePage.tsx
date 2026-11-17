import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Users, ArrowRight, Info, MessageSquare,
  ChevronLeft, ChevronRight, ChevronDown, UserRound,
} from "lucide-react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import * as FlagIcons from "country-flag-icons/react/3x2";
import { MobileHeader, MobileActionPanel } from "./MobileSharedLayout";
import {
  communityReviews, COUNTRY_FILTERS, FEATURED_IDS,
  type CommunityReview,
} from "@/data/communityReviews";

/* ── Design tokens ──────────────────────────────────────────────── */
const ORANGE  = "#F25A00";
const CYAN    = "#E8771F";   // used in simulator (matches desktop)
const TEXT    = "#111827";
const TEXT2   = "#4B5563";
const BORDER  = "#E5E7EB";
const SOFT    = "#F4F7F8";
const SUCCESS = "#16A34A";
const DANGER  = "#D95A68";
const FONT    = "'Manrope', sans-serif";

/* ── Community section tokens (match desktop CommunityVoicesSection) */
const CV_ORANGE  = "#E8771F";
const CV_TBRIGHT = "#0F172A";
const CV_TMID    = "#475569";
const CV_TDIM    = "#8490A1";
const CV_BDIM    = "#E6EAF0";
const CV_BMID    = "#DCE2E9";
const CV_FONT    = "'Manrope', sans-serif";
const CV_AMBIENT: Record<string, string> = {
  IT: "radial-gradient(ellipse at 15% 60%, rgba(0,140,69,0.04) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(206,43,55,0.04) 0%, transparent 55%)",
  ES: "radial-gradient(ellipse at 15% 60%, rgba(170,21,27,0.04) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(241,191,0,0.03) 0%, transparent 55%)",
  NL: "radial-gradient(ellipse at 15% 60%, rgba(174,28,40,0.04) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(33,70,139,0.04) 0%, transparent 55%)",
  BE: "radial-gradient(ellipse at 50% 50%, rgba(250,224,66,0.03) 0%, transparent 60%)",
  PL: "radial-gradient(ellipse at 85% 50%, rgba(220,20,60,0.04) 0%, transparent 55%)",
  HU: "radial-gradient(ellipse at 15% 60%, rgba(67,111,77,0.03) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(206,41,57,0.04) 0%, transparent 55%)",
  DE: "radial-gradient(ellipse at 15% 60%, rgba(221,0,0,0.03) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(255,206,0,0.03) 0%, transparent 55%)",
};

/* ── Community helpers ───────────────────────────────────────────── */
function MCFlagBadge({ countryCode, size = 18 }: { countryCode: string; size?: number }) {
  const Flag = (FlagIcons as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[countryCode];
  if (!Flag) return null;
  return (
    <Flag
      style={{ width: `${size}px`, height: `${Math.round(size * 0.667)}px`, borderRadius: "2px", display: "block", outline: "1px solid rgba(0,0,0,0.08)" }}
      aria-hidden
    />
  );
}

function MCAvatar() {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#F1F4F7", border: "1px solid #DDE3EA", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <UserRound size={20} color="#64748B" strokeWidth={1.6} />
      </div>
    </div>
  );
}

function MCTranslation({ text, open }: { text: string; open: boolean }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => { if (innerRef.current) setHeight(innerRef.current.scrollHeight); }, [text]);
  return (
    <div style={{ overflow: "hidden", maxHeight: open ? `${height + 32}px` : "0px", opacity: open ? 1 : 0, transition: "max-height 0.28s ease, opacity 0.22s ease" }}>
      <div ref={innerRef} style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${CV_BDIM}`, paddingLeft: "12px", borderLeft: `2px solid ${CV_ORANGE}` }}>
        <span style={{ display: "inline-block", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: CV_ORANGE, marginBottom: "6px", fontFamily: CV_FONT }}>EN</span>
        <p style={{ fontSize: "13.5px", color: CV_TMID, lineHeight: 1.68, fontFamily: CV_FONT, margin: 0 }}>{text}</p>
      </div>
    </div>
  );
}

function MCTransToggle({ open, onToggle, reviewId }: { open: boolean; onToggle: () => void; reviewId: number }) {
  return (
    <button
      aria-expanded={open}
      onClick={onToggle}
      data-testid={`button-translation-toggle-${reviewId}`}
      style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "14px", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "12px", color: open ? CV_ORANGE : CV_TDIM, fontFamily: CV_FONT, fontWeight: 500, transition: "color 0.15s" }}
    >
      <span>{open ? "Hide English translation" : "View English translation"}</span>
      <ChevronDown size={13} style={{ transition: "transform 0.22s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
    </button>
  );
}

function MCDots({ total, current }: { total: number; current: number }) {
  if (total <= 1) return null;
  return (
    <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "14px" }} aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: i === current ? "18px" : "6px", height: "6px", borderRadius: "3px", transition: "width 0.25s ease, background 0.2s ease", background: i === current ? CV_ORANGE : "#DCE2E9" }} />
      ))}
    </div>
  );
}

function MCLargeCard({
  review, progressKey, isPaused, showProgress,
  hasPrev, hasNext, onPrev, onNext,
  translationOpen, onToggleTranslation,
}: {
  review: CommunityReview; progressKey: string; isPaused: boolean; showProgress: boolean;
  hasPrev: boolean; hasNext: boolean; onPrev: () => void; onNext: () => void;
  translationOpen: boolean; onToggleTranslation: () => void;
}) {
  return (
    <div
      data-testid={`card-review-large-${review.id}`}
      style={{
        position: "relative",
        background: `${CV_AMBIENT[review.countryCode] ?? ""}, linear-gradient(135deg, #FFFFFF 0%, #FFF8F1 100%)`,
        border: `1px solid #F4D5B7`,
        borderLeft: `3px solid ${CV_ORANGE}`,
        borderRadius: "16px",
        padding: "20px 18px 20px",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
      }}
    >
      {/* Decorative quote */}
      <span aria-hidden style={{ position: "absolute", top: "10px", right: "16px", fontSize: "80px", lineHeight: 1, color: `${CV_ORANGE}1A`, fontFamily: "Georgia, serif", userSelect: "none", pointerEvents: "none" }}>&ldquo;</span>

      {/* Header: avatar | name+country | nav arrows */}
      <div style={{ display: "grid", gridTemplateColumns: "46px minmax(0, 1fr) auto", alignItems: "center", gap: "12px", marginBottom: "16px", position: "relative" }}>
        <MCAvatar />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "15px", fontWeight: 700, color: CV_TBRIGHT, fontFamily: CV_FONT, marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{review.displayName}</p>
          <p style={{ fontSize: "12px", color: CV_TDIM, fontFamily: CV_FONT, display: "flex", alignItems: "center", gap: "5px" }}>
            <MCFlagBadge countryCode={review.countryCode} size={16} />
            {review.countryName}
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          {hasPrev && (
            <button
              onClick={onPrev}
              data-testid="button-stage-prev"
              aria-label="Previous review"
              style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${CV_BMID}`, background: "#FFFFFF", color: CV_TMID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <ChevronLeft size={17} />
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              data-testid="button-stage-next"
              aria-label="Next review"
              style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${CV_BMID}`, background: "#FFFFFF", color: CV_TMID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <ChevronRight size={17} />
            </button>
          )}
        </div>
      </div>

      {/* Review text */}
      <p style={{ fontSize: "16px", color: CV_TMID, lineHeight: 1.65, fontFamily: CV_FONT, flex: 1, position: "relative", overflowWrap: "break-word", wordBreak: "normal", whiteSpace: "normal" }}>
        {review.localizedText}
      </p>

      <MCTranslation text={review.englishText} open={translationOpen} />
      <MCTransToggle open={translationOpen} onToggle={onToggleTranslation} reviewId={review.id} />

      {/* Progress bar */}
      {showProgress && (
        <div style={{ marginTop: "16px", background: CV_BDIM, borderRadius: "2px", overflow: "hidden" }}>
          <div
            key={progressKey}
            style={{ height: "2px", background: CV_ORANGE, borderRadius: "2px", animation: isPaused ? "none" : "mcProgress 7s linear forwards", width: isPaused ? "0%" : undefined }}
          />
        </div>
      )}
    </div>
  );
}

function MCSmallCard({
  review, translationOpen, onToggleTranslation,
}: {
  review: CommunityReview; translationOpen: boolean; onToggleTranslation: () => void;
}) {
  return (
    <div
      data-testid={`card-review-${review.id}`}
      style={{
        position: "relative",
        background: "#FFFFFF",
        border: "1px solid #E2E7ED",
        borderRadius: "16px",
        padding: "18px 18px 14px",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <span aria-hidden style={{ position: "absolute", top: "6px", right: "14px", fontSize: "56px", lineHeight: 1, color: `${CV_ORANGE}10`, fontFamily: "Georgia, serif", userSelect: "none", pointerEvents: "none" }}>&ldquo;</span>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px", position: "relative" }}>
        <MCAvatar />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "13.5px", fontWeight: 700, color: CV_TBRIGHT, fontFamily: CV_FONT, marginBottom: "2px" }}>{review.displayName}</p>
          <p style={{ fontSize: "11.5px", color: CV_TDIM, fontFamily: CV_FONT, display: "flex", alignItems: "center", gap: "4px" }}>
            <MCFlagBadge countryCode={review.countryCode} size={14} />
            {review.countryName}
          </p>
        </div>
      </div>

      <p style={{ fontSize: "15px", color: CV_TMID, lineHeight: 1.6, fontFamily: CV_FONT, flex: 1, position: "relative", overflowWrap: "break-word" }}>
        {review.localizedText}
      </p>

      <MCTranslation text={review.englishText} open={translationOpen} />
      <MCTransToggle open={translationOpen} onToggle={onToggleTranslation} reviewId={review.id} />
    </div>
  );
}

/* ── Mobile Community Section ────────────────────────────────────── */
function MobileCommunitySection() {
  const [activeCountry, setActiveCountry] = useState("ALL");
  const [mainIdx, setMainIdx] = useState(0);
  const [cardsFaded, setCardsFaded] = useState(true);
  const [openTranslations, setOpenTranslations] = useState<Set<number>>(new Set());
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(() =>
    typeof document !== "undefined" ? !document.hidden : true
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* prefers-reduced-motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* Page visibility */
  useEffect(() => {
    const onVis = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /* Shuffle once per page load so every visit shows a different order */
  const shuffledAll = useMemo(
    () => [...communityReviews].sort(() => Math.random() - 0.5),
    [], // empty dep array → stable for the lifetime of this component mount
  );

  /* Derived pools */
  const isAllView = activeCountry === "ALL";
  // Derive featured from the already-shuffled list so ALL carousel order varies per page load
  const featuredReviews = shuffledAll.filter((r) => FEATURED_IDS.includes(r.id));
  const countryReviews = isAllView
    ? featuredReviews
    : shuffledAll.filter((r) => r.countryCode === activeCountry);
  const poolLength = countryReviews.length;
  const safeIdx = poolLength > 0 ? mainIdx % poolLength : 0;
  const mainReview = countryReviews[safeIdx];

  const sideCards = isAllView
    ? [featuredReviews[(safeIdx + 1) % 6], featuredReviews[(safeIdx + 2) % 6]]
    : countryReviews.filter((_, i) => i !== safeIdx).slice(0, 2);

  /* Country counts */
  const counts: Record<string, number> = {};
  for (const r of communityReviews) counts[r.countryCode] = (counts[r.countryCode] ?? 0) + 1;

  /* Pause conditions */
  const mainTranslationOpen = mainReview ? openTranslations.has(mainReview.id) : false;
  const isPaused = mainTranslationOpen || reducedMotion || poolLength <= 1 || !isPageVisible;

  /* Auto-rotate */
  useEffect(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (isPaused) return;
    intervalRef.current = setInterval(() => setMainIdx((p) => (p + 1) % poolLength), 7000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, poolLength]);

  const handleFilterChange = (code: string) => {
    // Aktif ülkeye tekrar tıklayınca deselect → tüm yorumlar
    const next = code === activeCountry ? "ALL" : code;
    if (next === activeCountry) return;
    setCardsFaded(false);
    setTimeout(() => {
      setActiveCountry(next);
      setMainIdx(0);
      setOpenTranslations(new Set());
      setCardsFaded(true);
    }, 120);
  };

  const toggleTranslation = (id: number) => {
    setOpenTranslations((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const progressKey = `${activeCountry}-${safeIdx}`;

  if (!mainReview) return null;

  return (
    <section
      id="mobile-community-voices"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)", borderTop: `1px solid ${CV_BDIM}`, overflow: "hidden", paddingBottom: "32px" }}
    >
      {/* Keyframes */}
      <style>{`@keyframes mcProgress { from { width: 0% } to { width: 100% } }`}</style>

      {/* ── Section header ────────────────────────────────────────── */}
      <div style={{ padding: "32px 20px 0" }}>
        <p style={{ fontSize: "10.5px", fontWeight: 700, color: CV_ORANGE, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "12px", fontFamily: CV_FONT, display: "flex", alignItems: "center", gap: "7px" }}>
          <MessageSquare size={12} strokeWidth={2.5} />
          BET CAPITALE COMMUNITY
        </p>
        <h2 style={{ fontSize: "clamp(31px, 8.4vw, 38px)", fontWeight: 800, color: CV_TBRIGHT, lineHeight: 1.07, letterSpacing: "-0.035em", fontFamily: CV_FONT, marginBottom: "12px" }}>
          <span style={{ display: "block" }}>They tried it.</span>
          <span style={{ display: "block" }}>They shared their</span>
          <span style={{ display: "block" }}>told it in their own words.</span>
        </h2>
        <p style={{ fontSize: "14px", color: CV_TMID, lineHeight: 1.6, fontFamily: CV_FONT, marginBottom: "16px" }}>
          Explore the diverse experiences of the Bet Capitale community from 7 countries.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          {[{ value: String(communityReviews.length), label: "Reviews" }, { value: "7", label: "Countries" }].map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span style={{ fontSize: "22px", fontWeight: 800, color: CV_TBRIGHT, fontFamily: CV_FONT, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: "12px", color: CV_TDIM, fontFamily: CV_FONT }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Country filter — horizontal scroll ────────────────────── */}
      <div style={{ padding: "16px 20px 0" }}>
        <div
          role="group"
          aria-label="Country filter"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}
        >
          {(() => {
            const countryItems = COUNTRY_FILTERS.filter(f => f.code !== "ALL");
            const isOdd = countryItems.length % 2 !== 0;
            return countryItems.map((f, idx) => {
              const isActive = activeCountry === f.code;
              const count = counts[f.code] ?? 0;
              const isLastOrphan = isOdd && idx === countryItems.length - 1;
              return (
                <button
                  key={f.code}
                  aria-pressed={isActive}
                  onClick={() => handleFilterChange(f.code)}
                  data-testid={`filter-country-${f.code.toLowerCase()}`}
                  style={{
                    width: "100%",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px",
                    padding: "6px 11px", borderRadius: "100px",
                    border: `1px solid ${isActive ? CV_ORANGE : "#DFE4EA"}`,
                    background: isActive ? "#FFF4E8" : "#FFFFFF",
                    color: isActive ? CV_ORANGE : "#475569",
                    fontSize: "12.5px", fontWeight: isActive ? 600 : 500, fontFamily: CV_FONT,
                    cursor: "pointer", whiteSpace: "nowrap", minHeight: "36px",
                    transition: "background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s",
                    boxShadow: isActive ? "0 2px 8px rgba(245,137,42,0.18)" : "0 1px 4px rgba(15,23,42,0.05)",
                    // Son orphan öğe: tam satır genişliği + kendi sütun alanında ortala
                    ...(isLastOrphan ? { gridColumn: "1 / -1", maxWidth: "50%", margin: "0 auto" } : {}),
                  }}
                >
                  <MCFlagBadge countryCode={f.code} size={16} />
                  <span>{f.name}</span>
                  <span style={{ fontSize: "11px", color: isActive ? CV_ORANGE : CV_TDIM, fontWeight: 600, minWidth: "14px", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
                    {count}
                  </span>
                </button>
              );
            });
          })()}
        </div>
      </div>

      {/* ── Featured card + pagination dots ───────────────────────── */}
      <div
        style={{ padding: "0 20px", opacity: cardsFaded ? 1 : 0, transition: "opacity 0.12s ease", outline: "none" }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" && poolLength > 1) setMainIdx((p) => (p - 1 + poolLength) % poolLength);
          if (e.key === "ArrowRight" && poolLength > 1) setMainIdx((p) => (p + 1) % poolLength);
        }}
        tabIndex={0}
      >
        <MCLargeCard
          review={mainReview}
          progressKey={progressKey}
          isPaused={isPaused}
          showProgress={poolLength > 1}
          hasPrev={poolLength > 1}
          hasNext={poolLength > 1}
          onPrev={() => setMainIdx((p) => (p - 1 + poolLength) % poolLength)}
          onNext={() => setMainIdx((p) => (p + 1) % poolLength)}
          translationOpen={openTranslations.has(mainReview.id)}
          onToggleTranslation={() => toggleTranslation(mainReview.id)}
        />
        <MCDots total={poolLength} current={safeIdx} />
      </div>

      {/* ── Side cards — single column ─────────────────────────────── */}
      {sideCards.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px", padding: "14px 20px 0" }}>
          {sideCards.map((card) => (
            <MCSmallCard
              key={`${card.id}-${activeCountry}`}
              review={card}
              translationOpen={openTranslations.has(card.id)}
              onToggleTranslation={() => toggleTranslation(card.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Scoped mobile CSS ──────────────────────────────────────────── */
const MOBILE_CSS = `
  .bc-mobile-title {
    font-family: "DM Serif Display", "Playfair Display", Georgia, serif;
    font-weight: 400;
    font-size: clamp(31px, 9vw, 36px);
    line-height: 1.15;
    letter-spacing: -0.015em;
    margin: 0;
    color: #0B1220;
  }
  .bc-mobile-title .t-orange { color: #F25A00; }

  @media (max-width: 359px) {
    .bc-mobile-title        { font-size: 29px !important; }
    .bc-mobile-digit-tile   { height: 74px !important; }
    .bc-mobile-digit-tile span { font-size: 40px !important; }
  }
`;

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/* ══════════════════════════════════════════════════════════════════
   FLIP DIGIT TILE
══════════════════════════════════════════════════════════════════ */
function MobileDigitTile({ digit }: { digit: number }) {
  return (
    <div className="bc-mobile-digit-tile" style={{
      minWidth: 0, height: "92px", borderRadius: "12px",
      background: "linear-gradient(180deg, #222 0%, #111 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      boxShadow: "0 4px 10px rgba(0,0,0,0.22)",
    }}>
      <span style={{ fontSize: "54px", fontWeight: 700, fontFamily: FONT, fontVariantNumeric: "tabular-nums", lineHeight: 1, color: "#FFFFFF", userSelect: "none" }}>
        {digit}
      </span>
      <div style={{ position: "absolute", left: "4px", right: "4px", top: "50%", height: "1px", background: "rgba(255,255,255,0.16)", pointerEvents: "none" }} />
    </div>
  );
}

function DigitSep() {
  return (
    <div style={{ width: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#666" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MEMBER CARD
══════════════════════════════════════════════════════════════════ */
interface CommunityStats {
  totalMembers: number;
  currentlyActive: number;
  todayIncrease: number;
  weekIncrease: number;
}

function MobileMemberCard() {
  const { data } = useQuery<CommunityStats>({
    queryKey: ["/api/community/stats"],
    refetchInterval: 30_000,
  });

  const totalMembers    = data?.totalMembers    ?? 1247;
  const currentlyActive = data?.currentlyActive ?? 128;
  const todayIncrease   = data?.todayIncrease   ?? 4;
  const weekIncrease    = data?.weekIncrease     ?? 19;

  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);
  const rafRef      = useRef<number | null>(null);

  useEffect(() => {
    if (!data) return;
    const target = totalMembers;
    if (hasAnimated.current) { setDisplayValue(target); return; }
    hasAnimated.current = true;

    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) { setDisplayValue(target); return; }

    const duration = 2500;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed  = Math.min(now - startTime, duration);
      const progress = easeOutQuart(elapsed / duration);
      setDisplayValue(Math.round(progress * target));
      if (elapsed < duration) { rafRef.current = requestAnimationFrame(tick); }
      else { setDisplayValue(target); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [data, totalMembers]);

  const clamped = Math.max(0, Math.min(displayValue, 9999));
  const digits  = clamped.toString().padStart(4, "0").split("").map(Number);

  const statBox: React.CSSProperties = {
    minWidth: 0, height: "86px", border: `1px solid ${BORDER}`, borderRadius: "14px",
    padding: "10px 6px", display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center", boxSizing: "border-box", gap: "6px",
  };

  const upArrow = (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 10V2M6 2L2 6M6 2l4 4" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div style={{
      marginTop: "20px", width: "100%", background: "#FFFFFF",
      border: `1px solid ${BORDER}`, borderRadius: "22px", padding: "20px 16px 18px",
      boxShadow: "0 8px 28px rgba(15,23,42,0.08)", overflow: "hidden", boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div style={{ width: "34px", height: "34px", background: "#FFF3E9", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Users size={16} color={ORANGE} />
        </div>
        <span style={{ fontSize: "15px", fontWeight: 700, color: TEXT, fontFamily: FONT }}>Total Bet Capitale Members</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr", alignItems: "center", width: "100%" }}>
        <MobileDigitTile digit={digits[0]} /><DigitSep />
        <MobileDigitTile digit={digits[1]} /><DigitSep />
        <MobileDigitTile digit={digits[2]} /><DigitSep />
        <MobileDigitTile digit={digits[3]} />
      </div>

      <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "7px" }}>
        <div style={statBox}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: SUCCESS, display: "block", flexShrink: 0 }} />
            <span style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, letterSpacing: "0.04em", lineHeight: 1.15, fontFamily: FONT }}>CURRENTLY ACTIVE</span>
          </div>
          <span style={{ fontSize: "22px", fontWeight: 700, color: TEXT, fontFamily: FONT, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{currentlyActive}</span>
        </div>
        <div style={statBox}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {upArrow}
            <span style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, letterSpacing: "0.04em", lineHeight: 1.15, fontFamily: FONT }}>TODAY</span>
          </div>
          <span style={{ fontSize: "22px", fontWeight: 700, color: ORANGE, fontFamily: FONT, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>+{todayIncrease}</span>
        </div>
        <div style={statBox}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {upArrow}
            <span style={{ fontSize: "9px", fontWeight: 700, color: TEXT2, letterSpacing: "0.04em", lineHeight: 1.15, fontFamily: FONT }}>THIS WEEK</span>
          </div>
          <span style={{ fontSize: "22px", fontWeight: 700, color: ORANGE, fontFamily: FONT, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>+{weekIncrease}</span>
        </div>
      </div>

      <Link href="/plans">
        <button style={{
          marginTop: "14px", width: "100%", height: "56px", border: 0, borderRadius: "14px",
          background: ORANGE, color: "#FFFFFF", fontSize: "17px", fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", gap: "16px",
          fontFamily: FONT, cursor: "pointer",
        }}>
          Join the Community<ArrowRight size={18} />
        </button>
      </Link>

      <div style={{ marginTop: "12px", display: "flex", alignItems: "flex-start", gap: "7px" }}>
        <Info size={12} style={{ color: ORANGE, flexShrink: 0, marginTop: "1px" }} />
        <span style={{ fontSize: "11px", lineHeight: 1.4, color: "#68707D", fontFamily: FONT }}>Member count updates in real time throughout the day.</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SIMULATOR SECTION (mobile-scoped, self-contained state)
══════════════════════════════════════════════════════════════════ */
type Entry = { id: number; date: string; value: number };

function SimTooltipMobile({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const daily = d.value as number;
  const stake = d.stake as number;
  return (
    <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: "9px", padding: "11px 14px", boxShadow: "0 4px 16px rgba(14,23,38,0.08)", minWidth: "160px" }}>
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

/* Full-detail period card — matches desktop ProfitPeriodCard exactly */
function PeriodCard({ label, entries, stake, days }: { label: string; entries: Entry[]; stake: number; days: number }) {
  const mult        = stake / 100;
  const sorted      = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const filtered    = sorted.slice(-days);
  const scaled      = filtered.map(e => e.value * mult);
  const net         = scaled.reduce((s, v) => s + v, 0);
  const positive    = scaled.filter(v => v > 0);
  const negative    = scaled.filter(v => v < 0);
  const profitTotal = positive.reduce((s, v) => s + v, 0);
  const lossTotal   = Math.abs(negative.reduce((s, v) => s + v, 0));
  const bestDay     = scaled.length > 0 ? Math.max(...scaled) : null;
  const worstDay    = scaled.length > 0 ? Math.min(...scaled) : null;
  const netPos      = net >= 0;
  const fmtV        = (v: number) => `${v >= 0 ? "+" : ""}${v.toLocaleString("en-US", { maximumFractionDigits: 0 })} €`;

  const rows: { label: string; value: string; color?: string }[] = [
    { label: "Winning Days",    value: String(positive.length),                                                                              color: SUCCESS },
    { label: "Losing Days",     value: String(negative.length),                                                                              color: DANGER  },
    { label: "Best Day",        value: bestDay  !== null ? fmtV(bestDay)  : "—",                                                             color: SUCCESS },
    { label: "Worst Day",       value: worstDay !== null ? fmtV(worstDay) : "—",                                                             color: DANGER  },
    { label: "Profit Total", value: profitTotal > 0 ? fmtV(profitTotal) : "—",                                                            color: SUCCESS },
    { label: "Loss Total",      value: lossTotal  > 0 ? `-${lossTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} €` : "—",       color: DANGER  },
  ];

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "20px", boxShadow: "0 2px 8px rgba(14,23,38,0.04)" }}>
      <p style={{ fontSize: "12px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px", fontFamily: FONT }}>{label}</p>
      <p style={{ fontSize: "28px", fontWeight: 900, color: netPos ? SUCCESS : DANGER, fontVariantNumeric: "tabular-nums", lineHeight: 1, marginBottom: "4px", fontFamily: FONT }}>
        {fmtV(net)}
      </p>
      <p style={{ fontSize: "11px", color: TEXT2, marginBottom: "16px", fontFamily: FONT }}>Net result · €{stake} / coupon</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {rows.map(row => (
          <div key={row.label}>
            <p style={{ fontSize: "10px", color: TEXT2, fontFamily: FONT, marginBottom: "1px" }}>{row.label}</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: row.color ?? TEXT, fontFamily: FONT, fontVariantNumeric: "tabular-nums" }}>{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileSimulatorSection() {
  const [simRange, setSimRange] = useState<"7d" | "14d" | "30d" | "90d">("30d");
  const [simStake, setSimStake] = useState<number>(100);

  const { data: entries = [] } = useQuery<Entry[]>({ queryKey: ["/api/entries"] });

  const STAKE_OPTIONS = [10, 25, 50, 100, 150, 200, 300, 500];
  const RANGE_LABELS: Record<string, string> = { "7d": "7 Days", "14d": "14 Days", "30d": "30 Days", "90d": "90 Days" };
  const daysMap: Record<string, number> = { "7d": 7, "14d": 14, "30d": 30, "90d": 90 };

  const n    = daysMap[simRange];
  const mult = simStake / 100;
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const filtered = sorted.slice(-n);
  const points = filtered.map(e => ({
    date: e.date,
    day: new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    value: e.value * mult,
    stake: simStake,
  }));
  const netResult      = points.reduce((s, p) => s + p.value, 0);
  const positivePoints = points.filter(p => p.value > 0);
  const negativePoints = points.filter(p => p.value < 0);
  const profitableTotal = positivePoints.reduce((s, p) => s + p.value, 0);
  const lossTotal       = Math.abs(negativePoints.reduce((s, p) => s + p.value, 0));
  const bestDayVal      = points.length > 0 ? Math.max(...points.map(p => p.value)) : null;
  const worstDayVal     = points.length > 0 ? Math.min(...points.map(p => p.value)) : null;

  const btnBase: React.CSSProperties = {
    minWidth: "52px", minHeight: "40px", padding: "7px 12px", borderRadius: "10px",
    fontSize: "13px", cursor: "pointer", transition: "all 0.15s", fontFamily: FONT,
  };

  return (
    <section id="mobile-kazanc-simulasyonu" style={{ background: SOFT, padding: "48px 20px 56px", borderTop: `1px solid ${BORDER}`, overflowX: "hidden" }}>
      {/* Header */}
      <p style={{ fontSize: "11px", fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px", fontFamily: FONT }}>PROFIT SIMULATION</p>
      <h2 style={{ fontSize: "22px", fontWeight: 800, color: TEXT, lineHeight: 1.2, marginBottom: "8px", fontFamily: FONT }}>What would have happened with your chosen stake?</h2>
      <p style={{ fontSize: "13px", color: TEXT2, marginBottom: "24px", fontFamily: FONT }}>Choose your stake per coupon and the period.</p>

      {/* Selector card */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", fontFamily: FONT }}>Stake Per Coupon</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "16px" }}>
          {STAKE_OPTIONS.map(s => {
            const active = simStake === s;
            return (
              <button key={s} onClick={() => setSimStake(s)} style={{
                ...btnBase,
                fontWeight: active ? 700 : 500,
                color: active ? "#fff" : TEXT,
                background: active ? CYAN : "#fff",
                border: `1.5px solid ${active ? CYAN : BORDER}`,
              }}>€{s}</button>
            );
          })}
        </div>
        <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", fontFamily: FONT }}>Period</p>
        <div style={{ display: "flex", gap: "7px", marginBottom: "12px" }}>
          {(["7d", "14d", "30d", "90d"] as const).map(r => {
            const active = simRange === r;
            return (
              <button key={r} onClick={() => setSimRange(r)} style={{
                ...btnBase,
                fontWeight: active ? 700 : 500,
                color: active ? "#fff" : TEXT,
                background: active ? CYAN : "#fff",
                border: `1.5px solid ${active ? CYAN : BORDER}`,
              }}>{RANGE_LABELS[r]}</button>
            );
          })}
        </div>

        {/* Net result */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "14px", marginTop: "4px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px", fontFamily: FONT }}>Net Result</p>
          <p style={{ fontSize: "30px", fontWeight: 900, color: netResult >= 0 ? SUCCESS : DANGER, fontVariantNumeric: "tabular-nums", lineHeight: 1, fontFamily: FONT }}>
            {netResult >= 0 ? "+" : ""}{netResult.toLocaleString("en-US", { maximumFractionDigits: 0 })} €
          </p>
          <p style={{ fontSize: "11px", color: TEXT2, marginTop: "4px", fontFamily: FONT }}>€{simStake} per coupon · Last {filtered.length} data days</p>
        </div>
      </div>

      {/* Period summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginBottom: "16px" }}>
        <PeriodCard label="Last 7 Days"  entries={entries} stake={simStake} days={7}  />
        <PeriodCard label="Last 30 Days" entries={entries} stake={simStake} days={30} />
        <PeriodCard label="Last 90 Days" entries={entries} stake={simStake} days={90} />
      </div>

      {/* Detail table */}
      {filtered.length > 0 && (() => {
        const fmt = (v: number) =>
          `${v >= 0 ? "+" : ""}${v.toLocaleString("en-US", { maximumFractionDigits: 0 })} €`;
        const tableRows: { label: string; value: string; color: string; bold?: boolean }[] = [
          { label: "Selected Stake",               value: `€${simStake}`,                                                                                            color: TEXT    },
          { label: "Selected Period",               value: RANGE_LABELS[simRange],                                                                                   color: TEXT    },
          { label: "Days With Data",            value: String(filtered.length),                                                                                   color: TEXT    },
          { label: "Winning Days",                value: String(positivePoints.length),                                                                             color: SUCCESS },
          { label: "Losing Days",                 value: String(negativePoints.length),                                                                             color: DANGER  },
          { label: "Best Day",                  value: bestDayVal  !== null ? fmt(bestDayVal)  : "—",                                                             color: SUCCESS },
          { label: "Worst Day",                 value: worstDayVal !== null ? fmt(worstDayVal) : "—",                                                             color: DANGER  },
          { label: "Total Profit Days",              value: profitableTotal > 0 ? `+${profitableTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} €` : "—", color: SUCCESS },
          { label: "Total Loss Days",             value: lossTotal > 0 ? `-${lossTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} €` : "—",             color: DANGER  },
          { label: "Net Result",                   value: fmt(netResult),                                                                                            color: netResult >= 0 ? SUCCESS : DANGER, bold: true },
        ];
        return (
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "16px", marginBottom: "10px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px", fontFamily: FONT }}>Detailed Analysis</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {tableRows.map((row, i) => (
                <div key={row.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  gap: "8px", padding: "9px 0",
                  borderBottom: i < tableRows.length - 1 ? `1px solid ${BORDER}` : "none",
                }}>
                  <span style={{ fontSize: "11px", color: TEXT2, fontFamily: FONT, minWidth: 0 }}>{row.label}</span>
                  <span style={{
                    fontSize: row.bold ? "15px" : "12px",
                    fontWeight: row.bold ? 800 : 700,
                    color: row.color,
                    fontVariantNumeric: "tabular-nums",
                    fontFamily: FONT,
                    flexShrink: 0,
                  }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Bar chart */}
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "16px", overflow: "hidden" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", fontFamily: FONT }}>Daily Net Result</p>
        <div style={{ height: "200px" }}>
          {points.length === 0 ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: "13px", color: TEXT2 }}>No data available for this period.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={points} margin={{ top: 4, right: 4, left: 4, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={BORDER} />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: TEXT2 }} tickLine={false} axisLine={false}
                  interval={points.length > 14 ? Math.floor(points.length / 6) : 0} />
                <YAxis hide width={0} />
                <Tooltip content={<SimTooltipMobile />} cursor={{ fill: "rgba(14,23,38,0.04)" }} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {points.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.value >= 0 ? SUCCESS : DANGER} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "14px", marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
          <Link href="/history" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "13px", fontWeight: 700, color: CYAN,
            padding: "10px 16px", borderRadius: "8px",
            border: `1.5px solid ${CYAN}`, textDecoration: "none",
            background: "#fff",
          }}>
            View Full Performance<ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   BOTTOM CTA (mirrors CommunityVoicesCTA + disclaimer)
══════════════════════════════════════════════════════════════════ */
function MobileBottomCTA() {
  return (
    <div style={{
      padding: "40px 24px 32px",
      borderTop: "1px solid #E5E7EB",
      textAlign: "center",
    }}>
      <p style={{
        fontSize: "11px", fontWeight: 700, color: ORANGE,
        textTransform: "uppercase", letterSpacing: "0.12em",
        marginBottom: "14px", fontFamily: FONT,
      }}>
        See the system first. Then make your decision.
      </p>
      <p style={{
        fontSize: "15px", color: TEXT2, lineHeight: 1.7,
        marginBottom: "24px", fontFamily: FONT,
      }}>
        Follow today's free pick, review past performance and
        evaluate the Bet Capitale approach with your own eyes.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
        <Link href="/today">
          <button style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: ORANGE, color: "#0c111c", fontWeight: 700,
            fontSize: "15px", padding: "14px 32px", borderRadius: "8px",
            border: "none", cursor: "pointer", fontFamily: FONT, width: "100%",
            justifyContent: "center",
          }}>
            View Free Bet <ArrowRight size={16} />
          </button>
        </Link>
        <Link href="/plans">
          <button style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "#FFFFFF", color: TEXT2, fontWeight: 500,
            fontSize: "15px", padding: "14px 32px", borderRadius: "8px",
            border: "1px solid #D1D5DB", cursor: "pointer", fontFamily: FONT,
            width: "100%",
          }}>
            View Plans
          </button>
        </Link>
      </div>
      <p style={{
        marginTop: "24px", fontSize: "11px", color: "#9CA3AF",
        lineHeight: 1.6, fontFamily: FONT,
      }}>
        Reviews are adapted from the common themes of past community feedback
        and presented across different languages. Names are abbreviated for privacy.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════ */
export default function MobileHomePage() {
  return (
    <>
      <style>{MOBILE_CSS}</style>

      <div style={{ width: "100%", overflowX: "clip", background: "#FFFFFF" }}>
        <MobileHeader />

        {/* ── Hero content ──────────────────────────────────────── */}
        <div style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "16px", paddingBottom: "28px", width: "100%", boxSizing: "border-box" }}>
          <h1 className="bc-mobile-title">
            We do the planning.{" "}
            <span className="t-orange">You enjoy the winning.</span>
          </h1>
          <p style={{ marginTop: "16px", fontSize: "17px", lineHeight: 1.55, color: "#5F6673", fontFamily: FONT, marginBottom: 0 }}>
            Built on the right strategy for consistent long-term profits.
          </p>
          <MobileMemberCard />
        </div>

        {/* ── Community Voices ──────────────────────────────────── */}
        <MobileCommunitySection />

        {/* ── Simulation ────────────────────────────────────────── */}
        <MobileSimulatorSection />

        {/* ── Bottom CTA (Free Bet + View Plans) ─────────────── */}
        {/* paddingBottom reserves space for fixed panel */}
        <div style={{ paddingBottom: "80px" }}>
          <MobileBottomCTA />
        </div>

        {/* ── Fixed bottom action panel ─────────────────────────── */}
        <MobileActionPanel />
      </div>
    </>
  );
}
