# CAPITALE Software — Populated demo & animated virtual brain (v2, 2026-11-20)

## State: PREPARED, NOT DEPLOYED

This repository now has the v2 frontend component, styling, and integration script. **The Hetzner Desktop Commander device went offline during this iteration. The production website has not been updated to v2; the previously deployed v1 frontend is still the last verified live build.** Do not report completion or live availability until access is restored and validated.

## Requested behavior

- Manual **Preview populated demo** mode, separate from all production API data. Two Juventus–Parma selection rows with visible illustrative figures in MAÇ | SİNYAL | A | N | V | B | O. Clearly stamped `DEMO / SYNTHETIC`; no real betting evidence is implied.
- Preview team badges link to the matching **Juventus current J mark** and **Parma crest** hosted on Wikimedia Commons. Missing logos fall back to initials. In a production deployment, prefer verified cached/local assets where permitted and test logo HTTP status.
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

### Installation (only when server access is restored)

1. Make a fresh **isolated working copy** of the exact v1 source tree, not the live `/app/betcapitale/dist`.
2. Obtain this folder from GitHub and run `python3 apply_v2.py --website-root /path/to/isolated/site`.
3. Run the site TypeScript check, targeted summary tests, and production build. Inspect both matched logo images and the 2/3/4-second sequence in a browser including reduced-motion mode.
4. Compare generated backend bundle byte-for-byte with the live backend, and refuse deployment if it differs unexpectedly.
5. Back up live `dist`, add the new frontend hashed assets and atomically swap only the frontend `public/index.html`; keep rollback available.
6. Verify live HTML/JS endpoints, admin API 401 for unauthenticated requests, existing Whop and payment endpoints, and actual admin browser preview.
7. Update this README to DEPLOYED with verifiable checks and exact rollback path only after a successful deployment.

## Logo provenance

- Juventus 2020 badge: https://commons.wikimedia.org/wiki/File:Juventus_FC_-_logo_black_(Italy,_2020).svg
- Parma 2016 badge: https://commons.wikimedia.org/wiki/File:Logo_Parma_Calcio_1913_(adozione_2016).svg

Both are team identity marks. Source pages describe them as geometric/text logos; trademark restrictions may still apply. They are used only for identifying clubs, not product endorsement. No logo assets have yet been cached in the production site for this v2 release.

## Tests

Only source-level review/role policy compatibility has been performed for these staged v2 files. **No successful production build, device-side compilation or browser animation test of v2 has been carried out as of this README.** The previously deployed v1 tests and build are not evidence of v2 test completion.
