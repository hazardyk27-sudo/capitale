# CAPITALE Match List v2 V5 · Exact reference row layout · 2026-11-21 LIVE

## Owner requirement
User explicitly rejected V4 two-column stacked clubs design and required the screenshot reference almost exactly: **row index, two club logos, "Home – Away", compact colored SXF badge, A, V, N, B, O, kickoff time**. No selection, market/pick label, separate T, source text, pending messages, unrelated headings, or other decorations. Source disciplines remain mandatory.

## Executed
- Read latest `AGENTS.md`, `MILESTONE.md`, `tasarımcı.md`, `tasarımcı-sohbet.md` from repository. Used authorized Desktop Commander device `smartxflow`.
- Source worktree `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-reference-row-v5-20261121-work` cloned from V4. Changed only `client/src/components/match-list-template-2.tsx`.
- Each match now has ONE thin horizontal card, fixed column grid: `[01] [crest][crest] [Home – Away] [MOM-6/PRM-6/etc] [A] [V] [N] [B] [O] [16:00]`. Fixed column positions and padding for 1080x1920 stories and 1080x1350 posts. No market selection, independent checkpoint, league label, third-line explanation, or redundant per-card subheading.
- Colored badge map by existing signal prefixes: MOM purple, PRM orange, CRL amber, SLD blue, STR green, CNI red, unknown gray. Actual suffix T-6/T-8 stays inside authentic signal code (e.g. `MOM-6`) only.
- A/N normalized 0–100 support scores are shown in a % visual scale when source-backed; they are **not probabilities**. V/B and O movement are displayed from verified Software data; O value green/red by direction. Missing values show `—`; no fabricated values/odds/signals. Fixture matching and 120 local team crest lookup logic untouched.
- Corrected story clipping of long names (e.g. FC Utrecht – Cambuur Leeuwarden) with adaptive font only for long strings. Same 20/20 club logo images still work.
- Only simple page-level CAPITALE brand, "Today's matches", date, match count remain; removed extra `MATCHDAY BRIEF`/`SOURCE-BASED DATA` titles and per-card league/selection/pending words.

## Build, visual and live browser tests
- `tsc --noEmit`: PASS; `vite build --base=/`: PASS; existing pure-match-join test suite: PASS.
- Local isolated admin browser tests using request interception ONLY (no real database changes) for story with connected and unavailable feed: PASS 2/2; post with connected feed PASS 1/1. Both 1080x1920 and 1080x1350 rendered exactly 10 horizontal rows and 20 valid images. No overflow or missing crests; no new forbidden text.
- Tests repeated on real `https://betcapitale.com/admin/social-media` with mocked browser-only authorized API responses: story 2/2 PASS, post 1/1 PASS. Guest public route smoke `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans`: HTTP 200, JS errors absent; social chunk is lazy loaded and unauthenticated `/admin/social-media` may not import it until auth resolves.
- User's actual signed-in admin PNG save flow has not been independently operated; visual DOM screenshot verified. Site source data remain unchanged.

## Live deployment isolation and rollback
- Added `/app/betcapitale/dist/public/assets/admin-social-media-v5-reference-row-20261121.js` (hash `81bdf86f11f701fe2e22b2be6587c3eaf370fa5d5ca14d40f4f0d3d6c8f24993`). Prior V4 bundle kept.
- Production `index.html` altered **only one existing importmap alias** `/assets/admin-social-media-BufGLmZ1.js`: V4 → V5. Concurrent unrelated `Software v15` importmap mapping was detected in safe preflight and **preserved byte-for-byte**; other three software importmap aliases, V33 hero, backend, coupons, and admin routes untouched.
- Exact predeploy HTML SHA `d9f99c3a610879ba6e8ff108e20de6d93bc2b27e9c7f66eacf1f7bc5c1b49db9`; deployed HTML SHA `02e58c35afcab7f17b9a1c82d88c7b842fd89510e9ff767227d24a4dfaa40fec`; backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832` (unchanged).
- Rollback file `/app/betcapitale/rollback-matchlist-v2-reference-row-v5-20261121/index.html`; restore atomically if needed. No service restart required; static asset may remain.

## GitHub
- `deployments/betcapitale/matchlist-v4-to-v5-reference-single-row-20261121.patch`
- `deployments/betcapitale/matchlist-v5-production-importmap-20261121.patch`
- `deployments/betcapitale/matchlist-v5-reference-single-row-live-20261121.md`
- Updated `tasarımcı-sohbet.md` after deployment.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]