/* Add one public Software link to the existing CAPITALE site menu.
   This intentionally does not replace or re-import any production React bundle. */
(function(){
  'use strict';
  var path='/software/';
  var flag='data-capitale-public-software-link';
  var scheduling=false;

  function setActive(anchor){
    if(!anchor)return;
    var active=window.location.pathname.replace(/\/+$/,'')==='/software';
    var hovered=anchor.matches(':hover');
    anchor.setAttribute('aria-current',active?'page':'false');
    anchor.style.color=active?'#E8771F':hovered?'#F5F5F5':'#9CA3AF';
    anchor.style.background=hovered&&!active?'rgba(255,255,255,0.06)':'transparent';
    anchor.style.fontWeight=active?'600':'500';
    anchor.style.position='relative';
    var line=anchor.querySelector('[data-capitale-active-line]');
    if(active&&!line){
      line=document.createElement('span');
      line.setAttribute('data-capitale-active-line','');
      line.style.cssText='position:absolute;bottom:-1px;left:50%;transform:translateX(-50%);width:16px;height:2px;background:#E8771F;border-radius:2px;pointer-events:none;';
      anchor.appendChild(line);
    }else if(!active&&line){
      line.remove();
    }
  }

  function ensureHover(anchor){
    if(anchor.hasAttribute('data-capitale-software-hover-ready'))return;
    anchor.setAttribute('data-capitale-software-hover-ready','true');
    // Same non-selected hover appearance as the original SiteHeader:
    // #F5F5F5 label + rgba(255,255,255,.06) gray rounded pill.
    // Selected Software remains orange with its existing underline.
    anchor.addEventListener('mouseenter',function(){setActive(anchor);});
    anchor.addEventListener('mouseleave',function(){setActive(anchor);});
  }

  function linkAfterFreeBet(){
    var anchors=Array.from(document.querySelectorAll('a[href="/free-bet"]'));
    for(var i=0;i<anchors.length;i++){
      var previous=anchors[i],container=previous.parentElement;
      if(!container)continue;
      var siblings=Array.from(container.children).filter(function(c){return c.tagName==='A';});
      // Accept only the actual desktop/mobile navigation group.
      if(!siblings.some(function(a){return a.getAttribute('href')==='/today';})||
         !siblings.some(function(a){return a.getAttribute('href')==='/history';}))continue;
      if(siblings.some(function(a){return a.hasAttribute(flag);})) {
        var existing=siblings.find(function(a){return a.hasAttribute(flag);});
        ensureHover(existing);
        setActive(existing);
        continue;
      }
      var anchor=document.createElement('a');
      anchor.href=path;
      anchor.textContent='Software';
      anchor.setAttribute(flag,'true');
      anchor.style.cssText=previous.style.cssText;
      anchor.style.cursor='pointer';
      anchor.setAttribute('aria-label','Software match list');
      previous.insertAdjacentElement('afterend',anchor);
      ensureHover(anchor);
      setActive(anchor);
    }
  }

  function schedule(){
    if(scheduling)return;
    scheduling=true;
    queueMicrotask(function(){scheduling=false;linkAfterFreeBet();});
  }

  function start(){
    var root=document.getElementById('root');
    if(!root)return;
    var watcher=new MutationObserver(schedule);
    watcher.observe(root,{childList:true,subtree:true});
    linkAfterFreeBet();
    window.addEventListener('popstate',schedule);
  }

  document.addEventListener('click',function(event){
    var t=event.target;
    var a=t&&typeof t.closest==='function'?t.closest('a['+flag+']'):null;
    if(!a||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(path);
  },true);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
