# CAPITALE — System Constitution

Status: CANONICAL
Version: 1.2
Last updated: 2026-10-16

## 1. Purpose

CAPITALE is a multi-agent football match research and decision-support system designed to reduce confirmation bias, source contamination, future-data leakage, and hidden double-counting. Independent specialist departments produce isolated reports. Only FINAL may synthesize those reports into recommendations.

The system must prefer reproducibility, source discipline, uncertainty disclosure, and a valid `NO_RECOMMENDATION` outcome over forced predictions.

## 2. Roles

CAPITALE has six roles:

1. ANALYST — independent football performance, tactical baseline, and matchup analysis.
2. NEWS — independent current-context research: availability, manager, motivation, schedule, travel, weather, pitch, and relevant off-field conditions.
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

NEWS may use current news and contextual sources permitted by its source policy. It may not use betting/odds/market-flow data, SmartXFlow, Polymarket, or other department reports.

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

Thresholds, reliability/freshness multipliers, penalties, and category boundaries should ultimately be learned or calibrated from backtests. Bootstrap rules may be used only when explicitly versioned and marked as unvalidated.

## 6. As-of / Future-Data Rule

Every department and FINAL decision is tied to an exact decision timestamp.

No information that became available after that timestamp may be used to justify the decision.

For SXF specifically, each match computes its own exact remaining time to kickoff. A batch MUST NOT use one shared T-6/T-5/T-4/T-3 horizon. Those labels are research/reference buckets, while the real cutoff is the match-specific `as_of_utc`.

If meaningful new information arrives later, create a new versioned run rather than mutating the historical decision.

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

## 10. Current State

ANALYST: v1.0 CANONICAL
NEWS: v1.1 CANONICAL — preference-aware supporting/opposing/neutral presentation + NEWS balance
POLY: v1.2 CANONICAL — direct Polymarket for general market; SXF POLY page only for active bettor/user evidence
SXF: v0.4 DRAFT — core engines + dynamic per-match horizon approved; validation/calibration pending
FINAL: v0.2 DRAFT — synthesis architecture approved; numerical calibration pending
ENGINEER: active governance/implementation role

See MILESTONE.md for current implementation state, superseded rules, and technical backlog.
