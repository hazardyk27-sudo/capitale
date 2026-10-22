#!/usr/bin/env python3
"""CAPITALE daily research Archive: read-only source -> bounded gzip JSONL.

FULL keeps all eight approved money/dropping/live tables including unmatched,
after-kickoff and no-signal records. CONCENTRATED keeps three market grids with
nine strictly historical checkpoints per fixture. Only GitHub stores output.
"""
from __future__ import annotations

import argparse
import datetime as dt
import gzip
import hashlib
import json
import os
from pathlib import Path
from zoneinfo import ZoneInfo

FULL_TABLES = {
    "moneyway_1x2_history": "rows_1x2",
    "moneyway_ou25_history": "rows_ou25",
    "moneyway_btts_history": "rows_btts",
    "dropping_1x2_history": "rows_dropping_1x2_history",
    "dropping_ou25_history": "rows_dropping_ou25_history",
    "dropping_btts_history": "rows_dropping_btts_history",
    "moneyway_snapshots": "rows_moneyway_snapshots",
    "live_snapshots": "rows_live_snapshots",
}
MARKETS = {"1X2": "moneyway_1x2_history", "OU2.5": "moneyway_ou25_history", "BTTS": "moneyway_btts_history"}
T_HOURS = (72, 60, 40, 24, 12, 8, 6, 3, 1)
FIRST_DAY = dt.date(2026, 10, 9)


def sha_file(path: Path) -> str:
    dig = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            dig.update(chunk)
    return dig.hexdigest()


def canonical_hash(payload: dict) -> str:
    return hashlib.sha256(
        json.dumps(payload, sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def utc_iso(value: dt.datetime) -> str:
    if value.tzinfo is None:
        raise ValueError("Timestamp missing timezone")
    return value.astimezone(dt.timezone.utc).isoformat().replace("+00:00", "Z")


class ChunkWriter:
    def __init__(self, folder: Path, prefix: str, chunk_rows: int):
        self.folder, self.prefix, self.chunk_rows = folder, prefix, chunk_rows
        self.assets = []
        self.handle = None
        self.path = None
        self.digest = None
        self.rows = 0
        self.total = 0

    def _open(self):
        number = len(self.assets) + 1
        self.path = self.folder / f"{self.prefix}_part{number:04d}.jsonl.gz"
        if self.path.exists():
            raise ValueError("Refusing to overwrite an existing export asset")
        self.handle = gzip.open(self.path, "wb", compresslevel=6)
        self.digest, self.rows = hashlib.sha256(), 0

    def add(self, raw: str):
        if self.handle is None:
            self._open()
        binary = raw.encode("utf-8") + b"\n"
        self.handle.write(binary)
        self.digest.update(binary)
        self.rows += 1
        self.total += 1
        if self.rows >= self.chunk_rows:
            self.close()

    def close(self):
        if self.handle is None:
            return
        self.handle.close()
        self.assets.append({
            "name": self.path.name,
            "rows": self.rows,
            "bytes": self.path.stat().st_size,
            "sha256_gzip": sha_file(self.path),
            "sha256_jsonl": self.digest.hexdigest(),
        })
        self.handle = None


def source_manifest(conn, day: dt.date) -> dict:
    with conn.cursor() as cur:
        cur.execute("SELECT to_jsonb(r)::text FROM research_archive.archive_runs r WHERE r.local_date=%s", (day,))
        result = cur.fetchone()
    if not result:
        raise ValueError(f"No source archive_runs inventory for {day}")
    return json.loads(result[0])


def export_full(conn, day: dt.date, folder: Path, chunk_rows: int, source: dict) -> dict:
    from psycopg import sql
    tables = []
    total = 0
    for table, expected_key in FULL_TABLES.items():
        with conn.cursor() as cur:
            cur.execute(
                sql.SQL("SELECT COUNT(*) FROM {} WHERE local_date=%s").format(
                    sql.Identifier("research_archive", table)
                ), (day,),
            )
            actual = cur.fetchone()[0]
        writer = ChunkWriter(folder, f"raw_{day}_{table}", chunk_rows)
        with conn.cursor(name=f"sxf_archive_{table}") as cur:
            cur.itersize = 1000
            cur.execute(
                sql.SQL("SELECT row_to_json(r)::text FROM {} r "
                        "WHERE r.local_date=%s ORDER BY r.source_fingerprint NULLS LAST").format(
                            sql.Identifier("research_archive", table)
                        ), (day,),
            )
            while True:
                batch = cur.fetchmany(1000)
                if not batch:
                    break
                for (raw,) in batch:
                    obj = json.loads(raw)
                    if obj.get("local_date") != str(day):
                        raise ValueError(f"Wrong source day in {table}")
                    writer.add(raw)
        writer.close()
        if writer.total != actual:
            raise ValueError(f"Source row count mismatch during streaming: {table}")
        expected = source.get(expected_key)
        tables.append({
            "table": table, "source_sql_rows": actual, "source_run_recorded_rows": expected,
            "archive_run_count_matches": (actual == expected if expected is not None else None),
            "exported_rows": writer.total, "assets": writer.assets,
        })
        total += writer.total
        print(json.dumps({"table": table, "rows": writer.total, "chunks": len(writer.assets)}), flush=True)
    return {"tables": tables, "total_exported_rows": total,
            "source_run_counts_match": all(t["archive_run_count_matches"] is True for t in tables)}


def select_checkpoint_batch(conn, day: dt.date, table: str, limit: int, offset: int):
    from psycopg import sql
    query = sql.SQL("""
        WITH f AS MATERIALIZED (
          SELECT source_internal_id, fixture_uid, match_id_hash, kickoff_utc
          FROM research_archive.fixtures WHERE local_date=%s
          ORDER BY source_internal_id LIMIT %s OFFSET %s
        ), h AS MATERIALIZED (
          SELECT f.source_internal_id AS fixture_row, z.id AS sid,
                 z.scraped_at::timestamptz AS observed_at,
                 z.source_fingerprint AS fingerprint,
                 row_to_json(z)::text AS payload
          FROM {} z JOIN f
            ON z.local_date=%s
           AND (
                (f.fixture_uid IS NOT NULL AND z.fixture_uid=f.fixture_uid)
                OR (z.fixture_uid IS NULL AND f.match_id_hash IS NOT NULL
                    AND z.match_id_hash=f.match_id_hash)
           )
        )
        SELECT f.source_internal_id, f.fixture_uid, f.match_id_hash,
               f.kickoff_utc, t.hours,
               f.kickoff_utc - make_interval(hours=>t.hours) AS target_at,
               h1.observed_at, h1.fingerprint, h1.payload
        FROM f CROSS JOIN (VALUES(72),(60),(40),(24),(12),(8),(6),(3),(1)) t(hours)
        LEFT JOIN LATERAL (
          SELECT * FROM h
          WHERE h.fixture_row=f.source_internal_id
            AND h.observed_at <= f.kickoff_utc - make_interval(hours=>t.hours)
          ORDER BY h.observed_at DESC, h.sid DESC LIMIT 1
        ) h1 ON TRUE
        ORDER BY f.source_internal_id, t.hours DESC
    """).format(sql.Identifier("research_archive", table))
    with conn.cursor() as cur:
        cur.execute(query, (day, limit, offset, day))
        return cur.fetchall()


def export_concentrated(conn, day: dt.date, folder: Path, chunk_rows: int, batch_fixtures: int) -> dict:
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM research_archive.fixtures WHERE local_date=%s", (day,))
        fixtures = cur.fetchone()[0]
    if fixtures == 0:
        raise ValueError("No fixtures for concentrated archive date")
    markets = []
    for market, table in MARKETS.items():
        writer = ChunkWriter(folder, f"concentrated_{day}_{market.replace('.', '')}", chunk_rows)
        present, missing = 0, 0
        for offset in range(0, fixtures, batch_fixtures):
            records = select_checkpoint_batch(conn, day, table, batch_fixtures, offset)
            if len(records) != min(batch_fixtures, fixtures - offset) * len(T_HOURS):
                raise ValueError(f"Incomplete checkpoint batch: {market} offset {offset}")
            for source_id, fixture_uid, match_hash, kickoff, hours, target, observed, fp, raw in records:
                payload = json.loads(raw) if raw is not None else None
                is_present = payload is not None
                if is_present:
                    if observed > target:
                        raise ValueError("Future snapshot selected")
                    present += 1
                else:
                    missing += 1
                row = {
                    "source_internal_id": source_id, "fixture_uid": str(fixture_uid) if fixture_uid is not None else None,
                    "match_id_hash": match_hash, "kickoff_utc": utc_iso(kickoff),
                    "match_date_tr": str(day), "market": market, "checkpoint": f"T-{hours}",
                    "target_at_utc": utc_iso(target),
                    "status": "PRESENT" if is_present else "MISSING",
                    "actual_snapshot_at_utc": utc_iso(observed) if is_present else None,
                    "lag_minutes": round((target - observed).total_seconds() / 60, 6) if is_present else None,
                    "source_row_hash_sha256": canonical_hash(payload) if is_present else None,
                    "source_fingerprint": fp if is_present else None,
                    "quality_flags": [] if is_present else ["NO_SOURCE_AT_OR_BEFORE_TARGET"],
                    "source_payload": payload,
                }
                writer.add(json.dumps(row, ensure_ascii=False, separators=(",", ":"), default=str))
        writer.close()
        expected = fixtures * len(T_HOURS)
        if writer.total != expected or present + missing != expected:
            raise ValueError(f"Missing fixture/market slots for {market}")
        markets.append({
            "market": market, "fixture_count": fixtures, "slots": expected,
            "present": present, "missing": missing, "assets": writer.assets
        })
        print(json.dumps({"market": market, "slots": expected, "present": present,
                          "missing": missing}), flush=True)
    return {"fixture_count": fixtures, "markets": markets, "checkpoint_slots": fixtures * 3 * 9}


def verify_directory(folder: Path) -> dict:
    manifest = json.loads((folder / "export_manifest.json").read_text("utf-8"))
    day, kind = manifest.get("day"), manifest.get("kind")
    if kind not in ("full_snapshots", "concentrated"):
        raise ValueError("Unknown mode in export manifest")
    if manifest.get("source_schema") != "research_archive":
        raise ValueError("Unexpected source schema")
    entries = manifest["tables"] if kind == "full_snapshots" else manifest["markets"]
    total, unique_slots = 0, set()
    for entry in entries:
        sub_total = 0
        for asset in entry["assets"]:
            name = asset["name"]
            if name != Path(name).name or not name.endswith(".jsonl.gz"):
                raise ValueError("Unexpected asset name")
            path = folder / name
            if path.stat().st_size != asset["bytes"] or sha_file(path) != asset["sha256_gzip"]:
                raise ValueError(f"Bad gzip SHA or byte size: {name}")
            digest, rows = hashlib.sha256(), 0
            with gzip.open(path, "rb") as gz:
                for raw in gz:
                    digest.update(raw)
                    obj = json.loads(raw)
                    if kind == "full_snapshots":
                        if obj.get("local_date") != day:
                            raise ValueError("Wrong full-raw day")
                    else:
                        if obj.get("match_date_tr") != day or obj.get("market") != entry["market"]:
                            raise ValueError("Wrong concentrated slot date/market")
                        slot = (str(obj.get("source_internal_id")), obj.get("market"), obj.get("checkpoint"))
                        if slot in unique_slots:
                            raise ValueError("Duplicate fixture/market/T slot")
                        unique_slots.add(slot)
                        if obj.get("checkpoint") not in [f"T-{h}" for h in T_HOURS]:
                            raise ValueError("Invalid checkpoint")
                        if obj["status"] == "PRESENT":
                            if not isinstance(obj.get("source_payload"), dict):
                                raise ValueError("Missing preserved source payload")
                            observed = dt.datetime.fromisoformat(obj["actual_snapshot_at_utc"].replace("Z", "+00:00"))
                            target = dt.datetime.fromisoformat(obj["target_at_utc"].replace("Z", "+00:00"))
                            if observed > target:
                                raise ValueError("Future-data leakage")
                            if canonical_hash(obj["source_payload"]) != obj.get("source_row_hash_sha256"):
                                raise ValueError("Source payload hash mismatch")
                        elif obj["status"] == "MISSING":
                            if obj.get("source_payload") is not None or obj.get("actual_snapshot_at_utc") is not None:
                                raise ValueError("MISSING slot contains fabricated data")
                        else:
                            raise ValueError("Invalid checkpoint status")
                    rows += 1
            if rows != asset["rows"] or digest.hexdigest() != asset["sha256_jsonl"]:
                raise ValueError(f"Asset JSONL row/digest mismatch: {name}")
            sub_total += rows
        expected = entry["exported_rows"] if kind == "full_snapshots" else entry["slots"]
        if sub_total != expected:
            raise ValueError("Table/market row total mismatch")
        total += sub_total
    expected_total = manifest["total_exported_rows"] if kind == "full_snapshots" else manifest["checkpoint_slots"]
    if total != expected_total:
        raise ValueError("Global export row mismatch")
    if kind == "concentrated" and len(unique_slots) != expected_total:
        raise ValueError("Concentrated grid missing/duplicated slots")
    return {"day": day, "kind": kind, "verified_rows": total, "asset_count": sum(len(x["assets"]) for x in entries)}



def require_genuine_readonly_role(conn) -> None:
    """Refuse admin/superuser/owner DSNs even under read-only transactions.

    A read-only transaction is not proof that underlying credentials are
    restricted; enforce source role permissions using SELECT-only metadata.
    """
    with conn.cursor() as cur:
        cur.execute("""
            SELECT
                COALESCE(
                    (SELECT rolsuper OR rolcreatedb OR rolcreaterole OR rolreplication OR rolbypassrls
                     FROM pg_roles WHERE rolname = current_user),
                    TRUE
                ) AS elevated_role,
                has_schema_privilege(current_user, 'research_archive', 'USAGE') AS can_read_schema,
                has_schema_privilege(current_user, 'research_archive', 'CREATE') AS can_create_schema,
                EXISTS (
                  SELECT 1
                  FROM pg_class t JOIN pg_namespace ns ON ns.oid = t.relnamespace
                  WHERE ns.nspname = 'research_archive' AND t.relkind IN ('r', 'p')
                    AND (
                      has_table_privilege(current_user, t.oid, 'INSERT')
                      OR has_table_privilege(current_user, t.oid, 'UPDATE')
                      OR has_table_privilege(current_user, t.oid, 'DELETE')
                      OR has_table_privilege(current_user, t.oid, 'TRUNCATE')
                      OR has_table_privilege(current_user, t.oid, 'TRIGGER')
                    )
                ) AS can_mutate_archive_tables
        """)
        elevated, usage, create, mutate = cur.fetchone()
    if elevated or not usage or create or mutate:
        raise PermissionError(
            "SXF_ARCHIVE_DATABASE_URL must be a dedicated SELECT-only role "
            "with no administrator, DDL, or DML rights on research_archive"
        )


def export(day: dt.date, kind: str, folder: Path, chunk_rows: int, batch_fixtures: int) -> dict:
    import psycopg
    dsn = os.environ.get("SXF_ARCHIVE_DATABASE_URL")
    if not dsn:
        raise ValueError("Missing private SXF_ARCHIVE_DATABASE_URL secret")
    if folder.exists() and any(folder.iterdir()):
        raise ValueError("Refusing to overwrite non-empty output directory")
    folder.mkdir(parents=True, exist_ok=True)
    with psycopg.connect(dsn, options="-c default_transaction_read_only=on") as conn:
        with conn.cursor() as cur:
            cur.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY")
            cur.execute("SHOW transaction_read_only")
            if cur.fetchone()[0] != "on":
                raise ValueError("Source DB transaction is not read-only")
        require_genuine_readonly_role(conn)
        source = source_manifest(conn, day)
        result = (export_full(conn, day, folder, chunk_rows, source) if kind == "full_snapshots"
                  else export_concentrated(conn, day, folder, chunk_rows, batch_fixtures))
    manifest = {
        "schema_version": "SXF_CAPITALE_DAY_ARCHIVE_V1", "source_schema": "research_archive",
        "source_access": "SELECT_ONLY", "day": str(day), "timezone": "Europe/Istanbul",
        "kind": kind, "source_archive_run_status": source.get("status"),
        "source_expected_fixtures": source.get("expected_fixtures"),
        "source_archived_fixtures": source.get("archived_fixtures"),
        "release_upload_verified": False, "github_migration_complete": False,
        "source_collection_complete": source.get("status") == "COMPLETE",
        "notes": [
            "Original raw records including unmatched/post-kickoff rows preserved in full mode.",
            "GitHub upload/download/hash and restore are verified separately by the Actions workflow.",
            "A source PARTIAL day must never be represented as a historically complete collection.",
        ],
        **result,
    }
    (folder / "export_manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2, default=str) + "\n", encoding="utf-8")
    verify_directory(folder)
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--day")
    parser.add_argument("--kind", choices=("full_snapshots", "concentrated"))
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--verify-dir", type=Path)
    parser.add_argument("--chunk-rows", type=int, default=25000)
    parser.add_argument("--fixture-batch", type=int, default=25)
    args = parser.parse_args()
    if args.verify_dir:
        print(json.dumps(verify_directory(args.verify_dir)))
        return
    if not args.day or not args.kind or not args.output_dir:
        parser.error("Supply --day, --kind, --output-dir or use --verify-dir")
    try:
        day = dt.date.fromisoformat(args.day)
    except ValueError as exc:
        parser.error(str(exc))
    today = dt.datetime.now(ZoneInfo("Europe/Istanbul")).date()
    if day < FIRST_DAY or day > today:
        parser.error("Requested fixture day outside safe historical range")
    if args.chunk_rows < 1 or args.chunk_rows > 25000 or args.fixture_batch < 1 or args.fixture_batch > 50:
        parser.error("Unsafe export chunk size")
    result = export(day, args.kind, args.output_dir, args.chunk_rows, args.fixture_batch)
    print(json.dumps({"kind": args.kind, "day": str(day), "exported_rows":
          result.get("total_exported_rows", result.get("checkpoint_slots")),
          "locally_verified": True, "github_upload_verified": False}))


if __name__ == "__main__":
    main()
