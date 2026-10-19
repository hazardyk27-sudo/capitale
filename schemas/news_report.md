# NEWS Report Schema

Status: CANONICAL
Version: 1.3

```yaml
role: NEWS
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
as_of_utc: <decision timestamp>
prompt_version: <version>
methodology_version: news-v1.3

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
      fact_verification: <VERIFIED|PROBABLE|CONFLICTED|INSUFFICIENT>
      source_ids: []
      usage: <minutes/starts/appearances or unknown>
      absence_recency: <NEW|RECENT|LONG_TERM_ALREADY_ABSORBED|NOT_APPLICABLE|UNKNOWN>
      absence_importance: <LOW|MODERATE|HIGH|VERY_HIGH>
      absence_effect: <LOW|MODERATE|HIGH|VERY_HIGH>
      replacement: <name or unknown>
      replacement_confidence: <LOW|MEDIUM|HIGH>
      replacement_fit: <WEAKER|SIMILAR|DIFFERENT_ROLE|MAKE_SHIFT|UNKNOWN>
      replacement_source_ids: []
      prior_adaptation: <DOCUMENTED|NOT_DOCUMENTED|UNKNOWN>
      compensation_assessment: <mitigation or UNKNOWN>
      effect_confidence: <HIGH|MEDIUM|LOW|INSUFFICIENT>
      structural_effect: <description>
      note: <why effect differs from importance if relevant>
  away: []

absence_chains:
  - team: <home|away>
    affected_unit: <e.g. central midfield / defence / attack>
    members: [<player/event>, <player/event>]
    mechanism: <how the items interact>
    amplification: <LOW|MODERATE|HIGH|VERY_HIGH|UNPROVEN>
    interaction_evidence: <traceable evidence or UNPROVEN>
    compensation_review: <mitigation or UNKNOWN>
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
      effect_confidence: <HIGH|MEDIUM|LOW|INSUFFICIENT>
      compensation_checked: <true|false>
  opposing_factors:
    - fact: <verified/well-supported NEWS fact>
      lineup_or_preparation_change: <what changes>
      football_mechanism: <why it matters on field>
      why_it_opposes: <selection-specific explanation>
      source_tier: <N1|N2|N3|N4>
      effect_confidence: <HIGH|MEDIUM|LOW|INSUFFICIENT>
      compensation_checked: <true|false>
  neutral_or_uncertain_factors:
    - fact: <relevant but directionally neutral/uncertain item>
      note: <why neutral/uncertain or why causal chain is incomplete>

news_balance:
  direction: <SUPPORTS_PREFERENCE|SLIGHTLY_SUPPORTS|MIXED|SLIGHTLY_OPPOSES|OPPOSES_PREFERENCE|INSUFFICIENT_EVIDENCE>
  rationale: <short descriptive NEWS-only synthesis>

three_axis_assessment:
  fact_verification: <VERIFIED|PROBABLE|CONFLICTED|INSUFFICIENT>
  fact_rationale: <source identity and AS_OF freshness>
  effect_confidence: <HIGH|MEDIUM|LOW|INSUFFICIENT>
  effect_rationale: <incremental mechanism after compensation>
  preference_relevance: <DIRECT|CONDITIONAL|UNSUPPORTED|NOT_APPLICABLE>
  preference_direction: <SUPPORTS_PREFERENCE|SLIGHTLY_SUPPORTS|MIXED|SLIGHTLY_OPPOSES|OPPOSES_PREFERENCE|INSUFFICIENT_EVIDENCE>
  counterhypothesis: <plausible mitigation or UNKNOWN>
  scoring_status: NOT_CALIBRATED
  preference_support_score: null

news_confidence_score: # DEPRECATED v1.2, compatibility only
  applicable: false
  total: null
  band: null
  components: null
  rationale: "uncalibrated v1.2 0-100 rubric superseded"

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
    published_at: <timestamp or UNKNOWN>
    fetched_at: <timestamp>
    available_by_as_of: <true|false|unknown>
    source_url: <link or ID>
    claim: <supported claim>
    status: <VERIFIED|LIKELY|UNCONFIRMED>

post_match_review: # separate immutable audit record; do not modify prematch
  settled: <true|false>
  selection_result: <HIT|MISS|VOID|UNKNOWN>
  predicted_news_mechanism_observed: <YES|PARTIAL|NO|UNKNOWN>
  prematch_fact_correct: <YES|NO|UNKNOWN>
  outcome_not_news_accuracy: true
  process_note: <whether expected structural effect appeared on field>
  failure_tags:
    - <REPLACEMENT_EFFECT_UNDERESTIMATED|REPLACEMENT_EFFECT_OVERESTIMATED|ABSENCE_ALREADY_ABSORBED|ABSENCE_CHAIN_MISREAD|ROTATION_MISREAD|SOURCE_UNCERTAINTY|CAUSAL_LINK_TOO_WEAK|OPPOSING_NEWS_UNDERWEIGHTED|MATCH_STATE_VARIANCE|FINISHING_VARIANCE>
```

## Rules

- NEWS v1.3 requires distinct fact verification, compensation-adjusted effect confidence, and preference relevance. Source and AS_OF trace per material claim.
- Every directional news factor needs a complete verified fact -> incremental change -> replacement/compensation review -> football mechanism -> preference-effect chain. Otherwise abstain.
- Unknown replacement is UNKNOWN rather than poor replacement. Do not infer outcome or team baseline from NEWS.
- For genuine two-way evidence use MIXED; for missing causal/source evidence use INSUFFICIENT_EVIDENCE. Missing data is not neutral.
- No independent double-counting of common root causes or chains.
- v1.2 numeric 0-100 confidence/support values are SUPERSEDED for new runs. Legacy numeric fields null; historic reports unchanged.
- Post-match audits append separately; no decision leakage or modification of prematch snapshots.
- Odds, SmartXFlow, Polymarket and other department reports prohibited.
