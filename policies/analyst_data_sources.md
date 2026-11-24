# CAPITALE — ANALYST DATA Source Registry

Status: CANONICAL REFERENCE — owner-approved source list and research routing, 2026-11-24.
Version: 1.0
Scope: 18 named DATA sources, within existing A1/A2/A3 boundaries. No change to ANALYST v2.1 research methodology, output, or scoring. Human editorial sources are separately registered in `policies/analyst_human_sources.md` (DRAFT).

## Ordered directory — 18 sources

The order below is the owner's approved discovery priority, not a reliability ranking, fixed weight, or requirement to consult every source. Prefer official competition/club records (A1) for official match facts even when not enumerated here. Select the highest-priority suitable source for each actual data need; move to alternatives if coverage is inadequate.

### 1 — Core match statistics

| Priority | Source | Entry URL | Intended data |
| --- | --- | --- | --- |
| 1 | FotMob | https://www.fotmob.com/ | xG/xGA, shots, big chances, passes, player and match performance |
| 2 | Sofascore | https://www.sofascore.com/ | xG where available, shots, shot maps, heatmaps, match statistics |
| 3 | WhoScored | https://www.whoscored.com/ | Historical team characteristics, strengths/weaknesses, playing style; distinguish derived ratings from observations |
| 4 | Understat | https://understat.com/ | xG, shot quality and game-state splits in covered competitions |
| 5 | Flashscore | https://www.flashscore.com/ | Fixtures, results, historical match statistics and broad league coverage |
| 6 | 365Scores | https://www.365scores.com/ | Alternative match and team statistics |

### 2 — Goals and match scenarios

| Priority | Source | Entry URL | Intended data |
| --- | --- | --- | --- |
| 7 | SoccerStats | https://www.soccerstats.com/ | Goal times, first goal, home/away splits and score-state statistics |
| 8 | FootyStats | https://footystats.org/ | Historical goals, BTTS, over/under outcomes, xG and league baselines; free subset only; exclude predictions and odds |
| 9 | Footiqo | https://footiqo.com/ | Candidate xG, possession, attacking and goal statistics; verify metric and league coverage |
| 10 | Statbunker | https://www.statbunker.com/ | Competition, team and player statistical tables |
| 11 | FootyMetrics | https://www.footymetrics.com/ | Candidate team, player and referee statistics; verify availability |

### 3 — Team strength and historical comparisons

| Priority | Source | Entry URL | Intended data |
| --- | --- | --- | --- |
| 12 | Opta Power Rankings | https://theanalyst.com/articles/who-are-the-best-football-team-in-the-world-opta-power-rankings | Dated team strength ratings; do not use Opta predictions or present-day rankings as historical ratings |
| 13 | ClubElo | http://clubelo.com/ | Historical dated team strength ratings for covered clubs; exclude forecast probabilities |
| 14 | FBref | https://fbref.com/ | Historical team and player statistics; check current availability of advanced metrics |
| 15 | Soccerway | https://www.soccerway.com/ | Fixtures, results, competition and historical records |

### 4 — Raw and archival data

| Priority | Source | Entry URL | Intended data |
| --- | --- | --- | --- |
| 16 | StatsBomb Open Data | https://github.com/statsbomb/open-data | Event-level passes, shots, pressure and carries for selected competitions; obey license and attribution |
| 17 | Football-Data | https://football-data.co.uk/data | Historical CSV results and match stats; exclude every odds, market and bookmaker column before ingestion |
| 18 | xGstats | https://xgstats.com/ | Candidate xG and team/shot data; verify definitions, coverage and access |

## Research routing by data need

| Data need | First choices | Alternatives or supplementary data |
| --- | --- | --- |
| Team strength | Opta Power Rankings, ClubElo | Official standings and strength-aware historical evidence |
| Form momentum | FotMob, Sofascore | Flashscore, 365Scores, Soccerway |
| Opponent quality | Opta Power Rankings, ClubElo | Official competition records, comparable historical performance |
| Home/away | SoccerStats, FootyStats | FotMob, Statbunker |
| Playing style and possession | WhoScored, Sofascore | FotMob; StatsBomb for covered historical matches |
| Attack/defense matchup | FotMob, Understat | Sofascore, xGstats if validated |
| Goal production and concession stability | SoccerStats, FootyStats | Statbunker, Footiqo if validated |
| Finishing and chance quality | Understat, FotMob | Sofascore, FBref when available |
| Match scenarios and score states | SoccerStats, Understat | StatsBomb where covered |
| Comparable past opponents | Opta Power Rankings, ClubElo, FotMob | Soccerway, official records, Sofascore |
| Historical datasets | StatsBomb Open Data, Football-Data | FBref, Soccerway |

These routing rows describe where to find data, not new mandatory analytical factors. The active versioned methodology governs how data are used.

## Mandatory source controls

- For every material statistic record the precise match/competition/season, source URL or dataset identifier, data provider when known, retrieval time, observation time, definition/units, scope and AS_OF. Use only pre-decision information; exclude post-kickoff information for the target match.
- All sites are references for permitted football data only. Never ingest predictions, bookmaker odds, implied betting probabilities, market-flow data, current injury/news reports, other departments' reports or betting commentary. Use historical factual BTTS and goal-count statistics only as outcomes, not as predictions. If mixed content cannot be isolated, use a clean alternative.
- Access and coverage are variable. Free-to-read does not imply free automated access or redistribution. Respect access/usage/license terms; no paywall or access-control bypass. Use permitted public portions; do not assume API access or guaranteed metrics. No paid subscription required by this registry. Actual coverage, accessibility and automated rights remain to be checked per source; this is not a completed live audit.
- A1 official records retain priority for match identity and official facts. Prefer reliable underlying data for statistical claims, distinguish observation, derived metrics and interpretation. Multiple websites sharing the same upstream provider are not independent corroboration.
- Do not average conflicting xG models or treat distinct definitions as interchangeable; use a consistent provider and model for comparisons, disclose conflicts, missing coverage and sample size. Verify historical rating dates rather than applying today's ratings retrospectively.
- Record unavailable data as missing, never invent numbers, force a neutral value, or infer unsupported tactical characteristics. Do not consult all 18 sites mechanically; use relevant sources, then alternatives to fill actual gaps.
- This file is a source directory, not a new prediction model, empirical validation, or license approval. AGENTS.md, policies/source_policy.md, policies/analyst_sources.md and methods/analyst_methodology.md remain controlling.
