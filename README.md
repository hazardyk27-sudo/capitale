# CAPITALE

CAPITALE is a multi-agent football research and betting-decision system built around strict department isolation, explicit source policies, reproducible evidence, and a first-class NO BET outcome.

## Departments

- ANALYST — historical/current-season football performance and tactical matchup analysis.
- NEWS — current availability, manager, motivation, schedule, travel, weather, pitch, and relevant off-field context.
- SXF — SmartXFlow-only market-flow analysis. DRAFT until methodology is approved.
- POLY — direct Polymarket wallet-intelligence analysis.
- FINAL — combines completed department reports only. DRAFT until synthesis rules are approved.
- ENGINEER — architecture, data, prompts, schemas, testing, backtesting, calibration, and maintenance; never a match-prediction role.

## Core rule

ANALYST, NEWS, SXF, and POLY work independently and cannot see one another's reports. Only FINAL may combine them.

## Repository structure

```text
AGENTS.md
MILESTONE.md
roles/
policies/
methods/
schemas/
```

## Startup order

Read:

1. `AGENTS.md`
2. `MILESTONE.md`
3. `roles/<role>.md`
4. `policies/source_policy.md`
5. role-specific source policy
6. report schema
7. role methodology

Do not invent missing canonical thresholds for roles marked DRAFT.
