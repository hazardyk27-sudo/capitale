# CAPITALE SXF Daily Archive

**GitHub-only archive storage.** Existing Supabase SmartXFlow tables MAY be read (SELECT only) for scans, historical snapshots and results. No new Supabase archive/report/snapshot writes; no new storage provider.

See:
- [Archive methodology](../methods/sxf_archive_methodology.md)
- [Daily archive schema](../schemas/sxf_archive_schema.md)
- [Scan prompt](../prompts/sxf_archive_scan.md)
- [Save prompt](../prompts/sxf_archive_save.md)
- [Settlement prompt](../prompts/sxf_archive_settle.md)

## Four daily logs

- `01_scan_results` — frozen prematch scan output with side, engines, odds, money share and GBP selection money.
- `02_outcome_performance` — post-match settlement and per-engine evaluation.
- `03_full_snapshots` — coverage manifest + GitHub Release assets for all captured snapshots from all matches.
- `04_concentrated` — ALL fixtures at nine reference checkpoints, including no-signal fixtures and MISSING checkpoint slots.

Checkpoints: **T-72, T-60, T-40, T-24, T-12, T-8, T-6, T-3, T-1**.

Daily path convention: `archive/YYYY/MM/DD/{01_scan_results,02_outcome_performance,03_full_snapshots,04_concentrated}/`.

## Verified historical migration (9–21 October 2026)

See [migration status](MIGRATION_STATUS.md) for exact progress and unresolved bulk export blockers.

- **72/72 original GitHub learning-archive research files** copied, matching Git SHA and size.
- **13/13 source daily manifests** and matching fixture/result subsets present in `archive/2026/10/DD/`.
- **Full multi-million-row market, dropping and snapshot histories are NOT yet copied**; no GitHub Releases assets exist.
- **Complete nine-point retrospective checkpoint archive is NOT yet copied**.
- Current source `research_archive.archive_runs` statuses for Oct 18, Oct 20 and Oct 21 are PARTIAL; these may change after the source day closes.
- A local read-only bulk exporter draft exists in `scripts/export_sxf_research_archive.py`; its GitHub Actions/secret/release-upload deployment is not active.

## Current implementation state

This directory defines archive organization only. No automated GitHub archive publisher or GitHub Releases uploader has been deployed, and historical daily snapshot archive coverage has not been verified. Existing Supabase SmartXFlow data can be used READ-ONLY; automated extraction and GitHub publishing remain to be implemented. Run the prompts only against authentic accessible SXF observations and record missing data honestly.

Repository and public release contents are PUBLIC; do not store credentials or non-redistributable source material.
