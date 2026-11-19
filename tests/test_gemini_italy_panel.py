import argparse
import importlib.util
import json
from pathlib import Path
import re
import tempfile
import unittest

TARGET = Path(__file__).resolve().parents[1] / "scripts/gemini_italy_panel.py"
spec = importlib.util.spec_from_file_location("gemini_italy_panel", TARGET)
panel = importlib.util.module_from_spec(spec)
spec.loader.exec_module(panel)

class GeminiPanelTests(unittest.TestCase):
    def setUp(self):
        self.customer = json.loads((panel.ROOT / "founder/customer.json").read_text())

    def answer(self, persona_id):
        return {"persona_id": persona_id, "follow": "conditional",
                "follow_reason": "Vorrei vedere un esempio verificabile.",
                "telegram": "no", "telegram_reason": "Non conosco il contenuto del canale.",
                "primary_concern": "methodology",
                "main_objection": "La metodologia non è descritta.",
                "one_improvement": "Mostrare una spiegazione di una partita."}

    def test_reproducibility_and_uniqueness(self):
        for n in (10, 20, 100):
            cards = panel.personas(self.customer, n, 7)
            self.assertEqual(cards, panel.personas(self.customer, n, 7))
            self.assertEqual(n, len(cards))
            self.assertEqual(n, len({c["id"] for c in cards}))
            self.assertEqual(n, len({c["name"] for c in cards}))
            self.assertTrue(all(c["age"] >= 18 for c in cards))

    def test_response_validation(self):
        self.assertEqual("conditional", panel.verify(self.answer("P001"), "P001")["follow"])
        with self.assertRaises(ValueError):
            panel.verify(self.answer("P001"), "P002")
        invalid = self.answer("P001")
        invalid["telegram"] = "not sure"
        with self.assertRaises(ValueError):
            panel.verify(invalid, "P001")

    def test_ten_distinct_model_calls(self):
        calls = []
        def mock(key, model, prompt):
            pid = re.search(r"Return persona_id exactly (P\d+)", prompt).group(1)
            calls.append(pid)
            return self.answer(pid), {"prompt_tokens": 20, "output_tokens": 30}
        with tempfile.TemporaryDirectory() as tmp:
            args = argparse.Namespace(n=10, seed=7, model="gemini-3.5-flash-lite",
                                      out=tmp, dry_run=False, delay=0)
            old = panel.os.environ.get("GEMINI_API_KEY")
            panel.os.environ["GEMINI_API_KEY"] = "dummy-test-key"
            try:
                result = panel.run(args, client=mock, sleeper=lambda _: None)
            finally:
                if old is None:
                    panel.os.environ.pop("GEMINI_API_KEY", None)
                else:
                    panel.os.environ["GEMINI_API_KEY"] = old
            self.assertEqual(10, result["completed"])
            self.assertEqual(10, len(set(calls)))
            self.assertEqual(10, len(list((Path(tmp) / "answers").glob("*.json"))))
            self.assertNotIn("dummy-test-key", (Path(tmp) / "manifest.json").read_text())

    def test_dry_run_makes_no_requests(self):
        with tempfile.TemporaryDirectory() as tmp:
            args = argparse.Namespace(n=10, seed=7, model="gemini-3.5-flash-lite",
                                      out=tmp, dry_run=True, delay=0)
            result = panel.run(args, client=lambda *args: self.fail("No API calls expected"))
            self.assertEqual(0, result["completed"])
            self.assertTrue(result["dry_run"])

if __name__ == "__main__":
    unittest.main()
