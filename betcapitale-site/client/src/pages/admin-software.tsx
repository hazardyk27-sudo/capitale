import { DepartmentReports, PrepareAnalysis } from "./admin-software-reports";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock3, RefreshCw, Search } from "lucide-react";

type ReportStatus = "complete" | "partial" | "pending" | "unavailable";
type SoftwareMatch = {
  id: string;
  date: string;
  kickoffAt: string | null;
  league: string | null;
  homeTeam: string;
  awayTeam: string;
  market: string | null;
  selection: string | null;
  signalCode: string;
  analystScore: number | null;
  newsScore: number | null;
  volumeShare: number | null;
  drawShare: number | null;
  currentOdds: number | null;
  referenceOdds: number | null;
  referenceOddsAt: string | null;
  currentOddsAt: string | null;
  capturedAt: string | null;
  source: string | null;
  reportStatus: ReportStatus;
};
type SoftwareResponse = {
  items: SoftwareMatch[];
  dataSource: "connected" | "not_connected";
};
type SortKey = "matchName" | "signalCode" | "analystScore" | "newsScore" | "volumeShare" | "drawShare" | "currentOdds";
type ApiError = Error & { status?: number };

const SORTABLE: { key: SortKey; label: string }[] = [
  { key: "matchName", label: "MATCH" },
  { key: "signalCode", label: "SIGNAL" },
  { key: "analystScore", label: "A" },
  { key: "newsScore", label: "N" },
  { key: "volumeShare", label: "V" },
  { key: "drawShare", label: "B" },
  { key: "currentOdds", label: "O" },
];
const STATUS_LABEL: Record<ReportStatus, string> = {
  complete: "Complete",
  partial: "Partial",
  pending: "Pending",
  unavailable: "Unavailable",
};

async function loadSoftware(): Promise<SoftwareResponse> {
  const response = await fetch("/api/admin/software", { credentials: "same-origin" });
  if (!response.ok) {
    const error = new Error(response.status === 401 || response.status === 403
      ? "Administrator access is required to view these analyses."
      : "Software analyses could not be loaded.") as ApiError;
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function clockValue(value: string | null): string {
  if (!value) return "";
  const timeOnly = value.match(/^\d{2}:\d{2}/);
  if (timeOnly) return timeOnly[0];
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  if (value.includes("T") && hasZone) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      }).format(parsed);
    }
  }
  const match = value.match(/T(\d{2}:\d{2})/);
  return match?.[1] ?? "";
}
function percent(value: number | null): string {
  return value === null || !Number.isFinite(value) ? "—" : `${value.toLocaleString("en-GB", { maximumFractionDigits: 1 })}%`;
}
function dateTime(value: string | null): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul", dateStyle: "medium", timeStyle: "short",
  }).format(parsed);
}
function movement(current: number | null, reference: number | null): { label: string; tone: string } {
  if (current === null || reference === null || current <= 0 || reference <= 0) return { label: "—", tone: "text-slate-500" };
  const change = ((current - reference) / reference) * 100;
  if (!Number.isFinite(change)) return { label: "—", tone: "text-slate-500" };
  if (change < 0) return { label: `↓ ${Math.abs(change).toFixed(1)}%`, tone: "text-emerald-700" };
  if (change > 0) return { label: `↑ ${change.toFixed(1)}%`, tone: "text-rose-700" };
  return { label: "Unchanged", tone: "text-slate-500" };
}
function sortValue(row: SoftwareMatch, key: SortKey): string | number {
  if (key === "matchName") return `${row.homeTeam} ${row.awayTeam}`.toLocaleLowerCase("en-GB");
  return row[key] ?? "";
}
function statusTone(status: ReportStatus): string {
  if (status === "complete") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "partial") return "border-amber-200 bg-amber-50 text-amber-800";
  if (status === "pending") return "border-blue-200 bg-blue-50 text-blue-800";
  return "border-slate-200 bg-slate-100 text-slate-700";
}

export default function AdminSoftware() {
  const { data, error, isLoading, isFetching, refetch } = useQuery<SoftwareResponse, ApiError>({
    queryKey: ["admin-software"],
    queryFn: loadSoftware,
    retry: false,
    staleTime: 30_000,
  });
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [signal, setSignal] = useState("all");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [reportStatus, setReportStatus] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("matchName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pageSize = 20;
  const items = data?.items ?? [];

  useEffect(() => {
    setPage(0);
    setSelectedId(null);
  }, [date, search, signal, timeFrom, timeTo, reportStatus]);

  const signals = useMemo(() => Array.from(new Set(items.map((row) => row.signalCode).filter(Boolean))).sort(), [items]);
  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("en-GB");
    return items.filter((row) => {
      const match = `${row.homeTeam} ${row.awayTeam} ${row.league ?? ""} ${row.signalCode}`.toLocaleLowerCase("en-GB");
      const time = clockValue(row.kickoffAt);
      return (!date || row.date === date)
        && (!q || match.includes(q))
        && (signal === "all" || row.signalCode === signal)
        && (!timeFrom || (time !== "" && time >= timeFrom))
        && (!timeTo || (time !== "" && time <= timeTo))
        && (reportStatus === "all" || row.reportStatus === reportStatus);
    });
  }, [items, date, search, signal, timeFrom, timeTo, reportStatus]);

  const sorted = useMemo(() => [...filtered].sort((left, right) => {
    const a = sortValue(left, sortKey);
    const b = sortValue(right, sortKey);
    const result = typeof a === "number" && typeof b === "number"
      ? a - b
      : String(a).localeCompare(String(b), "en");
    return sortDirection === "asc" ? result : -result;
  }), [filtered, sortKey, sortDirection]);
  const pageCount = Math.ceil(sorted.length / pageSize);
  const visibleRows = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const selected = items.find((row) => row.id === selectedId) ?? null;
  const unauthorized = error?.status === 401 || error?.status === 403;

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDirection((old) => old === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDirection(key === "matchName" || key === "signalCode" ? "asc" : "desc"); }
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#172235]">
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E8771F]">CAPITALE SOFTWARE</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0E1726] sm:text-3xl">Software Analysis</h1>
            <p className="mt-1 text-sm text-slate-600">Review match signals and analysis data in one place.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {data?.dataSource === "connected" ? "Data connection active" : "Data source not connected"}
            </span>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-[#0E1726] hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link href="/admin" className="inline-flex min-h-10 items-center rounded-md bg-[#0E1726] px-4 text-sm font-semibold text-white hover:bg-[#1b2b42]">
              Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <PrepareAnalysis />
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#E8771F]" />
              <h2 className="text-base font-semibold text-[#0E1726]">Match analysis</h2>
            </div>
            <p className="text-sm text-slate-600">Filters and sorting show only matching records. A/N are department support scores, not probabilities of winning.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-5 sm:p-5">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Date</span>
              <span className="relative block">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm focus:border-[#E8771F] focus:outline-none focus:ring-2 focus:ring-orange-100" />
              </span>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Search matches</span>
              <span className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Team, league, or signal" className="h-11 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm focus:border-[#E8771F] focus:outline-none focus:ring-2 focus:ring-orange-100" />
              </span>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Signal</span>
              <select value={signal} onChange={(e) => setSignal(e.target.value)} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-[#E8771F] focus:outline-none focus:ring-2 focus:ring-orange-100">
                <option value="all">All signals</option>
                {signals.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <fieldset className="space-y-1.5">
              <legend className="text-sm font-medium text-slate-700">Kick-off time range</legend>
              <div className="flex gap-2">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Start time</span>
                  <Clock3 className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} className="h-11 w-full min-w-0 rounded-md border border-slate-300 bg-white pl-8 pr-1 text-sm focus:border-[#E8771F] focus:outline-none focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">End time</span>
                  <Clock3 className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} className="h-11 w-full min-w-0 rounded-md border border-slate-300 bg-white pl-8 pr-1 text-sm focus:border-[#E8771F] focus:outline-none focus:ring-2 focus:ring-orange-100" />
                </label>
              </div>
            </fieldset>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Report status</span>
              <select value={reportStatus} onChange={(e) => setReportStatus(e.target.value)} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-[#E8771F] focus:outline-none focus:ring-2 focus:ring-orange-100">
                <option value="all">All statuses</option>
                <option value="complete">Tam</option>
                <option value="partial">Partial</option>
                <option value="pending">Bekliyor</option>
                <option value="unavailable">Veri yok</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <span>{filtered.length} records</span>
            <span className="inline-flex items-center gap-2">
              Sort by:
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-[#172235]">
                {SORTABLE.map((column) => <option key={column.key} value={column.key}>{column.label === "A" ? "ANALYST (A)" : column.label === "N" ? "NEWS (N)" : column.label === "V" ? "VOLUME (V)" : column.label === "B" ? "DRAW (B)" : column.label === "O" ? "ODDS (O)" : column.label}</option>)}
              </select>
              <button type="button" onClick={() => setSortDirection((old) => old === "asc" ? "desc" : "asc")} className="h-9 rounded-md border border-slate-300 bg-white px-3 font-medium text-[#172235] hover:bg-slate-50">
                {sortDirection === "asc" ? "Ascending" : "Descending"}
              </button>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-[#F4F6F8] text-sm font-semibold text-slate-700">
                <tr>
                  {SORTABLE.map((column) => (
                    <th key={column.key} scope="col" className={`px-4 py-3 ${column.key === "currentOdds" ? "text-right" : ""}`} title={column.key === "analystScore" ? "ANALYST department support score (not a probability of winning)" : column.key === "newsScore" ? "NEWS department support score (not a probability of winning)" : undefined}>
                      <button type="button" onClick={() => toggleSort(column.key)} className={`inline-flex items-center gap-1.5 rounded text-sm font-semibold hover:text-[#E8771F] focus:outline-none focus:ring-2 focus:ring-orange-200 ${column.key === "currentOdds" ? "ml-auto" : ""}`} aria-label={`Sort by ${column.label}`}>
                        {column.label}
                        {sortKey === column.key && <span className="text-xs font-normal text-slate-500">{sortDirection === "asc" ? "Ascending" : "Descending"}</span>}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isLoading ? (
                  <tr><td colSpan={7} className="px-4 py-14 text-center text-slate-500">Loading analyses…</td></tr>
                ) : unauthorized ? (
                  <tr><td colSpan={7} className="px-4 py-14 text-center text-rose-700">Only administrators can access this page. <Link href="/admin" className="font-semibold underline">Administrator login</Link></td></tr>
                ) : error ? (
                  <tr><td colSpan={7} className="px-4 py-14 text-center text-rose-700">{error.message} <button type="button" onClick={() => void refetch()} className="font-semibold underline">Try again</button></td></tr>
                ) : visibleRows.length ? visibleRows.map((row) => {
                  const oddsMove = movement(row.currentOdds, row.referenceOdds);
                  return (
                    <tr key={row.id} tabIndex={0} onClick={() => setSelectedId(row.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedId(row.id); } }} className={`cursor-pointer hover:bg-orange-50/60 focus:bg-orange-50/60 focus:outline-none ${selectedId === row.id ? "bg-orange-50" : ""}`}>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#0E1726]">{row.homeTeam} – {row.awayTeam}</div>
                        <div className="mt-1 text-xs text-slate-500">{row.league || "League not specified"}{clockValue(row.kickoffAt) ? ` · ${clockValue(row.kickoffAt)}` : ""}</div>
                      </td>
                      <td className="px-4 py-3.5"><span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 font-medium text-slate-800">{row.signalCode}</span></td>
                      <td className="px-4 py-3.5 tabular-nums">{row.analystScore ?? "—"}</td>
                      <td className="px-4 py-3.5 tabular-nums">{row.newsScore ?? "—"}</td>
                      <td className="px-4 py-3.5 tabular-nums">{percent(row.volumeShare)}</td>
                      <td className="px-4 py-3.5 tabular-nums">{percent(row.drawShare)}</td>
                      <td className="px-4 py-3.5 text-right tabular-nums">
                        <span className="font-semibold text-[#0E1726]">{row.currentOdds?.toFixed(2) ?? "—"}</span>
                        <span className={`ml-2 whitespace-nowrap text-xs font-semibold ${oddsMove.tone}`}>{oddsMove.label}</span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={7} className="px-4 py-14 text-center">
                    <p className="text-base font-semibold text-[#0E1726]">{items.length === 0 ? "No software analyses yet." : "No matches found for these filters."}</p>
                    <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{items.length === 0 ? "Match records will appear here when a verified analysis feed is connected. No demo or unverified data is shown." : "Adjust the filters and try again."}</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <span className="text-sm text-slate-600">{sorted.length ? `Page ${page + 1} of ${pageCount}` : "No records to paginate"}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 0 || !pageCount} onClick={() => setPage((value) => Math.max(0, value - 1))} className="min-h-9 rounded-md border border-slate-300 px-3 text-sm font-medium disabled:opacity-40">Previous</button>
              <button type="button" disabled={!pageCount || page + 1 >= pageCount} onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))} className="min-h-9 rounded-md border border-slate-300 px-3 text-sm font-medium disabled:opacity-40">Next</button>
            </div>
          </div>
        </section>

        {selected && (
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm" aria-live="polite">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#E8771F]">Match details</p>
                <h2 className="mt-1 text-lg font-bold text-[#0E1726]">{selected.homeTeam} – {selected.awayTeam}</h2>
                <p className="mt-1 text-sm text-slate-600">{selected.league || "League not specified"} · {selected.date}{clockValue(selected.kickoffAt) ? ` · ${clockValue(selected.kickoffAt)}` : ""}</p>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} className="min-h-9 self-start rounded-md border border-slate-300 px-3 text-sm font-medium hover:bg-slate-50">Close details</button>
            </div>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
              <div><dt className="text-sm text-slate-600">Signal</dt><dd className="mt-1 font-semibold">{selected.signalCode}</dd></div>
              <div><dt className="text-sm text-slate-600">Bet selection</dt><dd className="mt-1 font-semibold">{selected.market || "—"}{selected.selection ? ` / ${selected.selection}` : ""}</dd></div>
              <div><dt className="text-sm text-slate-600">ANALYST support score</dt><dd className="mt-1 font-semibold">{selected.analystScore ?? "—"}</dd></div>
              <div><dt className="text-sm text-slate-600">NEWS support score</dt><dd className="mt-1 font-semibold">{selected.newsScore ?? "—"}</dd></div>
              <div><dt className="text-sm text-slate-600">Volume share</dt><dd className="mt-1 font-semibold">{percent(selected.volumeShare)}</dd></div>
              <div><dt className="text-sm text-slate-600">Draw share</dt><dd className="mt-1 font-semibold">{percent(selected.drawShare)}</dd></div>
              <div><dt className="text-sm text-slate-600">Current odds</dt><dd className="mt-1 font-semibold">{selected.currentOdds?.toFixed(2) ?? "—"}</dd></div>
              <div><dt className="text-sm text-slate-600">Odds movement</dt><dd className={`mt-1 font-semibold ${movement(selected.currentOdds, selected.referenceOdds).tone}`}>{movement(selected.currentOdds, selected.referenceOdds).label}</dd></div>
              <div><dt className="text-sm text-slate-600">Reference odds and time</dt><dd className="mt-1 font-semibold">{selected.referenceOdds?.toFixed(2) ?? "—"} · {dateTime(selected.referenceOddsAt)}</dd></div>
              <div><dt className="text-sm text-slate-600">Current odds time</dt><dd className="mt-1 font-semibold">{dateTime(selected.currentOddsAt)}</dd></div>
              <div><dt className="text-sm text-slate-600">Data captured at</dt><dd className="mt-1 font-semibold">{dateTime(selected.capturedAt)}</dd></div>
              <div><dt className="text-sm text-slate-600">Source and report status</dt><dd className="mt-1 flex flex-wrap items-center gap-2"><span>{selected.source || "—"}</span><span className={`rounded border px-2 py-0.5 text-xs font-semibold ${statusTone(selected.reportStatus)}`}>{STATUS_LABEL[selected.reportStatus]}</span></dd></div>
            </dl>
            <DepartmentReports runId={selected.id} />
          </section>
        )}
      </main>
    </div>
  );
}
