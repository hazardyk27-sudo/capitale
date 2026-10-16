# POLY Source Policy

Status: CANONICAL
Version: 1.1

## Source-of-truth split

POLY now has two separate authoritative source domains.

### P1-MARKET — direct/public Polymarket

Use direct/public Polymarket for **general match-market evidence only**, including:
- event/market existence;
- current/observed market prices;
- total and per-selection volume;
- liquidity and participation when available;
- buy/sell and wallet concentration;
- timing of general market activity.

Polymarket raw wallet discovery MUST NOT define the bettor universe for POLY reports.

### P1-BETTOR — SmartXFlow SXF POLY page

Use the SmartXFlow **SXF POLY** page as the authoritative bettor source for:
- which bettors/users are in scope;
- bettor labels/identities as shown there;
- bettor-specific selections;
- bettor-specific amounts/exposures;
- timing and position direction;
- bettor statistics/quality fields explicitly shown there.

A bettor/user not shown on SXF POLY must not be added to the report merely because a raw Polymarket wallet made a large trade.

The former CAPITALE `poly.shortlist.v2` / 24-wallet operational pool is SUPERSEDED for active bettor routing. Historical records may remain available for audit/backtest but are not the active bettor source.

## Allowed derived evidence

P2-MARKET — reproducible calculations derived from P1-MARKET, such as:
- implied probability;
- share of total volume;
- whale concentration;
- wallet-count concentration;
- selection-vs-opposite volume comparisons.

P2-BETTOR — reproducible calculations derived only from SXF POLY bettor records, such as:
- aggregation of repeated fills/entries into one user position;
- current amount vs the user's normal sizing when SXF POLY provides the necessary baseline;
- agreement/disagreement counts among SXF POLY users;
- bettor-side support/opposition summaries.

If SXF POLY does not expose enough historical information to establish a bettor's reliability, reliability must be marked `UNKNOWN`/`NO EVIDENCE`; do not silently import a different bettor pool.

## SmartXFlow isolation boundary

Allowed:
- SXF POLY bettor/user data.

Prohibited:
- SXF department market-flow engine conclusions such as Early Money, Concentration, Heavy, Surprise Team, Stable/Premium Over, BTTS signals;
- using those SXF flow conclusions as POLY evidence.

## Data-quality rules

- Missing bettor data is missing, not neutral.
- General market volume is not bettor-quality evidence.
- One whale dominating public volume must be identified.
- Repeated activity by the same SXF POLY user is not multiple independent bettor votes.
- Hedged/opposite positions must be preserved when visible.
- Prematch and live activity must be separated.
- No bettor activity after `as_of_utc` may be used.

## Prohibited

POLY must not use:
- team-form/tactical analysis;
- current NEWS;
- bookmaker movement/odds analysis as evidence;
- ANALYST, NEWS, SXF-department, or FINAL conclusions;
- historical CAPITALE 24-wallet routing as the active bettor universe.
