# CAPITALE · Match List v2 premium scoreboard V6 · LIVE · 21 Nov 2026

## Owner direction and visual design research

User rejected the lifeless, oversized white Match List v2 V5 screenshot and asked for a premium visually dense, attention-grabbing sports-data graphic. User uploaded a 1080×1920 V5 story and 1042×85 metric strip as style references, and asked to research analogous designs.

Inspirations researched with external public design examples: FotMob data hierarchy, Dribbble live sports dark dashboards, dark football fixture/match dashboards and sports odds dashboards. Their shared effective elements are a high-contrast dark scaffold, branded hierarchy, local club crests, vivid signal/status accents, concise data cells and a layout that fills the canvas. References: https://dezzayn.com/apps/fotmob ; https://dribbble.com/shots/27043428-Live-Sports-Dashboard-UI-Design ; https://dribbble.com/shots/27234202-Football-Match-Dashboard-UI . The finished V6 does NOT copy third-party branding/assets.

## Work performed

- Working source: `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-premium-scoreboard-v6-20261121-work` (copy of V5; source V5 left intact).
- **Only edited:** `client/src/components/match-list-template-2.tsx`; the existing verified Software/crest data joins in `client/src/pages/admin-social-media.tsx` and `client/src/lib/match-list-v2-auto.ts` remain unchanged.
- Entire story/post poster redesigned in CAPITALE navy/black/orange: premium dark header block, serif white headline, bright orange detail, fixture count pill; 10 alternating dark navy rows, orange accent for source-verified signals, larger club crests on white mounts; strong contrast signal badges; **A / V / N / B / O** in five separately bordered numeric tiles, orange kickoff pill. More canvas filled, no huge blank bottom third.
- Content remains **exactly**: sequence number, two crests, home-away club names, source-backed SXF signal code, A, V, N, B, O values, kickoff time. Top logo/title/date/count and minimal footer. No betting selection, HOME WIN, standalone T-checkpoint, league heading per match, pending/source text, synthetic values or new prediction fields.
- Original signal-prefix hues (MOM purple, PRM orange, CRL amber, SLD blue, STR green) preserved. O change positive teal, negative red. Unknown values render `—` without inventing data. The existing 120-club logo manifest is reused.
- For long team names, adaptive font size and **up to two visual lines** ensures full names are readable within the same match row; short names remain on one line.

## Verification

- TypeScript `tsc --noEmit` PASS. Vite build (`--base=/`) PASS. Existing 13 source matching unit-test groups PASS.
- Puppeteer staging full-size 1080×1920 story with Software source and unavailable source cases: 2/2 PASS; 1080×1350 post connected source 1/1 PASS; precisely 10 match cards, 20/20 club crests loaded, long names not clipped; no invented values, no unwanted extra text, no overflowing graphic, no fatal browser errors.
- Repeated same graphic tests on **actual production domain** using request-intercepted *browser-only test data*: story 2/2 PASS; post 1/1 PASS. No writes to database, account or production records.
- Live guest route smoke `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` PASS: HTTP 200, browser root rendered, no fatal errors or horizontal overflow, V6 module loads on social admin route. Software v16 aliases unchanged. User's actual authenticated PNG-download/save operation not exercised; graphics themselves tested at native 1080×1920 and 1080×1350 dimensions.

## Deployment and rollback

- Created immutable production module `/app/betcapitale/dist/public/assets/admin-social-media-v6-premium-20261121.js`; SHA-256 `30a897a47c250f23945e00ebc3ec535f130d7f7b983f6a3d44fad47e409329c6`.
- Changed **only one** production `index.html` importmap alias `/assets/admin-social-media-BufGLmZ1.js` from V5 to V6. Other 3 aliases already mapped to **Software v16** before deployment and were preserved unchanged; landing/hero V33, user routes, backend and all old files unchanged. No database migration or service restart.
- Backup previous HTML `/app/betcapitale/rollback-matchlist-v2-premium-scoreboard-v6-20261121/index.html`. One atomically swapped file restores V5; new JS can stay unreferenced.
- Original live index SHA-256 `8aed4fcac7b3d7a9a9e96c957aa2d1532ae7ff2cb215f36036b1a6800df545a4`; new index SHA `63e314da4a90ed94d35340d845b54b6abfb279bcb9d679f17602025bcbf95db4`. Backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`, unchanged.

## GitHub records

- `deployments/betcapitale/matchlist-v5-to-v6-premium-scoreboard-20261121.patch`
- `deployments/betcapitale/matchlist-v6-premium-production-importmap-20261121.patch`
- `deployments/betcapitale/matchlist-v6-premium-scoreboard-live-20261121.md`
- Updated `tasarımcı-sohbet.md`.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]