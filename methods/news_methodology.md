# NEWS MATCH IMPACT — Methodology

Status: CANONICAL
Version: 1.4
Supersedes: NEWS v1.3 three-axis qualitative-only user-facing research workflow and NEWS v1.2 five-part numerical confidence. Preserves CAPITALE source isolation, uncertainty, deduplication and AS_OF governance.

## Research workflow (in this order)

1. Establish exact match, both teams, competition, kickoff and pre-match AS_OF timestamp; reject sources published later.
2. Look at BOTH clubs symmetrically. Search official club, federation and competition communications; pre-match manager and player statements; credible local press; substantiated supporter organizations and fan discussion; club/off-field reporting; squad reports; rest/travel/weather when material.
3. Search ALL eight mandatory topic families: manager, fans/stadium, local press, players, match stakes, club/off-field, squad, preparation. The user selection never narrows the topics. Do not default to an injury list.
4. Identify distinct news **stories**, not snippets or headlines. Cluster common causes (e.g. a protest described by five outlets, an absence mentioned in multiple articles) under a single H#.
5. For each H#: record original claim, publication/as-of eligibility, N1/N2/N3/N4 source reliability, home/away/both, specific football/atmosphere mechanism and the best plausible counter-explanation. Source facts and speculative on-field interpretation are separate. N4 alone may not yield scored fact.
6. Apply integer −3..+3 effects on every market column: `1, X, 2, O25, U25, BTTS_YES, BTTS_NO`. There is NO requirement for the scores of 1/X/2 to sum to zero. Per H# each binary pair should be reciprocal or 0/0.
7. Make arithmetic exact: total of each column = sum of that column's H# values. Verify TOTAL rows equal summary scores.
8. Surface the seven totals regardless of whether the user gave a 1X2, Over or KG preference, and explain the submitted selection in one short conclusion. If no verified material stories exist, say that evidence is insufficient instead of claiming neutrality.
9. Snapshot the original sources, timestamps, scores and version. Post-match outcomes belong only in an independent evaluation ledger; never rescore the pre-match run.

## Point guidance, applied PER story PER outcome

- **+3 / −3**: a very concrete, verified, unusually material news development with a clear mechanism; rare.
- **+2 / −2**: credible relevant change with moderate expected match/market implication.
- **+1 / −1**: small, plausible current-news tailwind/headwind.
- **0**: no supportable relationship or genuinely indeterminate direction. If the underlying topic was not sourced, state `NO_EVIDENCE` separately; do not falsely count 0 as observed neutrality.

Score strength depends on the CURRENT NEWS mechanism, not how often the story was mentioned, how famous a player is, how confident a fan sounds or how strong a team is historically. Context such as coach admission of defensive disorganization can support opponent scoring/Over if a credible link exists; a generic pre-match "we will attack" does not automatically justify +3 Over or KG Yes. Disagreements between quality sources remain labeled as uncertainty; cap or withhold points as appropriate. New absences are evaluated with replacement and existing adaptation; multiple unavailable players do not automatically stack.

Fan mood is a real news research category, not an automatic numerical advantage: cite actual fan actions, organization announcements, direct public sentiments with sample/bias limits, and credible local reporting. Distinguish isolated views from large organized protest/support. Crowd hostility/manager crisis can plausibly pressure a side, but reaction or bounce-back may point the other way; avoid strong automatic scores.

Goal-market assessment: consider credible effects on each club's offense and defense, potential ability of **each** side to score, match tempo, concrete tactical plans and environment. KG YES and KG NO must be assessed even when a user only gives a winner; same for Over/Under. Do not infer Over solely from support for one team or KG from generic confidence.

## Audit and immutability

Only source evidence available by AS_OF may justify points. Mark claimed but unverified stories as unscored or disputed, not as verified developments. Historical NEWS v1.0–v1.3 reports remain preserved in Git history and any existing archives, but their research and output format are SUPERSEDED for all new v1.4 runs.

No scoring formula beyond per-event seven integers and arithmetic column totals. Scores are uncalibrated NEWS opinion weights, never bookmaker probabilities or betting advice. Review later selection settlement and on-field news mechanism separately. Repeated markets within a match are dependent observations, not independent success samples.

## Output contract

Use ONLY the five parts defined in `roles/news.md`: short match-atmosphere opening; numbered H# news table; 1X2 event-score table with TOTAL; O/U and KG event-score table with TOTAL; final seven-outcome NEWS scoreboard with user preference highlighted. No extra "confidence score", no secondary scoring model, no forced favorites, no invented evidence.
