import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/hooks/useAuth";
import { CURRENT_TERMS_VERSION, CURRENT_TERMS_EFFECTIVE_DATE_LABEL } from "@shared/terms";
import { TermsBody } from "@/components/TermsContent";

/* ── Design tokens — matches how-it-works editorial style ─────────── */
const BG      = "#F7F7F5";
const NAVY    = "#071B33";
const ORANGE  = "#F47A12";
const TEXT2   = "#667085";
const BORDER  = "#E2E5E9";
const SOFT    = "#F0F2F4";
const WHITE   = "#ffffff";
const DANGER  = "#D95A68";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "10px" }}>
      {children}
    </p>
  );
}

function useQueryParams() {
  const [location] = useLocation();
  return new URLSearchParams(location.split("?")[1] ?? "");
}

export default function Terms() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const params = useQueryParams();
  const redirectTo = params.get("redirect") || "/plans";
  const planId = params.get("plan");

  const [checked, setChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resuming, setResuming] = useState(false);

  const { data: status, isLoading: statusLoading } = useQuery<{ accepted: boolean; version: string }>({
    queryKey: ["/api/terms/status"],
    queryFn: async () => {
      const r = await fetch("/api/terms/status");
      if (r.status === 401) return { accepted: false, version: CURRENT_TERMS_VERSION };
      return r.json();
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });

  async function startCheckout(id: string) {
    // redirectTo is the page whose own verified-payment banner should show once
    // Whop redirects back — keep it aligned with the server's allowlist.
    const returnTo = redirectTo.split("?")[0];
    const r = await fetch("/api/whop/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: id, return_to: returnTo }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Payment could not be initiated.");
    return data as { purchase_url: string };
  }

  async function proceedAfterAcceptance() {
    if (planId) {
      setResuming(true);
      try {
        const data = await startCheckout(planId);
        window.open(data.purchase_url, "_blank", "noopener,noreferrer");
        navigate(redirectTo);
      } catch (err: any) {
        setErrorMsg(err.message || "Payment could not be initiated. Please try again from the plans page.");
        setResuming(false);
      }
    } else {
      navigate(redirectTo);
    }
  }

  const acceptMutation = useMutation({
    mutationFn: async () => {
      const r = await fetch("/api/terms/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Acceptance could not be recorded.");
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/terms/status"], { accepted: true, version: CURRENT_TERMS_VERSION });
      proceedAfterAcceptance();
    },
    onError: (err: Error) => setErrorMsg(err.message),
  });

  function handleAcceptClick() {
    setErrorMsg(null);
    if (!user) {
      const here = `/terms?redirect=${encodeURIComponent(redirectTo)}${planId ? `&plan=${encodeURIComponent(planId)}` : ""}`;
      navigate(`/login?redirect=${encodeURIComponent(here)}`);
      return;
    }
    acceptMutation.mutate();
  }

  const alreadyAccepted = !!user && status?.accepted === true;
  const busy = acceptMutation.isPending || resuming;

  return (
    <div style={{ minHeight: "100vh", background: BG }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{ padding: "clamp(56px,8vw,88px) 20px 40px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <Eyebrow>BET CAPITALE</Eyebrow>
          <h1 style={{
            fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: NAVY,
            fontSize: "clamp(28px,4.4vw,42px)", letterSpacing: "-0.02em", margin: "0 0 14px", lineHeight: 1.1,
          }}>
            TERMS &amp; CONDITIONS
          </h1>
          <p style={{ fontSize: "14px", color: TEXT2, margin: 0 }}>
            Last Updated: {CURRENT_TERMS_EFFECTIVE_DATE_LABEL} &nbsp;·&nbsp; Version {CURRENT_TERMS_VERSION}
          </p>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: "clamp(32px,6vw,56px) 20px 0" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: NAVY,
            fontSize: "18px", margin: "0 0 6px",
          }}>
            TERMS OF USE, MEMBERSHIP AND SERVICE
          </h2>

          <TermsBody />
        </div>
      </section>

      {/* Acceptance area — visually separated, not a modal */}
      <section style={{ padding: "56px 20px clamp(64px,10vw,96px)" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{
            background: alreadyAccepted ? WHITE : SOFT,
            border: `1px solid ${BORDER}`,
            borderRadius: "14px",
            padding: "clamp(22px,4vw,32px)",
          }}>
            {errorMsg && (
              <div style={{ background: "rgba(217,90,104,0.08)", border: "1px solid rgba(217,90,104,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "18px" }}>
                <p style={{ fontSize: "13px", color: DANGER, margin: 0 }}>{errorMsg}</p>
              </div>
            )}

            {alreadyAccepted ? (
              <div>
                <p style={{ fontSize: "14.5px", color: NAVY, fontWeight: 700, margin: "0 0 6px" }}>
                  You have already accepted the current version (v{status?.version ?? CURRENT_TERMS_VERSION}) of these Terms.
                </p>
                <p style={{ fontSize: "13.5px", color: TEXT2, margin: "0 0 20px" }}>
                  You do not need to accept again.
                </p>
                <button
                  onClick={proceedAfterAcceptance}
                  disabled={busy}
                  style={{
                    background: NAVY, color: WHITE, border: "none", borderRadius: "10px",
                    padding: "13px 28px", fontSize: "14px", fontWeight: 700, cursor: busy ? "default" : "pointer",
                    opacity: busy ? 0.7 : 1,
                  }}
                >
                  {busy ? "Redirecting..." : planId ? "Continue to Checkout" : "Continue"}
                </button>
              </div>
            ) : (
              <div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", marginBottom: "20px" }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: ORANGE, cursor: "pointer", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "14.5px", lineHeight: 1.6, color: NAVY, fontWeight: 600 }}>
                    I have read and agree to the Terms of Use, Membership and Service.
                  </span>
                </label>
                <button
                  onClick={handleAcceptClick}
                  disabled={!checked || busy || statusLoading}
                  style={{
                    background: !checked || busy ? "#C9CDD3" : ORANGE, color: WHITE, border: "none", borderRadius: "10px",
                    padding: "14px 32px", fontSize: "14px", fontWeight: 800, letterSpacing: "0.03em",
                    cursor: !checked || busy ? "default" : "pointer", width: "100%",
                  }}
                >
                  {busy ? "Processing..." : "I ACCEPT"}
                </button>
                {!user && (
                  <p style={{ fontSize: "12.5px", color: TEXT2, margin: "12px 0 0" }}>
                    You must sign in to accept — the button will take you to the sign-in page.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
