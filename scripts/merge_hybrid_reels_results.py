#!/usr/bin/env python3
"""Merge CAPITALE Gemini + Codex fictional video-panel responses without invented counts."""
import argparse
from collections import Counter
import json
from pathlib import Path
import sys

from gemini_italy_panel import ROOT, save
from gemini_reels_video_panel import validate

FIELDS = ("first_three_seconds", "would_watch_to_end", "felt_excited",
          "believes_software_works", "follow", "telegram", "primary_doubt")

def read_provider(folder, provider, assignment):
    path = Path(folder)
    answers = path / "answers"
    entries = []
    if not answers.is_dir():
        return entries
    for file in sorted(answers.glob("P*.json")):
        record = json.loads(file.read_text(encoding="utf-8"))
        persona, ans = record["persona"], record["answer"]
        pid = persona["id"]
        if assignment.get(pid) != provider:
            raise ValueError("Unexpected persona-provider combination: " + pid)
        validate(ans, pid)
        entries.append({"provider": provider, "persona": persona, "answer": ans,
                        "video_sha256": record.get("video_sha256")})
    return entries

def merge(gemini_dir, codex_dir, out):
    data = json.loads((ROOT / "founder/hybrid_panel_assignments.json").read_text(encoding="utf-8"))
    assigned = {x["persona_id"]: x["provider"] for x in data["assignments"]}
    if len(assigned) != 100:
        raise ValueError("Exactly 100 assigned personas are required")
    gems = read_provider(gemini_dir, "gemini", assigned)
    cods = read_provider(codex_dir, "codex", assigned)
    both = gems + cods
    ids = [e["persona"]["id"] for e in both]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate persona answered across providers")
    hashes = {e["video_sha256"] for e in both}
    if None in hashes or len(hashes) > 1:
        raise ValueError("Video files do not have the same SHA256; cannot pool results")
    if len(gems) > 50 or len(cods) > 50:
        raise ValueError("Too many completed responses for a provider")
    output = Path(out)
    output.mkdir(parents=True, exist_ok=True)
    save(output / "combined_answers.json", both)
    status = {
        "requested": 100, "completed": len(both),
        "gemini": len(gems), "codex": len(cods),
        "missing_gemini": 50 - len(gems), "missing_codex": 50 - len(cods),
        "video_sha256": next(iter(hashes)) if hashes else None,
        "full_panel_validated": len(gems) == 50 and len(cods) == 50,
        "missing_ids": sorted(set(assigned) - set(ids)),
    }
    save(output / "manifest.json", status)
    lines = [
        "# CAPITALE — 50 Gemini / 50 Codex synthetic video panel", "",
        "**Fictional user simulations, NOT genuine Italian users, validated profit claims,"
        " measured video retention or follower conversion rates.**", "",
        f"- Requested: 100 (Gemini 50 / Codex 50).",
        f"- Completed: {len(both)} (Gemini {len(gems)} / Codex {len(cods)}).",
        f"- Missing: {len(status['missing_ids'])}.",
        f"- Shared MP4 SHA256: {status['video_sha256'] or 'unavailable'}",
        "", "## Per-model hypothetical reaction counts", "",
        "| Reaction | Gemini (completed) | Codex (completed) |",
        "|---|---|---|",
    ]
    for field in FIELDS:
        gv = Counter(e["answer"][field] for e in gems)
        cv = Counter(e["answer"][field] for e in cods)
        fmt = lambda c: ", ".join(f"{key}={count}" for key, count in sorted(c.items())) or "none"
        lines.append(f"| {field} | {fmt(gv)} | {fmt(cv)} |")
    lines += ["", "## Excited AND says he believes the software works", ""]
    for provider, group in (("Gemini", gems), ("Codex", cods)):
        subset = [e for e in group if e["answer"]["felt_excited"] == "yes"
                  and e["answer"]["believes_software_works"] == "yes"]
        lines.append(f"### {provider}: {len(subset)}/{len(group)} fictional responses")
        for entry in subset:
            p, a = entry["persona"], entry["answer"]
            lines.append(f"- {p['id']} {p['name']} ({p['age']}, {p['city']}): "
                         f"excitement {a['excitement_0_10']}/10, trust {a['trust_0_10']}/10 "
                         f"— {a['trust_reason']}")
        if not subset:
            lines.append("- None")
    lines += [
        "", "## Interpretation", "",
        "- Gemini received the actual MP4, including audio, while Codex reviewed regularly"
          " extracted frames; audio is included only if an accurate supplied transcript exists."
          " Comparability of media exposure is therefore limited.",
        "- The 50 and 50 fictional personas are different, although balanced by persona segment;"
          " any model differences are confounded by persona assignment and input modality.",
        "- These are two models' synthetic *perceptions*, not the belief or intention of real consumers.",
        "- Perceived software success does not verify net gains, predictions or performance claims.",
        "- Do not represent numerical rates as real-world view/engagement/follow predictions.",
        "- Real-video audience analytics and verified underlying performance records are needed.",
        "", "## Completion", "",
        "Panel complete" if status["full_panel_validated"] else
        "PARTIAL ONLY — uncompleted persona responses were not invented or counted.",
    ]
    (output / "combined_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return status

if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--gemini-dir", required=True)
    p.add_argument("--codex-dir", required=True)
    p.add_argument("--out", default="founder/hybrid_runs/combined")
    args = p.parse_args()
    try:
        s = merge(args.gemini_dir, args.codex_dir, args.out)
        print("Validated hybrid model results: " + str(s["gemini"]) + " Gemini / " +
              str(s["codex"]) + " Codex.")
        sys.exit(0 if s["full_panel_validated"] else 1)
    except (ValueError, OSError, KeyError, json.JSONDecodeError) as exc:
        print("Merge failed: " + str(exc), file=sys.stderr)
        sys.exit(2)
