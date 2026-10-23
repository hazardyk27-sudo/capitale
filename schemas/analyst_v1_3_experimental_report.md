# ANALYST v1.3 Experimental Report Schema

> **HISTORICAL / SUPERSEDED as of 2026-10-23.** The owner has deactivated this methodology for ALL NEW ANALYST runs. The ONLY active CANONICAL workflow and output is `methods/analyst_methodology.md` v2.0 + `schemas/analyst_report.md` v2.0. This file is retained solely for historical audit and reproduction of originally frozen decisions; do not apply its scoring rules, routing, simulation, optional modules or report template in new analyses.

Status: SUPERSEDED (historical EXPERIMENTAL only)
Version: 1.3
Extends the frozen v1.2 experimental schema; no existing historical record is replaced.

```yaml
role: ANALYST
methodology_version: analyst-v1.3-experimental
match_id: <canonical ID>
match: <home vs away>
competition: <verified competition or null>
kickoff_utc: <timestamp or null>
as_of_utc: <timestamp>
run_at_utc: <timestamp>
selection: <user's exact preference>
selection_type: <SINGLE_WIN_HOME|SINGLE_WIN_AWAY|DOUBLE_CHANCE_1X|DOUBLE_CHANCE_X2|TOTAL_OVER_2_5|BTTS_YES|COMBINATION|OTHER>
scope_check:
  current_news_used: false
  odds_or_betting_market_used: false
  sxf_used: false
  polymarket_used: false
  other_department_used: false
  post_as_of_data_used: false
data_quality:
  same_era_match_sample: <description or null>
  home_away_sample: <description or null>
  opponent_strength_adjustment: <grounded description or unavailable>
  cup_cross_league_normalization: <grounded description or unavailable>
  source_independence: <description>
  missing_inputs: []
  uncertainty_tags: [] # AWAY_FAVORITE, CUP_MATCH, CROSS_LEAGUE, UNNORMALIZED_CROSS_LEAGUE, LOW_EVENT, SMALL_VENUE_SAMPLE, ERA_BREAK, UNKNOWN_KICKOFF
  score_confidence: <LOW|MEDIUM|HIGH>
evidence_items:
  - claim: <pre-match observation>
    evidence_direction: <SUPPORT|OPPOSE|TWO_SIDED>
    data_source: <URL/source>
    independent_root: <feed/event data source>
    observed_at_utc: <timestamp or period>
    published_at_utc: <timestamp or null>
    sample: <window and size>
    direct_selection_relevance: <explanation>
market_engine:
  win_draw_loss_paths:
    applicable: <true|false>
    win: <football mechanism or no evidence>
    draw: <football mechanism or no evidence>
    loss: <football mechanism or no evidence>
    draw_resistance_test: <why 0-0/1-1 can or cannot last>
  double_chance:
    applicable: <true|false>
    success_paths: [<win>, <draw>]
    sole_failure_path: <opponent win mechanism>
  over_2_5:
    applicable: <true|false>
    home_heavy_3plus_path: <assessment>
    away_heavy_3plus_path: <assessment>
    shared_scoring_3plus_path: <assessment>
    two_or_fewer_path: <assessment>
    zero_goal_and_clean_sheet_risks: <assessment>
  btts:
    applicable: <true|false>
    home_goal_score_0_100: <integer or null>
    away_goal_score_0_100: <integer or null>
    weaker_leg: <HOME_GOAL|AWAY_GOAL|null>
  combination:
    applicable: <true|false>
    legs: [] # exact selection, selected engine, independent score
preference_test:
  supporting_factors: []
  opposing_factors: []
  neutral_or_two_sided_factors: []
  match_commentary: <expected game states and mechanisms>
  main_failure_mode: <specific football route>
  score_status: <SCORED|SCORE_UNAVAILABLE>
  score_0_100: <integer 0-100 or null>
  score_band: <VERY_STRONG|STRONG|POSITIVE|SLIGHT_POSITIVE|BALANCED|WEAK|STRONG_OPPOSITION|null>
  high_score_gate_review: 
    independent_underlying_signals: <PASS|FAIL|UNKNOWN>
    venue_and_opponent_comparability: <PASS|FAIL|UNKNOWN>
    failure_path_reasonably_countered: <PASS|FAIL|UNKNOWN>
    cup_cross_league_quality: <PASS|FAIL|UNKNOWN|NOT_APPLICABLE>
  band_rationale: <ranked facts and limiting mechanism>
  score_confidence: <LOW|MEDIUM|HIGH>
shadow_comparison:
  frozen_v1_1_record_ref: <ref or null>
  frozen_v1_2_record_ref: <ref or null>
  v1_3_record_ref: <immutable ref>
settlement:
  status: <UNSETTLED|VERIFIED_WIN|VERIFIED_LOSS|VOID|DISPUTED>
  official_or_first_source: <URL or null>
  independent_second_source: <URL or null>
  result_regular_time: <score or null>
  extra_time_or_penalties: <details or null>
  market_period: <REGULATION|EXTRA_TIME_INCLUDED|OTHER|UNKNOWN>
  verified_at_utc: <timestamp or null>
```

Rules:
- For SINGLE_WIN, a draw is a loss; for 1X/X2 a draw is a success. Never conflate.
- For BTTS YES score cannot exceed the weaker scoring leg. For a combination it cannot exceed weakest material leg.
- Any materially FAIL/UNKNOWN high-score gate prohibits 75+ experimentally. No arbitrary numeric penalties are implied.
- UNKNOWN score may not be filled with an invented value.
- Do not double-count different sources from the same event-data root.
- Keep post-match settlement apart from the original immutable pre-match decision record.
- All 0-100 scores are ordinal football-evidence labels; not outcome probabilities.
