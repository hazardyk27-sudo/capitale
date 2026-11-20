#!/usr/bin/env python3
"""CAPITALE authorized Commander uploader for completed existing agent reports.

Calls the local, running CAPITALE report bridge, not the database.
No ChatGPT Actions and no keys in the agent message.
Never guesses a run_id, as_of, source_count, or input_snapshot_hash.
"""
import argparse
import datetime as dt
import hashlib
import json
import re
import sys
import urllib.error
import urllib.request
import uuid
from pathlib import Path

BASE_URL = "http://127.0.0.1:5000"
ROLES = {"analyst", "news", "sxf"}
ALLOWED_ENVELOPE = {"run_id", "report", "evidence", "idempotency_key", "role", "department"}
REPORT_REQUIRED = {"status", "as_of", "source_count", "payload", "prompt_version", "input_snapshot_hash"}
REPORT_OPTIONAL = {"confidence", "signal_score", "data_quality", "summary", "recommended_market", "recommended_selection", "model_name"}
EVIDENCE_FIELDS = {"source_kind", "source_name", "source_uri", "published_at", "claim_text", "reliability_score", "payload"}


class InvalidReport(ValueError):
    pass


def validate_time(value, field):
    if not isinstance(value, str):
        raise InvalidReport(f"{field} is missing or not ISO8601 text")
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            raise ValueError("timezone missing")
    except ValueError:
        raise InvalidReport(f"{field} must contain a timezone-aware ISO8601 datetime") from None


def make_payload(obj, role):
    if not isinstance(obj, dict):
        raise InvalidReport("Input must be a JSON object, not plain Markdown.")
    unknown = set(obj).difference(ALLOWED_ENVELOPE)
    if unknown:
        raise InvalidReport("Unexpected top-level fields: " + ", ".join(sorted(unknown)))
    declared_role = obj.get("role", obj.get("department"))
    if declared_role is not None and declared_role != role:
        raise InvalidReport(f"Report says role {declared_role!r}, but --role is {role!r}")
    try:
        run_id = str(uuid.UUID(obj["run_id"]))
        report = obj["report"]
    except (KeyError, TypeError, ValueError):
        raise InvalidReport("Existing, valid run_id (UUID) and structured report are required.") from None
    if not isinstance(report, dict):
        raise InvalidReport("report must be a JSON object.")
    missing = REPORT_REQUIRED.difference(report)
    if missing:
        raise InvalidReport("Missing required report fields: " + ", ".join(sorted(missing)))
    unknown_report = set(report).difference(REPORT_REQUIRED | REPORT_OPTIONAL)
    if unknown_report:
        raise InvalidReport("Unexpected report fields: " + ", ".join(sorted(unknown_report)))
    if report.get("status") != "complete":
        raise InvalidReport("Only existing completed reports may be submitted.")
    validate_time(report["as_of"], "report.as_of")
    if not isinstance(report["source_count"], int) or isinstance(report["source_count"], bool) or not (0 <= report["source_count"] <= 10000):
        raise InvalidReport("source_count must be an explicitly known integer 0..10000")
    if not isinstance(report["payload"], dict):
        raise InvalidReport("report.payload must contain the original structured report object")
    if not isinstance(report["prompt_version"], str) or not (1 <= len(report["prompt_version"].strip()) <= 80):
        raise InvalidReport("report.prompt_version is required")
    if not isinstance(report["input_snapshot_hash"], str) or not re.fullmatch("[a-fA-F0-9]{64}", report["input_snapshot_hash"]):
        raise InvalidReport("Original input_snapshot_hash must be a SHA-256 hex string; it is never invented.")
    for name in ("confidence", "data_quality"):
        if name in report and report[name] is not None and (not isinstance(report[name], (float,int)) or not 0 <= report[name] <= 1):
            raise InvalidReport(name+" must be between 0 and 1")
    if "signal_score" in report and report["signal_score"] is not None and (not isinstance(report["signal_score"], (int, float)) or not -1 <= report["signal_score"] <= 1):
        raise InvalidReport("signal_score must be between -1 and 1")
    evidence = obj.get("evidence", [])
    if not isinstance(evidence, list) or len(evidence) > 100:
        raise InvalidReport("evidence must be an array with at most 100 elements")
    for i, item in enumerate(evidence):
        if not isinstance(item, dict) or not isinstance(item.get("source_kind"),str) or not isinstance(item.get("claim_text"),str) or set(item).difference(EVIDENCE_FIELDS):
            raise InvalidReport(f"evidence[{i}] is invalid")
        if "published_at" in item and item["published_at"] is not None:
            validate_time(item["published_at"], f"evidence[{i}].published_at")
    raw = {"run_id": run_id, "report": report, "evidence": evidence}
    key = obj.get("idempotency_key")
    if key is None:
        h = hashlib.sha256((role + "|" + json.dumps(raw, sort_keys=True, ensure_ascii=False, separators=(",", ":"))).encode("utf-8")).hexdigest()
        key = f"commander:{role}:{h}"
    if not isinstance(key, str) or not re.fullmatch("[A-Za-z0-9._:-]{16,128}", key):
        raise InvalidReport("idempotency_key must be 16..128 permitted characters")
    raw["idempotency_key"] = key
    return raw


def http_json(route, body):
    req = urllib.request.Request(
        BASE_URL + route,
        data=json.dumps(body, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            return response.status, json.load(response)
    except urllib.error.HTTPError as exc:
        try:
            obj = json.load(exc)
        except (ValueError, UnicodeError):
            obj = {"error": "Server rejected request"}
        return exc.code, obj


def check_persisted_report(role, run_id, report_id, report_version, source_hash):
    # Server-only credential never enters the chat, browser or user report.
    import importlib.util
    importer_path = "/opt/capitale-sxf-software-sync.py"
    spec = importlib.util.spec_from_file_location("capitale_verified_reader", importer_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    url, key, _ = mod.config()
    _, obj = mod.rest(url, key, "POST", "rpc/capitale_admin_get_agent_reports",
                      body={"p_run_id": run_id})
    if not obj.get("ok"):
        raise InvalidReport("The report could not be read back from the canonical run")
    found = [
        r for r in obj.get("reports", [])
        if r.get("id") == report_id
        and r.get("role") == role
        and r.get("run_id") == run_id
        and r.get("report_version") == report_version
        and r.get("input_snapshot_hash") == source_hash
    ]
    if len(found) != 1:
        raise InvalidReport("Saved report ID, role, version or hash failed readback")
    return True


def main():
    parser = argparse.ArgumentParser(description="Authorized CAPITALE Commander report uploader")
    sub = parser.add_subparsers(dest="action", required=True)
    submit = sub.add_parser("submit", help="Validate completed existing report and transfer through local Bridge")
    submit.add_argument("--role", required=True, choices=sorted(ROLES))
    submit.add_argument("--file", required=True, type=Path)
    submit.add_argument("--dry-run", action="store_true")
    lookup = sub.add_parser("resolve", help="Look up existing run metadata; does not submit a report")
    lookup.add_argument("--query", required=True)
    lookup.add_argument("--day", help="YYYY-MM-DD")
    args = parser.parse_args()
    if args.action == "resolve":
        if not (2 <= len(args.query) <= 160):
            raise InvalidReport("--query must contain 2..160 characters")
        body = {"query": args.query}
        if args.day:
            dt.date.fromisoformat(args.day)
            body["day"] = args.day
        status, result = http_json("/api/capitale/agent-bridge/resolve-match", body)
        print(json.dumps({"http_status": status, "result": result}, ensure_ascii=False, indent=2))
        return 0 if status == 200 else 2

    obj = json.loads(args.file.read_text(encoding="utf-8"))
    body = make_payload(obj, args.role)
    bytes_count = len(json.dumps(body, ensure_ascii=False).encode("utf-8"))
    if bytes_count > 512 * 1024:
        raise InvalidReport("Report exceeds 512 KiB server limit.")
    info = {"role": args.role, "run_id": body["run_id"], "as_of": body["report"]["as_of"],
            "source_count": body["report"]["source_count"], "idempotency_key": body["idempotency_key"],
            "bytes": bytes_count}
    if args.dry_run:
        print("VALIDATION_OK_NO_WRITE", json.dumps(info, ensure_ascii=False))
        return 0
    status, result = http_json(f"/api/capitale/agent-bridge/reports/{args.role}", body)
    if status not in (200, 201) or not result.get("ok") or not result.get("report_id"):
        print("UPLOAD_REJECTED", json.dumps({"http_status": status, "result": result}, ensure_ascii=False))
        return 2
    try:
        check_persisted_report(args.role, body["run_id"], result["report_id"],
                               result["report_version"], body["report"]["input_snapshot_hash"])
    except Exception as exc:
        print("SAVED_BUT_READBACK_UNVERIFIED", json.dumps({
            "role": args.role, "run_id": body["run_id"], "report_id": result["report_id"],
            "reason": type(exc).__name__}, ensure_ascii=False), file=sys.stderr)
        return 2
    print("SAVED_READBACK_OK", json.dumps({"http_status": status, "run_id": body["run_id"], "role": args.role,
                               "report_id": result["report_id"], "report_version": result.get("report_version"),
                               "duplicate": result.get("duplicate", False)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (InvalidReport, ValueError, OSError, json.JSONDecodeError) as exc:
        print("UPLOAD_NOT_STARTED:", str(exc), file=sys.stderr)
        sys.exit(2)
    except urllib.error.URLError as exc:
        print("BRIDGE_UNAVAILABLE:", str(exc), file=sys.stderr)
        sys.exit(2)
