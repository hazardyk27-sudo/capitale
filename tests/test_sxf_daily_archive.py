"""Offline integrity tests for the CAPITALE day-selectable archive worker."""
import datetime as dt
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts.export_sxf_daily_archive import ChunkWriter, canonical_hash, verify_directory, require_genuine_readonly_role, FULL_TABLES, VerifiedReleaseResume

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

    def test_streamed_progress_rows_match_successfully_uploaded_chunks(self):
        # Only a successful callback counts as GitHub-uploaded rows.
        with tempfile.TemporaryDirectory() as temp:
            captured = []
            folder = Path(temp)
            def upload(asset, path):
                self.assertTrue(path.is_file())
                captured.append((asset["name"], asset["rows"]))
            writer = ChunkWriter(folder, "raw_stream_test", 2, on_asset=upload)
            for index in range(3):
                writer.add(json.dumps({"local_date": DAY, "source_fingerprint": str(index)}))
            writer.close()
            self.assertEqual([x[1] for x in captured], [2, 1])
            self.assertTrue(captured[0][0].endswith("_rows_2.jsonl.gz"))
            self.assertTrue(captured[1][0].endswith("_rows_1.jsonl.gz"))
            self.assertEqual(sum(a["rows"] for a in writer.assets), 3)
            self.assertEqual(writer.assets[0]["name"], captured[0][0])

    def test_failed_stream_upload_never_records_more_chunks(self):
        with tempfile.TemporaryDirectory() as temp:
            def fail(asset, path):
                raise RuntimeError("GitHub refused asset")
            writer = ChunkWriter(Path(temp), "raw_upload_fail", 1, on_asset=fail)
            with self.assertRaisesRegex(RuntimeError, "GitHub refused asset"):
                writer.add(json.dumps({"local_date": DAY}))
            self.assertEqual(len(writer.assets), 1)

    def test_scoped_archive_rejects_raw_rows_outside_selected_fixture(self):
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp)
            self.make_full(folder)
            mpath = folder / "export_manifest.json"
            manifest = json.loads(mpath.read_text("utf-8"))
            manifest.update({
                "scope": "kickoff16_24",
                "selected_fixture_count": 1,
                "selected_fixture_uids": ["00000000-0000-0000-0000-000000000001"],
                "selected_match_id_hashes": ["selected-match"],
            })
            mpath.write_text(json.dumps(manifest), "utf-8")
            with self.assertRaisesRegex(ValueError, "outside selected kickoff window"):
                verify_directory(folder)

    def test_scoped_archive_accepts_selected_match_entire_history(self):
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp)
            writer = ChunkWriter(folder, "raw_window", 25)
            # Both before and after kickoff observations remain in scope:
            # the filter is on fixture kickoff, NOT the scrape timestamp.
            for scrape_time in ("2026-10-10T09:00:00Z", "2026-10-11T23:59:00Z"):
                writer.add(json.dumps({
                    "local_date": DAY, "fixture_uid": None,
                    "match_id_hash": "selected-match",
                    "scraped_at": scrape_time,
                }))
            writer.close()
            tables = []
            for table in FULL_TABLES:
                populated = table == "moneyway_1x2_history"
                count = 2 if populated else 0
                tables.append({
                    "table": table, "source_sql_rows": count,
                    "source_run_recorded_rows": count, "exported_rows": count,
                    "archive_run_count_matches": True,
                    "assets": writer.assets if populated else [],
                })
            manifest = {
                "source_schema": "research_archive", "kind": "full_snapshots",
                "day": DAY, "scope": "kickoff16_24",
                "selected_fixture_count": 1, "selected_fixture_uids": [],
                "selected_match_id_hashes": ["selected-match"],
                "source_run_counts_match": True, "total_exported_rows": 2,
                "tables": tables,
            }
            (folder / "export_manifest.json").write_text(json.dumps(manifest), "utf-8")
            self.assertEqual(verify_directory(folder)["verified_rows"], 2)


    def test_scoped_checkpoint_resume_skips_complete_table_and_rejects_tamper(self):
        # Simulate gh release create/upload/download without live GitHub or secrets.
        remote = {}
        fixture = [("00000000-0000-0000-0000-000000000001", "fixture-hash", 1, None)]
        source = {"status": "COMPLETE", "rows_1x2": 2}
        tag = "sxf-raw-2026-10-11-kickoff16-24-v1"

        def fake_run(argv, **kwargs):
            operation = argv[2]
            if operation == "view":
                if not remote:
                    return subprocess.CompletedProcess(argv, 1, stdout="")
                return subprocess.CompletedProcess(argv, 0, stdout=json.dumps({
                    "isDraft": True,
                    "assets": [{"name": n} for n in remote],
                }))
            if operation == "create":
                return subprocess.CompletedProcess(argv, 0)
            if operation == "download":
                folder = Path(argv[argv.index("--dir") + 1])
                for filename, content in remote.items():
                    (folder / filename).write_bytes(content)
                return subprocess.CompletedProcess(argv, 0)
            if operation == "upload":
                file = Path(argv[-1])
                if file.name in remote:
                    raise ValueError("Mock remote overwrite rejected")
                remote[file.name] = file.read_bytes()
                return subprocess.CompletedProcess(argv, 0)
            if operation == "delete-asset":
                remote.pop(argv[4])
                return subprocess.CompletedProcess(argv, 0)
            raise AssertionError(f"Unknown fake gh command: {argv}")

        with patch("scripts.export_sxf_daily_archive.subprocess.run", side_effect=fake_run):
            with tempfile.TemporaryDirectory() as one, tempfile.TemporaryDirectory() as two:
                folder = Path(one)
                resume = VerifiedReleaseResume(tag, folder, "2026-10-11",
                                              "kickoff16_24", source, fixture, 2)
                writer = ChunkWriter(folder, "raw_2026-10-11_moneyway_1x2_history",
                                     2, on_asset=resume)
                for i in range(2):
                    writer.add(json.dumps({"local_date": "2026-10-11",
                                           "fixture_uid": fixture[0][0],
                                           "source_fingerprint": str(i)}))
                writer.close()
                record = {
                    "table": "moneyway_1x2_history", "source_sql_rows": 2,
                    "source_run_recorded_rows": 2, "exported_rows": 2,
                    "archive_run_count_matches": True, "assets": writer.assets,
                }
                resume.finish("moneyway_1x2_history", record)
                fresh = VerifiedReleaseResume(tag, Path(two), "2026-10-11",
                                             "kickoff16_24", source, fixture, 2)
                self.assertEqual(
                    fresh.load("moneyway_1x2_history")["exported_rows"], 2
                )
                # A corrupt cached GitHub asset cannot count as completed.
                bad = next(n for n in remote if n.endswith(".jsonl.gz"))
                (Path(two) / bad).write_bytes(b"broken")
                with self.assertRaisesRegex(ValueError, "SHA256"):
                    fresh.load("moneyway_1x2_history")
                # The source manifest changed: refuse mixed-run data.
                with self.assertRaisesRegex(ValueError, "changed"):
                    VerifiedReleaseResume(tag, Path(two), "2026-10-11",
                                          "kickoff16_24", {"status": "PARTIAL"},
                                          fixture, 2)

    def test_gzip_level_three_is_valid_roundtrip(self):
        with patch.dict("os.environ", {"SXF_GZIP_LEVEL": "3"}):
            with tempfile.TemporaryDirectory() as temp:
                self.make_full(Path(temp))
                self.assertEqual(verify_directory(Path(temp))["verified_rows"], 3)

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
