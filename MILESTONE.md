# CAPITALE — Milestone Log

Status: CANONICAL PROJECT HISTORY
Last updated: 2026-10-13

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

The four evidence departments are isolated: ANALYST, NEWS, SXF, POLY. Only FINAL may synthesize them. FINAL performs no raw research. NO BET was initially defined as a first-class result.

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

Operational shortlist was initially stored in Supabase as `poly.shortlist.v1`.

Initial status:
- `0x821dab0565ebf5b327f51db06223fdcfe01acf16` — VALIDATED_INTERNAL
- `0x2a69660046d7acc4ab204d7cc5ba78b0776cd2f7` — VALIDATED_INTERNAL
- `0x9319a045cdd0c2180e5eb7ad44374383db9a6410` / sainttroplay — BACKFILL_REQUIRED
- `0x51698a47f840a242abc2ca0351371c7ffac41842` / 00gringo00 — BACKFILL_REQUIRED
- NiNo999 — wallet resolution and football-history backfill required

Pending/backfill entries are NOT canonical successful football bettors until full football history passes the same qualification rules.

### Known POLY data-quality issue

Historical PnL fields are incomplete for many won positions. Earlier raw negative ROI impressions from partial `pnl_usdc` sums are invalid for skill assessment. Winning-position settlement must be reconstructed from buy cost, sell proceeds, redeem/settlement proceeds, and resolution state.

### Next technical backlog at bootstrap

1. Direct Polymarket wallet discovery/history collector.
2. Football-only historical backfill for candidate wallets.
3. Reconstruct settlement/PnL with explicit coverage and provenance.
4. Verify CLV snapshot pipeline and sign convention end-to-end.
5. Build behavioral wallet-cluster checks.
6. Complete SXF methodology after owner research.
7. Complete FINAL synthesis and conflict rules.
8. Backtest each department independently, then calibrate FINAL weights/thresholds from evidence rather than intuition.

---

## 2026-10-13 — SXF core design and dynamic match horizon approved

The previous statement that SXF filters were still awaiting owner research is now SUPERSEDED by SXF DRAFT v0.4.

### SXF DRAFT v0.4 active core set

Approved core engines:
- EARLY MONEY with T-72/T-60/T-40/T-24/T-12 trigger logic;
- Retention 55 for T-72/T-60/T-40/T-24 Early Money origins;
- 1X2 CONCENTRATION V1;
- 1X2 CONCENTRATION V2 as a quality layer on V1;
- HEAVY 1X2 as a premium Concentration tag;
- SURPRISE TEAM as upset/non-loss risk rather than an automatic win call;
- STABLE OVER 2.5;
- PREMIUM OVER 2.5, superseding Stable on the same selection;
- BTTS YES.

Key relationship rules:
- V2 is not a second independent vote over V1;
- HEAVY is not a second independent vote;
- Premium Over supersedes Stable Over on the same selection;
- Retention break cancels only Early Money, not the whole match;
- Early + Concentration overlap and BTTS + Over overlap do not receive automatic confidence bonuses.

### Dynamic per-match horizon

T-6/T-5/T-4/T-3 are reference/control buckets, not one shared batch horizon.

For each match independently:

`hours_to_kickoff = kickoff_utc - as_of_utc`

The exact match-specific `as_of_utc` is the real data cutoff. A batch may contain one match near T-3 and another near T-6. SXF must analyze each at its own exact remaining time and may only use the latest SmartXFlow snapshot at or before that timestamp.

Future data, closing data, later alarms, or later snapshots are forbidden.

Supabase settings:
- `sxf.core_engines.v0.3`
- `sxf.dynamic_horizon.v0.4`

SXF remains DRAFT pending prospective validation and calibration; its core methodology design is no longer an open architecture blocker.

---

## 2026-10-13 — POLY operational tracked pool expanded to 24 wallets

The five-wallet operational shortlist description above is SUPERSEDED for current tracking operations.

Current Supabase configuration:
- `poly.shortlist.v2`
- `poly.current_shortlist`
- operational category: `POLY_FOOTBALL_TRACKED`

All 24 selected wallets are in the same operational tracking category. This does NOT mean all 24 are canonically proven sharp bettors.

Wallet quality, bettor style, sample strength, entry edge, ROI/PnL reliability, CLV, market specialty, lifecycle, and current relevance remain individually measured.

Known remaining POLY work:
- direct 30/60/90-day football-history backfill where current raw coverage is insufficient;
- settlement/PnL reconstruction and coverage verification;
- bettor-style classification and specialty evaluation;
- wallet resolution cleanup for entries whose operational record still contains only a partial address.

---

## 2026-10-13 — FINAL synthesis architecture approved as DRAFT v0.2

The previous FINAL v0.1 BET/WATCH/NO BET architecture is SUPERSEDED.

### Current output model

FINAL now uses only:
- `A`
- `B`
- `C`
- `NO_RECOMMENDATION`

There is no separate BET/WATCH/NO BET action class in the current FINAL architecture.

Only FINAL assigns A/B/C. Departments provide evidence, strength, uncertainty, and data quality but do not assign FINAL categories.

A/B/C are absolute cross-match quality standards. Numerical thresholds remain intentionally uncalibrated until backtesting.

### FINAL synthesis rules

Approved architecture includes:
- FINAL uses department reports only and performs no new raw research;
- strict as-of/future-data rule;
- match thesis with no category of its own;
- no fixed maximum number of recommendations per match;
- derived safer markets and logical combination markets allowed with explicit evidence trace;
- each combination leg must have separate support;
- combination category cannot exceed its weakest leg;
- singles and supported combinations may coexist;
- mutually opposite recommendations are forbidden;
- highly correlated recommendations may coexist only with correlation tagging and without independent-evidence double counting;
- duplicate underlying evidence must be deduplicated;
- each recommendation gets an evidence trace, category rationale, and failure mode;
- B/C include explicit limiting factors;
- same-category outputs may be ranked A1/A2/A3 etc.;
- confidence and value are separate axes;
- weak value does not automatically demote A or B;
- no stake sizing yet.

### FINAL structural weighting

POLY is the only structurally lower-weight department:
- POLY = 5%-15%;
- remaining 85%-95% split equally between ANALYST, NEWS, and SXF;
- POLY cannot structurally outweigh the other three.

Weights are support structure, not majority voting.

Report-level reliability and freshness may modify effective contribution. NEWS/SXF/POLY are more freshness-sensitive than ANALYST.

Missing data is `NO EVIDENCE`; most unused contribution may be redistributed while retaining a small missing-data confidence penalty. Exact redistribution, freshness decay, reliability multipliers, and conflict penalties remain calibration parameters.

Strong conflicting evidence causes a real confidence penalty but is not an automatic veto. A single exceptionally strong department may still support an A recommendation if stronger contrary evidence is absent.

When new important information arrives after a FINAL run, generate a new immutable FINAL run/version rather than mutating history.

FINAL remains DRAFT because numerical category thresholds and penalty/multiplier functions still require backtest calibration.

### FINAL Supabase persistence completed

FINAL v0.2 is now represented in `capitale.system_settings` through:
- `final.methodology.v0.2`;
- `final.weights.v0.2`;
- `final.recommendations.v0.2`;
- `final.current_methodology`.

The `capitale.final_recommendations` storage model was migrated for the new architecture. The old action constraint `bet/no_bet/watch` is SUPERSEDED for new rows by:
- `recommendation`;
- `no_recommendation`.

New storage fields support A/B/C category, within-category rank, derived/combination flags, value assessment, evidence trace, limiting factors, failure mode, and correlation metadata. Stake/confidence legacy numeric columns remain available but are not active decision rules in FINAL v0.2.

---

## Current role status — 2026-10-13

- ANALYST v1.0 — CANONICAL
- NEWS v1.0 — CANONICAL
- POLY v1.0 — CANONICAL methodology; 24-wallet operational tracked pool; historical backfill still improving
- SXF v0.4 — DRAFT, approved core engine architecture and per-match dynamic horizon; validation/calibration pending
- FINAL v0.2 — DRAFT, approved synthesis architecture and operational persistence; numerical calibration pending
- ENGINEER — active implementation/governance role; no match predictions

## Current next work

1. Run a 3-5 match end-to-end dry run across different kickoff horizons: ANALYST -> NEWS -> SXF -> POLY -> FINAL.
2. Verify strict future-data leakage protection, report-version reproducibility, and match-specific SXF horizon handling.
3. Backtest/calibrate FINAL A/B/C categories, reliability/freshness adjustments, conflict penalties, and missing-data behavior.
4. Continue POLY 24-wallet historical backfill and settlement/PnL quality work.
5. Promote SXF/FINAL only after validation evidence supports canonical status.

## Change policy

When an approved rule changes, append a dated entry. Do not rewrite history. Mark the previous rule SUPERSEDED and identify the new rule/version that replaced it.
