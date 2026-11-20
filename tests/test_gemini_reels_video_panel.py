"""Offline-only tests of Gemini video panel; no API key or real model calls."""
import argparse
import importlib.util
import re
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import gemini_reels_video_panel as video


class GeminiVideoPanelTests(unittest.TestCase):
    def example(self, pid):
        return {
            "persona_id": pid,
            "first_three_seconds": "stops",
            "hook_reason": "La cifra evidenziata al secondo tre incuriosisce.",
            "would_watch_to_end": "conditional",
            "likely_dropoff": "watches_all",
            "curiosity_0_10": 8,
            "excitement_0_10": 7,
            "felt_excited": "yes",
            "excitement_reason": "È interessante vedere un resoconto con partite.",
            "believes_software_works": "uncertain",
            "trust_0_10": 4,
            "trust_reason": "L'interfaccia non dimostra che i rendimenti siano verificati.",
            "video_claims_verifiable": "partly",
            "follow": "conditional",
            "follow_reason": "Guarderei alcuni esempi prima di seguire.",
            "telegram": "no",
            "telegram_reason": "Non vedo un motivo chiaro per entrare nel canale.",
            "primary_doubt": "unverified_profits",
            "main_objection": "Non vedo dati indipendenti sul profitto.",
            "most_memorable_moment": "Al secondo 3 compare la cifra arancione.",
            "proof_needed": "Una cronologia controllabile dei risultati.",
            "one_edit_to_improve": "Aprire con la prova verificabile di una selezione.",
            "reaction_it": "Il numero mi incuriosisce, ma voglio prove.",
        }

    def test_video_response_validation(self):
        d = self.example("P007")
        self.assertEqual(d, video.validate(d, "P007"))
        with self.assertRaises(ValueError):
            video.validate(d, "P002")
        d["trust_0_10"] = 11
        with self.assertRaises(ValueError):
            video.validate(d, "P007")

    def test_attentive_not_convinced_can_be_reported(self):
        d = self.example("P004")
        self.assertEqual("stops", d["first_three_seconds"])
        self.assertEqual("yes", d["felt_excited"])
        self.assertEqual("uncertain", d["believes_software_works"])
        self.assertIn("Excited, but NOT convinced", video.summarize(self.meta(), [
            {"persona": {"id": "P004", "name": "Mario", "age": 29,
                         "city": "Roma", "segment": "football_only"}, "answer": d}
        ]))

    def meta(self):
        return {"requested": 10, "completed": 1, "video_sha256": "fake",
                "video": "test.mp4", "model": "mock", "dry_run": False,
                "persona_sha256": "fake"}

    def test_ten_video_requests_distinct_personas_same_video(self):
        seen, uploaded, deleted = [], [], []
        def uploader(key, path):
            uploaded.append(str(path))
            return "files/mock-test", "https://generativelanguage.googleapis.com/v1beta/files/mock-test"
        def client(key, model, uri, prompt):
            pid = re.search(r"Return persona_id EXACTLY (P\d+)", prompt).group(1)
            seen.append((pid, uri))
            return self.example(pid), {"prompt_tokens": 333, "output_tokens": 111}
        with tempfile.TemporaryDirectory() as t:
            mp4 = Path(t) / "video.mp4"
            mp4.write_bytes(b"\x00\x00\x00\x18ftypisom" + b"x" * 1030)
            args = argparse.Namespace(
                video=str(mp4), n=10, seed=7,
                model="gemini-3.5-flash-lite", delay=0,
                dry_run=False, out=str(Path(t) / "answers"))
            old = video.os.environ.get("GEMINI_API_KEY")
            video.os.environ["GEMINI_API_KEY"] = "TEST-MOCK-ONLY"
            try:
                meta = video.run(args, client=client, uploader=uploader,
                                 deleter=lambda key, name: deleted.append(name),
                                 sleeper=lambda _: None)
            finally:
                if old is None:
                    video.os.environ.pop("GEMINI_API_KEY", None)
                else:
                    video.os.environ["GEMINI_API_KEY"] = old
            self.assertEqual(10, meta["completed"])
            self.assertEqual(1, len(uploaded))
            self.assertEqual(1, len(set(uri for _, uri in seen)))
            self.assertEqual(10, len(set(pid for pid, _ in seen)))
            self.assertEqual(["files/mock-test"], deleted)
            self.assertEqual(10, len(list((Path(args.out) / "answers").glob("*.json"))))
            report = (Path(args.out) / "report.md").read_text()
            self.assertIn("Excited, but NOT convinced", report)
            self.assertIn("P", report)

    def test_dry_run_not_called(self):
        with tempfile.TemporaryDirectory() as t:
            mp4 = Path(t) / "video.mp4"
            mp4.write_bytes(b"small local video placeholder")
            args = argparse.Namespace(video=str(mp4), n=100, seed=7,
                                      model="gemini-3.5-flash-lite", delay=0,
                                      dry_run=True, out=str(Path(t) / "out"))
            meta = video.run(args, uploader=lambda *a: self.fail("must not upload"),
                             client=lambda *a: self.fail("must not call"))
            self.assertEqual(100, meta["requested"])
            self.assertEqual(0, meta["completed"])
            self.assertTrue(meta["dry_run"])


if __name__ == "__main__":
    unittest.main()
