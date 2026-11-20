# CAPITALE main website dark header branding — 2026-11-20

**Status: deployed live** at https://betcapitale.com/ .

## Change

Replaced the previous BET CAPITALE raster wordmark in the public site's desktop and mobile navigation headers with a shared dark-mode version of the approved CAPITALE Software Intelligence identity:

- The same CAPITALE orange SVG symbol, served from `/capitale-premium-symbol.svg`.
- A white, lightly spaced serif `CAPITALE` wordmark.
- A compact pale-gray `SOFTWARE INTELLIGENCE` subtitle.
- Desktop uses the approved ~36px logo and ~19px wordmark; mobile uses a more compact ~33px logo and ~17px wordmark.
- Maintains black header background, home link, existing navigation, login, join, member controls and mobile hamburger. Only the site-brand visual element changed; the rest of the header implementation remains in place.
- The shared component makes the same brand appear on the landing page and other pages using `SiteHeader` or `MobileHeader`.

## Source changes and reproducibility

[Patch file](main-site-header-capitale-brand-dark-2026-11-20.patch), tested with `patch --dry-run -p1` against the existing v5 website source snapshot. It modifies:

1. `client/src/components/SiteHeader.tsx` (desktop)
2. `client/src/components/MobileSharedLayout.tsx` (mobile)
3. `client/src/components/CapitaleHeaderBrand.tsx` (new shared component)

The source was built in an isolated worktree:
`/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-main-header-brand-v1-work`.

## Validation and deployment

- TypeScript check: passed.
- Existing four Software summary tests: 4/4 passed.
- Production build: passed.
- Both desktop/mobile component imports, logo SVG link, white text and subtitle were checked in the source.
- Published the frontend-only hashed assets with the SPA main bundle `/assets/index-CHywaKwN.js`, returning HTTP 200.
- Live homepage and logo SVG returned HTTP 200. Web and persistent Commander services remained active. No backend, membership, payment, data or API code was replaced.
- Live site HTML retained its existing standalone extensions, scripts, and admin customizations.
- Unauthenticated admin Software API still returned HTTP 401.
- A signed-in / cross-device graphical browser screenshot inspection was **not** performed, so actual rendered pixel perfection across browsers is not claimed.

## Rollback

The complete previous live distribution was backed up at:
`/app/betcapitale/dist.rollback-main-header-brand-20261120T1515Z`

Atomically restore its `public/index.html` to revert the frontend; cached old hashed assets were retained. The active backend should not need restarting.
