# ANALYST v1.4 Possession-Type and Dynamic Form Schema

Status: EXPERIMENTAL
Version: 1.4
Extends v1.3 experimental report, preserving separate legacy immutable snapshots.

```yaml
role: ANALYST
methodology_version: analyst-v1.4-possession-form-experimental
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

teams:
  home:
    habitual_possession_pct: <value or null>
    habitual_possession_group: <HIGH|BALANCED|LOW|UNKNOWN>
    possession_groups:
      high: 
        matches: [] # {date, opponent, opponent_prior_possession_pct, venue, score, xg, xga, xgd, source}
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
    form:
      latest_three_chronological: [] # date, score, points, goals, xg, xga, xgd, shots, sot, possession, competition, venue, source
      previous_three_chronological: []
      latest_three_avg_xgd: <number or null>
      latest_three_avg_points: <number or null>
      previous_three_avg_xgd: <number or null>
      previous_three_avg_points: <number or null>
      latest_three_xgd_trend_slope: <number or null>
      latest_match_xgd_minus_prev_two_avg: <number or null>
      last_three_xgd_minus_prev_three: <number or null>
      last_three_points_minus_prev_three: <number or null>
      results_direction: <RESULTS_UP|RESULTS_DOWN|RESULTS_FLAT|MIXED|UNKNOWN>
      stats_direction: <STATS_UP|STATS_DOWN|STATS_FLAT|MIXED|UNKNOWN>
      notable_score_vs_stats_divergence: <description or null>
  away: <same structure as home>
graphics:
  chronological_result_points: <sourced points by team or null>
  chronological_xgd: <sourced xgd values by team or null>
  missing_graph_data: []
next_match_interpretation:
  supporting_evidence: []
  opposing_evidence: []
  neutral_two_sided_evidence: []
  possession_matchup: <which opponent-type cohort is most relevant and how reliable>
  both_teams_latest_three_and_latest_one: <compare statistical and score trajectories>
  match_scenario: <how match may play; win/draw/loss paths>
  most_important_failure_path: <mechanism>
  confidence: <LOW|MEDIUM|HIGH>
  analyst_support_score_0_100: <integer or null; ordinal, uncalibrated; v1.3 gates>
```

Rules:
- Opponent style uses opponent's prior-fixture habitual possession, NOT its possession in the target encounter.
- HIGH>=53, LOW<=47, BALANCED strictly between, UNKNOWN unverified; bins exploratory.
- NEVER infer trend/acceleration from only latest one match; separate result form from underlying form.
- Chart real observed values only, never interpolated invented results.
- If xG absent, do not fabricate; still show sourced result and shots trends.
- Keep independent source/AS_OF and immutable settlement discipline.
