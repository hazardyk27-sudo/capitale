# CAPITALE ANALYST — Evidence Report and Audit Contract
Status: CANONICAL
Version: 3.0
Operational revision: 3.0.2
Effective: 2026-11-24
Method: methods/analyst_methodology.md
Previous schemas including v2.1 are SUPERSEDED for new reports only.

## Human-readable report (Turkish)
1. Fixture, competition, kickoff, AS_OF, method and status.
2. Independent DATA baseline: both teams, comparable samples, relevant statistics, source IDs and limitations.
3. Material findings: observations vs interpretations, source evidence, opposing evidence, hypothesis status; include autonomous research findings, not only data tables.
4. HUMAN: source discovery, permitted observations and exposure limitations, additional tested claims, discarded/unresolved claims, baseline changes. No raw predictions or news.
5. Conditional football scenarios and uncertainties, considering all seven outcomes without preference/score/probability.
6. Research audit and source ledger (structured JSON below), actual quality gate result; short 1–3 verified English display findings. No score field.

## Structured audit (JSON; actual values, not placeholders)
Required top-level fields:
- role: "ANALYST"; methodology_version: "analyst-v3.0-canonical"; protocol_revision: "3.0.2"; status: "READY" | "PARTIAL" | "BLOCKED".
- fixture_uid, match, competition, kickoff_utc, as_of_utc; home_team, away_team; competition_country, home_country, away_country (English country names used in the HUMAN registry), cross_border (boolean). For cross-border tournaments use both club countries for source routing.
- startup_verified, isolation_verified (departmental evidence separation), no_prohibited_inputs (no prohibited information USED as evidence or decision input, not a claim of no accidental exposure), no_predictions: booleans; blocked_reasons: array of strings.
- sources: array of {id, url, observed_at, retrieved_at, provider, scope, claim}, with actual provenance; unique IDs. observed_at is the time information was available (<= AS_OF), not the retrieval time for a valid historical snapshot.
- baseline: {frozen_at, snapshot_id, home_evidence_ids:[], away_evidence_ids:[], summary, limitations:[]}; frozen_at <= HUMAN extraction start.
- human: {exposure_log:[], started_at, applicable_sources:[], attempts:[{source,status,reason,article_url?,author?,published_at?}], claims:[{id,source,claim,status,evidence_ids:[],countertest_id}], no_coverage_reason}. HUMAN records only source research by ANALYST. exposure_log records source/category and discard/mitigation only, never the prohibited content; empty if none observed. Include residual editorial anchoring risk in limitations; statuses FOUND / NOT_FOUND / INACCESSIBLE / EXCLUDED. Applicable names match registry exactly: four international always, local by competition or both clubs' countries for cross-border competitions. FOUND means usable permitted football claim material, not just a page; otherwise EXCLUDED with reason.
- inquiries: array of {id,trigger,question,hypothesis,alternative,actions:[],evidence_ids:[],result,uncertainty,countertest_id}; if empty, no_inquiry_reason with actual screening justification.
- countertests: array of {id,actions:[],support_ids:[],oppose_ids:[],result,limitations}; result and limitations are non-empty strings (use an explicit no-known-limitations statement if appropriate); actual search/comparison, not planned actions.
- findings: array of {id,fact,interpretation,evidence_ids:[],countertest_id,status}; status VERIFIED / PARTIAL / REFUTED / UNRESOLVED.
- baseline_changes: array of documented changes or explicit no-change reason; limitations: array of strings; stop_reason.
- scenarios: array of conditional, non-ranked football scenarios; outcome_coverage: ["1","X","2","OVER_2_5","UNDER_2_5","BTTS_YES","BTTS_NO"] (coverage only, never evaluation scores).
- software_detail_bullets_en: 1–3 factual English statements, no forecasts. 
- routing metadata (run_id/market/selection) may exist only in a separate delivery envelope after report freeze, never in this research audit.

Each source ID referenced must exist in sources; every material HUMAN claim, inquiry and finding needs a counter-test ID. VERIFIED claims need actual supporting evidence; unsupported claims remain PARTIAL/REFUTED/UNRESOLVED and cannot be presented as verified. Preserve actual opposing evidence. Missing metrics are explicit. READY must pass the structural gate `node tools/validate_analyst_v3.mjs audit.json` (or actual execution of the same validate function in an available JS runtime) and factual/semantic review; do not claim PASS without actual execution. Record gate result outside the audit in report. PARTIAL/BLOCKED may describe missing prerequisites only, never be saved as complete. If no runtime is available, preserve the completed research as PARTIAL/validation pending; do not claim PASS or block starting DATA. Historical reports stay unchanged.

## Website compatibility
Same verified run_id in separate routing envelope. Legacy A input MUST remain blank/null; it is retired, not zero, neutral or missing-data penalty for v3.0. The complete original report (including audit) is the evidence payload; no market-directed research or numeric support. If the current site cannot accept this contract, report the incompatibility, do not force a save. FINAL interprets evidence and not legacy score; no new FINAL scoring formula is authorized.

## 2026-11-24 — Owner-approved per-fixture file and findings
For each fixture, finish and validate the entire v3.0 research before moving to the next. Save the full original Markdown report (including all source, research, verification/counter-test and audit records, actual gate result) in the correct existing Software ANALYST report. Use optional .md import or paste into the full report field; never truncate or split off the audit. Add 1–3 concise, material, independently supported English findings in the existing findings fields; each must match the same full report, with important caveats preserved. Leave A/100 blank/null. Confirm SAVED & VERIFIED ID/version, then download the matching .md and check identity/version and complete contents. If download or verification fails, distinguish saved report from incomplete delivery; never claim file verified. If report is not READY, do not save a completed report. A batch of fixtures is sequential, per-match checkpoints; finish/save/verify each before moving on (or record a genuine BLOCKED/PARTIAL status and continue with the next). Final chat output is a short per-match status list (research, saved report ID/version, download verification), not ten duplicated full reports. User can download each file and send it to FINAL. No direct handoff of research to NEWS. Admin only; no public file links. See deployments/betcapitale/analyst-report-download-v29-live-20261124.md.
