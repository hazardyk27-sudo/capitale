import { useQuery, useMutation } from "@tanstack/react-query";
import { MARKETS, SELECTION_PICKS, FALLBACK_PICKS, KICKOFF_TIMES } from "@/data/betConstants";
import { useState, useRef } from "react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Save, X, Upload, Image, Eye } from "lucide-react";
import type { TodayMatch, TodayCoupon, TodayPublicPick } from "@shared/schema";
import { CouponImageDialog } from "@/components/CouponImageDialog";

type AdminTodayCoupon = TodayCoupon & { hasPreMatchImage: boolean; hasSettledImage: boolean };

/* ── helpers ─────────────────────────────────────────────────── */
function todayISODate(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}

const inputCls =
  "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400";
const labelCls = "block text-xs font-semibold text-gray-600 mb-1";
const btnPrimary =
  "flex items-center gap-1.5 bg-[#0E1726] hover:bg-[#1a2740] text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnDanger =
  "flex items-center gap-1 text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50";

const MATCH_RESULT_OPTS = [
  { key: "won",       label: "W", activeColor: "#fff", activeBg: "#129A63", idleBg: "#dcfce7", idleColor: "#129A63" },
  { key: "lost",      label: "L", activeColor: "#fff", activeBg: "#D95A68", idleBg: "#fee2e2", idleColor: "#D95A68" },
  { key: "void",      label: "V", activeColor: "#fff", activeBg: "#5D6B7A", idleBg: "#f1f5f9", idleColor: "#5D6B7A" },
  { key: "postponed", label: "P", activeColor: "#fff", activeBg: "#D4820A", idleBg: "#fef3c7", idleColor: "#D4820A" },
] as const;

/* ── image helper ─────────────────────────────────────────────── */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ── Section wrapper ─────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <h2 className="text-sm font-bold text-gray-800">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MATCHES SECTION
══════════════════════════════════════════════════════════════ */
function MatchesSection({ date }: { date: string }) {
  const { toast } = useToast();
  const emptyForm = { homeTeam: "", awayTeam: "", competition: "", kickoffAt: "20:00" };
  const [form, setForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const { data: matches = [], isLoading } = useQuery<TodayMatch[]>({
    queryKey: ["/api/admin/today/matches", date],
    queryFn: () => fetch(`/api/admin/today/matches?date=${date}`).then((r) => r.json()),
  });

  const createMut = useMutation({
    mutationFn: () => apiRequest("POST", "/api/today/matches", { ...form, date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/today/matches", date] });
      setForm(emptyForm);
      setAdding(false);
      toast({ title: "Maç eklendi", description: `${form.homeTeam} — ${form.awayTeam} başarıyla eklendi.` });
    },
    onError: () => toast({ title: "Hata", description: "Maç eklenemedi.", variant: "destructive" }),
  });

  async function syncFromCoupons() {
    setSyncing(true);
    try {
      const res = await apiRequest("POST", `/api/admin/today/sync-matches-from-coupons?date=${date}`);
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/today/matches", date] });
      if (data.total === 0) {
        toast({ title: "Kupon bulunamadı", description: "Kupon Üretici'de bu tarih için maç yok." });
      } else if (data.added === 0) {
        toast({ title: "Zaten eklendi", description: `${data.skipped} maç zaten Günün Maçları'nda mevcut.` });
      } else {
        toast({
          title: `${data.added} maç aktarıldı`,
          description: data.skipped > 0 ? `${data.skipped} maç zaten mevcuttu, atlandı.` : "Tüm maçlar başarıyla eklendi.",
        });
      }
    } catch {
      toast({ title: "Hata", description: "Aktarım başarısız oldu.", variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  }

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/today/matches/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/today/matches", date] });
      toast({ title: "Maç silindi" });
    },
    onError: () => toast({ title: "Hata", description: "Maç silinemedi.", variant: "destructive" }),
  });

  return (
    <Section title={`Günün Maçları (${matches.length})`}>
      {isLoading ? (
        <p className="text-sm text-gray-400 mb-3">Yükleniyor…</p>
      ) : matches.length === 0 ? (
        <p className="text-sm text-gray-400 italic mb-3">Bugün için maç girilmemiş.</p>
      ) : (
        <div className="divide-y divide-gray-100 mb-3">
          {matches.map((m) => (
            <div key={m.id} className="py-2.5" data-testid={`admin-match-${m.id}`}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{m.homeTeam} — {m.awayTeam}</p>
                  <p className="text-xs text-gray-500">{m.competition} · {m.kickoffAt}</p>
                </div>
                <button
                  onClick={() => deleteMut.mutate(m.id)}
                  disabled={deleteMut.isPending}
                  className={btnDanger}
                  data-testid={`button-delete-match-${m.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!adding ? (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setAdding(true)} className={btnPrimary} data-testid="button-add-match">
            <Plus className="w-4 h-4" /> Maç Ekle
          </button>
          <button
            onClick={syncFromCoupons}
            disabled={syncing}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-sync-matches"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {syncing ? "Aktarılıyor…" : "Kupon Üretici'den Aktar"}
          </button>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 mt-2">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className={labelCls}>Ev Sahibi</label>
              <input
                className={inputCls}
                value={form.homeTeam}
                onChange={(e) => setForm((f) => ({ ...f, homeTeam: e.target.value }))}
                placeholder="Liverpool"
                data-testid="input-home-team"
              />
            </div>
            <div>
              <label className={labelCls}>Deplasman</label>
              <input
                className={inputCls}
                value={form.awayTeam}
                onChange={(e) => setForm((f) => ({ ...f, awayTeam: e.target.value }))}
                placeholder="Man City"
                data-testid="input-away-team"
              />
            </div>
            <div>
              <label className={labelCls}>Lig / Turnuva</label>
              <input
                className={inputCls}
                value={form.competition}
                onChange={(e) => setForm((f) => ({ ...f, competition: e.target.value }))}
                placeholder="Premier League"
                data-testid="input-competition"
              />
            </div>
            <div>
              <label className={labelCls}>Başlangıç Saati</label>
              <input
                type="text"
                className={inputCls}
                value={form.kickoffAt}
                onChange={(e) => setForm((f) => ({ ...f, kickoffAt: e.target.value }))}
                placeholder="20:00"
                data-testid="input-kickoff-at"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createMut.mutate()}
              disabled={createMut.isPending || !form.homeTeam || !form.awayTeam || !form.competition}
              className={btnPrimary}
              data-testid="button-save-match"
            >
              <Save className="w-4 h-4" /> {createMut.isPending ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button
              onClick={() => { setAdding(false); setForm(emptyForm); }}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
              data-testid="button-cancel-match"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COUPONS SECTION
══════════════════════════════════════════════════════════════ */
type CouponForm = {
  label: string;
  matchCount: number;
  totalOdds: number;
  stake: number;
  status: string;
  result: string;
};

const emptyCouponForm = (): CouponForm => ({
  label: "",
  matchCount: 1,
  totalOdds: 0,
  stake: 0,
  status: "PRE_MATCH",
  result: "",
});

/* preMatchFile / settledFile: undefined = not touched, null = explicitly cleared, string = base64 data */
type ImageState = string | null | undefined;

function CouponsSection({ date }: { date: string }) {
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<CouponForm>(emptyCouponForm());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [preMatchFile, setPreMatchFile] = useState<ImageState>(undefined);
  const [settledFile, setSettledFile] = useState<ImageState>(undefined);
  const preMatchRef = useRef<HTMLInputElement>(null);
  const settledRef = useRef<HTMLInputElement>(null);

  const { data: coupons = [], isLoading } = useQuery<AdminTodayCoupon[]>({
    queryKey: ["/api/admin/today/coupons", date],
    queryFn: () => fetch(`/api/admin/today/coupons?date=${date}`).then((r) => r.json()),
  });

  function buildPayload() {
    const payload: Record<string, unknown> = {
      date,
      label: form.label || undefined,
      matchCount: form.matchCount,
      totalOdds: form.totalOdds,
      stake: form.stake,
      status: form.status,
      result: form.result || null,
    };
    if (preMatchFile !== undefined) payload.preMatchImage = preMatchFile;
    if (settledFile !== undefined) payload.settledImage = settledFile;
    return payload;
  }

  const createMut = useMutation({
    mutationFn: () => apiRequest("POST", "/api/today/coupons", buildPayload()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/today/coupons", date] });
      toast({ title: "Kupon eklendi" });
      resetForm();
    },
    onError: () => toast({ title: "Hata", description: "Kupon eklenemedi.", variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/today/coupons/${id}`, buildPayload()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/today/coupons", date] });
      toast({ title: "Kupon güncellendi" });
      resetForm();
    },
    onError: () => toast({ title: "Hata", description: "Kupon güncellenemedi.", variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/today/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/today/coupons", date] });
      toast({ title: "Kupon silindi" });
    },
    onError: () => toast({ title: "Hata", description: "Kupon silinemedi.", variant: "destructive" }),
  });

  function resetForm() {
    setAdding(false);
    setEditingId(null);
    setForm(emptyCouponForm());
    setPreMatchFile(undefined);
    setSettledFile(undefined);
  }

  function startEdit(c: TodayCoupon) {
    setEditingId(c.id);
    setAdding(false);
    setForm({
      label: c.label,
      matchCount: c.matchCount,
      totalOdds: c.totalOdds,
      stake: c.stake,
      status: c.status,
      result: c.result ?? "",
    });
    setPreMatchFile(c.preMatchImage ?? undefined);
    setSettledFile(c.settledImage ?? undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: ImageState) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setter(b64);
  }

  const isFormOpen = adding || editingId !== null;

  return (
    <Section title={`Paylaşılan Kuponlar (${coupons.length})`}>
      {isLoading ? (
        <p className="text-sm text-gray-400 mb-3">Yükleniyor…</p>
      ) : coupons.length === 0 ? (
        <p className="text-sm text-gray-400 italic mb-3">Bugün için kupon girilmemiş.</p>
      ) : (
        <div className="divide-y divide-gray-100 mb-3">
          {coupons.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2.5 gap-2" data-testid={`admin-coupon-${c.id}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    c.status === "SETTLED"
                      ? c.result === "WON" ? "bg-green-100 text-green-700"
                        : c.result === "LOST" ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                      : "bg-orange-50 text-orange-600"
                  }`}>
                    {c.status === "SETTLED" ? (c.result ?? "SETTLED") : "PRE_MATCH"}
                  </span>
                </div>
                <div className="flex gap-3 mt-0.5 text-xs text-gray-400">
                  {c.stake > 0 && <span>{c.stake}€</span>}
                  {c.totalOdds > 0 && <span>@{c.totalOdds}</span>}
                  {c.matchCount > 0 && <span>{c.matchCount} maç</span>}
                  <span>{c.hasPreMatchImage ? "✅ PNG" : "⬜ Görsel yok"}</span>
                  <span>{c.hasSettledImage ? "✅ Sonuç" : "⬜ Sonuç yok"}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => startEdit(c)}
                  className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                  data-testid={`button-edit-coupon-${c.id}`}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => deleteMut.mutate(c.id)}
                  disabled={deleteMut.isPending}
                  className={btnDanger}
                  data-testid={`button-delete-coupon-${c.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isFormOpen && (
        <button onClick={() => setAdding(true)} className={btnPrimary} data-testid="button-add-coupon">
          <Plus className="w-4 h-4" /> Kupon PNG Ekle
        </button>
      )}

      {isFormOpen && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-2 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">{editingId ? "Kuponu Düzenle" : "Kupon PNG Ekle"}</p>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Label */}
          <div>
            <label className={labelCls}>Kupon İsmi</label>
            <input
              className={inputCls}
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Kupon 01"
              data-testid="input-coupon-label"
            />
          </div>

          {/* Maç sayısı · Oran · Tutar */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Maç Sayısı</label>
              <input
                type="number"
                min="1"
                step="1"
                className={inputCls}
                value={form.matchCount || ""}
                onChange={(e) => setForm((f) => ({ ...f, matchCount: parseInt(e.target.value) || 0 }))}
                placeholder="1"
                data-testid="input-coupon-match-count"
              />
            </div>
            <div>
              <label className={labelCls}>Oran</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className={inputCls}
                value={form.totalOdds || ""}
                onChange={(e) => setForm((f) => ({ ...f, totalOdds: parseFloat(e.target.value) || 0 }))}
                placeholder="3.75"
                data-testid="input-coupon-odds"
              />
            </div>
            <div>
              <label className={labelCls}>Tutar (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputCls}
                value={form.stake || ""}
                onChange={(e) => setForm((f) => ({ ...f, stake: parseFloat(e.target.value) || 0 }))}
                placeholder="10.00"
                data-testid="input-coupon-stake"
              />
            </div>
          </div>

          {/* Pre-match image — big upload area */}
          <div>
            <label className={labelCls}>Kupon PNG <span className="font-normal text-gray-400">(Maç Öncesi)</span></label>
            <input
              ref={preMatchRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, setPreMatchFile)}
              data-testid="input-pre-match-image"
            />
            {preMatchFile ? (
              <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                <img src={preMatchFile} alt="Kupon görseli" className="w-full max-h-64 object-contain bg-gray-50" />
                <button
                  onClick={() => { setPreMatchFile(null); if (preMatchRef.current) preMatchRef.current.value = ""; }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  title="Görseli kaldır"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => preMatchRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-white border border-gray-300 text-xs text-gray-600 px-2 py-1 rounded shadow-sm hover:bg-gray-50"
                >
                  Değiştir
                </button>
              </div>
            ) : (
              <button
                onClick={() => preMatchRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg py-10 flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
                data-testid="button-upload-pre-match"
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm font-medium">PNG / görsel seç</span>
                <span className="text-xs">veya buraya sürükle</span>
              </button>
            )}
          </div>

          {/* Settled image + status — only in edit mode or when pre-match is set */}
          {(editingId || preMatchFile) && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Durum</label>
                <select
                  className={inputCls}
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  data-testid="select-coupon-status"
                >
                  <option value="PRE_MATCH">PRE_MATCH</option>
                  <option value="SETTLED">SETTLED</option>
                </select>
              </div>
              {form.status === "SETTLED" && (
                <div>
                  <label className={labelCls}>Sonuç</label>
                  <select
                    className={inputCls}
                    value={form.result}
                    onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
                    data-testid="select-coupon-result"
                  >
                    <option value="">— seçin —</option>
                    <option value="WON">WON</option>
                    <option value="LOST">LOST</option>
                    <option value="VOID">VOID</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Settled image */}
          {(editingId || form.status === "SETTLED") && (
            <div>
              <label className={labelCls}>Sonuç Görseli PNG</label>
              <input
                ref={settledRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, setSettledFile)}
                data-testid="input-settled-image"
              />
              {settledFile ? (
                <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                  <img src={settledFile} alt="Sonuç görseli" className="w-full max-h-48 object-contain bg-gray-50" />
                  <button
                    onClick={() => { setSettledFile(null); if (settledRef.current) settledRef.current.value = ""; }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    title="Görseli kaldır"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => settledRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg py-6 flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
                  data-testid="button-upload-settled"
                >
                  <Image className="w-5 h-5" />
                  <span className="text-xs">Sonuç PNG yükle</span>
                </button>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => editingId ? updateMut.mutate(editingId) : createMut.mutate()}
              disabled={editingId ? updateMut.isPending : createMut.isPending}
              className={btnPrimary}
              data-testid="button-save-coupon"
            >
              <Save className="w-4 h-4" />
              {(editingId ? updateMut.isPending : createMut.isPending) ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
              data-testid="button-cancel-coupon"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PUBLISH SECTION
══════════════════════════════════════════════════════════════ */
function PublishSection({ date }: { date: string }) {
  const { toast } = useToast();
  const [timeInput, setTimeInput] = useState("");
  const [editingTime, setEditingTime] = useState(false);
  const [editTimeVal, setEditTimeVal] = useState("");

  const { data, isLoading: statusLoading } = useQuery<{ date: string; published: boolean; publishedAt: string | null }>({
    queryKey: ["/api/today/published", date],
    queryFn: () => fetch(`/api/today/published?date=${date}`).then((r) => r.json()),
  });

  const publishMut = useMutation({
    mutationFn: async () => {
      const body: Record<string, string> = { date };
      if (/^\d{2}:\d{2}$/.test(timeInput)) body.publishedAt = timeInput;
      const res = await apiRequest("POST", "/api/today/publish", body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/today/published", date] });
      toast({ title: "✅ Yayınlandı", description: "Bugünün planı web'de görünür." });
    },
    onError: () => toast({ title: "Hata", description: "Yayınlama başarısız.", variant: "destructive" }),
  });

  const updateTimeMut = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", "/api/today/publish", { date, publishedAt: editTimeVal });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/today/published", date] });
      setEditingTime(false);
      toast({ title: "Saat güncellendi" });
    },
    onError: () => toast({ title: "Hata", description: "Saat güncellenemedi.", variant: "destructive" }),
  });

  const unpublishMut = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/today/publish?date=${date}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/today/published", date] });
      setEditingTime(false);
      toast({ title: "Yayından kaldırıldı" });
    },
    onError: () => toast({ title: "Hata", description: "İşlem başarısız.", variant: "destructive" }),
  });

  const published = data?.published ?? false;
  const publishedAt = data?.publishedAt ?? null;
  const isPending = publishMut.isPending || unpublishMut.isPending || updateTimeMut.isPending;

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-bold text-gray-800">Web Yayın Durumu</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {statusLoading ? "Kontrol ediliyor…" : published ? "✅ Şu an yayında" : "⏸ Yayınlanmadı — web'de görünmez"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Time input — shown only before publishing */}
          {!published && (
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-500 whitespace-nowrap">Yayın saati:</label>
              <input
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="border border-gray-200 rounded px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
                data-testid="input-publish-time"
              />
            </div>
          )}

          <button
            onClick={() => (published ? unpublishMut.mutate() : publishMut.mutate())}
            disabled={isPending || statusLoading}
            className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              published
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-[#0E1726] text-white hover:bg-[#1a2740]"
            }`}
            data-testid="button-publish-today"
          >
            {isPending ? "…" : published ? "✅ Yayında" : "📢 Yayınla"}
          </button>
        </div>
      </div>

      {/* Inline time edit — shown when published */}
      {published && publishedAt && (
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Yayın saati: <strong className="text-gray-700">{publishedAt}</strong></span>
          {!editingTime ? (
            <button
              onClick={() => { setEditTimeVal(publishedAt); setEditingTime(true); }}
              className="text-xs text-blue-600 hover:underline"
              data-testid="button-edit-publish-time"
            >
              ✏️ Düzenle
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                type="time"
                value={editTimeVal}
                onChange={(e) => setEditTimeVal(e.target.value)}
                className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
                data-testid="input-edit-publish-time"
              />
              <button
                onClick={() => updateTimeMut.mutate()}
                disabled={updateTimeMut.isPending || !/^\d{2}:\d{2}$/.test(editTimeVal)}
                className="text-xs font-semibold bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                data-testid="button-save-publish-time"
              >
                Kaydet
              </button>
              <button
                onClick={() => setEditingTime(false)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                İptal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SONUCLAR SECTION
══════════════════════════════════════════════════════════════ */
const RESULT_OPTS_COUPON = [
  { key: "WON",  label: "W", bg: "#16a34a", text: "#fff" },
  { key: "LOST", label: "L", bg: "#ef4444", text: "#fff" },
  { key: "VOID", label: "V", bg: "#9ca3af", text: "#fff" },
] as const;

function SonuclarSection({ date }: { date: string }) {
  const { toast } = useToast();
  const [returnAmounts, setReturnAmounts] = useState<Record<number, string>>({});
  const settledRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const { data: coupons = [], isLoading } = useQuery<AdminTodayCoupon[]>({
    queryKey: ["/api/admin/today/coupons", date],
    queryFn: () => fetch(`/api/admin/today/coupons?date=${date}`).then((r) => r.json()),
  });

  const { data: matches = [] } = useQuery<TodayMatch[]>({
    queryKey: ["/api/admin/today/matches", date],
    queryFn: () => fetch(`/api/admin/today/matches?date=${date}`).then((r) => r.json()),
  });

  const matchResultMut = useMutation({
    mutationFn: ({ id, result }: { id: number; result: string | null }) =>
      apiRequest("PATCH", `/api/today/matches/${id}`, { result }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/today/matches", date] });
    },
    onError: () => toast({ title: "Hata", description: "Sonuç kaydedilemedi.", variant: "destructive" }),
  });

  const { data: allEntries = [] } = useQuery<Array<{ id: number; date: string; value: number }>>({
    queryKey: ["/api/entries"],
  });
  const existingEntry = allEntries.find((e) => e.date === date) ?? null;

  const gecmiseMut = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/today/push-to-history", { date });
      return res.json() as Promise<{ netProfit: number }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/history/coupons"] });
      toast({
        title: "Geçmişe eklendi ✓",
        description: `Net kâr/zarar €${data.netProfit.toFixed(2)} olarak kaydedildi.`,
      });
    },
    onError: (err: unknown) => {
      const msg = (err as { message?: string })?.message ?? "Bilinmeyen hata";
      toast({ title: "Hata", description: msg, variant: "destructive" });
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) =>
      apiRequest("PUT", `/api/today/coupons/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/today/coupons", date] });
    },
    onError: () => toast({ title: "Hata", description: "Güncelleme başarısız.", variant: "destructive" }),
  });

  function setResult(c: TodayCoupon, key: string) {
    const isToggleOff = c.result === key;
    const newResult = isToggleOff ? null : key;
    const autoReturn = +(c.stake * c.totalOdds).toFixed(2);
    if (newResult === "WON" && returnAmounts[c.id] === undefined) {
      setReturnAmounts((prev) => ({ ...prev, [c.id]: String(autoReturn) }));
    }
    updateMut.mutate({
      id: c.id,
      payload: {
        result: newResult,
        status: newResult ? "SETTLED" : "PRE_MATCH",
        returnAmount: newResult === "WON"
          ? (parseFloat(returnAmounts[c.id] ?? "") || autoReturn)
          : null,
      },
    });
  }

  function saveReturnAmount(c: TodayCoupon) {
    const val = parseFloat(returnAmounts[c.id] ?? "");
    if (!isNaN(val)) {
      updateMut.mutate({ id: c.id, payload: { returnAmount: val } });
    }
  }

  async function handleSettledImage(c: TodayCoupon, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    updateMut.mutate({ id: c.id, payload: { settledImage: b64, status: "SETTLED" } });
  }

  const totalStake  = coupons.reduce((s, c) => s + c.stake, 0);
  const wonCoupons  = coupons.filter((c) => c.result === "WON");
  const totalReturn = wonCoupons.reduce((s, c) => s + (c.returnAmount ?? c.stake * c.totalOdds), 0);
  const netProfit   = totalReturn - totalStake;
  const hasSettled  = coupons.some((c) => c.status === "SETTLED");

  return (
    <Section title="Bugünün Sonuçları">
      {/* ── Match results ───────────────────────────────────── */}
      {matches.length > 0 && (
        <div className="mb-5 pb-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Maç Sonuçları</p>
          <div className="divide-y divide-gray-100">
            {matches.map((m) => (
              <div key={m.id} className="py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{m.homeTeam} — {m.awayTeam}</p>
                    {m.competition && <p className="text-xs text-gray-500">{m.competition}</p>}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {MATCH_RESULT_OPTS.map(({ key, label, activeColor, activeBg, idleBg, idleColor }) => {
                      const isActive = m.result === key;
                      return (
                        <button
                          key={key}
                          onClick={() => matchResultMut.mutate({ id: m.id, result: isActive ? null : key })}
                          disabled={matchResultMut.isPending}
                          style={{
                            fontSize: "11px", fontWeight: 700,
                            padding: "2px 10px", borderRadius: "100px",
                            background: isActive ? activeBg : idleBg,
                            color: isActive ? activeColor : idleColor,
                            border: "none", cursor: "pointer", transition: "all 0.12s",
                          }}
                          data-testid={`button-sonuclar-match-result-${key}-${m.id}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Coupon results ──────────────────────────────────── */}
      {isLoading ? (
        <p className="text-sm text-gray-400">Yükleniyor…</p>
      ) : coupons.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Bugün için kupon girilmemiş. Önce "Paylaşılan Kuponlar" kısmından kupon ekleyin.</p>
      ) : (
        <>
          <div className="divide-y divide-gray-100 mb-4">
            {coupons.map((c) => {
              const autoReturn = +(c.stake * c.totalOdds).toFixed(2);
              const inputVal = returnAmounts[c.id] !== undefined
                ? returnAmounts[c.id]
                : c.returnAmount !== null && c.returnAmount !== undefined
                  ? String(c.returnAmount)
                  : String(autoReturn);
              return (
                <div key={c.id} className="py-3" data-testid={`sonuclar-coupon-${c.id}`}>
                  {/* Header row: label + result toggles */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{c.label || "Kupon"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c.stake > 0 && `${c.stake}€`}
                        {c.totalOdds > 0 && ` @${c.totalOdds}`}
                        {c.matchCount > 0 && ` · ${c.matchCount} maç`}
                      </p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {RESULT_OPTS_COUPON.map(({ key, label, bg, text }) => {
                        const active = c.result === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setResult(c, key)}
                            style={{
                              width: "28px", height: "28px", borderRadius: "50%",
                              background: active ? bg : "transparent",
                              color: active ? text : "#9ca3af",
                              border: `2px solid ${active ? bg : "#e5e7eb"}`,
                              fontSize: "11px", fontWeight: 700,
                              cursor: "pointer", transition: "all 0.15s",
                            }}
                            data-testid={`button-coupon-result-${key.toLowerCase()}-${c.id}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Return amount — only for WON */}
                  {c.result === "WON" && (
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <label className="text-xs text-gray-500 whitespace-nowrap">Dönüş (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        className={inputCls}
                        value={inputVal}
                        onChange={(e) => setReturnAmounts((prev) => ({ ...prev, [c.id]: e.target.value }))}
                        onBlur={() => saveReturnAmount(c)}
                        data-testid={`input-return-amount-${c.id}`}
                      />
                    </div>
                  )}

                  {/* Settled image */}
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      ref={(el) => { settledRefs.current[c.id] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleSettledImage(c, e)}
                    />
                    {c.hasSettledImage ? (
                      <>
                        <button
                          onClick={() => settledRefs.current[c.id]?.click()}
                          className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1.5 rounded border border-green-200 transition-colors"
                          data-testid={`button-replace-settled-result-${c.id}`}
                        >
                          <Image className="w-3.5 h-3.5" />
                          Sonuç Görseli Değiştir
                        </button>
                        <CouponImageDialog
                          couponId={c.id}
                          source="admin/today"
                          label={c.label ?? "Sonuç Görseli"}
                          buttonLabel={<Eye className="w-3.5 h-3.5" />}
                          buttonClassName="inline-flex items-center justify-center w-7 h-7 rounded border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 transition-colors cursor-pointer"
                        />
                        <button
                          onClick={() => {
                            if (!window.confirm("Sonuç görselini kaldırmak istediğinize emin misiniz?")) return;
                            updateMut.mutate({ id: c.id, payload: { settledImage: null } });
                          }}
                          className="inline-flex items-center justify-center w-7 h-7 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Görseli kaldır"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => settledRefs.current[c.id]?.click()}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                        data-testid={`button-upload-settled-result-${c.id}`}
                      >
                        <Image className="w-3.5 h-3.5" />
                        Sonuç Görseli Ekle
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Auto bilanço */}
          {hasSettled && (
            <div className={`rounded-lg p-3 ${netProfit >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Otomatik Bilanço</p>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div>
                  <p className="text-xs text-gray-400">Toplam Sermaye</p>
                  <p className="text-sm font-bold text-gray-800">€{totalStake.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Toplam Dönüş</p>
                  <p className="text-sm font-bold text-gray-800">€{totalReturn.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Net Kâr / Zarar</p>
                  <p className={`text-sm font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {netProfit >= 0 ? "+" : ""}€{netProfit.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Geçmişe Ekle */}
              <div className="border-t border-gray-200/60 pt-3 flex items-center justify-between gap-3">
                {existingEntry !== null && (
                  <p className="text-xs text-gray-500">
                    ✓ Geçmişte kayıtlı: <span className={`font-bold ${existingEntry.value >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {existingEntry.value >= 0 ? "+" : ""}€{existingEntry.value.toFixed(2)}
                    </span>
                  </p>
                )}
                <button
                  onClick={() => gecmiseMut.mutate()}
                  disabled={gecmiseMut.isPending}
                  className={`ml-auto flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                    existingEntry !== null
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-[#0E1726] hover:bg-[#1a2740] text-white"
                  }`}
                  data-testid="button-gecmise-ekle"
                >
                  {gecmiseMut.isPending
                    ? "Kaydediliyor…"
                    : existingEntry !== null
                      ? "♻ Güncelle"
                      : "📥 Geçmişe Ekle"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PUBLIC PICK SECTION
══════════════════════════════════════════════════════════════ */
type PickForm = {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  market: string;
  selection: string;
  odds: string;
  kickoffAt: string;
  status: string;
  result: string;
};

const emptyPickForm = (): PickForm => ({
  homeTeam: "",
  awayTeam: "",
  competition: "",
  market: "",
  selection: "",
  odds: "",
  kickoffAt: "20:00",
  status: "PRE_MATCH",
  result: "",
});

function pickToForm(p: TodayPublicPick): PickForm {
  return {
    homeTeam: p.homeTeam,
    awayTeam: p.awayTeam,
    competition: p.competition,
    market: p.market,
    selection: p.selection,
    odds: String(p.odds),
    kickoffAt: p.kickoffAt,
    status: p.status,
    result: p.result ?? "",
  };
}

function PublicPickSection({ date }: { date: string }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<PickForm>(emptyPickForm());

  const { data: pick } = useQuery<TodayPublicPick | null>({
    queryKey: ["/api/admin/today/public-pick", date],
    queryFn: () => fetch(`/api/admin/today/public-pick?date=${date}`).then((r) => r.json()),
  });

  const saveMut = useMutation({
    mutationFn: () => {
      const payload = {
        date,
        homeTeam: form.homeTeam,
        awayTeam: form.awayTeam,
        competition: form.competition,
        market: form.market,
        selection: form.selection,
        odds: parseFloat(form.odds) || 1,
        kickoffAt: form.kickoffAt,
        status: form.status,
        result: form.result || null,
      };
      // Use PUT if existing pick has an ID, else POST (upsert)
      if (pick?.id) {
        return apiRequest("PUT", `/api/today/public-pick/${pick.id}`, payload);
      }
      return apiRequest("POST", "/api/today/public-pick", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/today/public-pick", date] });
      toast({ title: "Tahmin kaydedildi" });
      setEditing(false);
    },
    onError: () => toast({ title: "Hata", description: "Tahmin kaydedilemedi.", variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/today/public-pick/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/today/public-pick", date] });
      toast({ title: "Tahmin silindi" });
    },
    onError: () => toast({ title: "Hata", description: "Tahmin silinemedi.", variant: "destructive" }),
  });

  function startEdit() {
    setForm(pick ? pickToForm(pick) : emptyPickForm());
    setEditing(true);
  }

  const canSave = Boolean(form.homeTeam && form.awayTeam && form.market && form.selection && form.odds);

  return (
    <Section title="Herkese Açık Tahmin">
      {pick && !editing && (
        <div className="border border-orange-100 rounded-lg p-3 bg-orange-50 mb-3" data-testid="admin-public-pick">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-gray-800">{pick.homeTeam} — {pick.awayTeam}</p>
              <p className="text-xs text-gray-500 mt-0.5">{pick.market} · <strong className="text-orange-700">{pick.selection}</strong> · {pick.odds.toFixed(2)} oran · {pick.kickoffAt}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                pick.status === "SETTLED"
                  ? pick.result === "WON" ? "bg-green-100 text-green-700"
                    : pick.result === "LOST" ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                  : "bg-orange-100 text-orange-700"
              }`}>
                {pick.status === "SETTLED" ? (pick.result ?? "SETTLED") : "PRE_MATCH"}
              </span>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={startEdit}
                className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded border border-gray-200 hover:bg-white transition-colors"
                data-testid="button-edit-pick"
              >
                Düzenle
              </button>
              <button
                onClick={() => deleteMut.mutate(pick.id)}
                disabled={deleteMut.isPending}
                className={btnDanger}
                data-testid="button-delete-pick"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!pick && !editing && (
        <p className="text-sm text-gray-400 italic mb-3">Bugün için herkese açık tahmin girilmemiş.</p>
      )}

      {!editing && (
        <button onClick={startEdit} className={btnPrimary} data-testid="button-edit-pick-open">
          {pick ? <><Save className="w-4 h-4" /> Güncelle</> : <><Plus className="w-4 h-4" /> Tahmin Ekle</>}
        </button>
      )}

      {editing && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-gray-700">{pick ? "Tahmini Düzenle" : "Yeni Tahmin"}</p>
            <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Ev Sahibi</label>
              <input
                className={inputCls}
                value={form.homeTeam}
                onChange={(e) => setForm((f) => ({ ...f, homeTeam: e.target.value }))}
                placeholder="Liverpool"
                data-testid="input-pick-home-team"
              />
            </div>
            <div>
              <label className={labelCls}>Deplasman</label>
              <input
                className={inputCls}
                value={form.awayTeam}
                onChange={(e) => setForm((f) => ({ ...f, awayTeam: e.target.value }))}
                placeholder="Arsenal"
                data-testid="input-pick-away-team"
              />
            </div>
            <div>
              <label className={labelCls}>Lig (opsiyonel)</label>
              <input
                className={inputCls}
                value={form.competition}
                onChange={(e) => setForm((f) => ({ ...f, competition: e.target.value }))}
                placeholder="Premier League"
                data-testid="input-pick-competition"
              />
            </div>
            <div>
              <label className={labelCls}>Başlangıç Saati</label>
              <datalist id="pick-kickoff-opts">
                {KICKOFF_TIMES.map((t) => <option key={t} value={t} />)}
              </datalist>
              <input
                type="text"
                className={inputCls}
                list="pick-kickoff-opts"
                value={form.kickoffAt}
                onChange={(e) => setForm((f) => ({ ...f, kickoffAt: e.target.value }))}
                placeholder="20:00"
                data-testid="input-pick-kickoff"
              />
            </div>
            <div>
              <label className={labelCls}>Market</label>
              <datalist id="pick-market-opts">
                {MARKETS.map((m) => <option key={m} value={m} />)}
              </datalist>
              <input
                className={inputCls}
                list="pick-market-opts"
                value={form.market}
                onChange={(e) => setForm((f) => ({ ...f, market: e.target.value }))}
                placeholder="Toplam Gol"
                data-testid="input-pick-market"
              />
            </div>
            <div>
              <label className={labelCls}>Seçim</label>
              <datalist id="pick-selection-opts">
                {(SELECTION_PICKS[form.market] ?? FALLBACK_PICKS).map((p) => <option key={p} value={p} />)}
              </datalist>
              <input
                className={inputCls}
                list="pick-selection-opts"
                value={form.selection}
                onChange={(e) => setForm((f) => ({ ...f, selection: e.target.value }))}
                placeholder="2.5 Gol Üstü"
                data-testid="input-pick-selection"
              />
            </div>
            <div>
              <label className={labelCls}>Oran</label>
              <input
                type="number"
                step="0.01"
                className={inputCls}
                value={form.odds}
                onChange={(e) => setForm((f) => ({ ...f, odds: e.target.value }))}
                placeholder="1.72"
                data-testid="input-pick-odds"
              />
            </div>
            <div>
              <label className={labelCls}>Durum</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                data-testid="select-pick-status"
              >
                <option value="PRE_MATCH">PRE_MATCH</option>
                <option value="SETTLED">SETTLED</option>
              </select>
            </div>
            {form.status === "SETTLED" && (
              <div>
                <label className={labelCls}>Sonuç</label>
                <select
                  className={inputCls}
                  value={form.result}
                  onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
                  data-testid="select-pick-result"
                >
                  <option value="">— seçin —</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                  <option value="VOID">VOID</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => saveMut.mutate()}
              disabled={saveMut.isPending || !canSave}
              className={btnPrimary}
              data-testid="button-save-pick"
            >
              <Save className="w-4 h-4" />
              {saveMut.isPending ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
              data-testid="button-cancel-pick"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPORTED CONTENT (used by unified /admin page)
══════════════════════════════════════════════════════════════ */
type AdminTab = "plan" | "results";

function getTabFromURL(): AdminTab {
  try {
    const p = new URLSearchParams(window.location.search);
    return p.get("tab") === "results" ? "results" : "plan";
  } catch {
    return "plan";
  }
}

export function BugunAdminContent() {
  const [date, setDate] = useState(todayISODate);
  const [activeTab, setActiveTab] = useState<AdminTab>(getTabFromURL);

  function handleTabChange(tab: AdminTab) {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url.toString());
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h1 className="text-lg font-bold text-gray-800">Bugün Sayfası Yönetimi</h1>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600">Tarih:</label>
          <input
            type="date"
            className={inputCls + " w-auto"}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            data-testid="input-admin-date"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        {(["plan", "results"] as AdminTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#0E1726] text-[#0E1726]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
            data-testid={`tab-${tab}`}
          >
            {tab === "plan" ? "📋 Bugünün Planı" : "✅ Bugünün Sonuçları"}
          </button>
        ))}
      </div>

      {activeTab === "plan" ? (
        <>
          <PublishSection date={date} />
          <MatchesSection date={date} />
          <CouponsSection date={date} />
          <PublicPickSection date={date} />
        </>
      ) : (
        <SonuclarSection date={date} />
      )}
    </div>
  );
}

export default function AdminBugun() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0E1726] text-white px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-base tracking-tight">Bet Capitale Admin</span>
        <div className="flex gap-3 text-sm">
          <Link href="/today" className="text-blue-200 hover:text-white">Today ↗</Link>
          <Link href="/admin" className="text-blue-200 hover:text-white">Ana Admin</Link>
        </div>
      </div>
      <BugunAdminContent />
    </div>
  );
}
