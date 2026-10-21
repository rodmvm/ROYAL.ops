const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const G=require('../dist/globe-math.js');
const source=fs.readFileSync(require.resolve('../dist/shipment-globe.js'),'utf8');
function context(reduced=false){const c=vm.createContext({RoyalGlobeMath:G,presentationCities:{},matchMedia:()=>({matches:reduced}),document:{addEventListener(){},getElementById(){return null}}});vm.runInContext(source,c);return c}
const run=(c,s)=>vm.runInContext(s,c);
assert.equal(run(context(),'atlasSpin'),true);
assert.equal(run(context(true),'atlasSpin'),false);
function simulate(fps){const c=context();run(c,'atlasRotation={lat:10,lon:0,zoom:1};atlasMomentum={lat:.02,lon:.07}');for(let i=0;i<fps*2;i++)run(c,`atlasAdvanceMotion(${1000/fps})`);return JSON.parse(run(c,'JSON.stringify({rotation:atlasRotation,momentum:atlasMomentum})'))}
const a=simulate(30),b=simulate(120);
assert.ok(Math.abs(a.rotation.lon-b.rotation.lon)<.003,'Inertia must be independent of frame rate');
assert.ok(Math.abs(a.rotation.lat-b.rotation.lat)<.003);
assert.ok(Math.abs(a.momentum.lon)<.00001,'Inertia must settle');
const c=context();run(c,'atlasRotation={lat:20,lon:0,zoom:1};atlasMomentum={lat:.03,lon:.08};atlasAdvanceMotion(1000,true)');
assert.equal(run(c,'atlasRotation.lon'),3,'Steady rotation continues during dragging');
assert.equal(run(c,'atlasRotation.lat'),20,'Drag controls tilt without automatic drift');
run(c,'atlasClearMomentum();atlasSpin=false;atlasAdvanceMotion(1000)');
assert.equal(run(c,'atlasRotation.lon'),3,'Explicit pause freezes automatic motion');
assert.equal(run(c,'atlasMomentum.lat+atlasMomentum.lon'),0);
run(c,'atlasSpin=true;atlasAdvanceMotion(1000)');assert.equal(run(c,'atlasRotation.lon'),6);
run(c,'atlasRotation.lat=79;atlasRotation.lon=179;atlasMomentum={lat:.06,lon:.09};atlasAdvanceMotion(1000)');
assert.equal(run(c,'atlasRotation.lat'),80);assert.equal(run(c,'atlasMomentum.lat'),0);
assert.ok(run(c,'atlasRotation.lon>=-180&&atlasRotation.lon<180'));
console.log('Globe motion checks passed: steady rotation during drag, frame-rate independent damping, pause/resume, pole limits and longitude wrap.');
