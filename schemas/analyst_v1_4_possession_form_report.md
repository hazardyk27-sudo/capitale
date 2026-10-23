# ANALYST v1.4 Possession-Type and Dynamic Form Schema

Status: EXPERIMENTAL
Version: 1.4.1
Extends v1.3 experimental report, preserving separate legacy immutable snapshots.

```yaml
role: ANALYST
methodology_version: analyst-v1.4.1-possession-form-experimental
fixture: <home vs away>
competition: <league or cup>
kickoff_utc: <timestamp>
as_of_utc: <timestamp>
user_preference: <exact selection or null>
scope_check:
  no_news_odds_sxf_poly_or_other_departments: true
  no_post_asof_data: true
data_quality:
  possession_profile_cutoff_verified: <true|false>
  historical_possession_profile_verified: <true|false>
  season_sample: <description>
  home_away_sample: <description>
  xg_coverage: <description or null>
  missing_fields: []
  confounders: [] # opponent strength, venue, eras, reds, score-state
  first_second_half_coverage: <complete|partial|unavailable>
  historical_strength_cutoff_verified: <true|false>
  strength_adjustment_model_usable: <true|false>
  missing_strength_or_half_inputs: []

teams:
  home:
    habitual_possession_pct: <value or null>
    habitual_possession_group: <HIGH|BALANCED|LOW|UNKNOWN>
    season_all_league_matches_chronological: [] # every league game through AS_OF with venue, opponents' historical pregame strength & possession, score, xG, xGA, shots, sot and source; no selective omission
    season_summary: {n: <int>, w: <int>, d: <int>, l: <int>, goals_for: <int>, goals_against: <int>, mean_xgd: <number or null>}
    possession_groups:
      high: 
        matches: [] # {date, opponent, opponent_prior_possession_pct, opponent_prior_strength_rating_or_null, venue, score, xg, xga, xgd, source, historical_cutoff_verified}
        first_half: {n: <int>, possession_pct_or_null: <number or null>, goals_for: <int or null>, goals_against: <int or null>, xg_per_half_or_null: <number or null>, xga_per_half_or_null: <number or null>, shots_or_null: <number or null>, sot_or_null: <number or null>}
        second_half: <same shape as first_half>
        n: <integer>
        wdl: {w: <int>, d: <int>, l: <int>}
        points_per_match: <number or null>
        goals_for_per_match: <number or null>
        goals_against_per_match: <number or null>
        xg_per_match: <number or null>
        xga_per_match: <number or null>
        xgd_per_match: <number or null>
      balanced: <same shape as high>
      low: <same shape as high>
      unknown: <list of unclassifiable matches; not neutrals>
    possession_low_minus_high_xgd: <number or null>
    pregame_opponent_strength_reference: <provider, snapshot_date, provenance or unavailable>
    strength_adjusted_group_xgd: <trained-model residual aggregate or null>
    by_half_opponent_habitual_possession_when_verified: [] # optional separate 1H/2H groups, NO inference from full-time
    form:
      latest_three_chronological: [] # LEAGUE ONLY: date, opponent, strength pregame, venue, result/score, points, xg/xga/xgd, shots/sot, possession, first-half/second-half observed data when available, expected_xgd_or_null, adjusted_xgd_or_null, source
      previous_three_chronological: []
      latest_three_avg_xgd: <number or null>
      latest_three_avg_points: <number or null>
      previous_three_avg_xgd: <number or null>
      previous_three_avg_points: <number or null>
      latest_three_xgd_trend_slope: <number or null>
      latest_match_xgd_minus_prev_two_avg: <number or null>
      latest_three_opponent_adjusted_xgd: <number or null>
      latest_one_opponent_adjusted_xgd: <number or null>
      latest_one_vs_prev_two_adjusted_change: <number or null>
      latest_one_vs_prev_two_raw_shots_change: <number or null>
      latest_one_vs_prev_two_raw_sot_change: <number or null>
      latest_one_vs_prev_two_score_and_points_change: <description>
      first_half_three_game_trend: <sourced trend or null>
      second_half_three_game_trend: <sourced trend or null>
      last_three_xgd_minus_prev_three: <number or null>
      last_three_points_minus_prev_three: <number or null>
      results_direction: <RESULTS_UP|RESULTS_DOWN|RESULTS_FLAT|MIXED|UNKNOWN>
      stats_direction: <STATS_UP|STATS_DOWN|STATS_FLAT|MIXED|UNKNOWN>
      notable_score_vs_stats_divergence: <description or null>
  away: <same structure as home>
graphics:
  chronological_result_points: <sourced points by team or null>
  chronological_xgd: <sourced xgd values by team or null>
  chronological_opponent_adjusted_xgd: <sourced residuals only with validated reference model, otherwise null>
  first_half_performance: <sourced 1H series or null>
  second_half_performance: <sourced 2H series or null>
  missing_graph_data: []
next_match_interpretation:
  supporting_evidence: []
  opposing_evidence: []
  neutral_two_sided_evidence: []
  opponent_strength_difficulty_comparison: <comparison of style, strength and venue; no assumption recent form overrides base quality>
  possession_matchup: <which opponent-type cohort is most relevant and how reliable>
  both_teams_latest_three_and_latest_one: <compare statistical and score trajectories>
  match_scenario: <how match may play; win/draw/loss paths>
  most_important_failure_path: <mechanism>
  confidence: <LOW|MEDIUM|HIGH>
  analyst_support_score_0_100: <integer or null; ordinal, uncalibrated; v1.3 gates>
```

Rules:
- Opponent style uses opponent's prior-fixture habitual possession, NOT its possession in the target encounter.
- HIGH>=55, LOW<=45, BALANCED strictly between, UNKNOWN unverified; owner-selected exploratory bins.
- Required analysis order: ALL current-season LEAGUE fixtures first, last 3 LEAGUE games second, latest 1 LEAGUE game third; half-by-half only when sourced.
- Opponent-strength difficulty must be checked alongside possession groups. Correcting observed xGD for opponent strength requires a real, validated prematch expected-xGD baseline; else show qualitative difficulty only and keep numerical residual null.
- NEVER infer 1H/2H stats from match totals or score; mark HALF_DATA_UNAVAILABLE where necessary.
- NEVER infer trend/acceleration from only latest one match; separate result form from underlying form.
- Chart real observed values only, never interpolated invented results.
- If xG absent, do not fabricate; still show sourced result and shots trends.
- Keep independent source/AS_OF and immutable settlement discipline.
