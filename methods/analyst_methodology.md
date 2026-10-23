# CAPITALE ANALYST — Active Match Analysis Method

Status: CANONICAL
Version: 2.0
Effective: 2026-10-23
Owner decision: The Torino–Monza report is the exact active presentation template, with one mandatory addition: both clubs' home/away form and opponent-by-opponent venue comparisons.

## Single active contract

For EVERY new list of fixture predictions, analyze each fixture independently, using ONLY these three numbered factors, then one short three-factor conclusion:
1. TOPA SAHIP OLMA OYUNU
2. FORM IVMESI — last 3 and last 1
3. RAKIP MANTIGI — including HOME/AWAY FORM as a mandatory subsection

The report must be demonstrably like the actual Torino–Monza analysis: fixture header; two clubs' season league matches tables and possession buckets; each team's whole-season baseline; two actual last-three performance graphs (results/points and xGD), exact latest-match changes and if possible half comparisons; separate, football-reasoned assessment of both teams' likely opponent difficulty and playstyle; explicit venue match lists comparing the host's HOME record to the visitor's AWAY record; factor comparison table and one qualified final match interpretation / lean. There is NO fourth independent factor or generic extra methodology section.

Old v1.1, v1.2, v1.3, v1.4.x decision engines, experimental ratings, v1.3 0–100 gates, side-market selection routing, standalone scoring or simulations are SUPERSEDED for NEW ANALYST runs. Their past snapshots and the Git history remain unchanged; don't erase any historical selections or as-of reports. The old modes must NEVER run alongside v2 or replace the three-factor report. Source isolation, as-of integrity, genuine missing-data reporting and historical immutability still apply.

## Scope and freshness

- Verify each target match's fixture identity, competition, kickoff and ANALYST AS_OF before gathering data; do not use observations unavailable by AS_OF, especially post-kickoff information.
- Only A1/A2/A3/A4 football match, historical statistical, opponent-strength and tactical sources are allowed. NO odds, betting markets, market-flow, SmartXFlow, Polymarket, NEWS, injury availability/current-match rumors or other departmental conclusions.
- Base sample: BOTH teams' EVERY completed league fixture in the current season, pre-AS_OF. No selective favorable/opposing omission. If the fixture is a cup tie or sides play in different divisions, visibly label league/competition differences and explain limited comparability; do not pretend equal-level leagues.
- Always distinguish retrieved observation, calculated descriptive metric, and football interpretation. Sources/cutoff for material facts, small-sample and absent data warnings are mandatory. Do not fill unavailable event stats with made-up numbers or ignore games with missing statistics.
- Team opponent-strength ratings, if used, must have verified relevant observation date. If historic Opta strength is unavailable, avoid calling today's rating the old rating. Use honest qualitative competition/opponent-level reasoning when an audited numeric match-day baseline is unavailable.

## 1. Topa sahip olma oyunu — WHO usually controls the ball

Use EACH prior opponent's own habitual possession in league matches completed PRIOR to that historical fixture (and as-of for the NEXT opponent), NOT its possession observed solely in the matchup under analysis.
- HIGH: >=55%.
- BALANCED: >45% and <55%.
- LOW: <=45%.
- UNKNOWN: unavailable/verifiably missing historical profile. Never assign missing to BALANCED.

Present for EACH club a full-season match table with: opponent (and home/away marker), prior-opponent habitual possession % or unknown, group, score W/D/L, xG–xGA or missing. Add shots/sot where sourced and useful. If there are many completed fixtures, still cover every fixture, not cherry-picked ones; compact table permissible.
Then grouped summaries (N; W-D-L; xG and xGA/xGD per game if complete or disclosed coverage), describe which opponent style corresponds to the upcoming opponent and compare opponent difficulty. A difference between buckets is not automatically caused by possession because top-possession sides tend to differ in strength and venue.
- Where actual half-level data exist: compare 1H vs 2H possession and chance creation / score. Optional separate opponent habitual 1H/2H possessions only when separately verified. Do not manufacture half xG, half possession or half-shots from full-time totals.
- If pregame possession history cannot be reconstructed, label source and distinguish current-season descriptive aggregates from verified pre-fixture values; do not falsely claim prospective backtest validity.

## 2. Form ivmesi — WHO is genuinely improving

For BOTH clubs, first show whole-season league W-D-L/points, scoring, xG/xGA/xGD and shots where available. Then show chronological LAST THREE completed LEAGUE games, and LATEST ONE specifically versus two preceding games.
Must display exactly TWO separate, real-data charts:
A. SCORE/RESULT FORM: points per game 0/1/3 for both teams (or score/goal difference where best supported). Always explain last-three scores and points.
B. UNDERLYING STAT FORM: per-match xGD (xG minus xGA) for both teams, with xG/xGA/shots/sot in a table; if full comparable xG absent, display chart using genuinely available shot/quality observations and label clearly, or state no defensible statistical chart is available. Never invent graph values.
State for each club whether last-game score is up/down versus prior two, whether true stat performance is up/down, and whether the results-versus-statistics signals diverge. When >=6 matches, last-three versus prior-three level can also be checked; do not call one good/bad match a statistically established trend.
- Interpret last-three performance in context of each game's rival difficulty, venue, game state, red-card distortions, tactical era. A win against weak opposition does not automatically signal stronger form than an honorable result versus elite opposition.
- Include 1H/2H score statistics and underlying stats only when independently sourced; denote missing.
- Do not automatically extrapolate trend slopes into a goal forecast or subjective numeric score.

## 3. Rakip mantığı — what the actual upcoming encounter means

A distinct, mandatory, plain-Turkish FOOTBALL REASONING section, with TWO team perspectives, grounded in factors 1 and 2:
- Compare the opponent each side NOW faces with the actual opponents it has recently faced; stronger/weaker/comparable at the relevant pregame period; discuss whether recent success/failure transfers to this game's difficulty. Real Madrid versus Levante example demonstrates why scoreboard alone is not comparable.
- Base strength, recent performance, habitual possession, quality of chances conceded/created, defensive vulnerability, style clashes: how would Team A's attack face Team B's defense and vice versa? Specific pressing/transition/low-block claims need event or tactical evidence; otherwise mark unsupported.
- Explain credible victory, draw, defeat pathways and how a given user-supplied selection could fail. No automatic favorite based only on last-three WDL.

### Mandatory third-pillar subsection: Ev sahibi / deplasman formu

For BOTH teams, list actual current-season LEAGUE fixtures:
- HOME TEAM: all matches played HOME (opponent by name, opponent quality and playing style/possession if sourced, date, score W/D/L, xG–xGA, shots/sot when sourced).
- AWAY TEAM: all matches played AWAY (same individual fields).
- Complementary overview: HOME TEAM's AWAY form and AWAY TEAM's HOME form across the season (at minimum W-D-L, goals, xGD where available) to distinguish a true venue effect from general team level.
- Compare the HOST's HOME results and underlying stats DIRECTLY to the VISITOR's AWAY results and underlying stats. Identify whom they played: beating a weak side at home isn't equivalent to performing versus elite opposition away. Identify opponent types (HIGH/BALANCED/LOW) in the venue analysis when genuinely documented and examine same-strength comparables when sample allows.
- Explain whether away team maintains attacking chance production away and whether home team really protects against chances at home, not only who won. Home advantage is a contextual factor, not an invented fixed numeric bonus.
- If sample small or missing, label limitation; no invented away/home results, rating or percentages.

**Positioning rule:** Home/away IS NOT a fourth numbered factor. It is a visible subsection integrated INTO factor 3 and informs factors 1 and 2.

## Conclusion — exactly like Torino–Monza

Use a short three-factor synthesis/comparison table: possession matchup; scoreboard-versus-underlying momentum; opponent quality, tactical matchup AND venue form integrated in the third row. Conclude with a brief intuitive football-match scenario and if evidence allows a clear lean (1/X/2, 1X/X2, totals etc. when relevant) with LOW/MEDIUM/HIGH descriptive uncertainty, not a fake calibrated percentage or unsupported 0–100 ANALYST score. If no confident direction: NO_CLEAR_LEAN. If user supplied picks, explicitly state whether each pick is supported/contradicted and most plausible failure route within this final evaluation; do not reorganize into older scored-support templates.

Do not append extra sections (separate simulation, stochastic models, odds, NEWS, synthetic examples, arbitrary weights) not requested. If sources missing show available real evidence, a narrow limitation, and constrained interpretation, not a false completed analysis.

## Operational requirements

For a multi-match list, repeat the same format for each fixture with source-backed numbers and timestamp; do not let analysis of one game influence another or cite another department. For a massive batch where full evidence isn't obtainable, report per-match coverage truthfully; never silently shorten the method while calling it complete.
