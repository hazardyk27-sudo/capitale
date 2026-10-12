# POLY Methodology

Status: CANONICAL
Version: 1.0

## Objective

Identify genuinely successful football bettors on Polymarket first, then determine their proven sub-market strengths, then evaluate the relevance of their current positions.

## Stage 0 — Data preparation

Use direct/public Polymarket data as primary truth.
Normalize football events, kickoff times, markets, selections, trades, resolution state, and price history.
Separate prematch and live activity.

Aggregate fills into net directional positions. A sequence of buys in the same wallet + market + selection is not multiple bets. Account for sells, opposing-side exposure, and hedging.

## Stage 1 — General football qualification

Evaluate ALL resolved prematch football positions for each wallet before looking for a niche specialty.

Required metrics:
- resolved positions;
- distinct football events;
- wins / losses;
- win rate;
- average entry probability;
- average decimal entry odds;
- expected wins = sum(entry probability);
- wins above entry expectation = actual wins - expected wins;
- edge vs entry in percentage points;
- resolved stake/exposure;
- active months and recent activity;
- 30d / 90d / 180d / all-time consistency where data exists;
- bettor type and trading behavior;
- PnL/ROI only when settlement coverage is reliable;
- CLV only when the closing-price pipeline is verified.

### Canonical minimum gate

A wallet may pass `QUALIFIED_GENERAL_FOOTBALL_BETTOR` when all are true:
- resolved prematch football positions >= 100;
- distinct football events >= 60;
- edge vs entry > 0;
- activity is not trading-heavy/market-maker-like.

This is a qualification gate, not an automatic ELITE label.

### Established / proven principle

A stronger long-term grade should require materially more evidence. Current v1.0 target for established status:
- >= 250 resolved positions;
- >= 150 distinct events;
- >= 3 active months;
- edge vs entry >= +2 pp.

`PROVEN` additionally requires reliable economic evidence when available: settlement-complete positive ROI/PnL and meaningful verified CLV history. Do not award PROVEN merely because PnL fields are missing.

## Stage 2 — Sub-market specialization

Only Stage-1-qualified wallets may be promoted as market specialists.

Normalize markets into stable canonical families/directions, including:
- TEAM_WIN YES / NO;
- DRAW YES / NO;
- TOTAL_GOALS by line and OVER / UNDER;
- BTTS YES / NO;
- HANDICAP by line/direction;
- other football markets only after explicit normalization.

For each specialty calculate:
- sample size;
- distinct events;
- wins/losses and WR;
- average entry probability;
- average decimal odds;
- expected wins;
- wins above expectation;
- edge vs entry;
- recent consistency;
- reliable PnL/ROI when available.

### Sample tiers

- 0–14: INSUFFICIENT_SAMPLE
- 15–29: WATCH_SAMPLE
- 30–59: MEANINGFUL_SAMPLE
- 60–99: STRONG_SAMPLE
- 100+: ESTABLISHED_SAMPLE

A tiny niche sample cannot override weak general football performance.

## Stage 3 — Current-position relevance

For a qualified wallet's current target-match position, evaluate:
- relevant specialty grade;
- gross and net exposure;
- stake versus the wallet's normal sizing distribution;
- weighted average entry price and decimal odds;
- first-entry time to kickoff;
- whether the wallet is adding, reducing, exiting, or hedging;
- agreement with other qualified wallets;
- whether agreeing wallets may belong to the same behavioral cluster.

Current-position significance should be expressed with evidence, not with invented certainty.

## Bettor classification

Classify wallets as:
- DIRECTIONAL_BETTOR
- MARKET_MAKER_LIKE
- HEDGER
- TRADING_HEAVY
- MIXED
- UNKNOWN

Sell-fill share, opposing-side positions, turnover patterns, short holding behavior, and repeated two-sided activity may inform classification. Classification rules should be versioned and tested as data improves.

## PnL / settlement standard

Canonical economic reconstruction:

`realized PnL = sell proceeds + redeem/settlement proceeds - buy cost`

Cancelled/void/refunded positions must not be counted as wins or losses.

Missing winning PnL must not be interpreted as zero.
PnL/ROI becomes decision-grade only when coverage >= 90% for the relevant sample. Otherwise mark `PNL_UNVERIFIED` or equivalent.

## CLV standard

Canonical sign:

`CLV probability pp = closing probability - entry probability`

Positive CLV means price moved in the bettor's direction after entry.

Preferred closing snapshot: last reliable prematch price within 60 minutes before kickoff. If unavailable, a fallback may use the last reliable snapshot up to six hours before kickoff and must be flagged as fallback.

Do not use CLV for grading until snapshot provenance and sign are verified end-to-end.

## Behavioral clustering

Multiple wallets with highly synchronized market choice, direction, timing, and repeated co-occurrence may be marked `POSSIBLE_BEHAVIORAL_CLUSTER`.

Cluster evidence is not identity proof. Its purpose is to avoid counting potentially coordinated wallets as independent confirmation.

## Wallet lifecycle

Operational statuses:
- CANDIDATE
- WATCH
- TRACK
- REVIEW
- INACTIVE
- DOWNGRADED
- IGNORE

A historically strong wallet must be re-evaluated when recent behavior materially deteriorates or activity stops.

## Current implementation caution

Historical settlement data currently has incomplete PnL coverage for many winning positions. Do not use partial historical sums as true ROI until reconstruction/backfill is complete.

Direct wallet-history discovery/backfill remains a technical backlog item and does not alter the methodology above.
