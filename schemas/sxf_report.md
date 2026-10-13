# SXF Report Schema

Status: DRAFT
Version: 0.3

SXF reports must be generated strictly as-of the decision horizon. No future money, final-volume, later alarms, or closing-odds information may appear in the report.

```yaml
role: SXF
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: sxf-draft-0.3

decision_horizon:
  label: <T-6|T-5|T-4|T-3|other>
  kickoff_utc: <timestamp>
  as_of_utc: <timestamp>
  future_data_used: false

scope_check:
  smartxflow_only: true
  team_form_used: false
  current_news_used: false
  polymarket_used: false
  other_department_reports_used: false

engine_results:
  early_money:
    status: <TRIGGERED|NOT_TRIGGERED|RETENTION_BREAK|INSUFFICIENT_DATA>
    selection: <home|away|null>
    origin_horizon: <T-72|T-60|T-40|T-24|T-12|null>
    origin_money: <number|null>
    origin_share_pct: <number|null>
    origin_top_money_team: <true|false|null>
    retention_applicable: <true|false|null>
    retention_threshold_pct: <55|null>
    retention_current_share_pct: <number|null>
    retention_min_share_since_origin_pct: <number|null>
    retention_break_at: <timestamp|null>
    recommendation_active: <true|false|null>

  one_x_two_concentration_v1:
    status: <TRIGGERED|NOT_TRIGGERED|INSUFFICIENT_DATA>
    selection: <home|away|null>
    top_money_team: <true|false|null>
    current_money: <number|null>
    money_share_pct: <number|null>
    current_odds: <number|null>

  one_x_two_concentration_v2:
    status: <TRIGGERED|NOT_TRIGGERED|V1_NOT_TRIGGERED|INSUFFICIENT_DATA>
    selection: <home|away|null>
    prior_3h_min_share_pct: <number|null>
    prior_3h_max_adverse_odds_move_pct: <number|null>
    persistence_pass: <true|false|null>
    adverse_odds_pass: <true|false|null>

  heavy_1x2:
    status: <TRIGGERED|NOT_TRIGGERED|INSUFFICIENT_DATA>
    selection: <home|away|null>
    current_money: <number|null>
    money_share_pct: <number|null>
    relation: CONCENTRATION_PREMIUM_TAG

  surprise_team:
    status: <TRIGGERED|NOT_TRIGGERED|INSUFFICIENT_DATA>
    selection: <home|away|null>
    money_share_pct: <number|null>
    current_odds: <number|null>
    interpretation: <UPSET_NON_LOSS_RISK|NONE|null>

  stable_over_2_5:
    status: <TRIGGERED|NOT_TRIGGERED|SUPERSEDED_BY_PREMIUM|INSUFFICIENT_DATA>
    current_money: <number|null>
    money_share_pct: <number|null>
    current_odds: <number|null>

  premium_over_2_5:
    status: <TRIGGERED|NOT_TRIGGERED|INSUFFICIENT_DATA>
    current_money: <number|null>
    money_share_pct: <number|null>
    current_odds: <number|null>

  btts_yes:
    status: <TRIGGERED|NOT_TRIGGERED|INSUFFICIENT_DATA>
    current_money: <number|null>
    money_share_pct: <number|null>
    current_odds: <number|null>

supporting_observations:
  gradual_odds_decline:
    status: <OBSERVED|NOT_OBSERVED|INSUFFICIENT_DATA>
    notes: <text|null>

  abnormal_money:
    status: <OBSERVED|NOT_OBSERVED|NOT_CALIBRATED|INSUFFICIENT_DATA>
    notes: <text|null>

confluence_tags:
  early_money_plus_concentration: <true|false|null>
  btts_plus_over: <true|false|null>
  automatic_confidence_bonus_applied: false

recommendations:
  - market: <1X2|O/U_2.5|BTTS|UPSET_RISK>
    selection: <home|away|OVER|YES|home_non_loss_risk|away_non_loss_risk>
    basis_engines: []
    active: <true|false>
    notes: <text|null>

summary:
  triggered_core_engines: []
  cancelled_engines: []
  premium_tags: []
  primary_flow_direction: <home|away|OVER_2_5|BTTS_YES|MIXED|NO_CLEAR_DIRECTION>
  conflicts: []
  caveats: []
  research_prior_only: true
  final_abc_category_assigned: false
```

## Core thresholds

- EARLY MONEY:
  - T-72/T-60: top-money TEAM, >= £5k, share >= 50%
  - T-40/T-24: top-money TEAM, >= £10k, share >= 50%
  - T-12: top-money TEAM, >= £1k, share >= 80%
  - Retention 55 applies to origins T-72/T-60/T-40/T-24; any later share `<55%` => `RETENTION_BREAK`.
- 1X2 CONCENTRATION V1: TEAM, top-money, >= £1k, share >= 80%, odds 1.40-2.50.
- 1X2 CONCENTRATION V2: all V1 conditions + prior 3h share never below 70% + prior 3h adverse odds rise not greater than 3%.
- HEAVY 1X2: Concentration-family case with >= £10k and share >= 80%.
- SURPRISE TEAM: HOME/AWAY, odds 2.90-4.49, share >= 50%.
- STABLE OVER 2.5: >= £1.5k, share >= 65%, odds 1.40-1.80.
- PREMIUM OVER 2.5: >= £2.5k, share >= 75%, odds 1.40-1.80; supersedes Stable on the same match/selection.
- BTTS YES: >= £750, share >= 60%, odds 1.60-1.90.

SXF does not assign FINAL A/B/C categories. Engine hit rates are research priors and must not be converted into calibrated probabilities without explicit approval.
