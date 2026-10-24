#!/usr/bin/env python3
"""Fail-closed, idempotent BetCapitale one-time Whop bundle protection.

Install as ExecStartPre of betcapitale-web.service (and in deployment pipelines):
  python3 ensure_one_time.py --ensure /app/betcapitale/dist/index.cjs

Does not access Whop API, charge cards, or touch existing memberships.
Unknown future bundle formats are REJECTED, not silently rewritten.
"""
import argparse
import datetime
import json
import os
import re
import shutil
import stat
import subprocess
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
MANIFEST = HERE / "whop_one_time_plans.json"
PRE = re.compile(r'var Aw=(\[.*?\]),lre=(\[.*?\]),_c=\[\.\.\.Aw,\.\.\.lre\],xh=\{\};', re.S)
POST = re.compile(r'var oldAw=(\[.*?\]),Aw=(\[.*?\]),lre=(\[.*?\]),_c=\[\.\.\.Aw,\.\.\.lre,\.\.\.oldAw\],xh=\{\};', re.S)
UNGUARDED = 'if(O.has(l??"")){let E=await x()'
GUARDED = ('if(O.has(l??"")){let G=await kw(u.id);'
           'if(G.valid!==false){console.log("[whop-webhook] retain paid access until Whop invalidates membership");'
           'return n.json({received:true,action:"revoke_deferred_access_still_valid_or_unknown"})}'
           'let E=await x()')


def check_manifest():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assert len(manifest["plans"]) == 8 and len(manifest["legacy"]) == 4
    assert {p["days"] for p in manifest["plans"]} == {7, 14, 30, 90}
    assert len({p["new_id"] for p in manifest["plans"]}) == 8
    return manifest


def entries(manifest):
    trial = manifest["trial"]
    old = [trial] + [
        {"id": p["old_id"], "tier": p["tier"], "label": p["label"],
         "days": p["days"], "price": p["price"], "currency": "eur"}
        for p in manifest["plans"]
    ]
    new = [trial] + [
        {"id": p["new_id"], "tier": p["tier"], "label": p["label"],
         "days": p["days"], "price": p["price"], "currency": "eur"}
        for p in manifest["plans"]
    ]
    return old, new, manifest["legacy"]


def read_js_array(text):
    # Original esbuild bundle uses unquoted keys, new bundle uses valid JSON.
    return json.loads(re.sub(r'([,{])(\w+):', r'\1"\2":', text))


def patch(text, manifest):
    old, new, legacy = entries(manifest)
    m = POST.search(text)
    if m:
        assert read_js_array(m.group(1)) == old, "Existing historical plan map differs"
        assert read_js_array(m.group(2)) == new, "Existing checkout plan map differs"
        assert read_js_array(m.group(3)) == legacy, "Existing legacy plan map differs"
        state = "already-migrated"
        updated = text
    else:
        m = PRE.search(text)
        if not m:
            raise RuntimeError("Unrecognized plan table format; REFUSING startup to prevent recurring plan regression")
        if read_js_array(m.group(1)) != old or read_js_array(m.group(2)) != legacy:
            raise RuntimeError("Original Whop plans unexpectedly changed; refusing patch")
        j = lambda arr: json.dumps(arr, separators=(",", ":"), ensure_ascii=True)
        replacement = ("var oldAw=" + j(old) + ",Aw=" + j(new)
                       + ",lre=" + j(legacy) + ",_c=[...Aw,...lre,...oldAw],xh={};")
        updated = text[:m.start()] + replacement + text[m.end():]
        state = "migration-applied"
    if "revoke_deferred_access_still_valid_or_unknown" not in updated:
        if updated.count(UNGUARDED) != 1:
            raise RuntimeError("Unexpected membership cancellation handler; refusing deployment")
        updated = updated.replace(UNGUARDED, GUARDED, 1)
        state += "+access-protection"
    # New checkout IDs and legacy mappings must exist. No trial mutation.
    assert all(p["new_id"] in updated for p in manifest["plans"])
    assert all(p["old_id"] in updated for p in manifest["plans"])
    assert manifest["trial"]["id"] in updated
    return updated, state


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ensure", action="store_true", help="Safely migrate and protect compiled bundle")
    parser.add_argument("bundle", type=Path, help="Absolute location of the Node .cjs bundle")
    opts = parser.parse_args()
    manifest = check_manifest()
    bundle = opts.bundle.resolve(strict=True)
    current = bundle.read_text(encoding="utf-8")
    patched, state = patch(current, manifest)

    if patched == current:
        print("Whop plan protection: VERIFIED / unchanged (" + state + ")")
        return

    if not opts.ensure:
        raise RuntimeError("Bundle needs one-time plan protection. Re-run with --ensure.")

    before = bundle.stat()
    timestamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup = bundle.with_name(bundle.name + ".pre_whop_guard_" + timestamp)
    shutil.copy2(bundle, backup)
    fd, path = tempfile.mkstemp(suffix=".cjs", prefix=".whop-guard-", dir=bundle.parent)
    tmp = Path(path)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as out:
            out.write(patched)
            out.flush()
            os.fsync(out.fileno())
        os.chmod(tmp, stat.S_IMODE(before.st_mode))
        os.chown(tmp, before.st_uid, before.st_gid)
        chk = subprocess.run(["node", "--check", str(tmp)], capture_output=True, text=True)
        if chk.returncode != 0:
            raise RuntimeError("Node syntax validation failed: " + chk.stderr[:500])
        os.replace(tmp, bundle)
        print("Whop plan protection: APPLIED (" + state + "), backup: " + str(backup))
    finally:
        if tmp.exists():
            tmp.unlink()


if __name__ == "__main__":
    main()
