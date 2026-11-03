#!/usr/bin/env python3
"""Repair PRATIK quality from retained exact snapshots, then verify immutable records."""
from __future__ import annotations

import argparse
import datetime as dt
import gzip
import hashlib
import json
import os
from pathlib import Path

import psycopg

from export_pratik_daily_archive import load_fixtures, rows_for_identities
from pratik_archive_quality import (
    QUALITY_VERSION, MARKET_FIELDS, build_snapshot_fallback,
    classify_market_data, merge_snapshot_fields,
)

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


def load_snapshot_groups(conn, checkpoint_path: Path, day: str):
    """Read exact surviving market snapshots and map them to archived fixtures."""
    archived = []
    with gzip.open(checkpoint_path, "rt", encoding="utf-8") as stream:
        for line in stream:
            record = json.loads(line)
            kickoff = parse_time(record.get("kickoff_utc"))
            if kickoff is None:
                raise ValueError(f"Fixture has invalid kickoff on {day}")
            archived.append({
                **record,
                "_kickoff": kickoff,
                "kickoff_utc": kickoff.isoformat().replace("+00:00", "Z"),
            })

    try:
        source = load_fixtures(conn, dt.date.fromisoformat(day))
    except ValueError as exc:
        if "No fixtures found" not in str(exc):
            raise
        # Historical fixtures are no longer retained; never invent a source match.
        return {}, 0
    archived_by_uid = {
        str(item["fixture_uid"]): item for item in archived if item.get("fixture_uid")
    }
    archived_by_hash = {}
    archived_by_teams = {}
    for item in archived:
        if item.get("match_id_hash"):
            archived_by_hash.setdefault(str(item["match_id_hash"]), []).append(item)
        teams = (item.get("home", "").strip().casefold(),
                 item.get("away", "").strip().casefold(),
                 item["_kickoff"])
        archived_by_teams.setdefault(teams, []).append(item)

    source_to_archive = {}
    for fixture in source:
        uid = str(fixture.get("fixture_uid") or "")
        match_hash = str(fixture.get("match_id_hash") or "")
        target = archived_by_uid.get(uid) if uid else None
        if target is None and match_hash:
            matches = archived_by_hash.get(match_hash, [])
            if len(matches) == 1:
                target = matches[0]
        if target is None:
            teams = (fixture.get("home", "").strip().casefold(),
                     fixture.get("away", "").strip().casefold(),
                     fixture["_kickoff"])
            matches = archived_by_teams.get(teams, [])
            if len(matches) == 1:
                target = matches[0]
        if target is not None:
            source_to_archive[uid] = target

    start = min(item["_kickoff"] for item in source) - dt.timedelta(hours=72)
    end = max(item["_kickoff"] for item in source)
    with conn.cursor() as cur:
        cur.execute(
            "SELECT to_jsonb(s) FROM public.moneyway_snapshots AS s "
            "JOIN public.fixtures AS f ON f.fixture_uid = s.fixture_uid "
            "WHERE f.fixture_date = %s "
            "AND s.scraped_at_utc >= f.kickoff_utc - interval '72 hours' "
            "AND s.scraped_at_utc <= f.kickoff_utc",
            (dt.date.fromisoformat(day),),
        )
        rows = [item[0] for item in cur.fetchall()]
    grouped = {}
    source_by_uid = {str(item["fixture_uid"]): item for item in source
                     if item.get("fixture_uid")}
    source_by_hash = {}
    for item in source:
        if item.get("match_id_hash"):
            source_by_hash.setdefault(str(item["match_id_hash"]), []).append(item)
    for row in rows:
        uid = str(row.get("fixture_uid") or "")
        fixture = source_by_uid.get(uid) if uid else None
        if fixture is None:
            match_hash = str(row.get("match_id_hash") or "")
            matches = source_by_hash.get(match_hash, [])
            if len(matches) == 1:
                fixture = matches[0]
        if fixture is None:
            continue
        archive_fixture = source_to_archive.get(str(fixture.get("fixture_uid") or ""))
        if archive_fixture is None:
            continue
        observed = parse_time(row.get("scraped_at_utc"))
        if observed is None or not (
            fixture["_kickoff"] - dt.timedelta(hours=72)
            <= observed <= fixture["_kickoff"]
        ):
            continue
        market = str(row.get("market") or "").strip().upper()
        selection = str(row.get("selection") or "").strip().upper()
        if market not in MARKET_FIELDS:
            continue
        key = str(archive_fixture.get("fixture_uid") or archive_fixture.get("match_id_hash"))
        grouped.setdefault(key, {}).setdefault(market, {}).setdefault(
            selection, []
        ).append((observed, str(row.get("id") or ""), row))
    return grouped, len(rows)

def archive_one(folder: Path, expected_hours: list[int], conn):
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

    snapshot_groups, snapshot_source_rows = load_snapshot_groups(
        conn, checkpoint_path, day
    )
    fallback_market_slots = 0
    fallback_selection_count = 0
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
                            data = item.get("data")
                            fixture_key = str(
                                record.get("fixture_uid") or record.get("match_id_hash")
                            )
                            fallback, fallback_at, fallback_ids = build_snapshot_fallback(
                                market,
                                snapshot_groups.get(fixture_key, {}).get(market, {}),
                                record,
                                target_at,
                            )
                            if fallback:
                                fallback_market_slots += 1
                            merged, filled_fields = (
                                merge_snapshot_fields(market, data, fallback)
                                if fallback else (data, [])
                            )
                            if filled_fields:
                                status, quality = classify_market_data(market, merged)
                                previous_source = item.get("source_table")
                                item.update({
                                    "status": status,
                                    "quality": quality,
                                    "source_table": (
                                        f"{previous_source} + public.moneyway_snapshots"
                                        if previous_source and item.get("status") != "MISSING"
                                        else "public.moneyway_snapshots"
                                    ),
                                    "source_row_ids": fallback_ids,
                                    "snapshot_fallback_actual_at_utc": (
                                        fallback_at.isoformat().replace("+00:00", "Z")
                                    ),
                                    "snapshot_filled_fields": filled_fields,
                                    "data": merged,
                                })
                                if item.get("status") == "MISSING" or not item.get("actual_at_utc"):
                                    item["actual_at_utc"] = fallback_at.isoformat().replace(
                                        "+00:00", "Z"
                                    )
                                    item["lag_minutes"] = max(
                                        0, int((target_at - fallback_at).total_seconds() // 60)
                                    )
                                fallback_selection_count += len(fallback_ids)
                            elif item.get("status") == "MISSING":
                                if data is not None:
                                    raise ValueError(
                                        f"MISSING market has source data: {day} {market}"
                                    )
                                item.pop("quality", None)
                                coverage[market]["missing"] += 1
                                continue
                            else:
                                status, quality = classify_market_data(market, data)
                                actual_at = parse_time(item.get("actual_at_utc"))
                                if actual_at is None or actual_at > target_at:
                                    raise ValueError(
                                        f"Future or invalid source time: {day} {market}"
                                    )
                                item["status"] = status
                                item["quality"] = quality
                            coverage[market][item["status"].lower()] += 1

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
        "snapshot_source_rows": snapshot_source_rows,
        "snapshot_fallback_market_slots": fallback_market_slots,
        "snapshot_source_rows": snapshot_source_rows,
        "snapshot_fallback_market_slots": fallback_market_slots,
        "snapshot_fallback_selection_rows": fallback_selection_count,
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
        "snapshot_source_rows": manifest.get("snapshot_source_rows", 0),
        "snapshot_fallback_market_slots": manifest.get(
            "snapshot_fallback_market_slots", 0
        ),
        "snapshot_fallback_selection_rows": manifest.get(
            "snapshot_fallback_selection_rows", 0
        ),
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

    database_url = os.environ.get("PRATIK_ARCHIVE_DATABASE_URL", "")
    if not database_url:
        raise SystemExit("Missing PRATIK_ARCHIVE_DATABASE_URL read-only secret")

    entries = {}
    with psycopg.connect(database_url, connect_timeout=15, sslmode="require",
                         options="-c default_transaction_read_only=on") as conn:
        for folder in folders:
            manifest = archive_one(folder, expected_hours, conn)
            entries[manifest["date"]] = index_entry(manifest)
            print(json.dumps({
                "date": manifest["date"],
                "fixtures": manifest["fixtures"],
                "coverage": manifest["coverage_by_market"],
                "snapshot_source_rows": manifest.get("snapshot_source_rows", 0),
                "snapshot_fallback_market_slots": manifest.get(
                    "snapshot_fallback_market_slots", 0
                ),
                "snapshot_fallback_selection_rows": manifest.get(
                    "snapshot_fallback_selection_rows", 0
                ),
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
