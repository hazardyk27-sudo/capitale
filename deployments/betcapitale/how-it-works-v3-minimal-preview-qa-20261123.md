# CAPITALE — How It Works V3 minimal preview (2026-11-23)

## Owner feedback and approved scope
The user liked the conceptual direction of V2 but found its mockups and tables cluttered, and asked for a simpler, clearer page. This task creates an **isolated V3 preview only**, preserves V2 intact, and makes **no live website, SXF, Software, Match List, DB, or backend edits**. Live /how-it-works is untouched.

## View
- Preview: https://betcapitale.com/preview/home-v1/how-it-works-v3/
- Desktop full-page: https://betcapitale.com/preview/home-v1/how-it-works-v3/qa/desktop-full.png
- Mobile full-page: https://betcapitale.com/preview/home-v1/how-it-works-v3/qa/mobile-full.png
- Server: `/srv/capitale-preview/home-v1/how-it-works-v3/`
- Previous V2 unchanged: https://betcapitale.com/preview/home-v1/how-it-works-v2/

## What's different
- **All** V2 mock dashboards, charts, fake match cards, coupon tables, fictional betting amounts, interactive panels and fake proof cards removed.
- Editorial minimal headline "**From analysis to results.**" with an at-a-glance four-stage text-only flow **Software → Matches → Coupons → Results**.
- Four plain-language numbered sections explaining what happens and the purpose of each stage. No table, no box/card grid, no repeated pseudo-application mockups.
- Simple daily-net explanation using only the equation **Total returns − all coupon stakes = Daily net result**. Explicit risk and no guarantee.
- Plain before-match versus after-settlement explanation using a typographic timeline. Links to the **real** /history, not a simulated proof.
- Clear navigation to public /today, /history and /plans; compact FAQ and membership tables from V2 removed.
- Preserve minimalist CAPITALE identity: existing orange crest asset, Outfit Light wordmark, DM Serif Display headline, Manrope copy, white spaces, understated orange accent, one restrained dark CTA footer.
- No actual profit claim or fake performance figure.

## Implementation
- Preview HTML: `deployments/betcapitale/how-it-works-v3-minimal-preview-20261123/index.html`, GitHub commit `3bc31ce8fdf9f9350825fd18de212ce7ef13933b`.
- Preview CSS: `deployments/betcapitale/how-it-works-v3-minimal-preview-20261123/styles.css`, commit `06714a130f868cc58d0034c62b39a07bfc74075f`.
- No JS required; mobile nav uses native HTML `<details>`. No tracking pixels, no indexation, no runtime third-party APIs; Google Fonts used as in existing site.
- The existing preview Nginx alias `/preview/home-v1/` serves V3. No Nginx configuration changes.

## QA
- Preview HTML, CSS and four real screenshot files all **HTTPS HTTP 200**, proper types. Live `/how-it-works` HTTP 200 unchanged.
- Static checks: 11 unique IDs, 2/2 existing local PNG image refs, four complete step anchors, no `<table>`, no old V2 mockup structures, no fictional coupon amounts, formula and risk copy present, noindex/nofollow/noarchive plus reduced-motion CSS.
- Installed Chromium / Puppeteer browser tested **1440 × 900**, **820 × 1180**, **390 × 844**, **320 × 720**. All four: **zero horizontal overflow, zero broken images, zero page/console errors, exactly four step articles, zero mockup elements**, mobile nav open/close.
- Real desktop above-fold and full-page, mobile above-fold screenshots inspected. Refinement after visual review: title revised from an awkward 3-line 'From analysis to accountability' to a clean two-line 'From analysis to results', re-tested all 4 sizes, `ISSUES []`.
- No live index or backend modifications. Production index SHA at final verification `23b89040b52203335889fc458e2bfc40653d2c31273e09de4d06fd77d6d6ca06` (already concurrent before this task), backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.

## Status
**V3 PREVIEW READY; user review pending.** The production How It Works page is still the prior React implementation. If approved later, separately version and deploy only How It Works frontend component with explicit rollback and authenticated-browser checks where appropriate. If discarded, remove only isolated V3 preview folder; leave V2 and all production paths untouched.
