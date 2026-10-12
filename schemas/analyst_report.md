# ANALYST Report Schema

Status: CANONICAL
Version: 1.0

```yaml
role: ANALYST
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: analyst-v1.0

scope_check:
  current_news_used: false
  betting_market_used: false
  smartxflow_used: false
  polymarket_used: false
  other_department_reports_used: false

data_quality:
  season_sample: <description>
  era_breaks: []
  major_distortions: []
  confidence: <LOW|MEDIUM|HIGH>

home_team:
  identity: <summary>
  performance_windows:
    last_1: <evidence or null>
    last_5: <evidence or null>
    last_10: <evidence or null>
    last_20: <evidence or null>
  stable_strengths: []
  stable_weaknesses: []
  uncertainties: []

away_team:
  identity: <summary>
  performance_windows:
    last_1: <evidence or null>
    last_5: <evidence or null>
    last_10: <evidence or null>
    last_20: <evidence or null>
  stable_strengths: []
  stable_weaknesses: []
  uncertainties: []

matchup:
  mechanisms_favoring_home: []
  mechanisms_favoring_away: []
  key_tactical_conflicts: []
  game_state_sensitivities: []

analyst_lean:
  direction: <HOME|AWAY|DRAWISH|TOTALS_UP|TOTALS_DOWN|MIXED|NO_CLEAR_LEAN>
  confidence: <LOW|MEDIUM|HIGH>
  rationale: <football-only explanation>

evidence_items:
  - source: <source>
    observed_at: <timestamp or period>
    claim: <supported claim>
    evidence_type: <OBSERVATION|DERIVED|EXPERT_CORROBORATION>
```

The schema does not permit odds/value/news/SmartXFlow/Polymarket fields.
