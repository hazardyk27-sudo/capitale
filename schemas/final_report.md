# FINAL Report Schema

Status: DRAFT
Version: 0.2

```yaml
role: FINAL
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
as_of_utc: <timestamp>
prompt_version: <version>
methodology_version: final-draft-0.2
model_version: <version>
input_hash: <hash|null>

input_reports:
  analyst:
    present: <true|false>
    report_id: <id|null>
    version: <version|null>
    report_as_of_utc: <timestamp|null>
    future_data_safe: <true|false|null>
    freshness_state: <FRESH|AGING|STALE|UNKNOWN>
    reliability_state: <STRONG|NORMAL|WEAK|UNKNOWN>
  news:
    present: <true|false>
    report_id: <id|null>
    version: <version|null>
    report_as_of_utc: <timestamp|null>
    future_data_safe: <true|false|null>
    freshness_state: <FRESH|AGING|STALE|UNKNOWN>
    reliability_state: <STRONG|NORMAL|WEAK|UNKNOWN>
  sxf:
    present: <true|false>
    report_id: <id|null>
    version: <version|null>
    report_as_of_utc: <timestamp|null>
    future_data_safe: <true|false|null>
    freshness_state: <FRESH|AGING|STALE|UNKNOWN>
    reliability_state: <STRONG|NORMAL|WEAK|UNKNOWN>
  poly:
    present: <true|false>
    report_id: <id|null>
    version: <version|null>
    report_as_of_utc: <timestamp|null>
    future_data_safe: <true|false|null>
    freshness_state: <FRESH|AGING|STALE|UNKNOWN>
    reliability_state: <STRONG|NORMAL|WEAK|UNKNOWN>

weights:
  structural:
    analyst_pct: <number>
    news_pct: <number>
    sxf_pct: <number>
    poly_pct: <number>   # must remain 5-15
  effective:
    analyst_pct: <number|null>
    news_pct: <number|null>
    sxf_pct: <number|null>
    poly_pct: <number|null>
  rationale: <short text>
  missing_data_redistribution_applied: <true|false>
  missing_data_penalty_applied: <true|false>
  missing_data_penalty_numeric_calibrated: false

synthesis:
  analyst_view: <summary>
  news_view: <summary>
  sxf_view: <summary>
  poly_view: <summary>
  agreements: []
  conflicts: []
  duplicated_evidence_risks: []
  unresolved_uncertainties: []
  freshness_impacts: []
  reliability_impacts: []

match_thesis:
  text: <coherent synthesis>
  major_support: []
  major_risks: []
  abc_category_assigned: false

recommendation_state: <RECOMMENDATIONS|NO_RECOMMENDATION>

recommendations:
  - recommendation_id: <id>
    market: <market>
    selection: <selection>
    derived_market: <true|false>
    combination: <true|false>
    legs:
      - market: <market>
        selection: <selection>
        evidence_trace_required: true
    category: <A|B|C>
    category_rank: <integer|null>   # e.g. A1/A2 ordering within category
    category_reason:
      - <reason>
    limiting_factors: []            # especially required for B/C
    failure_mode: <short counter-case>
    value_assessment: <text|null>   # informational only; scale not yet calibrated
    evidence_trace:
      analyst: <SUPPORT|CONFLICT|WEAK|NO_EVIDENCE|NOT_RELEVANT + short note>
      news: <SUPPORT|CONFLICT|WEAK|NO_EVIDENCE|NOT_RELEVANT + short note>
      sxf: <SUPPORT|CONFLICT|WEAK|NO_EVIDENCE|NOT_RELEVANT + short note>
      poly: <SUPPORT|CONFLICT|WEAK|NO_EVIDENCE|NOT_RELEVANT + short note>
    correlation:
      state: <HIGH_CORRELATION|NORMAL|UNKNOWN>
      correlated_with: []
      counted_as_independent_evidence: false

report_checks:
  raw_research_performed_by_final: false
  future_data_used: false
  departments_assigned_abc: false
  mutually_opposite_recommendations_present: false
  match_thesis_consistent_with_recommendations: true
  combination_weakest_leg_cap_respected: true
  correlation_double_count_avoided: true
  stake_recommendation_present: false
  abc_numeric_thresholds_calibrated: false

versioning:
  supersedes_final_run_id: <id|null>
  reason_for_new_run: <INITIAL|NEW_INFORMATION|REFRESH|OTHER>
  historical_run_mutated: false
```

## Structural rules

- POLY structural weight must stay within 5%-15%.
- The remainder is split equally across ANALYST, NEWS, and SXF as base structural weights.
- Reliability/freshness can modify effective contribution but does not change the approved structural architecture.
- Missing data is `NO_EVIDENCE`, not positive/negative evidence; most unused contribution may be redistributed while a small missing-data penalty remains.
- Exact multipliers/penalties remain uncalibrated.

## Output rules

- FINAL v0.2 has no BET/WATCH/NO_BET state.
- Recommendations receive only A/B/C categories.
- If none qualifies, use `NO_RECOMMENDATION`.
- A/B/C are absolute across matches.
- FINAL alone assigns A/B/C.
- Match thesis does not receive A/B/C.
- Same-category recommendations may be ordered A1/A2/A3 etc.
- Derived/safer/combination markets are allowed only with traceable evidence.
- A combination cannot outrank its weakest leg.
- Mutually opposite recommendations are forbidden.
- Correlated recommendations may coexist but must be tagged and never counted as independent confirmation.
- Value is a separate informational axis and does not automatically demote A or B.
- No stake sizing in v0.2.
- Every recommendation requires category rationale, evidence trace, and failure mode; B/C also require explicit limiting factors.

Exact category thresholds, reliability multipliers, freshness decay, conflict penalties, missing-data penalty magnitudes, value scoring, and stake sizing remain DRAFT calibration work.
