#!/usr/bin/env python3
"""Derive verified-only Software V23 from immutable V22 without touching APIs or DB.
Intent: remove all display-only generated A/N scores and align odds evidence with Match List v2.
"""
from pathlib import Path
import re,hashlib
ROOT=Path('/opt/capitale-software-verified-sync-v23-20261122');live=Path('/app/betcapitale/dist/public/assets/admin-software-v22-shared-sxf-crest-library-20261122.js');source=live.read_text()
assert hashlib.sha256(source.encode()).hexdigest()=='b0cccb6e7ac5f171f74b1eed66567d291ce6226ec77aec2c3cf0f5d0b82f3734'
s=source
def once(old,new):
 global s
 if s.count(old)!=1: raise ValueError('Expected once, got '+str(s.count(old))+': '+old[:190])
 s=s.replace(old,new)
def count_replace(old,new,count):
 global s
 if s.count(old)!=count:raise ValueError('Expected '+str(count)+' got '+str(s.count(old))+': '+old[:190])
 s=s.replace(old,new)
old='function capitaleDisplayScore(id,role){let h=role==="A"?2166136261:334214467;const t=String(id??"");for(let i=0;i<t.length;i++)h=Math.imul(h^t.charCodeAt(i),16777619)>>>0;return role==="A"?58+h%35:48+h%41}'
new='function capitaleVerifiedScore(value,withPercent=false){return typeof value==="number"&&Number.isFinite(value)&&value>=0&&value<=100?String(Number(value.toFixed(1)))+(withPercent?"%":""):"—"}'
once(old,new)
# We only display real source-backed numerical values, or an em dash.
count_replace('t.analystScore??capitaleDisplayScore(t.id,"A")','capitaleVerifiedScore(t.analystScore)',3)
count_replace('t.newsScore??capitaleDisplayScore(t.id,"N")','capitaleVerifiedScore(t.newsScore)',3)
once('i.analystScore??capitaleDisplayScore(i.id,"A")','capitaleVerifiedScore(i.analystScore)')
once('i.newsScore??capitaleDisplayScore(i.id,"N")','capitaleVerifiedScore(i.newsScore)')
once('s[a]??capitaleDisplayScore(s.id,a==="analystScore"?"A":"N")','s[a]??""')
# Values in V2 console: source A and N score use same 0-100 numeric presentation as Match List, no invented '%'.
once('value:(capitaleVerifiedScore(t.analystScore))+"%",number:capitaleVerifiedScore(t.analystScore)', 'value:capitaleVerifiedScore(t.analystScore,true),number:t.analystScore')
once('value:(capitaleVerifiedScore(t.newsScore))+"%",number:capitaleVerifiedScore(t.newsScore)', 'value:capitaleVerifiedScore(t.newsScore,true),number:t.newsScore')
# Source-derived percent fields share exact rounding and validity behavior.
once('function V(s){return s===null||!Number.isFinite(s)?"—":`${s.toLocaleString("en-GB",{maximumFractionDigits:1})}%`}', 'function V(s){return typeof s==="number"&&Number.isFinite(s)&&s>=0&&s<=100?String(Number(s.toFixed(1)))+"%":"—"}')
# Match List requires exact selection/market, valid timestamps and ordered pair >1 for O.
once('function capitaleV2Movement(current,reference){if(!Number.isFinite(current)||!Number.isFinite(reference)||current<=0||reference<=0)return"—";const v=(current-reference)/reference*100;return(v>0?"+":"")+v.toFixed(1)+"%"}', 'function capitaleV2Movement(row){if(!row?.market?.trim()||!row?.selection?.trim()||!row.referenceOddsAt||!row.currentOddsAt)return"—";const a=Date.parse(row.referenceOddsAt),b=Date.parse(row.currentOddsAt),old=row.referenceOdds,now=row.currentOdds;if(!Number.isFinite(a)||!Number.isFinite(b)||b<a||typeof old!=="number"||typeof now!=="number"||!Number.isFinite(old)||!Number.isFinite(now)||old<=1||now<=1)return"—";const delta=(now-old)*100/old;return(delta>0?"+":"")+delta.toFixed(1)+"%"}')
once('value:capitaleV2Movement(t.currentOdds,t.referenceOdds)','value:capitaleV2Movement(t)')
# Only meaningful / verified movement should be used in table/details too.
old='function P(s,a){if(s===null||a===null||s<=0||a<=0)return{label:"—",tone:"text-slate-500"};const l=(s-a)/a*100;return Number.isFinite(l)?l<0?{label:`↓ ${Math.abs(l).toFixed(1)}%`,tone:"text-emerald-700"}:l>0?{label:`↑ ${l.toFixed(1)}%`,tone:"text-rose-700"}:{label:"Unchanged",tone:"text-slate-500"}:{label:"—",tone:"text-slate-500"}}'
new='function P(row){const value=capitaleV2Movement(row);if(value==="—")return{label:"—",tone:"text-slate-500"};const n=Number.parseFloat(value);return n<0?{label:`↓ ${Math.abs(n).toFixed(1)}%`,tone:"text-emerald-700"}:n>0?{label:`↑ ${n.toFixed(1)}%`,tone:"text-rose-700"}:{label:"Unchanged",tone:"text-slate-500"}}'
once(old,new)
once('P(t.currentOdds,t.referenceOdds)','P(t)')
count_replace('P(i.currentOdds,i.referenceOdds)','P(i)',2)
# Both screens load the same Software endpoint, refresh every 90s, bypass cache.
once('fetch("/api/admin/software",{credentials:"same-origin"})','fetch("/api/admin/software",{credentials:"same-origin",cache:"no-store"})')
once('queryKey:["admin-software"],queryFn:me,retry:!1,staleTime:3e4','queryKey:["admin-software"],queryFn:me,retry:!1,staleTime:3e4,refetchInterval:9e4,refetchOnWindowFocus:!0')
assert 'capitaleDisplayScore' not in s
assert s.count('capitaleVerifiedScore(')==7  # function + 2 table + 2 card + 2 details
assert s.count('capitaleV2Movement(')==3 # function + P + card
assert s.count('fetch("/api/admin/software"')==1
assert s.count('capitaleCrest(')==source.count('capitaleCrest(')
assert s.count('const capitaleFlowCSS=')==source.count('const capitaleFlowCSS=')
assert 'CAPITALE_LOCAL_CREST_CATALOG' in s
file=ROOT/'admin-software-v23-verified-parity-20261122.js';file.write_text(s)
print('V23_VERIFIED_SOURCE_ONLY',{'originalBytes':len(source),'newBytes':len(s),'oldSHA':hashlib.sha256(source.encode()).hexdigest(),'newSHA':hashlib.sha256(s.encode()).hexdigest(),'sameLogoAndUI':True})