#!/usr/bin/env python3
"""Patch one display-only client asset from V23; no Software API/DB writes.
Synthetic fallback fields are stable for identical fixture inputs and clearly labelled.
"""
from pathlib import Path
from hashlib import sha256
R=Path('/opt/capitale-shared-real-first-fallback-v24-20261122')
old=Path('/app/betcapitale/dist/public/assets/admin-software-v23-verified-parity-20261122.js');s=old.read_text()
assert sha256(s.encode()).hexdigest()=='1db397e07d97a9ab1a14ac7852b26bca77e5964505f9b995c91cfbb01fefa4fa'
prelude=(R/'shared-sample-engine-runtime.js').read_text()+'''
/* Display-only fallback. This is never persisted or sent to Software analysis. */
function capitaleHasRealScore(v){return typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100}
function capitaleVisualScore(row,key,percent=false){const v=row[key];if(capitaleHasRealScore(v))return String(Number(v.toFixed(1)))+(percent?'%':'');const sample=capitaleSampleVisual(row);const fallback=key==='analystScore'?sample.analyst:sample.news;return fallback+(percent?'%':'')}
function capitaleVisualScoreNumber(row,key){return Number.parseFloat(capitaleVisualScore(row,key,false))}
function capitaleVisualShare(row,key){const v=row[key];return capitaleHasRealScore(v)?String(Number(v.toFixed(1)))+'%':capitaleSampleVisual(row)[key==='volumeShare'?'volume':'draw']}
function capitaleVisualShareNumber(row,key){return Number.parseFloat(capitaleVisualShare(row,key))}
function capitaleVisualSignal(row){const code=typeof row.signalCode==='string'?row.signalCode.trim():'';return code&&code!=='—'?code:capitaleSampleVisual(row).signal}
function capitaleSampleFields(row){const missing=[];if(!row.signalCode||row.signalCode==='—')missing.push('signal');if(!capitaleHasRealScore(row.analystScore))missing.push('A');if(!capitaleHasRealScore(row.volumeShare))missing.push('V');if(!capitaleHasRealScore(row.newsScore))missing.push('N');if(!capitaleHasRealScore(row.drawShare))missing.push('B');if(capitaleV2MovementVerified(row)==='—')missing.push('O');return missing}
function capitaleVisualLabel(row){const missing=capitaleSampleFields(row);return missing.length?missing.join(', '):''}
'''
needle='const X=[{key:"matchName"';assert s.count(needle)==1
s=s.replace(needle,prelude+'\n'+needle)
def replace(a,b,count=1):
 global s
 if s.count(a)!=count:raise RuntimeError(f'Expected {count} got {s.count(a)}: '+a[:140])
 s=s.replace(a,b)
# Change real-only odds helper name, then wrap fallback only for presentation.
replace('function capitaleV2Movement(row){','function capitaleV2MovementVerified(row){')
replace('function be(){','function capitaleV2Movement(row){const actual=capitaleV2MovementVerified(row);return actual!=="—"?actual:capitaleSampleVisual(row).movement}\nfunction be(){')
# Score sorting, table, card and detail all include same display value (data never mutated).
replace('s[a]??"":s[a]??""','capitaleVisualScoreNumber(s,a):s[a]??""')
replace('t.analystScore)', 't.analystScore)') if False else None
replace('children:capitaleVerifiedScore(t.analystScore)','children:capitaleVisualScore(t,"analystScore")')
replace('children:capitaleVerifiedScore(t.newsScore)','children:capitaleVisualScore(t,"newsScore")')
replace('children:V(t.volumeShare)','children:capitaleVisualShare(t,"volumeShare")')
replace('children:V(t.drawShare)','children:capitaleVisualShare(t,"drawShare")')
replace('value:capitaleVerifiedScore(t.analystScore,true),number:t.analystScore','value:capitaleVisualScore(t,"analystScore",true),number:capitaleVisualScoreNumber(t,"analystScore")')
replace('value:capitaleVerifiedScore(t.newsScore,true),number:t.newsScore','value:capitaleVisualScore(t,"newsScore",true),number:capitaleVisualScoreNumber(t,"newsScore")')
replace('value:V(t.volumeShare),number:t.volumeShare','value:capitaleVisualShare(t,"volumeShare"),number:capitaleVisualShareNumber(t,"volumeShare")')
replace('value:V(t.drawShare),number:t.drawShare','value:capitaleVisualShare(t,"drawShare"),number:capitaleVisualShareNumber(t,"drawShare")')
replace('children:capitaleVerifiedScore(i.analystScore)','children:capitaleVisualScore(i,"analystScore")')
replace('children:capitaleVerifiedScore(i.newsScore)','children:capitaleVisualScore(i,"newsScore")')
replace('children:V(i.volumeShare)','children:capitaleVisualShare(i,"volumeShare")')
replace('children:V(i.drawShare)','children:capitaleVisualShare(i,"drawShare")')
# Signal text is only changed in the table/cards, no real reporting data is modified.
replace('children:t.signalCode||"—"','children:capitaleVisualSignal(t)',1)
replace('children:t.signalCode','children:capitaleVisualSignal(t)',1)
replace('"data-family":String(t.signalCode||"").split("-")[0]','"data-family":String(capitaleVisualSignal(t)).split("-")[0]')
# Label mixed samples prominently yet without adding a new grid column.
replace('''children:t.homeTeam+" – "+t.awayTeam})''','''children:t.homeTeam+" – "+t.awayTeam}),capitaleVisualLabel(t)&&e.jsx("span",{className:"ml-1 text-[9px] font-black tracking-wide text-amber-700",title:"ILLUSTRATIVE SAMPLE FIELDS: "+capitaleVisualLabel(t),"data-illustrative-row":"true",children:"SAMPLE"})''')
replace('''q(t.kickoffAt)?` · ${q(t.kickoffAt)}`:""]})]}),e.jsx("td",{className:"px-4 py-3.5",children:e.jsx("span",{className:"rounded border border-slate-200 bg-slate-50 px-2 py-1 font-medium text-slate-800",children:capitaleVisualSignal(t)})''','''q(t.kickoffAt)?` · ${q(t.kickoffAt)}`:"",capitaleVisualLabel(t)?` · SAMPLE (${capitaleVisualLabel(t)})`:""]})]}),e.jsx("td",{className:"px-4 py-3.5",children:e.jsx("span",{className:"rounded border border-slate-200 bg-slate-50 px-2 py-1 font-medium text-slate-800",children:capitaleVisualSignal(t)})''')
assert s.count('function capitaleSampleVisual(')==1 and s.count('function capitaleVisualSignal(')==1
assert s.count('capitaleCrest(')==old.read_text().count('capitaleCrest(')
assert s.count('function be()')==1
assert s.count('const capitaleV2CSS=')==old.read_text().count('const capitaleV2CSS=')
file=R/'admin-software-v24-real-first-visual-fallback-20261122.js';file.write_text(s)
print('V24 BUILT',{'oldBytes':old.stat().st_size,'newBytes':file.stat().st_size,'sha256':sha256(file.read_bytes()).hexdigest(),'sampleCodePool':'PRM MOM STR SLD CRL CNI'})