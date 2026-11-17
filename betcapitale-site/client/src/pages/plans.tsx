import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/hooks/useAuth";
import { usePostCheckoutStatus } from "@/hooks/usePostCheckoutStatus";

const NAVY    = "#071B33";
const ORANGE  = "#F47A12";
const BG      = "#F7F7F5";
const WHITE   = "#ffffff";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const BORDER  = "#E0E4E8";
const SOFT    = "#F4F2F0";
const SUCCESS = "#129A63";

type Tier = "standard" | "premium";
type Days = 7 | 14 | 30 | 90;

interface WhopPlan {
  id: string;
  tier: "standard" | "elite";
  label: string;
  days: number;
  price: number;
  currency: string;
}

interface CardMeta {
  badge: string;
  subtext: string;
  description: string;
  valueNote?: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const CARD_META: Record<Tier, Record<Days, CardMeta>> = {
  standard: {
    7: {
      badge: "STARTER PACK",
      subtext: "€7.13 / day",
      description: "Follow the day's matches and selected content for 7 days. A short starter pack for those who want a controlled introduction to the system.",
      features: [
        "Limited access to the day's matches",
        "Selected coupon content",
        "Pre-match publication tracking",
        "Past performance view",
        "Controlled starter experience",
      ],
      cta: "7-Day Select Access",
    },
    14: {
      badge: "EXTENDED EXPERIENCE",
      subtext: "€5.71 / day",
      description: "Follow the selected match and coupon stream regularly for 14 days. For those who want a more comprehensive evaluation beyond a short starter period.",
      valueNote: "30-day access is only €20 more",
      features: [
        "Limited access to the day's matches",
        "Selected coupon content",
        "Pre-match content tracking",
        "Past performance view",
        "Two-week regular experience",
      ],
      cta: "14-Day Select Access",
    },
    30: {
      badge: "MOST BALANCED CHOICE",
      subtext: "€3.33 / day",
      description: "Follow matches and selected coupons at a real usage rhythm for 30 days. The most balanced Capitale Select option for controlled access.",
      valueNote: "Only €20 more than the 14-day pack",
      features: [
        "Limited access to the day's matches",
        "Selected coupon content",
        "Pre-match publication tracking",
        "Past performance view",
        "One month of regular system experience",
      ],
      cta: "30-Day Select Access",
      featured: true,
    },
    90: {
      badge: "LONG-TERM ADVANTAGE",
      subtext: "€59.97 / mo · €1.99 / day",
      description: "Access selected content for 90 days at a lower per-period cost. The most efficient Select option for those who follow the system consistently.",
      valueNote: "€119.80 advantage over 3 separate monthly packs",
      features: [
        "Limited access to the day's matches",
        "Selected coupon content",
        "Pre-match publication tracking",
        "Past performance view",
        "Lower cost in the long run",
      ],
      cta: "90-Day Select Access",
    },
  },
  premium: {
    7: {
      badge: "INTRO TO FULL ACCESS",
      subtext: "€18.56 / day",
      description: "Access all published matches and all coupons for 7 days. Experience Bet Capitale's full content stream for a short period.",
      features: [
        "Access to all of the day's matches",
        "All published coupons",
        "Additional intra-day content",
        "Full content view",
        "Unlimited performance archive",
      ],
      cta: "7-Day Unlimited Access",
    },
    14: {
      badge: "FULL CONTENT EXPERIENCE",
      subtext: "€14.28 / day",
      description: "Follow all match, coupon and additional content streams for 14 days. For those who want a more comprehensive evaluation of full access.",
      valueNote: "30-day access is only €50 more",
      features: [
        "Access to all of the day's matches",
        "All published coupons",
        "Additional intra-day content",
        "Full content view",
        "Unlimited performance archive",
      ],
      cta: "14-Day Unlimited Access",
    },
    30: {
      badge: "MOST POPULAR PLAN",
      subtext: "€8.33 / day",
      description: "Access all published matches, coupons and full content for 30 days. The primary Unlimited option for those who want to follow Bet Capitale in full.",
      valueNote: "€149.90 advantage over 2 × 14-day packs",
      features: [
        "Access to all of the day's matches",
        "All published coupons",
        "Additional intra-day content",
        "Full content view",
        "Unlimited performance archive",
      ],
      cta: "Start Unlimited Access",
      featured: true,
    },
    90: {
      badge: "BEST VALUE",
      subtext: "€133.30 / mo · €4.44 / day",
      description: "Access all Unlimited content for 90 days at the most advantageous long-term cost. The most efficient full-access plan for users who follow consistently.",
      valueNote: "€349.80 advantage over 3 separate monthly packs",
      features: [
        "Access to all of the day's matches",
        "All published coupons",
        "Additional intra-day content",
        "Full content view",
        "Lowest Unlimited cost in the long run",
      ],
      cta: "90-Day Unlimited Access",
    },
  },
};

const TIER_LABELS: Record<Tier, string> = {
  standard: "Capitale Select",
  premium: "Capitale Unlimited",
};

const SUMMARY_DESC: Record<Tier, string> = {
  standard: "The most balanced option for those who want to follow the system regularly and in a controlled way with selected content.",
  premium: "The most popular option for those who want access to all published matches, coupons and the full content stream.",
};

const DURATION_LABELS: Record<Days, string> = {
  7: "7 Days",
  14: "14 Days",
  30: "30 Days",
  90: "90 Days",
};

function fmt(price: number) {
  return "€" + price.toFixed(2).replace(".", ",");
}

const ORIGINAL_PRICES: Record<Tier, Record<Days, number>> = {
  standard: { 7: 69.90, 14: 109.90, 30: 139.90, 90: 249.90 },
  premium:  { 7: 149.90, 14: 239.90, 30: 299.90, 90: 499.90 },
};

function discountPercent(price: number, original: number) {
  return Math.round((1 - price / original) * 100);
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function PricingCard({
  tier,
  days,
  planId,
  price,
  onBuy,
  onSelect,
  loading,
  isDesktop,
  isSelected,
}: {
  tier: Tier;
  days: Days;
  planId: string;
  price: number;
  onBuy: (id: string) => void;
  onSelect: (d: Days) => void;
  loading: boolean;
  isDesktop: boolean;
  isSelected: boolean;
}) {
  const meta = CARD_META[tier][days];
  const isUnlimitedFeatured = tier === "premium" && days === 30;
  const isSelectFeatured = tier === "standard" && days === 30;
  const originalPrice = ORIGINAL_PRICES[tier][days];
  const discount = discountPercent(price, originalPrice);

  let cardBg = WHITE;
  if (isUnlimitedFeatured) cardBg = NAVY;
  else if (tier === "premium") cardBg = SOFT;
  else if (isSelected && isSelectFeatured) cardBg = "#FFF6EF";
  else if (isSelected) cardBg = "#FFF9F5";

  const selBorder = isUnlimitedFeatured
    ? `1.5px solid ${ORANGE}`
    : isSelected
      ? `2px solid ${ORANGE}`
      : `1.5px solid ${BORDER}`;

  const cardStyle: React.CSSProperties = {
    background: cardBg,
    color: isUnlimitedFeatured ? WHITE : TEXT,
    border: selBorder,
    borderRadius: "16px",
    padding: "24px 22px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    position: "relative",
    cursor: isDesktop ? "pointer" : "default",
    outline: "none",
    boxShadow: isUnlimitedFeatured
      ? "0 8px 32px rgba(7,27,51,0.20)"
      : isSelected
        ? "0 4px 18px rgba(14,23,38,0.09)"
        : "0 1px 5px rgba(14,23,38,0.05)",
    transition: "box-shadow 0.15s, border-color 0.15s",
  };

  const subColor   = isUnlimitedFeatured ? "rgba(255,255,255,0.55)" : TEXT2;
  const descColor  = isUnlimitedFeatured ? "rgba(255,255,255,0.72)" : TEXT2;
  const noteTextColor = isUnlimitedFeatured ? "rgba(255,255,255,0.55)" : TEXT2;
  const noteBg     = isUnlimitedFeatured ? "rgba(255,255,255,0.07)" : "#F0F2F4";
  const featColor  = isUnlimitedFeatured ? "rgba(255,255,255,0.80)" : TEXT2;
  const checkColor = isUnlimitedFeatured ? ORANGE : ORANGE;
  const dividerColor = isUnlimitedFeatured ? "rgba(255,255,255,0.12)" : BORDER;

  let ctaBg = ORANGE;
  let ctaColor = WHITE;
  if (isUnlimitedFeatured) { ctaBg = WHITE; ctaColor = NAVY; }
  else if (tier === "premium") { ctaBg = NAVY; ctaColor = WHITE; }

  const focusShadow = `0 0 0 3px ${ORANGE}44`;

  return (
    <div
      style={cardStyle}
      onClick={isDesktop ? () => onSelect(days) : undefined}
      role={isDesktop ? "radio" : undefined}
      aria-checked={isDesktop ? isSelected : undefined}
      aria-label={isDesktop ? `${DURATION_LABELS[days]} ${TIER_LABELS[tier]} — ${fmt(price)}` : undefined}
      tabIndex={isDesktop ? 0 : undefined}
      onKeyDown={isDesktop ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(days); } } : undefined}
      onFocus={(e) => { if (isDesktop) e.currentTarget.style.boxShadow = focusShadow; }}
      onBlur={(e) => { if (isDesktop) e.currentTarget.style.boxShadow = cardStyle.boxShadow as string; }}
    >
      {/* Selected check indicator */}
      {isDesktop && isSelected && (
        <div style={{
          position: "absolute", top: "14px", right: "14px",
          width: "20px", height: "20px", borderRadius: "50%",
          background: ORANGE,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ color: WHITE, fontSize: "11px", fontWeight: 800, lineHeight: 1 }} aria-hidden="true">✓</span>
        </div>
      )}

      {/* 1. Badge area */}
      <div style={{ minHeight: "24px", marginBottom: "10px" }}>
        <div style={{
          display: "inline-block",
          background: isUnlimitedFeatured ? ORANGE : ORANGE,
          color: WHITE,
          fontSize: "9px", fontWeight: 800, letterSpacing: "0.08em",
          padding: "3px 9px", borderRadius: "20px",
          fontFamily: "'Manrope', sans-serif",
        }}>
          {meta.badge}
        </div>
      </div>

      {/* 2. Duration label */}
      <div style={{
        fontSize: "13px", fontWeight: 700, color: isUnlimitedFeatured ? "rgba(255,255,255,0.5)" : TEXT2,
        letterSpacing: "0.03em", textTransform: "uppercase",
        fontFamily: "'Manrope', sans-serif",
      }}>
        {DURATION_LABELS[days]}
      </div>

      {/* 3. Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap", marginTop: "3px" }}>
        <div style={{
          fontSize: "32px", fontWeight: 800,
          color: isUnlimitedFeatured ? WHITE : TEXT,
          letterSpacing: "-0.5px", lineHeight: 1,
          fontFamily: "'Manrope', sans-serif",
        }}>
          {fmt(price)}
        </div>
        {discount > 0 && (
          <div style={{
            fontSize: "22px", fontWeight: 700,
            color: isUnlimitedFeatured ? "rgba(255,255,255,0.4)" : "#9CA6B0",
            letterSpacing: "-0.3px", lineHeight: 1,
            textDecoration: "line-through",
            fontFamily: "'Manrope', sans-serif",
          }}>
            {fmt(originalPrice)}
          </div>
        )}
      </div>

      {/* 4. Equivalent */}
      <div style={{ fontSize: "12px", color: subColor, fontFamily: "'Manrope', sans-serif", marginTop: "8px", marginBottom: "4px" }}>
        {meta.subtext}
      </div>

      {/* 5. Description */}
      <p style={{
        fontSize: "12.5px", color: descColor,
        lineHeight: 1.6, margin: "0 0 4px",
        minHeight: "60px",
        fontFamily: "'Manrope', sans-serif",
      }}>
        {meta.description}
      </p>

      {/* 6. Value note */}
      <div style={{ minHeight: "36px" }}>
        {meta.valueNote && (
          <div style={{
            fontSize: "11.5px", color: noteTextColor,
            background: noteBg,
            borderRadius: "6px", padding: "6px 10px",
            fontFamily: "'Manrope', sans-serif",
          }}>
            {meta.valueNote}
          </div>
        )}
      </div>

      {/* 7. Divider */}
      <div style={{ height: "1px", background: dividerColor, margin: "8px 0" }} />

      {/* 8. Benefits (flex: 1 so all cards push CTA to bottom) */}
      <ul style={{
        listStyle: "none", padding: 0, margin: "0 0 8px",
        display: "flex", flexDirection: "column", gap: "7px",
        flex: 1,
      }}>
        {meta.features.map((f) => (
          <li key={f} style={{
            display: "flex", alignItems: "flex-start", gap: "8px",
            fontSize: "12px", color: featColor,
            fontFamily: "'Manrope', sans-serif",
          }}>
            <span style={{ color: checkColor, fontWeight: 700, flexShrink: 0, marginTop: "1px" }} aria-hidden="true">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* 9. CTA button */}
      <button
        data-testid={`button-buy-${planId}`}
        onClick={(e) => { e.stopPropagation(); onBuy(planId); }}
        disabled={loading}
        aria-label={`${meta.cta} — ${fmt(price)}`}
        style={{
          marginTop: "auto",
          width: "100%",
          padding: "13px",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: ctaColor,
          background: ctaBg,
          border: "none",
          borderRadius: "10px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          fontFamily: "'Manrope', sans-serif",
          transition: "opacity 0.15s",
          outline: "none",
        }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = focusShadow; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
      >
        {loading ? "Loading…" : meta.cta}
      </button>
    </div>
  );
}

export default function Plans() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [tier, setTier] = useState<Tier>("standard");
  const [selectedDays, setSelectedDays] = useState<Days>(30);
  const [visible, setVisible] = useState(true);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  const [isTablet, setIsTablet] = useState(
    typeof window !== "undefined" && window.innerWidth >= 640 && window.innerWidth < 1024,
  );
  const reducedMotion = useReducedMotion();

  const checkoutStatus = usePostCheckoutStatus();

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      setIsDesktop(w >= 1024);
      setIsTablet(w >= 640 && w < 1024);
    };
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

  const { data: plans = [] } = useQuery<WhopPlan[]>({ queryKey: ["/api/whop/plans"] });

  const checkoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      const r = await fetch("/api/whop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId, return_to: "/plans" }),
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
        navigate(`/terms?redirect=/plans&plan=${encodeURIComponent(planId)}`);
        return;
      }
      setErrorMsg(err.message);
    },
  });

  function handleBuy(planId: string) {
    setErrorMsg(null);
    if (!user) {
      navigate(`/register?redirect=${encodeURIComponent(`/terms?redirect=/plans&plan=${planId}`)}`);
      return;
    }
    setLoadingPlanId(planId);
    checkoutMutation.mutate(planId);
  }

  function changeTier(next: Tier) {
    if (next === tier) return;
    if (reducedMotion) { setTier(next); return; }
    setVisible(false);
    setTimeout(() => { setTier(next); setVisible(true); }, 180);
  }

  const apiTier = tier === "premium" ? "elite" : "standard";
  const tierPlans = plans.filter((p) => p.tier === apiTier);
  const planByDays = (d: Days) => tierPlans.find((p) => p.days === d);
  const selectedPlan = planByDays(selectedDays);
  const DAYS: Days[] = [7, 14, 30, 90];
  const tierAccent = tier === "premium" ? NAVY : ORANGE;
  const selectedMeta = CARD_META[tier][selectedDays];

  return (
    <div className="packages-page" style={{ minHeight: "100vh", background: BG, fontFamily: "'Manrope', sans-serif" }}>
      <SiteHeader />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: isDesktop ? "56px 24px 120px" : "32px 16px 148px" }}>

        {/* Post-checkout status banner — verified against real membership state, not just the redirect */}
        {checkoutStatus === "checking" && (
          <div style={{
            background: "rgba(14,23,38,0.04)", border: "1px solid rgba(14,23,38,0.14)",
            borderRadius: "12px", padding: "14px 20px", marginBottom: "36px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <span style={{ fontSize: "18px" }} aria-hidden="true">⏳</span>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: TEXT, margin: 0 }}>Confirming your payment…</p>
              <p style={{ fontSize: "13px", color: TEXT2, margin: "2px 0 0" }}>This usually takes a few seconds. Please don't close this page.</p>
            </div>
          </div>
        )}
        {checkoutStatus === "confirmed" && (
          <div style={{
            background: "rgba(18,154,99,0.08)", border: "1px solid rgba(18,154,99,0.28)",
            borderRadius: "12px", padding: "14px 20px", marginBottom: "36px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <span style={{ fontSize: "18px" }} aria-hidden="true">✅</span>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: SUCCESS, margin: 0 }}>Payment received!</p>
              <p style={{ fontSize: "13px", color: TEXT2, margin: "2px 0 0" }}>Your membership is now active. Enjoy!</p>
            </div>
          </div>
        )}
        {checkoutStatus === "timeout" && (
          <div style={{
            background: "rgba(244,122,18,0.08)", border: "1px solid rgba(244,122,18,0.3)",
            borderRadius: "12px", padding: "14px 20px", marginBottom: "36px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <span style={{ fontSize: "18px" }} aria-hidden="true">⚠️</span>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: ORANGE, margin: 0 }}>Payment received, but activation is taking longer than usual</p>
              <p style={{ fontSize: "13px", color: TEXT2, margin: "2px 0 0" }}>
                Try refreshing this page in a minute. If your membership still isn't active, contact us on{" "}
                <a href="https://t.me/betcapitale" target="_blank" rel="noopener noreferrer" style={{ color: ORANGE, fontWeight: 600 }}>Telegram</a> and we'll sort it out.
              </p>
            </div>
          </div>
        )}

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: isDesktop ? "56px" : "40px" }}>
          <p style={{
            fontSize: "11px", fontWeight: 800, color: ORANGE,
            letterSpacing: "0.1em", textTransform: "uppercase",
            margin: "0 0 18px", fontFamily: "'Manrope', sans-serif",
          }}>
            FLEXIBLE PLANS · CONTROLLED ACCESS
          </p>
          <h1 style={{
            fontSize: isDesktop ? "48px" : "34px",
            fontWeight: 800, color: NAVY,
            margin: "0 0 18px",
            letterSpacing: "-0.03em", lineHeight: 1.1,
            fontFamily: "'Manrope', sans-serif",
          }}>
            Choose Your Plan
          </h1>
          <p style={{
            fontSize: isDesktop ? "17px" : "15px", color: TEXT2,
            margin: "0 auto 22px", maxWidth: "500px", lineHeight: 1.7,
            fontFamily: "'Manrope', sans-serif",
          }}>
            Follow matches and coupon content before they start. Choose the access level and duration that suits you.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 14px", marginBottom: "6px" }}>
            {["Pre-match publication", "Timestamped record", "Non-deletable result history"].map((item, i, arr) => (
              <span key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "12.5px", color: TEXT2, fontFamily: "'Manrope', sans-serif" }}>{item}</span>
                {i < arr.length - 1 && <span style={{ color: BORDER }} aria-hidden="true">·</span>}
              </span>
            ))}
          </div>
          {!user && (
            <p style={{ fontSize: "13px", color: TEXT2, marginTop: "14px", fontFamily: "'Manrope', sans-serif" }}>
              To purchase{" "}
              <Link href="/login?redirect=/plans" style={{ color: ORANGE, fontWeight: 600, textDecoration: "none" }}>sign in</Link>
              {" "}or{" "}
              <Link href="/register?redirect=/plans" style={{ color: ORANGE, fontWeight: 600, textDecoration: "none" }}>register</Link>.
            </p>
          )}
        </div>

        {/* Error */}
        {errorMsg && (
          <div role="alert" style={{
            background: "rgba(217,90,104,0.07)", border: "1px solid rgba(217,90,104,0.22)",
            borderRadius: "10px", padding: "12px 16px", marginBottom: "24px", textAlign: "center",
          }}>
            <p style={{ fontSize: "13px", color: "#D95A68", margin: 0 }}>{errorMsg}</p>
          </div>
        )}

        {/* Tier selector */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: isDesktop ? "44px" : "28px" }}>
          <div
            style={{
              display: "flex", background: "#E4E7EA",
              borderRadius: "20px", padding: "5px", gap: "4px",
            }}
            role="radiogroup" aria-label="Membership type"
          >
            {(["standard", "premium"] as Tier[]).map((t) => {
              const active = tier === t;
              const isPrem = t === "premium";
              return (
                <button
                  key={t}
                  data-testid={`button-tier-${t}`}
                  onClick={() => changeTier(t)}
                  role="radio"
                  aria-checked={active}
                  aria-selected={active}
                  style={{
                    position: "relative",
                    padding: isDesktop ? "14px 36px" : "11px 20px",
                    borderRadius: "14px",
                    border: active
                      ? `2px solid ${isPrem ? NAVY : ORANGE}`
                      : "2px solid transparent",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: isDesktop ? "13px" : "12px",
                    fontFamily: "'Manrope', sans-serif",
                    letterSpacing: "0.04em",
                    transition: reducedMotion ? "none" : "background 0.2s, color 0.2s",
                    background: active ? (isPrem ? NAVY : WHITE) : "transparent",
                    color: active ? (isPrem ? WHITE : NAVY) : TEXT2,
                    boxShadow: active ? "0 2px 10px rgba(0,0,0,0.09)" : "none",
                    outline: "none",
                    textTransform: "uppercase",
                  }}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 3px ${ORANGE}44`; }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = active ? "0 2px 10px rgba(0,0,0,0.09)" : "none"; }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                    <span>{t === "standard" ? "CAPITALE SELECT" : "CAPITALE UNLIMITED"}</span>
                    {isDesktop && (
                      <span style={{
                        fontSize: "10px", fontWeight: 500, letterSpacing: "0.01em",
                        textTransform: "none",
                        color: active
                          ? (isPrem ? "rgba(255,255,255,0.55)" : TEXT2)
                          : "transparent",
                        transition: reducedMotion ? "none" : "color 0.2s",
                      }}>
                        {t === "standard" ? "Selected content · Controlled access" : "All content · Full access"}
                      </span>
                    )}
                  </div>
                  {isPrem && active && (
                    <span style={{
                      position: "absolute", top: "-9px", right: "10px",
                      background: ORANGE, color: WHITE,
                      fontSize: "8px", fontWeight: 800, padding: "2px 8px",
                      borderRadius: "20px", letterSpacing: "0.08em",
                    }} aria-hidden="true">
                      FULL ACCESS
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TABLET: 2-column grid */}
        {isTablet && !isDesktop && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
              alignItems: "stretch",
              opacity: visible ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.2s",
            }}
            role="radiogroup" aria-label="Duration selection"
          >
            {DAYS.map((d) => {
              const plan = planByDays(d);
              if (!plan) return null;
              return (
                <PricingCard
                  key={d}
                  tier={tier} days={d}
                  planId={plan.id} price={plan.price}
                  onBuy={handleBuy} onSelect={setSelectedDays}
                  loading={loadingPlanId === plan.id && checkoutMutation.isPending}
                  isDesktop={true} isSelected={selectedDays === d}
                />
              );
            })}
          </div>
        )}

        {/* MOBILE: duration pills + single card */}
        {!isDesktop && !isTablet && (
          <>
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px", justifyContent: "center" }}
              role="radiogroup" aria-label="Duration selection"
            >
              {DAYS.map((d) => {
                const active = selectedDays === d;
                return (
                  <button
                    key={d}
                    data-testid={`button-days-${d}`}
                    onClick={() => setSelectedDays(d)}
                    role="radio"
                    aria-checked={active}
                    style={{
                      flex: "1 1 calc(50% - 8px)",
                      minWidth: "100px",
                      padding: "10px 18px",
                      borderRadius: "20px",
                      border: `2px solid ${active ? tierAccent : BORDER}`,
                      background: active ? tierAccent : WHITE,
                      color: active ? WHITE : TEXT2,
                      fontSize: "13px", fontWeight: 700,
                      cursor: "pointer", fontFamily: "'Manrope', sans-serif",
                      transition: reducedMotion ? "none" : "all 0.15s",
                      outline: "none",
                      textAlign: "center",
                    }}
                    onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 3px ${ORANGE}44`; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {DURATION_LABELS[d]}
                  </button>
                );
              })}
            </div>
            <div style={{ opacity: visible ? 1 : 0, transition: reducedMotion ? "none" : "opacity 0.18s" }}>
              {selectedPlan && (
                <PricingCard
                  tier={tier} days={selectedDays}
                  planId={selectedPlan.id} price={selectedPlan.price}
                  onBuy={handleBuy} onSelect={setSelectedDays}
                  loading={loadingPlanId === selectedPlan.id && checkoutMutation.isPending}
                  isDesktop={false} isSelected={true}
                />
              )}
            </div>
          </>
        )}

        {/* DESKTOP: 4-card grid */}
        {isDesktop && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "14px",
                alignItems: "stretch",
                opacity: visible ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.2s",
              }}
              role="radiogroup" aria-label="Duration selection"
            >
              {DAYS.map((d) => {
                const plan = planByDays(d);
                if (!plan) return null;
                return (
                  <PricingCard
                    key={d}
                    tier={tier} days={d}
                    planId={plan.id} price={plan.price}
                    onBuy={handleBuy} onSelect={setSelectedDays}
                    loading={loadingPlanId === plan.id && checkoutMutation.isPending}
                    isDesktop={true} isSelected={selectedDays === d}
                  />
                );
              })}
            </div>

            {/* Desktop summary panel — dark navy */}
            {selectedPlan && (
              <div style={{
                marginTop: "28px",
                background: NAVY,
                borderRadius: "16px",
                padding: "28px 36px",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: "32px",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    margin: "0 0 8px", fontFamily: "'Manrope', sans-serif",
                  }}>
                    YOUR SELECTION
                  </p>
                  <p style={{
                    fontSize: "20px", fontWeight: 800, color: WHITE,
                    margin: "0 0 4px", fontFamily: "'Manrope', sans-serif",
                    letterSpacing: "-0.02em",
                  }}>
                    {TIER_LABELS[tier]} · {DURATION_LABELS[selectedDays]} Access
                  </p>
                  <p style={{
                    fontSize: "13px", color: "rgba(255,255,255,0.55)",
                    margin: "0 0 16px", fontFamily: "'Manrope', sans-serif", lineHeight: 1.5,
                  }}>
                    {SUMMARY_DESC[tier]}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <div>
                      <p style={{
                        fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        margin: "0 0 2px", fontFamily: "'Manrope', sans-serif",
                      }}>
                        TOTAL
                      </p>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap", margin: "0 0 8px" }}>
                        <p style={{
                          fontSize: "36px", fontWeight: 800, color: WHITE,
                          letterSpacing: "-0.03em", lineHeight: 1,
                          margin: 0, fontFamily: "'Manrope', sans-serif",
                        }}>
                          {fmt(selectedPlan.price)}
                        </p>
                        {discountPercent(selectedPlan.price, ORIGINAL_PRICES[tier][selectedDays]) > 0 && (
                          <p style={{
                            fontSize: "24px", fontWeight: 700, color: "rgba(255,255,255,0.4)",
                            letterSpacing: "-0.02em", lineHeight: 1,
                            textDecoration: "line-through",
                            margin: 0, fontFamily: "'Manrope', sans-serif",
                          }}>
                            {fmt(ORIGINAL_PRICES[tier][selectedDays])}
                          </p>
                        )}
                      </div>
                      <p style={{
                        fontSize: "12px", color: "rgba(255,255,255,0.45)",
                        margin: 0, fontFamily: "'Manrope', sans-serif",
                      }}>
                        {selectedMeta.subtext}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <button
                    data-testid="button-checkout-summary"
                    onClick={() => handleBuy(selectedPlan.id)}
                    disabled={loadingPlanId === selectedPlan.id && checkoutMutation.isPending}
                    aria-label={`Proceed to checkout — ${TIER_LABELS[tier]} ${DURATION_LABELS[selectedDays]} ${fmt(selectedPlan.price)}`}
                    style={{
                      padding: "15px 36px",
                      background: ORANGE,
                      color: WHITE, border: "none",
                      borderRadius: "12px",
                      fontSize: "15px", fontWeight: 700,
                      cursor: "pointer", fontFamily: "'Manrope', sans-serif",
                      boxShadow: "0 4px 18px rgba(244,122,18,0.32)",
                      opacity: (loadingPlanId === selectedPlan.id && checkoutMutation.isPending) ? 0.7 : 1,
                      outline: "none", transition: "opacity 0.15s",
                      marginBottom: "8px",
                      display: "block",
                    }}
                    onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 3px ${ORANGE}44, 0 4px 18px rgba(244,122,18,0.32)`; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(244,122,18,0.32)"; }}
                  >
                    {(loadingPlanId === selectedPlan.id && checkoutMutation.isPending) ? "Loading…" : "Proceed to Checkout"}
                  </button>
                  <p style={{
                    fontSize: "11px", color: "rgba(255,255,255,0.35)",
                    margin: 0, fontFamily: "'Manrope', sans-serif",
                  }}>
                    Secured payment via Whop
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <p style={{ textAlign: "center", fontSize: "12px", color: TEXT2, marginTop: "28px", lineHeight: 1.5, fontFamily: "'Manrope', sans-serif" }}>
          All payments processed securely via Whop · Currency EUR · VAT not included
        </p>
      </div>

      {/* Mobile sticky bar */}
      {!isDesktop && selectedPlan && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: WHITE,
          borderTop: `1px solid ${BORDER}`,
          padding: "12px 16px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "12px",
          zIndex: 50,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.07)",
        }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: TEXT2, fontFamily: "'Manrope', sans-serif" }}>
              {TIER_LABELS[tier]} · {DURATION_LABELS[selectedDays]}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: TEXT, letterSpacing: "-0.3px", fontFamily: "'Manrope', sans-serif" }}>
                {fmt(selectedPlan.price)}
              </div>
              {discountPercent(selectedPlan.price, ORIGINAL_PRICES[tier][selectedDays]) > 0 && (
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#9CA6B0", textDecoration: "line-through", fontFamily: "'Manrope', sans-serif" }}>
                  {fmt(ORIGINAL_PRICES[tier][selectedDays])}
                </div>
              )}
            </div>
          </div>
          <button
            data-testid="button-checkout-mobile"
            onClick={() => handleBuy(selectedPlan.id)}
            disabled={loadingPlanId === selectedPlan.id && checkoutMutation.isPending}
            aria-label={`Continue — ${TIER_LABELS[tier]} ${DURATION_LABELS[selectedDays]} ${fmt(selectedPlan.price)}`}
            style={{
              padding: "13px 28px",
              background: tierAccent, color: WHITE,
              border: "none", borderRadius: "12px",
              fontSize: "14px", fontWeight: 700,
              cursor: "pointer", fontFamily: "'Manrope', sans-serif",
              flexShrink: 0,
              opacity: (loadingPlanId === selectedPlan.id && checkoutMutation.isPending) ? 0.7 : 1,
              outline: "none", transition: "opacity 0.15s",
            }}
            onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 3px ${ORANGE}44`; }}
            onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
          >
            {(loadingPlanId === selectedPlan.id && checkoutMutation.isPending) ? "…" : "Continue"}
          </button>
        </div>
      )}
    </div>
  );
}
