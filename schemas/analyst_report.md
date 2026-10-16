# ANALYST Report Schema

Status: CANONICAL
Version: 1.1

```yaml
role: ANALYST
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
prompt_version: <version>
methodology_version: analyst-v1.1

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
  opponent_adjusted_form: <summary or null>
  result_vs_underlying: <summary or null>
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
  opponent_adjusted_form: <summary or null>
  result_vs_underlying: <summary or null>
  stable_strengths: []
  stable_weaknesses: []
  uncertainties: []

matchup:
  mechanisms_favoring_home: []
  mechanisms_favoring_away: []
  key_tactical_conflicts: []
  game_state_sensitivities: []

# Use when the user supplies an explicit preference/selection.
preference_test:
  supplied_preference: <selection or null>
  supporting_factors: []
  opposing_factors: []
  neutral_or_two_sided_factors: []
  balance: <qualitative explanation of which evidence matters most and why>
  verdict: <STRONG_SUPPORT|SUPPORT|BALANCED|WEAK_SUPPORT|NOT_SUPPORTED|null>
  confidence: <LOW|MEDIUM|HIGH|null>
  limiting_leg: <for combinations, weakest leg or null>

# Use for generic ANALYST requests; may be omitted/null when a supplied preference is the primary task.
analyst_lean:
  direction: <HOME|AWAY|DRAWISH|TOTALS_UP|TOTALS_DOWN|MIXED|NO_CLEAR_LEAN|null>
  confidence: <LOW|MEDIUM|HIGH|null>
  rationale: <football-only explanation or null>

evidence_items:
  - source: <source>
    observed_at: <timestamp or period>
    claim: <supported claim>
    evidence_type: <OBSERVATION|DERIVED|EXPERT_CORROBORATION>
```

Rules:
- The schema does not permit odds/value/news/SmartXFlow/Polymarket fields.
- Missing evidence is not a neutral factor.
- Supporting/opposing factors are not counted as equal votes; `balance` must reflect evidence quality, sample, opponent strength, comparability, recency and relevance.
- For combination preferences, test each leg and identify the limiting leg.
- `verdict` is an ANALYST evidence-support label, not a calibrated probability, stake, value assessment, or FINAL category.
