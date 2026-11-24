#!/usr/bin/env node
// Structural fail-closed checker. Not a verifier of factual truth, source access or isolation.
import { readFileSync } from 'node:fs';
function validateExpanded(a) {
  const errors=[], check=(condition,msg)=>{if(!condition)errors.push(msg);};
  const obj=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
  const str=v=>typeof v==="string"&&v.trim().length>0;
  const arr=v=>Array.isArray(v)?v:[];
  const time=v=>typeof v==="string"&&/T.*(?:Z|[+-]\d\d:\d\d)$/.test(v)?Date.parse(v):NaN;
  const states=["VERIFIED","PARTIAL","REFUTED","UNRESOLVED"];
  const intl=["Sports Mole","Sportsgambler","SportyTrader","Betfair Blog","Sporting Life","Racing Post","Squawka","Bet Football"];
  const local={"Italy":["InfoBetting"],"Spain":["BetBrothers"],"Austria":["Ligaportal"],"Greece":["Foxbet","Betarades"],"Romania":["PariuriX"],"Sweden":["Rekatochklart"],"Denmark":["BetXpert"]};
  const allowedFields=["role","methodology_version","protocol_revision","status","fixture_uid","match","competition","kickoff_utc","as_of_utc","home_team","away_team","competition_country","cross_border","home_country","away_country","startup_verified","isolation_verified","no_prohibited_inputs","no_predictions","blocked_reasons","sources","baseline","human","inquiries","no_inquiry_reason","countertests","findings","quality","baseline_changes","limitations","stop_reason","scenarios","outcome_coverage","software_detail_bullets_en"];
  if(!obj(a))return ["Audit must be an object"];
  for(const k of Object.keys(a))check(allowedFields.includes(k),"Unexpected top-level field: "+k);
  check(a.role==="ANALYST"&&a.methodology_version==="analyst-v3.0-canonical"&&a.protocol_revision==="3.0.8"&&a.status==="READY","Not a READY v3.0 ANALYST audit");
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
  // Every registered HUMAN domain is eligible for every fixture; country is only a search hint.
  const expected=[...new Set([...intl,...Object.values(local).flat()])];
  check(Array.isArray(h.applicable_sources)&&new Set(h.applicable_sources).size===expected.length&&h.applicable_sources.length===expected.length&&expected.every(x=>h.applicable_sources.includes(x)),"Incorrect HUMAN applicable sources");
  const attempts=arr(h.attempts),attempted=new Set(),found=new Set();
  for(const t of attempts){
    if(!obj(t)){errors.push("Invalid HUMAN attempt");continue;}
    check(expected.includes(t.source)&&!attempted.has(t.source),"Unexpected/duplicate HUMAN attempt "+t.source);attempted.add(t.source);
    check(["FOUND","NOT_FOUND","INACCESSIBLE","EXCLUDED"].includes(t.status)&&str(t.reason),"Invalid HUMAN attempt status/reason");
    check(str(t.query_or_url),"Missing actual HUMAN discovery query/URL: "+t.source);
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
  // v3.0.8 expanded research-quality records. Structural only; semantic review remains mandatory.
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
// Compact ledger v1: expand references in memory; never ask ANALYST to write the expanded audit.
// The existing quality validator runs unchanged in substance on the expanded view.
function expandLedger(a) {
  const errors=[],check=(ok,msg)=>{if(!ok)errors.push(msg);};
  const obj=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
  const arr=v=>Array.isArray(v)?v:[];
  const str=v=>typeof v==="string"&&v.trim().length>0;
  const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const keys=(o,allowed,label)=>{if(!obj(o)){errors.push("Invalid "+label);return false;}for(const k of Object.keys(o))check(allowed.includes(k),label+" unexpected field "+k);return true;};
  const index=(v,label)=>{const m=new Map();check(Array.isArray(v),label+" must be an array");for(const x of arr(v)){if(!obj(x)||!str(x.id)||m.has(x.id)){errors.push(label+" invalid/duplicate ID");continue;}m.set(x.id,x);}return m;};
  const ref=(m,id,label)=>{const x=m.get(id);check(!!x,label+" unknown ID "+id);return x||{};};
  const ids=(v,label,min=0)=>{check(Array.isArray(v)&&v.length>=min&&v.every(str)&&new Set(v).size===v.length,label+" invalid IDs");return arr(v);};
  if(!obj(a)||a.report_format!=="ledger-v1")return {errors:["New ANALYST reports require report_format ledger-v1"],expanded:null};
  const forbidden=/^(?:score|support_score|a_score|probability|win_probability|prediction|predicted_score|recommendation|lean|odds|selection|market|run_id|confidence_score|betting_pick|final_category)$/i;
  const walk=(v,p)=>{if(Array.isArray(v))v.forEach((x,i)=>walk(x,p+"["+i+"]"));else if(obj(v))for(const [k,x] of Object.entries(v)){check(!forbidden.test(k),"Forbidden compact field "+p+"."+k);walk(x,p+"."+k);}};
  walk(a,"audit");
  const {report_format,data_units,data_attempts,...rest}=a;
  const out=JSON.parse(JSON.stringify(rest));
  const um=index(data_units,"DATA unit catalog"),am=index(data_attempts,"DATA retrieval ledger"),sm=index(a.sources,"Sources"),qm=index(a.inquiries,"Inquiries");
  const labels=new Set(),usedU=new Set(),usedA=new Set();
  for(const u of um.values()){
    keys(u,["id","team","label"],"DATA catalog unit");
    check(["HOME","AWAY"].includes(u.team)&&str(u.label),"Invalid DATA catalog unit "+u.id);
    const key=u.team+"|"+u.label;check(!labels.has(key),"Duplicate DATA catalog label "+key);labels.add(key);
  }
  for(const t of am.values()){
    keys(t,["id","provider","query_or_url","source_id","status","reason"],"DATA retrieval");
    check(str(t.provider)&&str(t.reason)&&["FOUND","NOT_FOUND","INACCESSIBLE","UNAVAILABLE"].includes(t.status),"Invalid DATA retrieval "+t.id);
    check(has(t,"query_or_url")!==has(t,"source_id"),"DATA retrieval needs one query/URL or source reference "+t.id);
    if(has(t,"source_id"))check(str(ref(sm,t.source_id,"DATA retrieval source").url),"DATA retrieval source URL missing "+t.id);
    else check(str(t.query_or_url),"DATA retrieval query missing "+t.id);
  }
  const q=out.quality;
  if(!obj(q)){errors.push("Missing compact quality audit");return {errors,expanded:null};}
  keys(q,["data_checks","matchup_checks","leads","closure"],"Compact quality");
  check(Array.isArray(q.data_checks),"Missing compact data checks");
  q.data_checks=arr(q.data_checks).map(d=>{
    if(!keys(d,["id","team","area","metric","scope","scope_reason","material","critical","unit_type","groups","gap_reason","alternative_reason"],"Compact DATA check"))return {};
    const {groups,...checkFields}=d,units=[],attemptMap=new Map(),seen=new Set();
    check(Array.isArray(groups)&&groups.length>0,"Missing DATA groups "+d.id);
    for(const g of arr(groups)){
      if(!keys(g,["unit_ids","status","evidence_ids","attempt_ids"],"DATA group"))continue;
      const uids=ids(g.unit_ids,"DATA group units "+d.id,1),aids=ids(g.attempt_ids,"DATA group attempts "+d.id);
      ids(g.evidence_ids,"DATA group evidence "+d.id);
      for(const id of uids){
        const u=ref(um,id,"DATA unit");usedU.add(id);
        check(u.team===d.team,"DATA unit team mismatch "+id);
        check(!seen.has(id),"Duplicate unit in DATA check "+d.id+"/"+id);seen.add(id);
        units.push({id:u.label,status:g.status,evidence_ids:g.evidence_ids});
        for(const aid of aids){
          const t=ref(am,aid,"DATA attempt");usedA.add(aid);
          if(!attemptMap.has(aid))attemptMap.set(aid,{provider:t.provider,query_or_url:has(t,"source_id")?ref(sm,t.source_id,"DATA source").url:t.query_or_url,status:t.status,reason:t.reason,unit_ids:[]});
          attemptMap.get(aid).unit_ids.push(u.label);
        }
      }
    }
    return {...checkFields,units,attempts:[...attemptMap.values()]};
  });
  for(const id of um.keys())check(usedU.has(id),"Unreferenced DATA catalog unit "+id);
  for(const id of am.keys())check(usedA.has(id),"Unreferenced DATA retrieval "+id);
  // Source discovery and contribution are authored together, not in two separate ledgers.
  const h=out.human;
  if(keys(h,["exposure_log","started_at","attempts","claims","no_coverage_reason"],"Compact HUMAN")){
    check(Array.isArray(h.attempts),"Missing HUMAN attempts");
    q.human_contributions=[];h.applicable_sources=[];
    h.attempts=arr(h.attempts).map(t=>{
      if(!keys(t,["source","query_or_url","status","reason","article_url","author","published_at","contribution"],"Compact HUMAN attempt"))return {};
      const {contribution,...attempt}=t;
      h.applicable_sources.push(t.source);
      if(keys(contribution,["kind","assessment","inquiry_ids"],"HUMAN contribution"))q.human_contributions.push({source:t.source,...contribution});
      return attempt;
    });
  }
  // The inquiry is the single authored research record. Views refer to it explicitly.
  check(Array.isArray(out.findings),"Missing compact findings");
  out.findings=arr(out.findings).map(f=>{
    if(!keys(f,["id","inquiry_id","fact","interpretation","evidence_ids","countertest_id","status"],"Compact finding"))return {};
    const {inquiry_id,...x}=f;
    if(has(f,"inquiry_id")){
      const i=ref(qm,inquiry_id,"Finding inquiry");
      return {fact:i.result,interpretation:i.hypothesis,evidence_ids:i.evidence_ids,countertest_id:i.countertest_id,...x};
    }
    return x;
  });
  check(Array.isArray(q.matchup_checks),"Missing compact matchup checks");
  q.matchup_checks=arr(q.matchup_checks).map(m=>{
    if(!keys(m,["direction","from_inquiry","mechanism","comparability","actions","evidence_ids","inquiry_ids","countertest_id","status","limitations"],"Compact matchup"))return {};
    const {from_inquiry,...x}=m;
    if(has(m,"from_inquiry")){
      const i=ref(qm,from_inquiry,"Matchup inquiry");
      check(arr(m.inquiry_ids).includes(from_inquiry),"Matchup origin not in inquiry IDs");
      return {mechanism:i.result,actions:i.actions,evidence_ids:i.evidence_ids,countertest_id:i.countertest_id,limitations:i.uncertainty,...x};
    }
    return x;
  });
  check(Array.isArray(q.leads),"Missing compact leads");
  q.leads=arr(q.leads).map(l=>{
    if(!keys(l,["id","from_inquiry","trigger","question","material","critical","status","inquiry_ids","reason","reason_from_result","next_action"],"Compact lead"))return {};
    const {from_inquiry,reason_from_result,...x}=l;
    if(has(l,"from_inquiry")){
      const i=ref(qm,from_inquiry,"Lead inquiry");
      check(arr(l.inquiry_ids).includes(from_inquiry),"Lead origin not in inquiry IDs");
      if(has(l,"reason_from_result"))check(reason_from_result===true&&l.status==="RESOLVED"&&!has(l,"reason"),"Lead result reuse only for resolved lead with no separate reason");
      return {trigger:i.trigger,question:i.question,...(reason_from_result===true?{reason:i.result}:{}),...x};
    }
    check(!has(l,"reason_from_result"),"Lead result reuse requires inquiry");
    return x;
  });
  if(keys(out.baseline,["frozen_at","snapshot_id","home_evidence_ids","away_evidence_ids","summary","limitation_indices"],"Compact baseline")){
    const b=out.baseline,li=b.limitation_indices;
    check(Array.isArray(li)&&new Set(li).size===li.length&&li.every(i=>Number.isInteger(i)&&i>=0&&i<arr(out.limitations).length),"Invalid baseline limitation references");
    b.limitations=arr(li).map(i=>arr(out.limitations)[i]);delete b.limitation_indices;
  }
  return {errors,expanded:out};
}

function validate(a) {
  try {
    const {errors,expanded}=expandLedger(a);
    return [...errors,...(expanded?validateExpanded(expanded):[])];
  } catch(e){return ["Invalid compact audit: "+e.message];}
}

try {
  if(process.argv.length!==3) throw new Error('Usage: node tools/validate_analyst_v3.mjs audit.json');
  const errors=validate(JSON.parse(readFileSync(process.argv[2],'utf8')));
  if(errors.length){ console.error('FAIL\n'+errors.join('\n')); process.exitCode=1; }
  else console.log('PASS — structural audit only; factual and semantic review required');
} catch(e){ console.error('FAIL — '+e.message);process.exitCode=1; }
