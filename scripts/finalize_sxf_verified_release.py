#!/usr/bin/env python3
"""Finish a fully uploaded SXF draft Release without querying Supabase.

Safe to re-run: download a Release separately, verify every gzip/JSONL SHA and
the existing receipt, write an append-only GitHub index, then read it back.
Never upload/rewrite/delete raw assets or rewrite an existing GitHub index.
"""
from __future__ import annotations

import argparse
import base64
import datetime as dt
import hashlib
import json
import os
import re
import subprocess
from pathlib import Path

from scripts.export_sxf_daily_archive import FULL_TABLES, verify_directory


def _gh(*args):
    return subprocess.run(["gh", *args], check=True, capture_output=True, text=True).stdout


def _validate_name(value, pattern, label):
    if not isinstance(value, str) or not re.fullmatch(pattern, value):
        raise ValueError("Invalid " + label)
    return value


def _read_json(path: Path):
    return json.loads(path.read_text("utf-8"))


def _asset_digest(path: Path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def prepare_index(folder: Path, tag: str, day: str, kind: str, repo: str,
                  *, expected_source_run=None, gh=_gh):
    """Verify Release and produce the deterministic, auditable index payload."""
    _validate_name(day, r"20\d{2}-\d{2}-\d{2}", "day")
    if dt.date.fromisoformat(day) < dt.date(2026, 10, 9):
        raise ValueError("Day before archival coverage")
    if kind not in ("full_snapshots", "concentrated"):
        raise ValueError("Invalid archive kind")
    if repo != "hazardyk27-sudo/capitale":
        raise ValueError("Unexpected GitHub repository")
    suffix = "raw" if kind == "full_snapshots" else "concentrated"
    expected_tag = f"sxf-{suffix}-{day}-kickoff16-24-v1"
    if tag != expected_tag:
        raise ValueError("Wrong scoped release tag")
    state = json.loads(gh("api", f"repos/{repo}/releases/tags/{tag}"))
    if state.get("draft") is not True or not isinstance(state.get("id"), int):
        raise ValueError("Refusing non-draft or unknown Release")
    # Assets are paginated; large exports commonly exceed 100 items.
    names = gh("api", "--paginate",
               f"repos/{repo}/releases/{state['id']}/assets?per_page=100",
               "--jq", ".[].name").splitlines()
    if len(names) != len(set(names)):
        raise ValueError("Duplicate GitHub Release assets")
    if set(names) != {x.name for x in folder.iterdir() if x.is_file()}:
        raise ValueError("Downloaded Release assets differ from GitHub listing")
    if "verification_receipt.json" not in names or "export_manifest.json" not in names:
        raise ValueError("Release not fully verified; do not repair")
    manifest = _read_json(folder / "export_manifest.json")
    receipt = _read_json(folder / "verification_receipt.json")
    if any((manifest.get("day") != day, manifest.get("kind") != kind,
            manifest.get("scope") != "kickoff16_24",
            receipt.get("day") != day, receipt.get("kind") != kind,
            receipt.get("scope") != "kickoff16_24", receipt.get("release_tag") != tag,
            receipt.get("status") != "GITHUB_RELEASE_DRAFT_DOWNLOADED_AND_VERIFIED",
            receipt.get("source_count_consistency") is not True)):
        raise ValueError("Release manifest/receipt scope, status or counts mismatch")
    if (expected_source_run is not None
            and str(receipt.get("github_run_id")) != str(expected_source_run)):
        raise ValueError("Receipt belongs to another original export")
    if receipt.get("export_manifest_sha256") != _asset_digest(folder / "export_manifest.json"):
        raise ValueError("Receipt manifest SHA-256 mismatch")
    result = verify_directory(folder)  # gzip bytes, JSONL hash, correct day, fixture selection
    total = result["verified_rows"]
    if receipt.get("total_verified_rows") != total or total < 1:
        raise ValueError("Receipt total does not match reconstructed JSONL")
    marker_name = f"progress_total_rows_{total}.json"
    if marker_name not in names or _read_json(folder / marker_name).get("expected_rows") != total:
        raise ValueError("Missing or incorrect GitHub progress count")
    if manifest.get("selected_fixture_count", 0) < 1:
        raise ValueError("Missing fixture window inventory")
    if kind == "full_snapshots":
        entries = manifest["tables"]
        if {e["table"] for e in entries} != set(FULL_TABLES):
            raise ValueError("One or more of eight archive tables missing")
    else:
        entries = manifest["markets"]
        if {e["market"] for e in entries} != {"1X2", "OU2.5", "BTTS"}:
            raise ValueError("Concentrated market slots missing")
    assets = [a for entry in entries for a in entry["assets"]]
    if len(assets) != result["asset_count"] or sum(x["rows"] for x in assets) != total:
        raise ValueError("Manifest asset rows inconsistent with verified readback")
    if {a["name"] for a in assets} != {n for n in names if n.endswith(".jsonl.gz")}:
        raise ValueError("Release raw assets not exactly represented in manifest")
    index = {
        **receipt,
        "asset_inventory": [
            {"name": a["name"], "rows": a["rows"], "bytes": a["bytes"],
             "sha256_gzip": a["sha256_gzip"]}
            for a in assets
        ],
        "source_notice": (
            "Verified only for matches with TSİ kickoff 16:00-24:00. "
            "Other kickoffs intentionally excluded; no full-day archive claim."
        ),
        "receipt_index_schema": "SXF_VERIFIED_RELEASE_INDEX_V2",
    }
    sub = "03_full_snapshots" if kind == "full_snapshots" else "04_concentrated"
    target = f"archive/{day.replace('-', '/')}/{sub}/admin_release_receipt_kickoff16_24_v1.json"
    return target, index


def save_append_only_index(repo: str, target: str, index: dict, *, gh=_gh):
    """Never overwrite a different receipt. Always verify actual main bytes."""
    resource = f"repos/{repo}/contents/{target}"
    data = (json.dumps(index, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    def get_content():
        try:
            obj = json.loads(gh("api", resource + "?ref=main"))
        except subprocess.CalledProcessError as exc:
            # Only explicit 404 is allowed to fall through to create.
            if "404" in (exc.stderr or ""):
                return None
            raise
        return base64.b64decode(obj["content"].replace("\n", ""))
    old = get_content()
    if old is None:
        encoded = base64.b64encode(data).decode("ascii")
        gh("api", "--method", "PUT", resource,
           "-f", "branch=main",
           "-f", "message=SXF: finalize verified scoped Release " + index["day"] + " " + index["kind"],
           "-f", "content=" + encoded)
    elif old != data:
        raise ValueError("Append-only archive index exists with different bytes; refusing overwrite")
    check = get_content()
    if check != data:
        raise ValueError("GitHub main receipt readback content mismatch")
    return len(data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--day", required=True)
    parser.add_argument("--kind", required=True)
    parser.add_argument("--tag", required=True)
    parser.add_argument("--release-dir", type=Path, required=True)
    parser.add_argument("--expected-source-run")
    args = parser.parse_args()
    repo = os.environ.get("GITHUB_REPOSITORY", "hazardyk27-sudo/capitale")
    target, index = prepare_index(
        args.release_dir, args.tag, args.day, args.kind, repo,
        expected_source_run=args.expected_source_run,
    )
    size = save_append_only_index(repo, target, index)
    print(json.dumps({
        "stage": "verified_release_index_saved",
        "path": target, "bytes": size,
        "verified_rows": index["total_verified_rows"],
        "asset_count": len(index["asset_inventory"]),
        "original_export_run": index.get("github_run_id"),
        "finalizer_run": os.environ.get("GITHUB_RUN_ID"),
    }), flush=True)


if __name__ == "__main__":
    main()
