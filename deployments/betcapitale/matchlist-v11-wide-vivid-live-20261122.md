# CAPITALE Match List v2 V11 — Wider visual footprint, vivid results and time · LIVE 22 Nov 2026

## User request
Owner approved V10 depth/raised 3D design but said the blank space between match boxes and poster side edges was too wide. Asked to leave only a narrow protective margin (never flush to image edges), and to make `WON`, `LOST`, kickoff time and other interface accents more vivid. Explicitly preserve the current visual hierarchy and functionality.

## Exact implementation
- Started from V10 isolated source `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-dimensional-console-v10-20261122-work`. New independent source `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-wide-vivid-v11-20261122-work`. **Only** edited `client/src/components/match-list-template-2.tsx`; data join, admin screens/API, backend/SQL, signal and results source untouched.
- Canvas side padding changed `story ? 53 : 44` to **`story ? 24 : 20` px** for 1080px-wide posters, reducing about half of the wasted border space while leaving a safe 2%-2.2% frame. Header and cards remain aligned. Inner row padding minimally reduced 15→14 for story only.
- Upgraded outcome badges to elevated saturated gradients with white bold text: WON `#25BB80`→`#07875B` gradient, LOST `#F46B77`→`#CE3248`, appropriate colored border and subtle tinted drop shadow. VOID/PENDING remain restrained neutral. Prematch time uses rich `#FFA944`→`#EA7019` orange gradient, strong white type and embossed finish. No semantic green/red is used in O odds movement.
- Lifted signal palette slightly without changing the original signal type mapping: MOM purple, PRM orange, CRL gold, SLD blue, STR green, CNI red. Added brighter orange edge and slightly clearer data hierarchy; V percentage rail a brighter CAPITALE orange, A/N other percent rails clearer cool blue. **O movement remains blue** (`#225B8B`) regardless of positive/negative sign; no performance claims/extra metrics.
- Preserved V10 realistic embossed match surfaces, raised logo mounts, recessed five-metric instrument console, header, serif CAPITALE wordmark, full team names, existing source-backed A/V/N/B/O data, `prematch` vs `result` toggle sourced from existing `match.result`, 6–15 adaptive card sizing, 120 local team crests, and 1080x1920 story / 1080x1350 post export dimensions.

## Verification
- `tsc --noEmit` PASS, Vite build PASS, 13 deterministic source-join test groups PASS.
- Local staging puppeteer screenshot and layout tests **8/8 PASS**: pre10story, result10story, result10post, pre6story, result15story, result15post, pre6post, pre15post. Image card x gutter confirmed **24 px story / 20 px post** for every fixture count. Every 2N+1 team/brand asset loaded, data console count N, 79.6%-test value visual rail width 79.6%, no footer overlap or image clipping, live-result status text correct.
- The identical 8 test cases re-run on live `https://betcapitale.com/admin/social-media` with **browser-only intercepted mock API** (no production data changes): 8/8 PASS. Full-size screenshots under `/app/betcapitale/rollback-matchlist-v2-wide-vivid-v11-20261122/live-qa-*.png`. Guest public smoke `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` PASS 200/no fatal errors/no horizontal overflow. Real authenticated user PNG save/download not directly exercised; full native browser screenshot verified instead.

## Live publishing boundary and rollback
- New immutable JS `/app/betcapitale/dist/public/assets/admin-social-media-v11-wide-vivid-20261122.js`, SHA256 `81ca0b6ce93d5e4925810121ec9f80d8d819a88af153765993bf5c814bf3c0b3`, old V10 remains accessible.
- Live `index.html` changed only one importmap alias `/assets/admin-social-media-BufGLmZ1.js` V10→V11. All 3 unrelated **Software v16** aliases, V33 homepage, real admin/backend, storage and users preserved; no restart.
- Pre-HTML SHA `e3a5a28ffdde4d8ef3fcf4d1dfe1844ac1237a530c2d1514c02a3e72042ad935`, live V11 SHA `9a9af09bcde109c58ce0482f7a3c65a7296dfaa1e867b9f595f02bb93c732fa5`; backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832` unchanged.
- Rollback exact original live HTML `/app/betcapitale/rollback-matchlist-v2-wide-vivid-v11-20261122/index.html` (V10 + Software v16). Restore atomically to undo only V11 frontend.

## GitHub records
- `deployments/betcapitale/matchlist-v10-to-v11-wide-vivid-20261122.patch`
- `deployments/betcapitale/matchlist-v11-production-importmap-20261122.patch`
- `deployments/betcapitale/matchlist-v11-wide-vivid-live-20261122.md`
- Updated `tasarımcı-sohbet.md` with today’s status and source-path/rollback.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]