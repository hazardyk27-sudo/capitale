'use strict';

export function mountSoftware(){
  const PER_PAGE = 20;
  const SAFE_CREST = '/team-logos/crest-unavailable.svg';
  const CATALOG = '/team-logos/current-fixture-coverage-auto.json';
  const DATA = '/software/matches.json';

  const state = {
    items: [], page: 0, expanded: null, status: 'loading', stageTimers: [],
    search: '', signal: '', date: '', crestCatalog: Object.create(null),
    legacyCatalog: Object.create(null), earlyPreviews: [], fetchedAt: null
  };
  let active=true;
  const el = id => document.getElementById(id);

  const isNumeric = v => typeof v === 'number' && Number.isFinite(v);
  const fmt = v => isNumeric(v) && v >= 0 && v <= 100
    ? String(Number(v.toFixed(1))) + '%' : '—';
  const movement = v => isNumeric(v)
    ? (v > 0 ? '+' : '') + v.toFixed(1) + '%' : '—';

  const time = utc => {
    const d = new Date(utc);
    return Number.isFinite(d.getTime()) ? new Intl.DateTimeFormat('en-GB', {
      timeZone:'Etc/GMT-1', hour:'2-digit', minute:'2-digit', hourCycle:'h23'
    }).format(d) : '—';
  };
  const norm = name => String(name || '').normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim()
    .replace(/\s+/g, ' ');
  const aliases = {
    'leeds united': 'leeds',
    'sheffield wednesday':'sheff wed',
    'paris saint germain':'paris st g',
    'paris sg':'paris st g',
    'magdeburg':'fc magdeburg'
  };
  const keyOf = name => aliases[norm(name)] || norm(name);
  const safePath = value => typeof value === 'string' &&
    /^\/team-logos\/[a-z0-9-]+\.(?:png|svg)$/.test(value);

  function node(tag, cls, content) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (content !== undefined && content !== null) n.textContent = String(content);
    return n;
  }
  function append(parent, ...children) {for (const child of children) parent.appendChild(child); return parent;}

  function crest(name) {
    const original = keyOf(name);
    const logo = state.crestCatalog[original];
    const slug = state.legacyCatalog[original];
    const src = safePath(logo) ? logo : slug && /^[a-z0-9-]+$/.test(slug)
      ? '/team-logos/' + slug + '.png' : SAFE_CREST;
    const box = node('span', 'capitale-v2-crest');
    const img = node('img');
    img.alt = String(name) + ' crest';
    img.src = src;
    img.width = 43;
    img.height = 43;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => { if (!img.src.endsWith(SAFE_CREST)) img.src = SAFE_CREST; });
    box.appendChild(img);
    return box;
  }

  function metric(name, value, percent) {
    const wrapper = node('div', 'capitale-v2-metric');
    wrapper.dataset.metric = name;
    const label = node('span', 'capitale-v2-metric-label', name);
    const figure = node('strong', 'capitale-v2-metric-value', value);
    const track = node('span', 'capitale-v2-metric-bar');
    const fill = node('span', 'capitale-v2-metric-fill');
    fill.style.width = Number.isFinite(percent)
      ? Math.max(0,Math.min(100,percent))+'%' : '0%';
    track.appendChild(fill);
    append(wrapper,label,figure,track);
    return wrapper;
  }

  const stages = [
    {role:'sxf',index:'01',title:'Market analysis',active:'Analyzing market signals...',description:'Reviewing SXF signals and verified market indicators.',empty:'No verified full SXF report has been saved yet.'},
    {role:'news',index:'02',title:'News analysis',active:'Analyzing news reports...',description:'Reviewing recorded news findings and independent team context.',empty:'No verified NEWS report has been saved yet.'},
    {role:'analyst',index:'03',title:'Statistical analysis',active:'Analyzing statistical data...',description:'Reviewing recorded statistical findings and team performance.',empty:'No verified ANALYST report has been saved yet.'}
  ];
  const emblemPaths = [["M1761,695 L1024,222 L286,701 L570,698 L1025,402 L1483,698 Z", ""], ["M1785,745 L260,753 L458,903 L1585,903 Z", ""], ["M557,959 L550,966 L549,1401 L546,1411 L505,1444 L505,1449 L776,1651 L778,1639 L742,1581 L721,1535 L721,964 L712,959 Z", "tower"], ["M941,959 L933,964 L932,1581 L912,1615 L866,1646 L1022,1814 L1175,1644 L1139,1621 L1119,1600 L1115,1585 L1116,964 Z", "tower"], ["M1492,960 L1352,959 L1327,964 L1324,1526 L1304,1580 L1266,1637 L1269,1646 L1334,1602 L1539,1445 L1512,1426 L1497,1399 L1497,964 Z", "tower"]];

  function adminEmblem(){
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('class','capitale-stage-emblem');
    svg.setAttribute('viewBox','220 185 1610 1660');
    svg.setAttribute('aria-hidden','true');
    const g=document.createElementNS(ns,'g');
    g.setAttribute('fill','#FF7800');
    emblemPaths.forEach(([d,cls])=>{
      const path=document.createElementNS(ns,'path');
      path.setAttribute('d',d);
      if(cls)path.setAttribute('class',cls);
      g.appendChild(path);
    });
    svg.appendChild(g);
    return svg;
  }

  const ADMIN_ONLY_NOTICE='Software analysis data is accessible to administrators only.';

  function stageBullets(row,stage) {
    // Public animation is visual-only. Keep all three department reports behind
    // the existing authenticated admin endpoint, never expose findings here.
    return [ADMIN_ONLY_NOTICE];
  }

  function detailCard(row) {
    const section=node('section','capitale-stage');
    section.id='capitale-inline-analysis-'+row.key;
    section.setAttribute('aria-label','Behind the signal analysis presentation');

    const top=node('div','capitale-stage-top');
    const headings=node('div');
    append(headings,
      node('h3','capitale-stage-title','Behind the signal.'),
      node('p','capitale-stage-sub','Independent department reports · presentation only, not a live AI scan')
    );
    append(top,headings,node('span','capitale-stage-tag','REPORT PRESENTATION'));
    section.appendChild(top);

    const sequence=node('div','capitale-stage-sequence');
    section.appendChild(sequence);

    const foot=node('div','capitale-stage-foot');
    const paragraph=node('p',null,'Detailed Market, News and Statistical reports are restricted to administrators.');
    foot.appendChild(paragraph);
    section.appendChild(foot);

    function renderPhase(phase){
      if(!section.isConnected||!active)return;
      sequence.replaceChildren();
      stages.forEach((stage,j)=>{
        if(j<phase){
          const done=node('div','capitale-stage-card capitale-stage-done');
          const head=node('div','capitale-stage-head');
          const title=node('div');
          append(title,node('span','capitale-stage-number',stage.index),node('strong',null,stage.title));
          append(head,title,node('span','capitale-stage-status','✓ COMPLETE'));
          const ul=node('ul','capitale-stage-points');
          for(const item of stageBullets(row,stage)) ul.appendChild(node('li',null,item));
          append(done,head,ul);
          sequence.appendChild(done);
        }else if(j===phase){
          const activeCard=node('div','capitale-stage-active');
          activeCard.setAttribute('role','status');
          activeCard.setAttribute('aria-live','polite');
          const symbol=node('div','capitale-stage-symbol');
          symbol.appendChild(adminEmblem());
          const copy=node('div','capitale-stage-copy');
          const dots=node('div','capitale-stage-dots');
          dots.setAttribute('aria-hidden','true');
          for(let i=0;i<5;i++) dots.appendChild(node('i'));
          append(copy,
            node('div','capitale-stage-kicker','CAPITALE ANALYSIS ENGINE · '+stage.index+'/03'),
            node('h3',null,stage.active),
            node('p',null,stage.description),
            dots
          );
          const progress=node('div','capitale-stage-progress');
          progress.style.setProperty('--duration',[2,3,4][j]+'s');
          append(activeCard,symbol,copy,progress);
          sequence.appendChild(activeCard);
        }
      });
      if(phase===3){
        const final=node('div','capitale-stage-final');
        const desc=node('div');
        append(desc,
          node('b',null,'PRESENTATION COMPLETE'),
          node('p',null,'All three stages have been presented. Detailed reports are accessible to administrators only.')
        );
        append(final,desc,node('em',null,'THREE STAGES'));
        sequence.appendChild(final);
      }
    }
    // Mirrors admin Software: 01 at 0–2s, 02 at 2–5s,
    // 03 at 5–9s, and presentation complete at 9s.
    queueMicrotask(()=>renderPhase(0));
    const prefersReduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if(prefersReduced) queueMicrotask(()=>renderPhase(3));
    else for(const [ms,phase] of [[2000,1],[5000,2],[9000,3]]){
      const timer=window.setTimeout(()=>renderPhase(phase),ms);
      state.stageTimers.push(timer);
    }
    return section;
  }

  function matchCard(row,index) {
    const wrapper=node('article','public-match');
    wrapper.dataset.matchKey=row.key;
    const card=node('div','capitale-v2-card');
    card.tabIndex=0;
    card.setAttribute('role','button');
    const expanded=state.expanded===row.key;
    card.setAttribute('aria-expanded',expanded?'true':'false');
    card.setAttribute('aria-label',row.homeTeam+' versus '+row.awayTeam+' — View signal details');
    card.setAttribute('aria-controls','details-'+row.key);
    const number=node('span','capitale-v2-rank',String(index+1).padStart(2,'0'));
    const clubs=node('div','capitale-v2-clubs');
    const logos=node('div','capitale-v2-logos');
    append(logos,crest(row.homeTeam),crest(row.awayTeam));
    const names=node('span','capitale-v2-name',row.homeTeam+' – '+row.awayTeam);
    names.title=row.homeTeam+' – '+row.awayTeam;
    append(clubs,logos,names);
    // Use the SAME public-safe materialized display numbers as admin Software.
    // The feed snapshots the existing verified values or the admin's deterministic
    // visual fallback for missing A/N/V/B/O. These are for presentation only;
    // private department reports and raw research data remain admin-restricted.
    const visual=row.visual&&typeof row.visual==='object'?row.visual:{};
    const asPercent=(key,fallback)=>{
      const val=visual[key];
      if(typeof val!=='string'||!/^\d+(?:\.\d+)?%?$/.test(val))return fallback;
      return val.endsWith('%')?val:val+'%';
    };
    const aValue=asPercent('analyst',fmt(row.analystScore));
    const vValue=asPercent('volume',fmt(row.volumeShare));
    const nValue=asPercent('news',fmt(row.newsScore));
    const bValue=asPercent('draw',fmt(row.drawShare));
    const oValue=typeof visual.movement==='string'&&/^[+-]?\d+(?:\.\d+)?%$/.test(visual.movement)
      ? visual.movement:movement(row.oddsDeltaPct);
    const displayCode=typeof visual.signal==='string'&&/^[A-Z]{2,12}-[68]$/.test(visual.signal)
      ? visual.signal:(row.signalCode||'—');
    const amount=(val)=>{const n=Number.parseFloat(val);return Number.isFinite(n)?n:null;};
    const signal=node('span','capitale-v2-signal',displayCode);
    const family=String(displayCode).split('-')[0];
    signal.dataset.family=['PRM','CRL','MOM','SLD'].includes(family)?family:'SLD';
    if (row.watchOnly)signal.title='Watch-only market signal';
    const consoleBox=node('div','capitale-v2-console');
    consoleBox.dataset.metricConsole='true';
    append(consoleBox,
      metric('A',aValue,amount(aValue)),
      metric('V',vValue,amount(vValue)),
      metric('N',nValue,amount(nValue)),
      metric('B',bValue,amount(bValue)),
      metric('O',oValue,null)
    );
    const kickoff=node('span','capitale-v2-time',time(row.kickoffAt));
    append(card,number,clubs,signal,consoleBox,kickoff);
    card.addEventListener('click',()=>{
      state.expanded=state.expanded===row.key?null:row.key;
      render();
    });
    card.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();card.click();}
    });
    wrapper.appendChild(card);
    if(expanded)wrapper.appendChild(detailCard(row));
    return wrapper;
  }

  function filtered() {
    const search=state.search.toLocaleLowerCase('en-GB');
    return state.items
      .filter(row=>
        (!search||[row.homeTeam,row.awayTeam,row.league||'',row.signalCode].join(' ').toLocaleLowerCase('en-GB').includes(search)) &&
        (!state.signal||row.signalCode===state.signal) &&
        (!state.date||row.date===state.date))
      .sort((a,b)=>{
        const nameA=(a.homeTeam+' – '+a.awayTeam),nameB=(b.homeTeam+' – '+b.awayTeam);
        return nameA.localeCompare(nameB,'en') || (a.kickoffAt||'').localeCompare(b.kickoffAt||'');
      });
  }

  function render() {
    for(const id of state.stageTimers)window.clearTimeout(id);
    state.stageTimers=[];
    const all=filtered();
    const pages=Math.max(1,Math.ceil(all.length/PER_PAGE));
    state.page=Math.max(0,Math.min(state.page,pages-1));
    const start=state.page*PER_PAGE;
    const visible=all.slice(start,start+PER_PAGE);
    const list=el('match-list');
    list.replaceChildren();
    if(state.status==='error' && !state.items.length){
      list.appendChild(node('div','empty','Verified signal data is temporarily unavailable.'));
    }else if(!all.length){
      list.appendChild(node('div','empty',state.items.length?'No matches for these filters.':'No verified matches published yet.'));
    }else{
      const batch=document.createDocumentFragment();
      visible.forEach((row,i)=>batch.appendChild(matchCard(row,start+i)));
      list.appendChild(batch);
    }
    el('match-count').textContent=all.length+' / '+state.items.length+' matches';
    const pager=el('pager');
    pager.hidden=all.length<=PER_PAGE;
    if(!pager.hidden){
      el('range').textContent='Showing '+(start+1)+'–'+Math.min(start+PER_PAGE,all.length)+' of '+all.length;
      el('current-page').textContent=(state.page+1)+' / '+pages;
      el('previous').disabled=state.page===0;
      el('next').disabled=state.page>=pages-1;
    }
  }

  function statusLabel() {
    const status=el('feed-status');
    const age=state.fetchedAt?Math.max(0,Date.now()-state.fetchedAt.getTime()):Infinity;
    const stale=age>15*60*1000;
    status.classList.toggle('stale',stale||state.status==='error');
    if(state.status==='error'){
      status.textContent=state.items.length?'Feed temporarily delayed':'Feed unavailable';
    }else if(state.status==='loading'){
      status.textContent='Loading match data...';
    }else if(stale){
      status.textContent='Feed update delayed';
    }else{
      status.textContent='Automatically updated · '+new Intl.DateTimeFormat('en-GB',{
        timeZone:'Etc/GMT-1',hour:'2-digit',minute:'2-digit'
      }).format(new Date((state.fetchedAt||new Date()).getTime()));
    }
  }

  async function loadData() {
    try{
      const response=await fetch(DATA,{cache:'no-store',credentials:'omit'});
      if(!response.ok)throw new Error('Public feed HTTP '+response.status);
      const result=await response.json();
      if(!active)return;
      if(result.status!=='connected'||!Array.isArray(result.items)||typeof result.count!=='number'||result.items.length!==result.count)throw Error('Invalid public feed');
      const keys=new Set();
      const safe=result.items.filter(row=>{
        if(!row||typeof row.key!=='string'||!/^[a-f0-9]{20}$/.test(row.key)||
          typeof row.homeTeam!=='string'||typeof row.awayTeam!=='string'||typeof row.signalCode!=='string'||keys.has(row.key))return false;
        keys.add(row.key);return true;
      });
      state.items=safe;
      state.earlyPreviews=Array.isArray(result.earlyPreviews)?result.earlyPreviews.filter(r=>
        r&&r.phase==='EARLY_SIGNAL'&&r.status==='PRELIMINARY_NOT_FINAL'&&
        typeof r.key==='string'&&/^[a-f0-9]{20}$/.test(r.key)&&
        typeof r.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&
        typeof r.homeTeam==='string'&&typeof r.awayTeam==='string'&&
        typeof r.kickoffAt==='string'&&/^T-(24|40|60|72)$/.test(r.checkpoint)): [];
      state.fetchedAt=new Date(result.generatedAt);
      state.status='ready';
      if(state.expanded&&!safe.some(r=>r.key===state.expanded))state.expanded=null;
      const selector=el('signal'),old=selector.value;
      const codes=[...new Set(safe.map(x=>x.signalCode).filter(Boolean))].sort();
      selector.replaceChildren(new Option('All signals',''));
      for(const c of codes)selector.add(new Option(c,c));
      selector.value=codes.includes(old)?old:'';
      state.signal=selector.value;
    }catch(error){
      console.error('Public Software feed error:',error?.message||error);
      state.status='error';
    }
    if(!active)return;
    statusLabel();render();
  }

  async function loadLogos() {
    const [catalog,legacy]=await Promise.allSettled([
      fetch(CATALOG,{cache:'no-store'}).then(r=>r.ok?r.json():null),
      fetch('/software/legacy-logos.json',{cache:'no-store'}).then(r=>r.ok?r.json():null)
    ]);
    if(!active)return;
    if(catalog.status==='fulfilled'&&catalog.value?.schema==='capitale-fixture-crest-coverage-v1'){
      const normalized=Object.create(null),collision=new Set();
      for(const [name,url] of Object.entries(catalog.value.logos||{})){
        if(!safePath(url))continue;
        const key=keyOf(name);
        if(normalized[key]&&normalized[key]!==url)collision.add(key);
        else normalized[key]=url;
      }
      for(const k of collision)delete normalized[k];
      state.crestCatalog=normalized;
    }
    if(legacy.status==='fulfilled'&&legacy.value?.logos){
      state.legacyCatalog=legacy.value.logos;
    }
    render();
  }

  function changeFilter(){
    state.page=0;state.expanded=null;
    state.search=el('search').value.trim();
    state.signal=el('signal').value;
    state.date=el('date').value;
    render();
  }

  el('search').addEventListener('input',changeFilter);
  el('signal').addEventListener('change',changeFilter);
  el('date').addEventListener('change',changeFilter);
  el('refresh').addEventListener('click',loadData);
  el('previous').addEventListener('click',()=>{state.page--;state.expanded=null;render();el('match-list').scrollIntoView({block:'start'});});
  el('next').addEventListener('click',()=>{state.page++;state.expanded=null;render();el('match-list').scrollIntoView({block:'start'});});
  render();
  loadData();
  loadLogos();
  const reloadInterval=window.setInterval(loadData,60_000);
  const statusInterval=window.setInterval(statusLabel,30_000);
  return function cleanupSoftware(){
    active=false;
    for(const id of state.stageTimers)window.clearTimeout(id);
    state.stageTimers=[];
    window.clearInterval(reloadInterval);
    window.clearInterval(statusInterval);
  };
}
