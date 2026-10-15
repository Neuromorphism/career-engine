import { createWorld, hydrateWorld, worldMetrics, tickWorld } from '../../world/world-engine.js?v=0.10.0';
import { realWorldModel } from './real-world.js';
// Adapters keep population-scale models separate from career learning and old saves.
const founders=Object.freeze({id:'founders',version:1,create:createWorld,hydrate:input=>{
  if(input?.modelId && input.modelId!=='founders') throw new Error('This backup belongs to a different world model.');
  return hydrateWorld(input);
},metrics:worldMetrics,tick:tickWorld,
  step:world=>world});
const models=new Map([founders,realWorldModel].map(model=>[model.id,model]));
export function getWorldModel(id='founders') {
  const model=models.get(id); if(!model) throw new Error(`Unsupported world model: ${id}`); return model;
}
export function listWorldModels() { return [...models.values()].map(({id,version})=>({id,version})); }
