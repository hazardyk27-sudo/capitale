# CAPITALE · Match List v2 automatic Software metrics + club crests · LIVE 2026-11-21

**Status:** Implemented, built, deployed and verified at `https://betcapitale.com/admin` (Social Media → Match List v2); standalone `/admin/social-media` shares the same module.

## Design and data
- User request: Coupon-sourced fixture rows automatically display the existing Software screen's source-backed `SIGNAL`, `T-6/T-8`, `V`, `A`, `N`, `B`, `O Δ`; show local club crests where present. Do not invent or randomly populate any production metric.
- Inputs: Existing admin-only `/api/admin/today/matches?date=YYYY-MM-DD` and `/api/admin/software`, which currently reads `capitale_admin_software_feed()` through the production bridge. Crests read public same-origin `/team-logos/current-fixture-coverage.json` (coverage includes 108 locally mapped teams as of 2026-11-21).
- Match join: exact normalized two teams and source date, with UTC calendar day fallback for timezone boundary (Today's kickoff field has no timezone while Software is UTC); explicit name aliases only for known club names; never fuzzy substring matching. If multiple distinct markets/picks or contradictory report versions are present for the same fixture, outputs are empty and status `ambiguous` instead of choosing one arbitrarily.
- Signal = verified Software `signalCode`; checkpoint = verified T-6/T-8 (or safe code suffix); V = money share, A = Analyst /100 support, N = News /100 support, B = 1X2 draw-money share, O Δ = odds change computed only with valid market/selection, odds and ordered timestamps.
- A/N currently absent in the 60 source-backed Software runs as inspected on 2026-11-21, so remain blank. An unconnected/failing API results in blanks with a clear source-unavailable message, not synthetic scores. Software preview/demo rows are explicitly excluded. Legacy manual browser-localStorage metric field editing is no longer used for Match List v2.
- Crests: strict same-origin local `/team-logos/*.png|svg` mapping with audited explicit aliases; missing/failed logos render existing initials. Existing country flags, export sizing and original content tabs preserved.

## Deployment isolation
- **Source worktree:** `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-auto-software-logos-20261121-work` copied from `betcapitale-site` before changes. Modified `client/src/pages/admin-social-media.tsx`, `client/src/components/match-list-template-2.tsx`; added pure `client/src/lib/match-list-v2-auto.ts` and tests.
- Production existing JS index, Software v13 bundle, backend, Homepage V33, coupon/today modules all retained. New rollup-built social-media component was validated against original live chunk's seven import *export names*, and only the seven hashed import targets were rewritten to point at the existing live runtime instead of a second React runtime. No dependency bundle overwrite.
- **Live JS:** `/app/betcapitale/dist/public/assets/admin-social-media-v2-auto-20261121.js` (size 228735 bytes, SHA-256 `1bb915d12b29927cf412617debde57318bedd3acf5789efe01bfc5f95ad3d920`).
- Only one new importmap mapping was added to production `index.html`: `/assets/admin-social-media-BufGLmZ1.js` → `/assets/admin-social-media-v2-auto-20261121.js`. Three previous Software v13 importmap aliases preserved unchanged; no other HTML edits. The index was atomically replaced.
- **Rollback:** `/app/betcapitale/rollback-matchlist-v2-software-auto-logos-20261121/index.html` stores exact previous index; restore it atomically to `/app/betcapitale/dist/public/index.html` if needed. New JS asset may remain unreferenced. Backend doesn't need restarting; it was not modified.
- Pre-change index SHA-256: `a2156310d4a9d0f59c7fb7431ed06568ab57e593ca37d63ab97df4ce1ed93ad0`. Live index SHA-256: `87409c6ce727a54803a9ef488ffd82050740be708608d1fc7b9e6ee16523ed01`. Backend SHA-256 unchanged: `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.

## Verification
- Pure unit tests (`tests/match-list-v2-auto.test.ts`) PASS: matching/score formatting, unconnected source, wrong date, conflicting markets/revisions, fake-source exclusion, valid 0/100 scores, aliases, timezone rollover and local crest allowlist.
- TypeScript `tsc --noEmit` PASS; Vite build PASS.
- Staging Playwright/Puppeteer browser integration PASS with **local mocked admin data**: full Match List v2 rendering, seven labeled metrics, accurate 2 matched/1 ambiguous status, same-origin Chelsea and Leeds crest loading (naturalWidth=500), no old manual metric inputs, no synthetic row injection; unavailable source yields blank values. Both tests re-run successfully on `https://betcapitale.com/admin/social-media` using *request-local mocks only*, never writing fake records to production.
- Guest production smoke PASS: homepage `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans`; no fatal browser errors. All new JS/logo resources HTTPS 200. User-authenticated admin workflows and full browser export by a real admin session were not tested; data-backed behavior is confirmed via live mock browser, while real stored Software rows were independently inspected read-only in Supabase.
- Read-only cross-check: Supabase Software source had 60 runs (60 with SXF signal and money-share), no saved NEWS or ANALYST reports. Of the 10 Today matches in site PostgreSQL (2026-11-21), 7 had same fixture names in Software source (not implying 7 unique market matches; conflicts fail closed).

## Reproducibility and scope
- GitHub patch: `deployments/betcapitale/admin-matchlist-v2-auto-software-logos-20261121.patch`.
- Live index-only patch: `deployments/betcapitale/admin-matchlist-v2-live-importmap-20261121.patch`.
- No schema migration, no new backend credentials, no modifications to signed agent research or SXF/NEWS/ANALYST methods, no edit to historical reports or real betting outcomes.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]