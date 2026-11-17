import { Link } from "wouter";
import SiteHeader from "@/components/SiteHeader";

const ORANGE = "#E8771F";
const TEXT   = "#0E1726";
const TEXT2  = "#5D6B7A";
const BORDER = "#E4EAEE";
const BG     = "#FCFCFB";

export default function VerificationPending() {
  return (
    <div style={{ minHeight: "100vh", background: BG }}>
      <SiteHeader />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 72px)", padding: "24px 16px" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "48px 36px", width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 4px 24px rgba(14,23,38,0.07)" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>📧</div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: TEXT, margin: "0 0 12px", fontFamily: "'Manrope', sans-serif" }}>
            Check Your Inbox
          </h1>
          <p style={{ fontSize: "14px", color: TEXT2, lineHeight: 1.6, margin: "0 0 8px" }}>
            A verification link has been sent to your email address.
          </p>
          <p style={{ fontSize: "13px", color: TEXT2, margin: "0 0 32px" }}>
            The link is valid for <strong>1 hour</strong>. Check your spam folder too.
          </p>
          <Link
            href="/login"
            style={{ display: "inline-block", color: ORANGE, fontWeight: 600, fontSize: "14px", textDecoration: "none", fontFamily: "'Manrope', sans-serif" }}
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
