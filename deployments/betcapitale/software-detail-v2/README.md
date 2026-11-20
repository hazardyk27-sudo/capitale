# CAPITALE Software — Populated demo & animated virtual brain (v2, 2026-11-20)

## State: LIVE FRONTEND DEPLOYED — 2026-11-20

The Hetzner Desktop Commander connection was restored. The v2 frontend was built, checked and **deployed to https://betcapitale.com/admin/software**. Only frontend static assets and local logo files changed. The production backend and real agent ingestion remain unchanged/unconnected. This is a labeled synthetic demo, not a verified match analysis.

## Requested behavior

- Manual **Preview populated demo** mode, separate from all production API data. Two Juventus–Parma selection rows with visible illustrative figures in MAÇ | SİNYAL | A | N | V | B | O. Clearly stamped `DEMO / SYNTHETIC`; no real betting evidence is implied.
- Preview team badges use the **Juventus J mark** and **Parma crest** from Wikimedia Commons, copied as site-local static assets at `/team-logos/juventus.svg` and `/team-logos/parma.svg`. Their live URLs both returned HTTP 200. Missing logos fall back to initials.
- Click **Details** under a match/selection: same-row drawer opens and stages run in strict order:
  - SXF Market: animated neural-brain processing for **2,000ms**, then up to 3 English bullets;
  - NEWS: **3,000ms**, then up to 3 English bullets;
  - ANALYST: **4,000ms**, then up to 3 English bullets.
- Active stage has a pulsing `BrainCircuit` icon, orbiting nodes, horizontal scan beam, progress bar and a Turkish status label. Completed stages keep their three English bullet summaries visible. Pending stages show simple skeletons.
- The user should understand this is a **visualization of previously saved summaries**, not actual time spent researching. The demo is prominently labeled as entirely synthetic.
- Reduced-motion setting skips the sequence, shows the completed content without animation; no artificial wait in that mode.
- The real `/api/admin/software` endpoint remains admin-only and currently returns empty data until the **agent bridge is implemented and verified**. This v2 work does not implement real ingestion, fetch real SXF numbers or grant more data permissions.

## Source artifacts

1. `software-brain-sequence.tsx` — React staged animation component.
2. `software-brain-sequence.css` — minimal responsive design and CSS animation.
3. `apply_v2.py` — conservative, source-anchored integration into a copy of the deployed v1 Betcapitale source. It writes a `.tsx.before-v2` backup and **does not deploy**.
4. `team-logos/juventus.svg` and `team-logos/parma.svg` — verified local demo logos copied to the website's static assets by the script.

### Verified deployment and rollback

- Website source base: `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-animation-work`.
- Isolated v2 source and build: `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-animation-v2-work`.
- Ran `apply_v2.py` integration successfully; locally hosted SVGs were added. The script in GitHub has now been updated to reproduce both the team-logo paths and corresponding static files for future rebuilds.
- `tsx --test client/src/lib/software-details.test.ts`: **4/4 passed**.
- `tsc --noEmit`: passed.
- `npm run build`: passed.
- `dist/index.cjs` backend bundle SHA-256 matched live backend exactly: `20a63de0a477fcb9df3a9ec8ad84ab8338c132b1216cbe2dc00adc3bf649c139`. Backend, database, Whop and payment services were untouched.
- Live previous static release backed up: `/app/betcapitale/dist.rollback-software-detail-v2-20261120T0130Z`.
- Published new hashed frontend assets and team logos, atomically updated live `dist/public/index.html`, kept old assets.
- Live main JS: `/assets/index-CdlFKgyK.js`; software JS: `/assets/admin-software-BC794oO8.js`; software CSS: `/assets/admin-software-Co6uw3G6.css` — all HTTP **200**.
- Live `/team-logos/juventus.svg` and `/team-logos/parma.svg`: **200 image/svg+xml**.
- Website `betcapitale-web.service`: active. Admin route HTML: HTTP 200. Unauthenticated feed remained protected earlier with HTTP 401.
- **Interactive signed-in admin browser inspection was not performed**. The 2/3/4-second animation is validated from component source and a successful client production build, not measured in a live browser.
- Rollback: atomically restore `public/index.html` from the above backup; previous hashed assets are retained. Local logos can be left in place.

### Continuous Desktop Commander service

- A dedicated copy of Desktop Commander Remote v0.3.4 installed at `/opt/desktop-commander-remote`.
- Systemd unit: `/etc/systemd/system/desktop-commander-remote.service`, enabled at boot and active with `Restart=always` and `RestartSec=12s`. Connection restored as the same `smartxflow` device. Old terminal-driven process stopped.
- This protects against terminal closure and process exits but cannot guarantee uninterrupted service during network/provider outages.

## Logo provenance

- Juventus 2020 badge: https://commons.wikimedia.org/wiki/File:Juventus_FC_-_logo_black_(Italy,_2020).svg
- Parma 2016 badge: https://commons.wikimedia.org/wiki/File:Logo_Parma_Calcio_1913_(adozione_2016).svg

Both are team identity marks. Source pages describe them as geometric/text logos; trademark restrictions may still apply. They are used only for identifying clubs, not product endorsement. No logo assets have yet been cached in the production site for this v2 release.

## Tests and limitations

The 4 summary-contract unit tests, TypeScript compilation, and full production build passed. No browser-based signed-in animation/screenshot test was available in this session; no evidence of real agent publishing was created. The backend feed still needs role-scoped Agent Bridge ingestion, report storage and server-side authorization before real match rows populate without demo mode.
