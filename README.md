# CAPITALE

CAPITALE is a multi-agent football research and betting-decision system built around strict department isolation, explicit source policies, reproducible evidence, and an explicit `NO_RECOMMENDATION` outcome.

## Departments

- ANALYST — historical/current-season football performance and tactical matchup analysis.
- NEWS — current availability, manager, motivation, schedule, travel, weather, pitch, and relevant off-field context.
- SXF — SmartXFlow-only market-flow analysis. DRAFT until methodology is approved.
- POLY — direct Polymarket wallet-intelligence analysis.
- FINAL — combines completed department reports only. DRAFT until synthesis rules are approved.
- ENGINEER — architecture, data, prompts, schemas, testing, backtesting, calibration, and maintenance; never a match-prediction role.

## Active workflow — direct per-agent Software reports (2026-11-20)

**SXF → ANALYST → NEWS → FINAL.** Each specialist keeps their independent source policy and completes a FULL report, then uses private Commander to write **only their own department** into the canonical `/admin/software` fixture + selection + `run_id`. SXF verified `FINAL_SIGNAL` source events are automatically captured every 3 minutes; new SXF dialogue reports may be versioned in the same site record. ANALYST contributes the A ordinal support /100; NEWS contributes the N ordinal support /100. FINAL retrieves the complete three original reports directly from the site and synthesizes A/B/C or NO_RECOMMENDATION; optional POLY evidence can be added independently. FINAL site publication is still pending its authorized writer (issue #8).

The next research department receives **only neutral fixture/market/selection/run metadata**, never another department's findings or score. No user-facing tokens, GPT Actions or browser automation. Core handoff: `prompts/manual_report_chain.md` v3.0. The old private report inbox is a fallback only, not the normal writing method.

## Core rule

ANALYST, NEWS, SXF, and optional POLY work independently and cannot use one another's reports as research evidence. Only FINAL may combine complete department reports. See `prompts/manual_report_chain.md` for canonical handoffs.

## PRATİK archive completeness

A PRATİK day is marked `COMPLETE` only when every fixture, scheduled checkpoint, and market has odds, money share, and amount data (`PRESENT`). Any partial, empty, or missing market slot makes the source archive `PARTIAL`. Missing match results are tracked separately and do not determine market archive completeness. Source values are never interpolated or filled with observations from after the checkpoint.

## Repository structure

```text
AGENTS.md
MILESTONE.md
roles/
policies/
methods/
schemas/
prompts/
tools/
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
8. `prompts/manual_report_chain.md` and `prompts/<role>_start.md`

Do not invent missing canonical thresholds for roles marked DRAFT.
