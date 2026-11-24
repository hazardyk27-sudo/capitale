# CAPITALE ANALYST — Evidence Report and Audit Contract
Status: CANONICAL
Version: 3.0
Effective: 2026-11-24
Method: methods/analyst_methodology.md
Previous schemas including v2.1 are SUPERSEDED for new reports only.

## Human-readable report (Turkish)
1. Fixture, competition, kickoff, AS_OF, method and status.
2. Independent DATA baseline: both teams, comparable samples, relevant statistics, source IDs and limitations.
3. Material findings: observations vs interpretations, source evidence, opposing evidence, hypothesis status; include autonomous research findings, not only data tables.
4. HUMAN: isolated source discovery status, additional tested claims, discarded/unresolved claims, baseline changes. No raw predictions or news.
5. Conditional football scenarios and uncertainties, considering all seven outcomes without preference/score/probability.
6. Research audit and source ledger (structured JSON below), actual quality gate result; short 1–3 verified English display findings. No score field.

## Structured audit (JSON; actual values, not placeholders)
Required top-level fields:
- role: "ANALYST"; methodology_version: "analyst-v3.0-canonical"; status: "READY" | "PARTIAL" | "BLOCKED".
- fixture_uid, match, competition, kickoff_utc, as_of_utc; home_team, away_team.
- startup_verified, isolation_verified, no_prohibited_inputs, no_predictions: booleans; blocked_reasons: array of strings.
- sources: array of {id, url, observed_at, retrieved_at, provider, scope, claim}, with actual provenance; unique IDs. observed_at is the time information was available (<= AS_OF), not the retrieval time for a valid historical snapshot.
- baseline: {frozen_at, snapshot_id, home_evidence_ids:[], away_evidence_ids:[], summary, limitations:[]}; frozen_at <= HUMAN extraction start.
- human: {isolation_verified, extractor_id, started_at, applicable_sources:[], attempts:[{source,status,reason,article_url?,author?,published_at?}], claims:[{id,source,claim,status,evidence_ids:[],countertest_id}], no_coverage_reason}; statuses FOUND / NOT_FOUND / INACCESSIBLE / EXCLUDED. Applicable names match registry exactly: four international always, local by competition or both clubs' countries for cross-border competitions. FOUND means usable sanitized claim material, not just a page; otherwise EXCLUDED with reason.
- inquiries: array of {id,trigger,question,hypothesis,alternative,actions:[],evidence_ids:[],result,uncertainty,countertest_id}; if empty, no_inquiry_reason with actual screening justification.
- countertests: array of {id,actions:[],support_ids:[],oppose_ids:[],result,limitations}; actual search/comparison, not planned actions.
- findings: array of {id,fact,interpretation,evidence_ids:[],countertest_id,status}; status VERIFIED / PARTIAL / REFUTED / UNRESOLVED.
- baseline_changes: array of documented changes or explicit no-change reason; limitations: array of strings; stop_reason.
- scenarios: array of conditional, non-ranked football scenarios; outcome_coverage: ["1","X","2","OVER_2_5","UNDER_2_5","BTTS_YES","BTTS_NO"] (coverage only, never evaluation scores).
- software_detail_bullets_en: 1–3 factual English statements, no forecasts. 
- routing metadata (run_id/market/selection) may exist only in a separate delivery envelope after report freeze, never in this research audit.

Each source ID referenced must exist in sources; every material HUMAN claim, inquiry and finding needs a counter-test ID. VERIFIED claims need actual supporting evidence; unsupported claims remain PARTIAL/REFUTED/UNRESOLVED and cannot be presented as verified. Preserve actual opposing evidence. Missing metrics are explicit. READY must pass the structural gate `node tools/validate_analyst_v3.mjs audit.json` and factual/semantic review; do not claim PASS without actual execution. Record gate result outside the audit in report. PARTIAL/BLOCKED may describe missing prerequisites only, never be saved as complete. Historical reports stay unchanged.

## Website compatibility
Same verified run_id in separate routing envelope. Legacy A input MUST remain blank/null; it is retired, not zero, neutral or missing-data penalty for v3.0. The complete original report (including audit) is the evidence payload; no market-directed research or numeric support. If the current site cannot accept this contract, report the incompatibility, do not force a save. FINAL interprets evidence and not legacy score; no new FINAL scoring formula is authorized.
