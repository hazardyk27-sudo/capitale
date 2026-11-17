import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Save } from "lucide-react";
import { BugunAdminContent } from "./admin-bugun";
import { CouponAdminContent } from "./admin-coupons";
import { MembershipAdminContent } from "./admin-membership";
import { AdminSocialMediaContent } from "./admin-social-media";
import { CounterAdminContent } from "./admin-counter";
import { AdminMembersContent } from "./admin-members";
import { TrackerAdminContent } from "./admin-tracker";
import { PromotionTrackerAdminContent } from "./admin-promotion-tracker";
import { queryClient, apiRequest } from "@/lib/queryClient";

type Tab = "today" | "coupon" | "membership" | "tier" | "social" | "counter" | "users" | "tracker" | "promotion-tracker";
type AuthState = "loading" | "logged-out" | "not-admin" | "ok";

const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-white";

// ── Not-admin view (logged in but no admin rights) ───────────────────────────
function AdminNotAdminView({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [bootstrapping, setBootstrapping] = useState(false);
  const [bootstrapMsg, setBootstrapMsg] = useState<string | null>(null);

  async function handleBootstrap() {
    setBootstrapping(true);
    setBootstrapMsg(null);
    try {
      const res = await fetch("/api/admin/membership/bootstrap-admin", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setBootstrapMsg(`✓ Admin olarak tanımlandı: ${data.email}`);
        // Re-check admin status after bootstrap
        setTimeout(onLoggedIn, 800);
      } else {
        setBootstrapMsg(`Hata: ${data.error}`);
      }
    } finally {
      setBootstrapping(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // Drop any session-scoped cached data (admin lists, tier-filtered
    // content, etc.) so the next login on this browser never briefly
    // renders data left over from this session.
    queryClient.clear();
    onLoggedIn(); // re-check → will flip back to logged-out, show login form
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: "0 16px" }}>
      <div style={{
        background: "#fffbeb",
        border: "1px solid #fcd34d",
        borderRadius: 12,
        padding: "28px 24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#92400e", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>
          ⚠️ Admin yetkisi yok
        </p>
        <p style={{ fontSize: 13, color: "#78350f", margin: "0 0 20px", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
          Giriş yaptınız ancak bu hesabın admin yetkisi bulunmuyor.
          Eğer henüz hiç admin tanımlanmadıysa aşağıdaki butona basarak ilk kurulumu yapabilirsiniz.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={handleBootstrap}
            disabled={bootstrapping}
            data-testid="button-bootstrap-admin"
            style={{
              padding: "9px 16px", fontSize: 13, fontWeight: 700,
              color: "#fff", background: bootstrapping ? "#b45309" : "#d97706",
              border: "none", borderRadius: 8, cursor: bootstrapping ? "not-allowed" : "pointer",
              opacity: bootstrapping ? 0.7 : 1, fontFamily: "Inter, sans-serif",
            }}
          >
            {bootstrapping ? "İşleniyor…" : "Beni Admin Yap (İlk Kurulum)"}
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "9px 16px", fontSize: 13, fontWeight: 600,
              color: "#374151", background: "#f3f4f6",
              border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Farklı Hesapla Giriş Yap
          </button>
        </div>
        {bootstrapMsg && (
          <p style={{
            marginTop: 12, fontSize: 13, fontFamily: "Inter, sans-serif",
            color: bootstrapMsg.startsWith("✓") ? "#065f46" : "#991b1b",
            fontWeight: 600,
          }}>
            {bootstrapMsg}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Inline admin login gate ───────────────────────────────────────────────────
function AdminLoginGate({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const checkAdmin = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/me");
      if (r.ok) {
        setAuthState("ok");
      } else if (r.status === 403) {
        setAuthState("not-admin");
      } else {
        setAuthState("logged-out");
      }
    } catch {
      setAuthState("logged-out");
    }
  }, []);

  useEffect(() => { checkAdmin(); }, [checkAdmin]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr(null);
    setLoggingIn(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) {
        setLoginErr(data.error || "Giriş başarısız.");
        return;
      }
      // Drop any session-scoped cached data left over from a previous
      // session on this browser before refreshing admin status.
      queryClient.clear();
      await checkAdmin();
    } catch {
      setLoginErr("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setLoggingIn(false);
    }
  }

  if (authState === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px 16px", color: "#9ca3af", fontSize: 13 }}>
        Kontrol ediliyor…
      </div>
    );
  }

  if (authState === "ok") {
    return <>{children}</>;
  }

  // "not-admin" → user is logged in but isn't admin
  if (authState === "not-admin") {
    return <AdminNotAdminView onLoggedIn={checkAdmin} />;
  }

  // "logged-out" → show inline login form
  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: "0 16px" }}>
      <div style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "32px 28px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0E1726", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>
            Admin Girişi
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0, fontFamily: "Inter, sans-serif" }}>
            Admin paneline erişmek için giriş yapın.
          </p>
        </div>

        {loginErr && (
          <div style={{
            background: "rgba(220,38,38,0.07)",
            border: "1px solid rgba(220,38,38,0.2)",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontFamily: "Inter, sans-serif" }}>{loginErr}</p>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{
              fontSize: 11, fontWeight: 700, color: "#6b7280",
              textTransform: "uppercase", letterSpacing: "0.07em",
              display: "block", marginBottom: 6, fontFamily: "Inter, sans-serif",
            }}>
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setLoginErr(null); }}
              required
              placeholder="admin@betcapitale.com"
              data-testid="input-admin-email"
              style={{
                width: "100%", padding: "10px 12px", fontSize: 14,
                border: "1px solid #e5e7eb", borderRadius: 8, outline: "none",
                color: "#0E1726", background: "#f9fafb",
                boxSizing: "border-box", fontFamily: "Inter, sans-serif",
              }}
            />
          </div>
          <div>
            <label style={{
              fontSize: 11, fontWeight: 700, color: "#6b7280",
              textTransform: "uppercase", letterSpacing: "0.07em",
              display: "block", marginBottom: 6, fontFamily: "Inter, sans-serif",
            }}>
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginErr(null); }}
              required
              placeholder="••••••••"
              data-testid="input-admin-password"
              style={{
                width: "100%", padding: "10px 12px", fontSize: 14,
                border: "1px solid #e5e7eb", borderRadius: 8, outline: "none",
                color: "#0E1726", background: "#f9fafb",
                boxSizing: "border-box", fontFamily: "Inter, sans-serif",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loggingIn}
            data-testid="button-admin-login"
            style={{
              marginTop: 4, padding: "12px", fontSize: 14, fontWeight: 700,
              color: "#fff", background: "#E8771F", border: "none",
              borderRadius: 8, cursor: loggingIn ? "not-allowed" : "pointer",
              opacity: loggingIn ? 0.7 : 1, fontFamily: "Inter, sans-serif",
              transition: "opacity 0.15s",
            }}
          >
            {loggingIn ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Tier management tab ───────────────────────────────────────────────────────
function TierManagementContent() {
  const [tierEmail, setTierEmail] = useState("");
  const [tierValue, setTierValue] = useState<"" | "select" | "unlimited">("");
  const [expiresAt, setExpiresAt] = useState("");
  const [tierMsg, setTierMsg] = useState<string | null>(null);

  const setTierMutation = useMutation({
    // Blank date input must leave the existing expiry untouched — the server treats any
    // *present* expiresAt key (including null) as an explicit overwrite, so we omit the
    // key entirely here rather than sending null, which would wipe a Whop-synced expiry
    // any time an admin updates just the tier.
    mutationFn: () => apiRequest("POST", "/api/admin/membership/set-tier", {
      email: tierEmail,
      tier: tierValue || null,
      ...(expiresAt ? { expiresAt } : {}),
    }),
    onSuccess: async (res) => {
      const data = await res.json();
      setTierMsg(`✓ ${data.email} → ${data.memberTier ?? "kaldırıldı"}`);
      setTierEmail("");
      setTierValue("");
      setExpiresAt("");
    },
    onError: (err: unknown) => {
      setTierMsg("Hata: " + (err instanceof Error ? err.message : "Bilinmeyen hata"));
    },
  });

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#1a1a2e] px-5 py-3.5">
          <h2 className="text-white font-semibold text-sm">👤 Üye Tier Yönetimi</h2>
          <p className="text-gray-400 text-xs mt-0.5">Kullanıcıya Select veya Unlimited erişim ver ya da kaldır.</p>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">E-posta Adresi</label>
            <input
              data-testid="input-tier-email"
              className={inputCls}
              placeholder="kullanici@email.com"
              value={tierEmail}
              onChange={e => { setTierEmail(e.target.value); setTierMsg(null); }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Üyelik Tipi</label>
            <div className="grid grid-cols-3 gap-2">
              {(["", "select", "unlimited"] as const).map(v => (
                <button
                  key={v}
                  data-testid={`tier-option-${v || "remove"}`}
                  onClick={() => { setTierValue(v); setTierMsg(null); }}
                  className={`py-2 text-xs font-semibold rounded border transition-colors ${
                    tierValue === v
                      ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {v === "" ? "— Kaldır" : v === "select" ? "⭐ Select" : "👑 Unlimited"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Üyelik Bitiş Tarihi (opsiyonel)</label>
            <input
              data-testid="input-tier-expires-at"
              type="date"
              className={inputCls}
              value={expiresAt}
              onChange={e => { setExpiresAt(e.target.value); setTierMsg(null); }}
            />
            <p className="text-[11px] text-gray-400 mt-1">Whop üzerinden otomatik hesaplanır; burada elle düzeltebilirsiniz. Boş bırakırsanız değişmez.</p>
          </div>
          <button
            data-testid="button-set-tier"
            disabled={!tierEmail || setTierMutation.isPending}
            onClick={() => setTierMutation.mutate()}
            className="w-full flex items-center justify-center gap-2 bg-[#E8771F] hover:bg-[#d06018] text-white text-sm font-semibold px-4 py-2.5 rounded transition-colors disabled:opacity-40"
          >
            <Save className="w-4 h-4" />
            {setTierMutation.isPending ? "Kaydediliyor…" : "Kaydet"}
          </button>
          {tierMsg && (
            <p className={`text-sm font-semibold rounded px-3 py-2 ${tierMsg.startsWith("✓") ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50"}`}>
              {tierMsg}
            </p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-4 text-xs text-blue-700 leading-relaxed">
        <strong>Select</strong> — Capitale Select yayınlarını görür.<br />
        <strong>Unlimited</strong> — Select ve Unlimited yayınlarını görür.<br />
        <strong>Kaldır</strong> — Üyelik erişimini tamamen kaldırır.
      </div>
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState<Tab>(() => {
    const saved = sessionStorage.getItem("admin-active-tab");
    return saved && ["today", "coupon", "membership", "tier", "social", "counter", "users", "tracker", "promotion-tracker"].includes(saved)
      ? saved as Tab
      : "today";
  });

  useEffect(() => {
    sessionStorage.setItem("admin-active-tab", tab);
  }, [tab]);

  const tabLabels: Record<Tab, string> = {
    today:      "📅 Today",
    coupon:     "🎟 Coupon Builder",
    membership: "👑 Membership Pubs",
    tier:       "👤 Member Tier",
    social:     "📸 Social Media",
    counter:    "🔢 Member Counter",
    users:      "👥 Members",
    tracker:    "📊 Tracker",
    "promotion-tracker": "📈 Promotion Tracker",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header — always visible */}
      <div className="bg-[#0E1726] text-white px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-base tracking-tight">Bet Capitale Admin</span>
        <div className="flex gap-3 text-sm">
          <Link href="/today" className="text-blue-200 hover:text-white">Today ↗</Link>
          <Link href="/coupons" className="text-blue-200 hover:text-white">Coupons ↗</Link>
        </div>
      </div>

      {/* Everything below requires admin login */}
      <AdminLoginGate>
        {/* Tab bar */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="max-w-3xl mx-auto flex overflow-x-auto">
            {(["today", "coupon", "membership", "tier", "social", "counter", "users", "tracker", "promotion-tracker"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                data-testid={`tab-admin-${t}`}
                style={{
                  padding: "12px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: tab === t ? "#0E1726" : "#6b7280",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  borderBottom: tab === t ? "2px solid #0E1726" : "2px solid transparent",
                  marginBottom: "-1px",
                  transition: "color 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {tabLabels[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {tab === "today"      && <BugunAdminContent />}
        {tab === "coupon"     && <CouponAdminContent />}
        {tab === "membership" && <MembershipAdminContent />}
        {tab === "tier"       && <TierManagementContent />}
        {tab === "social"     && <AdminSocialMediaContent />}
        {tab === "counter"    && <CounterAdminContent />}
        {tab === "users"      && <AdminMembersContent />}
        {tab === "tracker"    && <TrackerAdminContent />}
        {tab === "promotion-tracker" && <PromotionTrackerAdminContent />}
      </AdminLoginGate>
    </div>
  );
}
