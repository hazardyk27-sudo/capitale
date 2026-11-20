#!/usr/bin/env python3
"""CAPITALE manual report chain inbox: SXF -> ANALYST -> NEWS -> FINAL.

Private server-side staging only, NOT site publishing.
Does not require ChatGPT Actions or user-facing tokens.
Reports are stored as append-only versioned text with SHA256 metadata.
Usage:
  save --role sxf --run-id UUID --as-of 2026-11-20T13:00:00Z --input /tmp/full-sxf-report.md
  status --run-id UUID
  bundle --run-id UUID --out /tmp/private-final-bundle.json
"""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import uuid

BASE = Path("/opt/capitale-report-chain-inbox")
ROLES = ("sxf", "analyst", "news")
MAX_BYTES = 1_048_576

class Incomplete(Exception):
    pass

def run_id(value):
    try:
        return str(uuid.UUID(str(value)))
    except ValueError:
        raise Incomplete("run_id must be an existing canonical UUID (never invented).") from None

def as_of(value):
    try:
        d = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if not d.tzinfo:
            raise ValueError("timezone missing")
        return d.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
    except (ValueError, AttributeError):
        raise Incomplete("as_of must be a timezone-aware ISO-8601 timestamp.") from None

def ensure_private_dir(p):
    p.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(p, 0o700)

def atomic_create(p, data):
    fd = os.open(str(p), os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "wb") as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    os.chmod(p, 0o400)

def load_one(root, role):
    files = sorted(root.glob(f"{role}.v*.manifest.json"))
    out = []
    for f in files:
        meta = json.loads(f.read_text())
        raw_file = root / meta["report_filename"]
        data = raw_file.read_bytes()
        if hashlib.sha256(data).hexdigest() != meta["sha256"]:
            raise Incomplete(f"{role} report failed SHA256 integrity check")
        out.append((meta, data))
    return out

def save(args):
    rid = run_id(args.run_id)
    cutoff = as_of(args.as_of)
    p = Path(args.input)
    if not p.is_file() or p.is_symlink():
        raise Incomplete("Existing, regular local report file required")
    data = p.read_bytes()
    if not (60 <= len(data) <= MAX_BYTES):
        raise Incomplete("Report must contain 60 bytes to 1 MiB of complete original text")
    try:
        source = data.decode("utf-8")
    except UnicodeDecodeError:
        raise Incomplete("Only UTF-8 original reports accepted") from None
    if any(flag in source for flag in ("<paste report>", "EXAMPLE REPORT ONLY", "LOREM IPSUM")):
        raise Incomplete("Placeholder content is not a complete original report")
    root = BASE / rid
    ensure_private_dir(root)
    previous = load_one(root, args.role)
    digest = hashlib.sha256(data).hexdigest()
    for meta, _ in previous:
        if meta["sha256"] == digest and meta["as_of_utc"] == cutoff:
            print(json.dumps({"ok": True, "state": "ALREADY_STAGED", "role": args.role,
                "run_id": rid, "report_version": meta["version"], "sha256": digest}))
            return
    version = max([m["version"] for m, _ in previous], default=0) + 1
    name = f"{args.role}.v{version:04d}.report.md"
    meta_file = f"{args.role}.v{version:04d}.manifest.json"
    meta = {"role": args.role, "run_id": rid, "as_of_utc": cutoff,
            "version": version, "report_filename": name, "sha256": digest,
            "bytes": len(data), "saved_at_utc": datetime.now(timezone.utc).isoformat()}
    atomic_create(root / name, data)
    atomic_create(root / meta_file, (json.dumps(meta, ensure_ascii=False, indent=2) + "\n").encode())
    print(json.dumps({"ok": True, "state": "STAGED_ONLY_NOT_SITE", "run_id": rid,
        "role": args.role, "report_version": version, "sha256": digest}))

def read_all(rid):
    root = BASE / run_id(rid)
    reports = {}
    for role in ROLES:
        versions = load_one(root, role) if root.is_dir() else []
        if versions:
            reports[role] = versions[-1]
    return reports

def status(args):
    rid = run_id(args.run_id)
    reports = read_all(rid)
    print(json.dumps({"run_id": rid, "inbox_only_not_site": True, "ready_for_final": len(reports) == 3,
        "roles": {r: ({"status": "READY", "version": reports[r][0]["version"],
                        "as_of_utc": reports[r][0]["as_of_utc"], "sha256": reports[r][0]["sha256"]}
                       if r in reports else {"status": "MISSING"}) for r in ROLES}},
         ensure_ascii=False, indent=2))

def bundle(args):
    rid = run_id(args.run_id)
    reports = read_all(rid)
    missing = set(ROLES) - set(reports)
    if missing:
        raise Incomplete("Cannot create FINAL bundle. Missing original reports: " + ", ".join(sorted(missing)))
    inputs = {}
    for role in ROLES:
        meta, data = reports[role]
        inputs[role] = {"metadata": meta, "full_report": data.decode("utf-8")}
    bundle = {"run_id": rid, "workflow": "SXF->ANALYST->NEWS->FINAL",
              "notice": "Original full reports. Final must verify fixture, selection, cutoff and source evidence.",
              "reports": inputs}
    path = Path(args.out)
    if path.exists():
        raise Incomplete("Bundle output already exists; choose a new path (no overwrite).")
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    atomic_create(path, (json.dumps(bundle, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    print(json.dumps({"ok": True, "state": "FINAL_BUNDLE_READY_NOT_SITE",
                      "run_id": rid, "bundle_path": str(path),
                      "source_shas": {r: inputs[r]["metadata"]["sha256"] for r in ROLES}}))

def main():
    cli = argparse.ArgumentParser(description="CAPITALE manual report chain private Commander inbox")
    sub = cli.add_subparsers(dest="action", required=True)
    p = sub.add_parser("save")
    p.add_argument("--role", required=True, choices=ROLES)
    p.add_argument("--run-id", required=True)
    p.add_argument("--as-of", required=True)
    p.add_argument("--input", required=True)
    p = sub.add_parser("status")
    p.add_argument("--run-id", required=True)
    p = sub.add_parser("bundle")
    p.add_argument("--run-id", required=True)
    p.add_argument("--out", required=True)
    args = cli.parse_args()
    {"save": save, "status": status, "bundle": bundle}[args.action](args)

if __name__ == "__main__":
    try:
        main()
    except (Incomplete, OSError, json.JSONDecodeError) as exc:
        print("NOT_COMPLETE:", str(exc), file=sys.stderr)
        sys.exit(2)
