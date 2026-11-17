import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, Edit2, X, Save, ChevronDown, ChevronUp } from "lucide-react";
import type { CouponWithSelections, CouponSelection } from "@shared/schema";
import { BetSlipCard } from "@/components/BetSlipCard";
import { Calendar } from "@/components/ui/calendar";

import { MARKETS, SELECTION_PICKS, FALLBACK_PICKS, KICKOFF_TIMES } from "@/data/betConstants";

const RESULTS = ["won", "lost", "void", "pending", "pre-match"] as const;

function fmtDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short" });
  return `${day} ${month} ${d.getFullYear()}`;
}

function genDateOptions(): string[] {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return fmtDate(d);
  });
}

const MONTH_MAP: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

function fmtDateToISO(s: string): string {
  // "25 Jul 2026" → "2026-07-25"
  const parts = s.split(" ");
  if (parts.length !== 3) return "";
  const [day, mon, year] = parts;
  return `${year}-${MONTH_MAP[mon] ?? "01"}-${day.padStart(2, "0")}`;
}

function isoToFmtDate(iso: string): string {
  // "2026-07-25" → "25 Jul 2026"
  const d = new Date(iso + "T12:00:00");
  return fmtDate(d);
}

function splitDateTime(val: string): [string, string] {
  const idx = val.lastIndexOf(", ");
  if (idx === -1) return [val, ""];
  return [val.slice(0, idx), val.slice(idx + 2)];
}

const DATE_OPTIONS = genDateOptions();

type SelectionForm = {
  selectionName: string;
  market: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  kickoffTime: string;
  odds: string;
  result: string;
};

type CouponForm = {
  betId: string;
  betType: string;
  placedDate: string;
  placedTime: string;
  stake: string;
  settledDate: string;
  settledTime: string;
};

function genBetId(): string {
  const L = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const D = () => Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
  return `${L()}${L()}-${D()}-${L()}`;
}

function fmtTime(d: Date): string {
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

const emptyCouponForm = (): CouponForm => ({
  betId: genBetId(),
  betType: "Accumulator",
  placedDate: fmtDate(new Date()),
  placedTime: fmtTime(new Date()),
  stake: "100",
  settledDate: "",
  settledTime: "",
});

const emptySelectionForm = (): SelectionForm => ({
  selectionName: "",
  market: "",
  homeTeam: "",
  awayTeam: "",
  league: "",
  kickoffTime: "",
  odds: "",
  result: "won",
});

function truncOdds(n: number): string {
  return (Math.floor(n * 100) / 100).toFixed(2);
}

function calcTotalOdds(selections: SelectionForm[]) {
  return selections.reduce((acc, s) => {
    const o = parseFloat(s.odds);
    return isNaN(o) ? acc : acc * o;
  }, 1);
}

function deriveStatus(selections: SelectionForm[]): "Won" | "Lost" | "Void" | "Open" {
  if (selections.length === 0) return "Lost";
  if (selections.some((s) => s.result === "pending" || s.result === "pre-match")) return "Open";
  if (selections.some((s) => s.result === "lost")) return "Lost";
  if (selections.every((s) => s.result === "void")) return "Void";
  return "Won";
}

export function CouponAdminContent() {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [couponForm, setCouponForm] = useState<CouponForm>(emptyCouponForm());
  const [selections, setSelections] = useState<SelectionForm[]>([emptySelectionForm()]);
  const [placedCalOpen, setPlacedCalOpen] = useState(false);
  const placedCalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!placedCalOpen) return;
    function handleClick(e: MouseEvent) {
      if (placedCalRef.current && !placedCalRef.current.contains(e.target as Node)) {
        setPlacedCalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [placedCalOpen]);
  const [previewId, setPreviewId] = useState<number | null>(null);

  const { data: coupons = [], isLoading } = useQuery<CouponWithSelections[]>({
    queryKey: ["/api/coupons"],
  });

  const placedAt = couponForm.placedDate + ", " + (couponForm.placedTime || "00:00");
  const settlementDate = couponForm.settledDate
    ? couponForm.settledDate + ", " + (couponForm.settledTime || "00:00")
    : "";

  const createMutation = useMutation({
    mutationFn: async () => {
      const stake = parseFloat(couponForm.stake) || 100;
      const status = deriveStatus(selections);
      const couponData = {
        betId: couponForm.betId,
        betType: couponForm.betType,
        placedAt,
        stake,
        status,
        settlementDate: settlementDate || null,
      };
      const coupon = await apiRequest("POST", "/api/coupons", couponData);
      const couponJson = await coupon.json();
      for (let i = 0; i < selections.length; i++) {
        const s = selections[i];
        if (!s.selectionName || !s.homeTeam.trim() || !s.awayTeam.trim()) continue;
        await apiRequest("POST", `/api/coupons/${couponJson.id}/selections`, {
          couponId: couponJson.id,
          selectionName: s.selectionName,
          market: s.market,
          matchName: `${s.homeTeam} v ${s.awayTeam}`,
          league: s.league,
          kickoffTime: s.kickoffTime,
          odds: parseFloat(s.odds) || 1,
          result: s.result,
          sortOrder: i,
        });
      }
      return couponJson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
      setCreating(false);
      setCouponForm(emptyCouponForm());
      setSelections([emptySelectionForm()]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (id: number) => {
      const stake = parseFloat(couponForm.stake) || 100;
      const status = deriveStatus(selections);
      const computedTotalOdds = calcTotalOdds(selections);
      const potentialReturn = computedTotalOdds * stake;
      const actualReturn = status === "Won" ? potentialReturn : status === "Void" ? stake : null;
      const couponData = {
        betId: couponForm.betId,
        betType: couponForm.betType,
        placedAt,
        stake,
        totalOdds: computedTotalOdds,
        potentialReturn,
        actualReturn,
        status,
        settlementDate: settlementDate || null,
      };
      await apiRequest("PUT", `/api/coupons/${id}`, couponData);
      const existing = await fetch(`/api/coupons/${id}/selections`).then(r => r.json()) as CouponSelection[];
      for (const s of existing) {
        await apiRequest("DELETE", `/api/coupons/${id}/selections/${s.id}`);
      }
      for (let i = 0; i < selections.length; i++) {
        const s = selections[i];
        if (!s.selectionName || !s.homeTeam.trim() || !s.awayTeam.trim()) continue;
        await apiRequest("POST", `/api/coupons/${id}/selections`, {
          couponId: id,
          selectionName: s.selectionName,
          market: s.market,
          matchName: `${s.homeTeam} v ${s.awayTeam}`,
          league: s.league,
          kickoffTime: s.kickoffTime,
          odds: parseFloat(s.odds) || 1,
          result: s.result,
          sortOrder: i,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/coupons/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/coupons"] }),
  });

  function startEdit(c: CouponWithSelections) {
    setEditingId(c.id);
    setCreating(false);
    const [placedDate, placedTime] = splitDateTime(c.placedAt);
    const [settledDate, settledTime] = c.settlementDate ? splitDateTime(c.settlementDate) : ["", ""];
    setCouponForm({
      betId: c.betId,
      betType: c.betType,
      placedDate,
      placedTime,
      stake: String(c.stake),
      settledDate,
      settledTime,
    });
    const knownResults = new Set(["won", "lost", "void", "pending", "pre-match"]);
    setSelections(
      c.selections.length > 0
        ? c.selections.map(s => {
            const parts = (s.matchName ?? "").split(" v ");
            const homeTeam = parts[0] ?? "";
            const awayTeam = parts.slice(1).join(" v ");
            return {
              selectionName: s.selectionName,
              market: s.market,
              homeTeam,
              awayTeam,
              league: s.league,
              kickoffTime: s.kickoffTime,
              odds: String(s.odds),
              result: knownResults.has(s.result) ? s.result : "lost",
            };
          })
        : [emptySelectionForm()]
    );
    setPreviewId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setCreating(false);
    setEditingId(null);
    setCouponForm(emptyCouponForm());
    setSelections([emptySelectionForm()]);
  }

  const totalOdds = calcTotalOdds(selections);
  const stake = parseFloat(couponForm.stake) || 100;
  const derivedStatus = deriveStatus(selections);
  const toReturn = derivedStatus === "Won" ? totalOdds * stake : derivedStatus === "Void" ? stake : 0;
  const netResult = toReturn - stake;
  const isFormOpen = creating || editingId !== null;

  // Live preview coupon constructed from current form state
  const previewCoupon: CouponWithSelections = {
    id: 0,
    betId: couponForm.betId,
    betType: couponForm.betType,
    placedAt,
    stake,
    totalOdds,
    potentialReturn: totalOdds * stake,
    actualReturn: null,
    status: derivedStatus,
    settlementDate: settlementDate || null,
    analysisScore: null,
    riskLevel: null,
    notes: null,
    selections: selections.map((s, i) => ({
      id: i,
      couponId: 0,
      selectionName: s.selectionName,
      market: s.market,
      matchName: `${s.homeTeam} v ${s.awayTeam}`,
      league: s.league,
      kickoffTime: s.kickoffTime,
      odds: parseFloat(s.odds) || 1,
      result: s.result,
      sortOrder: i,
    })),
  };

  return (
      <div className="max-w-2xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-800">Kupon Üretici</h1>
          {!isFormOpen && (
            <button
              onClick={() => {
                setCreating(true);
                setEditingId(null);
                setCouponForm(emptyCouponForm());
                setSelections([emptySelectionForm()]);
              }}
              data-testid="button-new-coupon"
              className="flex items-center gap-1.5 bg-[#1a5c38] hover:bg-[#154d30] text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors"
            >
              <Plus className="w-4 h-4" /> Yeni Kupon
            </button>
          )}
        </div>

        {/* ── Create / Edit Form ────────────────────────────────────────────── */}
        {isFormOpen && (
          <div className="bg-white border border-gray-200 rounded shadow-sm mb-5">
            <div className="bg-[#1a5c38] px-4 py-2.5 flex items-center justify-between">
              <span className="text-white font-semibold text-sm">
                {creating ? "New Coupon" : "Edit Coupon"}
              </span>
              <button onClick={cancelForm} className="text-green-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-3">
              {/* Coupon fields */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Reference">
                  <input
                    data-testid="input-bet-id"
                    className={inputCls}
                    value={couponForm.betId}
                    readOnly
                    style={{ opacity: 0.65, cursor: "default", userSelect: "all" }}
                    onChange={() => {}}
                  />
                </Field>
                <Field label="Bet Type">
                  <input
                    data-testid="input-bet-type"
                    className={inputCls}
                    list="bet-type-options"
                    value={couponForm.betType}
                    onChange={e => setCouponForm(f => ({ ...f, betType: e.target.value }))}
                    placeholder="e.g. Treble"
                  />
                  <datalist id="bet-type-options">
                    <option value="Single" />
                    <option value="Double" />
                    <option value="Treble" />
                    <option value="Accumulator" />
                  </datalist>
                </Field>
                <Field label="Stake (€)">
                  <input
                    data-testid="input-stake"
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputCls}
                    value={couponForm.stake}
                    onChange={e => setCouponForm(f => ({ ...f, stake: e.target.value }))}
                  />
                </Field>
                <Field label="Placed At">
                  <div className="flex gap-1.5">
                    <div className="relative flex-1" ref={placedCalRef}>
                      <button
                        type="button"
                        data-testid="select-placed-date"
                        className={inputCls + " w-full text-left"}
                        onClick={() => setPlacedCalOpen(v => !v)}
                      >
                        {couponForm.placedDate}
                      </button>
                      {placedCalOpen && (
                        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                          <Calendar
                            mode="single"
                            selected={new Date(fmtDateToISO(couponForm.placedDate) + "T12:00:00")}
                            onSelect={d => {
                              if (d) { setCouponForm(f => ({ ...f, placedDate: fmtDate(d) })); setPlacedCalOpen(false); }
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <input
                      data-testid="input-placed-time"
                      className={inputCls + " w-20"}
                      value={couponForm.placedTime}
                      onChange={e => setCouponForm(f => ({ ...f, placedTime: e.target.value }))}
                      placeholder="17:46"
                    />
                  </div>
                </Field>
                <Field label="Settled At">
                  <div className="flex gap-1.5">
                    <select
                      data-testid="select-settled-date"
                      className={inputCls + " flex-1"}
                      value={couponForm.settledDate}
                      onChange={e => setCouponForm(f => ({ ...f, settledDate: e.target.value }))}
                    >
                      <option value="">— no date —</option>
                      {DATE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input
                      data-testid="input-settled-time"
                      className={inputCls + " w-20"}
                      value={couponForm.settledTime}
                      onChange={e => setCouponForm(f => ({ ...f, settledTime: e.target.value }))}
                      placeholder="23:40"
                      disabled={!couponForm.settledDate}
                    />
                  </div>
                </Field>
              </div>

              {/* Auto-calculated preview */}
              <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                <div className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Auto-calculated</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-xs">Total Odds</span>
                    <span className="font-semibold tabular-nums text-xs">{truncOdds(totalOdds)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-xs">Status</span>
                    <span className={`font-semibold text-xs ${derivedStatus === "Won" ? "text-green-700" : derivedStatus === "Void" || derivedStatus === "Open" ? "text-gray-400" : "text-red-600"}`}>
                      {derivedStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-xs">Return</span>
                    <span className={`font-semibold tabular-nums text-xs ${derivedStatus === "Won" ? "text-green-700" : derivedStatus === "Void" || derivedStatus === "Open" ? "text-gray-400" : "text-red-600"}`}>
                      €{toReturn.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-xs">{derivedStatus === "Won" ? "Net Profit" : derivedStatus === "Void" || derivedStatus === "Open" ? "Net" : "Net Loss"}</span>
                    <span className={`font-semibold tabular-nums text-xs ${derivedStatus === "Won" ? "text-green-700" : derivedStatus === "Void" || derivedStatus === "Open" ? "text-gray-400" : "text-red-600"}`}>
                      {derivedStatus === "Won" ? "+" : ""}€{netResult.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live receipt preview */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Receipt Preview</div>
                <div className="bg-[#111] p-3 rounded">
                  <BetSlipCard coupon={previewCoupon} />
                </div>
              </div>

              {/* Shared datalists */}
              <datalist id="market-options">
                {MARKETS.map(m => <option key={m} value={m} />)}
              </datalist>

              {/* Selections */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Selections ({selections.length})</span>
                  <button
                    onClick={() => setSelections(s => [...s, emptySelectionForm()])}
                    data-testid="button-add-selection"
                    className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="space-y-3">
                  {selections.map((sel, idx) => (
                    <div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50 relative">
                      <button
                        onClick={() => setSelections(s => s.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        data-testid={`button-remove-selection-${idx}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="text-xs font-semibold text-gray-500 mb-2">Selection {idx + 1}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Selection">
                          <datalist id={`sel-opts-${idx}`}>
                            {(SELECTION_PICKS[sel.market] ?? FALLBACK_PICKS).map(p => (
                              <option key={p} value={p} />
                            ))}
                          </datalist>
                          <input
                            data-testid={`input-selection-name-${idx}`}
                            className={inputCls}
                            list={`sel-opts-${idx}`}
                            value={sel.selectionName}
                            placeholder="e.g. 1X"
                            onChange={e => setSelections(s => s.map((x, i) => i === idx ? { ...x, selectionName: e.target.value } : x))}
                          />
                        </Field>
                        <Field label="Market">
                          <input
                            data-testid={`input-market-${idx}`}
                            className={inputCls}
                            list="market-options"
                            value={sel.market}
                            placeholder="e.g. Double Chance"
                            onChange={e => setSelections(s => s.map((x, i) => i === idx ? { ...x, market: e.target.value } : x))}
                          />
                        </Field>
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Match</label>
                          <div className="flex items-center gap-2">
                            <input
                              data-testid={`input-home-team-${idx}`}
                              className={inputCls + " flex-1"}
                              value={sel.homeTeam}
                              placeholder="e.g. Arsenal"
                              onChange={e => setSelections(s => s.map((x, i) => i === idx ? { ...x, homeTeam: e.target.value } : x))}
                            />
                            <span className="text-xs font-bold text-gray-400 shrink-0">v</span>
                            <input
                              data-testid={`input-away-team-${idx}`}
                              className={inputCls + " flex-1"}
                              value={sel.awayTeam}
                              placeholder="e.g. Fulham"
                              onChange={e => setSelections(s => s.map((x, i) => i === idx ? { ...x, awayTeam: e.target.value } : x))}
                            />
                          </div>
                        </div>
                        <Field label="Competition">
                          <input
                            data-testid={`input-league-${idx}`}
                            className={inputCls}
                            value={sel.league}
                            placeholder="e.g. Premier League"
                            onChange={e => setSelections(s => s.map((x, i) => i === idx ? { ...x, league: e.target.value } : x))}
                          />
                        </Field>
                        <Field label="Kickoff">
                          <input
                            data-testid={`input-kickoff-${idx}`}
                            className={inputCls}
                            value={sel.kickoffTime}
                            placeholder="e.g. 20:00"
                            onChange={e => setSelections(s => s.map((x, i) => i === idx ? { ...x, kickoffTime: e.target.value } : x))}
                          />
                        </Field>
                        <Field label="Odds">
                          <input
                            data-testid={`input-odds-${idx}`}
                            type="number"
                            step="0.001"
                            min="1"
                            placeholder="e.g. 1.456"
                            className={inputCls}
                            value={sel.odds}
                            onChange={e => setSelections(s => s.map((x, i) => i === idx ? { ...x, odds: e.target.value } : x))}
                          />
                        </Field>
                        <Field label="Result">
                          <select
                            data-testid={`select-result-${idx}`}
                            className={inputCls}
                            value={sel.result}
                            onChange={e => setSelections(s => s.map((x, i) => i === idx ? { ...x, result: e.target.value } : x))}
                          >
                            {RESULTS.map(r => (
                              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                          </select>
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => creating ? createMutation.mutate() : updateMutation.mutate(editingId!)}
                  disabled={
                    createMutation.isPending || updateMutation.isPending ||
                    selections.some(s => s.selectionName && (!s.homeTeam.trim() || !s.awayTeam.trim()))
                  }
                  data-testid="button-save-coupon"
                  className="flex items-center gap-1.5 bg-[#1a5c38] hover:bg-[#154d30] text-white text-sm font-semibold px-4 py-2 rounded transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {creating ? "Create Coupon" : "Update Coupon"}
                </button>
                <button
                  onClick={cancelForm}
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Coupon list ───────────────────────────────────────────────────── */}
        {isLoading && <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>}

        <div className="space-y-3">
          {coupons.map((c) => (
            <div key={c.id} className="border border-gray-200 rounded shadow-sm overflow-hidden bg-white">
              {/* admin toolbar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">{c.betId}</span>
                  <StatusPill status={c.selections.some(s => s.result === "lost") ? "Lost" : c.selections.every(s => s.result === "won" || s.result === "void") && c.selections.some(s => s.result === "won") ? "Won" : c.status} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewId(previewId === c.id ? null : c.id)}
                    className="text-gray-400 hover:text-gray-700"
                    data-testid={`button-expand-${c.id}`}
                  >
                    {previewId === c.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(c)}
                    className="text-blue-500 hover:text-blue-700"
                    data-testid={`button-edit-${c.id}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this coupon?")) deleteMutation.mutate(c.id); }}
                    className="text-red-400 hover:text-red-600"
                    data-testid={`button-delete-${c.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link href={`/coupons/${c.id}`} className="text-[11px] text-green-700 hover:text-green-900 underline">
                    View
                  </Link>
                </div>
              </div>

              {/* compact info row */}
              <div className="px-3 py-1.5 text-[11px] text-gray-500">
                {c.selections.length} selections · Odds {truncOdds(c.totalOdds)} · Stake €{c.stake.toFixed(2)} · Placed {c.placedAt}
              </div>


              {/* receipt preview */}
              {previewId === c.id && (
                <div className="bg-[#111] p-3">
                  <BetSlipCard coupon={c} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
  );
}

const inputCls = "w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-green-500 bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "Won" ? "bg-green-100 text-green-700" :
    status === "Lost" ? "bg-red-100 text-red-600" :
    "bg-gray-100 text-gray-500";
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cls}`}>
      {status}
    </span>
  );
}

export default function AdminCoupons() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1a5c38] text-white px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-base tracking-tight">Bet Capitale Admin — Kupon Üretici</span>
        <div className="flex gap-3 text-sm">
          <a href="/admin" className="text-green-200 hover:text-white">Ana Admin</a>
          <a href="/coupons" className="text-green-200 hover:text-white">Kuponlar ↗</a>
        </div>
      </div>
      <CouponAdminContent />
    </div>
  );
}
