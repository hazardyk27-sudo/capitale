# NEWS MATCH IMPACT — Report Schema

Status: CANONICAL
Version: 1.4
Supersedes: NEWS report schema v1.3 for new runs

```yaml
role: NEWS
methodology_version: news-match-impact-v1.4
match_id: <match ID or explicitly unknown>
match: <home> vs <away>
competition: <verified competition>
kickoff_utc: <timestamp>
as_of_utc: <timestamp>
run_at_utc: <timestamp>
user_preferences: [<zero or more user supplied selections>]

independence:
  odds_or_betting_markets_used: false
  smartxflow_used: false
  polymarket_used: false
  other_department_reports_used: false
  data_after_as_of_used: false

news_scan:
  manager: <COVERED|NO_EVIDENCE|LIMITED>
  fans_and_stadium: <COVERED|NO_EVIDENCE|LIMITED>
  local_press: <COVERED|NO_EVIDENCE|LIMITED>
  players: <COVERED|NO_EVIDENCE|LIMITED>
  match_stakes: <COVERED|NO_EVIDENCE|LIMITED>
  club_off_field: <COVERED|NO_EVIDENCE|LIMITED>
  squad: <COVERED|NO_EVIDENCE|LIMITED>
  preparation: <COVERED|NO_EVIDENCE|LIMITED>

match_atmosphere: <short source-based Turkish explanation for both clubs>

stories:
  - id: H1
    topic: <one or more of eight news families>
    club: <HOME|AWAY|BOTH>
    verified_news: <sourced fact; no invented detail>
    plausible_match_mechanism: <brief, conditional explanation>
    evidence_status: <VERIFIED|WELL_SUPPORTED|DISPUTED|NO_EVIDENCE>
    source_refs:
      - url: <traceable source URL>
        tier: <N1|N2|N3|N4>
        published_at: <timestamp or unknown>
        observed_at: <timestamp>
        available_by_as_of: <true|false|unknown>
    # Exact integers -3..+3; disputed/no-evidence stories must not receive positive/negative points.
    impact:
      home_win_1: <integer -3..3>
      draw_x: <integer -3..3>
      away_win_2: <integer -3..3>
      over_2_5: <integer -3..3>
      under_2_5: <integer -3..3>
      btts_yes: <integer -3..3>
      btts_no: <integer -3..3>
    brief_reason_per_market: <brief explanation, zero where no supported effect>

totals:
  home_win_1: <sum of stories[*].impact.home_win_1>
  draw_x: <sum of stories[*].impact.draw_x>
  away_win_2: <sum of stories[*].impact.away_win_2>
  over_2_5: <sum of stories[*].impact.over_2_5>
  under_2_5: <sum of stories[*].impact.under_2_5>
  btts_yes: <sum of stories[*].impact.btts_yes>
  btts_no: <sum of stories[*].impact.btts_no>

evidence_gaps: [<relevant uncovered or limited topics>]
user_preference_news_assessment: <short comparison to totals; no win probability>
scoring_status: UNCALIBRATED_ORDINAL_NEWS_IMPACT
no_betting_recommendation: true

post_match_review: <absent in original pre-match report; separate record after kickoff>
```

## Enforced rules

1. Each H# row refers to exactly one independent news story/underlying cause. Repeat stories across publications are clustered, not double counted.
2. Output all **seven** columns for every story and seven totals for every match, even when user supplies only one market selection or none.
3. Individual integers strictly range from -3 to +3. Summary and table TOTAL fields must equal signed arithmetic sum with no normalizing multiplier or hidden weights.
4. `over_2_5 + under_2_5 = 0` and `btts_yes + btts_no = 0` for each story as complementary impact directions; when no credible goal-market link, each pair is 0/0. The three 1X2 columns have no forced zero-sum restriction.
5. `NO_EVIDENCE` is not a verified neutral fact. Keep gaps explicit. If no credible scored news exists, seven totals are 0 with declared `INSUFFICIENT NEWS EVIDENCE`, not balanced prediction or 50% probability.
6. Retain AS_OF, source policy, both-team research, verification and independent NEWS isolation. Do not use market/odds/team statistical department inputs, or later results to modify the pre-match report.
7. Present the exact five-part human-readable output specified in `roles/news.md` and `prompts/news_start.md`; do not display raw YAML unless explicitly requested.
8. Legacy v1.2/v1.3 numeric-confidence and three-axis-only output models are SUPERSEDED for new v1.4 runs; do not add them to the new output.
