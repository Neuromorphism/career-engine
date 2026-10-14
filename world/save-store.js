import { SAVE_KEY } from '../src/game-engine.js?v=0.10.0';
import { WORLD_SAVE_KEY, createWorld, hydrateWorld, activeCitizen, updateActiveCareer, tickWorld } from './world-engine.js?v=0.10.0';
export function createWorldStore(storage = localStorage, now = () => Date.now()) {
  let world;
  return {
    load() {
      const raw = storage.getItem(WORLD_SAVE_KEY);
      if (raw) {
        world = hydrateWorld(JSON.parse(raw));
        world = tickWorld(world, Math.max(0, (now() - world.savedAt) / 1000));
      } else {
        let career = null, source = null;
        for (const key of [SAVE_KEY, 'career-engine-save-v2']) {
          const previous = storage.getItem(key);
          if (!previous) continue;
          try { career = JSON.parse(previous); source = key; break; } catch { /* Keep original bytes; an unreadable single-path save is not overwritten. */ }
        }
        world = createWorld(undefined, career || undefined, source);
      }
      return activeCitizen(world).career;
    },
    getWorld() { return world; },
    syncCareer(career) { world = updateActiveCareer(world, career); },
    save(career) {
      world = updateActiveCareer(world, career);
      world = { ...world, savedAt: now() };
      storage.setItem(WORLD_SAVE_KEY, JSON.stringify(world));
    },
    updateWorld(next) { world = next; },
    rawSave() { return storage.getItem(WORLD_SAVE_KEY); },
  };
}
