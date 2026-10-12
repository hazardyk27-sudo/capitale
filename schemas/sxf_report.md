# SXF Report Schema

Status: DRAFT
Version: 0.2

SXF reports must be generated strictly as-of the decision horizon, normally T-6 to T-3. No future money, final-volume, or closing-odds information may appear in the report.

```yaml
role: SXF
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: sxf-draft-0.2

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
  early_lock_1x2:
    status: <TRIGGERED|NOT_TRIGGERED|INSUFFICIENT_DATA>
    selection: <home|away|null>
    top_money_team: <true|false|null>
    t72_t60_money: <number|null>
    t40_t24_money: <number|null>
    notes: <text|null>

  one_x_two_concentration:
    status: <TRIGGERED|NOT_TRIGGERED|INSUFFICIENT_DATA>
    selection: <home|away|null>
    current_money: <number|null>
    money_share_pct: <number|null>
    current_odds: <number|null>

  surprise_team:
    status: <TRIGGERED|NOT_TRIGGERED|INSUFFICIENT_DATA>
    selection: <home|away|null>
    current_money: <number|null>
    money_share_pct: <number|null>
    current_odds: <number|null>
    interpretation: <UNDERDOG_MONEY_SUPPORT|NONE|null>

  over_stable:
    status: <TRIGGERED|NOT_TRIGGERED|SUPERSEDED_BY_OVER_PREMIUM|INSUFFICIENT_DATA>
    market: O/U_2.5
    selection: OVER
    current_money: <number|null>
    money_share_pct: <number|null>
    current_odds: <number|null>

  over_premium:
    status: <TRIGGERED|NOT_TRIGGERED|INSUFFICIENT_DATA>
    market: O/U_2.5
    selection: OVER
    current_money: <number|null>
    money_share_pct: <number|null>
    current_odds: <number|null>

  btts_yes:
    status: <TRIGGERED|NOT_TRIGGERED|INSUFFICIENT_DATA>
    market: BTTS
    selection: YES
    current_money: <number|null>
    money_share_pct: <number|null>
    current_odds: <number|null>

confirmation_layer:
  trailing_6h_new_money: <number|null>
  trailing_3h_new_money: <number|null>
  trailing_1h_new_money: <number|null>
  trailing_6h_odds_before: <number|null>
  trailing_6h_odds_now: <number|null>
  trailing_3h_odds_before: <number|null>
  trailing_3h_odds_now: <number|null>
  price_confirmation_6h: <YES|NO|MIXED|UNKNOWN>
  price_confirmation_3h: <YES|NO|MIXED|UNKNOWN>
  flow_acceleration: <POSITIVE|FLAT|NEGATIVE|UNKNOWN>
  persistence: <PERSISTENT|REVERSING|MIXED|UNKNOWN>
  normalized_volume_status: <NOT_CALIBRATED|LOW|NORMAL|HIGH|EXTREME|UNKNOWN>

flow_observations:
  - market: <market>
    selection: <selection>
    observed_at: <timestamp>
    money_size: <number|null>
    money_share_pct: <number|null>
    odds: <number|null>
    raw_alarm_label: <source label|null>
    notes: <text|null>

summary:
  primary_engine: <EARLY_LOCK_1X2|1X2_CONCENTRATION|SURPRISE_TEAM|OVER_STABLE|OVER_PREMIUM|BTTS_YES|NONE>
  triggered_engines: []
  confirmation_state: <CONFIRMED|PARTIAL|UNCONFIRMED|REVERSING|UNKNOWN>
  descriptive_direction: <selection/market or NO_CLEAR_DIRECTION>
  candidate_signal_label: <NO_SIGNAL|EARLY_MONEY|LATE_MONEY|PERSISTENT_MONEY|CONFIRMED_MONEY|STRONG_CONFIRMED_MONEY|PREMIUM_CONFIRMED_MONEY|REVERSAL|CONFLICTED_FLOW|UNDERDOG_MONEY_SUPPORT|other-draft>
  confidence: <LOW|MEDIUM|HIGH>
  conflicts: []
  caveats: []
  research_prior_only: true
```

## Current engine thresholds

- EARLY LOCK 1X2: approximately £5k+ at T-72/T-60 and £10k+ at T-40/T-24 on the same top-money team.
- 1X2 CONCENTRATION: £1k+, 80%+ money share, odds 1.40-2.50.
- SURPRISE TEAM: team odds 2.90-4.49 and money share 50%+.
- OVER STABLE: Over 2.5 £1.5k+, 65%+, odds 1.40-1.80.
- OVER PREMIUM: Over 2.5 £2.5k+, 75%+, odds 1.40-1.80; supersedes OVER STABLE.
- BTTS YES: £750+, 60%+, odds 1.60-1.90.

These thresholds and the observed three-day hit rates are DRAFT research rules. Do not transform them into calibrated probabilities or production weights without owner approval.
