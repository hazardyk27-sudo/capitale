import { useState } from "react";
import { Link, useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import TermsModal from "@/components/TermsModal";

const ORANGE  = "#E8771F";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const BORDER  = "#E4EAEE";
const BG      = "#FCFCFB";
const SOFT    = "#F4F7F8";
const DANGER  = "#D95A68";

export default function Register() {
  const [location, navigate]   = useLocation();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const redirectTo = new URLSearchParams(location.split("?")[1] ?? "").get("redirect") || "/today";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!termsAccepted) {
      setError("You must agree to the Terms of Use, Membership and Service to create an account.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, termsAccepted }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error || "An error occurred during registration.");
        return;
      }
      navigate(`/verification-pending${redirectTo !== "/today" ? `?redirect=${redirectTo}` : ""}`);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: BG }}>
      <SiteHeader />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 72px)", padding: "24px 16px" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "40px 36px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(14,23,38,0.07)" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: TEXT, margin: "0 0 4px", fontFamily: "'Manrope', sans-serif" }}>
            Create Account
          </h1>
          <p style={{ fontSize: "13px", color: TEXT2, margin: "0 0 28px" }}>
            Register to join Bet Capitale.
          </p>

          {error && (
            <div style={{ background: "rgba(217,90,104,0.08)", border: `1px solid rgba(217,90,104,0.25)`, borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", color: DANGER, margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                data-testid="input-email"
                style={{ width: "100%", padding: "10px 12px", fontSize: "14px", border: `1px solid ${BORDER}`, borderRadius: "8px", outline: "none", color: TEXT, background: SOFT, boxSizing: "border-box", fontFamily: "'Manrope', sans-serif" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 8 characters"
                data-testid="input-password"
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
                placeholder="Re-enter your password"
                data-testid="input-confirm-password"
                style={{ width: "100%", padding: "10px 12px", fontSize: "14px", border: `1px solid ${BORDER}`, borderRadius: "8px", outline: "none", color: TEXT, background: SOFT, boxSizing: "border-box", fontFamily: "'Manrope', sans-serif" }}
              />
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
                data-testid="checkbox-terms"
                style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: ORANGE, cursor: "pointer", flexShrink: 0 }}
              />
              <span style={{ fontSize: "12.5px", lineHeight: 1.55, color: TEXT2 }}>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setTermsModalOpen(true);
                  }}
                  data-testid="link-terms"
                  style={{ color: ORANGE, fontWeight: 600, textDecoration: "none", background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer" }}
                >
                  Terms of Use
                </button>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !termsAccepted}
              data-testid="button-submit-register"
              style={{ marginTop: "4px", width: "100%", padding: "12px", fontSize: "14px", fontWeight: 700, color: "#fff", background: ORANGE, border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'Manrope', sans-serif", transition: "opacity 0.15s" }}
            >
              {loading ? "Registering…" : "Register"}
            </button>
          </form>

          <p style={{ fontSize: "13px", color: TEXT2, textAlign: "center", marginTop: "24px" }}>
            Already have an account?{" "}
            <Link href={`/login${redirectTo !== "/today" ? `?redirect=${redirectTo}` : ""}`} style={{ color: ORANGE, fontWeight: 600, textDecoration: "none" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <TermsModal open={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
    </div>
  );
}
