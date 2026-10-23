# CAPITALE ANALYST — Active Report Schema

Status: CANONICAL
Version: 2.0
Method: methods/analyst_methodology.md v2.0
Effective: 2026-10-23
Prior canonical report schema v1.1 and experimental schemas v1.2/v1.3/v1.4.x are SUPERSEDED for NEW analyses, retained in git history.

```yaml
role: ANALYST
methodology_version: analyst-v2.0-canonical
match: <verified home vs away>
competition: <verified league / cup>
kickoff_utc: <timestamp or unknown>
as_of_utc: <timestamp>
user_selection: <exact user pick or null>
provenance:
  league_season: <season>
  sources: [] # URLs per claim/match, with pregame temporal cutoff
  pregame_habitual_possession_verified: <true|false>
  pregame_opponent_strength_verified: <true|false>
  stats_coverage_by_fixture: []
  half_level_coverage: <complete|partial|unavailable>
  not_allowed_inputs_used: false
  missing_inputs: []
pillar_1_possession_game:
  home_team:
    habitual_possession_pct: <number or null>
    league_all_matches: [] # chronological, NO omission: {date, venue, opponent, opponent_habitual_possession_pct, group, score, result, xg, xga, shots, shots_on_target, strength_quality_context, source}
    groups:
      high: {n: <int>, wdl: <string>, mean_xg: <number|null>, mean_xga: <number|null>, mean_xgd: <number|null>}
      balanced: <same>
      low: <same>
      unknown: <list>
    first_half_summary: <sourced comparisons or null>
    second_half_summary: <sourced comparisons or null>
  away_team: <same structure>
  upcoming_opponent_type_relevance: <comparison with group WDL and source limitations>
pillar_2_form_momentum:
  home_team:
    season_aggregate: <w-d-l, points, goals, xg/xga/xgd, shots/sot where sourced>
    last_three_league_chronological: [] # each {opponent, date, venue, quality, score, points, xg, xga, xgd, shots, sot, 1h_and_2h_when_sourced}
    latest_league_game: <match details>
    latest_vs_preceding_two_score_momentum: <description>
    latest_vs_preceding_two_stat_momentum: <description>
    scored_results_vs_stats_divergence: <description>
  away_team: <same structure>
  graph_A_result_points: <REAL chronological points for each team or missing-data>
  graph_B_underlying_xgd: <REAL chronological xGD for each team or missing-data>
  half_specific_form_when_sourced: <description or null>
pillar_3_opponent_logic:
  home_team_perspective: <current opponent level versus past opponents, transferable form, realistic tactical routes>
  away_team_perspective: <same>
  mandatory_home_away_subsection:
    home_team_ALL_home_league_matches: [] # {date, opponent, opponent_quality, opponent_possession_group_if_known, score, result, xg, xga, shots, sot}
    away_team_ALL_away_league_matches: [] # same
    home_team_other_away_aggregate: <w-d-l, goals, xgd or null>
    away_team_other_home_aggregate: <w-d-l, goals, xgd or null>
    home_at_home_vs_away_away: <direct strength-, style-, venue-aware qualitative comparison>
    venue_small_sample_and_missing_data: []
  likely_match_dynamics: <football reading with grounded caveats>
  credible_win_draw_loss_paths: <plausible paths or unsupported>
conclusion:
  three_factor_comparison_table: <ONLY three rows: possession, form momentum, opponent logic including home/away>
  supporting_and_opposing_evidence_for_user_pick: <when user selection supplied>
  most_important_failure_mode: <specific football mechanism>
  analyst_lean: <HOME|AWAY|DRAWISH|1X|X2|TOTALS_UP|TOTALS_DOWN|MIXED|NO_CLEAR_LEAN>
  evidence_confidence: <LOW|MEDIUM|HIGH>
  short_rationale: <grounded readable Turkish>
```

Strict presentation: title/match timestamp, **1. Topa sahip olma oyunu**, **2. Form ivmesi — son 3 ve son maç**, **3. Rakip mantığı** with clearly labeled **Ev sahibi/deplasman formu** within #3, **Üç faktörün birleşik sonucu**. This is exactly the prior Torino–Monza layout with mandatory venue comparison; do not add/remove numbered factors, discretionary 0–100 score, stochastic prediction or market/news inputs. Graph source values must be authentic. Do not claim fully covered league matches, possession histories or half-time statistics when unavailable.
