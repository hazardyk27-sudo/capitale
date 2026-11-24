# PRICE RESISTANCE v0.1 — pre-test candidate protocol
2026-11-24. Research only; user requests a candidate using existing SXF fields, without new sources.
Mechanism: matched activity shifts mainly to the other two 1X2 outcomes, but the selected favourite's price does not weaken. This describes resilience, not identified net back/lay flow. Different from FLOW RECOVERY: no 80% historical-share requirement or crossing; does not depend on V1 eligibility.
Frozen decision at T6:
1. At T8, home or away selection is the unique shortest-price outcome among all three, decimal 1.40–2.10 inclusive (owner's prior research range), selected matched amount >= GBP1000 (existing V1 minimum, not newly fitted).
2. Valid complete same-fixture snapshots T8 and T6, distinct source times, no post-cutoff observations, using existing 59-minute freshness rule.
3. All three matched-volume differences nonnegative; selected difference strictly positive. Sum of other two differences strictly exceeds selected difference (majority of new matched activity elsewhere; natural 50% split, not optimized).
4. Selected raw odds at T6 <= T8 and normalized implied probability at T6 >= T8. All comparisons from full market.
Test exact formula without tuning: Oct9–Nov24 available data, October and November separately, compare to all same-coverage T8 favourites with same initial range/minimum, and controls matched on month and T6 odds in .10 bins. Report overlap with V1/Flow Recovery, independent new selection count, average T6 odds, outcomes, sample/coverage limitations. No posthoc rescue filters. Same prior historical dataset viewed, not an untouched prospective holdout. No deployment without owner approval.
