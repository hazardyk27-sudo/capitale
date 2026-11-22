#!/usr/bin/env python3
"""Publish an allowlisted, read-only public mirror of CAPITALE Software's fixture cards.

Production admin reports and agent evidence never leave the protected database.
The module uses the same Supabase RPC as /api/admin/software and writes ONLY
the 14 explicitly accepted public display fields to software/matches.json.
"""
from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from zoneinfo import ZoneInfo
import hashlib
import json
import math
import os
import re
import sys

ROOT=Path(os.environ.get('CAPITALE_PUBLIC_SOFTWARE_OUTPUT_DIR','/app/betcapitale/dist/public/software'))
LEDGER_PATH=Path(os.environ.get('CAPITALE_VISUAL_LEDGER_PATH','/var/lib/capitale-software-visual-ledger/ledger-v1.json'))
SOURCE='/opt/capitale-sxf-software-sync.py'
TRT=ZoneInfo('Europe/Istanbul')

# Software-only retention: today, yesterday, and future Istanbul match dates.
def earliest_software_date(now=None):
    local_today=(now or datetime.now(timezone.utc)).astimezone(TRT).date()
    return local_today-timedelta(days=1)

def keep_software_fixture(row, cutoff):
    return date.fromisoformat(row['date'])>=cutoff

def keep_software_ledger_key(key,cutoff):
    parts=key.split('|',3)
    if len(parts)!=4 or parts[0]!='capitale-sample-v1':
        raise ValueError('Unrecognized Software-only sample key; refusing to prune')
    return date.fromisoformat(parts[1])>=cutoff

def iso_time(v):
    if not isinstance(v,str) or not v.strip(): return None
    try:
        val=datetime.fromisoformat(v.strip().replace('Z','+00:00'))
        if val.tzinfo is None: return None
        return val.astimezone(timezone.utc)
    except ValueError:return None

def text(v,n=180):
    if not isinstance(v,str):return None
    v=' '.join(v.split())
    if len(v)>n:return v[:n].rstrip()
    return v or None

def number(v,lo,hi):
    if isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) or not lo<=v<=hi:return None
    return float(v)

def delta(d):
    current=number(d.get('current_odds'),1.001,10000)
    ref=number(d.get('reference_odds'),1.001,10000)
    a=iso_time(d.get('reference_odds_at'))
    b=iso_time(d.get('current_odds_at'))
    if not d.get('market') or not d.get('selection') or current is None or ref is None or a is None or b is None or b<a:
        return None
    return round((current-ref)*100/ref,1)

def project(item):
    if not isinstance(item,dict):return None
    reports=item.get('reports') or []
    if not isinstance(reports,list):return None
    def role(k):
        return next((r for r in reports if isinstance(r,dict) and r.get('role')==k),{})
    sxf=role('sxf')
    display=sxf.get('display') or {}
    if not isinstance(display,dict):return None
    kickoff=iso_time(item.get('kickoff_utc'))
    if kickoff is None:return None
    home=text(item.get('home_team'),100)
    away=text(item.get('away_team'),100)
    signal=text(display.get('signal_code'),16)
    if not all([home,away]):return None
    market=text(display.get('market'),70)
    selection=text(display.get('selection'),70)
    def verified_score(name):
        d=role(name).get('display') or {}
        if not isinstance(d,dict) or not market or not selection:return None
        if d.get('market')!=market or d.get('selection')!=selection:return None
        return number(d.get('support_score'),0,100)
    uid=text(item.get('fixture_uid')) or ''
    anchor=text(item.get('as_of')) or ''
    public_key=hashlib.sha256((uid+'|'+anchor).encode()).hexdigest()[:20]
    return {
        'key':public_key,
        'date':kickoff.astimezone(TRT).date().isoformat(),
        'kickoffAt':kickoff.isoformat().replace('+00:00','Z'),
        'homeTeam':home,
        'awayTeam':away,
        'league':text(item.get('league'),120),
        'signalCode':signal,
        'market':market,
        'selection':selection,
        'analystScore':verified_score('analyst'),
        'newsScore':verified_score('news'),
        'volumeShare':number(display.get('volume_share_pct'),0,100),
        'drawShare':number(display.get('draw_share_pct'),0,100),
        'oddsDeltaPct':delta(display),
        'watchOnly':bool(display.get('watch_only')),
    }

# Presentation-only sample values. Never modify SXF/Analyst/News source records.
# This is the byte-equivalent arithmetic of capita­le-visual-fallback.ts.
SAMPLE_SIGNAL_POOL=('PRM-6','MOM-8','STR-6','SLD-8','CRL-6','CNI-6','PRM-8')
def sample_key(row):
    def normalized(value):
        import unicodedata
        x=unicodedata.normalize('NFKD',str(value or '')).lower()
        x=''.join(ch for ch in x if not unicodedata.combining(ch))
        x=x.replace('&',' and ')
        return ' '.join(re.sub('[^a-z0-9]+',' ',x).split())
    return 'capitale-sample-v1|'+str(row.get('date') or '')+'|'+normalized(row.get('homeTeam'))+'|'+normalized(row.get('awayTeam'))
def sample_values(row):
    key=sample_key(row)
    h=2166136261
    # JS charCodeAt produces UTF-16 code units, even for non-ASCII fixtures.
    encoded=key.encode('utf-16-le')
    for idx in range(0,len(encoded),2):
        h=((h ^ int.from_bytes(encoded[idx:idx+2],'little'))*16777619)&0xffffffff
    def pick(salt,lo,hi):
        n=(h ^ ((salt*2654435761)&0xffffffff))&0xffffffff
        n=((n^(n>>16))*2246822507)&0xffffffff
        n=((n^(n>>13))*3266489909)&0xffffffff
        return lo+n%(hi-lo+1)
    signal=SAMPLE_SIGNAL_POOL[pick(1,0,len(SAMPLE_SIGNAL_POOL)-1)]
    return {'signal':signal,'checkpoint':'T-8' if signal.endswith('-8') else 'T-6',
        'analyst':str(pick(3,61,92)), 'volume':f'{pick(4,670,975)/10:.1f}%',
        'news':str(pick(5,55,88)), 'draw':f'{pick(6,30,215)/10:.1f}%',
        'movement':('+' if pick(2,0,1) else '-')+f'{pick(7,2,69)/10:.1f}%'}
def number_string(value):
    from decimal import Decimal,ROUND_HALF_UP
    v=number(value,0,100)
    if v is None:return None
    rounded=Decimal(str(v)).quantize(Decimal('.1'),rounding=ROUND_HALF_UP)
    return format(rounded.normalize(),'f')
def visible_values(row,sample):
    visual={}
    source={}
    def put(key,original,converter=lambda x:x):
        value=converter(original)
        sample_value=sample[key]
        if value is not None and value!='' and value!='—':
            visual[key]=value;source[key]='software'
        else:
            visual[key]=sample_value;source[key]='illustrative'
    put('signal',row.get('signalCode'))
    signal=visual['signal'];visual['checkpoint']='T-8' if signal.endswith('-8') else 'T-6'
    put('analyst',row.get('analystScore'),number_string)
    put('volume',row.get('volumeShare'),lambda x:(number_string(x)+'%') if number_string(x) is not None else None)
    put('news',row.get('newsScore'),number_string)
    put('draw',row.get('drawShare'),lambda x:(number_string(x)+'%') if number_string(x) is not None else None)
    movement=row.get('oddsDeltaPct')
    if isinstance(movement,(int,float)) and not isinstance(movement,bool) and math.isfinite(movement):
        # Match Software's JS toFixed(1) output, including sign and trailing .0.
        from decimal import Decimal,ROUND_HALF_UP
        change=Decimal(str(movement)).quantize(Decimal('.1'),rounding=ROUND_HALF_UP)
        value=('+' if change>0 else '')+f'{change:.1f}%'
    else:value=None
    put('movement',value)
    visual['fieldSource']=source
    return visual

def read_ledger(path):
    if not path.exists():return {}
    try:
        values=json.loads(path.read_text())
        if values.get('schema')=='capitale-visual-ledger-v1' and isinstance(values.get('samples'),dict):return values['samples']
    except (ValueError,OSError):pass
    raise RuntimeError('Unsafe/invalid persistent visual ledger; refusing to overwrite')
def atomic_json(path,value,mode=0o600):
    path.parent.mkdir(parents=True,exist_ok=True)
    temp=path.with_name('.'+path.name+'.'+str(os.getpid())+'.tmp')
    temp.write_text(json.dumps(value,ensure_ascii=False,separators=(',',':'),allow_nan=False)+'\n',encoding='utf-8')
    temp.chmod(mode)
    os.replace(temp,path)

def run():
    spec=spec_from_file_location('capitale_source_verified',SOURCE)
    mod=module_from_spec(spec);spec.loader.exec_module(mod)
    url,key,_=mod.config()
    status,feed=mod.rest(url,key,'POST','rpc/capitale_admin_software_feed',body={})
    if status!=200 or feed.get('ok') is not True:raise RuntimeError('Verified Software RPC not ready')
    runs=feed.get('runs')
    if not isinstance(runs,list):raise RuntimeError('Software runs are not an array')
    projected=[(row,p) for row in runs if (p:=project(row)) is not None]
    if not projected and runs:raise RuntimeError('Software returned rows but public projection had none')
    cutoff=earliest_software_date()
    rows=[(row,p) for row,p in projected if keep_software_fixture(p,cutoff)]
    data=[p for _,p in rows]
    historical_skipped=len(projected)-len(rows)
    previous_ledger=read_ledger(LEDGER_PATH)
    ledger={k:v for k,v in previous_ledger.items() if keep_software_ledger_key(k,cutoff)}
    historical_pruned=len(previous_ledger)-len(ledger)
    new_count=0
    for run,public in rows:
        key=sample_key(public)
        if key not in ledger:
            ledger[key]=sample_values(public)
            new_count+=1
        sample=ledger[key]
        required={'signal','checkpoint','analyst','volume','news','draw','movement'}
        if set(sample)!=required:raise RuntimeError('Persistent sample ledger does not match required schema')
        public['visual']=visible_values(public,sample)
        # Source ID is intentionally never included in the public JSON.
    if new_count or historical_pruned:
        atomic_json(LEDGER_PATH,{'schema':'capitale-visual-ledger-v1','samples':ledger},mode=0o600)
    # Strict allowlist is the entire public JSON surface.
    payload={
        'status':'connected',
        'generatedAt':datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z'),
        'count':len(data),
        'items':data
    }
    blob=json.dumps(payload,ensure_ascii=False,separators=(',',':'),allow_nan=False)
    assert 'full_report' not in blob and 'sources' not in blob and 'input_snapshot_hash' not in blob and 'evidence' not in blob
    ROOT.mkdir(parents=True,exist_ok=True)
    final=ROOT/'matches.json'
    temp=ROOT/'.matches.json.tmp'
    temp.write_text(blob+'\n',encoding='utf-8')
    temp.chmod(0o644)
    os.replace(temp,final)
    print(json.dumps({'result':'ok','published_matches':len(data),'source_runs':len(runs),'new_sampled_fixtures':new_count,'stored_fixture_samples':len(ledger),'discarded_historical_rows':historical_skipped,'pruned_historical_samples':historical_pruned,'earliest_local_date':cutoff.isoformat(),'bytes':len(blob),'path':str(final)},separators=(',',':')))

if __name__=='__main__':
    try:run()
    except Exception as exc:
        print('PUBLIC_SOFTWARE_EXPORT_FAILED '+type(exc).__name__+': '+str(exc),file=sys.stderr)
        sys.exit(2)