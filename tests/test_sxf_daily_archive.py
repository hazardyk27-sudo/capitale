"""Offline integrity tests for the CAPITALE day-selectable archive worker."""
import datetime as dt
import json
import tempfile
import unittest
from pathlib import Path

from scripts.export_sxf_daily_archive import ChunkWriter, canonical_hash, verify_directory

DAY = "2026-10-09"


class ArchiveIntegrityTests(unittest.TestCase):
    def make_full(self, directory: Path):
        writer = ChunkWriter(directory, "raw_test", 2)
        for i in range(3):
            writer.add(json.dumps({"local_date": DAY, "source_fingerprint": f"fp{i}", "odds1": str(i)}))
        writer.close()
        manifest = {
            "source_schema": "research_archive", "kind": "full_snapshots", "day": DAY,
            "total_exported_rows": 3,
            "tables": [{"table": "moneyway_1x2_history", "exported_rows": 3, "assets": writer.assets}],
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


if __name__ == "__main__":
    unittest.main()
