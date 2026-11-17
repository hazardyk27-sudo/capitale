/**
 * Meta → Telegram Tracker admin UI — human challenge edition
 *
 * Metrics shown:
 *   Raw Requests             — every REQUEST_SEEN hit
 *   Known Bot / Prefetch     — facebookexternalhit, curl, etc.
 *   Browser-Like             — looks like a browser but did NOT pass JS confirm
 *   Confirmed Browser        — passed JS two-step confirm
 *   Challenge Shown          — press-and-hold challenge rendered (CHALLENGE_SHOWN)
 *   Human Interaction Passed — completed 2-second press-and-hold (HUMAN_CHALLENGE_PASSED)
 *   Challenge Pass Rate      — Human Interaction Passed / Challenge Shown × 100
 *   Telegram Button Clicks   — clicked OPEN TELEGRAM after challenge
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// ── Types ────────────────────────────────────────────────────────────────────

interface SlugStat {
  slug: string;
  label: string;
  rawRequests: number;
  knownBot: number;
  browserLike: number;
  confirmedRedirects: number;
  confirmedUniqueBrowsers: number;
  confirmedPageVisitors: number;
  challengeShown: number;
  challengePassed: number;
  challengePassRate: number;
  telegramButtonClicks: number;
  lastRequest: string | null;
}

interface OverallStat {
  rawRequests: number;
  knownBot: number;
  browserLike: number;
  confirmedRedirects: number;
  confirmedUniqueBrowsers: number;
  confirmedPageVisitors: number;
  challengeShown: number;
  challengePassed: number;
  challengePassRate: number;
  telegramButtonClicks: number;
  resetAt: string;
}

interface TrackerEvent {
  id: number;
  slug: string;
  label: string;
  createdAt: string;
  deviceCategory: string;
  eventType: string;
  classification: string;
  referrer: string | null;
  userAgentSummary: string | null;
  isQa: boolean;
}

// ── Date helpers ─────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
}
function sevenDaysAgoStr() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
}

type Preset = "today" | "yesterday" | "last7" | "custom";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "2-digit", month: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

const devBadge = (dev: string) => {
  if (dev === "mobile")  return "📱";
  if (dev === "desktop") return "🖥";
  if (dev === "tablet")  return "📟";
  return "❓";
};

function evtBadge(eventType: string, cls: string): { bg: string; color: string; label: string } {
  if (eventType === "TELEGRAM_BUTTON_CLICK") {
    return { bg: "#ffedd5", color: "#c2410c", label: "TG Click" };
  }
  if (eventType === "HUMAN_CHALLENGE_PASSED") {
    return { bg: "#d1fae5", color: "#065f46", label: "Human Interaction Passed" };
  }
  if (eventType === "CHALLENGE_SHOWN") {
    return { bg: "#e0e7ff", color: "#3730a3", label: "Challenge Shown" };
  }
  if (eventType === "PAGE_2_SECOND") {
    // legacy label
    return { bg: "#e0e7ff", color: "#3730a3", label: "Challenge Shown (legacy)" };
  }
  if (eventType === "PAGE_CONFIRMED") {
    return { bg: "#dcfce7", color: "#166534", label: "Page Confirmed" };
  }
  if (eventType === "CONFIRMED_BROWSER_REDIRECT" || cls === "CONFIRMED_BROWSER_REDIRECT") {
    return { bg: "#dcfce7", color: "#166534", label: "✓ Confirmed" };
  }
  if (cls === "KNOWN_BOT_OR_PREFETCH") {
    return { bg: "#fef3c7", color: "#92400e", label: "Bot/Prefetch" };
  }
  return { bg: "#f3f4f6", color: "#374151", label: "Browser-Like" };
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent,
}: { label: string; value: number | string; sub?: string; accent?: string }) {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${accent ? accent + "44" : "#e5e7eb"}`,
      borderTop: accent ? `3px solid ${accent}` : "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "14px 18px",
      minWidth: 130,
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: accent ?? "#0E1726", fontFamily: "Inter, sans-serif" }}>
        {value}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "Inter, sans-serif" }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, fontFamily: "Inter, sans-serif" }}>{sub}</div>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TrackerAdminContent() {
  const [preset, setPreset]         = useState<Preset>("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");
  const [showQaEvents, setShowQaEvents] = useState(false);

  const { from, to } = (() => {
    if (preset === "today")     return { from: todayStr(),        to: todayStr() };
    if (preset === "yesterday") return { from: yesterdayStr(),    to: yesterdayStr() };
    if (preset === "last7")     return { from: sevenDaysAgoStr(), to: todayStr() };
    return { from: customFrom || todayStr(), to: customTo || todayStr() };
  })();

  const qs = `from=${from}&to=${to}`;

  const statsKey  = ["tracker-stats",  qs];
  const eventsKey = ["tracker-events", qs, showQaEvents];

  const { data: statsData, isLoading: statsLoading, error: statsError } =
    useQuery<{ slugs: SlugStat[]; overall: OverallStat }>({
      queryKey: statsKey,
      queryFn: async () => {
        const r = await fetch(`/api/admin/tracker/stats?${qs}`);
        if (!r.ok) throw new Error("Stats yüklenemedi");
        return r.json();
      },
    });

  const { data: eventsData, isLoading: eventsLoading } =
    useQuery<{ events: TrackerEvent[] }>({
      queryKey: eventsKey,
      queryFn: async () => {
        const r = await fetch(`/api/admin/tracker/events?${qs}&limit=100${showQaEvents ? "&includeQa=1" : ""}`);
        if (!r.ok) throw new Error("Events yüklenemedi");
        return r.json();
      },
    });

  const overall = statsData?.overall;
  const slugs   = statsData?.slugs ?? [];
  const events  = eventsData?.events ?? [];

  // ── Date filter bar ───────────────────────────────────────────────────────
  const presets: { key: Preset; label: string }[] = [
    { key: "today",     label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "last7",     label: "Last 7 Days" },
    { key: "custom",    label: "Custom" },
  ];

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: "7px 14px", fontSize: 12, fontWeight: 600,
    borderRadius: 8, border: "1px solid",
    cursor: "pointer",
    background: active ? "#0E1726" : "#fff",
    color:      active ? "#fff"    : "#374151",
    borderColor: active ? "#0E1726" : "#d1d5db",
  });

  return (
    <div style={{ padding: "24px 16px", maxWidth: 960, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0E1726", margin: "0 0 4px" }}>
          📊 Meta → Telegram Tracker
        </h2>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Beş reklam bağlantısında basılı tut (human challenge) ve Telegram niyeti ölçülür. QA trafiği normal sonuçlara dahil değildir.
        </p>
      </div>

      {/* Date filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20, alignItems: "center" }}>
        {presets.map((p) => (
          <button key={p.key} onClick={() => setPreset(p.key)} style={btnStyle(preset === p.key)}>
            {p.label}
          </button>
        ))}
        {preset === "custom" && (
          <>
            <input
              type="date" value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              style={{ padding: "6px 10px", fontSize: 12, border: "1px solid #d1d5db", borderRadius: 8 }}
            />
            <span style={{ fontSize: 12, color: "#6b7280" }}>→</span>
            <input
              type="date" value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              style={{ padding: "6px 10px", fontSize: 12, border: "1px solid #d1d5db", borderRadius: 8 }}
            />
          </>
        )}
      </div>

      {/* Reset banner */}
      {overall && (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#166534", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span><strong>Human challenge aktif</strong> — panel yalnızca sıfırlama sonrasındaki trafiği gösterir.</span>
        </div>
      )}

      {statsError && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#991b1b", fontSize: 13 }}>
          İstatistikler yüklenirken hata oluştu.
        </div>
      )}

      {statsLoading ? (
        <div style={{ color: "#9ca3af", fontSize: 13, padding: "20px 0" }}>Yükleniyor…</div>
      ) : overall && (
        <>
          {/* Overall summary cards */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              Genel Toplam
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <StatCard label="Raw Requests"               value={overall.rawRequests} />
              <StatCard label="Bot / Prefetch"             value={overall.knownBot}               accent="#f59e0b" />
              <StatCard label="Browser-Like"               value={overall.browserLike}            accent="#6b7280" sub="JS çalıştırmadı" />
              <StatCard label="Confirmed Browser"          value={overall.confirmedPageVisitors}  accent="#16a34a" sub="sayfa yüklendi" />
              <StatCard label="Challenge Shown"            value={overall.challengeShown}         accent="#4f46e5" sub="basılı tut gösterildi" />
              <StatCard label="Human Interaction Passed"   value={overall.challengePassed}        accent="#065f46" sub="basılı tut tamamlandı" />
              <StatCard label="Challenge Pass Rate"        value={`${overall.challengePassRate}%`} accent="#059669" sub="passed / shown" />
              <StatCard label="Telegram Button Clicks"     value={overall.telegramButtonClicks}   accent="#c2410c" />
            </div>
          </div>

          {/* Per-slug table */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              Reklam Bazlı
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                      {[
                        "Reklam", "Raw", "Bot", "Browser-Like",
                        "Confirmed ✓", "Challenge Shown", "Human Interaction Passed", "Pass Rate",
                        "TG Clicks", "Son İstek",
                      ].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slugs.map((s, i) => (
                      <tr key={s.slug} style={{ borderBottom: i < slugs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 600, color: "#0E1726", whiteSpace: "nowrap" }}>
                          <div>{s.label}</div>
                          <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 400 }}>/go/{s.slug}</div>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#374151" }}>{s.rawRequests}</td>
                        <td style={{ padding: "10px 12px", color: "#92400e" }}>{s.knownBot}</td>
                        <td style={{ padding: "10px 12px", color: "#6b7280" }}>{s.browserLike}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#16a34a" }}>{s.confirmedPageVisitors}</td>
                        <td style={{ padding: "10px 12px", color: "#4338ca" }}>{s.challengeShown}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#065f46" }}>{s.challengePassed}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#059669" }}>{s.challengePassRate}%</td>
                        <td style={{ padding: "10px 12px", color: "#c2410c", fontWeight: 700 }}>{s.telegramButtonClicks}</td>
                        <td style={{ padding: "10px 12px", color: "#6b7280", whiteSpace: "nowrap" }}>
                          {s.lastRequest ? fmtTime(s.lastRequest) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recent events table */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
          Son Olaylar
          <label style={{ marginLeft: 12, fontSize: 11, fontWeight: 500, color: "#6b7280", textTransform: "none", letterSpacing: 0 }}>
            <input
              type="checkbox"
              checked={showQaEvents}
              onChange={(e) => setShowQaEvents(e.target.checked)}
              style={{ marginRight: 5, verticalAlign: "middle" }}
            />
            QA kayıtlarını göster
          </label>
        </div>
        {eventsLoading ? (
          <div style={{ color: "#9ca3af", fontSize: 13 }}>Yükleniyor…</div>
        ) : events.length === 0 ? (
          <div style={{ color: "#9ca3af", fontSize: 13 }}>Bu aralıkta kayıt yok.</div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    {["Zaman", "Reklam", "Cihaz", "Tür", "Referrer", "User Agent"].map((h) => (
                      <th key={h} style={{ padding: "9px 10px", textAlign: "left", fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((e, i) => {
                    const badge = evtBadge(e.eventType, e.classification);
                    return (
                      <tr key={e.id} style={{ borderBottom: i < events.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <td style={{ padding: "8px 10px", whiteSpace: "nowrap", color: "#374151" }}>{fmtTime(e.createdAt)}</td>
                        <td style={{ padding: "8px 10px", fontWeight: 600, color: "#0E1726", whiteSpace: "nowrap" }}>
                          <div style={{ fontSize: 11 }}>{e.label}</div>
                          <div style={{ fontSize: 10, color: "#9ca3af" }}>/go/{e.slug}</div>
                        </td>
                        <td style={{ padding: "8px 10px", fontSize: 14 }}>
                          {devBadge(e.deviceCategory)}{" "}
                          <span style={{ fontSize: 10, color: "#6b7280" }}>{e.deviceCategory}</span>
                        </td>
                        <td style={{ padding: "8px 10px" }}>
                          <span style={{
                            background: badge.bg, color: badge.color,
                            borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 700,
                          }}>
                            {e.isQa ? "QA" : badge.label}
                          </span>
                        </td>
                        <td style={{ padding: "8px 10px", color: "#6b7280", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {e.referrer ?? "—"}
                        </td>
                        <td style={{ padding: "8px 10px", color: "#6b7280", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {e.userAgentSummary ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
