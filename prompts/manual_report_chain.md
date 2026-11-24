# CAPITALE — BROWSER-DIRECT AGENT WORKFLOW

**Status:** OWNER-APPROVED ACTIVE DEFAULT
**Version:** 4.6 — 2026-11-24

**THE RULE:** Every ChatGPT research agent must **open the actual `https://betcapitale.com/admin/software` webpage in a browser**, find the correct match + market + selection, **fill ONLY its own on-page edit form**, click **Save**, and verify the actual report ID/version shown. **Do not use the Commander CLI report uploader, JSON API submission, or manual private inbox as the default user workflow.** Commander may be used to open/operate a browser if browser GUI automation is genuinely available; ordinary terminal/file access alone is not proof of a click. ChatGPT Work browser or another authorized browser-control capability can operate the UI. If no browser control or admin login exists, report that limitation; don't fabricate a save.

### Exact individual agent pages

- **SXF:** `https://betcapitale.com/admin/software?agent=sxf` — Edit SXF — Market.
- **ANALYST:** `https://betcapitale.com/admin/software?agent=analyst` — Edit ANALYST — Statistics.
- **NEWS:** `https://betcapitale.com/admin/software?agent=news` — Edit NEWS — News.
- **FINAL:** `https://betcapitale.com/admin/software?agent=final` — Edit FINAL — Decision.

Each page requires an existing logged-in **CAPITALE administrator browser session**. Never ask the user to paste passwords or tokens into chat. Admin must authenticate normally in the browser if not already signed in. These are *focus views*: ANALYST and NEWS do not show other agents' scores/details, protecting independence. A completed report is added as an **append-only version**; each agent uses its own box. Never modify another specialist's report.

## SXF browser steps

1. The live `FINAL_SIGNAL` watcher independently creates verified SXF Software rows every 3 minutes from real SmartXFlow evidence. Never invent a match or treat `PRELIMINARY_SIGNAL`, a retired motor, shadow motor, or a `SURPRISE_TEAM` watch-only flag as a verified team-win recommendation.
2. First produce the **complete real SXF v0.4.3 report** with source timestamps, T-6 primary / eligible T-8 fallback, exact market and choice; at its end list the signals plus **at least one and at most three numbered, verified SXF findings per match/market/selection** and a neutral ANALYST routing table. Unsupported selections must get an explicit factual verification finding, not a fictional signal.
3. Open the SXF page in a browser. Click the match, confirm its **existing** real `run_id`, market, selection and source checkpoint. Open **Edit SXF — Market report**. Enter the original SXF AS_OF time exactly (T-6/T-8 cutoff), a short summary, the complete original report, **1–3 verified English findings**, and real source evidence lines; click **Save SXF to Software**.
4. Verify the site displays `SAVED & VERIFIED`, exact report_id/version and the new SXF report version. Auto-sourced SXF data can already exist, but the full original specialist report is **not automatically created by that source-only import**. Do not say a full SXF report was uploaded until this UI save is verified.
5. Produce two separate blocks: `KOPYALA → ANALYST GİRDİSİ` contains only fixture/date/kickoff/competition/home/away/fixture_uid and countries, one row per fixture, **no market, selection, run_id, SXF checkpoint, scores or findings**. A separate `SAKLA → KAYIT YÖNLENDİRMESİ` retains the real fixture_uid/run_id/market/selection/kickoff/SXF AS_OF for the delivery context only; do not paste it into the clean ANALYST research context. After the READY report is frozen, the same ANALYST in delivery mode attaches it unchanged to the applicable existing run(s) and forwards neutral NEWS routing. No change to SXF engines.

## ANALYST browser steps — v3.0.3

1. Receive fixture identity/time only in the clean research context; preserve market/selection/run routing separately until report freeze. No SXF evidence, recommendation or other specialist report. If accidentally exposed, record category without content, disregard and rework affected claims; no separate chat required. Start DATA before checking site or validator availability.
2. Execute all v3.0 stages: DATA baseline, HUMAN editorial source research by ANALYST, autonomous questions/iteration, counter-tests and full evidence report with structured audit. Complete the three quality gates (DATA COMPLETENESS, RESEARCH DEPTH, RESEARCH CLOSURE) and the structured quality audit. Open material leads, critical gaps or incomplete important research due to batch/session limits are PARTIAL, not READY. Run the repository validator in an available JS runtime after research; only READY with actual PASS and source/semantic review can proceed. If execution unavailable, retain actual research as PARTIAL/validation pending. PARTIAL/BLOCKED cannot be saved as completed. No A score, prediction or lean.
3. Only after freeze, attach verified run_id/market/selection metadata and open the authenticated `?agent=analyst` browser editor; enter actual AS_OF, brief factual summary, full original report including audit and gate result, 1–3 verified English findings and genuine source evidence. Leave legacy A score blank/null. If site demands a score or cannot accept the report, BLOCKED; do not invent one.
4. Click Save and require SAVED & VERIFIED plus actual report ID/version. The same immutable full report (with all audit/verification records) must be downloadable as .md from the corresponding match; use the admin download button and verify identity/version and contents. The 1–3 saved findings are shown in the existing match analysis. Only neutral NEWS routing may follow; no report, hypothesis or score. No other role edits. Complete each fixture sequentially before advancing; record any genuine blocked/partial fixture and proceed to the next. At batch end provide only short per-match status and verified IDs. Server-side enforcement is not yet verified.

## NEWS browser steps — v2.0
1. Research input is neutral fixture identity, competition, kickoff and club countries only; hold run_id/market/selection separately until research freeze. No prior role evidence.
2. Execute both-team eight-family scan, material discovery, autonomous follow-up, verification, opposing evidence, conditional mechanisms and three quality gates. Run tools/validate_news_v2.mjs on actual audit. Only READY with actual PASS plus factual/semantic review; no scores, no N/100. No material news after sufficient actual coverage is valid with explicit evidence status. PARTIAL/BLOCKED must retain actual work and next actions.
3. Freeze research then same NEWS attaches verified run_id and opens authenticated ?agent=news editor. Enter true NEWS AS_OF, full original Markdown including all evidence/audit, summary, 1–3 factual English findings or truthful coverage statement, genuine sources. N null.
4. Save NEWS to Software, verify SAVED & VERIFIED ID/version, download full NEWS .md and verify identity and complete contents. Short status table and real run IDs to FINAL; no other role edits. Each match sequentially. Research and delivery status separate.

## FINAL browser steps

1. Open `?agent=final`, select the exact same match and `run_id`. On the page review the full original **SXF + ANALYST + NEWS** reports and their evidence. Owner may also provide the downloaded ANALYST and NEWS .md files; verify its fixture/run/report ID/version/AS_OF matches the saved original, and read its full audit. A supplied file is not a substitute for missing required other reports or site save verification. This FINAL editor is **disabled until all 3 full original reports are actually present**. Do not assume the machine-produced SXF summary equals the specialist's original full report.
2. Cross-check fixture/market/selection routing, evidence sources/AS_OF, pre-match integrity and conflicting evidence. For new ANALYST v3.0 reports require protocol_revision 3.0.3, READY, genuine gate PASS and full audit; no legacy A score or fake neutral replacement. POLY is optional and absent POLY means `NO_EVIDENCE`.
3. Produce the full FINAL v0.2 synthesis and one A/B/C or `NO_RECOMMENDATION` outcome. Open **Edit FINAL — Decision**; enter the outcome, true decision summary and **full original FINAL report**; click **Save FINAL decision**.
4. Claim site publication ONLY when the webpage shows **FINAL SAVED & VERIFIED** with final decision ID/version and the saved category and report are visible on readback.

## Browser report form fields — exact UX

Each SXF/ANALYST/NEWS form accepts:
- `Verified report AS_OF (UTC, ISO 8601)`: real source research timestamp, e.g. `2026-11-20T13:45:00Z`. SXF AS_OF must match its original T-6/T-8 decision cutoff. Analyst/NEWS use their own independent research cut and must be before kickoff.
- `A/N support score /100`: both retired for new ANALYST v3.0 and NEWS v2.0 reports; always null.
- `Short executive summary`: genuine brief summary.
- `Complete original report`: **entire original full report**, 100+ characters, no other role's conclusions.
- `1–3 verified English findings`: at least ONE, no fictional details.
- `Evidence sources`: **one source per line** formatted as `Source name | URL (or -) | Claim supported by the source`. E.g. `SmartXFlow checkpoint | - | Original T-6 engine event supports this SXF finding`. Real citations only; dates and claims must be true.
- `Save [ROLE] to Software`: returns immutable report_id/version after role/run/content hash readback. Missing source citation, false AS_OF, identity mismatch and unauthenticated requests are rejected.

FINAL form is separate: `A/B/C/NO_RECOMMENDATION`, `Decision summary`, `Complete FINAL synthesis and evidence trace`, `Save FINAL decision`.

## Implementation and boundaries (as of 2026-11-20)

Live frontend: `/admin/software` includes role-specific browser forms, input validation and FINAL decision panel. Backend: admin-session + same-origin protected `/api/admin/capitale/software/role-report/:runId/:role` (role-scoped append-only) and `/api/admin/capitale/software/final/:runId` (read/append FINAL); server controls role identity and validates true source-run selection/AS_OF, with readback after write. FINAL decision RPC executes only for service_role and rejects missing 3 full reports, wrong selections and kickoff-passed runs. Web save does not rely on the deprecated public tokenless connector; it stays nginx-blocked 403.

**Verified so far:** live website responds 200; unauthenticated browser POSTs 401; old public endpoint 403; site TypeScript and production builds passed. Real GUI saves under a logged-in admin session require an actual full specialist report; **not yet validated end-to-end with real four-agent work**. No fake sample bets/NEWS/ANALYST reports were saved.

The previously built server CLI scripts (`tools/capitale_sxf_software_sync.py`, `tools/capitale_report_uploader.py`, `tools/capitale_site_report_reader.py`) remain technical backup/automatic verified source plumbing; **never instruct ordinary specialist agents to use those to replace webpage navigation, clicking and saving**, unless the owner expressly switches to API mode.

Canonical engine methodology, source isolation, 1–3 SXF findings requirement, ANALYST v3.0 evidence-only research, NEWS v2.0 evidence-only research and FINAL v0.2 decision rules apply.

For new NEWS inputs FINAL requires news-v2.0-canonical READY, actual PASS and full evidence audit. No N score or placeholder; absence of retired N is not missing evidence. Distinguish NO_MATERIAL_NEWS from incomplete coverage. No FINAL decision-method change.

## Transitional NEWS v2.0 delivery compatibility (2026-11-24)
The NEWS download/import UI and removal of the legacy N field are required target behavior, not a verified live deployment. Existing admin V29 has a full-report field and optional N; leave N blank/null, paste the complete original Markdown and verify actual save ID/version if available. If NEWS download is absent, preserve the original Markdown and mark download PENDING/UNAVAILABLE separately. Do not block permitted research over absent export; do not claim unperformed download or successful save. No live server quality gate is asserted.
