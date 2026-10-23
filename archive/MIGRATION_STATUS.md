# SXF migration status — 2026-10-21 (GitHub-only destination)

## 2026-10-23 — concentrated 16–18 October source-to-GitHub transfer COMPLETE

This addendum supersedes the older concentrated pending-state claims for **16, 17 and 18 October** below. Full raw history migration remains outstanding; no source Supabase rows were changed.

- **2026-10-16**: 201 fixture memberships × 3 markets × 9 time checkpoints = **5,427 unique slots**. **3,975 PRESENT**, **1,452 MISSING**, six canonical source-export JSONL files, GitHub blob readback and content equality confirmed. `archive/2026/10/16/04_concentrated/manifest.json` and daily root manifest updated/verified; source `archive_runs.status=COMPLETE`.
- **2026-10-17**: 436 × 3 × 9 = **11,772 unique slots**. **9,504 PRESENT**, **2,268 MISSING**, eleven canonical source-export JSONL files, GitHub blob readback and content equality confirmed. `archive/2026/10/17/04_concentrated/manifest.json` and daily root manifest updated/verified; source `COMPLETE`.
- **2026-10-18**: 400 × 3 × 9 = **10,800 unique slots**. **8,666 PRESENT**, **2,134 MISSING**, ten canonical source-export JSONL files, GitHub blob readback and content equality confirmed. `archive/2026/10/18/04_concentrated/manifest.json` and daily root manifest updated/verified; source **PARTIAL is unchanged**.
- **Batch total:** 1,037 fixture memberships, **27,999** canonical checkpoint slots; **22,145 PRESENT** and **5,854 MISSING**, **27 GitHub JSONL files**. All source payloads carry their PostgreSQL-computed source-row SHA-256; SQL-produced JSONL SHA-256 and GitHub blob SHA checks are listed in daily manifests. No T checkpoint uses a later snapshot.
- **Concentrated GRID status across 2026-10-09 through 2026-10-22**: **11 of 14** available day folders complete (09–18 and 22 October). **19–21 October** are next; source archive-run statuses for 20–21 remain PARTIAL.
- **Full raw status**: **0 of 14 days** independently certified as complete in GitHub. The concentrated grid is not a replacement for eight full history/snapshot tables. 2026-10-09 small 1X2 repo shards remain 1,050/148,444; do not mark any full raw date `migration_complete:true`.
- Supabase `research_archive` accessed through **SELECT-only** SQL, GitHub permanent files only. No new hosting provider, no Supabase schema/data modifications, no missing-data interpolation.

Next concentrated batch under agreed **three-day** cadence: 2026-10-19, 2026-10-20 and 2026-10-21. After concentrated backlog, full raw migration proceeds in **two-day** batches, subject to private read-only source transfer path / bulk GitHub Release asset verification.

---

## Current verified continuation — 2026-10-21

This section supersedes the older checkpoint and missing-alarm statements below, which are retained as the original migration snapshot.

- 2026-10-09: **04_concentrated nine-checkpoint GRID COMPLETE** for all 260 fixture IDs and all three markets (1X2/OU2.5/BTTS): 7,020 checkpoint slots, of which 5,354 have source snapshots and 1,666 explicitly report MISSING. All 20 canonical JSONL files were read back from GitHub and validated; SHA-256 hashes, counts and canonical paths are in `archive/2026/10/09/04_concentrated/manifest.json`. One redundant overlapping 1X2 file is retained but excluded from canonical counts. **This is not complete raw history migration.**
- 2026-10-10: **04_concentrated PARTIAL**: first 110 of 455 fixtures have 1X2 checkpoint rows (990/990 slots), verified in four files. Remaining fixtures and OU2.5/BTTS are pending. See daily manifest.
- 2026-10-19 and 2026-10-20: missing alarm JSONL files added and exact readbacks verified (132 and 166 alarm rows, respectively). Both daily manifests updated. Alarm file **presence** is now 13/13 days, not blanket source-equivalence certification.
- 2026-10-16 through 2026-10-21: all twelve fixture/result JSONL files were checked against read-only source records, comparing normalized full JSON fields and record multiplicity; counts match.
- All daily historical full-market raw histories (including 2026-10-09's 387,781 records in three base history tables) **remain NOT TRANSFERRED**. GitHub Releases remained empty at the last check. Existing Supabase research_archive SQL SELECT works; the remote PostgREST call using schema research_archive returned `PGRST106` because the schema is not exposed. Do not change Supabase schema/exposure just for the migration.
- Source status PARTIAL on 2026-10-18, 2026-10-20 and 2026-10-21 is preserved. No Supabase writes or deletions occurred. No engine rules changed.

---

## Scope and immutable-source policy

- Source: Supabase `pswdvnmqjjnjodwzkmkp`, schema `research_archive`, strictly read-only.
- Secondary source: `hazardyk27-sudo/smartxflow`, branch `learning-archive`, directory `learning_archive_data/signal_engine_samples`.
- Destination: `hazardyk27-sudo/capitale`. No Supabase archive writes and no additional storage provider.
- Period: **2026-10-09 to 2026-10-21** inclusive (13 fixture-kickoff local dates, Europe/Istanbul).
- Source `archive_runs` records **3,220 fixture memberships** across these dates; days 2026-10-18, 2026-10-20 and 2026-10-21 are marked `PARTIAL` in the source. Do not interpret source `COMPLETE` as proof that its copy has been transferred.
- Historical research sample files and original pre-match runs are different from full raw market history.

## Successfully verified transfers

1. **72 of 72 original SmartXFlow GitHub research files copied**, source/target Git blob SHA and byte size equal for all; ~2.8 MB. They are in `archive/legacy_research/smartxflow_learning_archive/`.
2. **13 daily source inventories** are in `archive/2026/10/DD/manifest.json`, with exact source `archive_runs` metadata, source counts and partial/complete status.
3. **Fixture and result JSONL files are present for all 13 dates** under `archive/2026/10/DD/03_full_snapshots/`. These are only the fixture/result subset of the full archive.
4. Alarm JSONL files exist for some, not all, days. Consult each dated manifest and directory.

## NOT complete — high-priority blockers

- **NO full raw history migration yet**: `moneyway_1x2_history`, `moneyway_ou25_history`, `moneyway_btts_history`, `dropping_1x2_history`, `dropping_ou25_history`, `dropping_btts_history`, `moneyway_snapshots`, `live_snapshots`. These should be compressed and partitioned by date/table into GitHub Releases assets, with exact asset SHA-256 and source/export row counts. **No GitHub Release exists yet.**
- **NO complete 9-checkpoint dataset for all fixtures**: T-72, T-60, T-40, T-24, T-12, T-8, T-6, T-3, T-1. Existing old CSVs are selected research sample rows, not complete full-fixture checkpoint coverage.
- **NO recreated immutable pre-match daily scan or engine settlement files** have been certified in `01_scan_results` / `02_outcome_performance`. Reconstructed analyses must never masquerade as originally frozen decisions.
- Full historical transfer cannot be certified by the presence of fixture/result CSVs or legacy sample files alone.
- A read-only bulk export draft exists at `scripts/export_sxf_research_archive.py`. GitHub Actions workflow, secure repository DB connection secret, actual Releases upload and readback verification are **not deployed**. Do not claim the draft script is running.

## Source-recorded row counts (sum of date rows; NOT guaranteed globally unique)

| Source metric | Archive-run count sum |
|---|---:|
| 1X2 money history | 2,352,286 |
| OU 2.5 money history | 2,092,123 |
| BTTS money history | 1,492,468 |
| Dropping 1X2 | 2,638,782 |
| Dropping OU 2.5 | 2,351,451 |
| Dropping BTTS | 1,661,211 |
| Moneyway snapshots | 5,574,508 |
| Live snapshots | 8,712,957 |

These come from existing `archive_runs` records. Archive identities may overlap across kickoff dates due to historical aliases: **do not add them as unique physical rows**. They are source inventory expectations to cross-check against export manifests, not yet exported-to-GitHub counts.

## Operational safety

- The `capitale` repository and releases are PUBLIC. Check data redistribution permission and do not publish credentials, configuration secrets, collector cursors or private operational data.
- Supabase reported disabled RLS on all 24 `research_archive` tables, a critical security advisory. Owner should review access/policies separately; never switch RLS on blindly without safe policies, as that can break collection.
- Do not delete or disable the source archive until the historical full-copy export passes per-table/per-day row counts, checksum verification and a successful restore test.
- Keep data pipeline costs in view: reading the complete archive and uploading assets can consume source egress and compute even if standard public GitHub Actions have no runner-minute fee.

**Migration state: PARTIAL — manifests + published research copies + fixture/results subsets verified, bulk source history and concentrated all-fixture archive pending.**

---

## 2026-10-21 — Verified continuation after handoff

This entry supersedes only the earlier **pending-state descriptions** of the specific files listed here. It does **not** certify the full SXF raw-data migration.

### Additional GitHub transfers and integrity audits

- Legacy SmartXFlow learning archive: source/target 72 of 72 blob SHAs and byte sizes rechecked equal; no redundant copy.
- All 13 daily `fixtures_YYYY-MM-DD.jsonl` and `results_YYYY-MM-DD.jsonl` remain present. For **16–21 October**, source and GitHub content was independently compared field by field as JSON multisets (12 of 12 files equal): 16 Oct 201/195, 17 Oct 436/444, 18 Oct 400/398, 19 Oct 173/173, 20 Oct 139/135, 21 Oct 141/58 (fixtures/results).
- Both previously absent alarm bundles have now been created and source/readback-verified: **19 October 132 rows**, `archive/2026/10/19/03_full_snapshots/alarms_2026-10-19.jsonl`; **20 October 166 rows**, `archive/2026/10/20/03_full_snapshots/alarms_2026-10-20.jsonl`. Their date manifests were updated while preserving `migration_complete:false` and the source 20 October `PARTIAL` status. Alarm bundles now exist on all 13 dates; other dates' alarm contents still require comprehensive source-identity re-audit.
- **9 October 04_concentrated nine-checkpoint GRID VERIFIED:** all **260 fixtures × 3 markets × 9 checkpoints = 7,020 unique slots**, of which **5,354 PRESENT and 1,666 MISSING**. 1X2: 1,847/493; OU2.5: 1,826/514; BTTS: 1,681/659 (PRESENT/MISSING). All canonical source payload hashes, actual-at-or-before-target constraints, required T hours, and per-fixture slot coverage passed independent readback audit. The complete per-file SHA-256/row manifest is `archive/2026/10/09/04_concentrated/manifest.json`. Preserve actual missing observations; never interpolate from the future. Overlapping additional 1X2 part files are excluded from the canonical slot count, with no deletion.
- The **9 October three full raw market histories** still contain **387,781 source rows** (1X2 148,444; OU25 136,026; BTTS 103,311) and are **not yet exported as GitHub Release assets**. The 7,020 checkpoint slots are only a concentrated subset, not a substitute for the full raw archive.

### Blocking requirements for full raw-history migration

- Direct read-only Supabase SQL connector works. A remote GET against the `research_archive` REST schema returned **PGRST106 (HTTP 406: schema not exposed)**. This was observed without making any Supabase schema/config changes.
- The existing draft `scripts/export_sxf_research_archive.py` requires a suitable read-only PostgreSQL DSN and psycopg on the execution host; those were **not proven operational**. Available GitHub connector tools can read releases but no authorized GitHub Release asset upload operation has been proven; release inventory was **0** at the last check.
- No Supabase writes, schema/RLS modification, raw-data deletion, engine threshold change, or alternate storage service was performed. Supabase continues to flag RLS disabled on 24 `research_archive` tables; access exposure must be reviewed separately.
- **18, 20 and 21 October remain source `PARTIAL`; full GitHub migration remains `PARTIAL` for all days.** 01 original scan and 02 settled-performance products have not been certified.

**Verified next checkpoint:** Obtain a secure and usable **read-only** PostgreSQL extraction path and **GitHub Release upload+download integrity** path; pilot 9 October's full three histories with source-count, SHA-256 and restore validation, then scale to remaining dates/tables. Do not mark `migration_complete:true` until those checks pass.


### Final verification addendum — 39/39 small raw JSONL exports

The date-by-date read-only source-to-GitHub comparison has now been performed for **all 13 dates** and for **all three small raw categories**: `fixtures`, `results`, and the eight-alarm-table `alarms` bundle. **39/39 existing GitHub JSONL files have source-equivalent JSON objects**, including field values and duplicate-row multiplicities; no files were unnecessarily recreated.

- Source fixture memberships: **3,220** rows across 13 local dates.
- Source result rows: **3,089** across 13 local dates (versioning and partial live results preserved).
- Source alarm rows: **2,670** across 13 local dates; the 19/20 October missing bundles were restored during this run.
- The 18, 20 and 21 October **source `PARTIAL` statuses are unchanged**. Equal transfer of currently available source rows is not a guarantee of historically complete source collection.
- This is a certification **only of those 39 small-category exports**. Full 1X2/OU2.5/BTTS histories and supplemental Dropping/moneyway/live histories still await GitHub Release upload and verification.
## 2026-10-22 — Raw 1X2 micro-batch continuation (read-only)

- Read-only Supabase SELECT reconfirmed **2026-10-09 moneyway_1x2_history = 148,444 rows**, **148,444 unique source fingerprints** and zero missing fingerprints. No source writes were made.
- Added `archive/2026/10/09/03_full_snapshots/part1b_1x2_raw_fingerprints_1026_1050.jsonl` with the next **25** strictly ascending fingerprint rows; exact source JSONL equals GitHub `fetch_file` readback, all **21** original fields preserved, Git blob `da519e698c009f5e8bec2fbae3593fa7f95a1544`.
- New batch SHA-256 of original UTF-8 JSONL (source read-only SQL digest): `c4d019890fa199f35ece999c4dd7ddd768ddb9962da3b65d1403170b50ac5f38`; **12,555 bytes**, 25 rows; last fingerprint `01c10075633a7136247e934c5f4a16f7`.
- Daily full-snapshot manifest was updated and read back; checkpoint **1,050/148,444** repo small-shard rows verified, **147,394** still pending. Manifest update commit: `a7d11427f729c27c6297f3cca1ada74bd0f813a9`. No GitHub Release upload was performed; `full_raw_history_status=NOT_UPLOADED`, `release_assets=[]`, source archive untouched.
- GitHub connector currently exposes no workflow dispatch or Release asset upload action; `SXF_ARCHIVE_DATABASE_URL` Actions secret remains unverified. Remote Desktop `smartxflow` most recently OFFLINE. Manual `pilot` Action and full gzip export remain blocked; avoid treating offline unit tests as real migration.
- 24 source tables still report disabled RLS. Do not change RLS or expose the `research_archive` schema during SXF migration; separate security review required.
## 2026-10-22 — Action-triggered 1X2 pilot attempt / BLOCKED_SECRET

- Replaced the impractical 25-row commit progression as the primary plan with a commit-triggered **pilot-only** GitHub Actions workflow (workflow commit `ab412f9d7b6e75718ddbd260364fac11aff9219d`). Manual workflow dispatch remains the only route to full 148,444-row mode; push is always pilot.
- Pilot request file `archive/transfer_requests/sxf-1x2-2026-10-09-pilot.request` committed `8ab943401fd5b43ebff05b8f5a8ea0f2756b19d7` and readback-verified.
- Actual GitHub Actions pilot run [`39694184884`](https://github.com/hazardyk27-sudo/capitale/actions/runs/39694184884) began and **FAILED** at step `Validate private read-only database connection configuration` with log `Missing SXF_ARCHIVE_DATABASE_URL GitHub Actions secret.` Later export / Release upload / download steps SKIPPED. **0 new raw rows** transferred; 0 GitHub Releases.
- Source archive last verified repo raw 1X2 remains **1,050/148,444**, full raw history `NOT_UPLOADED`; source untouched. GitHub repo is PUBLIC. Device `smartxflow` most recently OFFLINE.
- Next blocking user-controlled prerequisite: register a secure, genuinely SELECT-only PostgreSQL DSN as GitHub Actions repository secret named `SXF_ARCHIVE_DATABASE_URL`; **do not paste credentials into GitHub files or the chat**. Existing Github connector cannot create/manage Actions secrets. After secret is configured, rerun the existing FAILED pilot job and verify actual draft Release gzip upload, download, SHA and restore before any full run.

## 2026-10-22 — Admin day-picker archive pipeline (implementation staged; NOT migrated)

- User approved replacing slow manual 25-row transfers with an **SXF admin date-picker** which dispatches one or both `full_snapshots` / `concentrated` archives to **CAPİTALE GitHub**. Supabase remains SELECT-only. No extra platform.
- On `hazardyk27-sudo/smartxflow:preview`, implemented `sxf_capitale_archive_admin.py`, `templates/admin_sxf_archive.html`, and guarded Flask/admin-nav integration. Separate 30-minute PIN authorization, same-origin CSRF, input allowlist, GitHub Actions token stored server-side, and status polling. This is **NOT yet production deployed**.
- In CAPİTALE `main`: `scripts/export_sxf_daily_archive.py`, `.github/workflows/sxf-admin-archive.yml`, offline unit tests and CI. Full mode preserves eight safe raw history/snapshot tables in max 25,000-row gzip chunks; concentrated mode uses materialized 25-fixture batches and nine strictly historical checkpoints for 1X2/OU2.5/BTTS. Release assets go to separate DRAFT tags with readback-byte comparison, SHA256/JSONL restore, verification receipt, and append-only per-day GitHub receipt index.
- Offline exporter tests **5/5 PASS** (Actions [39696995575](https://github.com/hazardyk27-sudo/capitale/actions/runs/39696995575)); isolated admin route/security tests PASS and preview CI [39697711830](https://github.com/hazardyk27-sudo/smartxflow/actions/runs/39697711830) succeeded. One real Supabase **SELECT-only** nine-point lookup was verified for a 9 Oct fixture. **No real new GitHub Release export/upload has run**.
- REQUIRED TO ACTIVATE (owner-managed, no credentials in chat): SmartXFlow server env `SXF_ARCHIVE_ADMIN_PIN` (strong secret) and `CAPITALE_GITHUB_ACTIONS_TOKEN` (fine-grained Actions authorization for CAPİTALE), plus CAPİTALE GitHub Actions private secret `SXF_ARCHIVE_DATABASE_URL` with a genuinely SELECT-only PostgreSQL role. Previous 250-row pilot failed due to missing DB secret; nothing indicates it has been fixed. Admin deployment requires reviewed SmartXFlow `preview` release process.
- **Migration counts unchanged**: 9 Oct raw 1X2 small repository shards **1,050/148,444** source-verified, no full raw Release, total verified fully migrated raw days **0/13**. Never mark migrated merely because CI tests or admin queue succeed. Existing 9 Oct canonical 7,020-slot concentrated repo grid remains intact, unchanged.

## 2026-10-24 — Concentrated 14/14 grid migration verified; full raw still pending

This addendum supersedes prior open/concentrated status notes while retaining older history for audit. COMPLETE means all day-fixture/market/checkpoint slots exist, NOT every market snapshot or raw tick exists.

| Day (Europe/Istanbul) | Fixtures | Grid slots | PRESENT | MISSING | Source |
|---|---:|---:|---:|---:|---|
| 2026-10-16 | 201 | 5,427 | 3,975 | 1,452 | COMPLETE |
| 2026-10-17 | 436 | 11,772 | 9,504 | 2,268 | COMPLETE |
| 2026-10-18 | 400 | 10,800 | 8,666 | 2,134 | PARTIAL |
| 2026-10-19 | 173 | 4,671 | 3,310 | 1,361 | COMPLETE |
| 2026-10-20 | 139 | 3,753 | 2,686 | 1,067 | PARTIAL |
| 2026-10-21 | 142 | 3,834 | 2,679 | 1,155 | PARTIAL |

- The daily GitHub 04_concentrated manifest for EVERY DAY from 2026-10-09 through 2026-10-22 (14/14) now reports a complete 3-market x 9-checkpoint grid. Sum of fixture-day memberships: **3,350**. Expected slot count **90,450**, including **69,359 PRESENT** and **21,091 MISSING**. Counts were rechecked across all 14 GitHub manifests: fixture_count * 27 = total_slots and PRESENT + MISSING = total_slots.
- 16–18 October: canonical v3 GitHub-part files, readback and complete daily manifest verified. 19 Oct: five v3 JSONL files, exact source/GitHub readback and daily manifest verified. 20 Oct: four v3 files, same checks. 21 Oct: four v4 files, same checks.
- New 19–21 Oct files retain original selected source row payload, per-source-row SHA256, unique fixture/market/T checkpoint keys, and observation at-or-before checkpoint. Missing historical observations remain MISSING. Supabase was accessed exclusively by SELECT and no source rows were changed.
- Read-only SQL templates: scripts/sql/sxf_concentrated_day_chunk_v3.sql and scripts/sql/sxf_concentrated_day_chunk_v4.sql. V4 splits fixture_uid and null-fixture_uid/hash fallback into mutually exclusive branches to eliminate expensive OR joins.
- Source collection PARTIAL states for 18, 20, 21 and 22 October remain unchanged; grid completion is NOT source collection completeness. 22 Oct manifest records public SmartXFlow day-wide source rather than the research_archive SELECT pipeline used for 9–21 Oct.
- Full original raw history remains **0/14 days fully migrated**. None of the eight large history/snapshot tables is certified as uploaded and restored in full. The 9 Oct 1X2 partial GitHub microshard export remains 1,050/148,444 rows. No full eight-table per-day GitHub Release verified. Small fixtures/results/alarms are separate certified subsets; do not claim full raw migration.
- Next phase per owner: full raw history in TWO-DAY groups, starting 9–10 Oct, only after the PostgreSQL source read-only connection, repository secret SXF_ARCHIVE_DATABASE_URL, GitHub Release upload, independent download/hash/restore are verifiably operational. Do not write to Supabase or claim completion after a queued workflow.

**Current rollup: concentrated 14/14 days COMPLETE (with explicit source MISSING and source PARTIAL flags); full raw 0/14 days COMPLETE.**
