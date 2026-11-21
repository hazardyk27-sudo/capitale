# CAPITALE — Match List v2 premium visual + 20/20 crests / V3 LIVE — 2026-11-21

**User feedback:** V2 story graphic had excessive card white-space, tiny cramped metrics, and missing team logos. Some fields had dashes. User explicitly asked to improve layout and populate all available authentic values/logos.

**Scope:** `/admin` → Social Media → Match List v2 and `/admin/social-media` share the new component. No data methods, Supabase contents, SXF engine, backend, billing, member pages or home hero altered. All pre-existing production assets retained.

## V3 improvements

- Redesigned `client/src/components/match-list-template-2.tsx`: larger, legible 1080×1920 story layout with 10 match cards; compact but balanced vertical spacing; clear league/time; full-size club crests and team names; labeled SXF code/checkpoint/selected pick; 3 prominent bottom columns `FLOW · V`, `DRAW · B`, `ODDS Δ`, with restrained movement color; readable A/N on info line. Improved header CAPITALE wordmark and footer.
- For matched Software rows, show source-confirmed signal/pick/ratio. `1X2 HOME` displays as `HOME WIN`, `1X2 AWAY` as `AWAY WIN`, `BTTS YES` displays naturally. No fake scores inserted.
- For absent/ambiguous source rows, display `PENDING` / `REVIEW` and `NO VERIFIED SOFTWARE RECORD` / `MULTIPLE MARKETS — VERIFY PICK` instead of pretending a failed source is a negative betting signal. No new prediction criteria.
- Updated Social Media admin status to show Software match count, ambiguous/missing, local crest coverage count and explicit statement when A/N reports are not present.
- **Crests:** 12 previously missing clubs added as locally cached PNGs to `/app/betcapitale/dist/public/team-logos/`; sourced with exact club/league verification from TheSportsDB or ESPN soccer team data. Provenance for each: `deployments/betcapitale/matchlist-v2-premium-v3-crest-provenance-20261121.json`. Coverage manifest expanded from 108 to 120 named clubs. New cache-busting file `/team-logos/current-fixture-coverage-v2.json` (120 entries); original v1 manifest kept intact. All 20 clubs on the 2026-11-21 ten-fixture card tested with `naturalWidth>0`.
- Authoritative Software API remains `/api/admin/software`. Its 60 source-backed runs contain SXF and V but **no Analyst or News reports** at inspection time. For Today ten fixtures, 7 share fixtures with Software data; 3 lack source-backed records. A/N and missing signals remain blanks pending actual report publication. User must not be told those missing values have magically appeared.

## Deployment + rollback

- Authorized server: `smartxflow`; worktree `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-premium-fix-20261121-work`. Previous V2 copied, not mutated.
- Build/QA: `tsc --noEmit` PASS, Vite PASS, original 13 unit-test groups PASS; staged full-scale 1080×1920 10-card story screenshot passed (all 20 logos loaded); all values present and unavailable-source cases passed without JS console errors, missing images or overflow. Production-domain mock-only browser QA repeated 2/2 PASS (no writes to production data). Public site smoke `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` PASS. Genuine authenticated admin PNG export not exercised.
- New production frontend module: `/assets/admin-social-media-v3-premium-20261121.js` (229734 bytes; SHA256 `4678e7b5b1e503ad9cd071c3306fcede3759b9f3e89f8d5d5b15cadacfe35ccd`). Reused compatible already-deployed frontend imports (React UI package), no React/app bundle replacement.
- Production `index.html` changed **only** existing `/assets/admin-social-media-BufGLmZ1.js` importmap alias from V2 to V3. All existing three Software v13 aliases, V33 homepage bundle, backend packages, CSS, service processes and routes unchanged. Added 12 new local PNGs and one versioned JSON catalog. Original pre-V3 index backup: `/app/betcapitale/rollback-matchlist-v2-premium-20261121/index.html`; restore to live `dist/public/index.html` atomically if needed. New logo/static files can remain unreferenced.
- Pre-V3 index SHA `87409c6ce727a54803a9ef488ffd82050740be708608d1fc7b9e6ee16523ed01`; deployed index SHA `9bb028ef51abf19ba2df9cb3c03142cf90e9c7efb393ac9e48dba0939104329b`; backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832` **unchanged**.

## GitHub artifacts

- Source diff against V2: `deployments/betcapitale/matchlist-v2-premium-visual-and-crest-fix-20261121.patch`.
- Production index-only diff: `deployments/betcapitale/matchlist-v2-premium-v3-importmap-20261121.patch`.
- New 120-club catalog: `deployments/betcapitale/matchlist-v2-premium-v3-crest-catalog-20261121.json`.
- PNG source & SHA ledger: `deployments/betcapitale/matchlist-v2-premium-v3-crest-provenance-20261121.json`.
- Design notes: `tasarımcı-sohbet.md`.

## Future

- When Analyst/News agents write real source-verified support reports for exact market/selection, A/N updates naturally via Software API. **Do not generate support scores.**
- If the user wants signal data for the other three matches, SXF needs verified source-backed runs; it cannot be inferred from yesterday's fixture/other market. Do not alter those primary records without explicit separate instruction.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]