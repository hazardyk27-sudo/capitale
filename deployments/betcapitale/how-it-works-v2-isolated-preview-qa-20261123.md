# CAPITALE — How It Works V2 visual redesign (isolated preview)

**Date:** 2026-11-23, Europe/Istanbul  
**Role:** TASARIMCI  
**User request:** Implement the previous How It Works recommendations so the owner can see how the redesign would look.  
**Approval boundary:** Preview only; no change to live `/how-it-works`.

## Live isolated preview

- <https://betcapitale.com/preview/home-v1/how-it-works-v2/>
- Server path: `/srv/capitale-preview/home-v1/how-it-works-v2/`
- Existing Nginx preview alias `/preview/home-v1/` serves the new subfolder as static files. No Nginx config, live frontend, index HTML, backend, authentication, routing, SEO of production or Supabase changes.
- Public design preview uses `noindex,nofollow,noarchive` meta, and Nginx sends `X-Robots-Tag: noindex, nofollow, noarchive`. Existing pixels/analytics deliberately not loaded in this independent static preview.
- Preview does not require authentication.

## Design decisions implemented

1. **First screen:** CAPITALE brand, corporate Outfit Light wordmark, white/ink/orange editorial headline, two functional CTAs, three sources (MARKET, NEWS, ANALYST) feeding a CAPITALE engine and MATCHES → COUPONS → RESULTS in a complete 3-column system diagram.
2. **Interactive workflow:** Four accessible tabs SOFTWARE / MATCHES / COUPONS / RESULTS, with separate contextual visual panels. Includes source-specific market selections and local team crests. Tab click and arrow/Home/End keyboard interactions; panels use `aria-selected`, `role=tabpanel`, `aria-controls`.
3. **Transparency:** Two mock cards show before/after states of the same fictional coupon reference `DEMO-042`, public pre-match summary and post-settlement outcome. Clear link to actual public `/history`.
4. **Daily balance:** Both a fictional positive and negative example, with fully consistent arithmetic: four × €50 stakes = €200; winner at 5.40 gross returns €270 → net +€70; alternate winner at 1.90 gross returns €95 → net −€105. Every example explicitly distinguished from real results and predictions.
5. **Conversion without pressure:** Three clear next steps `/today`, `/history`, `/plans`; simple 3-answer FAQ.
6. **Responsive & accessible:** 1440 desktop, 820 tablet, 390 mobile, 320 narrow mobile; no horizontal overflow. Functional mobile menu, reduced-motion preference, keyboard focus and accessible tab semantics. UI uses existing live same-origin CAPITALE icon and immutable locally hosted club crests; any fictional match/odds/returns are identified as illustrative and are not claimed to be SXF predictions.

## Source files and reproducibility

- `deployments/betcapitale/how-it-works-v2-preview-20261123/index.html` (GitHub commit `a7f4f300fd7bf736d8719f951265198eadaf03a8`)
- `deployments/betcapitale/how-it-works-v2-preview-20261123/styles.css` (GitHub commit `cf466a0a3cb7b73d82b3effdeb5679b1d3f02229`)
- `deployments/betcapitale/how-it-works-v2-preview-20261123/app.js` (GitHub commit `96cd8953c25bc59def25d5ccc99b916c66778e30`)
- QA browser harness (server only): `/srv/capitale-preview/home-v1/how-it-works-v2/qa-check.cjs`.
- Reusable source isn't a patch of the old application yet: this is a deliberately isolated proof of concept. Production implementation should be adapted to the actual React How It Works component **only after owner approval**, preserving other route imports.

## Preview screenshots

- Desktop above the fold: <https://betcapitale.com/preview/home-v1/how-it-works-v2/qa/desktop-fold.png>
- Desktop full page: <https://betcapitale.com/preview/home-v1/how-it-works-v2/qa/desktop-full.png>
- Mobile above the fold: <https://betcapitale.com/preview/home-v1/how-it-works-v2/qa/mobile-fold.png>
- Mobile full page: <https://betcapitale.com/preview/home-v1/how-it-works-v2/qa/mobile-full.png>

## QA completed

- Standalone preview route **HTTP 200**; `index.html`, `styles.css`, `app.js` each **HTTP 200** with correct types; screenshots each HTTP 200 PNG.
- Static HTML parser: 21 unique IDs, 11 local image references all resolve on disk, 1 accessible tablist with 4 tab pairs, all examples and disclaimer text included; CSS reduced-motion condition present.
- Node JS `--check` passed.
- Chromium Puppeteer tests using installed browser: four viewport sizes **1440×900, 820×1180, 390×844, 320×720**. Each passed no horizontal overflow, 0 broken images, 0 console/page errors, 4 tabs/1 active/3 hidden, click results and matches, mobile menu open/close, close with Escape. `QA_ERRORS []`.
- Visually reviewed real **desktop fold**, **desktop full page** and **mobile fold** screenshots; premium minimal layout, intact spacing and visible CTA/buttons.
- Live production `https://betcapitale.com/how-it-works` remains HTTP 200 and references its original bundle `how-it-works-BgnH6UdZ.js`. The independent preview added files **only** under `/srv/capitale-preview/home-v1/how-it-works-v2/`.
- Server production frontend index SHA during final check `23b89040b52203335889fc458e2bfc40653d2c31273e09de4d06fd77d6d6ca06`. This SHA had changed earlier from a concurrent unrelated action; **this task did not edit index.html**. Production backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.

## Approval and rollback

**Status:** Owner visual review pending; **not production-approved**. The current live How It Works page remains unchanged.

Rollback for this isolated preview: remove only `/srv/capitale-preview/home-v1/how-it-works-v2/` if desired. Do not restore or alter `/srv/capitale-preview/home-v1/index.html`, frontend production entry, backend or any other preview.

**Next step if owner approves:** implement the accepted layout in a versioned copy of the original live React page chunk, build and test against current production bundle, then deploy only the scoped How It Works route with atomic change and rollback, leaving the rest of the app untouched.
