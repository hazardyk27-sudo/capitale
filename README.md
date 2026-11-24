# CAPITALE

CAPITALE is a multi-agent football research and betting-decision system built around strict department isolation, explicit source policies, reproducible evidence, and an explicit `NO_RECOMMENDATION` outcome.

## Departments

- ANALYST — v3.0 autonomous whole-fixture DATA/HUMAN evidence research, critical review, no prediction or support score.
- NEWS — current availability, manager, motivation, schedule, travel, weather, pitch, and relevant off-field context.
- SXF — SmartXFlow-only market-flow analysis. DRAFT until methodology is approved.
- POLY — direct Polymarket wallet-intelligence analysis.
- FINAL — combines completed department reports only. DRAFT until synthesis rules are approved.
- ENGINEER — architecture, data, prompts, schemas, testing, backtesting, calibration, and maintenance; never a match-prediction role.

## Active workflow — on-page browser editing by each agent (2026-11-20)

Every agent must **open the authenticated `/admin/software?agent=<role>` page and click its own Edit/Save buttons in an actual browser**, not send CLI/API report payloads in the normal workflow. SXF auto-import creates source-backed match rows; SXF, ANALYST and NEWS each append their own complete specialist analysis through their dedicated website edit forms. FINAL reads all three original complete reports on its page and appends its own A/B/C/NO_RECOMMENDATION decision. Each write is verified by an actual report/decision ID and version on readback; no invented scores, AS_OF or source claims.

Canonical steps: `prompts/manual_report_chain.md` v4.8. Admin login and genuine browser-control capability are required; Commander terminal availability alone does not prove UI interaction. Past CLI-inbox handoff paths are fallback/internal engineering only.

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

ANALYST v3.0.4 operational correction: one ANALYST performs all research stages; HUMAN is the 14-source human-authored editorial category, not an agent. DATA starts before delivery/validator availability checks; all actual source attempts, independent counter-tests and structural validation before READY remain mandatory.
ANALYST v3.0.4 adds three research-quality gates and an evidence-linked audit. Existing source categories and per-fixture Markdown/Software delivery unchanged.

NEWS v2.0: autonomous two-team current-news evidence, no scores, quality gates and downloadable complete Markdown plus short factual findings. Source directory retained. See roles/news.md and methods/news_methodology.md.

ANALYST v3.0.4 optimizes retrieval, evidence reuse, shared actual countertests and incremental audit/report generation; retains all three v3.0.3 quality gates and full original report. Indicative 7–10 minute target not yet measured, not a deadline.

NEWS v2.0.1 operational acceptance: single-fixture lock, actual source/search receipts, five source routes and 16 coverage cells, separate follow-up/counterevidence, full Markdown gate and explicit semantic review. No moving past incomplete research without owner permission.
