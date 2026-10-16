# POLY Report Schema

Status: CANONICAL
Version: 1.1

```yaml
role: POLY
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: poly-v1.1

preference_context:
  supplied: <true|false>
  preference: <user supplied selection|null>

scope_check:
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

poly_balance:
  direction: <SUPPORTS_PREFERENCE|SLIGHTLY_SUPPORTS|MIXED|SLIGHTLY_OPPOSES|OPPOSES_PREFERENCE|INSUFFICIENT_EVIDENCE>
  confidence: <LOW|MEDIUM|HIGH>
  sxf_poly_supporter_count: <int|null>
  sxf_poly_opposer_count: <int|null>
  rationale: <general Polymarket + SXF POLY bettor balance>
  caveats: []
```

Rules:
- General market prices/volumes come from direct/public Polymarket.
- Bettor/user evidence comes only from SXF POLY.
- Raw Polymarket wallets must not be promoted into bettor evidence unless that user is present on SXF POLY.
- The historical CAPITALE 24-wallet pool must not be used for active bettor routing.
- Missing bettor reliability is `UNKNOWN`, not positive evidence.
- One user with many fills counts as one bettor position, not many independent votes.
- `poly_balance` must preserve material contrary evidence and may validly return `INSUFFICIENT_EVIDENCE`.
