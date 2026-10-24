"""Offline GH Release receipt finalizer tests. No Supabase / real GitHub."""
import base64
import gzip
import hashlib
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock

from scripts.export_sxf_daily_archive import ChunkWriter, FULL_TABLES
from scripts.finalize_sxf_verified_release import prepare_index, save_append_only_index

DAY = "2026-10-11"
TAG = f"sxf-raw-{DAY}-kickoff16-24-v1"
REPO = "hazardyk27-sudo/capitale"


class FinalizerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self.tmp.name)
        w = ChunkWriter(self.dir, f"raw_{DAY}_moneyway_1x2_history", 1)
        w.add(json.dumps({"local_date": DAY,
                          "fixture_uid": "00000000-0000-0000-0000-000000000001",
                          "match_id_hash": "hash-match"}))
        w.close()
        entries = []
        for table in FULL_TABLES:
            filled = table == "moneyway_1x2_history"
            count = 1 if filled else 0
            entries.append({
                "table": table, "source_sql_rows": count,
                "source_run_recorded_rows": count, "exported_rows": count,
                "archive_run_count_matches": True,
                "assets": w.assets if filled else [],
            })
        self.manifest = {
            "source_schema": "research_archive",
            "scope": "kickoff16_24", "day": DAY, "kind": "full_snapshots",
            "selected_fixture_count": 1,
            "selected_fixture_uids": ["00000000-0000-0000-0000-000000000001"],
            "selected_match_id_hashes": ["hash-match"],
            "source_run_counts_match": True,
            "total_exported_rows": 1,
            "tables": entries,
        }
        self._write("export_manifest.json", self.manifest)
        self._write("progress_total_rows_1.json", {"expected_rows": 1})
        self.receipt = {
            "status": "GITHUB_RELEASE_DRAFT_DOWNLOADED_AND_VERIFIED",
            "github_run_id": "40110067276",
            "release_tag": TAG, "day": DAY, "kind": "full_snapshots",
            "scope": "kickoff16_24", "source_count_consistency": True,
            "total_verified_rows": 1,
            "export_manifest_sha256": hashlib.sha256(
                (self.dir / "export_manifest.json").read_bytes()
            ).hexdigest(),
        }
        self._write("verification_receipt.json", self.receipt)

    def tearDown(self):
        self.tmp.cleanup()

    def _write(self, name, obj):
        (self.dir / name).write_text(json.dumps(obj), encoding="utf-8")

    def _mockgh(self, *args):
        if "/releases/tags/" in args[1]:
            return json.dumps({"draft": True, "id": 12345})
        if "assets?" in args[2]:
            return "\n".join(p.name for p in self.dir.iterdir() if p.is_file())
        raise AssertionError("Unrecognized gh invocation: " + repr(args))

    def test_full_verified_assets_produce_append_only_index(self):
        name, record = prepare_index(self.dir, TAG, DAY, "full_snapshots",
                                     REPO, expected_source_run="40110067276",
                                     gh=self._mockgh)
        self.assertEqual(name, "archive/2026/10/11/03_full_snapshots/"
                               "admin_release_receipt_kickoff16_24_v1.json")
        self.assertEqual(record["total_verified_rows"], 1)
        self.assertEqual(len(record["asset_inventory"]), 1)
        self.assertEqual(record["receipt_index_schema"], "SXF_VERIFIED_RELEASE_INDEX_V2")

    def test_corrupt_gzip_refused(self):
        chunk = next(self.dir.glob("*.jsonl.gz"))
        chunk.write_bytes(b"broken")
        with self.assertRaisesRegex(ValueError, "SHA|gzip"):
            prepare_index(self.dir, TAG, DAY, "full_snapshots", REPO, gh=self._mockgh)

    def test_missing_receipt_refused(self):
        (self.dir / "verification_receipt.json").unlink()
        with self.assertRaisesRegex(ValueError, "not fully verified"):
            prepare_index(self.dir, TAG, DAY, "full_snapshots", REPO, gh=self._mockgh)

    def test_changed_manifest_receipt_sha_refused(self):
        self.manifest["selected_fixture_count"] = 2
        self._write("export_manifest.json", self.manifest)
        with self.assertRaisesRegex(ValueError, "manifest SHA-256 mismatch"):
            prepare_index(self.dir, TAG, DAY, "full_snapshots", REPO, gh=self._mockgh)

    def test_wrong_source_run_refused(self):
        with self.assertRaisesRegex(ValueError, "another original export"):
            prepare_index(self.dir, TAG, DAY, "full_snapshots", REPO,
                          expected_source_run="1111111", gh=self._mockgh)

    def test_missing_remote_file_refused(self):
        def remote_missing(*args):
            if len(args) > 2 and "assets?" in args[2]:
                return "verification_receipt.json"
            return self._mockgh(*args)
        with self.assertRaisesRegex(ValueError, "assets differ"):
            prepare_index(self.dir, TAG, DAY, "full_snapshots", REPO,
                          gh=remote_missing)

    def test_append_only_idempotent_and_conflicting_index_refused(self):
        store = {}
        def fake(*args):
            if args[0] != "api":
                raise AssertionError(args)
            if args[1] == "--method":
                key = args[3]
                store[key] = base64.b64decode(
                    next(x[len("content="):] for x in args if x.startswith("content="))
                )
                return json.dumps({"content": {"sha": "mock"}})
            key = args[1].split("?")[0]
            if key not in store:
                raise subprocess.CalledProcessError(1, args, stderr="HTTP 404: Not Found")
            return json.dumps({"content": base64.b64encode(store[key]).decode()})
        target, index = prepare_index(self.dir, TAG, DAY, "full_snapshots",
                                      REPO, gh=self._mockgh)
        self.assertGreater(save_append_only_index(REPO, target, index, gh=fake), 20)
        self.assertGreater(save_append_only_index(REPO, target, index, gh=fake), 20)
        with self.assertRaisesRegex(ValueError, "exists with different bytes"):
            save_append_only_index(REPO, target, {**index, "tamper": True}, gh=fake)


if __name__ == "__main__":
    unittest.main()
