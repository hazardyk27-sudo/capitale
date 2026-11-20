# CAPITALE Software — Premium metrics v4 (2026-11-20)

**Status: DEPLOYED LIVE** to the existing authenticated `https://betcapitale.com/admin/software` frontend; demo preview is available at `https://betcapitale.com/admin/software?preview=1`.

## What changed

- **Removed SELECTION column and visible selection block entirely.** Exact `market`/`selection` values remain *internal* for fixture/market identity, odds validation, source joining and agent isolation. The match details may still show the market category and the already-approved research comments; no standalone selection/prediction recommendation is added.
- New **8-column table**: `KICKOFF | FIXTURE | SIGNAL | A | N | V | B | O Δ%`. Columns span the full width; previous blank Selection space is eliminated.
- **English-only UI copy**, including staged processing captions: `Analyzing market activity...`, `Analyzing match news...`, `Analyzing statistical performance...`. Kickoff timezone is displayed as `UTC+3`; Turkish status lines are gone.
- Premium, restrained metrics: family-colored SXF signal chips, A/N support scores in distinct soft-color boxes, V percentage plus a tiny money-share bar and available £ amount, B verified 1X2 draw-money share, and green downward/red upward odds-change percentage. Column tooltips clarify semantics and A/N are *not* win probabilities.
- The under-row **Behind the signal** panel's `SIGNAL/A/N/V/B/O Δ%` metric strip now has matching premium six-box styling, descriptions, and responsive 3x2 mobile layout.
- Original accepted light premium DESIGN PREVIEW overall layout and dark CAPITALE neural-progress animation retained, staged **SXF 2s → NEWS 3s → ANALYST 4s**. Missing agent summaries are not fabricated. Reduced-motion option is still respected.
- There is **no Prediction, FINAL, CATEGORY column, or synthetic real-world report publication**. Four preview fixtures are clearly labeled as fictional design data and are never saved to production reports.

## Files and reproducibility

Patch: [software-premium-metrics-v4-2026-11-20.patch](software-premium-metrics-v4-2026-11-20.patch)

Apply this patch to the immediately preceding v3 website source snapshot, not to arbitrary future code. It modifies:

- `client/src/pages/admin-software.tsx`
- `client/src/pages/software-design-preview.css`

Original v3 worktree:
`/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-design-preview-live-work`

Deployed v4 build worktree:
`/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-software-premium-v4-work`

`patch --dry-run -p1` succeeded against original v3 source.

## Validation and deployment

- Full TypeScript `tsc --noEmit`: **passed**.
- Existing four software summary contract unit tests: **4/4 passed**.
- Production `npm run build`: **passed**.
- Predeployment static assertions verified *exactly eight* columns and no `SELECTION`, `pick-col`, Turkish processing captions, `FINAL` or `CATEGORY` display.
- Deployed frontend SPA JS `/assets/index-CgwuvRSB.js` (HTTP 200), Software JS `/assets/admin-software-D0xoAFCv.js` (HTTP 200, JavaScript type), and Software CSS `/assets/admin-software-E09Rd1ia.css` (HTTP 200, CSS type).
- Only hashed browser assets and the live HTML asset references were modified. All existing site customizations in `public/index.html` were preserved.
- Production `/app/betcapitale/dist/index.cjs` backend is from a different, newer build and was **intentionally left untouched**. No payments, member accounts, API handlers, research/archives or databases were changed.
- Existing team-logo files remain available. Web server and Desktop Commander services remained active.
- Backed up the previous live distribution at `/app/betcapitale/dist.rollback-premium-metrics-v4-20261120T1430Z`.
- No signed-in browser screenshot/visual interaction test was performed in this session; build and live HTTP checks do not establish pixel-level verification on a specific device.

## Rollback

Atomically restore the backed-up `public/index.html` from `/app/betcapitale/dist.rollback-premium-metrics-v4-20261120T1430Z/public/index.html`. Previously published hashed assets are still present, so reverting the HTML restores the prior frontend without changing the running backend.

## Security/data boundaries

SXF provides market signal/V/B/O; ANALYST provides A; NEWS provides N. Selection identity remains in data, even though its column is hidden, to prevent mixing scores between different bets in the same fixture. Odds change is shown only when reference/current timestamps and market/selection identity are present. No AI-driven or direct site ingestion was newly implemented in this UI-only change.
