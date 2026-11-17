import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import SiteHeader from "@/components/SiteHeader";
import type { MembershipPublicationWithLegs } from "@shared/schema";

const ORANGE  = "#E8771F";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const BORDER  = "#E4EAEE";
const BG      = "#FCFCFB";
const SOFT    = "#F4F7F8";
const DANGER  = "#D95A68";
const SUCCESS = "#2E9E6B";
const FONT    = "'Manrope', sans-serif";

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${BORDER}`,
  borderRadius: "12px",
  padding: "24px 20px",
  boxShadow: "0 4px 24px rgba(14,23,38,0.05)",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: TEXT2,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  display: "block",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "14px",
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  outline: "none",
  color: TEXT,
  background: SOFT,
  boxSizing: "border-box",
  fontFamily: FONT,
};

const buttonStyle = (loading: boolean): React.CSSProperties => ({
  marginTop: "4px",
  width: "100%",
  padding: "12px",
  fontSize: "14px",
  fontWeight: 700,
  color: "#fff",
  background: ORANGE,
  border: "none",
  borderRadius: "8px",
  cursor: loading ? "not-allowed" : "pointer",
  opacity: loading ? 0.7 : 1,
  fontFamily: FONT,
  transition: "opacity 0.15s",
});

function Message({ type, text }: { type: "error" | "success"; text: string }) {
  const isError = type === "error";
  return (
    <div style={{
      background: isError ? "rgba(217,90,104,0.08)" : "rgba(46,158,107,0.08)",
      border: `1px solid ${isError ? "rgba(217,90,104,0.25)" : "rgba(46,158,107,0.25)"}`,
      borderRadius: "8px",
      padding: "10px 14px",
      marginBottom: "4px",
    }}>
      <p style={{ fontSize: "13px", color: isError ? DANGER : SUCCESS, margin: 0 }}>{text}</p>
    </div>
  );
}

function tierLabel(tier: "select" | "unlimited" | null): string {
  if (tier === "unlimited") return "Unlimited";
  if (tier === "select") return "Select";
  return "No active membership";
}

function todayISODate(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}

/* ── Today's Members-Only Content ── */
function TodayContentCard({ pub }: { pub: MembershipPublicationWithLegs }) {
  const [open, setOpen] = useState(true);
  const isSelect = pub.tier === "select";
  const isSettled = pub.status === "SETTLED";
  const tierColor = isSelect ? ORANGE : "#7C3AED";
  const tierBg = isSelect ? "rgba(232,119,31,0.06)" : "rgba(124,58,237,0.06)";
  const resultColor = pub.result === "WON" ? SUCCESS : pub.result === "LOST" ? DANGER : TEXT2;

  const { data: imgData } = useQuery<{ preMatchImage: string | null; settledImage: string | null }>({
    queryKey: [`/api/membership/publications/${pub.id}/image`],
    queryFn: () => fetch(`/api/membership/publications/${pub.id}/image`).then((r) => (r.ok ? r.json() : { preMatchImage: null, settledImage: null })),
    staleTime: 10 * 60 * 1000,
  });
  const pubImg = imgData?.settledImage ?? imgData?.preMatchImage ?? null;

  const computedOdds = pub.legs.length > 0 ? pub.legs.reduce((a, l) => a * l.odds, 1) : pub.totalOdds ?? null;

  return (
    <div
      data-testid={`profile-content-${pub.id}`}
      style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderLeft: `3px solid ${tierColor}`,
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "10px",
      }}
    >
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "9px", fontWeight: 800, color: tierColor, background: tierBg,
              padding: "2px 7px", borderRadius: "3px", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              {isSelect ? "Select" : "Unlimited"}
            </span>
            {isSettled && pub.result ? (
              <span style={{
                fontSize: "9px", fontWeight: 800, color: resultColor,
                background: pub.result === "WON" ? "rgba(46,158,107,0.08)" : pub.result === "LOST" ? "rgba(217,90,104,0.08)" : "rgba(93,107,122,0.07)",
                padding: "2px 7px", borderRadius: "3px", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                {pub.result}
              </span>
            ) : (
              <span style={{ fontSize: "9px", fontWeight: 700, color: ORANGE, background: "rgba(232,119,31,0.08)", padding: "2px 7px", borderRadius: "3px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Pre-match
              </span>
            )}
          </div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: TEXT, margin: 0, lineHeight: 1.35 }}>{pub.title}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "4px", flexWrap: "wrap" }}>
            {pub.stake != null && <span style={{ fontSize: "10px", color: TEXT2 }}>€{pub.stake} stake</span>}
            {computedOdds != null && <span style={{ fontSize: "10px", color: TEXT2, fontVariantNumeric: "tabular-nums" }}>@{computedOdds.toFixed(2)} odds</span>}
            {pub.legs.length > 0 && <span style={{ fontSize: "10px", color: TEXT2 }}>{pub.legs.length} picks</span>}
          </div>
        </div>
        <div style={{ flexShrink: 0, paddingTop: "2px", color: TEXT2 }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          {pub.analysis && (
            <div style={{ padding: "10px 14px", background: tierBg, borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: "11px", color: TEXT, margin: 0, lineHeight: 1.6 }}>{pub.analysis}</p>
            </div>
          )}
          {pubImg && (
            <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "14px" }}>
              <img
                src={pubImg}
                alt={`${pub.title} coupon image`}
                data-testid={`profile-content-image-${pub.id}`}
                style={{ width: "100%", maxWidth: "440px", height: "auto", display: "block", margin: "0 auto", borderRadius: "8px", border: `1px solid ${BORDER}` }}
              />
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
                      {leg.kickoffAt && <span style={{ fontSize: "10px", color: ORANGE, fontWeight: 700 }}>{leg.kickoffAt}</span>}
                      <span style={{ fontSize: "10px", color: TEXT2 }}>{leg.market}: <strong style={{ color: TEXT }}>{leg.selection}</strong></span>
                      <span style={{ fontSize: "10px", color: TEXT2, fontVariantNumeric: "tabular-nums" }}>@{leg.odds.toFixed(2)}</span>
                    </div>
                  </div>
                  {leg.result && (
                    <span style={{
                      fontSize: "8px", fontWeight: 800, flexShrink: 0, color: legResultColor,
                      background: leg.result === "won" ? "rgba(46,158,107,0.08)" : leg.result === "lost" ? "rgba(217,90,104,0.08)" : "rgba(93,107,122,0.07)",
                      padding: "3px 7px", borderRadius: "3px", textTransform: "uppercase", letterSpacing: "0.07em",
                    }}>
                      {leg.result}
                    </span>
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

function TodayMembersContentSection({ hasMembership, isExpired }: { hasMembership: boolean; isExpired: boolean }) {
  const active = hasMembership && !isExpired;
  const date = todayISODate();

  const { data, isLoading } = useQuery<{ tier: string; publications: MembershipPublicationWithLegs[] } | null>({
    queryKey: ["/api/membership/publications", date, "profile"],
    queryFn: () => fetch(`/api/membership/publications?date=${date}&target=profile`).then((r) => (r.ok ? r.json() : null)),
    enabled: active,
    staleTime: 2 * 60 * 1000,
  });

  if (!active) return null;

  const publications = data?.publications ?? [];

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "13px", fontWeight: 700, color: TEXT, margin: "0 0 4px", fontFamily: FONT }}>
        Today's Members-Only Content
      </h2>
      <p style={{ fontSize: "12px", color: TEXT2, margin: "0 0 16px" }}>
        Based on your plan, here's what's been published for today.
      </p>
      {isLoading ? (
        <p style={{ fontSize: "12px", color: TEXT2, textAlign: "center", padding: "16px 0", margin: 0 }}>
          Loading…
        </p>
      ) : publications.length === 0 ? (
        <p style={{ fontSize: "12px", color: TEXT2, textAlign: "center", padding: "16px 0", margin: 0 }}>
          No content has been published for today yet.
        </p>
      ) : (
        publications.map((pub) => <TodayContentCard key={pub.id} pub={pub} />)
      )}
    </div>
  );
}

export default function Membership() {
  const [location, navigate] = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(`/login?redirect=/membership`);
    }
  }, [isLoading, user, navigate]);

  // ── Email form ──
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMsg, setEmailMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailMsg(null);
    setEmailLoading(true);
    try {
      const r = await apiRequest("POST", "/api/auth/update-email", {
        newEmail,
        currentPassword: emailPassword,
      });
      const data = await r.json();
      queryClient.setQueryData(["/api/auth/me"], (prev: any) => prev ? { ...prev, email: data.email } : prev);
      setEmailMsg({ type: "success", text: "Email address updated successfully." });
      setNewEmail("");
      setEmailPassword("");
    } catch (err) {
      const text = err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : "Something went wrong.";
      setEmailMsg({ type: "error", text: safeErrorText(text) });
    } finally {
      setEmailLoading(false);
    }
  }

  // ── Password form ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (newPassword.length < 8) {
      setPwMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: "error", text: "New password and confirmation do not match." });
      return;
    }
    setPwLoading(true);
    try {
      await apiRequest("POST", "/api/auth/update-password", { currentPassword, newPassword });
      setPwMsg({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const text = err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : "Something went wrong.";
      setPwMsg({ type: "error", text: safeErrorText(text) });
    } finally {
      setPwLoading(false);
    }
  }

  if (isLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: BG }}>
        <SiteHeader />
      </div>
    );
  }

  const expiresAt = user.membershipExpiresAt ? new Date(user.membershipExpiresAt) : null;
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - Date.now()) / msPerDay) : null;
  const hasMembership = !!user.memberTier;
  const isExpired = daysLeft !== null && daysLeft <= 0;
  const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 3;

  return (
    <div style={{ minHeight: "100vh", background: BG }}>
      <SiteHeader />
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "28px 16px 64px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: TEXT, margin: "0 0 4px", fontFamily: FONT }}>
            My Membership
          </h1>
          <p style={{ fontSize: "13px", color: TEXT2, margin: 0 }}>
            Manage your account details and membership plan.
          </p>
        </div>

        {/* Membership status card */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: TEXT, margin: "0 0 16px", fontFamily: FONT }}>
            Membership Status
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: hasMembership && daysLeft !== null ? "16px" : "0" }}>
            <div style={{ minWidth: "120px" }}>
              <span style={labelStyle}>Plan</span>
              <div style={{ fontSize: "18px", fontWeight: 800, color: TEXT, fontFamily: FONT }}>
                {tierLabel(user.memberTier)}
              </div>
            </div>
            {hasMembership && daysLeft !== null && (
              <div style={{ minWidth: "120px" }}>
                <span style={labelStyle}>Days Remaining</span>
                <div style={{ fontSize: "18px", fontWeight: 800, color: isExpired || isExpiringSoon ? DANGER : TEXT, fontFamily: FONT }}>
                  {isExpired ? "Expired" : `${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
                </div>
              </div>
            )}
          </div>

          {hasMembership && (isExpired || isExpiringSoon) && (
            <div style={{
              background: "rgba(217,90,104,0.08)",
              border: "1px solid rgba(217,90,104,0.25)",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "16px",
            }}>
              <p style={{ fontSize: "13px", color: DANGER, margin: 0, fontWeight: 600 }}>
                {isExpired
                  ? "Your membership has expired. Renew now to restore access."
                  : "Your membership is expiring soon. Renew now to avoid interruption."}
              </p>
            </div>
          )}

          <button
            data-testid="button-renew-membership"
            onClick={() => navigate("/plans")}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#fff",
              background: ORANGE,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            {hasMembership ? "Renew Membership" : "Become a Member"}
          </button>
        </div>

        <TodayMembersContentSection hasMembership={hasMembership} isExpired={isExpired} />

        {/* Email card */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: TEXT, margin: "0 0 4px", fontFamily: FONT }}>
            Email Address
          </h2>
          <p style={{ fontSize: "13px", color: TEXT2, margin: "0 0 16px" }}>
            Current: <strong style={{ color: TEXT }}>{user.email}</strong>
          </p>
          <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {emailMsg && <Message type={emailMsg.type} text={emailMsg.text} />}
            <div>
              <label style={labelStyle}>New Email</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@example.com"
                data-testid="input-new-email"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                required
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                placeholder="Confirm with your current password"
                data-testid="input-email-current-password"
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={emailLoading} data-testid="button-update-email" style={buttonStyle(emailLoading)}>
              {emailLoading ? "Updating…" : "Update Email"}
            </button>
          </form>
        </div>

        {/* Password card */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: TEXT, margin: "0 0 16px", fontFamily: FONT }}>
            Password
          </h2>
          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {pwMsg && <Message type={pwMsg.type} text={pwMsg.text} />}
            <div>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                data-testid="input-current-password"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                data-testid="input-new-password"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                data-testid="input-confirm-password"
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={pwLoading} data-testid="button-update-password" style={buttonStyle(pwLoading)}>
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function safeErrorText(text: string): string {
  // apiRequest throws "<status>: <body>" where body may be raw JSON — try to extract { error }
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed.error === "string") return parsed.error;
  } catch {
    // not JSON, fall through
  }
  return text || "Something went wrong. Please try again.";
}
