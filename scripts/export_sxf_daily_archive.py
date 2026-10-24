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
import re
import subprocess
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
SCOPES = ("all", "kickoff16_24")
WINDOW_SQL = ("AND (kickoff_utc AT TIME ZONE 'Europe/Istanbul')::time >= TIME '16:00' "
              "AND (kickoff_utc AT TIME ZONE 'Europe/Istanbul')::date = local_date")


def selected_window_fixtures(conn, day: dt.date):
    """Local kickoff 16:00 inclusive, following 00:00 exclusive.

    The scope selects fixtures, NEVER the scrape time of associated records.
    """
    with conn.cursor() as cur:
        cur.execute(
            "SELECT fixture_uid, match_id_hash, source_internal_id, kickoff_utc "
            "FROM research_archive.fixtures WHERE local_date=%s " + WINDOW_SQL +
            " ORDER BY source_internal_id", (day,))
        rows = cur.fetchall()
        cur.execute(
            "SELECT COUNT(*), COUNT(DISTINCT match_id_hash) "
            "FROM research_archive.fixtures WHERE local_date=%s", (day,))
        total, unique_hashes = cur.fetchone()
    if not rows or unique_hashes != total:
        raise ValueError("Empty window or ambiguous fixture hash; refusing incomplete scope")
    if any(uid is None and h is None for uid,h,_,_ in rows):
        raise ValueError("Selected fixture has no source identity")
    return rows


def window_sql_filter():
    # UNION of both reliable fixture identities. A non-null but stale UUID
    # must not suppress an otherwise correctly matching unique match hash.
    # This is deliberately broader than concentrated's legacy NULL-only
    # fallback, because raw exports must preserve all archived alias rows.
    return (" WHERE r.local_date=%s AND "
            "(r.fixture_uid = ANY(%s::uuid[]) OR "
            "r.match_id_hash = ANY(%s::text[]))")


def source_window_counts(conn, day, fixtures):
    from psycopg import sql
    uuids = [r[0] for r in fixtures if r[0] is not None]
    hashes = [r[1] for r in fixtures if r[1] is not None]
    values = {}
    with conn.cursor() as cur:
        for table in FULL_TABLES:
            cur.execute(
                sql.SQL("SELECT COUNT(*) FROM {} r").format(
                    sql.Identifier("research_archive", table)
                ) + sql.SQL(window_sql_filter()),
                (day, uuids, hashes))
            values[table] = cur.fetchone()[0]
    return values



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
    def __init__(self, folder: Path, prefix: str, chunk_rows: int, on_asset=None):
        self.folder, self.prefix, self.chunk_rows = folder, prefix, chunk_rows
        self.on_asset = on_asset
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
        level = int(os.environ.get("SXF_GZIP_LEVEL", "3"))
        if level not in (1, 3, 6):
            raise ValueError("Unsafe gzip compression level")
        self.handle = gzip.open(self.path, "wb", compresslevel=level)
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
        if self.on_asset is not None:
            # The row count in a Release filename makes live progress independently
            # auditable from uploaded GitHub assets, without estimated percentages.
            if not re.fullmatch(r"[a-zA-Z0-9_.-]+\.jsonl\.gz", self.path.name):
                raise ValueError("Invalid generated chunk name")
            final_path = self.path.with_name(
                self.path.name.removesuffix(".jsonl.gz") + f"_rows_{self.rows}.jsonl.gz"
            )
            self.path.rename(final_path)
            self.path = final_path
        asset = {
            "name": self.path.name,
            "rows": self.rows,
            "bytes": self.path.stat().st_size,
            "sha256_gzip": sha_file(self.path),
            "sha256_jsonl": self.digest.hexdigest(),
        }
        self.assets.append(asset)
        self.handle = None
        if self.on_asset is not None:
            self.on_asset(asset, self.path)



class VerifiedReleaseResume:
    """Resume only complete, SHA256-verified table/market checkpoints.

    A checkpoint is uploaded only after every data chunk in that entry.
    Partial entries are discarded and re-exported, never silently reused.
    Source material stays SELECT-only. Verified Releases cannot be modified.
    """
    def __init__(self, tag, folder, day, scope, source, fixtures, total):
        self.tag, self.folder, self.day, self.scope, self.total = tag, folder, day, scope, total
        self.source_hash = canonical_hash(source)
        ids = [(str(x[0]), x[1], x[2]) for x in fixtures]
        self.selection_hash = hashlib.sha256(
            json.dumps(ids, separators=(",", ":")).encode("utf-8")
        ).hexdigest()
        self.assets = set()
        view = subprocess.run(["gh", "release", "view", tag, "--json", "isDraft,assets"],
                              capture_output=True, text=True)
        if view.returncode == 0:
            info = json.loads(view.stdout)
            if info.get("isDraft") is not True:
                raise ValueError("Refusing to resume non-draft Release")
            if any(a.get("name") in ("verification_receipt.json", "export_manifest.json")
                   for a in info.get("assets", [])):
                raise ValueError("Release already at verification stage; do not modify")
            self.assets = {a["name"] for a in info.get("assets", [])}
            subprocess.run(["gh", "release", "download", tag,
                            "--dir", str(folder)], check=True, stdout=subprocess.DEVNULL)
            self.preexisting = True
        else:
            subprocess.run(["gh", "release", "create", tag, "--draft", "--latest=false",
                            "--title", f"SXF {day} {scope} - not yet verified",
                            "--notes", "Resume-safe draft; SHA256/JSONL readback required."],
                           check=True, stdout=subprocess.DEVNULL)
            self.preexisting = False
        marker_name = f"progress_total_rows_{total}.json"
        marker = folder / marker_name
        identity = {
            "schema": "SXF_RELEASE_RESUME_V2",
            "day": str(day), "scope": scope,
            "expected_rows": total,
            "source_manifest_sha256": self.source_hash,
            "selected_fixtures_sha256": self.selection_hash,
            "status": "UPLOADING_NOT_VERIFIED",
        }
        if self.preexisting:
            if marker_name not in self.assets or not marker.is_file():
                raise ValueError("Existing draft progress marker missing")
            if json.loads(marker.read_text("utf-8")) != identity:
                raise ValueError("Previous export source/selection changed; refusing unsafe resume")
        else:
            marker.write_text(json.dumps(identity, indent=2) + "\n", encoding="utf-8")
            self.upload(marker)
        print(json.dumps({
            "stage": "checkpoint_open", "day": str(day), "previous_draft": self.preexisting,
        }), flush=True)

    def upload(self, path):
        if path.name in self.assets:
            raise ValueError("Refusing to overwrite existing Release asset")
        subprocess.run(["gh", "release", "upload", self.tag, str(path)],
                       check=True, stdout=subprocess.DEVNULL)
        self.assets.add(path.name)

    def __call__(self, asset, path):
        self.upload(path)
        print(json.dumps({
            "stage": "github_chunk_uploaded", "chunk": asset["name"],
            "uploaded_rows_in_chunk": asset["rows"],
            "total_expected_rows": self.total,
        }), flush=True)

    def checkpoint_name(self, entry_key):
        if not re.fullmatch(r"[a-zA-Z0-9_.-]+", entry_key):
            raise ValueError("Invalid checkpoint entry key")
        return f"checkpoint_{entry_key}.json"

    def load(self, entry_key):
        name = self.checkpoint_name(entry_key)
        if name not in self.assets:
            # Orphan chunks of this incomplete entry cannot be trusted;
            # remove only its exact prefix and re-read this entry.
            prefix = (f"raw_{self.day}_{entry_key}_part" if entry_key in FULL_TABLES
                      else f"concentrated_{self.day}_{entry_key.replace('.', '')}_part")
            for asset in sorted(self.assets):
                if asset.startswith(prefix) and asset.endswith(".jsonl.gz"):
                    subprocess.run(["gh", "release", "delete-asset", self.tag,
                                    asset, "--yes"], check=True, stdout=subprocess.DEVNULL)
                    self.assets.remove(asset)
                    (self.folder / asset).unlink(missing_ok=True)
            return None
        saved = self.folder / name
        if not saved.is_file():
            raise ValueError("Cached table checkpoint not downloaded")
        checkpoint = json.loads(saved.read_text("utf-8"))
        if (checkpoint.get("entry") != entry_key or
            checkpoint.get("source_manifest_sha256") != self.source_hash):
            raise ValueError("Saved table checkpoint identity mismatch")
        record = checkpoint.get("record")
        if not isinstance(record, dict) or not isinstance(record.get("assets"), list):
            raise ValueError("Saved table checkpoint invalid")
        for item in record["assets"]:
            basename = item["name"]
            if basename != Path(basename).name or basename not in self.assets:
                raise ValueError("Checkpoint asset missing in GitHub draft")
            file = self.folder / basename
            if (not file.is_file() or file.stat().st_size != item["bytes"]
                or sha_file(file) != item["sha256_gzip"]):
                raise ValueError("Saved chunk gzip SHA256 mismatch")
            digest, lines = hashlib.sha256(), 0
            with gzip.open(file, "rb") as gz:
                for row in gz:
                    digest.update(row); lines += 1
            if lines != item["rows"] or digest.hexdigest() != item["sha256_jsonl"]:
                raise ValueError("Saved chunk JSONL SHA256 mismatch")
        print(json.dumps({"stage": "checkpoint_reused",
                          "entry": entry_key, "verified_chunks": len(record["assets"])}),
              flush=True)
        return record

    def finish(self, entry_key, record):
        name = self.checkpoint_name(entry_key)
        if name in self.assets:
            raise ValueError("Refusing completed checkpoint overwrite")
        path = self.folder / name
        path.write_text(json.dumps({
            "schema": "SXF_TABLE_CHECKPOINT_V1", "entry": entry_key,
            "source_manifest_sha256": self.source_hash, "record": record,
        }, ensure_ascii=False, indent=2, default=str) + "\n", encoding="utf-8")
        self.upload(path)


def source_manifest(conn, day: dt.date) -> dict:
    with conn.cursor() as cur:
        cur.execute("SELECT to_jsonb(r)::text FROM research_archive.archive_runs r WHERE r.local_date=%s", (day,))
        result = cur.fetchone()
    if not result:
        raise ValueError(f"No source archive_runs inventory for {day}")
    return json.loads(result[0])


def export_full(conn, day: dt.date, folder: Path, chunk_rows: int, source: dict,
                on_asset=None, scope: str = "all", fixtures=None,
                window_counts=None, resume=None) -> dict:
    from psycopg import sql
    tables = []
    total = 0
    selected_uuids = [x[0] for x in fixtures if x[0] is not None] if fixtures else []
    selected_hashes = [x[1] for x in fixtures if x[1] is not None] if fixtures else []
    for table, expected_key in FULL_TABLES.items():
        if resume is not None:
            cached = resume.load(table)
            if cached is not None:
                if cached.get("source_sql_rows") != window_counts[table]:
                    raise ValueError("Completed source table counts changed; refusing resume")
                tables.append(cached)
                total += cached["exported_rows"]
                continue
        if scope == "kickoff16_24":
            actual = window_counts[table]
        else:
            with conn.cursor() as cur:
                cur.execute(
                    sql.SQL("SELECT COUNT(*) FROM {} WHERE local_date=%s").format(
                        sql.Identifier("research_archive", table)
                    ), (day,),
                )
                actual = cur.fetchone()[0]
        writer = ChunkWriter(folder, f"raw_{day}_{table}", chunk_rows, on_asset=on_asset)
        with conn.cursor(name=f"sxf_archive_{table}") as cur:
            cur.itersize = 1000
            if scope == "kickoff16_24":
                # No expensive fingerprint sort: SHA256 verifies exact contents
                # and the manifest preserves IDs independently of SQL ordering.
                cur.execute(
                    sql.SQL("SELECT row_to_json(r)::text FROM {} r").format(
                        sql.Identifier("research_archive", table)
                    ) + sql.SQL(window_sql_filter()),
                    (day, selected_uuids, selected_hashes))
            else:
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
        expected = actual if scope == "kickoff16_24" else source.get(expected_key)
        entry = {
            "table": table, "source_sql_rows": actual, "source_run_recorded_rows": expected,
            "full_day_source_run_rows": source.get(expected_key),
            "count_basis": "INDEPENDENT_SCOPED_SQL" if scope == "kickoff16_24" else "DAILY_ARCHIVE_RUN",
            "archive_run_count_matches": (actual == expected if expected is not None else None),
            "exported_rows": writer.total, "assets": writer.assets,
        }
        if resume is not None:
            resume.finish(table, entry)
        tables.append(entry)
        total += writer.total
        print(json.dumps({"table": table, "rows": writer.total, "chunks": len(writer.assets)}), flush=True)
    return {"tables": tables, "total_exported_rows": total,
            "source_run_counts_match": all(t["archive_run_count_matches"] is True for t in tables)}



def require_complete_full_export_inventory(result: dict) -> None:
    """Fail closed unless all eight raw tables match SQL counts and archive_runs.

    This certifies the exported captured source inventory, not historical source
    collection completeness (the latter may remain PARTIAL).
    """
    tables = result.get("tables")
    if not isinstance(tables, list) or len(tables) != len(FULL_TABLES):
        raise ValueError("Full raw export requires exactly eight source tables")
    names = [t.get("table") for t in tables]
    if len(set(names)) != len(FULL_TABLES) or set(names) != set(FULL_TABLES):
        raise ValueError("Full raw export table inventory is missing or duplicated")
    counted = 0
    for item in tables:
        sql_rows = item.get("source_sql_rows")
        expected_rows = item.get("source_run_recorded_rows")
        exported_rows = item.get("exported_rows")
        if (
            type(sql_rows) is not int or sql_rows < 0
            or type(expected_rows) is not int or expected_rows < 0
            or type(exported_rows) is not int or exported_rows < 0
            or sql_rows != expected_rows or sql_rows != exported_rows
            or item.get("archive_run_count_matches") is not True
        ):
            raise ValueError(f"Full raw source-count mismatch: {item.get('table')}")
        counted += exported_rows
    if result.get("source_run_counts_match") is not True or counted != result.get("total_exported_rows"):
        raise ValueError("Full raw manifest totals mismatch; refuse Release upload")


def select_checkpoint_batch(conn, day: dt.date, table: str, limit: int, offset: int,
                            scope: str = "all"):
    from psycopg import sql
    query = sql.SQL("""
        WITH f AS MATERIALIZED (
          SELECT source_internal_id, fixture_uid, match_id_hash, kickoff_utc
          FROM research_archive.fixtures WHERE local_date=%s
          {window_condition}
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
    """.replace("{window_condition}", WINDOW_SQL if scope == "kickoff16_24" else "")).format(
        sql.Identifier("research_archive", table))
    with conn.cursor() as cur:
        cur.execute(query, (day, limit, offset, day))
        return cur.fetchall()


def export_concentrated(conn, day: dt.date, folder: Path, chunk_rows: int, batch_fixtures: int,
                        on_asset=None, scope: str = "all",
                        selected_fixtures=None, resume=None) -> dict:
    if scope == "kickoff16_24":
        fixtures = len(selected_fixtures)
    else:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM research_archive.fixtures WHERE local_date=%s", (day,))
            fixtures = cur.fetchone()[0]
    if fixtures == 0:
        raise ValueError("No fixtures for concentrated archive date")
    markets = []
    for market, table in MARKETS.items():
        if resume is not None:
            cached = resume.load(market)
            if cached is not None:
                if cached.get("fixture_count") != fixtures or cached.get("slots") != fixtures * len(T_HOURS):
                    raise ValueError("Cached market checkpoint count changed")
                markets.append(cached)
                continue
        writer = ChunkWriter(folder, f"concentrated_{day}_{market.replace('.', '')}", chunk_rows, on_asset=on_asset)
        present, missing = 0, 0
        for offset in range(0, fixtures, batch_fixtures):
            records = select_checkpoint_batch(conn, day, table, batch_fixtures, offset, scope=scope)
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
        entry = {
            "market": market, "fixture_count": fixtures, "slots": expected,
            "present": present, "missing": missing, "assets": writer.assets
        }
        if resume is not None:
            resume.finish(market, entry)
        markets.append(entry)
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
    scope = manifest.get("scope", "all")
    if scope not in SCOPES:
        raise ValueError("Unknown archive fixture selection scope")
    if scope == "kickoff16_24" and not manifest.get("selected_fixture_count"):
        raise ValueError("Scoped archive missing selected fixture inventory")
    selected_ids = set(manifest.get("selected_fixture_uids", []))
    selected_hashes = set(manifest.get("selected_match_id_hashes", []))
    if kind == "full_snapshots":
        require_complete_full_export_inventory(manifest)
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
                        if scope == "kickoff16_24" and not (
                            obj.get("fixture_uid") in selected_ids or
                            obj.get("match_id_hash") in selected_hashes
                        ):
                            raise ValueError("Raw row outside selected kickoff window")
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


def begin_verified_progress_release(conn, day: dt.date, kind: str, folder: Path,
                                    source: dict, scope: str = "all",
                                    selected_fixtures=None, window_counts=None):
    """Create a non-public draft, then count only successfully uploaded full chunks.

    The marker contains the exact source row total. Individual asset filenames
    contain their actual row counts. The admin UI must NEVER display 100%
    unless a Release verification_receipt.json exists and the workflow succeeds.
    """
    tag = os.environ.get("SXF_ARCHIVE_RELEASE_TAG", "")
    if not re.fullmatch(r"sxf-(?:raw|concentrated)-20\d{2}-\d{2}-\d{2}(?:-kickoff16-24)?-v1", tag):
        raise ValueError("Invalid progress Release tag")
    suffix = "-kickoff16-24" if scope == "kickoff16_24" else ""
    expected_tag = f"sxf-{'raw' if kind == 'full_snapshots' else 'concentrated'}-{day}{suffix}-v1"
    if tag != expected_tag:
        raise ValueError("Release tag/date/type mismatch")
    if scope == "kickoff16_24":
        expected_total = (
            sum(window_counts.values()) if kind == "full_snapshots" else
            len(selected_fixtures) * 27
        )
    else:
        with conn.cursor() as cur:
            if kind == "full_snapshots":
                from psycopg import sql
                expected_total = 0
                for table, key in FULL_TABLES.items():
                    recorded = source.get(key)
                    if type(recorded) is not int or recorded < 0:
                        raise ValueError(f"Invalid source inventory for {table}")
                    cur.execute(
                        sql.SQL("SELECT COUNT(*) FROM {} WHERE local_date=%s").format(
                            sql.Identifier("research_archive", table)
                        ), (day,),
                    )
                    if cur.fetchone()[0] != recorded:
                        raise ValueError(f"Source inventory mismatch before upload: {table}")
                    expected_total += recorded
            else:
                cur.execute("SELECT COUNT(*) FROM research_archive.fixtures WHERE local_date=%s", (day,))
                expected_total = cur.fetchone()[0] * 27
    if expected_total < 1:
        raise ValueError("Empty source day; refusing zero-length progress claim")

    def gh(*args):
        subprocess.run(["gh", "release", *args], check=True, stdout=subprocess.DEVNULL)

    # github-cli refuses an already existing tag. Never overwrite prior archives.
    gh("create", tag, "--draft", "--latest=false",
       "--title", f"SXF {day} {kind} (streaming; unverified)",
       "--notes", "Draft source export. Only the final SHA256/JSONL readback receipt certifies completion.")
    marker = folder / f"progress_total_rows_{expected_total}.json"
    marker.write_text(json.dumps({
        "schema": "SXF_RELEASE_PROGRESS_V1", "day": str(day),
        "kind": kind, "scope": scope, "expected_rows": expected_total,
        "count_type": "source_rows" if kind == "full_snapshots" else "checkpoint_slots",
        "status": "UPLOADING_NOT_VERIFIED",
    }, indent=2) + "\n", encoding="utf-8")
    gh("upload", tag, str(marker))

    def upload_one(asset: dict, path: Path) -> None:
        # gh exits unsuccessfully if GitHub rejects the asset; do not count
        # failed uploads. The draft stays available for diagnosis/recovery.
        gh("upload", tag, str(path))
        print(json.dumps({
            "stage": "github_chunk_uploaded", "kind": kind, "day": str(day),
            "chunk": asset["name"], "uploaded_rows_in_chunk": asset["rows"],
            "total_expected_rows": expected_total,
        }), flush=True)

    return upload_one


def export(day: dt.date, kind: str, folder: Path, chunk_rows: int, batch_fixtures: int,
           scope: str = "all") -> dict:
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
            # Allow bounded, large historical SELECTs without persisting role
            # settings. This transaction is still strictly READ ONLY.
            timeout_ms = int(os.environ.get("SXF_READ_STATEMENT_TIMEOUT_MS", "900000"))
            if not 60000 <= timeout_ms <= 1800000:
                raise ValueError("Read statement timeout must be 1-30 minutes")
            cur.execute("SELECT set_config('statement_timeout', %s, true)",
                        (str(timeout_ms),))
            cur.execute("SHOW statement_timeout")
            effective_timeout = cur.fetchone()[0]
            print(json.dumps({"stage": "source_query_timeout",
                              "effective": effective_timeout}), flush=True)
        require_genuine_readonly_role(conn)
        source = source_manifest(conn, day)
        fixtures = selected_window_fixtures(conn, day) if scope == "kickoff16_24" else None
        window_counts = (source_window_counts(conn, day, fixtures)
                         if scope == "kickoff16_24" and kind == "full_snapshots" else None)
        if (scope == "kickoff16_24" and os.environ.get("SXF_STREAM_RELEASE_UPLOAD") == "1"):
            release_tag = os.environ.get("SXF_ARCHIVE_RELEASE_TAG", "")
            expect_tag = (
                f"sxf-{'raw' if kind == 'full_snapshots' else 'concentrated'}-"
                f"{day}-kickoff16-24-v1"
            )
            if release_tag != expect_tag:
                raise ValueError("Unsafe scoped Release tag")
            expected_rows = (sum(window_counts.values()) if kind == "full_snapshots"
                             else len(fixtures) * 27)
            resume = VerifiedReleaseResume(release_tag, folder, day, scope,
                                           source, fixtures, expected_rows)
            on_asset = resume
        else:
            resume = None
            on_asset = (begin_verified_progress_release(
                            conn, day, kind, folder, source, scope=scope,
                            selected_fixtures=fixtures, window_counts=window_counts)
                        if os.environ.get("SXF_STREAM_RELEASE_UPLOAD") == "1" else None)
        result = (export_full(conn, day, folder, chunk_rows, source, on_asset=on_asset,
                              scope=scope, fixtures=fixtures, window_counts=window_counts,
                              resume=resume)
                  if kind == "full_snapshots" else
                  export_concentrated(conn, day, folder, chunk_rows, batch_fixtures,
                                      on_asset=on_asset, scope=scope,
                                      selected_fixtures=fixtures, resume=resume))
    if kind == "full_snapshots":
        require_complete_full_export_inventory(result)
    manifest = {
        "schema_version": "SXF_CAPITALE_DAY_ARCHIVE_V1", "source_schema": "research_archive",
        "source_access": "SELECT_ONLY", "day": str(day), "timezone": "Europe/Istanbul",
        "kind": kind, "scope": scope, "gzip_level": int(os.environ.get("SXF_GZIP_LEVEL", "3")),
        "selected_fixture_count": len(fixtures) if fixtures is not None else None,
        "selected_fixture_uids": [str(x[0]) for x in fixtures if x[0] is not None] if fixtures else [],
        "selected_match_id_hashes": [x[1] for x in fixtures if x[1] is not None] if fixtures else [],
        "window_local_start": "16:00" if scope == "kickoff16_24" else None,
        "window_local_end_exclusive": "24:00" if scope == "kickoff16_24" else None,
        "source_archive_run_status": source.get("status"),
        "source_expected_fixtures": source.get("expected_fixtures"),
        "source_archived_fixtures": source.get("archived_fixtures"),
        "release_upload_verified": False, "github_migration_complete": False,
        "source_collection_complete": source.get("status") == "COMPLETE",
        "notes": [
            ("Selected kickoff-window matches preserve all associated stored raw rows, "
             "including observations outside 16:00-24:00; other matches intentionally excluded."
             if scope == "kickoff16_24" else
             "Original raw records including unmatched/post-kickoff rows preserved in full mode."),
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
    parser.add_argument("--scope", choices=SCOPES, default="all")
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
    result = export(day, args.kind, args.output_dir, args.chunk_rows, args.fixture_batch,
                    scope=args.scope)
    print(json.dumps({"kind": args.kind, "day": str(day), "exported_rows":
          result.get("total_exported_rows", result.get("checkpoint_slots")),
          "locally_verified": True, "github_upload_verified": False}))


if __name__ == "__main__":
    main()
