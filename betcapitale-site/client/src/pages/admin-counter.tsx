import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Clock, CheckCircle2, Circle, RefreshCw, Save, CalendarDays } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const FONT = "'Manrope', sans-serif";

function todayIstanbul(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
}

function nowHHMM(): string {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function labelForDate(date: string): string {
  const today = todayIstanbul();
  if (date === today) return "Bugün";
  const d = new Date(date + "T12:00:00Z");
  const t = new Date(today + "T12:00:00Z");
  const diff = Math.round((d.getTime() - t.getTime()) / 86_400_000);
  if (diff === 1) return "Yarın";
  if (diff === 2) return "Öbür gün";
  if (diff > 2) return `${diff} gün sonra`;
  if (diff === -1) return "Dün";
  return `${Math.abs(diff)} gün önce`;
}

function isFutureDate(date: string): boolean {
  return date > todayIstanbul();
}

interface Plan {
  date: string;
  totalIncrement: number;
  scheduledTimes: string[];
  appliedCount: number;
  whopCount: number;
}

interface PlanResponse {
  plans: Plan[];
  baseCount: number;
  nowTime: string;
}

export function CounterAdminContent() {
  const qc = useQueryClient();
  const [planDate, setPlanDate] = useState(todayIstanbul());
  const [planCount, setPlanCount] = useState("");
  const [baseInput, setBaseInput] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const { data, isLoading } = useQuery<PlanResponse>({
    queryKey: ["/api/admin/counter/plans"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/counter/plans");
      return res.json();
    },
    refetchInterval: 30_000,
  });

  const savePlan = useMutation({
    mutationFn: async () => {
      const n = parseInt(planCount);
      if (isNaN(n) || n < 0 || n > 900) throw new Error("0–900 arasında bir sayı girin.");
      const res = await apiRequest("POST", "/api/admin/counter/plan", {
        date: planDate,
        totalIncrement: n,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Kayıt hatası");
      }
      return res.json();
    },
    onSuccess: () => {
      setMsg({ text: `Plan kaydedildi ✓ (${labelForDate(planDate)})`, ok: true });
      setPlanCount("");
      qc.invalidateQueries({ queryKey: ["/api/admin/counter/plans"] });
      qc.invalidateQueries({ queryKey: ["/api/community/stats"] });
    },
    onError: (e: unknown) => {
      setMsg({ text: "Hata: " + (e instanceof Error ? e.message : "Bilinmeyen"), ok: false });
    },
  });

  const saveBase = useMutation({
    mutationFn: async () => {
      const n = parseInt(baseInput);
      if (isNaN(n) || n < 0) throw new Error("Geçerli bir sayı girin.");
      const res = await apiRequest("POST", "/api/admin/settings/member-count", { base: n });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Kayıt hatası");
      }
      return res.json();
    },
    onSuccess: () => {
      setMsg({ text: "Üye sayısı güncellendi ✓", ok: true });
      setBaseInput("");
      qc.invalidateQueries({ queryKey: ["/api/admin/counter/plans"] });
      qc.invalidateQueries({ queryKey: ["/api/community/stats"] });
    },
    onError: (e: unknown) => {
      setMsg({ text: "Hata: " + (e instanceof Error ? e.message : "Bilinmeyen"), ok: false });
    },
  });

  const nowTime = data?.nowTime ?? nowHHMM();
  const plans   = data?.plans ?? [];
  const selectedPlan = plans.find(p => p.date === planDate);
  const today = todayIstanbul();

  const card = "bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden";
  const hdr  = "bg-[#1a1a2e] px-5 py-3.5";
  const bdy  = "px-5 py-5 space-y-4";
  const inp  = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-white";
  const btn  = "flex items-center justify-center gap-2 bg-[#E8771F] hover:bg-[#d06018] text-white text-sm font-semibold px-4 py-2.5 rounded transition-colors disabled:opacity-40 whitespace-nowrap";

  // Shortcut day buttons: today + next 6 days
  const dayShortcuts = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-5" style={{ fontFamily: FONT }}>

      {/* ── Base count ─────────────────────────────────────────────── */}
      <div className={card}>
        <div className={hdr}>
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <Users className="w-4 h-4" /> Toplam Üye Sayısı (Base)
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">Ana sayfadaki flip sayacın başlangıç değeri.</p>
        </div>
        <div className={bdy}>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-extrabold text-[#1a1a2e] tabular-nums">
              {isLoading ? "…" : (typeof data?.baseCount === "number" && !isNaN(data.baseCount) ? data.baseCount.toLocaleString("tr-TR") : "—")}
            </div>
            <span className="text-sm text-gray-400">mevcut üye</span>
          </div>
          <div className="flex gap-2">
            <input
              className={inp}
              placeholder="Yeni değer (örn. 1250)"
              value={baseInput}
              type="number"
              min={0}
              onChange={e => { setBaseInput(e.target.value); setMsg(null); }}
            />
            <button className={btn} disabled={!baseInput || saveBase.isPending} onClick={() => saveBase.mutate()}>
              <Save className="w-4 h-4" />
              {saveBase.isPending ? "…" : "Güncelle"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Daily plan (any date) ───────────────────────────────────── */}
      <div className={card}>
        <div className={hdr}>
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> Günlük Üye Planı
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Seçili gün için üye sayısı planla — artışlar 08:00–22:59 arasında rastgele saatlere dağıtılır.
          </p>
        </div>
        <div className={bdy}>

          {/* Day shortcuts */}
          <div className="flex flex-wrap gap-1.5">
            {dayShortcuts.map(d => {
              const hasPlan = plans.some(p => p.date === d);
              const active  = planDate === d;
              return (
                <button
                  key={d}
                  onClick={() => { setPlanDate(d); setMsg(null); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    active
                      ? "bg-[#E8771F] text-white border-[#E8771F]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-[#E8771F] hover:text-[#E8771F]"
                  }`}
                >
                  {labelForDate(d)}
                  {hasPlan && !active && <span className="ml-1 text-green-500">●</span>}
                </button>
              );
            })}
            {/* Custom date picker for dates beyond shortcuts */}
            <input
              type="date"
              min={today}
              value={dayShortcuts.includes(planDate) ? "" : planDate}
              onChange={e => { if (e.target.value) { setPlanDate(e.target.value); setMsg(null); } }}
              className="px-2 py-1 rounded-full text-xs border border-gray-300 hover:border-[#E8771F] focus:outline-none focus:border-[#E8771F] text-gray-600 cursor-pointer"
              title="Başka bir gün seç"
            />
          </div>

          {/* Count input */}
          <div className="flex gap-2">
            <input
              className={inp}
              placeholder="Örn: 3 (0–900)"
              type="number"
              min={0}
              max={900}
              value={planCount}
              onChange={e => { setPlanCount(e.target.value); setMsg(null); }}
            />
            <button className={btn} disabled={!planCount || savePlan.isPending} onClick={() => savePlan.mutate()}>
              <RefreshCw className="w-4 h-4" />
              {savePlan.isPending ? "…" : "Planla"}
            </button>
          </div>

          {msg && (
            <p className={`text-sm font-semibold rounded px-3 py-2 ${msg.ok ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50"}`}>
              {msg.text}
            </p>
          )}

          {/* Selected day plan detail */}
          {selectedPlan ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wide">
                <span>{labelForDate(selectedPlan.date)} — {selectedPlan.date}</span>
                {isFutureDate(selectedPlan.date) ? (
                  <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5">
                    ⏳ {selectedPlan.totalIncrement} üye planlandı
                  </span>
                ) : (
                  <span className="bg-orange-100 text-orange-700 rounded px-2 py-0.5">
                    {selectedPlan.appliedCount}/{selectedPlan.totalIncrement} uygulandı
                  </span>
                )}
              </div>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-md overflow-hidden">
                {selectedPlan.scheduledTimes.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">Plan boş (0 üye).</p>
                ) : (
                  selectedPlan.scheduledTimes.map((t, i) => {
                    const applied = !isFutureDate(selectedPlan.date) && t <= nowTime;
                    return (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-gray-50">
                        {applied
                          ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          : <Circle       className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        }
                        <span className="text-sm font-mono font-semibold text-gray-700">{t}</span>
                        <span className={`ml-auto text-xs font-semibold ${
                          applied
                            ? "text-green-600"
                            : isFutureDate(selectedPlan.date)
                              ? "text-blue-400"
                              : "text-gray-400"
                        }`}>
                          {applied ? "Uygulandı" : isFutureDate(selectedPlan.date) ? "Planlı" : "Bekliyor"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
              {!isFutureDate(selectedPlan.date) && (
                <p className="text-xs text-gray-400">
                  Saat: {nowTime} (İstanbul). Sayfa her 30 sn yenilenir.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-gray-200 px-4 py-5 text-center text-sm text-gray-400">
              {labelForDate(planDate)} için henüz plan oluşturulmadı.
            </div>
          )}
        </div>
      </div>

      {/* ── All plans table ─────────────────────────────────────────── */}
      {plans.length > 0 && (
        <div className={card}>
          <div className={hdr}>
            <h2 className="text-white font-semibold text-sm">📅 Planlar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-2 text-left">Tarih</th>
                  <th className="px-4 py-2 text-center">Planlanan</th>
                  <th className="px-4 py-2 text-center">Uygulanan</th>
                  <th className="px-4 py-2 text-left">Saatler / Kaynak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...plans].sort((a, b) => b.date.localeCompare(a.date)).map(p => {
                  const future = isFutureDate(p.date);
                  return (
                    <tr
                      key={p.date}
                      className={`hover:bg-gray-50 cursor-pointer ${planDate === p.date ? "bg-orange-50" : ""}`}
                      onClick={() => { setPlanDate(p.date); setMsg(null); }}
                    >
                      <td className="px-4 py-2 font-semibold text-gray-700">
                        {p.date}
                        <span className="ml-1.5 text-xs text-gray-400 font-normal">{labelForDate(p.date)}</span>
                      </td>
                      <td className="px-4 py-2 text-center text-gray-600">{p.totalIncrement}</td>
                      <td className="px-4 py-2 text-center">
                        {future ? (
                          <span className="text-blue-400 font-semibold text-xs">⏳ Bekliyor</span>
                        ) : (
                          <span className={`font-semibold ${p.appliedCount >= p.totalIncrement ? "text-green-600" : "text-orange-500"}`}>
                            {p.appliedCount}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500 space-y-1">
                        {p.whopCount > 0 && (
                          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 font-semibold rounded px-2 py-0.5 mr-2">
                            ⚡ Otomatik (Whop): {p.whopCount}
                          </span>
                        )}
                        <span className="font-mono">{p.scheduledTimes.join(", ") || (p.whopCount > 0 ? "" : "—")}</span>
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
  );
}
