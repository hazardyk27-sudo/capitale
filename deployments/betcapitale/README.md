# BetCapitale Whop one-time plans — Replit-free deployment protection

**Date:** 2026-10-24  
**Status:** Canonical plan configuration and protection script committed to GitHub.  
**Hetzner installation:** VERIFIED 2026-10-24 14:21:29 UTC. Guard files installed to `/opt/betcapitale-whop/`, systemd drop-in installed at `/etc/systemd/system/betcapitale-web.service.d/30-one-time-whop-guard.conf`. The production service was restarted and systemd verified `ExecStartPre` exit status `0`, service state `active`, `Result=success`, and `NRestarts=0`. Local and public `/api/whop/plans` returned HTTP 200 with all 9 expected plan IDs and 8 exact price/duration/tier matches.

The live website had already been migrated on Hetzner and its `/api/whop/plans` endpoint verified to show 9 plans: an unchanged 3-day trial and 8 new one-time purchases. This directory captures the approved plan mapping independently from Replit and prevents later builds from silently returning to recurring checkout plans.

## Files

- `whop_one_time_plans.json`: 8 new plan IDs, prices, days, original subscription IDs, 3-day trial and 4 historic Elite IDs.
- `ensure_one_time.py`: no-Whop-API, no-credentials, idempotent compiled Node bundle patch and verification. Preserves historic membership-to-plan mappings and guards existing paid access from premature webhook cancellation. Unknown future bundle layouts fail closed.
- `install_guard.sh`: installs a pinned version of the script and manifest on Hetzner, then configures systemd `ExecStartPre` to enforce the mapping on **every** service start/redeployment.
- `tests/test_ensure_one_time.py`: offline transformation/idempotence tests. GitHub Actions runs these checks.

## Install on the authorized Hetzner server

Installation needs root access and is intentionally **not automatic merely by committing to GitHub**. **This installation was completed directly on Hetzner on 2026-10-24; the following commands are for disaster recovery/re-installation only.**

```sh
curl --proto '=https' --tlsv1.2 -fsSL \
  https://raw.githubusercontent.com/hazardyk27-sudo/capitale/eeb33ab1fe1ac5051e31fbd478660d91c7521a19/deployments/betcapitale/install_guard.sh \
  -o /tmp/betcapitale-install-whop-guard.sh
sudo sh /tmp/betcapitale-install-whop-guard.sh
```

The installer fetches pinned script and manifest at commit `019bee6954ffd7c20ccfba06ea87ca8023a24737`, validates the live app, backs it up before any rewrite, installs a systemd startup guard, restarts only `betcapitale-web.service`, and checks both local and public `/api/whop/plans` endpoints.

The guard is tailored to the verified September 2026 esbuild Node bundle format. If a future app deployment changes its internal structure, the service will refuse startup rather than accidentally reinstate subscription checkouts. A future source-code-aware migration is still preferable once the original full website sources become available outside Replit.

## Scope and exclusions

**Never cancel, refund, or otherwise mutate existing customer subscriptions.** No Whop write API calls are made. Existing historic plan IDs remain in the application's membership reconciliation table, but are not served to new purchasers.

This is a protection layer on Hetzner's deployed bundle, **not** a copy of the full original website's TypeScript/React source. Deploy-time enforcement is installed and verified on Hetzner. Future deployments must retain the systemd service drop-in and the same bundle location. Unknown or incompatible future bundle formats intentionally block startup rather than reverting to recurring checkout IDs. This does not substitute for updating the original website source if it becomes available.
