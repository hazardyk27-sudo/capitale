#!/usr/bin/env python3
"""Reclassify existing PRATIK archives without inventing missing source values."""
from __future__ import annotations

import argparse
import datetime as dt
import gzip
import hashlib
import json
import os
from pathlib import Path

from pratik_archive_quality import QUALITY_VERSION, MARKET_FIELDS, classify_market_data

ARCHIVE_NAME = "PRATİK ARŞİV"


def compact_json(value) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True,
                      default=str)


def parse_time(value):
    if not isinstance(value, str) or not value:
        return None
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        return None
    return parsed.astimezone(dt.timezone.utc)


def empty_coverage():
    return {
        market: {"present": 0, "partial": 0, "empty": 0, "missing": 0}
        for market in MARKET_FIELDS
    }


def hash_gzip_jsonl(path: Path):
    digest = hashlib.sha256()
    byte_count = 0
    record_count = 0
    with gzip.open(path, "rb") as stream:
        for line in stream:
            if not line.endswith(b"\n"):
                raise ValueError(f"Invalid JSONL line ending: {path}")
            json.loads(line)
            digest.update(line)
            byte_count += len(line)
            record_count += 1
    return digest.hexdigest(), byte_count, record_count


def archive_one(folder: Path, expected_hours: list[int]):
    manifest_path = folder / "manifest.json"
    checkpoint_path = folder / "checkpoints.jsonl.gz"
    alarm_path = folder / "alarms.jsonl.gz"
    if any(not path.is_file() for path in (manifest_path, checkpoint_path, alarm_path)):
        raise ValueError(f"Incomplete PRATIK archive folder: {folder}")

    manifest = json.loads(manifest_path.read_text("utf-8"))
    day = manifest.get("date")
    if manifest.get("archive_name") != ARCHIVE_NAME or not day:
        raise ValueError(f"PRATIK identity mismatch: {folder}")
    if manifest.get("checkpoint_hours") != expected_hours:
        raise ValueError(f"Checkpoint schedule mismatch: {day}")
    original_files = manifest.get("files", {})
    original_integrity = manifest.get("integrity", {})
    old_checkpoint_sha, _, old_checkpoint_count = hash_gzip_jsonl(checkpoint_path)
    old_alarm_sha, old_alarm_bytes, old_alarm_count = hash_gzip_jsonl(alarm_path)
    expected_checkpoint_sha = original_integrity.get("checkpoints_sha256") or original_files.get("checkpoints", {}).get("uncompressed_sha256")
    expected_alarm_sha = original_integrity.get("alarms_sha256") or original_files.get("alarms", {}).get("uncompressed_sha256")
    if expected_checkpoint_sha and old_checkpoint_sha != expected_checkpoint_sha:
        raise ValueError(f"Existing checkpoint SHA mismatch; refusing rewrite: {day}")
    if expected_alarm_sha and old_alarm_sha != expected_alarm_sha:
        raise ValueError(f"Existing alarm SHA mismatch; refusing rewrite: {day}")
    if manifest.get("fixtures") != old_checkpoint_count or manifest.get("alarms") != old_alarm_count:
        raise ValueError(f"Existing archive record count mismatch; refusing rewrite: {day}")

    temp_path = checkpoint_path.with_name("checkpoints.jsonl.gz.quality-tmp")
    coverage = empty_coverage()
    future_count = 0
    fixture_count = 0
    checkpoint_digest = hashlib.sha256()
    checkpoint_bytes = 0

    try:
        with gzip.open(checkpoint_path, "rt", encoding="utf-8") as source, temp_path.open("wb") as raw:
            with gzip.GzipFile(fileobj=raw, mode="wb", compresslevel=6, mtime=0) as target:
                for line in source:
                    record = json.loads(line)
                    kickoff = parse_time(record.get("kickoff_utc"))
                    points = record.get("checkpoints")
                    if kickoff is None or not isinstance(points, list) or len(points) != len(expected_hours):
                        raise ValueError(f"Fixture checkpoint count mismatch on {day}")
                    if [point.get("t_minus_hours") for point in points] != expected_hours:
                        raise ValueError(f"Checkpoint schedule mismatch on {day}")

                    for point in points:
                        target_at = parse_time(point.get("target_at_utc"))
                        hours = point.get("t_minus_hours")
                        if target_at is None or target_at != kickoff - dt.timedelta(hours=hours):
                            raise ValueError(f"Target time mismatch on {day}")
                        markets = point.get("markets")
                        if not isinstance(markets, dict):
                            raise ValueError(f"Market map missing on {day}")
                        for market in MARKET_FIELDS:
                            item = markets.get(market)
                            if not isinstance(item, dict):
                                raise ValueError(f"Market state missing: {day} {market}")
                            if item.get("status") == "MISSING":
                                if item.get("data") is not None:
                                    raise ValueError(f"MISSING market has source data: {day} {market}")
                                item.pop("quality", None)
                                coverage[market]["missing"] += 1
                                continue

                            data = item.get("data")
                            status, quality = classify_market_data(market, data)
                            actual_at = parse_time(item.get("actual_at_utc"))
                            if actual_at is None or actual_at > target_at:
                                raise ValueError(f"Future or invalid source time: {day} {market}")
                            item["status"] = status
                            item["quality"] = quality
                            coverage[market][status.lower()] += 1

                    output_line = (compact_json(record) + "\n").encode("utf-8")
                    target.write(output_line)
                    checkpoint_digest.update(output_line)
                    checkpoint_bytes += len(output_line)
                    fixture_count += 1
        os.replace(temp_path, checkpoint_path)
    finally:
        if temp_path.exists():
            temp_path.unlink()

    checkpoints_sha = checkpoint_digest.hexdigest()
    alarms_sha, alarms_bytes, alarm_count = hash_gzip_jsonl(alarm_path)
    if alarm_count != manifest.get("alarms"):
        raise ValueError(f"Alarm record count changed during quality repair: {day}")
    total_slots = fixture_count * len(expected_hours) * len(MARKET_FIELDS)
    present_slots = sum(item["present"] for item in coverage.values())
    partial_slots = sum(item["partial"] for item in coverage.values())
    empty_slots = sum(item["empty"] for item in coverage.values())
    missing_slots = sum(item["missing"] for item in coverage.values())
    if present_slots + partial_slots + empty_slots + missing_slots != total_slots:
        raise ValueError(f"Market coverage total mismatch on {day}")

    files = manifest.setdefault("files", {})
    files["checkpoints"] = {
        "name": checkpoint_path.name,
        "records": fixture_count,
        "uncompressed_sha256": checkpoints_sha,
        "uncompressed_bytes": checkpoint_bytes,
        "compressed_bytes": checkpoint_path.stat().st_size,
    }
    files["alarms"] = {
        "name": alarm_path.name,
        "records": alarm_count,
        "uncompressed_sha256": alarms_sha,
        "uncompressed_bytes": alarms_bytes,
        "compressed_bytes": alarm_path.stat().st_size,
    }
    manifest.update({
        "version": "v2",
        "quality_version": QUALITY_VERSION,
        "fixtures": fixture_count,
        "alarms": alarm_count,
        "market_checkpoint_slots_total": total_slots,
        "market_checkpoint_slots_present": present_slots,
        "market_checkpoint_slots_partial": partial_slots,
        "market_checkpoint_slots_empty": empty_slots,
        "market_checkpoint_slots_missing": missing_slots,
        "coverage_by_market": coverage,
        "missing_policy": "MISSING means no source row; EMPTY means a source row has no valid odds or money values; PARTIAL means some required values are absent; PRESENT requires every outcome odds, share and amount; latest observation at or before target only; no interpolation or future substitution.",
    })
    integrity = manifest.setdefault("integrity", {})
    integrity.update({
        "fixture_records": fixture_count,
        "alarm_records": alarm_count,
        "checkpoint_schedule_valid": True,
        "future_snapshot_count": future_count,
        "checkpoints_sha256": checkpoints_sha,
        "alarms_sha256": alarms_sha,
    })
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    check_sha, check_bytes, check_count = hash_gzip_jsonl(checkpoint_path)
    if (check_sha != checkpoints_sha or check_bytes != checkpoint_bytes
            or check_count != fixture_count):
        raise ValueError(f"Checkpoint restore/checksum verification failed on {day}")
    if files["checkpoints"]["compressed_bytes"] != checkpoint_path.stat().st_size:
        raise ValueError(f"Checkpoint compressed size mismatch on {day}")
    return manifest


def index_entry(manifest: dict) -> dict:
    files = manifest["files"]
    results_present = manifest.get("results_present", 0)
    results_live = manifest.get(
        "results_live",
        max(0, manifest.get("live_score_present", results_present) - results_present),
    )
    live_score_present = manifest.get("live_score_present", results_present + results_live)
    results_missing = manifest.get("results_missing", max(0, manifest["fixtures"] - live_score_present))
    live_in_progress = manifest.get("live_in_progress", results_live)
    entry = {
        "date": manifest["date"],
        "fixtures": manifest["fixtures"],
        "alarms": manifest["alarms"],
        "checkpoint_bytes": files["checkpoints"]["compressed_bytes"],
        "alarm_bytes": files["alarms"]["compressed_bytes"],
        "total_bytes": files["checkpoints"]["compressed_bytes"] + files["alarms"]["compressed_bytes"],
        "uncompressed_bytes": files["checkpoints"]["uncompressed_bytes"] + files["alarms"]["uncompressed_bytes"],
        "coverage": manifest["coverage_by_market"],
        "results_present": results_present,
        "results_missing": results_missing,
        "results_live": results_live,
        "live_score_present": live_score_present,
        "live_in_progress": live_in_progress,
        "checksums": {
            "checkpoints": manifest["integrity"]["checkpoints_sha256"],
            "alarms": manifest["integrity"]["alarms_sha256"],
        },
        "future": manifest["integrity"]["future_snapshot_count"],
        "archive_status": manifest.get("archive_status", "COMPLETE"),
        "source_archive_status": manifest.get("source_archive_status"),
    }
    for key in ("market_checkpoint_slots_total", "market_checkpoint_slots_present",
                "market_checkpoint_slots_partial", "market_checkpoint_slots_empty",
                "market_checkpoint_slots_missing"):
        entry[key] = manifest[key]
    return entry


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--archive-root", default="archive")
    parser.add_argument("--index", default="archive/pratik_arsiv/index.json")
    args = parser.parse_args()

    archive_root = Path(args.archive_root)
    index_path = Path(args.index)
    index = json.loads(index_path.read_text("utf-8"))
    if index.get("archive_name") != ARCHIVE_NAME:
        raise SystemExit("PRATIK index identity mismatch")
    expected_hours = index.get("checkpoint_hours")
    if not isinstance(expected_hours, list) or len(expected_hours) != 34:
        raise SystemExit("PRATIK checkpoint schedule is invalid")

    folders = sorted(
        path.parent for path in archive_root.glob("20??/??/??/05_pratik_arsiv/manifest.json")
    )
    if not folders:
        raise SystemExit("No PRATIK archive day folders found")

    entries = {}
    for folder in folders:
        manifest = archive_one(folder, expected_hours)
        entries[manifest["date"]] = index_entry(manifest)
        print(json.dumps({
            "date": manifest["date"],
            "fixtures": manifest["fixtures"],
            "coverage": manifest["coverage_by_market"],
        }, ensure_ascii=False), flush=True)

    old_days = index.get("days")
    if not isinstance(old_days, list):
        raise SystemExit("PRATIK index days are invalid")
    days = [entries.get(item.get("date"), item) for item in old_days]
    known = {item.get("date") for item in days}
    days.extend(entry for day, entry in entries.items() if day not in known)
    days.sort(key=lambda item: item["date"])
    if len({item.get("date") for item in days}) != len(days):
        raise SystemExit("Duplicate PRATIK index dates")
    index.update({
        "version": "v2",
        "quality_version": QUALITY_VERSION,
        "days": days,
        "total_fixtures": sum(item["fixtures"] for item in days),
        "total_alarm_records": sum(item["alarms"] for item in days),
        "total_compressed_bytes": sum(item["total_bytes"] for item in days),
        "total_uncompressed_bytes": sum(item["uncompressed_bytes"] for item in days),
    })
    index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": "PRATIK_QUALITY_RECLASSIFIED", "days": len(folders)}), flush=True)


if __name__ == "__main__":
    main()
