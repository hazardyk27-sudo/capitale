# CAPITALE Match List v2 V12 — pure white raised match cards, remove gold glow · LIVE 22 Nov 2026

## User request
Owner liked V11 broad canvas, 3D treatment, metric console and vivid result colors but attached a screenshot showing **yellow/golden glow on the left of each match card**. Requested the gold ambient glow removed, cards rendered **directly white**, preserving all the same raised 3D depth.

## Surgical change
- Source copied from V11 into independent directory `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-pure-white-v12-20261122-work`. Only source changed: `client/src/components/match-list-template-2.tsx`.
- Card `background` exactly `#FFFFFF` (not gradient, no radial warm/orange/yellow overlay). Removed the soft orange outer `boxShadow` from the 3px left brand accent rail, but retained the orange accent **line itself** as requested.
- **Unchanged** multilevel outer card box shadow, inset top/bottom relief, real elevated crests, enamel SXF badge, the recessed five-value A/V/N/B/O console, dark metrics and blue O, gold-colored signal types, status WON/LOST (green/red), vivid orange kickoff, header CAPITALE logo serif, 24px story and 20px post side gutters, dynamic 6–15 match sizing and v1-derived pre-match/results switch.
- Only card material changed: no source data, server API, code hierarchy, signaled betting result, report score, fixture, odds, database or authentication mutation.

## QA
- TypeScript `tsc --noEmit` PASS, 13 data join assertion groups PASS and production-mode Vite build PASS.
- Staging Puppeteer 8 cases PASS (6/10/15 rows, story/post, pre-match/results). Each card checked computed `backgroundColor=rgb(255,255,255)` and `backgroundImage=none`, orange line `boxShadow=none`. All 2N+1 image/logo assets loaded, card side gutter exactly 24px story/20px post, final card above footer, no page error.
- Production browser on actual `https://betcapitale.com/admin/social-media` repeated same **8/8 PASS** under isolated *browser-only mocked API calls* (no production record changes). Native poster screenshots inspected for staging. Authentic admin user's PNG download action not directly tested.

## Safe production deploy
- New immutable JS asset `/app/betcapitale/dist/public/assets/admin-social-media-v12-pure-white-20261122.js` SHA `49bb1f449ad538263b9b48bdd2ed032c149bd703bbe78767decf8e3b4391e498`.
- Production `index.html` changed only one importmap alias `/assets/admin-social-media-BufGLmZ1.js` from V11 to V12. Other three Software v16 aliases, homepage V33, server backend, DB and all unrelated routes preserved.
- Index SHA pre `9a9af09bcde109c58ce0482f7a3c65a7296dfaa1e867b9f595f02bb93c732fa5`, now `dce95ae22921499aebc849c85072e2d9cfd9d2864689955f00cad175c27efc41`, backend unchanged `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- Backup/rollback `/app/betcapitale/rollback-matchlist-v2-pure-white-v12-20261122/index.html` restores V11 atomically. Old bundles unchanged.

## GitHub
- `deployments/betcapitale/matchlist-v11-to-v12-pure-white-20261122.patch`
- `deployments/betcapitale/matchlist-v12-production-importmap-20261122.patch`
- `deployments/betcapitale/matchlist-v12-pure-white-live-20261122.md`
- `tasarımcı-sohbet.md` updated V11 and V12 records.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]