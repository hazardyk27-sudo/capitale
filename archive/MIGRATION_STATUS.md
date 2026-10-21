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
