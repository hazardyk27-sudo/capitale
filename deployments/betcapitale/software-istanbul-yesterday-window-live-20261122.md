# CAPITALE — Software Date Window (Live 2026-11-22)

## Request
User explicitly requested: **Software match listings show ONLY yesterday, today and all future fixture dates. Two days ago and all older games must not appear.** Do NOT delete historical Software/SXF reports, modify source data, break design/animations, or change unrelated pages.

## Implementation
- Time zone **Europe/Istanbul**. Calendar cutoff is **yesterday** (00:00 TRT) recalculated with Intl formatToParts on every render/refetch, independent of client/server timezone. For 22 November 2026 the permitted fixture date is `>= 2026-11-21`. Just before 23 November midnight cutoff is 21 Nov; at Istanbul midnight cutoff automatically advances to 22 Nov. Annual/year-month boundaries handled with UTC calendar arithmetic.
- Admin Software **V26** derived immutably from `admin-software-v25-hide-sample-labels-20261122.js`: only one small date helper and a predicate on its list `b=(s?.items??[]).filter(row=>typeof row.date==='string'&&row.date>=capitaleIstanbulYesterday())`. This applies before search, sorting, paging, filtering and row selection. Original real+illustrative fields, design, report editor, authentication, source feed and crests untouched.
- Public `/software/` widget **V9**, derived from **current live V8** (`capitale-software-widget-v8-no-report-button-20261122.js`), inserts the identical Istanbul cutoff and reduces `state.items` on each one-minute feed refresh, before any filter, sort and page count. This preserves the newer V8 page animations and UX, rather than accidentally rolling them back to V6.
- Production `index.html` importmap changes **only** three aliases for admin Software V25→V26 and adds one exact alias for current V8 Software widget→V9. Prior Social Match List V20, main SPA V8, existing V5→V6 widget alias, public navigation, source backend SHA and 629 team logos all preserved.
- No database, SXF results, Software reports, public `/software/matches.json`, ledger, synchronizer, 1-minute export worker or historical source records were changed. An older fixture remains securely in source but not in these two lists. Date picker cannot override the age policy.

## Verified outcomes
- Current raw public Software feed: 93 fixture rows with dates {"2026-11-20": 14, "2026-11-21": 46, "2026-11-22": 28, "2026-11-23": 5}. Visible filtered Software as of 22 Nov 2026: **79**, with **14 historical 20 Nov fixtures hidden**.
- Real browser at **staging AND live production**: `public_feed_93_to_79` PASS, `public_old_date_picker_blocked` PASS (0 old rows), `public_future_retained` PASS (5 future Nov 23 rows), `admin_only_yesterday_today_future` PASS (3/4 simulated source rows, 20 Nov hidden). Browser console/page errors: none. Admin source API mock is used only in browser test and never writes production DB.
- Node tests of both exact production date helpers: four midnight boundary scenarios per helper PASS, including `2026-11-22T20:59:59Z` → cutoff `2026-11-21`, and at `2026-11-22T21:00:00Z` → cutoff `2026-11-22` (local 23 November midnight), plus year change boundaries.
- SHA production index `66ee6b9351b9a17f01d739cc20c91974fa7660d158922d212f72be3fa6ccf50a`; prior backup `810bbfb4079477de2d99687a8ae26e7d4a384e8ced506f8a4d8d4130725c09df`. Production backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832` unchanged. Rollback HTML saved to `/app/betcapitale/rollback-software-istanbul-yesterday-window-20261122/index.html`; immutable old assets retained. Prior SPA V8 and Social V20 retained.
- Strictly display-only filtering, future games stay visible and local Istanbul date rolls daily. **Do not claim the older records were deleted.**

## GitHub artifacts
`deployments/betcapitale/software-istanbul-yesterday-window-v26-v9-20261122.patch`
`deployments/betcapitale/software-istanbul-yesterday-window-importmap-20261122.patch`
`deployments/betcapitale/software-istanbul-yesterday-window-live-20261122.md`
`tasarımcı-sohbet.md` updated.