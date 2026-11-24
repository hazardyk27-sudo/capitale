#!/usr/bin/env node
// SUPERSEDED: historical NEWS v2.0.1 checker only. Do not run for active NEWS v2.1; not a completion or FINAL intake requirement.
// Structural checker only. Actual search, truth, relevance and semantic depth require review.
import { readFileSync } from 'node:fs';
function validate(a){
 const errors=[], check=(v,m)=>{if(!v)errors.push(m)}, obj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x), str=x=>typeof x==="string"&&x.trim().length>0, arr=x=>Array.isArray(x)?x:[], time=x=>str(x)&&/T.*(?:Z|[+-]\d\d:\d\d)$/.test(x)?Date.parse(x):NaN;
 const families=["MANAGER","FANS_STADIUM","LOCAL_PRESS","PLAYERS","MATCH_STAKES","CLUB_OFF_FIELD","SQUAD","PREPARATION"], teams=["HOME","AWAY","BOTH"];
 const allowed=["protocol_revision","source_routes","acceptance_review","role","methodology_version","status","evidence_status","fixture_uid","match","competition","home_team","away_team","home_country","away_country","kickoff_utc","as_of_utc","startup_verified","no_prohibited_inputs","no_predictions","blocked_reasons","sources","searches","coverage","exposure_log","inquiries","stories","rejected_leads","leads","closure","limitations","no_material_news_reason","software_detail_bullets_en"];
 if(!obj(a))return ["Audit must be object"];
 for(const k of Object.keys(a))check(allowed.includes(k),"Unexpected field "+k);
 check(a.protocol_revision==="2.0.1","Missing or obsolete NEWS acceptance revision");
 check(a.role==="NEWS"&&a.methodology_version==="news-v2.0-canonical"&&a.status==="READY","Not a READY NEWS v2.0 audit");
 check(["MATERIAL_NEWS","NO_MATERIAL_NEWS","LIMITED"].includes(a.evidence_status),"Invalid evidence status");
 for(const k of ["fixture_uid","match","competition","home_team","away_team","home_country","away_country"])check(str(a[k]),"Missing "+k);
 check(a.home_team!==a.away_team,"Teams must differ");
 for(const k of ["startup_verified","no_prohibited_inputs","no_predictions"])check(a[k]===true,k+" must be true");
 check(Array.isArray(a.blocked_reasons)&&!a.blocked_reasons.length,"Blocked reasons not empty");
 const cutoff=time(a.as_of_utc);check(Number.isFinite(cutoff)&&cutoff<time(a.kickoff_utc),"Invalid pre-match cutoff");
 const list=(x,m,n=0)=>check(Array.isArray(x)&&x.length>=n&&x.every(str),m);
 const index=(x,label)=>{check(Array.isArray(x),"Missing "+label);const m=new Map();for(const e of arr(x)){if(!obj(e)){errors.push("Invalid "+label);continue;}check(str(e.id)&&!m.has(e.id),"Duplicate/missing "+label+" ID");m.set(e.id,e);}return m};
 const refs=(v,m,label,required=false)=>{list(v,label,required?1:0);for(const k of arr(v))check(m.has(k),label+" unknown "+k)};
 const sources=index(a.sources,"sources");check(sources.size>0,"No usable sources");
 for(const s of sources.values()){check(s.access==="FULL_CONTENT","Source body not accessed "+s.id);for(const k of ["issuer","origin","claim","locator","evidence_excerpt"])check(str(s[k]),"Source "+s.id+" missing "+k);check(/^https?:\/\/\S+$/i.test(s.url||""),"Invalid source URL");check(["N1","N2","N3","N4"].includes(s.tier),"Invalid source tier");check(time(s.published_at)<=cutoff&&time(s.observed_at)<=cutoff&&time(s.published_at)<=time(s.retrieved_at)&&time(s.observed_at)<=time(s.retrieved_at),"Source time invalid "+s.id);}
 const searches=index(a.searches,"searches");
 for(const s of searches.values()){check(teams.includes(s.team)&&families.includes(s.family),"Search team/family invalid");check(["DISCOVERY","FOLLOW_UP","COUNTEREVIDENCE","ALTERNATIVE"].includes(s.stage),"Invalid search stage "+s.id);for(const k of ["provider","query_or_url","language","reason","observed_result"])check(str(s[k]),"Missing search "+k);check(Number.isFinite(time(s.retrieved_at)),"Missing search time");check(["FOUND","NO_MATERIAL_NEWS","NOT_FOUND","INACCESSIBLE","EXCLUDED"].includes(s.status),"Invalid search status");refs(s.evidence_ids,sources,"Search evidence",s.status==="FOUND");}
 for(const id of sources.keys())check([...searches.values()].some(s=>arr(s.evidence_ids).includes(id)),"Unlinked source "+id);
 const routeSpecs={HOME_OFFICIAL:"HOME",AWAY_OFFICIAL:"AWAY",HOME_LOCAL:"HOME",AWAY_LOCAL:"AWAY",ORGANIZER:"BOTH"}, routeSeen=new Set();
 check(Array.isArray(a.source_routes)&&a.source_routes.length===5,"Need five source routes");
 for(const r of arr(a.source_routes)){if(!obj(r)){errors.push("Invalid source route");continue;}const t=routeSpecs[r.route];check(typeof t==="string"&&!routeSeen.has(r.route),"Unknown/duplicate source route");routeSeen.add(r.route);check(["COVERED","LIMITED"].includes(r.status)&&r.critical_gap===false&&str(r.result),"Invalid route coverage "+r.route);refs(r.search_ids,searches,"Route search "+r.route,true);const ss=arr(r.search_ids).map(id=>searches.get(id)).filter(Boolean);check(ss.every(s=>s.team===t||s.team==="BOTH"),"Route team mismatch "+r.route);if(r.status==="COVERED")check(ss.some(s=>["FOUND","NO_MATERIAL_NEWS"].includes(s.status)),"Route not covered "+r.route);if(r.status==="LIMITED")check(ss.some(s=>s.stage==="ALTERNATIVE")&&new Set(ss.map(s=>s.query_or_url.trim().toLowerCase())).size>=2||str(r.alternative_reason),"Route alternative missing "+r.route);}
 const covered=new Set();check(Array.isArray(a.coverage)&&a.coverage.length===16,"Need exactly 16 coverage rows");
 for(const c of arr(a.coverage)){if(!obj(c)){errors.push("Invalid coverage");continue;}const key=c.team+"/"+c.family;check(["HOME","AWAY"].includes(c.team)&&families.includes(c.family)&&!covered.has(key),"Invalid/duplicate coverage "+key);covered.add(key);check(["COVERED","NO_MATERIAL_NEWS","LIMITED"].includes(c.status)&&c.critical_gap===false,"Unsearched or critical coverage "+key);check(str(c.reason)&&str(c.screened_result),"Missing coverage reason or specific screening result");refs(c.search_ids,searches,"Coverage searches "+key,true);const ss=arr(c.search_ids).map(id=>searches.get(id)).filter(Boolean);check(ss.every(s=>(s.team===c.team||s.team==="BOTH")&&s.family===c.family),"Coverage search mismatch "+key);if(c.status==="COVERED")check(ss.some(s=>s.status==="FOUND"),"COVERED without evidence "+key);if(c.status==="NO_MATERIAL_NEWS")check(ss.some(s=>s.status==="NO_MATERIAL_NEWS"),"No-news without actual usable search "+key);if(c.status==="LIMITED")check(ss.some(s=>s.stage==="ALTERNATIVE")&&new Set(ss.map(s=>s.query_or_url.trim().toLowerCase())).size>=2||str(c.alternative_reason),"Missing alternative "+key);}
 for(const team of ["HOME","AWAY"]){for(const family of families)check(covered.has(team+"/"+family),"Missing coverage "+team+"/"+family);check([...searches.values()].some(s=>(s.team===team||s.team==="BOTH")&&arr(s.evidence_ids).some(id=>["N1","N2"].includes(sources.get(id)?.tier))),"No reliable source evidence "+team);}
 check(Array.isArray(a.exposure_log),"Missing exposure log");for(const x of arr(a.exposure_log))check(obj(x)&&str(x.source)&&str(x.category)&&str(x.mitigation),"Invalid exposure record");
 const inquiries=index(a.inquiries,"inquiries");for(const q of inquiries.values()){for(const k of ["trigger","question","alternative","result","uncertainty"])check(str(q[k]),"Missing inquiry "+k);refs(q.search_ids,searches,"Inquiry search",true);refs(q.evidence_ids,sources,"Inquiry evidence");}
 const stories=index(a.stories,"stories"), causes=new Set();let verified=0;
 for(const h of stories.values()){check(teams.includes(h.team),"Invalid story team");check(Array.isArray(h.families)&&h.families.length>0&&h.families.every(f=>families.includes(f)),"Invalid story families");for(const k of ["cause_key","fact","relevance","mechanism","mitigation","counterevidence","limitations"])check(str(h[k]),"Story missing "+k);check(!causes.has(h.cause_key),"Duplicate underlying cause");causes.add(h.cause_key);check(["VERIFIED","WELL_SUPPORTED","DISPUTED","UNRESOLVED"].includes(h.fact_status),"Invalid fact status");check(["SUPPORTED","PLAUSIBLE","UNKNOWN"].includes(h.mechanism_status),"Invalid mechanism status");refs(h.evidence_ids,sources,"Story evidence",true);refs(h.inquiry_ids,inquiries,"Story inquiries",true);refs(h.counter_search_ids,searches,"Story counter-search",true);if(["VERIFIED","WELL_SUPPORTED"].includes(h.fact_status)){verified++;check(arr(h.evidence_ids).some(id=>["N1","N2"].includes(sources.get(id)?.tier)),"Material fact lacks reliable source");}else check(h.mechanism_status!=="SUPPORTED","Unverified event cannot have supported mechanism");}
 check(Array.isArray(a.rejected_leads),"Missing rejected leads");for(const r of arr(a.rejected_leads)){check(obj(r)&&str(r.description)&&str(r.reason),"Invalid rejected lead");if(obj(r))refs(r.search_ids,searches,"Rejected lead searches",true)}
 const leads=index(a.leads,"leads");for(const l of leads.values()){for(const k of ["trigger","question","reason","next_action"])check(str(l[k]),"Missing lead "+k);check(typeof l.material==="boolean"&&typeof l.critical==="boolean"&&(!l.critical||l.material),"Invalid lead flags");check(["RESOLVED","EXHAUSTED","OPEN"].includes(l.status),"Invalid lead status");refs(l.inquiry_ids,inquiries,"Lead inquiries",l.material);check(!(l.material&&l.status==="OPEN")&&!(l.critical&&l.status!=="RESOLVED"),"Unfinished material/critical lead");}
 const searchKey=s=>s.query_or_url.trim().toLowerCase().replace(/\s+/g," ");
 const discoveryKeys=new Set([...searches.values()].filter(s=>s.stage==="DISCOVERY").map(searchKey));
 for(const h of stories.values()){
  const qs=arr(h.inquiry_ids).flatMap(id=>arr(inquiries.get(id)?.search_ids)).map(id=>searches.get(id)).filter(Boolean);
  const follow=qs.filter(s=>s.stage==="FOLLOW_UP"&&!discoveryKeys.has(searchKey(s)));
  const counter=arr(h.counter_search_ids).map(id=>searches.get(id)).filter(Boolean);
  const fk=new Set(follow.map(searchKey));
  check(follow.length>0,"Story needs actual new follow-up "+h.id);
  check(counter.length>0&&counter.every(s=>s.stage==="COUNTEREVIDENCE"&&!discoveryKeys.has(searchKey(s))&&!fk.has(searchKey(s))),"Story needs distinct counter search "+h.id);
  check([...leads.values()].some(l=>l.material&&arr(l.inquiry_ids).some(id=>arr(h.inquiry_ids).includes(id))),"Story missing material lead "+h.id);
 }
 for(const l of leads.values())if(l.material){
  const ss=arr(l.inquiry_ids).flatMap(id=>arr(inquiries.get(id)?.search_ids)).map(id=>searches.get(id)).filter(Boolean);
  check(ss.some(s=>["FOLLOW_UP","COUNTEREVIDENCE"].includes(s.stage)&&!discoveryKeys.has(searchKey(s))),"Material lead not investigated "+l.id);
  if(l.status==="EXHAUSTED")check(ss.some(s=>s.stage==="ALTERNATIVE"&&!discoveryKeys.has(searchKey(s))),"Exhausted material lead missing alternative "+l.id);
 }
 const review=obj(a.acceptance_review)?a.acceptance_review:{};
 for(const k of ["completeness","depth","closure","factual_semantic"])check(review[k]==="PASS","Acceptance review missing "+k);
 for(const k of ["coverage_review","depth_review","closure_review","factual_review"])check(str(review[k]),"Missing review rationale "+k);
 for(const id of inquiries.keys())check([...leads.values()].some(l=>arr(l.inquiry_ids).includes(id))||[...stories.values()].some(h=>arr(h.inquiry_ids).includes(id)),"Detached inquiry "+id);
 const c=obj(a.closure)?a.closure:{};for(const k of ["coverage_review","depth_review","remaining_work_review","why_stop"])check(str(c[k]),"Missing closure "+k);check(c.material_work_remaining===false&&c.critical_gap_remaining===false,"Unfinished closure");check(["EVIDENCE_SUFFICIENT","NONCRITICAL_LIMIT"].includes(c.stop_type),"Invalid READY stop type");
 check(verified>0?a.evidence_status!=="NO_MATERIAL_NEWS":a.evidence_status!=="MATERIAL_NEWS","Evidence status inconsistent");if(!verified)check(str(a.no_material_news_reason),"Missing no-material-news reason");
 list(a.limitations,"Limitations");list(a.software_detail_bullets_en,"Display findings",1);check(arr(a.software_detail_bullets_en).length<=3,"Too many bullets");
 const forbidden=/^(score|support_score|n_score|probability|win_probability|prediction|predicted_score|recommendation|lean|odds|selection|market|run_id|confidence_score|betting_pick|final_category|impact_points|totals|user_preferences)$/i;
 const walk=x=>{if(Array.isArray(x))x.forEach(walk);else if(obj(x))for(const [k,v] of Object.entries(x)){check(!forbidden.test(k),"Forbidden research field "+k);walk(v)}};walk(a);return errors;
}

// Validate the actual report, not a free-standing JSON audit. This is structural only.
function validateReport(md){
 const errors=[];
 if(typeof md!=="string")return ["Markdown report required"];
 const headings=["Fikstür ve AS_OF","Kaynak ve kapsam","Önemli haberler","Derin araştırma ve karşı kanıt","Koşullu futbol etkileri","Sınırlar ve kapanış","Software bulguları","JSON audit"];
 const blocks=[...md.matchAll(/^## ([^\r\n]+)\r?$/gm)];
 const sections=new Map();let last=-1;
 for(const name of headings){const matches=blocks.filter(b=>b[1]===name);if(matches.length!==1){errors.push("Missing/duplicate report section "+name);continue;}const b=matches[0],i=blocks.indexOf(b);if(b.index<=last)errors.push("Wrong section order "+name);last=b.index;const body=md.slice(b.index+b[0].length,blocks[i+1]?.index??md.length).trim();if(!body)errors.push("Empty report section "+name);sections.set(name,body);}
 const jsonBlocks=[...(sections.get("JSON audit")||"").matchAll(/^\x60\x60\x60json\s*\r?\n([\s\S]*?)^\x60\x60\x60\s*$/gm)];
 if(jsonBlocks.length!==1)return [...errors,"Exactly one embedded JSON audit required"];
 let a;try{a=JSON.parse(jsonBlocks[0][1]);}catch{return [...errors,"Invalid embedded JSON audit"];}
 errors.push(...validate(a));if(!a||typeof a!=="object")return errors;
 for(const h of Array.isArray(a.stories)?a.stories:[])if(h&&typeof h.id==="string"&&!(sections.get("Önemli haberler")||"").includes(h.id))errors.push("Story absent from report "+h.id);
 for(const s of Array.isArray(a.sources)?a.sources:[])if(s&&typeof s.id==="string"&&!(sections.get("Kaynak ve kapsam")||"").includes(s.id))errors.push("Source absent from report "+s.id);
 for(const b of Array.isArray(a.software_detail_bullets_en)?a.software_detail_bullets_en:[])if(typeof b==="string"&&!(sections.get("Software bulguları")||"").includes(b))errors.push("Finding absent from report");
 return errors;
}
try{if(process.argv.length!==3)throw Error("Usage: node tools/validate_news_v2.mjs report.md");const e=validateReport(readFileSync(process.argv[2],"utf8"));if(e.length){console.error("FAIL\n"+e.join("\n"));process.exitCode=1;}else console.log("PASS — NEWS v2.0.1 full report structural audit only; factual and semantic review required");}catch(e){console.error("FAIL — "+e.message);process.exitCode=1;}
