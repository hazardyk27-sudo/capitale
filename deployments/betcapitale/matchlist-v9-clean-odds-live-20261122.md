# CAPITALE Match List v2 V9 — Clean corporate metrics, O odds coloring separated from results · LIVE 22 Nov 2026

## User request
User approved V8 functionality and video-derived pre-match/results switch, but said the design was still weak. In particular O (odds movement) tiles were red/green and visually confused with WON/LOST results. User requested O colors changed and a stronger, more corporate general layout, without harming current brand palette or behavior.

## Changes
- Isolated source worktree `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-clean-data-v9-20261122-work` copied from V8. **Only** `client/src/components/match-list-template-2.tsx` modified.
- O metric presentation now **the same cool steel-blue for positive and negative movement**: background `#EEF3F9`, outline `#DDE7F1`, figure `#345C81`; plus/minus sign preserves direction. O does not use the WON green or LOST red semantics. Missing movement remains `—` in the same O tile.
- WON remains text `#159B65` with pale green result pill, LOST remains text `#D94B51` with pale red pill. VOID/PENDING remain neutral. Normal prematch still shows orange kickoff.
- Card layout refined within the CAPITALE **white / ink / restrained orange** branding: less bulky full-height orange rail replaced by short accent centered in each row, cleaner soft white-to-light-gray background, softer border & shadow, slightly calmer match-name weight/letter-spacing, larger more legible metric numerals and compact, elegant square-ish metric tiles. Final result column is wider for `PENDING`; O and four neutral data cells are grouped clearly; original logo and serif brand header stay intact. No extra selection, checkpoint, data legend, or unwanted copy.
- All original data joins, source safeguards, 120 club-logo manifest, v1-derived pre-match/results mechanism, auto sizing for 6–15 fixtures, and 1080×1920 story / 1080×1350 post formats retained. No fake score, signal, A/N, or odds movement added.

## Test evidence
- `tsc --noEmit` PASS. Vite production-style build PASS. 13 existing deterministic data-join test assertion groups PASS.
- Puppeteer staging (browser-scoped mock data, no production changes) six cases PASS: prematch 10-story, results 10-story, results 10-post, prematch 6-story, results 15-story, results 15-post. Actual live domain with browser-scoped mock data all same cases **6/6 PASS**.
- Across those test cases: 10/6/15 cards and 2N+1 image assets correctly loaded (two team crests per match plus CAPITALE logo); proper WON/LOST status colors, O uniformly CSS `rgb(238,243,249)` with blue text `rgb(52,92,129)`, no red/green odds conflict; expected header and date, no JS errors, card footer no overlap; native poster dimensions exact.
- Production user session PNG download path was not exercised, only browser screenshot at export native poster dimensions. No database write, no change in production records.

## Safe deployment
- Static immutable JS `/app/betcapitale/dist/public/assets/admin-social-media-v9-clean-odds-20261122.js`, SHA256 `0da58bde2abf9841d3863fe4d5718526b8c52b5bc26e871743b2955201d0d4ab` added, prior V8 preserved.
- Live `index.html`: sole existing `/assets/admin-social-media-BufGLmZ1.js` importmap route changed V8 → V9. Other 3 **Software v16** importmap aliases preserved byte-for-byte; homepage V33, auth, payments, admin Software, backend and server all unchanged. No migrations or restart.
- Before HTML SHA `5ae433c2f1787d8247a392d1d58bcf3f314310a57b238137f57937a8bdcde83f`, after HTML SHA `78bc29c0300a251b0c6832b63918d503382a7cc229e59e4cf943a6b9ff534ba8`, backend unchanged SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- **Rollback** prior index `/app/betcapitale/rollback-matchlist-v2-clean-odds-v9-20261122/index.html` (V8 + Software v16). Atomically restore to revert to V8.

## GitHub files
- `deployments/betcapitale/matchlist-v8-to-v9-clean-odds-20261122.patch`
- `deployments/betcapitale/matchlist-v9-production-importmap-20261122.patch`
- `deployments/betcapitale/matchlist-v9-clean-odds-live-20261122.md`
- `tasarımcı-sohbet.md` updated after production release.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]