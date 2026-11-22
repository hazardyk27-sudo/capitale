# CAPITALE Match List V2 — SXF CANONICAL NAME LOGO RESOLVER V2 — LIVE 22 November 2026

## Owner request
Existing logo sources may call PSG `PSG` or `Paris Saint-Germain`, but SXF identifies the football club as `Paris St-G`. All catalog keys should use the **exact SmartXFlow (SXF) team label**. Do initial manual reconciliation immediately, and update future auto-logo resolution to obey SXF naming, not provider naming.

## Authoritative inspection / manual reconciliation
- Read actual production SXF Supabase database `pswdvnmqjjnjodwzkmkp`, table `public.fixtures`, source fields `home_team` + `away_team`, NOT unrelated web or demo fixtures.
- Examined **7,132 fixtures** and **4,490 distinct canonical SXF team name strings** as of November 22, 2026.
- Compared **all 147 live logo catalog keys** in `/app/betcapitale/dist/public/team-logos/current-fixture-coverage-auto.json` by **exact raw string membership**, no fuzzy inference. Result **147/147 EXACT SXF NAMES**, **0 mismatches**. No destructive rename necessary. Example `Paris St-G` already exists; neither `PSG` nor `Paris Saint-Germain` exists as catalog key. Exact `Man Utd`, `Inter`, `FC Copenhagen`, `Union St Gilloise`, etc. likewise match SXF.
- Live coupon date-window today_matches: 54 unique team name values and 54/54 SXF membership before migration.
- SXF canonical name scan includes distinct `Paris St-G`, `Paris St-G (W)` and `Paris St-G U19`; separate womens/youth entities are **not merged** into PSG men.

## New SXF-native resolver
- New independent immutable code `/opt/capitale-crest-autofill-v2/crest-autofill-sxf.cjs`, SHA256 `7a7fe2dee1ad235f01cca9449111cf5afd51baeb08248b1a85a5e52423d5f733`. The legacy `/opt/capitale-crest-autofill-v1/crest-autofill.cjs` is preserved for rollback.
- Worker now refreshes a local SXF canonical vocabulary snapshot from `public.fixtures.home_team/away_team` using the already-configured, authorized read-only REST requests to the **same** Supabase project once every 24 hours (8 paginated calls for 7,132 entries). Snapshot `/var/lib/capitale-crest-autofill/sxf-canonical-team-names.json` contains 4,490 unique names and is reused on ordinary 3-minute runs. Source fetch failures halt unsafe additions instead of guessing a canonical name. No server-side database rows or schema are changed.
- Read-only local `today_matches` scan remains; only names present in the SXF dictionary by exact match or unique vetted normalization can generate a new catalog entry. If a local display alias exists, the **canonical key used for writing the registry is from SXF**, never an external provider title.
- Provider search aliases are explicitly curated, e.g. `Paris St-G` requests `Paris Saint Germain` on TheSportsDB, `Man Utd` -> `Manchester United`, `Inter` -> `Inter Milan`, `Union St Gilloise` -> `Union Saint-Gilloise`. Provider results remain limited to one unique Soccer team with exact normalized name and allowlisted PNG URL. Do not use fuzzy substring guesses; uncertain matches remain initials.
- User example: both input strings `PSG` and `Paris Saint-Germain` normalize to SXF `Paris St-G`. Women's/U21 names do not inherit the men's logo. The provider may call the club `Paris Saint-Germain`, but live catalog stores **`Paris St-G`** key and a content-hashed PNG filename.
- Persistent automatic catalog updated **in-place only with metadata**: `version=crest-auto-sxf-v2`, `canonical_source=SXF public.fixtures.home_team / away_team`. Existing 147 logo URLs/assets stay unchanged. No frontend deployment required because V15 already reads live `current-fixture-coverage-auto.json` every 90 seconds.
- Systemd `capitale-crest-autofill.service` changed only its `ExecStart` path from v1 to v2. Timer remains `OnCalendar=*:0/3` **enabled + active**, original sandbox/DB privileges, UI, Software V17 importmap aliases, V33 homepage and backend preserved.

## Verification and negative cases
- V2 `node --check` PASS and 8/8 self-tests PASS: normalized aliases, youth separation, URL allowlist, Soccer, ambiguous/rejected candidate, canonical Paris, non-equivalent U21.
- First V2 SXF source scan **7,132 fixtures, 4,490 SXF names**; V2 dry-run **54/54 upcoming canonical names** with 0 missing, 0 ambiguous and 0 previously noncanonical catalog keys.
- Real provider end-to-end **isolated test**: built a temporary 137-logo baseline deliberately omitting `Paris St-G`; injected noncanonical fixture labels `PSG` and `Paris Saint-Germain` without touching production DB. V2 resolved both into the one SXF canonical `Paris St-G` and downloaded genuine provider `Paris Saint-Germain` club badge as `auto-paris-st-g-2666e55329fe.png` (119,328 bytes). Second run retrieved this exact logo from cache with **attempted 0 / added 0**. No catalog keys named PSG or Paris Saint-Germain were created.
- Production service manually started under systemd with original read-only DB / provider permissions and exited **0 / success**. Live logs `RUN_OK` with `sxfTeams=4490`, `fixtureTeams=54`, `available=54`, `notInSxf=0`, `existingNoncanonical=0`, `attempted=0`, `added=0`, `logoCount=147`. Timer still active and enabled. Live registry verified 147/147 strict SXF keys, source metadata, no duplicates.
- No production `today_matches`, SXF fixture data, real Software metrics, odds, signal engines, final reports, website HTML or server JS modified.

## Deployment & rollback
- Previous unit, timer, and old live registry backed up at `/opt/capitale-crest-autofill-v2/rollback-pre-sxf-canonical-20261122/`.
- Worker from v2 deployed by changing only ExecStart on `/etc/systemd/system/capitale-crest-autofill.service`; timer briefly paused to avoid race, then resumed after successful one-off service execution. No frontend rebuild, no backend restart, no site downtime.
- Rollback if necessary: stop timer, restore backed-up V1 service unit and prior auto registry, `systemctl daemon-reload`, restart timer. Canonical snapshot can remain as unused read-only state.
- Automated registry was refreshed with provenance metadata (147 unchanged SXF-name keys); parser and frontend shape are backward compatible (`logos` object preserved).

## GitHub artifacts
- `deployments/betcapitale/crest-autofill-sxf-v2.cjs` executable source (no secret keys)
- `deployments/betcapitale/crest-autofill-v1-to-sxf-v2-20261122.patch`
- `deployments/betcapitale/crest-autofill-service-v1-to-sxf-v2-20261122.patch`
- `deployments/betcapitale/crest-autofill-sxf-name-alignment-live-20261122.md` (this report)
- `tasarımcı-sohbet.md` permanent designer journal.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]