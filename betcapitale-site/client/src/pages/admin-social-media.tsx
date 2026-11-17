import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { RefreshCw, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { MatchListTemplate2, type MatchListTemplate2Metrics } from "@/components/match-list-template-2";

/* ─── TYPES ─────────────────────────────────────────────────────── */
type AC = {
  id: number; date: string; reference: string; label: string;
  matchCount: number; stake: number; totalOdds: number; firstKickoffAt: string;
  placedAtTime?: string | null;
  status: string; result: string | null; returnAmount: number | null;
  hasPreMatchImage: boolean; hasSettledImage: boolean; matchNames: string[];
};
type TM = {
  id: number; date: string; homeTeam: string; awayTeam: string;
  competition: string; kickoffAt: string; result: string | null;
  country?: string | null; countryCode?: string | null;
};
type ContentTab = "match" | "match-v2" | "coupon" | "balance" | "cover" | "chart";
type CoverStyle = "cover01" | "cover02" | "cover03" | "cover04" | "endcover" | "endcover2" | "endcover3" | "endcover6";
type Variant    = "prematch" | "result";
type Fmt        = "story" | "post";

const DIMS: Record<Fmt, { w: number; h: number }> = {
  story: { w: 1080, h: 1920 },
  post:  { w: 1080, h: 1350 },
};
const PREV_W = 270;
const MATCH_LIST_V2_METRICS_KEY = "betcapitale:social-media:match-list-v2:metrics:v1";
const EMPTY_MATCH_LIST_V2_METRICS: MatchListTemplate2Metrics = {
  metric1: "", metric2: "", metric3: "", metric4: "", movement: "",
};
const MATCH_LIST_V2_METRIC_FIELDS: { key: keyof MatchListTemplate2Metrics; label: string }[] = [
  { key: "metric1", label: "Metric 1" },
  { key: "metric2", label: "Metric 2" },
  { key: "metric3", label: "Metric 3" },
  { key: "metric4", label: "Metric 4" },
  { key: "movement", label: "Change %" },
];

function loadMatchListV2Metrics(): Record<number, MatchListTemplate2Metrics> {
  try {
    const raw = window.localStorage.getItem(MATCH_LIST_V2_METRICS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const result: Record<number, MatchListTemplate2Metrics> = {};
    Object.entries(parsed).forEach(([id, value]) => {
      const matchId = Number(id);
      if (!Number.isInteger(matchId) || matchId <= 0 || !value || typeof value !== "object" || Array.isArray(value)) return;
      const fields = value as Record<string, unknown>;
      result[matchId] = {
        metric1: typeof fields.metric1 === "string" ? fields.metric1 : "",
        metric2: typeof fields.metric2 === "string" ? fields.metric2 : "",
        metric3: typeof fields.metric3 === "string" ? fields.metric3 : "",
        metric4: typeof fields.metric4 === "string" ? fields.metric4 : "",
        movement: typeof fields.movement === "string" ? fields.movement : "",
      };
    });
    return result;
  } catch (error) {
    console.warn("[social-media] Could not load Match List v2 metrics from local storage.", error);
    return {};
  }
}

/* ─── HELPERS ────────────────────────────────────────────────────── */
function todayISO() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}
function fmt2(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso; }
}
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
function fileSlug(tab: ContentTab, variant: Variant, fmt: Fmt, page: number) {
  const tm: Record<ContentTab, string> = {
    match: "match-list", "match-v2": "match-list-v2",
    coupon: "coupon-info", balance: "balance", cover: "cover", chart: "chart",
  };
  const vm = { prematch: "prematch", result: "results" };
  const p  = page > 0 ? `-p${page + 1}` : "";
  return `bet-capitale-${todayISO()}-${tm[tab]}-${vm[variant]}-${fmt}${p}.png`;
}
/* Safe kickoff formatter — handles ISO, date-only, time-only, "00:00", empty, undefined */
function fmtKickoff(firstKickoffAt: string | undefined, date: string): string {
  if (!firstKickoffAt) return "";
  // Time-only: "15:00" or "00:00"
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(firstKickoffAt.trim())) {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return firstKickoffAt.slice(0, 5);
    try {
      const d = new Date(`${date}T${firstKickoffAt.trim().slice(0, 5)}:00`);
      if (isNaN(d.getTime())) return firstKickoffAt.slice(0, 5);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, "0");
      const mn = String(d.getMinutes()).padStart(2, "0");
      return `${dd}.${mm}.${yy} • ${hh}:${mn}`;
    } catch { return firstKickoffAt.slice(0, 5); }
  }
  // Full ISO or date-only
  try {
    const raw = firstKickoffAt.includes("T") ? firstKickoffAt : `${firstKickoffAt}T00:00:00`;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mn = String(d.getMinutes()).padStart(2, "0");
    return `${dd}.${mm}.${yy} • ${hh}:${mn}`;
  } catch { return ""; }
}

/* ─── DESIGN TOKENS — exact spec values ─────────────────────────── */
const C = {
  bg:           "#FFFFFF",
  surface:      "#FFFFFF",
  navy:         "#0D1424",
  orange:       "#F35A00",
  orangeSoft:   "#FFF1E7",
  muted:        "#6F7889",
  border:       "#EBEBEB",
  borderStrong: "#D8D8D8",
  green:        "#159B65",
  greenSoft:    "#E8F6F0",
  red:          "#D94B51",
  redSoft:      "#FBEAEC",
  shadow:       "0 16px 44px rgba(13,20,36,0.08)",
};
const SERIF = "'DM Serif Display', 'Playfair Display', Georgia, serif";
const SANS  = "Inter, Manrope, Arial, sans-serif";

/* Cover 01 fonts — Cormorant Garamond + Montserrat */
const COVER01_SERIF = "'Cormorant Garamond', Georgia, serif";
const COVER01_SANS  = "Montserrat, Arial, sans-serif";

/* Cover 03 fonts — Barlow Condensed */
const COVER03_CONDENSED = "'Barlow Condensed', Arial Narrow, sans-serif";

/* End Cover fonts — Bodoni Moda + Inter */
const ENDCOVER_SERIF = "'Bodoni Moda', 'Times New Roman', serif";

/* ─── INSTAGRAM EXPORT PROFILE ─────────────────────────────────────
   Compensates for Instagram's automatic colour processing (desaturation,
   contrast reduction, brightness shift, typography thinning).
   Adjust these values in one place; they are applied only to a temporary
   clone — the live preview and standard PNG export are never touched.    */
const instagramProfile = {
  saturation:   1.10,   // +10% to counter Instagram's desaturation
  contrast:     1.06,   // +6%  to counter Instagram's contrast reduction
  brightness:   0.99,   // -1%  slight pre-darkening
  jpegQuality:  0.95,   // JPEG quality (0–1)
} as const;

/* ── Font embed helper — fetches fully self-contained font CSS (base64 data URIs)
   via same-origin proxy, then passes it as fontEmbedCSS to html-to-image so it
   bypasses stylesheet scanning (which fails on cross-origin Google Fonts sheets).
   Result is cached for the session. ── */
let _fontEmbedCSSPromise: Promise<string> | null = null;
async function loadFontEmbedCSS(): Promise<string> {
  if (_fontEmbedCSSPromise) return _fontEmbedCSSPromise;
  _fontEmbedCSSPromise = fetch("/api/font-css")
    .then(r => {
      if (!r.ok) throw new Error(`Font CSS proxy returned ${r.status}`);
      return r.text();
    })
    .catch(err => {
      _fontEmbedCSSPromise = null; // allow retry on next export
      console.warn("[export] Font embed fetch failed, exports may have missing fonts:", err);
      return ""; // fall through — html-to-image will try its own (lossy) path
    });
  return _fontEmbedCSSPromise;
}

/* ── Image load helper — waits for every <img> inside a node to fully load
   and decode before html-to-image captures it. ── */
async function waitForImages(el: HTMLElement): Promise<void> {
  const imgs = Array.from(el.querySelectorAll<HTMLImageElement>("img"));
  await Promise.all(imgs.map(img => {
    if (img.complete && img.naturalWidth > 0) {
      return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    }
    return new Promise<void>(resolve => {
      const done = () => {
        if (img.decode) img.decode().catch(() => {}).finally(resolve);
        else resolve();
      };
      img.addEventListener("load",  done,       { once: true });
      img.addEventListener("error", () => resolve(), { once: true });
    });
  }));
}

/* Inject Google Fonts for Cover 01 + Cover 03 once at module load */
if (typeof document !== "undefined") {
  const _fid = "bc-cover01-fonts";
  if (!document.getElementById(_fid)) {
    const _lnk = document.createElement("link");
    _lnk.id = _fid; _lnk.rel = "stylesheet";
    _lnk.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Montserrat:wght@400;500;600;700&display=swap";
    document.head.appendChild(_lnk);
  }
  const _fid3 = "bc-cover03-fonts";
  if (!document.getElementById(_fid3)) {
    const _lnk3 = document.createElement("link");
    _lnk3.id = _fid3; _lnk3.rel = "stylesheet";
    _lnk3.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&display=swap";
    document.head.appendChild(_lnk3);
  }
  const _fidE = "bc-endcover-fonts";
  if (!document.getElementById(_fidE)) {
    const _lnkE = document.createElement("link");
    _lnkE.id = _fidE; _lnkE.rel = "stylesheet";
    _lnkE.href = "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500;6..96,600;6..96,700;6..96,800;6..96,900&family=Inter:wght@300;400;500;600;700;800&display=swap";
    document.head.appendChild(_lnkE);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════════ */

/* Brand area — left-aligned, real logo */
/* PNG (3750×1969) has ~32% top and ~42% bottom internal whitespace.
   At 300px wide: rendered height≈157px, top pad≈50px, bottom pad≈66px.
   At 240px wide: rendered height≈126px, top pad≈40px, bottom pad≈53px.
   Clip wrapper removes that whitespace so the logo sits flush. */
function BrandArea({ isStory }: { isStory: boolean }) {
  const logoW   = isStory ? 300 : 240;
  const wrapH   = isStory ? 58  : 46;
  const negTop  = isStory ? -46 : -37;
  return (
    <div style={{ height: wrapH, overflow: "hidden", marginLeft: isStory ? -11 : -9 }}>
      <img
        src="/bet-capitale-logo.png"
        alt="Bet Capitale"
        style={{ width: logoW, height: "auto", objectFit: "contain", display: "block", marginTop: negTop }}
      />
    </div>
  );
}

/* Brand area centered — for Kupon template, real logo */
function BrandAreaCentered({ isStory }: { isStory: boolean }) {
  const logoW   = isStory ? 300 : 240;
  const wrapH   = isStory ? 58  : 46;
  const negTop  = isStory ? -46 : -37;
  return (
    <div style={{ height: wrapH, overflow: "hidden", display: "flex", justifyContent: "center", marginLeft: isStory ? -11 : -9 }}>
      <img
        src="/bet-capitale-logo.png"
        alt="Bet Capitale"
        style={{ width: logoW, height: "auto", objectFit: "contain", display: "block", marginTop: negTop }}
      />
    </div>
  );
}

/* Small inline SVG icons for stats grid */
function GridIcon({ icon, color, sz }: { icon: string; color: string; sz: number }) {
  const s = sz;
  if (icon === "ticket") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M2 9a2 2 0 1 1 0-4h20a2 2 0 1 1 0 4v6a2 2 0 1 1 0 4H2a2 2 0 1 1 0-4V9z" stroke={color} strokeWidth="1.6"/>
      <line x1="9" y1="5" x2="9" y2="19" stroke={color} strokeWidth="1.4" strokeDasharray="3 2"/>
    </svg>
  );
  if (icon === "trophy") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8M12 17v4M6 3H3v5a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V3h-3" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M6 3h12v6a6 6 0 0 1-6 6 6 6 0 0 1-6-6V3z" stroke={color} strokeWidth="1.6"/>
    </svg>
  );
  if (icon === "xcircle") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
      <line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
  if (icon === "coins") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="14" r="6" stroke={color} strokeWidth="1.6"/>
      <ellipse cx="9" cy="14" rx="6" ry="2" stroke={color} strokeWidth="1.4"/>
      <path d="M15 8c3.3 0 6 1.3 6 3s-2.7 3-6 3" stroke={color} strokeWidth="1.4"/>
      <line x1="15" y1="5" x2="15" y2="11" stroke={color} strokeWidth="1.4"/>
      <path d="M15 5c3.3 0 6 1.3 6 3" stroke={color} strokeWidth="1.4"/>
    </svg>
  );
  if (icon === "soccer") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
      <polygon points="12,6 14.5,10.5 19,11 15.5,14.5 16.5,19 12,16.5 7.5,19 8.5,14.5 5,11 9.5,10.5" stroke={color} strokeWidth="1.2" fill="none"/>
    </svg>
  );
  // wallet fallback
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="3" stroke={color} strokeWidth="1.6"/>
      <path d="M2 10h20" stroke={color} strokeWidth="1.4"/>
      <circle cx="17" cy="15" r="1.5" fill={color}/>
    </svg>
  );
}

/* Calendar SVG icon */
function CalendarIcon({ sz, color = C.muted }: { sz: number; color?: string }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 22 22" fill="none">
      <rect x="2" y="4" width="18" height="16" rx="3" stroke={color} strokeWidth="1.5" fill="none"/>
      <line x1="2" y1="9" x2="20" y2="9" stroke={color} strokeWidth="1.5"/>
      <line x1="7" y1="2" x2="7" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="2" x2="15" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* Menu dots — top-right decoration */
function MenuDots({ isStory }: { isStory: boolean }) {
  const d = isStory ? 6 : 5;
  return (
    <div style={{ display: "flex", gap: isStory ? 5 : 4, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: d, height: d, borderRadius: "50%", background: C.muted, opacity: 0.45 }} />
      ))}
    </div>
  );
}

/* Info card with lock icon, two text lines, optional right SVG decoration */
function InfoCard({ isStory, title, subtitle, decor }: {
  isStory: boolean; title: string; subtitle: string; decor: "circles" | "box";
}) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: isStory ? 20 : 16,
      padding: `${isStory ? 20 : 15}px ${isStory ? 22 : 17}px`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: C.shadow,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: isStory ? 16 : 13 }}>
        <div style={{
          width: isStory ? 50 : 40, height: isStory ? 50 : 40, borderRadius: "50%",
          background: C.orangeSoft, border: `1px solid #F4C7AA`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width={isStory ? 22 : 18} height={isStory ? 22 : 18} viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke={C.orange} strokeWidth="1.8"/>
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={C.orange} strokeWidth="1.8" fill="none"/>
            <circle cx="12" cy="16" r="1.5" fill={C.orange}/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 20 : 15, color: C.navy, lineHeight: 1.2 }}>
            {title}
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: isStory ? 14 : 11, color: C.muted, lineHeight: 1.3, marginTop: isStory ? 4 : 3 }}>
            {subtitle}
          </div>
        </div>
      </div>
      {decor === "circles" ? (
        <svg width={isStory ? 80 : 64} height={isStory ? 60 : 48} viewBox="0 0 80 60" fill="none" opacity="0.45" style={{ flexShrink: 0 }}>
          <ellipse cx="32" cy="30" rx="26" ry="20" stroke={C.orange} strokeWidth="1.5"/>
          <ellipse cx="50" cy="30" rx="22" ry="17" stroke={C.orange} strokeWidth="1.3"/>
          <ellipse cx="42" cy="30" rx="12" ry="9" stroke={C.orange} strokeWidth="1" opacity="0.6"/>
        </svg>
      ) : (
        <svg width={isStory ? 72 : 58} height={isStory ? 60 : 48} viewBox="0 0 72 60" fill="none" opacity="0.45" style={{ flexShrink: 0 }}>
          <rect x="8" y="22" width="56" height="34" rx="4" stroke={C.orange} strokeWidth="1.5"/>
          <rect x="4" y="14" width="64" height="14" rx="4" stroke={C.orange} strokeWidth="1.5"/>
          <line x1="26" y1="32" x2="46" y2="32" stroke={C.orange} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
}

/* Full date with weekday */
function fmtDateFull(iso: string): string {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric", weekday: "long",
    });
  } catch { return iso; }
}

/* Extract creation time from reference string (SB-YYYYMMDD-<unix_ms>) */
function fmtRefTime(reference: string, date: string): string {
  try {
    const ms = Number(reference.split("-").pop());
    const dateLabel = new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
    if (!isNaN(ms) && ms > 1_000_000_000_000) {
      const d = new Date(ms);
      const timeLabel = d.toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul", hour12: false,
      });
      return `${dateLabel} • ${timeLabel}`;
    }
    return dateLabel;
  } catch { return date; }
}

/* Decorative corner SVG — spec: 2-3 thin orange curves + small sparkle */
function DecorCorner({ isStory }: { isStory: boolean }) {
  const sz = isStory ? 200 : 160;
  return (
    <svg width={sz} height={sz} viewBox="0 0 200 200" fill="none"
      style={{ position: "absolute", top: 0, right: 0, pointerEvents: "none" }}>
      <path d="M200 0 Q145 60 125 115 Q105 170 155 198"
        stroke={C.orange} strokeWidth="1.5" fill="none" opacity="0.18" />
      <path d="M168 0 Q140 46 132 88"
        stroke={C.orange} strokeWidth="1" fill="none" opacity="0.13" />
      <g transform="translate(158,24)" opacity="0.36">
        <line x1="0" y1="-10" x2="0" y2="10" stroke={C.orange} strokeWidth="1.5" />
        <line x1="-10" y1="0" x2="10" y2="0" stroke={C.orange} strokeWidth="1.5" />
        <line x1="-6" y1="-6" x2="6" y2="6" stroke={C.orange} strokeWidth="1" />
        <line x1="6" y1="-6" x2="-6" y2="6" stroke={C.orange} strokeWidth="1" />
      </g>
      <g transform="translate(70,14)" opacity="0.26">
        <line x1="0" y1="-5" x2="0" y2="5" stroke={C.orange} strokeWidth="1" />
        <line x1="-5" y1="0" x2="5" y2="0" stroke={C.orange} strokeWidth="1" />
      </g>
    </svg>
  );
}

/* Pill — story: 56px/24px-padding/19px · post: 46px/18px-padding/17px */
function Pill({ label, orange = false, isStory = true }: {
  label: string; orange?: boolean; isStory?: boolean;
}) {
  const h   = isStory ? 56 : 46;
  const px  = isStory ? 24 : 18;
  const fs  = isStory ? 19 : 17;
  return (
    <div style={{
      height: h, display: "inline-flex", alignItems: "center",
      paddingLeft: px, paddingRight: px, borderRadius: 999,
      border: orange ? `2px solid ${C.orange}` : `1px solid ${C.borderStrong}`,
      background: orange ? "transparent" : "rgba(255,255,255,0.72)",
    }}>
      <span style={{
        fontFamily: SANS, fontWeight: 700, fontSize: fs,
        color: orange ? C.orange : C.navy, whiteSpace: "nowrap",
      }}>
        {label}
      </span>
    </div>
  );
}

/* Page badge — shows X/Y, same pill style as date/count */
function PageBadge({ page, total, isStory }: { page: number; total: number; isStory: boolean }) {
  if (total < 1) return null;
  const h  = isStory ? 56 : 46;
  const px = isStory ? 18 : 14;
  const fs = isStory ? 19 : 17;
  return (
    <div style={{
      height: h, display: "inline-flex", alignItems: "center",
      paddingLeft: px, paddingRight: px, borderRadius: 999,
      border: `1px solid ${C.borderStrong}`, background: "rgba(255,255,255,0.72)",
    }}>
      <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: fs, color: C.navy }}>
        {page + 1}/{total}
      </span>
    </div>
  );
}

/* Status badge — spec result pill styles */
function StatusBadge({ status, result, small = false }: {
  status: string; result?: string | null; small?: boolean;
}) {
  let color = C.orange, bg = C.orangeSoft, label = "ACTIVE";
  if (status === "SETTLED") {
    if (result === "WON")       { color = C.green; bg = C.greenSoft; label = "WON"; }
    else if (result === "LOST") { color = C.red;   bg = C.redSoft;   label = "LOST"; }
    else                        { color = C.muted; bg = C.border;    label = "VOID"; }
  }
  const fs = small ? 13 : 17;
  const px = small ? 10 : 18;
  const h  = small ? undefined : 42;
  return (
    <span style={{
      fontFamily: SANS, fontWeight: 700, fontSize: fs, color,
      background: bg, height: h, display: "inline-flex", alignItems: "center",
      padding: `${small ? 5 : 0}px ${px}px`, borderRadius: 999, whiteSpace: "nowrap", lineHeight: 1,
    }}>
      {label}
    </span>
  );
}

/* Lock strip — spec: height 46px, bg #F7F3EE, border #ECE3DA, radius 12px, font 16px */
function LockStrip() {
  return (
    <div style={{
      height: 46, background: "#F7F3EE", border: "1px solid #ECE3DA",
      borderRadius: 12, display: "flex", alignItems: "center",
      paddingLeft: 20, paddingRight: 20, gap: 10,
    }}>
      <span style={{ fontSize: 16 }}>🔒</span>
      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16, color: C.muted }}>
        Selections are exclusively for members.
      </span>
    </div>
  );
}

/* Result strip — for settled coupons */
function ResultStrip() {
  return (
    <div style={{
      height: 46, background: C.greenSoft, border: `1px solid ${C.green}40`,
      borderRadius: 12, display: "flex", alignItems: "center",
      paddingLeft: 20, paddingRight: 20, gap: 10,
    }}>
      <span style={{ fontSize: 16 }}>📁</span>
      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16, color: C.green }}>
        Results are archived, never deleted.
      </span>
    </div>
  );
}

/* CTA Band — story: 128px dark navy · post: 100px */
function CtaBand({ isStory }: { isStory: boolean }) {
  const h    = isStory ? 128 : 100;
  const rad  = isStory ? 24  : 20;
  const icSz = isStory ? 76  : 60;
  const icR  = isStory ? 14  : 11;
  const fs   = isStory ? 29  : 22;
  const gap  = isStory ? 20  : 16;
  const px   = isStory ? 30  : 24;
  const em   = isStory ? 34  : 26;
  return (
    <div style={{
      height: h, background: C.navy, borderRadius: rad, flexShrink: 0,
      display: "flex", alignItems: "center", padding: `0 ${px}px`, gap,
    }}>
      <div style={{
        width: icSz, height: icSz, borderRadius: icR,
        border: `1.5px solid ${C.orange}`,
        background: "rgba(243,90,0,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ fontSize: em }}>👑</span>
      </div>
      <div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: fs, color: "#FFFFFF", lineHeight: 1.2 }}>
          Detailed picks and analysis
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: fs, color: C.orange, lineHeight: 1.2 }}>
          exclusively for members.
        </div>
      </div>
    </div>
  );
}

/* Footer bar — Instagram icon + @betcapitale | ✦ | betcapitale.com + globe */
function FooterBar({ isStory, dark = false }: { isStory: boolean; dark?: boolean }) {
  const h   = isStory ? 58 : 44;
  const fs  = isStory ? 17 : 14;
  const ss  = isStory ? 14 : 11;
  const ic  = isStory ? 22 : 17;
  const col = dark ? "rgba(255,255,255,0.75)" : C.navy;
  const muted = dark ? "rgba(255,255,255,0.5)" : C.muted;
  return (
    <div style={{
      height: h, display: "flex", alignItems: "center",
      justifyContent: "space-between", flexShrink: 0,
    }}>
      {/* Left: Instagram icon + @betcapitale */}
      <div style={{ display: "flex", alignItems: "center", gap: isStory ? 8 : 6 }}>
        <svg width={ic} height={ic} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="6" stroke={col} strokeWidth="1.6"/>
          <circle cx="12" cy="12" r="4.5" stroke={col} strokeWidth="1.4"/>
          <circle cx="17.2" cy="6.8" r="1.1" fill={col}/>
        </svg>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: fs, color: col }}>
          @betcapitale
        </span>
      </div>
      {/* Center: sparkle */}
      <svg width={ss} height={ss} viewBox="0 0 16 16" fill={C.orange}>
        <path d="M8 0l1.5 5.5L15 7l-5.5 1.5L8 16l-1.5-7.5L0 7l5.5-1.5L8 0z" />
      </svg>
      {/* Right: betcapitale.com + globe */}
      <div style={{ display: "flex", alignItems: "center", gap: isStory ? 8 : 6 }}>
        <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: fs, color: muted }}>
          betcapitale.com
        </span>
        <svg width={ic} height={ic} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={muted} strokeWidth="1.5"/>
          <ellipse cx="12" cy="12" rx="3.8" ry="9" stroke={muted} strokeWidth="1.3"/>
          <line x1="3" y1="9" x2="21" y2="9" stroke={muted} strokeWidth="1.3"/>
          <line x1="3" y1="15" x2="21" y2="15" stroke={muted} strokeWidth="1.3"/>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TEMPLATE: MAÇ LİSTESİ — premium editorial redesign
═══════════════════════════════════════════════════════════════════ */
interface MacProps {
  matches: TM[]; date: string; fmt: Fmt; variant: Variant; page: number; total: number;
}
function MacListesiTemplate({ matches, date, fmt, variant, page, total }: MacProps) {
  const { w, h } = DIMS[fmt];
  const isStory    = fmt === "story";
  const isPrematch = variant === "prematch";

  /* ML-specific design tokens — isolated from global C.* */
  const ML = {
    page:       "#FFFFFF",
    surface:    "#FFFFFF",
    text1:      "#081426",
    text2:      "#69717D",
    textLight:  "#949AA4",
    accent:     "#F45B0B",
    accentSoft: "#FFF1E8",
    border:     "#E9E5E0",
    borderSt:   "#DDD7D1",
    shadow:     "0 10px 28px rgba(18,24,34,0.045)",
  };

  const padX  = isStory ? 64 : 58;
  const padT  = isStory ? 54 : 44;
  const padB  = isStory ? 44 : 36;

  const titleFs = isStory ? 82 : 68;
  const compFs  = isStory ? 14 : 12;
  const nameFs  = isStory ? 27 : 22;
  const timeFs  = isStory ? 32 : 26;
  const timeW   = isStory ? 138 : 118;

  const n = matches.length;

  /* Dynamic card sizing */
  const cardH = isStory
    ? (n <= 4 ? 182 : n === 5 ? 152 : n === 6 ? 126 : n === 7 ? 110 : n === 8 ? 97 : n === 9 ? 86 : n === 10 ? 76 : 68)
    : (n <= 4 ? 140 : n === 5 ? 118 : n === 6 ? 98  : n === 7 ? 86  : n === 8 ? 76 : n === 9 ? 68 : n === 10 ? 62 : 56);
  const cardGap = isStory
    ? (n <= 4 ? 18 : n === 5 ? 15 : n === 6 ? 13 : n === 7 ? 11 : n === 8 ? 9 : n === 9 ? 8 : n === 10 ? 7 : 6)
    : (n <= 4 ? 14 : n === 5 ? 11 : n === 6 ? 9  : n === 7 ? 8  : n === 8 ? 7 : n === 9 ? 6 : 5);

  const title   = isPrematch ? "Today's Matches" : "Today's Results";
  const dateStr = fmtDateFull(date);

  return (
    <div style={{
      width: w, height: h, background: ML.page, overflow: "hidden",
      boxSizing: "border-box", display: "flex", flexDirection: "column",
    }}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{ padding: `${padT}px ${padX}px 0`, flexShrink: 0 }}>

        {/* Logo */}
        <BrandArea isStory={isStory} />

        {/* Serif title */}
        <div style={{
          marginTop: isStory ? 22 : 16,
          fontFamily: SERIF, fontWeight: 400, fontSize: titleFs,
          color: ML.text1, lineHeight: 1.0,
          letterSpacing: isStory ? "-0.03em" : "-0.025em",
        }}>
          {title}
        </div>

        {/* Outline status pill */}
        <div style={{ marginTop: isStory ? 20 : 15 }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            height: isStory ? 50 : 42,
            paddingLeft: isStory ? 20 : 16, paddingRight: isStory ? 20 : 16,
            borderRadius: 999,
            border: `1.5px solid ${ML.accent}`, background: "transparent",
            gap: isStory ? 9 : 7,
          }}>
            <svg width={isStory ? 17 : 14} height={isStory ? 17 : 14} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={ML.accent} strokeWidth="1.8"/>
              <path d="M12 7v5l3 3" stroke={ML.accent} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span style={{
              fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 17 : 15,
              color: ML.accent, whiteSpace: "nowrap" as const,
            }}>
              {isPrematch ? "PRE-MATCH" : "POST-MATCH"}
            </span>
          </div>
        </div>

        {/* Date + match count */}
        <div style={{
          marginTop: isStory ? 18 : 14,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: SANS, fontWeight: 600, fontSize: isStory ? 19 : 15,
            color: ML.text1,
          }}>
            {dateStr}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: isStory ? 7 : 5 }}>
            <div style={{
              width: isStory ? 7 : 6, height: isStory ? 7 : 6,
              borderRadius: "50%", background: ML.accent, flexShrink: 0,
            }} />
            <span style={{
              fontFamily: SANS, fontWeight: 500, fontSize: isStory ? 17 : 14,
              color: ML.text2,
            }}>
              {n} Matches Today
            </span>
          </div>
        </div>

        {/* Horizontal divider */}
        <div style={{ height: 1, background: ML.border, marginTop: isStory ? 16 : 12 }} />
      </div>

      {/* ── MATCH CARDS ────────────────────────────────────────────── */}
      <div style={{
        padding: `${isStory ? 18 : 14}px ${padX}px 0`,
        display: "flex", flexDirection: "column", gap: cardGap,
        flexShrink: 0,
      }}>
        {matches.map((m) => (
          <div key={m.id} style={{
            height: cardH, background: ML.surface,
            border: `1px solid ${ML.border}`,
            borderRadius: isStory ? 20 : 16,
            boxShadow: ML.shadow,
            display: "flex", alignItems: "stretch",
            overflow: "hidden",
          }}>
            {/* 3 px orange left accent bar (42% of height centred) */}
            <div style={{
              width: isStory ? 4 : 3, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: isStory ? 3 : 2.5,
                height: `${Math.round(cardH * 0.42)}px`,
                background: ML.accent, borderRadius: 2,
              }} />
            </div>

            {/* Match info */}
            <div style={{
              flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
              justifyContent: "center",
              padding: `0 ${isStory ? 16 : 13}px`,
            }}>
              {/* League */}
              <div style={{
                fontFamily: SANS, fontWeight: 600, fontSize: compFs,
                color: ML.text2, textTransform: "uppercase" as const,
                letterSpacing: "0.075em",
                overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis",
                marginBottom: isStory ? 5 : 4,
              }}>
                {m.competition}
              </div>
              {/* Match name */}
              <div style={{
                fontFamily: SANS, fontWeight: 700, fontSize: nameFs,
                color: ML.text1, letterSpacing: "-0.02em", lineHeight: 1.15,
                overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis",
              }}>
                {m.homeTeam}
                <span style={{ color: ML.accent, fontWeight: 400, margin: `0 ${isStory ? 8 : 6}px` }}>–</span>
                {m.awayTeam}
              </div>
            </div>

            {/* Time / Result column */}
            {isPrematch ? (
              <div style={{
                width: timeW, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative" as const,
              }}>
                {/* Partial-height divider */}
                <div style={{
                  position: "absolute" as const, left: 0,
                  top: `${Math.round(cardH * 0.2)}px`,
                  bottom: `${Math.round(cardH * 0.2)}px`,
                  width: 1, background: "#ECE8E4",
                }} />
                <span style={{
                  fontFamily: SANS, fontWeight: 600, fontSize: timeFs,
                  color: ML.accent, letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums lining-nums" as const,
                  fontFeatureSettings: '"tnum" 1, "lnum" 1',
                  whiteSpace: "nowrap" as const,
                }}>
                  {m.kickoffAt}
                </span>
              </div>
            ) : (
              <div style={{
                width: timeW, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative" as const,
              }}>
                <div style={{
                  position: "absolute" as const, left: 0,
                  top: `${Math.round(cardH * 0.2)}px`,
                  bottom: `${Math.round(cardH * 0.2)}px`,
                  width: 1, background: "#ECE8E4",
                }} />
                <span style={{
                  fontFamily: SANS, fontWeight: 800, fontSize: isStory ? 20 : 16,
                  color: m.result === "won" ? "#159B65" : m.result === "lost" ? "#D94B51" : ML.text2,
                  textAlign: "center" as const,
                }}>
                  {m.result === "won" ? "WON" : m.result === "lost" ? "LOST" : m.result === "void" ? "VOID" : "PENDING"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* ── MEMBERSHIP CARD + FOOTER ───────────────────────────────── */}
      <div style={{ flexShrink: 0, padding: `0 ${padX}px` }}>

        {/* Membership card */}
        <div style={{
          background: "#FFFCF9", border: `1px solid #E9E0D7`,
          borderRadius: isStory ? 20 : 16, boxShadow: ML.shadow,
          padding: `${isStory ? 22 : 17}px ${isStory ? 24 : 19}px`,
          display: "flex", alignItems: "center", gap: isStory ? 16 : 13,
        }}>
          <div style={{
            width: isStory ? 42 : 34, height: isStory ? 42 : 34, borderRadius: "50%",
            background: ML.accentSoft, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width={isStory ? 20 : 16} height={isStory ? 20 : 16} viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke={ML.accent} strokeWidth="1.8"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={ML.accent} strokeWidth="1.8"/>
              <circle cx="12" cy="16" r="1.5" fill={ML.accent}/>
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 20 : 16,
              color: ML.text1, lineHeight: 1.2,
            }}>
              Selections are available exclusively to members.
            </div>
            <div style={{
              fontFamily: SANS, fontWeight: 400, fontSize: isStory ? 14 : 12,
              color: ML.text2, lineHeight: 1.3, marginTop: isStory ? 3 : 2,
            }}>
              Membership required for full details.
            </div>
          </div>
        </div>

        {/* Footer divider */}
        <div style={{ height: 1, background: ML.border, margin: `${isStory ? 16 : 12}px 0 ${isStory ? 14 : 11}px` }} />

        {/* Footer — no centre star */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: padB,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: isStory ? 8 : 6 }}>
            <svg width={isStory ? 20 : 16} height={isStory ? 20 : 16} viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="6" stroke={ML.text1} strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="4.5" stroke={ML.text1} strokeWidth="1.4"/>
              <circle cx="17.2" cy="6.8" r="1.1" fill={ML.text1}/>
            </svg>
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 16 : 13, color: ML.text1 }}>
              @betcapitale
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: isStory ? 8 : 6 }}>
            <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: isStory ? 16 : 13, color: ML.text2 }}>
              betcapitale.com
            </span>
            <svg width={isStory ? 20 : 16} height={isStory ? 20 : 16} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={ML.text2} strokeWidth="1.4"/>
              <ellipse cx="12" cy="12" rx="3.8" ry="9" stroke={ML.text2} strokeWidth="1.2"/>
              <line x1="3" y1="9" x2="21" y2="9" stroke={ML.text2} strokeWidth="1.2"/>
              <line x1="3" y1="15" x2="21" y2="15" stroke={ML.text2} strokeWidth="1.2"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* KP — Kupon template local design tokens */
const KP = {
  page:        "#FFFFFF",
  surface:     "#FFFFFF",
  text1:       "#081426",
  text2:       "#6A717C",
  textLight:   "#969DA6",
  accent:      "#F45B0B",
  accentSoft:  "#FFF1E8",
  green:       "#0E9A58",
  red:         "#E33A34",
  border:      "#E9E4DE",
  shadow:      "0 12px 32px rgba(18,24,34,0.055)",
  footerBg:    "#06162E",
};

/* ═══════════════════════════════════════════════════════════════════
   COUPON CARD — used by KuponTemplate
═══════════════════════════════════════════════════════════════════ */
function CouponCard({ coupon, variant, idx, isStory, cardH, couponCount = 1 }: {
  coupon: AC; variant: Variant; idx: number; isStory: boolean; cardH: number; couponCount?: number;
}) {
  const isPrematch = variant === "prematch";
  const potRet = coupon.stake * coupon.totalOdds;
  const isWon  = coupon.status === "SETTLED" && coupon.result === "WON";
  const isLost = coupon.status === "SETTLED" && coupon.result === "LOST";

  const isCompact     = couponCount >= 4;
  const postCompact2col = !isStory && isCompact; // post n≥4: 2-column compact match list

  const cardPad  = isStory ? 28 : 22;
  const circSz   = isStory
    ? (isCompact ? 38 : 46)
    : (isCompact ? 30 : 37);
  const circFs   = isStory ? 22 : 17;
  const titleFs  = isStory
    ? (isCompact ? 30 : 38)
    : (isCompact ? 22 : 30);
  // For post n=6, reduce metricH so content (header=46 + metricH) fits within cardH=106
  const metricH  = isStory
    ? (isCompact ? 84 : 112)
    : (isCompact ? (couponCount >= 6 ? 60 : 68) : 88);
  const metricR  = isStory ? 18 : 14;
  const labFs    = isStory ? 13 : 11;
  const valFs    = isStory ? 28 : 22;
  const matchFs  = isStory ? (isCompact ? 17 : 20) : 16;
  const bulletSz = isStory ? 8 : 6;
  const matchGap = isStory ? (isCompact ? 7 : 10) : 7;
  const lockH    = isStory ? (isCompact ? 40 : 52) : 42;
  // Post compact: hdrPadT=10, hdrPadB=6 → header height = 10+30+6 = 46px
  const hdrPadT  = isStory ? (isCompact ? 14 : 22) : (isCompact ? 10 : 17);
  const hdrPadB  = isStory ? (isCompact ? 10 : 16) : (isCompact ? 6 : 12);
  const lockMarginB = isStory ? (isCompact ? 14 : 22) : 0;

  const col4Label = !isPrematch && coupon.status === "SETTLED"
    ? (isWon ? "RETURN" : isLost ? "NET RESULT" : "RESULT") : "POT. RETURN";
  const col4Value = !isPrematch && coupon.status === "SETTLED"
    ? (isWon ? `€${fmt2(potRet)}` : isLost ? `-€${fmt2(coupon.stake)}` : "—")
    : `€${fmt2(potRet)}`;
  const col4Color = !isPrematch && coupon.status === "SETTLED"
    ? (isWon ? KP.green : isLost ? KP.red : KP.textLight) : KP.accent;

  const stats = [
    { label: "MATCHES",     value: `${coupon.matchCount}`,       color: KP.text1 },
    { label: "TOTAL ODDS",  value: coupon.totalOdds.toFixed(2),  color: KP.text1 },
    { label: "STAKE",       value: `€${fmt2(coupon.stake)}`,     color: KP.text1 },
    { label: col4Label,     value: col4Value,                     color: col4Color },
  ];

  const names = coupon.matchNames ?? [];
  const badgeColor = isWon ? KP.green : isLost ? KP.red : KP.accent;
  const badgeLabel = isWon ? "WON" : isLost ? "LOST" : "ACTIVE";

  return (
    <div style={{
      height: cardH, background: KP.surface, border: `1px solid ${KP.border}`,
      borderRadius: isStory ? 24 : 18, boxShadow: KP.shadow, overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header row */}
      <div style={{
        padding: `${hdrPadT}px ${cardPad}px ${hdrPadB}px`,
        display: "flex", alignItems: "center", gap: isStory ? 14 : 11,
        flexShrink: 0,
      }}>
        <div style={{
          width: circSz, height: circSz, borderRadius: "50%", background: KP.accent,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: circFs, color: "#fff" }}>
            {idx + 1}
          </span>
        </div>
        <div style={{
          flex: 1, fontFamily: SERIF, fontWeight: 400, fontSize: titleFs,
          color: KP.text1, letterSpacing: -0.4, lineHeight: 1.0,
          overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis",
        }}>
          {coupon.label}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: isStory ? 7 : 5, flexShrink: 0 }}>
          <div style={{ width: isStory ? 8 : 7, height: isStory ? 8 : 7, borderRadius: "50%", background: badgeColor }} />
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: isStory ? 16 : 13, color: badgeColor }}>
            {badgeLabel}
          </span>
        </div>
      </div>

      {/* Metric panel — 4 cols, no icons */}
      <div style={{
        margin: `0 ${cardPad}px`,
        height: metricH,
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        border: `1px solid ${KP.border}`, borderRadius: metricR,
        background: "#FFFEFC", overflow: "hidden", flexShrink: 0,
      }}>
        {stats.map((st, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            borderRight: i < 3 ? `1px solid ${KP.border}` : "none",
            padding: `${isStory ? 10 : 8}px ${isStory ? 6 : 4}px`,
            gap: isStory ? 5 : 4,
          }}>
            <div style={{
              fontFamily: SANS, fontWeight: 600, fontSize: labFs, color: KP.text2,
              textTransform: "uppercase" as const, letterSpacing: "0.05em",
              textAlign: "center" as const, lineHeight: 1.2,
            }}>
              {st.label}
            </div>
            <div style={{
              fontFamily: SANS, fontWeight: 800, fontSize: valFs,
              color: st.color, letterSpacing: -0.3,
              fontVariantNumeric: "tabular-nums lining-nums" as const,
              fontFeatureSettings: '"tnum" 1, "lnum" 1',
              width: "100%", textAlign: "center" as const,
              whiteSpace: "nowrap" as const,
            }}>
              {st.value}
            </div>
          </div>
        ))}
      </div>

      {/* Match list — 2-column compact for post n≥4, single-column otherwise */}
      {postCompact2col ? (
        /* ── POST COMPACT: 2-column match names ─────────────────────── */
        <div style={{
          flex: 1, minHeight: 0,
          padding: `8px ${cardPad}px 8px`,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* flex-wrap: all names inline, 4+ matches naturally wrap to next line */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "5px 16px" }}>
            {(names.length > 0
              ? names
              : Array.from({ length: Math.min(coupon.matchCount, 4) }).map(() => "—")
            ).map((name, i) => {
              const hasReal = names.length > 0;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: hasReal ? KP.accent : KP.border, flexShrink: 0 }} />
                  <span style={{
                    fontFamily: SANS, fontWeight: 600, fontSize: 14,
                    color: hasReal ? KP.text1 : KP.textLight, lineHeight: 1.3,
                    whiteSpace: "nowrap" as const,
                  }}>
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Push lock strip to bottom */}
          <div style={{ flex: 1 }} />
          {/* Lock strip — same style as non-compact */}
          <div style={{
            display: "flex", alignItems: "center", flexShrink: 0,
            height: 28,
            background: isPrematch ? KP.accentSoft : "#F0FBF6",
            border: `1px solid ${isPrematch ? "#F4C7AA" : KP.green + "40"}`,
            borderRadius: 8, paddingLeft: 10, paddingRight: 10, gap: 7,
          }}>
            {isPrematch ? (
              <>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke={KP.accent} strokeWidth="1.8"/>
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={KP.accent} strokeWidth="1.8"/>
                  <circle cx="12" cy="16" r="1.5" fill={KP.accent}/>
                </svg>
                <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, color: KP.text2, whiteSpace: "nowrap" as const }}>
                  Selections are exclusively for members.
                </span>
              </>
            ) : (
              <>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke={KP.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, color: KP.green, whiteSpace: "nowrap" as const }}>
                  Results are archived, never deleted.
                </span>
              </>
            )}
          </div>
        </div>
      ) : (
        /* ── STANDARD: single-column match names (story all / post n≤3) ─ */
        <div style={{
          flex: 1, minHeight: 0,
          padding: `${isStory ? 16 : 12}px ${cardPad}px ${isStory ? 10 : 8}px`,
          display: "flex", flexDirection: "column", gap: matchGap,
          overflow: "hidden",
        }}>
          {names.length === 0
            ? Array.from({ length: Math.min(coupon.matchCount, 5) }).map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: isStory ? 12 : 9, flexShrink: 0 }}>
                  <div style={{ width: bulletSz, height: bulletSz, borderRadius: "50%", background: KP.border, flexShrink: 0 }} />
                  <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: matchFs, color: KP.textLight }}>—</span>
                </div>
              ))
            : names.map((name, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: isStory ? 12 : 9, flexShrink: 0 }}>
                  <div style={{ width: bulletSz, height: bulletSz, borderRadius: "50%", background: KP.accent, flexShrink: 0 }} />
                  <span style={{
                    fontFamily: SANS, fontWeight: 600, fontSize: matchFs, color: KP.text1, lineHeight: 1.3,
                    overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis",
                  }}>
                    {name}
                  </span>
                </div>
              ))
          }

          {/* Post format: inline lock row */}
          {!isStory && (
            <div style={{
              display: "flex", alignItems: "center", flexShrink: 0,
              height: 28,
              background: isPrematch ? KP.accentSoft : "#F0FBF6",
              border: `1px solid ${isPrematch ? "#F4C7AA" : KP.green + "40"}`,
              borderRadius: 8,
              paddingLeft: 10, paddingRight: 10, gap: 7,
            }}>
              {isPrematch ? (
                <>
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke={KP.accent} strokeWidth="1.8"/>
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={KP.accent} strokeWidth="1.8"/>
                    <circle cx="12" cy="16" r="1.5" fill={KP.accent}/>
                  </svg>
                  <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, color: KP.text2, whiteSpace: "nowrap" as const }}>
                    Selections are exclusively for members.
                  </span>
                </>
              ) : (
                <>
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke={KP.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, color: KP.green, whiteSpace: "nowrap" as const }}>
                    Results are archived, never deleted.
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lock / result strip — story format only */}
      {isStory && (
        <div style={{ margin: `0 ${cardPad}px ${lockMarginB}px`, flexShrink: 0 }}>
          {isPrematch ? (
            <div style={{
              height: lockH, background: KP.accentSoft, border: "1px solid #F4C7AA",
              borderRadius: 14,
              display: "flex", alignItems: "center",
              paddingLeft: 18, gap: 10,
            }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke={KP.accent} strokeWidth="1.8"/>
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={KP.accent} strokeWidth="1.8"/>
                <circle cx="12" cy="16" r="1.5" fill={KP.accent}/>
              </svg>
              <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16, color: KP.text2 }}>
                Selections are exclusively for members.
              </span>
            </div>
          ) : (
            <div style={{
              height: lockH, background: "#F0FBF6", border: `1px solid ${KP.green}40`,
              borderRadius: 14,
              display: "flex", alignItems: "center",
              paddingLeft: 18, gap: 10,
            }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke={KP.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16, color: KP.green }}>
                Results are archived, never deleted.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TEMPLATE: KUPON BİLGİLERİ
═══════════════════════════════════════════════════════════════════ */
interface KuponProps {
  coupons: AC[]; date: string; fmt: Fmt; variant: Variant;
  page: number; total: number; totalCoupons: number; startIdx: number;
}
function KuponTemplate({ coupons, date, fmt, variant, page, total, totalCoupons, startIdx }: KuponProps) {
  const { w, h } = DIMS[fmt];
  const isStory = fmt === "story";

  const padX  = isStory ? 64 : 56;
  const padT  = isStory ? 52 : 42;
  const padB  = isStory ? 42 : 34;

  const titleFs = isStory ? 84 : 66;
  const title   = variant === "prematch" ? "Coupon Details" : "Coupon Results";
  const dateShort = fmtDate(date);
  const n = coupons.length;

  /* Explicit card heights — avoids cavernous empty space per card */
  const cardH = isStory
    ? (n === 1 ? 820 : n === 2 ? 540 : n === 3 ? 420 : n === 4 ? 340 : n === 5 ? 270 : 222)
    // Post 1080×1350: ~932px available for cards after header+CTA+footer.
    // n=4 gap=8: (932-24)/4=227 → 224; n=5 gap=6: (932-24)/5=181 → 178; n=6 gap=5: (932-25)/6=151 → 148.
    : (n === 1 ? 580 : n === 2 ? 370 : n === 3 ? 300 : n === 4 ? 224 : n === 5 ? 178 : 148);
  const cardGap = isStory
    ? (n <= 1 ? 0 : n === 2 ? 20 : n === 3 ? 16 : n === 4 ? 12 : n === 5 ? 10 : 8)
    : (n <= 1 ? 0 : n === 2 ? 16 : n === 3 ? 12 : n === 4 ? 8  : n === 5 ? 6  : 5);

  /* Chip heights */
  const chipH  = isStory ? 50 : 42;
  const chipPx = isStory ? 20 : 16;
  const chipFs = isStory ? 17 : 15;

  function MetaChip({ label, outline = false }: { label: string; outline?: boolean }) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center",
        height: chipH, paddingLeft: chipPx, paddingRight: chipPx,
        borderRadius: 999,
        border: outline ? `1.5px solid ${KP.accent}` : `1px solid ${KP.border}`,
        background: outline ? "transparent" : KP.surface,
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: SANS, fontWeight: 700, fontSize: chipFs,
          color: outline ? KP.accent : KP.text1,
          whiteSpace: "nowrap" as const,
        }}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div style={{
      width: w, height: h, background: KP.page, overflow: "hidden",
      boxSizing: "border-box", display: "flex", flexDirection: "column",
    }}>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{ padding: `${padT}px ${padX}px 0`, flexShrink: 0 }}>

        {/* Logo */}
        <BrandArea isStory={isStory} />

        {/* Serif title */}
        <div style={{
          marginTop: isStory ? 20 : 16,
          fontFamily: SERIF, fontWeight: 400, fontSize: titleFs,
          color: KP.text1, lineHeight: 1.0,
          letterSpacing: isStory ? "-0.03em" : "-0.025em",
        }}>
          {title}
        </div>

        {/* Meta chips row */}
        <div style={{
          marginTop: isStory ? 20 : 15,
          display: "flex", flexWrap: "wrap" as const, gap: isStory ? 10 : 8,
        }}>
          <MetaChip label={variant === "prematch" ? "PRE-MATCH" : "POST-MATCH"} outline />
          <MetaChip label={dateShort} />
          <MetaChip label={`${totalCoupons} coupons`} />
          {total > 1 && <MetaChip label={`${page + 1}/${total}`} />}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: KP.border, marginTop: isStory ? 18 : 14 }} />
      </div>

      {/* ── COUPON CARDS ───────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        padding: `${isStory ? 22 : 17}px ${padX}px 0`,
        display: "flex", flexDirection: "column", gap: cardGap,
      }}>
        {coupons.map((c, i) => (
          <CouponCard
            key={c.id}
            coupon={c}
            variant={variant}
            idx={startIdx + i}
            isStory={isStory}
            cardH={cardH}
            couponCount={n}
          />
        ))}
      </div>

      {/* Flexible spacer — absorbs remaining space between cards and CTA */}
      <div style={{ flex: 1 }} />

      {/* ── CTA BANNER ─────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, background: KP.footerBg,
        padding: `${isStory ? 26 : 20}px ${padX}px`,
        display: "flex", alignItems: "center", gap: isStory ? 20 : 16,
      }}>
        {/* Crown SVG icon */}
        <div style={{
          width: isStory ? 68 : 54, height: isStory ? 68 : 54,
          borderRadius: isStory ? 12 : 10,
          border: `1.5px solid ${KP.accent}`,
          background: "rgba(244,91,11,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width={isStory ? 32 : 26} height={isStory ? 32 : 26} viewBox="0 0 24 24" fill="none">
            <path d="M2 19h20M4 19l2-8 5 4 3-8 3 8 5-4 2 8"
              stroke={KP.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="3"  r="1.5" fill={KP.accent}/>
            <circle cx="3"  cy="11" r="1.5" fill={KP.accent}/>
            <circle cx="21" cy="11" r="1.5" fill={KP.accent}/>
          </svg>
        </div>
        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 26 : 20, color: "#FFFFFF", lineHeight: 1.25 }}>
            Detailed picks and analysis
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 26 : 20, color: KP.accent, lineHeight: 1.25 }}>
            exclusively for members.
          </div>
        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, background: KP.footerBg,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: `${isStory ? 14 : 11}px ${padX}px ${padB}px`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: isStory ? 8 : 6 }}>
          <svg width={isStory ? 20 : 16} height={isStory ? 20 : 16} viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="4.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4"/>
            <circle cx="17.2" cy="6.8" r="1.1" fill="rgba(255,255,255,0.7)"/>
          </svg>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 16 : 13, color: "rgba(255,255,255,0.75)" }}>
            @betcapitale
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: isStory ? 8 : 6 }}>
          <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: isStory ? 16 : 13, color: "rgba(255,255,255,0.5)" }}>
            betcapitale.com
          </span>
          <svg width={isStory ? 20 : 16} height={isStory ? 20 : 16} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4"/>
            <ellipse cx="12" cy="12" rx="3.8" ry="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            <line x1="3" y1="15" x2="21" y2="15" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* BP — Bilanço template local design tokens */
const BP = {
  page:        "#FFFFFF",
  surface:     "#FFFFFF",
  text1:       "#081426",
  text2:       "#6A717C",
  textLight:   "#969DA6",
  accent:      "#F45B0B",
  accentSoft:  "#FFF1E8",
  green:       "#0E9A58",
  red:         "#E33A34",
  border:      "#E9E4DE",
  shadow:      "0 12px 32px rgba(18,24,34,0.055)",
  footerBg:    "#06162E",
};

/* ═══════════════════════════════════════════════════════════════════
   TEMPLATE: BİLANÇO — premium editorial redesign
═══════════════════════════════════════════════════════════════════ */
interface BilançoProps {
  coupons: AC[]; date: string; fmt: Fmt; variant: Variant;
}
function BilançoTemplate({ coupons, date, fmt, variant }: BilançoProps) {
  const { w, h } = DIMS[fmt];
  const isStory    = fmt === "story";
  const isPrematch = variant === "prematch";

  const padX  = isStory ? 64 : 56;
  const padT  = isStory ? 52 : 42;
  const padB  = isStory ? 42 : 34;

  const padT_override = isStory ? 52 : 40;
  const titleFs   = isStory ? 78 : 64;
  const bigNumFs  = isStory ? 66 : 52;
  const gridH     = isStory ? 144 : 114;
  const gridValFs = isStory ? 36 : 28;
  const gridLabFs = isStory ? 13 : 11;
  const chipLabFs = isStory ? 13 : 10;
  const chipValFs = isStory ? 22 : 17;
  const chipH     = isStory ? 68 : 54;
  const rowNameFs = isStory ? 28 : 22;
  const rowSubFs  = isStory ? 15 : 12;
  const n = coupons.length;

  /* Dynamic coupon row card heights */
  const couponCardH = isStory
    ? (n === 1 ? 215 : n === 2 ? 196 : n === 3 ? 174 : 158)
    : (n === 1 ? 165 : n === 2 ? 150 : n === 3 ? 133 : 122);
  const couponCardGap = isStory ? 14 : 10;

  /* Calculations */
  const totalStake   = coupons.reduce((a, c) => a + c.stake, 0);
  const totalPotRet  = coupons.reduce((a, c) => a + c.stake * c.totalOdds, 0);
  const totalMatches = coupons.reduce((a, c) => a + c.matchCount, 0);
  const wonCoupons   = coupons.filter(c => c.status === "SETTLED" && c.result === "WON");
  const lostCoupons  = coupons.filter(c => c.status === "SETTLED" && c.result === "LOST");
  const wonReturn    = wonCoupons.reduce((a, c) => a + c.stake * c.totalOdds, 0);
  const settledStake = coupons.filter(c => c.status === "SETTLED").reduce((a, c) => a + c.stake, 0);
  const netResult    = wonReturn - settledStake;
  const potKar       = totalPotRet - totalStake;

  const leftLabel = isPrematch ? "POTENTIAL PROFIT" : "NET RESULT";
  const leftValue = isPrematch
    ? `€${fmt2(potKar)}`
    : `${netResult >= 0 ? "+" : ""}€${fmt2(netResult)}`;
  const leftColor = isPrematch
    ? BP.accent
    : netResult > 0 ? BP.green : netResult < 0 ? BP.red : BP.textLight;

  const title = isPrematch ? "Today's Plan" : "Today's Results";

  const gridStats = isPrematch
    ? [
        { label: "COUPONS",       value: `${coupons.length}`,    color: BP.text1 },
        { label: "TOTAL MATCHES", value: `${totalMatches}`,      color: BP.text1 },
        { label: "TOTAL STAKE",   value: `€${fmt2(totalStake)}`, color: BP.text1 },
      ]
    : [
        { label: "COUPONS",       value: `${coupons.length}`,    color: BP.text1 },
        { label: "WINNING BETS",  value: `${wonCoupons.length}`,  color: wonCoupons.length  > 0 ? BP.green : BP.text1 },
        { label: "LOSING BETS",   value: `${lostCoupons.length}`, color: lostCoupons.length > 0 ? BP.red   : BP.text1 },
        { label: "TOTAL STAKE",   value: `€${fmt2(totalStake)}`, color: BP.text1 },
      ];

  const dateStr = fmtDateFull(date);

  return (
    <div style={{
      width: w, height: h, background: BP.page, overflow: "hidden",
      boxSizing: "border-box", display: "flex", flexDirection: "column",
    }}>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{ padding: `${padT_override}px ${padX}px 0`, flexShrink: 0 }}>

        {/* Logo — kutu yok, doğrudan img, PNG iç boşluğu neg-marginTop ile telafi */}
        <img
          src="/bet-capitale-logo.png"
          alt="Bet Capitale"
          style={{
            width: isStory ? 300 : 240,
            height: "auto", objectFit: "contain", display: "block",
            marginTop: isStory ? -38 : -30,
          }}
        />

        {/* Ana başlık */}
        <div style={{
          marginTop: isStory ? 20 : 16,
          fontFamily: SERIF, fontWeight: 400, fontSize: titleFs,
          color: BP.text1, lineHeight: 0.97,
          letterSpacing: isStory ? "-0.03em" : "-0.025em",
        }}>
          {title}
        </div>

        {/* Durum pill + tarih — tek yatay satır */}
        <div style={{
          marginTop: isStory ? 28 : 22,
          display: "flex", alignItems: "center",
          gap: isStory ? 22 : 18, flexWrap: "wrap" as const,
        }}>
          {/* MAÇ ÖNCESİ pill */}
          <div style={{
            display: "inline-flex", alignItems: "center",
            height: isStory ? 50 : 42,
            paddingLeft: isStory ? 22 : 17, paddingRight: isStory ? 22 : 17,
            borderRadius: 999,
            border: `1.5px solid ${BP.accent}`,
            background: "#FFFCF9",
            gap: isStory ? 9 : 7,
            flexShrink: 0,
          }}>
            <svg width={isStory ? 16 : 13} height={isStory ? 16 : 13} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={BP.accent} strokeWidth="1.8"/>
              <path d="M12 7v5l3 3" stroke={BP.accent} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span style={{
              fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 17 : 15,
              color: BP.accent, whiteSpace: "nowrap" as const,
            }}>
              {isPrematch ? "PRE-MATCH" : "POST-MATCH"}
            </span>
          </div>
          {/* Tarih — düz metin, pill değil */}
          <div style={{
            display: "flex", alignItems: "center", gap: isStory ? 9 : 7,
          }}>
            <CalendarIcon sz={isStory ? 20 : 16} color={BP.text2} />
            <span style={{
              fontFamily: SANS, fontWeight: 600,
              fontSize: isStory ? 19 : 15, color: BP.text1,
              whiteSpace: "nowrap" as const,
            }}>
              {dateStr}
            </span>
          </div>
        </div>
      </div>

      {/* ── BUGÜNÜN PERFORMANSI SECTION ────────────────────────────── */}
      <div style={{
        padding: `${isStory ? 40 : 32}px ${padX}px 0`, flexShrink: 0,
      }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 20 : 16, color: BP.text1 }}>
          Today's Performance
        </div>
      </div>

      {/* Performans card — 2 cols, no black panel */}
      <div style={{
        margin: `${isStory ? 12 : 9}px ${padX}px 0`,
        background: BP.surface, border: `1px solid ${BP.border}`,
        borderRadius: isStory ? 22 : 17, boxShadow: BP.shadow,
        display: "flex", alignItems: "stretch", overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Left: POT. KÂR or NET SONUÇ */}
        <div style={{
          flex: 1, padding: `${isStory ? 26 : 20}px ${isStory ? 28 : 22}px`,
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <div style={{
            fontFamily: SANS, fontWeight: 600, fontSize: isStory ? 14 : 12,
            color: BP.text2, textTransform: "uppercase" as const,
            letterSpacing: "0.06em", marginBottom: isStory ? 8 : 6,
          }}>
            {leftLabel}
          </div>
          <div style={{
            fontFamily: SANS, fontWeight: 800, fontSize: bigNumFs,
            color: leftColor, letterSpacing: "-0.03em", lineHeight: 1,
            fontVariantNumeric: "tabular-nums lining-nums" as const,
            fontFeatureSettings: '"tnum" 1, "lnum" 1',
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
          }}>
            {leftValue}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: BP.border, flexShrink: 0 }} />

        {/* Right: POT. DÖNÜŞ (prematch) or decorative stacked cards (postmatch) */}
        {isPrematch ? (
          <div style={{
            flex: 1, background: "#FFF8F2",
            padding: `${isStory ? 26 : 20}px ${isStory ? 28 : 22}px`,
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <div style={{
              fontFamily: SANS, fontWeight: 600, fontSize: isStory ? 14 : 12,
              color: BP.text2, textTransform: "uppercase" as const,
              letterSpacing: "0.06em", marginBottom: isStory ? 8 : 6,
            }}>
              POT. RETURN
            </div>
            <div style={{
              fontFamily: SANS, fontWeight: 800, fontSize: bigNumFs,
              color: BP.text1, letterSpacing: "-0.03em", lineHeight: 1,
              fontVariantNumeric: "tabular-nums lining-nums" as const,
              fontFeatureSettings: '"tnum" 1, "lnum" 1',
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
            }}>
              €{fmt2(totalPotRet)}
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1, background: wonReturn > 0 ? "#F0FAF5" : "#FAFAFA",
            padding: `${isStory ? 26 : 20}px ${isStory ? 28 : 22}px`,
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <div style={{
              fontFamily: SANS, fontWeight: 600, fontSize: isStory ? 14 : 12,
              color: BP.text2, textTransform: "uppercase" as const,
              letterSpacing: "0.06em", marginBottom: isStory ? 8 : 6,
            }}>
              TOTAL RETURN
            </div>
            <div style={{
              fontFamily: SANS, fontWeight: 800, fontSize: bigNumFs,
              color: wonReturn > 0 ? BP.green : BP.text1,
              letterSpacing: "-0.03em", lineHeight: 1,
              fontVariantNumeric: "tabular-nums lining-nums" as const,
              fontFeatureSettings: '"tnum" 1, "lnum" 1',
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
            }}>
              €{fmt2(wonReturn)}
            </div>
          </div>
        )}
      </div>

      {/* ── İSTATİSTİK PANELİ ──────────────────────────────────────── */}
      <div style={{
        margin: `${isStory ? 10 : 8}px ${padX}px 0`,
        background: BP.surface, border: `1px solid ${BP.border}`,
        borderRadius: isStory ? 22 : 17, boxShadow: BP.shadow,
        height: gridH,
        display: "grid", gridTemplateColumns: `repeat(${gridStats.length},1fr)`,
        overflow: "hidden", flexShrink: 0,
      }}>
        {gridStats.map((st, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            borderRight: i < gridStats.length - 1 ? `1px solid ${BP.border}` : "none",
            padding: `${isStory ? 10 : 7}px ${isStory ? 5 : 4}px`,
            gap: isStory ? 5 : 4,
          }}>
            <div style={{
              fontFamily: SANS, fontWeight: 600, fontSize: gridLabFs, color: BP.text2,
              textTransform: "uppercase" as const, letterSpacing: "0.05em",
              textAlign: "center" as const, lineHeight: 1.2,
            }}>
              {st.label}
            </div>
            <div style={{
              fontFamily: SANS, fontWeight: 800, fontSize: gridValFs,
              color: st.color, letterSpacing: -0.4,
              fontVariantNumeric: "tabular-nums lining-nums" as const,
              fontFeatureSettings: '"tnum" 1, "lnum" 1',
              width: "100%", textAlign: "center" as const,
              whiteSpace: "nowrap" as const,
            }}>
              {st.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── KUPON ÖZETİ SECTION ────────────────────────────────────── */}
      <div style={{ padding: `${isStory ? 16 : 12}px ${padX}px 0`, flexShrink: 0 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 20 : 16, color: BP.text1 }}>
          Coupon Summary
        </div>
      </div>

      {/* Individual coupon cards */}
      <div style={{
        margin: `${isStory ? 10 : 8}px ${padX}px 0`,
        display: "flex", flexDirection: "column", gap: couponCardGap,
        flexShrink: 0,
      }}>
        {coupons.map((c) => {
          const ret       = c.stake * c.totalOdds;
          const isW       = c.status === "SETTLED" && c.result === "WON";
          const isL       = c.status === "SETTLED" && c.result === "LOST";
          const netVal    = isPrematch
            ? `€${fmt2(ret)}`
            : (isW ? `+€${fmt2(ret - c.stake)}` : isL ? `-€${fmt2(c.stake)}` : `€${fmt2(ret)}`);
          const netColor  = isPrematch ? BP.accent : (isW ? BP.green : isL ? BP.red : BP.textLight);
          const dateLabel = new Date(c.date + "T12:00:00").toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          });
          const kickoffStr = c.placedAtTime
            ? `${dateLabel} • ${c.placedAtTime}`
            : dateLabel;
          const chips = [
            { label: "STAKE",                                value: `€${fmt2(c.stake)}`,          color: BP.text1 },
            { label: "ODDS",                                 value: `×${c.totalOdds.toFixed(2)}`,  color: BP.text1 },
            { label: "MATCHES",                              value: `${c.matchCount}`,              color: BP.text1 },
            { label: isPrematch ? "POT. RETURN" : "NET",     value: netVal,                         color: netColor },
          ];
          const badgeColor = isPrematch ? BP.accent : (isW ? BP.green : isL ? BP.red : BP.textLight);
          const badgeLabel = isPrematch ? "ACTIVE" : (isW ? "WON" : isL ? "LOST" : "PENDING");

          return (
            <div key={c.id} style={{
              height: couponCardH, background: BP.surface,
              border: `1px solid ${BP.border}`,
              borderRadius: isStory ? 20 : 16, boxShadow: BP.shadow,
              overflow: "hidden", display: "flex", flexDirection: "column",
            }}>
              {/* Card header row */}
              <div style={{
                flex: 1, display: "flex", alignItems: "center",
                padding: `0 ${isStory ? 22 : 18}px`,
                gap: isStory ? 14 : 11,
              }}>
                {/* Small turuncu daire rozet */}
                <div style={{
                  width: isStory ? 36 : 29, height: isStory ? 36 : 29,
                  borderRadius: "50%", background: BP.accentSoft,
                  border: `1.5px solid #F4C7AA`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width={isStory ? 16 : 13} height={isStory ? 16 : 13} viewBox="0 0 24 24" fill="none">
                    <path d="M2 9a2 2 0 1 1 0-4h20a2 2 0 1 1 0 4v6a2 2 0 1 1 0 4H2a2 2 0 1 1 0-4V9z" stroke={BP.accent} strokeWidth="1.6"/>
                    <line x1="9" y1="5" x2="9" y2="19" stroke={BP.accent} strokeWidth="1.4" strokeDasharray="3 2"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Stake label */}
                  <div style={{
                    fontFamily: SANS, fontWeight: 700, fontSize: rowNameFs,
                    color: BP.text1, lineHeight: 1.1,
                    overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis",
                  }}>
                    {c.label}
                  </div>
                  {/* Kickoff date */}
                  {kickoffStr ? (
                    <div style={{
                      fontFamily: SANS, fontWeight: 400, fontSize: rowSubFs,
                      color: BP.text2, marginTop: isStory ? 4 : 3,
                    }}>
                      {kickoffStr}
                    </div>
                  ) : null}
                </div>
                {/* Status badge */}
                <div style={{ display: "flex", alignItems: "center", gap: isStory ? 6 : 5, flexShrink: 0 }}>
                  <div style={{ width: isStory ? 7 : 6, height: isStory ? 7 : 6, borderRadius: "50%", background: badgeColor }} />
                  <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: isStory ? 15 : 12, color: badgeColor }}>
                    {badgeLabel}
                  </span>
                </div>
              </div>

              {/* 4-chip metric panel */}
              <div style={{
                margin: `0 ${isStory ? 22 : 18}px ${isStory ? 18 : 14}px`,
                border: `1px solid ${BP.border}`, borderRadius: isStory ? 14 : 11,
                display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                height: chipH, overflow: "hidden", flexShrink: 0,
                background: "#FFFEFC",
              }}>
                {chips.map((ch, ci) => (
                  <div key={ci} style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    borderRight: ci < 3 ? `1px solid ${BP.border}` : "none",
                    gap: isStory ? 4 : 3,
                    background: ci === 3
                      ? (ch.color === BP.accent ? "#FFF5EF" : ch.color === BP.green ? "#F0FAF5" : ch.color === BP.red ? "#FEF2F2" : "transparent")
                      : "transparent",
                  }}>
                    <div style={{
                      fontFamily: SANS, fontWeight: 600, fontSize: chipLabFs,
                      color: BP.text2, textTransform: "uppercase" as const,
                      letterSpacing: "0.05em", lineHeight: 1, textAlign: "center" as const,
                    }}>
                      {ch.label}
                    </div>
                    <div style={{
                      fontFamily: SANS, fontWeight: 800, fontSize: chipValFs,
                      color: ch.color, letterSpacing: "-0.03em", lineHeight: 1,
                      fontVariantNumeric: "tabular-nums lining-nums" as const,
                      fontFeatureSettings: '"tnum" 1, "lnum" 1',
                      width: "100%", textAlign: "center" as const,
                      whiteSpace: "nowrap" as const,
                    }}>
                      {ch.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Flexible spacer */}
      <div style={{ flex: 1 }} />

      {/* ── ARŞİV KARTI + FOOTER ───────────────────────────────────── */}
      <div style={{ flexShrink: 0, padding: `0 ${padX}px` }}>

        {/* Archive card — inline, no InfoCard component */}
        <div style={{
          background: BP.surface, border: `1px solid ${BP.border}`,
          borderRadius: isStory ? 20 : 16, boxShadow: BP.shadow,
          padding: `${isStory ? 22 : 17}px ${isStory ? 24 : 19}px`,
          display: "flex", alignItems: "center", gap: isStory ? 16 : 13,
        }}>
          <div style={{
            width: isStory ? 42 : 34, height: isStory ? 42 : 34, borderRadius: "50%",
            background: BP.accentSoft, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width={isStory ? 20 : 16} height={isStory ? 20 : 16} viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke={BP.accent} strokeWidth="1.8"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={BP.accent} strokeWidth="1.8"/>
              <circle cx="12" cy="16" r="1.5" fill={BP.accent}/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 20 : 16, color: BP.text1, lineHeight: 1.2 }}>
              Results are archived, never deleted.
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: isStory ? 14 : 12, color: BP.text2, lineHeight: 1.3, marginTop: isStory ? 3 : 2 }}>
              Your full bet history is always safe.
            </div>
          </div>
        </div>

        {/* Footer divider */}
        <div style={{ height: 1, background: BP.border, margin: `${isStory ? 16 : 12}px 0 ${isStory ? 14 : 11}px` }} />

        {/* Footer — no centre star */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: padB }}>
          <div style={{ display: "flex", alignItems: "center", gap: isStory ? 8 : 6 }}>
            <svg width={isStory ? 20 : 16} height={isStory ? 20 : 16} viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="6" stroke={BP.text1} strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="4.5" stroke={BP.text1} strokeWidth="1.4"/>
              <circle cx="17.2" cy="6.8" r="1.1" fill={BP.text1}/>
            </svg>
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: isStory ? 16 : 13, color: BP.text1 }}>
              @betcapitale
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: isStory ? 8 : 6 }}>
            <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: isStory ? 16 : 13, color: BP.text2 }}>
              betcapitale.com
            </span>
            <svg width={isStory ? 20 : 16} height={isStory ? 20 : 16} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={BP.text2} strokeWidth="1.4"/>
              <ellipse cx="12" cy="12" rx="3.8" ry="9" stroke={BP.text2} strokeWidth="1.2"/>
              <line x1="3" y1="9" x2="21" y2="9" stroke={BP.text2} strokeWidth="1.2"/>
              <line x1="3" y1="15" x2="21" y2="15" stroke={BP.text2} strokeWidth="1.2"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PREVIEW WRAPPER ────────────────────────────────────────────── */
/* SPEC: Only the outer wrapper scales. Export node must NOT have any transform. */
/* ═══════════════════════════════════════════════════════════════════
   COVER TEMPLATE  (6 styles — all data auto-filled from system)
═══════════════════════════════════════════════════════════════════ */
function coverDayName(iso: string) {
  try { return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long" }); }
  catch { return ""; }
}

function CoverTemplate({
  matches, coupons, date, fmt, variant, coverStyle,
}: {
  matches: TM[]; coupons: AC[]; date: string; fmt: Fmt;
  variant: Variant; coverStyle: CoverStyle;
}) {
  const isStory    = fmt === "story";
  const W          = DIMS[fmt].w;
  const H          = DIMS[fmt].h;
  const matchCount  = matches.length;
  const couponCount = coupons.length;
  const dateLabel   = fmtDate(date);
  const dayLabel    = coverDayName(date);
  const varLabel    = variant === "prematch" ? "PRE-MATCH" : "RESULTS";
  const issueNum    = matchCount + couponCount;
  const px          = isStory ? 72 : 60;
  const pyTop       = isStory ? 60 : 44;
  const pyBot       = isStory ? 64 : 48;

  const wrap: React.CSSProperties = {
    width: W, height: H, position: "relative", overflow: "hidden",
    fontFamily: SANS, userSelect: "none", boxSizing: "border-box",
  };

  /* ── Cover 03 — Orbital Hero ───────────────────────────────────── */
  if (coverStyle === "cover03") {
    const C3 = { orange: "#ff4b00", ink: "#08111c", muted: "#68707c", line: "#d8d8d8" };
    const sv = (post: number) => isStory ? Math.round(post * 1920 / 1350) : post;

    const brandTop     = sv(58);
    const brandFontSz  = sv(28);
    const logoW        = sv(43);  const logoH = sv(52);
    const orbitTop     = sv(112);
    const orbitSize    = sv(790);
    const circleSize   = sv(565);
    const heroLogoW    = sv(76);  const heroLogoH = sv(92);
    const heroTitleSz  = sv(78);
    const heroLineMt   = sv(58);
    const statsTop     = sv(850); const statsH = sv(160);
    const statIconSz   = sv(49);
    const statNumSz    = sv(52);
    const statLblSz    = sv(22);
    const divH3        = sv(106);
    const membTop      = sv(1055); const membH = sv(150);
    const lockW        = sv(46);  const lockH = sv(58);
    const membTitleSz  = sv(24);
    const membSubSz    = sv(20);
    const footerBot    = sv(48);
    const swipeSz      = sv(20);

    const c3date = (() => {
      try {
        const d = new Date(date + "T00:00:00");
        return {
          day:   d.getDate().toString(),
          month: d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }).toUpperCase(),
        };
      } catch { return { day: "—", month: date.toUpperCase() }; }
    })();

    const BrandMark = ({ sz, col }: { sz: number; col: string }) => (
      <svg viewBox="0 0 80 96" style={{ width: sz * 80 / 96, height: sz, display: "block", color: col }}
        fill="none" stroke="currentColor" strokeWidth="7" strokeLinejoin="miter" aria-hidden="true">
        <path d="M10 27 40 5l30 22H10Z" />
        <path d="M18 36h44" strokeLinejoin="round" />
        <path d="M22 40v33l10 8V40M48 40v41l10-8V40M40 40v48" />
      </svg>
    );

    const orbitOpacities = [1, 0.8, 0.55, 0.28];
    const orbitSizes     = [sv(690), sv(735), sv(780), sv(830)];

    return (
      <div style={{
        ...wrap,
        background: `radial-gradient(circle at 50% 46%, rgba(255,255,255,.96) 0 40%, rgba(250,250,249,.98) 74%), #fbfbfa`,
        overflow: "hidden",
      }}>
        {/* Noise texture overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.18,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='130'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E")` }} />

        {/* BC icon watermark — centered behind orbits */}
        <img
          src="/bc-icon.png"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -48%)",
            width: isStory ? 880 : 620,
            height: isStory ? 880 : 620,
            opacity: 0.055,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Brand header — centered */}
        <div style={{ position: "absolute", top: brandTop, left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: sv(14), whiteSpace: "nowrap",
          fontFamily: COVER03_CONDENSED, fontSize: brandFontSz, fontWeight: 600,
          letterSpacing: sv(6) + "px", color: C3.ink, zIndex: 2 }}>
          <span>BET</span>
          <img src="/bc-icon.png" alt="" style={{ width: sv(36), height: "auto", objectFit: "contain", display: "block" }} />
          <span>CAPITALE</span>
        </div>

        {/* Hero orbit container */}
        <div style={{ position: "absolute", top: orbitTop, left: "50%", transform: "translateX(-50%)",
          width: orbitSize, height: orbitSize, zIndex: 1 }}>
          {/* Orbit rings */}
          {orbitSizes.map((sz, i) => (
            <div key={i} style={{
              position: "absolute", left: "50%", top: "50%",
              transform: "translate(-50%, -50%)",
              width: sz, height: sz, borderRadius: "50%",
              border: `1px solid rgba(255,75,0,.32)`,
              opacity: orbitOpacities[i],
            }} />
          ))}

          {/* Hero circle */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: circleSize, height: circleSize, borderRadius: "50%",
            background: `radial-gradient(circle at 63% 30%, rgba(255,113,31,.55), transparent 42%),
                         linear-gradient(145deg, #ff3e00, #ff5b00 56%, #fb4500)`,
            boxShadow: `0 ${sv(20)}px ${sv(24)}px rgba(42,22,10,.14)`,
            color: "white",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ marginTop: sv(-20), marginBottom: sv(32) }}>
              <img src="/bc-icon.png" alt="" style={{
                width: sv(118), height: "auto", objectFit: "contain", display: "block",
                filter: "brightness(0) invert(1)",
              }} />
            </div>
            <div style={{ fontFamily: COVER03_CONDENSED, fontSize: heroTitleSz,
              lineHeight: 0.95, letterSpacing: "1px", fontWeight: 700 }}>
              PRE-MATCH
            </div>
            <div style={{ width: sv(106), height: 2, background: "white", marginTop: heroLineMt }} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ position: "absolute", left: sv(115), right: sv(115), top: statsTop, height: statsH,
          display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
          alignItems: "center", zIndex: 2 }}>

          {/* MATCHES */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: sv(8) }}>
            <svg viewBox="0 0 64 64" style={{ width: statIconSz, height: statIconSz }} fill="none"
              stroke={C3.ink} strokeWidth="4" aria-hidden="true">
              <rect x="10" y="14" width="44" height="40" rx="4" />
              <path d="M10 25h44M20 9v12M44 9v12" strokeLinecap="round" />
              <circle cx="21" cy="34" r="2.5" fill={C3.ink} stroke="none" />
              <circle cx="32" cy="34" r="2.5" fill={C3.ink} stroke="none" />
              <circle cx="43" cy="34" r="2.5" fill={C3.ink} stroke="none" />
              <circle cx="21" cy="44" r="2.5" fill={C3.ink} stroke="none" />
              <circle cx="32" cy="44" r="2.5" fill={C3.ink} stroke="none" />
              <circle cx="43" cy="44" r="2.5" fill={C3.ink} stroke="none" />
            </svg>
            <div style={{ fontFamily: COVER01_SANS, fontSize: statNumSz, fontWeight: 700,
              lineHeight: 1, color: C3.ink }}>{matchCount}</div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: statLblSz, fontWeight: 600,
              color: C3.ink }}>MATCHES</div>
          </div>

          {/* divider */}
          <div style={{ height: divH3, background: C3.line, width: 1 }} />

          {/* COUPONS */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: sv(8) }}>
            <svg viewBox="0 0 64 64" style={{ width: statIconSz, height: statIconSz }} fill="none"
              stroke={C3.ink} strokeWidth="4" aria-hidden="true">
              <path d="M10 48 25 32l10 9 18-22" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M43 19h10v10" stroke={C3.orange} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="48" r="4" fill={C3.ink} stroke="none" />
              <circle cx="25" cy="32" r="4" fill={C3.ink} stroke="none" />
              <circle cx="35" cy="41" r="4" fill={C3.ink} stroke="none" />
            </svg>
            <div style={{ fontFamily: COVER01_SANS, fontSize: statNumSz, fontWeight: 700,
              lineHeight: 1, color: C3.ink }}>{couponCount}</div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: statLblSz, fontWeight: 600,
              color: C3.ink }}>COUPONS</div>
          </div>

          {/* divider */}
          <div style={{ height: divH3, background: C3.line, width: 1 }} />

          {/* DATE */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: sv(8) }}>
            <svg viewBox="0 0 64 64" style={{ width: statIconSz, height: statIconSz }} fill="none"
              stroke={C3.ink} strokeWidth="4" aria-hidden="true">
              <circle cx="29" cy="35" r="20" />
              <circle cx="29" cy="35" r="11" />
              <circle cx="29" cy="35" r="3" fill={C3.ink} stroke="none" />
              <path d="M32 32 50 14" stroke={C3.orange} strokeLinecap="round" />
              <path d="M42 14h8v8" stroke={C3.orange} strokeLinecap="round" />
            </svg>
            <div style={{ fontFamily: COVER01_SANS, fontSize: statNumSz, fontWeight: 700,
              lineHeight: 1, color: C3.ink }}>{c3date.day}</div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: statLblSz, fontWeight: 600,
              color: C3.ink }}>{c3date.month}</div>
          </div>
        </div>

        {/* Members strip */}
        <div style={{ position: "absolute", left: sv(112), right: sv(112), top: membTop, height: membH,
          borderTop: `1px solid #cfcfcf`, borderBottom: `1px solid #cfcfcf`,
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: sv(28), zIndex: 2 }}>
          <svg viewBox="0 0 48 58" style={{ width: lockW, height: lockH, color: C3.orange, flexShrink: 0 }}
            fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" aria-hidden="true">
            <path d="M11 23v-7a13 13 0 0 1 26 0v7" />
            <rect x="6" y="23" width="36" height="31" rx="4" />
            <circle cx="24" cy="37" r="3" fill="currentColor" stroke="none" />
            <path d="M24 40v6" />
          </svg>
          <div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: membTitleSz, fontWeight: 600,
              letterSpacing: sv(5) + "px", color: C3.ink, marginBottom: sv(10) }}>
              EXCLUSIVELY FOR{" "}<span style={{ color: C3.orange }}>MEMBERS</span>
            </div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: membSubSz,
              color: C3.muted, letterSpacing: sv(2) + "px" }}>
              Premium Picks. Maximum Focus.
            </div>
          </div>
        </div>

        {/* Footer swipe */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: footerBot,
          display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
          <div style={{ fontFamily: COVER01_SANS, fontSize: swipeSz, fontWeight: 600,
            letterSpacing: sv(4) + "px", color: C3.ink, marginBottom: sv(24) }}>
            SWIPE TO VIEW{" "}<span style={{ color: C3.orange }}>TODAY'S PICKS</span>
          </div>
          {/* Arrow: dot + line + arrowhead */}
          <div style={{ position: "relative", width: sv(290), height: sv(34) }}>
            <div style={{ position: "absolute", left: sv(12), right: sv(15), top: "50%",
              transform: "translateY(-50%)", height: 2, background: C3.ink }} />
            <div style={{ position: "absolute", left: sv(5), top: "50%",
              transform: "translateY(-50%)",
              width: sv(14), height: sv(14), borderRadius: "50%", background: C3.ink }} />
            <div style={{ position: "absolute", right: sv(6), top: "50%",
              width: sv(16), height: sv(16),
              borderTop: `2px solid ${C3.ink}`, borderRight: `2px solid ${C3.ink}`,
              transform: "translateY(-50%) rotate(45deg)" }} />
          </div>
        </div>
      </div>
    );
  }

  /* ── End Cover — Results Dark ───────────────────────────────────── */
  if (coverStyle === "endcover") {
    const sv = (post: number) => isStory ? Math.round(post * 1920 / 1350) : post;
    const orange = "#FF5A00";
    const settledCoupons = coupons.filter(c => c.status === "SETTLED");
    const totalStake  = settledCoupons.reduce((a, c) => a + c.stake, 0);
    const totalReturn = settledCoupons.reduce((a, c) => a + (c.result === "WON" ? (c.returnAmount ?? 0) : 0), 0);
    const profit      = totalReturn - totalStake;

    const splitMoney = (val: number) => {
      const s = Math.abs(val).toFixed(2).split(".");
      return { sign: val < 0 ? "-" : "+", main: s[0], decimal: "." + s[1] };
    };
    const p = splitMoney(profit);
    const r = splitMoney(totalReturn);

    const CornerLight = ({ pos }: { pos: "tr" | "bl" }) => (
      <div style={{
        position: "absolute",
        width: sv(10), height: sv(10), borderRadius: "50%",
        background: "#FFF4D6",
        boxShadow: `0 0 6px #FFFFFF, 0 0 12px #FF8A1E, 0 0 20px #FF5A00`,
        ...(pos === "tr" ? { right: sv(-5), top: sv(-5) } : { left: sv(-5), bottom: sv(-5) }),
      }} />
    );

    return (
      <div style={{ ...wrap,
        background: `radial-gradient(circle at 65% 18%,rgba(255,255,255,0.035),transparent 36%),
                     linear-gradient(115deg,#020202 0%,#060708 50%,#0A0C0E 100%)`,
        color: "#FFFFFF",
      }}>
        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.13,
          backgroundImage: `repeating-linear-gradient(0deg,rgba(255,255,255,.016) 0,rgba(255,255,255,.016) 1px,transparent 1px,transparent ${sv(4)}px),
                            repeating-linear-gradient(90deg,rgba(255,255,255,.011) 0,rgba(255,255,255,.011) 1px,transparent 1px,transparent ${sv(5)}px)`,
        }} />

        {/* Brand logo */}
        <div style={{ position: "absolute", left: sv(53), top: sv(48), zIndex: 4,
          display: "flex", alignItems: "center", gap: sv(20) }}>
          <img src="/bc-icon.png" alt=""
            style={{ display: "block", width: sv(56), height: "auto", objectFit: "contain" }} />
          <span style={{
            fontFamily: ENDCOVER_SERIF, fontWeight: 500,
            fontSize: sv(36), letterSpacing: sv(5) + "px",
            color: "#FFFFFF",
          }}>BET CAPITALE</span>
        </div>

        {/* Main card — TODAY'S RESULTS + PROFIT */}
        <div style={{ position: "absolute", left: sv(49), top: sv(198), width: sv(552), height: sv(752),
          border: `1.6px solid rgba(255,90,0,0.95)`, borderRadius: sv(10),
          background: "rgba(0,0,0,.09)", boxShadow: "inset 0 0 28px rgba(255,90,0,.015)" }}>
          <CornerLight pos="tr" /><CornerLight pos="bl" />

          {/* Title */}
          <div style={{ position: "absolute", left: sv(57), top: sv(101) }}>
            <div style={{ fontFamily: COVER01_SERIF, fontWeight: 500, lineHeight: 0.92, letterSpacing: sv(-2) + "px" }}>
              <div style={{ fontSize: sv(81), display: "block" }}>TODAY'S</div>
              <div style={{ fontSize: sv(81), color: orange, marginTop: sv(10) }}>RESULTS</div>
            </div>
            <div style={{ width: sv(71), height: 2.1, background: orange, marginTop: sv(38) }} />
          </div>

          {/* Profit label */}
          <div style={{ position: "absolute", left: sv(57), top: sv(410) }}>
            <div style={{ fontFamily: COVER01_SANS, fontSize: sv(22), letterSpacing: "0.24em",
              color: orange, fontWeight: 600 }}>PROFIT</div>
            <div style={{ width: sv(69), height: 2.1, marginTop: sv(20),
              background: "#FF5A00", opacity: 0.9 }} />
          </div>

          {/* Profit amount */}
          <div style={{ position: "absolute", left: sv(56), top: sv(527),
            fontFamily: '"Plus Jakarta Sans", sans-serif', whiteSpace: "nowrap", letterSpacing: sv(-6) + "px", lineHeight: 0.82 }}>
            <span style={{ fontSize: sv(90), marginRight: sv(4), fontFamily: COVER01_SERIF, fontWeight: 500, verticalAlign: "baseline", color: "#FFFFFF", textShadow: "0 0 0.35px rgba(255,255,255,0.9)" }}>€</span>
            <span style={{ fontSize: sv(147), fontWeight: 400, fontFamily: '"Plus Jakarta Sans", sans-serif', color: "#FF5A00", textShadow: "none", fontFeatureSettings: '"lnum" 1, "tnum" 1, "kern" 1' }}>{p.sign}</span>
            <span style={{ fontSize: sv(147), fontWeight: 200, fontFamily: '"Plus Jakarta Sans", sans-serif', color: "#FFFFFF", textShadow: "0 0 0.35px rgba(255,255,255,0.9)", fontFeatureSettings: '"lnum" 1, "tnum" 1, "kern" 1' }}>{p.main}</span>
            <span style={{ fontSize: sv(74), letterSpacing: sv(-4) + "px", fontWeight: 200, fontFamily: '"Plus Jakarta Sans", sans-serif', color: "#FFFFFF", textShadow: "0 0 0.35px rgba(255,255,255,0.9)", fontFeatureSettings: '"lnum" 1, "tnum" 1, "kern" 1' }}>{p.decimal}</span>
          </div>
        </div>

        {/* Return card — TOTAL RETURN */}
        <div style={{ position: "absolute", left: sv(657), top: sv(526), width: sv(359), height: sv(424),
          border: `1.6px solid rgba(255,90,0,0.95)`, borderRadius: sv(5),
          background: "rgba(0,0,0,.09)", boxShadow: "inset 0 0 28px rgba(255,90,0,.015)" }}>
          <CornerLight pos="tr" /><CornerLight pos="bl" />

          {/* Return label */}
          <div style={{ position: "absolute", left: sv(53), top: sv(100) }}>
            <div style={{ fontFamily: COVER01_SANS, fontSize: sv(22), letterSpacing: "0.24em",
              color: orange, fontWeight: 600, lineHeight: 1.45 }}>
              <div>TOTAL</div>
              <div>RETURN</div>
            </div>
            <div style={{ width: sv(69), height: 2.1, marginTop: sv(20),
              background: "#FF5A00", opacity: 0.9 }} />
          </div>

          {/* Return amount */}
          <div style={{ position: "absolute", left: sv(53), top: sv(235),
            fontFamily: '"Plus Jakarta Sans", sans-serif', whiteSpace: "nowrap", letterSpacing: sv(-3) + "px", lineHeight: 0.82 }}>
            <span style={{ fontSize: sv(62), marginRight: sv(3), fontFamily: COVER01_SERIF, fontWeight: 500, verticalAlign: "baseline", color: "#FFFFFF", textShadow: "0 0 0.35px rgba(255,255,255,0.9)" }}>€</span>
            <span style={{ fontSize: sv(90), fontWeight: 200, fontFamily: '"Plus Jakarta Sans", sans-serif', color: "#FFFFFF", textShadow: "0 0 0.35px rgba(255,255,255,0.9)", fontFeatureSettings: '"lnum" 1, "tnum" 1, "kern" 1' }}>{r.main}</span>
            <span style={{ fontSize: sv(47), letterSpacing: sv(-3) + "px", fontWeight: 200, fontFamily: '"Plus Jakarta Sans", sans-serif', color: "#FFFFFF", textShadow: "0 0 0.35px rgba(255,255,255,0.9)", fontFeatureSettings: '"lnum" 1, "tnum" 1, "kern" 1' }}>{r.decimal}</span>
          </div>
        </div>

        {/* CTA card */}
        <div style={{ position: "absolute", left: sv(48), top: sv(1038), width: sv(970), height: sv(196),
          border: `1.6px solid rgba(255,90,0,0.95)`, borderRadius: sv(6),
          background: "rgba(0,0,0,.09)", boxShadow: "inset 0 0 28px rgba(255,90,0,.015)",
          display: "flex", alignItems: "center" }}>
          <CornerLight pos="tr" /><CornerLight pos="bl" />

          {/* Circle arrow */}
          <div style={{ position: "relative", width: sv(98), height: sv(98),
            border: `2.1px solid ${orange}`, borderRadius: "50%",
            marginLeft: sv(48), flexShrink: 0 }}>
            <div style={{ position: "absolute", left: sv(29), top: sv(47), width: sv(39), height: 2.1, background: orange }} />
            <div style={{ position: "absolute", right: sv(25), top: sv(36),
              width: sv(18), height: sv(18),
              borderTop: `2.1px solid ${orange}`, borderRight: `2.1px solid ${orange}`,
              transform: "rotate(45deg)" }} />
          </div>

          {/* CTA copy */}
          <div style={{ marginLeft: sv(39) }}>
            <div style={{ fontFamily: COVER01_SERIF, fontSize: sv(47), fontWeight: 500, letterSpacing: "1px", whiteSpace: "nowrap", color: "#FFFFFF" }}>
              HOW <span style={{ color: "#FF6A00" }}>DID WE DO</span> IT?
            </div>
            <div style={{ marginTop: sv(11), color: "#C6C8CD", fontFamily: COVER01_SANS,
              fontSize: sv(20), letterSpacing: sv(3) + "px", fontWeight: 400 }}>
              Swipe to see today's picks &amp; analysis
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── End Cover 2 — Centred Open Layout (Cover 04) ───────────────── */
  if (coverStyle === "endcover2") {
    const orange = "#f25a06";
    const settledCoupons = coupons.filter(c => c.status === "SETTLED");
    const totalStake  = settledCoupons.reduce((a, c) => a + c.stake, 0);
    /* Sum returnAmount for ALL settled coupons — covers WON and VOID/refund cases */
    const totalReturn = settledCoupons.reduce((a, c) => a + (c.returnAmount ?? 0), 0);
    const profit      = totalReturn - totalStake;
    const splitMoney  = (val: number) => {
      const s = Math.abs(val).toFixed(2).split(".");
      return { sign: val < 0 ? "-" : "+", main: s[0], decimal: "." + s[1] };
    };
    const p = splitMoney(profit);
    const r = splitMoney(totalReturn);

    /* Always render at post dimensions (1080×1350) — no story variant */
    const postWrap = { width: 1080, height: 1350, position: "relative" as const, overflow: "hidden" };

    return (
      <div style={{ ...postWrap,
        background: `radial-gradient(circle at 50% 34%,rgba(255,255,255,.024),transparent 34%),
                     radial-gradient(circle at 50% 67%,rgba(255,92,0,.022),transparent 36%),
                     linear-gradient(112deg,#030303 0%,#080808 54%,#101010 100%)`,
        color: "#f8f8f5",
      }}>
        {/* Grain texture */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.13,
          backgroundImage: `repeating-linear-gradient(0deg,rgba(255,255,255,.014) 0,rgba(255,255,255,.014) 1px,transparent 1px,transparent 4px),
                            repeating-linear-gradient(90deg,rgba(255,255,255,.010) 0,rgba(255,255,255,.010) 1px,transparent 1px,transparent 5px)`,
        }} />

        {/* Ambient light */}
        <div style={{ position: "absolute", left: 280, top: 90, width: 520, height: 1120,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle,rgba(255,255,255,.014),transparent 67%)",
          filter: "blur(62px)",
        }} />

        {/* Logo reserved area — centred, bc-icon + wordmark */}
        <div style={{ position: "absolute", left: "50%", top: 106,
          transform: "translateX(-50%)", width: 320, height: 150,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <img src="/bc-icon.png" alt=""
            style={{ display: "block", width: 56, height: "auto", objectFit: "contain" }} />
          <span style={{ fontFamily: ENDCOVER_SERIF, fontWeight: 400, fontSize: 28,
            letterSpacing: 5, color: "#f8f8f5", whiteSpace: "nowrap" }}>BET CAPITALE</span>
        </div>

        {/* Top accent — glowing dot + horizontal rule */}
        <div style={{ position: "absolute", top: 321, left: "50%", transform: "translateX(-50%)",
          width: 64, height: 14 }}>
          {/* horizontal line */}
          <div style={{ position: "absolute", left: 0, top: 6, width: 64, height: 1,
            background: `linear-gradient(90deg,transparent,${orange} 30%,${orange} 70%,transparent)` }} />
          {/* glowing dot */}
          <div style={{ position: "absolute", left: "50%", top: 3, width: 6, height: 6,
            transform: "translateX(-50%)", borderRadius: "50%",
            background: "#fff0cf",
            boxShadow: "0 0 8px #ff8a20, 0 0 16px #ff5a00" }} />
        </div>

        {/* Title block — TODAY'S / RESULTS */}
        <div style={{ position: "absolute", left: "50%", top: 386,
          transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ fontFamily: ENDCOVER_SERIF, fontWeight: 400,
            lineHeight: 0.93, letterSpacing: 7 }}>
            <div style={{ fontSize: 86, display: "block", whiteSpace: "nowrap" }}>TODAY'S</div>
            <div style={{ fontSize: 86, fontWeight: 400, color: orange,
              marginTop: 20, display: "block", whiteSpace: "nowrap" }}>RESULTS</div>
          </div>
        </div>

        {/* Results grid — PROFIT | divider | TOTAL RETURN */}
        <div style={{ position: "absolute", left: 78, right: 78, top: 658, height: 374,
          display: "grid", gridTemplateColumns: "1fr 1px 1fr", columnGap: 68,
          alignItems: "start" }}>

          {/* PROFIT card */}
          <div style={{ textAlign: "center", paddingTop: 19 }}>
            <div style={{ color: orange, fontSize: 22, letterSpacing: 7,
              fontWeight: 500, fontFamily: COVER01_SANS, whiteSpace: "nowrap" }}>PROFIT</div>
            <div style={{ width: 100, height: 1, margin: "22px auto 0",
              background: `linear-gradient(90deg,transparent,${orange} 25%,${orange} 75%,transparent)` }} />
            <div style={{ marginTop: 60, fontFamily: ENDCOVER_SERIF, lineHeight: 0.82,
              letterSpacing: -6, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 74, marginRight: 7,
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>€</span>
              <span style={{ fontSize: 133, fontWeight: 300, fontFamily: SANS }}>{p.sign}</span><span style={{ fontSize: 133 }}>{p.main}</span>
              <span style={{ fontSize: 67, letterSpacing: -4 }}>{p.decimal}</span>
            </div>
          </div>

          {/* Vertical divider */}
          <div style={{ position: "relative", width: 1, height: 380,
            background: `linear-gradient(180deg,transparent,#d85a07 18%,#d85a07 82%,transparent)` }}>
            {/* glowing midpoint dot */}
            <div style={{ position: "absolute", left: -4, top: "50%", width: 9, height: 9,
              transform: "translateY(-50%)", borderRadius: "50%",
              background: "#fff0cc",
              boxShadow: "0 0 9px #ff8a20, 0 0 18px #ff5b00" }} />
          </div>

          {/* TOTAL RETURN card */}
          <div style={{ textAlign: "center", paddingTop: 19 }}>
            <div style={{ color: orange, fontSize: 22, letterSpacing: 7,
              fontWeight: 500, fontFamily: COVER01_SANS, whiteSpace: "nowrap" }}>TOTAL RETURN</div>
            <div style={{ width: 100, height: 1, margin: "22px auto 0",
              background: `linear-gradient(90deg,transparent,${orange} 25%,${orange} 75%,transparent)` }} />
            <div style={{ marginTop: 60, fontFamily: ENDCOVER_SERIF, lineHeight: 0.82,
              letterSpacing: -6, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 74, marginRight: 7,
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>€</span>
              <span style={{ fontSize: 133 }}>{r.main}</span>
              <span style={{ fontSize: 67, letterSpacing: -4 }}>{r.decimal}</span>
            </div>
          </div>
        </div>

        {/* CTA block — bottom centred */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}>
          {/* HOW DID WE DO IT? row with chevrons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 34 }}>
            {/* left chevron */}
            <div style={{ width: 15, height: 15, display: "block",
              borderTop: `2px solid ${orange}`, borderRight: `2px solid ${orange}`,
              transform: "rotate(-135deg)" }} />
            <div style={{ color: orange, fontSize: 25, letterSpacing: 8,
              fontWeight: 500, fontFamily: COVER01_SANS, whiteSpace: "nowrap" }}>
              HOW DID WE DO IT?
            </div>
            {/* right chevron */}
            <div style={{ width: 15, height: 15, display: "block",
              borderTop: `2px solid ${orange}`, borderRight: `2px solid ${orange}`,
              transform: "rotate(45deg)" }} />
          </div>
          {/* rule */}
          <div style={{ width: 62, height: 1, margin: "30px auto 0", background: orange }} />
          {/* subtitle */}
          <div style={{ margin: "27px 0 0", color: "#aeb0b5", fontFamily: COVER01_SANS,
            fontSize: 21, letterSpacing: 3, fontWeight: 400 }}>
            Swipe to see today's picks &amp; analysis
          </div>
        </div>
      </div>
    );
  }

  /* ── End Cover 3 — Orange Gradient (Cover 05) ───────────────────── */
  if (coverStyle === "endcover3") {
    const settledCoupons = coupons.filter(c => c.status === "SETTLED");
    const totalStake  = settledCoupons.reduce((a, c) => a + c.stake, 0);
    const totalReturn = settledCoupons.reduce((a, c) => a + (c.returnAmount ?? 0), 0);
    const profit      = totalReturn - totalStake;

    const splitMoney = (val: number) => {
      const s = Math.abs(val).toFixed(2).split(".");
      return { sign: val < 0 ? "−" : "+", main: s[0], decimal: "." + s[1] };
    };
    const p = splitMoney(profit);
    const r = splitMoney(totalReturn);

    /* Always post (1080×1350) */
    const postWrap = { width: 1080, height: 1350, position: "relative" as const, overflow: "hidden" };

    return (
      <div style={{
        ...postWrap,
        background: `radial-gradient(circle at 50% 27%,rgba(255,255,255,.13),transparent 29%),
                     linear-gradient(150deg,#ff8b18 0%,#ff5d00 23%,#fa4300 58%,#ee3900 100%)`,
        color: "#fff",
        fontFamily: "Inter, Arial, sans-serif",
      }}>
        {/* Grain texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(0deg,rgba(255,255,255,.024) 0,rgba(255,255,255,.024) 1px,transparent 1px,transparent 4px),
                            repeating-linear-gradient(90deg,rgba(255,255,255,.016) 0,rgba(255,255,255,.016) 1px,transparent 1px,transparent 6px)`,
        }} />

        {/* Fabric ellipse — top left */}
        <div style={{
          position: "absolute", left: -220, top: -115, width: 620, height: 420,
          borderRadius: "50%", transform: "rotate(-15deg)", pointerEvents: "none",
          background: "linear-gradient(145deg,rgba(255,255,255,.44),rgba(255,204,81,.15) 32%,rgba(255,90,0,.04) 64%)",
          boxShadow: "inset -35px -25px 60px rgba(210,45,0,.14)",
        }} />

        {/* Fabric ellipse — bottom left */}
        <div style={{
          position: "absolute", left: -260, bottom: -210, width: 780, height: 390,
          borderRadius: "50%", transform: "rotate(7deg)", pointerEvents: "none",
          background: "linear-gradient(170deg,rgba(255,225,125,.3),rgba(255,84,0,.03) 48%,rgba(180,35,0,.1))",
        }} />

        {/* Pure-CSS BC watermark */}
        <div style={{
          position: "absolute", right: -35, bottom: 70, width: 250, height: 420,
          opacity: 0.08, pointerEvents: "none",
          background: `linear-gradient(33deg,transparent 44%,rgba(110,20,0,.95) 45% 55%,transparent 56%),
                       linear-gradient(147deg,transparent 44%,rgba(110,20,0,.95) 45% 55%,transparent 56%),
                       linear-gradient(90deg,transparent 28%,rgba(110,20,0,.9) 29% 42%,transparent 43% 57%,rgba(110,20,0,.9) 58% 71%,transparent 72%)`,
        }} />

        {/* Logo — centred, white filter over orange bg */}
        <div style={{
          position: "absolute", left: "50%", top: 48, width: 340, height: 125,
          transform: "translateX(-50%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img
            src="/bet-capitale-logo.png"
            alt="Bet Capitale"
            style={{
              width: 310, height: "auto", objectFit: "contain", display: "block",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>

        {/* Top rule */}
        <div style={{
          position: "absolute", left: "50%", top: 198, width: 56, height: 1,
          transform: "translateX(-50%)", background: "rgba(255,255,255,.84)",
        }} />

        {/* Title — TODAY'S / RESULTS */}
        <div style={{
          position: "absolute", left: "50%", top: 245, width: "100%",
          transform: "translateX(-50%)", textAlign: "center",
        }}>
          <div style={{ fontFamily: ENDCOVER_SERIF, fontWeight: 400, lineHeight: 0.87, letterSpacing: -4 }}>
            <div style={{ fontSize: 112, display: "block" }}>TODAY'S</div>
            <div style={{ fontSize: 112, fontWeight: 400, display: "block", marginTop: 18 }}>RESULTS</div>
          </div>

          {/* Diamond divider */}
          <div style={{
            margin: "38px auto 0", width: 760, display: "flex", alignItems: "center", gap: 28,
          }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.55))" }} />
            <div style={{
              width: 17, height: 17, transform: "rotate(45deg)", background: "#fff",
              boxShadow: "0 0 17px rgba(255,255,255,.85)", flexShrink: 0,
            }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(255,255,255,.55),transparent)" }} />
          </div>
        </div>

        {/* PROFIT section */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 607, textAlign: "center" }}>
          <div style={{ fontSize: 30, letterSpacing: 12, fontWeight: 500 }}>PROFIT</div>
          <div style={{
            marginTop: 35, fontFamily: ENDCOVER_SERIF, lineHeight: 0.88,
            letterSpacing: -4, whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: 84, marginRight: 10, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, verticalAlign: "baseline" }}>€</span>
            <span style={{ fontSize: 190, fontWeight: 300, fontFamily: SANS }}>{p.sign}</span>
            <span style={{ fontSize: 190, fontWeight: 500 }}>{p.main}</span>
            <span style={{ fontSize: 68, letterSpacing: -3, fontWeight: 500 }}>{p.decimal}</span>
          </div>
        </div>

        {/* TOTAL RETURN strip */}
        <div style={{
          position: "absolute", left: 150, right: 150, top: 954, height: 116,
          borderTop: "1px solid rgba(255,255,255,.48)", borderBottom: "1px solid rgba(255,255,255,.36)",
          display: "grid", gridTemplateColumns: "1fr 1px 1fr", alignItems: "center",
        }}>
          <div style={{ textAlign: "center", fontSize: 27, letterSpacing: 10, fontWeight: 500 }}>
            TOTAL RETURN
          </div>
          <div style={{ height: 70, background: "rgba(255,255,255,.8)" }} />
          <div style={{ textAlign: "center", fontFamily: ENDCOVER_SERIF, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 40, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>€</span>
            <span style={{ fontSize: 58, fontWeight: 500 }}>{r.main}</span>
            <span style={{ fontSize: 32, fontWeight: 500 }}>{r.decimal}</span>
          </div>
        </div>

        {/* CTA footer */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 48, textAlign: "center" }}>
          <div style={{
            width: 54, height: 54, border: "1px solid rgba(255,255,255,.9)", borderRadius: "50%",
            margin: "0 auto 18px", display: "grid", placeItems: "center",
            fontSize: 30, fontWeight: 400,
          }}>↗</div>
          <div style={{ fontSize: 23, letterSpacing: 9, fontWeight: 500 }}>HOW DID WE DO IT?</div>
          <p style={{ margin: "17px 0 0", fontSize: 20, fontWeight: 400 }}>
            Swipe to see today's picks &amp; analysis
          </p>
          <div style={{ marginTop: 20, fontSize: 46, letterSpacing: -8, fontWeight: 400 }}>›››</div>
        </div>
      </div>
    );
  }

  /* ── End Cover 6 — Image-based template with dynamic overlay ───── */
  if (coverStyle === "endcover6") {
    const P6_NUM  = "'Barlow Condensed', 'Arial Narrow', sans-serif";

    const settledCoupons = coupons.filter(c => c.status === "SETTLED");
    const totalStake  = settledCoupons.reduce((a, c) => a + c.stake, 0);
    const totalReturn = settledCoupons.reduce((a, c) => a + (c.returnAmount ?? 0), 0);
    const profit      = totalReturn - totalStake;

    const splitMoney = (val: number) => {
      const s = Math.abs(val).toFixed(2).split(".");
      return { sign: val < 0 ? "−" : "+", main: s[0], decimal: "." + s[1] };
    };
    const p = splitMoney(profit);
    const r = splitMoney(totalReturn);

    /*
     * Template image already has: "€ +" for profit and "€" for total return.
     * We overlay ONLY the numbers — no duplicate € in the overlay.
     * PROFIT: sign + digits starting after template's "€"
     * TR:     digits starting after template's "€"
     * Tweak PROFIT_TOP / TR_TOP if vertical alignment needs adjusting.
     */
    const PROFIT_TOP  = 614;   /* top of PROFIT digits container — baseline lands at ~713px (template €+ row: €=651-718, +=650-708) */
    const TR_TOP      = 970;   /* top of TR digits container — baseline lands at ~1049px (template € row) */
    const PROFIT_LEFT = 276;   /* x: 15px after template's "+" right edge (~261px) — digits only, NO overlay sign */
    const TR_LEFT     = 155;   /* x: right after template's "€" in TR row */

    return (
      <div style={{ width: 1080, height: 1350, position: "relative", overflow: "hidden" }}>

        {/* ── Template image — full background ──────────────────────── */}
        <img
          src="/ec6-template.png"
          alt=""
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
          }}
        />

        {/* ── PROFIT — digits only; template's "€ +" visible at canvas x=55-261 ── */}
        <div style={{
          position: "absolute", left: PROFIT_LEFT, top: PROFIT_TOP,
          display: "flex", alignItems: "baseline",
          whiteSpace: "nowrap" as const,
          fontFamily: P6_NUM, fontWeight: 800,
          fontVariantNumeric: "tabular-nums" as const,
        }}>
          {/* main digits — no overlay sign; template already shows "+" */}
          <span style={{ fontSize: 130, letterSpacing: -3, color: "#FFFFFF", lineHeight: 0.88 }}>{p.main}</span>
          {/* decimal */}
          <span style={{ fontSize: 68, letterSpacing: -1, color: "rgba(255,255,255,0.52)", lineHeight: 0.88, alignSelf: "flex-end" as const, marginBottom: 5 }}>{p.decimal}</span>
        </div>

        {/* ── TOTAL RETURN — digits only (€ is in template, not here) ── */}
        <div style={{
          position: "absolute", left: TR_LEFT, top: TR_TOP,
          display: "flex", alignItems: "baseline",
          whiteSpace: "nowrap" as const,
          fontFamily: P6_NUM, fontWeight: 800,
          fontVariantNumeric: "tabular-nums" as const,
        }}>
          {/* main digits */}
          <span style={{ fontSize: 108, letterSpacing: -3, color: "rgba(255,255,255,0.88)", lineHeight: 0.88 }}>{r.main}</span>
          {/* decimal */}
          <span style={{ fontSize: 58, letterSpacing: -1, color: "rgba(255,255,255,0.48)", lineHeight: 0.88, alignSelf: "flex-end" as const, marginBottom: 4 }}>{r.decimal}</span>
        </div>

      </div>
    );
  }

  /* ── Cover 04 — Pre-Match two-panel ────────────────────────────── */
  if (coverStyle === "cover04") {
    const dateLabel = fmtDate(date).toUpperCase();
    const matchCount  = matches.length;
    const couponCount = coupons.length;

    const C4 = {
      orange: "#ff5a00",
      dark:   "#0b0f13",
      dark2:  "#15191d",
    };
    const wrap = { width: 1080, height: 1350, position: "relative" as const, overflow: "hidden" };

    return (
      <div style={{
        ...wrap,
        background: `linear-gradient(90deg,${C4.orange} 0 68.6%,${C4.dark} 68.6% 100%)`,
        color: C4.dark,
        fontFamily: "Inter, Arial, sans-serif",
      }}>
        {/* Left panel inner gradient overlay */}
        <div style={{
          position: "absolute", left: 0, top: 0, width: 742, height: 1350, pointerEvents: "none",
          background: `radial-gradient(circle at 20% 12%,rgba(255,170,60,.20),transparent 30%),
                       linear-gradient(145deg,rgba(255,255,255,.04),transparent 25%),
                       linear-gradient(135deg,#ff6500 0%,#ff5000 55%,#f94500 100%)`,
        }} />

        {/* Grain */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.12, pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(0deg,rgba(255,255,255,.02) 0,rgba(255,255,255,.02) 1px,transparent 1px,transparent 4px),
                            repeating-linear-gradient(90deg,rgba(0,0,0,.015) 0,rgba(0,0,0,.015) 1px,transparent 1px,transparent 5px)`,
        }} />


        {/* Right chevrons */}
        <div style={{
          position: "absolute", right: -130, bottom: -40, width: 420, height: 340, opacity: 0.42, pointerEvents: "none",
          background: `repeating-linear-gradient(135deg,transparent 0 21px,rgba(255,80,0,.72) 22px 24px,transparent 25px 44px)`,
          clipPath: "polygon(36% 0,100% 55%,100% 100%,0 100%,0 72%,64% 25%)",
        }} />

        {/* Logo — top left, white filter over orange */}
        <div style={{ position: "absolute", left: 70, top: 66, width: 430, height: 100,
          display: "flex", alignItems: "center" }}>
          <img src="/bet-capitale-logo.png" alt="Bet Capitale"
            style={{ width: 300, height: "auto", objectFit: "contain", display: "block",
              filter: "brightness(0) invert(1)" }} />
        </div>

        {/* Header line */}
        <div style={{ position: "absolute", left: 70, top: 220, width: 150, height: 1,
          background: "rgba(15,18,20,.70)" }} />

        {/* Hero — PRE-MATCH */}
        <div style={{ position: "absolute", left: 70, top: 278 }}>
          <div style={{
            fontFamily: "Inter, Arial, sans-serif", fontWeight: 800, lineHeight: 0.88, letterSpacing: -4,
          }}>
            <div style={{ fontSize: 118, display: "block" }}>PRE-</div>
            <div style={{ fontSize: 118, display: "block" }}>MATCH</div>
          </div>
          <div style={{ width: 50, height: 2, background: C4.dark2, margin: "37px 0 28px 4px" }} />
          <div style={{ margin: "0 0 0 4px", fontSize: 25, letterSpacing: 11, fontWeight: 500 }}>
            {dateLabel}
          </div>
        </div>

        {/* Stats card */}
        <div style={{
          position: "absolute", left: 25, top: 758, width: 674, height: 214,
          background: C4.dark, boxShadow: "0 12px 24px rgba(0,0,0,.22)",
          display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", alignItems: "center",
          padding: "30px 35px", color: "#fff",
        }}>
          {/* MATCHES */}
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C4.orange, fontSize: 68, lineHeight: 0.8, fontFamily: ENDCOVER_SERIF }}>
              {matchCount}
            </div>
            <div style={{ fontSize: 20, letterSpacing: 6, marginTop: 17 }}>MATCHES</div>
            <div style={{ width: 65, height: 2, background: C4.orange, margin: "21px auto 0" }} />
          </div>
          {/* Divider */}
          <div style={{ height: 132, background: "rgba(255,90,0,.55)" }} />
          {/* COUPONS */}
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C4.orange, fontSize: 68, lineHeight: 0.8, fontFamily: ENDCOVER_SERIF }}>
              {couponCount}
            </div>
            <div style={{ fontSize: 20, letterSpacing: 6, marginTop: 17 }}>COUPONS</div>
            <div style={{ width: 65, height: 2, background: C4.orange, margin: "21px auto 0" }} />
          </div>
          {/* Divider */}
          <div style={{ height: 132, background: "rgba(255,90,0,.55)" }} />
          {/* FOCUS */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {/* Target: 3 concentric circles + arrow from upper-right through centre */}
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ display: "block", flexShrink: 0 }}>
              <circle cx="30" cy="30" r="26" stroke="#ff5a00" strokeWidth="1.8"/>
              <circle cx="30" cy="30" r="17" stroke="#ff5a00" strokeWidth="1.8"/>
              <circle cx="30" cy="30" r="8"  stroke="#ff5a00" strokeWidth="1.8"/>
              {/* Arrow from upper-right entering through centre */}
              <line x1="50" y1="10" x2="30" y2="30" stroke="#ff5a00" strokeWidth="1.8" strokeLinecap="round"/>
              <polyline points="38,10 50,10 50,22" stroke="#ff5a00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <div style={{ fontSize: 20, letterSpacing: 5, marginTop: 12 }}>MAXIMUM</div>
            <div style={{ fontSize: 20, letterSpacing: 6, marginTop: 4 }}>FOCUS</div>
            <div style={{ width: 65, height: 2, background: C4.orange, marginTop: 16 }} />
          </div>
        </div>

        {/* Member card */}
        <div style={{
          position: "absolute", left: 25, top: 1018, width: 674, height: 154,
          border: `1px solid ${C4.dark2}`, borderRadius: 12,
          display: "flex", alignItems: "center", padding: "0 36px",
        }}>
          <div style={{
            width: 90, height: 90, borderRadius: "50%", background: C4.dark,
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            {/* Lock: rectangular body + shackle arc + centre dot */}
            <svg width="47" height="47" viewBox="0 0 47 47" fill="none">
              <rect x="10" y="22" width="27" height="19" rx="3" stroke="#ff5a00" strokeWidth="1.8"/>
              <path d="M15 22v-6a8.5 8.5 0 0 1 17 0v6" stroke="#ff5a00" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <circle cx="23.5" cy="32" r="2.5" fill="#ff5a00"/>
            </svg>
          </div>
          <div style={{ marginLeft: 40 }}>
            <div style={{ fontSize: 20, letterSpacing: 5, fontWeight: 600 }}>EXCLUSIVELY FOR MEMBERS</div>
            <p style={{ margin: "17px 0 0", fontSize: 18, letterSpacing: 3 }}>Premium Picks. Maximum Focus.</p>
          </div>
        </div>

        {/* Swipe CTA */}
        <div style={{
          position: "absolute", left: 64, top: 1220, width: 620, height: 95,
          borderTop: `1px solid rgba(15,18,20,.62)`, borderBottom: `1px solid rgba(15,18,20,.62)`,
          display: "flex", alignItems: "center", gap: 28,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: C4.dark,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke={C4.orange} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: 22, letterSpacing: 5, whiteSpace: "nowrap" }}>
            SWIPE TO VIEW <span style={{ fontWeight: 600 }}>TODAY'S PICKS</span>
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          position: "absolute", right: 0, top: 0, width: 338, height: 1350,
          color: "#fff", padding: "165px 72px 0 72px", boxSizing: "border-box",
        }}>
          {/* Feature 1 */}
          <div>
            <img src="/icon-calendar.png" alt="" style={{ width: 56, height: 56, objectFit: "contain", marginBottom: 26, display: "block" }} />
            <div style={{ margin: 0, fontSize: 21, lineHeight: 1.5, letterSpacing: 3, fontWeight: 600 }}>
              PUBLISHED<br />BEFORE KICK-OFF
            </div>
            <p style={{ margin: "14px 0 0", color: "#e0e0df", fontSize: 18, lineHeight: 1.45, fontWeight: 300 }}>
              All picks are published<br />before the first match<br />starts.
            </p>
          </div>
          {/* Divider */}
          <div style={{ height: 1, background: C4.orange, margin: "42px 0 50px" }} />
          {/* Feature 2 */}
          <div>
            <img src="/icon-software.png" alt="" style={{ width: 56, height: 56, objectFit: "contain", marginBottom: 26, display: "block" }} />
            <div style={{ margin: 0, fontSize: 21, lineHeight: 1.5, letterSpacing: 3, fontWeight: 600 }}>
              SELECTED<br />BY SOFTWARE
            </div>
            <p style={{ margin: "14px 0 0", color: "#e0e0df", fontSize: 18, lineHeight: 1.45, fontWeight: 300 }}>
              Filtered by our<br />algorithm.<br />No manual bias.
            </p>
          </div>
          {/* Divider */}
          <div style={{ height: 1, background: C4.orange, margin: "42px 0 50px" }} />
          {/* Feature 3 */}
          <div>
            {/* Strategy: small square bottom-left + 3 ascending bars + rising arrow upper-right */}
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ display: "block", marginBottom: 26 }}>
              <rect x="8" y="40" width="7" height="7" rx="1" stroke="#ff5a00" strokeWidth="1.6"/>
              <rect x="20" y="33" width="7" height="14" rx="1" stroke="#ff5a00" strokeWidth="1.6"/>
              <rect x="32" y="25" width="7" height="22" rx="1" stroke="#ff5a00" strokeWidth="1.6"/>
              <polyline points="33,14 44,9 44,20" stroke="#ff5a00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <line x1="20" y1="27" x2="44" y2="9" stroke="#ff5a00" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <div style={{ margin: 0, fontSize: 21, lineHeight: 1.5, letterSpacing: 3, fontWeight: 600 }}>
              VALUE. STRATEGY.<br />CONSISTENCY.
            </div>
            <p style={{ margin: "14px 0 0", color: "#e0e0df", fontSize: 18, lineHeight: 1.45, fontWeight: 300 }}>
              Data-driven approach<br />for long-term results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Cover 02 — Premium Editorial ──────────────────────────────── */
  if (coverStyle === "cover02") {
    const C2 = { orange: "#ff4e00", ink: "#080d13", muted: "#525762", line: "#d9d5cf" };
    const sv = (post: number) => isStory ? Math.round(post * 1920 / 1350) : post;

    const brandTop      = sv(112);
    const heroTop       = sv(252);
    const statsTop      = sv(745);  const statsH = sv(185);
    const memberTop     = sv(1006); const memberH = sv(158);
    const footerBottom  = sv(77);
    const wmTop         = sv(52);   const wmH = sv(840);
    const colTop        = sv(355);  const colH = sv(435);

    const brandFontSz   = isStory ? 44  : 31;
    const titleBlackSz  = isStory ? 216 : 152;
    const titleOrangeSz = isStory ? 242 : 170;
    const dateSz        = isStory ? 36  : 25;
    const numSz         = isStory ? 82  : 58;
    const labelSz       = isStory ? 33  : 23;
    const iconSz        = isStory ? 105 : 74;
    const iconRadius    = isStory ? 26  : 18;
    const memberTitleSz = isStory ? 31  : 22;
    const memberSubSz   = isStory ? 27  : 19;
    const swipeSz       = isStory ? 28  : 20;
    const divH          = isStory ? 206 : 145;
    const accentW       = isStory ? 79  : 56;
    const accentH       = isStory ? 6   : 4;
    const underlineW    = isStory ? 62  : 44;
    const pillW         = isStory ? 10  : 7;
    const pillH         = isStory ? 44  : 31;
    const pillTop2      = isStory ? 78  : 55;

    const cover02date = (() => {
      try { return new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }).toUpperCase(); }
      catch { return date.toUpperCase(); }
    })();

    return (
      <div style={{
        ...wrap,
        background: "#ffffff",
        overflow: "hidden",
      }}>
        {/* Top-left glow overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "linear-gradient(135deg, rgba(255,255,255,.45), transparent 42%, rgba(255,255,255,.25))" }} />

        {/* BC icon watermark — right side, aligned with TODAY'S PLAN */}
        <img
          src="/bc-icon.png"
          aria-hidden="true"
          style={{
            position: "absolute",
            width: isStory ? 620 : 440,
            height: "auto",
            right: isStory ? -100 : -70,
            top: isStory ? 280 : 198,
            zIndex: 1,
            pointerEvents: "none",
            opacity: 0.08,
          }}
        />

        {/* Brand header */}
        <div style={{ position: "absolute", left: 92, top: brandTop, zIndex: 3,
          display: "flex", alignItems: "center", gap: isStory ? 20 : 14 }}>
          <img src="/bc-icon.png" alt="" style={{ width: isStory ? 54 : 52, height: "auto", objectFit: "contain" }} />
          <span style={{
            fontFamily: COVER01_SERIF, fontSize: isStory ? 56 : 40, fontWeight: 500,
            letterSpacing: "0.19em", color: C2.ink,
          }}>BET CAPITALE</span>
        </div>

        {/* Hero copy */}
        <div style={{ position: "absolute", left: 96, top: heroTop, zIndex: 3 }}>
          <div style={{ width: accentW, height: accentH, background: C2.orange, marginBottom: isStory ? 57 : 40 }} />
          <div style={{ fontFamily: COVER01_SERIF, fontWeight: 500, lineHeight: 0.79, letterSpacing: "-0.035em" }}>
            <div style={{ fontSize: titleBlackSz, color: C2.ink }}>TODAY'S</div>
            <div style={{ fontSize: titleOrangeSz, color: C2.orange, marginTop: isStory ? 40 : 28 }}>PLAN</div>
          </div>
          <div style={{ marginTop: isStory ? 60 : 42, marginLeft: 3,
            fontFamily: COVER01_SANS, fontWeight: 500,
            fontSize: dateSz, letterSpacing: "0.32em", color: "#3d424a" }}>
            {cover02date}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ position: "absolute", left: 92, right: 92, top: statsTop, height: statsH,
          display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
          alignItems: "center", zIndex: 4 }}>

          {/* MATCHES */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: iconSz, height: iconSz, borderRadius: iconRadius,
              background: "rgba(255,255,255,.72)", boxShadow: "0 10px 24px rgba(0,0,0,.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: isStory ? 17 : 12, flexShrink: 0 }}>
              <svg viewBox="0 0 34 38" style={{ width: isStory ? 48 : 34, color: C2.orange }}
                fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                <rect x="1" y="7" width="32" height="30" rx="4" />
                <line x1="1" y1="15" x2="33" y2="15" />
                <line x1="11" y1="1" x2="11" y2="12" />
                <line x1="23" y1="1" x2="23" y2="12" />
                <circle cx="10" cy="24" r="2" fill="currentColor" stroke="none" />
                <circle cx="17" cy="24" r="2" fill="currentColor" stroke="none" />
                <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
                <circle cx="10" cy="31" r="2" fill="currentColor" stroke="none" />
                <circle cx="17" cy="31" r="2" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div style={{ fontFamily: COVER01_SERIF, fontSize: numSz, lineHeight: 1, fontWeight: 600, color: C2.ink }}>{matchCount}</div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: labelSz, letterSpacing: "0.24em", marginTop: isStory ? 7 : 5, color: C2.ink }}>MATCHES</div>
            <div style={{ width: underlineW, height: 2, background: C2.orange, marginTop: isStory ? 30 : 21 }} />
          </div>

          <div style={{ height: divH, background: "#c9c7c3" }} />

          {/* COUPONS */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: iconSz, height: iconSz, borderRadius: iconRadius,
              background: "rgba(255,255,255,.72)", boxShadow: "0 10px 24px rgba(0,0,0,.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: isStory ? 17 : 12, flexShrink: 0,
              fontSize: isStory ? 62 : 44, color: C2.orange, lineHeight: 1 }}>
              ↗
            </div>
            <div style={{ fontFamily: COVER01_SERIF, fontSize: numSz, lineHeight: 1, fontWeight: 600, color: C2.ink }}>{couponCount}</div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: labelSz, letterSpacing: "0.24em", marginTop: isStory ? 7 : 5, color: C2.ink }}>COUPONS</div>
            <div style={{ width: underlineW, height: 2, background: C2.orange, marginTop: isStory ? 30 : 21 }} />
          </div>

          <div style={{ height: divH, background: "#c9c7c3" }} />

          {/* MAXIMUM FOCUS */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: iconSz, height: iconSz, borderRadius: iconRadius,
              background: "rgba(255,255,255,.72)", boxShadow: "0 10px 24px rgba(0,0,0,.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: isStory ? 17 : 12, flexShrink: 0,
              fontSize: isStory ? 80 : 56, color: C2.orange,
              fontFamily: "Arial, sans-serif", lineHeight: 1 }}>
              ◎
            </div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: isStory ? 41 : 29,
              letterSpacing: "0.1em", fontWeight: 600, marginTop: isStory ? 14 : 10, color: C2.ink }}>MAXIMUM</div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: labelSz, letterSpacing: "0.24em",
              marginTop: isStory ? 14 : 10, color: C2.ink }}>FOCUS</div>
            <div style={{ width: underlineW, height: 2, background: C2.orange, marginTop: isStory ? 30 : 21 }} />
          </div>
        </div>

        {/* Member card */}
        <div style={{ position: "absolute", left: isStory ? 78 : 55, right: isStory ? 78 : 55, top: memberTop, height: memberH,
          border: "1.5px solid #c7c4bf", borderRadius: isStory ? 43 : 30,
          display: "flex", alignItems: "center", padding: `0 ${isStory ? 52 : 36}px`,
          zIndex: 4, background: "rgba(255,255,255,.85)", overflow: "hidden" }}>
          {/* Lock badge */}
          <div style={{ width: isStory ? 110 : 78, height: isStory ? 110 : 78, borderRadius: "50%",
            background: "rgba(255,140,0,.08)", boxShadow: "0 8px 22px rgba(0,0,0,.08)",
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 40 48" style={{ width: isStory ? 40 : 28, color: C2.orange }}
              fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="22" width="32" height="24" rx="4" />
              <path d="M12 22V16a8 8 0 0 1 16 0v6" />
              <circle cx="20" cy="34" r="3" fill="currentColor" stroke="none" />
            </svg>
          </div>
          {/* Divider */}
          <div style={{ width: 1, height: isStory ? 100 : 70,
            background: "#ccc8c2", margin: `0 ${isStory ? 44 : 32}px`, flexShrink: 0 }} />
          {/* Text */}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: COVER01_SANS, fontSize: memberTitleSz,
              letterSpacing: "0.18em", fontWeight: 600, color: C2.ink,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span style={{ color: C2.orange }}>MEMBER</span>{" "}ACCESS REQUIRED
            </div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: memberSubSz,
              letterSpacing: "0.15em", color: "#6c7077", marginTop: isStory ? 18 : 12 }}>
              Premium Picks. Maximum Focus.
            </div>
          </div>
        </div>

        {/* Footer swipe */}
        <div style={{ position: "absolute", left: 100, right: 145, bottom: footerBottom,
          display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 5 }}>
          <div style={{ fontFamily: COVER01_SANS, fontSize: swipeSz,
            letterSpacing: "0.23em", whiteSpace: "nowrap", color: C2.ink }}>
            SWIPE TO VIEW{" "}<span style={{ color: C2.orange }}>TODAY'S PICKS</span>
          </div>
          {/* Arrow: dot + line + head */}
          <div style={{ position: "relative", width: isStory ? 430 : 302, height: isStory ? 34 : 24, flexShrink: 0 }}>
            <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
              display: "flex", alignItems: "center" }}>
              <div style={{ width: isStory ? 18 : 13, height: isStory ? 18 : 13,
                borderRadius: "50%", background: C2.ink, flexShrink: 0 }} />
              <div style={{ width: isStory ? 400 : 275, height: 3, background: C2.ink }} />
            </div>
            <div style={{ position: "absolute", right: 0, top: "50%",
              width: isStory ? 25 : 18, height: isStory ? 25 : 18,
              borderTop: `3px solid ${C2.ink}`, borderRight: `3px solid ${C2.ink}`,
              transform: "translateY(-50%) rotate(45deg)" }} />
          </div>
        </div>

        {/* Rings — bottom-left */}
        <div style={{ position: "absolute",
          left: isStory ? -241 : -170, bottom: isStory ? -348 : -245,
          width: isStory ? 994 : 700, height: isStory ? 710 : 500,
          borderRadius: "50%", border: "1px solid rgba(255,114,35,.25)",
          zIndex: 2, pointerEvents: "none" }}>
          <div style={{ position: "absolute", inset: isStory ? 54 : 38,
            borderRadius: "50%", border: "1px solid rgba(255,114,35,.23)" }} />
          <div style={{ position: "absolute", inset: isStory ? 111 : 78,
            borderRadius: "50%", border: "1px solid rgba(255,114,35,.20)" }} />
        </div>

        {/* Orange glow — bottom-right */}
        <div style={{ position: "absolute",
          right: isStory ? -227 : -160, bottom: isStory ? -185 : -130,
          width: isStory ? 710 : 500, height: isStory ? 739 : 520,
          background: "radial-gradient(circle at 55% 40%, rgba(255,116,21,.95), rgba(255,89,0,.35) 45%, transparent 72%)",
          filter: "blur(10px)", zIndex: 1, pointerEvents: "none" }} />
      </div>
    );
  }

  /* ── Cover 01 — Klasik Dergi Kapağı ───────────────────────────── */
  if (coverStyle === "cover01") {
    const orange01  = "#F35B13";
    const ink01     = "#080808";
    const muted01   = "#4C4C4C";
    const line01    = "#D8D8D8";
    const padSide   = 124;
    const padTop    = isStory ? 156 : 110;
    const padBot    = isStory ? 80  : 60;
    const numSz     = isStory ? 108 : 78;
    const labelSz   = isStory ? 21  : 16;
    const eyeSz     = isStory ? 27  : 20;
    const titleSz   = isStory ? 126 : 94;
    const dateSz    = isStory ? 21  : 15;
    const memberSz  = isStory ? 16  : 12;
    const swipeSz   = isStory ? 14  : 10;

    const dateCover01 = (() => {
      try {
        return new Date(date + "T00:00:00")
          .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
          .toUpperCase();
      } catch { return date.toUpperCase(); }
    })();

    return (
      <div style={{
        ...wrap,
        padding: `${padTop}px ${padSide}px ${padBot}px`,
        background: [
          "radial-gradient(circle at 50% 41%, rgba(255,255,255,.98) 0 34%, rgba(250,249,248,.96) 66%, rgba(244,243,242,.96) 100%)",
          "linear-gradient(135deg, #fff 0%, #faf9f8 48%, #f3f1ef 100%)",
        ].join(", "),
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Paper texture */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.27, pointerEvents: "none",
          background: [
            "repeating-linear-gradient(0deg, rgba(0,0,0,.012) 0 1px, transparent 1px 3px)",
            "repeating-linear-gradient(90deg, rgba(255,255,255,.16) 0 1px, transparent 1px 4px)",
          ].join(", "),
        }} />

        {/* BC icon watermark — alt boşlukta ortalı */}
        <img
          src="/bc-icon.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: isStory ? "52%" : "50%",
            transform: "translateX(-50%)",
            width: isStory ? "58%" : "55%",
            opacity: 0.09,
            pointerEvents: "none",
            zIndex: 0,
            userSelect: "none",
          }}
        />

        {/* Brand logo — ikon + yazı yan yana */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: isStory ? 18 : 13, zIndex: 1, flexShrink: 0,
        }}>
          <img
            src="/bc-icon.png"
            alt=""
            style={{ width: isStory ? 42 : 40, height: "auto", objectFit: "contain" }}
          />
          <span style={{
            fontFamily: COVER01_SERIF, fontWeight: 500,
            fontSize: isStory ? 44 : 30,
            letterSpacing: "0.22em",
            color: "#1a1a1a",
          }}>BET CAPITALE</span>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", marginTop: isStory ? 40 : 28, zIndex: 1, flexShrink: 0 }}>
          <div style={{
            fontFamily: COVER01_SANS, fontWeight: 600, fontSize: eyeSz,
            color: orange01, letterSpacing: "0.31em", marginBottom: isStory ? 26 : 18,
          }}>
            {varLabel}
          </div>
          <div style={{
            fontFamily: COVER01_SERIF, fontSize: titleSz, lineHeight: 0.93,
            fontWeight: 600, letterSpacing: "-0.035em", color: ink01, whiteSpace: "nowrap",
          }}>
            TODAY'S PLAN
          </div>
          <div style={{
            width: "9%", minWidth: 56, height: 2, background: orange01,
            margin: `${isStory ? 56 : 40}px auto ${isStory ? 40 : 28}px`,
          }} />
          <div style={{
            fontFamily: COVER01_SANS, fontSize: dateSz, fontWeight: 500,
            color: muted01, letterSpacing: "0.34em",
          }}>
            {dateCover01}
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          marginTop: isStory ? 90 : 64, zIndex: 1, flexShrink: 0, alignSelf: "center",
          width: "89%", display: "grid",
          gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
          alignItems: "center",
          minHeight: isStory ? 188 : 140,
        }}>
          {/* MATCHES */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontFamily: COVER01_SERIF, fontSize: numSz, lineHeight: 0.86, fontWeight: 600, color: ink01, marginBottom: isStory ? 14 : 10 }}>
              {matchCount}
            </div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: labelSz, fontWeight: 700, letterSpacing: "0.2em", color: ink01 }}>
              MATCHES
            </div>
            <div style={{ width: "35%", height: 2, background: orange01, marginTop: isStory ? 20 : 14 }} />
          </div>

          {/* Divider */}
          <div style={{ height: "76%", background: line01 }} />

          {/* COUPONS */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontFamily: COVER01_SERIF, fontSize: numSz, lineHeight: 0.86, fontWeight: 600, color: ink01, marginBottom: isStory ? 14 : 10 }}>
              {couponCount}
            </div>
            <div style={{ fontFamily: COVER01_SANS, fontSize: labelSz, fontWeight: 700, letterSpacing: "0.2em", color: ink01 }}>
              COUPONS
            </div>
            <div style={{ width: "35%", height: 2, background: orange01, marginTop: isStory ? 20 : 14 }} />
          </div>

          {/* Divider */}
          <div style={{ height: "76%", background: line01 }} />

          {/* MAXIMUM FOCUS — crosshair SVG */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <svg viewBox="0 0 96 96" aria-hidden="true"
              style={{ width: isStory ? "42%" : "38%", color: ink01, marginTop: isStory ? "-5%" : "-3%" }}>
              <circle cx="44" cy="52" r="31" fill="none" stroke="currentColor" strokeWidth="7"/>
              <circle cx="44" cy="52" r="19" fill="none" stroke="currentColor" strokeWidth="7"/>
              <circle cx="44" cy="52" r="6" fill="currentColor"/>
              <path d="M47 49 75 21" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
              <path d="M62 21h14v14" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="square"/>
            </svg>
            <div style={{ fontFamily: COVER01_SANS, fontSize: labelSz, fontWeight: 700, letterSpacing: "0.2em", color: ink01, marginTop: isStory ? 10 : 7, lineHeight: 1.28 }}>
              MAXIMUM<br/>FOCUS
            </div>
            <div style={{ width: "35%", height: 2, background: orange01, marginTop: isStory ? 20 : 14 }} />
          </div>
        </div>

        {/* Members strip */}
        <div style={{
          marginTop: isStory ? 72 : 50, zIndex: 1, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: isStory ? 16 : 11, color: muted01,
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            style={{ width: isStory ? 28 : 21, height: isStory ? 28 : 21, flexShrink: 0, minWidth: isStory ? 28 : 21 }}>
            <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
            <rect x="5" y="10" width="14" height="11" rx="1.5"/>
            <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none"/>
            <path d="M12 16.3V18" strokeWidth="1.6"/>
          </svg>
          <div style={{ fontFamily: COVER01_SANS, fontSize: memberSz, fontWeight: 600, letterSpacing: "0.22em", color: muted01 }}>
            EXCLUSIVELY FOR MEMBERS
          </div>
        </div>

        {/* Swipe footer */}
        <div style={{
          marginTop: "auto", paddingTop: isStory ? 40 : 28, zIndex: 1,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: `1px solid ${line01}`,
        }}>
          <div style={{ fontFamily: COVER01_SANS, fontSize: swipeSz, fontWeight: 500, letterSpacing: "0.24em", color: muted01 }}>
            SWIPE TO VIEW <em style={{ fontStyle: "italic" }}>TODAY'S PICKS</em>
          </div>
          {/* Static arrow */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: isStory ? 9 : 7, height: isStory ? 9 : 7, borderRadius: "50%", background: muted01, flexShrink: 0 }} />
            <div style={{ width: isStory ? 56 : 42, height: 1, background: muted01 }} />
            <div style={{
              width: isStory ? 14 : 10, height: isStory ? 14 : 10,
              borderTop: `2px solid ${muted01}`, borderRight: `2px solid ${muted01}`,
              transform: "translateY(-50%) rotate(45deg)", flexShrink: 0,
              position: "relative", top: isStory ? "7px" : "5px",
            }} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function TemplatePreview({ children, fmt, zoom = 25 }: {
  children: React.ReactNode; fmt: Fmt; zoom?: number;
}) {
  const { w, h } = DIMS[fmt];
  const scale  = zoom / 100;
  const prevW  = Math.round(w * scale);
  const prevH  = Math.round(h * scale);
  return (
    <div style={{
      width: prevW, height: prevH, overflow: "hidden",
      borderRadius: 10, boxShadow: "0 4px 24px rgba(0,0,0,0.15)", flexShrink: 0,
      position: "relative",
    }}>
      <div style={{
        transform: `scale(${scale})`, transformOrigin: "top left",
        width: w, height: h, position: "absolute", top: 0, left: 0,
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─── PAGINATION LOGIC ───────────────────────────────────────────── */
/* Spec rules:
   1-3 coupons  → 1 page (all together)
   4-6 coupons  → max 3/page
   7+ coupons   → 3/page
   Any coupon with 5+ matches → max 2/page */
function buildKuponChunks(coupons: AC[]): AC[][] {
  return [coupons];
}

/* ─── CHART TEMPLATE — Instagram daily net results bar chart ────── */
type DailyResult = {
  date: string;
  netResult: number;
  wonCoupons: number;
  lostCoupons: number;
  totalCoupons: number;
};
type ChartResponse = {
  days: DailyResult[];
  periodWonLegs: number;
  periodTotalLegs: number;
  rangeStart: string | null;
  rangeEnd: string | null;
};

function fmtShortDate(iso: string): string {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  } catch { return iso.slice(5); }
}

function ChartTemplate({ days = [], rangeLabel, chartDays, periodWonLegs = 0, periodTotalLegs = 0 }: {
  days?: DailyResult[]; rangeLabel: string; periodWonLegs?: number; periodTotalLegs?: number; chartDays: number;
}) {
  const W = 1080, H = 1350;
  /* ── Palette ── */
  const BG        = "#FFFFFF";
  const DARK      = "#0F172A";
  const ORANGE    = "#FF5A00";
  const GREEN     = "#16A34A";
  const RED       = "#DC2626";
  const MUTED     = "#64748B";
  const GRID      = "rgba(15,23,42,0.11)";
  const SEP       = "rgba(15,23,42,0.10)";
  const CONDENSED = "'Barlow Condensed', 'Arial Narrow', sans-serif";
  const HPAD      = 60;   // header / footer horizontal padding
  const n = days.length;

  /* "Apr 23" style date for X axis */
  function fmtAxisDate(iso: string): string {
    try {
      const d = new Date(iso + "T00:00:00");
      const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${M[d.getMonth()]} ${d.getDate()}`;
    } catch { return iso.slice(5); }
  }

  if (n === 0) {
    return (
      <div style={{ width: W, height: H, background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: MUTED, fontFamily: SANS, fontSize: 24 }}>No data for this period</span>
      </div>
    );
  }

  /* ── Density mode: 30-day view gets thinner bars, wider gaps, more breathing room ── */
  const isDense = n > 14;
  const fmtBarValue = (value: number) => `${value >= 0 ? "+" : "−"}${Math.abs(Math.round(value))}€`;

  /*
   * Dense labels reserve a calculated lower lane so they never reach the date
   * axis. At the top, labels only flip inside an exceptionally high first bar
   * when they would physically cross the fixed NET RESULT heading.
   */
  const denseLabelFS       = 20;
  const maxDenseLabelChars = Math.max(...days.map(d => fmtBarValue(d.netResult).length));
  const denseLabelExtent   = Math.ceil(maxDenseLabelChars * denseLabelFS * 0.60);
  const denseChartTop      = 104;
  const denseTitleY        = 34; // pinned to the very top-left, in the gap between the orange divider and the 1050 line
  const denseTitleWidth    = 150;                // safe visual width for “NET RESULT (€)” at 20px Inter
  const denseLabelGap      = 12;

  /* ── Layout ── */
  const PAD_L    = isDense ? 74 : 92;   // tightened when dense to widen the usable chart area
  const PAD_R    = isDense ? 26 : 48;
  const chartW   = W - PAD_L - PAD_R;
  const HDR_H    = 152;
  const FOOT_H   = 162;
  const SVG_H    = H - HDR_H - FOOT_H;   // 1036 px
  const PT       = isDense ? denseChartTop : 52;
  const PB       = isDense ? denseLabelExtent + denseLabelGap + 46 : 64;
  const barAreaH = SVG_H - PT - PB;
  const axisDateY = isDense
    ? PT + barAreaH + denseLabelExtent + denseLabelGap + 28
    : PT + barAreaH + 40;

  /* ── Y-axis nice ticks ── */
  const maxPos = Math.max(0.01, ...days.map(d => d.netResult > 0 ? d.netResult : 0));
  const maxNeg = Math.max(0.01, ...days.map(d => d.netResult < 0 ? -d.netResult : 0));
  const hasNeg = maxNeg > 0.5;

  function niceStep(raw: number): number {
    const cands = [10,20,25,50,75,100,150,200,250,300,350,500,750,1000,1500,2000,5000,10000];
    for (const c of cands) if (c >= raw) return c;
    return Math.ceil(raw / 5000) * 5000;
  }
  const step        = niceStep(Math.max(maxPos, maxNeg) / 3);
  const maxTickPos  = Math.ceil(maxPos / step) * step;
  const maxTickNeg  = hasNeg ? Math.ceil(maxNeg / step) * step : 0;
  const effectiveH  = maxTickPos + (hasNeg ? maxTickNeg : step * 0.15);

  /* Ticks array (descending = top → bottom) */
  const ticks: number[] = [];
  for (let v = maxTickPos; v >= -(hasNeg ? maxTickNeg : 0) - 0.001; v -= step) {
    ticks.push(Math.round(v));
  }
  if (!ticks.includes(0)) ticks.push(0);
  ticks.sort((a, b) => b - a);

  /* Map data value → SVG Y within barAreaH */
  const yOfVal = (v: number) => PT + (maxTickPos - v) / effectiveH * barAreaH;
  const zeroY  = yOfVal(0);

  /* Title left edge — aligned with the left edge of the top ("1050"/etc.) tick label, not the bars.
     Applies to every day-count view (7/14/30) so the title always lines up with the Y-axis. */
  const topTickLabelW = Math.ceil(String(maxTickPos).length * 15 * 0.62);
  const denseTitleX   = PAD_L - 12 - topTickLabelW;
  /* Logo shares this same left edge so it, the title, and the top tick label all line up in one column */
  const chartLeftX    = denseTitleX;

  /* ── Bar geometry ── */
  const GAP  = n <= 7 ? 26 : n <= 14 ? 14 : 11;   // widened for dense (30-day) mode so bars breathe
  const barW = Math.max(4, (chartW - GAP * (n - 1)) / n);
  const CR   = Math.min(4, barW / 4);

  /* ── Value label size (scales with bar density) ── */
  const valFS = isDense ? denseLabelFS : n <= 7 ? 32 : 22;

  /* ── X-axis anchor set ── */
  const xAnchors = new Set<number>();
  if (n <= 7) {
    for (let i = 0; i < n; i++) xAnchors.add(i);
  } else {
    const slots = n <= 14 ? 7 : 8;
    for (let k = 0; k < slots; k++) xAnchors.add(Math.round(k * (n - 1) / (slots - 1)));
  }

  /* ── Summary stats ── */
  const totalNet = days.reduce((s, d) => s + d.netResult, 0);
  const bestDay  = Math.max(...days.map(d => d.netResult));
  const netSign  = totalNet >= 0 ? "+" : "−";
  const netColor = totalNet >= 0 ? GREEN : RED;

  return (
    <div style={{ width: W, height: H, background: BG, position: "relative", overflow: "hidden", fontFamily: SANS }}>

      {/* ══ HEADER ══════════════════════════════════════════════ */}

      {/* Logo ↔ period title — same row, vertically centered on each other.
          Logo's left edge lines up with the chart title / "1050" tick label below. */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: HDR_H,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingLeft: chartLeftX, paddingRight: HPAD,
      }}>
        {/* Logo — 50% larger (200px → 300px), whitespace-cropped wrapper scaled to match */}
        <div style={{ height: 72, overflow: "hidden", flexShrink: 0 }}>
          <img src="/bet-capitale-logo.png" alt="Bet Capitale"
            style={{ width: 300, height: "auto", marginTop: -51, filter: "brightness(0)", opacity: 0.90 }} />
        </div>

        {/* Period title */}
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 76, fontWeight: 900, color: DARK,
            fontFamily: CONDENSED, letterSpacing: -2, lineHeight: 0.88, textTransform: "uppercase",
          }}>
            LAST {chartDays} DAYS
          </div>
          <div style={{
            fontSize: 12, fontWeight: 500, color: MUTED,
            letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 9, fontFamily: SANS,
          }}>
            DAILY NET RESULTS &nbsp;·&nbsp; {rangeLabel}
          </div>
        </div>
      </div>

      {/* Orange full-width divider */}
      <div style={{ position: "absolute", top: HDR_H - 2, left: 0, right: 0, height: 2, background: ORANGE }} />

      {/* ══ BAR CHART SVG ════════════════════════════════════════ */}
      <svg width={W} height={SVG_H} style={{ position: "absolute", top: HDR_H, left: 0 }} overflow="visible">

        {/* Fixed chart title — 20% larger Inter. Left edge always lines up with the top Y-axis tick label. */}
        <text x={denseTitleX} y={isDense ? denseTitleY : PT - 20} fill={DARK} fontSize={isDense ? 20 : 17} fontWeight="700" fontFamily={SANS} letterSpacing="0.01em">
          NET RESULT (€)
        </text>

        {/* Y-axis grid lines + tick labels */}
        {ticks.map(v => {
          const y      = yOfVal(v);
          const isZero = v === 0;
          return (
            <g key={v}>
              {/* Horizontal line: solid + darker for zero, fine dotted + faint for others */}
              <line
                x1={PAD_L} y1={y} x2={W - PAD_R} y2={y}
                stroke={isZero ? "rgba(15,23,42,0.32)" : GRID}
                strokeWidth={isZero ? 1.5 : 1}
                strokeDasharray={isZero ? undefined : "1 7"}
                strokeLinecap="round"
              />
              {/* Y-axis label — right-aligned before chart area */}
              <text
                x={PAD_L - 12} y={y + 5}
                textAnchor="end"
                fill={MUTED}
                fontSize={15}
                fontFamily={SANS}
                fontWeight="600"
                letterSpacing="0.02em"
              >
                {String(v)}
              </text>
            </g>
          );
        })}

        {/* Bars + value labels + X-axis labels */}
        {days.map((d, i) => {
          const bx    = PAD_L + i * (barW + GAP);
          const isP   = d.netResult >= 0;
          const bh    = Math.max(2, Math.abs(d.netResult) / effectiveH * barAreaH);
          const by    = isP ? zeroY - bh : zeroY;
          const col   = isP ? GREEN : RED;
          const label = fmtBarValue(d.netResult);
          const cx    = bx + barW / 2;
          const labelTopY = by - 10 - denseLabelExtent;
          const flipsIntoBar = isDense && isP
            && cx < PAD_L + denseTitleWidth
            && labelTopY < denseTitleY + 4;
          const denseLabelY = isP
            ? flipsIntoBar ? by + 12 : by - 10
            : by + bh + 10;
          // Rotated glyphs sit to one side of the SVG text baseline. Offset the
          // baseline back toward the bar so the visible label is centered on it.
          // The offset direction depends on the actual rotation angle applied below
          // (flipsIntoBar flips positive-bar labels to +90°), not on the bar's sign —
          // negative bars always rotate -90° just like the common positive case.
          const denseLabelX = cx + (flipsIntoBar ? -1 : 1) * denseLabelFS * 0.42;

          return (
            <g key={d.date}>
              {/* Bar — rounded outer end, flat at zero line */}
              <rect x={bx} y={by} width={barW} height={bh} rx={CR} ry={CR} fill={col} />
              {bh > CR * 2 + 1 && (
                <rect x={bx} y={isP ? by + bh - CR - 1 : by} width={barW} height={CR + 1} fill={col} />
              )}

              {/* Value label — amount for this bar. Dense (30-day) mode: vertical, black, fits narrow bars. */}
              {isDense ? (
                <text
                  x={denseLabelX}
                  y={denseLabelY}
                  textAnchor={isP ? "start" : "end"}
                  transform={`rotate(${flipsIntoBar ? 90 : -90} ${denseLabelX} ${denseLabelY})`}
                  fill={DARK}
                  fontSize={valFS}
                  fontWeight="600"
                  fontFamily={SANS}
                  letterSpacing="-0.01em"
                >
                  {label}
                </text>
              ) : (
                <text
                  x={cx}
                  y={isP ? by - 10 : by + bh + valFS + 6}
                  textAnchor="middle"
                  fill={DARK}
                  fontSize={valFS}
                  fontWeight="800"
                  fontFamily={CONDENSED}
                >
                  {label}
                </text>
              )}

              {/* X-axis date label */}
              {xAnchors.has(i) && (
                <text
                  x={bx + barW / 2}
                  y={axisDateY}
                  textAnchor="middle"
                  fill={MUTED}
                  fontSize={n <= 7 ? 17 : 15}
                  fontFamily={SANS}
                  fontWeight="600"
                  letterSpacing="0.06em"
                >
                  {fmtAxisDate(d.date).toUpperCase()}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}

      {/* Separator */}
      <div style={{ position: "absolute", bottom: FOOT_H, left: 0, right: 0, height: 1, background: SEP }} />

      {/* 3-column metrics */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: FOOT_H,
        display: "flex", alignItems: "center", padding: `0 ${HPAD}px`, background: BG,
      }}>
        {([
          { label: "TOTAL NET",  value: `${netSign}€${fmt2(Math.abs(totalNet))}`,                                              color: netColor },
          { label: "MATCH RATE", value: periodTotalLegs > 0 ? `${((periodWonLegs / periodTotalLegs) * 100).toFixed(1)}%` : "—", color: ORANGE   },
          { label: "BEST DAY",   value: bestDay > 0 ? `+€${fmt2(bestDay)}` : "—",                                               color: GREEN    },
        ] as const).map(({ label, value, color }, idx) => (
          <div key={label} style={{
            flex: 1, textAlign: "center",
            borderLeft: idx > 0 ? `1px solid ${SEP}` : "none",
            padding: "0 12px",
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: MUTED,
              letterSpacing: "0.20em", marginBottom: 10,
              textTransform: "uppercase", fontFamily: SANS,
            }}>
              {label}
            </div>
            <div style={{
              fontSize: 50, fontWeight: 900, color, lineHeight: 1,
              fontFamily: CONDENSED, letterSpacing: -1,
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export function AdminSocialMediaContent() {
  const [date,          setDate]          = useState(todayISO);
  const [tab,           setTab]           = useState<ContentTab>("coupon");
  const [variant,       setVariant]       = useState<Variant>("prematch");
  const [fmt,           setFmt]           = useState<Fmt>("story");
  const [previewPage,   setPreviewPage]   = useState(0);
  const [exporting,     setExporting]     = useState(false);
  const initZoom = (): 25 | 50 | 75 | 100 => {
    const p = new URLSearchParams(window.location.search).get("zoom");
    if (p === "50") return 50; if (p === "75") return 75; if (p === "100") return 100;
    return 25;
  };
  const [zoom,          setZoom]          = useState<25 | 50 | 75 | 100>(initZoom);
  const [refImg,        setRefImg]        = useState<string | null>(null);
  const [refImgName,    setRefImgName]    = useState<string>("");
  const [compareMode,   setCompareMode]   = useState<"side-by-side" | "overlay" | null>(null);
  const [overlayOp,     setOverlayOp]     = useState(50);
  const [lastPng,       setLastPng]       = useState<string | null>(null);
  const [lastPngName,   setLastPngName]   = useState<string>("");
  const [coverStyle,    setCoverStyle]    = useState<CoverStyle>("cover01");
  const [exportingAll,       setExportingAll]       = useState(false);
  const [exportingInstagram, setExportingInstagram] = useState(false);
  const [chartDays,          setChartDays]          = useState<7 | 14 | 30>(14);
  const [matchListV2Metrics, setMatchListV2Metrics] =
    useState<Record<number, MatchListTemplate2Metrics>>(loadMatchListV2Metrics);

  const exportRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const allExportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const refInputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(MATCH_LIST_V2_METRICS_KEY, JSON.stringify(matchListV2Metrics));
    } catch (error) {
      console.warn("[social-media] Could not save Match List v2 metrics to local storage.", error);
    }
  }, [matchListV2Metrics]);

  const updateMatchListV2Metric = (
    matchId: number,
    key: keyof MatchListTemplate2Metrics,
    value: string,
  ) => {
    setMatchListV2Metrics((current) => ({
      ...current,
      [matchId]: {
        ...EMPTY_MATCH_LIST_V2_METRICS,
        ...current[matchId],
        [key]: value,
      },
    }));
  };

  /* Data fetching */
  const { data: matches = [], isLoading: lm, refetch: rm } = useQuery<TM[]>({
    queryKey: ["/api/admin/today/matches", date],
    queryFn: () => fetch(`/api/admin/today/matches?date=${date}`).then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),
  });
  const { data: coupons = [], isLoading: lc, refetch: rc } = useQuery<AC[]>({
    queryKey: ["/api/admin/today/coupons", date],
    queryFn: () => fetch(`/api/admin/today/coupons?date=${date}`).then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),
  });

  /* Chart data — last N days with actual data (not calendar days) */
  const EMPTY_CHART: ChartResponse = { days: [], periodWonLegs: 0, periodTotalLegs: 0, rangeStart: null, rangeEnd: null };
  const { data: chartResp = EMPTY_CHART, isLoading: lChart } = useQuery<ChartResponse>({
    queryKey: ["/api/admin/chart/daily-results", chartDays],
    queryFn: () => fetch(`/api/admin/chart/daily-results?lastN=${chartDays}`).then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),
    enabled: tab === "chart",
  });
  /* Normalize: handle both old array format (cached 304) and new object format */
  const chartData: DailyResult[] = Array.isArray(chartResp)
    ? (chartResp as unknown as DailyResult[])
    : (chartResp.days ?? []);
  const chartRangeLabel  = (!Array.isArray(chartResp) && chartResp.rangeStart && chartResp.rangeEnd)
    ? `${fmtShortDate(chartResp.rangeStart)} – ${fmtShortDate(chartResp.rangeEnd)}`
    : `Last ${chartDays} days`;

  const loading      = lm || lc || (tab === "chart" && lChart);
  const totalStake   = coupons.reduce((a, c) => a + c.stake, 0);
  const totalPotRet  = coupons.reduce((a, c) => a + c.stake * c.totalOdds, 0);
  const wonRet       = coupons.filter(c => c.result === "WON").reduce((a, c) => a + c.stake * c.totalOdds, 0);
  const settledStake = coupons.filter(c => c.status === "SETTLED").reduce((a, c) => a + c.stake, 0);
  const netResult    = wonRet - settledStake;

  /* Enrich coupons: distribute today_matches by matchCount when API returns empty matchNames */
  const enrichedCoupons: AC[] = (() => {
    let offset = 0;
    return coupons.map(c => {
      if (c.matchNames && c.matchNames.length > 0) { offset += c.matchCount; return c; }
      const slice = matches.slice(offset, offset + c.matchCount);
      offset += c.matchCount;
      return { ...c, matchNames: slice.map(m => `${m.homeTeam} – ${m.awayTeam}`) };
    });
  })();

  /* Build pages */
  function buildPages(): React.ReactNode[] {
    if (tab === "cover") {
      return [
        <CoverTemplate key="cover" matches={matches} coupons={enrichedCoupons}
          date={date} fmt={fmt} variant={variant} coverStyle={coverStyle} />,
      ];
    }
    if (tab === "match-v2") {
      const perPage = fmt === "post" ? 15 : 20;
      const chunks = chunk(matches, perPage);
      return chunks.map((ms, i) => (
        <MatchListTemplate2
          key={`match-list-v2-${i}`}
          matches={ms}
          date={date}
          fmt={fmt}
          variant={variant}
          metricsByMatch={matchListV2Metrics}
          totalMatches={matches.length}
          pageNumber={i + 1}
          pageCount={chunks.length}
        />
      ));
    }
    if (tab === "match") {
      const perPage = Math.max(1, matches.length);
      const chunks  = chunk(matches, perPage);
      return chunks.map((ms, i) => (
        <MacListesiTemplate key={i} matches={ms} date={date} fmt={fmt}
          variant={variant} page={i} total={chunks.length} />
      ));
    }
    if (tab === "coupon") {
      if (enrichedCoupons.length === 0) return [];
      const chunks = buildKuponChunks(enrichedCoupons);
      let startIdx = 0;
      return chunks.map((cs, i) => {
        const el = (
          <KuponTemplate key={i} coupons={cs} date={date} fmt={fmt}
            variant={variant} page={i} total={chunks.length}
            totalCoupons={enrichedCoupons.length} startIdx={startIdx} />
        );
        startIdx += cs.length;
        return el;
      });
    }
    if (tab === "chart") {
      return [<ChartTemplate key="chart" days={chartData} rangeLabel={chartRangeLabel}
        periodWonLegs={chartResp.periodWonLegs} periodTotalLegs={chartResp.periodTotalLegs}
        chartDays={chartDays} />];
    }
    if (enrichedCoupons.length === 0) return [];
    return [
      <BilançoTemplate key="b" coupons={enrichedCoupons} date={date} fmt={fmt} variant={variant} />,
    ];
  }

  /* Build all carousel pages (Cover + Matches + Coupon + Bilanço) for combined export */
  function buildAllCarouselPages(): { tag: string; node: React.ReactNode }[] {
    const out: { tag: string; node: React.ReactNode }[] = [];
    // 1. Cover
    out.push({
      tag: `01-cover`,
      node: <CoverTemplate key="ac-cover" matches={matches} coupons={enrichedCoupons}
               date={date} fmt={effectiveFmt} variant={variant} coverStyle={coverStyle} />,
    });
    // 2. Matches
    const macChunks = chunk(matches, Math.max(1, matches.length));
    macChunks.forEach((ms, i) => {
      out.push({
        tag: `02-matches${macChunks.length > 1 ? `-p${i + 1}` : ""}`,
        node: <MacListesiTemplate key={`ac-mac-${i}`} matches={ms} date={date} fmt={effectiveFmt}
                variant={variant} page={i} total={macChunks.length} />,
      });
    });
    // 3. Coupon
    if (enrichedCoupons.length > 0) {
      const kuponChunks = buildKuponChunks(enrichedCoupons);
      let si = 0;
      kuponChunks.forEach((cs, i) => {
        out.push({
          tag: `03-coupon${kuponChunks.length > 1 ? `-p${i + 1}` : ""}`,
          node: <KuponTemplate key={`ac-kup-${i}`} coupons={cs} date={date} fmt={effectiveFmt}
                  variant={variant} page={i} total={kuponChunks.length}
                  totalCoupons={enrichedCoupons.length} startIdx={si} />,
        });
        si += cs.length;
      });
    }
    // 4. Bilanço
    if (enrichedCoupons.length > 0) {
      out.push({
        tag: "04-balance",
        node: <BilançoTemplate key="ac-bil" coupons={enrichedCoupons} date={date} fmt={effectiveFmt} variant={variant} />,
      });
    }
    return out;
  }

  const pages    = buildPages();
  const safePage = Math.max(0, Math.min(previewPage, pages.length - 1));
  const resetPage = () => setPreviewPage(0);

  /* Reference image upload handler */
  const onRefImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRefImg(url);
    setRefImgName(file.name);
    setCompareMode("side-by-side");
  };

  /* Export All — Cover + Matches + Coupon + Bilanço in one ZIP */
  const doExportAll = useCallback(async () => {
    if (exporting || exportingAll) return;
    setExportingAll(true);
    // Give React time to render the offscreen all-carousel nodes
    await new Promise<void>(r => setTimeout(r, 300));
    document.body.classList.add("is-exporting");
    // Two rAF cycles after is-exporting to ensure all animations are frozen
    await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const { w, h } = DIMS[effectiveFmt];
    const fontEmbedCSS = await loadFontEmbedCSS();
    // html-to-image: actual PNG pixel size = canvasWidth × pixelRatio.
    // pixelRatio:1 → exactly w×h px output (spec requirement: "exactly 1080×1350").
    const opts = { width: w, height: h, canvasWidth: w, canvasHeight: h, pixelRatio: 1, cacheBust: true, backgroundColor: C.bg, ...(fontEmbedCSS ? { fontEmbedCSS } : {}) };
    try {
      await document.fonts.ready;
      const zip = new JSZip();
      const allPages = buildAllCarouselPages();
      for (let i = 0; i < allPages.length; i++) {
        const el = allExportRefs.current[i];
        if (!el) continue;
        await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
        await waitForImages(el);
        const url = await toPng(el, opts);
        if (url && url !== "data:,") {
          zip.file(`${allPages[i].tag}-${variant}-${fmt}.png`, url.split(",")[1], { base64: true });
        }
      }
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `bet-capitale-${date}-carousel-${variant}-${fmt}.zip`);
    } catch (err) {
      console.error("Export all error:", err);
      alert("Carousel export edilirken hata oluştu.");
    } finally {
      document.body.classList.remove("is-exporting");
      setExportingAll(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exporting, exportingAll, fmt, variant, date, matches, enrichedCoupons, coverStyle]);

  /* Export — saves first page as lastPng for in-app comparison */
  const doExport = useCallback(async () => {
    if (exporting || exportingAll || pages.length === 0) return;
    setExporting(true);
    document.body.classList.add("is-exporting");
    // Two rAF cycles after is-exporting to ensure animations are frozen
    await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const { w, h } = DIMS[effectiveFmt];
    const fontEmbedCSS = await loadFontEmbedCSS();
    // html-to-image: actual PNG pixel size = canvasWidth × pixelRatio.
    // pixelRatio:1 → exactly w×h px output (spec requirement: "exactly 1080×1350").
    const opts = {
      width: w, height: h, canvasWidth: w, canvasHeight: h,
      pixelRatio: 1, cacheBust: true, backgroundColor: C.bg,
      ...(fontEmbedCSS ? { fontEmbedCSS } : {}),
    };
    try {
      await document.fonts.ready;

      if (pages.length === 1) {
        const el = exportRefs.current[0];
        if (!el) { alert("Export node hazır değil, tekrar deneyin."); return; }
        await waitForImages(el);
        const url = await toPng(el, opts);
        if (!url || url === "data:,") { alert("Boş PNG üretildi."); return; }
        console.log(`[export] PNG size: ${w}×${h}, data length: ${url.length}`);
        setLastPng(url);
        setLastPngName(fileSlug(tab, variant, fmt, 0));
        const bytes = Uint8Array.from(atob(url.split(",")[1]), c => c.charCodeAt(0));
        downloadBlob(new Blob([bytes], { type: "image/png" }), fileSlug(tab, variant, fmt, 0));
      } else {
        const zip = new JSZip();
        for (let i = 0; i < pages.length; i++) {
          const el = exportRefs.current[i];
          if (!el) continue;
          await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
          await waitForImages(el);
          const url = await toPng(el, opts);
          if (url && url !== "data:,") {
            if (i === 0) { setLastPng(url); setLastPngName(fileSlug(tab, variant, fmt, 0)); }
            zip.file(fileSlug(tab, variant, fmt, i), url.split(",")[1], { base64: true });
          }
        }
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `bet-capitale-${date}-${tab}-${variant}-${fmt}.zip`);
      }
    } catch (err) {
      console.error("Export error:", err);
      alert("Görsel export edilirken hata oluştu.");
    } finally {
      document.body.classList.remove("is-exporting");
      setExporting(false);
    }
  }, [exporting, exportingAll, pages, fmt, tab, variant, date]);

  /* ── Instagram export: uses the existing working toPng pipeline, then
     applies Instagram colour compensation via a 2D canvas (ctx.filter).
     This avoids html-to-image rendering a CSS-filtered clone (which
     produces a blank black output due to SVG foreignObject limitations).
     The live preview and standard PNG export are never touched.          */
  const doExportInstagram = useCallback(async () => {
    if (exportingInstagram || exporting || exportingAll || pages.length === 0) return;
    const el = exportRefs.current[0];
    if (!el) { alert("Export node hazır değil, tekrar deneyin."); return; }
    setExportingInstagram(true);
    document.body.classList.add("is-exporting");
    await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const { w, h } = DIMS[effectiveFmt];
    const fontEmbedCSS = await loadFontEmbedCSS();
    const opts = {
      width: w, height: h, canvasWidth: w, canvasHeight: h,
      pixelRatio: 1, cacheBust: true, backgroundColor: C.bg,
      ...(fontEmbedCSS ? { fontEmbedCSS } : {}),
    };
    try {
      await document.fonts.ready;
      const toInstagramJpeg = (pngDataUrl: string) => new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("Canvas context unavailable")); return; }
          const { saturation, contrast, brightness } = instagramProfile;
          ctx.filter = `saturate(${saturation}) contrast(${contrast}) brightness(${brightness})`;
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", instagramProfile.jpegQuality));
        };
        img.onerror = reject;
        img.src = pngDataUrl;
      });

      if (tab === "match-v2" && pages.length > 1) {
        const zip = new JSZip();
        for (let i = 0; i < pages.length; i++) {
          const pageNode = exportRefs.current[i];
          if (!pageNode) throw new Error(`Match List v2 export page ${i + 1} is not ready`);
          await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
          await waitForImages(pageNode);
          const pngDataUrl = await toPng(pageNode, opts);
          if (!pngDataUrl || pngDataUrl === "data:,") throw new Error(`PNG page ${i + 1} could not be rendered`);
          const jpegDataUrl = await toInstagramJpeg(pngDataUrl);
          zip.file(
            fileSlug(tab, variant, fmt, i).replace(/\.png$/i, "-instagram.jpg"),
            jpegDataUrl.split(",")[1],
            { base64: true },
          );
        }
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `bet-capitale-${date}-match-list-v2-${variant}-${fmt}-instagram.zip`);
      } else {
        await waitForImages(el);
        const pngDataUrl = await toPng(el, opts);
        if (!pngDataUrl || pngDataUrl === "data:,") { alert("PNG üretilemedi."); return; }
        const jpegDataUrl = await toInstagramJpeg(pngDataUrl);
        const slug = fileSlug(tab, variant, fmt, 0).replace(/\.png$/i, "") + "-instagram.jpg";
        const bytes = Uint8Array.from(atob(jpegDataUrl.split(",")[1]), c => c.charCodeAt(0));
        downloadBlob(new Blob([bytes], { type: "image/jpeg" }), slug);
      }
    } catch (err) {
      console.error("Instagram export error:", err);
      alert("Instagram görseli export edilirken hata oluştu.");
    } finally {
      document.body.classList.remove("is-exporting");
      setExportingInstagram(false);
    }
  }, [exportingInstagram, exporting, exportingAll, pages, fmt, tab, variant, date]);

  /* Admin UI button styles */
  const tabBtn = (on: boolean): React.CSSProperties => ({
    border: "none", cursor: "pointer", width: "100%", textAlign: "left",
    padding: "10px 14px", fontSize: 13, borderRadius: 8, fontFamily: SANS, fontWeight: 700,
    background: on ? C.navy : "transparent", color: on ? "#fff" : "#5D6B7A", transition: "all .15s",
  });
  const varBtn = (on: boolean): React.CSSProperties => ({
    border: `1.5px solid ${on ? C.navy : "#E4EAEE"}`, cursor: "pointer",
    flex: 1, padding: "9px 0", fontSize: 12, borderRadius: 8, textAlign: "center",
    background: on ? C.navy : "#fff", color: on ? "#fff" : "#5D6B7A",
    fontFamily: SANS, fontWeight: 700, transition: "all .15s",
  });
  const fmtBtn = (on: boolean): React.CSSProperties => ({
    border: `1.5px solid ${on ? C.orange : "#E4EAEE"}`, cursor: "pointer",
    flex: 1, padding: "10px 0", fontSize: 12, borderRadius: 8, textAlign: "center",
    background: on ? "rgba(243,90,0,0.06)" : "#fff", color: on ? C.orange : "#5D6B7A",
    fontFamily: SANS, fontWeight: 700, transition: "all .15s",
  });
  const zoomBtn = (on: boolean): React.CSSProperties => ({
    border: `1.5px solid ${on ? C.navy : "#E4EAEE"}`, cursor: "pointer",
    flex: 1, padding: "6px 0", fontSize: 11, borderRadius: 6, textAlign: "center",
    background: on ? C.navy : "#fff", color: on ? "#fff" : "#5D6B7A",
    fontFamily: SANS, fontWeight: 700, transition: "all .15s",
  });
  const cmpBtn = (on: boolean): React.CSSProperties => ({
    border: `1.5px solid ${on ? C.orange : "#E4EAEE"}`, cursor: "pointer",
    flex: 1, padding: "7px 0", fontSize: 11, borderRadius: 6, textAlign: "center",
    background: on ? "rgba(243,90,0,0.06)" : "#fff", color: on ? C.orange : "#5D6B7A",
    fontFamily: SANS, fontWeight: 700, transition: "all .15s",
  });

  /* End Cover 2 is post-only — force post dimensions regardless of fmt selector */
  const effectiveFmt: Fmt = tab === "chart" ? "post" : (tab === "cover" && (coverStyle === "endcover2" || coverStyle === "endcover3" || coverStyle === "endcover6" || coverStyle === "cover04")) ? "post" : fmt;
  const { w: dimW, h: dimH } = DIMS[effectiveFmt];
  const previewW = Math.round(dimW * zoom / 100);
  const previewH = Math.round(dimH * zoom / 100);

  return (
    <div style={{ background: "#F4F7F8", minHeight: "100vh" }}>
      {/* Hidden ref image input */}
      <input ref={refInputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={onRefImgChange} />

      {/* Page header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E4EAEE", padding: "20px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0D1220", fontFamily: SANS }}>
              📸 Sosyal Medya İçerikleri
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6D7685", fontFamily: SANS }}>
              Günlük verilerden tek tıkla Instagram Hikâye ve Gönderi görseli üretin.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input type="date" value={date}
              onChange={e => { setDate(e.target.value); resetPage(); }}
              style={{
                border: "1.5px solid #E4EAEE", borderRadius: 8, padding: "7px 12px",
                fontSize: 13, fontWeight: 600, color: "#0D1220", outline: "none", fontFamily: SANS,
              }} />
            <button onClick={() => { rm(); rc(); }}
              style={{
                display: "flex", alignItems: "center", gap: 6, border: "1.5px solid #E4EAEE",
                borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600,
                background: "#fff", color: "#0D1220", cursor: "pointer", fontFamily: SANS,
              }}>
              <RefreshCw size={14} /> Yenile
            </button>
          </div>
        </div>

        {/* Summary bar */}
        {!loading && (
          <div style={{
            display: "flex", marginTop: 16, background: "#F4F7F8",
            borderRadius: 10, border: "1px solid #E4EAEE", overflow: "hidden",
          }}>
            {[
              { label: "MAÇ",          value: matches.length },
              { label: "KUPON",        value: coupons.length },
              { label: "TOPLAM STAKE", value: `€${fmt2(totalStake)}` },
              { label: "POT. DÖNÜŞ",  value: `€${fmt2(totalPotRet)}` },
              { label: "NET SONUÇ",    value: `${netResult >= 0 ? "+" : ""}€${fmt2(netResult)}`,
                color: netResult > 0 ? C.green : netResult < 0 ? C.red : C.navy },
            ].map((item, i, arr) => (
              <div key={i} style={{ flex: 1, padding: "10px 14px", borderRight: i < arr.length - 1 ? "1px solid #E4EAEE" : "none" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3, fontFamily: SANS }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, fontFamily: SANS, color: (item as { color?: string }).color || "#0D1220" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && matches.length === 0 && coupons.length === 0 && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "#FEF3E8", border: "1px solid rgba(243,90,0,0.25)", borderRadius: 8, fontSize: 13, color: "#C9620C", fontWeight: 600, fontFamily: SANS }}>
            Bu tarih için yayınlanmış veri bulunamadı.
          </div>
        )}
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", padding: "24px 28px", gap: 24, boxSizing: "border-box", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Left panel */}
        <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* İçerik Türü */}
          <div style={{ background: "#fff", border: "1px solid #E4EAEE", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: SANS }}>
              İçerik Türü
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {([
                { key: "cover",   label: "🎨 Cover" },
                { key: "coupon",  label: "🎫 Coupon Info" },
                { key: "match",   label: "📋 Match List" },
                { key: "match-v2", label: "Match List v2" },
                { key: "balance", label: "📊 Balance" },
                { key: "chart",   label: "📈 Chart" },
              ] as const).map(({ key, label }) => (
                <button key={key} onClick={() => { setTab(key); resetPage(); }} style={tabBtn(tab === key)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {tab === "match-v2" && (
            <div style={{ background: "#fff", border: "1px solid #E4EAEE", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: SANS }}>
                Match List v2 · Optional metrics
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 11, lineHeight: 1.5, color: "#6D7685", fontFamily: SANS }}>
                Existing match data has no metric values. Enter only verified values; empty fields stay blank in the graphic.
              </p>
              {matches.length === 0 ? (
                <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: SANS }}>No matches for this date.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: 460, overflowY: "auto" }}>
                  {matches.map((match) => {
                    const metrics = matchListV2Metrics[match.id] ?? EMPTY_MATCH_LIST_V2_METRICS;
                    return (
                      <details key={match.id} style={{ border: "1px solid #E4EAEE", borderRadius: 8, background: "#FCFDFD" }}>
                        <summary style={{
                          cursor: "pointer", padding: "9px 10px", color: "#263746",
                          fontSize: 11, fontWeight: 700, lineHeight: 1.35, fontFamily: SANS,
                        }}>
                          <span>{match.homeTeam} vs {match.awayTeam}</span>
                        </summary>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 10px 10px" }}>
                          {MATCH_LIST_V2_METRIC_FIELDS.map(({ key, label }) => (
                            <label key={key} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                              <span style={{ fontSize: 9, fontWeight: 700, color: "#81909B", fontFamily: SANS }}>{label}</span>
                              <input
                                type="text"
                                value={metrics[key]}
                                aria-label={`${label} for ${match.homeTeam} vs ${match.awayTeam}`}
                                onChange={(event) => updateMatchListV2Metric(match.id, key, event.target.value)}
                                style={{
                                  width: "100%", boxSizing: "border-box", border: "1px solid #DCE4E8",
                                  borderRadius: 6, padding: "6px 7px", outline: "none", background: "#fff",
                                  color: "#142333", fontSize: 11, fontFamily: SANS,
                                }}
                              />
                            </label>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
              )}
              <div style={{ marginTop: 10, fontSize: 10, color: "#94A3B8", fontFamily: SANS }}>
                Values are saved in this browser for reuse.
              </div>
            </div>
          )}

          {/* Cover Style Selector — only visible when tab === "cover" */}
          {tab === "cover" && (
            <div style={{ background: "#fff", border: "1px solid #E4EAEE", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: SANS }}>
                Cover Stili
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {([
                  { key: "cover01",   label: "Cover 01" },
                  { key: "cover02",   label: "Cover 02" },
                  { key: "cover03",   label: "Cover 03" },
                  { key: "cover04",   label: "Cover 04" },
                  { key: "endcover",  label: "End Cover" },
                  { key: "endcover2", label: "End Cover 2" },
                  { key: "endcover3", label: "End Cover 3" },
                  { key: "endcover6", label: "End Cover 6" },
                ] as const).map(({ key, label }) => (
                  <button key={key} onClick={() => setCoverStyle(key)} style={{
                    border: coverStyle === key ? `2px solid ${C.orange}` : "1.5px solid #E4EAEE",
                    borderRadius: 8, padding: "7px 6px",
                    fontSize: 11, fontWeight: coverStyle === key ? 800 : 600,
                    color: coverStyle === key ? C.orange : "#5D6B7A",
                    background: coverStyle === key ? C.orangeSoft : "#F8FAFC",
                    cursor: "pointer", fontFamily: SANS, textAlign: "center",
                    transition: "all .12s",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chart date range selector */}
          {tab === "chart" && (
            <div style={{ background: "#fff", border: "1px solid #E4EAEE", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: SANS }}>
                Tarih Aralığı
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {([7, 14, 30] as const).map(d => (
                  <button key={d} onClick={() => setChartDays(d)} style={{
                    flex: 1, border: chartDays === d ? `2px solid ${C.orange}` : "1.5px solid #E4EAEE",
                    borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: chartDays === d ? 800 : 600,
                    color: chartDays === d ? C.orange : "#5D6B7A",
                    background: chartDays === d ? C.orangeSoft : "#F8FAFC",
                    cursor: "pointer", fontFamily: SANS, transition: "all .12s",
                  }}>
                    {d} Gün
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: "#94A3B8", fontFamily: SANS }}>
                {chartRangeLabel}
              </div>
            </div>
          )}

          {/* Varyant */}
          <div style={{ background: "#fff", border: "1px solid #E4EAEE", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: SANS }}>Varyant</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setVariant("prematch"); resetPage(); }} style={varBtn(variant === "prematch")}>⏳ Maç Öncesi</button>
              <button onClick={() => { setVariant("result"); resetPage(); }} style={varBtn(variant === "result")}>✅ Sonuç</button>
            </div>
          </div>

          {/* Format */}
          <div style={{ background: "#fff", border: "1px solid #E4EAEE", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: SANS }}>Format</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setFmt("story"); resetPage(); }} style={fmtBtn(fmt === "story")}>
                📱 Hikâye<br /><span style={{ fontSize: 10, fontWeight: 500, opacity: 0.7 }}>1080×1920</span>
              </button>
              <button onClick={() => { setFmt("post"); resetPage(); }} style={fmtBtn(fmt === "post")}>
                🖼 Gönderi<br /><span style={{ fontSize: 10, fontWeight: 500, opacity: 0.7 }}>1080×1350</span>
              </button>
            </div>
          </div>

          {/* Zoom */}
          <div style={{ background: "#fff", border: "1px solid #E4EAEE", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: SANS }}>Zoom</div>
            <div style={{ display: "flex", gap: 6 }}>
              {([25, 50, 75, 100] as const).map(z => (
                <button key={z} onClick={() => setZoom(z)} style={zoomBtn(zoom === z)}>%{z}</button>
              ))}
            </div>
          </div>

          {/* Referans Görsel */}
          <div style={{ background: "#fff", border: "1px solid #E4EAEE", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: SANS }}>Referans Karşılaştırma</div>
            <button onClick={() => refInputRef.current?.click()}
              style={{
                width: "100%", border: "1.5px dashed #E4EAEE", borderRadius: 8, padding: "10px 0",
                fontSize: 12, fontWeight: 600, color: "#5D6B7A", background: "#F8FAFC",
                cursor: "pointer", fontFamily: SANS,
              }}>
              {refImg ? `📎 ${refImgName.slice(0, 22)}…` : "📁 Referans görsel yükle"}
            </button>
            {refImg && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <button onClick={() => setCompareMode(compareMode === "side-by-side" ? null : "side-by-side")} style={cmpBtn(compareMode === "side-by-side")}>↔ Yan yana</button>
                  <button onClick={() => setCompareMode(compareMode === "overlay" ? null : "overlay")} style={cmpBtn(compareMode === "overlay")}>⊞ Üst üste</button>
                </div>
                {compareMode === "overlay" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8", fontFamily: SANS, marginBottom: 4 }}>
                      <span>Şablon</span><span>%{overlayOp}</span><span>Referans</span>
                    </div>
                    <input type="range" min={0} max={100} value={overlayOp}
                      onChange={e => setOverlayOp(+e.target.value)}
                      style={{ width: "100%", cursor: "pointer" }} />
                  </div>
                )}
                <button onClick={() => { setRefImg(null); setCompareMode(null); }}
                  style={{ marginTop: 6, width: "100%", border: "none", borderRadius: 6, padding: "5px 0", fontSize: 11, color: "#94A3B8", background: "transparent", cursor: "pointer", fontFamily: SANS }}>
                  × Kaldır
                </button>
              </div>
            )}
          </div>

          {pages.length > 1 && (
            <div style={{ background: "#F4F7F8", border: "1px solid #E4EAEE", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#6D7685", fontFamily: SANS }}>
              <strong style={{ color: "#0D1220" }}>{pages.length} sayfa</strong> üretilecek. ZIP olarak tümünü indirebilirsiniz.
            </div>
          )}

          {/* Tüm Carousel İndir — Cover + Matches + Coupon + Bilanço */}
          <button onClick={doExportAll} disabled={exporting || exportingAll || loading}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: (exporting || exportingAll || loading) ? "#E4EAEE" : C.navy,
              color: (exporting || exportingAll || loading) ? "#94A3B8" : "#fff",
              border: "none", borderRadius: 10, padding: "12px 20px",
              fontSize: 13, fontWeight: 700,
              cursor: (exporting || exportingAll || loading) ? "default" : "pointer",
              opacity: exportingAll ? 0.7 : 1, fontFamily: SANS, transition: "all .15s",
            }}>
            <Download size={16} />
            {exportingAll ? "Carousel hazırlanıyor…" : "🗂 Tüm Carousel İndir"}
          </button>

          {/* Download */}
          <button onClick={doExport} disabled={exporting || exportingAll || pages.length === 0}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: pages.length === 0 ? "#E4EAEE" : C.orange,
              color: pages.length === 0 ? "#94A3B8" : "#fff",
              border: "none", borderRadius: 10, padding: "14px 20px",
              fontSize: 14, fontWeight: 800,
              cursor: pages.length === 0 ? "default" : "pointer",
              opacity: exporting ? 0.7 : 1, fontFamily: SANS, transition: "all .15s",
            }}>
            <Download size={18} />
            {exporting ? "İndiriliyor…" : pages.length > 1 ? `${pages.length} PNG → ZIP` : "PNG İndir"}
          </button>
          {/* Instagram Export */}
          <button
            onClick={doExportInstagram}
            disabled={exportingInstagram || exporting || exportingAll || pages.length === 0}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: pages.length === 0 ? "#E4EAEE" : "#1A1A2E",
              color: pages.length === 0 ? "#94A3B8" : "#fff",
              border: `1.5px solid ${pages.length === 0 ? "#E4EAEE" : "#E1306C"}`,
              borderRadius: 10, padding: "13px 20px",
              fontSize: 13, fontWeight: 700,
              cursor: (exportingInstagram || pages.length === 0) ? "default" : "pointer",
              opacity: exportingInstagram ? 0.7 : 1, fontFamily: SANS, transition: "all .15s",
            }}>
            <Download size={16} />
            {exportingInstagram ? "Instagram için hazırlanıyor…" : "📸 Export for Instagram"}
          </button>
          {pages.length === 0 && !loading && (
            <div style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", fontFamily: SANS }}>
              {tab === "match" || tab === "match-v2" ? "No match data for this date."
                : tab === "chart" ? "No settled coupon data for this period."
                : "No coupon data for this date."}
            </div>
          )}
        </div>

        {/* Preview panel */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ background: "#fff", border: "1px solid #E4EAEE", borderRadius: 12, padding: 24 }}>
            {/* Header row: title + scale info + page nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0D1220", fontFamily: SANS }}>Önizleme</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, fontFamily: SANS }}>
                  {dimW}×{dimH} px · %{zoom} ölçek → {previewW}×{previewH}px
                </div>
              </div>
              {pages.length > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => setPreviewPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
                    style={{ border: "1px solid #E4EAEE", borderRadius: 6, padding: "4px 10px", background: "#fff", cursor: "pointer", opacity: safePage === 0 ? 0.4 : 1 }}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0D1220", fontFamily: SANS }}>
                    {safePage + 1} / {pages.length}
                  </span>
                  <button onClick={() => setPreviewPage(p => Math.min(pages.length - 1, p + 1))} disabled={safePage >= pages.length - 1}
                    style={{ border: "1px solid #E4EAEE", borderRadius: 6, padding: "4px 10px", background: "#fff", cursor: "pointer", opacity: safePage >= pages.length - 1 ? 0.4 : 1 }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: 14, fontFamily: SANS }}>
                Yükleniyor…
              </div>
            ) : pages.length === 0 ? (
              <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: 13, textAlign: "center", background: "#F4F7F8", borderRadius: 10, border: "1px dashed #E4EAEE", fontFamily: SANS }}>
                Bu tarih için gösterilecek veri yok.
              </div>
            ) : compareMode === "side-by-side" && refImg ? (
              /* ── Side-by-side comparison ── */
              <div style={{ overflowX: "auto" }}>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start", minWidth: "fit-content" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#0D1220", fontFamily: SANS, marginBottom: 8, textAlign: "center" }}>
                      Şablon ({zoom}%)
                    </div>
                    <TemplatePreview fmt={effectiveFmt} zoom={zoom}>{pages[safePage]}</TemplatePreview>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, fontFamily: SANS, marginBottom: 8, textAlign: "center" }}>
                      Referans
                    </div>
                    <img src={refImg} alt="ref"
                      style={{
                        width: previewW, height: previewH,
                        objectFit: "contain", borderRadius: 10,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.15)", display: "block",
                      }} />
                  </div>
                </div>
              </div>
            ) : compareMode === "overlay" && refImg ? (
              /* ── Overlay comparison ── */
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <TemplatePreview fmt={effectiveFmt} zoom={zoom}>{pages[safePage]}</TemplatePreview>
                  <img src={refImg} alt="ref overlay"
                    style={{
                      position: "absolute", top: 0, left: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover", borderRadius: 10,
                      opacity: overlayOp / 100, pointerEvents: "none",
                    }} />
                </div>
              </div>
            ) : (
              /* ── Standard preview ── */
              <div style={{ overflowX: zoom > 25 ? "auto" : "visible", overflowY: zoom > 25 ? "auto" : "visible" }}>
                <div style={{ display: "flex", justifyContent: zoom > 25 ? "flex-start" : "center" }}>
                  <TemplatePreview fmt={effectiveFmt} zoom={zoom}>
                    {pages[safePage]}
                  </TemplatePreview>
                </div>
              </div>
            )}
          </div>

          {/* Last exported PNG comparison panel */}
          {lastPng && (
            <div style={{ background: "#fff", border: "1px solid #E4EAEE", borderRadius: 12, padding: 24, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0D1220", fontFamily: SANS }}>Son Export PNG</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, fontFamily: SANS }}>{lastPngName} — {dimW}×{dimH}px</div>
                </div>
                <button onClick={() => setLastPng(null)}
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", fontSize: 18, lineHeight: 1 }}>×</button>
              </div>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", overflowX: "auto" }}>
                {/* Export preview at 25% */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", fontFamily: SANS, marginBottom: 6, textAlign: "center", textTransform: "uppercase" }}>Export PNG</div>
                  <img src={lastPng} alt="export"
                    style={{
                      width: Math.round(dimW * 0.25), height: Math.round(dimH * 0.25),
                      objectFit: "contain", borderRadius: 10, display: "block",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                    }} />
                </div>
                {/* Reference side */}
                {refImg && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.orange, fontFamily: SANS, marginBottom: 6, textAlign: "center", textTransform: "uppercase" }}>Referans</div>
                    <img src={refImg} alt="ref compare"
                      style={{
                        width: Math.round(dimW * 0.25), height: Math.round(dimH * 0.25),
                        objectFit: "contain", borderRadius: 10, display: "block",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                      }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Offscreen export nodes — ALL pages rendered here (including active page).
          position:fixed keeps them outside any overflow:auto ancestor that would clip them.
          Clean render context: no parent transform, so html-to-image captures correctly.
          z-index:0 avoids the paint issue that z-index:-1 caused. */}
      {pages.map((page, i) => {
        const { w, h } = DIMS[effectiveFmt];
        return (
          <div key={i} aria-hidden="true" style={{
            position: "fixed",
            left: -(12000 + i * (w + 200)),
            top: 0,
            width: w,
            height: h,
            overflow: "hidden",
            zIndex: 0,
            pointerEvents: "none",
          }}>
            <div
              ref={el => { exportRefs.current[i] = el; }}
              style={{
                width: w, height: h,
                overflow: "hidden", transform: "none",
              }}>
              {page}
            </div>
          </div>
        );
      })}

      {/* Offscreen all-carousel nodes — rendered only during doExportAll.
          position:fixed keeps them outside overflow:auto clip regions. */}
      {exportingAll && buildAllCarouselPages().map((p, i) => {
        const { w, h } = DIMS[effectiveFmt];
        return (
          <div key={i} aria-hidden="true" style={{
            position: "fixed",
            left: -(24000 + i * (w + 200)),
            top: 0,
            width: w,
            height: h,
            overflow: "hidden",
            zIndex: 0,
            pointerEvents: "none",
          }}>
            <div
              ref={el => { allExportRefs.current[i] = el; }}
              style={{
                width: w, height: h,
                overflow: "hidden", transform: "none",
              }}>
              {p.node}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Standalone route ── */
export default function AdminSocialMediaPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F4F7F8" }}>
      <div style={{
        background: "#0D1220", color: "#fff", padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontWeight: 800, fontSize: 15, fontFamily: SANS }}>Bet Capitale Admin</span>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="/admin" style={{ color: "#94A3B8", fontSize: 13, textDecoration: "none", fontFamily: SANS }}>← Admin</a>
          <a href="/today" style={{ color: "#94A3B8", fontSize: 13, textDecoration: "none", fontFamily: SANS }}>Today ↗</a>
        </div>
      </div>
      <AdminSocialMediaContent />
    </div>
  );
}
