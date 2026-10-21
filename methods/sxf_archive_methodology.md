# CAPITALE SXF Archive — GitHub-only Methodology

Status: ARCHITECTURE APPROVED / IMPLEMENTATION PARTIAL
Version: 1.0
Approved by owner: 2026-10-21

## Mission

Build a daily, retrospective-research-ready SXF archive with **no Supabase and no new storage platform**. GitHub is the only managed destination: repository text/manifests and small research datasets; GitHub Releases for compressed full snapshot packages; optional GitHub Actions once a direct SmartXFlow acquisition path has been verified.

This document establishes archiving rules, NOT new predictive engines. SXF itself remains v0.4 DRAFT. Direct SmartXFlow access and automated collection have NOT yet been proven. Never say a historical full archive was captured until coverage and release asset checks pass.

## The four daily artifacts

All artifacts are keyed to **fixture kickoff local calendar date in Europe/Istanbul** and canonical match identity (fixture_uid plus kickoff_utc; fallback stable source identifier with provenance). Distinguish signal selections from distinct matches.

1. **Tarama Sonuclari / Scan Results**: freeze the originally published pre-match scan. Fields per selection: kickoff time, match, league, market, side, engine tags, original SXF decimal odds, selected-side money GBP, money-share %, snapshot time, run AS_OF, exact match horizon, quality notes. Group 1X2, OVER 2.5, BTTS YES, SURPRISE. Note reasons for rejected signals, including global user eligibility floor 1.30 (not a change to the individual SXF engine odds windows). Show zero-signal fixtures in coverage manifest, not necessarily the short presentation table. One selection can have multiple tags. Preserve the actual user's requested screening mode.

2. **Tarama ve Mac Sonuclariyla Performans / Outcome Evaluation**: append settlement linked to the original scan_id/selection_id and verified match result; never edit the originally frozen scan or retrospectively remove failing choices. Grade market correctly: 1X2 win only, OVER 2.5 if 3+ goals, BTTS YES if both score, SURPRISE's primary metric is non-loss (not an automatic win bet). Report per-engine hits, draws, misses, unique selections, PnL/ROI at original odds, and optional scenario using actual accessible bookmaker odds or a clearly labelled -7% hypothetical. Engines can overlap; never sum per-engine PnLs as a system total. Official/independent score verification preferred; uncertain/unfinished fixtures remain UNVERIFIED/PENDING.

3. **Gunun Tum Snapshotlari / Full Snapshot Archive**: preserve **every captured raw pre-match 1X2, OU2.5 and BTTS snapshot across every fixture on the day** (including no-signal fixtures), with source snapshot timestamps and complete source-provided money/odds fields. Preserve identity, provenance, collection time and hashes. Include missing-data/coverage manifest. A release package named for match date (e.g. `sxf-full-2026-10-20`) is stored in GitHub Releases as compressed JSONL/Parquet, preferably split by day/market if required. A separate repository manifest points to exact release asset names and SHA-256. The archive is only as complete as actual captured snapshots; do not represent gaps as complete coverage.

4. **Konsantre Arsivi / Concentrated Archive**: every day's **all fixtures**, nine independent per-match reference points: **T-72, T-60, T-40, T-24, T-12, T-8, T-6, T-3, T-1** hours. For each fixture + market + T-point, target time = kickoff_utc minus hours; choose only latest captured observation **at or before** that target; save actual observation timestamp and lag minutes. If missing, save MISSING, never use a later snapshot or fabricate. No-signal fixtures must appear. These reference points are research buckets and must not override the v0.4 live dynamic exact-AS_OF decision rule.

## Freeze / as-of / mode discipline

- Scan `as_of_utc` is frozen before outcomes; each fixture stores exact kickoff and hours to kickoff, and latest eligible snapshot <= the specific decision cutoff.
- `DYNAMIC_AS_OF_V04`: apply live canonical research design with a common real analysis clock but **each match's exact T-minus duration**, and only information known then.
- `CHECKPOINT_RESEARCH_T6_FALLBACK_T8`: explicit historical user-requested comparison mode, using documented eligible T-6 / T-8 observations. NEVER label it a full v0.4 dynamic live run.
- Record `mode`, `methodology_version`, `ruleset_version`, `run_id`, `scan_id`, input source, coverage, prompt/version and SHA-256 per object.
- Publication eligibility has user global odds floor **1.30**, distinct from specific engine ranges (V1 1.40–2.50, etc.). Keep excluded raw engine triggers in audit flags. Never infer executable odds from SXF odds. Later bookmaker odds are evaluation scenarios, not retrospective original signals.
- An approved separate EXPERIMENTAL SURPRISE HOLD comparison may be kept, but cannot be silently promoted to SXF v0.4 core.
- One fixture can yield multiple market-specific selections; do not call those separate fixtures.

## Data integrity and GitHub policy

- Prefer append-only run IDs and new report versions. Git commits supply history but are not immutable by technical enforcement unless branch protections are separately configured.
- Never overwrite an original scan with post-match data. Settlement can append corrections with provenance and versioning.
- Public repository = all committed small files and public release assets are **public**. Do not archive API keys, cookies, login details, private bettor identifiers or proprietary raw payloads without owner approval and source redistribution rights.
- Avoid committing unbounded daily raw snapshot streams into normal Git history; use compressed GitHub Release assets for full packages. GitHub is not a guaranteed low-latency always-on data collector. Actions schedule delays and service limitations are operational risks.
- GitHub-only archiving is not functional until direct SmartXFlow acquisition (without Supabase) is configured and validated. Do not invent missing source API endpoints. R2, S3 or another host must not be added without explicit owner approval.

## Daily order

1. Collect source snapshots directly, continuously where feasible; inventory all fixtures and markets.
2. At approved AS_OF, compute SXF scan, present to owner, then save frozen run.
3. Store/refresh full raw pre-match snapshot capture and the nine-point concentrated archive for the match-date cohort; include coverage metrics (not just signals).
4. After FT and score verification, append settlement report and engine-level performance; preserve original frozen scan.
5. Retrospective experiments read either full snapshots or concentrated archive; every experimental change is versioned, and tests must be chronological/out-of-sample.

## Repository paths

`archive/YYYY/MM/DD/01_scan_results/<run_id>.json`
`archive/YYYY/MM/DD/01_scan_results/<run_id>.md`
`archive/YYYY/MM/DD/02_outcome_performance/<run_id>_settlement.json`
`archive/YYYY/MM/DD/02_outcome_performance/<run_id>_settlement.md`
`archive/YYYY/MM/DD/03_full_snapshots/manifest.json` (release assets, external to Git tree)
`archive/YYYY/MM/DD/04_concentrated/checkpoints.jsonl.gz` or segmented files
`archive/YYYY/MM/DD/manifest.json` (coverage and integrity)

For large concentrated datasets, use compressed GitHub Release assets too, linking their hashes in the manifest. Repository location names are an organizational convention; no GitHub Release asset or daily historical file is assumed to exist until actually uploaded.

## Activation status

Documentation + reusable prompts may be saved now. GitHub-only data pipeline, release uploads, and historical migration require separate tested implementations. If direct SXF source is not accessible, report BLOCKED_SOURCE_ACCESS and do not claim completion.
