import { useState } from "react";
import { Link, useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";

const ORANGE  = "#E8771F";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const BORDER  = "#E4EAEE";
const BG      = "#FCFCFB";
const SOFT    = "#F4F7F8";
const DANGER  = "#D95A68";

export default function Kayit() {
  const [location, navigate]   = useLocation();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const redirectTo = new URLSearchParams(location.split("?")[1] ?? "").get("redirect") || "/today";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalı.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error || "Kayıt sırasında bir hata oluştu.");
        return;
      }
      navigate(`/verification-pending${redirectTo !== "/today" ? `?redirect=${redirectTo}` : ""}`);
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
            Hesap Oluştur
          </h1>
          <p style={{ fontSize: "13px", color: TEXT2, margin: "0 0 28px" }}>
            Bet Capitale'e katılmak için kayıt olun.
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
                placeholder="En az 8 karakter"
                data-testid="input-password"
                style={{ width: "100%", padding: "10px 12px", fontSize: "14px", border: `1px solid ${BORDER}`, borderRadius: "8px", outline: "none", color: TEXT, background: SOFT, boxSizing: "border-box", fontFamily: "'Manrope', sans-serif" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
                Şifre Tekrar
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Şifrenizi tekrar girin"
                data-testid="input-confirm-password"
                style={{ width: "100%", padding: "10px 12px", fontSize: "14px", border: `1px solid ${BORDER}`, borderRadius: "8px", outline: "none", color: TEXT, background: SOFT, boxSizing: "border-box", fontFamily: "'Manrope', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="button-submit-register"
              style={{ marginTop: "4px", width: "100%", padding: "12px", fontSize: "14px", fontWeight: 700, color: "#fff", background: ORANGE, border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'Manrope', sans-serif", transition: "opacity 0.15s" }}
            >
              {loading ? "Kayıt yapılıyor…" : "Kayıt Ol"}
            </button>
          </form>

          <p style={{ fontSize: "13px", color: TEXT2, textAlign: "center", marginTop: "24px" }}>
            Zaten hesabın var mı?{" "}
            <Link href={`/login${redirectTo !== "/today" ? `?redirect=${redirectTo}` : ""}`} style={{ color: ORANGE, fontWeight: 600, textDecoration: "none" }}>
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
