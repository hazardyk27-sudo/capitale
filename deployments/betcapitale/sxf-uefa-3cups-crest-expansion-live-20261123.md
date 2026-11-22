# CAPITALE — UEFA Champions, Europa, Conference league local crest expansion

**Deployment:** LIVE, 2026-11-23 (Europe/Istanbul)  
**Target:** Only the existing same-origin team crest library at `/app/betcapitale/dist/public/team-logos`  
**Repository:** `hazardyk27-sudo/capitale`

## Owner request

Complete the existing crest list for the UEFA Champions League, UEFA Europa League and UEFA Conference League without re-downloading or replacing logos of clubs already in the local library. Use the same SXF-exact-name, offline-local, immutable PNG, source-verified workflow as the existing 34-league library. Do not change unrelated app areas.

## Source truth and coverage

Read live SXF `public.fixtures` for the three **exact** UEFA league labels, 2026-07-01 to 2027-06-30; no AFC, women's, youth or other competitions were included:

| SXF league | distinct team strings | not in previous manifest |
|---|---:|---:|
| UEFA Champions League | 37 | 5 |
| UEFA Europa League | 36 | 9 |
| UEFA Conference League | 36 | 15 |
| Combined | 109 | 29 |

The existing live manifest held **629 logo mappings** (575 team names of 34 league roster, 629 incl. other preexisting clubs). Of the 109 UEFA club strings, **80** were already mapped; **29** exact SXF strings were missing. `Lask Linz` was only an existing-name capitalization variant of `LASK Linz` and now points to the SAME preexisting local image; **no duplicate PNG** was downloaded for it.

The other **28** source-specific crest mappings were derived from ESPN's live 2026 UEFA three-competition team directory endpoints: `uefa.champions`, `uefa.europa`, `uefa.europa.conf`. Club/provider names were matched using exact names or specific verified translations, not arbitrary fuzzy match:

**Champions League (4 new PNGs):** FC Sabah → Sabah FK; Shakhtar → Shakhtar Donetsk; Slavia Prague; Slovan Bratislava. Lask Linz → existing LASK Linz image (alias only).

**Europa League (9 new PNGs):** Ararat Armenia → Ararat-Armenia; Dinamo Zagreb; Ferencvaros; Hapoel Be'er Sheva → Hapoel Be'er; NK Celje; Omonia → Omonia Nicosia; PFC Levski Sofia → Levski Sofia; Plzen → Viktoria Plzen; Sparta Prague.

**Conference League (15 new PNGs):** Borac Banja Luka; CSKA Sofia; Crvena Zvezda → Red Star Belgrade; Egnatia Rrogozhine → Egnatia; FC Iberia 1999 → Iberia 1999; FK Jablonec → Jablonec; FK Kauno Zalgiris → Kauno Zalgiris; FK Riga → Riga FC; Hajduk Split; Inter Club Escaldes → Inter D'Escaldes; Kairat Almaty; KuPS → KuPS Kuopio; Lincoln Red Imps; Pafos FC → Pafos; Universitatea Craiova → CSU Craiova.

## Live implementation

- **28 new immutable PNGs** downloaded from verified ESPN soccer team logo URLs; each PNG individually passed magic signature, exact team ID source URL, image dimensions (**500×500**), SHA256 and local file-size validation. Total new PNG bytes **2,352,636**, 28 distinct SHA256 hashes. Names follow `sxf-espn-<providerId>-<sha14>.png`; all existing 629 entries and file bytes preserved unchanged.
- Live manifest `/app/betcapitale/dist/public/team-logos/current-fixture-coverage-auto.json` updated **atomically**, only appending the 29 missing exact SXF name mappings and three league labels. The existing schema and `logos` contract are unchanged. The manifest now has **658** entries and **37** league labels; all original 575 domestic league names remain covered.
- Original manifest SHA256 `35919d2a7ba35069e875bebfc4a91330fbcd51f175570057d92fbd8efdcffec9`; updated manifest SHA256 `479da929a8ee782f9fda88be31a1589b715b492efc425f8bb31de4141df114af`.
- No software code, frontend `index.html`, backend, authenticated API, SXF signal, source DB table, report, Match List design or cron job was changed. The old external 3-minute logo-fetch timer remains **disabled/inactive**. Team images are served from the existing local `/team-logos` directory.
- Rollback: previous manifest saved at `/app/betcapitale/rollback-sxf-uefa-3cups-logo-library-20261123/current-fixture-coverage-auto.json`. Restoring only this manifest reverses the new name mappings; new immutable PNGs may safely remain unused.

## Tests after production publish

- Live HTTPS catalog endpoint HTTP **200**, JSON schema and full **658** logo mappings verified.
- Every one of the **28 new PNG URLs** returned **HTTP 200**, `image/png`, and the verified nontrivial content size: **28/28 PASS**.
- The **109/109** unique SXF UEFA club names (37/37 Champions, 36/36 Europa, 36/36 Conference) have exact manifest mappings with readable local PNG targets: **PASS**.
- Local alias test: `Lask Linz` and `LASK Linz` resolve to identical file URL: **PASS**.
- Normalize-key collision check **0** conflicting local URL keys; **629/629** former name→URL mappings unchanged.
- `/, /software/, /today, /admin/software, /admin/social-media` all HTTP **200**.
- Production `index.html` SHA256 **unchanged** `71d06f3766745b954b6f5b952aca55e7227b7f90fea154607e810ec7b0c2a5d1`; backend SHA256 **unchanged** `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- No authenticated browser UI screenshot/actual poster test in this session; HTTP, manifest, source and PNG tests are verified.

## Reproducibility / evidence

- Source roster/read-only audit: `/opt/capitale-crest-library-v1-20261122/uefa-3cup-roster-audit-20261123.json`
- New staging + immutable PNG files: `/opt/capitale-uefa-crest-library-20261123/`, `build-uefa-crests.py`.
- Full 109-row league/team/local-URL catalog in GitHub: `deployments/betcapitale/sxf-uefa-3cups-logo-catalog-20261123.csv` commit `9bc3e0c559535e733c08d34ee291b7652e41e0ea`.
- New PNG SHA256s, ESPN team IDs, source URLs and manual name associations in GitHub: `deployments/betcapitale/sxf-uefa-3cups-logo-provenance-20261123.json` commit `bf53e532ab877994c785cfe3dfcff5994e2d1133`.

**Do not claim all historical/other future UEFA season participants were surveyed.** This is complete for all 109 unique exact SXF club strings present in the specified competition fixtures and season window during the inspection.
