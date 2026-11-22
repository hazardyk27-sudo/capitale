# CAPITALE Match List v2 V10 — V33 hero material depth + sculpted metric console · LIVE 22 November 2026

## User request
User rejected V9 as still a lifeless flat list despite small color/shadow changes. Specifically instructed to implement the same layered **3D, raised/embossed material, soft-shadow and depth language** discussed and shipped in the previous day's home hero, and to make A/V/N/B/O values more intelligent and attractive without changing source-backed content, brand colors or v1 results behavior.

## Source-derived design references (not invented)
- Opened latest `tasarımcı.md` and `tasarımcı-sohbet.md` and verified production/module hashes on smartxflow via Desktop Commander. The approved home V33 source is `.../betcapitale-home-preview-copy-designer-v33-outfit-light-wordmark-work/client/src/components/intelligence-flow-hero-demo.css`. Reviewed its actual `.cif-source`, `.cif-console`, `.cif-engine` material styles.
- Actual V33 techniques reused: `linear-gradient(145–156deg, #fff → #F9FAFD → #F1F4F9)`, realistic **multi-layer shadows** `0 7px 11px`, `0 16px 30px`, narrow deep ambient lower shadow, `inset 0 2px 0 white` top edge, `inset 0 -1px` bottom edge; only a slight orange light spill, not a dark/saturated navy card. This follows the original CAPITALE white / ink / orange palette; it is not copied from external templates.

## Implementation
- New isolated worktree `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-dimensional-console-v10-20261122-work`, copied from verified V9 source. Only edited `client/src/components/match-list-template-2.tsx`. Existing admin API, join logic, SXF signal hierarchy, role/source score processing and `variant` toggle untouched.
- Header is now a raised pale-white gradient plate, soft highlights, sharper paper edge, realistic layered shadow. CAPITALE's existing orange column SVG, Georgia serif wordmark and existing headings remain.
- Each match is a genuine raised layered **plate** (top catchlight, shadow stack, white-to-cool-gray face, subtle orange ambient by the left emblem), with elevated club-crest mounts, enamel/gloss signal badge, embossed WON/LOST/VOID/PENDING or prematch time. True outcome colors preserved: only green WON, red LOST.
- The former five disjoint gray pills are replaced with one **inset instrument console**: shared recessed bezel with inset shadows and subtle vertical dividers; five side-by-side clearly labeled A/V/N/B/O cells, stronger numeric hierarchy. For **verified 0–100 A/V/N/B** values only, a small proportionally scaled bottom rail visualizes the given numeric score/share (0–100); no bar on absent values. V has a restrained CAPITALE orange bar; other percentages show steel-gray rails. O has cool blue text and background, signed delta, and NO green/red outcome coding. No extra market/selection text or fabricated metrics.
- Responsive metric-console height in compact >=13-row layouts and story/post modes. All 6/10/15 fixture modes retain original row count and crest set. Existing results behavior from v1 (WON/LOST/VOID/PENDING instead of kickoff), match data and caption semantics retained.

## QA and evidence
- `tsc --noEmit` PASS; Vite `--base=/` PASS; 13 deterministic source/data-join test assertion groups PASS.
- Full Puppeteer staging on isolated port: 6/6 cases PASS: pre10story, result10story, result10post, pre6story, result15story, result15post. Full native screenshots inspected: `/tmp/capitale-v10-result10story.png`, `/tmp/capitale-v10-result15post.png`, `/tmp/capitale-v10-pre6story.png`.
- Same 6 cases **re-run against real** `https://betcapitale.com/admin/social-media` with request interception ONLY inside authorized headless browser (no live production DB writes): 6/6 PASS. Tested 1080×1920 story and 1080×1350 post, 2N team logo images + CAPITALE symbol, full name labels, no overflow and final match above footer. Verified `data-metric-console` one per row and V bottom rail width exactly 79.6% for the test value; correct pre-match/results toggling. No fatal JS errors.
- Guest route smoke `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans`: all 200, root mounted, no horizontal overflow, expected V10 social alias and existing Software V16 aliases. Real authenticated admin user's PNG save/download interaction not exercised; native-size browser element screenshot verified. No source/auth/backend write.

## Isolated live deployment
- Added immutable static module `/app/betcapitale/dist/public/assets/admin-social-media-v10-dimensional-20261122.js`, SHA `4eeb6726c828bec28389735bf2561b83a3a4d091733230d1f0f829d0d34cf306`. Previous V9 module left intact.
- Production `index.html`: changed one and only one existing `importmap` entry `/assets/admin-social-media-BufGLmZ1.js` V9 → V10, atomically. All THREE Software v16 aliases, V33 public homepage, auth/Today/Plans/admin Software, backend and data were preserved as-is.
- Previous live HTML sha `78bc29c0300a251b0c6832b63918d503382a7cc229e59e4cf943a6b9ff534ba8` → V10 sha `e3a5a28ffdde4d8ef3fcf4d1dfe1844ac1237a530c2d1514c02a3e72042ad935`. Backend remains SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- Rollback prior exact index file `/app/betcapitale/rollback-matchlist-v2-dimensional-v10-20261122/index.html` (V9/Software v16), restore atomically to undo V10. All static old assets remain.

## GitHub artifacts
- Source patch `deployments/betcapitale/matchlist-v9-to-v10-dimensional-console-20261122.patch`
- HTML one-alias patch `deployments/betcapitale/matchlist-v10-production-importmap-20261122.patch`
- Full report `deployments/betcapitale/matchlist-v10-dimensional-console-live-20261122.md`
- Persistent designer journal `tasarımcı-sohbet.md` will record V10, test logs, rollback and any remaining uncertainty.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]