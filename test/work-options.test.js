import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, chooseNode, currentLearningActivity, currentNode, currentProject, completeLearningActivity, completeProject, completeBranchWork, completeImpactAction, tick } from '../src/game-engine.js';
import { workOptionsForState, completedWorkForState } from '../src/work-options.js';
function train(state) {
  while (currentLearningActivity(state)) {
    const a = currentLearningActivity(state);
    state = completeLearningActivity(state, currentNode(state).id, a.index, a.choices[1].id);
  }
  return state;
}
function projects(state) {
  while (currentProject(state)) {
    state = { ...state, mastery: Math.max(state.mastery, currentProject(state).requirement) };
    state = completeProject(state);
  }
  return state;
}
function role() {
  let state = projects(train(chooseNode(createInitialState(), 'trades')));
  return projects(train(chooseNode(state, 'service-plumber')));
}
test('one mixed work stream opens the next path after five actions without extra training or projects', () => {
  assert.equal(workOptionsForState(createInitialState()).options.length, 0);
  let state = chooseNode(createInitialState(), 'engineering');
  for (let index = 0; index < 5; index++) {
    const view = workOptionsForState(state);
    assert.equal(view.phase, 'branch-work');
    assert.equal(view.progress.value, index);
    assert.equal(view.progress.total, 5);
    assert.equal(view.options.length, currentNode(state).children.length);
    assert.ok(view.options.some(c => c.kind === 'training'));
    assert.ok(view.options.some(c => c.kind === 'project'));
    assert.ok(view.options.every(c => c.enabled));
    const choice = view.options[0];
    state = completeBranchWork(state, choice.id);
    assert.equal(completedWorkForState(state).at(-1).title, choice.title);
  }
  assert.equal(workOptionsForState(state).phase, 'choose-path');
  assert.equal(workOptionsForState(state).options.length, 0);
});
test('only the next available impact milestone is offered and all three choices advance it', () => {
  for (let index = 0; index < 3; index++) {
    let state = { ...role(), mastery: 0 };
    assert.equal(workOptionsForState(state).phase, 'waiting');
    for (const milestone of currentNode(state).impactActions) {
      state = { ...state, mastery: milestone.requirement };
      const view = workOptionsForState(state);
      assert.equal(view.phase, 'impact');
      assert.equal(view.options.length, 3);
      assert.ok(view.options.every(o => o.actionId === milestone.id));
      const choice = view.options[index];
      state = completeImpactAction(state, choice.actionId, choice.id);
      assert.equal(completedWorkForState(state).at(-1).title, choice.title);
    }
    state = tick({ ...state, mastery: 10000 }, 1);
    assert.equal(workOptionsForState(state).phase, 'complete');
    assert.equal(workOptionsForState(state).options.length, 0);
  }
});
test('legacy choice histories retain completed work records', () => {
  const state = role();
  const legacy = { ...state, learningChoices: undefined, impactChoices: undefined };
  assert.equal(completedWorkForState(legacy).length, completedWorkForState(state).length);
  assert.ok(completedWorkForState(legacy).every(record => record.title));
});

test('old choice IDs preserve the tasks players actually completed', () => {
  const legacy = {
    ...chooseNode(createInitialState(), 'engineering'),
    completedLearningKeys: ['engineering:0'],
    learningChoices: { 'engineering:0': 'engineering:learning:0:investigate' },
  };
  assert.equal(completedWorkForState(legacy)[0].title, 'Investigate: Frame a requirement');
  const choice = workOptionsForState(chooseNode(createInitialState(), 'engineering')).options[1];
  const fresh = completeBranchWork(chooseNode(createInitialState(), 'engineering'), choice.id);
  assert.equal(completedWorkForState(fresh)[0].title, choice.title);
});
