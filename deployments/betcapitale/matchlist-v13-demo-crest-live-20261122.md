# CAPITALE Match List v2 V13 — Admin-only demo values + 18 crests · LIVE 22 Nov 2026

## User instruction
The user supplied the real 9-fixture November 22 Match List v2 story screenshot and required **fill all blank signal/A/V/N/B/O cells with random-looking sample values without changing fixtures or their kickoff times, and add real club logos**. The previous V12 pure-white embossed design, 24/20px gutters, v1 actual result statuses and export shapes were explicitly preserved.

## Safe implementation
- Isolated source `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-sample-logos-v13-20261122-work`, based on immutable V12. Only `client/src/pages/admin-social-media.tsx` and `client/src/components/match-list-template-2.tsx` modified; added independent V3 crest JSON catalog & 12 new verified original badge PNGs.
- The Match List v2 admin tab opens with a **demo overlay ON** to meet the user's sample-data request. It uses a deterministic FNV-like 32-bit fixture/date-seeded function to generate 7 valid, already-supported style codes (PRM-6, MOM-8, STR-6, SLD-8, CRL-6, CNI-6, PRM-8), A 61–92%, V 67.0–97.5%, N 55–88%, B 3.0–21.5%, O signed +/-0.2–6.9% across all fixtures. All five cells and signal are populated **without writing to the Software endpoint, database, match records, or real source merges**. The same fixture's sample stays stable across renders/downloads. No sample outcome/WON/LOST added.
- A visible **`SAMPLE DATA · DEMO`** label is embedded in the generated poster header, not only the admin controls. An admin checkbox **`Fill with demo values (not verified SXF data)`** toggles instantly back to the exact real Software data. In actual mode unsupported/missing metrics still show dashes. Source summary explicitly distinguishes sample data from verified values.
- Team names, match date and kickoff are read unchanged from `/api/admin/today/matches`. Existing `match.result` continues to drive WON/LOST/VOID/PENDING only in results mode. Images are 18 actual club crests for the nine fixtures, independent of Software signal availability.
- `/team-logos/current-fixture-coverage-v3.json` is a new allowlisted immutable manifest of 138 clubs, preserving all original V2 120 entries, adding 12 newly downloaded named crest PNGs and 6 already-existing local PNG files. V2 manifest and all old club images are untouched. The page reads V3 manifest, displays actual logo, falls back to team initials if any failure.
- The original Software v17 (170 club logos) belonging to a **different agent** was already live when this work began. All three V17 Software importmap mappings were **preserved untouched**. The homepage V33 and backend remain unchanged. Never confuse this isolated V2 logo catalog with the Software v17 catalog.

## 12 new crest file provenance
- `kortrijk-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/ssvvtu1447618084.png`; sha256 `8ccb99fa9ca4b77efe9edb93f50967b0e24819169b7eddeaa443656f56e07ed1`
- `union-st-gilloise-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/ljszp41654601742.png`; sha256 `ccad72ee537aa4a105fa22fd78a68eddb24546c4c927db3580c27d81e61a85d3`
- `liverpool-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png`; sha256 `748a6dc145515f1a307d881974b1c9dd0cb4f3ae9973e829c1b4cf3f9d4b5f32`
- `man-utd-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/xzqdr11517660252.png`; sha256 `c4413b7cfab5c93375ab834d4b58eabedcd5595171428ef34d288505d92825af`
- `fc-nordsjaelland-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/p2hof41579460164.png`; sha256 `54423bc1abbba9b18bb2acae2f6edad201806f8a60dd31dcec5bc475e31fe727`
- `fc-copenhagen-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/styqtr1473535513.png`; sha256 `027b829948c6e1cd1855beb932cbd17e2683069560780f7cf05ad69f2274452d`
- `ac-milan-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/wvspur1448806617.png`; sha256 `d1ba122f002e3789b7a57d5d5a059bb6bfc680dc7d97dcfd5cec32ef9e44fefb`
- `frosinone-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/a7xa151603170120.png`; sha256 `0afec1091218c1a272e4740da3981c03ee6ab723a59ce4b4b3268ec336f414a5`
- `atalanta-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/qix5ku1780561327.png`; sha256 `e3b85f5118b488544b158eee4f37bc3ff7378eb9fa5a20b5de8681e3c22873eb`
- `inter-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/ryhu6d1617113103.png`; sha256 `12c10b7deda2f4da4910daa039394754b1d298725db3d1a4d35e0a3f472e9d69`
- `getafe-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/eyh2891655594452.png`; sha256 `94459492fd664c89ac604c65c977eec6c3ef5b9806d5c0c6dc99b8fdd78cc071`
- `atletico-madrid-v13.png` <- `https://r2.thesportsdb.com/images/media/team/badge/0ulh3q1719984315.png`; sha256 `12076f8d1df65e5c38d5f76f35af8c537c019be30a7ab829cbb0e8d8439fe9de`

Six local previously available logos, reused (unchanged): `paok.png`, `kifisia.png`, `celta-vigo-b.png`, `valladolid.png`, `lommel.png`, `standard.png`. Original catalog remains active for other consumers. No remote image dependency during export (all 18 are same-origin hosted).

## QA
- TypeScript noEmit PASS, Vite build PASS, original 13 deterministic matching/guard tests PASS.
- Full native-sized Puppeteer staged tests **4/4 PASS**: story 9, post 9, post 15 and real-source fallback 9. Exact 9 fixture names and kickoff hours retained, 18/18 club crests loaded for 9 fixture posters, 30/30 for 15, every demo signal and A/V/N/B/O cell filled, every actual-source cell blank when no verified API rows, SAMPLE DATA header disappears when demo disabled, no JS errors or footer overlap, story 24px / post 20px gutters.
- Same four tests against **live HTTPS site** with fixtures/Software API intercepted **only inside an isolated test browser**: 4/4 PASS; no production records modified. Native screenshots `/tmp/capitale-v13-live-story9.png` and `/tmp/capitale-v13-live-post9.png` (saved on smartxflow). Actual authenticated admin download click not exercised; full native-element screenshots verified.

## Deploy and rollback
- Immutable social asset `/app/betcapitale/dist/public/assets/admin-social-media-v13-sample-logos-20261122.js` SHA `3bb5b45251a7bf94172af37c432f4e1375e1a0d9364ca4908ace6e704ac7d8f9` plus 12 immutable image PNGs and V3 manifest added. Production `index.html` **only** changed single `/assets/admin-social-media-BufGLmZ1.js` alias V12→V13; other 3 Software v17 mappings were preserved.
- Previous production HTML `0f18d7ce2ff0c722982127a016c2db4f577517f69f81de6b02551bbd0d55699e`; now `149901b96c6bc29d4455c8f3aae7ea7149527c110e5dae3656af53ad391bc67f`. Backend stays `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- Rollback prior exact production HTML `/app/betcapitale/rollback-matchlist-v2-sample-logos-v13-20261122/index.html` to revert social app to V12; all new V13 static assets may remain unused.

## GitHub provenance
- `deployments/betcapitale/matchlist-v12-to-v13-sample-logos-20261122.patch`
- `deployments/betcapitale/matchlist-v13-production-importmap-20261122.patch`
- `deployments/betcapitale/matchlist-v13-fixture-crest-manifest-20261122.json` (original V3 manifest)
- `deployments/betcapitale/matchlist-v13-demo-crest-live-20261122.md` (this report)
- `tasarımcı-sohbet.md` permanent design journal updated.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]