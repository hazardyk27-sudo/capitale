#!/usr/bin/env python3
"""Codex half of CAPITALE hybrid synthetic-persona video study.

50 separate local Codex CLI sessions authenticated with ChatGPT (no OpenAI API key).
Uses extracted video frames; unlike Gemini direct video, audio may be unavailable.
This is fictional qualitative simulation, NOT human research or an earnings audit.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

from gemini_italy_panel import ROOT, personas, save
from gemini_reels_video_panel import PROPERTIES, validate, summarize

def assigned_codex(n):
    if n not in (5, 10, 50):
        raise ValueError("Codex count must be 5, 10 or 50")
    all_people = {p["id"]: p for p in personas({}, 100, 7)}
    data = json.loads((ROOT / "founder/hybrid_panel_assignments.json").read_text(encoding="utf-8"))
    ids = [x["persona_id"] for x in data["assignments"] if x["provider"] == "codex"]
    if len(ids) != 50 or len(set(ids)) != 50 or any(i not in all_people for i in ids):
        raise ValueError("Invalid 50-person Codex cohort")
    return [all_people[i] for i in ids[:n]]

def schema():
    props = {}
    for k, v in PROPERTIES.items():
        p = {"type": "integer" if v["type"] == "INTEGER" else "string"}
        if "enum" in v:
            p["enum"] = v["enum"]
        props[k] = p
    return {"type": "object", "properties": props,
            "required": list(props), "additionalProperties": False}

def frames_for(video, folder):
    if not shutil.which("ffmpeg"):
        raise RuntimeError("Install ffmpeg to inspect actual video frames")
    folder.mkdir(parents=True, exist_ok=True)
    command = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(video),
               "-vf", "fps=1/2,scale=540:-2", "-frames:v", "20",
               str(folder / "t_%03d.jpg")]
    done = subprocess.run(command, capture_output=True, text=True, timeout=100)
    frames = sorted(folder.glob("t_*.jpg"))
    if done.returncode or len(frames) < 3:
        raise RuntimeError("Failed to extract video frames")
    return frames

def prompt_for(card, video, frames, transcript):
    audio = ("Verified supplied audio transcript: " + transcript if transcript else
             "No verified audio transcript is available. Do not invent spoken words.")
    return (
        "Evaluate a REAL CAPITALE short video as ONE FICTIONAL Italian adult male. "
        "Do not edit code or simulate other personas. Look at the actual extracted "
        "JPEG frames using your image-viewing tools; frames may omit rapid changes. "
        "The same video is used for all persons. Video: " + str(video) +
        ". Actual JPEG images: " + ", ".join(str(f) for f in frames) +
        ". Audio note: " + audio +
        ". Person: " + json.dumps(card, ensure_ascii=False, sort_keys=True) +
        ". Reply with exactly one JSON object matching the schema. persona_id must be " +
        card["id"] + ". Write prose in Italian. Report whether you stop in the first "
        "three seconds, whether you are excited, and whether you personally believe "
        "the claimed software works as SEPARATE concepts. Never treat performance "
        "screenshots as external verification, never claim to have independently "
        "validated profits. Cite visible video details and time windows when possible. "
        "Never invent unsampled frames or audio. Non-bettors are allowed to decline; "
        "do not use income or financial hardship as an inducement to gamble. "
        "All scores are hypothetical ordinal reactions, not conversion predictions."
    )

def run(args, call=subprocess.run):
    video = Path(args.video).resolve()
    if not video.is_file():
        raise ValueError("MP4 not found: " + str(video))
    cards = assigned_codex(args.n)
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    save(out / "personas.json", cards)
    vhash = hashlib.sha256(video.read_bytes()).hexdigest()
    meta = {
        "provider": "codex", "requested": args.n, "completed": 0,
        "video_sha256": vhash,
        "persona_file": "founder/italy_male_personas_100.json",
        "assignment_file": "founder/hybrid_panel_assignments.json",
        "dry_run": args.dry_run, "model": "Codex selected account model",
        "limitations": "Codex inputs are sampled MP4 frames and optional supplied transcript; Gemini inputs full MP4 with audio.",
        "states": [],
    }
    save(out / "manifest.json", meta)
    if args.dry_run:
        return meta
    if not shutil.which("codex"):
        raise RuntimeError("Install Codex CLI and sign in using ChatGPT")
    status = call(["codex", "login", "status"], cwd=ROOT,
                  capture_output=True, text=True, timeout=30)
    if status.returncode:
        raise RuntimeError("Codex CLI not authenticated; run codex login with ChatGPT")
    frames = frames_for(video, out / "frames")
    tpath = video.with_suffix(".transcript.txt")
    transcript = tpath.read_text(encoding="utf-8") if tpath.is_file() else ""
    schemafile = out / "schema.json"
    save(schemafile, schema())
    results, errors = [], []
    for card in cards:
        pid = card["id"]
        answerfile = out / "codex_raw" / (pid + ".json")
        answerfile.parent.mkdir(parents=True, exist_ok=True)
        entryfile = out / "answers" / (pid + ".json")
        if entryfile.exists():
            old = json.loads(entryfile.read_text(encoding="utf-8"))
            validate(old["answer"], pid)
            results.append(old)
            meta["states"].append({"id": pid, "status": "complete_reused"})
            meta["completed"] = len(results)
            save(out / "manifest.json", meta)
            continue
        prompt = prompt_for(card, video, frames, transcript)
        command = ["codex", "exec", "--sandbox", "read-only",
                   "--output-schema", str(schemafile),
                   "--output-last-message", str(answerfile), "-"]
        print(pid + ": starting independent Codex session", flush=True)
        try:
            done = call(command, input=prompt, cwd=ROOT,
                        capture_output=True, text=True, timeout=480)
            if done.returncode or not answerfile.exists():
                raise RuntimeError("Codex failed with exit " + str(done.returncode))
            answer = json.loads(answerfile.read_text(encoding="utf-8"))
            validate(answer, pid)
            entry = {
                "provider": "codex", "persona": card, "answer": answer,
                "video_sha256": vhash, "model": meta["model"],
                "input_modality": "video_frames_optional_transcript",
                "prompt_sha256": hashlib.sha256(prompt.encode()).hexdigest(),
            }
            save(entryfile, entry)
            results.append(entry)
            meta["states"].append({"id": pid, "status": "complete"})
            print(pid + ": validated", flush=True)
        except (RuntimeError, ValueError, OSError, subprocess.TimeoutExpired,
                json.JSONDecodeError) as exc:
            errors.append({"id": pid, "error": type(exc).__name__})
            meta["states"].append({"id": pid, "status": "failed"})
            print(pid + ": failed; not inventing a response", flush=True)
            break
        finally:
            meta["completed"] = len(results)
            save(out / "manifest.json", meta)
    save(out / "errors.json", errors)
    report_meta = {
        "requested": len(cards), "completed": len(results),
        "video_sha256": vhash, "video": str(video),
        "model": meta["model"], "dry_run": False,
        "persona_sha256": hashlib.sha256(
            (ROOT / "founder/italy_male_personas_100.json").read_bytes()).hexdigest(),
    }
    (out / "report.md").write_text(summarize(report_meta, results), encoding="utf-8")
    return meta

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--n", type=int, choices=(5, 10, 50), default=5)
    parser.add_argument("--video", default="founder/videos/CAPITALE_Reels_Gemini_Test.mp4")
    parser.add_argument("--out", default="founder/hybrid_runs/codex")
    parser.add_argument("--dry-run", action="store_true")
    opts = parser.parse_args()
    try:
        m = run(opts)
        print("Codex complete: " + str(m["completed"]) + "/" + str(m["requested"]))
        sys.exit(0 if opts.dry_run or m["completed"] == m["requested"] else 1)
    except (ValueError, RuntimeError, OSError) as exc:
        print("Codex setup error: " + str(exc), file=sys.stderr)
        sys.exit(2)
