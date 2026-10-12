# NEWS Report Schema

Status: CANONICAL
Version: 1.0

```yaml
role: NEWS
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: news-v1.0

scope_check:
  betting_market_used: false
  smartxflow_used: false
  polymarket_used: false
  other_department_reports_used: false

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
