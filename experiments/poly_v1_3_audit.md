# POLY v1.3 — source integrity audit and walk-forward protocol

Status: EXPERIMENTAL ENGINEER AUDIT (NOT CANONICAL BETTOR SKILL VALIDATION)
Audit performed: 2026-10-19
Window: 2026-10-09 inclusive to 2026-10-19 exclusive, kickoff UTC
Source: Supabase `capitale.poly_recent_football_bets` and raw/public trade data
Source policy: this file is ENGINEER diagnostic **only**. No historical raw wallet, tracked shortlist or Supabase view is an authorized **active POLY** bettor source; active bettor users must be shown at AS_OF on SXF POLY. Do not copy these historical wallet-performance estimates into POLY match reports.

## Reproducible initial checks

Dataset-wide within the window:
- 3,253 historical rows, only seven wallets in the `poly_recent_football_bets` view.
- 3,101 rows with `result IN ('won','lost')`.
- 2,040 rows have `first_traded_at >= kickoff_utc` (**not** eligible as clean prematch positions). Treat this as a timestamp/selection/aggregation contamination alarm, not automatically proof of a bug in the original provider.
- After selecting resolved, stake >=$100, entry decimal odds >=1.40: 1,561 rows.
- 738 have `first_traded_at < kickoff_utc`; only **142** also have `last_traded_at < kickoff_utc` (conservative entire-position prematch proxy).
- The strict 142 span only five wallets and 108 event IDs; **65/142 have NULL `pnl_usdc`**. This is much less than 90% usable realized-PnL coverage, so no stake-ROI ranking is decision grade.
- Some existing PnL-based aggregates fall below -100% ROI, another reason to distrust unverified amount/payout fields and not infer bettor skill from this view.
- In a preliminary same-window chronological prior-trade median calculation, of 142 strict rows, only 92 had >=20 earlier comparable rows; 31 were >=1.5×, eight >=3×, two >=5×, and only one >=5× within odds 1.40–2.50.
- Conditional flat stake model on 142 was -13.3% ROI, using `avg_entry_decimal-1` for WON and `-1` for LOST. **Not** a settlement-reconciled financial ROI: excludes fees and trading exits, may contain overlapping markets, and the selection/resolution coverage is not proven reliable.

Reproduce contamination/coverage screening:

```sql
WITH b AS (
  SELECT * FROM capitale.poly_recent_football_bets
  WHERE kickoff_utc >= '2026-10-09'::timestamptz
    AND kickoff_utc < '2026-10-19'::timestamptz
)
SELECT COUNT(*) AS total,
       COUNT(DISTINCT wallet) AS wallets,
       COUNT(*) FILTER (WHERE result IN ('won','lost')) AS resolved,
       COUNT(*) FILTER (WHERE first_traded_at >= kickoff_utc) AS first_at_or_after_kickoff,
       COUNT(*) FILTER (
         WHERE result IN ('won','lost') AND stake_usdc >= 100
           AND avg_entry_decimal >= 1.40
       ) AS resolved_odds_stake_eligible,
       COUNT(*) FILTER (
         WHERE result IN ('won','lost') AND stake_usdc >= 100
           AND avg_entry_decimal >= 1.40 AND last_traded_at < kickoff_utc
       ) AS strict_prematch,
       COUNT(*) FILTER (
         WHERE result IN ('won','lost') AND stake_usdc >= 100
           AND avg_entry_decimal >= 1.40 AND last_traded_at < kickoff_utc
           AND pnl_usdc IS NULL
       ) AS strict_prematch_null_pnl
FROM b;
```

**Important caution:** The first-trade label and last-trade label can be affected by stitching multiple fragments, an erroneously linked fixture, repeated markets, and late trading. Each anomaly must be inspected against the underlying fill IDs and correct event kickoff before classifying it.

## Required v1.3 training and evaluation contract

1. Immutable `SXF_POLY_SNAPSHOT` data per actual decision AS_OF must exist, with source URI/ID/hash, fetched/observed timestamp, source user ID, exact event/market/outcome, and exposure snapshots. If unavailable: historical bettor backtest status = `NOT_TESTABLE_FROM_CANONICAL_SOURCE`; no guessed reconstruction from unrelated raw wallets.
2. Resolve exact kickoff and market settlement independently, with status and provenance. A YES on a team is not identical to NO on the opponent in a market with draws unless exact contract payoff matches. Keep fills, reduces/sells, opposite positions and the user profile before the decision.
3. For each user's bet entry at time `t`, the baseline is the **prior 20–30 independent prematch positions entered strictly before t**. PnL-based historical quality for the same decision can use only positions settled **before t**. Historical outcomes after t may never change the prior skill status. Avoid using the outcome of future-resolved bets to choose baseline membership.
4. At t independently compute bettor quality, sample N, verified ROI coverage, style, stake multiple, odds bucket, hedge-cleanliness, same-event independent consensus and credible opposition. Require PnL >=90% coverage before stake ROI is decision grade. Separate actual stake PnL from naive flat 1u returns.
5. **Precommit** each candidate direction / explicit NO_EVIDENCE / MIXED and confidence band before kickoff and before settlement. Do not label only wins or retrospectively interpret alerts.
6. Chronological walk-forward: train/choose thresholds on earlier dates, freeze them, test on later disjoint dates. Hold out complete fixture/event clusters across splits to avoid counting highly related market outcomes as independent. Report confidence intervals / sensitivity to event clustering, baseline N, sample attrition and multiple comparisons.
7. Essential cohorts: <1.5×, 1.5–<3×, 3–<5×, >=5×; odds 1.40–2.50 versus >2.50; bettor type; exact market 1X2 / O-U / BTTS; league and time-to-kickoff; standalone vs independent consensus; opposing-bettor skill status. **Do not use arbitrary product of stake multiple and odds multiple** as a calibrated index.
8. Main outcome metrics: verified match settlement hit rate; **flat 1-unit** ROI at feasible entry price, true **stake-weighted realized** ROI when accounting reconciled, CLV where available, selection coverage, number of abstentions, high-confidence false-positive rate, market/event clusters, and exact number of QUALIFIED vs PROVISIONAL users.
9. No high-confidence calibration or '5× wins' claim until out-of-sample clusters and sufficient independent observations support it. A single 5× observation cannot validate the proposed 5× threshold.

## Current verdict

The 2026-10-09 to 2026-10-18 audit is **data-quality FAIL for prospective calibrated bettor ranking**. It is evidence to enforce the stricter v1.3 guardrails, **not** evidence that any 1.5×/3×/5× multiplier improves selection ROI. Fix provenance, SXF POLY snapshot availability, timing/position stitching, and net settlement coverage, then rerun walk-forward before promoting any predictive weights.
