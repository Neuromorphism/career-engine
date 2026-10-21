import { getWorldModel } from '../src/world-models/registry.js?v=0.11.0';
import { activeCitizen, updateActiveCareer } from '../world/world-engine.js?v=0.11.0';
import { REAL_WORLD_SAVE_KEY } from '../src/world-models/real-world.js?v=0.11.0';
export function createRealWorldStore(storage=localStorage,now=()=>Date.now()) {
  const model=getWorldModel('real-world'); let world;
  return {
    load() {
      const raw=storage.getItem(REAL_WORLD_SAVE_KEY);
      world=raw ? model.hydrate(JSON.parse(raw)) : model.create();
      world=model.tick(world,Math.max(0,(now()-world.savedAt)/1000));
      return activeCitizen(world).career;
    },
    getWorld:()=>world,
    syncCareer(career) {world=updateActiveCareer(world,career);},
    updateWorld(next) {world=model.hydrate(next);},
    save(career) {world={...updateActiveCareer(world,career),savedAt:now()};storage.setItem(REAL_WORLD_SAVE_KEY,JSON.stringify(world));},
    rawSave:()=>storage.getItem(REAL_WORLD_SAVE_KEY),
  };
}
