"""Unit tests for the Replit-independent BetCapitale Whop deploy-time guard."""
import importlib.util
import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("whop_guard", ROOT / "ensure_one_time.py")
guard = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(guard)


class WhopPlanGuardTest(unittest.TestCase):
    def setUp(self):
        self.config = guard.check_manifest()
        self.old, self.new, self.legacy = guard.entries(self.config)
        self.assertEqual(len(self.new), 9)
        self.assertEqual(len(self.legacy), 4)
        self.assertEqual(self.new[0], self.old[0])

    def source(self):
        def js(data):
            # Simulate esbuild compact output with unquoted keys.
            return json.dumps(data, ensure_ascii=True, separators=(",", ":")).replace('"id":', "id:").replace('"tier":', "tier:").replace('"label":', "label:").replace('"days":', "days:").replace('"price":', "price:").replace('"currency":', "currency:")
        return ("var Aw=" + js(self.old)
                + ",lre=" + js(self.legacy)
                + ",_c=[...Aw,...lre],xh={};"
                + 'if(O.has(l??"")){let E=await x()')

    def test_old_bundle_migrates_to_one_time(self):
        patched, state = guard.patch(self.source(), self.config)
        self.assertIn("migration-applied", state)
        self.assertIn("revoke_deferred_access_still_valid_or_unknown", patched)
        self.assertIn("...lre,...oldAw", patched)
        self.assertTrue(all(p["new_id"] in patched for p in self.config["plans"]))
        self.assertTrue(all(p["old_id"] in patched for p in self.config["plans"]))

    def test_already_migrated_bundle_is_unchanged(self):
        once, _ = guard.patch(self.source(), self.config)
        twice, state = guard.patch(once, self.config)
        self.assertEqual(once, twice)
        self.assertEqual(state, "already-migrated")

    def test_unknown_format_fails_closed(self):
        with self.assertRaises(RuntimeError):
            guard.patch("var Aw=[];not_a_supported_build=true", self.config)

    def test_changed_legacy_plans_fails_closed(self):
        original = self.source().replace(self.legacy[0]["id"], "plan_not_the_same")
        with self.assertRaises((AssertionError, RuntimeError)):
            guard.patch(original, self.config)


if __name__ == "__main__":
    unittest.main()
