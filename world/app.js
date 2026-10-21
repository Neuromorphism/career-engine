import { INFRA_SAVE_KEY, withHistoricalScenario } from '../src/world-models/infrastructure.js?v=0.11.0';
import { mountInfrastructureUI, renderInfrastructureUI } from '../world-infra/infrastructure-ui.js?v=0.11.0';
import { getWorldModel } from '../src/world-models/registry.js?v=0.11.0';
import { startCareerApp } from '../src/app.js?v=0.11.0';
import { showLoadError, downloadJSON } from '../src/career-ui.js?v=0.11.0';
import { createWorldStore } from './save-store.js?v=0.11.0';
import { activeCitizen, addCitizen, switchCitizen, assignCitizen, renameWorld, commissionProject } from './world-engine.js?v=0.11.0';
import { mountWorldUI, renderWorldUI, worldFeedback } from './world-ui.js?v=0.11.0';
const infraMode = document.body.dataset.model === 'world-infra';
const model = getWorldModel(infraMode ? 'world-infra' : 'founders');
const store = createWorldStore(localStorage, () => Date.now(), infraMode ? { modelId: 'world-infra', saveKey: INFRA_SAVE_KEY } : {});
let app, mounted = false;
function changeWorld(transform, message) {
  store.syncCareer(app.getState());
  const previous = store.getWorld(), next = model.step(transform(previous));
  if (next === previous) { worldFeedback('That change is not available yet. Check the career and team requirements.'); return; }
  store.updateWorld(next);
  const saved = app.replaceState(activeCitizen(next).career);
  renderWorldUI(store.getWorld(), { force: true, metrics: model.metrics(store.getWorld()) });
  if (infraMode) renderInfrastructureUI(store.getWorld());
  worldFeedback(saved ? message : "Changed in this tab, but browser storage is unavailable. Export your world before closing.");
}
const handlers = {
  add(name, origin) {
    changeWorld(world => addCitizen(world, name, origin), 'A new citizen is ready. Everyone else keeps their career and contribution.');
    document.querySelector('#citizen-name').value = '';
    document.querySelector('#world-overview').open = false;
    document.querySelector('#active-citizen-heading').scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  switch(id) {
    changeWorld(world => switchCitizen(world, id), 'You are continuing this citizen’s professional life.');
    document.querySelector('#world-overview').open = false;
    document.querySelector('#active-citizen-heading').scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  assign(id, assignment, availability) { changeWorld(world => assignCitizen(world, id, assignment, availability), 'Work assignment updated. World capacity has been recalculated.'); },
  rename(name) { changeWorld(world => renameWorld(world, name), 'World name saved.'); },
  commission(id) { changeWorld(world => commissionProject(world, id), 'Shared project commissioned once. The institution remains; contributors return to their usual services.'); },
  export() { store.syncCareer(app.getState()); downloadJSON(store.getWorld(), infraMode ? 'career-engine-world-infra.json' : 'career-engine-world.json'); worldFeedback('World backup exported.'); },
  async import(file) {
    try {
      const next = model.hydrate(JSON.parse(await file.text()));
      if (!window.confirm('Replace this world with the imported backup? Export your current world first if you want to keep it.')) return;
      changeWorld(() => next, 'World backup imported.');
    } catch (error) { worldFeedback(`Import could not be completed: ${error.message}`); }
  },
};
try {
  app = startCareerApp({
    mode: 'world', store,
    onAddCitizen() { document.querySelector('#world-overview').open = true; document.querySelector('#citizen-name').focus(); document.querySelector('#add-citizen-form').scrollIntoView({ behavior: 'smooth', block: 'center' }); },
    onChange(career) {
      store.syncCareer(career);
      if (!mounted) {
        mountWorldUI(handlers);
        if (infraMode) mountInfrastructureUI(scenario => {
          try { changeWorld(world => withHistoricalScenario(world, scenario), 'Historical starting infrastructure added.'); }
          catch (error) { worldFeedback(error.message); }
        });
        mounted = true;
      }
      renderWorldUI(store.getWorld(), { metrics: model.metrics(store.getWorld()) });
      if (infraMode) renderInfrastructureUI(store.getWorld());
    },
  });
  // Persist the initial world/import marker without touching the original single-path save.
  app.save();
} catch (error) { showLoadError(error); }
