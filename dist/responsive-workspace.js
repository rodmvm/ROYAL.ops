'use strict';
// Layout state is ephemeral: rotating a device never rewrites desktop preferences.
let mobileConversationOpen=false,wasCopilotModal=false,responsiveFocusReturn=null;
const workspaceModalMedia=matchMedia('(max-width: 1439px)');
const workspacePhoneMedia=matchMedia('(max-width: 767px)');
if(workspaceModalMedia.matches)workspacePrefs.copilot=false;
function shortNavigationLabel(key){return({overview:tr('Home','Inicio'),shipments:tr('Shipments','Embarques'),deadlines:tr('Deadlines','Plazos'),documents:tr('Docs','Docs'),communications:tr('Inbox','Mensajes')})[key]||key}
function syncResponsiveWorkspace(){
 const shell=document.querySelector('.studio.shell');if(!shell)return;
 const modal=workspaceModalMedia.matches&&workspacePrefs.copilot;
 const panel=shell.querySelector('.copilot-panel');
 const workflowOpen=!!document.querySelector('#overlay [role=dialog]');
 if(panel)panel.inert=workflowOpen;
 shell.dataset.layout=workspacePhoneMedia.matches?'phone':innerWidth<1200?'tablet':'desktop';
 shell.querySelector('.main').inert=modal||workflowOpen;
 shell.querySelector('.sidebar').inert=modal||workflowOpen;
 if(panel){if(modal){panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.tabIndex=-1}else{panel.removeAttribute('role');panel.removeAttribute('aria-modal');panel.removeAttribute('tabindex')}}
 if(modal&&!wasCopilotModal){responsiveFocusReturn=document.activeElement;panel.querySelector('[aria-label]')?.focus({preventScroll:true})}
 if(!modal&&wasCopilotModal&&responsiveFocusReturn?.isConnected&&!workflowOpen)responsiveFocusReturn.focus({preventScroll:true});
 document.body.classList.toggle('copilot-modal-open',modal);
 document.body.style.overflow=modal||workflowOpen?'hidden':'';
 wasCopilotModal=modal;
}
function enhanceResponsiveContent(){
 document.querySelectorAll('.content .tablewrap').forEach(wrap=>{
  wrap.classList.add('responsive-table');
  const headings=[...wrap.querySelectorAll('thead th')].map(h=>h.textContent.trim());
  wrap.querySelectorAll('tbody tr').forEach(row=>[...row.children].forEach((cell,i)=>{if(cell.tagName==='TD'&&!cell.hasAttribute('colspan'))cell.dataset.label=headings[i]||''}));
 });
 const hub=document.querySelector('.communication-hub');if(hub)hub.dataset.mobileThread=mobileConversationOpen?'open':'list';
 syncResponsiveWorkspace();
}
function mobileMoreMenu(){
 openOverlay(`<div class="modalhead"><h2 id="workspace-more-title">${tr('More from your workspace','Más de tu espacio')}</h2></div><div class="modalbody"><p class="responsive-hint">${tr('Your documents, automation rules and workspace preferences.','Tus documentos, reglas de automatización y preferencias de trabajo.')}</p><div class="more-grid">${[['documents','file'],['automations','bolt'],['settings','settings']].map(([key,ic])=>`<button data-nav="${key}"><span class="more-icon">${icon(ic)}</span><span>${tr(...names[key])}</span></button>`).join('')}<button data-responsive="assistant"><span class="more-icon">${icon('spark')}</span><span>Royal Copilot</span></button></div></div><div class="modalfoot">${btn(tr('Done','Listo'),'data-close','primary','check')}</div>`,true);
 const dialog=document.querySelector('#overlay .modal');if(dialog){dialog.classList.add('workspace-more-dialog');dialog.setAttribute('aria-labelledby','workspace-more-title');dialog.removeAttribute('aria-label')}
}
document.addEventListener('click',e=>{
 const target=e.target.closest('button,[data-thread]');if(!target)return;
 if(target.dataset.thread&&workspacePhoneMedia.matches)mobileConversationOpen=true;
 if(target.dataset.nav)mobileConversationOpen=false;
 if(target.dataset.responsive==='more'){e.preventDefault();mobileMoreMenu()}
 if(target.dataset.responsive==='threads'){mobileConversationOpen=false;render();document.querySelector('.thread.active')?.focus()}
 if(target.dataset.responsive==='assistant'){closeOverlay().then(()=>setCopilotOpen(true))}
},true);
document.addEventListener('keydown',e=>{
 if(!wasCopilotModal||document.querySelector('#overlay [role=dialog]'))return;
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();setCopilotOpen(false);return}
 if(e.key!=='Tab')return;
 const controls=[...document.querySelectorAll('.copilot-panel button:not(:disabled),.copilot-panel textarea,.copilot-panel a')].filter(e=>e.getClientRects().length);
 const first=controls[0],last=controls.at(-1);
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
});
workspaceModalMedia.addEventListener('change',()=>{if(workspaceModalMedia.matches&&workspacePrefs.copilot){workspacePrefs.copilot=false;syncCopilot()}syncResponsiveWorkspace()});
workspacePhoneMedia.addEventListener('change',()=>{mobileConversationOpen=false;enhanceResponsiveContent()});
// visualViewport follows the on-screen keyboard without resizing/recreating the globe.
let viewportFrame=0;
function updateDeviceViewport(){cancelAnimationFrame(viewportFrame);viewportFrame=requestAnimationFrame(()=>{const vv=window.visualViewport;document.documentElement.style.setProperty('--viewport-height',`${vv?.height||innerHeight}px`);document.documentElement.style.setProperty('--viewport-top',`${vv?.offsetTop||0}px`)})}
window.visualViewport?.addEventListener('resize',updateDeviceViewport);
window.visualViewport?.addEventListener('scroll',updateDeviceViewport);
window.addEventListener('resize',()=>{updateDeviceViewport();syncResponsiveWorkspace()});
updateDeviceViewport();
