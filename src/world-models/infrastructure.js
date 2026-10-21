import { infrastructureData as data } from '../../world-infra/infrastructure-data.js?v=0.11.0';
import { createWorld, hydrateWorld, tickWorld, worldMetrics, citizenReady } from '../../world/world-engine.js?v=0.11.0';
import { currentNode } from '../game-engine.js?v=0.11.0';
export { data as infrastructureData };
export const INFRA_SAVE_KEY='career-engine-world-infra-save-v1';
const byId=new Map(data.elements.map(e=>[e.id,e]));
export function professionCounts(world) {
  const counts={};
  for (const c of world.citizens) if (citizenReady(c) && c.availability>0) {
    const id=currentNode(c.career).id;
    counts[id]=(counts[id]||0)+1;
  }
  return counts;
}
const missingGroups=(groups,counts)=>groups.filter(group=>!group.some(id=>counts[id]>0));
// Linear interpolation is descriptive; extrapolation is clamped to the nearest anchor.
// This preserves bounded access and avoids inventing an adoption rate outside evidence.
export function historicalCoverage(element,year,observations=data.observations) {
  if (!Number.isFinite(year)) throw new Error('Invalid historical year.');
  const points=observations.filter(o=>o.element===element).sort((a,b)=>a.year-b.year);
  if (!points.length) return null;
  const first=points[0],last=points.at(-1);
  const exact=points.find(p=>p.year===year);
  if (exact) return {coverage:exact.coverage,method:'source anchor',sources:[exact.source]};
  if(year<first.year||year>last.year) return {coverage:year<first.year?first.coverage:last.coverage,method:'clamped extrapolation',sources:[year<first.year?first.source:last.source]};
  const upper=points.findIndex(p=>p.year>year),a=points[upper-1],b=points[upper];
  return {coverage:a.coverage+(b.coverage-a.coverage)*(year-a.year)/(b.year-a.year),method:'linear interpolation',sources:[...new Set([a.source,b.source])]};
}
export function fittedHistoricalCoverage(year) {
  if (!Number.isFinite(year)||year<1840||year>2040) throw new Error('Unsupported historical projection year.');
  const fit=data.adoptionFit;
  return 1/(1+Math.exp(-(fit.intercept+fit.slope*(year-fit.origin))));
}
export function createInfrastructureWorld(name,career,source) {
  return {...createWorld(name||'Our infrastructure world',career,source),modelId:'world-infra',modelVersion:1,
    infrastructureHash:data.sourceHash,infrastructure:{},infrastructureScenario:'settlement'};
}
export function reconcileInfrastructure(world) {
  const counts=professionCounts(world), records={...world.infrastructure};
  let changed=false,progress=true;
  // Fixed point makes construction independent of TOML order and unlocks chains immediately.
  while(progress) {
    progress=false;
    for(const e of data.elements) {
      if(records[e.id]?.coverage===1 || e.requires.some(id=>!records[id]) || missingGroups(e.profession_groups,counts).length) continue;
      records[e.id]={coverage:data.coverage_per_unlock,origin:'constructed'};
      changed=true; progress=true;
    }
  }
  return changed?{...world,infrastructure:records}:world;
}
export function hydrateInfrastructureWorld(input) {
  if(input?.modelId!=='world-infra'||input.modelVersion!==1||input.infrastructureHash!==data.sourceHash) throw new Error('Unsupported infrastructure model or definition snapshot.');
  if(!['settlement','us-1925','us-1940','us-1950','us-1960'].includes(input.infrastructureScenario)) throw new Error('Invalid infrastructure scenario.');
  if(!input.infrastructure||typeof input.infrastructure!=='object'||Array.isArray(input.infrastructure)) throw new Error('Invalid infrastructure records.');
  const records={};
  for(const [id,r] of Object.entries(input.infrastructure)) {
    if(!byId.has(id)||!r||!Number.isFinite(r.coverage)||r.coverage<=0||r.coverage>1||!['constructed','historical','assumed'].includes(r.origin)) throw new Error('Invalid infrastructure element.');
    if(r.origin==='constructed'&&r.coverage!==1) throw new Error('Invalid construction coverage.');
    records[id]={coverage:r.coverage,origin:r.origin};
  }
  for(const id of Object.keys(records)) if(byId.get(id).requires.some(dep=>!records[dep])) throw new Error('Infrastructure prerequisite missing.');
  return reconcileInfrastructure({...hydrateWorld(input),modelId:'world-infra',modelVersion:1,infrastructureHash:data.sourceHash,
    infrastructureScenario:input.infrastructureScenario,infrastructure:records});
}
export function withHistoricalScenario(world,scenario) {
  if(Object.keys(world.infrastructure).length||world.infrastructureScenario!=='settlement') throw new Error('Choose a historical start before anything is constructed.');
  if(!['us-1925','us-1940','us-1950','us-1960'].includes(scenario)) throw new Error('Unknown historical start.');
  const year=Number(scenario.slice(3)),element=year===1925?'lighting':'plumbing';
  return reconcileInfrastructure({...world,infrastructureScenario:scenario,infrastructure:{
    homes:{coverage:1,origin:'assumed'},[element]:{coverage:historicalCoverage(element,year).coverage,origin:'historical'}
  }});
}
export function infrastructureMetrics(world) {
  const counts=professionCounts(world);
  const elements=data.elements.map(e=>{
    const record=world.infrastructure[e.id];
    return {...e,coverage:record?.coverage||0,origin:record?.origin,
      missingProfessions:missingGroups(e.profession_groups,counts),
      missingInfrastructure:e.requires.filter(id=>!world.infrastructure[id]),
      maintenanceMissing:missingGroups(e.maintenance_groups,counts),
      operational:!!record&&!missingGroups(e.maintenance_groups,counts).length};
  });
  const constructed=elements.filter(e=>e.coverage>0);
  const upcoming=elements.filter(e=>e.coverage<1).sort((a,b)=>
    a.missingInfrastructure.length-b.missingInfrastructure.length||a.missingProfessions.length-b.missingProfessions.length||data.elements.indexOf(byId.get(a.id))-data.elements.indexOf(byId.get(b.id)));
  return {elements,constructed,upcoming:upcoming.slice(0,4),remaining:upcoming.length,
    // Coverage uses dwelling-unit shares; never reinterpret as measured resident counts.
    homeUpgrades:elements.filter(e=>['homes','plumbing','lighting'].includes(e.id))};
}
export const infrastructureModel=Object.freeze({id:'world-infra',version:1,create:createInfrastructureWorld,hydrate:hydrateInfrastructureWorld,
  metrics:world=>({...worldMetrics(world),infrastructure:infrastructureMetrics(world)}),
  tick:(world,seconds)=>reconcileInfrastructure(tickWorld(world,seconds)),step:reconcileInfrastructureWorld});
function reconcileInfrastructureWorld(world) { return reconcileInfrastructure(world); }
