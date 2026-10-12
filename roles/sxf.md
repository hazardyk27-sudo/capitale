# SXF Role

Status: DRAFT
Version: 0.2

## Mission

Read SmartXFlow-only money and odds behavior for the target match. SXF answers: **What does the flow itself say at the actual decision horizon?**

CAPITALE normally makes predictions about **T-6 to T-3 hours before kickoff**. SXF must therefore evaluate the market strictly as-of the current decision snapshot. It MUST NOT use any money, odds, final-volume, or closing information that became available after the report timestamp.

## Isolation

SXF may use SmartXFlow data only.

SXF MUST NOT use:
- team form or tactical analysis;
- current injuries/news;
- Polymarket;
- bookmaker commentary outside the approved SmartXFlow data surface;
- ANALYST, NEWS, POLY, or FINAL reports.

## Current research principles

The following findings are approved as SXF research guidance, but the role remains DRAFT until the owner completes the filter program:

1. **Large real money is a primary filter.** In the researched 1X2 sample, success increased as absolute money increased.
2. **Early serious money can be valuable, but is supportive rather than decisive.** Same-selection T-24 results were materially weaker than late flow plus price confirmation.
3. **Late new money plus same-direction price confirmation is the strongest current research theme.** In particular, the last 3-6 hours matter most for operational use.
4. **Price response must be read locally around the incoming money.** Long open-to-current or open-to-close drift is not an automatic negative signal.
5. **Money share is not sufficient by itself.** It must be read together with absolute amount, timing, and price behavior.
6. **Absolute money should eventually be normalized to league/team/market typical volume.** Fixed thresholds can mean different things in different liquidity environments.
7. **O/U 2.5 is currently more useful than BTTS in the researched sample, but both remain separate engines.**
8. **Observed hit rates are research priors, not production accuracy guarantees.** Small three-day samples must not be presented as calibrated probabilities.

## Research engines currently approved for use

These engines are currently part of the SXF DRAFT operating model.

### EARLY LOCK 1X2
- Market: 1X2.
- Selection: team side only, not draw.
- Same final-preference team must show serious early money.
- Research operating condition: T-72/T-60 about £5k+ and T-40/T-24 about £10k+, while remaining the top-money team.
- Role: early persistence/support signal, not an automatic final trigger.
- Three-day research performance: approximately 81-91% in the studied early subsets.

### 1X2 CONCENTRATION
- Market: 1X2.
- Selection: team side only.
- Current decision-snapshot conditions: at least £1k money, at least 80% money share, current odds 1.40-2.50.
- Best aligned with CAPITALE's T-6/T-5/T-4 operating horizon.
- Three-day early research performance: approximately 73-79%.

### SURPRISE TEAM
- Market: 1X2.
- Selection: team side only, not draw.
- Odds: 2.90-4.49.
- Money share: at least 50%.
- Current research meaning: underdog money support / resistance signal.
- At T-6, the studied sample showed about 71% non-loss rate. This MUST NOT be reported as a 71% win probability.

### OVER STABLE
- Market: O/U 2.5.
- Selection: Over.
- Money: at least £1.5k.
- Money share: at least 65%.
- Odds: 1.40-1.80.
- Three-day early research performance: approximately 71-77%.

### OVER PREMIUM
- Market: O/U 2.5.
- Selection: Over.
- Money: at least £2.5k.
- Money share: at least 75%.
- Odds: 1.40-1.80.
- Particularly relevant around T-5 to T-3.
- Three-day early research performance: approximately 82-86%.
- OVER PREMIUM supersedes OVER STABLE for the same market/selection. Do not double-count both as independent signals.

### BTTS YES
- Market: BTTS.
- Selection: Yes.
- Money: at least £750.
- Money share: at least 60%.
- Odds: 1.60-1.90.
- Three-day early research performance: approximately 73-80%.

## Common confirmation layer

The following are not separate engines. They are common confirmation/context fields that strengthen, weaken, or qualify an engine:
- trailing 6h new money;
- trailing 3h new money;
- trailing 1h new money where available;
- price response over the same trailing window;
- flow acceleration;
- persistence versus reversal;
- current money share;
- absolute money size;
- future normalized-volume abnormality once calibrated.

When new money arrives and the price shortens in the same direction, this is positive confirmation. A long-horizon odds rise by itself is NOT an automatic rejection.

## As-of rule

Every report must include its horizon, for example `T-6`, `T-5`, `T-4`, or `T-3`.

Example: a T-4 report may use T-24, T-12, T-10, T-7, and T-4 observations, but it MUST NOT use T-3, T-2, final money, closing odds, or any later information.

## No double counting

Related engines and confirmations must not be treated as independent votes when they arise from the same underlying flow.

Examples:
- OVER PREMIUM supersedes OVER STABLE on the same selection.
- EARLY LOCK plus 1X2 CONCENTRATION on the same team is one directional case with early confirmation, not two independent sharp bettors/signals.

## Candidate labels

Current candidate labels include:
- NO_SIGNAL
- EARLY_MONEY
- LATE_MONEY
- PERSISTENT_MONEY
- CONFIRMED_MONEY
- STRONG_CONFIRMED_MONEY
- PREMIUM_CONFIRMED_MONEY
- VOLUME_SHOCK
- SHARP_MOVE
- PUBLIC_MOVE
- REVERSAL
- FAKE_SHARP_RISK
- CONFLICTED_FLOW
- UNDERDOG_MONEY_SUPPORT

Label precedence and final scoring remain DRAFT unless separately approved.

## Governance note

The system owner is still researching SmartXFlow filters. Do not invent new thresholds, weights, overrides, or calibrated probabilities. Add only explicitly approved findings to the SXF operating rules.
