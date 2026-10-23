# ANALYST Experimental Report Schema

> **HISTORICAL / SUPERSEDED as of 2026-10-23.** The owner has deactivated this methodology for ALL NEW ANALYST runs. The ONLY active CANONICAL workflow and output is `methods/analyst_methodology.md` v2.0 + `schemas/analyst_report.md` v2.0. This file is retained solely for historical audit and reproduction of originally frozen decisions; do not apply its scoring rules, routing, simulation, optional modules or report template in new analyses.

Status: SUPERSEDED (historical EXPERIMENTAL only)
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
    support_score_0_100: <0-100 or null>
    home_xg_context: <summary or null>
    away_xga_context: <summary or null>
    zero_goal_risk: <summary or null>
    opponent_clean_sheet_risk: <summary or null>
    comparable_opponent_evidence: <summary or null>
    variance_note: <summary or null>
    matchup_note: <summary or null>
  away_goal_leg:
    support_score_0_100: <0-100 or null>
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
  match_commentary: <how the match is likely to play, which game states support/break the preference>
  balance: <qualitative explanation of which evidence matters most and why>
  support_score_0_100: <integer 0-100>
  score_band: <VERY_STRONG|STRONG|POSITIVE|SLIGHT_POSITIVE|BALANCED|WEAK|STRONG_OPPOSITION>
  confidence: <LOW|MEDIUM|HIGH>
  primary_failure_mode: <summary>

shadow_comparison:
  v1_1_verdict: <verdict if available or null>
  v1_2_support_score_0_100: <0-100>
  changed_materially: <true|false>
  reason_for_change: <summary or null>

settlement:
  status: <UNSETTLED|VERIFIED_WIN|VERIFIED_LOSS|VOID>
  result: <score/result or null>
  verification_sources: []
  settled_at_utc: <timestamp or null>
```

Rules:
- The 0-100 score is an ANALYST football-support score, not a win probability, implied probability, value score, stake score, or FINAL category.
- Operational bands: 85-100 VERY_STRONG; 75-84 STRONG; 65-74 POSITIVE; 55-64 SLIGHT_POSITIVE; 45-54 BALANCED; 35-44 WEAK; 0-34 STRONG_OPPOSITION.
- Scores are not produced by simple factor counting; balance evidence by data quality, sample, opponent strength, home/away relevance, structural comparability, exact selection relevance, evidence independence, and failure modes.
- BTTS score may not exceed the weaker of the two goal-leg scores.
- Combination score may not exceed the weakest material leg score.
- Missing data is NO EVIDENCE, never neutral evidence.
- `last_5_btts`, raw H2H and raw W/D/L streaks must not be treated as independent high-weight evidence.
- Settlement information must never be used to modify the original pre-match assessment.
