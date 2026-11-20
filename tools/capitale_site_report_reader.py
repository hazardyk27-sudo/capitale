#!/usr/bin/env python3
"""CAPITALE direct per-department site reader, private Commander only.

Get existing SXF/ANALYST/NEWS reports and their canonical run metadata from
the same DB backing /admin/software; no Action or user-visible secrets.
Never changes data and never treats missing roles as successful.
"""
import argparse
from datetime import datetime, timezone
import importlib.util
import json
import os
from pathlib import Path
import sys
import uuid

IMPORTER = Path("/opt/capitale-sxf-software-sync.py")
ROLES = ("sxf", "analyst", "news")


def importer():
    spec = importlib.util.spec_from_file_location("capitale_sxf_sync", IMPORTER)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main():
    cli = argparse.ArgumentParser(description="Read completed CAPITALE department records by real run_id")
    cli.add_argument("--run-id", type=str, required=True)
    cli.add_argument("--out", type=Path, help="Write the complete verified JSON bundle privately; never stdout")
    cli.add_argument("--require-all", action="store_true", help="Fail if SXF, ANALYST or NEWS missing")
    args = cli.parse_args()
    rid = str(uuid.UUID(args.run_id))
    mod = importer()
    url, key, _ = mod.config()
    _, result = mod.rest(url, key, "POST", "rpc/capitale_admin_get_agent_reports",
                         body={"p_run_id": rid})
    if not result.get("ok") or result.get("run_id") != rid:
        raise ValueError("Report read failed for specified research run")
    _, run_list = mod.rest(url, key, "POST", "rpc/capitale_admin_list_runs", body={"p_limit": 100})
    matches = [x for x in run_list.get("runs", []) if x["id"] == rid]
    if len(matches) != 1:
        raise ValueError("Research run could not be verified in canonical run list")
    run = matches[0]
    _, fixtures = mod.rest(url, key, "GET", "fixtures", params={
        "select": "fixture_uid,home_team,away_team,kickoff_utc,league",
        "fixture_uid": "eq." + run["fixture_uid"],
        "limit": "1",
    })
    if len(fixtures) != 1 or fixtures[0]["fixture_uid"] != run["fixture_uid"]:
        raise ValueError("Canonical fixture mismatch")
    kickoff = mod.utc(fixtures[0]["kickoff_utc"])
    reports = {}
    for role in ROLES:
        versions = sorted([r for r in result.get("reports", []) if r.get("role") == role],
                          key=lambda x: x["report_version"], reverse=True)
        if not versions:
            continue
        r = versions[0]
        if r.get("run_id") != rid or r.get("status") != "complete":
            raise ValueError(f"{role} report has wrong run or is incomplete")
        if mod.utc(r["as_of"]) >= kickoff:
            raise ValueError(f"{role} report as_of is after fixture kickoff")
        reports[role] = r
    # The site supports one current selected market per research-run row.
    sxf = reports.get("sxf", {})
    pick = sxf.get("payload", {}).get("display", {})
    market, selection = pick.get("market"), pick.get("selection")
    if sxf and (not market or not selection):
        raise ValueError("SXF report has no canonical selection for this run")
    for role in ("analyst", "news"):
        r = reports.get(role)
        if r:
            d = r.get("payload", {}).get("display", {})
            if d.get("market") != market or d.get("selection") != selection:
                raise ValueError(f"{role} market/selection does not match SXF")
    outcome = {
        "run_id": rid,
        "fixture_uid": run["fixture_uid"],
        "fixture": fixtures[0],
        "run": run,
        "market": market, "selection": selection,
        "role_status": {role: ("READY" if role in reports else "MISSING") for role in ROLES},
        "ready_for_final": len(reports) == 3,
        "reports": reports,
        "evidence": result.get("evidence", []),
    }
    summary = {k: v for k,v in outcome.items() if k not in ("reports","evidence")}
    if args.out:
        if args.out.exists():
            raise FileExistsError("Bundle file already exists; use a new filename")
        args.out.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        f = os.open(args.out, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        with os.fdopen(f, "w", encoding="utf-8") as file:
            json.dump(outcome, file, ensure_ascii=False, indent=2)
        summary["private_bundle_written"] = str(args.out)
    print(json.dumps(summary, ensure_ascii=False))
    if args.require_all and not outcome["ready_for_final"]:
        return 2
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, OSError, KeyError, TypeError) as exc:
        print("SITE_REPORT_READ_BLOCKED:", str(exc), file=sys.stderr)
        sys.exit(2)
