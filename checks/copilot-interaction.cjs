const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const timers=[],renders=[];
const scope={console,innerWidth:1440,localStorage:{getItem(){return null},setItem(){}},document:{addEventListener(){}},
 setTimeout:callback=>timers.push(callback),requestAnimationFrame:callback=>callback(),$:()=>null,
 state:{shipments:[{id:'RDS-TEST',container:'BOX-TEST'}]},selectedShipment:null,
 tr:(en)=>en,render(){renders.push(vm.runInContext('aiMessages.map(m=>({pending:m.pending,question:m.question}))',scope))}};
vm.createContext(scope);vm.runInContext(fs.readFileSync('dist/ai-workspace.js','utf8'),scope);
(async()=>{
 const first=scope.runAssistant('Summarize RDS-TEST','brief');
 assert.equal(renders.at(-1)[0].pending,true);
 await scope.runAssistant('Duplicate click','brief');
 assert.equal(timers.length,1,'Rapid submission must not create duplicate turns');
 vm.runInContext("copilotDraft='Next question in progress'",scope);
 timers.shift()();await first;
 assert.equal(renders.at(-1)[0].pending,false);
 assert.equal(vm.runInContext('copilotDraft',scope),'Next question in progress','Answer must preserve the next draft');
 const abandoned=scope.runAssistant('Show priorities','deadlines');
 vm.runInContext('aiMessages=[]',scope);const count=renders.length;
 timers.shift()();await abandoned;
 assert.equal(renders.length,count,'Cleared conversations must not be revived by delayed answers');
 assert.equal(vm.runInContext('aiMessages.length',scope),0);
 assert.equal(scope.aiIsBusy(),false);
 assert.match(fs.readFileSync('dist/copilot-droid.css','utf8'),/@media\(prefers-reduced-motion:reduce\)/);
 console.log('Copilot interaction checks passed: duplicate submits, staged replies, draft retention and clear-during-response.');
})().catch(error=>{console.error(error);process.exitCode=1});
