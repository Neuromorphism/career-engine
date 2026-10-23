import { SAVE_KEY, AI_SAVE_KEY, createInitialState, hydrateState, tick } from './game-engine.js?v=0.11.1';
export function createCareerStore(mode, storage = localStorage) {
  const aiMode = mode === 'ai';
  const key = aiMode ? AI_SAVE_KEY : SAVE_KEY;
  return {
    load() {
      const raw = storage.getItem(key) || (!aiMode ? storage.getItem('career-engine-save-v2') : null);
      if (!raw) return createInitialState();
      // Preserve unreadable saves instead of silently replacing them on the next autosave.
      const parsed = JSON.parse(raw);
      return tick(hydrateState(parsed), Math.max(0, (Date.now() - parsed.savedAt) / 1000) || 0, { aiMode });
    },
    save(state) { storage.setItem(key, JSON.stringify(state)); },
  };
}
