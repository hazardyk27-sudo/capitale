#!/usr/bin/env python3
"""CAPITALE synthetic Italy panel: separate Gemini API calls, not human research."""
import argparse
import collections
import csv
import datetime
import hashlib
import json
import os
from pathlib import Path
import random
import runpy
import sys
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OPTIONS = {"yes", "conditional", "no"}
TAGS = {"language", "methodology", "transparency", "telegram_value", "gambling_concerns", "trust", "other"}
NAMES = ["Marco", "Giulia", "Andrea", "Sofia", "Lorenzo", "Chiara", "Matteo", "Elisa",
         "Federico", "Martina", "Pietro", "Alessia", "Valentina", "Roberto", "Camilla",
         "Stefano", "Beatrice", "Enrico", "Noemi", "Riccardo", "Francesca", "Davide",
         "Giorgio", "Lucia", "Gabriele", "Sara", "Tommaso", "Eleonora", "Filippo", "Marta"]
SURNAMES = ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco"]
SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "persona_id": {"type": "STRING"},
        "follow": {"type": "STRING", "enum": sorted(OPTIONS)},
        "follow_reason": {"type": "STRING"},
        "telegram": {"type": "STRING", "enum": sorted(OPTIONS)},
        "telegram_reason": {"type": "STRING"},
        "primary_concern": {"type": "STRING", "enum": sorted(TAGS)},
        "main_objection": {"type": "STRING"},
        "one_improvement": {"type": "STRING"},
    },
    "required": ["persona_id", "follow", "follow_reason", "telegram",
                 "telegram_reason", "primary_concern", "main_objection", "one_improvement"],
}

def save(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def personas(customer, n, seed):
    upstream = runpy.run_path(str(ROOT / ".claude/skills/founder-consumer/panel.py"))
    cards = upstream["deal"](customer, n=n, seed=seed)
    rng = random.Random(seed)
    names = [f"{a} {b}" for b in SURNAMES for a in NAMES]
    rng.shuffle(names)
    keys = ("id", "age", "segment", "behaviour", "behaviour_how", "objection", "habit")
    result = [{**{key: card[key] for key in keys}, "name": names[i]} for i, card in enumerate(cards)]
    assert len(result) == len({c["id"] for c in result}) == n
    assert len({c["name"] for c in result}) == n
    assert all(c["age"] >= 18 for c in result)
    return result

def make_prompt(card, pitch):
    return ("You are an explicitly FICTIONAL adult Italian football viewer in a simulation. "
            "Do not claim to be a real person. Do not make up platform statistics, matches, "
            "profits, performance or things not present in the stimulus. Critically evaluate "
            "whether you would CONSIDER following this Instagram account and entering its free "
            "Telegram channel. Reply with JSON only, in Italian. Do not be artificially agreeable; "
            "be specific about distrust and why the channel may not add value. "
            "Do not advocate easy income from gambling or bypass gambling promotion rules. "
            "These are imaginary qualitative choices, NOT forecasts or probabilities.\n\n"
            "PERSONA: " + json.dumps(card, ensure_ascii=False, sort_keys=True) +
            "\n\nIDENTICAL PITCH SHOWN TO ALL PROFILES:\n" + pitch +
            "\n\nReturn persona_id exactly " + card["id"] +
            ". follow and telegram must be yes/conditional/no. "
            "Choose one main concern tag and offer one practical communication improvement.")

def request_gemini(key, model, prompt):
    if not all(c.isalnum() or c in "._-" for c in model):
        raise ValueError("Invalid model ID")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1500,
                                 "responseMimeType": "application/json",
                                 "responseSchema": SCHEMA}}
    req = urllib.request.Request(
        url, data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": key}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=90) as response:
            data = json.load(response)
    except urllib.error.HTTPError as exc:
        # Never print the server response body or the request's API key.
        raise RuntimeError("HTTP " + str(exc.code)) from None
    except (urllib.error.URLError, TimeoutError):
        raise RuntimeError("Temporary network failure") from None
    try:
        raw = "".join(part.get("text", "") for part in data["candidates"][0]["content"]["parts"])
        answer = json.loads(raw)
        usage = data.get("usageMetadata", {})
        return answer, {"prompt_tokens": usage.get("promptTokenCount"),
                        "output_tokens": usage.get("candidatesTokenCount")}
    except (KeyError, TypeError, IndexError, ValueError):
        raise RuntimeError("Unusable Gemini JSON response") from None

def verify(answer, pid):
    if not isinstance(answer, dict) or answer.get("persona_id") != pid:
        raise ValueError("Persona ID missing or mismatched")
    if answer.get("follow") not in OPTIONS or answer.get("telegram") not in OPTIONS:
        raise ValueError("Invalid follow/telegram result")
    if answer.get("primary_concern") not in TAGS:
        raise ValueError("Invalid concern tag")
    for field in ("follow_reason", "telegram_reason", "main_objection", "one_improvement"):
        if not isinstance(answer.get(field), str) or len(answer[field].strip()) < 8:
            raise ValueError("Missing meaningful " + field)
    return answer

def render_report(meta, results):
    def count(field):
        counts = collections.Counter(r["answer"][field] for r in results)
        return " · ".join(f"{k}: {counts[k]}" for k in ("yes", "conditional", "no"))
    lines = [
        "# CAPITALE — Gemini Italy Synthetic Panel", "",
        "**FICTIONAL buyer-persona simulations only. NOT real Italian consumers or predictions of real traffic, followers or Telegram joins.**",
        "",
        f"- Model: {meta['model']}",
        f"- Requested synthetic profiles: {meta['requested']}",
        f"- Separately validated Gemini API responses: {len(results)}",
        f"- Missing or failed: {meta['requested'] - len(results)}",
        f"- Dry run (no API calls): {meta['dry_run']}",
        f"- Persona seed: {meta['seed']}",
        f"- Pitch SHA256: {meta['pitch_sha256']}",
        "", "## Fictional qualitative decisions (counts only)", "",
        f"- Instagram follow: {count('follow')}",
        f"- Telegram join: {count('telegram')}",
        "", "## Generated concern categories", ""]
    tags = collections.Counter(r["answer"]["primary_concern"] for r in results)
    lines += [f"- {tag}: {num}" for tag, num in tags.most_common()]
    lines += ["", "## Audience segments", ""]
    segments = collections.Counter(r["persona"]["segment"] for r in results)
    lines += [f"- {group}: {num} completed" for group, num in segments.most_common()]
    lines += ["", "## Limitations", "",
              "- Each saved answer comes from a separate Gemini generateContent request, not a separate human or different model architecture.",
              "- All inputs share the same artificially constructed audience assumptions and pitch. Shared model bias remains possible.",
              "- No video was supplied. Reel hook and watch-through were **not evaluated**.",
              "- Actual Italian Instagram reach, conversion and legal compliance cannot be predicted from this panel.",
              "- Never use simulated quotes as testimonials or count fractions as real-world conversion rates.",
              "- If incomplete, inspect manifest.json and errors.json; absent answers were not filled in.", ""]
    return "\n".join(lines)

def run(args, client=request_gemini, sleeper=time.sleep):
    customer = json.loads((ROOT / "founder/customer.json").read_text(encoding="utf-8"))
    pitch = (ROOT / "founder/pitch.md").read_text(encoding="utf-8").strip()
    if not pitch:
        raise ValueError("Pitch is empty")
    key = os.environ.get("GEMINI_API_KEY", "")
    if not args.dry_run and not key:
        raise ValueError("GEMINI_API_KEY secret missing; no API calls were made")
    if args.delay < 0:
        raise ValueError("Delay cannot be negative")
    cards = personas(customer, args.n, args.seed)
    folder = Path(args.out)
    folder.mkdir(parents=True, exist_ok=True)
    save(folder / "personas.json", cards)
    meta = {"created_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "model": args.model, "requested": args.n, "seed": args.seed,
            "dry_run": args.dry_run,
            "pitch_sha256": hashlib.sha256(pitch.encode()).hexdigest(),
            "run_id": os.environ.get("GITHUB_RUN_ID"), "states": []}
    save(folder / "manifest.json", meta)
    results, errors = [], []
    if not args.dry_run:
        for i, card in enumerate(cards):
            if i and args.delay:
                sleeper(args.delay)
            prompt = make_prompt(card, pitch)
            state = {"id": card["id"], "status": "failed", "attempts": 0}
            for retry in range(3):
                state["attempts"] += 1
                try:
                    answer, usage = client(key, args.model, prompt)
                    verify(answer, card["id"])
                    entry = {"persona": card, "answer": answer, "usage": usage,
                             "model": args.model, "prompt_sha256": hashlib.sha256(prompt.encode()).hexdigest()}
                    save(folder / "answers" / (card["id"] + ".json"), entry)
                    results.append(entry)
                    state["status"] = "complete"
                    print(card["id"] + ": validated separate Gemini response", flush=True)
                    break
                except (RuntimeError, ValueError) as exc:
                    error = str(exc)
                    is_retryable = error.startswith(("HTTP 429", "HTTP 500", "HTTP 502", "HTTP 503",
                                                       "HTTP 504", "Temporary", "Unusable", "Missing meaningful"))
                    if retry < 2 and is_retryable:
                        sleeper(10 * 2**retry)
                        continue
                    errors.append({"id": card["id"], "error": error, "attempts": state["attempts"]})
                    print(card["id"] + ": failed (" + error + ")", flush=True)
                    break
            meta["states"].append(state)
            save(folder / "manifest.json", meta)
            if errors and errors[-1]["id"] == card["id"] and errors[-1]["error"] == "HTTP 429":
                print("Rate limit persisted; stopping rather than making up missing answers.", flush=True)
                break
    meta["completed"] = len(results)
    meta["uncompleted"] = args.n - len(results)
    save(folder / "manifest.json", meta)
    save(folder / "errors.json", errors)
    (folder / "report.md").write_text(render_report(meta, results), encoding="utf-8")
    with (folder / "responses.csv").open("w", encoding="utf-8", newline="") as fp:
        fields = ["id", "name", "segment", "follow", "telegram", "primary_concern", "follow_reason", "telegram_reason"]
        writer = csv.DictWriter(fp, fieldnames=fields)
        writer.writeheader()
        for x in results:
            card, answer = x["persona"], x["answer"]
            writer.writerow({**{"id": card["id"], "name": card["name"], "segment": card["segment"]},
                             **{key: answer[key] for key in fields[3:]}})
    return meta

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--n", type=int, choices=(10, 20, 100), default=10)
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--model", default="gemini-3.5-flash-lite")
    parser.add_argument("--out", default="founder/gemini_runs/local")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--delay", type=float, default=7.0)
    args = parser.parse_args()
    try:
        meta = run(args)
        print(f"Validated {meta['completed']}/{args.n} responses; report: {args.out}", flush=True)
        return 0 if args.dry_run or meta["completed"] == args.n else 1
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        print("Setup failure: " + str(exc), file=sys.stderr)
        return 2

if __name__ == "__main__":
    sys.exit(main())
