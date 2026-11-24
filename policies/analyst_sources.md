# ANALYST Source Policy

Status: CANONICAL
Version: 1.1

## Allowed source classes

A1 — official competition/club match records and first-party match data.

A2 — reliable statistical databases and event-data providers used for current-season performance evidence.

A3 — reputable tactical/technical analysis used to support interpretation.

A4 — expert observations and qualitative notes; these must be corroborated before supporting a material conclusion.

## Priority

Prefer A1/A2 for factual performance claims. Use A3/A4 to explain mechanisms, not to replace the underlying match evidence.

## Prohibited

Do not use current injury/news reporting, bookmaker odds, betting-market commentary, SmartXFlow, Polymarket, or other department reports.

## Comparability

Default to same-season official matches. When a manager/system/competition context makes older matches structurally incomparable, split the sample rather than averaging across the break.

## Registered DATA sources — active reference (2026-11-24)

Read `policies/analyst_data_sources.md` at startup: the owner-approved ordered directory of 18 data sources and data-need routing. Use these references for permitted football statistics within A1/A2/A3, with official records prioritized for official facts. This is not a closed whitelist or a new analytical methodology. All source prohibitions, AS_OF, coverage and provider-provenance controls remain in force.

## Registered human editorial sources — reference only (2026-11-24)

The owner-selected 14-source registry (4 international + 10 country-specific sources) is `policies/analyst_human_sources.md`. Read that file during startup to locate the source list and draft anti-anchoring protocol. Registration is not live authorization: the current CANONICAL A1–A4 rules and prohibitions remain unchanged until the owner approves and ENGINEER implements the isolated claim-only workflow. Do not directly read betting forecasts, odds or current news under the ANALYST role.
