import assert from 'node:assert/strict';
import fs from 'node:fs';
import {deriveMatchList2, type SoftwareMatch2} from '../client/src/lib/match-list-v2-auto';
const source=fs.readFileSync('/opt/capitale-software-verified-sync-v23-20261122/admin-software-v23-verified-parity-20261122.js','utf8');
const extract=(a:string,b:string)=>{const start=source.indexOf(a),end=source.indexOf(b,start);assert.ok(start>0 && end>start,a);return source.slice(start,end)};
const functions=[
 extract('function capitaleVerifiedScore(', 'async function me()'),
 extract('function V(s){','function U(s)'),
 extract('function P(row){','function H(s,a)'),
 extract('function capitaleV2Movement(', 'function be()'),
];
const renderer=new Function(functions.join('\n')+'\nreturn {capitaleVerifiedScore,V,P,capitaleV2Movement}')() as {
 capitaleVerifiedScore:(x:unknown)=>string,V:(x:unknown)=>string,P:(r:SoftwareMatch2)=>{label:string,tone:string},capitaleV2Movement:(r:SoftwareMatch2)=>string
};
const fixture={id:12,date:'2026-11-22',homeTeam:'Paris St-G',awayTeam:'Lille',kickoffAt:'21:30'};
const base:SoftwareMatch2={id:'uuid-authentic-12',date:'2026-11-22',homeTeam:'Paris St-G',awayTeam:'Lille',kickoffAt:'2026-11-22T18:30:00Z',market:'1X2',selection:'home',signalCode:'CRL-6',checkpointUsed:'T-6',analystScore:82,newsScore:75,volumeShare:78.6,drawShare:12.4,referenceOdds:2,currentOdds:1.92,referenceOddsAt:'2026-11-22T12:00:00Z',currentOddsAt:'2026-11-22T16:00:00Z',reportStatus:'complete',source:'verified'};
const testCases: [string,Partial<SoftwareMatch2>][]=[
 ['complete',{}],
 ['all-missing',{analystScore:null,newsScore:null,volumeShare:null,drawShare:null,referenceOdds:null,currentOdds:null}],
 ['analyst-missing',{analystScore:null,newsScore:91}],
 ['news-missing',{newsScore:null,analystScore:63}],
 ['zero-scores',{analystScore:0,newsScore:0,volumeShare:0,drawShare:0}],
 ['hundred',{analystScore:100,newsScore:100,volumeShare:100,drawShare:100}],
 ['missing-odds-timestamps',{referenceOddsAt:null,currentOddsAt:null}],
 ['reversed-odds-timestamps',{referenceOddsAt:'2026-11-22T16:00:00Z',currentOddsAt:'2026-11-22T12:00:00Z'}],
 ['market-missing',{market:null}],
 ['selection-missing',{selection:null}],
 ['changed-odds',{referenceOdds:1.65,currentOdds:1.83}],
 ['bad-odds',{referenceOdds:1.00,currentOdds:1.92}],
 ['precision',{analystScore:71.25,newsScore:88.34,volumeShare:79.66,drawShare:5.55}]
];
for(const [label,patch] of testCases){const row={...base,...patch};const m=deriveMatchList2([fixture],[row],true,{})[fixture.id];assert.equal(m.status,'matched',label);
 assert.equal(renderer.capitaleVerifiedScore(row.analystScore),m.analyst||'—',label+' A');
 assert.equal(renderer.capitaleVerifiedScore(row.newsScore),m.news||'—',label+' N');
 assert.equal(renderer.V(row.volumeShare),m.volume||'—',label+' V');
 assert.equal(renderer.V(row.drawShare),m.draw||'—',label+' B');
 assert.equal(renderer.capitaleV2Movement(row),m.movement||'—',label+' O');
 assert.equal(m.signal,row.signalCode||'',label+' SXF');
}
assert.ok(!source.includes('capitaleDisplayScore('),'fake analyst/news generator must be completely absent');
assert.ok(!source.includes('Math.random'),'random numeric source forbidden');
assert.ok(source.includes('refetchInterval:9e4'),'Software refresh not aligned');
assert.ok(source.includes('cache:"no-store"'),'Software API fetch is not cache-bypassed');
console.log('PASS: 13 matching-source A/V/N/B/O parity scenarios, nil scores stay —; no fake fallback; same Software API, refresh 90s');