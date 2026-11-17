import { useEffect, useState } from "react";
import { Link } from "wouter";
import SiteHeader from "@/components/SiteHeader";

const ORANGE  = "#E8771F";
const SUCCESS = "#129A63";
const TEXT    = "#0E1726";
const TEXT2   = "#5D6B7A";
const BORDER  = "#E4EAEE";
const BG      = "#FCFCFB";
const DANGER  = "#D95A68";

export default function EmailVerification() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.message) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Connection error. Please try again.");
      });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: BG }}>
      <SiteHeader />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 72px)", padding: "24px 16px" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "48px 36px", width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 4px 24px rgba(14,23,38,0.07)" }}>
          {status === "loading" && (
            <>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
              <h1 style={{ fontSize: "18px", fontWeight: 800, color: TEXT, margin: "0 0 8px", fontFamily: "'Manrope', sans-serif" }}>
                Verifying…
              </h1>
              <p style={{ fontSize: "13px", color: TEXT2, margin: 0 }}>Please wait.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div style={{ width: "56px", height: "56px", background: "rgba(18,154,99,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <span style={{ fontSize: "24px" }}>✓</span>
              </div>
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: TEXT, margin: "0 0 8px", fontFamily: "'Manrope', sans-serif" }}>
                Email Verified!
              </h1>
              <p style={{ fontSize: "13px", color: TEXT2, margin: "0 0 28px" }}>{message}</p>
              <Link
                href="/login"
                style={{ display: "inline-block", background: ORANGE, color: "#fff", textDecoration: "none", padding: "11px 28px", borderRadius: "8px", fontWeight: 700, fontSize: "14px", fontFamily: "'Manrope', sans-serif" }}
                data-testid="link-go-to-login"
              >
                Sign In
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div style={{ width: "56px", height: "56px", background: "rgba(217,90,104,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <span style={{ fontSize: "24px" }}>✕</span>
              </div>
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: TEXT, margin: "0 0 8px", fontFamily: "'Manrope', sans-serif" }}>
                Verification Failed
              </h1>
              <p style={{ fontSize: "13px", color: DANGER, margin: "0 0 28px" }}>{message}</p>
              <Link
                href="/register"
                style={{ display: "inline-block", background: ORANGE, color: "#fff", textDecoration: "none", padding: "11px 28px", borderRadius: "8px", fontWeight: 700, fontSize: "14px", fontFamily: "'Manrope', sans-serif" }}
              >
                Register Again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
