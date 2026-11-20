# CAPITALE Software — Animated Match Detail (2026-11-20)

Status: **Frontend deployed to live Hetzner on 2026-11-20; agent ingestion/bridge remains NOT CONNECTED.**

## Scope

- Live URL (admin-only): https://betcapitale.com/admin/software
- Clicking **Details** expands an **inline row immediately beneath that selection** instead of rendering a separate details card below the whole match table.
- Staged reveal: SXF **Market analysis** → NEWS **News analysis** → ANALYST **Statistical analysis**. Each is at most **three English bullets**, and data is shown only from the matching role's `departmentSummaries.<role>.software_detail_bullets_en`.
- The reveal animation is **presentation of previously saved reports**, not fake ongoing research. Reduced-motion users see content immediately.
- The match column supports home/away team logos with initials as a fallback; real logo resolution and agent uploads are not yet connected.
- Column headings remain **MAÇ/MATCH | SİNYAL/SIGNAL | A | N | V | B | O**, where B = 1X2 draw money share.
- No artificial production match results, scores, money shares, news or odds.
- Admin-only **Preview animation** shows a marked `DEMO` Juventus–Parma sample, kept entirely client-side and never inserted in the database.
- Empty state remains when the admin feed has no verified data.

## Persistence and source

The complete reproducible patch is [software-detail-animated-2026-11-20.patch](software-detail-animated-2026-11-20.patch). It modifies four paths in the Betcapitale website source tree:

- `client/src/pages/admin-software.tsx`
- `client/src/index.css`
- `client/src/lib/software-details.ts`
- `client/src/lib/software-details.test.ts`

Apply to the **matching original website source snapshot**, not blindly to an unrelated version: `patch -p1 < software-detail-animated-2026-11-20.patch`. The dry run succeeded against the original website snapshot on the server. Replit was not used.

The website source copy used to build the frontend exists at `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-animation-work`; this GitHub CAPITALE repository contains the small patch, not the entire Betcapitale application source.

## Validation and production deployment

- 4 automated unit tests passed: section order, maximum three bullets, malformed inputs, original payload immutability.
- TypeScript `tsc --noEmit` passed.
- Production `npm run build` passed.
- Built backend bundle `dist/index.cjs` had identical SHA-256 to the live backend. **No backend, database, payments, Whop, or member service changes were deployed.**
- Existing frontend was backed up as `/app/betcapitale/dist.rollback-software-detail-20261120T0100Z`.
- New hashed assets were added without removing old cached assets; `dist/public/index.html` was switched atomically.
- Live page and new JS assets returned HTTP 200; unauthenticated `/api/admin/software` returned HTTP 401; `betcapitale-web.service` remained active.
- Interactive browser testing with a signed-in admin account was **not performed**; the demo preview allows the owner to check animation in their own admin session.

## Backend contract for the next stage

When the manual, role-scoped Agent Bridge is connected, return row-specific:

```json
{
  "departmentSummaries": {
    "sxf": { "software_detail_bullets_en": ["English sentence."] },
    "news": { "software_detail_bullets_en": ["English sentence."] },
    "analyst": { "software_detail_bullets_en": ["English sentence."] }
  },
  "homeLogoUrl": null,
  "awayLogoUrl": null
}
```

The actual agent report import endpoints, verified logo catalog, and row data feed remain **unimplemented**, and source isolation must be enforced at server/database boundaries, not merely in React. The present `GET /api/admin/software` returns an empty, not-connected response. Do not claim real report import works until the bridge and backend persistence have passed tests.

## Rollback

On Hetzner, restore the backed-up `dist/public/index.html` atomically from `/app/betcapitale/dist.rollback-software-detail-20261120T0100Z/public/index.html`. Previously published assets were retained for existing cached browsers. No service restart should be necessary for the static HTML rollback. Verify service and authenticated admin experience after any rollback.
