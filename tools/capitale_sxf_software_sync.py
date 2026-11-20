#!/usr/bin/env python3
"""CAPITALE: source-verified SXF FINAL_SIGNAL -> Software board.
Runs only on the authorized server with PRIVATE environment credentials.
No user token, no GPT Action. Default DRY RUN; --commit is an explicit write.
Never invents fixtures, choices, events, source time, snapshot, odds or money.
All submitted report data derives from original SXF engine event records.
"""
from __future__ import annotations

import argparse
from collections import defaultdict
from datetime import datetime, timedelta, timezone
import hashlib
import json
import os
from pathlib import Path
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid

ENV = Path("/app/betcapitale/.env")
API_HEADERS = {}
ENGINE_GROUP = {
    "1X2_CONCENTRATION_V1": "MOM",
    "1X2_CONCENTRATION_V2": "MOM",
    "HEAVY_1X2_CONCENTRATION": "MOM",
    "BTTS_YES": "MOM",
    "STABLE_OVER_2_5": "CRL",
    "PREMIUM_OVER_2_5": "PRM",
    "SURPRISE_TEAM": "CRL",
}
ROLE = "sxf"
TIMESTAMP_FORMAT = "%Y-%m-%dT%H:%M:%SZ"


class ImportRejected(Exception):
    pass


def utc(value):
    if not value:
        raise ImportRejected("A source timestamp is missing")
    try:
        result = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if not result.tzinfo:
            raise ValueError("timezone-less timestamp")
        return result.astimezone(timezone.utc)
    except (ValueError, AttributeError) as exc:
        raise ImportRejected("Invalid timestamp in source record") from exc


def iso(value):
    return value.astimezone(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def sha(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def number(value, minimum=None, maximum=None):
    if value is None or isinstance(value, bool):
        return None
    try:
        n = float(value)
        if not __import__("math").isfinite(n):
            return None
        if minimum is not None and n < minimum:
            return None
        if maximum is not None and n > maximum:
            return None
        return n
    except (TypeError, ValueError):
        return None


def config():
    env = {}
    for line in ENV.read_text(encoding="utf-8").splitlines():
        if line.strip() and not line.lstrip().startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            env[key.strip()] = value.strip().strip("\"").strip("'")
    url = env.get("CAPITALE_SUPABASE_URL", "").rstrip("/")
    key = env.get("CAPITALE_SUPABASE_SERVICE_ROLE_KEY", "")
    token = env.get("CAPITALE_AGENT_SXF_TOKEN", "")
    if not url.startswith("https://") or len(key) < 30 or len(token) < 32:
        raise ImportRejected("Private server database/role configuration is missing")
    return url, key, token


def rest(url, key, method, resource, params=None, body=None, profile="public"):
    path = "/rest/v1/" + resource.lstrip("/")
    if params:
        path += "?" + urllib.parse.urlencode(params, safe="(),.*:-_", doseq=True)
    raw = json.dumps(body, ensure_ascii=False, separators=(",", ":")).encode() if body is not None else None
    headers = {
        "apikey": key, "Authorization": "Bearer " + key,
        "Accept": "application/json", "Accept-Profile": profile,
        "Content-Profile": profile, "Content-Type": "application/json",
    }
    req = urllib.request.Request(url + path, data=raw, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=25) as response:
            return response.status, json.load(response)
    except urllib.error.HTTPError as exc:
        raise ImportRejected(f"Private database request failed with HTTP {exc.code} ({resource.split('?')[0]})") from None
    except (TimeoutError, urllib.error.URLError):
        raise ImportRejected("Private database request unavailable") from None


def snapshot(url, key, uid, market, selection, at):
    params = {
        "select": "odds,share,scraped_at_utc",
        "fixture_uid": "eq." + uid,
        "market": "eq." + market,
        "selection": "eq." + selection,
        "scraped_at_utc": "lte." + iso(at),
        "order": "scraped_at_utc.desc",
        "limit": "1",
    }
    _, rows = rest(url, key, "GET", "moneyway_snapshots", params=params)
    if not rows:
        return None
    row = rows[0]
    if utc(row["scraped_at_utc"]) > at:
        raise ImportRejected("Future moneyway snapshot detected")
    return row


def candidates(url, key, now, hours):
    params = {
        "select": "event_id,event_key,fixture_uid,kickoff_utc,engine,kind,market,selection,details,recorded_at,job_checkpoint_hours,source_checkpoint_hours,ruleset_version",
        "kind": "eq.FINAL_SIGNAL",
        "job_checkpoint_hours": "in.(6,8)",
        "kickoff_utc": "gt." + iso(now),
        "and": "(kickoff_utc.lt." + iso(now + timedelta(hours=hours)) + ")",
        "order": "recorded_at.asc",
        "limit": "1000",
    }
    # PostgREST accepts two comparisons on a column via repeated keys.
    params.pop("and")
    pairs = list(params.items()) + [("kickoff_utc", "lt." + iso(now + timedelta(hours=hours)))]
    _, events = rest(url, key, "GET", "sxf_base_signal_events", params=pairs)
    uids = sorted({e["fixture_uid"] for e in events if e.get("fixture_uid")})
    if not uids:
        return [], {}
    if len(uids) > 400:
        raise ImportRejected("Too many fixtures for bounded import; narrow --hours")
    _, fixtures = rest(url, key, "GET", "fixtures", params={
        "select": "fixture_uid,home_team,away_team,league,kickoff_utc",
        "fixture_uid": "in.(" + ",".join(uids) + ")",
        "limit": "500",
    })
    return events, {f["fixture_uid"]: f for f in fixtures}


def make_groups(events, fixtures, now, max_groups):
    accepted = defaultdict(lambda: defaultdict(list))
    skips = defaultdict(int)
    for e in events:
        engine, kind, uid = e.get("engine"), e.get("kind"), e.get("fixture_uid")
        details = e.get("details") or {}
        if kind != "FINAL_SIGNAL" or engine not in ENGINE_GROUP or uid not in fixtures:
            skips["inactive_engine_or_fixture"] += 1
            continue
        h = e.get("job_checkpoint_hours")
        if h not in (6, 8) or e.get("source_checkpoint_hours") != h:
            skips["invalid_checkpoint"] += 1
            continue
        fixture = fixtures[uid]
        kickoff = utc(fixture["kickoff_utc"])
        cutoff = kickoff - timedelta(hours=h)
        if kickoff <= now or cutoff > now:
            skips["not_prematch_or_checkpoint_future"] += 1
            continue
        if utc(e["kickoff_utc"]) != kickoff:
            skips["fixture_kickoff_mismatch"] += 1
            continue
        if not isinstance(details, dict) or details.get("selection_status") != "ELIGIBLE":
            skips["not_eligible"] += 1
            continue
        if utc(details.get("observed_at")) > cutoff:
            skips["snapshot_after_decision"] += 1
            continue
        odds = number(details.get("odds"), 1.30, 10000)
        money = number(details.get("share"), 0, 100)
        amount = number(details.get("amount"), 0)
        if odds is None or money is None or amount is None:
            skips["missing_required_market_data"] += 1
            continue
        market, side = e.get("market"), e.get("selection")
        if (market, side) not in (("1X2", "1"), ("1X2", "2"), ("OU25", "O"), ("BTTS", "Y")):
            skips["unexpected_market_or_side"] += 1
            continue
        if details.get("side") != side:
            skips["selection_inconsistency"] += 1
            continue
        if details.get("engine") != engine or details.get("checkpoint") != h:
            skips["engine_checkpoint_inconsistency"] += 1
            continue
        accepted[(uid, h)][(market, side)].append(e)
    good = []
    for group_key, by_pick in accepted.items():
        # One board record per verified fixture and checkpoint. Never silently discard
        # a second different market/choice until multi-selection board projection is live.
        if len(by_pick) != 1:
            skips["multiple_picks_require_expanded_board"] += 1
            continue
        (market, side), found = next(iter(by_pick.items()))
        if len(good) >= max_groups:
            skips["capacity_guard"] += 1
            continue
        # Exact source event key dedup: latest event wins per original key.
        unique = {e["event_key"]: e for e in found}
        found = sorted(unique.values(), key=lambda e: e["event_id"])
        good.append((group_key, market, side, found, fixtures[group_key[0]]))
    return sorted(good, key=lambda x: (x[4]["kickoff_utc"], x[0][0])), dict(skips)


def report_for(url, key, group):
    (uid, horizon), market, side, events, fixture = group
    kickoff = utc(fixture["kickoff_utc"])
    cutoff = kickoff - timedelta(hours=horizon)
    primary = max(events, key=lambda e: (
        {"PREMIUM_OVER_2_5": 6, "1X2_CONCENTRATION_V2": 5,
         "HEAVY_1X2_CONCENTRATION": 4, "1X2_CONCENTRATION_V1": 3}.get(e["engine"], 1),
        e["event_id"]))
    engines = sorted({e["engine"] for e in events})
    code = ENGINE_GROUP[primary["engine"]]
    details = primary["details"]
    observed = utc(details["observed_at"])
    # Prefer T-8 for an authoritative T-6 signal, or T-12 for T-8.
    reference_at = kickoff - timedelta(hours=(8 if horizon == 6 else 12))
    ref = snapshot(url, key, uid, market, side, reference_at)
    draw = snapshot(url, key, uid, "1X2", "X", cutoff)
    price = number(details["odds"], 1.001, 10000)
    money = number(details["share"], 0, 100)
    amount = number(details["amount"], 0)
    base_price = number(ref.get("odds"), 1.001, 10000) if ref else None
    draw_share = number(draw.get("share"), 0, 100) if draw else None
    watch_only = engines == ["SURPRISE_TEAM"]
    label = {"1": fixture["home_team"], "2": fixture["away_team"],
             "O": "Over 2.5", "Y": "BTTS Yes"}[side]
    if watch_only:
        label = "SURPRISE watch: " + label
    bullets = [
        f"Verified {', '.join(engines)} at T-{horizon} for {market} / {side}; source snapshot {iso(observed)}.",
        f"SmartXFlow money share {money:g}% and selected amount £{amount:,.2f} at the verified checkpoint.",
    ]
    if base_price is not None:
        change = (price - base_price) * 100.0 / base_price
        bullets.append(f"Price moved {change:+.1f}% from the verified {iso(utc(ref['scraped_at_utc']))} reference to T-{horizon}.")
    elif watch_only:
        bullets.append("SURPRISE is an informational market signal, not a direct win recommendation.")
    else:
        bullets.append(f"Verified SXF checkpoint odds were {price:g}; earlier reference odds were unavailable.")
    bullets = bullets[:3]
    original = [
        {"event_id": e["event_id"], "event_key": e["event_key"], "engine": e["engine"],
         "market": e["market"], "selection": e["selection"],
         "details": e["details"], "recorded_at": e["recorded_at"],
         "ruleset_version": e["ruleset_version"]} for e in events
    ]
    source_hash = sha(original)
    display = {
        "market": market, "selection": side, "selection_label": label,
        "signal_code": f"{code}-{horizon}", "engine_tags": engines,
        "checkpoint_used": f"T-{horizon}", "watch_only": watch_only,
        "volume_share_pct": money, "draw_share_pct": draw_share,
        "current_odds": price, "reference_odds": base_price,
        "reference_odds_at": iso(utc(ref["scraped_at_utc"])) if ref else None,
        "current_odds_at": iso(observed),
        "source": "SmartXFlow verified FINAL_SIGNAL",
        "software_detail_bullets_en": bullets,
    }
    payload = {
        "display": display,
        "source_fixture_uid": uid, "kickoff_utc": iso(kickoff),
        "as_of_utc": iso(cutoff), "scan_mode": "CHECKPOINT_DAILY_T6_FALLBACK_T8",
        "source_snapshot_hash": source_hash,
        "status": "VERIFIED_ACTIVE" if not watch_only else "WATCH_ONLY_SURPRISE",
        "engine_events": original,
        "source_material": {"price_reference": ref, "draw_snapshot": draw},
    }
    summary = (
        f"SXF: {fixture['home_team']} – {fixture['away_team']} | "
        f"{market}/{side} | {code}-{horizon}; engines: {', '.join(engines)}. "
        + ("SURPRISE only, not direct win selection." if watch_only else "Verified active signal.")
    )
    evidence = [
        {
            "source_kind": "smartxflow_engine_event",
            "source_name": f"SXF Signal Motor / event {e['event_id']}",
            "claim_text": f"{e['engine']} FINAL_SIGNAL {market}/{side} T-{horizon}; as_of {iso(cutoff)}; original source timestamp {e['details']['observed_at']}",
            "published_at": iso(utc(e["recorded_at"])),
            "reliability_score": None,
            "payload": {"event_id": e["event_id"], "event_key": e["event_key"]},
        } for e in events
    ]
    return {
        "report": {
            "status": "complete", "as_of": iso(cutoff),
            "source_count": len(original),
            "summary": summary,
            "recommended_market": None if watch_only else market,
            "recommended_selection": None if watch_only else side,
            "payload": payload,
            "prompt_version": "sxf-auto-source-verified-v1",
            "input_snapshot_hash": source_hash,
        },
        "evidence": evidence, "display": display, "uid": uid,
        "cutoff": iso(cutoff), "summary": summary, "source_hash": source_hash,
    }


def readback(url, key, run_id, report_id, version, source_hash):
    # The internal capitale schema is deliberately not exposed through
    # PostgREST. Use the already available privileged, server-only read RPC.
    _, obj = rest(url, key, "POST", "rpc/capitale_admin_get_agent_reports",
                  body={"p_run_id": run_id})
    matched = [r for r in obj.get("reports", []) if
               r.get("id") == report_id and
               r.get("run_id") == run_id and
               r.get("role") == "sxf" and
               r.get("report_version") == version and
               r.get("input_snapshot_hash") == source_hash]
    if not obj.get("ok") or len(matched) != 1:
        raise ImportRejected("Saved SXF row readback did not match original report and hash")
    return True

def upload(url, key, token, item, fixture):
    status, prepared = rest(url, key, "POST", "rpc/capitale_admin_prepare_run", body={
        "p_fixture_uid": item["uid"], "p_as_of": item["cutoff"]})
    if not prepared.get("ok") or not prepared.get("run_id"):
        raise ImportRejected(f"Verified fixture not accepted for research run ({prepared.get('error','unknown')})")
    run = str(uuid.UUID(prepared["run_id"]))
    raw = {"run_id": run, "report": item["report"], "evidence": item["evidence"]}
    key_idem = "auto:sxf:" + sha(raw)
    _, result = rest(url, key, "POST", "rpc/capitale_submit_agent_report", body={
        "p_bearer_token": token, "p_run_id": run, "p_idempotency_key": key_idem,
        "p_report": item["report"], "p_evidence": item["evidence"],
    })
    if not result.get("ok") or result.get("actor_role") != ROLE or result.get("fixture_uid") != item["uid"]:
        raise ImportRejected(f"SXF-specific report rejected ({result.get('error','role_or_fixture_mismatch')})")
    readback(url, key, run, result["report_id"], result["report_version"], item["source_hash"])
    return {
        "fixture": f"{fixture['home_team']} – {fixture['away_team']}",
        "pick": f"{item['display']['market']}/{item['display']['selection']}",
        "signal_code": item["display"]["signal_code"],
        "run_id": run, "report_id": result["report_id"],
        "report_version": result["report_version"],
        "duplicate": result.get("duplicate", False),
        "verified_readback": True,
    }


def main():
    p = argparse.ArgumentParser(description="CAPITALE SXF verified signal -> Software sync")
    modes = p.add_mutually_exclusive_group(required=False)
    modes.add_argument("--commit", action="store_true", help="Write to existing authorized DB/report procedures")
    modes.add_argument("--dry-run", action="store_true", help="Print verified candidates only (default)")
    p.add_argument("--hours", type=int, default=18, help="Upcoming time horizon, 1..48 hours")
    p.add_argument("--max-groups", type=int, default=80)
    args = p.parse_args()
    if not 1 <= args.hours <= 48 or not 1 <= args.max_groups <= 150:
        raise ImportRejected("Invalid bounded window or group capacity")
    url, key, token = config()
    now = datetime.now(timezone.utc)
    events, fixtures = candidates(url, key, now, args.hours)
    groups, skips = make_groups(events, fixtures, now, args.max_groups)
    prepared = [(group, report_for(url, key, group)) for group in groups]
    summary = {
        "mode": "COMMIT" if args.commit else "DRY_RUN",
        "source": "public.sxf_base_signal_events FINAL_SIGNAL",
        "event_count": len(events), "verified_group_count": len(groups),
        "skipped": skips, "as_of_run_utc": iso(now),
    }
    print(json.dumps({"scan": summary}, ensure_ascii=False))
    saved, failed = [], []
    for group, report in prepared:
        fixture = group[-1]
        if not args.commit:
            print(json.dumps({
                "preview": fixture["home_team"] + " – " + fixture["away_team"],
                "market": report["display"]["market"], "selection": report["display"]["selection"],
                "signal": report["display"]["signal_code"],
                "engines": report["display"]["engine_tags"],
                "horizon": report["cutoff"],
                "source_count": report["report"]["source_count"],
                "watch_only": report["display"]["watch_only"],
                "percent_change": (
                    round((report["display"]["current_odds"] - report["display"]["reference_odds"]) /
                          report["display"]["reference_odds"] * 100, 2)
                    if report["display"]["reference_odds"] else None
                ),
            }, ensure_ascii=False))
            continue
        try:
            entry = upload(url, key, token, report, fixture)
            saved.append(entry)
            print("SAVED_READBACK_OK " + json.dumps(entry, ensure_ascii=False))
        except ImportRejected as exc:
            failed.append({"fixture": fixture["home_team"] + " – " + fixture["away_team"], "error": str(exc)})
            print("REJECTED " + json.dumps(failed[-1], ensure_ascii=False), file=sys.stderr)
    print(json.dumps({"result": {"saved": len(saved), "failed": len(failed), "preview_only": not args.commit}}, ensure_ascii=False))
    if failed or skips.get("multiple_picks_require_expanded_board"):
        return 2
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ImportRejected, OSError, ValueError, json.JSONDecodeError) as exc:
        print("SXF_IMPORT_BLOCKED: " + str(exc), file=sys.stderr)
        sys.exit(2)
