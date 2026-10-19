# POLY Report Schema

Status: CANONICAL
Version: 1.3

```yaml
role: POLY
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: poly-v1.3

preference_context:
  supplied: <true|false>
  preference: <user supplied selection|null>

scope_check:
  source_as_of_utc: <timestamp>
  kickoff_utc: <timestamp>
  sxf_poly_snapshot_at_utc: <timestamp|null>
  direct_market_snapshot_at_utc: <timestamp|null>
  no_future_data_used: <true|false>
  poly_bettor_source_verified: <true|false>
  general_market_source: DIRECT_POLYMARKET
  bettor_source: SXF_POLY_PAGE_ONLY
  historical_24_wallet_pool_used: false
  sxf_market_flow_used: false
  team_form_used: false
  current_news_used: false
  other_department_reports_used: false

market_overview:
  market_price_pct: <number|null>
  opposite_price_pct: <number|null>
  selection_volume_usdc: <number|null>
  opposite_volume_usdc: <number|null>
  total_observed_volume_usdc: <number|null>
  selection_wallet_count: <int|null>
  opposite_wallet_count: <int|null>
  largest_single_wallet_share_pct: <number|null>
  liquidity_note: <description>
  source_freshness_note: <description>

sxf_poly_bettors:
  - user: <SXF POLY label/user>
    selection: <selection>
    direction: <SUPPORTS_PREFERENCE|OPPOSES_PREFERENCE|NEUTRAL_OR_HEDGED>
    amount_usdc: <number|null>
    entry_price_pct: <number|null>
    timing: <timestamp/relative time|null>
    bettor_reliability: <HIGH|MEDIUM|LOW|UNKNOWN>
    bettor_quality_status: <PROVEN|ESTABLISHED|QUALIFIED|PROVISIONAL|UNKNOWN|UNRELIABLE>
    historical_resolved_positions: <int|null>
    distinct_historical_events: <int|null>
    pnl_coverage_pct: <number|null>
    evidence_is_as_of_safe: <true|false|null>
    bettor_history_source: <SXF_POLY_ONLY|NONE>
    stake_multiple: <number|null>
    baseline_status: <VALID_20_TO_30_PRIOR|INSUFFICIENT_PRIOR|INCOMPATIBLE_STAKE_UNIT|UNAVAILABLE>
    baseline_sample_n: <int|null>
    baseline_stake_usdc: <number|null>
    odds_eligible_ge_1_40: <true|false|null>
    position_cleanliness: <CLEAN_ONE_DIRECTION|MIXED|HEDGED|REDUCED|UNKNOWN>
    net_directional_exposure_usdc: <number|null>
    credible_directional_evidence: <true|false>
    sizing_vs_user_norm: <SMALL|NORMAL|LARGE|VERY_LARGE|UNKNOWN>
    action_state: <ADDING|HOLDING|REDUCING|EXITED|HEDGED|UNKNOWN>
    reliability_basis: <what SXF POLY explicitly shows or NO EVIDENCE>
    note: <important caveat>

preference_evidence:
  supporting_factors:
    - source_layer: <GENERAL_POLYMARKET|SXF_POLY_BETTOR>
      fact: <observed fact>
      interpretation: <why it supports>
      strength: <LOW|MEDIUM|HIGH>
  opposing_factors:
    - source_layer: <GENERAL_POLYMARKET|SXF_POLY_BETTOR>
      fact: <observed fact>
      interpretation: <why it opposes>
      strength: <LOW|MEDIUM|HIGH>
  neutral_or_uncertain_factors:
    - source_layer: <GENERAL_POLYMARKET|SXF_POLY_BETTOR>
      fact: <relevant but neutral/uncertain fact>
      note: <why neutral/uncertain>

decision_audit:
  immutable_as_of_decision_id: <id|null>
  precommitted_before_settlement: <true|false>
  decision_evidence_class: <CREDIBLE_SUPPORT|CREDIBLE_OPPOSITION|MIXED|NO_QUALIFIED_BETTOR_EVIDENCE>
  decision_is_probability: false
  numerical_lift_calibrated: false
  reason_for_abstention: <text|null>
  relevant_user_count: <int|null>
  qualified_user_count: <int|null>
  caveats: []

poly_balance:
  direction: <SUPPORTS_PREFERENCE|SLIGHTLY_SUPPORTS|MIXED|SLIGHTLY_OPPOSES|OPPOSES_PREFERENCE|INSUFFICIENT_EVIDENCE>
  confidence: <LOW|MEDIUM|HIGH>
  sxf_poly_supporter_count: <int|null>
  sxf_poly_opposer_count: <int|null>
  rationale: <general Polymarket + SXF POLY bettor balance>
  caveats: []
```

Rules:
- Sizing labels are descriptive and uncalibrated: <0.25× ignore; 0.25–<0.75× small; 0.75–<1.50× normal; 1.50–<3× strong size; 3–<5× very strong size; >=5× exceptional size.
- QUALIFIED requires N>=100 resolved bets, >=60 events, positive entry edge and directional behavior. ESTABLISHED requires >=250 positions, >=150 events, >=3 active months and >=2pp entry edge; PROVEN also needs reliable positive ROI and reliable nonnegative CLV. PnL coverage must be >=90% for ROI to be decision-grade.
- Absent SXF POLY bettor snapshot or 20 comparable past positions => UNKNOWN, not an invented score.
- Credible opposing claims pass the same qualification tests as supporting claims.
- Audit ALL precommitted decisions, including abstentions.
- General market prices/volumes come from direct/public Polymarket.
- Bettor/user evidence comes only from SXF POLY.
- Raw Polymarket wallets must not be promoted into bettor evidence unless that user is present on SXF POLY.
- The historical CAPITALE 24-wallet pool must not be used for active bettor routing.
- Missing bettor reliability is `UNKNOWN`, not positive evidence.
- One user with many fills counts as one bettor position, not many independent votes.
- `poly_balance` must preserve material contrary evidence and may validly return `INSUFFICIENT_EVIDENCE`.
