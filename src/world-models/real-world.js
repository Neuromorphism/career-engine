import { metroData } from '../../real-world/metro-data.js?v=0.10.1';
import { createWorld, hydrateWorld, tickWorld } from '../../world/world-engine.js?v=0.10.1';
import { predictMetro, deriveMetrics, METRIC_IDS, validateModelArtifact } from './inference.js?v=0.10.1';
import { worldModelData } from '../../real-world/model-data.js?v=0.10.1';
import { validateAllocations, workforceExperiment } from './professions.js?v=0.10.1';
export const REAL_WORLD_SAVE_KEY='career-engine-real-world-save-v1';
const metroById=new Map(metroData.metros.map(m=>[m.id,m]));
validateModelArtifact(worldModelData,metroData);
const fitted=new Map(worldModelData.fittedModels.map(model=>[model.metroId,model]));
const TRAIN_END=worldModelData.trainingEnd;
export function predictRealWorld(metroId,year) {
  metroFor(metroId);
  return predictMetro(fitted.get(metroId),year,worldModelData.structure);
}
export function metroFor(id) {
  const metro=metroById.get(id); if (!metro) throw new Error('Unknown metropolitan area.'); return metro;
}
export function createRealWorld(metroId='london') {
  const metro=metroFor(metroId);
  return {...createWorld(`${metro.name} · real-world laboratory`), modelId:'real-world',
    modelVersion:1, dataHash:metroData.source.sha256, metroId, year:TRAIN_END, allocations:{}, productivityMultiplier:1};
}
export function hydrateRealWorld(input) {
  if (!input || input.modelId!=='real-world' || input.modelVersion!==1) throw new Error('Unsupported real-world model save.');
  metroFor(input.metroId);
  if(input.dataHash!==metroData.source.sha256) throw new Error('This save uses a different metropolitan data snapshot.');
  if (!Number.isInteger(input.year)||input.year<TRAIN_END||input.year>worldModelData.simulationEnd) throw new Error('World year is outside the historical simulation window.');
  if (!Number.isFinite(input.productivityMultiplier)||input.productivityMultiplier<.5||input.productivityMultiplier>2) throw new Error('Invalid output assumption.');
  const world={...hydrateWorld(input), modelId:'real-world',modelVersion:1,dataHash:input.dataHash,
    metroId:input.metroId,year:input.year,allocations:validateAllocations(input.allocations),
    productivityMultiplier:input.productivityMultiplier};
  if (realWorldMetrics(world).experiment.budgetExceeded) throw new Error('Workforce allocation exceeds the modeled employed population.');
  return world;
}
export function realWorldMetrics(world) {
  const metro=metroFor(world.metroId);
  const baseline=predictRealWorld(world.metroId,world.year);
  const newcomers=world.citizens.filter(c=>c.origin==='newcomer').length;
  const residents={...baseline,population:baseline.population+newcomers};
  // A new playable citizen is an individual, never an implicit workforce multiplier.
  const experiment=workforceExperiment(world,residents.employed,residents.population);
  const snapshot=deriveMetrics(residents);
  return { ...snapshot, population:snapshot.population, namedCitizens:world.citizens.length,
    source:metroData.source, observed:metro.observations.find(r=>r.year===world.year),
    modelId:'real-world',metro,experiment, scenarioGdp:snapshot.gdp*experiment.outputFactor,
    intervals:Object.fromEntries(METRIC_IDS.map(key=>{
      const f=fitted.get(world.metroId).fits[key];
      const width=1.96*f.innovation*Math.sqrt(Math.max(1,world.year-f.origin));
      const val=snapshot[key];
      return [key,key==='unemployment' ? [Math.max(0,val-width),Math.min(100,val+width)] : [val*Math.exp(-width),val*Math.exp(width)]];
    })),
  };
}
export function allocateWorkers(world,roleId,headcount) {
  const next={...world,allocations:validateAllocations({...world.allocations,[roleId]:headcount})};
  if (realWorldMetrics(next).experiment.budgetExceeded) throw new Error('This allocation exceeds the modeled workforce. Reduce another allocation first.');
  return next;
}
export function advanceYear(world) {
  if (world.year>=worldModelData.simulationEnd) return world;
  const next={...world,year:world.year+1};
  if (realWorldMetrics(next).experiment.budgetExceeded) throw new Error('The next year has a smaller workforce. Reduce allocations before advancing.');
  return next;
}
export const realWorldModel=Object.freeze({id:'real-world',version:1,create:createRealWorld,hydrate:hydrateRealWorld,
  metrics:realWorldMetrics,tick:tickWorld,step:advanceYear});
