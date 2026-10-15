import test from 'node:test';
import assert from 'node:assert/strict';
import { careerTree } from '../src/careers.js';
import { createInitialState, chooseNode, currentLearningActivity, work, currentProject, completeProject, hydrateState } from '../src/game-engine.js';
import { addCitizen, updateActiveCareer, activeCitizen, assignCitizen } from '../world/world-engine.js';
import { createInfrastructureWorld, reconcileInfrastructure, infrastructureMetrics, hydrateInfrastructureWorld, withHistoricalScenario, historicalCoverage, fittedHistoricalCoverage, infrastructureData, INFRA_SAVE_KEY } from '../src/world-models/infrastructure.js';
import { createWorldStore } from '../world/save-store.js';
function pathFor(id,nodes=careerTree,prefix=[]) {
  for(const n of nodes) { if(n.id===id)return [...prefix,id]; const p=pathFor(id,n.children||[],[...prefix,n.id]);if(p)return p; }
}
function careerAt(id) {
  let career=createInitialState();
  for(const node of pathFor(id)) {
    career=chooseNode(career,node);
    while(currentLearningActivity(career))career=work(career);
    while(currentProject(career)) {career={...career,mastery:Math.max(career.mastery,currentProject(career).requirement)};career=completeProject(career);}
  }
  return hydrateState({...career,mastery:10000});
}
function add(world,id) {return reconcileInfrastructure(updateActiveCareer(addCitizen(world,id),careerAt(id)));}
test('homes and independent plumbing/lighting upgrades construct automatically and persist',()=>{
  let w=createInfrastructureWorld();
  assert.deepEqual(w.infrastructure,{});
  w=add(w,'service-plumber');assert.equal(w.infrastructure.plumbing,undefined);
  w=add(w,'carpenter');assert.equal(w.infrastructure.homes.coverage,1);assert.equal(w.infrastructure.plumbing.coverage,1);
  assert.equal(w.infrastructure.lighting,undefined);
  w=add(w,'commercial-electrician');assert.equal(w.infrastructure.lighting.coverage,1);
  assert.equal(reconcileInfrastructure(w),w);
  assert.deepEqual(hydrateInfrastructureWorld(JSON.parse(JSON.stringify(w))),w);
  w=assignCitizen(w,activeCitizen(w).id,null,0);
  assert.equal(w.infrastructure.lighting.coverage,1);
  assert.equal(infrastructureMetrics(w).constructed.find(x=>x.id==='lighting').operational,false);
});
test('training and unavailable citizens cannot unlock construction; all profession groups are required',()=>{
  let w=createInfrastructureWorld(undefined,careerAt('carpenter'));
  w={...w,citizens:w.citizens.map(c=>({...c,availability:0}))};
  assert.deepEqual(reconcileInfrastructure(w).infrastructure,{});
  w=createInfrastructureWorld();w=add(w,'family-medicine-physician');w=add(w,'carpenter');w=add(w,'service-plumber');
  assert.equal(w.infrastructure.clinic,undefined);
  w=add(w,'registered-nurse');assert.equal(w.infrastructure.clinic.coverage,1);
});
test('historical stock uses observed housing shares and upgrades without inventing staff',()=>{
  let w=withHistoricalScenario(createInfrastructureWorld(),'us-1940');
  assert.equal(w.infrastructure.plumbing.coverage,historicalCoverage('plumbing',1940).coverage);
  assert.equal(infrastructureMetrics(w).constructed.find(e=>e.id==='plumbing').operational,false);
  w=add(w,'service-plumber');assert.equal(w.infrastructure.plumbing.coverage,1);
  assert.throws(()=>withHistoricalScenario(w,'us-1950'));
  assert.equal(historicalCoverage('rail',1940),null);
  assert.equal(historicalCoverage('plumbing',1900).method,'clamped extrapolation');
  assert.equal(historicalCoverage('plumbing',1945).method,'linear interpolation');
});
test('historical adoption fit has finite bounded predictions and separately reported holdouts',()=>{
  const fit=infrastructureData.adoptionFit;
  assert.deepEqual(fit.trainingYears,[1940,1950,1960,1970]);
  assert.deepEqual(fit.holdout.map(x=>x.year),[1980,1990]);
  for(const row of fit.holdout)assert.ok(Math.abs(fittedHistoricalCoverage(row.year)-row.predicted)<1e-12);
  assert.ok(fit.holdoutMaePP<5);
  assert.ok(fittedHistoricalCoverage(1900)<fittedHistoricalCoverage(2000));
});
test('save isolation, reload, offline reconciliation and invalid-backup rejection',()=>{
  const records=new Map([['career-engine-world-save-v1','untouched']]);
  const storage={getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,v)};
  const store=createWorldStore(storage,()=>1000,{modelId:'world-infra',saveKey:INFRA_SAVE_KEY});
  store.load();store.syncCareer(careerAt('carpenter'));store.save(activeCitizen(store.getWorld()).career);
  assert.equal(records.get('career-engine-world-save-v1'),'untouched');
  const reload=createWorldStore(storage,()=>2000,{modelId:'world-infra',saveKey:INFRA_SAVE_KEY});reload.load();
  assert.equal(reload.getWorld().infrastructure.homes.coverage,1);
  const w=reload.getWorld();
  assert.throws(()=>hydrateInfrastructureWorld({...w,modelVersion:2}));
  assert.throws(()=>hydrateInfrastructureWorld({...w,infrastructureHash:'stale'}));
  for(const coverage of [NaN,Infinity,-1,2])assert.throws(()=>hydrateInfrastructureWorld({...w,infrastructure:{homes:{coverage,origin:'constructed'}}}));
  assert.throws(()=>hydrateInfrastructureWorld({...w,infrastructure:{plumbing:{coverage:1,origin:'constructed'}}}));
  assert.ok(infrastructureMetrics(w).upcoming.length<=4);
});
