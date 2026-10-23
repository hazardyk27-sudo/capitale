# POLY Source Policy

Status: CANONICAL
Version: 1.4
Effective: 2026-10-23

## Mandatory source contract

**DIRECT_INDEPENDENT_POLYMARKET_ONLY.** New independent bettor discovery, football wager history, realized PnL, current positions and market prices must all be drawn from primary Polymarket/Polygon data collected in the current independent research workflow.

Authoritative sources:
- Official Polymarket **Data API v2**: leaderboard/candidate discovery, wallet activity, trades, positions, supported PnL, profile.
- Official **Gamma** events/markets and sports metadata: football event mapping, condition/token IDs, kickoff, event type, resolution.
- Official **CLOB** public market/prices/orderbooks: entry/current feasibility and liquidity.
- **Polygon on-chain** transaction/settlement/redemption evidence: independently reconcile incomplete or contradictory economic flows.

Validate official endpoint versions before each implementation; Data API v1 retirement scheduled for 2026-10-24. A source returning no data is not authorization to substitute legacy records.

## NEVER-USE sources for POLY

**Absolute prohibition, including read-only access, comparison and research candidate seeding:**
- Any historical or live CAPITALE/SXF **Supabase** object, view, raw table, snapshot or export. Examples (non-exhaustive): `public.polymarket_trades`, `public.polymarket_matches`, `public.tracked_wallet_bets`, `public.tracked_wallets`, `capitale.poly_wallet_*`, all `research_archive` tables and old `poly.shortlist.*` configurations.
- SXF POLY web page, its user lists, bettor stats or copied page exports.
- Old CAPITALE / ChatGPT / GitHub bettor addresses as research seeds; previously cited wallet-performance summaries as factual evidence.
- Other departments' SXF engine signals, team/news research, merged/FINAL judgements.

Allowed exception: reading GitHub **governance and method documentation**, exclusively to comply with methodology/version control. Do not extract wallet identities or numbers from this history and do not relabel them as fresh evidence.

These restrictions apply to **POLY**, not to SXF's separately governed source permissions.

## Derivation and verification

- Record exact primary source URL/endpoint, UTC observation/fetch time, event/condition/token ID and wallet address for each accepted fact.
- No positive bettor-skill conclusion without football-only verified sample, economically reconciled outcomes, position cleanliness and coverage. `realized_PnL = sales + redemption - buys - fees` as supported by source.
- Aggregate repeated fills into economic positions; do not treat buying YES/NO or multiple markets as independent votes or infer NO on team equals opposite team win.
- Preserve missing trades/fees/position states as unknown; never invent wallet ROIs or force win probabilities.
- Historical verification uses **only** primary records gathered independently. The previous 24-wallet and SXF-POLY-only policies are SUPERSEDED for POLY v1.4.
- Match-time cutoff strict: `observed_at_utc <= as_of_utc < kickoff_utc`. Historical bettor quality at `as_of_utc` may only use past *resolved* positions known at that time.
- If API coverage is incomplete, report `NOT_VERIFIED`; do not consult banned CAPITALE datasets as fallback.
- No external service or new data platform is required for source discovery. If archiving raw fetched data, follow project GitHub archival and privacy/legal rules without creating Supabase persistence.

## Current provider references

- https://docs.polymarket.com/market-data/overview
- https://docs.polymarket.com/market-data/discover-markets
- https://docs.polymarket.com/market-data/public-analytics
- https://docs.polymarket.com/trading/wallet-activity
- https://docs.polymarket.com/concepts/order-lifecycle
- https://docs.polymarket.com/concepts/resolution
- https://docs.polymarket.com/llms.txt
