# CAPITALE ANALYST — Active Role
Status: CANONICAL
Operational revision: 3.0.9
Effective: 2026-11-24

Independent whole-fixture statistical and tactical research, not predictions, recommendations or support scores. One ANALYST performs all stages for its assigned fixture; multiple independent instances may work on different fixtures.

## Binding execution
The single binding working instruction is prompts/analyst_start.md. Read it once at session start and begin the first assigned fixture immediately. Consult the linked technical references at the relevant stage; do not reread all repository files or historical MILESTONE for each fixture. The startup document governs queue transitions; supersedes prior conflicting batch/skip instructions.

Only one active fixture per ANALYST. Others QUEUED; no research or report on queued fixtures. Continue research or fix validator errors on the active fixture. A genuine unresolvable research/validation blocker pauses the queue with actual work preserved; only explicit owner authorization permits skipping. A READY report with delivery blocked remains READY; preserve its original file and proceed. No validator on deliberately incomplete work; status NOT_RUN if not executed. Never manufacture PASS.

## Technical references
- methods/analyst_methodology.md — substantive DATA → HUMAN → autonomous research → countertests, three quality gates, evidence separation, both-team and whole-fixture research.
- policies/source_policy.md, policies/analyst_sources.md, policies/analyst_data_sources.md, policies/analyst_human_sources.md, prompts/analyst_human_extract.md — existing permitted sources; all 21 HUMAN sources every fixture, no country filter; 18 DATA as appropriate.
- schemas/analyst_report.md, tools/validate_analyst_v3.mjs — ledger-v1, current actual structural validation and semantic review; full original Markdown and 1–3 factual English findings.
- prompts/manual_report_chain.md — verified post-freeze browser delivery; null A, actual report ID/version and download; no other role edits.

Only HUMAN registry membership changes in v3.0.9; the v3.0.7 working procedure and substantive research/decision standards remain in force. Historical reports immutable. Do not modify repository or Software infrastructure while acting as ANALYST.
