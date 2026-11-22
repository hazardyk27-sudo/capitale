# CAPITALE — How It Works V4: refined connected mockups (isolated design preview)

**Date:** 2026-11-23 (Europe/Istanbul)  
**Status:** V4 live as an isolated preview; **production /how-it-works NOT changed**. User approval pending.

## Why V4 exists

The owner said V2 concept was good but its tables and mockups were visually weak. V3 incorrectly interpreted that as a request to remove mockups entirely. Owner clarified the correct instruction: **improve the mockups rather than remove them**.

V4 addresses that feedback by using fewer, larger, cleaner product-style visuals that communicate **exactly how a real selected match enters coupons and how coupons settle**, without duplicating generic tables.

## Preview

- Live, read-only, not indexed: <https://betcapitale.com/preview/home-v1/how-it-works-v4/>
- Entire desktop: <https://betcapitale.com/preview/home-v1/how-it-works-v4/qa/desktop-full.png>
- Desktop core connected UI: <https://betcapitale.com/preview/home-v1/how-it-works-v4/qa/desktop-workflow.png>
- Entire mobile: <https://betcapitale.com/preview/home-v1/how-it-works-v4/qa/mobile-full.png>
- Desktop above the fold: <https://betcapitale.com/preview/home-v1/how-it-works-v4/qa/desktop-fold.png>
- Mobile above the fold: <https://betcapitale.com/preview/home-v1/how-it-works-v4/qa/mobile-fold.png>
- Server location: `/srv/capitale-preview/home-v1/how-it-works-v4/`. The existing **Nginx /preview/home-v1/** static alias serves V4; no config changes.

## V4 visual design & content

1. Hero headline **"From the first signal to the final result."** in CAPITALE's DM Serif Display, orange accent and Outfit Light brand wordmark; right-hand **single elegant software selection ticket** with real same-origin crests for fictional Chelsea–Arsenal, sample selection Over 2.5 Goals, illustrative MOM signal and direct forward step.
2. One connected **SOFTWARE → MATCHES → COUPONS → RESULTS** demonstration (all stages visible at once on desktop, stacked on mobile). Software section shows three review inputs (MARKET, NEWS, ANALYST). Match section has three custom compact cards using **existing local team crests**, with explicit market and example SXF code. Coupon section includes four equal €50 stake slips; **C03 is expanded** to identify exactly which two match selections (Barcelona win + Roma–Inter BTTS Yes) were placed in it. Result section lists all four outcomes, including losses; C03 returned €270 at illustrative 5.40 odds. The daily result is `€270 total returns − €200 staked = +€70`. This is internally consistent as a hypothetical example, not historical performance or a real betting recommendation. Note in the visual explicitly says **illustrative only**.
3. A **short explanatory financial formula** with the same arithmetic and an explicit warning that real days can be negative.
4. Clean publication/settlement timeline and public /history link instead of an overcomplicated mock audit grid.
5. Final links to actual site /today, /history, /plans. Risk disclaimer and age 18+.
6. No artificial profit guarantee, fake live API call, user records, or made-up source authenticity. Fonts and theme match the existing CAPITALE visual identity.

## Implementation files

- `deployments/betcapitale/how-it-works-v4-refined-mockups-20261123/index.html` — commit `47a0f8d3bbfd1e9321f93638924f1f4b0cf2931e`
- `deployments/betcapitale/how-it-works-v4-refined-mockups-20261123/styles.css` — commit `b36761546857e54aeb683bae123ddf72e09d1e17`
- `deployments/betcapitale/how-it-works-v4-refined-mockups-20261123/app.js` — commit `28042f4340b587f1a26d0330331ad90fed7696f1`
- Browser QA harness (kept on the authorized smartxflow server): `/srv/capitale-preview/home-v1/how-it-works-v4/qa-check.cjs`.

## Verification

- Preview HTML/CSS/JS and direct screenshots all HTTPS HTTP **200**; `/how-it-works` remains HTTP **200**, existing content unchanged.
- Static HTML parser: 15 unique IDs, **10/10 referenced local images exist**; exactly 3 fixture cards, 4 coupon slips, 4 result rows, 3 source components; all illustrative disclaimers present and daily math correct.
- `node --check app.js` PASS.
- Chrome 148 via Puppeteer tested 1440×900, 1200×900, 820×1180, 390×844, 320×720: **5/5 PASS**, zero horizontal overflow, zero broken images, zero page/console errors, all cards present on every size, mobile menu open/close and Escape working. Browser output: `ERRORS []`.
- Reviewed actual desktop fold, full desktop page, desktop workflow and full mobile screenshots. Follow-up visual correction: **Expanded C03 coupon lists Barcelona win and Roma–Inter BTTS Yes**, directly connecting displayed selected matches to a coupon and then its recorded win. Re-ran all five viewport checks: PASS.
- No production HTML, React chunks, backend, Supabase, SXF, Software, Match List, homepage, other page route, or old V2/V3 preview modified.
- Production index HTML SHA at verification `23b89040b52203335889fc458e2bfc40653d2c31273e09de4d06fd77d6d6ca06`. Backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.

## Next steps & safety

Owner can inspect the isolated V4 and request further improvements. **Do not replace production `/how-it-works` without explicit owner approval**. To undo this preview, remove only `/srv/capitale-preview/home-v1/how-it-works-v4/`; leave V2/V3 intact. If later approved, implement a versioned **How It Works-only** frontend React bundle, preserve unrelated route/module imports, and use atomic deploy with rollback.
