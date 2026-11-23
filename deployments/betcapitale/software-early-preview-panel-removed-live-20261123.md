# CAPITALE Software — remove public "Upcoming SXF early signals" panel

**Date:** 2026-11-23, Europe/Istanbul  
**Status:** LIVE on `https://betcapitale.com/software/`.  
**User instruction:** Remove the large orange "Upcoming SXF early signals" panel shown in a screenshot. No other modifications requested.

## Exact scope
- Public Software V13 was the active renderer (`capitale-software-widget-v13-fixed-utc-plus1-20261123.js` loaded by `capitale-software-page-v15-utc-plus1-20261123.js`, via SPA `index-capitale-software-spa-v15-utc-plus1-20261123.js`).
- New immutable renderer `/app/betcapitale/dist/public/assets/capitale-software-widget-v14-hide-early-panel-20261123.js` is an exact copy of V13 **minus the 21-line render-only block** that inserted `.capitale-early-preview`. The normal `matchCard`, `filtered`, `loadData`, totals, filters, date/time formatting, team crests, pagination and data access are otherwise byte-for-byte unchanged.
- Production `/app/betcapitale/dist/public/index.html`: added **one** import-map alias mapping `/assets/capitale-software-widget-v13-fixed-utc-plus1-20261123.js` to the new V14. No importmap value changed, no scripts removed, no other route edited.
- New JS SHA256 `b68f161114b07dba9ac37ff44ff751d4360627719e1c98feff66fd01973c5b94`. Original JS SHA256 `e734999404e2122e8f95dba9853b75aa05828af07c04572031581d59814440f2`.
- Index before SHA256 `17be5d965b283c27be9c5cd7b205c09388ac015fa0f52d9acb266bcf434a9b84`; after `bda3f319c4bf7f99cd7d99194f91adeab3cbf9f0e222ef6ede4ae32ee95828f2`. Source hash was verified immediately before atomically replacing production index.
- **No** source-feed changes: Software `/software/matches.json` still exposes 55 normal items and 1 EARLY preview (Brentford–Everton at this inspection) for other potential consumers. This operation **only hides the public separate orange panel**; it does not delete SXF signals, records, fixtures or preview feed. The independent admin Software panel is out of screenshot scope and unchanged. User had not approved a redesign/migration of EARLY signals into normal match cards, so nothing was added there.
- No backend, Supabase, SXF motor, match-list v2, homepage, admin Software, original SPA/page modules or other routes were changed.

## QA evidence
- Node `--check` for new V14 JS passed; new asset HTTP 200.
- Chromium 148 with Puppeteer loaded the real `/software/` page at 1440px desktop and 390px mobile, confirmed **V14 module fetched** and **no `.capitale-early-preview` panel** or "Upcoming SXF early signals" text. Both returned **20 normally rendered public match cards**, correct `55 / 55 matches` count, no horizontal overflow or page errors.
- Replicated user's screenshot filter `2026-11-23` programmatically. Display **14 / 55 matches** and **14 normal cards**, zero orange panel. Clicked the first card and confirmed `aria-expanded` changed from false to true in the **re-rendered** DOM.
- `/software/`, homepage `/`, `/admin/software` HTTP 200 after publication.
- Published all tests without touching unrelated services; visually verified selectors and full DOM. A prior automated click check read a DOM element reference invalidated by the widget's ordinary re-render; corrected test querying the newly rendered element passed.

## Rollback and code
- Exact original index backup: `/app/betcapitale/rollback-software-hide-early-panel-20261123/index.html`; restoring this backup will disable only the new widget alias and restore the early panel.
- Original V13 JS remains in place and unchanged.
- GitHub new widget source: `deployments/betcapitale/software-widget-v14-hide-early-panel-20261123.js` commit `7ae2cfe89622730958a3d6423767ba1a9cc47158`.
- GitHub exact V13→V14 render-only diff: `deployments/betcapitale/software-widget-v13-to-v14-remove-early-panel-20261123.patch` commit `8231c185a738d1de42004f983f25b345102417d8`.

## Owner approval boundary
The user asked to remove the panel; no additional UI or data changes should be made without a separate request.
