#!/usr/bin/env python3
"""Commander-owned SXF Software watcher.

Run every few minutes via cron. Fetch only final-signal event IDs since
the last fully confirmed sync; invoke the verified source import CLI.
Never creates model predictions or modifies any specialist's other role.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone, timedelta
import fcntl
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys

IMPORTER = Path("/opt/capitale-sxf-software-sync.py")
STATE_DIR = Path("/var/lib/capitale-sxf-software")
STATE_FILE = STATE_DIR / "event-watermark.json"
LOCK_FILE = STATE_DIR / "watch.lock"


def helper():
    spec = importlib.util.spec_from_file_location("capitale_sxf_importer", IMPORTER)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def snapshot(m):
    url, key, _token = m.config()
    now = datetime.now(timezone.utc)
    # Needs no source payload, only the monotonic original event identity.
    path = {
        "select": "event_id",
        "kind": "eq.FINAL_SIGNAL",
        "job_checkpoint_hours": "in.(6,8)",
        "kickoff_utc": "gt." + m.iso(now),
        "order": "event_id.desc", "limit": "1",
    }
    _, rows = m.rest(url, key, "GET", "sxf_base_signal_events", params=path)
    return int(rows[0]["event_id"]) if rows else 0


def atomic_write(data):
    tmp = STATE_DIR / (STATE_FILE.name + "." + str(os.getpid()) + ".tmp")
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(",", ":"))
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, STATE_FILE)
    os.chmod(STATE_FILE, 0o600)


def main():
    cli = argparse.ArgumentParser()
    cli.add_argument("--initialize-after-verified-import", action="store_true",
                     help="Only mark previously verified existing source event horizon")
    cli.add_argument("--force", action="store_true", help="Rescan even if no new event")
    args = cli.parse_args()
    STATE_DIR.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(STATE_DIR, 0o700)
    with open(LOCK_FILE, "a+", encoding="utf-8") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        m = helper()
        latest = snapshot(m)
        previous = 0
        if STATE_FILE.exists():
            previous = int(json.loads(STATE_FILE.read_text())["last_event_id"])
        if args.initialize_after_verified_import:
            # Caller must have just completed import and verified real database readback.
            atomic_write({"last_event_id": latest, "updated_at": datetime.now(timezone.utc).isoformat()})
            print(json.dumps({"state": "INITIALIZED_AFTER_VERIFIED_IMPORT", "last_event_id": latest}))
            return
        if latest <= previous and not args.force:
            print(json.dumps({"state": "NO_NEW_FINAL_SIGNAL", "last_event_id": latest}))
            return
        result = subprocess.run([sys.executable, str(IMPORTER), "--commit",
                                 "--hours", "18", "--max-groups", "150"],
                                stdin=subprocess.DEVNULL, timeout=100, check=False,
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if result.returncode != 0:
            print("WATCH_SYNC_FAILED", result.stderr[-1800:], file=sys.stderr)
            print(result.stdout[-800:], file=sys.stderr)
            raise SystemExit(result.returncode)
        # Updated only after every original report was confirmed by database readback.
        atomic_write({"last_event_id": latest, "updated_at": datetime.now(timezone.utc).isoformat()})
        print(json.dumps({"state": "VERIFIED_SYNC", "last_event_id": latest,
                          "previous_event_id": previous}))
        print(result.stdout[-1600:])


if __name__ == "__main__":
    try:
        main()
    except BlockingIOError:
        print("WATCH_SKIPPED_ALREADY_RUNNING")
    except Exception as exc:
        print("WATCH_ERROR", type(exc).__name__, str(exc)[:250], file=sys.stderr)
        raise SystemExit(2)
