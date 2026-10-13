# SXF Methodology

Status: DRAFT
Version: 0.4

## Objective

Interpret SmartXFlow-only money and odds behavior without contamination from team analysis, current news, Polymarket, or other CAPITALE departments.

The operational target is normally within roughly T-6 to T-3 before kickoff, but every match must be evaluated independently at its own exact remaining-time horizon when the analysis is run.

## Core rule: dynamic per-match as-of analysis

For every match independently:

`hours_to_kickoff = kickoff_utc - as_of_utc`

There is no single batch-level T-6/T-5/T-4/T-3 horizon.

If several matches are analyzed at the same clock time, one may be T-3, another T-4.5, another T-6. SXF must use each match's own kickoff and the same real analysis timestamp to derive its own horizon.

T-6 / T-5 / T-4 / T-3 are reference/control points and research buckets only. They are not separate filters and they do not authorize future data.

At every match-specific report timestamp:
- only observations available at or before `as_of_utc` may be used;
- if no snapshot exists exactly at `as_of_utc`, use the latest eligible snapshot at or before it;
- later money, later odds, final volume, closing odds, and later alarms are forbidden;
- an earlier signal may be re-checked at the exact current horizon using only data available by then;
- if the exact remaining time is between reference points, record the exact remaining time rather than pretending the match is at a later control point.

This rule applies equally to live operation and backtests.

## Core engine set

### 1. EARLY MONEY

Purpose: detect serious team-side money before normal match-day market density develops.

Eligible selection: HOME or AWAY only.

Initial trigger conditions:

| Observation | Trigger |
| --- | --- |
| T-72 | top-money TEAM + money >= £5,000 + share >= 50% |
| T-60 | top-money TEAM + money >= £5,000 + share >= 50% |
| T-40 | top-money TEAM + money >= £10,000 + share >= 50% |
| T-24 | top-money TEAM + money >= £10,000 + share >= 50% |
| T-12 | top-money TEAM + money >= £1,000 + share >= 80% |

#### Retention 55

Retention applies to Early Money signals first formed at T-72, T-60, T-40, or T-24.

From the origin onward, inspect later observations only up to the exact current match-specific `as_of_utc`.

If selected-side money share is `< 55%` at any eligible later observation:
- set `RETENTION_BREAK = true`;
- cancel the EARLY MONEY recommendation;
- do NOT automatically PASS the whole match;
- other engines remain independently eligible.

T-12 remains an Early Money trigger point but is not an origin point for the Retention-55 rule.

The 55% threshold is an approved operational candidate for prospective testing, not a calibrated optimum.

### 2. 1X2 CONCENTRATION V1

Purpose: identify abnormal current concentration of SmartXFlow money on one team.

All conditions must hold at the current match-specific decision snapshot:
- selection = HOME or AWAY;
- selection is top-money in 1X2;
- money >= £1,000;
- money share >= 80%;
- decimal odds 1.40-2.50.

V1 is a core production-candidate engine inside the DRAFT methodology.

### 3. 1X2 CONCENTRATION V2

Purpose: stricter quality filter on top of V1.

First satisfy every V1 condition.

Then require over the prior 3-hour window ending exactly at the current match-specific `as_of_utc`:
- selected-side share never below 70%;
- adverse odds rise not greater than 3%.

V2 does not replace V1. It qualifies the same underlying directional case and must not be counted as a second independent signal.

### 4. HEAVY 1X2

Purpose: premium-strength tag inside the Concentration family.

Conditions:
- Concentration-family team case;
- money >= £10,000;
- money share >= 80%.

HEAVY 1X2 is a premium tag, not an independent vote.

### 5. SURPRISE TEAM

Purpose: detect unusual money on a non-favorite team.

Conditions:
- selection = HOME or AWAY;
- decimal odds 2.90-4.49;
- money share >= 50%.

There is no fixed £10k minimum.

Interpretation:
- upset risk;
- resistance to the favorite;
- non-loss support.

Do not automatically translate SURPRISE TEAM into a direct team-win recommendation.

### 6. STABLE OVER 2.5

Conditions:
- market = O/U 2.5;
- selection = OVER;
- money >= £1,500;
- money share >= 65%;
- decimal odds 1.40-1.80.

### 7. PREMIUM OVER 2.5

Conditions:
- market = O/U 2.5;
- selection = OVER;
- money >= £2,500;
- money share >= 75%;
- decimal odds 1.40-1.80.

If both STABLE and PREMIUM trigger on the same match/selection:
- report PREMIUM as the stronger state;
- mark STABLE as superseded;
- do not count them independently.

### 8. BTTS YES

Conditions:
- market = BTTS;
- selection = YES;
- money >= £750;
- money share >= 60%;
- decimal odds 1.60-1.90.

BTTS YES remains independent from Over 2.5. Simultaneous BTTS and Over triggers do not receive an automatic confidence bonus.

## Supporting observations, not core engines

The following may be recorded but must not independently trigger a core recommendation in v0.4:
- gradual odds decline;
- abnormal money versus league/team baseline;
- BTTS YES + OVER overlap;
- EARLY MONEY + 1X2 CONCENTRATION overlap.

The first two remain useful research directions. The latter two are confluence tags only until larger samples justify a bonus.

## Engine relationship rules

1. `PREMIUM_OVER_2_5` supersedes `STABLE_OVER_2_5` on the same selection.
2. `CONCENTRATION_V2` qualifies `CONCENTRATION_V1`; it is not a second vote.
3. `HEAVY_1X2` is a premium tag on the same Concentration family case.
4. `EARLY_MONEY` may coexist with later Concentration, but overlap alone adds no automatic confidence bonus.
5. `RETENTION_BREAK` cancels only the Early Money engine instance.
6. `SURPRISE_TEAM` is interpreted as upset/non-loss risk, not an automatic 1X2 win call.
7. BTTS and Over are separate engines; overlap itself adds no bonus.

## Research evidence currently supporting the rules

Observed 9-12 October research included:
- unique first-strong Early Money group around 18/22 = 81.8%;
- Concentration V1 around 73-80% across T-6 to T-3 controls;
- Concentration V2 historically stronger than V1 in the small sample;
- Heavy 1X2 approximately 77-89% depending control point, with small N;
- Surprise Team non-loss materially stronger than direct win rate;
- Stable Over approximately 70-78%;
- Premium Over strongest around T-5/T-4 in a small sample;
- BTTS YES approximately 76-83% in the studied control points.

These figures are descriptive research priors only. They MUST NOT be emitted as calibrated probabilities.

## Required backtest fields

For every engine opportunity, store at minimum:
- match/event identifier;
- engine name/version;
- exact `as_of_utc`;
- `kickoff_utc`;
- exact `hours_to_kickoff`;
- optional reference horizon bucket for research grouping;
- selection;
- money amount;
- money share;
- odds;
- top-money status where relevant;
- prior-3h share minimum for V2;
- prior-3h adverse odds movement for V2;
- Early Money origin time;
- retention status and first break timestamp;
- result;
- decimal odds at decision snapshot;
- ROI where settlement is reliable;
- source snapshot identifiers sufficient for reproducibility.

## Still open

The following are not approved and must not be invented:
- numeric engine scoring;
- production confidence mapping;
- league/team normalized-money formula;
- league-specific thresholds;
- cross-engine precedence beyond the explicit relationships above;
- sharp/public classification thresholds;
- generic reversal veto outside the explicit Early Money retention rule;
- final recommendation ranking logic beyond reporting triggered core engines.
