#!/usr/bin/env python3
"""Recover source-verified SXF FINAL and EARLY selections absent from Software.

Only approved engine families, original pre-kickoff source events and real
market snapshots. Do not infer picks or alter other agents' reports.
Designed to complement the T6/T8 final signal reconciliation service.
"""
from __future__ import annotations
import importlib.util
import json
import os
import sys
import argparse
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

SOURCE='/opt/capitale-sxf-software-sync.py'
OUT=Path('/var/lib/capitale-sxf-software-complete-coverage')
TRT=ZoneInfo('Europe/Istanbul')
APPROVED_EARLY={'EARLY_MONEY_CORE','EARLY_MONEY_CORE_V2'}
MAX_EVENTS=4000

def source():
    spec=importlib.util.spec_from_file_location('capitale_sxf_source',SOURCE)
    m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
    return m

def load_source(m,url,key,cutoff):
    events=[]
    for offset in range(0,MAX_EVENTS,1000):
        _,page=m.rest(url,key,'GET','sxf_base_signal_events',params={
            'select':'event_id,event_key,fixture_uid,kickoff_utc,engine,kind,market,selection,details,recorded_at,job_checkpoint_hours,source_checkpoint_hours,ruleset_version',
            'kind':'in.(FINAL_SIGNAL,EARLY_SIGNAL)',
            'kickoff_utc':'gte.'+m.iso(cutoff),
            'order':'kickoff_utc.asc',
            'limit':'1000','offset':str(offset)
        })
        events.extend(page)
        if len(page)<1000:break
    if len(events)>=MAX_EVENTS:raise m.ImportRejected('Source event pagination limit reached; no partial commit')
    byuid=sorted({str(e['fixture_uid']) for e in events if e.get('fixture_uid')})
    fixtures={}
    for i in range(0,len(byuid),250):
        _,rows=m.rest(url,key,'GET','fixtures',params={
            'select':'fixture_uid,home_team,away_team,league,kickoff_utc',
            'fixture_uid':'in.('+','.join(byuid[i:i+250])+')','limit':'250'
        })
        fixtures.update({str(r['fixture_uid']):r for r in rows})
    return events,fixtures

def classify(m,ev,fixtures):
    uid=str(ev.get('fixture_uid') or '')
    fixture=fixtures.get(uid)
    if fixture is None:return 'unknown_fixture'
    engine,kind=ev.get('engine'),ev.get('kind')
    if engine not in m.ENGINE_GROUP:return 'unknown_engine'
    if kind not in ('FINAL_SIGNAL','EARLY_SIGNAL'):return 'unknown_kind'
    if kind=='EARLY_SIGNAL' and engine not in APPROVED_EARLY:return 'unapproved_early_engine'
    details=ev.get('details')
    if not isinstance(details,dict) or details.get('selection_status')!='ELIGIBLE':return 'ineligible'
    h=ev.get('job_checkpoint_hours')
    if not isinstance(h,int) or not 1<=h<=168:return 'invalid_checkpoint'
    if ev.get('source_checkpoint_hours')!=h or details.get('checkpoint')!=h:return 'checkpoint_mismatch'
    if kind=='FINAL_SIGNAL' and h not in (6,8):return 'unapproved_final_checkpoint'
    if details.get('engine')!=engine or details.get('side')!=ev.get('selection'):return 'source_field_mismatch'
    if (ev.get('market'),ev.get('selection')) not in (('1X2','1'),('1X2','2'),('OU25','O'),('BTTS','Y')):return 'unapproved_market_pick'
    if any(m.number(details.get(x),lo,hi) is None for x,lo,hi in [('odds',1.3,10000),('share',0,100),('amount',0,None)]):return 'invalid_source_numbers'
    try:
        kickoff=m.utc(fixture['kickoff_utc'])
        observed=m.utc(details['observed_at'])
        recorded=m.utc(ev['recorded_at'])
        cutoff=kickoff-timedelta(hours=h)
        if m.utc(ev['kickoff_utc'])!=kickoff:return 'kickoff_mismatch'
        if observed>cutoff:return 'snapshot_after_checkpoint'
        if recorded>=kickoff:return 'recorded_after_kickoff'
        if observed>=kickoff:return 'observed_after_kickoff'
    except (ValueError,TypeError,KeyError,m.ImportRejected):return 'invalid_source_time'
    return 'approved'

def rank(m,ev):
    code=m.ENGINE_GROUP[ev['engine']]
    weights={'SLD':1,'MOM':2,'CRL':3,'PRM':4}
    h=ev['job_checkpoint_hours']
    engine=ev['engine']
    early_v2=1 if engine=='EARLY_MONEY_CORE_V2' else 0
    return (weights[code],1 if ev['kind']=='FINAL_SIGNAL' else 0,early_v2,-h,ev.get('event_id') or 0)

def choose(m,events):
    highest=max(events,key=lambda e:rank(m,e))
    # Market and checkpoint must match the top ranked signal. Retain sibling
    # rules as original evidence; never promote unrelated market outcomes.
    primary=[e for e in events if (e['kind'],e['job_checkpoint_hours'],e['market'],e['selection']) ==
                                      (highest['kind'],highest['job_checkpoint_hours'],highest['market'],highest['selection'])]
    return highest,primary

def existing_priority(m,feed_item):
    """Read-only check: the one visible family should never be downgraded."""
    reports=feed_item.get('reports') or []
    for report in reports:
        if not isinstance(report,dict) or report.get('role')!='sxf':continue
        display=report.get('display') or {}
        if not isinstance(display,dict):continue
        code=str(display.get('signal_code') or '').split('-',1)[0]
        weight={'SLD':1,'MOM':2,'CRL':3,'PRM':4}.get(code,0)
        if not weight:
            weight=max(({'SLD':1,'MOM':2,'CRL':3,'PRM':4}.get(m.ENGINE_GROUP.get(e),0)
                        for e in (display.get('engine_tags') or [])),default=0)
        # Source kind was explicitly tagged by this catch-up importer; for
        # older FINAL_SIGNAL reports, missing source_signal_kind means FINAL.
        kind=display.get('source_signal_kind')
        is_final=kind!='EARLY_SIGNAL'
        return (weight,1 if is_final else 0)
    return (0,0)

def report_for(m,url,key,fixture,highest,original):
    uid=str(fixture['fixture_uid'])
    h=highest['job_checkpoint_hours']
    kind=highest['kind']
    kickoff=m.utc(fixture['kickoff_utc'])
    cutoff=kickoff-timedelta(hours=h)
    details=highest['details']
    market=highest['market'];side=highest['selection']
    family=m.ENGINE_GROUP[highest['engine']]
    engines=sorted({e['engine'] for e in original})
    source_snapshot=m.snapshot(url,key,uid,market,side,cutoff)
    price=m.number(details['odds'],1.001,10000)
    share=m.number(details['share'],0,100)
    amount=m.number(details['amount'],0)
    reference_at=cutoff-timedelta(hours=(2 if kind=='FINAL_SIGNAL' else 12))
    reference=m.snapshot(url,key,uid,market,side,reference_at)
    draw=m.snapshot(url,key,uid,'1X2','X',cutoff)
    reference_price=m.number(reference.get('odds'),1.001,10000) if reference else None
    draw_share=m.number(draw.get('share'),0,100) if draw else None
    watch_only=highest['engine']=='SURPRISE_TEAM' or kind=='EARLY_SIGNAL'
    label={'1':fixture['home_team'],'2':fixture['away_team'],'O':'Over 2.5','Y':'BTTS Yes'}[side]
    if watch_only:label='Early / watch: '+label
    bullets=[
        f"Source-verified {kind} from {', '.join(engines)}, original checkpoint T-{h}; observed {details['observed_at']}.",
        f"Recorded money share {share:g}%, amount £{amount:,.2f}, odds {price:g} from original SXF evidence.",
    ]
    if reference_price:
        bullets.append(f"Reference odds {reference_price:g} at {reference['scraped_at_utc']}; no result or win probability inferred.")
    else:
        bullets.append('No earlier verified market reference available; no betting result inferred.')
    origin=[{
        'event_id':e['event_id'],'event_key':e['event_key'],'engine':e['engine'],
        'kind':e['kind'],'market':e['market'],'selection':e['selection'],
        'details':e['details'],'recorded_at':e['recorded_at'],
        'ruleset_version':e['ruleset_version'],
    } for e in sorted(original,key=lambda e:e['event_id'])]
    source_hash=m.sha(origin)
    # Owner-approved Software badge families use -6/-8 suffix. EARLY only
    # is indicated as SLD-6 in the display, while the *actual* T-24/T-60/T-72
    # checkpoint and EARLY_SIGNAL kind stay explicit in the report payload.
    code=f'{family}-{h}' if kind=='FINAL_SIGNAL' else 'SLD-6'
    auxiliary=[{
        'engine':e['engine'],'event_id':e['event_id'],'kind':e['kind'],
        'market':e['market'],'selection':e['selection'],
        'checkpoint':e['job_checkpoint_hours'],'source_event_only':True,
    } for e in original if e['event_id']!=highest['event_id']]
    display={
        'market':market,'selection':side,'selection_label':label,
        'signal_code':code,'engine_tags':engines,
        'checkpoint_used':f'T-{h}',
        'source_signal_kind':kind,
        'watch_only':watch_only,'volume_share_pct':share,'draw_share_pct':draw_share,
        'current_odds':price,'reference_odds':reference_price,
        'reference_odds_at':m.iso(m.utc(reference['scraped_at_utc'])) if reference else None,
        'current_odds_at':m.iso(m.utc(details['observed_at'])),
        'source':'SmartXFlow original '+kind,
        'software_detail_bullets_en':bullets,
    }
    payload={
        'display':display,'source_fixture_uid':uid,
        'kickoff_utc':m.iso(kickoff),'as_of_utc':m.iso(cutoff),
        'scan_mode':'SOURCE_VERIFIED_COVERAGE_CATCHUP',
        'source_snapshot_hash':source_hash,'status':('EARLY_SOURCE_ONLY' if kind=='EARLY_SIGNAL' else 'VERIFIED_ACTIVE'),
        'engine_events':origin,'auxiliary_signals':auxiliary,
        'source_material':{'checkpoint_market':source_snapshot,'price_reference':reference,'draw_snapshot':draw},
    }
    summary=(
        f'SXF {kind}: {fixture["home_team"]} – {fixture["away_team"]}, '
        f'{market}/{side}, badge {code}, real source checkpoint T-{h}. '
        +('Early selection, not a FINAL_SIGNAL or final betting recommendation.' if kind=='EARLY_SIGNAL' else 'Verified final signal.')
    )
    evidence=[{
        'source_kind':'smartxflow_engine_event',
        'source_name':f'SXF original event {e["event_id"]}',
        'claim_text':f'{e["kind"]} {e["engine"]} {e["market"]}/{e["selection"]} T-{h}; original {e["details"]["observed_at"]}',
        'published_at':m.iso(m.utc(e['recorded_at'])),
        'reliability_score':None,
        'payload':{'event_id':e['event_id'],'event_key':e['event_key'],'source_kind':e['kind']},
    } for e in original]
    return {
      'uid':uid,'cutoff':m.iso(cutoff),'source_hash':source_hash,'display':display,
      'report':{
          'status':'complete','as_of':m.iso(cutoff),'source_count':len(original),'summary':summary,
          'recommended_market':market if kind=='FINAL_SIGNAL' and not watch_only else None,
          'recommended_selection':side if kind=='FINAL_SIGNAL' and not watch_only else None,
          'payload':payload,'prompt_version':'sxf-verified-full-coverage-v1',
          'input_snapshot_hash':source_hash
      },'evidence':evidence
    }

def main():
    arg=argparse.ArgumentParser()
    arg.add_argument('--commit',action='store_true')
    arg.add_argument('--max-writes',type=int,default=160)
    arg.add_argument('--only-fixture',type=str,default=None)
    args=arg.parse_args()
    m=source();url,key,token=m.config()
    now=datetime.now(timezone.utc)
    local_start=now.astimezone(TRT).date()-timedelta(days=1)
    cutoff=datetime(local_start.year,local_start.month,local_start.day,tzinfo=TRT).astimezone(timezone.utc)
    all_events,fixtures=load_source(m,url,key,cutoff)
    _,feed=m.rest(url,key,'POST','rpc/capitale_admin_software_feed',body={})
    if not feed.get('ok') or not isinstance(feed.get('runs'),list):raise m.ImportRejected('Admin Software feed unavailable')
    present={str(x.get('fixture_uid')) for x in feed['runs']}
    by_fixture=defaultdict(list)
    for row in feed['runs']:
        by_fixture[str(row.get('fixture_uid'))].append(row)
    byuid=defaultdict(list);skips=defaultdict(int)
    for event in all_events:
        status=classify(m,event,fixtures)
        if status=='approved':byuid[str(event['fixture_uid'])].append(event)
        else:skips[status]+=1
    queue=[]
    for uid,valid in byuid.items():
        if args.only_fixture and uid!=args.only_fixture:continue
        fixture=fixtures[uid]
        primary,related=choose(m,valid)
        needed_rank=rank(m,primary)[:2]
        current_rank=max((existing_priority(m,row) for row in by_fixture.get(uid,[])),default=(0,0))
        # Upgrade a previous SLD early-only row when a more authoritative
        # final signal arrives (PRM > CRL > MOM > SLD). Otherwise, keep it.
        if current_rank>=needed_rank:continue
        queue.append((m.utc(fixture['kickoff_utc']),uid,fixture,primary,related,valid))
    queue.sort(key=lambda row:(row[0],row[1]))
    if len(queue)>args.max_writes:raise m.ImportRejected('Coverage exceeds bounded write capacity; no partial commit')
    output={
        'mode':'COMMIT' if args.commit else 'DRY_RUN',
        'source_events':len(all_events),'approved_fixtures':len(byuid),
        'existing_software_fixtures':len(present),'missing_or_lower_priority_fixtures':len(queue),'missing_fixtures':sum(uid not in present for _,uid,_,_,_,_ in queue),
        'excluded':dict(skips),'as_of':m.iso(now),
        'results':[],'errors':[]
    }
    cache={}
    for kickoff,uid,fixture,primary,related,all_valid in queue:
        row={'uid':uid,'fixture':fixture['home_team']+' – '+fixture['away_team'],
             'kickoff':fixture['kickoff_utc'],'engine':primary['engine'],
             'kind':primary['kind'],'checkpoint':primary['job_checkpoint_hours'],
             'source_event_count':len(related),
             'code':('SLD-6' if primary['kind']=='EARLY_SIGNAL' else m.ENGINE_GROUP[primary['engine']]+'-'+str(primary['job_checkpoint_hours']))
        }
        if not args.commit:
            output['results'].append(dict(row,status='WOULD_SYNC'))
            continue
        try:
            report=report_for(m,url,key,fixture,primary,related)
            saved=m.upload(url,key,token,report,fixture)
            output['results'].append(dict(row,status='SAVED_VERIFIED',run_id=saved['run_id'],
                                          report_id=saved['report_id'],version=saved['report_version']))
        except Exception as exc:
            output['errors'].append(dict(row,error=type(exc).__name__+': '+str(exc)[:180]))
    # Mandatory second independent read of the original Software RPC: both
    # source coverage and priority must match after every scheduled run.
    if args.commit:
        _,confirmed=m.rest(url,key,'POST','rpc/capitale_admin_software_feed',body={})
        if not confirmed.get('ok') or not isinstance(confirmed.get('runs'),list):
            output['errors'].append({'error':'Software second readback unavailable'})
        else:
            after_by_fixture=defaultdict(list)
            for item in confirmed['runs']:
                after_by_fixture[str(item.get('fixture_uid'))].append(item)
            for uid,events in byuid.items():
                primary,_=choose(m,events)
                wanted=rank(m,primary)[:2]
                actual=max((existing_priority(m,r) for r in after_by_fixture.get(uid,[])),default=(0,0))
                if actual < wanted:
                    output['errors'].append({
                        'fixture_uid':uid,
                        'error':'Missing or lower-priority signal after reconciliation',
                        'expected_priority':wanted,
                        'observed_priority':actual
                    })
            duplicate_uids=[uid for uid,entries in after_by_fixture.items() if len(entries)>1]
            if duplicate_uids:
                output['errors'].append({'error':'Duplicate visible fixture rows in Software','count':len(duplicate_uids)})
            output['verified_readback_fixtures']=len(after_by_fixture)
        OUT.mkdir(parents=True,exist_ok=True,mode=0o750);os.chmod(OUT,0o750)
        data=json.dumps(output,ensure_ascii=False,sort_keys=True,indent=2)+'\n'
        path=OUT/'latest.json';tmp=OUT/'latest.json.tmp'
        tmp.write_text(data);os.chmod(tmp,0o640);os.replace(tmp,path)
    output['summary']={'saved':sum(x.get('status')=='SAVED_VERIFIED' for x in output['results']),
                       'failed':len(output['errors'])}
    print(json.dumps(output,ensure_ascii=False))
    return 0 if not output['errors'] else 2

if __name__=='__main__':
    try:sys.exit(main())
    except Exception as exc:
        print('FULL_COVERAGE_FAILED',type(exc).__name__,str(exc)[:380],file=sys.stderr)
        sys.exit(2)
