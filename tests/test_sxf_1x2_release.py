"""Offline tests for the SXF 2026-10-09 1X2 Release readback verifier.

No database credentials, networks, writes to Supabase or live releases required.
"""
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

MODULE_FILE = Path(__file__).resolve().parents[1] / "scripts" / "export_sxf_1x2_release.py"
spec = importlib.util.spec_from_file_location("sxf_1x2_exporter", MODULE_FILE)
sxf = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sxf)


def build_archive(folder, *, rows=250, corrupt_digest=False, duplicate=False):
    assets = []
    for part, start in enumerate(range(0, rows, 125), 1):
        filename = f"full_2026-10-09_1x2_pilot_part{part:04d}.jsonl.gz"
        output = folder / filename
        block = []
        for idx in range(start, min(start + 125, rows)):
            record = {k: None for k in sxf.EXPECTED_KEYS}
            record["local_date"] = sxf.DAY
            record["source_fingerprint"] = f"{0 if (duplicate and idx == 1) else idx:032x}"
            block.append(json.dumps(record, separators=(",", ":")).encode() + b"\n")
        uncompressed = b"".join(block)
        with gzip.open(output, "wb") as stream:
            stream.write(uncompressed)
        assets.append({
            "name": filename, "rows": len(block),
            "sha256_gzip": sxf.digest_file(output),
            "sha256_jsonl": hashlib.sha256(uncompressed).hexdigest(),
        })
    if corrupt_digest:
        assets[0]["sha256_gzip"] = "0" * 64
    (folder / "export_manifest.json").write_text(
        json.dumps({
            "source_table": sxf.TABLE, "date_tr": sxf.DAY,
            "mode": "pilot", "exported_rows": rows, "assets": assets,
        }),
        encoding="utf-8",
    )


class ReleaseReadbackTest(unittest.TestCase):
    def test_pilot_roundtrip_250_rows(self):
        with tempfile.TemporaryDirectory() as name:
            folder = Path(name)
            build_archive(folder)
            self.assertEqual(
                sxf.verify_downloaded(folder),
                {"verified_rows": 250, "assets": 2, "mode": "pilot"},
            )

    def test_corrupt_archive_hash_is_rejected(self):
        with tempfile.TemporaryDirectory() as name:
            folder = Path(name)
            build_archive(folder, corrupt_digest=True)
            with self.assertRaisesRegex(ValueError, "SHA-256 mismatch"):
                sxf.verify_downloaded(folder)

    def test_duplicate_fingerprint_is_rejected(self):
        with tempfile.TemporaryDirectory() as name:
            folder = Path(name)
            build_archive(folder, duplicate=True)
            with self.assertRaisesRegex(ValueError, "Duplicate"):
                sxf.verify_downloaded(folder)

    def test_truncated_pilot_is_rejected(self):
        with tempfile.TemporaryDirectory() as name:
            folder = Path(name)
            build_archive(folder, rows=249)
            with self.assertRaisesRegex(ValueError, "250"):
                sxf.verify_downloaded(folder)


if __name__ == "__main__":
    unittest.main()
