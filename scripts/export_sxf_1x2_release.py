#!/usr/bin/env python3
"""Read-only, bounded 1X2 SXF export; no database write and no credential export.

A separate manual GitHub Actions workflow uploads and verifies draft release assets.
"""
from __future__ import annotations

import argparse
import datetime as dt
import gzip
import hashlib
import json
import os
from pathlib import Path

TABLE = "research_archive.moneyway_1x2_history"
DAY = "2026-10-09"
EXPECTED_FULL_ROWS = 148444
EXPECTED_KEYS = frozenset((
    "id", "league", "date", "home", "away", "odds1", "oddsx", "odds2",
    "pct1", "amt1", "pctx", "amtx", "pct2", "amt2", "volume", "scraped_at",
    "match_id_hash", "fixture_uid", "local_date", "source_fingerprint", "archived_at",
))

def digest_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def verify_downloaded(directory: Path) -> dict:
    """Verify downloaded GitHub Release assets without accessing source credentials."""
    manifest = json.loads((directory / "export_manifest.json").read_text("utf-8"))
    if manifest.get("source_table") != TABLE or manifest.get("date_tr") != DAY:
        raise ValueError("Wrong dataset / day in release manifest")
    total = 0
    seen: set[str] = set()
    for asset in manifest["assets"]:
        name = asset["name"]
        if Path(name).name != name or not name.endswith(".jsonl.gz"):
            raise ValueError("Unexpected asset name")
        path = directory / name
        if digest_file(path) != asset["sha256_gzip"]:
            raise ValueError(f"Compressed SHA-256 mismatch: {name}")
        h = hashlib.sha256()
        rows = 0
        with gzip.open(path, "rb") as stream:
            for raw in stream:
                h.update(raw)
                data = json.loads(raw)
                if set(data) != EXPECTED_KEYS or data["local_date"] != DAY:
                    raise ValueError("Unexpected columns or source date")
                fp = data["source_fingerprint"]
                if not isinstance(fp, str) or fp in seen:
                    raise ValueError("Duplicate or missing source fingerprint")
                seen.add(fp)
                rows += 1
        if rows != asset["rows"] or h.hexdigest() != asset["sha256_jsonl"]:
            raise ValueError(f"Decompressed rows/hash mismatch: {name}")
        total += rows
    if total != manifest["exported_rows"] or len(seen) != total:
        raise ValueError("Manifest count differs from asset content")
    if manifest["mode"] == "full" and total != EXPECTED_FULL_ROWS:
        raise ValueError("Full count does not match read-only source inventory")
    if manifest["mode"] == "pilot" and total != 250:
        raise ValueError("Pilot must contain exactly 250 records")
    return {"verified_rows": total, "assets": len(manifest["assets"]), "mode": manifest["mode"]}

def run_export(output: Path, mode: str, chunk_rows: int) -> dict:
    import psycopg

    dsn = os.getenv("SXF_ARCHIVE_DATABASE_URL")
    if not dsn:
        raise RuntimeError("Missing SXF_ARCHIVE_DATABASE_URL private secret")
    if output.exists() and any(output.iterdir()):
        raise ValueError("Refusing to overwrite existing export files")
    output.mkdir(parents=True, exist_ok=True)
    if not 1 <= chunk_rows <= 25000:
        raise ValueError("Invalid maximum chunk size")
    limit = 250 if mode == "pilot" else EXPECTED_FULL_ROWS
    assets = []
    exported = 0
    last_fp = None
    gz = None
    current_path = None
    sha_uncompressed = None
    asset_rows = 0
    first_fp = None

    def close_asset() -> None:
        nonlocal gz, current_path, sha_uncompressed, asset_rows, first_fp
        if gz is None:
            return
        gz.close()
        assets.append({
            "name": current_path.name,
            "rows": asset_rows,
            "first_fingerprint": first_fp,
            "last_fingerprint": last_fp,
            "size_bytes": current_path.stat().st_size,
            "sha256_gzip": digest_file(current_path),
            "sha256_jsonl": sha_uncompressed.hexdigest(),
        })
        gz = None

    with psycopg.connect(dsn, options="-c default_transaction_read_only=on") as conn:
        with conn.cursor() as cur:
            cur.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY")
            cur.execute("SELECT COUNT(*), COUNT(DISTINCT source_fingerprint) FROM "
                        "research_archive.moneyway_1x2_history WHERE local_date = %s",
                        (dt.date.fromisoformat(DAY),))
            total, distinct = cur.fetchone()
            if total != EXPECTED_FULL_ROWS or distinct != EXPECTED_FULL_ROWS:
                raise ValueError("Source inventory changed or fingerprints not unique")
        with conn.cursor(name="sxf_readonly_1x2_release") as cursor:
            cursor.itersize = 1000
            cursor.execute("SELECT source_fingerprint, row_to_json(h)::text FROM "
                           "research_archive.moneyway_1x2_history h "
                           "WHERE local_date = %s ORDER BY source_fingerprint",
                           (dt.date.fromisoformat(DAY),))
            while exported < limit:
                batch = cursor.fetchmany(min(1000, limit - exported))
                if not batch:
                    break
                for fp, text in batch:
                    record = json.loads(text)
                    if (set(record) != EXPECTED_KEYS or record["local_date"] != DAY
                            or record["source_fingerprint"] != fp
                            or not isinstance(fp, str)
                            or (last_fp is not None and fp <= last_fp)):
                        raise ValueError("Invalid input schema or fingerprint ordering")
                    if gz is None or asset_rows == chunk_rows:
                        close_asset()
                        part = len(assets) + 1
                        current_path = output / f"full_{DAY}_1x2_{mode}_part{part:04d}.jsonl.gz"
                        gz = gzip.open(current_path, "wb", compresslevel=6)
                        sha_uncompressed = hashlib.sha256()
                        asset_rows = 0
                        first_fp = fp
                    row = text.encode("utf-8") + b"\n"
                    gz.write(row)
                    sha_uncompressed.update(row)
                    asset_rows += 1
                    exported += 1
                    last_fp = fp
        close_asset()

    if exported != limit:
        raise ValueError("Exported source row count is incomplete")
    manifest = {
        "schema_version": "SXF_1X2_RELEASE_EXPORT_V1", "date_tr": DAY,
        "source_table": TABLE, "source_access": "READ_ONLY", "mode": mode,
        "source_rows": EXPECTED_FULL_ROWS, "exported_rows": exported,
        "assets": assets, "complete_export": mode == "full" and exported == EXPECTED_FULL_ROWS,
        "release_upload_verified": False,
        "notes": "The complete_export flag does NOT certify GitHub upload, readback or migration completion.",
    }
    (output / "export_manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    verify_downloaded(output)
    return manifest

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=("pilot", "full"))
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--chunk-rows", type=int, default=10000)
    parser.add_argument("--verify-dir", type=Path)
    args = parser.parse_args()
    if args.verify_dir:
        result = verify_downloaded(args.verify_dir)
    elif args.mode and args.output_dir:
        result = run_export(args.output_dir, args.mode, args.chunk_rows)
    else:
        parser.error("Pass --verify-dir OR --mode and --output-dir")
    print(json.dumps(result if args.verify_dir else {
        "mode": result["mode"], "rows": result["exported_rows"],
        "assets": len(result["assets"]), "locally_verified": True,
        "release_upload_verified": False,
    }, ensure_ascii=False))

if __name__ == "__main__":
    main()
