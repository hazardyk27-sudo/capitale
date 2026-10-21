#!/usr/bin/env python3
"""Export existing SXF research_archive data using a PostgreSQL READ-ONLY connection.

Never accepts archive_config or administrative credential/cursor tables.
No Supabase writes. This program only generates local gzip JSONL and a manifest;
the separate GitHub Actions workflow uploads release assets.
"""
from __future__ import annotations

import argparse
import datetime as dt
import gzip
import hashlib
import json
import os
from pathlib import Path

import psycopg
from psycopg import sql

# Existing fixture/results are separately exported to the repository already.
# Only source-verified history/alarm/snapshot tables are eligible for PUBLIC export.
SAFE_SOURCE_TABLES = (
    "moneyway_1x2_history",
    "moneyway_ou25_history",
    "moneyway_btts_history",
    "dropping_1x2_history",
    "dropping_ou25_history",
    "dropping_btts_history",
    "moneyway_snapshots",
    "live_snapshots",
    "sharp_alarms",
    "insider_alarms",
    "bigmoney_alarms",
    "volumeshock_alarms",
    "dropping_alarms",
    "publicmove_alarms",
    "volume_leader_alarms",
    "mim_alarms",
    "fixture_aliases",
)
# DO NOT export archive_config.secret, raw_stream_cursors,
# raw_backfill_receipts, or legacy_raw_rows to a PUBLIC repository.

SOURCE_COUNT_FIELDS = {
    "moneyway_1x2_history": "rows_1x2",
    "moneyway_ou25_history": "rows_ou25",
    "moneyway_btts_history": "rows_btts",
    "dropping_1x2_history": "rows_dropping_1x2_history",
    "dropping_ou25_history": "rows_dropping_ou25_history",
    "dropping_btts_history": "rows_dropping_btts_history",
    "moneyway_snapshots": "rows_moneyway_snapshots",
    "live_snapshots": "rows_live_snapshots",
    "sharp_alarms": "rows_sharp",
    "insider_alarms": "rows_insider",
    "bigmoney_alarms": "rows_bigmoney",
    "volumeshock_alarms": "rows_volumeshock",
    "dropping_alarms": "rows_dropping",
    "publicmove_alarms": "rows_publicmove",
    "volume_leader_alarms": "rows_volume_leader",
    "mim_alarms": "rows_mim",
}

def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        while buf := stream.read(1024 * 1024):
            digest.update(buf)
    return digest.hexdigest()

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--date", required=True, help="Fixture local date YYYY-MM-DD (Europe/Istanbul)")
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--max-rows-per-table", type=int, default=1000,
                        help="1000 for PILOT; 0 means FULL export, only when expressly authorized")
    parser.add_argument("--chunk-rows", type=int, default=25000)
    parser.add_argument("--max-output-mib", type=int, default=2048,
                        help="Abort before accumulating additional chunks beyond total compressed budget")
    args = parser.parse_args()

    date = dt.date.fromisoformat(args.date)
    if date > dt.datetime.now(dt.timezone(dt.timedelta(hours=3))).date():
        raise SystemExit("Cannot export a future local fixture date")
    if args.max_rows_per_table < 0 or args.chunk_rows < 1 or args.max_output_mib < 1:
        raise SystemExit("Invalid safety limits")

    dsn = os.environ.get("SXF_ARCHIVE_DATABASE_URL", "")
    if not dsn:
        raise SystemExit("SXF_ARCHIVE_DATABASE_URL is missing. Set it as a GitHub Actions SECRET.")
    folder = Path(args.output_dir).resolve()
    folder.mkdir(parents=True, exist_ok=True)
    manifest = {
        "schema_version": "SXF_GITHUB_BULK_EXPORT_V1",
        "date_tr": str(date),
        "source": "research_archive (Supabase PostgreSQL, READ ONLY)",
        "destination": "GitHub Releases assets (uploaded by separate workflow)",
        "release_tag": f"sxf-full-{date}",
        "mode": "PILOT" if args.max_rows_per_table else "FULL",
        "max_rows_per_table": args.max_rows_per_table,
        "tables": [],
        "complete": False,
        "release_upload_verified": False,
        "warnings": ["GitHub repository is public; do not include secrets or internal config tables."],
    }
    total_compressed = 0
    with psycopg.connect(dsn, options="-c default_transaction_read_only=on") as conn:
        with conn.cursor() as cur:
            cur.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY")
            cur.execute(
                "SELECT to_jsonb(a) FROM research_archive.archive_runs a WHERE a.local_date=%s",
                (date,),
            )
            source_run = cur.fetchone()
        if source_run is None:
            raise SystemExit(f"No source archive_runs row for {date}")
        source_info = source_run[0]
        manifest["source_status"] = source_info.get("status")
        manifest["source_expected_fixtures"] = source_info.get("expected_fixtures")
        manifest["source_archived_fixtures"] = source_info.get("archived_fixtures")

        for name in SAFE_SOURCE_TABLES:
            expected = source_info.get(SOURCE_COUNT_FIELDS.get(name, ""))
            count = 0
            part_num = 0
            chunk_count = 0
            gz = None
            current_path = None
            files = []

            # Server-side cursor streams rather than loading millions of rows into RAM.
            with conn.cursor(name=f"sxf_read_{name}") as cursor:
                cursor.itersize = 2000
                query = sql.SQL(
                    "SELECT row_to_json(t)::text FROM {} AS t WHERE t.local_date=%s"
                ).format(sql.Identifier("research_archive", name))
                cursor.execute(query, (date,))
                try:
                    while True:
                        batch = cursor.fetchmany(2000)
                        if not batch:
                            break
                        for (payload,) in batch:
                            if args.max_rows_per_table and count >= args.max_rows_per_table:
                                break
                            if gz is None or chunk_count >= args.chunk_rows:
                                if gz is not None:
                                    gz.close()
                                    meta = {
                                        "asset_name": current_path.name,
                                        "rows": chunk_count,
                                        "size_bytes": current_path.stat().st_size,
                                        "sha256": sha256_file(current_path),
                                    }
                                    total_compressed += meta["size_bytes"]
                                    files.append(meta)
                                    gz = None
                                    if total_compressed > args.max_output_mib * 1024 * 1024:
                                        raise RuntimeError("Compressed output safety budget reached")
                                part_num += 1
                                chunk_count = 0
                                current_path = folder / f"full_{date}_{name}_part{part_num:04d}.jsonl.gz"
                                gz = gzip.open(current_path, "wb", compresslevel=6)
                            gz.write(payload.encode("utf-8") + b"\n")
                            count += 1
                            chunk_count += 1
                        if args.max_rows_per_table and count >= args.max_rows_per_table:
                            break
                finally:
                    if gz is not None:
                        gz.close()
                        meta = {
                            "asset_name": current_path.name,
                            "rows": chunk_count,
                            "size_bytes": current_path.stat().st_size,
                            "sha256": sha256_file(current_path),
                        }
                        total_compressed += meta["size_bytes"]
                        files.append(meta)
                        if total_compressed > args.max_output_mib * 1024 * 1024:
                            raise RuntimeError("Compressed output safety budget reached")

            manifest["tables"].append({
                "table": name,
                "exported_rows": count,
                "source_recorded_rows": expected,
                "source_count_match": (
                    count == expected if expected is not None and args.max_rows_per_table == 0 else None
                ),
                "assets": files,
                "complete": (
                    args.max_rows_per_table == 0 and expected is not None and count == expected
                ),
            })
            print(json.dumps({
                "table": name, "exported_rows": count,
                "source_recorded_rows": expected, "parts": len(files),
            }, ensure_ascii=False), flush=True)

    manifest["compressed_bytes_total"] = total_compressed
    manifest["source_inventory_rows_reconciled"] = (
        args.max_rows_per_table == 0
        and all(t["complete"] for t in manifest["tables"] if t["source_recorded_rows"] is not None)
        and manifest["source_status"] == "COMPLETE"
    )
    if manifest["source_status"] != "COMPLETE":
        manifest["warnings"].append("Source day was PARTIAL; do not mark archive complete.")
    manifest_path = folder / "transfer_manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("LOCAL_EXPORT_FINISHED", manifest_path, "complete=False (awaits release verification)")

if __name__ == "__main__":
    main()
