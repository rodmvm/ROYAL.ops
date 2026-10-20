const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
// Exercise cancellation and dialog races with controllable animation completion.
const animations=[];
function element(){return{style:{opacity:'1'},dataset:{},attributes:{},inert:false,firstElementChild:null,
  setAttribute(k,v){this.attributes[k]=v},removeAttribute(k){delete this.attributes[k]},querySelector(){return null},
  replaceChildren(){this.firstElementChild=null},
  set innerHTML(value){this.html=value;this.firstElementChild=value?{}:null},
  animate(frames,options){let resolve,reject;const finished=new Promise((a,b)=>{resolve=a;reject=b});const animation={frames,options,finished,finish:resolve,cancel:()=>reject(new Error('Cancelled'))};animations.push(animation);return animation}
}}
const content=element(),overlay=element(),body={style:{}};
let reduced=false,renders=0;
const scope={console,Promise,Node:{TEXT_NODE:3,ELEMENT_NODE:1},matchMedia:()=>({matches:reduced}),
  document:{hidden:false,body,activeElement:null,addEventListener(){},querySelectorAll(){return[]},querySelector:selector=>selector==='#overlay'?overlay:selector==='.studio .content'?content:null},
  getComputedStyle:el=>({opacity:el.style.opacity}),window:{scrollTo(){}},view:'overview',selectedShipment:'A',focusReturn:null,
  render(){renders++},};
vm.createContext(scope);vm.runInContext(fs.readFileSync('dist/workspace-motion.js','utf8'),scope);
vm.runInContext(fs.readFileSync('dist/local-navigation.js','utf8'),scope);
const tick=async()=>{for(let i=0;i<8;i++)await Promise.resolve()};
(async()=>{
  const first=scope.navigateWorkspace('shipments');
  assert.equal(animations.at(-1).options.duration,80);
  const second=scope.navigateWorkspace('documents');
  animations.at(-1).finish();await tick();
  assert.equal(scope.view,'documents');assert.equal(renders,1);
  assert.equal(animations.at(-1).options.duration,160);
  animations.at(-1).finish();assert.equal(await second,true);assert.equal(await first,false);
  assert.equal(content.inert,false);assert.equal(content.style.opacity,'1');assert.equal(content.dataset.motionPhase,undefined);
  const abandoned=scope.navigateWorkspace('deadlines');scope.cancelWorkspaceNavigation();await tick();
  assert.equal(await abandoned,false);assert.equal(scope.view,'documents');assert.equal(content.inert,false);
  const count=animations.length;reduced=true;assert.equal(await scope.navigateWorkspace('communications'),true);
  assert.equal(animations.length,count);assert.equal(content.style.opacity,'1');reduced=false;
  scope.showWorkspaceOverlay('first dialog');const closing=scope.hideWorkspaceOverlay();
  scope.showWorkspaceOverlay('replacement dialog');await tick();await closing;
  assert.equal(overlay.html,'replacement dialog');assert.equal(overlay.inert,false);assert.equal(body.style.overflow,'hidden');
  const finalClose=scope.hideWorkspaceOverlay();animations.at(-1).finish();await finalClose;
  assert.equal(overlay.firstElementChild,null);assert.equal(body.style.overflow,'');
  const local=scope.slideWorkspace(content,20,0,180);
  assert.equal(animations.at(-1).frames[0].opacity,undefined,'Local transitions must not fade');
  animations.at(-1).finish();await local;
  const geometry=scope.localTabGeometry({scrollLeft:40,clientLeft:1,getBoundingClientRect:()=>({left:100})},{getBoundingClientRect:()=>({left:125,width:90})});
  assert.equal(geometry.x,64);assert.equal(geometry.width,90);
  reduced=true;const before=animations.length;await scope.slideWorkspace(content);assert.equal(animations.length,before);
  console.log('Workspace motion checks passed: 240ms page navigation, local slides without opacity, scroll-aware indicators, reduced motion and interrupted dialog/navigation races.');
})().catch(error=>{console.error(error);process.exitCode=1});
