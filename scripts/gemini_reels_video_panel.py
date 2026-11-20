#!/usr/bin/env python3
"""Independent Gemini calls over the SAME real MP4 for fictional Italian male personas.

This is NOT human audience research, evidence of actual betting returns, or conversion prediction.
Uses the Gemini Files API to upload one MP4 and reference it across model requests.
Python 3.11 standard library only; the API key stays in GitHub Actions secrets.
"""
import argparse
from collections import Counter, defaultdict
import csv
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import sys
import time
import urllib.error
import urllib.request

from gemini_italy_panel import ROOT, personas, save

CHOICES = ["yes", "conditional", "no"]
BELIEF = ["yes", "uncertain", "no"]
ATTENTION = ["stops", "maybe", "scrolls"]
DROPOFF = ["0-2s", "3-5s", "6-10s", "11-18s", "19-28s", "watches_all"]
DOUBTS = ["unverified_profits", "missing_method", "income_promises",
          "too_fast", "video_language", "presenter_authenticity",
          "missing_losses", "telegram_value", "gambling_content", "other"]

PROPERTIES = {
    "persona_id": {"type": "STRING"},
    "first_three_seconds": {"type": "STRING", "enum": ATTENTION},
    "hook_reason": {"type": "STRING"},
    "would_watch_to_end": {"type": "STRING", "enum": CHOICES},
    "likely_dropoff": {"type": "STRING", "enum": DROPOFF},
    "curiosity_0_10": {"type": "INTEGER"},
    "excitement_0_10": {"type": "INTEGER"},
    "felt_excited": {"type": "STRING", "enum": BELIEF},
    "excitement_reason": {"type": "STRING"},
    "believes_software_works": {"type": "STRING", "enum": BELIEF},
    "trust_0_10": {"type": "INTEGER"},
    "trust_reason": {"type": "STRING"},
    "video_claims_verifiable": {"type": "STRING", "enum": ["shown", "partly", "not_shown"]},
    "follow": {"type": "STRING", "enum": CHOICES},
    "follow_reason": {"type": "STRING"},
    "telegram": {"type": "STRING", "enum": CHOICES},
    "telegram_reason": {"type": "STRING"},
    "primary_doubt": {"type": "STRING", "enum": DOUBTS},
    "main_objection": {"type": "STRING"},
    "most_memorable_moment": {"type": "STRING"},
    "proof_needed": {"type": "STRING"},
    "one_edit_to_improve": {"type": "STRING"},
    "reaction_it": {"type": "STRING"},
}
SCHEMA = {"type": "OBJECT", "properties": PROPERTIES, "required": list(PROPERTIES)}
TEXT_KEYS = ["hook_reason", "excitement_reason", "trust_reason", "follow_reason",
             "telegram_reason", "main_objection", "most_memorable_moment",
             "proof_needed", "one_edit_to_improve", "reaction_it"]


def make_prompt(card):
    return (
        "You are a FICTIONAL adult Italian male football fan evaluating the attached "
        "real short vertical CAPITALE video. All fictional profiles see exactly THE SAME "
        "video, with visual frames and actual audio; independently judge it, "
        "not the author's textual summary. Answer only valid JSON in natural Italian. "
        "Your assignment is a simulated qualitative user reaction, NEVER real audience data. "
        "Pretend you encountered this Reel while scrolling Instagram in Italy. "
        "Distinguish stopping at 0-3 seconds, watching all 28 seconds, excitement/curiosity, "
        "trust in the presenter, belief that the software ACTUALLY works, interest in following "
        "the page and entering Telegram. These are DISTINCT reactions, not interchangeable. "
        "Look carefully at the text and numbers displayed and whether the content actually "
        "proves the claims; do not assume a screenshot proves real profits. "
        "If you cannot clearly hear speech, do not invent a transcript. "
        "Reference at least one specific VISIBLE video moment and timestamp. "
        "Be open to being excited AND skeptical, or neither. "
        "Do not automatically respond negatively or positively. "
        "Use the given personal context and habits for nuance, "
        "but do NOT infer gambling interest from income, region, or financial need. "
        "Former and non-bettors are never prospects to pressure into betting. "
        "Never advocate guaranteed income, gamble-as-investment or circumvent Italian policies. "
        "If the video does not substantiate software performance independently, say so; "
        "the field believes_software_works describes your hypothetical PERSONAL PERCEPTION, "
        "not objective proof. Score curiosity, excitement and trust on ordinal 0-10 "
        "(NOT probabilities, conversion rates, or scientific psychometrics). "
        "Choose likely_dropoff from 0-2s,3-5s,6-10s,11-18s,19-28s,watches_all. "
        "All other yes/conditional/no categories must be used exactly as in schema, "
        "while belief categories are yes/uncertain/no. "
        "Write 2-3 distinct sentences explaining reasons, avoid generic repetition. "
        "Persona is a hypothetical scenario, not a real survey respondent.\n"
        "FROZEN PERSONA:\n" + json.dumps(card, ensure_ascii=False, sort_keys=True) +
        "\nReturn persona_id EXACTLY " + card["id"] + "."
    )


def validate(answer, persona_id):
    if not isinstance(answer, dict) or answer.get("persona_id") != persona_id:
        raise ValueError("Invalid persona ID or response")
    for field in ("first_three_seconds", "would_watch_to_end", "felt_excited",
                  "believes_software_works", "video_claims_verifiable",
                  "follow", "telegram", "likely_dropoff", "primary_doubt"):
        if answer.get(field) not in PROPERTIES[field]["enum"]:
            raise ValueError("Invalid/missing " + field)
    for field in ("curiosity_0_10", "excitement_0_10", "trust_0_10"):
        value = answer.get(field)
        if type(value) is not int or not 0 <= value <= 10:
            raise ValueError("Expected integer 0-10 for " + field)
    for field in TEXT_KEYS:
        if not isinstance(answer.get(field), str) or len(answer[field].strip()) < 8:
            raise ValueError("Missing specific text " + field)
    return answer


def http_json(request, timeout=120):
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        raise RuntimeError("HTTP " + str(exc.code)) from None
    except (urllib.error.URLError, TimeoutError):
        raise RuntimeError("Temporary network failure") from None


def upload_video(api_key, path, sleep=time.sleep):
    """Resumable Gemini Files API upload. Returns (file name, usable URI)."""
    path = Path(path)
    if not path.is_file():
        raise ValueError("MP4 missing: " + str(path))
    if path.suffix.lower() != ".mp4" or not 1000 <= path.stat().st_size <= 100_000_000:
        raise ValueError("Video must be a nonempty MP4 up to 100 MB")
    with path.open("rb") as fp:
        if b"ftyp" not in fp.read(16):
            raise ValueError("File does not look like MP4")
    n = path.stat().st_size
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/upload/v1beta/files",
        data=json.dumps({"file": {"display_name": path.stem[:80]}}).encode("utf-8"),
        headers={"x-goog-api-key": api_key,
                 "X-Goog-Upload-Protocol": "resumable",
                 "X-Goog-Upload-Command": "start",
                 "X-Goog-Upload-Header-Content-Length": str(n),
                 "X-Goog-Upload-Header-Content-Type": "video/mp4",
                 "Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            upload_url = response.headers.get("X-Goog-Upload-URL", "")
    except urllib.error.HTTPError as exc:
        raise RuntimeError("Gemini video upload initialization HTTP " + str(exc.code)) from None
    if not upload_url.startswith("https://"):
        raise RuntimeError("Gemini video upload URL was not returned")
    # This link is supplied by Google. Do not log it (potential upload-session token).
    upload_req = urllib.request.Request(
        upload_url, data=path.read_bytes(), method="POST",
        headers={"Content-Length": str(n), "X-Goog-Upload-Offset": "0",
                 "X-Goog-Upload-Command": "upload, finalize",
                 "Content-Type": "video/mp4"})
    info = http_json(upload_req, timeout=180)["file"]
    name, uri = info.get("name"), info.get("uri")
    if not name or not uri:
        raise RuntimeError("Gemini upload did not yield a file name and URI")
    for _ in range(36):
        state = str(info.get("state", "PROCESSING")).upper()
        if state == "ACTIVE":
            return name, uri
        if state == "FAILED":
            raise RuntimeError("Gemini video file processing failed")
        sleep(5)
        get_req = urllib.request.Request(
            "https://generativelanguage.googleapis.com/v1beta/" + name,
            headers={"x-goog-api-key": api_key})
        info = http_json(get_req, timeout=30)
    raise RuntimeError("Gemini video processing timed out")


def delete_video(api_key, name):
    if not name or not name.startswith("files/"):
        return
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/" + name,
        method="DELETE", headers={"x-goog-api-key": api_key})
    try:
        with urllib.request.urlopen(req, timeout=20):
            pass
    except (urllib.error.URLError, TimeoutError):
        print("Warning: uploaded Gemini file could not be deleted immediately.", flush=True)


def video_request(api_key, model, uri, prompt):
    if not all(c.isalnum() or c in "._-" for c in model):
        raise ValueError("Invalid Gemini model name")
    body = {
        "contents": [{"parts": [
            {"file_data": {"mime_type": "video/mp4", "file_uri": uri}},
            {"text": prompt}
        ]}],
        "generationConfig": {
            "temperature": 0.8, "maxOutputTokens": 2800,
            "responseMimeType": "application/json", "responseSchema": SCHEMA,
        },
    }
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/models/" +
        model + ":generateContent",
        data=json.dumps(body).encode("utf-8"), method="POST",
        headers={"x-goog-api-key": api_key, "Content-Type": "application/json"})
    info = http_json(req, timeout=140)
    try:
        raw = "".join(p.get("text", "") for p in info["candidates"][0]["content"]["parts"])
        answer = json.loads(raw)
    except (ValueError, KeyError, TypeError, IndexError):
        raise RuntimeError("Unusable Gemini JSON response") from None
    usage = info.get("usageMetadata", {})
    return answer, {"prompt_tokens": usage.get("promptTokenCount"),
                    "output_tokens": usage.get("candidatesTokenCount")}


def summarize(meta, entries):
    a = [r["answer"] for r in entries]
    def freq(key, labels):
        c = Counter(r[key] for r in a)
        return ", ".join(f"{name}={c[name]}" for name in labels)
    def people(pred):
        yes = [r for r in entries if pred(r["answer"])]
        if not yes:
            return ["- None in completed fictional responses."]
        return [
            f"- **{r['persona']['id']} · {r['persona']['name']} ({r['persona']['age']}, "
            f"{r['persona']['city']}; {r['persona']['segment']})** — "
            f"Curiosity {r['answer']['curiosity_0_10']}/10, "
            f"excited {r['answer']['excitement_0_10']}/10, "
            f"trust {r['answer']['trust_0_10']}/10. "
            f"*Excitement:* {r['answer']['excitement_reason']} "
            f"*Trust:* {r['answer']['trust_reason']}"
            for r in yes
        ]
    body = [
        "# CAPITALE — Gemini real-video / synthetic 100-person panel", "",
        "**All participants and all reactions are FICTIONAL model simulations. "
        "A model can report perceived credibility, NOT verify the software works. "
        "No real human viewing, retention or Italian follow/Telegram conversion was measured.**", "",
        f"- Uploaded video SHA256: {meta['video_sha256']}",
        f"- Video path in workflow: {meta['video']}",
        f"- Same video sent independently to {meta['completed']} requests; requested {meta['requested']}.",
        f"- Missing/failed: {meta['requested'] - meta['completed']}",
        f"- Model: {meta['model']}; dry run: {meta['dry_run']}",
        f"- Persona file SHA256: {meta['persona_sha256']}",
        "", "## First 3 seconds", "",
        "- " + freq("first_three_seconds", ATTENTION),
        "## Hypothetical attention and emotion", "",
        "- End viewing: " + freq("would_watch_to_end", CHOICES),
        "- Excited: " + freq("felt_excited", BELIEF),
        "- Perceived software validity: " + freq("believes_software_works", BELIEF),
        "- Claim verifiability from video: " + freq("video_claims_verifiable", ["shown","partly","not_shown"]),
        "- Instagram follow: " + freq("follow", CHOICES),
        "- Telegram: " + freq("telegram", CHOICES),
        "", "## Most common reservations", "",
    ]
    for key, count in Counter(x["primary_doubt"] for x in a).most_common():
        body.append(f"- {key}: {count}")
    body += ["", "## Excited AND personally believes the software works (both YES)", ""]
    body += people(lambda r: r["felt_excited"] == "yes" and r["believes_software_works"] == "yes")
    body += ["", "## Excited, but NOT convinced it works", ""]
    body += people(lambda r: r["felt_excited"] == "yes" and r["believes_software_works"] != "yes")
    body += ["", "## Curious / stops, but NOT convinced", ""]
    body += people(lambda r: r["first_three_seconds"] == "stops" and r["believes_software_works"] != "yes")
    body += ["", "## Hypothetical immediate scrollers", ""]
    body += people(lambda r: r["first_three_seconds"] == "scrolls")
    body += ["", "## Individual detailed reactions", ""]
    for entry in entries:
        p, x = entry["persona"], entry["answer"]
        body += [
            f"### {p['id']} {p['name']} ({p['age']}, {p['city']}; {p['segment']})",
            f"- Opening: {x['first_three_seconds']}; {x['hook_reason']}",
            f"- Curiosity/excitement/trust: {x['curiosity_0_10']}/{x['excitement_0_10']}/{x['trust_0_10']} (ordinal /10 only).",
            f"- Excited: {x['felt_excited']} — {x['excitement_reason']}",
            f"- Believes the software works (perception only): {x['believes_software_works']} — {x['trust_reason']}",
            f"- Watch-to-end: {x['would_watch_to_end']}; likely dropoff: {x['likely_dropoff']}",
            f"- Follow: {x['follow']} — {x['follow_reason']}",
            f"- Telegram: {x['telegram']} — {x['telegram_reason']}",
            f"- Main issue: {x['primary_doubt']} — {x['main_objection']}",
            f"- Video moment: {x['most_memorable_moment']}",
            f"- Proof needed: {x['proof_needed']}",
            f"- Single edit: {x['one_edit_to_improve']}",
            f"- Fictional Italian reaction: {x['reaction_it']}", "",
        ]
    body += [
        "## Critical interpretation limits", "",
        "- Artificial people, fabricated life histories and shared-model biases.",
        "- All answers come from the same Gemini model in separate contexts; no real consumers watched.",
        "- Score scales are ordinal simulated judgments; never treat as retention or conversion estimates.",
        "- A positive answer to 'believes the software works' is not proof of real sports-betting performance.",
        "- Source video, visible UI and narrator are not independently verified data.",
        "- Italian advertising and gambling-promotion regulations require independent compliance review.",
        "- This test does not demonstrate Meta recommendation eligibility, view-through, reach or real clicks.",
        "- For actual effectiveness, measure Reels audience retention, genuine comments, Italian reach and follow behavior.",
    ]
    return "\n".join(body) + "\n"


def run(args, client=video_request, uploader=upload_video, deleter=delete_video,
        sleeper=time.sleep):
    path = Path(args.video)
    if not path.is_file():
        raise ValueError("Video is not available to runner: " + str(path))
    key = os.environ.get("GEMINI_API_KEY", "")
    if not args.dry_run and not key:
        raise ValueError("GEMINI_API_KEY missing; no Gemini API calls were made")
    if args.delay < 0:
        raise ValueError("Delay must be non-negative")
    cards = personas({}, args.n, args.seed)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    save(out / "personas.json", cards)
    meta = {
        "run_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
        "requested": len(cards), "completed": 0, "model": args.model,
        "video": str(path), "video_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "persona_sha256": hashlib.sha256(
            (ROOT / "founder/italy_male_personas_100.json").read_bytes()).hexdigest(),
        "dry_run": args.dry_run, "seed": args.seed, "responses": [],
        "github_run": os.getenv("GITHUB_RUN_ID"),
    }
    save(out / "manifest.json", meta)
    results, errors = [], []
    remote_name = None
    try:
        if not args.dry_run:
            remote_name, remote_uri = uploader(key, path)
            print("Gemini video uploaded and ready; processing separate personas.", flush=True)
            for i, card in enumerate(cards):
                if i and args.delay:
                    sleeper(args.delay)
                attempts = 0
                for retry in range(3):
                    attempts += 1
                    try:
                        prompt = make_prompt(card)
                        answer, usage = client(key, args.model, remote_uri, prompt)
                        validate(answer, card["id"])
                        entry = {"persona": card, "answer": answer, "usage": usage,
                                 "model": args.model, "video_sha256": meta["video_sha256"],
                                 "prompt_sha256": hashlib.sha256(prompt.encode()).hexdigest()}
                        save(out / "answers" / (card["id"] + ".json"), entry)
                        results.append(entry)
                        meta["responses"].append({"id": card["id"], "status": "complete",
                                                  "attempts": attempts})
                        print(f"{card['id']}: video-based Gemini JSON validated", flush=True)
                        break
                    except (RuntimeError, ValueError) as exc:
                        error = str(exc)
                        retryable = error.startswith(("HTTP 429", "HTTP 500", "HTTP 502",
                                                     "HTTP 503", "HTTP 504",
                                                     "Temporary", "Unusable"))
                        if retryable and retry < 2:
                            sleeper(10 * (2 ** retry))
                            continue
                        errors.append({"id": card["id"], "status": "failed",
                                       "attempts": attempts, "error": error})
                        meta["responses"].append({"id": card["id"], "status": "failed",
                                                  "attempts": attempts})
                        print(f"{card['id']}: {error}; no synthetic replacement", flush=True)
                        break
                meta["completed"] = len(results)
                save(out / "manifest.json", meta)
                if errors and errors[-1]["id"] == card["id"] and (
                    errors[-1]["error"] == "HTTP 429" or
                    errors[-1]["error"].startswith(("HTTP 400", "HTTP 401", "HTTP 403", "HTTP 404"))
                ):
                    print("Stopping on persistent rate/auth/model error.", flush=True)
                    break
    finally:
        if remote_name:
            deleter(key, remote_name)
    meta["completed"] = len(results)
    meta["incomplete"] = args.n - len(results)
    save(out / "manifest.json", meta)
    save(out / "errors.json", errors)
    (out / "report.md").write_text(summarize(meta, results), encoding="utf-8")
    fields = ["id", "name", "age", "city", "segment", "first_three_seconds",
              "would_watch_to_end", "curiosity_0_10", "excitement_0_10",
              "felt_excited", "believes_software_works", "trust_0_10",
              "follow", "telegram", "primary_doubt", "excitement_reason",
              "trust_reason", "hook_reason", "main_objection",
              "one_edit_to_improve"]
    with (out / "responses.csv").open("w", newline="", encoding="utf-8") as fp:
        writer = csv.DictWriter(fp, fieldnames=fields)
        writer.writeheader()
        for r in results:
            d = {**r["persona"], **r["answer"]}
            writer.writerow({f: d.get(f, "") for f in fields})
    print(f"Real video Gemini responses: {len(results)}/{args.n}. Output {out}", flush=True)
    return meta


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--video", default="founder/videos/CAPITALE_Reels_Gemini_Test.mp4")
    p.add_argument("--n", type=int, choices=[10, 20, 100], default=10)
    p.add_argument("--model", default="gemini-3.5-flash-lite")
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--delay", type=float, default=7.0)
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--out", default="founder/video_runs/local")
    a = p.parse_args()
    try:
        meta = run(a)
        return 0 if meta["dry_run"] or meta["completed"] == a.n else 1
    except (ValueError, RuntimeError, OSError) as exc:
        print("Video test failed: " + str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
