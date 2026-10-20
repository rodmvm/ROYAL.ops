'use strict';
// Persistent chrome and interruptible opacity transitions: the latest navigation wins.
const workspaceAnimations=new WeakMap();
let navigationRevision=0,overlayRevision=0;
const reduceWorkspaceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function fadeWorkspace(element,from,to,duration){
  if(!element)return Promise.resolve();
  workspaceAnimations.get(element)?.cancel();
  element.style.opacity=String(to);
  if(reduceWorkspaceMotion()||document.hidden||!element.animate)return Promise.resolve();
  const animation=element.animate([{opacity:from},{opacity:to}],{duration,easing:'cubic-bezier(.4,0,.2,1)'});
  workspaceAnimations.set(element,animation);
  return animation.finished.catch(()=>{}).then(()=>{if(workspaceAnimations.get(element)===animation)workspaceAnimations.delete(element)});
}
function cancelWorkspaceNavigation(){
  navigationRevision++;
  const content=document.querySelector('.studio .content');
  if(content){workspaceAnimations.get(content)?.cancel();content.style.opacity='1';content.inert=false;content.removeAttribute('aria-busy');delete content.dataset.motionPhase;}
}
async function navigateWorkspace(destination){
  const revision=++navigationRevision,content=document.querySelector('.studio .content');
  const keyboard=document.activeElement?.matches('[data-nav]')&&document.activeElement.matches(':focus-visible');
  if(content){const opacity=getComputedStyle(content).opacity;content.inert=true;content.setAttribute('aria-busy','true');content.dataset.motionPhase='exiting';await fadeWorkspace(content,opacity,0,80);}
  if(revision!==navigationRevision)return false;
  view=destination;render({navigation:true});window.scrollTo({top:0,behavior:'instant'});
  const next=document.querySelector('.studio .content');next.inert=false;next.removeAttribute('aria-busy');next.dataset.motionPhase='entering';
  await fadeWorkspace(next,0,1,160);
  if(revision!==navigationRevision)return false;
  delete next.dataset.motionPhase;
  if(keyboard){const heading=next.querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
  return true;
}
// Update small chrome trees in place, keeping focused controls and input nodes alive.
function morphWorkspace(current,next){
  for(const attribute of [...current.attributes])if(!next.hasAttribute(attribute.name))current.removeAttribute(attribute.name);
  for(const attribute of next.attributes)if(current.getAttribute(attribute.name)!==attribute.value)current.setAttribute(attribute.name,attribute.value);
  let i=0;
  while(i<next.childNodes.length||i<current.childNodes.length){
    const a=current.childNodes[i],b=next.childNodes[i];
    if(!b){a.remove();continue;}
    if(!a){current.append(b.cloneNode(true));i++;continue;}
    if(a.nodeType!==b.nodeType||a.nodeName!==b.nodeName){a.replaceWith(b.cloneNode(true));i++;continue;}
    if(a.nodeType===Node.TEXT_NODE){if(a.nodeValue!==b.nodeValue)a.nodeValue=b.nodeValue;}
    else if(a.nodeType===Node.ELEMENT_NODE)morphWorkspace(a,b);
    i++;
  }
}
// Keep earlier turns mounted. Animate only the new question or completed answer.
function syncAssistantMessages(current,next){
  current.setAttribute('aria-busy',next.getAttribute('aria-busy')||'false');
  const wanted=new Set([...next.children].map(node=>node.dataset.aiKey));
  for(const node of [...current.children])if(!wanted.has(node.dataset.aiKey))node.remove();
  for(const incoming of [...next.children]){
    let existing=[...current.children].find(node=>node.dataset.aiKey===incoming.dataset.aiKey);
    if(!existing){
      existing=incoming.cloneNode(true);current.append(existing);
      fadeWorkspace(existing.querySelector('.ai-user-message')||existing,0,1,260);
    }else if(existing.innerHTML!==incoming.innerHTML){
      const resolved=existing.dataset.aiState==='thinking'&&incoming.dataset.aiState==='ready';
      morphWorkspace(existing,incoming);
      if(resolved)fadeWorkspace(existing.querySelector('.ai-answer-content'),0,1,360);
    }
  }
  const panel=current.closest('.copilot-panel');
  if(panel){
    const busy=next.getAttribute('aria-busy')==='true';
    panel.dataset.assistantState=busy?'thinking':current.querySelector('.ai-turn')?'ready':'idle';
    panel.querySelectorAll('[data-ai-intent],[data-ai-draft-for]').forEach(button=>button.disabled=busy);
  }
}
function updateWorkspaceDOM(replaceContent=true){
  const root=document.querySelector('#app'),shell=root.querySelector('.studio.shell');
  if(!shell){root.innerHTML=workspaceShell();syncCopilot();return;}
  const template=document.createElement('template');template.innerHTML=workspaceShell();const next=template.content.firstElementChild;
  shell.className=next.className;
  morphWorkspace(shell.querySelector('.sidebar'),next.querySelector('.sidebar'));
  morphWorkspace(shell.querySelector('.topbar'),next.querySelector('.topbar'));
  const command=shell.querySelector('#workspace-command');if(command&&document.activeElement!==command)command.value=search;
  if(replaceContent)shell.querySelector('.content').replaceChildren(...next.querySelector('.content').childNodes);
  const panel=shell.querySelector('.copilot-panel'),nextPanel=next.querySelector('.copilot-panel');
  for(const selector of ['.copilot-header','.ai-context-strip','.copilot-composer'])morphWorkspace(panel.querySelector(selector),nextPanel.querySelector(selector));
  const messages=panel.querySelector('.copilot-messages'),nextMessages=nextPanel.querySelector('.copilot-messages');
  syncAssistantMessages(messages,nextMessages);
  syncCopilot();
}
function syncCopilot(){
  const shell=document.querySelector('.studio.shell'),slot=shell?.querySelector('.copilot-slot');if(!slot)return;
  shell.classList.toggle('with-copilot',workspacePrefs.copilot);
  slot.inert=!workspacePrefs.copilot;slot.setAttribute('aria-hidden',String(!workspacePrefs.copilot));
  shell.querySelectorAll('[data-workspace="copilot"]').forEach(button=>{button.setAttribute('aria-controls','royal-copilot-panel');button.setAttribute('aria-expanded',String(workspacePrefs.copilot));});
  shell.querySelector('.nav [data-workspace="copilot"]')?.classList.toggle('copilot-active',workspacePrefs.copilot);
  if(typeof syncResponsiveWorkspace==='function')syncResponsiveWorkspace();
}
function setCopilotOpen(open){
  const slot=document.querySelector('.copilot-slot');
  if(!open&&slot?.contains(document.activeElement))document.querySelector('.nav [data-workspace="copilot"]')?.focus({preventScroll:true});
  workspacePrefs.copilot=open;saveWorkspace();syncCopilot();
}
function showWorkspaceOverlay(html){
  overlayRevision++;const overlay=document.querySelector('#overlay');workspaceAnimations.get(overlay)?.cancel();
  workspaceAnimations.get(overlay.querySelector('.drawer,.modal'))?.cancel();
  if(typeof updateShipmentDrawer==='function'&&updateShipmentDrawer(overlay,html))return;
  overlay.innerHTML=html;overlay.inert=false;overlay.style.opacity='1';
  document.body.style.overflow='hidden';if(typeof syncResponsiveWorkspace==='function')syncResponsiveWorkspace();slideWorkspace(overlay.querySelector('.drawer,.modal')||overlay,28,0,180);if(typeof syncLocalNavigation==='function')syncLocalNavigation();overlay.querySelector('button,input')?.focus();
}
async function hideWorkspaceOverlay(){
  const overlay=document.querySelector('#overlay');if(!overlay.firstElementChild)return;
  const revision=++overlayRevision,ref=focusReturn;selectedShipment=null;overlay.inert=true;
  await slideWorkspace(overlay.querySelector('.drawer,.modal')||overlay,0,28,140);
  if(revision!==overlayRevision)return;
  overlay.replaceChildren();overlay.inert=false;overlay.style.opacity='1';document.body.style.overflow='';if(typeof syncResponsiveWorkspace==='function')syncResponsiveWorkspace();
  if(ref?.isConnected)ref.focus({preventScroll:true});
}
