# POLY Report Schema

Status: CANONICAL
Version: 1.0

```yaml
role: POLY
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: poly-v1.0

scope_check:
  direct_polymarket_primary: true
  team_form_used: false
  current_news_used: false
  smartxflow_flow_used: false
  other_department_reports_used: false

data_quality:
  wallet_history_backfill_complete: <true|false>
  settlement_coverage_note: <description>
  clv_pipeline_verified: <true|false>
  behavioral_cluster_check: <COMPLETE|PARTIAL|NOT_AVAILABLE>

qualified_wallets:
  - wallet: <address>
    label: <optional>
    bettor_type: <DIRECTIONAL_BETTOR|MARKET_MAKER_LIKE|HEDGER|TRADING_HEAVY|MIXED|UNKNOWN>
    qualification_status: <status>
    resolved_football_positions: <int>
    distinct_events: <int>
    wins: <int>
    losses: <int>
    win_rate_pct: <number>
    avg_entry_probability_pct: <number>
    avg_entry_decimal_odds: <number>
    expected_wins: <number>
    wins_above_expectation: <number>
    edge_vs_entry_pp: <number>
    active_months: <int>
    pnl_coverage_pct: <number|null>
    pnl_usdc: <number|null>
    roi_pct: <number|null>
    pnl_is_reliable: <true|false>
    avg_clv_pp: <number|null>
    clv_is_reliable: <true|false>

specialties:
  - wallet: <address>
    market_family: <canonical family>
    market_detail: <line/detail>
    selection_direction: <direction>
    sample_tier: <INSUFFICIENT_SAMPLE|WATCH_SAMPLE|MEANINGFUL_SAMPLE|STRONG_SAMPLE|ESTABLISHED_SAMPLE>
    resolved_positions: <int>
    win_rate_pct: <number>
    avg_entry_probability_pct: <number>
    avg_entry_decimal_odds: <number>
    wins_above_expectation: <number>
    edge_vs_entry_pp: <number>
    roi_pct: <number|null>

current_positions:
  - wallet: <address>
    market_family: <canonical family>
    market_detail: <detail>
    selection_direction: <direction>
    net_exposure_usdc: <number>
    avg_entry_probability_pct: <number>
    avg_entry_decimal_odds: <number>
    first_entry_hours_to_kickoff: <number|null>
    sizing_vs_wallet_norm: <SMALL|NORMAL|LARGE|VERY_LARGE|UNKNOWN>
    action_state: <ADDING|HOLDING|REDUCING|EXITED|HEDGED|UNKNOWN>
    relevant_specialty_status: <status>
    cluster_id: <id|null>

poly_signal:
  direction: <selection/market or NO_SIGNAL>
  strength: <LOW|MEDIUM|HIGH|NO_SIGNAL>
  independent_qualified_wallet_count: <int>
  rationale: <wallet-quality + specialty + current-position evidence>
  caveats: []
```

A wallet that fails the general football qualification gate must not appear as a qualified sharp merely because a specialty row is favorable.
