const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('dist/atlas-panels.js','utf8');
let wide=true,area={left:120,top:280,width:900,height:500};
const panel=()=>({style:{},getBoundingClientRect(){return {left:parseFloat(this.style.left)||0,top:parseFloat(this.style.top)||0,width:parseFloat(this.style.width)||0,height:parseFloat(this.style.height)||0}}});
const list=panel(),detail=panel(),layout={getBoundingClientRect:()=>area};
const main={style:{setProperty(){}},getBoundingClientRect:()=>({left:96,top:0})};
const atlas={dataset:{},closest:()=>main,querySelector:s=>({'.atlas-layout':layout,'.atlas-list':list,'.atlas-detail':detail}[s])};
const context=vm.createContext({localStorage:{getItem:()=>null},document:{querySelector:()=>atlas,addEventListener(){}},window:{addEventListener(){}},matchMedia:()=>({matches:wide}),atlasHand:'right'});
vm.runInContext(source,context);
for(const width of [650,800,1000,1350])for(const side of ['left','right'])for(const saved of [{},{list:{x:200,w:9999,h:9999},detail:{x:200,y:0,w:9999,h:9999}},{list:{x:-500,y:-500,w:300,h:400},detail:{x:9000,y:9000,w:520,h:400}}]){
 area.width=width;context.atlasHand=side;context.saved=saved;
 vm.runInContext("atlasPanelData={list:{},detail:{},compact:{},order:'list-first',...saved};applyAtlasPanels()",context);
 const boxes=[list,detail].map(p=>({x:parseFloat(p.style.left)-24,y:parseFloat(p.style.top)-280,w:parseFloat(p.style.width),h:parseFloat(p.style.height)}));
 for(const b of boxes){assert(b.x>=0&&b.y>=0);assert(b.x+b.w<=width-68+.01,'control lane preserved');assert(b.y+b.h<=500+.01)}
 const [a,b]=boxes;assert(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,'panels do not cover one another');
}
wide=false;vm.runInContext('applyAtlasPanels()',context);assert.equal(list.style.left,'');assert.equal(detail.style.width,'');
console.log('Atlas panels: bounds, control lane, saved-layout recovery and compact reset pass.');
