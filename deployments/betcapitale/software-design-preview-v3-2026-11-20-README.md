# CAPITALE Software — DESIGN PREVIEW UI applied to the live admin site

Deployment date: **2026-11-20**. Status: **LIVE FRONTEND DEPLOYED**.

## URLs

- Production admin page: https://betcapitale.com/admin/software
- Labeled four-match synthetic UI demo: https://betcapitale.com/admin/software?preview=1
- Original standalone HTML design reference: `/capitale-demo-2026-11-21.html` (retained as a historical prototype; main site now uses the updated React implementation).

## What was changed

The approved **DESIGN PREVIEW** layout (taken from the site's original `capitale-demo-2026-11-21.html` styles) now powers the **real** React `/admin/software` page, including:

- Compact, premium CAPITALE header and main match board.
- Match rows with kickoff, real club crest images and league, selection and odds, signal tag/checkpoint, **A** (ANALYST support 0–100), **N** (NEWS support 0–100), **V** (selected-market money share), **B** (verified 1X2 draw-money share) and **O Δ%** (selected-market odds movement percentage); unknown values remain blank/—.
- Expanded row directly below the match with **Behind the signal**, compact **SIGNAL/A/N/V/B/O Δ%** metric strip and staged three-role display.
- The exact three-stage frontend sequence is **SXF 2 seconds → NEWS 3 seconds → ANALYST 4 seconds**. Each saved role summary is capped at three English bullets. A dark navy processing pane uses the CAPITALE symbol, neural activity icon, pulsing dots and progress bar. Reduced-motion preferences bypass artificial waits.
- **Prediction/FINAL summary/card and Category column removed**. No automatic FINAL recommendations or fabricated confidence classification are rendered.
- The demonstration has four visibly **SYNTHETIC** fixtures (Manchester City–Fulham, Chelsea–Leeds United, Aston Villa–Sunderland, Newcastle United–Arsenal) and 8 existing local badge assets under `/capitale-demo-assets`. The demo state is isolated in the frontend, never written to the real report API/database.
- Real rows remain sourced from the existing authenticated `GET /api/admin/software` endpoint, unchanged by this frontend deployment. Real data is never replaced with mock data without switching to the visible DESIGN PREVIEW mode.

The page is accessible to admins. A direct `?preview=1` URL opens the synthetic demonstration, explicitly identified as such.

## Files and reproducibility

GitHub patch: [software-design-preview-v3-2026-11-20.patch](software-design-preview-v3-2026-11-20.patch).

The patch applies to the prior v2 website snapshot and modifies:

- `client/src/pages/admin-software.tsx`
- `client/src/pages/software-design-preview.css` (new)

Original matching v2 worktree on Hetzner:
`/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-animation-v2-work`

Production build worktree:
`/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-design-preview-live-work`

The patch was verified with `patch --dry-run -p1` against the original v2 worktree. Eight local demo crest PNGs and CAPITALE orange SVG symbol were copied from the already-existing live site's `public/capitale-demo-assets` and `public/capitale-premium-symbol.svg`. Preserve those assets in future builds.

## Deployment and tests

- TypeScript `tsc --noEmit` passed.
- Existing software-summary-contract tests: **4/4 passed**.
- Production client build passed.
- Hashed software bundle: `admin-software-CmWBd9Q2.js` (verified HTTP 200 with JS content-type).
- Hashed software stylesheet: `admin-software-Dm114mb4.css` (verified HTTP 200 with CSS content-type).
- New SPA main JS: `/assets/index-DyupzBWB.js` (verified HTTP 200). The live HTML's additional site-wide CSS/JS customizations were preserved during the switch.
- The earlier `capitale-live-premium` HTML class was disabled **on Software only** to avoid old table-specific CSS overriding the new design; scroll-restoration behavior was retained.
- All eight local demo logo URLs returned HTTP 200.
- **No production backend/database files were replaced**, and the existing backend changed independently before this UI deployment. No changes were made to payments/Whop/membership or data schemas.
- The unauthenticated admin feed still returns HTTP **401**. The site and Commander services remained active.
- Live URL, generated JS/CSS files and compiled component strings were verified. **A signed-in browser screenshot/interaction test was not available** in this session, so no claim is made that visual pixel matching was browser-verified.

## Rollback

Backup directory on Hetzner:
`/app/betcapitale/dist.rollback-design-preview-20261120T1410Z`

To roll back only the frontend, atomically restore `public/index.html` from this backup. Existing frontend hashed assets were retained and no backend restart should be necessary. The old styling class and old asset references are part of the backup.

## Agent data and trust

SXF is the sole source of signals and V/B/O market metrics; NEWS owns N; ANALYST owns A. Site display must not generate an absent role report, convert A/N to win probability, or claim real-time research because a staged animation is playing. Odds-movement comparison is displayed only when valid source/reference timestamps and a market/selection identity are present. The demo values are fictional by design.

Role-scoped ingestion and real report freshness are separate backend concerns. This UI update did not claim to implement or independently test Agent Bridge persistence.
