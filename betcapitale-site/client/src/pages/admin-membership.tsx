import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Trash2, ChevronDown, ChevronUp, Save, Crown, Star, Globe, EyeOff, Clock, Upload, ImageIcon } from "lucide-react";
import type { MembershipPublicationWithLegs } from "@shared/schema";

function todayStr(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}

const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-white";

function LegResultBadge({ result }: { result: string | null | undefined }) {
  if (!result) return <span className="text-xs text-gray-400">—</span>;
  const map: Record<string, string> = { won: "text-green-700 bg-green-50", lost: "text-red-600 bg-red-50", void: "text-gray-500 bg-gray-100" };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${map[result] ?? "text-gray-500"}`}>{result}</span>;
}

function PubStatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    draft:       { cls: "bg-gray-100 text-gray-600",    label: "Taslak" },
    scheduled:   { cls: "bg-blue-100 text-blue-700",    label: "Planlandı" },
    published:   { cls: "bg-green-100 text-green-700",  label: "Yayında" },
    unpublished: { cls: "bg-amber-100 text-amber-700",  label: "Yayından Kaldırıldı" },
  };
  const m = map[status] ?? map.draft;
  return <span className={`text-xs font-bold px-2 py-0.5 rounded ${m.cls}`}>{m.label}</span>;
}

function PubImageUploader({ pubId, imageType, currentImage, label }: {
  pubId: number;
  imageType: "pre_match" | "settled";
  currentImage: string | null | undefined;
  label: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setUploading(true);
      try {
        await apiRequest("POST", `/api/admin/membership/publications/${pubId}/image`, {
          imageType,
          imageData: dataUrl,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/membership/publications"] });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async () => {
    setUploading(true);
    try {
      await apiRequest("DELETE", `/api/admin/membership/publications/${pubId}/image`, { imageType });
      setPreview(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/membership/publications"] });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt={label}
            className="w-full rounded border border-gray-200 object-contain max-h-48"
            data-testid={`image-${imageType}-${pubId}`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded transition-colors"
              data-testid={`button-replace-image-${imageType}-${pubId}`}
            >
              <Upload className="w-3 h-3" /> Değiştir
            </button>
            <button
              onClick={handleDelete}
              disabled={uploading}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-2.5 py-1.5 rounded transition-colors"
              data-testid={`button-delete-image-${imageType}-${pubId}`}
            >
              <Trash2 className="w-3 h-3" /> Sil
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">Yükleniyor…</span>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          data-testid={`button-upload-image-${imageType}-${pubId}`}
          className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-gray-200 rounded p-4 hover:border-orange-300 hover:bg-orange-50 transition-colors text-gray-400 hover:text-orange-500 disabled:opacity-40"
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-xs font-medium">PNG / JPG yükle</span>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        data-testid={`input-file-image-${imageType}-${pubId}`}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}

function QuickPngUploader({ tier, date, target }: { tier: "select" | "unlimited"; date: string; target: "members_only" | "profile" }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setPreview(null);
    setMsg(null);
  }, [tier, date, target]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setUploading(true);
      setMsg(null);
      try {
        const res = await apiRequest("POST", "/api/admin/membership/quick-png", {
          tier, date, target, imageType: "pre_match", imageData,
        });
        if (!res.ok) throw new Error("Sunucu hatası");
        setPreview(imageData);
        setMsg({ type: "ok", text: "Kupon yüklendi ✓" });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/membership/publications"] });
      } catch {
        setMsg({ type: "err", text: "Yükleme başarısız." });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-gray-400" /> PNG ile Kupon Yükle
        </span>
        {msg && (
          <span className={`text-xs font-semibold ${msg.type === "ok" ? "text-green-600" : "text-red-500"}`}>
            {msg.text}
          </span>
        )}
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        data-testid="button-quick-png-pre_match"
        className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-4 py-6 transition-colors disabled:opacity-40 hover:border-orange-400 hover:bg-orange-50"
        style={{ borderColor: uploading ? "#E8771F" : "#e5e7eb" }}
      >
        {uploading ? (
          <span className="text-xs text-gray-500">Yükleniyor…</span>
        ) : (
          <>
            <ImageIcon className="w-7 h-7 text-[#E8771F]" />
            <span className="text-sm font-semibold text-[#E8771F]">PNG / JPG yükle</span>
            <span className="text-[11px] text-gray-400">Pre-Match Görseli</span>
          </>
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        data-testid="input-quick-png-pre_match"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />

      {preview && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-gray-500">Önizleme</span>
          <img
            src={preview}
            alt="Yüklenen kupon önizlemesi"
            className="w-full rounded border border-gray-200 object-contain max-h-80"
            data-testid="img-quick-png-preview"
          />
        </div>
      )}
    </div>
  );
}

function MemberCounterSettings() {
  const { data } = useQuery<{ base: number }>({ queryKey: ["/api/settings/member-count"] });
  const [value, setValue] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (data?.base !== undefined) setValue(String(data.base));
  }, [data?.base]);

  const mutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/settings/member-count", { base: parseInt(value) }),
    onSuccess: () => {
      setMsg("Kaydedildi ✓");
      queryClient.invalidateQueries({ queryKey: ["/api/settings/member-count"] });
      setTimeout(() => setMsg(null), 3000);
    },
    onError: () => setMsg("Hata — kaydetme başarısız."),
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-800">Üye Sayacı Tabanı</p>
          <p className="text-xs text-gray-500 mt-0.5">Landing page'de gösterilen başlangıç üye sayısı</p>
        </div>
        {msg && (
          <span className={`text-xs font-semibold ${msg.startsWith("Kaydedildi") ? "text-green-600" : "text-red-500"}`}>
            {msg}
          </span>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="input-member-count-base"
          className={`${inputCls} max-w-[140px] font-mono`}
          placeholder="örn. 1247"
        />
        <button
          data-testid="button-save-member-count"
          disabled={mutation.isPending || !value}
          onClick={() => mutation.mutate()}
          className="flex items-center gap-1.5 bg-[#E8771F] hover:bg-[#d06018] text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors disabled:opacity-40"
        >
          <Save className="w-3.5 h-3.5" /> Kaydet
        </button>
      </div>
    </div>
  );
}

export function MembershipAdminContent() {
  const [filterDate, setFilterDate] = useState(todayStr());
  const [activeGroup, setActiveGroup] = useState<"select" | "unlimited">("select");
  const [activeTarget, setActiveTarget] = useState<"members_only" | "profile">("members_only");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [summaryTitle, setSummaryTitle] = useState("");
  const [summaryTotalCoupons, setSummaryTotalCoupons] = useState(0);
  const [summaryTotalMatches, setSummaryTotalMatches] = useState(0);
  const [summaryMsg, setSummaryMsg] = useState<string | null>(null);

  const summaryQueryKey = ["/api/membership-summary", filterDate, activeGroup];
  useQuery<{ title?: string; totalCoupons: number; totalMatches: number }>({
    queryKey: summaryQueryKey,
    queryFn: async () => {
      const r = await fetch(`/api/membership-summary?date=${filterDate}&tier=${activeGroup}`);
      const data = await r.json();
      setSummaryTitle(data.title ?? "");
      setSummaryTotalCoupons(data.totalCoupons ?? 0);
      setSummaryTotalMatches(data.totalMatches ?? 0);
      setSummaryMsg(null);
      return data;
    },
    staleTime: 0,
  });

  const saveSummaryMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/membership-summary", {
      date: filterDate, tier: activeGroup,
      title: summaryTitle,
      totalCoupons: summaryTotalCoupons, totalMatches: summaryTotalMatches,
    }),
    onSuccess: () => {
      setSummaryMsg("Özet kaydedildi.");
      queryClient.invalidateQueries({ queryKey: summaryQueryKey });
    },
    onError: () => setSummaryMsg("Kaydetme başarısız."),
  });

  const queryKey = ["/api/admin/membership/publications", filterDate, activeGroup, activeTarget];
  const { data: pubs = [], isLoading } = useQuery<MembershipPublicationWithLegs[]>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({ date: filterDate, tier: activeGroup, target: activeTarget });
      const r = await fetch(`/api/admin/membership/publications?${params}`);
      if (!r.ok) return [];
      const data = await r.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/membership/publications/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/membership/publications"] }),
  });

  const [schedulingId, setSchedulingId] = useState<number | null>(null);
  const [scheduleTime, setScheduleTime] = useState("");

  const publishMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/membership/publications/${id}/publish`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/membership/publications"] }),
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/membership/publications/${id}/unpublish`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/membership/publications"] }),
  });

  const scheduleMutation = useMutation({
    mutationFn: ({ id, scheduledAt }: { id: number; scheduledAt: string }) =>
      apiRequest("POST", `/api/admin/membership/publications/${id}/schedule`, { scheduledAt }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/membership/publications"] });
      setSchedulingId(null);
      setScheduleTime("");
    },
  });

  const groupConfig = {
    select:    { label: "Capitale Select",    icon: <Star className="w-3.5 h-3.5" />,  color: "#E8771F", bg: "#FFF7F0" },
    unlimited: { label: "Capitale Unlimited", icon: <Crown className="w-3.5 h-3.5" />, color: "#7C3AED", bg: "#F5F3FF" },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

      {/* ── Member counter setting ── */}
      <MemberCounterSettings />

      {/* ── Target Sub-tabs (Members Only vs Profile) ── */}
      <div className="flex border-b border-gray-200">
        {([
          { key: "members_only" as const, label: "Bugünün Maçları (Members Only)" },
          { key: "profile" as const, label: "Profil Sayfası" },
        ]).map(t => (
          <button
            key={t.key}
            data-testid={`tab-target-${t.key}`}
            onClick={() => setActiveTarget(t.key)}
            className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTarget === t.key
                ? "border-current text-[#1a1a2e]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Group Sub-tabs ── */}
      <div className="flex border-b border-gray-200">
        {(["select", "unlimited"] as const).map(g => {
          const cfg = groupConfig[g];
          return (
            <button
              key={g}
              data-testid={`tab-group-${g}`}
              onClick={() => setActiveGroup(g)}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeGroup === g
                  ? "border-current"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              style={activeGroup === g ? { color: cfg.color, borderColor: cfg.color } : {}}
            >
              {cfg.icon}
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* ── Date filter ── */}
      <div className="flex items-center gap-2">
        <input type="date" className={inputCls + " w-40"} data-testid="filter-date"
          value={filterDate} onChange={e => { setFilterDate(e.target.value); setSummaryMsg(null); }} />
        <span className="text-xs text-gray-400">{pubs.length} yayın</span>
      </div>

      {/* ── Özet ── */}
      <div className="bg-white border border-gray-200 rounded shadow-sm px-4 py-3 flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 shrink-0">📊 Özet:</span>
        <input
          type="text"
          placeholder="Kupon ismi…"
          data-testid="input-summary-title"
          className="border border-gray-200 rounded px-2 py-1 text-sm w-40 focus:outline-none focus:border-blue-400"
          value={summaryTitle}
          onChange={e => { setSummaryTitle(e.target.value); setSummaryMsg(null); }}
        />
        <input type="number" min={0} step={1} data-testid="input-summary-coupons"
          className="border border-gray-200 rounded px-2 py-1 text-sm w-16 focus:outline-none focus:border-blue-400"
          value={summaryTotalCoupons}
          onChange={e => { setSummaryTotalCoupons(Math.max(0, parseInt(e.target.value) || 0)); setSummaryMsg(null); }}
        />
        <span className="text-xs text-gray-400">kupon</span>
        <input type="number" min={0} step={1} data-testid="input-summary-matches"
          className="border border-gray-200 rounded px-2 py-1 text-sm w-16 focus:outline-none focus:border-blue-400"
          value={summaryTotalMatches}
          onChange={e => { setSummaryTotalMatches(Math.max(0, parseInt(e.target.value) || 0)); setSummaryMsg(null); }}
        />
        <span className="text-xs text-gray-400">maç</span>
        <button data-testid="button-save-summary"
          disabled={saveSummaryMutation.isPending}
          onClick={() => saveSummaryMutation.mutate()}
          className="flex items-center gap-1 text-xs text-white font-semibold bg-[#1a1a2e] hover:bg-[#2a2a4e] px-2.5 py-1 rounded transition-colors disabled:opacity-40"
        ><Save className="w-3 h-3" />{saveSummaryMutation.isPending ? "…" : "Kaydet"}</button>
        {summaryMsg && <span className="text-xs font-semibold text-green-600">{summaryMsg}</span>}
      </div>

      {/* ── Quick PNG upload — always visible ── */}
      <QuickPngUploader tier={activeGroup} date={filterDate} target={activeTarget} />

      {/* ── Publications list ── */}
      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-8">Yükleniyor…</p>
      ) : pubs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-8 text-center">
          <p className="text-sm text-gray-400">Bu tarih için {groupConfig[activeGroup].label} yayını yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pubs.map((pub) => (
            <div key={pub.id} className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <PubStatusBadge status={pub.pubStatus} />
                  <span className="text-sm font-semibold text-gray-800 truncate">{pub.title}</span>
                  <span className="text-xs text-gray-400 shrink-0">{pub.date}</span>
                  {pub.result && <LegResultBadge result={pub.result.toLowerCase()} />}
                  {pub.couponRef && (
                    <span className="text-xs text-gray-400 font-mono">#{pub.couponRef}</span>
                  )}
                  {(pub.stake || pub.totalOdds) && (
                    <span className="text-xs text-gray-500">
                      {pub.stake ? `€${pub.stake}` : ""}{pub.totalOdds ? ` · @${pub.totalOdds.toFixed(2)}` : ""}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {pub.pubStatus === "published" ? (
                    <button
                      data-testid={`button-unpublish-${pub.id}`}
                      onClick={() => unpublishMutation.mutate(pub.id)}
                      disabled={unpublishMutation.isPending}
                      title="Yayından Kaldır"
                      className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded transition-colors disabled:opacity-40"
                    >
                      <EyeOff className="w-3 h-3" /> Kaldır
                    </button>
                  ) : (
                    <>
                      <button
                        data-testid={`button-publish-${pub.id}`}
                        onClick={() => publishMutation.mutate(pub.id)}
                        disabled={publishMutation.isPending}
                        title="Hemen Yayınla"
                        className="flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors disabled:opacity-40"
                      >
                        <Globe className="w-3 h-3" /> Yayınla
                      </button>
                      <button
                        data-testid={`button-schedule-${pub.id}`}
                        onClick={() => { setSchedulingId(pub.id === schedulingId ? null : pub.id); setScheduleTime(""); }}
                        title="Planla"
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                      >
                        <Clock className="w-3 h-3" /> Planla
                      </button>
                    </>
                  )}
                  <button onClick={() => deleteMutation.mutate(pub.id)} data-testid={`button-delete-pub-${pub.id}`}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setExpandedId(expandedId === pub.id ? null : pub.id)}
                    data-testid={`button-expand-pub-${pub.id}`}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded">
                    {expandedId === pub.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {schedulingId === pub.id && (
                <div className="px-4 py-3 border-t border-blue-100 bg-blue-50 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-blue-700 shrink-0">Yayın saati:</span>
                  <input
                    type="datetime-local"
                    data-testid={`input-schedule-time-${pub.id}`}
                    className="border border-blue-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 bg-white"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                  />
                  <button
                    data-testid={`button-confirm-schedule-${pub.id}`}
                    disabled={!scheduleTime || scheduleMutation.isPending}
                    onClick={() => scheduleMutation.mutate({ id: pub.id, scheduledAt: new Date(scheduleTime).toISOString() })}
                    className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors disabled:opacity-40"
                  >
                    <Clock className="w-3 h-3" /> Planla
                  </button>
                  <button onClick={() => setSchedulingId(null)} className="text-xs text-blue-500 hover:text-blue-700">İptal</button>
                </div>
              )}

              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <div className="grid grid-cols-2 gap-3">
                  <PubImageUploader
                    pubId={pub.id}
                    imageType="pre_match"
                    currentImage={pub.preMatchImage}
                    label="Pre-Match Görseli"
                  />
                  <PubImageUploader
                    pubId={pub.id}
                    imageType="settled"
                    currentImage={pub.settledImage}
                    label="Settled Görseli"
                  />
                </div>
              </div>

              {expandedId === pub.id && (
                <div className="border-t border-gray-100">
                  {pub.analysis && (
                    <div className="px-4 py-2 bg-orange-50 border-b border-orange-100">
                      <p className="text-xs text-orange-800">{pub.analysis}</p>
                    </div>
                  )}

                  {pub.legs.length === 0 ? (
                    <p className="text-xs text-gray-400 px-4 py-3">Seçim yok.</p>
                  ) : (
                    pub.legs.map((leg, i) => (
                      <div key={leg.id} className={`px-4 py-2.5 text-sm ${i > 0 ? "border-t border-gray-100" : ""}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-gray-800">{leg.homeTeam} — {leg.awayTeam}</span>
                              <LegResultBadge result={leg.result} />
                            </div>
                            <div className="flex gap-2 mt-0.5 text-xs text-gray-500 flex-wrap">
                              {leg.competition && <span>{leg.competition}</span>}
                              {leg.kickoffAt && <span className="text-[#E8771F] font-semibold">{leg.kickoffAt}</span>}
                              <span>{leg.market}: <strong className="text-gray-700">{leg.selection}</strong></span>
                              <span className="font-mono">@{leg.odds.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
