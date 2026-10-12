# CAPITALE — Milestone Log

Status: CANONICAL PROJECT HISTORY
Last updated: 2026-10-12

This file records active state, decisions, superseded rules, technical debt, and next work. Historical decisions are never deleted; replaced rules are marked SUPERSEDED.

## 2026-10-12 — Repository bootstrap

Created the standalone `capitale` repository and installed the initial governance/documentation structure.

### Role status

- ANALYST v1.0 — CANONICAL
- NEWS v1.0 — CANONICAL
- POLY v1.0 — CANONICAL
- SXF — DRAFT; detailed SmartXFlow filters and signal hierarchy intentionally postponed while the owner researches filters.
- FINAL — DRAFT; synthesis role exists but weighting/conflict/decision rules are not yet fully approved.
- ENGINEER — active implementation/governance role; no match predictions.

### System architecture

The four evidence departments are isolated: ANALYST, NEWS, SXF, POLY. Only FINAL may synthesize them. FINAL performs no raw research. NO BET is a first-class result.

### Supabase implementation already present

Project: `moneyway/odds`
CAPITALE schema: `capitale`

Core objects include:
- system_settings
- research_runs
- agent_reports
- evidence_items
- final_recommendations
- bet_settlements
- daily_reports
- audit_log
- prompt_registry
- weight_versions
- calibration_metrics

Operational views include, among others:
- sxf_flow_summary
- run_readiness
- poly_wallet_bet_ledger_v1
- poly_wallet_prematch_bet_ledger_v1
- poly_wallet_market_performance_v1/v2
- poly_wallet_market_selection_performance_v1/v2
- poly_wallet_open_bets_v1
- poly_wallet_overall_performance_v2
- poly_wallet_watchlist_v2/v3
- poly_wallet_qualification_v1

### POLY v1.0 decisions

Primary truth is direct/public Polymarket data. SmartXFlow POLY is optional visualization/cache only.

Hierarchy:
1. All football bets
2. General football performance
3. Qualification as a successful football bettor
4. Sub-market specialization
5. Current-position relevance

General qualification must come before niche-market promotion.

Canonical general gate currently uses:
- at least 100 resolved prematch football positions;
- at least 60 distinct football events;
- positive edge versus entry probability;
- non-trading-heavy directional behavior.

Established/proven tiers require stronger sample/history and, when reliable, real PnL/ROI and CLV.

Market sample tiers:
- 0–14: INSUFFICIENT_SAMPLE
- 15–29: WATCH_SAMPLE
- 30–59: MEANINGFUL_SAMPLE
- 60–99: STRONG_SAMPLE
- 100+: ESTABLISHED_SAMPLE

PnL is not trusted when settlement coverage is incomplete. Current rule: ROI/PnL becomes decision-grade only when PnL coverage is at least 90%.

CLV canonical sign: closing probability minus entry probability. Positive means movement in the bettor's favor. Preferred closing snapshot is the last reliable prematch price within 60 minutes of kickoff; fallback may extend to six hours when necessary and must be marked.

Wallet lifecycle vocabulary:
CANDIDATE / WATCH / TRACK / REVIEW / INACTIVE / DOWNGRADED / IGNORE.

Behavioral clustering is required so several coordinated wallets are not automatically counted as independent sharp bettors.

### POLY shortlist

Operational shortlist is stored in Supabase as `poly.shortlist.v1`.

Current status:
- `0x821dab0565ebf5b327f51db06223fdcfe01acf16` — VALIDATED_INTERNAL
- `0x2a69660046d7acc4ab204d7cc5ba78b0776cd2f7` — VALIDATED_INTERNAL
- `0x9319a045cdd0c2180e5eb7ad44374383db9a6410` / sainttroplay — BACKFILL_REQUIRED
- `0x51698a47f840a242abc2ca0351371c7ffac41842` / 00gringo00 — BACKFILL_REQUIRED
- NiNo999 — wallet resolution and football-history backfill required

Pending/backfill entries are NOT canonical successful football bettors until full football history passes the same qualification rules.

### Known POLY data-quality issue

Historical PnL fields are incomplete for many won positions. Earlier raw negative ROI impressions from partial `pnl_usdc` sums are invalid for skill assessment. Winning-position settlement must be reconstructed from buy cost, sell proceeds, redeem/settlement proceeds, and resolution state.

### Next technical backlog

1. Direct Polymarket wallet discovery/history collector.
2. Football-only historical backfill for candidate wallets.
3. Reconstruct settlement/PnL with explicit coverage and provenance.
4. Verify CLV snapshot pipeline and sign convention end-to-end.
5. Build behavioral wallet-cluster checks.
6. Complete SXF methodology after owner research.
7. Complete FINAL synthesis and conflict rules.
8. Backtest each department independently, then calibrate FINAL weights/thresholds from evidence rather than intuition.

## Change policy

When an approved rule changes, append a dated entry. Do not rewrite history. Mark the previous rule SUPERSEDED and identify the new rule/version that replaced it.
