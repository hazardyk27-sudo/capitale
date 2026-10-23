# CAPITALE Runtime Prompts

Repository methodology files are source-of-truth documentation; they do not automatically become an agent's runtime instruction.

**ANALYST v2.0 CANONICAL active routing (owner-approved 2026-10-23):** `prompts/analyst_start.md` routes new analyses ONLY to `methods/analyst_methodology.md` and `schemas/analyst_report.md` v2.0. Older analyst v1.1, v1.2, v1.3 and v1.4.x methods and report templates are SUPERSEDED/INACTIVE for new runs, retained for auditing old match reports. Every new run uses exactly three factors (possession, form momentum, opponent logic with mandatory home/away analysis for BOTH clubs). The prompt source-of-truth is now live in this repository, not an unimplemented external agent deployment.

For every new role run, use the matching bootstrap prompt first:
- `prompts/analyst_start.md`
- `prompts/news_start.md`
- `prompts/poly_start.md`
- `prompts/sxf_start.md`
- `prompts/final_start.md`

Runtime order:
1. Start ANALYST, NEWS, POLY, and SXF independently with the same intended decision AS_OF and match list.
2. Do not expose one evidence department's report to another evidence department.
3. Wait until all four reports are complete.
4. Start FINAL with `prompts/final_start.md` and provide only the four completed department reports.
5. Preserve timestamps and versions; later information requires a new run/version rather than rewriting the old decision.

A role must not silently improvise if it cannot access a required source or repository file. Missing access/data must be reported explicitly.

## SXF daily archive prompts (GitHub-only)

The owner-approved SXF archive v1.0 uses these separate prompts:
- `prompts/sxf_archive_scan.md`: screen matches, report pre-match evidence only; do NOT store post-match results.
- `prompts/sxf_archive_save.md`: freeze the published scan, and store independently collected full and concentrated data when actually available.
- `prompts/sxf_archive_settle.md`: independently verify full-time scores, compute engine evaluation, and append outcome files without changing frozen scans.

Rules and formats: `methods/sxf_archive_methodology.md`, `schemas/sxf_archive_schema.md`, `archive/README.md`. Nine checkpoints: T-72, T-60, T-40, T-24, T-12, T-8, T-6, T-3, T-1. Supabase is permitted solely as a READ-ONLY data source for SmartXFlow fixtures/snapshots/results; archive storage and reporting are GitHub-only. Automated extraction and publishing remain unimplemented; prompts cannot guarantee actual collection on their own.
