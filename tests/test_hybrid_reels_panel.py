import argparse
from collections import Counter
import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import codex_reels_hybrid_panel as codex
import gemini_reels_video_panel as gemini
import merge_hybrid_reels_results as hybrid


class HybridSplitTests(unittest.TestCase):
    def test_exact_fifty_each_and_segment_balance(self):
        data = json.loads((ROOT / "founder/hybrid_panel_assignments.json").read_text())
        entries = data["assignments"]
        self.assertEqual(100, len(entries))
        self.assertEqual(100, len({r["persona_id"] for r in entries}))
        self.assertEqual(50, sum(r["provider"] == "gemini" for r in entries))
        self.assertEqual(50, sum(r["provider"] == "codex" for r in entries))
        bysegment = {}
        for r in entries:
            bysegment.setdefault(r["segment"], Counter())[r["provider"]] += 1
        for count in bysegment.values():
            self.assertEqual(count["gemini"], count["codex"])

    def test_codex_cohort_and_schema(self):
        ids = [x["id"] for x in codex.assigned_codex(50)]
        self.assertEqual(50, len(ids))
        self.assertEqual(50, len(set(ids)))
        self.assertEqual(ids[:5], [x["id"] for x in codex.assigned_codex(5)])
        self.assertIn("felt_excited", codex.schema()["properties"])
        self.assertIn("believes_software_works", codex.schema()["properties"])
        self.assertEqual("integer", codex.schema()["properties"]["trust_0_10"]["type"])

    def test_gemini_hybrid_dry_run_uses_only_assigned_people(self):
        with tempfile.TemporaryDirectory() as tmp:
            video = Path(tmp) / "dummy.mp4"
            video.write_bytes(b"not the genuine video, dry run only")
            args = argparse.Namespace(
                video=str(video), n=50, seed=7, model="gemini-3.5-flash-lite",
                delay=0, hybrid_gemini=True, dry_run=True, out=str(Path(tmp) / "out"))
            m = gemini.run(args, client=lambda *a: self.fail("Gemini called"),
                           uploader=lambda *a: self.fail("Upload called"))
            self.assertEqual(50, m["requested"])
            self.assertEqual(0, m["completed"])
            self.assertTrue(m["hybrid_gemini"])
            ids = [x["id"] for x in json.loads((Path(args.out) / "personas.json").read_text())]
            assignments = json.loads((ROOT / "founder/hybrid_panel_assignments.json").read_text())
            expected = {x["persona_id"] for x in assignments["assignments"]
                        if x["provider"] == "gemini"}
            self.assertEqual(expected, set(ids))

    def test_codex_dry_run_needs_no_codex_account(self):
        with tempfile.TemporaryDirectory() as tmp:
            video = Path(tmp) / "dummy.mp4"
            video.write_bytes(b"no API/video call in dry run")
            args = argparse.Namespace(video=str(video), n=50, dry_run=True,
                                      out=str(Path(tmp) / "codex"))
            m = codex.run(args, call=lambda *a: self.fail("Codex called"))
            self.assertEqual(50, m["requested"])
            self.assertEqual(0, m["completed"])

    def test_partial_merge_never_invents_missing_results(self):
        with tempfile.TemporaryDirectory() as tmp:
            g, c, o = [Path(tmp) / x for x in ("gemini", "codex", "out")]
            g.mkdir()
            c.mkdir()
            status = hybrid.merge(g, c, o)
            self.assertEqual(0, status["completed"])
            self.assertEqual(50, status["missing_gemini"])
            self.assertEqual(50, status["missing_codex"])
            self.assertEqual(100, len(status["missing_ids"]))


if __name__ == "__main__":
    unittest.main()
