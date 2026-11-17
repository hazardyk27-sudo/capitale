import { useState } from "react";
import { Link, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import SiteHeader from "@/components/SiteHeader";

const ORANGE  = "#E8771F";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const BORDER  = "#E4EAEE";
const BG      = "#FCFCFB";
const SOFT    = "#F4F7F8";
const DANGER  = "#D95A68";

export default function Giris() {
  const [location, navigate]       = useLocation();
  const [email, setEmail]          = useState("");
  const [password, setPassword]    = useState("");
  const [loading, setLoading]      = useState(false);
  const [error, setError]          = useState<string | null>(null);

  const redirectTo = new URLSearchParams(location.split("?")[1] ?? "").get("redirect") || "/today";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error || "Giriş sırasında bir hata oluştu.");
        return;
      }
      // Remove (not just invalidate) any session-scoped data cached under a
      // previous session before writing the new one — invalidation alone
      // keeps the stale cached result available for the query's initial
      // render while it refetches, which is exactly what leaked tier
      // content between accounts on a shared browser/tab.
      queryClient.clear();
      queryClient.setQueryData(["/api/auth/me"], data);
      navigate(redirectTo);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
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
            Giriş Yap
          </h1>
          <p style={{ fontSize: "13px", color: TEXT2, margin: "0 0 28px" }}>
            Hesabınıza giriş yapın.
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
                placeholder="ornek@email.com"
                data-testid="input-email"
                style={{ width: "100%", padding: "10px 12px", fontSize: "14px", border: `1px solid ${BORDER}`, borderRadius: "8px", outline: "none", color: TEXT, background: SOFT, boxSizing: "border-box", fontFamily: "'Manrope', sans-serif" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Şifreniz"
                data-testid="input-password"
                style={{ width: "100%", padding: "10px 12px", fontSize: "14px", border: `1px solid ${BORDER}`, borderRadius: "8px", outline: "none", color: TEXT, background: SOFT, boxSizing: "border-box", fontFamily: "'Manrope', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="button-submit-login"
              style={{ marginTop: "4px", width: "100%", padding: "12px", fontSize: "14px", fontWeight: 700, color: "#fff", background: ORANGE, border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'Manrope', sans-serif", transition: "opacity 0.15s" }}
            >
              {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
            </button>
          </form>

          <p style={{ fontSize: "13px", color: TEXT2, textAlign: "center", marginTop: "24px" }}>
            Hesabın yok mu?{" "}
            <Link href={`/register${redirectTo !== "/today" ? `?redirect=${redirectTo}` : ""}`} style={{ color: ORANGE, fontWeight: 600, textDecoration: "none" }}>
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
