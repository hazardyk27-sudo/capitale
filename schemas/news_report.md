# NEWS v2.0 — Evidence report and audit
Status: CANONICAL
Version: 2.0
New runs only; v1.6 archived reports unchanged.

## Turkish Markdown report
Fixture, competition, kickoff, AS_OF, status and both-team coverage; distinct material developments H# (fact, source, certainty, relevance); autonomous questions, follow-up searches, counterevidence and corrections; conditional effects on football/preparation with mitigation and uncertainty; excluded routine content and coverage limits; research closure; complete source/search ledger and JSON audit; actual structural gate result; 1–3 English display findings. No numeric evaluation, pick or forecast. Verified event and possible impact explicitly separate. No forced minimum news count.

## Required JSON audit
- role: "NEWS"; methodology_version: "news-v2.0-canonical"; status: READY|PARTIAL|BLOCKED; evidence_status: MATERIAL_NEWS|NO_MATERIAL_NEWS|LIMITED.
- fixture_uid, match, competition, home_team, away_team, home_country, away_country, kickoff_utc, as_of_utc; startup_verified, no_prohibited_inputs, no_predictions booleans; blocked_reasons:[].
- sources:[{id,url,issuer,published_at,observed_at,retrieved_at,tier:N1|N2|N3|N4,origin,claim}]. published_at/observed_at <= AS_OF; unknown publication time is not eligible as verified material evidence (record as search limitation). origin identifies actual original reporting, not just repost domain. At least one real permitted source per club for READY, adequate coverage assessed semantically.
- searches:[{id,team:HOME|AWAY|BOTH,family,provider,query_or_url,language,retrieved_at,status:FOUND|NO_MATERIAL_NEWS|NOT_FOUND|INACCESSIBLE|EXCLUDED,reason,evidence_ids:[]}]. FOUND needs source evidence. Searches after cutoff only for historical retrieval of demonstrably pre-cutoff evidence; do not claim contemporaneous search. Families as in coverage below.
- coverage:[{team:HOME|AWAY,family:MANAGER|FANS_STADIUM|LOCAL_PRESS|PLAYERS|MATCH_STAKES|CLUB_OFF_FIELD|SQUAD|PREPARATION,status:COVERED|NO_MATERIAL_NEWS|LIMITED|NOT_SEARCHED,search_ids:[],reason,alternative_reason,critical_gap:boolean}]. Exactly 16 team/family rows. Actual search links mandatory, both teams' permitted evidence represented. LIMITED requires alternate path or concrete reason none appropriate. NOT_SEARCHED/critical gap forbid READY.
- exposure_log:[{source,category,mitigation}] only incidental prohibited content categories, not content.
- inquiries:[{id,trigger,question,alternative,search_ids:[],evidence_ids:[],result,uncertainty}]. Actual follow-up including counterevidence. No forced quota.
- stories:[{id,team:HOME|AWAY|BOTH,families:[],cause_key,fact,fact_status:VERIFIED|WELL_SUPPORTED|DISPUTED|UNRESOLVED,evidence_ids:[],relevance,mechanism,mechanism_status:SUPPORTED|PLAUSIBLE|UNKNOWN,mitigation,counterevidence,counter_search_ids:[],inquiry_ids:[],limitations}]. One underlying cause only; factual status VERIFIED/WELL_SUPPORTED needs N1/N2 evidence. Distinguish possible effect and condition from fact; disputed/unresolved material claims never verified display findings. Each included story requires actual inquiry and counter-search. 
- rejected_leads:[{description,reason,search_ids:[]}]; no fabricated rejected leads.
- leads:[{id,trigger,question,material:boolean,critical:boolean,status:RESOLVED|EXHAUSTED|OPEN,inquiry_ids:[],reason,next_action}]. Material leads linked to actual inquiry; OPEN material and critical unresolved block READY.
- closure:{coverage_review,depth_review,remaining_work_review,why_stop,material_work_remaining:boolean,critical_gap_remaining:boolean,stop_type:EVIDENCE_SUFFICIENT|NONCRITICAL_LIMIT|SESSION_LIMIT|BATCH_LIMIT}; READY only first two and both booleans false. 
- limitations:[]; no_material_news_reason (required when no verified/well-supported story); software_detail_bullets_en:1–3 truthful English findings/coverage statements.
- Routing run_id/selection/market only in separate post-freeze delivery envelope. No support_score, score, predictions or preferences in research audit. N null on site.
Actual structural validator tools/validate_news_v2.mjs must PASS plus factual/semantic review for READY. PARTIAL/BLOCKED retain work and next actions; no completed site save. If no verified material news, a truthful coverage bullet and real sources supporting the scope (not invented news) satisfy existing editor requirements. Save full original Markdown, verify ID/version and download file.

## Transitional NEWS v2.0 delivery compatibility (2026-11-24)
The NEWS download/import UI and removal of the legacy N field are required target behavior, not a verified live deployment. Existing admin V29 has a full-report field and optional N; leave N blank/null, paste the complete original Markdown and verify actual save ID/version if available. If NEWS download is absent, preserve the original Markdown and mark download PENDING/UNAVAILABLE separately. Do not block permitted research over absent export; do not claim unperformed download or successful save. No live server quality gate is asserted.
