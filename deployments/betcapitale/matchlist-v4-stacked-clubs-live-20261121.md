# CAPITALE · Match List v2 V4 (stacked clubs) — LIVE 2026-11-21

## User request
User disliked V3 horizontal teams, despite improved logos and data. Required **home logo/name on first row, away logo/name on second row**, aligned together at **left**, with **SXF signal and metrics to their right**; closer to screenshot reference but more legible and visually balanced.

## Work completed
- New isolated frontend version under `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-stacked-clubs-v4-20261121-work` (copied V3 source); changed only `client/src/components/match-list-template-2.tsx`.
- Club block left uses 2 stacked rows: (home crest, home name) then (away crest, away name), no exaggerated separation, no middle VS gap. Clubs 44% width; right data panel 56%.
- Per-card league/time remains above. Data panel: top **SXF / MOM-6 / PRM-6 / T-6 or T-8 / verified selection**, second tier **V money flow, B draw share, odds movement**. On spacious story size a final small line shows A/N where actually available; in dense post 1080×1350 mode A/N become extra labeled cells in one row (V/B/O/A/N) to avoid overlap/clipping.
- Restrained orange accent bar for a verified Software match, soft gray for absent/conflicting rows. Verified metrics never generated randomly; source and matching rules from V2/V3 preserved. An absent source yields `PENDING`, not fake prediction. Conflicting report yields `REVIEW`.
- Club crests reuse already-existing 120-entry same-origin manifest. In the 2026-11-21 test fixture set all **20 of 20 club images** loaded; no new logo downloads or other production assets were needed for V4.
- Dynamic-height cards have a conservative height cap when fewer fixtures to avoid giant panels. Story (1080×1920) and Post (1080×1350) tested with 10 fixtures; no clipped rows, no whole-page overflow.

## Build/test results
- `tsc --noEmit` PASS; `vite build --base=/` PASS; 13 unit-test groups for deterministic source join PASS.
- Staging browser mocks (only inside test request interception): story with source-connected/absent both PASS; post with source-connected PASS. All 10 cards visible, 20 crests have positive native width, SXF codes/metrics shown only for the seven simulated matching records. No fatal JS errors or whole-page overflow.
- The same 3 test cases PASS on actual `https://betcapitale.com/admin/social-media` under locally mocked admin APIs; **no live database writes and no fake stored reports**. Guest smoke `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` PASS; code-split social module loads on the authenticated/admin route and not necessarily on a guest's `/admin`.
- Real authenticated save/download is not fully exercised; the PNG-scale DOM screenshot was checked in both story and post formats.

## Safe production deployment
- Original V3 module `/assets/admin-social-media-v3-premium-20261121.js` retained.
- New immutable V4 module `/assets/admin-social-media-v4-stacked-clubs-20261121.js` added. Production HTML modified only the existing importmap alias for `/assets/admin-social-media-BufGLmZ1.js`, targeting V4 instead of V3.
- Other 3 Software aliases and older bundles unchanged, including V33 homepage, Software v13, admin calculations, backend and all other routes. No service restart or schema changes.
- **Rollback**: `/app/betcapitale/rollback-matchlist-v2-stacked-v4-20261121/index.html` is the exact prior HTML; atomically restore if necessary. New JS can stay unused on rollback.
- Pre-V4 HTML SHA-256 `9bb028ef51abf19ba2df9cb3c03142cf90e9c7efb393ac9e48dba0939104329b`; live V4 HTML SHA-256 `dd823863cc47f29e2aa75d4f96ec36ed4d97b774e8eda9dfe19c43513e51495f`. Backend SHA-256 `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832` unchanged.

## GitHub
- Source patch `deployments/betcapitale/matchlist-v3-to-v4-stacked-clubs-20261121.patch`.
- Live index diff `deployments/betcapitale/matchlist-v4-production-importmap-20261121.patch`.
- Full report `deployments/betcapitale/matchlist-v4-stacked-clubs-live-20261121.md`.
- Diary `tasarımcı-sohbet.md` updated.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]