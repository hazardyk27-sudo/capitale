# CAPITALE — Milestone Log

Status: CANONICAL PROJECT HISTORY
Last updated: 2026-10-19

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

## 2026-10-17 — ANALYST v1.2 experimental shadow backtest started

ANALYST v1.1 remains CANONICAL and frozen as the production baseline.

The owner approved an EXPERIMENTAL v1.2 design to test whether market-specific football logic improves calibration and reduces false high-confidence selections.

### v1.2 experimental changes

- SIDE/1X2 and BTTS/KG VAR use separate analytical engines.
- SIDE selections emphasize baseline xGD/xPts, opponent-adjusted form, meaningful home/away structure, finishing/goalkeeping variance, matchup mechanisms, and explicit failure modes.
- BTTS is decomposed into two independent scoring questions: `home team to score` and `away team to score`.
- BTTS support may not exceed the weaker goal leg.
- zero-goal frequency and opponent clean-sheet strength become first-class BTTS risk variables.
- raw `last 5 BTTS`, raw W/D/L streaks and H2H are low-weight descriptive evidence unless corroborated by underlying football data.
- H2H is material only when structural/tactical continuity makes it comparable.
- extreme finishing overperformance is not treated as sustainable positive evidence.

### Validation protocol

- v1.1 historical decisions are immutable.
- v1.2 runs in shadow/experimental mode at the same AS_OF.
- no post-match data may enter pre-match reconstruction.
- settlements must be verified before entering the learning ledger.
- results are measured separately for SIDE, BTTS and COMBINATION selections.
- key metrics: hit rate by verdict, false-STRONG rate, calibration ordering, coverage, BTTS limiting-leg failure rate, and side-selection upset profile.
- use walk-forward validation; do not tune and evaluate on the same chronological block.
- run feature ablations for opponent adjustment, home/away split, zero-goal rate, clean-sheet rate, finishing variance, H2H, raw last-5 results, and tactical matchup layers.

Files added:
- `methods/analyst_v1_2_experimental.md`
- `schemas/analyst_v1_2_experimental_report.md`
- `experiments/analyst_v1_2_backtest.md`

No canonical promotion is authorized yet. v1.2 must demonstrate repeatable out-of-sample improvement before replacing v1.1.

---

## 2026-10-19 — ANALYST v1.3 experimental failure-path update approved

The original ANALYST v1.1 canonical decisions and v1.2 experimental pre-match reports remain unchanged. The owner requested a new update after apparent 18 October score-band failures; reported outcomes and counts from prior conversations are **UNVERIFIED_CONVERSATION_SUMMARY** until independently audited.

v1.3 EXPERIMENTAL is added for NEW shadow analyses:
- SINGLE WIN explicitly tests win, draw and loss routes, scoring floor and whether 0-0/1-1 can persist; stronger underlying side does not automatically imply a high-confidence win.
- 1X/X2 treat a draw as success and opponent victory as the sole failure path.
- OVER 2.5 tests distinct three-plus-goal routes and two-or-fewer match-lock scenarios, rather than relying on aggregate total xG.
- BTTS retains v1.2 two independent goal legs and weaker-leg cap.
- Away favorites, cup matches, cross-league comparisons, low-scoring fixtures and small home/away samples receive explicit quality checks, without invented penalties or automatic categorical disapproval.
- Operational 0–100 scores remain ordinal football-evidence strength, NOT probabilities. Experimental 75+ review requires independent evidence, venue/opponent comparability and examined/countered failure paths. Threshold is uncalibrated.
- Historical decisions are immutable; post-match settlement and feature calibration must not leak backward.
- Before entering the backtest ledger, verify scores through two independent sources (official + independent preferred) and settle cup normal time vs extra time correctly; prior conversational records are not yet a verified dataset.

New:
- `methods/analyst_v1_3_experimental.md`
- `schemas/analyst_v1_3_experimental_report.md`
- `experiments/analyst_v1_3_validation.md`

Canonical promotion BLOCKED until audit, chronological out-of-sample testing and meaningful comparison vs frozen v1.2 show improvements in false-high-score rate and score ordering without excessive coverage loss.

---

## Current role status — 2026-10-17

- ANALYST v1.1.2 — CANONICAL role instructions; v1.2 EXPERIMENTAL historical comparison; v1.3 EXPERIMENTAL new-run shadow testing
- NEWS v1.1 — CANONICAL
- POLY v1.2 — CANONICAL active split source model
- SXF v0.4 — DRAFT, approved core engine architecture and per-match dynamic horizon; validation/calibration pending
- FINAL v0.2 — DRAFT, approved synthesis architecture and operational persistence; numerical calibration pending
- ENGINEER — active implementation/governance role; no match predictions

## Current next work

1. Run new user selections through ANALYST v1.1 plus v1.2 shadow output at the same AS_OF.
2. Build an auditable settlement ledger with verified results and market-type tags.
3. Accumulate enough SIDE and BTTS samples for walk-forward comparison.
4. Measure false-STRONG rate and BTTS limiting-leg failures before any promotion decision.
5. Continue existing FINAL/POLY/SXF validation work.

## Change policy

When an approved rule changes, append a dated entry. Do not rewrite history. Mark the previous rule SUPERSEDED and identify the new rule/version that replaced it.

---

## 2026-10-17 — NEWS v1.2 promoted to CANONICAL

The owner approved NEWS v1.2 as the active production NEWS model. NEWS v1.1 remains part of project history but is SUPERSEDED for new NEWS runs.

The earlier `Current role status — 2026-10-17` block above is SUPERSEDED by the status block in this entry.

### NEWS v1.2 canonical changes

- Preference-aware NEWS interpretation is now split into `SIDE` and `GOALS_BTTS` families.
- NEWS remains fully isolated from odds, bookmaker markets, SmartXFlow, Polymarket and all other department reports.
- A user preference changes only the interpretation target; research coverage must remain symmetric across both teams.
- Every material directional factor must pass the causal-chain test:
  `current fact -> lineup/role/preparation change -> football mechanism -> preference effect`.
- Simple absence counting is replaced by replacement-first evaluation and interacting `absence chain` analysis.
- Every important absence distinguishes `ABSENCE_IMPORTANCE` from match-specific `ABSENCE_EFFECT`.
- Important absences are classified as NEW, RECENT, or LONG-TERM / ALREADY ABSORBED.
- Likely replacement, replacement confidence and role fit are mandatory whenever credible information is available.
- Related absences from the same functional unit are treated as one interacting structural chain and are not double-counted as independent confirmation.
- Generic manager motivation language is filtered out; only operationally meaningful availability, rotation, fitness, role, fixture-priority or preparation information is material.
- Schedule/congestion becomes material only when it has a plausible interaction with recovery, squad depth, availability or rotation.
- NEWS reports now include explicit pre-match failure modes.

### NEWS 0-100 evidence-confidence score

For user-supplied selections, NEWS v1.2 uses a canonical operational score:
- source reliability and verification: 0-25;
- freshness / match-time relevance: 0-20;
- causal connection to the supplied selection: 0-25;
- structural impact: 0-20;
- resistance to opposing evidence and unresolved uncertainty: 0-10.

Total: 0-100.

Operational bands:
- 90-100: VERY_STRONG_NEWS_EVIDENCE
- 80-89: STRONG_NEWS_EVIDENCE
- 70-79: MODERATE_STRONG_NEWS_EVIDENCE
- 60-69: MODERATE_NEWS_EVIDENCE
- 50-59: WEAK_MIXED_NEWS_EVIDENCE
- 0-49: INSUFFICIENT_OR_UNRELIABLE_NEWS_EVIDENCE

The score is explicitly NOT a win probability, bookmaker probability, value score or FINAL A/B/C category. Example: `86/100` means the NEWS case is strong, fresh and causally coherent; it does not mean an 86% chance that the selection wins.

These weights/bands are CANONICAL bootstrap rules for operational consistency but remain uncalibrated as probabilities. Future numerical revisions require versioning and out-of-sample evidence.

### Post-match NEWS learning

Performance review must track both result and process:
- selection hit/miss;
- whether the predicted NEWS mechanism actually appeared;
- whether the expected structural advantage/disadvantage appeared on the field when observable;
- whether failure was a NEWS interpretation error or outcome variance.

Standard review tags now include:
- REPLACEMENT_EFFECT_UNDERESTIMATED
- REPLACEMENT_EFFECT_OVERESTIMATED
- ABSENCE_ALREADY_ABSORBED
- ABSENCE_CHAIN_MISREAD
- ROTATION_MISREAD
- SOURCE_UNCERTAINTY
- CAUSAL_LINK_TOO_WEAK
- OPPOSING_NEWS_UNDERWEIGHTED
- MATCH_STATE_VARIANCE
- FINISHING_VARIANCE

Historical pre-match NEWS runs remain immutable; post-match information may evaluate them but cannot alter the original evidence or score.

### Files updated

- `AGENTS.md` -> System Constitution v1.5
- `roles/news.md` -> NEWS v1.2 CANONICAL
- `methods/news_methodology.md` -> v1.2 CANONICAL
- `schemas/news_report.md` -> v1.2 CANONICAL
- `prompts/news_start.md` -> v1.2 runtime bootstrap
- `MILESTONE.md` -> this change record

### Current role status — after NEWS v1.2 promotion

- ANALYST v1.1 — CANONICAL; v1.2 EXPERIMENTAL shadow/backtest active
- NEWS v1.2 — CANONICAL active production model
- POLY v1.2 — CANONICAL active split source model
- SXF v0.4 — DRAFT, approved core engine architecture and per-match dynamic horizon; validation/calibration pending
- FINAL v0.2 — DRAFT, approved synthesis architecture and operational persistence; numerical calibration pending
- ENGINEER — active implementation/governance role; no match predictions

### NEWS next validation work

1. Accumulate an auditable NEWS v1.2 settlement ledger split by SIDE and GOALS_BTTS.
2. Track hit rate and mechanism-confirmation rate by NEWS confidence band.
3. Compare v1.2 confidence ordering and false-high-confidence misses over time.
4. Review failure tags to identify systematic replacement, absence-chain, rotation or causal-link errors.
5. Use chronological/walk-forward validation before changing the 25/20/25/20/10 scoring architecture or confidence bands.

---

## 2026-10-19 — POLY v1.3 quality-first operational update (CANONICAL safeguards; predictive uplift UNVALIDATED)

**This entry supersedes POLY v1.2 as the latest POLY operational methodology/report/bootstrap; its approved two-source boundary remains unchanged.** The previous 24-wallet / direct raw wallet routing rule remains SUPERSEDED for active POLY. Previous historical research remains audit-only.

Owner requested a correction after 18 October POLY confidence/contrary-evidence failures. v1.3 changes **evidence gating, missing-data abstention, interpretation symmetry and reproducibility**; it does NOT claim a newly calibrated winner model or modify FINAL weights.

Operational rules:
- Direct/public Polymarket = general market price/volume/liquidity/concentration only. **SXF POLY page = only active bettor/user source**. A raw public wallet may inform concentration but not bettor-specific confidence.
- One bettor/event/market/economic position, not independent votes per trade fill; identify opposite YES/NO positions, sells/hedges and distinct contract payout semantics.
- Eligibility screen for main bettor signal: decimal odds >=1.40. Reference to odds 1.40–2.50 versus >2.50 is a testing cohort, NOT proven performance.
- A bettor's normal stake is the median of previous 20–30 comparably defined SXF POLY prematch positions, strictly preceding the target position's entry. If missing, `BASELINE_UNKNOWN`, not a numeric estimate.
- Descriptive sizing labels: <0.25× disregard, 0.25–<0.75× small, 0.75–<1.50× normal, 1.50–<3× strong size, 3–<5× very strong size, >=5× special size. **No numeric conviction score or 5× edge is validated**.
- Inherit existing QUALIFIED quality gate: >=100 verified resolved prematch positions, >=60 distinct events, positive entry edge and directional behavior. ESTABLISHED needs >=250 positions, >=150 events, >=3 active months and >=2pp edge; PROVEN needs reliable positive ROI and adequate CLV. PnL is decision-grade only at >=90% coverage. A sample of 30–99 is provisional, <30 or unknown data is UNKNOWN.
- Both opposing and supporting bettor claims pass the same skill/sample/clean-position/size/independence tests; loss-making or unknown bettor opposition never automatically vetoes independent support.
- No SXF POLY or no verifiable bettor history -> `YETERLİ POLY KANITI YOK` where appropriate. Abstentions, confidence and sources are recorded before settlement, never cherry-picked after.

Initial ENGINEER-only historical data audit (2026-10-09 to 2026-10-18 kickoff UTC):
- `capitale.poly_recent_football_bets` returned 3,253 rows across only seven wallets, 3,101 resolved, with 2,040 showing `first_traded_at >= kickoff_utc` — broad contamination/aggregation review needed.
- After resolved + stake >=100 + odds >=1.40: 1,561 records; only 142 have `last_traded_at < kickoff_utc` (strict whole-position prematch proxy), covering five wallets; 65 of these 142 have missing `pnl_usdc`.
- Chronological provisional baseline sample: 92 eligible positions with >=20 earlier comparable rows, only two >=5× and only one >=5× at odds 1.40–2.50.
- The -13.3% naive flat-stake return on the 142 strict rows is NOT financial settlement-verified ROI. Do not treat this sample as a validated calibrated bettor-ranking test.
- Full reproducible audit and next walk-forward protocol: `experiments/poly_v1_3_audit.md`.

Important correction: earlier conversational analysis that promoted raw public/tracked-wallet identities into active POLY bettor confidence **violated the existing canonical SXF POLY-only source rule**; do not reuse those decisions as compliant v1.3 evidence.

Files updated: `AGENTS.md`, `MILESTONE.md`, `roles/poly.md`, `methods/poly_methodology.md`, `policies/poly_sources.md`, `schemas/poly_report.md`, `prompts/poly_start.md`, new `experiments/poly_v1_3_audit.md`.

Current status: **POLY v1.3 CANONICAL process/guardrails; bettor predictive thresholds not calibrated; backtest validation BLOCKED by source coverage, timing and settlement**. Do not promote a 5× signal to statistically proven ELITE and do not feed raw audit wallets into active POLY reports.

---

## 2026-10-19 — NEWS v1.3 CANONICAL correction

NEWS v1.2 is SUPERSEDED for new NEWS runs; historic prematch reports remain immutable. The owner approved v1.3 to separate source/fact verification, replacement- and adaptation-adjusted effect confidence, and selection-specific NEWS direction. Missing compensation or causal evidence requires abstention. The uncalibrated 25/20/25/20/10 confidence score and invented 0-100 preference-support figures are retired for new runs; numeric fields are null until separate owner-approved out-of-sample calibration. NEWS cannot infer overall team strength or match outcome from injuries. The three-axis changes are operational, NOT validated predictive improvements.

Updated: AGENTS.md v1.7; roles/news.md, methods/news_methodology.md, schemas/news_report.md and prompts/news_start.md v1.3; experiments/news_v1_3_validation.md new. Subsequent audits track factual claims, on-field mechanism and selection results separately, with exact AS_OF and clustered match samples.
