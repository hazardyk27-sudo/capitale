"""Offline integrity tests for the CAPITALE day-selectable archive worker."""
import datetime as dt
import json
import tempfile
import unittest
from pathlib import Path

from scripts.export_sxf_daily_archive import ChunkWriter, canonical_hash, verify_directory, require_genuine_readonly_role, FULL_TABLES

DAY = "2026-10-09"


class ArchiveIntegrityTests(unittest.TestCase):
    def make_full(self, directory: Path):
        writer = ChunkWriter(directory, "raw_test", 2)
        for i in range(3):
            writer.add(json.dumps({"local_date": DAY, "source_fingerprint": f"fp{i}", "odds1": str(i)}))
        writer.close()
        tables = []
        for name in FULL_TABLES:
            populated = name == "moneyway_1x2_history"
            count = 3 if populated else 0
            tables.append({
                "table": name, "source_sql_rows": count,
                "source_run_recorded_rows": count, "exported_rows": count,
                "archive_run_count_matches": True,
                "assets": writer.assets if populated else [],
            })
        manifest = {
            "source_schema": "research_archive", "kind": "full_snapshots", "day": DAY,
            "total_exported_rows": 3, "source_run_counts_match": True,
            "tables": tables,
        }
        (directory / "export_manifest.json").write_text(json.dumps(manifest), "utf-8")
        return writer

    def make_concentrated(self, directory: Path, *, corrupt_future=False, duplicate=False):
        writer = ChunkWriter(directory, "grid_test", 20)
        for hours in (72, 60, 40, 24, 12, 8, 6, 3, 1):
            obj = {
                "source_internal_id": "1", "market": "1X2", "match_date_tr": DAY,
                "checkpoint": f"T-{hours}", "status": "MISSING",
                "target_at_utc": "2026-10-09T10:00:00Z",
                "actual_snapshot_at_utc": None, "source_payload": None,
            }
            if corrupt_future and hours == 1:
                obj["status"] = "PRESENT"
                obj["source_payload"] = {"local_date": DAY, "odds1": "1.51"}
                obj["source_row_hash_sha256"] = canonical_hash(obj["source_payload"])
                obj["actual_snapshot_at_utc"] = "2026-10-09T11:00:00Z"
            writer.add(json.dumps(obj))
        if duplicate:
            writer.add(json.dumps({
                "source_internal_id": "1", "market": "1X2", "match_date_tr": DAY,
                "checkpoint": "T-1", "status": "MISSING", "actual_snapshot_at_utc": None,
                "source_payload": None,
            }))
        writer.close()
        total = 10 if duplicate else 9
        manifest = {
            "source_schema": "research_archive", "kind": "concentrated", "day": DAY,
            "checkpoint_slots": total,
            "markets": [{"market": "1X2", "slots": total, "assets": writer.assets}],
        }
        (directory / "export_manifest.json").write_text(json.dumps(manifest), "utf-8")

    def test_full_jsonl_gzip_roundtrip(self):
        with tempfile.TemporaryDirectory() as temp:
            self.make_full(Path(temp))
            result = verify_directory(Path(temp))
            self.assertEqual(result["verified_rows"], 3)
            self.assertEqual(result["asset_count"], 2)

    def test_gzip_tamper_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            writer = self.make_full(Path(temp))
            file = Path(temp) / writer.assets[0]["name"]
            file.write_bytes(file.read_bytes()[:-5])
            with self.assertRaises(ValueError):
                verify_directory(Path(temp))

    def test_full_missing_eighth_table_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            self.make_full(Path(temp))
            path = Path(temp) / "export_manifest.json"
            manifest = json.loads(path.read_text("utf-8"))
            manifest["tables"].pop()
            path.write_text(json.dumps(manifest), "utf-8")
            with self.assertRaisesRegex(ValueError, "exactly eight"):
                verify_directory(Path(temp))

    def test_full_archive_run_count_mismatch_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            self.make_full(Path(temp))
            path = Path(temp) / "export_manifest.json"
            manifest = json.loads(path.read_text("utf-8"))
            manifest["tables"][0]["source_run_recorded_rows"] = 4
            path.write_text(json.dumps(manifest), "utf-8")
            with self.assertRaisesRegex(ValueError, "source-count mismatch"):
                verify_directory(Path(temp))

    def test_concentrated_missing_slots_are_preserved(self):
        with tempfile.TemporaryDirectory() as temp:
            self.make_concentrated(Path(temp))
            self.assertEqual(verify_directory(Path(temp))["verified_rows"], 9)

    def test_concentrated_future_data_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            self.make_concentrated(Path(temp), corrupt_future=True)
            with self.assertRaises(ValueError):
                verify_directory(Path(temp))

    def test_duplicate_fixture_market_checkpoint_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            self.make_concentrated(Path(temp), duplicate=True)
            with self.assertRaises(ValueError):
                verify_directory(Path(temp))



class FakeConnection:
    def __init__(self, result):
        self.result = result
    def cursor(self):
        return self
    def __enter__(self):
        return self
    def __exit__(self, *_):
        return False
    def execute(self, query):
        assert "pg_roles" in query and "has_table_privilege" in query
    def fetchone(self):
        return self.result


class ReadOnlyRoleTests(unittest.TestCase):
    def test_genuine_select_only_user_passes(self):
        require_genuine_readonly_role(FakeConnection((False, True, False, False)))

    def test_privileged_credentials_rejected_without_writes(self):
        for flags in ((True, True, False, False), (False, True, True, False),
                      (False, True, False, True), (False, False, False, False)):
            with self.assertRaises(PermissionError):
                require_genuine_readonly_role(FakeConnection(flags))


if __name__ == "__main__":
    unittest.main()
