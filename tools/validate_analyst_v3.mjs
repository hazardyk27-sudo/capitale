#!/usr/bin/env node
// Structural fail-closed checker. Not a verifier of factual truth, source access or isolation.
import { readFileSync } from 'node:fs';
function validate(a) {
  const errors=[], check=(condition,msg)=>{if(!condition)errors.push(msg);};
  const obj=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
  const str=v=>typeof v==="string"&&v.trim().length>0;
  const arr=v=>Array.isArray(v)?v:[];
  const time=v=>typeof v==="string"&&/T.*(?:Z|[+-]\d\d:\d\d)$/.test(v)?Date.parse(v):NaN;
  const states=["VERIFIED","PARTIAL","REFUTED","UNRESOLVED"];
  const intl=["Sports Mole","Sportsgambler","SportyTrader","Betfair Blog"];
  const local={"Germany":["Wettbasis"],"Italy":["InfoBetting"],"Spain":["BetBrothers"],"Austria":["Ligaportal"],"France":["RueDesJoueurs"],"Greece":["Foxbet","Betarades"],"Romania":["PariuriX"],"Sweden":["Rekatochklart"],"Denmark":["BetXpert"]};
  const allowedFields=["role","methodology_version","protocol_revision","status","fixture_uid","match","competition","kickoff_utc","as_of_utc","home_team","away_team","competition_country","cross_border","home_country","away_country","startup_verified","isolation_verified","no_prohibited_inputs","no_predictions","blocked_reasons","sources","baseline","human","inquiries","no_inquiry_reason","countertests","findings","quality","baseline_changes","limitations","stop_reason","scenarios","outcome_coverage","software_detail_bullets_en"];
  if(!obj(a))return ["Audit must be an object"];
  for(const k of Object.keys(a))check(allowedFields.includes(k),"Unexpected top-level field: "+k);
  check(a.role==="ANALYST"&&a.methodology_version==="analyst-v3.0-canonical"&&a.protocol_revision==="3.0.4"&&a.status==="READY","Not a READY v3.0 ANALYST audit");
  for(const k of ["fixture_uid","match","competition","home_team","away_team","competition_country","home_country","away_country","stop_reason"])check(str(a[k]),"Missing "+k);
  check(a.home_team!==a.away_team,"Teams must differ");
  check(typeof a.cross_border==="boolean","Missing cross_border flag");
  for(const k of ["startup_verified","isolation_verified","no_prohibited_inputs","no_predictions"])check(a[k]===true,k+" must be true");
  check(Array.isArray(a.blocked_reasons)&&a.blocked_reasons.length===0,"Blocked reasons must be empty");
  const cutoff=time(a.as_of_utc),kickoff=time(a.kickoff_utc);
  check(Number.isFinite(cutoff)&&Number.isFinite(kickoff)&&cutoff<kickoff,"Invalid pre-match AS_OF");
  const ss=arr(a.sources),ids=new Set();
  check(ss.length>=2,"Need source evidence for both teams");
  for(const s of ss){
    if(!obj(s)){errors.push("Invalid source");continue;}
    check(str(s.id)&&!ids.has(s.id),"Missing/duplicate source ID");ids.add(s.id);
    for(const k of ["url","provider","scope","claim"])check(str(s[k]),"Source "+s.id+" missing "+k);
    check(/^https?:\/\/\S+$/i.test(s.url||""),"Source "+s.id+" requires URL");
    check(time(s.observed_at)<=cutoff&&time(s.retrieved_at)>=time(s.observed_at),"Source "+s.id+" temporal failure");
  }
  const refs=(v,label,required=false)=>{check(Array.isArray(v)&&(!required||v.length>0),label+" missing evidence");for(const id of arr(v))check(ids.has(id),label+" unknown source "+id);};
  const list=(v,label,min=0)=>check(Array.isArray(v)&&v.length>=min&&v.every(str),label+" invalid");
  const b=obj(a.baseline)?a.baseline:{},h=obj(a.human)?a.human:{};
  check(str(b.snapshot_id)&&str(b.summary),"Baseline not frozen/documented");
  check(time(b.frozen_at)<=time(h.started_at)&&time(h.started_at)<=cutoff,"Baseline/HUMAN sequence invalid");
  refs(b.home_evidence_ids,"Home baseline",true);refs(b.away_evidence_ids,"Away baseline",true);
  list(b.limitations,"Baseline limitations");
  const humanFields=["exposure_log","started_at","applicable_sources","attempts","claims","no_coverage_reason"];
  for(const k of Object.keys(h))check(humanFields.includes(k),"Unexpected HUMAN field: "+k);
  check(arr(a.limitations).some(x=>str(x)&&/anchor|bias|çapa|yanlı|önyargı|yönlendirme/i.test(x)),"Disclose residual editorial anchoring risk");
  check(Array.isArray(h.exposure_log),"Missing HUMAN exposure log");
  for(const x of arr(h.exposure_log))check(obj(x)&&str(x.source)&&str(x.category)&&str(x.mitigation),"Exposure record missing source/category/mitigation");
  const countries=a.cross_border?[a.home_country,a.away_country]:[a.competition_country];
  const expected=[...new Set([...intl,...countries.flatMap(c=>local[c]||[])])];
  check(Array.isArray(h.applicable_sources)&&new Set(h.applicable_sources).size===expected.length&&h.applicable_sources.length===expected.length&&expected.every(x=>h.applicable_sources.includes(x)),"Incorrect HUMAN applicable sources");
  const attempts=arr(h.attempts),attempted=new Set(),found=new Set();
  for(const t of attempts){
    if(!obj(t)){errors.push("Invalid HUMAN attempt");continue;}
    check(expected.includes(t.source)&&!attempted.has(t.source),"Unexpected/duplicate HUMAN attempt "+t.source);attempted.add(t.source);
    check(["FOUND","NOT_FOUND","INACCESSIBLE","EXCLUDED"].includes(t.status)&&str(t.reason),"Invalid HUMAN attempt status/reason");
    if(t.status==="FOUND"){found.add(t.source);check(str(t.author)&&/^https?:\/\/\S+$/i.test(t.article_url||"")&&time(t.published_at)<=cutoff,"FOUND missing author/URL/pre-cutoff date");}
  }
  check(expected.every(x=>attempted.has(x)),"HUMAN discovery incomplete");
  const ct=arr(a.countertests),ctids=new Set();
  for(const t of ct){
    if(!obj(t)){errors.push("Invalid countertest");continue;}
    check(str(t.id)&&!ctids.has(t.id),"Missing/duplicate countertest ID");ctids.add(t.id);
    list(t.actions,"Countertest actions",1);refs(t.support_ids,"Countertest support");refs(t.oppose_ids,"Countertest opposition");
    check(arr(t.support_ids).length+arr(t.oppose_ids).length>0||str(t.limitations),"Countertest without evidence or limitation");
    check(str(t.result)&&str(t.limitations),"Countertest result/limitations absent");
  }
  const claimIds=new Set();
  const item=(x,label,fields)=>{if(!obj(x)){errors.push("Invalid "+label);return false;}check(str(x.id)&&!claimIds.has(x.id),label+" missing/duplicate ID");claimIds.add(x.id);for(const k of fields)check(str(x[k]),label+" missing "+k);refs(x.evidence_ids,label,x.status==="VERIFIED");check(ctids.has(x.countertest_id),label+" missing countertest");return true;};
  const claims=arr(h.claims);
  check(Array.isArray(h.claims),"Missing HUMAN claims");
  for(const c of claims){if(item(c,"HUMAN claim",["claim","source"])){check(states.includes(c.status),"Invalid HUMAN claim status");check(found.has(c.source),"HUMAN claim source not FOUND");}}
  for(const f of found)check(claims.some(c=>c&&c.source===f),"FOUND HUMAN source has no extracted claim: "+f);
  if(found.size===0)check(str(h.no_coverage_reason),"Missing HUMAN no-coverage explanation");
  check(Array.isArray(a.inquiries),"Missing inquiries");
  if(arr(a.inquiries).length===0)check(str(a.no_inquiry_reason),"No autonomous inquiry or reason");
  for(const q of arr(a.inquiries)){if(item(q,"Inquiry",["trigger","question","hypothesis","alternative","result","uncertainty"]))list(q.actions,"Inquiry actions",1);}
  check(arr(a.findings).length>0,"No material findings");
  for(const f of arr(a.findings)){if(item(f,"Finding",["fact","interpretation"]))check(states.includes(f.status),"Invalid finding status");}
  check(arr(a.findings).some(f=>f&&f.status==="VERIFIED"&&arr(f.evidence_ids).length>0),"No verified finding");
  list(a.baseline_changes,"Baseline changes",1);list(a.limitations,"Limitations");list(a.scenarios,"Scenarios",1);
  const outcomes=["1","X","2","OVER_2_5","UNDER_2_5","BTTS_YES","BTTS_NO"];
  check(Array.isArray(a.outcome_coverage)&&a.outcome_coverage.length===7&&outcomes.every(x=>a.outcome_coverage.includes(x)),"Incomplete outcome coverage");
  list(a.software_detail_bullets_en,"Display findings",1);check(arr(a.software_detail_bullets_en).length<=3,"Too many display findings");
  // v3.0.4 research-quality records. Structural only; semantic review remains mandatory.
  const quality=obj(a.quality)?a.quality:{};
  check(obj(a.quality),"Missing research quality audit");
  const areas=["SEASON_RESULTS","RECENT_FORM","VENUE","OPPONENT_CONTEXT","UNDERLYING"];
  const dataStates=["FOUND","NOT_SEARCHED","NOT_FOUND","INACCESSIBLE","UNAVAILABLE"];
  const data=arr(quality.data_checks),dids=new Set();
  check(Array.isArray(quality.data_checks),"Missing DATA completeness checks");
  for(const team of ["HOME","AWAY"])for(const area of areas)
    check(data.some(d=>d&&d.team===team&&d.area===area&&d.material===true),"Missing material DATA area "+team+"/"+area);
  for(const d of data){
    if(!obj(d)){errors.push("Invalid DATA check");continue;}
    check(str(d.id)&&!dids.has(d.id),"Missing/duplicate DATA check ID");dids.add(d.id);
    check(["HOME","AWAY"].includes(d.team)&&[...areas,"OTHER"].includes(d.area),"Invalid DATA team/area");
    for(const k of ["metric","scope","scope_reason"])check(str(d[k]),"DATA "+d.id+" missing "+k);
    check(typeof d.material==="boolean"&&typeof d.critical==="boolean"&&(!d.critical||d.material),"DATA material/critical flags invalid");
    if(["SEASON_RESULTS","RECENT_FORM"].includes(d.area))check(d.critical===true&&arr(d.units).some(u=>u&&u.status==="FOUND"),"Core result evidence missing/ not critical: "+d.id);
    check(["MATCH_SERIES","AGGREGATE"].includes(d.unit_type),"Invalid DATA unit type");
    const units=arr(d.units),uids=new Set(),attempts=arr(d.attempts);
    check(Array.isArray(d.units)&&units.length>0,"DATA units missing "+d.id);
    if(d.unit_type==="AGGREGATE")check(units.length===1,"Aggregate check must identify one scope "+d.id);
    for(const u of units){
      if(!obj(u)){errors.push("Invalid DATA unit");continue;}
      check(str(u.id)&&!uids.has(u.id),"Missing/duplicate DATA unit ID "+d.id);uids.add(u.id);
      check(dataStates.includes(u.status),"Invalid DATA unit status");
      refs(u.evidence_ids,"DATA unit "+d.id+"/"+u.id,["FOUND","UNAVAILABLE"].includes(u.status));
    }
    check(Array.isArray(d.attempts),"DATA attempts missing "+d.id);
    for(const t of attempts){
      if(!obj(t)){errors.push("Invalid DATA attempt");continue;}
      check(str(t.provider)&&str(t.query_or_url)&&str(t.reason)&&dataStates.includes(t.status)&&t.status!=="NOT_SEARCHED","Invalid DATA attempt "+d.id);
      list(t.unit_ids,"DATA attempt unit IDs",1);
      for(const id of arr(t.unit_ids))check(uids.has(id),"Unknown DATA attempt unit "+id);
    }
    for(const u of units.filter(obj)){
      const tried=attempts.filter(t=>obj(t)&&arr(t.unit_ids).includes(u.id));
      if(u.status!=="NOT_SEARCHED")check(tried.some(t=>t.status===u.status),"DATA unit missing matching actual attempt "+d.id+"/"+u.id);
      if(u.status==="NOT_SEARCHED")check(!d.material&&!d.critical,"Material DATA NOT_SEARCHED "+d.id+"/"+u.id);
      if(u.status!=="FOUND"){
        check(!d.critical,"Critical DATA missing "+d.id+"/"+u.id);
        check(str(d.gap_reason),"Missing DATA gap explanation "+d.id);
        if(d.material)check(new Set(tried.map(t=>String(t.provider).trim().toLowerCase()+"|"+String(t.query_or_url).trim().toLowerCase())).size>=2||str(d.alternative_reason),"Missing DATA alternative search or reason "+d.id+"/"+u.id);
      }
    }
  }
  const qids=new Set(arr(a.inquiries).filter(obj).map(q=>q.id));
  const inquiryRefs=(v,label,required=false)=>{list(v,label,required?1:0);for(const id of arr(v))check(qids.has(id),label+" unknown inquiry "+id);};
  const hc=arr(quality.human_contributions),seenH=new Set();
  check(Array.isArray(quality.human_contributions),"Missing HUMAN contribution review");
  for(const x of hc){
    if(!obj(x)){errors.push("Invalid HUMAN contribution");continue;}
    check(expected.includes(x.source)&&!seenH.has(x.source),"Unexpected/duplicate HUMAN contribution");seenH.add(x.source);
    check(["NOVEL_LEAD","DUPLICATE_ONLY","NO_USABLE_CONTENT","EXCLUDED"].includes(x.kind)&&str(x.assessment),"Invalid HUMAN contribution");
    if(x.kind==="NOVEL_LEAD"||x.kind==="DUPLICATE_ONLY")check(found.has(x.source),"HUMAN contribution requires FOUND source");
    inquiryRefs(x.inquiry_ids,"HUMAN contribution "+x.source,x.kind==="NOVEL_LEAD");
  }
  check(expected.every(x=>seenH.has(x)),"HUMAN contribution review incomplete");
  const matchups=arr(quality.matchup_checks),directions=["HOME_ATTACK_AWAY_DEFENSE","AWAY_ATTACK_HOME_DEFENSE"];
  check(matchups.length===2&&directions.every(d=>matchups.some(x=>x&&x.direction===d)),"Both matchup directions required");
  for(const m of matchups){
    if(!obj(m)){errors.push("Invalid matchup check");continue;}
    for(const k of ["mechanism","comparability","limitations"])check(str(m[k]),"Matchup "+m.direction+" missing "+k);
    check(["VERIFIED","PARTIAL","UNRESOLVED"].includes(m.status),"Invalid matchup status");
    list(m.actions,"Matchup actions",1);refs(m.evidence_ids,"Matchup evidence",m.status==="VERIFIED");
    inquiryRefs(m.inquiry_ids,"Matchup inquiries",true);check(ctids.has(m.countertest_id),"Matchup countertest missing");
  }
  const leads=arr(quality.leads),lids=new Set();
  check(Array.isArray(quality.leads),"Missing evolving lead log");
  for(const l of leads){
    if(!obj(l)){errors.push("Invalid lead");continue;}
    check(str(l.id)&&!lids.has(l.id),"Missing/duplicate lead ID");lids.add(l.id);
    check(str(l.trigger)&&str(l.question)&&str(l.reason)&&str(l.next_action),"Incomplete lead record");
    check(typeof l.material==="boolean"&&typeof l.critical==="boolean"&&(!l.critical||l.material),"Lead material/critical flags invalid");
    check(["RESOLVED","EXHAUSTED","OPEN"].includes(l.status),"Invalid lead status");
    inquiryRefs(l.inquiry_ids,"Lead "+l.id,l.material);
    check(!(l.material&&l.status==="OPEN"),"Open material lead "+l.id);
    check(!(l.critical&&l.status!=="RESOLVED"),"Critical lead unresolved "+l.id);
  }
  // Each actual inquiry must be represented by a lead or a matchup; prevent a detached lead ledger.
  for(const id of qids)check(leads.some(l=>obj(l)&&arr(l.inquiry_ids).includes(id))||matchups.some(m=>obj(m)&&arr(m.inquiry_ids).includes(id)),"Inquiry not represented in research quality audit "+id);
  const closure=obj(quality.closure)?quality.closure:{};
  for(const k of ["data_review","depth_review","remaining_work_review","why_stop"])check(str(closure[k]),"Missing closure "+k);
  check(closure.material_work_remaining===false&&closure.critical_gap_remaining===false,"Closure has unfinished material work or critical gap");
  check(["EVIDENCE_SUFFICIENT","NONCRITICAL_LIMIT"].includes(closure.stop_type),"Invalid READY stop type (session/batch limit is PARTIAL)");
  // Structured fields explicitly reject score/pick metadata anywhere; content truth requires human/model review.
  const forbidden=/^(?:score|support_score|a_score|probability|win_probability|prediction|predicted_score|recommendation|lean|odds|selection|market|run_id|confidence_score|betting_pick|final_category)$/i;
  const walk=(v,p)=>{if(Array.isArray(v))v.forEach((x,i)=>walk(x,p+"["+i+"]"));else if(obj(v))for(const [k,x] of Object.entries(v)){check(!forbidden.test(k),"Forbidden research field "+p+"."+k);walk(x,p+"."+k);}};
  walk(a,"audit");
  return errors;
}
try {
  if(process.argv.length!==3) throw new Error('Usage: node tools/validate_analyst_v3.mjs audit.json');
  const errors=validate(JSON.parse(readFileSync(process.argv[2],'utf8')));
  if(errors.length){ console.error('FAIL\n'+errors.join('\n')); process.exitCode=1; }
  else console.log('PASS — structural audit only; factual and semantic review required');
} catch(e){ console.error('FAIL — '+e.message);process.exitCode=1; }
