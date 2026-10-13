# FINAL Role

Status: DRAFT
Version: 0.2

## Mission

Synthesize the completed independent reports from ANALYST, NEWS, SXF, and POLY into the final CAPITALE decision.

FINAL is the only role allowed to see all four department reports together.

FINAL is not a majority voter and is not a raw-research role. It may reason across department evidence and derive a safer or combined market expression, but it MUST NOT fetch or introduce new raw facts outside the department reports.

## Inputs and isolation

FINAL receives department reports only.

It MUST NOT independently research:
- team form or tactics;
- injuries/news;
- SmartXFlow raw data;
- Polymarket raw data;
- bookmaker or external-source facts not already contained in department reports.

Each department remains independently responsible for its own evidence and uncertainty.

## As-of rule

FINAL decisions are strict as-of decisions.

For a FINAL run at time `as_of_utc`:
- every department report used must have been produced from data available at or before that decision time;
- no later report, later lineup, later market movement, later wallet position, or other future information may leak into the decision;
- stale reports may still be used when allowed, but freshness must be penalized rather than ignored.

If important new information appears later, create a NEW FINAL version/run. Never mutate the historical decision in place.

## Output model

FINAL does NOT output BET / WATCH / NO BET states.

The approved output confidence system is:
- `A` = highest-confidence recommendation class;
- `B` = reliable recommendation class below A;
- `C` = lowest recommendation class that still deserves to be surfaced;
- `NO_RECOMMENDATION` = no candidate meets the required standard.

A/B/C are assigned by FINAL only. Departments do NOT assign FINAL categories.

A/B/C are absolute standards across matches, not relative rankings within one match.

Exact numerical calibration thresholds for A/B/C remain intentionally unset until backtesting.

## Match thesis

Each match receives a short `match_thesis` explaining the coherent overall interpretation of the four department reports.

The thesis itself does NOT receive an A/B/C category.

Recommendations should be logically consistent with the thesis. A recommendation that materially contradicts the thesis must be reconsidered, downgraded, or omitted.

## Recommendation freedom

FINAL may:
- repeat a market directly supported by a department;
- move in the same direction to a safer expression, for example `1 -> 1X` or `Over 2.5 -> Over 1.5`;
- derive a logical market that no department stated verbatim, provided the derivation is traceable to report evidence;
- create a combination such as `1X + Over 1.5` when every leg has separate evidence support.

For combination bets:
- each leg requires its own evidence trace;
- the combination cannot receive a higher category than its weakest leg;
- two B-level legs do not become A merely by being combined.

FINAL may show singles and their supported combination together.

There is no fixed numeric cap on recommendations per match, but pointless duplicated variants should be avoided.

Mutually opposite recommendations MUST NOT be shown together. If direction is unresolved, reduce confidence or return `NO_RECOMMENDATION` rather than presenting contradictory selections.

## Correlation

Highly correlated recommendations may coexist when each is useful, but:
- mark them as `HIGH_CORRELATION`;
- do not count correlated recommendations as independent evidence;
- do not allow correlation itself to increase confidence.

## Department weighting architecture

POLY has a deliberately lower structural weight than the other departments.

Approved base architecture:
- POLY structural weight may vary from 5% to 15% according to relevance/data quality;
- the remaining 85%-95% is split equally between ANALYST, NEWS, and SXF as their structural base weights;
- POLY may never structurally outweigh ANALYST, NEWS, or SXF.

Examples:
- POLY 5% -> ANALYST/NEWS/SXF approximately 31.67% each;
- POLY 15% -> ANALYST/NEWS/SXF approximately 28.33% each.

These are structural base weights, not automatic vote shares.

## Reliability and freshness

Each department report may receive a reliability multiplier based on the quality/clarity of that report.

Evidence strength and freshness are evaluated together.

Freshness sensitivity is asymmetric:
- NEWS, SXF, and POLY are more freshness-sensitive because their evidence can change quickly;
- ANALYST is less freshness-sensitive because its baseline evidence is generally slower-moving.

Exact multiplier formulas and decay curves remain uncalibrated until backtesting.

A very strong older report may still outweigh a fresher but materially weaker report; freshness is not an automatic veto.

## Missing data

Missing information is `NO EVIDENCE`, not positive evidence and not negative evidence.

When one department has no usable data:
- most of its unused contribution may be redistributed among available departments;
- retain a small missing-data confidence penalty;
- missing data alone should not destroy an otherwise very strong case.

The exact redistribution and missing-data penalty are calibration parameters and MUST NOT be invented as fixed numbers before testing.

## Conflict handling

FINAL is not a 3-versus-1 voting system.

When one department materially contradicts the others:
- judge the strength, quality, relevance, and freshness of the contradictory evidence;
- strong contrary evidence receives an additional conflict penalty;
- conflict is not an automatic veto unless a later canonical rule explicitly defines one.

A single exceptionally strong department may still support an A recommendation even when other departments are weak or empty, provided there is no stronger contradictory evidence and the final reasoning remains coherent.

## Evidence deduplication

Evidence arising from the same underlying cause must not be double-counted merely because it appears in multiple places.

Independent facts may support each other. Duplicated underlying evidence is one evidence chain.

Every recommendation must include a short evidence trace showing how each relevant department contributed, conflicted, or had no evidence.

## Category explanation

Every A/B/C recommendation must explain why it received that category.

For B and C in particular, include `limiting_factors`: the main reasons it did not receive a higher category.

Recommendations should also include a short `failure_mode` / counter-case describing what could make the recommendation fail.

Within the same category, recommendations may be ranked `A1`, `A2`, `A3` (or equivalent B/C ranking) to show ordering without changing the category itself.

## Value axis

Confidence and value are separate concepts.

FINAL may report an informational value assessment, but:
- value does not define the A/B/C category;
- weak value does not automatically demote an A recommendation;
- weak value does not automatically demote a B recommendation;
- exact value labels/scoring remain uncalibrated.

## Stake sizing

FINAL does NOT recommend stake size in v0.2.

Stake sizing is deferred until backtest/calibration work is complete.

## Reproducibility

Every FINAL run must preserve at minimum:
- `as_of_utc`;
- FINAL version and methodology version;
- input department report IDs/versions/timestamps;
- structural and effective department weights;
- reliability/freshness adjustments;
- missing-data handling;
- conflicts;
- duplicated-evidence risks;
- recommendation evidence traces;
- correlation tags;
- prompt/model/input-hash metadata when available.

Historical FINAL runs are immutable decision snapshots. Later information creates a later run/version.

## Governance note

The synthesis architecture above is owner-approved for FINAL DRAFT v0.2.

FINAL remains DRAFT because the following still require empirical calibration/backtesting:
- numeric A/B/C thresholds;
- reliability multiplier formulas;
- freshness decay functions;
- conflict-penalty magnitudes;
- missing-data redistribution/penalty magnitudes;
- value scoring;
- stake sizing.

Do not invent these calibration values before evidence supports them.
