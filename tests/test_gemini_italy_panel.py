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

    def test_frozen_italian_male_panel_and_budget_consistency(self):
        cards = panel.personas(self.customer, 100, 7)
        self.assertEqual(100, len(cards))
        self.assertEqual(100, len(set(c["name"] for c in cards)))
        self.assertTrue(all(c["gender"] == "male" for c in cards))
        self.assertTrue(all(c["nationality"] == "italian" and c["country"] == "Italy" for c in cards))
        self.assertTrue(all(18 <= c["age"] <= 55 for c in cards))
        self.assertGreaterEqual(len(set(c["city"] for c in cards)), 15)
        self.assertGreaterEqual(len(set(c["occupation"] for c in cards)), 12)
        self.assertGreaterEqual(len(set(c["segment"] for c in cards)), 6)
        self.assertGreaterEqual(len(set(c["instagram_style"] for c in cards)), 8)
        self.assertGreaterEqual(len(set(c["budget"]["monthly_optional_spending_eur"] for c in cards)), 20)
        self.assertGreaterEqual(sum(c["budget"]["monthly_sports_betting_self_limit_eur"] == 0 for c in cards), 50)
        for c in cards:
            b = c["budget"]
            self.assertEqual(b["personal_monthly_net_resources_eur"],
                             b["monthly_essential_costs_eur"] +
                             b["monthly_planned_savings_eur"] +
                             b["monthly_optional_spending_eur"])
            self.assertGreaterEqual(b["monthly_optional_spending_eur"],
                                    b["monthly_sports_betting_self_limit_eur"])
            if c["betting_history"] in ("never", "former"):
                self.assertEqual(0, b["monthly_sports_betting_self_limit_eur"])

    def test_pilots_reuse_the_frozen_profile_identities(self):
        all_cards = {c["id"]: c for c in panel.personas(self.customer, 100, 7)}
        for n in (10, 20):
            pilot = panel.personas(self.customer, n, 7)
            self.assertEqual(n, len(pilot))
            for card in pilot:
                self.assertEqual(all_cards[card["id"]], card)
        p = panel.make_prompt(pilot[0], "CAPITALE biography")
        self.assertIn(pilot[0]["name"], p)
        self.assertIn("monthly_sports_betting_self_limit_eur", p)
        self.assertIn("Non-bettors must not be persuaded", p)

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
