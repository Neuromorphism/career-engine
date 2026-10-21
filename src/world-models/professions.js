import { careerTree } from '../careers.js?v=0.11.0';
import { worldData, citizenReady, citizenContribution } from '../../world/world-engine.js?v=0.11.0';
import { currentNode } from '../game-engine.js?v=0.11.0';
// Classification bridges are authored, not observed metro occupation shares.
const sectors = {
 engineering:'technical', medicine:'health', law:'governance', trades:'infrastructure',
 science:'research', business:'business', education:'education', 'arts-media':'culture',
 'community-service':'care', 'agriculture-land':'food', 'hospitality-food':'hospitality',
 'personal-services':'personal', 'sales-administration':'commerce', transportation:'transport',
 'military-service':'governance',
};
export const professions = [];
function walk(nodes, field) {
  for (const node of nodes) {
    if (node.children?.length) walk(node.children,field||node.id);
    else professions.push({id:node.id, name:node.jobTitle||node.name, field,
      sector:sectors[field], capabilities:worldData.role_profiles[node.id].capabilities,
      serviceId:worldData.role_profiles[node.id].service_id,
      mappingStatus:'authored game classification; occupation does not identify employer industry'});
  }
}
walk(careerTree);
export const professionById = new Map(professions.map(p=>[p.id,p]));
export function validateAllocations(allocations) {
  if (!allocations || typeof allocations!=='object' || Array.isArray(allocations)) throw new Error('Invalid workforce allocation.');
  for (const [id,n] of Object.entries(allocations)) {
    if (!professionById.has(id) || !Number.isSafeInteger(n) || n<0 || n>1e9) throw new Error('Unknown profession or invalid headcount.');
  }
  return {...allocations};
}
export function workforceExperiment(world, employed, population) {
  const allocations=validateAllocations(world.allocations);
  const namedCapacity={};
  for (const citizen of world.citizens) {
    if (!citizenReady(citizen)) continue;
    const id=currentNode(citizen.career).id;
    allocations[id]=(allocations[id]||0)+citizen.availability;
    for(const [key,n] of Object.entries(citizenContribution(citizen))) namedCapacity[key]=(namedCapacity[key]||0)+n;
  }
  const assigned=Object.values(allocations).reduce((s,n)=>s+n,0);
  const total=Object.values(world.allocations).reduce((s,n)=>s+n,0)+world.citizens.length;
  const capacity={...namedCapacity};
  for (const [id,n] of Object.entries(world.allocations)) for (const [key,weight] of Object.entries(professionById.get(id).capabilities)) {
    capacity[key]=(capacity[key]||0)+n*weight;
  }
  const services=worldData.services.map(service=>{
    // These inherited targets originally serve 500 residents. Only index scaling is reused.
    const ratios=Object.entries(service.requirements).map(([key,target])=>({key,label:worldData.capabilities[key].label,
      supplied:capacity[key]||0, required:target*population/500,
      ratio:Math.min(1,(capacity[key]||0)/(target*population/500))}));
    return {id:service.id,name:service.name,index:Math.min(...ratios.map(r=>r.ratio)),rows:ratios};
  });
  return { allocations, assigned, unclassified:Math.max(0,employed-assigned),
    budgetExceeded:total>Math.floor(employed), services,
    // Relative output sensitivity is a user assumption; no occupation coefficients were observed or trained.
    outputFactor:1+(world.productivityMultiplier-1)*Math.min(1,assigned/employed),
    status:'exploratory; existing unclassified workers still supply services not measured by these indices' };
}
