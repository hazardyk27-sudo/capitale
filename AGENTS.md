# CAPITALE — System Constitution

Status: CANONICAL
Version: 1.7
Last updated: 2026-10-19

## 1. Purpose

CAPITALE is a multi-agent football match research and decision-support system designed to reduce confirmation bias, source contamination, future-data leakage, and hidden double-counting. Independent specialist departments produce isolated reports. Only FINAL may synthesize those reports into recommendations.

The system must prefer reproducibility, source discipline, uncertainty disclosure, and a valid `NO_RECOMMENDATION` outcome over forced predictions.

## 2. Roles

CAPITALE has six roles:

1. ANALYST — independent football performance, tactical baseline, and matchup analysis.
2. NEWS — independent current-context research: availability, replacement/absence-chain effects, manager, motivation, schedule, travel, weather, pitch, and relevant off-field conditions. NEWS assesses source facts, on-field effects after compensation and user selection relevance separately. No uncalibrated numerical NEWS confidence, market research or match-win prediction.
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

POLY uses a split source model:
- direct/public Polymarket is authoritative for **general match-market prices, volume, liquidity, participation and concentration**;
- the SmartXFlow **SXF POLY page is the exclusive active bettor/user source** for bettor identity, bettor-specific selections, amounts/exposures, timing, and bettor-quality fields shown there.

POLY must not use the historical CAPITALE 24-wallet shortlist, generic tracked-wallet tables, or raw Polymarket wallet discovery as its active bettor universe. A raw Polymarket wallet that is not present on SXF POLY may affect general market volume/concentration analysis but must not be promoted to bettor evidence.

SXF POLY bettor data is allowed inside POLY, but SXF-department market-flow conclusions remain prohibited. POLY may not import EARLY MONEY, CONCENTRATION, HEAVY, SURPRISE TEAM, Stable/Premium Over, BTTS engine signals, team form, current NEWS, or other department reports.

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

NEWS v1.3 separates source fact verification, compensated incremental football effect confidence, and preference-specific NEWS direction. The uncalibrated v1.2 0-100 scoring system is SUPERSEDED for new NEWS reports. Numeric fields remain null until independent owner-approved calibration. NEWS does not infer match win probabilities or baseline team strength.

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

ANALYST: v1.1.2 CANONICAL role presentation (historical v1.1 evidence baseline), v1.2 EXPERIMENTAL frozen historical shadow records, v1.3 EXPERIMENTAL active for new shadow runs: separate SINGLE WIN, DOUBLE CHANCE, OVER 2.5 and BTTS engines; explicit win/draw/loss and game-lock failure scenarios, cup/cross-league and away evidence-quality checks, ordinal 0–100 score gates, settlement audit and walk-forward validation. v1.3 is NOT CANONICAL.
NEWS: v1.3 CANONICAL — independently verified fact/effect/preference axes; replacement and adaptation counterhypothesis required; abstention when evidence incomplete; retired uncalibrated v1.2 0–100 scoring; independent mechanism/outcome audit.
POLY: v1.3 CANONICAL — v1.2 source split preserved; added symmetric bettor-quality gates, 1.40+ eligible odds, prior-position stake baseline, provenance and abstention audit; size uplift remains UNVALIDATED
SXF: v0.4 DRAFT — core engines + dynamic per-match horizon approved; validation/calibration pending
FINAL: v0.2 DRAFT — synthesis architecture approved; numerical calibration pending
ENGINEER: active governance/implementation role

POLY v1.3 only changes its **evidence-handling and reporting safeguards**. It does not authorize importing raw wallet histories as active SXF POLY bettor evidence, inventing empirical size thresholds, or replacing FINAL grades. See the experimental validation protocol for historical data caveats.

See MILESTONE.md for current implementation state, superseded rules, and technical backlog.
