/* CAPITALE / Software V22 -- local-only SXF crest resolver.
 * Match List v2 also reads this same-origin catalog. No ESPN runtime images.
 * React owns each asynchronous crest update, preventing stale list renders.
 */
const CAPITALE_LOCAL_CREST_CATALOG='/team-logos/current-fixture-coverage-auto.json';
const CAPITALE_MISSING_CREST='/team-logos/crest-unavailable.svg';
const CAPITALE_CREST_ALIASES={'leeds united':'leeds','sheffield wednesday':'sheff wed','paris saint germain':'paris st g','paris sg':'paris st g','magdeburg':'fc magdeburg'};
let capitaleLocalCrests=null;
let capitaleLocalCrestsPromise=null;
function capitaleCrestKey(name){
 const value=String(name||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
 return CAPITALE_CREST_ALIASES[value]||value;
}
function capitaleLoadLocalCrests(){
 if(capitaleLocalCrestsPromise)return capitaleLocalCrestsPromise;
 capitaleLocalCrestsPromise=fetch(CAPITALE_LOCAL_CREST_CATALOG,{cache:'no-store',credentials:'same-origin'}).then(res=>{
  if(!res.ok)throw new Error('CAPITALE local crest catalog HTTP '+res.status);
  return res.json();
 }).then(data=>{
  if(data?.schema!=='capitale-fixture-crest-coverage-v1'||!data.logos||typeof data.logos!=='object'||Array.isArray(data.logos))throw new Error('CAPITALE crest catalog schema');
  const out=Object.create(null),collisions=new Set();
  for(const [rawName,rawUrl] of Object.entries(data.logos)){
   if(typeof rawUrl!=='string'||!/^\/team-logos\/[a-z0-9-]+\.(?:png|svg)$/.test(rawUrl))continue;
   const key=capitaleCrestKey(rawName);if(!key)continue;
   if(out[key]&&out[key]!==rawUrl)collisions.add(key);
   else out[key]=rawUrl;
  }
  for(const key of collisions)delete out[key];
  capitaleLocalCrests=out;
  return out;
 }).catch(()=>{
  // Fail closed: no guessed or externally hosted crest URL.
  const empty=Object.create(null);capitaleLocalCrests=empty;return empty;
 });
 return capitaleLocalCrestsPromise;
}
function CapitaleSxfCrestImage({name}){
 const [catalog,setCatalog]=r.useState(capitaleLocalCrests);
 r.useEffect(()=>{
  let alive=true;
  capitaleLoadLocalCrests().then(map=>{if(alive)setCatalog(map)});
  return()=>{alive=false};
 },[]);
 const key=capitaleCrestKey(name);
 const locallyVerified=catalog?.[key];
 // Keep pre-existing local-only club files for teams not in the 34 league catalog.
 const knownSlug=CAPITALE_TEAM_LOGOS[key];
 const legacy=knownSlug?'/team-logos/'+knownSlug+'.png':null;
 const src=locallyVerified||legacy||CAPITALE_MISSING_CREST;
 return e.jsx('img',{
  src,alt:String(name||'')+' crest',loading:'lazy',decoding:'async',
  width:24,height:24,className:'inline-block h-6 w-6 shrink-0 object-contain',
  onError:event=>{
   const img=event.currentTarget;
   if(img.src.endsWith(CAPITALE_MISSING_CREST))return;
   img.src=CAPITALE_MISSING_CREST;
  }
 });
}
function capitaleCrest(name){return e.jsx(CapitaleSxfCrestImage,{name})}