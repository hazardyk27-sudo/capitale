import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Info, Users } from "lucide-react";
import { useRef, useEffect, useState, useLayoutEffect } from "react";

/* ── Design tokens ─────────────────────────────────────────────── */
const CYAN    = "#E8771F";
const SUCCESS = "#1DBB67";
const TEXT    = "#08090B";
const TEXT2   = "#606774";
const BORDER  = "#E5E7EB";

/* ── Global CSS ─────────────────────────────────────────────────── */
const PANEL_CSS = `
  @keyframes lcPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.25; }
  }
  .lc-pulse { animation: lcPulse 2.4s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .lc-digit-inner { transition: none !important; }
    .lc-pulse { animation: none !important; }
  }

  /* Mobile panel sizing */
  @media (max-width: 767px) {
    [data-testid="card-live-community-panel"] {
      padding: 22px 18px 20px !important;
      border-radius: 20px !important;
      max-width: none !important;
    }
    .lc-stat-card {
      height: 86px !important;
      padding: 10px 6px !important;
    }
    .lc-stat-label {
      font-size: 9px !important;
    }
    .lc-stat-value {
      font-size: 22px !important;
    }
    .lc-card-header-text {
      font-size: 15px !important;
    }
  }
`;

/* ── Responsive digit height hook ───────────────────────────────── */
function useDigitH(): number {
  const [h, setH] = useState(104);
  useLayoutEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 767) {
        // matches clamp(76px, 22vw, 96px)
        setH(Math.round(Math.min(96, Math.max(76, w * 0.22))));
      } else {
        setH(104);
      }
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return h;
}

/* ── Flip-style digit cell ──────────────────────────────────────── */
function OdometerDigitDark({ digit, digitH }: { digit: number; digitH: number }) {
  const fontSize = digitH <= 80
    ? `clamp(40px, 13vw, 56px)`
    : "58px";

  return (
    <div style={{ position: "relative", width: "100%", minWidth: 0 }}>
      {/* Digit scroll container */}
      <span
        style={{
          display: "block",
          width: "100%",
          height: `${digitH}px`,
          background: "#111111",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}
      >
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            transform: `translateY(${-digit * digitH}px)`,
            transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
          className="lc-digit-inner"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <span
              key={d}
              style={{
                display: "block",
                width: "100%",
                height: `${digitH}px`,
                lineHeight: `${digitH}px`,
                textAlign: "center",
                fontSize,
                fontWeight: 900,
                color: "#FFFFFF",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              {d}
            </span>
          ))}
        </span>
      </span>
      {/* Split-flap divider line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "3px",
          right: "3px",
          height: "1px",
          background: "rgba(255,255,255,0.18)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </div>
  );
}

/* Always renders exactly 4 digit cells in a CSS grid */
function OdometerDark({ value, digitH }: { value: number; digitH: number }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 767;
  const gap = isMobile ? "8px" : "12px";

  // Pad to 4 digits with leading zeros (handles 0–9999)
  const clamped = Math.max(0, Math.min(value, 9999));
  const digits = clamped.toString().padStart(4, "0").split("").map(Number);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap,
        width: "100%",
      }}
    >
      {digits.map((d, i) => (
        <OdometerDigitDark key={i} digit={d} digitH={digitH} />
      ))}
    </div>
  );
}

/* ── Community Metric Cards ─────────────────────────────────────── */
function MetricCard({
  label,
  value,
  type,
}: {
  label: string;
  value: number;
  type: "active" | "today" | "week";
}) {
  const prefix = type === "active" ? "" : "+";
  const valueColor = type === "active" ? TEXT : CYAN;
  return (
    <div
      className="lc-stat-card"
      style={{
        flex: 1,
        background: "#FFFFFF",
        borderRadius: "12px",
        padding: "12px",
        border: `1px solid ${BORDER}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        minWidth: 0,
        height: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {type === "active" ? (
          <span
            className="lc-pulse"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: SUCCESS,
              flexShrink: 0,
            }}
          />
        ) : (
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M6 10V2M6 2L2 6M6 2l4 4"
              stroke={CYAN}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span
          className="lc-stat-label"
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: TEXT2,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            fontFamily: "'Manrope', sans-serif",
            lineHeight: 1.2,
            whiteSpace: "pre-line",
          }}
        >
          {label}
        </span>
      </div>
      <div
        className="lc-stat-value"
        style={{
          fontSize: "22px",
          fontWeight: 900,
          color: valueColor,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.03em",
          fontFamily: "'Manrope', sans-serif",
          lineHeight: 1,
        }}
      >
        {prefix}
        {value.toLocaleString("en-US")}
      </div>
    </div>
  );
}

/* ── easeOutQuart ───────────────────────────────────────────────── */
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/* ── Main Panel ─────────────────────────────────────────────────── */
interface CommunityStats {
  totalMembers: number;
  currentlyActive: number;
  todayIncrease: number;
  weekIncrease: number;
}

export default function LiveCommunityPanel() {
  const { data } = useQuery<CommunityStats>({
    queryKey: ["/api/community/stats"],
    refetchInterval: 15_000,
  });

  const digitH = useDigitH();
  const currentlyActive = data?.currentlyActive ?? 128;
  const todayIncrease   = data?.todayIncrease   ?? 4;
  const weekIncrease    = data?.weekIncrease     ?? 19;

  /* ── Counter open animation ──────────────────────────────────── */
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!data) return;
    const target = data.totalMembers ?? 1247;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasAnimated.current) {
      hasAnimated.current = true;

      if (reducedMotion) {
        setDisplayValue(target);
        return;
      }

      const duration = 2500;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = Math.min(now - startTime, duration);
        const progress = easeOutQuart(elapsed / duration);
        setDisplayValue(Math.round(progress * target));
        if (elapsed < duration) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayValue(target);
        }
      };
      rafRef.current = requestAnimationFrame(tick);

      return () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    } else {
      setDisplayValue(target);
    }
  }, [data]);

  return (
    <>
      <style>{PANEL_CSS}</style>

      <div
        data-testid="card-live-community-panel"
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "30px 32px 28px",
          fontFamily: "'Manrope', sans-serif",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
          border: `1px solid ${BORDER}`,
          boxSizing: "border-box",
        }}
      >
        {/* ── Card header ─────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(232,119,31,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Users size={18} color={CYAN} />
          </div>
          <span
            className="lc-card-header-text"
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: TEXT,
              fontFamily: "'Manrope', sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            Total Bet Capitale Members
          </span>
        </div>

        {/* ── Flip counter (always 4 grid cells) ──────────────── */}
        <div style={{ marginBottom: "14px" }}>
          <OdometerDark value={displayValue} digitH={digitH} />
        </div>

        {/* ── Three metric mini-cards ─────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <MetricCard label={"CURRENTLY\nACTIVE"} value={currentlyActive} type="active" />
          <MetricCard label="TODAY" value={todayIncrease} type="today" />
          <MetricCard label={"THIS\nWEEK"} value={weekIncrease} type="week" />
        </div>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <Link href="/plans">
          <button
            data-testid="button-live-community-cta"
            style={{
              width: "100%",
              height: "56px",
              background: CYAN,
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "16px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontFamily: "'Manrope', sans-serif",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
              boxShadow: "0 4px 14px rgba(232,119,31,0.28)",
              marginTop: "18px",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.transform = "translateY(-2px)";
              b.style.boxShadow = "0 8px 22px rgba(232,119,31,0.38)";
              const arrow = b.querySelector<HTMLSpanElement>(".lc-cta-arrow");
              if (arrow) arrow.style.transform = "translateX(3px)";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.transform = "translateY(0)";
              b.style.boxShadow = "0 4px 14px rgba(232,119,31,0.28)";
              const arrow = b.querySelector<HTMLSpanElement>(".lc-cta-arrow");
              if (arrow) arrow.style.transform = "translateX(0)";
            }}
          >
            Join the Community
            <span
              className="lc-cta-arrow"
              style={{ display: "inline-flex", transition: "transform 0.18s ease" }}
            >
              <ArrowRight size={16} />
            </span>
          </button>
        </Link>

        {/* ── Disclaimer ──────────────────────────────────────── */}
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <Info
            size={11}
            style={{ color: CYAN, flexShrink: 0, marginTop: "1px" }}
          />
          <p
            style={{
              fontSize: "12px",
              color: TEXT2,
              fontWeight: 500,
              fontFamily: "'Manrope', sans-serif",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Member count updates in real time throughout the day.
          </p>
        </div>
      </div>
    </>
  );
}
