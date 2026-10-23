# POLY v1.4 — Independent Bettor Discovery and Verification Methodology

Status: CANONICAL operational process; numerical skill/lift thresholds are NOT predictive calibration
Version: 1.4
Effective: 2026-10-23

## Prime directive

Do not consult **ANY CAPITALE Supabase data** or SXF POLY data (whether raw, derived, historical, summarized or as candidate lists). Do not inherit named wallet seeds from earlier runs, CAPITALE documents or chats. For POLY, only newly discovered and independently verified official Polymarket Data API v2, Gamma, CLOB and Polygon transactions count as bettor evidence. Governance docs may define methodology, not supply bettor evidence. This supersedes every conflicting POLY v1.0–v1.3 bettor-source rule.

## Step 0 — Record a fresh independent discovery run

- `discovery_run_id`, `method_version=poly-v1.4`, `started_at_utc`, `as_of_utc`, permitted source versions and URLs.
- Store the public discovery query/search/filter/pagination/window, count of candidates considered and omissions. Candidate identity must be sourced **independently from Polymarket itself**, never legacy lists.
- Consult current official documentation. As of 2026-10-23 Data API v2 is active; v1 retirement is announced for 2026-10-24.
- Select football market event IDs via official Gamma sports/event/market metadata; confirm football fixtures and *exact contract semantics*.

## Step 1 — Discover broadly and control selection bias

- Use official leaderboard as one **candidate discovery channel**, not a final rank of football bettors (leaderboard may mix sports/topics and include concentrated or stale profits).
- Complement with football-event-specific trade / holder participant discovery from permitted public Polymarket endpoints and Polygon on-chain evidence.
- Record coverage, market/window selection and limitations, and the subset of wallet IDs for which deep full-history collection completed.
- Reject paid verification shortcuts and old CAPITALE wallet aliases; do not copy previously named addresses even when coincidentally discoverable—fresh independently collected provenance is mandatory.

## Step 2 — Recover attributable football trade ledger

For each independently found public wallet:
- retrieve official public trade/activity/position data, paginating across the studied window;
- map `wallet -> event -> condition/market -> outcome token -> fills -> resolved contract`;
- reconcile BUY cost, SELL proceeds, splits/merges/transfers if relevant, redeemed payouts and fees using official chain evidence where necessary;
- preserve `first_entry_at`, `last_action_at`, `kickoff_utc`, `resolved_at`, `as_of_utc`; never use in-play entries as prematch;
- combine many fills of the same outcome into one **economic position**; avoid double-counted wallets across YES and NO, correlated markets, market-maker activity and transfer-based proxy-wallet duplication;
- check costs, shares, cashflow units and execution side—negative loss beyond invested cost is an audit alarm, not a trusted ROI;
- segregate directional held positions, hedged positions, high-turnover trading, ambiguous histories, and unresolved markets.

If full position economics cannot be reconstructed, set `pnl_verification=UNVERIFIED`; do not calculate true ROI from theoretical settlement returns.

## Step 3 — Calculate reproducible verified skill

- `n_resolved_prematch_football_positions`, `n_distinct_fixtures`, W/L, exact market family/line, average entry odds; ROI/PnL coverage fraction.
- `realized_pnl = sum(sell_proceeds + redemption_payout - buy_cost - verified_fees)`; `realized_roi_pct = realized_pnl / verified_invested_capital * 100`. Document denominator logic under recycling/partial exits.
- Report return by **independent event**, odds cohort, market family, stake cohort and rolling *time* window; check concentration in one outlier.
- Entry edge uses observed wins vs expected wins from **entry probabilities**, not only raw win rate; CLV only with verifiably time-aligned market quote before kickoff.
- Require enough resolved/verified data *before the evaluated new bet*, no future knowledge. Handle duplicate predictions on the same match as correlated units.
- `QUALIFIED`: >=100 resolved verified prematch positions, >=60 distinct football fixtures, positive entry edge, clear directional behavior.
- `ESTABLISHED`: >=250 positions, >=150 events, >=3 active months, >=2pp entry edge.
- `PROVEN`: independent verified positive ROI across material sample/time, reliable CLV and >=90% PnL completeness; this is a qualitative operational tier, not a promise of future profit.
- Otherwise `PROVISIONAL` or `UNKNOWN`; never promote based only on absolute wealth/stake.
- Assess sample uncertainty and stability before a user gets a follower highlight. Record data collection coverage and the excluded fractions.

## Step 4 — Detect and verify the next bet

Only for independently discovered users with current meaningful verifiable history:
- find prematch wager market/outcome using direct public wallet activity and Gamma market IDs;
- at exact `as_of_utc`, identify net exposure, buy/sell/hedge and entry stake/odds;
- compare to the **20–30 previous comparable** independent prematch positions, prior to first entry, using consistent cost/bet-level semantics. Fewer than 20 => `BASELINE_UNKNOWN`;
- stake multiple descriptive labels `IGNORE(<0.25)`, `SMALL(0.25–<0.75)`, `NORMAL(0.75–<1.5)`, `STRONG_SIZE(1.5–<3)`, `VERY_STRONG_SIZE(3–<5)`, `SPECIAL_SIZE(>=5)`. No empirical ROI boost is proven for any of these ranges.
- check that the **current feasible** price is available via CLOB quotes and sufficient liquidity; a bettor may have secured a price now inaccessible. Preserve entry vs current odds difference.
- user's odds >=1.40 filter applies to new highlighted picks, not to historical data acquisition (do not bias history by dropping old lower-odds positions).
- if any group of allegedly independent wallets shares repeated simultaneous proportional positions, flag possible correlation, not confirmed common control.
- do not infer `NO on favorite` implies `away YES`; respect exact contract payoff and draws.

## Step 5 — Output the bettor-centric dossier

First show `Bettor` | `verified n/events/time window` | `realized net ROI (coverage)` | `market specialty` | `new market/side` | `entry and current odds` | `stake and multiple` | `hedge status` | `quality`.
Then give a transparent summary of why the bettor is / is not worth following **based on actual records**. Missing independent verified bettor evidence yields `NO_QUALIFIED_BETTOR_EVIDENCE`; do not replace this with qualitative crowd support or a personal match prediction.

Every dossier must have official source URLs/identifiers, time and audit limitations. Following a bet is not a directive to place it.

## Step 6 — Freeze and assess honestly

- Freeze each run's source snapshots, pre-match decision and all abstentions in the approved GitHub versioned research archive when archival workflow is available.
- After independent settlement confirmation, assess **all** precommitted followed bets, including failed ones, separately from broader markets that POLY did not endorse.
- Use time-ordered walk-forward testing, separate fixture clusters and predeclared thresholds. Never use future bet settlements to justify an earlier bettor ranking.
- Show realized ROI only where exact cashflows/fees reconcile; otherwise clearly indicate it cannot be computed.

## Data quality kill switches

`SOURCE_BLOCKED` (primary API unavailable), `MISSING_HISTORY`, `PNL_UNVERIFIED`, `INSUFFICIENT_EVENTS`, `HEDGED`, `NO_FEASIBLE_PRICE`, `NO_QUALIFIED_BETTOR_EVIDENCE`. Never use banned data as a fallback for any switch.

Primary documentation:
https://docs.polymarket.com/llms.txt
https://docs.polymarket.com/market-data/overview
https://docs.polymarket.com/trading/wallet-activity
https://docs.polymarket.com/concepts/order-lifecycle
https://docs.polymarket.com/concepts/resolution
