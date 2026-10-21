# SXF migration status — 2026-10-21 (GitHub-only destination)

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
