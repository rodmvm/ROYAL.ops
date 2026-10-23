'use strict';
const atlasPanelKey='royal-atlas-panels-v1';
let atlasPanelData={list:{},detail:{},compact:{},order:'list-first'};
try{
 const saved=JSON.parse(localStorage.getItem(atlasPanelKey)||'null');
 if(saved&&typeof saved==='object'){
  for(const name of ['list','detail'])if(saved[name]&&typeof saved[name]==='object')for(const key of ['x','y','w','h'])if(Number.isFinite(saved[name][key]))atlasPanelData[name][key]=saved[name][key];
  for(const name of ['list','detail'])if(Number.isFinite(saved.compact?.[name]))atlasPanelData.compact[name]=saved.compact[name];
  if(saved.order==='detail-first')atlasPanelData.order='detail-first';
 }
}catch{}
let atlasPanelGesture=null;
let atlasPanelObserver=null,atlasPanelObservedLayout=null;
function destroyAtlasPanels(){atlasPanelObserver?.disconnect();atlasPanelObserver=null;atlasPanelObservedLayout=null;atlasPanelGesture=null}
const atlasPanelDesktop=()=>matchMedia('(min-width:1024px)').matches;
const atlasPanelClamp=(value,min,max)=>Math.min(Math.max(value,min),Math.max(min,max));
function saveAtlasPanels(){try{localStorage.setItem(atlasPanelKey,JSON.stringify(atlasPanelData))}catch{}}
function atlasPanelElements(){const atlas=document.querySelector('.shipment-atlas');return atlas?{atlas,layout:atlas.querySelector('.atlas-layout'),main:atlas.closest('.main'),list:atlas.querySelector('.atlas-list'),detail:atlas.querySelector('.atlas-detail')}:null}
function atlasPanelButton(action,name){
 const b=document.createElement('button');b.type='button';b.className=`atlas-panel-${action}`;b.dataset.atlasPanelAction=action;b.dataset.atlasPanel=name;
 b.setAttribute('aria-label',action==='move'?tr(`Move ${name==='list'?'route list':'selected shipment'} panel`,`Mover panel de ${name==='list'?'rutas':'embarque seleccionado'}`):tr(`Resize ${name==='list'?'route list':'selected shipment'} panel`,`Cambiar tamaño del panel de ${name==='list'?'rutas':'embarque seleccionado'}`));
 b.title=action==='move'?tr('Drag to move · Arrow keys for fine adjustments · Tap to change order on small screens','Arrastra para mover · Flechas para ajustar · Toca para cambiar el orden en pantallas pequeñas'):tr('Drag to resize · Arrow keys for fine adjustments','Arrastra para cambiar tamaño · Flechas para ajustar');
 b.innerHTML=icon(action==='move'?'move':'resize');return b;
}
function mountAtlasPanels(){
 const nodes=atlasPanelElements();if(!nodes)return;
 const {atlas,list,detail}=nodes;
 if(!list.querySelector('.atlas-panel-move'))list.querySelector('.atlas-list-heading')?.append(atlasPanelButton('move','list'));
 if(!list.querySelector('.atlas-panel-resize'))list.append(atlasPanelButton('resize','list'));
 if(!detail.querySelector('.atlas-detail-body')){const body=document.createElement('div');body.className='atlas-detail-body';body.append(...detail.childNodes);detail.append(body)}
 if(!detail.querySelector('.atlas-panel-move'))detail.append(atlasPanelButton('move','detail'));
 if(!detail.querySelector('.atlas-panel-resize'))detail.append(atlasPanelButton('resize','detail'));
 if(!atlas.querySelector('.atlas-panel-reset')){const reset=document.createElement('button');reset.type='button';reset.className='atlas-panel-reset';reset.setAttribute('aria-label',tr('Reset panel layout','Restablecer posición de paneles'));reset.title=tr('Reset panel positions and sizes','Restablecer posición y tamaño de los paneles');reset.innerHTML=`${icon('refresh')}<span>${tr('Reset layout','Restablecer diseño')}</span>`;atlas.querySelector('.atlas-toolbar')?.append(reset)}
 if(nodes.layout!==atlasPanelObservedLayout){atlasPanelObserver?.disconnect();atlasPanelObservedLayout=nodes.layout;atlasPanelObserver=new ResizeObserver(()=>requestAnimationFrame(applyAtlasPanels));atlasPanelObserver.observe(nodes.layout);atlasPanelObserver.observe(nodes.main)}
 atlas.dataset.panelOrder=atlasPanelData.order;
 applyAtlasPanels();
}
function applyAtlasPanels(){
 const nodes=atlasPanelElements();if(!nodes)return;
 const {atlas,layout,main,list,detail}=nodes;atlas.dataset.panelOrder=atlasPanelData.order;
 if(!atlasPanelDesktop()){
  for(const [name,element] of [['list',list],['detail',detail]]){
   element.style.left='';element.style.top='';element.style.width='';element.style.height='';
   if(Number.isFinite(atlasPanelData.compact[name]))element.style.height=`${atlasPanelClamp(atlasPanelData.compact[name],name==='list'?165:205,600)}px`;
  }
  return;
 }
 const area=layout.getBoundingClientRect(),origin=main.getBoundingClientRect();
 // Reserve a separate lane for globe controls, outside draggable glass panels.
 const W=Math.max(1,area.width-68),H=Math.max(1,area.height),gap=16;
 main.style.setProperty('--atlas-tools-top',`${area.top-origin.top}px`);
 const listDefaultW=Math.min(W*.3,W<1000?200:220);
 const listW=atlasPanelClamp(atlasPanelData.list.w??listDefaultW,170,Math.max(170,W-316));
 const specs=[['list',list,listW,H],['detail',detail,Math.min(520,Math.max(300,W-listW-gap)),Math.min(340,H-12)]];
 const boxes={};
 for(const [name,element,defaultW,defaultH] of specs){
  const saved=atlasPanelData[name];const minW=name==='list'?170:300,minH=name==='list'?195:210;
  const maxW=name==='list'?listW:Math.max(300,W-listW-gap);
  const w=atlasPanelClamp(name==='list'?listW:(saved.w??defaultW),Math.min(minW,W),Math.min(W,maxW)),h=atlasPanelClamp(saved.h??defaultH,Math.min(minH,H),H);
  const defaultX=name==='list'?(atlasHand==='right'?W-w:0):(atlasHand==='right'?(W-listW-w)/2:listW+(W-listW-w)/2);
  let x=atlasPanelClamp(saved.x??defaultX,0,W-w);const y=atlasPanelClamp(saved.y??(name==='list'?0:H-h-25),0,H-h);
  // Previously saved oversized/overlapping panels must recover at every width.
  if(name==='detail'){
   const other=boxes.list;
   if(x<other.x+other.w+gap&&x+w+gap>other.x&&y<other.y+other.h&&y+h>other.y){
    x=other.x+other.w+gap+w<=W?other.x+other.w+gap:Math.max(0,other.x-w-gap);
    // If an old list position leaves no room on either side, anchor it to its chosen edge.
    if(x<other.x+other.w+gap&&x+w+gap>other.x){
     other.x=atlasHand==='right'?W-other.w:0;
     list.style.left=`${area.left-origin.left+other.x}px`;
     x=atlasHand==='right'?Math.max(0,other.x-w-gap):other.w+gap;
    }
   }
  }
  boxes[name]={x,y,w,h};
  element.style.left=`${area.left-origin.left+x}px`;element.style.top=`${area.top-origin.top+y}px`;
  element.style.width=`${w}px`;element.style.height=`${h}px`;
 }
}
function setAtlasPanelSide(hand){
 const nodes=atlasPanelElements();if(!nodes||!atlasPanelDesktop())return;
 const W=nodes.layout.getBoundingClientRect().width,w=nodes.list.getBoundingClientRect().width;
 atlasPanelData.list.x=hand==='right'?Math.max(0,W-w):0;
 saveAtlasPanels();applyAtlasPanels();
}
function atlasPanelReorder(){atlasPanelData.order=atlasPanelData.order==='list-first'?'detail-first':'list-first';saveAtlasPanels();applyAtlasPanels()}
document.addEventListener('pointerdown',event=>{
 const control=event.target.closest('[data-atlas-panel-action]');if(!control||event.button!==0)return;
 const name=control.dataset.atlasPanel,action=control.dataset.atlasPanelAction,nodes=atlasPanelElements();if(!nodes)return;
 if(action==='move'&&!atlasPanelDesktop())return;
 const element=nodes[name],area=nodes.layout.getBoundingClientRect(),box=element.getBoundingClientRect();
 atlasPanelGesture={control,name,action,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,x:box.left-area.left,y:box.top-area.top,w:box.width,h:box.height};
 control.setPointerCapture(event.pointerId);event.preventDefault();event.stopPropagation();
});
document.addEventListener('pointermove',event=>{
 const g=atlasPanelGesture;if(!g||g.pointerId!==event.pointerId)return;
 const nodes=atlasPanelElements();if(!nodes)return;
 const deltaX=event.clientX-g.startX,deltaY=event.clientY-g.startY,data=atlasPanelData[g.name];
 if(g.action==='move'){data.x=g.x+deltaX;data.y=g.y+deltaY}
 else if(atlasPanelDesktop()){data.w=g.w+deltaX;data.h=g.h+deltaY}
 else atlasPanelData.compact[g.name]=g.h+deltaY;
 applyAtlasPanels();event.preventDefault();
});
function finishAtlasPanelGesture(event){if(!atlasPanelGesture||atlasPanelGesture.pointerId!==event.pointerId)return;atlasPanelGesture=null;saveAtlasPanels()}
document.addEventListener('pointerup',finishAtlasPanelGesture);
document.addEventListener('pointercancel',finishAtlasPanelGesture);
document.addEventListener('click',event=>{if(event.target.closest('[data-atlas-panel-action="move"]')&&!atlasPanelDesktop())atlasPanelReorder()});
document.addEventListener('click',event=>{if(!event.target.closest('.atlas-panel-reset'))return;atlasPanelData={list:{},detail:{},compact:{},order:'list-first'};saveAtlasPanels();applyAtlasPanels()});
document.addEventListener('keydown',event=>{
 const control=event.target.closest('[data-atlas-panel-action]');if(!control||!event.key.startsWith('Arrow'))return;
 const name=control.dataset.atlasPanel,action=control.dataset.atlasPanelAction;
 if(action==='move'&&!atlasPanelDesktop())return;
 const nodes=atlasPanelElements();if(!nodes)return;const area=nodes.layout.getBoundingClientRect(),box=nodes[name].getBoundingClientRect();
 const data=atlasPanelData[name],step=event.shiftKey?40:12,dx=event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0,dy=event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0;
 if(action==='move'){data.x=(data.x??box.left-area.left)+dx;data.y=(data.y??box.top-area.top)+dy}
 else if(atlasPanelDesktop()){data.w=(data.w??box.width)+dx;data.h=(data.h??box.height)+dy}
 else atlasPanelData.compact[name]=(atlasPanelData.compact[name]??box.height)+dy;
 applyAtlasPanels();saveAtlasPanels();event.preventDefault();
});
window.addEventListener('resize',()=>{if(atlasPanelElements())requestAnimationFrame(applyAtlasPanels)});
