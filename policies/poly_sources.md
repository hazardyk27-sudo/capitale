# POLY Source Policy

Status: CANONICAL
Version: 1.0

## Source-of-truth rule

Direct/public Polymarket data is the primary source of truth for wallet discovery, market trades, positions, holders, resolution, and price history.

SmartXFlow POLY may be used only as a visualization/cache aid and must not override direct Polymarket evidence.

## Allowed source classes

P1 — direct/public Polymarket market, trade, position, holder, resolution, and price data.

P2 — CAPITALE-derived metrics computed reproducibly from P1 data: directional positions, average entry, expected wins, edge vs entry, PnL, ROI, CLV, specialty metrics, and wallet classifications.

P3 — external wallet-discovery references or leaderboards. These may identify candidates but do not qualify a bettor until CAPITALE backfills and evaluates that wallet's football history under the canonical method.

## Qualification rule

External claims of profit, win rate, ranking, or 'sharp' status are discovery signals only. They cannot replace CAPITALE's football-wide qualification gate.

## Data-quality rule

- Missing PnL is missing, not zero.
- Incomplete settlement coverage must be exposed.
- Trade fills are not automatically separate bets.
- Live and prematch activity must be separated.
- Multiple correlated wallets must not automatically count as independent confirmation.

## Prohibited

POLY must not use team-form analysis, current news, SmartXFlow flow conclusions, bookmaker movement, or other department reports.
