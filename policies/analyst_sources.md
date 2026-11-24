# ANALYST Source Policy

Status: CANONICAL
Version: 2.0

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

Read `policies/analyst_data_sources.md` at startup: the owner-approved ordered directory of 18 data sources and data-need routing. Use these references for permitted football statistics within A1/A2/A3, with official records prioritized for official facts. This is not a closed whitelist; follow active v3.0 methodology. All source prohibitions, AS_OF, coverage and provider-provenance controls remain in force.

## Registered HUMAN sources — active isolated protocol (2026-11-24)

The owner-selected 14-source registry (4 international + 10 country-specific) is `policies/analyst_human_sources.md`. Mandatory v3.0: freeze DATA baseline first; use only claim-only extracts from a separate isolated context. Never read raw betting articles, forecasts, odds or current news as ANALYST. Independently verify, counter-test and deduplicate claims. If filtering/isolation cannot be demonstrated, BLOCKED. Genuine no coverage after compliant discovery is recorded as a limitation. Existing A1–A4 and AS_OF controls remain. This policy does not claim the extractor is deployed.
