import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Users, RefreshCw, AlertCircle, Search } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const FONT = "'Manrope', sans-serif";

export interface WhopMember {
  id: string;
  email: string;
  username: string;
  planId: string | null;
  planLabel: string;
  tier: string;
  /** Whop's automatic renewal/cancellation state. */
  status: "active" | "cancel_pending" | "cancelled";
  /** The site's access window, kept separate from Whop renewal state. */
  accessStatus: "active" | "expired" | "unknown";
  cancelAtPeriodEnd: boolean;
  expiresAt: number | null;
  daysLeft: number | null;
  siteTier: "select" | "unlimited" | null;
  siteAccessStatus: "active" | "expired" | "unknown";
  siteExpiresAt: number | null;
  siteDaysLeft: number | null;
  siteTierOverride: boolean;
  createdAt: number | string;
}

export interface MembersResponse {
  members: WhopMember[];
  cancelledMembers: WhopMember[];
  total: number;
  byCounts: Record<string, number>;
  source: "whop" | "local";
}

interface AdjustResult {
  email: string;
  ok: boolean;
  newExpiresAt: string | null;
  whopSynced: boolean | null;
  error?: string;
  whopError?: string;
}

interface CancelResult {
  email: string;
  ok: boolean;
  error?: string;
}

function formatDate(ts: number | string | null): string {
  if (!ts) return "—";
  const d = typeof ts === "number" ? new Date(ts * 1000) : new Date(ts);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: WhopMember["status"] }) {
  if (status === "cancel_pending") {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">⚠ İptal Bekliyor</span>;
  }
  if (status === "active") {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">● Aktif</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">✕ İptal Edildi</span>;
}

/** Access-window pill. This intentionally does not reflect Whop's renewal state. */
function DaysLeftBadge({ daysLeft }: { daysLeft: number | null }) {
  if (daysLeft === null) return <span className="text-xs text-gray-400">—</span>;
  const expired = daysLeft <= 0;
  const soon = !expired && daysLeft <= 3;
  const cls = expired
    ? "bg-red-100 text-red-600"
    : soon
      ? "bg-orange-100 text-orange-700 ring-1 ring-orange-300"
      : "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${cls}`}>
      {soon ? "⏳ " : ""}{expired ? "Süresi doldu" : `${daysLeft} gün`}
    </span>
  );
}

const PAGE_SIZE = 50;

// ── "Kullanıcılar" (registered site users) ─────────────────────────────────

interface SiteUser {
  id: number;
  email: string;
  createdAt: string;
  memberTier: string | null;
  isAdmin: boolean;
}

interface UsersResponse {
  users: SiteUser[];
  total: number;
  last7d: number;
  last30d: number;
}

function AdminUsersContent() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useQuery<UsersResponse>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/users");
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error ?? "Yüklenemedi");
      }
      return res.json();
    },
    staleTime: 60_000,
  });

  const card = "bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden";
  const hdr  = "bg-[#1a1a2e] px-5 py-3.5";

  const users = data?.users ?? [];
  const paged = users.slice(0, page * PAGE_SIZE);
  const hasMore = paged.length < users.length;

  return (
    <div className="space-y-5">
      {/* ── Header / refresh ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1a1a2e]">🧑‍💻 Kullanıcılar</h1>
          <p className="text-xs text-gray-400 mt-0.5">Kaynak: Yerel veritabanı (kayıtlı tüm kullanıcılar)</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1a1a2e] border border-gray-200 rounded px-3 py-1.5 hover:border-gray-400 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {/* ── Summary cards ────────────────────────────────────────── */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={card}>
            <div className="px-4 py-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Toplam Kullanıcı</p>
              <p className="text-3xl font-extrabold text-[#1a1a2e] tabular-nums mt-1">{data.total}</p>
            </div>
          </div>
          <div className={card}>
            <div className="px-4 py-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Son 7 Günde Katılan</p>
              <p className="text-3xl font-extrabold text-green-600 tabular-nums mt-1">{data.last7d}</p>
            </div>
          </div>
          <div className={card}>
            <div className="px-4 py-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Son 30 Günde Katılan</p>
              <p className="text-3xl font-extrabold text-blue-600 tabular-nums mt-1">{data.last30d}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── User list ────────────────────────────────────────────── */}
      <div className={card}>
        <div className={hdr}>
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <Users className="w-4 h-4" /> Kullanıcı Listesi
            {!isLoading && <span className="text-gray-400 font-normal">({users.length})</span>}
          </h2>
        </div>

        {isLoading && (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
            Kullanıcılar yükleniyor…
          </div>
        )}

        {isError && (
          <div className="px-5 py-8 text-center">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-500 font-semibold">Kullanıcılar yüklenemedi</p>
            <button onClick={() => refetch()} className="mt-2 text-xs text-blue-500 hover:underline">Tekrar dene</button>
          </div>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-gray-400">Henüz kullanıcı yok.</div>
        )}

        {!isLoading && !isError && users.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-2.5 text-left">E-posta</th>
                    <th className="px-4 py-2.5 text-left">Kayıt Tarihi</th>
                    <th className="px-4 py-2.5 text-left">Üyelik Seviyesi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 text-sm leading-tight">{u.email}</p>
                        {u.isAdmin && <p className="text-xs text-purple-500 mt-0.5">Admin</p>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 tabular-nums">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        {u.memberTier ? (
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            u.memberTier === "unlimited"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {u.memberTier === "unlimited" ? "Unlimited" : u.memberTier === "select" ? "Select" : u.memberTier}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasMore && (
              <div className="px-5 py-4 border-t border-gray-100 text-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="text-xs font-semibold text-[#E8771F] hover:text-[#d06018] border border-[#E8771F] rounded px-4 py-1.5 hover:bg-orange-50 transition-colors"
                >
                  Daha fazla yükle ({users.length - paged.length} kaldı)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function AdminMembersContent() {
  const [tab, setTab] = useState<"members" | "users">("members");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "active" | "cancel_pending" | "cancelled">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rowDayInputs, setRowDayInputs] = useState<Record<string, string>>({});
  const [bulkDays, setBulkDays] = useState("");
  const { toast } = useToast();

  const { data, isLoading, isError, refetch, isFetching } = useQuery<MembersResponse>({
    queryKey: ["/api/admin/whop/members"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/whop/members");
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error ?? "Yüklenemedi");
      }
      return res.json();
    },
    staleTime: 60_000,
  });

  const membersByEmail = new Map<string, WhopMember>();
  for (const m of [...(data?.members ?? []), ...(data?.cancelledMembers ?? [])]) {
    membersByEmail.set(m.email, m);
  }

  function reportAdjustResults(results: AdjustResult[]) {
    const succeeded = results.filter(r => r.ok);
    const failed = results.filter(r => !r.ok);
    const whopSyncFailed = succeeded.filter(r => r.whopSynced === false && r.whopError);

    if (succeeded.length > 0) {
      toast({
        title: `${succeeded.length} üyenin süresi güncellendi`,
        description: whopSyncFailed.length > 0
          ? `${whopSyncFailed.length} üyede Whop tarafı senkronize edilemedi; yalnızca site erişimi güncellendi.`
          : undefined,
      });
    }
    if (failed.length > 0) {
      toast({
        title: `${failed.length} üye güncellenemedi`,
        description: failed.map(f => `${f.email}: ${f.error ?? "bilinmeyen hata"}`).join(" · "),
        variant: "destructive",
      });
    }
  }

  const adjustMutation = useMutation({
    mutationFn: async (payload: { members: { email: string; whopMembershipId?: string }[]; days: number }) => {
      const res = await apiRequest("POST", "/api/admin/whop/members/adjust-days", payload);
      return (await res.json()) as { results: AdjustResult[] };
    },
    onSuccess: (resData) => {
      reportAdjustResults(resData.results);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/whop/members"] });
    },
    onError: (err: unknown) => {
      toast({ title: "Hata", description: err instanceof Error ? err.message : "İşlem başarısız.", variant: "destructive" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      const res = await apiRequest("POST", "/api/admin/whop/members/cancel", { emails });
      return (await res.json()) as { results: CancelResult[] };
    },
    onSuccess: (resData) => {
      const succeeded = resData.results.filter(r => r.ok);
      const failed = resData.results.filter(r => !r.ok);
      if (succeeded.length > 0) toast({ title: `${succeeded.length} üyeliği iptal edildi` });
      if (failed.length > 0) {
        toast({
          title: `${failed.length} üye iptal edilemedi`,
          description: failed.map(f => `${f.email}: ${f.error ?? "bilinmeyen hata"}`).join(" · "),
          variant: "destructive",
        });
      }
      setSelected(new Set());
      queryClient.invalidateQueries({ queryKey: ["/api/admin/whop/members"] });
    },
    onError: (err: unknown) => {
      toast({ title: "Hata", description: err instanceof Error ? err.message : "İptal başarısız.", variant: "destructive" });
    },
  });

  const promoteMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/admin/membership/set-tier", {
        email,
        tier: "unlimited",
      });
      return (await res.json()) as { email: string; memberTier: string | null };
    },
    onSuccess: (result) => {
      toast({
        title: "Site erişimi Unlimited yapıldı",
        description: `${result.email} artık Unlimited içerik ve hizmetlerine erişebilir.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/whop/members"] });
    },
    onError: (err: unknown) => {
      toast({
        title: "Yükseltme başarısız",
        description: err instanceof Error ? err.message : "Kullanıcının site erişimi güncellenemedi.",
        variant: "destructive",
      });
    },
  });

  function whopMembershipIdFor(m: WhopMember): string | undefined {
    // `m.id` is only a genuine Whop membership id when the whole response came from
    // Whop's live API — in local-fallback mode it's just the local user id.
    return data?.source === "whop" ? m.id : undefined;
  }

  function applySingleDayAdjust(m: WhopMember) {
    const raw = rowDayInputs[m.email];
    const days = parseInt(raw ?? "", 10);
    if (!Number.isFinite(days) || !Number.isInteger(days) || days === 0) {
      toast({ title: "Geçersiz gün sayısı", description: "Uzatmak için pozitif, azaltmak için negatif bir tam sayı girin.", variant: "destructive" });
      return;
    }
    adjustMutation.mutate({
      members: [{ email: m.email, whopMembershipId: whopMembershipIdFor(m) }],
      days,
    });
    setRowDayInputs(prev => ({ ...prev, [m.email]: "" }));
  }

  function applyBulkDayAdjust() {
    const days = parseInt(bulkDays, 10);
    if (!Number.isFinite(days) || !Number.isInteger(days) || days === 0) {
      toast({ title: "Geçersiz gün sayısı", description: "Uzatmak için pozitif, azaltmak için negatif bir tam sayı girin.", variant: "destructive" });
      return;
    }
    const targets = Array.from(selected).map(email => ({
      email,
      whopMembershipId: (() => {
        const m = membersByEmail.get(email);
        return m ? whopMembershipIdFor(m) : undefined;
      })(),
    }));
    const verb = days > 0 ? `${days} gün uzatmak` : `${Math.abs(days)} gün azaltmak`;
    if (!window.confirm(`${targets.length} üyenin süresini ${verb} istediğinize emin misiniz?`)) return;
    adjustMutation.mutate({ members: targets, days });
    setBulkDays("");
  }

  function cancelSingle(m: WhopMember) {
    if (!window.confirm(`${m.email} adresinin üyeliğini iptal etmek istediğinize emin misiniz?\n\nBu, sitedeki erişimini hemen kaldırır. Whop üzerindeki abonelik ayrıca etkilenmez.`)) return;
    cancelMutation.mutate([m.email]);
  }

  function cancelBulk() {
    if (selected.size === 0) return;
    if (!window.confirm(`${selected.size} üyenin üyeliğini iptal etmek istediğinize emin misiniz?\n\nBu, sitedeki erişimlerini hemen kaldırır. Whop üzerindeki abonelikleri ayrıca etkilenmez.`)) return;
    cancelMutation.mutate(Array.from(selected));
  }

  function promoteToUnlimited(m: WhopMember) {
    if (m.siteTier === "unlimited") return;
    if (!window.confirm(`${m.email} adresinin site erişimini Unlimited yapmak istediğinize emin misiniz?`)) return;
    promoteMutation.mutate(m.email);
  }

  function toggleSelect(email: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email); else next.add(email);
      return next;
    });
  }

  const card = "bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden";
  const hdr  = "bg-[#1a1a2e] px-5 py-3.5";

  const allMembers = [
    ...(data?.members ?? []),
    ...(data?.cancelledMembers ?? []),
  ];

  const normalizedSearch = search.trim().toLocaleLowerCase("tr-TR");
  const filtered = allMembers.filter(m => {
    const matchesSearch = !normalizedSearch || [
      m.email,
      m.username,
      m.planLabel,
      m.siteTier ?? "",
    ].some(value => value.toLocaleLowerCase("tr-TR").includes(normalizedSearch));
    const matchesFilter = filter === "all"
      || (filter === "cancel_pending" && m.status === "cancel_pending")
      || (filter === "active" && m.status === "active")
      || (filter === "cancelled" && (m.status === "cancelled" || m.accessStatus === "expired"));
    return matchesSearch && matchesFilter;
  });

  const paged = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paged.length < filtered.length;

  const activeCount = allMembers.filter(m => m.accessStatus === "active").length;
  const cancelPendingCount = allMembers.filter(m => m.status === "cancel_pending").length;
  const cancelledCount = allMembers.filter(m => m.status === "cancelled" || m.accessStatus === "expired").length;

  const allPagedSelected = paged.length > 0 && paged.every(m => selected.has(m.email));

  function toggleSelectAllPaged() {
    setSelected(prev => {
      const next = new Set(prev);
      if (allPagedSelected) {
        for (const m of paged) next.delete(m.email);
      } else {
        for (const m of paged) next.add(m.email);
      }
      return next;
    });
  }

  function rowBg(m: WhopMember): string {
    if (m.status === "cancelled" || m.accessStatus === "expired") return "bg-red-50/30";
    if (m.status === "cancel_pending") return "bg-orange-50/40";
    const siteDaysLeft = m.siteDaysLeft ?? m.daysLeft;
    if (siteDaysLeft !== null && siteDaysLeft > 0 && siteDaysLeft <= 3) return "bg-amber-50/50";
    return "";
  }

   return (
    <div className="max-w-6xl mx-auto p-6 space-y-5" style={{ fontFamily: FONT }}>

      {/* ── Top-level tab switcher: Members (Whop) vs Kullanıcılar (local users) ── */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-0">
        <button
          onClick={() => setTab("members")}
          className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === "members"
              ? "text-[#1a1a2e] border-[#1a1a2e]"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Members
        </button>
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === "users"
              ? "text-[#1a1a2e] border-[#1a1a2e]"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Kullanıcı
        </button>
      </div>

      {tab === "users" ? (
        <AdminUsersContent />
      ) : (
      <>
      {/* ── Header / refresh ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1a1a2e]">👥 Üye Listesi</h1>
          {data && (
            <p className="text-xs text-gray-400 mt-0.5">
              Kaynak: {data.source === "whop" ? "Whop API (canlı)" : "Yerel veritabanı"}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <label className="relative block">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
                setSelected(new Set());
              }}
              placeholder="E-posta veya kullanıcı ara"
              aria-label="E-posta veya kullanıcı ara"
              data-testid="input-member-search"
              className="w-full sm:w-64 text-xs border border-gray-200 rounded pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-[#1a1a2e]"
            />
          </label>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1a1a2e] border border-gray-200 rounded px-3 py-1.5 hover:border-gray-400 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Yenile
          </button>
        </div>
      </div>

      {/* ── Summary cards ────────────────────────────────────────── */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={card}>
            <div className="px-4 py-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Toplam Aktif</p>
              <p className="text-3xl font-extrabold text-[#1a1a2e] tabular-nums mt-1">{data.total}</p>
            </div>
          </div>
          <div className={card}>
            <div className="px-4 py-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Aktif Üye</p>
              <p className="text-3xl font-extrabold text-green-600 tabular-nums mt-1">{activeCount}</p>
            </div>
          </div>
          <div className={card}>
            <div className="px-4 py-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">İptal Bekliyor</p>
              <p className="text-3xl font-extrabold text-orange-500 tabular-nums mt-1">{cancelPendingCount}</p>
            </div>
          </div>
          <div className={card}>
            <div className="px-4 py-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">İptal / Dolmuş</p>
              <p className="text-3xl font-extrabold text-red-500 tabular-nums mt-1">{cancelledCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── By plan / tier breakdown ─────────────────────────────── */}
      {data && Object.keys(data.byCounts).length > 0 && (
        <div className={card}>
          <div className={hdr}>
            <h2 className="text-white font-semibold text-sm">📦 Pakete Göre Dağılım</h2>
          </div>
          <div className="px-5 py-4 flex flex-wrap gap-3">
            {Object.entries(data.byCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([label, count]) => (
                <div key={label} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                  <span className="text-lg font-extrabold text-[#1a1a2e] tabular-nums">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Member list ──────────────────────────────────────────── */}
      <div className={card}>
        <div className={hdr}>
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <Users className="w-4 h-4" /> Üye Listesi
              {!isLoading && <span className="text-gray-400 font-normal">({filtered.length})</span>}
            </h2>
          </div>
          {data?.source === "whop" && (
            <p className="text-gray-400 text-xs mt-1">
              Gün ekleme Whop'taki üyeliğe de otomatik yansır. Gün azaltma yalnızca site erişimini kısaltır — Whop'un API'sinde gün geri alma desteği yoktur.
            </p>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50">
          {(["all", "active", "cancel_pending", "cancelled"] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); setSelected(new Set()); }}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                filter === f
                  ? "text-[#1a1a2e] border-b-2 border-[#1a1a2e] bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f === "all" ? "Tümü" : f === "active" ? "Aktif" : f === "cancel_pending" ? "İptal Bekliyor" : "İptal / Dolmuş"}
            </button>
          ))}
        </div>

        {/* Bulk action toolbar */}
        {selected.size > 0 && (
          <div className="px-5 py-3 border-b border-gray-100 bg-blue-50/70 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">{selected.size} üye seçili</span>
            <input
              type="number"
              placeholder="gün (ör: 7 veya -3)"
              value={bulkDays}
              onChange={e => setBulkDays(e.target.value)}
              className="w-36 text-xs border border-gray-200 rounded px-2 py-1.5"
            />
            <button
              onClick={applyBulkDayAdjust}
              disabled={adjustMutation.isPending || !bulkDays}
              className="text-xs font-semibold text-white bg-[#1a1a2e] rounded px-3 py-1.5 hover:bg-[#2a2a4e] transition-colors disabled:opacity-40"
            >
              Seçilenlere Uygula
            </button>
            <button
              onClick={cancelBulk}
              disabled={cancelMutation.isPending}
              className="text-xs font-semibold text-red-600 border border-red-300 rounded px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              Seçilenleri İptal Et
            </button>
            <button onClick={() => setSelected(new Set())} className="text-xs text-gray-400 hover:text-gray-600 ml-auto">
              Seçimi temizle
            </button>
          </div>
        )}

        {isLoading && (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
            Üyeler yükleniyor…
          </div>
        )}

        {isError && (
          <div className="px-5 py-8 text-center">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-500 font-semibold">Üyeler yüklenemedi</p>
            <button onClick={() => refetch()} className="mt-2 text-xs text-blue-500 hover:underline">Tekrar dene</button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            {search.trim()
              ? `"${search.trim()}" aramasıyla eşleşen üye yok.`
              : filter === "all" ? "Henüz üye yok." : "Bu filtreye uygun üye yok."}
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-3 py-2.5 text-left w-8">
                      <input
                        type="checkbox"
                        checked={allPagedSelected}
                        onChange={toggleSelectAllPaged}
                        className="rounded border-gray-300"
                        aria-label="Tümünü seç"
                      />
                    </th>
                    <th className="px-4 py-2.5 text-left">Üye</th>
                    <th className="px-4 py-2.5 text-left">Paket</th>
                    <th className="px-4 py-2.5 text-left">Durum</th>
                    <th className="px-4 py-2.5 text-left">Kalan Gün</th>
                    <th className="px-4 py-2.5 text-left">Üyelik Tarihi</th>
                    {data?.source === "whop" && (
                      <th className="px-4 py-2.5 text-left">Whop Bitiş</th>
                    )}
                    <th className="px-4 py-2.5 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.map(m => (
                    <tr key={m.id} className={`hover:bg-gray-50 ${rowBg(m)}`}>
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(m.email)}
                          onChange={() => toggleSelect(m.email)}
                          className="rounded border-gray-300"
                          aria-label={`${m.email} seç`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 text-sm leading-tight">{m.username !== "—" ? m.username : m.email.split("@")[0]}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{m.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          m.tier === "Unlimited"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {m.planLabel}
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5">Whop: {m.tier}</p>
                        {m.siteTier ? (
                          <p className="text-xs mt-0.5">
                            Site: <span className={`font-semibold ${m.siteTier === "unlimited" ? "text-purple-700" : "text-blue-700"}`}>
                              {m.siteTier === "unlimited" ? "Unlimited" : "Select"}
                            </span>
                            {m.siteTierOverride && <span className="text-gray-400 ml-1">(admin)</span>}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-0.5">Site hesabı yok</p>
                        )}
                        {m.siteExpiresAt !== null && (
                          <p className="text-[11px] text-gray-400 mt-0.5">Site bitiş: {formatDate(m.siteExpiresAt)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={m.status} />
                      </td>
                      <td className="px-4 py-3">
                        <DaysLeftBadge daysLeft={m.siteDaysLeft ?? m.daysLeft} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 tabular-nums">
                        {formatDate(m.createdAt)}
                      </td>
                      {data?.source === "whop" && (
                        <td className="px-4 py-3 text-xs text-gray-500 tabular-nums">
                          {formatDate(m.expiresAt)}
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <input
                            type="number"
                            placeholder="gün"
                            value={rowDayInputs[m.email] ?? ""}
                            onChange={e => setRowDayInputs(prev => ({ ...prev, [m.email]: e.target.value }))}
                            className="w-16 text-xs border border-gray-200 rounded px-1.5 py-1"
                          />
                          <button
                            onClick={() => applySingleDayAdjust(m)}
                            disabled={adjustMutation.isPending || !rowDayInputs[m.email]}
                            title="Pozitif sayı uzatır, negatif sayı azaltır"
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50 transition-colors disabled:opacity-40"
                          >
                            Uygula
                          </button>
                          {m.siteTier !== "unlimited" && m.email !== "—" && (
                            <button
                              onClick={() => promoteToUnlimited(m)}
                              disabled={promoteMutation.isPending}
                              className="text-xs font-semibold text-purple-700 hover:text-purple-900 border border-purple-200 rounded px-2 py-1 hover:bg-purple-50 transition-colors disabled:opacity-40"
                              data-testid={`button-promote-unlimited-${m.email}`}
                            >
                              Unlimited yap
                            </button>
                          )}
                          {m.status !== "cancelled" && m.accessStatus !== "expired" && (
                            <button
                              onClick={() => cancelSingle(m)}
                              disabled={cancelMutation.isPending}
                              className="text-xs font-semibold text-red-600 hover:text-red-800 border border-red-200 rounded px-2 py-1 hover:bg-red-50 transition-colors disabled:opacity-40"
                            >
                              İptal Et
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasMore && (
              <div className="px-5 py-4 border-t border-gray-100 text-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="text-xs font-semibold text-[#E8771F] hover:text-[#d06018] border border-[#E8771F] rounded px-4 py-1.5 hover:bg-orange-50 transition-colors"
                >
                  Daha fazla yükle ({filtered.length - paged.length} kaldı)
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </>
      )}
    </div>
  );
}
