'use strict';
const localTabGroups='.tabs,.atlas-mode-tabs,.atlas-view-switch';
const localTabKinds=['detailtab','shipfilter','deadlinefilter','docfilter','channel','atlas-mode','atlas-view'];
let localTabChange=null,localTabObserver;
function slideWorkspace(element,from=20,to=0,duration=180){
  if(!element)return Promise.resolve();
  workspaceAnimations.get(element)?.cancel();
  if(reduceWorkspaceMotion()||document.hidden||!element.animate)return Promise.resolve();
  const animation=element.animate([{transform:`translateX(${from}px)`},{transform:`translateX(${to}px)`}],{duration,easing:'cubic-bezier(.2,.7,.2,1)'});
  workspaceAnimations.set(element,animation);
  return animation.finished.catch(()=>{}).then(()=>{if(workspaceAnimations.get(element)===animation)workspaceAnimations.delete(element)});
}
function localTabGeometry(group,button){
  const rect=button.getBoundingClientRect(),base=group.getBoundingClientRect();
  return{x:rect.left-base.left+group.scrollLeft-group.clientLeft,width:rect.width};
}
function positionLocalIndicator(group){
  const active=group.querySelector('button.active'),indicator=group.querySelector('.local-tab-indicator');
  if(!active||!indicator)return;
  const {x,width}=localTabGeometry(group,active);
  indicator.style.width=`${width}px`;indicator.style.transform=`translateX(${x}px)`;
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button'),group=button?.closest(localTabGroups);
  if(!group||button.disabled)return;
  const kind=localTabKinds.find(key=>button.hasAttribute(`data-${key}`));
  if(!kind)return;
  const active=group.querySelector('button.active');
  if(!active||active===button){localTabChange=null;return;}
  const indicator=group.querySelector('.local-tab-indicator'),from=localTabGeometry(group,indicator||active);
  const buttons=[...group.querySelectorAll('button')];
  localTabChange={kind,from,direction:Math.sign(buttons.indexOf(button)-buttons.indexOf(active))||1,value:button.getAttribute(`data-${kind}`),restoreFocus:button===document.activeElement||button.matches(':focus-visible')};
},true);
function syncLocalNavigation(){
  const change=localTabChange;localTabChange=null;
  if(!localTabObserver&&typeof ResizeObserver!=='undefined')localTabObserver=new ResizeObserver(entries=>entries.forEach(entry=>positionLocalIndicator(entry.target)));
  localTabObserver?.disconnect();
  document.querySelectorAll(localTabGroups).forEach(group=>{
    if(!group.querySelector('button.active'))return;
    group.classList.add('local-sliding-tabs');
    let indicator=group.querySelector('.local-tab-indicator');
    if(!indicator){indicator=document.createElement('span');indicator.className='local-tab-indicator';indicator.setAttribute('aria-hidden','true');group.append(indicator);}
    positionLocalIndicator(group);localTabObserver?.observe(group);
    group.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('active'))));
    if(!change||!group.querySelector(`button[data-${change.kind}]`))return;
    const active=group.querySelector('button.active');
    if(active.getAttribute(`data-${change.kind}`)!==change.value)return;
    if(change.restoreFocus)active.focus({preventScroll:true});
    const target=localTabGeometry(group,active);
    if(!reduceWorkspaceMotion()&&indicator.animate){
      indicator.animate([{transform:`translateX(${change.from.x}px)`,width:`${change.from.width}px`},{transform:`translateX(${target.x}px)`,width:`${target.width}px`}],{duration:180,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
    let surface;
    switch(change.kind){
      case'detailtab':surface=document.querySelector('#overlay .drawer-content');break;
      case'shipfilter':surface=group.closest('.panel,.bento-card')?.querySelector('.tablewrap');break;
      case'deadlinefilter':surface=document.querySelector('.deadline-list');break;
      case'docfilter':surface=group.closest('.panel')?.querySelector('.tablewrap');break;
      case'channel':surface=document.querySelector('.comm-layout');break;
      case'atlas-mode':surface=document.querySelector('.atlas-route-list');break;
      case'atlas-view':surface=document.querySelector('.shipment-atlas')||document.querySelector('.content>.panel');break;
    }
    slideWorkspace(surface,change.direction*20,0,180);
  });
}
// Drawer headers and tab buttons stay mounted and focused while only the panel changes.
function updateShipmentDrawer(overlay,html){
  const existing=overlay.querySelector('.drawer'),current=existing?.querySelector('.drawer-content');
  if(!current)return false;
  const template=document.createElement('template');template.innerHTML=html;
  const next=template.content.querySelector('.drawer'),incoming=next?.querySelector('.drawer-content');
  if(!incoming||incoming.dataset.shipmentId!==current.dataset.shipmentId)return false;
  morphWorkspace(existing.querySelector('.drawer-head'),next.querySelector('.drawer-head'));
  const oldTab=current.dataset.detailTab;
  morphWorkspace(existing.querySelector('.tabs'),next.querySelector('.tabs'));
  current.dataset.detailTab=incoming.dataset.detailTab;current.replaceChildren(...incoming.childNodes);
  overlay.inert=false;document.body.style.overflow='hidden';
  // Programmatic updates without a changed tab should not animate the whole drawer.
  if(oldTab===incoming.dataset.detailTab)localTabChange=null;
  syncLocalNavigation();
  return true;
}
document.addEventListener('scroll',event=>{if(event.target.matches?.(localTabGroups))positionLocalIndicator(event.target)},true);
