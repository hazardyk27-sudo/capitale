import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight, MessageSquare, UserRound,
} from "lucide-react";
import * as FlagIcons from "country-flag-icons/react/3x2";
import {
  communityReviews, COUNTRY_FILTERS, FEATURED_IDS, type CommunityReview,
} from "@/data/communityReviews";

/* ── Design tokens ──────────────────────────────────────────────── */
const ORANGE      = "#E8771F";
const TEXT_BRIGHT = "#0F172A";
const TEXT_MID    = "#475569";
const TEXT_DIM    = "#8490A1";
const BORDER_DIM  = "#E6EAF0";
const BORDER_MID  = "#DCE2E9";
const FONT        = "'Manrope', sans-serif";

/* ── Per-country ambient gradient for large card ────────────────── */
const COUNTRY_AMBIENT: Record<string, string> = {
  IT: "radial-gradient(ellipse at 15% 60%, rgba(0,140,69,0.04) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(206,43,55,0.04) 0%, transparent 55%)",
  ES: "radial-gradient(ellipse at 15% 60%, rgba(170,21,27,0.04) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(241,191,0,0.03) 0%, transparent 55%)",
  NL: "radial-gradient(ellipse at 15% 60%, rgba(174,28,40,0.04) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(33,70,139,0.04) 0%, transparent 55%)",
  BE: "radial-gradient(ellipse at 50% 50%, rgba(250,224,66,0.03) 0%, transparent 60%)",
  PL: "radial-gradient(ellipse at 85% 50%, rgba(220,20,60,0.04) 0%, transparent 55%)",
  HU: "radial-gradient(ellipse at 15% 60%, rgba(67,111,77,0.03) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(206,41,57,0.04) 0%, transparent 55%)",
  DE: "radial-gradient(ellipse at 15% 60%, rgba(221,0,0,0.03) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(255,206,0,0.03) 0%, transparent 55%)",
};

/* ── Ticker stream items ────────────────────────────────────────── */
const TICKER_IDS = [1, 8, 5, 10, 16, 13, 2, 20, 18, 9, 3, 21];
const TICKER_ITEMS = TICKER_IDS
  .map((id) => communityReviews.find((r) => r.id === id)!)
  .filter(Boolean);

function tickerExcerpt(text: string, max = 58): string {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + "…";
}

/* ── CSS injected once ──────────────────────────────────────────── */
const GLOBAL_CSS = `
  .cv-hide-scroll::-webkit-scrollbar { display: none; }
  .cv-hide-scroll { scrollbar-width: none; -ms-overflow-style: none; }

  @keyframes cvMarquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .cv-ticker-track {
    display: inline-flex;
    animation: cvMarquee 44s linear infinite;
    will-change: transform;
  }
  .cv-ticker-wrap:hover .cv-ticker-track,
  .cv-ticker-wrap:focus-within .cv-ticker-track {
    animation-play-state: paused;
  }

  @keyframes cvProgress {
    from { width: 0%; }
    to   { width: 100%; }
  }
  .cv-progress {
    height: 2px;
    background: ${ORANGE};
    border-radius: 2px;
    animation: cvProgress 7s linear forwards;
  }
  .cv-progress.paused { animation-play-state: paused; }

  @keyframes cvFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cv-card-anim { animation: cvFadeUp 0.32s ease both; animation-delay: var(--cv-anim-delay, 0ms); }

  @media (prefers-reduced-motion: reduce) {
    .cv-ticker-track { animation: none !important; }
    .cv-progress     { animation: none !important; width: 100%; }
    .cv-card-anim    { animation: none !important; }
    .cv-section      { transition: none !important; }
  }

`;

/* ── SVG flag badge ──────────────────────────────────────────────── */
function FlagBadge({ countryCode, size = 18 }: { countryCode: string; size?: number }) {
  const Flag = (FlagIcons as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[countryCode];
  if (!Flag) return null;
  return (
    <Flag
      style={{
        width: `${size}px`, height: `${Math.round(size * 0.667)}px`,
        borderRadius: "2px", display: "block",
        outline: "1px solid rgba(0,0,0,0.08)",
      }}
      aria-hidden
    />
  );
}

/* ── Circular avatar ─────────────────────────────────────────────── */
function CircularAvatar({ countryCode: _ }: { countryCode: string }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div
        style={{
          width: "44px", height: "44px", borderRadius: "50%",
          background: "#F1F4F7",
          border: `1px solid #DDE3EA`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <UserRound size={20} color="#64748B" strokeWidth={1.6} />
      </div>
    </div>
  );
}

/* ── English translation accordion ─────────────────────────────── */
function EnglishTranslation({ text, open }: { text: string; open: boolean }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => { if (innerRef.current) setHeight(innerRef.current.scrollHeight); }, [text]);
  return (
    <div style={{
      overflow: "hidden",
      maxHeight: open ? `${height + 32}px` : "0px",
      opacity: open ? 1 : 0,
      transition: "max-height 0.28s ease, opacity 0.22s ease",
    }}>
      <div ref={innerRef} style={{
        marginTop: "12px", paddingTop: "12px",
        borderTop: `1px solid ${BORDER_DIM}`,
        paddingLeft: "12px",
        borderLeft: `2px solid ${ORANGE}`,
      }}>
        <span style={{
          display: "inline-block", fontSize: "9px", fontWeight: 700,
          letterSpacing: "0.1em", color: ORANGE, marginBottom: "6px", fontFamily: FONT,
        }}>EN</span>
        <p style={{ fontSize: "13.5px", color: TEXT_MID, lineHeight: 1.68, fontFamily: FONT, margin: 0 }}>
          {text}
        </p>
      </div>
    </div>
  );
}

/* ── Translation toggle button ──────────────────────────────────── */
function TranslationToggle({ open, onToggle, reviewId }: { open: boolean; onToggle: () => void; reviewId: number }) {
  return (
    <button
      aria-expanded={open}
      onClick={onToggle}
      data-testid={`button-translation-toggle-${reviewId}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        marginTop: "14px", background: "none", border: "none", cursor: "pointer",
        padding: 0, fontSize: "12px", color: open ? ORANGE : TEXT_DIM,
        fontFamily: FONT, fontWeight: 500, transition: "color 0.15s",
      }}
    >
      <span>{open ? "Hide English translation" : "View English translation"}</span>
      <ChevronDown size={13} style={{
        transition: "transform 0.22s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }} />
    </button>
  );
}

/* ── Large featured card ─────────────────────────────────────────── */
function LargeReviewCard({
  review,
  progressKey,
  isPaused,
  showProgress,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  translationOpen,
  onToggleTranslation,
}: {
  review: CommunityReview;
  progressKey: string;
  isPaused: boolean;
  showProgress: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  translationOpen: boolean;
  onToggleTranslation: () => void;
}) {
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setGlowPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      data-testid={`card-review-large-${review.id}`}
      style={{
        position: "relative",
        background: `${COUNTRY_AMBIENT[review.countryCode] ?? ""}, linear-gradient(135deg, #FFFFFF 0%, #FFF8F1 100%)`,
        border: `1px solid #F4D5B7`,
        borderRadius: "18px",
        padding: "28px 28px 22px",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        minHeight: "320px",
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        borderLeft: `3px solid ${ORANGE}`,
      }}
    >
      {/* Mouse glow overlay — desktop only via pointer:fine */}
      <div
        aria-hidden
        className="cv-mouse-glow"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "18px",
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(232,119,31,0.06) 0%, transparent 55%)`,
          transition: "background 0.1s ease",
        }}
      />

      {/* Decorative quote mark */}
      <span aria-hidden style={{
        position: "absolute", top: "12px", right: "20px",
        fontSize: "100px", lineHeight: 1, color: `${ORANGE}1A`,
        fontFamily: "Georgia, serif", userSelect: "none", pointerEvents: "none",
      }}>&ldquo;</span>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "18px", position: "relative" }}>
        <CircularAvatar countryCode={review.countryCode} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "15px", fontWeight: 700, color: TEXT_BRIGHT, fontFamily: FONT, marginBottom: "3px" }}>
            {review.displayName}
          </p>
          <p style={{ fontSize: "12px", color: TEXT_DIM, fontFamily: FONT, display: "flex", alignItems: "center", gap: "5px" }}>
            <FlagBadge countryCode={review.countryCode} size={16} />
            {review.countryName}
          </p>
        </div>
        {/* Nav arrows — top right */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "6px", flexShrink: 0 }}>
          {hasPrev && (
            <button
              onClick={onPrev}
              data-testid="button-stage-prev"
              aria-label="Previous review"
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                border: `1px solid ${BORDER_MID}`, background: "#FFFFFF",
                color: TEXT_MID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s, border-color 0.15s, color 0.15s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "#FFF4E8";
                b.style.borderColor = ORANGE;
                b.style.color = ORANGE;
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "#FFFFFF";
                b.style.borderColor = BORDER_MID;
                b.style.color = TEXT_MID;
              }}
            >
              <ChevronLeft size={15} />
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              data-testid="button-stage-next"
              aria-label="Next review"
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                border: `1px solid ${BORDER_MID}`, background: "#FFFFFF",
                color: TEXT_MID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s, border-color 0.15s, color 0.15s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "#FFF4E8";
                b.style.borderColor = ORANGE;
                b.style.color = ORANGE;
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "#FFFFFF";
                b.style.borderColor = BORDER_MID;
                b.style.color = TEXT_MID;
              }}
            >
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Review text */}
      <p style={{
        fontSize: "15.5px", color: TEXT_MID, lineHeight: 1.75,
        fontFamily: FONT, flex: 1, position: "relative",
      }}>
        {review.localizedText}
      </p>

      {/* Translation */}
      <EnglishTranslation text={review.englishText} open={translationOpen} />
      <TranslationToggle open={translationOpen} onToggle={onToggleTranslation} reviewId={review.id} />

      {/* Progress bar — only when multiple reviews to rotate */}
      {showProgress && (
        <div style={{ marginTop: "18px", background: BORDER_DIM, borderRadius: "2px", overflow: "hidden" }}>
          <div key={progressKey} className={`cv-progress${isPaused ? " paused" : ""}`} />
        </div>
      )}
    </div>
  );
}

/* ── Small review card (side + bottom) ──────────────────────────── */
function SmallReviewCard({
  review,
  onClick,
  isClickable,
  animDelay,
  translationOpen,
  onToggleTranslation,
}: {
  review: CommunityReview;
  onClick?: () => void;
  isClickable?: boolean;
  animDelay?: number;
  translationOpen: boolean;
  onToggleTranslation: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setGlowPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div
      data-testid={`card-review-${review.id}`}
      className="cv-card-anim"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={{
        "--cv-anim-delay": animDelay ? `${animDelay}ms` : "0ms",
        position: "relative",
        background: "#FFFFFF",
        border: `1px solid ${hovered ? "#C8D0DC" : "#E2E7ED"}`,
        borderRadius: "16px",
        padding: "20px 20px 16px",
        display: "flex", flexDirection: "column",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 32px rgba(15,23,42,0.10)"
          : "0 2px 8px rgba(15,23,42,0.05)",
        cursor: isClickable ? "pointer" : "default",
        overflow: "hidden",
      } as React.CSSProperties}
    >
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "16px",
        background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(232,119,31,0.05) 0%, transparent 55%)`,
        transition: "background 0.1s ease",
      }} />

      <span aria-hidden style={{
        position: "absolute", top: "6px", right: "14px",
        fontSize: "64px", lineHeight: 1, color: `${ORANGE}10`,
        fontFamily: "Georgia, serif", userSelect: "none", pointerEvents: "none",
      }}>&ldquo;</span>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "14px", position: "relative" }}>
        <CircularAvatar countryCode={review.countryCode} />
        <div>
          <p style={{ fontSize: "13.5px", fontWeight: 700, color: TEXT_BRIGHT, fontFamily: FONT, marginBottom: "2px" }}>
            {review.displayName}
          </p>
          <p style={{ fontSize: "11.5px", color: TEXT_DIM, fontFamily: FONT, display: "flex", alignItems: "center", gap: "4px" }}>
            <FlagBadge countryCode={review.countryCode} size={14} />
            {review.countryName}
          </p>
        </div>
      </div>

      <p style={{ fontSize: "13.5px", color: TEXT_MID, lineHeight: 1.68, fontFamily: FONT, flex: 1, position: "relative" }}>
        {review.localizedText}
      </p>

      <EnglishTranslation text={review.englishText} open={translationOpen} />
      <TranslationToggle open={translationOpen} onToggle={onToggleTranslation} reviewId={review.id} />
    </div>
  );
}

/* ── Community ticker ────────────────────────────────────────────── */
function CommunityTicker({ isPaused }: { isPaused: boolean }) {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      className="cv-ticker-wrap cv-hide-scroll"
      role="marquee"
      aria-label="Community reviews stream"
      style={{
        overflow: "hidden",
        borderBottom: `1px solid #E5E9EF`,
        padding: "10px 0",
        background: "#F4F6F8",
        position: "relative",
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="cv-ticker-track"
        style={{ animationPlayState: isPaused ? "paused" : "running" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              padding: "0 32px", whiteSpace: "nowrap",
              fontSize: "12px", color: "#7C8798", fontFamily: FONT,
            }}
          >
            <FlagBadge countryCode={item.countryCode} size={16} />
            <span style={{ fontWeight: 600, color: "#334155" }}>{item.displayName}</span>
            <span style={{ color: "#CBD2DC" }}>—</span>
            <span>{tickerExcerpt(item.localizedText)}</span>
            <span style={{ color: "#CBD2DC", margin: "0 8px", fontSize: "16px" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Country filter pills ────────────────────────────────────────── */
function CountryFilter({
  activeCode,
  counts,
  onSelect,
}: {
  activeCode: string;
  counts: Record<string, number>;
  onSelect: (code: string) => void;
}) {
  return (
    <div className="cv-hide-scroll" style={{ overflowX: "auto", paddingBottom: "2px" }}>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: "7px", minWidth: "max-content" }}
        role="group"
        aria-label="Country filter"
      >
        {COUNTRY_FILTERS.map((f) => {
          const isActive = activeCode === f.code;
          const count = f.code === "ALL" ? communityReviews.length : (counts[f.code] ?? 0);
          return (
            <button
              key={f.code}
              aria-pressed={isActive}
              onClick={() => onSelect(f.code)}
              data-testid={`filter-country-${f.code.toLowerCase()}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "7px 14px", borderRadius: "100px",
                border: `1px solid ${isActive ? ORANGE : "#DFE4EA"}`,
                background: isActive ? "#FFF4E8" : "#FFFFFF",
                color: isActive ? ORANGE : "#475569",
                fontSize: "13px", fontWeight: isActive ? 600 : 500, fontFamily: FONT,
                cursor: "pointer", whiteSpace: "nowrap", minHeight: "40px",
                transition: "background 0.15s, border-color 0.15s, color 0.15s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.borderColor = `${ORANGE}80`;
                  b.style.background = "#FFF9F4";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.borderColor = "#DFE4EA";
                  b.style.background = "#FFFFFF";
                }
              }}
            >
              {f.code !== "ALL" && <FlagBadge countryCode={f.code} size={16} />}
              <span>{f.name}</span>
              <span style={{
                fontSize: "11px", color: isActive ? ORANGE : TEXT_DIM,
                fontWeight: 600, minWidth: "14px", textAlign: "center",
                fontVariantNumeric: "tabular-nums",
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── CTA strip ───────────────────────────────────────────────────── */
function CommunityVoicesCTA() {
  return (
    <div style={{ marginTop: "64px", borderTop: `1px solid ${BORDER_DIM}`, paddingTop: "48px", textAlign: "center" }}>
      <p style={{
        fontSize: "11px", fontWeight: 700, color: ORANGE, textTransform: "uppercase",
        letterSpacing: "0.12em", marginBottom: "14px", fontFamily: FONT,
      }}>
        See the system first. Then make your decision.
      </p>
      <p style={{
        fontSize: "15px", color: TEXT_MID, lineHeight: 1.7,
        maxWidth: "480px", margin: "0 auto 28px", fontFamily: FONT,
      }}>
        Follow today's free pick, review past performance and evaluate the Bet Capitale approach for yourself.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
        <Link href="/today">
          <button
            data-testid="button-community-cta-freebet"
            style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              background: ORANGE, color: "#0c111c", fontWeight: 700,
              fontSize: "14px", padding: "13px 28px", borderRadius: "8px",
              border: "none", cursor: "pointer", fontFamily: FONT, minHeight: "44px",
            }}
          >
            View Free Pick <ArrowRight size={15} />
          </button>
        </Link>
        <Link href="/plans">
          <button
            data-testid="button-community-cta-paketler"
            style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              background: "#FFFFFF", color: TEXT_MID, fontWeight: 500,
              fontSize: "14px", padding: "13px 28px", borderRadius: "8px",
              border: `1px solid ${BORDER_MID}`, cursor: "pointer", fontFamily: FONT, minHeight: "44px",
            }}
          >
            View Memberships
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ── Pagination dots ─────────────────────────────────────────────── */
function PaginationDots({ total, current }: { total: number; current: number }) {
  if (total <= 1) return null;
  return (
    <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "14px" }} aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? "18px" : "6px", height: "6px",
            borderRadius: "3px", transition: "width 0.25s ease, background 0.2s ease",
            background: i === current ? ORANGE : "#DCE2E9",
          }}
        />
      ))}
    </div>
  );
}

/* ── Main section ────────────────────────────────────────────────── */
export default function CommunityVoicesSection() {
  const [activeCountry, setActiveCountry] = useState("ALL");
  const [mainIdx, setMainIdx] = useState(0);
  const [cardsFaded, setCardsFaded] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [openTranslations, setOpenTranslations] = useState<Set<number>>(new Set());
  const [isHoveringStage, setIsHoveringStage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /* prefers-reduced-motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Scroll into view */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Shuffle once per page load so every visit shows a different order */
  const shuffledAll = useMemo(
    () => [...communityReviews].sort(() => Math.random() - 0.5),
    [], // stable for the lifetime of this mount
  );

  /* Country pools */
  const isAllView = activeCountry === "ALL";
  // Derive featured from the already-shuffled list so ALL carousel order varies per page load
  const featuredReviews = shuffledAll.filter((r) => FEATURED_IDS.includes(r.id));
  const countryReviews = isAllView
    ? featuredReviews
    : shuffledAll.filter((r) => r.countryCode === activeCountry);
  const poolLength = countryReviews.length;
  const safeIdx = poolLength > 0 ? mainIdx % poolLength : 0;
  const mainReview = countryReviews[safeIdx];

  /* Side & bottom cards (Tümü view) */
  const sideCards = isAllView
    ? [featuredReviews[(safeIdx + 1) % 6], featuredReviews[(safeIdx + 2) % 6]]
    : countryReviews.filter((_, i) => i !== safeIdx).slice(0, 2);

  const bottomCards = isAllView
    ? [featuredReviews[(safeIdx + 3) % 6], featuredReviews[(safeIdx + 4) % 6], featuredReviews[(safeIdx + 5) % 6]]
    : [];

  /* Expanded grid: non-featured reviews (shuffled) */
  const expandedReviews = shuffledAll.filter((r) => !FEATURED_IDS.includes(r.id));

  /* Country counts */
  const counts: Record<string, number> = {};
  for (const r of communityReviews) counts[r.countryCode] = (counts[r.countryCode] ?? 0) + 1;

  /* Page Visibility API — reactive state so effects re-run on tab show/hide */
  const [isPageVisible, setIsPageVisible] = useState(() => typeof document !== "undefined" ? !document.hidden : true);
  useEffect(() => {
    const onVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /* Auto-play pause conditions */
  const mainTranslationOpen = mainReview ? openTranslations.has(mainReview.id) : false;
  const isPaused = isHoveringStage || mainTranslationOpen || reducedMotion || poolLength <= 1 || !isPageVisible;
  const tickerPaused = reducedMotion || !isPageVisible;

  /* Auto-rotate interval */
  useEffect(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setMainIdx((prev) => (prev + 1) % poolLength);
    }, 7000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, poolLength]);

  /* Reset mainIdx on filter change */
  const handleFilterChange = (code: string) => {
    if (code === activeCountry) return;
    setCardsFaded(false);
    setTimeout(() => {
      setActiveCountry(code);
      setMainIdx(0);
      setExpanded(false);
      setOpenTranslations(new Set());
      setCardsFaded(true);
    }, 120);
  };

  const toggleTranslation = (id: number) => {
    setOpenTranslations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* Progress bar key — remounts bar when card changes */
  const progressKey = `${activeCountry}-${safeIdx}`;

  /* Keyboard nav on main stage */
  const handleStageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && poolLength > 1) setMainIdx((p) => (p - 1 + poolLength) % poolLength);
    if (e.key === "ArrowRight" && poolLength > 1) setMainIdx((p) => (p + 1) % poolLength);
  };

  if (!mainReview) return null;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <section
        id="community-voices"
        ref={sectionRef}
        style={{
          background: "transparent",
          overflowX: "hidden",
          marginTop: "calc(max(-40px, -4vw))",
          position: "relative",
          zIndex: 1,
          padding: "0 24px 0",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.55s ease, transform 0.55s ease",
        }}
      >
        {/* ── Bounded light panel ── */}
        <div
          className="mx-auto"
          style={{
            maxWidth: "1160px",
            background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
            borderRadius: "28px 28px 0 0",
            boxShadow: "0 18px 55px rgba(15,23,42,0.08), 0 -2px 0 0 rgba(15,23,42,0.04)",
            borderTop: `2px solid ${ORANGE}`,
            border: `1px solid #E6EAF0`,
            borderTopColor: ORANGE,
            overflow: "hidden",
          }}
        >
        {/* Community stream ticker */}
        <CommunityTicker isPaused={tickerPaused} />

        <div style={{ padding: "48px 32px 80px" }}>

          {/* ── Section header ────────────────────────────────────── */}
          <div style={{ marginBottom: "40px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "20px" }}>
            <div>
              <p style={{
                fontSize: "10.5px", fontWeight: 700, color: ORANGE, textTransform: "uppercase",
                letterSpacing: "0.14em", marginBottom: "12px", fontFamily: FONT,
                display: "flex", alignItems: "center", gap: "7px",
              }}>
                <MessageSquare size={12} strokeWidth={2.5} />
                BET CAPITALE COMMUNITY
              </p>
              <h2 style={{
                fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800,
                color: TEXT_BRIGHT, lineHeight: 1.12, letterSpacing: "-0.025em",
                fontFamily: FONT, marginBottom: "12px", maxWidth: "560px",
              }}>
                <span style={{ display: "block" }}>They tried it.</span>
                <span style={{ display: "block" }}>They shared their</span>
                <span style={{ display: "block" }}>experience in their own words.</span>
              </h2>
              <p style={{ fontSize: "14.5px", color: TEXT_MID, lineHeight: 1.65, maxWidth: "460px", fontFamily: FONT, marginBottom: "20px" }}>
                Explore the diverse experiences of the Bet Capitale community from 7 countries.
              </p>
              <div style={{ display: "flex", gap: "20px" }}>
                {[{ value: String(communityReviews.length), label: "Reviews" }, { value: "7", label: "Countries" }].map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
                    <span style={{ fontSize: "24px", fontWeight: 800, color: TEXT_BRIGHT, fontFamily: FONT, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                      {s.value}
                    </span>
                    <span style={{ fontSize: "12px", color: TEXT_DIM, fontFamily: FONT }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Country filter ─────────────────────────────────────── */}
          <div style={{ marginBottom: "32px" }}>
            <CountryFilter activeCode={activeCountry} counts={counts} onSelect={handleFilterChange} />
          </div>

          {/* ── Stage + cards ──────────────────────────────────────── */}
          <div
            style={{
              opacity: cardsFaded ? 1 : 0,
              transition: "opacity 0.12s ease",
            }}
          >
            {/* ── Main stage (bento desktop) ── */}
            <div
              aria-live="polite"
              aria-atomic="false"
              onMouseEnter={() => setIsHoveringStage(true)}
              onMouseLeave={() => setIsHoveringStage(false)}
              onKeyDown={handleStageKeyDown}
              tabIndex={0}
              style={{ outline: "none" }}
            >
              {/* Desktop bento: large + side cards */}
              <div
                className="hidden lg:grid"
                style={{ gridTemplateColumns: "1fr 0.56fr", gap: "14px", marginBottom: "14px" }}
              >
                {/* Large card */}
                <LargeReviewCard
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

                {/* Side cards column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {sideCards.map((card, i) => (
                    <SmallReviewCard
                      key={`${card.id}-${activeCountry}`}
                      review={card}
                      onClick={() => {
                        const newIdx = countryReviews.findIndex((r) => r.id === card.id);
                        if (newIdx !== -1) setMainIdx(newIdx);
                      }}
                      isClickable
                      animDelay={i * 60}
                      translationOpen={openTranslations.has(card.id)}
                      onToggleTranslation={() => toggleTranslation(card.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop bottom row (Tümü view only) */}
              {isAllView && bottomCards.length > 0 && (
                <div className="hidden lg:grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  {bottomCards.map((card, i) => (
                    <SmallReviewCard
                      key={`${card.id}-${activeCountry}`}
                      review={card}
                      onClick={() => {
                        const newIdx = countryReviews.findIndex((r) => r.id === card.id);
                        if (newIdx !== -1) setMainIdx(newIdx);
                      }}
                      isClickable
                      animDelay={i * 60}
                      translationOpen={openTranslations.has(card.id)}
                      onToggleTranslation={() => toggleTranslation(card.id)}
                    />
                  ))}
                </div>
              )}

              {/* Mobile: featured card + pagination + side cards below */}
              <div className="lg:hidden">
                <LargeReviewCard
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
                <PaginationDots total={poolLength} current={safeIdx} />
              </div>
            </div>

            {/* ── Expand / Collapse ─────────────────────────────────── */}
            {isAllView && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "28px" }}>
                <button
                  onClick={() => { setExpanded((v) => !v); if (expanded) setOpenTranslations(new Set()); }}
                  data-testid="button-expand-reviews"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "11px 28px", borderRadius: "100px",
                    border: `1px solid ${BORDER_DIM}`, background: "#FFFFFF",
                    color: TEXT_MID, fontSize: "13.5px", fontWeight: 600, fontFamily: FONT,
                    cursor: "pointer", minHeight: "44px",
                    transition: "background 0.15s, border-color 0.15s, color 0.15s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "#FFF4E8";
                    b.style.borderColor = ORANGE;
                    b.style.color = ORANGE;
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "#FFFFFF";
                    b.style.borderColor = BORDER_DIM;
                    b.style.color = TEXT_MID;
                  }}
                >
                  <ChevronDown size={15} style={{ transition: "transform 0.25s ease", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
                  {expanded ? "Show Less" : "View All Reviews"}
                </button>
              </div>
            )}

            {/* ── Expanded grid (17 non-featured reviews) ─────────────── */}
            {expanded && isAllView && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                style={{ marginTop: "24px" }}
              >
                {expandedReviews.map((review, idx) => (
                  <SmallReviewCard
                    key={review.id}
                    review={review}
                    animDelay={idx * 45}
                    translationOpen={openTranslations.has(review.id)}
                    onToggleTranslation={() => toggleTranslation(review.id)}
                  />
                ))}
              </div>
            )}

            {/* Country filter: show all that country's reviews (non-stage) */}
            {!isAllView && countryReviews.length > 3 && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                style={{ marginTop: "24px" }}
              >
                {countryReviews.filter((r, i) => i !== safeIdx && !sideCards.some((s) => s.id === r.id)).map((review, idx) => (
                  <SmallReviewCard
                    key={review.id}
                    review={review}
                    animDelay={idx * 45}
                    translationOpen={openTranslations.has(review.id)}
                    onToggleTranslation={() => toggleTranslation(review.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── CTA + Disclaimer — hidden on mobile (shown at bottom of MobileHomePage) */}
          <div className="community-desktop-cta">
            <CommunityVoicesCTA />

            <p style={{
              marginTop: "32px", fontSize: "11.5px", color: TEXT_DIM,
              lineHeight: 1.65, textAlign: "center", maxWidth: "640px",
              margin: "32px auto 0", fontFamily: FONT,
            }}>
              Reviews are adapted from common themes in past community feedback and presented across different languages. Names are abbreviated for privacy.
            </p>
          </div>
        </div>
        </div>{/* end bounded panel */}
      </section>
    </>
  );
}
