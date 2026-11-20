#!/usr/bin/env python3
"""Three-provider FREE-tier synthetic Italian video critique (not market research).

40 native-video Gemini, 30 Groq/Qwen vision (THREE video still frames),
30 OpenRouter/NVIDIA vision (EIGHT video still frames).
No automatic paid-model fallback. Does not treat model opinions as real viewers.
"""
import argparse
import base64
from collections import Counter
from decimal import Decimal, InvalidOperation
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request

from gemini_italy_panel import ROOT, personas, save
from gemini_reels_video_panel import (
    upload_video, delete_video, video_request, validate, summarize, PROPERTIES
)

ASSIGN_PATH = ROOT / "founder/free_multi_ai_assignments.json"
VIDEO_PATH = "founder/videos/CAPITALE_Reels_Gemini_Test.mp4"
TARGETS = {"gemini": 40, "groq": 30, "openrouter": 30}
MODELS = {
    "gemini": "gemini-3.5-flash-lite",
    "groq": "qwen/qwen3.8-27b",
    "openrouter": "nvidia/nemotron-3.5-super-vl:free",
}
KEYS = {"gemini": "GEMINI_API_KEY", "groq": "GROQ_API_KEY",
        "openrouter": "OPENROUTER_API_KEY"}
STAMPS = {"groq": (0.5, 3.0, 12.0),
          "openrouter": (0.5, 1.5, 3.0, 5.0, 9.0, 15.0, 21.0, 27.0)}
PROVIDER_ORDER = ("gemini", "groq", "openrouter")

def selection(size):
    if size not in (10, 20, 100):
        raise ValueError("Total panel size must be 10, 20 or 100")
    data = json.loads(ASSIGN_PATH.read_text(encoding="utf-8"))
    people = {x["id"]: x for x in personas({}, 100, 7)}
    records = data["assignments"]
    if len(records) != 100 or len({x["persona_id"] for x in records}) != 100:
        raise ValueError("Expected 100 unique frozen persona assignments")
    all_ids = {p["persona_id"] for p in records}
    if all_ids != set(people):
        raise ValueError("Frozen assignments don't match 100 original identities")
    expected = {"gemini": size * 40 // 100, "groq": size * 30 // 100,
                "openrouter": size * 30 // 100}
    if sum(expected.values()) != size:
        raise ValueError("Invalid cohort size")
    result = {}
    for provider in PROVIDER_ORDER:
        ids = [x["persona_id"] for x in records if x["provider"] == provider]
        if len(ids) != TARGETS[provider]:
            raise ValueError("Wrong fixed provider size: " + provider)
        result[provider] = [people[pid] for pid in ids[:expected[provider]]]
    assert sum(len(v) for v in result.values()) == size
    return result

def frames(video, output, stamps):
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    results = []
    for index, second in enumerate(stamps):
        path = output / ("frame_%02d.jpg" % index)
        command = [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-ss", str(second), "-i", str(video), "-frames:v", "1",
            "-vf", "scale=480:-2", "-q:v", "7", str(path)]
        try:
            proc = subprocess.run(command, capture_output=True, timeout=45)
        except FileNotFoundError:
            raise ValueError("FFmpeg not installed on runner") from None
        if proc.returncode or not path.is_file() or path.stat().st_size < 500:
            raise ValueError("Failed to sample actual video frame at " + str(second))
        results.append((second, path))
    return results

def stills_prompt(card, mode):
    count = len(STAMPS[mode])
    return (
        "Simulate ONE fictional adult Italian male Instagram viewer of CAPITALE's "
        "short video. Write the JSON fields in natural Italian, valid JSON only. "
        "Do not claim to be a real customer. The visual input consists of " +
        str(count) + " sampled REAL video frames WITH time labels, not the complete "
        "video/audio, so you MUST NOT invent sound, narration or missing frames. "
        "If the first seconds are represented by only sparse samples, report "
        "the potential 0-3s response cautiously. Evaluate 0-3 second attention, "
        "curiosity, excitement, whether you personally believe the SOFTWARE WORKS, "
        "trust, likely viewing duration, interest in following and Telegram separately. "
        "Model scores of 0-10 are subjective hypothetical ordinal ratings, "
        "not measured conversion or retention. A viewer may be very excited but "
        "unconvinced by the profit claim, or refuse to follow despite enjoying a Reel. "
        "Avoid generic responses. Mention a REAL visual detail visible in these samples "
        "and the timestamp when known; when not clear, say so. "
        "Profits and dashboards on screen are NOT independently verified; belief is "
        "a fictional personal reaction, NOT proof of the system working. "
        "Respect refusal; never encourage non-bettors or financially vulnerable "
        "people to gamble. Do not turn discretionary budgets into wagers. "
        "Use first_three_seconds=stops/maybe/scrolls, "
        "felt_excited and believes_software_works=yes/uncertain/no. "
        "The other yes/conditional/no and video_claims_verifiable options "
        "must follow the provided schema. The likely_dropoff category is approximate. "
        "One improvement, concrete concerns, and proof needed must be stated. "
        "Reply with persona_id EXACTLY " + card["id"] + ". "
        "PERSONA: " + json.dumps(card, ensure_ascii=False, sort_keys=True)
    )

def make_vision_parts(card, mode, samples):
    parts = [{"type": "text", "text": stills_prompt(card, mode)}]
    for second, path in samples:
        parts.append({"type": "text", "text": "Real MP4 frame at %.1fs:" % second})
        encoded = base64.b64encode(Path(path).read_bytes()).decode("ascii")
        parts.append({"type": "image_url",
                      "image_url": {"url": "data:image/jpeg;base64," + encoded}})
    return parts

def load_json_str(text):
    if not isinstance(text, str) or not text.strip():
        raise RuntimeError("Empty model completion")
    text = text.strip()
    text = re.sub(r"^"+ chr(96)*3 + r"(?:json)?\s*|\s*" + chr(96)*3 + r"$", "", text)
    try:
        result = json.loads(text)
    except ValueError:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            raise RuntimeError("Model did not return JSON") from None
        try:
            result = json.loads(match.group(0))
        except ValueError:
            raise RuntimeError("Invalid JSON response") from None
    if not isinstance(result, dict):
        raise RuntimeError("Expected one JSON object")
    return result

def api_json(url, key, payload, provider, timeout=120):
    if provider == "groq":
        header = {"Authorization": "Bearer " + key}
    elif provider == "openrouter":
        header = {"Authorization": "Bearer " + key,
                  "HTTP-Referer": "https://github.com/hazardyk27-sudo/capitale",
                  "X-Title": "CAPITALE fictional viewer study"}
    else:
        raise ValueError("Unexpected provider")
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode("utf-8"), method="POST",
        headers={**header, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as stream:
            return json.load(stream)
    except urllib.error.HTTPError as error:
        raise RuntimeError("HTTP " + str(error.code)) from None
    except (urllib.error.URLError, TimeoutError):
        raise RuntimeError("Temporary network failure") from None

def ensure_free_openrouter(key, model):
    if not model.endswith(":free"):
        raise RuntimeError("OpenRouter paid-model use prohibited")
    # Fail closed if the model catalog does not confirm zero input/output price.
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/models",
        headers={"Authorization": "Bearer " + key})
    try:
        with urllib.request.urlopen(req, timeout=40) as stream:
            models = json.load(stream).get("data", [])
    except (urllib.error.URLError, TimeoutError, ValueError):
        raise RuntimeError("Cannot verify OpenRouter free-model catalog") from None
    hits = [x for x in models if x.get("id") == model]
    if len(hits) != 1:
        raise RuntimeError("Selected OpenRouter free model unavailable")
    prices = hits[0].get("pricing", {})
    try:
        if Decimal(str(prices.get("prompt", "999"))) != 0 or Decimal(str(prices.get("completion", "999"))) != 0:
            raise RuntimeError("OpenRouter model is not currently free")
    except InvalidOperation:
        raise RuntimeError("Unknown OpenRouter model price") from None
    modalities = hits[0].get("architecture", {}).get("input_modalities", [])
    if modalities and "image" not in modalities:
        raise RuntimeError("OpenRouter selected model no longer accepts images")
    return model

def vision_response(provider, key, parts, model):
    if provider == "groq":
        if len([x for x in parts if x["type"] == "image_url"]) > 3:
            raise ValueError("Groq supports only 3 images per request")
        url = "https://api.groq.com/openai/v1/chat/completions"
    elif provider == "openrouter":
        if not model.endswith(":free"):
            raise ValueError("OpenRouter non-free model blocked")
        url = "https://openrouter.ai/api/v1/chat/completions"
    else:
        raise ValueError("Unsupported image provider")
    body = {
        "model": model,
        "messages": [{"role": "user", "content": parts}],
        "temperature": 0.6,
        "max_tokens": 2200,
    }
    response = api_json(url, key, body, provider, timeout=180)
    try:
        msg = response["choices"][0]["message"]
        content = msg["content"]
        if isinstance(content, list):
            content = "\n".join(c.get("text", "") for c in content if isinstance(c, dict))
        answer = load_json_str(content)
    except (TypeError, KeyError, IndexError):
        raise RuntimeError("Unusable API response") from None
    usage = response.get("usage", {})
    return answer, {"prompt_tokens": usage.get("prompt_tokens"),
                    "output_tokens": usage.get("completion_tokens")}, response.get("model", model)

def aggregate(meta, results):
    lines = ["# CAPITALE — free multi-AI Italian synthetic Reel panel",
             "", "**FICTIONAL PERSONAS ONLY. AI opinions are not human research, "
             "verified profit or estimates of real audience retention, interest or conversion.**", "",
             "## Verified calls (not invented)", "",
             "| Model provider | Requested | Validated | Evidence provided |",
             "|---|---:|---:|---|"]
    for provider in PROVIDER_ORDER:
        entries = [x for x in results if x["provider"] == provider]
        modality = ("Actual MP4 video+audio" if provider == "gemini" else
                    ("Only three sampled JPG frames, no audio" if provider == "groq" else
                     "Only eight sampled JPG frames, no audio"))
        lines.append("| %s | %d | %d | %s |" %
                     (provider, meta["requested_by_provider"][provider], len(entries), modality))
    lines += ["", "## Synthetic reactions by model", ""]
    for provider in PROVIDER_ORDER:
        entries = [x["answer"] for x in results if x["provider"] == provider]
        lines.append("### " + provider)
        for field in ("first_three_seconds", "felt_excited", "believes_software_works",
                      "follow", "telegram", "primary_doubt"):
            counts = Counter(x[field] for x in entries)
            lines.append("- %s: %s" % (field, ", ".join(
                "%s=%s" % (k, v) for k, v in sorted(counts.items())) or "no verified answers"))
        congruent = [x for x in entries if x["felt_excited"] == "yes"
                     and x["believes_software_works"] == "yes"]
        lines.append("- Both excited AND thinks software works: %s of %s FICTIONAL replies" %
                     (len(congruent), len(entries)))
    lines += ["", "## Detailed persona-by-persona results", ""]
    for x in results:
        p, a = x["persona"], x["answer"]
        lines += [
            "### %s — %s (%s) · %s" % (p["id"], p["name"], x["provider"], p["segment"]),
            "- First 3 seconds: %s — %s" % (a["first_three_seconds"], a["hook_reason"]),
            "- Excited: %s (%s/10) — %s" %
            (a["felt_excited"], a["excitement_0_10"], a["excitement_reason"]),
            "- Personally believes software works (NOT proof): %s — %s" %
            (a["believes_software_works"], a["trust_reason"]),
            "- Trust: %s/10; follow: %s; Telegram: %s" %
            (a["trust_0_10"], a["follow"], a["telegram"]),
            "- Potential viewing dropoff: %s; full-view interest: %s" %
            (a["likely_dropoff"], a["would_watch_to_end"]),
            "- Main doubt: %s — %s" % (a["primary_doubt"], a["main_objection"]),
            "- Memorable moment: %s" % a["most_memorable_moment"],
            "- Proof needed: %s" % a["proof_needed"],
            "- Suggested edit: %s" % a["one_edit_to_improve"],
            "",
        ]
    lines += [
        "## Limitations", "",
        "- Three distinct underlying model families (Gemini, Qwen and NVIDIA) each make isolated calls.",
        "- Different fictional people are assigned per model; do not infer causal model differences.",
        "- The media inputs DIFFER: native MP4+audio for Gemini, 3 vs 8 sampled silent images for others.",
        "- Scores 0-10 are fictional ordinal reactions, not probabilities or real retention measurements.",
        "- Budget, age, city and viewer histories are artificial; 100 opinions are not a representative poll.",
        "- A person/model believing software works cannot verify any financial claim in the Reel.",
        "- Ads laws and Instagram policy compliance require separate examination.",
    ]
    return "\n".join(lines) + "\n"

def run(args, gemini_uploader=upload_video, gemini_client=video_request,
        vision_client=vision_response, sleeper=time.sleep, frame_builder=frames,
        catalog_checker=ensure_free_openrouter, gemini_deleter=delete_video):
    video = Path(args.video)
    if not video.is_file():
        raise ValueError("Actual MP4 is missing from GitHub workspace: " + str(video))
    if video.suffix.lower() != ".mp4":
        raise ValueError("Expected .mp4")
    selected = selection(args.n)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    selected_profiles = {provider: [p["id"] for p in people] for provider, people in selected.items()}
    save(out / "selected_personas.json", selected_profiles)
    manifest = {
        "requested": args.n, "completed": 0,
        "requested_by_provider": {k: len(v) for k, v in selected.items()},
        "validated_by_provider": {k: 0 for k in PROVIDER_ORDER},
        "models": MODELS,
        "dry_run": args.dry_run,
        "video_sha256": hashlib.sha256(video.read_bytes()).hexdigest(),
        "assignments_sha256": hashlib.sha256(ASSIGN_PATH.read_bytes()).hexdigest(),
        "persona_file_sha256": hashlib.sha256(
            (ROOT / "founder/italy_male_personas_100.json").read_bytes()).hexdigest(),
        "errors": [],
    }
    save(out / "manifest.json", manifest)
    if args.dry_run:
        (out / "report.md").write_text(
            "# CAPITALE provider dry run\n\nNo API calls were made. "
            "Personas only; no user reactions exist.\n", encoding="utf-8")
        return manifest
    keys = {k: os.getenv(KEYS[k], "") for k in PROVIDER_ORDER}
    results = []
    remote_name = None
    try:
        for provider in PROVIDER_ORDER:
            candidates = selected[provider]
            if not keys[provider]:
                manifest["errors"].append({"provider": provider,
                    "error": "Secret " + KEYS[provider] + " missing; no API calls"})
                save(out / "manifest.json", manifest)
                continue
            try:
                samples = None
                if provider == "gemini":
                    remote_name, remote_uri = gemini_uploader(keys[provider], video)
                else:
                    if provider == "openrouter":
                        catalog_checker(keys[provider], MODELS[provider])
                    samples = frame_builder(video, out / ("sampled_frames_" + provider),
                                            STAMPS[provider])
                for index, card in enumerate(candidates):
                    if index:
                        sleeper(args.delay)
                    pid = card["id"]
                    err = None
                    for attempt in range(3):
                        try:
                            if provider == "gemini":
                                from gemini_reels_video_panel import make_prompt
                                prompt = make_prompt(card)
                                answer, usage = gemini_client(
                                    keys[provider], MODELS[provider], remote_uri, prompt)
                                actual_model = MODELS[provider]
                                modality = "mp4_video_audio"
                            else:
                                parts = make_vision_parts(card, provider, samples)
                                answer, usage, actual_model = vision_client(
                                    provider, keys[provider], parts, MODELS[provider])
                                modality = ("3_silent_jpg_frames" if provider == "groq"
                                            else "8_silent_jpg_frames")
                            validate(answer, pid)
                            entry = {
                                "provider": provider, "persona": card, "answer": answer,
                                "model_requested": MODELS[provider],
                                "model_reported": actual_model,
                                "input_modality": modality,
                                "video_sha256": manifest["video_sha256"],
                                "usage": usage,
                            }
                            save(out / "answers" / (pid + ".json"), entry)
                            results.append(entry)
                            manifest["validated_by_provider"][provider] += 1
                            manifest["completed"] = len(results)
                            print(provider + " " + pid + ": validated real API response", flush=True)
                            break
                        except (RuntimeError, ValueError) as failure:
                            err = str(failure)
                            retry = err.startswith(("HTTP 429", "HTTP 500", "HTTP 502",
                                                    "HTTP 503", "HTTP 504", "Temporary",
                                                    "Invalid JSON", "Unusable", "Empty", "Model did"))
                            if retry and attempt < 2:
                                sleeper(10 * (2 ** attempt))
                                continue
                            manifest["errors"].append(
                                {"provider": provider, "id": pid, "error": err,
                                 "attempts": attempt + 1})
                            print(provider + " " + pid + ": failed " + err, flush=True)
                            break
                    save(out / "manifest.json", manifest)
                    if err and err.startswith(("HTTP 429", "HTTP 401", "HTTP 403", "HTTP 404",
                                               "HTTP 402", "HTTP 400")):
                        print("Stopping provider after persistent quota/auth/model error.", flush=True)
                        break
            except (RuntimeError, ValueError) as setup_error:
                manifest["errors"].append(
                    {"provider": provider, "error": str(setup_error), "scope": "provider-setup"})
                save(out / "manifest.json", manifest)
            finally:
                if provider == "gemini" and remote_name:
                    gemini_deleter(keys[provider], remote_name)
                    remote_name = None
    finally:
        manifest["completed"] = len(results)
        save(out / "manifest.json", manifest)
        save(out / "errors.json", manifest["errors"])
        (out / "report.md").write_text(aggregate(manifest, results), encoding="utf-8")
    print("TOTAL real API evaluations validated: %d/%d" % (len(results), args.n), flush=True)
    return manifest

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--n", type=int, choices=(10, 20, 100), default=10)
    p.add_argument("--video", default=VIDEO_PATH)
    p.add_argument("--out", default="founder/free_multi_ai_runs/local")
    p.add_argument("--delay", type=float, default=10)
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()
    try:
        m = run(args)
        return 0 if args.dry_run or m["completed"] == args.n else 1
    except (RuntimeError, OSError, ValueError) as e:
        print("Panel setup failure: " + str(e), file=sys.stderr)
        return 2

if __name__ == "__main__":
    sys.exit(main())
