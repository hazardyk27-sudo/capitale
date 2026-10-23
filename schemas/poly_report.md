# CAPITALE POLY v1.4 — Bettor-First Report Schema

Status: CANONICAL
Version: 1.4
Effective: 2026-10-23

```yaml
role: POLY
methodology_version: poly-v1.4
source_contract: DIRECT_INDEPENDENT_POLYMARKET_ONLY
discovery_run_id: <new id>
as_of_utc: <timestamp>
report_created_at_utc: <timestamp>
scope:
  user_selected_matches: [<fixture ids/names>]
  independently_discovered_wallets_total: <number>
  wallets_with_complete_independent_history: <number>
  candidate_discovery_channels: [<official public leaderboard>, <official football event participation>]
  direct_api_v2_used: <true|false>
  gamma_used: <true|false>
  clob_used: <true|false>
  polygon_verification_used: <true|false>
  supabase_or_derived_source_used: false
  sxf_poly_page_used: false
  old_capitale_wallet_seed_used: false
  other_departments_used: false
  source_access_limitation: <string|null>
primary_sources:
  - url: <official public endpoint or Polygon transaction url>
    fetched_at_utc: <timestamp>
    observed_at_utc: <timestamp|null>
    pagination_or_coverage: <text>
wallet_dossiers:
  - wallet_address: <freshly discovered public proxy wallet>
    public_profile: <url|null>
    discovery_source_ref: <primary source>
    source_as_of_utc: <timestamp>
    history_window_utc: <start/end>
    position_data_coverage: <complete|partial|unknown>
    resolved_prematch_football_positions: <number|null>
    independent_football_fixtures: <number|null>
    win_rate_pct: <number|null>
    avg_entry_decimal_odds: <number|null>
    directional_style: <DIRECTIONAL|TRADING|HEDGED|UNKNOWN>
    entry_edge_pp: <number|null>
    pnl_coverage_pct: <number|null>
    realized_net_pnl: <number|null>
    realized_net_roi_pct: <number|null>
    pnl_verification: <RECONCILED|PARTIAL|UNVERIFIED>
    clv_status: <VERIFIED|MISSING|UNVERIFIED>
    market_specialty: <text|null>
    skill_tier: <PROVEN|ESTABLISHED|QUALIFIED|PROVISIONAL|UNKNOWN>
    tier_rationale: <facts from independent records>
tracked_new_positions:
  - wallet_address: <previously independently discovered address>
    fixture: <home vs away>
    event_id: <official event id>
    condition_id: <official market id>
    outcome_token_id: <official token id>
    market_family: <1X2|DRAW|O-U|BTTS|HANDICAP|OTHER>
    exact_side_and_line: <YES|NO|OVER|UNDER plus line/selection>
    kickoff_utc: <timestamp>
    first_entry_at_utc: <timestamp|null>
    last_action_at_utc: <timestamp|null>
    first_entry_decimal_odds: <number|null>
    current_actionable_decimal_odds: <number|null>
    liquidity_verified: <true|false|null>
    buy_cost_usd: <number|null>
    sold_proceeds_usd: <number|null>
    net_exposure_usd: <number|null>
    hedge_state: <CLEAN|MIXED|HEDGED|REDUCED|CLOSED|UNKNOWN>
    historical_stake_baseline_n: <number|null>
    stake_median_of_prior_20_to_30: <number|null>
    stake_multiple: <number|null>
    odds_at_least_1_40: <true|false|null>
    recommendation_eligibility: <QUALIFIED_BETTOR_FOLLOW|WATCH_UNVERIFIED|NO_QUALIFIED_BETTOR_EVIDENCE>
    independence_caveat: <text|null>
    source_refs: [<primary refs>]
decision_audit:
  precommitted_before_kickoff: <true|false>
  independent_qualified_follows: <number>
  watches_unverified: <number>
  no_qualified_evidence_count: <number>
  no_sxf_flow_or_team_news_used: true
  prediction_win_probability: null
  bettor_skill_uplift_calibrated: false
  non_predicted_matches_count: <number>
  data_gaps: [<text>]
```

Rules:
- Every wallet is discovered independently from current official Polymarket sources, never from prior CAPITALE wallet lists.
- NEVER query, read, compare or import CAPITALE/SXF Supabase objects; never use SXF POLY page.
- Confirm exact football outcome contract semantics and resolution; one wallet/event/market/outcome economic position, not per fill.
- No `PROVEN` or positive realized ROI without reconciled transactions and >=90% PnL coverage.
- No fabricated bettor stakes, multipliers, odds, profitability, win probabilities, or live quote feasibility.
- Unknown is an allowed answer; complete source provenance is mandatory.
- Primary report must center on bettor historical verified profitability and current bets, not POLY mass volume or SXF team predictions.
