#!/usr/bin/env python3
"""Apply CAPITALE Software v2 UI to the exact live-v1 source snapshot.

Run against a disposable site source WORKING COPY, not /app/betcapitale/dist.
The script never builds, publishes or changes the running server by itself.
"""
from __future__ import annotations

import argparse
import re
import shutil
from pathlib import Path


def swap_once(text: str, old: str, new: str, label: str) -> str:
    n = text.count(old)
    if n != 1:
        raise RuntimeError(f"{label}: expected 1 occurrence, found {n}; refusing unsafe edit")
    return text.replace(old, new)


PREVIEW_ROWS = r'''/** Synthetic values are for preview ONLY; never persisted as genuine football evidence. */
const PREVIEW_MATCHES: SoftwareMatch[] = [
  {
    id: "preview-juventus-parma-home", date: "2026-11-22",
    kickoffAt: "2026-11-22T19:45:00Z", league: "SERIE A · DEMO FIXTURE",
    homeTeam: "Juventus", awayTeam: "Parma", market: "1X2", selection: "Juventus",
    signalCode: "V1 · V2", analystScore: 82, newsScore: 67,
    volumeShare: 84.2, drawShare: 12.8, currentOdds: 1.92, referenceOdds: 2.03,
    referenceOddsAt: "2026-11-22T10:00:00Z", currentOddsAt: "2026-11-22T13:00:00Z",
    capturedAt: null, source: "SYNTHETIC DEMO DATA — NOT LIVE", reportStatus: "complete",
    homeLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg",
    awayLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_Parma_Calcio_1913_%28adozione_2016%29.svg",
    departmentSummaries: {
      sxf: { software_detail_bullets_en: [
        "In this fictional example, 84.2% of selected-market money is on Juventus.",
        "The illustrative draw share is 12.8%, while home odds move from 2.03 to 1.92.",
        "These numbers demonstrate the interface; they are not verified SmartXFlow observations.",
      ] },
      news: { software_detail_bullets_en: [
        "This demo illustrates how a verified squad update would be explained.",
        "The final report would connect match-relevant news to the exact selection.",
        "Any contradictory reporting would be disclosed rather than ignored.",
      ] },
      analyst: { software_detail_bullets_en: [
        "A verified possession-style comparison would be summarized here.",
        "Recent three-match form would be compared against both teams' season baseline.",
        "The final point would assess opponent quality and home-versus-away performance.",
      ] },
    },
  },
  {
    id: "preview-juventus-parma-over", date: "2026-11-22",
    kickoffAt: "2026-11-22T19:45:00Z", league: "SERIE A · DEMO FIXTURE",
    homeTeam: "Juventus", awayTeam: "Parma", market: "O/U 2.5", selection: "Over 2.5",
    signalCode: "PREMIUM OVER", analystScore: 73, newsScore: 58,
    volumeShare: 77.5, drawShare: 12.8, currentOdds: 1.78, referenceOdds: 1.85,
    referenceOddsAt: "2026-11-22T10:00:00Z", currentOddsAt: "2026-11-22T13:00:00Z",
    capturedAt: null, source: "SYNTHETIC DEMO DATA — NOT LIVE", reportStatus: "complete",
    homeLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg",
    awayLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_Parma_Calcio_1913_%28adozione_2016%29.svg",
    departmentSummaries: {
      sxf: { software_detail_bullets_en: [
        "This simulated Over 2.5 selection carries 77.5% of market money.",
        "Its demonstration-only decimal odds decline from 1.85 to 1.78.",
        "This is mock flow data, not an actual published SXF signal.",
      ] },
      news: { software_detail_bullets_en: [
        "The NEWS department would assess verified events affecting goal expectation.",
        "Team availability or tactical statements would need independently verified sources.",
        "No actual Juventus–Parma news is being asserted in this preview.",
      ] },
      analyst: { software_detail_bullets_en: [
        "Real underlying attacking and defensive statistics would be reviewed.",
        "The recent three-match change in performance would be assessed in context.",
        "Opponent level and venue form would complete the three-factor report.",
      ] },
    },
  },
];

'''

DETAIL_FUNCTION = r'''function SoftwareAnalysisDetail({ row, preview }: { row: SoftwareMatch; preview: boolean }) {
  return (
    <div id={`software-detail-${row.id}`} className="software-detail-expand border-t-2 border-[#E8771F]/55 bg-[#F8F9FB] px-4 py-5 sm:px-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#E8771F]">Match details</p>
          <h3 className="mt-1 text-base font-bold text-[#0E1726]">{row.homeTeam} – {row.awayTeam}</h3>
          <p className="mt-1 text-xs text-slate-500">{row.market || "No market"}{row.selection ? ` / ${row.selection}` : ""} · {preview ? "Illustrative dataset" : "Saved department reports"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {preview && <span className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900">DEMO · NOT REAL ANALYSIS</span>}
          <span className={`rounded-md border px-2.5 py-1 text-xs font-medium ${statusTone(row.reportStatus)}`}>{STATUS_LABEL[row.reportStatus]}</span>
        </div>
      </div>
      <SoftwareBrainSequence reportKey={row.id} summaries={row.departmentSummaries} preview={preview} />
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-slate-200 pt-3 text-xs text-slate-500">
        <span><strong className="font-semibold text-slate-700">Source:</strong> {row.source || "—"}</span>
        <span><strong className="font-semibold text-slate-700">Reference odds:</strong> {row.referenceOdds?.toFixed(2) ?? "—"} · {dateTime(row.referenceOddsAt)}</span>
        <span><strong className="font-semibold text-slate-700">Current odds:</strong> {row.currentOdds?.toFixed(2) ?? "—"} · {dateTime(row.currentOddsAt)}</span>
      </div>
    </div>
  );
}

'''


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--website-root", required=True, type=Path)
    args = parser.parse_args()
    root = args.website_root.resolve()
    source_path = root / "client/src/pages/admin-software.tsx"
    comps = root / "client/src/components"
    component_src = Path(__file__).with_name("software-brain-sequence.tsx")
    css_src = Path(__file__).with_name("software-brain-sequence.css")

    if not all(p.exists() for p in [source_path, component_src, css_src]):
        raise SystemExit("Required source files missing; refusing changes.")
    src = source_path.read_text(encoding="utf-8")
    if "SoftwareBrainSequence" in src:
        raise SystemExit("v2 component already detected; refusing double integration.")

    src = swap_once(
        src,
        'import { normalizeSoftwareDetailBullets, SOFTWARE_DEPARTMENT_ORDER } from "@/lib/software-details";',
        'import { SoftwareBrainSequence } from "@/components/software-brain-sequence";',
        "component import",
    )
    src = swap_once(
        src,
        'import { Activity, BookOpen, CalendarDays, ChevronDown, ChevronUp, Clock3, FileText, RefreshCw, Search } from "lucide-react";',
        'import { CalendarDays, ChevronDown, ChevronUp, Clock3, RefreshCw, Search } from "lucide-react";',
        "icon cleanup",
    )

    start = src.index("const PREVIEW_MATCH: SoftwareMatch = {")
    end = src.index("function TeamMark(", start)
    src = src[:start] + PREVIEW_ROWS + src[end:]
    start = src.index("function SoftwareAnalysisDetail(")
    end = src.index("export default function AdminSoftware()", start)
    src = src[:start] + DETAIL_FUNCTION + src[end:]
    src = swap_once(
        src,
        'const items = previewMode ? [PREVIEW_MATCH] : data?.items ?? [];',
        'const items = previewMode ? PREVIEW_MATCHES : data?.items ?? [];',
        "preview list",
    )
    src = swap_once(
        src,
        '  const unauthorized = error?.status === 401 || error?.status === 403;',
        '  const unauthorized = error?.status === 401 || error?.status === 403;',
        "admin access remains unchanged",
    )
    src = swap_once(
        src,
        '<div className="mt-0.5 text-xs text-slate-500">{row.league || "League not specified"}{clockValue(row.kickoffAt) ? ` · ${clockValue(row.kickoffAt)}` : ""}</div>',
        '<div className="mt-0.5 text-xs text-slate-500">{row.league || "League not specified"}{clockValue(row.kickoffAt) ? ` · ${clockValue(row.kickoffAt)}` : ""}</div>\n                              {row.market && <p className="mt-0.5 text-[11px] font-medium text-slate-600">{row.market}{row.selection ? ` · ${row.selection}` : ""}</p>}\n                              {previewMode && <span className="mt-1 inline-block rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">SIMULATED DATA</span>}',
        "match subtitle",
    )
    src = src.replace("Preview animation", "Preview populated demo", 1)
    # All mutations occur on an isolated working copy; make a local backup.
    source_path.with_suffix(".tsx.before-v2").write_text(source_path.read_text(encoding="utf-8"), encoding="utf-8")
    comps.mkdir(parents=True, exist_ok=True)
    shutil.copy2(component_src, comps / component_src.name)
    shutil.copy2(css_src, comps / css_src.name)
    component_path = comps / component_src.name
    text = component_path.read_text(encoding="utf-8")
    component_path.write_text('import "./software-brain-sequence.css";\n' + text, encoding="utf-8")
    source_path.write_text(src, encoding="utf-8")
    print(f"UPDATED {source_path}; preview rows: 2; stage times: 2000/3000/4000 ms")


if __name__ == "__main__":
    main()
