# CAPITALE · Match List v2 V8 · v1 pre-match/results + brand symbol · LIVE 22 Nov 2026

## Source evidence
- User uploaded a ~5.07-second admin panel recording `Ekran Kaydı 2026-11-22 021152.mp4`; frame examination confirms the sidebar's **Maç Öncesi** and **Sonuç** toggle changes the v1 match template from kickoff times to green `WON`, red `LOST` labels, with the page heading from "Today's Matches" to "Today's Results". The same variant toggle already exists at the admin page level.
- Verified exact v1 implementation in `client/src/pages/admin-social-media.tsx`, `MacListesiTemplate` around lines 600–826: `variant === 'prematch'` renders `m.kickoffAt`; results mode reads `m.result` from the existing `/api/admin/today/matches?date=...` endpoint, mapping lower-case `'won'/'lost'/'void'` to `WON/LOST/VOID`, otherwise `PENDING`. This is the requested status result, **not** football full-time goal score.
- User's uploaded reference logo shows an orange classical column symbol with elegant regular-weight black serif `CAPITALE` wordmark. We used the project's already-present original `/capitale-premium-symbol.svg` (same-origin, 633-byte locally served asset) and `Georgia,'Times New Roman',serif` in the V2 header. No image generation, third-party font distribution, or new logo asset was needed.

## Changes and scope
- New isolated source worktree `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-v1-results-brand-v8-20261122-work` (copied exact V7 source; V7 unmodified).
- **Only changed source component:** `client/src/components/match-list-template-2.tsx`; no API/backend/database/schema changes and no changes to `admin-social-media.tsx` toggle logic.
- V2 header now contains local orange CAPITALE logo and elegant black serif CAPITALE wordmark, same header in pre-match/results export.
- V2 `variant` is already passed down by existing admin page; results variant now uses same `match.result` field and same v1 status mapping and color semantics (`WON` #159B65, `LOST` #D94B51, gray VOID/PENDING) **instead of time**, while prematch continues to show kickoff time. Results title is now `Today's Results` as in v1. Results depend on actual recorded status; no random results generated.
- Previous 6–15 fixture fit request was addressed incidentally through count-sensitive geometry: 6 rows enlarge, 10 maintain balanced scale, 13–15 reduce row/gap/crest/metric box height, ensuring even 15-row 1080×1350 post exports fit without overlapping the footer. No changes to existing V/A/N/B/O source metrics; no fabricated values. Existing 120-logo club manifest remains unchanged.
- CAPITALE house palette remains white/light gray, dark ink lettering, restrained orange accents; Software v16 and homepage V33 unchanged.

## QA
- `tsc --noEmit`: PASS; Vite build: PASS; `tests/match-list-v2-auto.test.ts`: 13 assertion groups PASS.
- On isolated staging `http://127.0.0.1:19003/admin/social-media` with intercepted **browser-only** admin fixture/source responses (never written to live DB), six tests PASS: pre-match 10 story; results 10 story; results 10 post; pre-match 6 story; results 15 story; results 15 post.
- All 6 identical tests re-run on actual `https://betcapitale.com/admin/social-media` with test-browser-local mocked API responses: **6/6 PASS**. All 2n+1 images (2 local team logos per match + official CAPITALE symbol) loaded. `Georgia` wordmark checked, correct `Today's Results`, correct WON/LOST/VOID/PENDING, prematch kickoff preserved, all rendered at native 1080x1920 or 1080x1350, last card strictly above footer and no fatal JS errors.
- User's own authenticated PNG download/export (through a live authorized user session) was not exercised; browser-native full-size element screenshots checked. No production records or user accounts were modified during tests.

## Live deployment
- Added immutable frontend module `/app/betcapitale/dist/public/assets/admin-social-media-v8-brand-results-20261122.js` (SHA256 `c844127b3b2eb1092084d8036759f30be4481b83fc4003d35f2f7443dd819fa9`). Existing V7 module remains present.
- Atomically changed **one** `index.html` importmap alias `/assets/admin-social-media-BufGLmZ1.js`: V7 → V8. Existing three Software v16 aliases, V33 homepage, user routes, backend `dist/index.cjs`, logo/club asset catalog were untouched.
- Before index SHA `5eecb46a5b43611eaba57af1e6cadded18199d28096108aee140f9cc1a07221f`; after index SHA `5ae433c2f1787d8247a392d1d58bcf3f314310a57b238137f57937a8bdcde83f`; backend unchanged SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- Rollback exact prior index: `/app/betcapitale/rollback-matchlist-v2-v1-results-brand-v8-20261122/index.html`, restore atomically to `/app/betcapitale/dist/public/index.html` to revert just the social module.

## Repository records
- `deployments/betcapitale/matchlist-v7-to-v8-v1-results-brand-responsive-20261122.patch`
- `deployments/betcapitale/matchlist-v8-production-importmap-20261122.patch`
- `deployments/betcapitale/matchlist-v8-v1-results-brand-live-20261122.md`
- `tasarımcı-sohbet.md` entry with tests, paths and SHA; permanent role file unchanged.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]