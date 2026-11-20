"""No-quota test suite for CAPITALE 40/30/30 free API study."""
import argparse
from collections import Counter
import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import free_multi_ai_reels_panel as multi


def answer(pid):
    return {
        "persona_id": pid, "first_three_seconds": "maybe",
        "hook_reason": "I primi secondi non spiegano subito il metodo.",
        "would_watch_to_end": "conditional", "likely_dropoff": "6-10s",
        "curiosity_0_10": 6, "excitement_0_10": 4,
        "felt_excited": "uncertain",
        "excitement_reason": "Il numero arancione attira la curiosità ma non prova nulla.",
        "believes_software_works": "uncertain", "trust_0_10": 4,
        "trust_reason": "Il software è mostrato ma non è verificabile da un video.",
        "video_claims_verifiable": "partly", "follow": "conditional",
        "follow_reason": "Vorrei vedere una selezione pre-partita verificabile.",
        "telegram": "no", "telegram_reason": "Non vedo ancora un vantaggio concreto.",
        "primary_doubt": "unverified_profits",
        "main_objection": "Il profitto dichiarato non è verificato esternamente.",
        "most_memorable_moment": "La cifra grande intorno a tre secondi.",
        "proof_needed": "Una cronologia con tutti i risultati e le perdite.",
        "one_edit_to_improve": "Dare contesto al dato e alla durata della prova.",
        "reaction_it": "Mi incuriosisce ma non basta per fidarmi."
    }


class MultiAITests(unittest.TestCase):
    def test_assignments_frozen_balanced_and_unique(self):
        source = json.loads(multi.ASSIGN_PATH.read_text(encoding="utf-8"))
        a = source["assignments"]
        self.assertEqual(100, len(a))
        self.assertEqual(100, len({x["persona_id"] for x in a}))
        for provider, count in multi.TARGETS.items():
            self.assertEqual(count, sum(x["provider"] == provider for x in a))
        self.assertEqual([4, 3, 3], [len(multi.selection(10)[p]) for p in multi.PROVIDER_ORDER])
        self.assertEqual([8, 6, 6], [len(multi.selection(20)[p]) for p in multi.PROVIDER_ORDER])
        self.assertEqual([40, 30, 30], [len(multi.selection(100)[p]) for p in multi.PROVIDER_ORDER])
        for provider, users in multi.selection(100).items():
            self.assertTrue(all(c["gender"] == "male" and c["nationality"] == "italian"
                                and 18 <= c["age"] <= 55 for c in users))

    def test_non_free_openrouter_model_rejected(self):
        with self.assertRaises(RuntimeError):
            multi.ensure_free_openrouter("dummy", "nvidia/nemotron-3.5-super-vl")
        with self.assertRaises(ValueError):
            multi.vision_response("openrouter", "dummy", [], "not-free-model")
        with self.assertRaises(ValueError):
            multi.vision_response("groq", "dummy", [
                {"type": "image_url"} for _ in range(4)], "qwen/qwen3.8-27b")

    def test_dry_run_calls_no_external_services(self):
        with tempfile.TemporaryDirectory() as tmp:
            mp4 = Path(tmp) / "video.mp4"
            mp4.write_bytes(b"fake MP4 data, no calls")
            args = argparse.Namespace(n=100, video=str(mp4),
                                     out=str(Path(tmp) / "out"), delay=0, dry_run=True)
            result = multi.run(
                args, gemini_uploader=lambda *a: self.fail("called Gemini"),
                gemini_client=lambda *a: self.fail("called Gemini"),
                vision_client=lambda *a: self.fail("called vision"),
                catalog_checker=lambda *a: self.fail("called paid model"),
                frame_builder=lambda *a: self.fail("called ffmpeg"))
            self.assertEqual(0, result["completed"])
            self.assertTrue(result["dry_run"])
            self.assertEqual([40, 30, 30],
                             [result["requested_by_provider"][p] for p in multi.PROVIDER_ORDER])

    def test_real_provider_calls_with_mock_clients(self):
        with tempfile.TemporaryDirectory() as tmp:
            mp4 = Path(tmp) / "video.mp4"
            mp4.write_bytes(b"simulated video to test orchestration only")
            out = Path(tmp) / "out"
            gemini_seen, others_seen = [], []
            original = {k: multi.os.environ.get(k) for k in multi.KEYS.values()}
            for key in multi.KEYS.values():
                multi.os.environ[key] = "DUMMY_TEST_ONLY"
            def uploader(key, video):
                return "files/mock", "mock-video-uri"
            def gclient(key, model, uri, prompt):
                import re
                pid = re.search(r"Return persona_id EXACTLY (P\d+)", prompt).group(1)
                gemini_seen.append((pid, uri))
                return answer(pid), {}
            def frame_builder(video, directory, stamps):
                Path(directory).mkdir(parents=True, exist_ok=True)
                result = []
                for i, second in enumerate(stamps):
                    p = Path(directory) / ("t_%s.jpg" % i)
                    p.write_bytes(b"fake-jpg-content")
                    result.append((second, p))
                return result
            def vclient(provider, key, parts, model):
                import re
                pid = re.search(r"Reply with persona_id EXACTLY (P\d+)", parts[0]["text"]).group(1)
                others_seen.append((pid, provider, len([p for p in parts if p["type"]=="image_url"])))
                return answer(pid), {}, model
            args = argparse.Namespace(n=10, video=str(mp4), out=str(out), delay=0, dry_run=False)
            try:
                result = multi.run(
                    args, gemini_uploader=uploader, gemini_client=gclient,
                    vision_client=vclient, frame_builder=frame_builder,
                    catalog_checker=lambda key, model: model,
                    gemini_deleter=lambda key, name: None,
                    sleeper=lambda delay: None)
            finally:
                for k, v in original.items():
                    if v is None:
                        multi.os.environ.pop(k, None)
                    else:
                        multi.os.environ[k] = v
            self.assertEqual(10, result["completed"])
            self.assertEqual(4, len(gemini_seen))
            self.assertEqual(6, len(others_seen))
            self.assertEqual(3, sum(x[1] == "groq" and x[2] == 3 for x in others_seen))
            self.assertEqual(3, sum(x[1] == "openrouter" and x[2] == 8 for x in others_seen))
            self.assertEqual(10, len(list((out / "answers").glob("P*.json"))))
            self.assertEqual(10, len({e[0] for e in gemini_seen} |
                                     {e[0] for e in others_seen}))
            self.assertTrue((out / "report.md").exists())

if __name__ == "__main__":
    unittest.main()
