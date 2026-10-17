# ANALYST Experimental Report Schema

Status: EXPERIMENTAL
Version: 1.2

```yaml
role: ANALYST
methodology_version: analyst-v1.2-experimental
match_id: <canonical match id>
match: <home> vs <away>
run_at_utc: <timestamp>
as_of_utc: <timestamp>
selection_type: <SIDE|BTTS|COMBINATION|OTHER>
supplied_preference: <selection>

scope_check:
  current_news_used: false
  betting_market_used: false
  smartxflow_used: false
  polymarket_used: false
  other_department_reports_used: false
  post_match_data_used: false

data_quality:
  season_sample: <description>
  home_away_sample: <description>
  opponent_strength_sample: <description>
  era_breaks: []
  major_distortions: []
  confidence: <LOW|MEDIUM|HIGH>

side_engine:
  applicable: <true|false>
  baseline_strength: <summary or null>
  opponent_adjusted_form: <summary or null>
  home_away_structure: <summary or null>
  result_vs_underlying: <summary or null>
  matchup_mechanisms: []
  failure_modes: []

btts_engine:
  applicable: <true|false>
  home_goal_leg:
    support: <STRONG_SUPPORT|SUPPORT|BALANCED|WEAK_SUPPORT|NOT_SUPPORTED|null>
    home_xg_context: <summary or null>
    away_xga_context: <summary or null>
    zero_goal_risk: <summary or null>
    opponent_clean_sheet_risk: <summary or null>
    comparable_opponent_evidence: <summary or null>
    variance_note: <summary or null>
    matchup_note: <summary or null>
  away_goal_leg:
    support: <STRONG_SUPPORT|SUPPORT|BALANCED|WEAK_SUPPORT|NOT_SUPPORTED|null>
    away_xg_context: <summary or null>
    home_xga_context: <summary or null>
    zero_goal_risk: <summary or null>
    opponent_clean_sheet_risk: <summary or null>
    comparable_opponent_evidence: <summary or null>
    variance_note: <summary or null>
    matchup_note: <summary or null>
  limiting_leg: <HOME_GOAL|AWAY_GOAL|null>

preference_test:
  supporting_factors: []
  opposing_factors: []
  neutral_or_two_sided_factors: []
  balance: <qualitative explanation>
  verdict: <STRONG_SUPPORT|SUPPORT|BALANCED|WEAK_SUPPORT|NOT_SUPPORTED>
  confidence: <LOW|MEDIUM|HIGH>
  primary_failure_mode: <summary>

shadow_comparison:
  v1_1_verdict: <verdict if available or null>
  v1_2_verdict: <verdict>
  changed: <true|false>
  reason_for_change: <summary or null>

settlement:
  status: <UNSETTLED|VERIFIED_WIN|VERIFIED_LOSS|VOID>
  result: <score/result or null>
  verification_sources: []
  settled_at_utc: <timestamp or null>
```

Rules:
- BTTS verdict may not exceed the weaker of the two goal-leg assessments.
- Missing data is NO EVIDENCE, never neutral evidence.
- `last_5_btts`, raw H2H and raw W/D/L streaks must not be treated as independent high-weight evidence.
- Settlement information must never be used to modify the original pre-match assessment.
