import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function request(url:string,body?:unknown){
 const r=await fetch(url,{credentials:"same-origin",...(body?{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}:{})});
 const d=await r.json();
 if(!r.ok||d.ok===false)throw new Error(d.error??"Request failed");
 return d;
}
export function DepartmentReports({runId}:{runId:string}){
 const q=useQuery({queryKey:["department-reports",runId],queryFn:()=>request("/api/admin/capitale/agent-reports/"+encodeURIComponent(runId)),retry:false});
 if(q.isLoading)return <p className="p-5">Loading department reports…</p>;
 if(q.error)return <p className="p-5 text-red-700">Reports could not be loaded.</p>;
 const reports=q.data?.reports??[];
 return <div className="grid gap-4 p-5 lg:grid-cols-3">{["analyst","news","sxf"].map(role=><section key={role} className="min-w-0 rounded border p-4">
 <h3 className="font-bold">{role.toUpperCase()}</h3>
 {reports.filter((r:any)=>r.role===role).length===0?<p className="mt-3 text-slate-500">— No report received.</p>:reports.filter((r:any)=>r.role===role).map((r:any)=><details key={r.id} className="mt-3 border-t pt-3">
 <summary className="cursor-pointer">Version {r.report_version} · {r.as_of}</summary>
 <p className="mt-2 whitespace-pre-wrap">{r.summary}</p>
 <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words text-xs">{JSON.stringify(r.payload,null,2)}</pre>
 <p className="mt-2 text-xs">Report ID: {r.id}</p>
 {(q.data?.evidence??[]).filter((e:any)=>e.report_id===r.id).map((e:any)=><div key={e.id} className="mt-3 text-sm"><p>{e.claim_text}</p>{/^https?:\/\//i.test(e.source_uri??"")&&<a className="underline" href={e.source_uri} target="_blank" rel="noreferrer">{e.source_name??"Source"}</a>}</div>)}
 </details>)}
 </section>)}</div>;
}
export function PrepareAnalysis(){
 const qc=useQueryClient();
 const [query,setQuery]=useState(""),[day,setDay]=useState(""),[asOf,setAsOf]=useState(""),[matches,setMatches]=useState<any[]>([]),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
 async function find(){
 setBusy(true);setMessage("");
 try{const p=new URLSearchParams({query});if(day)p.set("day",day);const d=await request("/api/admin/capitale/fixtures?"+p);setMatches(d.matches??[]);if(!d.matches?.length)setMessage("No matching fixture found.");}
 catch(e){setMessage(e instanceof Error?e.message:"Lookup failed");}finally{setBusy(false);}
 }
 async function prepare(f:any){
 if(!asOf){setMessage("Enter the original report AS_OF timestamp.");return;}
 const t=new Date(asOf);if(!Number.isFinite(t.getTime())){setMessage("Use an ISO timestamp with timezone, for example 2026-11-20T10:00:00Z.");return;}
 if(!/(Z|[+-]\d{2}:\d{2})$/i.test(asOf)){setMessage("AS_OF must include a timezone.");return;}
 setBusy(true);
 try{const d=await request("/api/admin/capitale/research-runs",{fixture_uid:f.fixture_uid,as_of:t.toISOString()});setMessage("Run ready: "+d.run_id);await qc.invalidateQueries({queryKey:["admin-software"]});}
 catch(e){setMessage(e instanceof Error?e.message:"Preparation failed");}finally{setBusy(false);}
 }
 return <details className="rounded-lg border border-slate-200 bg-white p-5">
 <summary className="cursor-pointer font-semibold">Prepare a match for report transfer</summary>
 <p className="mt-3 text-sm text-slate-600">Find the verified fixture and use the original report AS_OF. Agents can then resolve this run without accessing other departments’ reports.</p>
 <div className="mt-3 flex flex-wrap gap-3"><input aria-label="Team search" className="rounded border p-2" placeholder="Team name" value={query} onChange={e=>setQuery(e.target.value)}/><input aria-label="Match date" className="rounded border p-2" type="date" value={day} onChange={e=>setDay(e.target.value)}/><button disabled={busy||query.trim().length<2} className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50" onClick={()=>void find()}>Find match</button><input aria-label="AS_OF timestamp" className="min-w-72 rounded border p-2" placeholder="AS_OF: ISO timestamp with timezone" value={asOf} onChange={e=>setAsOf(e.target.value)}/></div>
 {message&&<p role="status" className="mt-3 break-all text-sm">{message}</p>}
 <div className="mt-3 space-y-2">{matches.map((f:any,i:number)=><div key={f.fixture_uid+":"+i} className="flex flex-wrap items-center justify-between gap-2 border-t py-3"><span>{f.home_team} – {f.away_team} · {f.kickoff_utc}{f.run_id&&<small className="block">Existing run: {f.run_id} · {f.analysis_cutoff_at}</small>}</span><button disabled={busy} onClick={()=>void prepare(f)} className="rounded border px-3 py-2">Prepare run</button></div>)}</div>
 </details>;
}
