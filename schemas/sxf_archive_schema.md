# CAPITALE SXF Daily Archive Schema

Status: APPROVED STRUCTURAL DRAFT (collector not yet operational)
Version: 1.0
Timezone: Europe/Istanbul (fixtures grouped by local kickoff date)
Primary identity: fixture_uid + kickoff_utc, plus run_id and selection_id for report rows.

## 00. Daily manifest (required)

```json
{
  "schema_version": "SXF_ARCHIVE_V1_0",
  "match_date_tr": "2026-10-20",
  "timezone": "Europe/Istanbul",
  "generated_at_utc": "<ISO timestamp>",
  "source": "SUPABASE_SMARTXFLOW_READ_ONLY|DIRECT_SMARTXFLOW",
  "source_access": "VERIFIED|BLOCKED|PARTIAL",
  "fixture_count": null,
  "all_fixtures_included": false,
  "full_snapshot_status": "COMPLETE|PARTIAL|MISSING|NOT_COLLECTED",
  "concentrated_status": "COMPLETE|PARTIAL|MISSING|NOT_COLLECTED",
  "report_run_ids": [],
  "release_asset_refs": [],
  "missing_fixture_ids": [],
  "warnings": []
}
```

`source` records where the SmartXFlow observations were read from; Supabase is permissible only in READ-ONLY mode. Archive destinations and persistence are GitHub-only. Never emit `COMPLETE` without checking captured source rows, fixture inventory and file SHA-256.

## 01. Scan results — frozen before kickoff

One record per unique `fixture_uid + market + selection + scan_id`; multiple engine tags live inside a single selection. Fields:

```json
{
  "schema_version": "SXF_ARCHIVE_V1_0",
  "run_id": "<UUID or stable ID>",
  "scan_id": "<stable ID>",
  "publication_state": "PUBLISHED_FROZEN|RECONSTRUCTED|DRAFT",
  "match_date_tr": "2026-10-20",
  "as_of_utc": "<ISO timestamp>",
  "mode": "DYNAMIC_AS_OF_V04|CHECKPOINT_RESEARCH_T6_FALLBACK_T8",
  "methodology_version": "sxf-draft-0.4",
  "prompt_version": "sxf-archive-scan-v1.0",
  "fixture_coverage": {"total": null, "with_snapshots": null, "without_signals": null},
  "selections": [
    {
      "selection_id": "<stable ID>",
      "fixture_uid": "<source fixture UID>",
      "kickoff_utc": "<ISO timestamp>",
      "home": "<source home team>",
      "away": "<source away team>",
      "league": "<source league>",
      "market": "1X2|OVER_2_5|BTTS|SURPRISE_NONLOSS_RISK",
      "selection": "HOME|AWAY|OVER|YES",
      "engine_tags": ["V1", "V2", "HEAVY"],
      "sxf_odds": 1.62,
      "bookmaker_odds": null,
      "money_share_pct": 89.8,
      "selection_money_gbp": 123809.0,
      "source_snapshot_at_utc": "<ISO timestamp>",
      "decision_as_of_utc": "<ISO timestamp>",
      "hours_to_kickoff": null,
      "reference_checkpoint": "T-6|null",
      "passes_global_min_odds_1_30": true,
      "published": true,
      "quality_flags": [],
      "important_note": "<concise evidence-based note>"
    }
  ],
  "excluded_signal_audit": [],
  "source_snapshot_hashes": [],
  "scan_document_hash_sha256": "<SHA-256 after serialization>"
}
```

`source_snapshot_hashes` may be empty only if explained in `quality_flags`; do not invent hash values or times. Separate (1) original SXF odds, (2) actual executable bookmaker odds, (3) hypothetical -7% odds.

## 02. Outcome evaluation — a separate later object

```json
{
  "schema_version": "SXF_ARCHIVE_V1_0",
  "run_id": "<original run ID>",
  "original_scan_id": "<original scan ID>",
  "evaluation_at_utc": "<ISO timestamp>",
  "verification_status": "VERIFIED|PARTIAL|UNVERIFIED",
  "settlements": [
    {
      "selection_id": "<from scan>",
      "fixture_uid": "<from scan>",
      "score_normal_time": "2-2",
      "fixture_status": "FT|PENDING|VOID|UNVERIFIED",
      "score_sources": [],
      "market_result": "WIN|LOSS|PUSH|VOID|PENDING|UNVERIFIED",
      "surprise_nonloss_result": null,
      "sxf_odds": 1.62,
      "bookmaker_odds_actual": null,
      "profit_units_sxf": -1,
      "profit_units_bookmaker": null,
      "profit_units_hypothetical_minus_7_pct": -1,
      "error_tags": [],
      "important_note": ""
    }
  ],
  "by_engine_metrics": [],
  "unique_selection_metrics": {},
  "deduplicated_daily_metrics": {},
  "data_quality_warnings": []
}
```

Motor metrics count overlapping tags for per-engine analysis; deduplicated totals count each actual selection once. No result is verified solely because a match appears in a report.

## 03. Full snapshot archive — every captured snapshot, all fixtures

Recommended compressed release asset: `full_<matchdate>_<market>.jsonl.gz` or Parquet.
One row per original snapshot + fixture + market (timestamped source record). Preserve all available original numeric/text money and odds fields, not only winning side:

```json
{"fixture_uid":"<id>","kickoff_utc":"<timestamp>","source_snapshot_at_utc":"<timestamp>","collected_at_utc":"<timestamp>","market":"1X2","source_payload":{},"source_row_hash_sha256":"<hash>"}
```

Repository `03_full_snapshots/manifest.json` references asset name, GitHub release tag, SHA-256, date, market, row count, size, minimum/maximum observation time, missing fixtures/markets, collection coverage. Never label collected snapshots exhaustive when acquisition was intermittent.

## 04. Konsantre Arsivi — every fixture at nine reference checkpoints

For every source-listed fixture and each of three market types (1X2 / OU2.5 / BTTS), store checkpoint slots:

`T-72, T-60, T-40, T-24, T-12, T-8, T-6, T-3, T-1`

```json
{
  "fixture_uid": "<id>",
  "kickoff_utc": "<ISO>",
  "match_date_tr": "2026-10-20",
  "market": "1X2|OU2.5|BTTS",
  "checkpoint": "T-8",
  "target_at_utc": "<kickoff minus 8h>",
  "status": "PRESENT|MISSING",
  "actual_snapshot_at_utc": "<timestamp or null>",
  "lag_minutes": null,
  "source_row_hash_sha256": null,
  "source_payload": null,
  "quality_flags": []
}
```

Snapshot selection rule: latest source observation where `source_snapshot_at_utc <= target_at_utc`; NEVER the first observation after the target. Record actual lag instead of pretending exact T-point equivalence. Checkpoint MISSING must still produce a row. No-signal matches are mandatory.

## Settlement conventions

- For 1X2: selection wins only if selected team wins in the applicable normal-time settlement.
- Over 2.5: at least 3 goals total.
- BTTS YES: both teams score at least once.
- SURPRISE TEAM: research primary is selected side NON-LOSS (win or draw). Hypothetical direct-win PnL, if computed, must be explicitly separate and must never be inferred from non-loss.
- 1 unit stake per unique market selection: `profit_units = odds - 1` on WIN; `-1` on LOSS; 0 on PUSH/VOID; PENDING does not enter finalized PnL.
- Hypothetical -7% price uses `sxf_odds * 0.93` and explicitly recomputes minimum-odds eligibility at >=1.30; do not silently count excluded entries.
- Distinguish reconstructed archived history from genuine frozen pre-match publications.
