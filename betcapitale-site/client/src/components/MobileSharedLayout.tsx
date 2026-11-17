import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Calendar, MessageSquare, TrendingUp } from "lucide-react";
import logoImg from "@assets/bet-capitale-wordmark.webp";
import { useAuth, useLogout } from "@/hooks/useAuth";

const ORANGE = "#F25A00";
const TEXT   = "#111827";
const BORDER = "#E5E7EB";
const FONT   = "'Manrope', sans-serif";

const navLinks = [
  { label: "Today",        href: "/today" },
  { label: "Free Bet",     href: "/free-bet" },
  { label: "History",      href: "/history" },
  { label: "Plans",        href: "/plans" },
  { label: "How It Works", href: "/how-it-works" },
];

/* ══════════════════════════════════════════════════════════════════
   MOBILE HEADER — shared across all pages
══════════════════════════════════════════════════════════════════ */
export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location]   = useLocation();
  const { user }     = useAuth();
  const logout       = useLogout();

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        width: "100%", height: "72px",
        background: "#111111",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", boxSizing: "border-box",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <div style={{ width: "190px", height: "32px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
            <img src={logoImg} alt="Bet Capitale" style={{
              position: "absolute", width: "190px", height: "auto",
              top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "block",
            }} />
          </div>
        </Link>

        <button onClick={() => setMenuOpen(o => !o)} style={{
          background: "transparent", border: "none", color: "#F5F5F5",
          cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", flexShrink: 0,
        }} aria-label="Menu">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {menuOpen && (
        <div style={{
          position: "fixed", top: "72px", left: 0, right: 0, zIndex: 99,
          background: "rgba(10,10,10,0.98)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.08)", padding: "8px 20px 24px",
        }}>
          {navLinks.map(l => {
            const active = location === l.href;
            return (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: "16px", fontWeight: active ? 600 : 500,
                color: active ? ORANGE : "#F5F5F5",
                padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.08)",
                textDecoration: "none", fontFamily: FONT,
              }}>
                {l.label}
                {active && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />}
              </Link>
            );
          })}

          {user && (
            <Link href="/membership" onClick={() => setMenuOpen(false)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontSize: "16px", fontWeight: location === "/membership" ? 600 : 500,
              color: location === "/membership" ? ORANGE : "#F5F5F5",
              padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.08)",
              textDecoration: "none", fontFamily: FONT,
            }}>
              My Membership
              {location === "/membership" && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />}
            </Link>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            {user ? (
              <button onClick={() => { logout.mutate(); setMenuOpen(false); }} style={{
                flex: 1, fontSize: "14px", fontWeight: 500, color: "#9CA3AF",
                padding: "11px 0", borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "transparent", cursor: "pointer", fontFamily: FONT,
              }}>Sign Out</button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, fontSize: "14px", fontWeight: 500, color: "#9CA3AF",
                  padding: "11px 0", borderRadius: "10px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent", textDecoration: "none", fontFamily: FONT,
                }}>Sign In</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, fontSize: "14px", fontWeight: 700, color: "#fff",
                  padding: "11px 0", borderRadius: "20px", textAlign: "center",
                  background: ORANGE, textDecoration: "none", fontFamily: FONT,
                }}>Join</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MOBILE ACTION PANEL — fixed at bottom, shared across all pages
══════════════════════════════════════════════════════════════════ */
export function MobileActionPanel() {
  const cellStyle: React.CSSProperties = {
    position: "relative", minWidth: 0,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: "8px", padding: "12px 8px",
    textAlign: "center", color: TEXT, textDecoration: "none",
  };

  const dividerStyle: React.CSSProperties = {
    position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
    width: "1px", height: "50px", background: BORDER, pointerEvents: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: 600, color: TEXT, lineHeight: 1.3, fontFamily: FONT,
  };

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 80,
      background: "#FFFFFF", borderTop: `1px solid ${BORDER}`,
      display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      <Link href="/today" style={cellStyle}>
        <Calendar size={24} color={TEXT} strokeWidth={1.5} />
        <span style={labelStyle}>Today's<br />Matches</span>
        <div style={dividerStyle} />
      </Link>

      <a href="/#mobile-community-voices" style={cellStyle}>
        <MessageSquare size={24} color={TEXT} strokeWidth={1.5} />
        <span style={labelStyle}>Community<br />Voice</span>
        <div style={dividerStyle} />
      </a>

      <a href="/#mobile-kazanc-simulasyonu" style={cellStyle}>
        <TrendingUp size={24} color={TEXT} strokeWidth={1.5} />
        <span style={labelStyle}>Calculate<br />Profit</span>
      </a>
    </div>
  );
}
