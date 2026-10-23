import test from 'node:test';
import assert from 'node:assert/strict';
import { installEngineeringEdition, jobId } from '../engineering/install.js';
import { engineeringFamilies } from '../engineering/catalog.js';
installEngineeringEdition();
const { professionById, trainingRouteFor, selectProfessionGoal } = await import('../src/discovery.js?v=0.11.1');
const { careerTree, curricula } = await import('../src/career-data.js?v=0.11.1');
const { createInitialState, hydrateState, availableChoices } = await import('../src/game-engine.js?v=0.11.1');
const { createCareerStore } = await import('../src/save-store.js?v=0.11.1');

test('engineering edition indexes every specialist job and its distinct work cases', () => {
  assert.equal(careerTree.length, 1);
  assert.equal(careerTree[0].id, 'engineering');
  const ids = new Set();
  for (const [, jobs] of engineeringFamilies) for (const [title] of jobs) {
    const id = jobId(title);
    assert.ok(!ids.has(id)); ids.add(id);
    const role = professionById.get(id);
    assert.equal(role.label, title);
    assert.equal(trainingRouteFor(id).at(-1).id, id);
    const state = selectProfessionGoal(createInitialState(), id);
    assert.equal(state.targetOccupationId, id);
    const path = role.trainingRoute.map(n => n.id);
    assert.deepEqual(hydrateState({ ...state, path }).path, path);
    assert.equal(role.node.projects.length, 3);
    for (const activity of curricula[id].activities) assert.equal(new Set(activity.choices.map(c => c.task_subject)).size, 3);
    assert.deepEqual(role.node.impactActions.map(a => a.requirement), [300, 2000, 7000]);
  }
  assert.ok(ids.size >= 70);
  assert.deepEqual(availableChoices(createInitialState()).map(n => n.id), ['engineering']);
});

test('engineering saves are isolated and never inherit normal or legacy saves', () => {
  const values = new Map([['career-engine-save-v3', JSON.stringify({ ...createInitialState(), mastery: 321 })], ['career-engine-save-v2', '{bad legacy data']]);
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const store = createCareerStore('engineering', storage);
  assert.equal(store.load().mastery, 0);
  store.save({ ...createInitialState(), mastery: 456 });
  assert.equal(store.load().mastery, 456);
  assert.equal(JSON.parse(values.get('career-engine-save-v3')).mastery, 321);
});

test('every new job can complete training, projects, and all contribution milestones', async () => {
  const engine = await import('../src/game-engine.js?v=0.11.1');
  for (const [, jobs] of engineeringFamilies) for (const [title] of jobs) {
    let state = createInitialState();
    for (const node of trainingRouteFor(jobId(title))) {
      state = engine.chooseNode(state, node.id);
      assert.equal(engine.currentNode(state).id, node.id);
      let activity;
      while ((activity = engine.currentLearningActivity(state))) {
        const next = engine.completeLearningActivity(state, node.id, activity.index);
        assert.notEqual(next, state); state = next;
      }
      let project;
      while ((project = engine.currentProject(state))) {
        state = { ...state, mastery: Math.max(state.mastery, project.requirement) };
        const next = engine.completeProject(state);
        assert.notEqual(next, state); state = next;
      }
    }
    state = { ...state, mastery: 10000 };
    for (const action of engine.currentNode(state).impactActions) {
      const next = engine.completeImpactAction(state, action.id, action.choices[0].id);
      assert.notEqual(next, state, `${title}: ${action.id}`); state = next;
    }
    assert.equal(state.completedImpactKeys.length, 3);
  }
});
