# ANALYST — Software report file and quick findings (2026-11-24)

Status: admin V29 deployed; authenticated real report save/download end-to-end not yet verified.
Owner decision: one full downloadable file per completed fixture report, short key findings under its analysis, audit and verification records inside the full file. User may download the full report and supply it directly to FINAL.

## Storage and display
- No duplicate file storage or public document URL. The existing immutable saved `payload.full_report_markdown` is the authoritative original, with complete research audit and actual gate result included by ANALYST.
- Admin Software V29 offers optional .md/.txt import into the existing full-report editor; paste remains allowed. Reject over-limit files rather than silently truncate (current 150,000-character editor limit). Save through existing authenticated role-scoped UI; A/100 is hidden and always sent null for ANALYST. NEWS score remains unchanged.
- Under the expanded match's existing Statistical analysis stage, show 1–3 actual saved ANALYST English findings (from the latest report's payload), never synthetic data or a different report version; no actual full report means no download. Show an explicit loading/error/no-report state. Other stage rendering unchanged.
- Download full ANALYST report (.md) exports the exact saved full report body as UTF-8, prefixed with export metadata (run ID, report ID, version, AS_OF). Filename includes run ID and report version. The latest version is offered under the match analysis; each saved version can be downloaded in its original report section. Existing historical reports can be exported as their actual original content, not mislabeled v3.0.
- Admin only; no public /software/ document download or exposure of private audit. No backend/database schema changes; no new retention policy. Existing Software retention applies, so download before expiry if a durable local copy is needed. Do not modify other roles or public pages.

## Deployment and tests
- Server smartxflow, `/app/betcapitale/dist/public/assets/admin-software-v29-analyst-report-download-20261124.js`, SHA-256 eaa126e26e9712f3d2ade9fc994e752aa5932b43c51a65536e6ec6b2f0c7f514.
- Exact patch: `deployments/betcapitale/admin-software-v28-to-v29-analyst-report-download-20261124.patch`.
- Only three existing admin import-map alias values changed V28→V29, atomically. Rollback index backup: `/app/betcapitale/rollback-analyst-report-download-20261124/index.html` (restore only after checking subsequent import-map edits).
- Node module syntax PASS; seven exporter assertions PASS; isolated Chromium test actually downloaded a synthetic UTF-8 .md file and compared its full body, including audit. No synthetic report submitted to live site/database.
- Live HTTP 200 for /admin/software, /software/ and V29 asset; live index contains three V29 references and live asset SHA-256 matches staged version.
- Not yet tested: authenticated live match save, import and complete report download in real admin session, end-to-end research/FINAL handoff. Server-side v3.0 gate and isolated HUMAN extractor deployment remain separate unresolved work. The browser exporter does not validate the truth or completeness of a report; the agent must enforce the v3.0 gate before publishing.
