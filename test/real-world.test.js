import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { worldModelData } from '../real-world/model-data.js';
import { predictMetro as inferMetro, validateModelArtifact } from '../src/world-models/inference.js';
import { createHash } from 'node:crypto';
import { metroData } from '../real-world/metro-data.js';
import { fitMetro, predictMetro, evaluateMetros, deriveMetrics } from '../scripts/lib/calibration.js';
import { getWorldModel, listWorldModels } from '../src/world-models/registry.js';
import { createRealWorld, hydrateRealWorld, realWorldMetrics, allocateWorkers, advanceYear, REAL_WORLD_SAVE_KEY } from '../src/world-models/real-world.js';
import { professions } from '../src/world-models/professions.js';
import { createRealWorldStore } from '../real-world/save-store.js';
import { addCitizen, activeCitizen, citizenReady, createWorld, worldData, WORLD_SAVE_KEY } from '../world/world-engine.js';
import { createWorldStore } from '../world/save-store.js';
import { SAVE_KEY, AI_SAVE_KEY, chooseNode, work, currentLearningActivity, currentProject, completeProject } from '../src/game-engine.js';
import { careerTree } from '../src/careers.js';
function memoryStorage(){const records=new Map();return{records,getItem:k=>records.get(k)??null,setItem:(k,v)=>records.set(k,v)};}
function pathTo(id,nodes=careerTree,prefix=[]) {for(const n of nodes){if(n.id===id)return [...prefix,id];const p=pathTo(id,n.children||[],[...prefix,n.id]);if(p)return p;}return null;}
function qualify(career,id){for(const node of pathTo(id)){career=chooseNode(career,node);while(currentLearningActivity(career))career=work(career);while(currentProject(career)){career={...career,mastery:Math.max(career.mastery,currentProject(career).requirement)};career=completeProject(career);}}return career;}

test('archive checksum, geographic joins, missing values and units remain explicit',()=>{
  const bytes=readFileSync(new URL('../data/real-world/raw/pre-imputation.csv',import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),metroData.source.sha256);
  assert.equal(metroData.metros.length,11);
  const london=metroData.metros.find(m=>m.id==='london');
  assert.equal(london.country,'United Kingdom');
  assert.equal(london.observations.find(r=>r.year===2019).population,12396541);
  assert.equal(metroData.metros.find(m=>m.id==='seoul').observations[0].population,null);
  assert.match(metroData.metrics.gdp.unit,/constant 2015/);
});
test('training and hyperparameter selection never read held-out outcomes',()=>{
  for(const metro of metroData.metros){
    const poisoned=structuredClone(metro);
    for(const row of poisoned.observations) if(row.year>2016) for(const key of Object.keys(row))if(key!=='year')row[key]=9e12;
    assert.deepEqual(fitMetro(poisoned),fitMetro(metro));
    assert.equal(predictMetro(fitMetro(metro),2016).year,2016);
  }
});
test('ten baseline passes, Madrid failure and separate profession-validation status are retained',()=>{
  const report=evaluateMetros(metroData.metros);
  assert.equal(report.passed,10);assert.equal(report.total,11);
  assert.equal(report.cities.find(c=>c.metroId==='madrid').passed,false);
  assert.equal(report.occupationEffectsValidated,false);
  for(const city of report.cities) for(const key of ['population','gdp','unemployment','labourForce']) assert.equal(city.metrics[key].n,3);
});
test('economic identities preserve million-dollar and percentage conversions',()=>{
  const r=deriveMetrics({gdp:100,population:10000,labourForce:6000,unemployment:10});
  assert.equal(r.employed,5400);assert.equal(r.gdpPerCapita,10000);assert.equal(r.outputPerEmployed,100e6/5400);
});
test('models share an interface while legacy saves remain byte-compatible',()=>{
  assert.deepEqual(listWorldModels().map(m=>m.id),['founders','real-world','world-infra']);
  for(const {id} of listWorldModels())for(const method of ['create','hydrate','metrics','tick','step'])assert.equal(typeof getWorldModel(id)[method],'function');
  const legacy=createWorld();assert.equal(getWorldModel('founders').metrics(legacy).population,500);
  assert.deepEqual(getWorldModel('founders').hydrate(legacy),legacy);
  assert.throws(()=>getWorldModel('unknown'));
  assert.throws(()=>getWorldModel('founders').hydrate(createRealWorld()),/different world model/);
});
test('all careers have explicit mappings; allocations conserve the modeled workforce',()=>{
  assert.equal(professions.length,Object.keys(worldData.role_profiles).length);
  assert.ok(professions.every(p=>p.sector&&p.mappingStatus&&p.serviceId));
  let w=createRealWorld();w=allocateWorkers(w,'registered-nurse',1000);
  const m=realWorldMetrics(w);
  assert.equal(m.experiment.assigned,1000);assert.equal(m.experiment.outputFactor,1);
  assert.equal(m.scenarioGdp,m.gdp);
  for(const n of [-1,.5,Infinity,NaN,1e10])assert.throws(()=>allocateWorkers(w,'registered-nurse',n));
  assert.throws(()=>allocateWorkers(w,'unknown-profession',10));
  assert.throws(()=>allocateWorkers(w,'registered-nurse',Math.ceil(m.employed)));
  assert.equal(w.allocations['registered-nurse'],1000);
  const more=realWorldMetrics(allocateWorkers(w,'registered-nurse',2000));
  assert.equal(more.experiment.services.find(s=>s.id==='health').index,0,'nurses cannot replace missing clinical and care complements');
});
test('one qualified citizen contributes one person and cannot create a macroeconomic reward',()=>{
  let w=createRealWorld(),original=realWorldMetrics(w);
  w.citizens[0].career=qualify(w.citizens[0].career,'registered-nurse');
  assert.ok(citizenReady(w.citizens[0]));
  assert.equal(realWorldMetrics(w).experiment.assigned,1);
  assert.equal(realWorldMetrics(w).gdp,original.gdp);
  const newcomer=addCitizen(w,'Newcomer','newcomer');
  assert.equal(realWorldMetrics(newcomer).population,original.population+1);
  assert.equal(realWorldMetrics(newcomer).experiment.assigned,1);
});
test('stepping and save hydration preserve all model parameters and reject invalid worlds',()=>{
  let w=allocateWorkers(createRealWorld('tokyo'),'carpenter',1000);
  w=advanceYear(w);assert.equal(w.year,2017);
  assert.deepEqual(hydrateRealWorld(JSON.parse(JSON.stringify(w))),w);
  assert.equal(advanceYear({...w,year:2019}).year,2019);
  for(const extra of [{modelId:'founders'},{modelVersion:2},{dataHash:'unsupported-snapshot'},{year:2020},{year:2017.5},{metroId:'fake'},{productivityMultiplier:Infinity},{allocations:{'carpenter':1e9}}])assert.throws(()=>hydrateRealWorld({...w,...extra}));
});
test('real-world store remains isolated and never advances model years during offline career learning',()=>{
  const storage=memoryStorage();for(const key of [SAVE_KEY,AI_SAVE_KEY,WORLD_SAVE_KEY])storage.setItem(key,'preserved');
  const store=createRealWorldStore(storage,()=>1000);const c=store.load();store.save(c);
  assert.equal(JSON.parse(storage.getItem(REAL_WORLD_SAVE_KEY)).year,2016);
  const second=createRealWorldStore(storage,()=>100000000);second.load();assert.equal(second.getWorld().year,2016);
  for(const key of [SAVE_KEY,AI_SAVE_KEY,WORLD_SAVE_KEY])assert.equal(storage.getItem(key),'preserved');
  storage.setItem(REAL_WORLD_SAVE_KEY,'{broken');assert.throws(()=>createRealWorldStore(storage).load());assert.equal(storage.getItem(REAL_WORLD_SAVE_KEY),'{broken');
});
test('founders store still loads and persists after modular model integration',()=>{
  const storage=memoryStorage();const store=createWorldStore(storage);const career=store.load();store.save(career);
  assert.equal(JSON.parse(storage.getItem(WORLD_SAVE_KEY)).schemaVersion,1);
  assert.equal(activeCitizen(store.getWorld()).id,'citizen-1');
});

test('exported development weights and validation match fresh fitting for every metro/year',()=>{
  const evaluation=evaluateMetros(metroData.metros);
  // JSON export normalizes signed zero; evaluated predictions must still match exactly.
  assert.deepEqual(worldModelData.fittedModels,JSON.parse(JSON.stringify(metroData.metros.map(m=>fitMetro(m)))));
  assert.deepEqual(worldModelData.validation,{...evaluation,cities:evaluation.cities.map(({points,...summary})=>summary)});
  for(const metro of metroData.metros){
    const trained=fitMetro(metro),saved=worldModelData.fittedModels.find(m=>m.metroId===metro.id);
    for(const year of [2016,2017,2018,2019]) {
      const expected=predictMetro(trained,year);
      assert.deepEqual(inferMetro(saved,year,worldModelData.structure),expected);
      const actual=realWorldMetrics({...createRealWorld(metro.id),year});
      for(const key of ['population','labourForce','unemployment','gdp','density','pm25','employed','gdpPerCapita','outputPerEmployed'])assert.equal(actual[key],expected[key]);
    }
  }
});
test('runtime rejects stale or unsupported model artifacts without fitting replacements',()=>{
  assert.equal(validateModelArtifact(worldModelData,metroData),worldModelData);
  const changes=[a=>a.schemaVersion=2,a=>a.sourceHash='stale',a=>a.structure.family='unknown',
    a=>a.structure.metrics.gdp.transform='arbitrary-code',a=>a.fittedModels.pop(),
    a=>a.fittedModels[0].fits.gdp.slope=Infinity,a=>a.fittedModels[0].fits.population.innovation=-1,
    a=>a.fittedModels[1].metroId=a.fittedModels[0].metroId,a=>a.validation.cities=[]];
  for(const change of changes){const artifact=structuredClone(worldModelData);change(artifact);assert.throws(()=>validateModelArtifact(artifact,metroData));}
});
test('browser entry points never import development fitting or Node dependencies',()=>{
  const visited=new Set();
  function inspect(url){
    url.search='';if(visited.has(url.href))return;visited.add(url.href);
    assert.ok(!url.pathname.includes('/scripts/'),'browser must not load development scripts');
    assert.ok(!url.pathname.endsWith('/calibration.js'),'browser must not load calibration code');
    const source=readFileSync(url,'utf8');
    for(const match of source.matchAll(/(?:import|export)\s[^;]*?from\s*['"]([^'"]+)['"]/g)){
      assert.ok(match[1].startsWith('.'),`Browser dependency must be a portable relative file: ${match[1]}`);
      inspect(new URL(match[1],url));
    }
  }
  for(const entry of ['real-world','world','single-path','ai'])inspect(new URL(`../${entry}/app.js`,import.meta.url));
  assert.ok([...visited].some(path=>path.endsWith('/model-data.js')));
  assert.ok([...visited].some(path=>path.endsWith('/inference.js')));
});
