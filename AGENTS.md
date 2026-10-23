# CAPITALE — System Constitution

Status: CANONICAL
Version: 1.11
Last updated: 2026-10-23

## 1. Purpose

CAPITALE is a multi-agent football match research and decision-support system designed to reduce confirmation bias, source contamination, future-data leakage, and hidden double-counting. Independent specialist departments produce isolated reports. Only FINAL may synthesize those reports into recommendations.

The system must prefer reproducibility, source discipline, uncertainty disclosure, and a valid `NO_RECOMMENDATION` outcome over forced predictions.

## 2. Roles

CAPITALE has six roles:

1. ANALYST — independent football performance, tactical baseline, and matchup analysis.
2. NEWS — NEWS MATCH IMPACT v1.4 researches the entire verified pre-match atmosphere for both clubs, including manager/player/fan/local-press/club/squad/preparation context; scores each distinct H# story -3..+3 for 1/X/2, Over/Under 2.5 and KG Yes/No, and reports signed totals. These ordinal points are uncalibrated and not result probabilities.
3. SXF — independent SmartXFlow market-flow analysis. Its approved v0.4 core engines and dynamic per-match horizon rule are DRAFT pending validation/calibration.
4. POLY — independent prediction-market / bettor-intelligence analysis using the active split source policy defined below.
5. ENGINEER — architecture, data access, schemas, prompts, versions, testing, backtesting, calibration, and maintenance. ENGINEER does not make match predictions.
6. FINAL — the only role allowed to combine the four independent department reports. FINAL does not perform raw-source research.

## 3. Isolation Rule

ANALYST, NEWS, SXF, and POLY are independent departments.

They MUST NOT:
- read another department's report before completing their own;
- use another department's conclusions as evidence;
- communicate with one another to converge on a pick;
- use prohibited sources assigned to another department;
- optimize for agreement with another department.

Each department is evaluated on the correctness and reproducibility of its own work, not on agreement with the others.

Only FINAL may see all four completed department reports at the same time.

## 4. Source Separation

ANALYST may use historical/current-season football performance, match, statistical, and tactical evidence permitted by its source policy. It may not use current news, betting/odds/market-flow data, SmartXFlow, or Polymarket.

NEWS may use current news and contextual sources permitted by its source policy. It may not use betting/odds/market-flow data, SmartXFlow, Polymarket, or other department reports. A user-supplied selection may determine which NEWS mechanisms are relevant, but NEWS must research both teams symmetrically and must not search selectively for confirmation.

SXF may use SmartXFlow data only. It may not use team form, current news, Polymarket, or other department reports. Its current DRAFT v0.4 core engines and exact per-match as-of rule are defined in its role/method/schema files.

POLY v1.4 uses **independent direct-source discovery and verification**:
- Discover football bettors independently from public Polymarket official Data API v2 leaderboard / wallet trade / activity / position endpoints, Gamma sports fixtures and markets, supported CLOB prices/market endpoints, and Polygon on-chain receipts/settlement events when needed.
- **Never read, query, ingest, cross-check, seed from, or otherwise use any CAPITALE/SXF Supabase dataset, past bettor list, earlier wallet history, cached metric, or a dataset derived from those sources.** The banned family explicitly includes `public.polymarket_trades`, `public.polymarket_matches`, `tracked_wallets`, `poly_wallet_*`, and other CAPITALE Supabase objects. This ban is role-specific to POLY and does not change SXF's separately approved data permissions.
- SXF POLY page is **not** a bettor source, whitelist, shortcut or verification step. A bettor must be independently discovered and audited from permitted primary Polymarket/on-chain sources. The prior SXF POLY-only model is SUPERSEDED for new POLY runs.
- Historical GitHub methods/outputs may be read for *governance*, but **must not be used as bettor evidence, candidate seed lists or factual wallet-performance inputs**. Permitted newly collected source evidence must be referenced by direct source URL/identifier and acquisition/as-of timestamp.
- POLY is a **bettor-identification, verification and follow-the-bettor** specialist, not an independent football prediction/market-flow voting department. If no independently verified profitable directional football bettor has a relevant clean prematch position, return `NO_QUALIFIED_BETTOR_EVIDENCE`, not market-volume-based support.
- Other departments' conclusions, team form, NEWS, or SXF EARLY / V1 / V2 / HEAVY / SURPRISE engine outputs remain prohibited as POLY evidence.

FINAL uses completed department reports only. It must not browse for new match evidence or silently repair a department report with raw research.

## 5. Decision Discipline

`NO_RECOMMENDATION` is a first-class valid FINAL result.

FINAL recommendation confidence is expressed only as `A`, `B`, or `C`; there is no separate BET/WATCH/NO BET action class in the current FINAL architecture.

A department must distinguish:
- observed fact;
- derived metric;
- interpretation;
- uncertainty or missing data.

Missing or unreliable data must never be silently converted into neutral or positive evidence. Missing data is no evidence.

Conflicting evidence must be preserved, not averaged away. FINAL must reduce confidence when material conflicts remain unresolved, while avoiding simplistic majority voting.

Evidence arising from the same underlying cause must not be double-counted as independent confirmation.

NEWS MATCH IMPACT v1.4 is the active NEWS methodology. It supersedes v1.3's research/output and v1.2's 0–100 confidence rubric for new runs. Source reliability, factual/interpretation separation, AS_OF, independent roles, no double-counting and immutable historical reports still apply. NEWS -3..+3 points are uncalibrated, not win probabilities.

Thresholds, reliability/freshness multipliers, penalties, and category boundaries should ultimately be learned or calibrated from backtests. Bootstrap rules may be used only when explicitly versioned and marked as unvalidated.

## 6. As-of / Future-Data Rule

Every department and FINAL decision is tied to an exact decision timestamp.

No information that became available after that timestamp may be used to justify the decision.

For SXF specifically, each match computes its own exact remaining time to kickoff. A batch MUST NOT use one shared T-6/T-5/T-4/T-3 horizon. Those labels are research/reference buckets, while the real cutoff is the match-specific `as_of_utc`.

If meaningful new information arrives later, create a new versioned run rather than mutating the historical decision.

Post-match review may evaluate whether a NEWS mechanism was realized, but settlement information must never be written back into or used to alter the original pre-match NEWS report.

## 7. Reproducibility

Every research run should be reproducible from:
- role and prompt version;
- model name/version when available;
- source/evidence references;
- input snapshot or snapshot hash;
- exact decision timestamp and freshness status;
- derived metrics and methodology version;
- final output and later settlement.

Methodological changes must be versioned. Historical decisions are never silently deleted. When a rule is replaced, mark the prior rule SUPERSEDED and record the replacement in MILESTONE.md.

## 8. Role Startup Order

Before performing a role, read in this order:

1. AGENTS.md
2. MILESTONE.md
3. roles/<role>.md
4. policies/source_policy.md
5. policies/<role>_sources.md when present
6. schemas/<role>_report.md
7. methods/<role>_methodology.md

If a role is marked DRAFT, do not invent missing canonical thresholds. Use only approved rules and explicitly distinguish uncalibrated parameters.

## 9. Governance

Major methodological rules are jointly decided with the system owner before becoming canonical.

ENGINEER may implement already-approved rules, add tests, improve reproducibility, and expose data-quality failures, but must not unilaterally create a new football-prediction rule and label it canonical.

Canonical status vocabulary:
- CANONICAL — approved and active.
- DRAFT — approved design may exist, but empirical validation/calibration or final lock remains pending.
- EXPERIMENTAL — testable implementation not yet promoted.
- SUPERSEDED — retained for history but no longer active.

Experimental shadow methods may run alongside a canonical role only when their output is stored/versioned separately and cannot silently overwrite the canonical historical decision.

Bootstrap scoring rules may be CANONICAL for operational consistency while remaining explicitly uncalibrated as probabilities. Their empirical calibration must be evaluated separately and any later numerical change must be versioned.

## 10. Current State

ANALYST: v1.1.4 CANONICAL base role/presentation. Historical v1.2 experimental snapshots frozen; v1.3 EXPERIMENTAL remains selection-specific failure-path/score gating. **v1.4.1 EXPERIMENTAL owner-directed research priority for NEW runs:** (1) ALL current-season league matches for both teams stratified by each opponent's pre-fixture habitual possession HIGH >=55%, BALANCED strictly 45–55%, LOW <=45%, and opponent strength/venue; (2) LAST THREE league matches score vs performance graphs; (3) LATEST ONE league match versus prior two, including score AND xG/xGA/shots/sot and opponent-difficulty correction only where properly modeled; (4) first-half/second-half possession/score/stats splits only where actual sourced half data exist. Strong opponent versus weak opponent must not be equated; form alone cannot erase baseline strength. v1.4.1 is NOT a validated calibrated predictive model or CANONICAL promotion.
NEWS: v1.4 CANONICAL — whole-match news and atmosphere, numbered source-verified H# stories, seven -3..+3 market-impact columns and arithmetic totals. v1.3 research instructions SUPERSEDED.
POLY: v1.4 CANONICAL — independent public Polymarket v2 + Gamma/CLOB + Polygon bettor discovery/verification; all CAPITALE Supabase and SXF POLY sources prohibited; candidate skill thresholds uncalibrated
SXF: v0.4 DRAFT — core engines + dynamic per-match horizon approved; validation/calibration pending
FINAL: v0.2 DRAFT — synthesis architecture approved; numerical calibration pending
ENGINEER: active governance/implementation role

POLY v1.4 replaces the SXF POLY-only bettor source rule with direct primary-source independent discovery. Its purpose is verified profitable football bettor identification and follow-up; no betting-edge claim or source substitution is permitted without independently collected evidence. See MILESTONE.md.

See MILESTONE.md for current implementation state, superseded rules, and technical backlog.
