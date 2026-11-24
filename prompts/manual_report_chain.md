# CAPITALE — BROWSER-DIRECT AGENT WORKFLOW

**Status:** OWNER-APPROVED ACTIVE DEFAULT
**Version:** 4.1 — 2026-11-24

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
5. Produce two separate blocks: `KOPYALA → ANALYST GİRDİSİ` contains only fixture/date/kickoff/competition/home/away/fixture_uid and countries, one row per fixture, **no market, selection, run_id, SXF checkpoint, scores or findings**. A separate `SAKLA → KAYIT YÖNLENDİRMESİ` retains the real fixture_uid/run_id/market/selection/kickoff/SXF AS_OF for the delivery context only; do not paste it into the clean ANALYST research context. After the READY report is frozen, the separate delivery context attaches it unchanged to the applicable existing run(s) and forwards neutral NEWS routing. No change to SXF engines.

## ANALYST browser steps — v3.0

1. Receive fixture identity/time only in the clean research context; preserve market/selection/run routing separately until report freeze. No SXF evidence, recommendation or other specialist report. If selection was exposed, restart clean or BLOCKED.
2. Execute all v3.0 stages: DATA baseline, separate isolated HUMAN claim discovery, autonomous questions/iteration, counter-tests and full evidence report with structured audit. Run the repository validator; only READY with actual PASS and source/semantic review can proceed. PARTIAL/BLOCKED cannot be saved as completed. No A score, prediction or lean.
3. Only after freeze, attach verified run_id/market/selection metadata and open the authenticated `?agent=analyst` browser editor; enter actual AS_OF, brief factual summary, full original report including audit and gate result, 1–3 verified English findings and genuine source evidence. Leave legacy A score blank/null. If site demands a score or cannot accept the report, BLOCKED; do not invent one.
4. Click Save and require SAVED & VERIFIED plus actual report ID/version. Only neutral NEWS routing may follow; no report, hypothesis or score. No other role edits. The production server's v3.0 enforcement and isolated extractor require separate engineering verification.

## NEWS browser steps

1. Receive only the neutral ANALYST→NEWS routing fields; no A score or SXF evidence may influence NEWS research.
2. Complete unchanged NEWS MATCH IMPACT v1.6 eight areas, original H# sources, seven signed market scores, and independent N ordinal /100 support. Data insufficient must be explicit.
3. Open `?agent=news`, find the same match/`run_id`, click **Edit NEWS — News report**; fill the true NEWS research AS_OF, N score (or leave blank if source insufficient), brief summary, **complete original NEWS report**, 1–3 sourced English news findings, and original H# news source lines.
4. Click **Save NEWS to Software**, verify `SAVED & VERIFIED` ID/version. Then provide the short N list and real `run_id` to FINAL. Never edit other roles.

## FINAL browser steps

1. Open `?agent=final`, select the exact same match and `run_id`. On the page review the full original **SXF + ANALYST + NEWS** reports and their evidence. This FINAL editor is **disabled until all 3 full original reports are actually present**. Do not assume the machine-produced SXF summary equals the specialist's original full report.
2. Cross-check fixture/market/selection routing, evidence sources/AS_OF, pre-match integrity and conflicting evidence. For new ANALYST v3.0 reports require READY, genuine gate PASS and full audit; no legacy A score or fake neutral replacement. POLY is optional and absent POLY means `NO_EVIDENCE`.
3. Produce the full FINAL v0.2 synthesis and one A/B/C or `NO_RECOMMENDATION` outcome. Open **Edit FINAL — Decision**; enter the outcome, true decision summary and **full original FINAL report**; click **Save FINAL decision**.
4. Claim site publication ONLY when the webpage shows **FINAL SAVED & VERIFIED** with final decision ID/version and the saved category and report are visible on readback.

## Browser report form fields — exact UX

Each SXF/ANALYST/NEWS form accepts:
- `Verified report AS_OF (UTC, ISO 8601)`: real source research timestamp, e.g. `2026-11-20T13:45:00Z`. SXF AS_OF must match its original T-6/T-8 decision cutoff. Analyst/NEWS use their own independent research cut and must be before kickoff.
- `A/N support score /100`: NEWS only under its current method; ANALYST v3.0 MUST leave A blank/null (retired).
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

Canonical engine methodology, source isolation, 1–3 SXF findings requirement, ANALYST v3.0 evidence-only research, eight NEWS areas and FINAL v0.2 scoring rules remain unchanged.
