#!/usr/bin/env python3
"""100 isolated Gemini API reviews of one TRUE uploaded CAPITALE Instagram creative.

Each profile is a fictional Italian male, never a real panel participant.
Uses the image bytes stored as base64 in GitHub and sends them as inline_data
to Gemini (not a text description). A profile result is stored only after
receiving and validating a genuine model response. No speculative percentages.
"""
import argparse
import base64
from collections import Counter
import datetime
import hashlib
import json
import os
from pathlib import Path
import sys
import time
import urllib.error
import urllib.request

from gemini_italy_panel import ROOT, personas, save

SOURCE = ROOT / "founder/images/DIAMO_89_from_user.webp.b64"
MODEL = "gemini-3.5-flash-lite"
YES = ["yes", "conditional", "no"]
PERCEIVED = ["yes", "uncertain", "no"]
ISSUES = ["trust", "unverified_claim", "ambiguous_offer", "overpromising",
          "copy", "visual_style", "relevance", "gambling_concerns",
          "missing_context", "other"]

FIELDS = {
    "persona_id": {"type": "STRING"},
    "stops_scroll": {"type": "STRING", "enum": YES},
    "attention_reason": {"type": "STRING"},
    "understands_offer": {"type": "STRING", "enum": PERCEIVED},
    "understood_message": {"type": "STRING"},
    "curiosity_0_10": {"type": "INTEGER"},
    "excitement_0_10": {"type": "INTEGER"},
    "feels_excited": {"type": "STRING", "enum": PERCEIVED},
    "excitement_reason": {"type": "STRING"},
    "trust_0_10": {"type": "INTEGER"},
    "believes_money_claim": {"type": "STRING", "enum": PERCEIVED},
    "believes_money_claim_reason": {"type": "STRING"},
    "believes_capitale_software_works": {"type": "STRING", "enum": PERCEIVED},
    "software_belief_reason": {"type": "STRING"},
    "profile_visit": {"type": "STRING", "enum": YES},
    "profile_visit_reason": {"type": "STRING"},
    "follow": {"type": "STRING", "enum": YES},
    "follow_reason": {"type": "STRING"},
    "telegram": {"type": "STRING", "enum": YES},
    "telegram_reason": {"type": "STRING"},
    "primary_objection": {"type": "STRING", "enum": ISSUES},
    "objection_reason": {"type": "STRING"},
    "most_noticed_visual": {"type": "STRING"},
    "needed_proof": {"type": "STRING"},
    "one_improvement": {"type": "STRING"},
    "italian_reaction": {"type": "STRING"},
}
SCHEMA = {"type": "OBJECT", "properties": FIELDS,
          "required": list(FIELDS)}
TEXT = tuple(key for key, field in FIELDS.items() if field["type"] == "STRING"
             and "enum" not in field and key != "persona_id")


def validate(response, persona_id):
    if not isinstance(response, dict) or response.get("persona_id") != persona_id:
        raise ValueError("Wrong persona ID or non-object")
    for key, field in FIELDS.items():
        if "enum" in field and response.get(key) not in field["enum"]:
            raise ValueError("Unexpected category in " + key)
        if field["type"] == "INTEGER":
            number = response.get(key)
            if type(number) is not int or not 0 <= number <= 10:
                raise ValueError("Invalid ordinal score in " + key)
    for key in TEXT:
        if not isinstance(response.get(key), str) or len(response[key].strip()) < 10:
            raise ValueError("Missing natural-language reason in " + key)
    return response


def image_bytes():
    if not SOURCE.is_file():
        raise ValueError("User-supplied image encoding missing: " + str(SOURCE))
    raw = base64.b64decode(SOURCE.read_bytes(), validate=True)
    if not raw.startswith(b"RIFF") or raw[8:12] != b"WEBP":
        raise ValueError("Encoded asset is not actual WebP image content")
    if len(raw) < 1024:
        raise ValueError("Image content is suspiciously small")
    return raw


def prompt(card):
    return (
        "This is a controlled creative-test SIMULATION, not market research. "
        "You play ONE FICTIONAL adult Italian man. You are shown an actual Instagram "
        "post IMAGE; analyze what you REALLY see in the inline image, NOT any prior "
        "description, and speak naturally in Italian. You are not a real user. "
        "Use the exact personal profile to vary your tastes but don't mechanically "
        "infer preferences from age, income, financial constraints or city. "
        "The image is CAPITALE-branded, but trust and excitement are distinct. "
        "Report separately attention within roughly 1-2 seconds; comprehension; "
        "curiosity; excitement; belief in the money claim; belief that a CAPITALE "
        "SOFTWARE system works; profile visit; follow; Telegram entry. "
        "Only judge *perceived* credibility; a static image cannot substantiate "
        "a payout, software win rate or a financial guarantee. "
        "If it contains no evidence that software works, do not hallucinate any. "
        "Never encourage viewers who do not gamble to start; never imply guaranteed "
        "profit or promote gambling as an answer to financial hardship. "
        "A strong reaction may be negative or positive, depending on the person. "
        "Don't automatically score high just because there is an orange number. "
        "Mention at least one concrete visible element, e.g. layout, typography, "
        "actual phrase, color, icons, money imagery, text hierarchy. "
        "Do not invent small text or unseen context. "
        "The post alone is not an Instagram profile or Telegram page: you cannot "
        "know what is on either destination. "
        "Choose categorical yes/conditional/no and yes/uncertain/no exactly as "
        "prescribed. Ordinal 0-10 scores are NOT probabilities or conversion rates. "
        "Do not claim these preferences are observations of actual consumers. "
        "Be independent, specific and sometimes disagree with the displayed claims. "
        "Your Italian response should be plausible, not an artificially skeptical "
        "or agreeable caricature. All text explanations should cite visual evidence. "
        "Return JSON only. Return persona_id exactly " + card["id"] + ".\n"
        "FICTIONAL PERSONA:\n" +
        json.dumps(card, ensure_ascii=False, sort_keys=True)
    )


def request(key, model, picture, instructions):
    payload = {
        "contents": [{
            "role": "user", "parts": [
                {"inline_data": {"mime_type": "image/webp",
                                 "data": base64.b64encode(picture).decode("ascii")}},
                {"text": instructions},
            ]
        }],
        "generationConfig": {"temperature": 0.8, "maxOutputTokens": 2600,
                             "responseMimeType": "application/json",
                             "responseSchema": SCHEMA},
    }
    url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent"
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode("utf-8"), method="POST",
        headers={"x-goog-api-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=130) as stream:
            info = json.load(stream)
    except urllib.error.HTTPError as error:
        raise RuntimeError("HTTP " + str(error.code)) from None
    except (urllib.error.URLError, TimeoutError):
        raise RuntimeError("Temporary network failure") from None
    try:
        raw = "".join(p.get("text", "") for p in info["candidates"][0]["content"]["parts"])
        response = json.loads(raw)
    except (ValueError, KeyError, IndexError, TypeError):
        raise RuntimeError("Unusable Gemini JSON response") from None
    usage = info.get("usageMetadata", {})
    return response, {"prompt_tokens": usage.get("promptTokenCount"),
                      "output_tokens": usage.get("candidatesTokenCount")}


def report(meta, results):
    rows = [r["answer"] for r in results]
    lines = [
        "# CAPITALE — 100 genuine Gemini requests reviewing the uploaded €89 IMAGE",
        "",
        "**Important: fictional Italian male personas only. THESE ARE NOT ACTUAL "
        "VIEWERS or objectively measured attention, trust, profit or conversion.**",
        "",
        "- Requested: %s" % meta["requested"],
        "- Actual validated responses: %s" % len(results),
        "- Incomplete: %s" % (meta["requested"] - len(results)),
        "- Model: %s" % meta["model"],
        "- Actual compressed uploaded image SHA256: %s" % meta["image_sha256"],
        "- Image dimensions are reduced for transport; visible creative content retained.",
        "",
    ]
    for field in ("stops_scroll", "understands_offer", "feels_excited",
                  "believes_money_claim", "believes_capitale_software_works",
                  "profile_visit", "follow", "telegram", "primary_objection"):
        count = Counter(r[field] for r in rows)
        lines += ["## " + field, "",
                  ", ".join("%s: %s" % (key, n) for key, n in count.most_common()) or "No verified responses.", ""]
    categories = [
        ("Excited and believes the money claim",
         lambda a: a["feels_excited"] == "yes" and a["believes_money_claim"] == "yes"),
        ("Excited but not convinced the claim is true",
         lambda a: a["feels_excited"] == "yes" and a["believes_money_claim"] != "yes"),
        ("Stopped scrolling but does not believe the software is proven",
         lambda a: a["stops_scroll"] == "yes" and
                   a["believes_capitale_software_works"] != "yes"),
        ("Will not follow",
         lambda a: a["follow"] == "no"),
    ]
    for title, condition in categories:
        lines += ["## " + title, ""]
        matching = [e for e in results if condition(e["answer"])]
        if not matching:
            lines.append("- None in completed fictional answers.")
        for e in matching:
            p, a = e["persona"], e["answer"]
            lines.append("- **%s · %s · %s (%s)**. Attention: %s; excitement %s/10; trust %s/10. "
                         "Why excited: %s. Why convinced/unconvinced: %s" %
                         (p["id"], p["name"], p["city"], p["age"],
                          a["stops_scroll"], a["excitement_0_10"], a["trust_0_10"],
                          a["excitement_reason"], a["believes_money_claim_reason"]))
        lines.append("")
    lines += ["## All individual fictional answers", ""]
    for e in results:
        p, a = e["persona"], e["answer"]
        lines += [
            "### %s %s — %s, %s, %s" %
            (p["id"], p["name"], p["age"], p["city"], p["segment"]),
            "- Scroll stop: %s — %s" % (a["stops_scroll"], a["attention_reason"]),
            "- Understands: %s — %s" % (a["understands_offer"], a["understood_message"]),
            "- Curiosity/excitement/trust: %s/%s/%s (ordinal 0-10)" %
            (a["curiosity_0_10"], a["excitement_0_10"], a["trust_0_10"]),
            "- Excited: %s — %s" % (a["feels_excited"], a["excitement_reason"]),
            "- Believes money claim: %s — %s" %
            (a["believes_money_claim"], a["believes_money_claim_reason"]),
            "- Believes CAPITALE software works: %s — %s" %
            (a["believes_capitale_software_works"], a["software_belief_reason"]),
            "- Profile visit: %s — %s" %
            (a["profile_visit"], a["profile_visit_reason"]),
            "- Follow: %s — %s" % (a["follow"], a["follow_reason"]),
            "- Telegram: %s — %s" % (a["telegram"], a["telegram_reason"]),
            "- Main objection: %s — %s" % (a["primary_objection"], a["objection_reason"]),
            "- Most noticed: %s" % a["most_noticed_visual"],
            "- Proof needed: %s" % a["needed_proof"],
            "- Improvement: %s" % a["one_improvement"],
            "- Italian reaction: %s" % a["italian_reaction"],
            "",
        ]
    lines += ["## Limitations", "",
              "- One Gemini model, independent API calls, no real survey respondents.",
              "- 100 fictional judgments are not real Italian audience behavior.",
              "- The image does not demonstrate that CAPITALE software actually works.",
              "- This experiment is not advertising-law approval or profit verification.",
              "- Missing API answers were never silently replaced or counted.",
              ""]
    return "\n".join(lines)


def run(args, client=request, sleeper=time.sleep):
    picture = image_bytes()
    cards = personas({}, 100, 7)[:args.n]
    secret = os.environ.get("GEMINI_API_KEY", "")
    if not args.dry_run and not secret:
        raise ValueError("GEMINI_API_KEY secret missing")
    folder = Path(args.out)
    folder.mkdir(parents=True, exist_ok=True)
    save(folder / "personas.json", cards)
    meta = {
        "created_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "requested": len(cards), "completed": 0, "model": args.model,
        "dry_run": args.dry_run, "image_sha256": hashlib.sha256(picture).hexdigest(),
        "source_asset": str(SOURCE.relative_to(ROOT)),
        "source_profile_file": "founder/italy_male_personas_100.json",
        "states": [], "github_run_id": os.getenv("GITHUB_RUN_ID"),
    }
    save(folder / "manifest.json", meta)
    results, errors = [], []
    try:
        if not args.dry_run:
            for index, card in enumerate(cards):
                if index:
                    sleeper(args.delay)
                pid = card["id"]
                attempts = 0
                for retry in range(3):
                    attempts += 1
                    try:
                        answer, usage = client(secret, args.model, picture, prompt(card))
                        validate(answer, pid)
                        entry = {
                            "persona": card, "answer": answer,
                            "model": args.model, "usage": usage,
                            "image_sha256": meta["image_sha256"],
                            "input_modality": "actual_image_webp_inline_data",
                        }
                        save(folder / "answers" / (pid + ".json"), entry)
                        results.append(entry)
                        meta["states"].append({"id": pid, "status": "complete",
                                               "attempts": attempts})
                        print(pid + ": authentic separate Gemini image evaluation validated", flush=True)
                        break
                    except (RuntimeError, ValueError) as error:
                        message = str(error)
                        retryable = message.startswith(("HTTP 429", "HTTP 500", "HTTP 502",
                                                       "HTTP 503", "HTTP 504", "Temporary",
                                                       "Unusable", "Missing"))
                        if retryable and retry < 2:
                            sleeper(10 * 2 ** retry)
                            continue
                        errors.append({"id": pid, "error": message,
                                       "attempts": attempts})
                        meta["states"].append({"id": pid, "status": "failed",
                                               "attempts": attempts})
                        print(pid + ": failed: " + message, flush=True)
                        break
                meta["completed"] = len(results)
                save(folder / "manifest.json", meta)
                if errors and errors[-1]["id"] == pid and errors[-1]["error"].startswith(
                    ("HTTP 429", "HTTP 400", "HTTP 401", "HTTP 403", "HTTP 404")):
                    print("Quota or model/auth failure; stop and do not invent missing answers.", flush=True)
                    break
    finally:
        meta["completed"] = len(results)
        meta["incomplete"] = len(cards) - len(results)
        save(folder / "manifest.json", meta)
        save(folder / "errors.json", errors)
        (folder / "report.md").write_text(report(meta, results), encoding="utf-8")
    print("Gemini image API responses validated: %s/%s" %
          (len(results), len(cards)), flush=True)
    return meta


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--n", type=int, choices=(10, 100), default=100)
    p.add_argument("--model", default=MODEL)
    p.add_argument("--delay", type=float, default=7)
    p.add_argument("--out", default="founder/image_runs/local")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()
    try:
        result = run(args)
        return 0 if args.dry_run or result["completed"] == result["requested"] else 1
    except (ValueError, OSError) as exc:
        print("Setup failure: " + str(exc), file=sys.stderr)
        return 2

if __name__ == "__main__":
    sys.exit(main())
