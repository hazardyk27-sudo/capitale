# CAPITALE Software V22 + Match List v2 V16 — shared offline SXF crest library · LIVE 2026-11-22

## Owner request
Owner asked to check whether new preloaded SXF crests automatically appear on **Match List v2**, and additionally to **add team logos to the matches displayed in Software**. Both screens must use the same locally stored team crest catalog; never fetch individual team images from ESPN at runtime. Do not alter fixture names, times, signals, Software scoring, the white 3D V16 poster, backend, or existing Software V21 layout.

## Verification before the fix
- **Match List v2 V16** already reads `/team-logos/current-fixture-coverage-auto.json` in `client/src/pages/admin-social-media.tsx`. `logoIndexFromManifest` produces a normalized SXF-name index; `deriveMatchList2` sets `homeLogoUrl` and `awayLogoUrl` **even if no Software match is verified or connected**, and demo metrics retain real logos. Browser QA confirmed this behavior.
- The active production **Software V21** `admin-software-v21-mobile-matchlist-20261122.js` did **not** fetch this shared catalog. Its common `capitaleCrest(name)` helper used an old hardcoded `CAPITALE_TEAM_LOGOS` map, then a hardcoded `CAPITALE_ESPN_AUTO` CDN fallback. Therefore some selected 34-league new clubs would not use the 629-entry catalog and some images could be fetched externally.

## Surgical production fix
- Started with exact immutable Software V21 source SHA `abd5f32c5a8f7b607c4c997251e96577dfa1016fbf0e030c08b16c89fd42eee5`, generated a new immutable **V22** asset using only a replacement for **one** `capitaleCrest` helper; all six call sites, software data model, DOM/card layout/CSS, API routes, signal engine, and event handlers remain unchanged.
- New helper is a proper encapsulated React component `CapitaleSxfCrestImage`: uses a shared single-promise `fetch('/team-logos/current-fixture-coverage-auto.json', {cache:'no-store',credentials:'same-origin'})`, validates schema + local `/team-logos/*.png` URLs, builds exactly normalized SXF-name lookup with duplicate-key conflict suppression, then sets React state to refresh team icons after async catalog load. Subsequent rows/cards reuse cached map; **one local JSON request**, no outside requests.
- Precedence: shared catalog, then the already-established **local-only legacy team slug** for clubs outside 34 leagues, then the local `/team-logos/crest-unavailable.svg` placeholder. The previous runtime ESPN fallback in `capitaleCrest` was removed; the old ESPN mapping literal may still be present as unreachable inert text in the minified bundle but it is **never read by the new helper**.
- Existing component layout (24×24 images, CSS classes, lazy loading), report/run cards, fixture names/dates, Software V21 mobile list design and results logic preserved.
- Live only changed three Software importmap aliases from V21 to `/assets/admin-software-v22-shared-sxf-crest-library-20261122.js`. Social media Match List V16 alias was **not** modified. Backend SHA remained `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.

## Tests
- Reproducible node `--check` passes on V22 module; exact V21→V22 build reproduces V22 SHA `b0cccb6e7ac5f171f74b1eed66567d291ce6226ec77aec2c3cf0f5d0b82f3734`.
- The actual replacement component exercised in an isolated Node VM with React JSX/state/effect stubs and real live catalog fixture roster: **575/575** SXF team names across **34 selected leagues**, matching every team to the exact `manifest.logos[sxfName]` local URI. For `Paris St-G` expected `/team-logos/paris-st-g.png`; `Man Utd`, `Jong PSV Eindhoven`, `Anderlecht B`, `Racing Genk B`, `PAOK B`, `Van Buyuksehir Belediyespor` matched correct local PNGs. Single fetch to local JSON and **zero** external network calls; unknown team shows local placeholder.
- Stage browser imported the whole V22 ESM JavaScript chunk with no local HTTP failures or JavaScript errors; loaded full 629-item catalog and Paris St-G logo at actual width 500px. Production browser on real `https://betcapitale.com/admin/software` loaded V22 module, the same 629-item JSON and live Paris PNG successfully.
- Public production smoke `/`, `/admin`, `/admin/software`, `/admin/social-media`, `/today`, `/plans` **6/6 PASS**, correct Software V22/social V16 importmap aliases, no JS page errors or horizontal overflow. Re-ran browser-only mock API Match List V16 **5/5 PASS** (9 story, 9 post, 15 post, real-source fallbacks, auto logos), 18/18 or 30/30 crests loaded.
- **Limit:** Logged-in administrator's actual Software content view and PNG download were not directly exercised; validation included real production ESM import, real catalog/PNG HTTP and component renderer test against all 575 SXF names. Clubs **outside** the 629-entry local catalog may still show a local legacy badge or neutral placeholder; there is no on-the-fly external logo search.

## Rollback / safe scope
- Previous production `index.html` containing Software V21 + Match List V16 backed up at `/app/betcapitale/rollback-software-v22-sxf-shared-logos-20261122/index.html`.
- Previous live index SHA `6c7316b2e8cea0ad8a94cf6fca15122493d21ada1cb1bdafd4f5ae71cdf031e8` -> V22 live index SHA `9f4163b1b4a23045b0137462237301188310bfdfaf972d4d2bc5052f05e1dccb`.
- Revert only the three Software aliases to V21 by atomically restoring backup HTML **if no other agent has changed the importmap in the meantime**; the immutable V22 module and 629 PNGs may remain unused. Backend/DB/auth/other assets unchanged.

## GitHub artifacts
- `deployments/betcapitale/software-v22-shared-sxf-crest-component.js`
- `deployments/betcapitale/software-v21-to-v22-crest-builder-20261122.py`
- `deployments/betcapitale/software-v22-shared-sxf-crest-test.cjs`
- `deployments/betcapitale/software-v22-production-importmap-20261122.patch`
- `deployments/betcapitale/software-v22-sxf-local-crests-live-20261122.md`
- `tasarımcı-sohbet.md` updated status.