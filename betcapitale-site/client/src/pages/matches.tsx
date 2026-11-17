import { useRef, useCallback, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Match } from "@shared/schema";
import { insertMatchSchema } from "@shared/schema";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Download,
  Loader2,
  Trophy,
  Target,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import html2canvas from "html2canvas";
import { Link } from "wouter";

const GREEN = "#00ff03";
const RED = "#ef4444";
const BG_BLACK = "#0a0a0a";
const CARD_BG = "#111111";
const CARD_GRADIENT = "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))";
const BORDER_COLOR = "rgba(255,255,255,0.06)";
const TEXT_WHITE = "#f0f0f0";
const TEXT_GRAY = "#71717a";
const TEXT_LIGHT_GRAY = "#a1a1aa";

const EXPORT_W = 1080;
const EXPORT_H = 1920;

const formSchema = insertMatchSchema.extend({
  date: z.string().min(1, "Date is required"),
  homeTeam: z.string().min(1, "Home team is required"),
  awayTeam: z.string().min(1, "Away team is required"),
  result: z.enum(["won", "lost", "postponed"]),
});

type FormValues = z.infer<typeof formSchema>;

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Matches() {
  const { toast } = useToast();
  const exportRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { date: "", homeTeam: "", awayTeam: "", result: "won" },
  });

  const addMutation = useMutation({
    mutationFn: (data: FormValues) => apiRequest("POST", "/api/matches", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      form.reset({ date: form.getValues("date"), homeTeam: "", awayTeam: "", result: "won" });
      toast({ title: "Match added" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add match.", variant: "destructive" });
    },
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

  const sortedMatches = useMemo(() =>
    [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [matches]
  );

  const dateGroups = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    sortedMatches.forEach((m) => {
      if (!groups[m.date]) groups[m.date] = [];
      groups[m.date].push(m);
    });
    return groups;
  }, [sortedMatches]);

  const sortedDates = useMemo(() =>
    Object.keys(dateGroups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()),
    [dateGroups]
  );

  const activeDate = selectedDate && dateGroups[selectedDate] ? selectedDate : sortedDates[0] || null;
  const activeDayMatches = activeDate ? dateGroups[activeDate] : [];

  const activeDateIndex = activeDate ? sortedDates.indexOf(activeDate) : 0;
  const canGoPrev = activeDateIndex < sortedDates.length - 1;
  const canGoNext = activeDateIndex > 0;

  const totalMatches = matches.length;
  const totalWon = matches.filter((m) => m.result === "won").length;
  const totalLost = matches.filter((m) => m.result === "lost").length;
  const totalPostponed = matches.filter((m) => m.result === "postponed").length;
  const winRate = totalMatches > 0 ? Math.round((totalWon / (totalWon + totalLost)) * 100) : 0;

  const dayWon = activeDayMatches.filter((m) => m.result === "won").length;
  const dayLost = activeDayMatches.filter((m) => m.result === "lost").length;
  const dayTotal = activeDayMatches.filter((m) => m.result !== "postponed").length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG_BLACK }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: GREEN }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG_BLACK, color: TEXT_WHITE }}>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Link href="/profit">
            <Button variant="ghost" style={{ color: TEXT_LIGHT_GRAY }} data-testid="link-profit-chart">
              Profit Chart
            </Button>
          </Link>
          <h1 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase" }} data-testid="text-matches-title">
            Bet Capitale Match <span style={{ color: GREEN }}>Tracker</span>
          </h1>
          <div style={{ width: "100px" }} />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { title: "Win Rate", value: `${winRate}%`, icon: Trophy, color: GREEN },
            { title: "Won", value: `${totalWon}`, icon: Target, color: GREEN },
            { title: "Lost", value: `${totalLost}`, icon: XCircle, color: RED },
            { title: `Last ${totalMatches} Matches`, value: `${totalMatches}`, icon: Clock, color: TEXT_WHITE },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-lg"
              style={{
                background: CARD_GRADIENT,
                border: `1px solid ${BORDER_COLOR}`,
                padding: "16px",
              }}
              data-testid={`card-stat-${card.title.toLowerCase().replace(" ", "-")}`}
            >
              <div className="flex items-center justify-between gap-1">
                <span style={{ fontSize: "10px", fontWeight: 600, color: TEXT_GRAY, letterSpacing: "0.08em", textTransform: "uppercase" }}>{card.title}</span>
                <card.icon style={{ width: "12px", height: "12px", color: card.color }} />
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: card.color, marginTop: "6px", fontVariantNumeric: "tabular-nums" }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {activeDate && (
          <>
            <div className="flex items-center justify-between gap-2">
              <Button
                size="icon" variant="ghost"
                disabled={!canGoPrev}
                onClick={() => setSelectedDate(sortedDates[activeDateIndex + 1])}
                style={{ color: TEXT_LIGHT_GRAY }}
                data-testid="button-prev-day"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h2 style={{ fontSize: "16px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }} data-testid="text-active-date">
                  {formatShortDate(activeDate)}
                </h2>
                <span style={{ fontSize: "12px", color: TEXT_GRAY }}>
                  {dayWon}/{dayTotal} successful
                </span>
              </div>
              <Button
                size="icon" variant="ghost"
                disabled={!canGoNext}
                onClick={() => setSelectedDate(sortedDates[activeDateIndex - 1])}
                style={{ color: TEXT_LIGHT_GRAY }}
                data-testid="button-next-day"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {activeDayMatches.map((match) => {
                const bg = match.result === "won" ? GREEN : match.result === "lost" ? RED : "#ffffff";
                return (
                  <div
                    key={match.id}
                    className="flex items-center rounded-md overflow-hidden"
                    style={{ border: `2px solid ${bg}20` }}
                    data-testid={`match-row-${match.id}`}
                  >
                    <div className="flex-1 py-2.5 px-4 text-center" style={{ backgroundColor: bg, color: "#000000" }}>
                      <span style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {match.homeTeam}
                      </span>
                    </div>
                    <div style={{ backgroundColor: "#1a1a1a", padding: "8px 12px", fontSize: "11px", fontWeight: 700, color: TEXT_LIGHT_GRAY }}>
                      VS
                    </div>
                    <div className="flex-1 py-2.5 px-4 text-center" style={{ backgroundColor: bg, color: "#000000" }}>
                      <span style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {match.awayTeam}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => exportPNG(exportRef, `betgheat-matches-${activeDate}.png`, EXPORT_W, EXPORT_H)}
                className="border-0"
                style={{ backgroundColor: CARD_BG, color: GREEN }}
                data-testid="button-download-matches"
              >
                <Download className="h-4 w-4 mr-1" /> Download Match Day PNG
              </Button>
            </div>
          </>
        )}

        <div className="rounded-lg" style={{ background: CARD_GRADIENT, border: `1px solid ${BORDER_COLOR}`, padding: "20px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }} data-testid="text-add-match-title">Add New Match</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2 flex-wrap">
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: TEXT_GRAY, fontSize: "11px" }}>Date</FormLabel>
                  <FormControl><Input type="date" {...field} style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR, color: TEXT_WHITE }} data-testid="input-match-date" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="homeTeam" render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel style={{ color: TEXT_GRAY, fontSize: "11px" }}>Home Team</FormLabel>
                  <FormControl><Input placeholder="Home Team" {...field} style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR, color: TEXT_WHITE }} data-testid="input-home-team" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="awayTeam" render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel style={{ color: TEXT_GRAY, fontSize: "11px" }}>Away Team</FormLabel>
                  <FormControl><Input placeholder="Away Team" {...field} style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR, color: TEXT_WHITE }} data-testid="input-away-team" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="result" render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: TEXT_GRAY, fontSize: "11px" }}>Result</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR, color: TEXT_WHITE, minWidth: "120px" }} data-testid="select-result">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="postponed">Postponed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={addMutation.isPending} style={{ backgroundColor: GREEN, color: BG_BLACK, fontWeight: 700 }} data-testid="button-add-match">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </form>
          </Form>
        </div>

        {sortedDates.length > 1 && (
          <div className="rounded-lg" style={{ background: CARD_GRADIENT, border: `1px solid ${BORDER_COLOR}`, padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }} data-testid="text-all-days-title">All Match Days</h2>
            <div className="space-y-2">
              {sortedDates.map((date) => {
                const dayMatches = dateGroups[date];
                const dWon = dayMatches.filter((m) => m.result === "won").length;
                const dPlayed = dayMatches.filter((m) => m.result !== "postponed").length;
                const isActive = date === activeDate;
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className="w-full flex items-center justify-between rounded-md px-4 py-3"
                    style={{
                      backgroundColor: isActive ? "rgba(0,255,3,0.08)" : "transparent",
                      border: isActive ? `1px solid ${GREEN}30` : `1px solid ${BORDER_COLOR}`,
                      cursor: "pointer",
                    }}
                    data-testid={`button-day-${date}`}
                  >
                    <span style={{ fontSize: "13px", fontWeight: 600, color: TEXT_WHITE }}>{formatShortDate(date)}</span>
                    <span style={{ fontSize: "15px", fontWeight: 800 }}>
                      <span style={{ color: GREEN }}>{dWon}</span>
                      <span style={{ color: TEXT_WHITE }}>/</span>
                      <span style={{ color: TEXT_WHITE }}>{dPlayed}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <div
        ref={exportRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: `${EXPORT_W}px`,
          height: `${EXPORT_H}px`,
          backgroundColor: BG_BLACK,
          padding: "48px 48px 48px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div className="text-center" style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "0.06em", color: TEXT_WHITE, textTransform: "uppercase", lineHeight: 1.2 }}>
            Bet Capitale Match <span style={{ color: GREEN }}>Tracker</span>
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { title: "Win Rate", value: `${winRate}%`, color: GREEN },
            { title: "Won", value: `${totalWon}`, color: GREEN },
            { title: "Lost", value: `${totalLost}`, color: RED },
            { title: `Last ${totalMatches} Matches`, value: `${totalMatches}`, color: TEXT_WHITE },
          ].map((card) => (
            <div key={card.title} style={{ background: CARD_GRADIENT, border: `1px solid ${BORDER_COLOR}`, borderRadius: "8px", padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: TEXT_GRAY, letterSpacing: "0.08em", textTransform: "uppercase" }}>{card.title}</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: card.color, marginTop: "6px", fontVariantNumeric: "tabular-nums" }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "0.04em", color: TEXT_WHITE, textTransform: "uppercase" }}>
            {activeDate ? formatShortDate(activeDate) : ""}
          </h2>
          <span style={{ fontSize: "16px", color: TEXT_GRAY }}>
            {dayWon}/{dayTotal} successful
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {activeDayMatches.map((match) => {
            const bg = match.result === "won" ? GREEN : match.result === "lost" ? RED : "#ffffff";
            return (
              <div
                key={match.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: `3px solid ${bg}20`,
                }}
              >
                <div style={{
                  flex: 1,
                  padding: "16px 20px",
                  textAlign: "center",
                  backgroundColor: bg,
                  color: "#000000",
                }}>
                  <span style={{ fontSize: "22px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {match.homeTeam}
                  </span>
                </div>
                <div style={{
                  backgroundColor: "#1a1a1a",
                  padding: "16px 20px",
                  fontSize: "18px",
                  fontWeight: 800,
                  color: TEXT_LIGHT_GRAY,
                }}>
                  VS
                </div>
                <div style={{
                  flex: 1,
                  padding: "16px 20px",
                  textAlign: "center",
                  backgroundColor: bg,
                  color: "#000000",
                }}>
                  <span style={{ fontSize: "22px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {match.awayTeam}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
