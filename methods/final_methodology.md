# FINAL Methodology

Status: DRAFT
Version: 0.2

## Objective

Combine the independent ANALYST, NEWS, SXF, and POLY reports into coherent match recommendations without contaminating departments, double-counting evidence, using future information, or forcing an output when no recommendation is justified.

FINAL performs synthesis only. It does not perform raw-source research.

## 1. Strict as-of synthesis

Every FINAL run has an exact `as_of_utc`.

A report may be used only when its evidence cutoff is at or before the FINAL decision timestamp. Later information MUST NOT be used to justify an earlier decision.

If meaningful new information arrives after a FINAL run, generate a new immutable FINAL run/version rather than rewriting the prior one.

## 2. Department normalization

Departments do not emit FINAL A/B/C categories.

FINAL normalizes heterogeneous department outputs into a common internal assessment using the evidence strength, uncertainty, data quality, relevance, conflicts, and freshness contained in each department report.

This normalization is reasoning support, not a fixed numerical probability model in v0.2.

## 3. Structural department weights

POLY alone has a lower structural band.

Let `p = POLY structural weight`, where:

`0.05 <= p <= 0.15`

Then the base structural weight of each of ANALYST, NEWS, and SXF is:

`(1 - p) / 3`

Therefore:
- if POLY = 5%, each of ANALYST/NEWS/SXF is approximately 31.67%;
- if POLY = 15%, each is approximately 28.33%.

POLY may move within its 5%-15% band according to report relevance/data quality but may not structurally outweigh the other departments.

Base weights are not votes. FINAL still performs synthesis reasoning.

## 4. Reliability multipliers

Each department report may be adjusted by a report-level reliability multiplier reflecting evidence quality, completeness, internal consistency, and uncertainty.

The multiplier formula is intentionally uncalibrated in v0.2. FINAL may describe a report as relatively stronger/weaker but MUST NOT invent a permanent numeric formula.

## 5. Freshness

Freshness is evaluated jointly with evidence strength.

Relative sensitivity:
- ANALYST: lower freshness sensitivity;
- NEWS: higher freshness sensitivity;
- SXF: higher freshness sensitivity;
- POLY: higher freshness sensitivity.

Freshness does not automatically dominate evidence strength. A strong older report may remain more informative than a fresh but weak report.

Exact decay curves are deferred to calibration.

## 6. Missing data

`NO DATA` means no evidence. It is neither positive nor negative evidence.

When a department has no usable report/evidence:
- redistribute most of its unused structural contribution to available departments;
- retain a small overall missing-data confidence penalty;
- do not force a major downgrade when the remaining evidence is exceptionally strong.

Do not silently treat missing data as neutral confirmation.

The exact redistribution fraction and penalty magnitude remain calibration parameters.

## 7. Weak data versus conflict

Distinguish:
- `NO_DATA`: no evidence; light missing-data penalty;
- `WEAK_DATA`: low contribution because evidence is low quality/low relevance;
- `CONFLICTING_DATA`: genuine contrary evidence and therefore a real confidence penalty.

A strong conflict deserves a larger penalty than mere absence.

## 8. Conflict handling

FINAL is not majority voting.

A 3-versus-1 pattern does not automatically resolve the match.

When one department strongly contradicts the others:
1. judge reliability, freshness, relevance, and evidence strength of the contrary report;
2. apply an additional conflict penalty if the contradiction is material and well supported;
3. do not impose an automatic veto unless a later canonical rule explicitly defines one.

A single exceptionally strong department may still support an A recommendation when other reports are weak/empty, provided stronger contradictory evidence does not invalidate the thesis.

## 9. Evidence deduplication

Before combining apparent agreement, identify whether multiple observations arise from the same underlying cause.

Duplicated underlying evidence is one evidence chain, not multiple independent confirmations.

Independent facts remain independently useful.

## 10. Match thesis

Create one concise `match_thesis` from the complete synthesis.

The thesis:
- summarizes the most coherent match interpretation;
- records major uncertainties/conflicts;
- has no A/B/C category of its own.

Recommendations must be logically consistent with the thesis.

## 11. Recommendation derivation

FINAL is allowed to synthesize a market expression rather than merely copy department selections.

Permitted operations include:
- direct market expression supported by evidence;
- safer same-direction expression, e.g. `1 -> 1X`;
- safer goal line, e.g. `Over 2.5 -> Over 1.5` when report evidence logically supports it;
- a logically derived market not stated verbatim by any department;
- a combination market when every leg has separate traceable support.

FINAL MUST NOT introduce a leg whose support cannot be traced to department evidence.

## 12. Combination rule

For a multi-leg combination:
- every leg must have a separate evidence trace;
- combination category cannot exceed the category of its weakest leg;
- combining multiple legs does not create automatic confidence uplift.

Example:
- `1X = A`
- `Over 1.5 = B`
- `1X + Over 1.5 <= B`

Singles and the supported combination may all be shown.

## 13. Opposite-direction rule

Mutually opposite recommendations must not be presented together.

When evidence cannot establish a coherent side:
- lower the category if appropriate; or
- return `NO_RECOMMENDATION`.

Do not present both sides merely because separate departments disagree.

## 14. Correlation rule

Correlated recommendations may coexist, for example a safer single and a related combo.

They must be explicitly tagged for high correlation and must not be treated as independent evidence or independent confidence confirmation.

## 15. Number of recommendations

There is no fixed numeric maximum per match.

Output as many recommendations as the evidence genuinely supports, while avoiding redundant variants that add no decision value.

## 16. FINAL categories

Only FINAL assigns:
- `A`: highest-confidence recommendation class;
- `B`: reliable recommendation class below A;
- `C`: lowest recommendation class worth surfacing.

If no candidate meets C-level quality, output `NO_RECOMMENDATION`.

There is no separate BET/WATCH/NO BET action state in FINAL v0.2.

A/B/C must be absolute standards across matches, not relative labels within a match.

Numeric cutoffs are intentionally deferred to empirical calibration.

## 17. Category ranking

Within a category, recommendations may be ranked, e.g. `A1`, `A2`, `A3`, without changing their category.

Ranking shows relative preference among recommendations that still meet the same absolute category standard.

## 18. Category explanation

Every A/B/C recommendation must include a concise explanation of why the category was assigned.

B and C recommendations should explicitly state the principal `limiting_factors` preventing a higher category.

Each recommendation also includes a `failure_mode` / counter-case describing the main plausible way the thesis could fail.

## 19. Value is separate from confidence

Confidence category and value assessment are separate axes.

Value is informational in v0.2:
- weak perceived value does not automatically demote A;
- weak perceived value does not automatically demote B;
- exact value labels and pricing thresholds are not yet calibrated.

## 20. No stake sizing

FINAL v0.2 does not recommend stake size.

Stake rules are deferred until performance calibration is complete.

## 21. Evidence trace requirement

Each recommendation must show a short contribution trace for:
- ANALYST;
- NEWS;
- SXF;
- POLY.

Each trace may indicate support, conflict, weak relevance, or no evidence.

The report must also expose:
- structural/base weights;
- effective weights or qualitative adjustments when available;
- reliability/freshness impacts;
- duplicated-evidence risks;
- conflicts;
- missing-data penalties;
- correlation tags.

## 22. Reproducibility and versioning

Persist for every FINAL run:
- match/event ID;
- `as_of_utc`;
- input report IDs and versions;
- input report timestamps/data cutoffs;
- FINAL role/methodology/prompt/model versions;
- input hash where available;
- structural weights;
- reliability/freshness adjustments;
- conflicts and dedup decisions;
- output recommendations and categories;
- value notes;
- later settlement/performance linkage.

A later decision after new information is a new run. Historical runs remain immutable for audit/backtest integrity.

## Still uncalibrated

The architecture is approved, but these values are intentionally not fixed yet:
- A/B/C numeric thresholds;
- exact reliability multipliers;
- freshness decay curves;
- exact conflict penalties;
- exact missing-data redistribution and penalty;
- value-scoring thresholds;
- stake sizing.

They must be learned/validated from historical and prospective performance rather than invented.
