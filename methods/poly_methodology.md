# POLY Methodology

Status: CANONICAL
Version: 1.1

## Objective

Evaluate the user's supplied betting preference by combining two independent POLY-domain evidence layers without mixing their meanings:

1. direct/public Polymarket for the **general match market**;
2. SmartXFlow **SXF POLY** for the **bettor/user layer**.

The methodology must answer separately:
- what the overall Polymarket market is pricing and how much money/liquidity is present;
- what SXF POLY users are doing;
- whether those two layers support, oppose, or remain neutral toward the user's preference.

## Stage 0 — Match and as-of normalization

Resolve the exact football event, kickoff time, target market and user preference.

Every run has an exact `as_of_utc`.

Do not use:
- market activity after `as_of_utc`;
- bettor activity after `as_of_utc`;
- live activity to justify a prematch conclusion.

## Stage 1 — General Polymarket market overview

Use direct/public Polymarket only for market-level evidence.

Collect when available:
- current/last reliable market price;
- implied probability;
- selection and opposite-side volume;
- overall observed event/market volume;
- number of participating wallets;
- buy/sell split;
- liquidity depth or liquidity note;
- concentration of the largest wallet(s);
- timing/freshness of activity.

### Concentration rule

A large headline volume must be discounted descriptively when one wallet dominates it.

Example:
- `$10k total volume` with one wallet responsible for `$8.5k` is not equivalent to broad market consensus.

General market volume is never described as 'sharp bettor confirmation' by itself.

## Stage 2 — SXF POLY bettor universe

The active bettor universe is exactly the set of users shown on the SXF POLY page at the decision timestamp.

Do not add bettors from:
- historical CAPITALE `poly.shortlist.v2`;
- `POLY_FOOTBALL_TRACKED`;
- generic Supabase tracked-wallet tables;
- raw Polymarket wallet discovery;
- large public trades whose wallet is not an SXF POLY user.

The old 24-wallet pool is retained only as historical/audit data and is SUPERSEDED for active report routing.

For each relevant SXF POLY user, collect only bettor-specific information shown or derivable from that page:
- user/label;
- selection/direction;
- amount or exposure;
- timing;
- repeated additions/reductions when shown;
- opposite positions/hedges when shown;
- reliability/performance fields when shown;
- normal sizing baseline when shown.

If bettor reliability or sizing history is absent on SXF POLY, mark it `UNKNOWN` rather than importing an unrelated bettor-history source.

## Stage 3 — Bettor-position interpretation

Repeated activity by the same user in the same market/selection is aggregated into one interpreted bettor position.

For each SXF POLY bettor position, consider:
- whether it supports or opposes the supplied preference;
- absolute amount;
- amount relative to that user's normal sizing when available;
- whether the position is clean or hedged;
- whether the user is adding, reducing or exiting;
- reliability of the user as actually evidenced on SXF POLY;
- whether agreeing users may be behaviorally correlated.

### Size discipline

Tiny positions must not be described as conviction merely because they exist.

A large amount is stronger evidence only when:
- the bettor's reliability is known or reasonably supported;
- the amount is meaningful relative to the bettor's normal sizing, when that baseline exists;
- the position is not substantially offset by opposite exposure.

## Stage 4 — Preference evidence balance

Classify evidence into three buckets.

### Supporting factors

Facts that materially support the exact user preference, from either:
- `GENERAL_POLYMARKET`; or
- `SXF_POLY_BETTOR`.

### Opposing factors

Facts that materially work against the exact user preference.

### Neutral / uncertain factors

Relevant facts that are directionally ambiguous, hedged, too small, too thin, or too uncertain to count clearly either way.

Missing data is not neutral; it is `NO EVIDENCE`.

## Stage 5 — POLY balance

End with a concise balance:
- `TERCİHİ DESTEKLİYOR`
- `HAFİF DESTEKLİYOR`
- `NÖTR / KARIŞIK`
- `HAFİF KARŞI`
- `TERCİHİ DESTEKLEMİYOR`
- `YETERLİ POLY KANITI YOK`

Also state confidence: LOW / MEDIUM / HIGH.

The balance is evidence-based, not a forced prediction.

## Important source-separation rules

### Direct Polymarket may answer
- What is the market price?
- How much general volume exists?
- How broad is market participation?
- Is volume concentrated in one or several wallets?

### SXF POLY may answer
- Which tracked bettors/users are relevant?
- What did those users select?
- How much did those users put on the selection?
- Are they hedged or one-sided?
- What bettor-quality information does SXF POLY show?

### POLY must not answer from the wrong source

Do not use raw Polymarket wallet trades to create a bettor shortlist.
Do not use the SXF department's market-flow signals as general market evidence.
Do not use team/news/tactical data.

## SmartXFlow isolation

SXF POLY bettor data is allowed.

The following SmartXFlow/SXF-department conclusions remain prohibited in POLY:
- EARLY MONEY;
- CONCENTRATION V1/V2;
- HEAVY;
- SURPRISE TEAM;
- STABLE/PREMIUM OVER;
- BTTS engine signal;
- any synthesized SXF market-flow conclusion.

## Data-quality standard

Always surface:
- missing SXF POLY bettor data;
- unknown bettor reliability;
- thin general market volume;
- one-wallet volume concentration;
- stale prices;
- unresolved hedges;
- incomplete user sizing baselines.

No data-quality gap may silently become positive evidence.
