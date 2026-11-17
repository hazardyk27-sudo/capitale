import { useRef, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, Link } from "wouter";
import { z } from "zod";
import type { ProfitEntry } from "@shared/schema";
import { insertProfitEntrySchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  CalendarDays,
  CalendarRange,
  Calendar,
  Plus,
  Trash2,
  Loader2,
  Download,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import html2canvas from "html2canvas";

const GREEN = "#00ff03";
const GREEN_BG = "rgba(0, 255, 3, 0.12)";
const RED = "#ef4444";
const RED_BG = "rgba(239, 68, 68, 0.12)";
const BG_BLACK = "#0a0a0a";
const CARD_BG = "#111111";
const CARD_GRADIENT = "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))";
const BORDER_COLOR = "rgba(255,255,255,0.06)";
const TEXT_WHITE = "#f0f0f0";
const TEXT_GRAY = "#71717a";
const TEXT_LIGHT_GRAY = "#a1a1aa";
const GRID_COLOR = "rgba(255,255,255,0.08)";
const ZERO_LINE = "rgba(255,255,255,0.25)";

const EXPORT_W = 1080;
const EXPORT_H = 1380;
const STORY_H = 1920;
const SAFE_PAD = 48;

const formSchema = insertProfitEntrySchema.extend({
  date: z.string().min(1, "Date is required"),
  value: z.coerce.number({ invalid_type_error: "Enter a valid number" }),
});

type FormValues = z.infer<typeof formSchema>;

function useShareMode(): "story" | "feed" | null {
  const [location] = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const share = params.get("share");
    if (share === "story" || share === "1") return "story";
    if (share === "feed") return "feed";
    return null;
  }, [location]);
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  const isPositive = value >= 0;
  return (
    <div
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "8px",
        padding: "10px 14px",
        minWidth: "120px",
      }}
    >
      <div style={{ color: TEXT_GRAY, fontSize: "11px", marginBottom: "4px", fontWeight: 500 }}>{label}</div>
      <div style={{ color: isPositive ? GREEN : RED, fontSize: "20px", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
        {isPositive ? "+" : ""}{value}€
      </div>
      <div style={{ color: TEXT_GRAY, fontSize: "10px", marginTop: "2px" }}>{isPositive ? "Profit" : "Loss"}</div>
    </div>
  );
}

function BarLabel({ x, y, width, value }: any) {
  if (value === undefined || value === null) return null;
  const isPositive = value >= 0;
  const label = `${isPositive ? "+" : ""}${Math.round(value)}€`;
  const xPos = x + width / 2;
  const yPos = isPositive ? y - 8 : y + 20;
  return (
    <text
      x={xPos}
      y={yPos}
      fill={isPositive ? "#FFFFFF" : "#FFFFFF"}
      textAnchor="middle"
      fontSize={14}
      fontWeight="800"
      fontFamily="'Inter', system-ui, -apple-system, sans-serif"
      letterSpacing="-0.02em"
      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.5)" }}
    >
      {label}
    </text>
  );
}

function ChartContent({ chartData, winDays, lossDays, netProfit }: { chartData: { date: string; value: number }[]; winDays: number; lossDays: number; netProfit: number }) {
  return (
    <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
      <div className="flex items-center justify-center gap-4" style={{ marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: TEXT_LIGHT_GRAY }}>
          Win Days: <span style={{ color: GREEN }}>{winDays}</span>
        </span>
        <span style={{ fontSize: "12px", color: TEXT_GRAY }}>|</span>
        <span style={{ fontSize: "12px", fontWeight: 600, color: TEXT_LIGHT_GRAY }}>
          Loss Days: <span style={{ color: RED }}>{lossDays}</span>
        </span>
        <span style={{ fontSize: "12px", color: TEXT_GRAY }}>|</span>
        <span style={{ fontSize: "12px", fontWeight: 600, color: TEXT_LIGHT_GRAY }}>
          Net: <span style={{ color: netProfit >= 0 ? GREEN : RED }}>{netProfit >= 0 ? "+" : ""}{netProfit.toLocaleString()}€</span>
        </span>
      </div>
      <div className="flex-1" style={{ minHeight: 0 }} data-testid="chart-bar">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 24, right: 10, left: 10, bottom: 80 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={GRID_COLOR} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
              tick={{ fill: TEXT_LIGHT_GRAY, fontSize: 10, fontWeight: 600 }}
              angle={-55}
              textAnchor="end"
              interval={0}
              height={80}
            />
            <YAxis tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} tick={{ fill: TEXT_LIGHT_GRAY, fontSize: 13, fontWeight: 600 }} width={55} />
            <ReferenceLine y={0} stroke={ZERO_LINE} strokeWidth={2} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="value" radius={[3, 3, 0, 0]} label={<BarLabel />}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? GREEN : RED} opacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SummaryCards({ summaryCards }: { summaryCards: { title: string; value: number; icon: any; testId: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {summaryCards.map((card) => {
        const isPositive = card.value >= 0;
        return (
          <div
            key={card.testId}
            className="rounded-lg"
            style={{
              background: CARD_GRADIENT,
              border: `1px solid ${BORDER_COLOR}`,
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.03), inset 0 -1px 2px rgba(0,0,0,0.2)",
              padding: "22px",
              minHeight: "96px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            data-testid={card.testId}
          >
            <div className="flex items-center justify-between gap-1">
              <span style={{ fontSize: "11px", fontWeight: 600, color: TEXT_GRAY, letterSpacing: "0.08em", textTransform: "uppercase" }} data-testid={`text-${card.testId}-title`}>{card.title}</span>
              <card.icon style={{ width: "14px", height: "14px", color: TEXT_GRAY }} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: isPositive ? GREEN : RED, fontVariantNumeric: "tabular-nums", margin: "6px 0" }} data-testid={`text-${card.testId}-value`}>
              {isPositive ? "+" : ""}{formatCurrency(card.value)}
            </div>
            <div className="flex items-center gap-1">
              {isPositive ? <TrendingUp style={{ width: "12px", height: "12px", color: GREEN, opacity: 0.6 }} /> : <TrendingDown style={{ width: "12px", height: "12px", color: RED, opacity: 0.6 }} />}
              <span style={{ fontSize: "10px", color: "rgba(113,113,122,0.6)", letterSpacing: "0.05em", textTransform: "uppercase" }} data-testid={`text-${card.testId}-status`}>
                {isPositive ? "Profit" : "Loss"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { toast } = useToast();
  const chartExportRef = useRef<HTMLDivElement>(null);
  const listExportRef = useRef<HTMLDivElement>(null);

  const shareMode = useShareMode();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { date: "", value: 0 },
  });

  const { data: entries = [], isLoading } = useQuery<ProfitEntry[]>({ queryKey: ["/api/entries"] });

  const addMutation = useMutation({
    mutationFn: async (entry: FormValues) => { await apiRequest("POST", "/api/entries", entry); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      form.reset({ date: "", value: 0 });
      toast({ title: "Added", description: "New entry added successfully." });
    },
    onError: (err: Error) => { toast({ title: "Error", description: err.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/entries/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({ title: "Deleted", description: "Entry removed." });
    },
    onError: (err: Error) => { toast({ title: "Error", description: err.message, variant: "destructive" }); },
  });

  const onSubmit = (data: FormValues) => { addMutation.mutate(data); };

  const exportPNG = useCallback(async (ref: React.RefObject<HTMLDivElement>, filename: string, w: number, h: number) => {
    if (!ref.current) return;
    try {
      const el = ref.current;
      const origStyle = el.style.cssText;
      el.style.width = `${w}px`;
      el.style.maxWidth = `${w}px`;
      el.style.minWidth = `${w}px`;
      el.style.height = `${h}px`;
      el.style.position = "fixed";
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.zIndex = "-9999";
      el.style.overflow = "visible";

      await new Promise((r) => setTimeout(r, 500));

      const canvas = await html2canvas(el, {
        backgroundColor: BG_BLACK, scale: 3, useCORS: true, logging: false, width: w, height: h,
        windowWidth: w, windowHeight: h,
      });

      el.style.cssText = origStyle;

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      toast({ title: "Downloaded", description: `${filename} exported.` });
    } catch {
      toast({ title: "Error", description: "Failed to export PNG.", variant: "destructive" });
    }
  }, [toast]);

  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartLast30 = sorted.slice(-40);
  const chartData = chartLast30.map((e) => ({ date: formatShortDate(e.date), value: e.value }));

  const winDays = sorted.filter((e) => e.value >= 0).length;
  const lossDays = sorted.filter((e) => e.value < 0).length;
  const netProfit = sorted.reduce((acc, e) => acc + e.value, 0);

  const lastDayProfit = sorted.length > 0 ? sorted[sorted.length - 1].value : 0;
  const last7 = sorted.slice(-7);
  const lastWeekProfit = last7.reduce((acc, e) => acc + e.value, 0);
  const last30 = sorted.slice(-30);
  const last30Profit = last30.reduce((acc, e) => acc + e.value, 0);

  const summaryCards = [
    { title: "Last Day", value: lastDayProfit, icon: CalendarDays, testId: "card-last-day" },
    { title: "Last 7 Entries", value: lastWeekProfit, icon: CalendarRange, testId: "card-last-week" },
    { title: "Last 30 Entries", value: last30Profit, icon: Calendar, testId: "card-last-month" },
  ];

  const listEntries = [...sorted].reverse();
  const storyListEntries = listEntries.slice(0, 12);
  const moreCount = listEntries.length - 12;

  const exportHeight = EXPORT_H;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG_BLACK }}>
        <div className="space-y-6" style={{ width: "100%", maxWidth: `${EXPORT_W}px` }}>
          <Skeleton className="h-10 w-72 mx-auto" style={{ backgroundColor: CARD_BG }} data-testid="skeleton-title" />
          <div className="grid grid-cols-3 gap-3 px-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" style={{ backgroundColor: CARD_BG }} data-testid={`skeleton-card-${i}`} />
            ))}
          </div>
          <Skeleton className="h-[500px] mx-4" style={{ backgroundColor: CARD_BG }} data-testid="skeleton-chart" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG_BLACK, color: TEXT_WHITE }}>

      {/* ===== Controls (hidden in share mode) ===== */}
      {!shareMode && (
        <div className="mx-auto pt-6 pb-4 px-4 space-y-4" style={{ maxWidth: `${EXPORT_W}px` }}>

          <div className="flex justify-end gap-1">
            <Link href="/coupons">
              <Button variant="ghost" style={{ color: TEXT_LIGHT_GRAY }} data-testid="link-coupons">
                Coupons
              </Button>
            </Link>
            <Link href="/matches">
              <Button variant="ghost" style={{ color: TEXT_LIGHT_GRAY }} data-testid="link-matches">
                Match Tracker
              </Button>
            </Link>
          </div>

          {/* Add Entry Form */}
          <div className="rounded-lg p-4 space-y-4" style={{ background: CARD_GRADIENT, border: `1px solid ${BORDER_COLOR}` }}>
            <h2 className="text-base font-semibold" style={{ color: TEXT_WHITE }} data-testid="text-form-title">Add New Entry</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4" data-testid="form-add-entry">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_GRAY }}>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="border-0" style={{ backgroundColor: BG_BLACK, color: TEXT_WHITE }} data-testid="input-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_GRAY }}>Value (EUR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number" step="0.01" placeholder="e.g. 150 or -50"
                          {...field} onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          className="border-0" style={{ backgroundColor: BG_BLACK, color: TEXT_WHITE }}
                          data-testid="input-value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={addMutation.isPending} style={{ backgroundColor: GREEN, color: "#000" }} data-testid="button-add">
                  {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  <span className="ml-1">Add</span>
                </Button>
              </form>
            </Form>
          </div>

          {/* Editable Table */}
          {sorted.length > 0 && (
            <div className="rounded-lg p-4" style={{ background: CARD_GRADIENT, border: `1px solid ${BORDER_COLOR}` }}>
              <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                <h2 className="text-base font-semibold" style={{ color: TEXT_WHITE }} data-testid="text-table-title">All Entries</h2>
                <span className="text-sm font-bold" style={{ color: netProfit >= 0 ? GREEN : RED, fontVariantNumeric: "tabular-nums" }}>
                  Total: {netProfit >= 0 ? "+" : ""}{formatCurrency(netProfit)}
                </span>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm" data-testid="table-entries">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
                      <th className="text-left py-3 px-2 font-medium" style={{ color: TEXT_GRAY }} data-testid="text-header-date">Date</th>
                      <th className="text-right py-3 px-2 font-medium" style={{ color: TEXT_GRAY }} data-testid="text-header-value">Value</th>
                      <th className="w-12 py-3 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...sorted].reverse().map((entry) => (
                      <tr key={entry.id} style={{ borderBottom: `1px solid ${BORDER_COLOR}` }} data-testid={`row-entry-${entry.id}`}>
                        <td className="py-3 px-2 font-medium" style={{ color: TEXT_WHITE }} data-testid={`text-date-${entry.id}`}>
                          {formatDate(entry.date)}
                        </td>
                        <td className="text-right py-3 px-2" data-testid={`text-value-${entry.id}`}>
                          <span
                            className="inline-block rounded-full px-3 py-0.5 text-xs font-bold"
                            style={{
                              backgroundColor: entry.value >= 0 ? GREEN_BG : RED_BG,
                              color: entry.value >= 0 ? GREEN : RED,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {entry.value >= 0 ? "+" : ""}{formatCurrency(entry.value)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ===== PNG Export Buttons ===== */}
      {!shareMode && (
        <div className="mx-auto flex items-center justify-center gap-3 flex-wrap py-3 px-4" style={{ maxWidth: `${EXPORT_W}px` }}>
          <Button variant="outline" onClick={() => exportPNG(chartExportRef, "betgheat-chart.png", EXPORT_W, EXPORT_H)} className="border-0" style={{ backgroundColor: CARD_BG, color: GREEN }} data-testid="button-download-chart">
            <Download className="h-4 w-4 mr-1" /> Download Chart PNG
          </Button>
          <Button variant="outline" onClick={() => exportPNG(listExportRef, "betgheat-list.png", EXPORT_W, STORY_H)} className="border-0" style={{ backgroundColor: CARD_BG, color: GREEN }} data-testid="button-download-list">
            <Download className="h-4 w-4 mr-1" /> Download List PNG
          </Button>
        </div>
      )}

      {/* ===== PNG-1: Chart Export Area ===== */}
      <div
        ref={chartExportRef}
        className="mx-auto flex flex-col"
        style={{
          width: "100%",
          maxWidth: `${EXPORT_W}px`,
          height: `${exportHeight}px`,
          backgroundColor: BG_BLACK,
          padding: `${SAFE_PAD}px ${SAFE_PAD}px 24px`,
          overflow: "hidden",
        }}
      >
        <div className="text-center" style={{ marginBottom: "16px", marginTop: "0px" }}>
          <h1 style={{ fontSize: "47px", fontWeight: 900, letterSpacing: "0.06em", color: TEXT_WHITE, textTransform: "uppercase", marginBottom: "6px" }} data-testid="text-title">
            BETGHEAT DAILY <span style={{ color: GREEN }}>PROFIT</span> CHART
          </h1>
          <p style={{ fontSize: "20px", fontWeight: 500, color: TEXT_GRAY, letterSpacing: "0.08em", textTransform: "uppercase" }}>Last 40 Days Chart</p>
        </div>

        <div className="flex gap-2" style={{ marginBottom: "12px" }}>
          {summaryCards.map((card) => {
            const isPositive = card.value >= 0;
            return (
              <div
                key={card.testId}
                className="rounded-lg flex-1"
                style={{
                  background: CARD_GRADIENT,
                  border: `1px solid ${BORDER_COLOR}`,
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.03), inset 0 -1px 2px rgba(0,0,0,0.2)",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "96px",
                }}
                data-testid={`export-${card.testId}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span style={{ fontSize: "11px", fontWeight: 600, color: TEXT_GRAY, letterSpacing: "0.08em", textTransform: "uppercase" }}>{card.title}</span>
                  <card.icon style={{ width: "14px", height: "14px", color: TEXT_GRAY }} />
                </div>
                <div style={{ fontSize: "26px", fontWeight: 800, color: isPositive ? GREEN : RED, fontVariantNumeric: "tabular-nums", margin: "6px 0" }}>
                  {isPositive ? "+" : ""}{formatCurrency(card.value)}
                </div>
                <div className="flex items-center gap-1">
                  {isPositive ? <TrendingUp style={{ width: "12px", height: "12px", color: GREEN, opacity: 0.6 }} /> : <TrendingDown style={{ width: "12px", height: "12px", color: RED, opacity: 0.6 }} />}
                  <span style={{ fontSize: "10px", color: "rgba(113,113,122,0.6)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {isPositive ? "Profit" : "Loss"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {sorted.length > 0 && (
          <ChartContent chartData={chartData} winDays={winDays} lossDays={lossDays} netProfit={netProfit} />
        )}

      </div>

      {/* ===== PNG-2: List Export Area (off-screen for capture) ===== */}
      <div
        ref={listExportRef}
        className="flex flex-col"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: `${EXPORT_W}px`,
          height: `${STORY_H}px`,
          backgroundColor: BG_BLACK,
          padding: `${SAFE_PAD}px ${SAFE_PAD}px 32px`,
          overflow: "hidden",
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
          <div>
            <h2 className="text-lg font-extrabold uppercase" style={{ letterSpacing: "0.06em", color: TEXT_WHITE }} data-testid="text-list-title">
              Entries <span style={{ color: TEXT_GRAY, fontWeight: 500, fontSize: "14px" }}>(Last 30 Days)</span>
            </h2>
          </div>
          <div className="text-sm font-bold" style={{ color: netProfit >= 0 ? GREEN : RED, fontVariantNumeric: "tabular-nums" }} data-testid="text-list-total">
            Total: {netProfit >= 0 ? "+" : ""}{formatCurrency(netProfit)}
          </div>
        </div>

        <div className="flex items-center px-4 py-3 rounded-t-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderBottom: `1px solid ${BORDER_COLOR}` }}>
          <span className="flex-1 text-xs font-semibold uppercase" style={{ color: TEXT_GRAY, letterSpacing: "0.06em" }}>Date</span>
          <span className="text-xs font-semibold uppercase text-right" style={{ color: TEXT_GRAY, letterSpacing: "0.06em" }}>Value</span>
        </div>

        <div className="flex-1" style={{ minHeight: 0, overflow: "hidden" }}>
          {storyListEntries.map((entry, idx) => (
            <div
              key={entry.id}
              className="flex items-center px-4"
              style={{
                height: "52px",
                backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                borderBottom: `1px solid rgba(255,255,255,0.04)`,
              }}
              data-testid={`share-row-${entry.id}`}
            >
              <span className="flex-1 text-sm font-medium" style={{ color: TEXT_WHITE }}>{formatDate(entry.date)}</span>
              <span
                className="text-sm font-bold rounded-full px-3 py-1"
                style={{
                  backgroundColor: entry.value >= 0 ? GREEN_BG : RED_BG,
                  color: entry.value >= 0 ? GREEN : RED,
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "80px",
                  textAlign: "center",
                }}
              >
                {entry.value >= 0 ? "+" : ""}{formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>

        {moreCount > 0 && (
          <div className="text-center py-3">
            <span className="text-xs" style={{ color: TEXT_GRAY }}>+ {moreCount} more entries</span>
          </div>
        )}

      </div>
    </div>
  );
}
