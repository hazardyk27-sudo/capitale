# NEWS Report Schema

Status: CANONICAL
Version: 1.2

```yaml
role: NEWS
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
as_of_utc: <decision timestamp>
prompt_version: <version>
methodology_version: news-v1.2

scope_check:
  betting_market_data_used: false
  smartxflow_used: false
  polymarket_used: false
  other_department_reports_used: false

preference_context:
  supplied: <true|false>
  preference: <user supplied selection|null>
  family: <SIDE|GOALS_BTTS|null>

availability:
  home:
    - player: <name>
      status: <OUT|DOUBTFUL|QUESTIONABLE|AVAILABLE|UNKNOWN>
      source_tier: <N1|N2|N3|N4>
      usage: <minutes/starts/appearances or unknown>
      absence_recency: <NEW|RECENT|LONG_TERM_ALREADY_ABSORBED|NOT_APPLICABLE|UNKNOWN>
      absence_importance: <LOW|MODERATE|HIGH|VERY_HIGH>
      absence_effect: <LOW|MODERATE|HIGH|VERY_HIGH>
      replacement: <name or unknown>
      replacement_confidence: <LOW|MEDIUM|HIGH>
      replacement_fit: <WEAKER|SIMILAR|DIFFERENT_ROLE|MAKE_SHIFT|UNKNOWN>
      structural_effect: <description>
      note: <why effect differs from importance if relevant>
  away: []

absence_chains:
  - team: <home|away>
    affected_unit: <e.g. central midfield / defence / attack>
    members: [<player/event>, <player/event>]
    mechanism: <how the items interact>
    amplification: <LOW|MODERATE|HIGH|VERY_HIGH>
    double_counting_risk: <description or none>

manager_context:
  home:
    material_statements: []
    ignored_generic_statements: []
  away:
    material_statements: []
    ignored_generic_statements: []

motivation:
  home: <concrete evidence or none>
  away: <concrete evidence or none>

off_field:
  home: []
  away: []

schedule_travel:
  home:
    burden: <material burden or none>
    interaction_with_depth: <description or none>
  away:
    burden: <material burden or none>
    interaction_with_depth: <description or none>

weather_pitch:
  material: <true|false>
  impact: <description or none>

preference_evidence:
  supporting_factors:
    - fact: <verified/well-supported NEWS fact>
      lineup_or_preparation_change: <what changes>
      football_mechanism: <why it matters on field>
      why_it_supports: <selection-specific explanation>
      source_tier: <N1|N2|N3|N4>
      confidence: <LOW|MEDIUM|HIGH>
  opposing_factors:
    - fact: <verified/well-supported NEWS fact>
      lineup_or_preparation_change: <what changes>
      football_mechanism: <why it matters on field>
      why_it_opposes: <selection-specific explanation>
      source_tier: <N1|N2|N3|N4>
      confidence: <LOW|MEDIUM|HIGH>
  neutral_or_uncertain_factors:
    - fact: <relevant but directionally neutral/uncertain item>
      note: <why neutral/uncertain or why causal chain is incomplete>

news_balance:
  direction: <SUPPORTS_PREFERENCE|SLIGHTLY_SUPPORTS|MIXED|SLIGHTLY_OPPOSES|OPPOSES_PREFERENCE|INSUFFICIENT_EVIDENCE>
  rationale: <short descriptive NEWS-only synthesis>

news_confidence_score:
  applicable: <true|false>
  total: <0-100|null>
  band: <VERY_STRONG_NEWS_EVIDENCE|STRONG_NEWS_EVIDENCE|MODERATE_STRONG_NEWS_EVIDENCE|MODERATE_NEWS_EVIDENCE|WEAK_MIXED_NEWS_EVIDENCE|INSUFFICIENT_OR_UNRELIABLE_NEWS_EVIDENCE|null>
  components:
    source_reliability_verification: <0-25|null>
    freshness_match_relevance: <0-20|null>
    causal_connection_to_selection: <0-25|null>
    structural_impact: <0-20|null>
    resistance_to_opposing_evidence_uncertainty: <0-10|null>
  probability_warning: "This is NEWS evidence confidence, not win probability."
  rationale: <brief scoring explanation>

net_news_impact:
  home: <POSITIVE|NEGATIVE|MIXED|NEUTRAL>
  away: <POSITIVE|NEGATIVE|MIXED|NEUTRAL>
  confidence: <LOW|MEDIUM|HIGH>
  rationale: <summary>

failure_modes:
  - <main pre-match counter-case that could make NEWS effect weaker than expected>

unresolved_items: []

sources:
  - source: <source>
    tier: <N1|N2|N3|N4>
    observed_at: <timestamp>
    claim: <supported claim>
    status: <VERIFIED|LIKELY|UNCONFIRMED>

post_match_review: # optional; populated only after settlement and never used to mutate prematch fields
  settled: <true|false>
  selection_result: <HIT|MISS|VOID|UNKNOWN>
  predicted_news_mechanism_observed: <YES|PARTIAL|NO|UNKNOWN>
  process_note: <whether expected structural effect appeared on field>
  failure_tags:
    - <REPLACEMENT_EFFECT_UNDERESTIMATED|REPLACEMENT_EFFECT_OVERESTIMATED|ABSENCE_ALREADY_ABSORBED|ABSENCE_CHAIN_MISREAD|ROTATION_MISREAD|SOURCE_UNCERTAINTY|CAUSAL_LINK_TOO_WEAK|OPPOSING_NEWS_UNDERWEIGHTED|MATCH_STATE_VARIANCE|FINISHING_VARIANCE>
```

## Rules

- `preference_evidence` and `news_confidence_score` are directional only when the user supplies a specific selection.
- The selection family determines which NEWS mechanisms are relevant; it does not authorize odds/market research.
- Every material supporting/opposing factor should satisfy: `fact -> lineup/role/preparation change -> football mechanism -> preference effect`.
- Missing information is not a neutral factor; it is no evidence.
- Supporting and opposing evidence must both be preserved when material conflict exists.
- Interacting absences may form one structural chain and must not be double-counted as independent confirmation.
- Long-term/already-absorbed absences should normally receive lower marginal match-specific effect than new absences, unless current evidence shows adaptation failure.
- `news_confidence_score.total` is the sum of 25 + 20 + 25 + 20 + 10 component maxima.
- The 0-100 NEWS confidence score is NOT a selection win probability.
- `news_balance` and `news_confidence_score` summarize NEWS evidence only and must never become a betting recommendation or use market data.
- Post-match review may assess result and process, but later information must never alter the original prematch NEWS fields.
