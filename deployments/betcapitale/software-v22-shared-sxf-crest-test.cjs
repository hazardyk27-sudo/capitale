'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/capitale-shared-crest-component.js','utf8');
const manifest=JSON.parse(fs.readFileSync('/app/betcapitale/dist/public/team-logos/current-fixture-coverage-auto.json','utf8'));
const roster=JSON.parse(fs.readFileSync('/opt/capitale-crest-library-v1-20261122/sxf-34-leagues-roster.json','utf8'));
assert.equal(Object.keys(manifest.logos).length,629);
assert.equal(roster.distinctTeams.length,575);
let localCalls=0,externalCalls=0;
let current=null;
let pending=[];
const ctx={module:{exports:{}},CAPITALE_TEAM_LOGOS:{'some pre existing':'some-pre-existing'},
  r:{useState:v=>[current??v,value=>{current=value}],useEffect:fn=>{pending.push(fn)}},
  e:{jsx:(element,props)=>({element,props})},
  fetch:async (url,options)=>{
    if(url!=='/team-logos/current-fixture-coverage-auto.json'){externalCalls++;throw Error('Wrong catalog URL '+url)}
    assert.equal(options.cache,'no-store');localCalls++;
    return {ok:true,json:async()=>manifest};
  },
  console,
};
vm.createContext(ctx);
vm.runInContext(source+'\nmodule.exports={capitaleCrest,CapitaleSxfCrestImage,capitaleCrestKey,capitaleLoadLocalCrests}',ctx);
(async()=>{
  const m=ctx.module.exports;
  assert.equal(m.capitaleCrest('Paris St-G').element,m.CapitaleSxfCrestImage);
  let first=m.CapitaleSxfCrestImage({name:'Paris St-G'});assert.ok(first.props.src.startsWith('/team-logos/'));
  const effects=pending.splice(0);effects.forEach(fn=>fn());
  await m.capitaleLoadLocalCrests();await Promise.resolve();
  assert.equal(localCalls,1);
  let verified=0;
  for(const league in roster.leagues){
    for(const name of roster.leagues[league]){
      const icon=m.CapitaleSxfCrestImage({name});
      assert.equal(icon.props.src,manifest.logos[name],`Mismatched logo for ${league}: ${name}`);
      assert.ok(fs.statSync('/app/betcapitale/dist/public'+icon.props.src).size>600);
      assert.ok(!icon.props.src.includes('espncdn.com'));verified++;
    }
  }
  assert.equal(verified,575);
  for(const name of ['Paris St-G','Man Utd','Jong PSV Eindhoven','Anderlecht B','Racing Genk B','PAOK B','Van Buyuksehir Belediyespor']){
    const icon=m.CapitaleSxfCrestImage({name});assert.equal(icon.props.src,manifest.logos[name]);
  }
  assert.equal(m.CapitaleSxfCrestImage({name:'Paris Saint-Germain'}).props.src,manifest.logos['Paris St-G']);
  assert.equal(m.CapitaleSxfCrestImage({name:'Random Unknown Club 987654'}).props.src,'/team-logos/crest-unavailable.svg');
  assert.equal(m.CapitaleSxfCrestImage({name:'some pre-existing'}).props.src,'/team-logos/some-pre-existing.png');
  assert.equal(externalCalls,0);assert.equal(localCalls,1);
  console.log('SHARED_CREST_COMPONENT_PASS',JSON.stringify({covered:verified,leagues:Object.keys(roster.leagues).length,catalog: Object.keys(manifest.logos).length,paris:m.CapitaleSxfCrestImage({name:'Paris St-G'}).props.src,catalogFetch:localCalls,externalFetch:externalCalls}));
})().catch(e=>{console.error(e);process.exitCode=2});