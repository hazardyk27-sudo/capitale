# NEWS Report Schema

Status: CANONICAL
Version: 1.1

```yaml
role: NEWS
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: news-v1.1

scope_check:
  betting_market_used: false
  smartxflow_used: false
  polymarket_used: false
  other_department_reports_used: false

preference_context:
  supplied: <true|false>
  preference: <user supplied selection|null>

availability:
  home:
    - player: <name>
      status: <OUT|DOUBTFUL|QUESTIONABLE|AVAILABLE|UNKNOWN>
      source_tier: <N1|N2|N3|N4>
      absence_importance: <LOW|MODERATE|HIGH|VERY_HIGH>
      absence_effect: <LOW|MODERATE|HIGH|VERY_HIGH>
      replacement: <name or unknown>
      replacement_confidence: <LOW|MEDIUM|HIGH>
      note: <why effect differs from importance if relevant>
  away: []

manager_context:
  home: <material current context or none>
  away: <material current context or none>

motivation:
  home: <concrete evidence or none>
  away: <concrete evidence or none>

off_field:
  home: []
  away: []

schedule_travel:
  home: <material burden or neutral>
  away: <material burden or neutral>

weather_pitch:
  material: <true|false>
  impact: <description or none>

preference_evidence:
  supporting_factors:
    - fact: <verified/well-supported NEWS fact>
      why_it_supports: <match-specific explanation>
      confidence: <LOW|MEDIUM|HIGH>
  opposing_factors:
    - fact: <verified/well-supported NEWS fact>
      why_it_opposes: <match-specific explanation>
      confidence: <LOW|MEDIUM|HIGH>
  neutral_or_uncertain_factors:
    - fact: <relevant but directionally neutral/uncertain item>
      note: <why neutral/uncertain>

news_balance:
  direction: <SUPPORTS_PREFERENCE|SLIGHTLY_SUPPORTS|MIXED|SLIGHTLY_OPPOSES|OPPOSES_PREFERENCE|INSUFFICIENT_EVIDENCE>
  confidence: <LOW|MEDIUM|HIGH>
  rationale: <short descriptive synthesis; not a betting recommendation>

net_news_impact:
  home: <POSITIVE|NEGATIVE|MIXED|NEUTRAL>
  away: <POSITIVE|NEGATIVE|MIXED|NEUTRAL>
  confidence: <LOW|MEDIUM|HIGH>
  rationale: <summary>

unresolved_items: []

sources:
  - source: <source>
    tier: <N1|N2|N3|N4>
    observed_at: <timestamp>
    claim: <supported claim>
    status: <VERIFIED|LIKELY|UNCONFIRMED>
```

Rules:
- `preference_evidence` is populated only when the user supplies a specific selection.
- Missing information is not a neutral factor; it is no evidence.
- Supporting and opposing evidence must both be preserved when material conflict exists.
- `news_balance` summarizes NEWS evidence only and must never become a betting recommendation or use market data.
