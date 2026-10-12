# SXF Methodology

Status: DRAFT
Version: 0.2

## Objective

Interpret SmartXFlow-only money and odds behavior without contamination from team analysis, current news, or Polymarket. The operational target is normally **3-6 hours before kickoff**.

## Core methodological rule: as-of analysis

SXF is evaluated at the actual prediction horizon, normally `T-6`, `T-5`, `T-4`, or `T-3`.

No observation after the decision timestamp may enter the report or backtest row. In particular, a T-4 report MUST NOT use final money, closing odds, or flow that arrived between T-4 and kickoff.

Trailing windows must therefore be horizon-relative. Examples:
- at T-4, trailing 6h means T-10 -> T-4;
- at T-3, trailing 6h means T-9 -> T-3;
- at T-4, trailing 3h means T-7 -> T-4.

## Evidence hierarchy currently supported by research

Current research suggests the following ordering:

1. Absolute real-money size.
2. Timing of new money, especially the last 3-6 hours available at decision time.
3. Price response over the same period as the incoming money.
4. Persistence/acceleration versus reversal.
5. Money-share concentration as a confirmation/amplifier rather than a standalone trigger.
6. Normalized volume versus league/team/market baseline when that calibration becomes available.

The preferred question is not simply `Did odds rise or fall from open?` but rather: **What did price do while the new money arrived?**

## Current DRAFT engines

### EARLY LOCK 1X2
Research rule:
- market = 1X2;
- team selection only;
- same tracked team has approximately £5k+ at T-72/T-60;
- approximately £10k+ at T-40/T-24;
- team is top-money selection.

Interpretation: serious early and persistent money. It is a supportive signal, not the primary late decision trigger.

Observed three-day research result: approximately 81-91% across studied early subsets.

### 1X2 CONCENTRATION
Research rule at the current decision snapshot:
- market = 1X2;
- team selection only;
- money >= £1,000;
- money share >= 80%;
- odds 1.40-2.50.

Observed T-6/T-5/T-4 research performance: approximately 73-79%.

### SURPRISE TEAM
Research rule:
- market = 1X2;
- team selection only;
- odds 2.90-4.49;
- money share >= 50%.

Interpretation: underdog money support / resistance. In the studied T-6 sample the non-loss rate was approximately 71%. Do not convert this directly into a win-probability claim.

### OVER STABLE
Research rule:
- market = O/U 2.5;
- selection = Over;
- money >= £1,500;
- money share >= 65%;
- odds 1.40-1.80.

Observed three-day research performance: approximately 71-77%.

### OVER PREMIUM
Research rule:
- market = O/U 2.5;
- selection = Over;
- money >= £2,500;
- money share >= 75%;
- odds 1.40-1.80.

Observed T-5 to T-3 research performance: approximately 82-86%.

OVER PREMIUM supersedes OVER STABLE on the same market/selection. Do not count both independently.

### BTTS YES
Research rule:
- market = BTTS;
- selection = YES;
- money >= £750;
- money share >= 60%;
- odds 1.60-1.90.

Observed three-day research performance: approximately 73-80%.

## Common confirmation layer

Every triggered engine should be evaluated using, when available:
- trailing 6h new money;
- trailing 3h new money;
- trailing 1h new money;
- trailing 6h price response;
- trailing 3h price response;
- flow acceleration;
- persistence or reversal;
- current money share;
- current absolute money;
- normalized-volume percentile/abnormality once calibrated.

Positive confirmation currently means new money and a same-direction shortening of price over the comparable trailing window.

Long open-to-current drift is not an automatic negative. A selection can drift earlier and still receive meaningful late confirmed money.

## Late confirmed money research finding

The strongest current research theme is **new money in the last 3-6 hours plus price shortening in the same direction**.

Historical research examples include:
- last 3h £5k+ new money + odds down: 45/66 = 68.2%;
- last 6h £5k+ new money + odds down: 49/69 = 71.0%;
- top-money team + last 6h >= £10k new money + odds down: 37/44 = 84.1%;
- adding money share >= 60%: 33/38 = 86.8%;
- adding final money >= £20k produced 18/19 in the studied sample, but final-money variants are NOT valid for T-6/T-5/T-4/T-3 reports because they use future information.

Therefore the operational implementation must recreate the logic strictly using information available at the decision timestamp.

## Early money research correction

Early money is supportive rather than decisive. When the same final-preference selection was tracked backward:
- T-24 >= £2.5k: 22/36 = 61.1%;
- T-24 >= £5k: 17/27 = 63.0%;
- T-24 >= £10k: 14/19 = 73.7%.

This is materially weaker than late flow plus price confirmation, so early money should normally act as persistence/context rather than the primary trigger.

## Money-share rule

High money share alone must not produce a strong signal. Research included multiple failures with 80-90%+ money concentration. Share is therefore an amplifier and must be evaluated with:
- absolute money;
- timing;
- price behavior;
- market context.

## Market priority from current research

Current evidence priority:
1. 1X2;
2. O/U 2.5;
3. BTTS as a separate secondary engine.

O/U 2.5 outperformed BTTS in the studied broad top-money sample. This remains a research observation, not a permanent calibration claim.

## Research quality / reporting discipline

Three-day hit rates are research priors only. They must not be shown as expected production accuracy.

Future evaluation rows should record at minimum:
- N;
- wins;
- win rate;
- average odds;
- median odds;
- expected wins from market-implied probability;
- actual minus expected wins;
- ROI when settlement quality is reliable;
- decision horizon;
- league/competition;
- absolute and normalized volume where available.

## No double counting

Overlapping conditions caused by the same underlying money flow are one evidence chain, not independent votes.

Examples:
- OVER PREMIUM supersedes OVER STABLE.
- EARLY LOCK and 1X2 CONCENTRATION on the same team combine as one directional case with early persistence confirmation.
- trailing 3h/6h price confirmation modifies engine strength; it is not a separate independent department signal.

## Still not canonical

The following remain open for owner research and must not be invented:
- final engine precedence;
- exact score/weight system;
- normalized-volume calibration;
- league-specific thresholds;
- sharp/public classification thresholds;
- fake-sharp/reversal veto rules;
- cross-market override rules;
- production confidence mapping.
