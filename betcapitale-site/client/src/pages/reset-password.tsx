import { useState } from "react";
import { Link, useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";

const ORANGE = "#E8771F";
const TEXT   = "#0E1726";
const TEXT2  = "#5D6B7A";
const BORDER = "#E4EAEE";
const BG     = "#FCFCFB";
const SOFT   = "#F4F7F8";
const DANGER = "#D95A68";
const GREEN  = "#2E8B57";

export default function ResetPassword() {
  const [location]            = useLocation();
  const token                 = new URLSearchParams(location.split("?")[1] ?? "").get("token") || "";

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error || "An error occurred. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", background: BG }}>
        <SiteHeader />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 72px)", padding: "24px 16px" }}>
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "40px 36px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(14,23,38,0.07)", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: DANGER, marginBottom: "20px" }}>Invalid or missing reset token.</p>
            <Link href="/forgot-password" style={{ color: ORANGE, fontWeight: 600, textDecoration: "none", fontSize: "14px" }}>
              Request a new reset link →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: BG }}>
      <SiteHeader />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 72px)", padding: "24px 16px" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "40px 36px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(14,23,38,0.07)" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: TEXT, margin: "0 0 4px", fontFamily: "'Manrope', sans-serif" }}>
            Set New Password
          </h1>
          <p style={{ fontSize: "13px", color: TEXT2, margin: "0 0 28px" }}>
            Choose a strong password of at least 8 characters.
          </p>

          {error && (
            <div style={{ background: "rgba(217,90,104,0.08)", border: `1px solid rgba(217,90,104,0.25)`, borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", color: DANGER, margin: 0 }}>{error}</p>
            </div>
          )}

          {success ? (
            <div style={{ background: "rgba(46,139,87,0.08)", border: `1px solid rgba(46,139,87,0.25)`, borderRadius: "8px", padding: "16px 14px", marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", color: GREEN, margin: 0, fontWeight: 600 }}>Password updated!</p>
              <p style={{ fontSize: "13px", color: TEXT2, margin: "6px 0 16px" }}>
                Your password has been reset successfully.
              </p>
              <Link href="/login" style={{ display: "inline-block", padding: "10px 20px", background: ORANGE, color: "#fff", borderRadius: "8px", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>
                Sign In →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 characters"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "14px", border: `1px solid ${BORDER}`, borderRadius: "8px", outline: "none", color: TEXT, background: SOFT, boxSizing: "border-box", fontFamily: "'Manrope', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Repeat your new password"
                  style={{ width: "100%", padding: "10px 12px", fontSize: "14px", border: `1px solid ${BORDER}`, borderRadius: "8px", outline: "none", color: TEXT, background: SOFT, boxSizing: "border-box", fontFamily: "'Manrope', sans-serif" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ marginTop: "4px", width: "100%", padding: "12px", fontSize: "14px", fontWeight: 700, color: "#fff", background: ORANGE, border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'Manrope', sans-serif", transition: "opacity 0.15s" }}
              >
                {loading ? "Saving…" : "Set New Password"}
              </button>
            </form>
          )}

          {!success && (
            <p style={{ fontSize: "13px", color: TEXT2, textAlign: "center", marginTop: "24px" }}>
              <Link href="/login" style={{ color: ORANGE, fontWeight: 600, textDecoration: "none" }}>
                ← Back to Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
