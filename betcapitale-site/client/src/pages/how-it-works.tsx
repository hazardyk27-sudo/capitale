import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import { ChevronRight, ChevronDown, ArrowRight } from "lucide-react";
import preMatchImg from "@assets/UH-2088659256-W_1784125864336.png";
import settledImg from "@assets/UH-2088659256-W_(1)_1784125899473.png";

/* ── Design tokens ─────────────────────────────────────────────── */
const BG      = "#F7F7F5";
const NAVY    = "#071B33";
const ORANGE  = "#F47A12";
const TEXT2   = "#667085";
const BORDER  = "#E2E5E9";
const SOFT    = "#F0F2F4";
const WHITE   = "#ffffff";

/* ── Navigation data ───────────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: "profit-logic",  short: "Profit Logic",             full: "Profit Logic",                   desc: "See how the daily total result is evaluated instead of individual coupons." },
  { id: "analysis",      short: "Software Analysis",        full: "Software Analysis",              desc: "Explore which data layers are used to scan matches." },
  { id: "filtering",     short: "Filtering",                full: "Algorithmic Filtering",          desc: "See how suitable candidates are selected from hundreds of matches." },
  { id: "building",      short: "Building Coupons",         full: "Building Coupons",               desc: "See how picks are combined using odds, risk and potential return." },
  { id: "transparency",  short: "Transparency",             full: "Transparency & Proof",          desc: "See how coupons are recorded before the match starts." },
  { id: "archive",       short: "Archive",                  full: "Results & Archive",             desc: "See how all winning, losing and voided records are stored." },
  { id: "membership",    short: "Membership",               full: "What Do Members Access?",        desc: "Compare Standard and Premium membership scopes." },
];

/* ── Helpers ────────────────────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "14px" }}>
      {children}
    </p>
  );
}

/* ── Hero — Right data card ─────────────────────────────────────── */
function DailyBalanceCard() {
  return (
    <div style={{
      background: NAVY, borderRadius: "16px", padding: "clamp(24px,4vw,36px)",
      border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 24px 64px rgba(7,27,51,0.22)",
    }}>
      <p style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "20px" }}>
        DAILY BALANCE APPROACH
      </p>

      <div style={{ marginBottom: "8px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "14px" }}>4 coupons published</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)" }}>3 losing coupons</span>
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "rgba(239,68,68,0.85)" }}>−€300</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)" }}>1 winning coupon</span>
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>+€620</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Daily net result</span>
        <span style={{ fontSize: "22px", fontWeight: 800, color: ORANGE, letterSpacing: "-0.02em" }}>+€320</span>
      </div>

      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        This example only illustrates the system approach. Actual results vary based on coupon odds and performance.
      </p>
    </div>
  );
}

/* ── Hero Section ───────────────────────────────────────────────── */
function HeroSection({ onScrollToKar }: { onScrollToKar: () => void }) {
  return (
    <section style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px) clamp(48px,6vw,72px)", borderBottom: `1px solid ${BORDER}`, background: WHITE }}>
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
        <div className="flex flex-col lg:flex-row lg:items-center" style={{ gap: "clamp(40px,6vw,80px)" }}>

          {/* LEFT — copy */}
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: "20px" }}>
              BET CAPITALE SYSTEM
            </p>

            <h1 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 800, color: NAVY, lineHeight: 1.12, letterSpacing: "-0.03em", marginBottom: "0" }}>
              Not every coupon needs to win.
            </h1>
            <h1 style={{
              fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 800, color: NAVY, lineHeight: 1.12,
              letterSpacing: "-0.03em", marginBottom: "24px",
              borderBottom: `3px solid ${ORANGE}`, display: "inline-block", paddingBottom: "4px",
            }}>
              The right system needs to make the daily total profitable.
            </h1>

            <p style={{ fontSize: "clamp(15px,1.8vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "580px", marginBottom: "32px" }}>
              Bet Capitale analyses football matches using our proprietary software and highlights selections meeting defined criteria. We evaluate coupons as a daily total balance, not individually. Our goal is to combine sufficient accuracy with the right odds and stake distribution to offer our members consistent daily profit opportunities.
            </p>

            <div className="flex flex-col sm:flex-row" style={{ gap: "12px", marginBottom: "28px" }}>
              <button
                onClick={onScrollToKar}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  background: ORANGE, color: WHITE,
                  padding: "14px 24px", borderRadius: "8px", border: "none",
                  fontSize: "14px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.01em",
                  transition: "opacity 0.15s", width: "100%",
                }}
                data-testid="btn-hero-primary"
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Explore the Profit Logic
                <ArrowRight size={16} />
              </button>
              <Link href="/history" className="w-full sm:w-auto">
                <button
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    background: "transparent", color: NAVY,
                    padding: "14px 24px", borderRadius: "8px", border: `1.5px solid ${BORDER}`,
                    fontSize: "14px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.01em",
                    transition: "border-color 0.15s", width: "100%",
                  }}
                  data-testid="btn-hero-secondary"
                  onMouseEnter={e => (e.currentTarget.style.borderColor = ORANGE)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
                >
                  View Past Performance
                </button>
              </Link>
            </div>

            {/* Trust line */}
            <div className="flex flex-wrap" style={{ gap: "6px 0", rowGap: "4px" }}>
              {["Pre-match publication", "Timestamped record", "Non-deletable result history", "Open balance sheet"].map((item, i, arr) => (
                <span key={i} style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: TEXT2 }}>{item}</span>
                  {i < arr.length - 1 && <span style={{ margin: "0 10px", color: BORDER, fontSize: "14px" }}>·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — data card */}
          <div className="w-full lg:flex-none lg:w-[400px]">
            <DailyBalanceCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Sticky subnav ──────────────────────────────────────────────── */
function StickySubNav({ activeId, onNav }: { activeId: string; onNav: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <nav
      aria-label="Page navigation"
      className="hidden md:block"
      style={{
        position: "sticky", top: "68px", zIndex: 40,
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div className="mx-auto flex items-center" style={{ maxWidth: "1200px", height: "46px", padding: "0 40px", gap: "4px", overflowX: "auto" }}>
        {NAV_SECTIONS.map((s) => {
          const active = activeId === s.id;
          const isHov = hovered === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onNav(s.id)}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              aria-current={active ? "location" : undefined}
              style={{
                position: "relative", background: "none", border: "none", cursor: "pointer",
                padding: "0 12px", height: "46px", flexShrink: 0,
                fontSize: "12.5px", fontWeight: active ? 600 : 500,
                color: active ? ORANGE : isHov ? NAVY : TEXT2,
                transition: "color 0.15s", fontFamily: "'Manrope', sans-serif",
              }}
              data-testid={`subnav-${s.id}`}
            >
              {s.short}
              {active && (
                <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "20px", height: "2px", background: ORANGE, borderRadius: "2px" }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Mobile Topic Drawer ────────────────────────────────────────── */
function MobileTopicDrawer({ activeId, onNav }: { activeId: string; onNav: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const activeSection = NAV_SECTIONS.find((s) => s.id === activeId);

  function handleNav(id: string) {
    onNav(id);
    setOpen(false);
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="md:hidden"
          style={{ position: "fixed", inset: 0, zIndex: 39 }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Topic drawer trigger bar */}
      <div
        className="md:hidden"
        style={{
          position: "sticky",
          top: "72px",
          zIndex: 40,
          backgroundColor: "rgba(255,255,255,0.97)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="listbox"
          data-testid="button-mobile-topics"
          style={{
            width: "100%", display: "flex", alignItems: "center",
            gap: "8px", padding: "10px 16px",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Manrope', sans-serif", textAlign: "left",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 700, color: NAVY }}>Topics</span>
          {activeSection && (
            <>
              <span style={{ fontSize: "12px", color: BORDER }}>·</span>
              <span style={{
                fontSize: "12px", fontWeight: 600, color: ORANGE,
                flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {activeSection.short}
              </span>
            </>
          )}
          <ChevronDown
            size={14}
            style={{
              color: TEXT2, flexShrink: 0, marginLeft: "auto",
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.15s",
            }}
          />
        </button>

        {/* Dropdown panel — absolute inside sticky wrapper */}
        {open && (
          <div
            role="listbox"
            aria-label="Select section"
            style={{
              position: "absolute", top: "100%", left: 0, right: 0,
              background: WHITE,
              border: `1px solid ${BORDER}`,
              borderTop: `1px solid ${BORDER}`,
              boxShadow: "0 8px 24px rgba(7,27,51,0.12)",
              zIndex: 42,
            }}
          >
            {NAV_SECTIONS.map((s, idx) => {
              const active = activeId === s.id;
              return (
                <button
                  key={s.id}
                  role="option"
                  aria-selected={active}
                  onClick={() => handleNav(s.id)}
                  data-testid={`mobile-topic-${s.id}`}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    width: "100%", padding: "13px 16px",
                    background: active ? "rgba(244,122,18,0.05)" : WHITE,
                    border: "none",
                    borderBottom: idx < NAV_SECTIONS.length - 1 ? `1px solid ${BORDER}` : "none",
                    cursor: "pointer", textAlign: "left",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  <span style={{ fontSize: "10px", fontWeight: 800, color: ORANGE, letterSpacing: "0.06em", flexShrink: 0, width: "20px" }}>
                    0{idx + 1}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: active ? 700 : 500, color: active ? NAVY : TEXT2, flex: 1, textAlign: "left" }}>
                    {s.short}
                  </span>
                  {active && (
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ── Topic Index ────────────────────────────────────────────────── */
function TopicIndex({ onNav }: { onNav: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <section
      id="on-this-page"
      style={{ padding: "clamp(48px,7vw,72px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: BG, scrollMarginTop: "132px" }}
      data-testid="section-topic-index"
    >
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
        <Eyebrow>ON THIS PAGE</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", background: BORDER }}>
          {NAV_SECTIONS.map((s, i) => {
            const isHov = hovered === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onNav(s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  textAlign: "left", background: isHov ? "#f9f9f8" : WHITE,
                  border: "none", cursor: "pointer",
                  padding: "clamp(20px,3vw,28px) clamp(20px,3vw,28px)",
                  transition: "background 0.15s",
                  fontFamily: "'Manrope', sans-serif",
                  display: "flex", flexDirection: "column", gap: "8px",
                }}
                data-testid={`topic-card-${s.id}`}
              >
                <span style={{ fontSize: "10px", fontWeight: 800, color: ORANGE, letterSpacing: "0.06em" }}>0{i + 1}</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>{s.full}</span>
                <span style={{ fontSize: "13px", color: TEXT2, lineHeight: 1.6 }}>{s.desc}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: ORANGE, fontWeight: 600, marginTop: "4px" }}>
                  Explore <ChevronRight size={13} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Kâr Mantığı Section ────────────────────────────────────────── */
function KarMantigiSection({ onBack }: { onBack: () => void }) {
  return (
    <section
      id="profit-logic"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: WHITE, scrollMarginTop: "132px" }}
      data-testid="section-kar-mantigi"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>STRATEGY</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "24px", maxWidth: "720px" }}>
          The goal is not to win every coupon,<br />
          but to make the daily total profitable.
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "660px", marginBottom: "40px" }}>
          The Bet Capitale system does not operate on the assumption that every coupon will win. The number of coupons, total odds, stake distribution and potential return are all considered together. On some days, only one of the published coupons hitting may be enough to close the daily total in profit.
        </p>

        {/* Quote card */}
        <div style={{
          borderLeft: `4px solid ${ORANGE}`, background: "#fdf8f4",
          borderRadius: "0 12px 12px 0", padding: "clamp(20px,4vw,32px) clamp(20px,4vw,36px)",
          marginBottom: "48px", maxWidth: "720px",
        }}>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", fontWeight: 700, color: NAVY, lineHeight: 1.55, fontStyle: "italic", margin: 0 }}>
            "Not every coupon may win.<br />
            The strategy aims for the winning coupon to cover the losers and leave a return on top."
          </p>
        </div>

        {/* Three principle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "16px", marginBottom: "40px" }}>
          {[
            {
              num: "01", title: "Oran Dengesi",
              text: "High total return potential and coupon risk are evaluated together.",
            },
            {
              num: "02", title: "Stake Distribution",
              text: "Rather than tying the entire budget to a single outcome, coupons are treated as part of the overall strategy.",
            },
            {
              num: "03", title: "Daily Balance",
              text: "Performance is measured on the day's total result, not a single coupon.",
            },
          ].map((card) => (
            <div key={card.num} style={{
              background: BG, border: `1px solid ${BORDER}`,
              borderRadius: "12px", padding: "24px 24px",
            }}>
              <span style={{ fontSize: "11px", fontWeight: 800, color: ORANGE, letterSpacing: "0.06em", display: "block", marginBottom: "10px" }}>{card.num}</span>
              <p style={{ fontSize: "15px", fontWeight: 700, color: NAVY, marginBottom: "8px" }}>{card.title}</p>
              <p style={{ fontSize: "13.5px", color: TEXT2, lineHeight: 1.65, margin: 0 }}>{card.text}</p>
            </div>
          ))}
        </div>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Yazılım Analizi Section ────────────────────────────────────── */
function AnalizSection({ onBack }: { onBack: () => void }) {
  const dataCards = [
    { title: "Past Performance", text: "Teams and players' previous matches, form and comparable fixtures are examined." },
    { title: "Odds Movements",     text: "Opening odds, drifts, direction changes and market reactions are tracked." },
    { title: "Money Flow",          text: "Betting volume, staked amounts and unusual money movements are assessed." },
    { title: "Squad & News",         text: "Injuries, suspensions, rotations and the latest pre-match news are reviewed." },
    { title: "Match Conditions",     text: "Weather, pitch conditions, fixture congestion and away-game effects are factored in." },
    { title: "Referee & Player Data", text: "Referee tendencies, player performances and critical individual statistics are compared." },
  ];

  return (
    <section
      id="analysis"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: BG, scrollMarginTop: "132px" }}
      data-testid="section-analiz"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>SOFTWARE ANALYSIS</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px", maxWidth: "760px" }}>
          Behind the profit target, there are no superficial guesses —<br />
          only multi-layered match analysis.
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "640px", marginBottom: "48px" }}>
          Our proprietary software scans football matches through different data layers every day. The goal is not simply to pick popular teams, but to identify matches that stand out statistically and from a market perspective.
        </p>

        {/* 2x3 data grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", background: BORDER, marginBottom: "48px" }}>
          {dataCards.map((card, i) => (
            <div key={i} style={{ background: WHITE, padding: "clamp(20px,3vw,28px)" }}>
              <p style={{ fontSize: "13px", fontWeight: 800, color: NAVY, marginBottom: "8px", letterSpacing: "-0.01em" }}>{card.title}</p>
              <p style={{ fontSize: "13px", color: TEXT2, lineHeight: 1.65, margin: 0 }}>{card.text}</p>
            </div>
          ))}
        </div>

        {/* Bottom statement */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "32px", maxWidth: "520px" }}>
          {["We collect the data.", "We filter it.", "We compare it with market movements.", "We make the final call using the system approach."].map((line, i) => (
            <p key={i} style={{ fontSize: "clamp(16px,2vw,20px)", fontWeight: 700, color: i === 3 ? ORANGE : NAVY, lineHeight: 1.5, margin: "0 0 4px" }}>
              {line}
            </p>
          ))}
        </div>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Filtreleme Section ─────────────────────────────────────────── */
function FiltrelemeSection({ onBack }: { onBack: () => void }) {
  const funnelSteps = [
    { label: "All Matches",          desc: "All of the day's fixtures are scanned." },
    { label: "Data Check",           desc: "Past performance, form and squad data are reviewed." },
    { label: "Market Check",         desc: "Data direction is compared with odds movements and money flow." },
    { label: "Risk & Odds Check",    desc: "Whether the potential return justifies the risk taken is evaluated." },
    { label: "Coupon Candidates",    desc: "Selections that pass the criteria are converted into coupons.", highlight: true },
  ];

  return (
    <section
      id="filtering"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: WHITE, scrollMarginTop: "132px" }}
      data-testid="section-filtreleme"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>FILTERING</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px", maxWidth: "600px" }}>
          Not every match makes it into a coupon.
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "640px", marginBottom: "48px" }}>
          Not every match reviewed by the software is published. Fixtures that do not meet the defined thresholds, have insufficient data quality, or do not show a suitable risk-return balance are filtered out.
        </p>

        {/* Funnel visualization — mobile vertical, desktop horizontal */}
        <div className="hidden md:flex" style={{ alignItems: "stretch", marginBottom: "48px", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
          {funnelSteps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                flex: 1, padding: "24px 20px",
                background: step.highlight ? `rgba(244,122,18,0.06)` : WHITE,
                borderRight: i < funnelSteps.length - 1 ? `1px solid ${BORDER}` : "none",
                height: "100%", display: "flex", flexDirection: "column", gap: "8px",
              }}>
                <p style={{ fontSize: "13px", fontWeight: 800, color: step.highlight ? ORANGE : NAVY, lineHeight: 1.3, margin: 0 }}>
                  {step.label}
                </p>
                <p style={{ fontSize: "12px", color: TEXT2, lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
              </div>
              {i < funnelSteps.length - 1 && (
                <div style={{ padding: "0 2px", color: TEXT2, flexShrink: 0 }}>
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile — vertical list */}
        <div className="md:hidden" style={{ marginBottom: "48px", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
          {funnelSteps.map((step, i) => (
            <div key={i} style={{
              padding: "18px 20px",
              background: step.highlight ? `rgba(244,122,18,0.06)` : WHITE,
              borderBottom: i < funnelSteps.length - 1 ? `1px solid ${BORDER}` : "none",
              display: "flex", alignItems: "flex-start", gap: "14px",
            }}>
              {i < funnelSteps.length - 1 && (
                <ArrowRight size={14} style={{ color: TEXT2, flexShrink: 0, marginTop: "3px" }} />
              )}
              {i === funnelSteps.length - 1 && (
                <span style={{ width: "14px", flexShrink: 0 }} />
              )}
              <div>
                <p style={{ fontSize: "13px", fontWeight: 800, color: step.highlight ? ORANGE : NAVY, marginBottom: "4px" }}>{step.label}</p>
                <p style={{ fontSize: "12.5px", color: TEXT2, lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Final emphasis */}
        <div style={{ borderLeft: `4px solid ${ORANGE}`, paddingLeft: "20px", maxWidth: "560px" }}>
          <p style={{ fontSize: "clamp(15px,1.9vw,18px)", fontWeight: 700, color: NAVY, lineHeight: 1.55, margin: 0 }}>
            The goal is not to produce more coupons,<br />
            but only to highlight the opportunities that meet the criteria.
          </p>
        </div>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Kuponların Oluşturulması Section ──────────────────────────── */
function OlusturmaSection({ onBack }: { onBack: () => void }) {
  const steps = [
    { num: "01", title: "Candidates Identified",   text: "Matches highlighted by the software are passed through a final review." },
    { num: "02", title: "Odds & Risk Assessed",    text: "Each pick is considered together with its impact on the total coupon odds and potential return." },
    { num: "03", title: "Coupons Published",          text: "Coupons are shared with members before the first match starts." },
    { num: "04", title: "Daily Result Measured",    text: "Performance is evaluated not just by individual coupons, but by the total daily balance." },
  ];

  return (
    <section
      id="building"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: BG, scrollMarginTop: "132px" }}
      data-testid="section-olusturma"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>BUILDING COUPONS</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px", maxWidth: "720px" }}>
          Picks are not prepared individually,<br />
          but as parts of the same daily strategy.
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "640px", marginBottom: "48px" }}>
          Filtered matches are converted into coupons taking odds balance, number of coupons, potential return and total daily risk into account.
        </p>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", marginBottom: "48px" }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "20px",
              padding: "clamp(20px,3vw,28px) clamp(20px,3vw,32px)",
              background: WHITE,
              borderBottom: i < steps.length - 1 ? `1px solid ${BORDER}` : "none",
            }}>
              <span style={{
                flexShrink: 0, width: "36px", height: "36px", borderRadius: "50%",
                background: `rgba(244,122,18,0.1)`, color: ORANGE,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 800, letterSpacing: "0.04em",
              }}>
                {step.num}
              </span>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: NAVY, marginBottom: "6px" }}>{step.title}</p>
                <p style={{ fontSize: "14px", color: TEXT2, lineHeight: 1.65, margin: 0 }}>{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing line */}
        <p style={{ fontSize: "clamp(16px,2vw,20px)", fontWeight: 700, color: NAVY, lineHeight: 1.55, maxWidth: "560px", margin: 0 }}>
          Not on a single guess,<br />
          we focus on <span style={{ color: ORANGE }}>a total strategy where the parts complement each other.</span>
        </p>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Şeffaflık ve Kanıt Section ─────────────────────────────────── */
function SeffaflikSection({ onBack }: { onBack: () => void }) {
  return (
    <section
      id="transparency"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: WHITE, scrollMarginTop: "132px" }}
      data-testid="section-seffaflik"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>TRANSPARENCY &amp; PROOF</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px", maxWidth: "680px" }}>
          We do not ask for trust.<br />
          We make the process visible before the match.
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "660px", marginBottom: "12px" }}>
          Coupons are published before the first match starts. Visitors can see the match list, publication time, coupon reference, staked amount, total odds and potential return in advance. Member-exclusive picks and individual odds are kept hidden before matches; they are revealed on the same coupon record once matches are completed. Both winners and losers are never deleted from the history.
        </p>

        {/* Highlight statement */}
        <div style={{ borderLeft: `4px solid ${ORANGE}`, paddingLeft: "20px", maxWidth: "620px", margin: "32px 0 48px" }}>
          <p style={{ fontSize: "clamp(15px,1.9vw,18px)", fontWeight: 700, color: NAVY, lineHeight: 1.55, fontStyle: "italic", margin: 0 }}>
            "We do not only show the result;<br />
            we also show the record of the result that existed before the match."
          </p>
        </div>

        {/* Before / After comparison */}
        <div className="flex flex-col md:flex-row md:items-start" style={{ gap: "0", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", marginBottom: "48px" }}>
          {/* Left — Pre-match */}
          <div style={{ flex: 1, padding: "clamp(24px,3vw,32px)", background: SOFT, borderRight: "none", borderBottom: `1px solid ${BORDER}` }} className="md:border-r md:border-b-0">
            <p style={{ fontSize: "10px", fontWeight: 800, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px" }}>PRE-MATCH</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {[
                ["Coupon Reference", "UH-2088659256-W", true],
                ["Publication Time", "16:27"],
                ["First Match", "19:00"],
                ["Total Odds", "3.86"],
                ["Stake", "€100,00"],
                ["Potential Return", "€386,37"],
              ].map(([label, val, hl], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: TEXT2 }}>{label}</span>
                  <span style={{ fontSize: "12px", fontWeight: hl ? 700 : 500, color: hl ? NAVY : NAVY }}>{val}</span>
                </div>
              ))}
              <div style={{ paddingTop: "8px", borderTop: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, background: WHITE, padding: "4px 10px", borderRadius: "6px", border: `1px solid ${BORDER}` }}>
                  Picks Hidden
                </span>
              </div>
            </div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
              <img src={preMatchImg} alt="Pre-match coupon" style={{ width: "100%", display: "block" }} />
            </div>
          </div>

          {/* Center connector — mobile */}
          <div className="md:hidden" style={{ padding: "12px 24px", background: WHITE, borderBottom: `1px solid ${BORDER}`, textAlign: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: TEXT2, letterSpacing: "0.04em" }}>
              Same coupon · Same reference · Same record
            </span>
          </div>

          {/* Center connector — desktop */}
          <div className="hidden md:flex" style={{ flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "32px 16px 0", background: WHITE, flexShrink: 0 }}>
            <div style={{ width: "1px", height: "60px", background: BORDER }} />
            <div style={{ padding: "10px 12px", borderRadius: "8px", background: SOFT, border: `1px solid ${BORDER}`, textAlign: "center", margin: "10px 0", whiteSpace: "nowrap" }}>
              <div style={{ fontSize: "10.5px", fontWeight: 700, color: NAVY, lineHeight: 1.7 }}>
                Same coupon<br />Same reference<br />Same record
              </div>
            </div>
            <div style={{ width: "1px", height: "60px", background: BORDER }} />
          </div>

          {/* Right — Post-match */}
          <div style={{ flex: 1, padding: "clamp(24px,3vw,32px)", background: "rgba(244,122,18,0.03)" }}>
            <p style={{ fontSize: "10px", fontWeight: 800, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px" }}>POST-MATCH</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {[
                ["Coupon Reference", "UH-2088659256-W", true],
                ["Total Odds", "3.86"],
                ["Stake", "€100,00"],
                ["Actual Return", "€386,37"],
                ["Net Result", "+€286,37"],
              ].map(([label, val, hl], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: TEXT2 }}>{label}</span>
                  <span style={{ fontSize: "12px", fontWeight: hl ? 700 : 500, color: NAVY }}>{val}</span>
                </div>
              ))}
              <div style={{ paddingTop: "8px", borderTop: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#117a4a", background: "rgba(17,122,74,0.08)", padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(17,122,74,0.2)" }}>
                  Won
                </span>
              </div>
            </div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
              <img src={settledImg} alt="Post-match coupon" style={{ width: "100%", display: "block" }} />
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p style={{ fontSize: "13px", color: TEXT2, background: SOFT, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "12px 18px", maxWidth: "660px" }}>
          No new coupon is prepared after the match; the result is added to the existing record.
        </p>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Arşiv Section ──────────────────────────────────────────────── */
function ArsivSection({ onBack }: { onBack: () => void }) {

  return (
    <section
      id="archive"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: BG, scrollMarginTop: "132px" }}
      data-testid="section-arsiv"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>RESULTS &amp; ARCHIVE</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px", maxWidth: "680px" }}>
          We do not change the past.<br />
          <span style={{ color: ORANGE }}>You see the full picture.</span>
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "640px", marginBottom: "40px" }}>
          All winning, losing and voided coupons are stored within the same system. The periodic balance is calculated using all of them; no record is deleted or hidden.
        </p>

        <Link href="/history">
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: NAVY, color: WHITE,
              padding: "13px 22px", borderRadius: "8px", border: "none",
              fontSize: "14px", fontWeight: 700, cursor: "pointer",
              fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.01em",
              transition: "opacity 0.15s",
            }}
            data-testid="btn-arsiv-gecmis"
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            View Past Performance
            <ArrowRight size={15} />
          </button>
        </Link>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Üyelik Section ─────────────────────────────────────────────── */
function UyelikSection({ onBack }: { onBack: () => void }) {
  const plans = [
    {
      tier: "STANDARD",
      subtitle: "Controlled access",
      desc: "Access selected daily matches and limited coupon content. For those who want to follow the system in a more streamlined and controlled way.",
      features: ["Selected match content", "Limited coupon access", "Standard past performance", "Daily content tracking"],
      cta: "Explore Standard Plans",
      dark: false,
    },
    {
      tier: "PREMIUM",
      subtitle: "Full access",
      desc: "Access all matches, coupons and additional opportunities published during the day. For those who want to follow the Bet Capitale system in full.",
      features: ["All of the day's matches", "All published coupons", "Additional intra-day content", "Full Premium archive"],
      cta: "Explore Premium Plans",
      dark: true,
    },
  ];

  return (
    <section
      id="membership"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: WHITE, scrollMarginTop: "132px" }}
      data-testid="section-uyelik"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>MEMBERSHIP</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "48px", maxWidth: "580px" }}>
          Choose the access level that suits you.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "20px", marginBottom: "0" }}>
          {plans.map((plan) => (
            <div
              key={plan.tier}
              style={{
                borderRadius: "16px", overflow: "hidden",
                border: plan.dark ? `1px solid rgba(244,122,18,0.25)` : `1px solid ${BORDER}`,
                background: plan.dark ? NAVY : WHITE,
                display: "flex", flexDirection: "column",
              }}
            >
              <div style={{ padding: "clamp(28px,4vw,36px)", flex: 1 }}>
                <p style={{ fontSize: "11px", fontWeight: 800, color: plan.dark ? "rgba(255,255,255,0.4)" : TEXT2, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
                  {plan.tier}
                </p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: plan.dark ? WHITE : NAVY, marginBottom: "12px" }}>
                  {plan.subtitle}
                </p>
                <p style={{ fontSize: "14px", color: plan.dark ? "rgba(255,255,255,0.55)" : TEXT2, lineHeight: 1.7, marginBottom: "24px" }}>
                  {plan.desc}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                        background: plan.dark ? "rgba(244,122,18,0.15)" : `rgba(244,122,18,0.1)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "9px", color: ORANGE, fontWeight: 800,
                      }}>✓</span>
                      <span style={{ fontSize: "13.5px", color: plan.dark ? "rgba(255,255,255,0.7)" : NAVY }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "0 clamp(28px,4vw,36px) clamp(28px,4vw,36px)" }}>
                <Link href="/plans">
                  <button
                    style={{
                      width: "100%", padding: "13px 20px", borderRadius: "8px",
                      border: plan.dark ? "none" : `1.5px solid ${BORDER}`,
                      background: plan.dark ? ORANGE : "transparent",
                      color: plan.dark ? WHITE : NAVY,
                      fontSize: "14px", fontWeight: 700, cursor: "pointer",
                      fontFamily: "'Manrope', sans-serif",
                      transition: "opacity 0.15s",
                    } as React.CSSProperties}
                    data-testid={`btn-uyelik-${plan.tier.toLowerCase()}`}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Final CTA Section ──────────────────────────────────────────── */
function FinalCtaSection() {
  return (
    <section style={{ padding: "clamp(56px,8vw,96px) clamp(16px,4vw,40px)", background: NAVY, textAlign: "center" }}>
      <div className="mx-auto" style={{ maxWidth: "720px" }}>
        <p style={{ fontSize: "11px", fontWeight: 800, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: "20px" }}>
          JOIN BET CAPITALE
        </p>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 800, color: WHITE, lineHeight: 1.2, letterSpacing: "-0.025em", marginBottom: "20px" }}>
          See the coupons before matches start.<br />
          Follow results from records that never change.
        </h2>
        <p style={{ fontSize: "clamp(14px,1.8vw,17px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 36px" }}>
          With Standard access selected content, with Premium access all matches and coupons published during the day.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center" style={{ gap: "12px", marginBottom: "24px" }}>
          <Link href="/plans" className="w-full sm:w-auto">
            <button
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: ORANGE, color: WHITE,
                padding: "14px 28px", borderRadius: "8px", border: "none",
                fontSize: "15px", fontWeight: 700, cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                transition: "opacity 0.15s", width: "100%",
              }}
              data-testid="btn-final-uyelik"
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Choose Your Plan
            </button>
          </Link>
          <Link href="/today" className="w-full sm:w-auto">
            <button
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: "transparent", color: WHITE,
                padding: "14px 28px", borderRadius: "8px",
                border: "1.5px solid rgba(255,255,255,0.2)",
                fontSize: "15px", fontWeight: 600, cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                transition: "border-color 0.15s", width: "100%",
              }}
              data-testid="btn-final-bugun"
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
            >
              See Today's Coupons
            </button>
          </Link>
        </div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
          No guarantee of results or profit. 18+.
        </p>
      </div>
    </section>
  );
}

/* ── Back link helper ───────────────────────────────────────────── */
function BackLink({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ marginTop: "48px", paddingTop: "20px", borderTop: `1px solid ${BORDER}` }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontSize: "13px", color: hov ? ORANGE : TEXT2,
          transition: "color 0.15s", fontFamily: "'Manrope', sans-serif",
          display: "flex", alignItems: "center", gap: "4px",
        }}
        data-testid="btn-back-to-topics"
      >
        ↑ Back to topics
      </button>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function HowItWorks() {
  const [activeSection, setActiveSection] = useState<string>("profit-logic");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  /* IntersectionObserver for active section */
  useEffect(() => {
    const sectionIds = NAV_SECTIONS.map((s) => s.id);
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-100px 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observerRef.current!.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  /* Hash on mount */
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setTimeout(() => el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" }), 150);
      }
    }
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Manrope', sans-serif" }}>
      <SiteHeader />

      {/* Sticky subnav (desktop only) */}
      <StickySubNav activeId={activeSection} onNav={scrollTo} />

      {/* Mobile topic drawer — before hero, non-sticky, scrolls with page */}
      <MobileTopicDrawer activeId={activeSection} onNav={scrollTo} />

      {/* Hero */}
      <HeroSection onScrollToKar={() => scrollTo("profit-logic")} />

      {/* Topic Index */}
      <TopicIndex onNav={scrollTo} />

      {/* Sections */}
      <KarMantigiSection onBack={() => scrollTo("on-this-page")} />
      <AnalizSection     onBack={() => scrollTo("on-this-page")} />
      <FiltrelemeSection onBack={() => scrollTo("on-this-page")} />
      <OlusturmaSection  onBack={() => scrollTo("on-this-page")} />
      <SeffaflikSection  onBack={() => scrollTo("on-this-page")} />
      <ArsivSection      onBack={() => scrollTo("on-this-page")} />
      <UyelikSection     onBack={() => scrollTo("on-this-page")} />

      {/* Final CTA */}
      <FinalCtaSection />
    </div>
  );
}
