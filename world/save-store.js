import { getWorldModel } from '../src/world-models/registry.js';
import { SAVE_KEY } from '../src/game-engine.js?v=0.10.0';
import { WORLD_SAVE_KEY, activeCitizen, updateActiveCareer } from './world-engine.js?v=0.10.0';
export function createWorldStore(storage = localStorage, now = () => Date.now(), options = {}) {
  const model = getWorldModel(options.modelId || 'founders');
  const key = options.saveKey || WORLD_SAVE_KEY;
  const settle = next => model.step(next);
  let world;
  return {
    load() {
      const raw = storage.getItem(key);
      if (raw) {
        world = model.hydrate(JSON.parse(raw));
        world = model.tick(world, Math.max(0, (now() - world.savedAt) / 1000));
      } else {
        let career = null, source = null;
        for (const key of [SAVE_KEY, 'career-engine-save-v2']) {
          const previous = storage.getItem(key);
          if (!previous) continue;
          try { career = JSON.parse(previous); source = key; break; } catch { /* Keep original bytes; an unreadable single-path save is not overwritten. */ }
        }
        world = model.create(undefined, career || undefined, source);
      }
      return activeCitizen(world).career;
    },
    getWorld() { return world; },
    syncCareer(career) { world = settle(updateActiveCareer(world, career)); },
    save(career) {
      world = settle(updateActiveCareer(world, career));
      world = { ...world, savedAt: now() };
      storage.setItem(key, JSON.stringify(world));
    },
    updateWorld(next) { world = settle(next); },
    rawSave() { return storage.getItem(key); },
  };
}
