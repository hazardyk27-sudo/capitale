import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

type Preset = "today" | "yesterday" | "last7" | "custom";
type ResetTarget = "today" | "all" | "x" | "meta" | "insta" | "ads" | "direct";
type PromotionStats = {
  totalVisits: number;
  uniqueVisitors: number;
  scrolledVisitors: number;
  scrollRate: number;
  averageDurationSeconds: number;
  medianDurationSeconds: number;
  ctaClicks: { home: number; telegram: number; register: number };
  ctaRates: { home: number; telegram: number; register: number };
  devices: Record<string, number>;
  classifications: { HUMAN: number; SUSPICIOUS: number; "LIKELY BOT": number };
  countries: Record<string, number>;
  sessions: Array<{
    id: number; createdAt: string; lastSeenAt: string; durationSeconds: number;
    didScroll: boolean; maxScrollPercent: number; deviceCategory: string;
    cta: string | null; referrer: string | null; source: string;
    visibleSeconds: number; browserConfirmed: boolean;
    trustedInteraction: boolean; trustedInteractionCount: number; trustedScroll: boolean;
    knownBotUa: boolean; humanScore: number; classification: "HUMAN" | "SUSPICIOUS" | "LIKELY BOT";
    country: string | null; city: string | null;
  }>;
};

function dateValue(date: Date) {
  return date.toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
}
function formatDuration(seconds: number) {
  return seconds < 60 ? `${seconds} sn` : `${Math.floor(seconds / 60)} dk ${seconds % 60} sn`;
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function classificationStyle(classification: "HUMAN" | "SUSPICIOUS" | "LIKELY BOT") {
  return classification === "HUMAN"
    ? { label: "İnsan", color: "#047857", background: "#ecfdf5" }
    : classification === "SUSPICIOUS"
      ? { label: "Şüpheli", color: "#b45309", background: "#fffbeb" }
      : { label: "Olası bot", color: "#b91c1c", background: "#fef2f2" };
}
function card(label: string, value: string | number, accent = "#0E1726", sub?: string) {
  return <div style={{ background: "#fff", border: `1px solid ${accent}33`, borderTop: `3px solid ${accent}`, borderRadius: 10, padding: "14px 18px", minWidth: 140 }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{value}</div>
    <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{sub}</div>}
  </div>;
}

export function PromotionTrackerAdminContent() {
  const [preset, setPreset] = useState<Preset>("today");
  const [source, setSource] = useState<"all" | "x" | "meta" | "insta" | "ads" | "direct">("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [pendingReset, setPendingReset] = useState<ResetTarget | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const now = new Date();
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  const week = new Date(now); week.setDate(now.getDate() - 6);
  const from = preset === "today" ? dateValue(now) : preset === "yesterday" ? dateValue(yesterday) : preset === "last7" ? dateValue(week) : customFrom || dateValue(now);
  const to = preset === "yesterday" ? dateValue(yesterday) : preset === "custom" ? customTo || dateValue(now) : dateValue(now);
  const qs = `from=${from}&to=${to}${source === "all" ? "" : `&source=${source}`}`;
  const { data, isLoading, error } = useQuery<PromotionStats>({
    queryKey: ["promotion-tracker", qs],
    queryFn: async () => {
      const response = await fetch(`/api/admin/promotion-tracker/stats?${qs}`);
      if (!response.ok) throw new Error("Promotion tracker yüklenemedi");
      return response.json();
    },
  });
  const resetMutation = useMutation({
    mutationFn: async (target: ResetTarget) => {
      const response = await apiRequest("POST", "/api/admin/promotion-tracker/reset", {
        target,
        confirmation: target,
      });
      return response.json() as Promise<{ deletedCount: number }>;
    },
    onSuccess: ({ deletedCount }) => {
      setPendingReset(null);
      setResetError(null);
      setResetMessage(`${deletedCount} Promotion Tracker kaydı kalıcı olarak silindi.`);
      queryClient.invalidateQueries({ queryKey: ["promotion-tracker"] });
    },
    onError: (err) => {
      setResetError(err instanceof Error ? err.message : "Sıfırlama başarısız oldu.");
      setResetMessage(null);
    },
  });
  const resetLabels: Record<ResetTarget, string> = {
    today: "Bugünü",
    all: "Tümünü",
    x: "X",
    meta: "Meta",
    insta: "Instagram",
    ads: "Ads",
    direct: "Direct",
  };
  const resetDescription = (target: ResetTarget) => target === "today"
    ? "Europe/Istanbul saatine göre bugünün tüm Promotion Tracker oturumları"
    : target === "all"
      ? "Tüm tarih ve kaynaklardaki Promotion Tracker oturumları"
      : `${resetLabels[target]} kaynağına ait tüm tarihli Promotion Tracker oturumları`;
  const requestReset = (target: ResetTarget) => {
    setResetMessage(null);
    setResetError(null);
    setPendingReset(target);
  };
  const buttonStyle = (active: boolean): React.CSSProperties => ({
    padding: "7px 14px", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer",
    background: active ? "#0E1726" : "#fff", color: active ? "#fff" : "#374151",
    border: `1px solid ${active ? "#0E1726" : "#d1d5db"}`,
  });
  const ctaLabel: Record<string, string> = { home: "Go Home", telegram: "Join Telegram Free", register: "Register Free" };

  return <div style={{ padding: "24px 16px", maxWidth: 960, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0E1726", margin: "0 0 4px" }}>📈 Promotion Tracker</h2>
      <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Promotion sayfası ziyaretleri, kalma süresi, scroll ve CTA tercihleri. Bu rapor Meta → Telegram tracker’dan ayrıdır.</p>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20, alignItems: "center" }}>
      {([["today", "Today"], ["yesterday", "Yesterday"], ["last7", "Last 7 Days"], ["custom", "Custom"]] as [Preset, string][]).map(([key, label]) =>
        <button key={key} onClick={() => setPreset(key)} style={buttonStyle(preset === key)}>{label}</button>)}
      {preset === "custom" && <><input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 8 }} /><span>→</span><input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 8 }} /></>}
    </div>
    <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>Kaynak:</span>
      {([["all", "Tümü"], ["x", "X"], ["meta", "Meta"], ["insta", "Instagram"], ["ads", "Ads"], ["direct", "Direct"]] as const).map(([key, label]) =>
        <button key={key} onClick={() => setSource(key)} style={buttonStyle(source === key)}>{label}</button>)}
    </div>
    <section style={{ marginBottom: 24, padding: 14, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <strong style={{ fontSize: 12, color: "#9a3412" }}>Kalıcı veri sıfırlama</strong>
        <span style={{ fontSize: 11, color: "#c2410c" }}>Meta → Telegram tracker kayıtları etkilenmez.</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button onClick={() => requestReset("today")} disabled={resetMutation.isPending} style={{ ...buttonStyle(false), color: "#c2410c", borderColor: "#fdba74" }}>Bugünü Sıfırla</button>
        <button onClick={() => requestReset("all")} disabled={resetMutation.isPending} style={{ ...buttonStyle(false), color: "#b91c1c", borderColor: "#fca5a5" }}>Tamamen Sıfırla</button>
        {(["x", "meta", "insta", "ads", "direct"] as const).map((target) =>
          <button key={target} onClick={() => requestReset(target)} disabled={resetMutation.isPending} style={{ ...buttonStyle(false), color: "#9a3412", borderColor: "#fed7aa" }}>
            {resetLabels[target]} Sıfırla
          </button>)}
      </div>
      {pendingReset && (
        <div role="alert" style={{ marginTop: 12, padding: 12, background: "#fff", border: "1px solid #fb923c", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#7c2d12", lineHeight: 1.5 }}>
            <strong>{resetLabels[pendingReset]} sıfırlanacak:</strong> {resetDescription(pendingReset)} silinecek. Bu işlem kalıcıdır ve geri alınamaz.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => resetMutation.mutate(pendingReset)} disabled={resetMutation.isPending} style={{ ...buttonStyle(false), background: "#b91c1c", color: "#fff", borderColor: "#b91c1c" }}>
              {resetMutation.isPending ? "Siliniyor…" : "Evet, kalıcı olarak sil"}
            </button>
            <button onClick={() => setPendingReset(null)} disabled={resetMutation.isPending} style={buttonStyle(false)}>Vazgeç</button>
          </div>
        </div>
      )}
      {resetMessage && <div style={{ marginTop: 10, fontSize: 12, color: "#166534" }}>{resetMessage}</div>}
      {resetError && <div style={{ marginTop: 10, fontSize: 12, color: "#b91c1c" }}>Sıfırlama başarısız: {resetError}</div>}
    </section>
    {isLoading && <div style={{ color: "#9ca3af" }}>Yükleniyor…</div>}
    {error && <div style={{ color: "#991b1b", background: "#fef2f2", padding: 12, borderRadius: 8 }}>Promotion istatistikleri yüklenemedi.</div>}
    {data && <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
        {card("Toplam Ziyaret", data.totalVisits, "#0E1726")}
        {card("Tekil Ziyaretçi", data.uniqueVisitors, "#2563eb")}
        {card("Scroll Yapan", data.scrolledVisitors, "#7c3aed", `${data.scrollRate}% oran`)}
        {card("Ort. Açık Kalma", formatDuration(data.averageDurationSeconds), "#059669", `Medyan ${formatDuration(data.medianDurationSeconds)}`)}
      </div>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em", color: "#6b7280" }}>Pasif Güven Sinyalleri</h3>
        <p style={{ margin: "-5px 0 10px", color: "#9ca3af", fontSize: 12 }}>Tarayıcı ve etkileşim sinyallerine dayalı tahmindir; ziyaretçileri engellemez.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {card("İnsan", data.classifications.HUMAN, "#059669")}
          {card("Şüpheli", data.classifications.SUSPICIOUS, "#d97706")}
          {card("Olası Bot", data.classifications["LIKELY BOT"], "#dc2626")}
        </div>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em", color: "#6b7280" }}>CTA Tercihleri</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {(["home", "telegram", "register"] as const).map((key) => card(ctaLabel[key], data.ctaClicks[key], key === "telegram" ? "#229ED9" : "#E8771F", `${data.ctaRates[key]}% ziyaret oranı`))}
        </div>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em", color: "#6b7280" }}>Cihazlar</h3>
        <div style={{ color: "#374151", fontSize: 13 }}>📱 {data.devices.mobile ?? 0} · 📟 {data.devices.tablet ?? 0} · 🖥 {data.devices.desktop ?? 0} · ❓ {data.devices.unknown ?? 0}</div>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em", color: "#6b7280" }}>Ülke Dağılımı</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(data.countries).sort(([, a], [, b]) => b - a).map(([country, count]) =>
            <span key={country} style={{ background: "#f3f4f6", color: "#374151", padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{country}: {count}</span>
          )}
          {!Object.keys(data.countries).length && <span style={{ color: "#9ca3af", fontSize: 13 }}>Konum verisi henüz yok.</span>}
        </div>
      </section>
      <section>
        <h3 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em", color: "#6b7280" }}>Son Promotion Oturumları</h3>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ background: "#f9fafb" }}>{["Zaman", "Kaynak", "Cihaz", "Süre", "Scroll", "Konum", "Skor", "Durum", "Sinyaller", "CTA"].map((h) => <th key={h} style={{ padding: "10px 12px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
            <tbody>{data.sessions.map((session) => {
              const status = classificationStyle(session.classification);
              const signals = [
                session.browserConfirmed && "Tarayıcı",
                session.visibleSeconds > 0 && `${formatDuration(session.visibleSeconds)} görünür`,
                session.trustedInteraction && `${session.trustedInteractionCount} etkileşim`,
                session.trustedScroll && "Doğal scroll",
                session.knownBotUa && "Bot UA",
              ].filter(Boolean);
              return <tr key={session.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>{formatTime(session.createdAt)}</td>
                <td style={{ padding: "9px 12px", fontWeight: 700 }}>
                  {session.source === "x" ? "X" : session.source === "meta" ? "Meta" : session.source === "insta" ? "Instagram" : session.source === "ads" ? "Ads" : "Direct"}
                </td>
                <td style={{ padding: "9px 12px" }}>{session.deviceCategory}</td>
                <td style={{ padding: "9px 12px" }}>{formatDuration(session.durationSeconds)}</td>
                <td style={{ padding: "9px 12px" }}>{session.didScroll ? `Evet (${session.maxScrollPercent}%)` : "Hayır"}</td>
                <td style={{ padding: "9px 12px" }}>{session.country ?? "Unknown"}{session.city ? ` · ${session.city}` : ""}</td>
                <td style={{ padding: "9px 12px", fontWeight: 800 }}>{session.humanScore}/100</td>
                <td style={{ padding: "9px 12px" }}><span style={{ color: status.color, background: status.background, padding: "4px 7px", borderRadius: 999, fontWeight: 700, whiteSpace: "nowrap" }}>{status.label}</span></td>
                <td style={{ padding: "9px 12px", color: "#4b5563", minWidth: 150 }}>{signals.length ? signals.join(" · ") : "Sinyal yok"}</td>
                <td style={{ padding: "9px 12px" }}>{session.cta ? ctaLabel[session.cta] : "—"}</td>
              </tr>;
            })}</tbody>
          </table>
          {!data.sessions.length && <div style={{ padding: 16, color: "#9ca3af" }}>Bu aralıkta Promotion oturumu yok.</div>}
        </div>
      </section>
    </>}
  </div>;
}