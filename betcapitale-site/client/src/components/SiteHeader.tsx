import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, LogOut, User } from "lucide-react";
import logoImg from "@assets/bet-capitale-wordmark.webp";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { MobileHeader } from "./MobileSharedLayout";

const ORANGE = "#E8771F";
const TEXT   = "#F5F5F5";
const TEXT2  = "#9CA3AF";

const navLinks = [
  { label: "Today",        href: "/today" },
  { label: "Free Bet",     href: "/free-bet" },
  { label: "History",      href: "/history" },
  { label: "Plans",        href: "/plans" },
  { label: "How It Works", href: "/how-it-works" },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [hoveredNav, setHoveredNav]     = useState<string | null>(null);
  const [loginHovered, setLoginHovered] = useState(false);
  const [katilHovered, setKatilHovered] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <>
      {/* Mobile: identical header to homepage */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      {/* Desktop only */}
      <header
        style={{
          backgroundColor: "rgba(0,0,0,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          zIndex: 50,
        }}
        className="sticky top-0 w-full hidden md:block"
      >
      <div
        className="mx-auto flex items-center justify-between px-4 sm:px-6"
        style={{ maxWidth: "1200px", height: "72px" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center select-none"
          style={{ textDecoration: "none" }}
          data-testid="link-home"
        >
          <div style={{
            overflow: "hidden",
            width: "clamp(126px, 21vw, 238px)",
            height: "36px",
            flexShrink: 0,
            position: "relative",
          }}>
            <img
              src={logoImg}
              alt="Bet Capitale"
              style={{
                position: "absolute",
                width: "clamp(126px, 21vw, 238px)",
                height: "auto",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "block",
              }}
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center" style={{ gap: "2px" }}>
          {navLinks.map((l) => {
            const active  = location === l.href;
            const hovered = hoveredNav === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                data-testid={`nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                onMouseEnter={() => setHoveredNav(l.href)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  position: "relative",
                  fontSize: "13.5px",
                  fontWeight: active ? 600 : 500,
                  color: active ? ORANGE : hovered ? TEXT : TEXT2,
                  padding: "6px 13px",
                  borderRadius: "7px",
                  textDecoration: "none",
                  transition: "color 0.15s, background 0.15s",
                  background: hovered && !active ? "rgba(255,255,255,0.06)" : "transparent",
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                {l.label}
                {active && (
                  <span style={{
                    position: "absolute", bottom: "-1px", left: "50%",
                    transform: "translateX(-50%)",
                    width: "16px", height: "2px",
                    background: ORANGE, borderRadius: "2px",
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center" style={{ gap: "4px" }}>
          {user ? (
            <>
              <Link
                href="/membership"
                data-testid="link-my-membership"
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "8px",
                  background: location === "/membership" ? "rgba(232,119,31,0.14)" : "rgba(255,255,255,0.06)",
                  textDecoration: "none", transition: "background 0.15s",
                }}
              >
                <User size={13} style={{ color: location === "/membership" ? ORANGE : TEXT2 }} />
                <span style={{ fontSize: "13px", color: location === "/membership" ? ORANGE : TEXT2, fontFamily: "'Manrope', sans-serif", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </span>
              </Link>
              <button
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "13px", fontWeight: 500, color: TEXT2,
                  padding: "7px 14px", borderRadius: "8px",
                  border: "none", background: "transparent",
                  cursor: "pointer", transition: "color 0.15s, background 0.15s",
                  fontFamily: "'Manrope', sans-serif",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = TEXT; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = TEXT2; }}
                data-testid="button-logout"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onMouseEnter={() => setLoginHovered(true)}
                onMouseLeave={() => setLoginHovered(false)}
                style={{
                  fontSize: "13.5px", fontWeight: 500,
                  color: loginHovered ? TEXT : TEXT2,
                  padding: "7px 14px", borderRadius: "8px",
                  background: loginHovered ? "rgba(255,255,255,0.08)" : "transparent",
                  textDecoration: "none",
                  transition: "color 0.15s, background 0.15s",
                  fontFamily: "'Manrope', sans-serif",
                }}
                data-testid="button-login"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onMouseEnter={() => setKatilHovered(true)}
                onMouseLeave={() => setKatilHovered(false)}
                style={{
                  fontSize: "13.5px", fontWeight: 700,
                  color: "#ffffff", padding: "8px 20px",
                  borderRadius: "20px",
                  background: ORANGE, textDecoration: "none",
                  transition: "box-shadow 0.2s, transform 0.15s",
                  boxShadow: katilHovered
                    ? "0 4px 14px rgba(232,119,31,0.45)"
                    : "0 1px 3px rgba(232,119,31,0.25)",
                  transform: katilHovered ? "translateY(-1px)" : "none",
                  fontFamily: "'Manrope', sans-serif",
                  display: "inline-block",
                }}
                data-testid="button-signup"
              >
                Join
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          style={{
            color: TEXT, background: "transparent", border: "none",
            cursor: "pointer", padding: "8px", borderRadius: "8px",
          }}
          onClick={() => setMobileOpen((o) => !o)}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: "rgba(10,10,10,0.98)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "8px 20px 24px",
          }}
          className="md:hidden"
        >
          {navLinks.map((l) => {
            const active = location === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "16px",
                  fontWeight: active ? 600 : 500,
                  color: active ? ORANGE : TEXT,
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                  fontFamily: "'Manrope', sans-serif",
                }}
                data-testid={`mobile-nav-${l.label.toLowerCase()}`}
              >
                {l.label}
                {active && (
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: ORANGE, flexShrink: 0,
                  }} />
                )}
              </Link>
            );
          })}
          <div className="flex gap-3 mt-5">
            {user ? (
              <button
                onClick={() => { logout.mutate(); setMobileOpen(false); }}
                style={{
                  flex: 1, fontSize: "14px", fontWeight: 500, color: TEXT2,
                  padding: "11px 0", borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent", cursor: "pointer",
                  fontFamily: "'Manrope', sans-serif",
                }}
                data-testid="mobile-button-logout"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1, fontSize: "14px", fontWeight: 500, color: TEXT2,
                    padding: "11px 0", borderRadius: "10px", textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "transparent", textDecoration: "none",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                  data-testid="mobile-button-login"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1, fontSize: "14px", fontWeight: 700, color: "#ffffff",
                    padding: "11px 0", borderRadius: "20px", textAlign: "center",
                    background: ORANGE, textDecoration: "none",
                    boxShadow: "0 2px 10px rgba(232,119,31,0.35)",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                  data-testid="mobile-button-signup"
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
}
