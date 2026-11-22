# CAPITALE Match List v2 V14 — autonomous fixture logo resolver & AutoFill LIVE — 22 Nov 2026

## Explicit owner approval
User approved the proposed permanent *Match List AutoFill*: when new coupon fixtures appear, team names and kickoffs remain authoritative; admin graphic can show verified Software SXF data or separately marked deterministic sample values; unknown crests are automatically discovered, verified and cached without daily code builds or manual image downloads. Preserve existing V13 white 3D style and the pre-match/results switch.

## Architecture implemented
- Kept existing `/api/admin/today/matches?date=...`, existing coupons-to-today sync, and the **strict real-source** `deriveMatchList2()` join unchanged. No synthetic values ever written to DB/Software; V13 `SAMPLE DATA · DEMO` poster label and admin toggle retained.
- Added server-side standalone **read-only worker** `/opt/capitale-crest-autofill-v1/crest-autofill.cjs` (SHA `4fb964c33ca0a7799c889c27af76072ad5a8dab78f3238967eb56e5a67e12e05`), which reads only `today_matches.home_team`, `away_team` via read-only transaction (`BEGIN READ ONLY`, `ROLLBACK`) with existing environment-provided database connection, date window **Istanbul today -3/+14 days** and 250-row upper limit. There is **no database mutation**; no schema migration, new table, or production backend rebuild.
- Existing immutable V3 `team-logos/current-fixture-coverage-v3.json` (138 entries) is the baseline. New mutable **atomic** `team-logos/current-fixture-coverage-auto.json` (currently 147 entries) adds verified team URLs, never overwrites existing PNG files, and uses a SHA-based image filename. Team normalized **exact match only**, no substring/fuzzy guesses; no redirect, fixed search provider `www.thesportsdb.com`, image URL allowlisted `r2.thesportsdb.com`, soccer sport only, single unambiguous candidate, PNG signature and dimensions/size validated. No incorrect-crest fallback: uncertain/missing remains local team initials.
- Persistent retry cache `/var/lib/capitale-crest-autofill/retry-cache.json`; provider failures retry conservatively, unsuccessful exact matches after 24h, rate-limit **429 stops work** and triggers 30-minute provider cooldown. Max **5 unknown team searches per run**; bounded network timeouts. Worker never uses user login cookies or browser scraping.
- Installed and activated `capitale-crest-autofill.service` + `capitale-crest-autofill.timer`, schedule `OnCalendar=*:0/3` every **3 minutes**, with systemd sandbox (`ProtectSystem=strict`, write access restricted to logo directory and the resolver state directory, `NoNewPrivileges`). Both unit files are versioned alongside the worker code. Existing backend & Software schedules untouched.
- V14 isolated source worktree `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-auto-resolver-v14-20261122-work`, copied from V13, changed **only** `client/src/pages/admin-social-media.tsx`: `matches` query refreshes every **90s** when Match List V2 is open; logo JSON now reads the atomic auto catalog with `cache:no-store`, `staleTime:30s` and `refetchInterval:90s`, safely falling back to existing immutable V3 catalog if auto catalog is absent. Admin text discloses the automatic schedule. No other UI, logo size, story/post, signal, odds, 3D card, or results changes.
- Existing adaptive layout: 6–15 fixture rows on 1080×1920 Story or 1080×1350 Post; ordinary verified mode never forces missing A/N etc, while demo mode automatically fills deterministic samples with visible disclosure. The authoritative fixture team names/kickoffs are unchanged.

## Verification (completed, live)
- Resolver `--self-test`: 5/5 strict alias / reserve vs first team / host URL / ambiguity / Unicode checks PASS. Direct service launch `systemctl start ...`: EXIT 0 (read-only fixture query + verified downloads), **9** new real club crests cached (now 147 total). Next scheduled run: EXIT 0 with 54 recent/upcoming distinct teams, **0 missing** (no provider calls), proving persistent caching and timer execution.
- `tsc --noEmit` PASS, Vite production build PASS, **13** deterministic source/crest guard test groups PASS.
- Full native browser staging UI **5/5 PASS** and real HTTPS production with **browser-local mock fixture/SXF API only** **5/5 PASS**: (a) newly auto-cached Metz/Boulogne logos, (b) original 9-match story, (c) 9-match post, (d) 15-match post, (e) real-source fallback with demo disabled. Verified all 18/18 or 30/30 same-origin images, names/kickoffs intact, 5 metric cells populated only in sample mode, poster SAMPLE label, no overflow/footer overlap or page errors.
- Live guest routes `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` PASS 200 with expected **Software V17** 3 asset aliases preserved, no JS crashes/horizontal overflow. Live logo registry/JS and site HTTP 200. User-authenticated admin PNG Save/Download interaction itself not exercised; native DOM screenshots were tested.

## Production deployment boundary
- Added immutable `/assets/admin-social-media-v14-autofill-20261122.js` SHA `871e4320f7ef3f31ecf5411725fd4ad073c98ebc42fa746235a3c1d014dfee8d`.
- Production `index.html`: changed **only** alias `/assets/admin-social-media-BufGLmZ1.js` from V13 to V14. Existing 3 Software V17 (`admin-software-v17-170-team-logos-20261122.js`) mappings, homepage V33, server backend `dist/index.cjs`, user sessions, and all business logic untouched.
- HTML prior SHA `149901b96c6bc29d4455c8f3aae7ea7149527c110e5dae3656af53ad391bc67f` → new SHA `35f7ac865c8d28332539c9edcfb3acf06358ef3eab948dd9d8a5067fda3cfff3`. Backend SHA unchanged `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- Rollback: **first** `systemctl disable --now capitale-crest-autofill.timer`, then atomically restore `/app/betcapitale/rollback-matchlist-v2-auto-resolver-v14-20261122/index.html` to `/app/betcapitale/dist/public/index.html`. V13 immutable UI and existing catalogs remain. New auto catalog and verified icons can be left unreferenced; no DB changes to undo.

## Known boundaries and follow-up
- New names without an unambiguous same-name football entry from the public provider intentionally remain **initials**; no machine-generated wrong logo. The job rechecks failed names after cooldown. Network provider may impose rate limits, hence 5/run and safety backoff.
- Automatic fixture discovery requires the existing coupon sync to populate `today_matches` first. This work does not change the coupon ingestion mechanism or run private admin actions without login.
- Current sample values are explicitly *design demos*, not real SXF recommendations; verified mode is one click away.

## GitHub artifacts
- `deployments/betcapitale/matchlist-v13-to-v14-autofill-20261122.patch`
- `deployments/betcapitale/matchlist-v14-production-importmap-20261122.patch`
- `deployments/betcapitale/matchlist-v14-autofill-live-20261122.md`
- `deployments/betcapitale/crest-autofill-v1.cjs` and unit/timer files
- `tasarımcı-sohbet.md` latest status and session entry.
