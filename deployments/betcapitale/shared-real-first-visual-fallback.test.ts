import assert from 'node:assert/strict';
import fs from 'node:fs';
import {capitaleSampleVisual,CAPITALE_SAMPLE_SIGNALS} from '../client/src/lib/capitale-visual-fallback';
import {capitaleVisualOverlay} from '../client/src/lib/capitale-visual-overlay';
import {deriveMatchList2} from '../client/src/lib/match-list-v2-auto';
const runtime=fs.readFileSync('/opt/capitale-shared-real-first-fallback-v24-20261122/shared-sample-engine-runtime.js','utf8');
const compiled=new Function(runtime+';return {capitaleSampleVisual,CAPITALE_SAMPLE_SIGNALS}')() as {capitaleSampleVisual:typeof capitaleSampleVisual,CAPITALE_SAMPLE_SIGNALS:typeof CAPITALE_SAMPLE_SIGNALS};
assert.deepEqual([...CAPITALE_SAMPLE_SIGNALS],[...compiled.CAPITALE_SAMPLE_SIGNALS]);
const roster=JSON.parse(fs.readFileSync('/opt/capitale-crest-library-v1-20261122/sxf-34-leagues-roster.json','utf8'));
let tested=0;
for(const league of Object.values(roster.leagues) as string[][]){
 for(const name of league){
  const f={date:'2026-11-22',homeTeam:name,awayTeam:'Paris St-G'};
  assert.deepEqual(capitaleSampleVisual(f),compiled.capitaleSampleVisual(f),name);
  assert.deepEqual(capitaleSampleVisual(f),capitaleSampleVisual({...f}),name+' stable');
  assert.ok(CAPITALE_SAMPLE_SIGNALS.includes(capitaleSampleVisual(f).signal as typeof CAPITALE_SAMPLE_SIGNALS[number]));
  tested++;
 }
}
assert.equal(tested,575);
const fixture={id:7,date:'2026-11-22',homeTeam:'Paris St-G',awayTeam:'Lille',kickoffAt:'21:30'};
const verified=deriveMatchList2([fixture],[{id:'run7',date:fixture.date,homeTeam:'Paris St-G',awayTeam:'Lille',market:'1X2',selection:'home',signalCode:'CRL-6',checkpointUsed:'T-6',analystScore:82,volumeShare:78.6,newsScore:75,drawShare:12.4,currentOdds:1.92,referenceOdds:2,referenceOddsAt:'2026-11-22T12:00:00Z',currentOddsAt:'2026-11-22T16:00:00Z'}],true,{} )[7];
const genuine=capitaleVisualOverlay(fixture,verified);
assert.equal(genuine.isIllustrative,false);
assert.deepEqual([genuine.signal,genuine.analyst,genuine.volume,genuine.news,genuine.draw,genuine.movement],['CRL-6','82','78.6%','75','12.4%','-4.0%']);
const partial=capitaleVisualOverlay(fixture,{...verified,analyst:'',news:'',draw:'',movement:''});
assert.equal(partial.signal,'CRL-6');assert.equal(partial.volume,'78.6%');assert.ok(partial.isIllustrative);assert.deepEqual(partial.sampleFields,['analyst','news','draw','movement']);
const unavailable=deriveMatchList2([fixture],[],true,{})[7];const filled=capitaleVisualOverlay(fixture,unavailable);const random=capitaleSampleVisual(fixture);
assert.equal(filled.signal,random.signal);assert.equal(filled.analyst,random.analyst);assert.equal(filled.news,random.news);assert.equal(filled.volume,random.volume);assert.equal(filled.draw,random.draw);assert.equal(filled.movement,random.movement);assert.ok(filled.isIllustrative);
const codeWithoutSignal=capitaleVisualOverlay(fixture,{...verified,signal:''});assert.equal(codeWithoutSignal.signal,random.signal);assert.equal(codeWithoutSignal.volume,'78.6%');assert.ok(codeWithoutSignal.sampleFields?.includes('signal'));
assert.equal(filled.homeLogoUrl,null);
assert.ok(!runtime.includes('fetch(') && !runtime.includes('POST') && !runtime.includes('Supabase'));
console.log('PASS: 575 exact shared visual engines + 3 full/partial/missing source cases + stable samples + source preserved + zero DB network writes');