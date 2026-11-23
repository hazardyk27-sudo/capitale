# CAPITALE — Match List V2 coupon kickoff time displayed without 2-hour subtraction

**Date:** 2026-11-23 (Europe/Istanbul)  
**Status:** LIVE on `/admin/social-media` → Match List V2.  
**Owner request:** A match manually entered as 18:00 in a coupon must show 18:00 in Match List V2; do not deduct an additional two hours or use a different Software kickoff hour. All other areas out of scope.

## Reproduced root cause from exact running source

Active production UI was `/app/betcapitale/dist/public/assets/admin-social-media-v22-matchlist-utc-plus1-20261123.js`. Match List V2 pre-match kickoff text used:

```js
children: c ? C : capitaleMatchListFixedUtcPlusOne(M?.kickoffUtc || D.kickoffAt)
```

where `D` is a record from `/api/admin/today/matches?date=` (the manually authored coupon match's `kickoffAt`) and `M` is optional Software metadata. The extra `capitaleMatchListFixedUtcPlusOne` function subtracted 2 hours from simple `HH:mm` values with `(h + 22) % 24`, or converted ISO strings to `Etc/GMT-1`. **Both** were wrong for the user's already-correct entered hours. Furthermore, the `M?.kickoffUtc` preference let Software override the time manually authored on the coupon.

Backend source `/app/betcapitale/dist/index.cjs` confirms the coupon sync creates `today_matches.kickoff_at` from `coupon_selections.kickoff_time?.trim()` by calling `upsertTodayMatch({kickoffAt: ...})`. The fix concerns display only; backend and stored values are untouched.

## Surgical change

New immutable chunk: `/app/betcapitale/dist/public/assets/admin-social-media-v23-matchlist-coupon-exact-clock-20261123.js`. Based entirely on production V22; two changes only:

1. Replace the old 2-hour-shifting helper with `capitaleMatchListCouponTime(value)`, which extracts and displays the **literal clock hour and minute as entered**, with no timezone calculation, shift or conversion; supports `18:00`, `18:00:00` and ISO-shaped raw fields without shifting the clock.
2. Change only the Match List V2 prematch kickoff rendering to `children:c?C:capitaleMatchListCouponTime(D.kickoffAt)`. Explicitly use the coupon-origin `today_matches.kickoffAt`, not Software's `kickoffUtc`. Settled/result status remains unchanged.

Frontend runtime `/app/betcapitale/dist/public/index.html` only updates **one existing import-map target** for `/assets/admin-social-media-BufGLmZ1.js` from V22 to V23. No other importmap aliases, page route, code, stored data, renderer styles or signal sources changed.

## Tests and live health

- `node --check` new chunk passed; new asset HTTPS **200** and JS MIME valid.
- Unit tests evaluating the **actual compiled old and new helper functions** show:
  - 18:00 → old 16:00, new **18:00**.
  - 21:30 → old 19:30, new **21:30**.
  - 00:15 → old 22:15, new **00:15**.
  - Also verified ISO raw fields, `9:05` → `09:05`, time with seconds, and invalid/empty values.
- Static assert verified Match List V2 render uses `D.kickoffAt` and has **no Software `kickoffUtc` preference** and **no remaining old helper**.
- Production import-map JSON parsed and validated; the original entire index equals the new index after reversing **exactly one alias replacement**. `/, /admin/software, /admin/social-media, /software/, /today` all HTTP **200**.
- Note: no signed-in browser session was available for an authenticated Match List V2 screenshot; direct source, helper behavior, import map and endpoint structural code were verified. Do not claim an authenticated UI screenshot was tested.

## Rollback and records

- Exact previous production index saved as `/app/betcapitale/rollback-matchlist-v2-coupon-clock-20261123/index.html`.
- Previous live index SHA256: `bda3f319c4bf7f99cd7d99194f91adeab3cbf9f0e222ef6ede4ae32ee95828f2`.
- New index SHA256: `c0fad85719636fce7a5c8c3c63bd4cddb3d52c0c6b0c9063baec3566780320ae`.
- Old V22 chunk retained unchanged; new V23 chunk SHA256: `86c9a2248132d58a4bb400d46171e731a8cc1bc4c470d14aa7384c6c4d641720`.
- GitHub source: `deployments/betcapitale/admin-social-media-v23-matchlist-coupon-exact-clock-20261123.js`, commit `4b32a901130326d58b9b357d525481aa0717adf9`.

**Approved scope fulfilled:** Only Match List V2 prematch display time corrected; Software timezones and cards, coupon editor, Match List original, SXF, Supabase, and any other pages untouched.
