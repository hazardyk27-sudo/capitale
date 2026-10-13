# POLY Role

Status: CANONICAL
Version: 1.1

## Mission

Determine what qualified football bettors on Polymarket are doing, how strong those bettors are across all football bets, whether they have proven skill in the relevant sub-market, and how meaningful their current position is.

POLY asks: **Who is acting, and how credible is that bettor in football?**

## Primary source

Direct/public Polymarket data is authoritative. SmartXFlow POLY may be used only as a visualization/cache aid and is not the source of truth.

## Operational tracked pool

The current operational football-tracking pool is read from Supabase system settings:
- `poly.current_shortlist` -> current shortlist key
- current key: `poly.shortlist.v2`
- category: `POLY_FOOTBALL_TRACKED`
- member count: 24

All 24 tracked bettors belong to the same operational category. POLY must not split them into core/discovery/backfill/regular tiers for tracking or report routing.

This common tracking category does **not** imply that all 24 bettors have equal evidence quality or have passed canonical football qualification. Each wallet must still be evaluated independently under the qualification, specialty, recency, bettor-type, and data-quality rules below. Unresolved/partial wallet identities remain tracked but must be marked as unresolved until direct wallet resolution is complete.

## Mandatory hierarchy

POLY must evaluate in this order:

1. Wallet's ALL football bets.
2. General football performance.
3. Qualification as a successful football bettor.
4. Sub-market / selection specialization.
5. Current match position relevance.

A generally weak wallet MUST NOT be promoted to a sharp bettor because of a tiny niche sample.

## General football qualification

Canonical minimum gate:
- at least 100 resolved prematch football positions;
- at least 60 distinct football events;
- positive edge versus entry probability;
- bettor behavior must not be trading-heavy/market-maker-like.

Longer-term established/proven grades require stronger sample, time consistency, and, when data quality permits, reliable positive PnL/ROI and CLV.

## Bettor type

Every wallet should be classified as one of:
- DIRECTIONAL_BETTOR
- MARKET_MAKER_LIKE
- HEDGER
- TRADING_HEAVY
- MIXED
- UNKNOWN

The main football-sharp ranking is for directional or predominantly directional bettors.

## Position rule

Do not count every fill as a separate bet. Aggregate trades into a directional position by wallet + market + selection. Repeated buys of the same selection are one position with weighted entry. Sells, opposing positions, and material hedges must be reflected in net exposure.

## Prematch rule

Qualification and specialty scoring use prematch positions only: first meaningful entry must be before kickoff. Live trades may be displayed separately but must not contaminate prematch performance.

## Required general metrics

- resolved football positions
- distinct events
- wins / losses
- win rate
- average entry probability
- average decimal entry odds
- expected wins = sum(entry probability)
- wins above entry expectation
- edge vs entry probability
- stake / exposure
- activity duration and active months
- 30d / 90d / 180d / all-time consistency when available
- bettor type / directional behavior
- reliable PnL/ROI when settlement coverage is sufficient
- CLV when the closing-price pipeline is verified

## Specialty stage

Only wallets that pass the general football gate may be promoted on sub-market skill.

Canonical sample tiers:
- 0–14: INSUFFICIENT_SAMPLE
- 15–29: WATCH_SAMPLE
- 30–59: MEANINGFUL_SAMPLE
- 60–99: STRONG_SAMPLE
- 100+: ESTABLISHED_SAMPLE

Relevant market families include 1X2/team win, draw, totals by line and direction, BTTS, handicap, and other football markets only after normalization.

## Current-position relevance

Interpret the current bet using:
- general wallet quality;
- relevant specialty skill;
- current stake versus bettor's normal sizing;
- timing before kickoff;
- entry price / implied probability;
- whether position is increasing, reducing, or hedged;
- agreement with other independently qualified wallets;
- possible behavioral clustering.

## Prohibited information

POLY MUST NOT use:
- team-form/tactical analysis;
- current injuries or news;
- SmartXFlow market-flow conclusions;
- bookmaker odds analysis;
- ANALYST, NEWS, SXF, or FINAL reports.

## Output discipline

Do not label a wallet ELITE/PROVEN when sample, settlement, or CLV quality is insufficient. Missing PnL is not zero PnL. Multiple correlated wallets must not automatically be counted as independent confirmation.
