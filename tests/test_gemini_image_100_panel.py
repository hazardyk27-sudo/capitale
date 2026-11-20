"""No-API unit tests for user-supplied Gemini-only 100-image panel."""
import argparse
import base64
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import gemini_image_100_panel as images


def mock_response(pid):
    answer = {"persona_id": pid}
    for field, definition in images.FIELDS.items():
        if field == "persona_id":
            continue
        if definition["type"] == "INTEGER":
            answer[field] = 5
        elif "enum" in definition:
            answer[field] = "uncertain" if "uncertain" in definition["enum"] else "conditional"
        else:
            answer[field] = "Visivamente il numero €89 è grande, ma non ci sono prove indipendenti."
    return answer


class ImagePanelTests(unittest.TestCase):
    def test_validation(self):
        answer = mock_response("P001")
        self.assertEqual(answer, images.validate(answer, "P001"))
        with self.assertRaises(ValueError):
            images.validate(answer, "P002")
        answer["trust_0_10"] = 17
        with self.assertRaises(ValueError):
            images.validate(answer, "P001")

    def test_frozen_profiles(self):
        cards = images.personas({}, 100, 7)
        self.assertEqual(100, len(cards))
        self.assertEqual(100, len({p["id"] for p in cards}))
        self.assertTrue(all(p["gender"] == "male" and p["nationality"] == "italian"
                            and 18 <= p["age"] <= 55 for p in cards))
        self.assertEqual("P001", cards[0]["id"])
        self.assertEqual("P100", cards[-1]["id"])

    def test_ten_separate_image_calls_with_mock(self):
        fake_webp = b"RIFF" + b"\0" * 4 + b"WEBP" + b"a" * 5000
        with tempfile.TemporaryDirectory() as temp, \
                patch.object(images, "image_bytes", return_value=fake_webp), \
                patch.dict(images.os.environ, {"GEMINI_API_KEY": "FAKE-TEST-ONLY"}):
            sent = []
            def client(key, model, picture, prompt):
                import re
                pid = re.search(r"Return persona_id exactly (P\d+)", prompt).group(1)
                sent.append((pid, picture))
                return mock_response(pid), {"prompt_tokens": 120, "output_tokens": 230}
            arguments = argparse.Namespace(n=10, model=images.MODEL, delay=0,
                                           out=str(Path(temp) / "results"), dry_run=False)
            meta = images.run(arguments, client=client, sleeper=lambda _: None)
            self.assertEqual(10, meta["completed"])
            self.assertEqual(10, len({pid for pid, _ in sent}))
            self.assertTrue(all(data == fake_webp for _, data in sent))
            self.assertEqual(10, len(list((Path(arguments.out) / "answers").glob("P*.json"))))
            self.assertIn("fictional", (Path(arguments.out) / "report.md").read_text().lower())

    def test_hundred_person_dry_run_without_gemini_calls(self):
        with tempfile.TemporaryDirectory() as temp, \
                patch.object(images, "image_bytes", return_value=b"RIFF" + b"x"*10), \
                patch.dict(images.os.environ, {}, clear=True):
            arguments = argparse.Namespace(n=100, model=images.MODEL, delay=0,
                                           out=str(Path(temp) / "dry"), dry_run=True)
            meta = images.run(arguments, client=lambda *a: self.fail("No API calls expected"))
            self.assertEqual(100, meta["requested"])
            self.assertEqual(0, meta["completed"])
            self.assertTrue(meta["dry_run"])


if __name__ == "__main__":
    unittest.main()
