# ANALYST v1.3 — Selection-specific game-state engine

> **HISTORICAL / SUPERSEDED as of 2026-10-23.** The owner has deactivated this methodology for ALL NEW ANALYST runs. The ONLY active CANONICAL workflow and output is `methods/analyst_methodology.md` v2.0 + `schemas/analyst_report.md` v2.0. This file is retained solely for historical audit and reproduction of originally frozen decisions; do not apply its scoring rules, routing, simulation, optional modules or report template in new analyses.

Status: SUPERSEDED (historical EXPERIMENTAL only)
Version: 1.3
Approved design: 2026-10-19
Baseline: v1.1.1 CANONICAL, v1.2 EXPERIMENTAL (both preserved and immutable for historical runs).

## Purpose and integrity

Improve selection-specific confidence discipline after observed overconfidence in straight-win selections. This is an experimental hypothesis, NOT a proven improvement. Retain all v1.2 goal-leg and source-isolation rules unless superseded explicitly below. ANALYST never uses current NEWS, injuries, market odds, SXF, POLY, FINAL or other department outputs.

At decision time store exact AS_OF in UTC, fixture identity, type of selection, source snapshots, era, feature availability, method version and original score. Never revise a pre-match score using later outcomes. Missing data = NO EVIDENCE, not neutral or evidence of safety. Two independent sources may refer to one underlying event-data feed: deduplicate rather than vote twice.

## Mandatory market routing

1. SINGLE_WIN_HOME / SINGLE_WIN_AWAY — evaluate selected team's WIN, DRAW and LOSS paths separately. The other team's non-loss path must be explicitly tested. A team's superior xGD is evidence of strength, **not** by itself proof of its win selection.
2. DOUBLE_CHANCE_1X / DOUBLE_CHANCE_X2 — evaluate the **opposing team's WIN path** as the sole failure outcome. A draw satisfies 1X and X2; never score them as a single-team win.
3. TOTAL_OVER_2_5 — 3+ goals. Test home-heavy, away-heavy and shared-scoring routes; also test match-lock paths 0-0, 1-0, 0-1, 1-1, 2-0 and 0-2. High total xG alone is not sufficient.
4. BTTS_YES — retain v1.2 two independent scoring legs (home goal, away goal), zero-goal frequency/clean-sheet checks and weaker-leg score ceiling.
5. COMBINATION — test each constituent leg independently with its market-specific engine; combined support score may not exceed the weakest material leg.
6. OTHER — explicit unsupported-market/data limitation; do not silently use a generic side engine.

## SIDE match-state audit (mandatory before 0-100 rating)

For each win selection describe three football paths, without treating them as statistical probabilities:
- WIN path: where chances arise; can chosen team score first and/or create sustained quality; repeatability versus comparable opponents, venue-adjusted.
- DRAW path: when 0-0 or 1-1 becomes resilient, low-tempo/low-scoring, opponent compact block or finishing volatility; what reliably breaks a draw?
- LOSS path: opponent's transition/set-piece/pressing/territorial chances, selected team's defensive vulnerability, bad-game-state recovery.

For 1X/X2, retain the same match pathways but classify BOTH selected-side win and draw as success; only opponent win is failure. Focus on opponent's realistic win mechanisms.

Explicitly check: same-season xGD/xPts with comparable opponent adjustment; home/away splits with sample; scoring and clean-sheet floor (0-goal frequencies, chance-quality not just goal tally); historical game states (lead protection and comeback ability when observed); low-event draw risk; set-piece/transition mismatch; finishing/GK variance and red-card distortions. Do not invent numerical home or cup adjustments.

A **strong team vs reliable win pick** is a required separate conclusion. If superiority is largely due to a defensive edge but scoring floor is poor, a compact opponent can sustain a draw: keep high-score promotion blocked until evidence refutes that credible draw path.

## Cup, away and cross-league data checks

- Flag AWAY_FAVORITE, CUP_MATCH, CROSS_LEAGUE, LOW_EVENT, SMALL_VENUE_SAMPLE, ERA_BREAK and UNKNOWN_KICKOFF where applicable.
- Cup matches: establish the exact competition and comparable historical opponent tiers; if cross-league attack/defense scaling cannot be grounded, mark UNNORMALIZED_CROSS_LEAGUE and cannot justify high confidence from league rank alone.
- Away picks: measure the selected team's away creation and opponent's home resistance; a strong overall xGD is insufficient if away sample is missing or opposed.
- Do not treat cups, lower-profile leagues or away matches as automatically poor. Effects must be tested against out-of-sample evidence; flags reveal uncertainty, not hardcoded loss predictions.
- When opposition-strength adjustment is impossible, explicitly say so and apply evidence-quality restraint without inventing a coefficient.

## Evidence-to-score protocol (operational, uncalibrated)

Record evidence items with direction, source/independent-root, reliability, same-era sample size, opponent relevance, venue relevance, and direct selection relevance. Identify the strongest opposing causal mechanism. Never count favorable facts as votes.

Produce in this order:
1. Source/AS_OF and coverage check.
2. Supporting / opposing / truly two-sided evidence, ranked by causal importance.
3. Win–draw–loss paths (or over/under / each BTTS leg).
4. Key failure path and evidence that counters it; confidence/data-quality limits.
5. ANALYST PUANI: integer 0–100 with short explicit rationale. This is an **ordinal football-evidence support score**, NOT a probability, pricing/value/stake or FINAL decision.

Operational bands retained: 85–100 very strong; 75–84 strong; 65–74 positive; 55–64 slightly positive; 45–54 balanced; 35–44 weak; 0–34 strongly opposed. Bands are NOT empirically calibrated.

**Experimental high-score review gates:** a score >=75 requires (a) multiple independent, match-relevant underlying signals, (b) credible venue- and opponent-comparable evidence, (c) an explicit examined and reasonably countered failure path, and (d) adequate cross-league/cup comparability. If any is materially missing or contradictory, score cannot enter >=75 during this experiment; explain the gate that limits it. These are pre-registered test gates, NOT learned thresholds; test whether they improve calibration and coverage. A narrow numeric distinction (e.g. 77 vs 78) is not a verified empirical difference.

If fixture/selection or evidence is insufficient to make a responsible score, write SCORE_UNAVAILABLE and missing inputs instead of fabricating 50/100. Separately label score confidence LOW/MEDIUM/HIGH and uncertainty tags. Different evaluators using the same evidence should reproduce the same band and rationale; exact point reproducibility is an evaluation target, not assumed.

## Independence, settlement and validation

Maintain immutable original reports and scored selection records, including v1.1/v1.2 comparisons. No hindsight re-rating. Postgame evidence belongs to a separate outcome/postmortem table. Verify dates, competition, match status and score through official plus independent source, or two independent reliable sources, before settlement. For cup matches include regular time vs extra time and the market's period rule. Contradictory or unverified scores are NOT verified settlements.

Results previously discussed conversationally (including 18 October examples) are hypotheses for audit until source-proven. Do not treat reported 2/7 high-score SIDE or 8/10 goal hit rates as independently verified calibration.

Evaluate with pre-registered walk-forward splits, market type, score band, venue, cup/cross-league, league, selection dependence, and available sample; group selections from same match to avoid pseudo-independence. Test ablations for explicit draw path, venue quality, goal floor, cup comparability, finishing regression and failure-path gates. Compare v1.3 to frozen v1.2 on identical eligible fixtures and AS_OF. Report sample size, confidence intervals, coverage, missing-data and score-ordering. No canonical promotion without stable out-of-sample improvement.
