#!/usr/bin/env python3
"""Build one immutable PRATIK ARSIV day from public Supabase tables."""
from __future__ import annotations

import argparse
import datetime as dt
import gzip
import hashlib
import json
import os
from pathlib import Path
from zoneinfo import ZoneInfo

import psycopg
from psycopg import sql

from pratik_archive_quality import (
    QUALITY_VERSION, build_snapshot_fallback, classify_market_data, merge_snapshot_fields,
)

ISTANBUL = ZoneInfo("Europe/Istanbul")
CHECKPOINT_HOURS = (
    *range(72, 23, -3),
    *range(22, 11, -2),
    *range(11, 0, -1),
)
MARKETS = {
    "1X2": ("moneyway_1x2_history", "scraped_at"),
    "OU25": ("moneyway_ou25_history", "scraped_at"),
    "BTTS": ("moneyway_btts_history", "scraped_at"),
}

# These competitions must have all 34 as-of checkpoints and all 3 markets
# fully observed before a daily archive is allowed onto main.
PRIORITY_LEAGUES = frozenset({
    "uefa champions league",
    "uefa europa league",
    "uefa europa conference league",
    "uefa conference league",
    "english premier league",
    "premier league",
    "spanish la liga",
    "la liga",
    "italian serie a",
    "serie a",
    "german bundesliga",
    "bundesliga",
    "french ligue 1",
    "ligue 1",
    "turkish super lig",
    "turkish süper lig",
    "süper lig",
})


def is_priority_league(league: str) -> bool:
    return str(league or "").strip().casefold() in PRIORITY_LEAGUES


def assert_priority_market_coverage(day: dt.date, fixtures: list[dict]) -> None:
    failures = []
    for fixture in fixtures:
        if not is_priority_league(fixture.get("league")):
            continue
        gaps = []
        for checkpoint in fixture.get("checkpoints", []):
            for market, item in checkpoint.get("markets", {}).items():
                if item.get("status") != "PRESENT":
                    gaps.append({
                        "t_minus_hours": checkpoint.get("t_minus_hours"),
                        "market": market,
                        "status": item.get("status"),
                        "source_table": item.get("source_table"),
                        "actual_at_utc": item.get("actual_at_utc"),
                        "quality": item.get("quality"),
                    })
        if gaps:
            failures.append({
                "league": fixture.get("league"),
                "match": f'{fixture.get("home", "")} - {fixture.get("away", "")}',
                "incomplete_slots": len(gaps),
                "examples": gaps[:8],
            })
    if failures:
        print(json.dumps({
            "status": "BLOCKED_PRIORITY_MARKET_GAPS",
            "day": str(day),
            "policy": "Priority competitions require every checkpoint and all 3 markets to be PRESENT.",
            "priority_fixtures_with_gaps": len(failures),
            "fixtures": failures[:60],
        }, ensure_ascii=False), flush=True)
        raise ValueError(
            f"PRATIK archive for {day} blocked: priority league market data is incomplete"
        )
ALARM_TABLES = (
    "bigmoney_alarms", "dropping_alarms", "insider_alarms", "mim_alarms",
    "publicmove_alarms", "sharp_alarms", "volume_leader_alarms",
    "volumeshock_alarms",
)
SOURCE = "public Supabase tables (read-only)"
FINAL_STATUSES = {"ft", "final", "finished", "full time", "completed", "complete"}


def iso_utc(value: dt.datetime) -> str:
    if value.tzinfo is None:
        raise ValueError("Naive timestamp returned by database")
    return value.astimezone(dt.timezone.utc).isoformat().replace("+00:00", "Z")


def parse_time(value) -> dt.datetime | None:
    if isinstance(value, dt.datetime):
        parsed = value
    elif isinstance(value, str) and value:
        try:
            parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
    else:
        return None
    if parsed.tzinfo is None:
        return None
    return parsed.astimezone(dt.timezone.utc)


def compact_json(value) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True,
                      default=str)


def line_digest_and_count(path: Path):
    digest = hashlib.sha256()
    rows = 0
    with gzip.open(path, "rb") as stream:
        for line in stream:
            if not line.endswith(b"\n"):
                raise ValueError(f"Invalid JSONL line ending: {path.name}")
            json.loads(line)
            digest.update(line)
            rows += 1
    return digest.hexdigest(), rows


def verified_existing(folder: Path, day: dt.date) -> bool:
    if not folder.exists():
        return False
    names = ("checkpoints.jsonl.gz", "alarms.jsonl.gz", "manifest.json")
    if not folder.is_dir() or any(not (folder / name).is_file() for name in names):
        raise ValueError("Existing PRATIK folder is incomplete; refusing to overwrite")
    manifest = json.loads((folder / "manifest.json").read_text("utf-8"))
    if manifest.get("archive_name") != "PRATİK ARŞİV" or manifest.get("date") != str(day):
        raise ValueError("Existing PRATIK manifest identity mismatch")
    if manifest.get("checkpoint_hours") != list(CHECKPOINT_HOURS):
        raise ValueError("Existing PRATIK checkpoint schedule mismatch")
    if manifest.get("quality_version") != QUALITY_VERSION:
        raise ValueError("Existing PRATIK archive needs market-quality reclassification before it can be skipped")
    integrity = manifest.get("integrity", {})
    verify_output(folder, day, integrity.get("fixture_records"), integrity.get("alarm_records"))
    print(json.dumps({"status": "SKIP_VERIFIED_EXISTING", "day": str(day)}), flush=True)
    return True


def table_columns(conn, table: str) -> set[str]:
    with conn.cursor() as cur:
        cur.execute(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_schema='public' AND table_name=%s", (table,))
        return {row[0] for row in cur.fetchall()}


def _identity_filter(columns: set[str], uids: list[str], hashes: list[str]):
    terms, params = [], []
    if "fixture_uid" in columns and uids:
        terms.append(sql.SQL("r.fixture_uid::text = ANY(%s::text[])"))
        params.append(uids)
    if "match_id_hash" in columns and hashes:
        terms.append(sql.SQL("r.match_id_hash::text = ANY(%s::text[])"))
        params.append(hashes)
    if not terms:
        return None, []
    return sql.SQL("(") + sql.SQL(" OR ").join(terms) + sql.SQL(")"), params


def rows_for_identities(conn, table: str, uids: list[str], hashes: list[str],
                        time_col: str | None = None, start=None, end=None):
    columns = table_columns(conn, table)
    identity, params = _identity_filter(columns, uids, hashes)
    if identity is None:
        return []
    clauses = [identity]
    if time_col:
        if time_col not in columns:
            raise ValueError(f"Required timestamp column missing: public.{table}.{time_col}")
        # Source stores scraped_at as text; cast it for the bounded timestamp filter.
        clauses.append(
            sql.SQL("r.{}::timestamptz >= %s AND r.{}::timestamptz <= %s").format(
                sql.Identifier(time_col), sql.Identifier(time_col)))
        params.extend([start, end])
    query = sql.SQL("SELECT to_jsonb(r) FROM public.{} AS r WHERE ").format(
        sql.Identifier(table)) + sql.SQL(" AND ").join(clauses)
    with conn.cursor() as cur:
        cur.execute(query, params)
        return [record[0] for record in cur.fetchall()]


def rows_before_time(conn, table: str, uids: list[str], hashes: list[str],
                     time_col: str, cutoff, distinct_columns: tuple[str, ...] = ()):
    """Fetch only the last pre-window row per fixture (and selection, when requested)."""
    columns = table_columns(conn, table)
    identity, params = _identity_filter(columns, uids, hashes)
    if identity is None:
        return []
    if time_col not in columns:
        raise ValueError(f"Required timestamp column missing: public.{table}.{time_col}")
    distinct = [sql.SQL("COALESCE(r.fixture_uid::text, r.match_id_hash::text)")]
    for name in distinct_columns:
        if name not in columns:
            raise ValueError(f"Required baseline column missing: public.{table}.{name}")
        distinct.append(sql.SQL("r.{}").format(sql.Identifier(name)))
    distinct_sql = sql.SQL(", ").join(distinct)
    query = (
        sql.SQL("SELECT DISTINCT ON ({}) to_jsonb(r) FROM public.{} AS r WHERE ")
        .format(distinct_sql, sql.Identifier(table))
        + identity
        + sql.SQL(" AND r.{}::timestamptz < %s ORDER BY {}, r.{}::timestamptz DESC, r.id ASC")
        .format(sql.Identifier(time_col), distinct_sql, sql.Identifier(time_col))
    )
    with conn.cursor() as cur:
        cur.execute(query, [*params, cutoff])
        return [record[0] for record in cur.fetchall()]


def row_fixture(row: dict, by_uid: dict, by_hash: dict, day: dt.date):
    uid = str(row.get("fixture_uid") or "")
    if uid and uid in by_uid:
        return by_uid[uid]
    match_hash = str(row.get("match_id_hash") or "")
    matches = by_hash.get(match_hash, [])
    if len(matches) != 1:
        return None
    fixture = matches[0]
    home = row.get("home") or row.get("home_team")
    away = row.get("away") or row.get("away_team")
    if home and str(home).casefold() != fixture["home"].casefold():
        return None
    if away and str(away).casefold() != fixture["away"].casefold():
        return None
    date_value = row.get("date") or row.get("match_date") or row.get("fixture_date")
    if date_value and str(date_value)[:10] != str(day):
        return None
    return fixture


def stable_row_id(row: dict) -> str:
    value = row.get("id")
    return "" if value is None else str(value)


def load_fixtures(conn, day: dt.date):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT fixture_uid::text, match_id_hash, home_team, away_team, league, "
            "kickoff_utc FROM public.fixtures WHERE fixture_date=%s "
            "ORDER BY kickoff_utc, home_team, away_team", (day,))
        source_rows = cur.fetchall()
    fixtures = []
    for uid, match_hash, home, away, league, kickoff in source_rows:
        kickoff_at = parse_time(kickoff)
        if kickoff_at is None:
            raise ValueError(f"Fixture has invalid kickoff: {home} vs {away}")
        fixtures.append({
            "fixture_uid": uid, "match_id_hash": match_hash,
            "home": str(home or ""), "away": str(away or ""),
            "league": str(league or ""), "kickoff_utc": iso_utc(kickoff_at),
            "_kickoff": kickoff_at,
        })
    if not fixtures:
        raise ValueError(f"No fixtures found in public.fixtures for {day}")
    if any(not fixture["fixture_uid"] and not fixture["match_id_hash"] for fixture in fixtures):
        raise ValueError("Fixture has no stable UID or match hash")
    return fixtures


def load_results(conn, fixtures, uids, hashes, day):
    rows = rows_for_identities(conn, "live_fixtures", uids, hashes)
    by_uid = {f["fixture_uid"]: f for f in fixtures if f["fixture_uid"]}
    by_hash = {}
    for fixture in fixtures:
        if fixture["match_id_hash"]:
            by_hash.setdefault(str(fixture["match_id_hash"]), []).append(fixture)
    latest = {}
    for row in rows:
        fixture = row_fixture(row, by_uid, by_hash, day)
        if not fixture:
            continue
        updated = parse_time(row.get("updated_at"))
        key = fixture["fixture_uid"] or fixture["match_id_hash"]
        prior = latest.get(key)
        prior_time = prior[0] if prior and prior[0] else dt.datetime.min.replace(tzinfo=dt.timezone.utc)
        current_time = updated if updated else dt.datetime.min.replace(tzinfo=dt.timezone.utc)
        if prior is None or current_time > prior_time:
            latest[key] = (updated, row)
    results = {}
    for fixture in fixtures:
        key = fixture["fixture_uid"] or fixture["match_id_hash"]
        item = latest.get(key)
        if not item:
            continue
        row = item[1]
        score = row.get("score")
        status = str(row.get("status") or "").strip().casefold()
        final = status in FINAL_STATUSES or status in {"ft", "aet", "pen"}
        if score is None or str(score).strip() == "":
            continue
        results[key] = {
            "score": score, "status": row.get("status"),
            "minute": row.get("minute"),
            "source_updated_at": iso_utc(item[0]) if item[0] else row.get("updated_at"),
            "source_table": "public.live_fixtures", "final": final,
        }
    return results


def make_archive(conn, day: dt.date, output: Path):
    fixtures = load_fixtures(conn, day)
    uids = [f["fixture_uid"] for f in fixtures if f["fixture_uid"]]
    hashes = list({str(f["match_id_hash"]) for f in fixtures if f["match_id_hash"]})
    by_uid = {f["fixture_uid"]: f for f in fixtures if f["fixture_uid"]}
    by_hash = {}
    for fixture in fixtures:
        if fixture["match_id_hash"]:
            by_hash.setdefault(str(fixture["match_id_hash"]), []).append(fixture)

    starts = [f["_kickoff"] - dt.timedelta(hours=72) for f in fixtures]
    ends = [f["_kickoff"] for f in fixtures]
    histories = {}
    history_counts = {}
    for market, (table, timestamp) in MARKETS.items():
        rows = rows_for_identities(conn, table, uids, hashes, timestamp,
                                   min(starts), max(ends))
        rows.extend(rows_before_time(
            conn, table, uids, hashes, timestamp, min(starts)
        ))
        grouped = {f["fixture_uid"] or f["match_id_hash"]: [] for f in fixtures}
        for row in rows:
            fixture = row_fixture(row, by_uid, by_hash, day)
            if not fixture:
                continue
            observed = parse_time(row.get(timestamp))
            if observed is None or observed > fixture["_kickoff"]:
                continue
            key = fixture["fixture_uid"] or fixture["match_id_hash"]
            grouped.setdefault(key, []).append((observed, stable_row_id(row), row))
        histories[market] = grouped
        history_counts[market] = sum(len(items) for items in grouped.values())

    snapshot_rows = rows_for_identities(
        conn, "moneyway_snapshots", uids, hashes, "scraped_at_utc",
        min(starts), max(ends),
    )
    snapshot_rows.extend(rows_before_time(
        conn, "moneyway_snapshots", uids, hashes, "scraped_at_utc", min(starts),
        ("market", "selection"),
    ))
    snapshot_histories = {f["fixture_uid"] or f["match_id_hash"]: {} for f in fixtures}
    for row in snapshot_rows:
        fixture = row_fixture(row, by_uid, by_hash, day)
        if not fixture:
            continue
        observed = parse_time(row.get("scraped_at_utc"))
        if observed is None or observed > fixture["_kickoff"]:
            continue
        market = str(row.get("market") or "").strip().upper()
        selection = str(row.get("selection") or "").strip().upper()
        if market not in MARKETS:
            continue
        key = fixture["fixture_uid"] or fixture["match_id_hash"]
        snapshot_histories.setdefault(key, {}).setdefault(market, {}).setdefault(
            selection, []
        ).append((observed, stable_row_id(row), row))
    snapshot_row_count = len(snapshot_rows)

    alarms = []
    for table in ALARM_TABLES:
        if not table_columns(conn, table):
            continue
        for row in rows_for_identities(conn, table, uids, hashes):
            fixture = row_fixture(row, by_uid, by_hash, day)
            if fixture:
                alarms.append({"source_table": f"public.{table}", **row})
    alarms.sort(key=lambda row: (
        str(row.get("trigger_at") or row.get("created_at") or ""),
        str(row.get("fixture_uid") or row.get("match_id_hash") or ""),
        row["source_table"],
        stable_row_id(row),
    ))

    results = load_results(conn, fixtures, uids, hashes, day)
    checkpoint_lines = []
    coverage = {market: {"present": 0, "partial": 0, "empty": 0, "missing": 0} for market in MARKETS}
    future_count = 0
    snapshot_fallback_market_slots = 0
    snapshot_fallback_selection_rows = 0
    for fixture in fixtures:
        key = fixture["fixture_uid"] or fixture["match_id_hash"]
        points = []
        for hours in CHECKPOINT_HOURS:
            target = fixture["_kickoff"] - dt.timedelta(hours=hours)
            markets = {}
            for market in MARKETS:
                eligible = [entry for entry in histories[market].get(key, [])
                            if entry[0] <= target]
                selected = None
                if eligible:
                    eligible.sort(key=lambda entry: (entry[0], entry[1]))
                    observed, row_id, row = eligible[-1]
                    tied = [entry for entry in eligible if entry[0] == observed]
                    if tied:
                        observed, row_id, row = min(tied, key=lambda entry: entry[1])
                    selected = {
                        "status": classify_market_data(market, row)[0],
                        "actual_at_utc": iso_utc(observed),
                        "lag_minutes": max(
                            0, int((target - observed).total_seconds() // 60)
                        ),
                        "source_table": f"public.{MARKETS[market][0]}",
                        "source_row_id": row.get("id"),
                        "source_fingerprint": row.get("source_fingerprint"),
                        "data": row,
                    }
                fallback, fallback_at, fallback_ids = build_snapshot_fallback(
                    market, snapshot_histories.get(key, {}).get(market, {}),
                    fixture, target,
                )
                if fallback:
                    snapshot_fallback_market_slots += 1
                    original = (selected or {}).get("data")
                    merged, filled_fields = merge_snapshot_fields(
                        market, original, fallback
                    )
                    if filled_fields:
                        snapshot_fallback_selection_rows += len(fallback_ids)
                        selected = selected or {}
                        selected.update({
                            "data": merged,
                            "source_table": (
                                f"{selected['source_table']} + public.moneyway_snapshots"
                                if selected.get("source_table")
                                else "public.moneyway_snapshots"
                            ),
                            "source_row_ids": fallback_ids,
                            "snapshot_fallback_actual_at_utc": iso_utc(fallback_at),
                            "snapshot_filled_fields": filled_fields,
                            "source_row_id": selected.get("source_row_id"),
                            "source_fingerprint": selected.get("source_fingerprint"),
                            "actual_at_utc": selected.get(
                                "actual_at_utc", iso_utc(fallback_at)
                            ),
                            "lag_minutes": selected.get(
                                "lag_minutes",
                                max(0, int((target - fallback_at).total_seconds() // 60)),
                            ),
                        })
                if selected is None:
                    markets[market] = {"status": "MISSING"}
                    coverage[market]["missing"] += 1
                    continue
                status, quality = classify_market_data(market, selected["data"])
                if parse_time(selected["actual_at_utc"]) > target:
                    future_count += 1
                    raise ValueError("Future snapshot selected; refusing archive")
                selected["status"] = status
                selected["quality"] = quality
                markets[market] = selected
                coverage[market][status.lower()] += 1
            points.append({
                "t_minus_hours": hours, "target_at_utc": iso_utc(target),
                "markets": markets,
            })
        checkpoint_lines.append({
            "fixture_uid": fixture["fixture_uid"],
            "match_id_hash": fixture["match_id_hash"],
            "home": fixture["home"], "away": fixture["away"],
            "league": fixture["league"], "kickoff_utc": fixture["kickoff_utc"],
            "result": results.get(key), "checkpoints": points,
        })

    assert_priority_market_coverage(day, checkpoint_lines)
    output.mkdir(parents=True, exist_ok=False)
    files = {}
    for name, records in (("checkpoints", checkpoint_lines), ("alarms", alarms)):
        path = output / f"{name}.jsonl.gz"
        digest = hashlib.sha256()
        count = 0
        with path.open("wb") as raw:
            with gzip.GzipFile(fileobj=raw, mode="wb", compresslevel=6, mtime=0) as stream:
                for record in records:
                    line = (compact_json(record) + "\n").encode("utf-8")
                    stream.write(line)
                    digest.update(line)
                    count += 1
        files[name] = {
            "name": path.name, "records": count,
            "uncompressed_sha256": digest.hexdigest(),
            "uncompressed_bytes": sum(len((compact_json(r) + "\n").encode("utf-8")) for r in records),
            "compressed_bytes": path.stat().st_size,
        }
    total_slots = len(fixtures) * len(CHECKPOINT_HOURS) * len(MARKETS)
    present_slots = sum(item["present"] for item in coverage.values())
    partial_slots = sum(item["partial"] for item in coverage.values())
    empty_slots = sum(item["empty"] for item in coverage.values())
    missing_slots = sum(item["missing"] for item in coverage.values())
    source_archive_status = (
        "COMPLETE" if total_slots > 0 and present_slots == total_slots else "PARTIAL"
    )
    final_count = sum(
        1 for fixture in fixtures
        if (results.get(fixture["fixture_uid"] or fixture["match_id_hash"])
            or {}).get("final") is True
    )
    live_score_count = sum(
        1 for fixture in fixtures
        if results.get(fixture["fixture_uid"] or fixture["match_id_hash"])
    )
    manifest = {
        "archive_name": "PRATİK ARŞİV",
        "version": "v2",
        "quality_version": QUALITY_VERSION,
        "date": str(day),
        "timezone": "Europe/Istanbul",
        "checkpoint_hours": list(CHECKPOINT_HOURS),
        "fixtures": len(fixtures),
        "results_present": final_count,
        "results_missing": len(fixtures) - live_score_count,
        "results_live": live_score_count - final_count,
        "live_score_present": live_score_count,
        "live_in_progress": live_score_count - final_count,
        "market_checkpoint_slots_total": total_slots,
        "market_checkpoint_slots_present": present_slots,
        "market_checkpoint_slots_partial": partial_slots,
        "market_checkpoint_slots_empty": empty_slots,
        "market_checkpoint_slots_missing": missing_slots,
        "alarms": len(alarms),
        "fields": "Original market rows, source timestamps, IDs, odds, shares, GBP amounts and volumes are retained when present.",
        "source": SOURCE,
        "archive_status": source_archive_status,
        "source_archive_status": source_archive_status,
        "market_coverage_complete": source_archive_status == "COMPLETE",
        "missing_policy": "MISSING means no source row; EMPTY means a source row has no valid odds or money values; PARTIAL means some required values are absent; PRESENT requires every outcome odds, share and amount; archive is COMPLETE only when every fixture/checkpoint/market slot is PRESENT; latest observation at or before target only; no interpolation or future substitution.",
        "source_row_counts": history_counts,
        "snapshot_backfill_version": "snapshot-field-fill-v2-asof-t72",
        "snapshot_source_rows": snapshot_row_count,
        "snapshot_fallback_market_slots": snapshot_fallback_market_slots,
        "snapshot_fallback_selection_rows": snapshot_fallback_selection_rows,
        "coverage_by_market": coverage,
        "files": files,
        "integrity": {
            "fixture_records": len(checkpoint_lines),
            "alarm_records": len(alarms),
            "checkpoint_schedule_valid": True,
            "future_snapshot_count": future_count,
            "checkpoints_sha256": files["checkpoints"]["uncompressed_sha256"],
            "alarms_sha256": files["alarms"]["uncompressed_sha256"],
        },
    }
    (output / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    verify_output(output, day, len(fixtures), len(alarms))
    print(json.dumps({
        "status": "READY_TO_COMMIT", "day": str(day), "fixtures": len(fixtures),
        "alarms": len(alarms),
        "compressed_bytes": sum(item["compressed_bytes"] for item in files.values()),
        "uncompressed_bytes": sum(item["uncompressed_bytes"] for item in files.values()),
    }), flush=True)


def verify_output(folder: Path, day: dt.date, fixture_count: int, alarm_count: int):
    manifest = json.loads((folder / "manifest.json").read_text("utf-8"))
    if (manifest.get("archive_name") != "PRATİK ARŞİV"
            or manifest.get("date") != str(day)
            or manifest.get("checkpoint_hours") != list(CHECKPOINT_HOURS)):
        raise ValueError("Output manifest identity/date/checkpoint schedule mismatch")
    if (manifest.get("fixtures") != fixture_count or manifest.get("alarms") != alarm_count
            or manifest.get("integrity", {}).get("checkpoint_schedule_valid") is not True
            or manifest.get("integrity", {}).get("future_snapshot_count") != 0):
        raise ValueError("Output manifest counts or integrity flags mismatch")
    for name, key, expected in (
        ("checkpoints.jsonl.gz", "checkpoints_sha256", fixture_count),
        ("alarms.jsonl.gz", "alarms_sha256", alarm_count),
    ):
        digest, count = line_digest_and_count(folder / name)
        if count != expected or digest != manifest["integrity"].get(key):
            raise ValueError(f"Output restore/checksum validation failed: {name}")
    observed_coverage = {
        name: {"present": 0, "partial": 0, "empty": 0, "missing": 0}
        for name in MARKETS
    }
    with gzip.open(folder / "checkpoints.jsonl.gz", "rt", encoding="utf-8") as stream:
        for line in stream:
            record = json.loads(line)
            kickoff = parse_time(record.get("kickoff_utc"))
            points = record.get("checkpoints", [])
            if kickoff is None or len(points) != len(CHECKPOINT_HOURS):
                raise ValueError("Fixture checkpoint count mismatch")
            if [item.get("t_minus_hours") for item in points] != list(CHECKPOINT_HOURS):
                raise ValueError("Fixture checkpoint schedule mismatch")
            for point in points:
                target = parse_time(point.get("target_at_utc"))
                expected_target = kickoff - dt.timedelta(hours=point["t_minus_hours"])
                if target != expected_target:
                    raise ValueError("Checkpoint target does not match fixture kickoff")
                markets = point.get("markets", {})
                for name in MARKETS:
                    item = markets.get(name)
                    if not isinstance(item, dict):
                        raise ValueError(f"Missing market state: {name}")
                    status = item.get("status")
                    if status == "MISSING":
                        if item.get("data") is not None:
                            raise ValueError("MISSING market unexpectedly has source data")
                        observed_coverage[name]["missing"] += 1
                        continue
                    if status not in {"PRESENT", "PARTIAL", "EMPTY"}:
                        raise ValueError(f"Invalid market status: {status}")
                    actual = parse_time(item.get("actual_at_utc"))
                    if actual is None or target is None or actual > target:
                        raise ValueError("Future or invalid observation in checkpoint")
                    expected_status, expected_quality = classify_market_data(name, item.get("data"))
                    if status != expected_status or item.get("quality") != expected_quality:
                        raise ValueError(f"Market quality classification mismatch: {name}")
                    observed_coverage[name][status.lower()] += 1
    if manifest.get("quality_version") != QUALITY_VERSION:
        raise ValueError("Unsupported market quality version")
    if observed_coverage != manifest.get("coverage_by_market"):
        raise ValueError("Market coverage counters do not match checkpoint records")
    observed_total = sum(sum(counts.values()) for counts in observed_coverage.values())
    observed_present = sum(counts["present"] for counts in observed_coverage.values())
    if manifest.get("market_checkpoint_slots_total") != observed_total:
        raise ValueError("Market checkpoint slot total does not match checkpoint records")
    expected_status = (
        "COMPLETE" if observed_total > 0 and observed_present == observed_total else "PARTIAL"
    )
    if (manifest.get("archive_status") != expected_status
            or manifest.get("source_archive_status") != expected_status
            or manifest.get("market_coverage_complete") is not (expected_status == "COMPLETE")):
        raise ValueError("Archive status does not match source market coverage")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--day", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--archive-root", default="archive")
    args = parser.parse_args()
    try:
        day = dt.date.fromisoformat(args.day)
    except ValueError as exc:
        raise SystemExit("Invalid --day; expected YYYY-MM-DD") from exc
    if day.isoformat() != args.day or day < dt.date(2026, 10, 9):
        raise SystemExit("Date is outside the PRATIK archive range")
    archive_folder = (Path(args.archive_root) / day.strftime("%Y/%m/%d") /
                      "05_pratik_arsiv")
    if verified_existing(archive_folder, day):
        return
    database_url = os.environ.get("PRATIK_ARCHIVE_DATABASE_URL", "")
    if not database_url:
        raise SystemExit("Missing PRATIK_ARCHIVE_DATABASE_URL read-only secret")
    output = Path(args.output_dir)
    if output.exists():
        raise SystemExit("Output path already exists; refusing overwrite")
    with psycopg.connect(database_url, connect_timeout=15, sslmode="require",
                         options="-c default_transaction_read_only=on") as conn:
        make_archive(conn, day, output)


if __name__ == "__main__":
    main()
