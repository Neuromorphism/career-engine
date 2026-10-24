import test from 'node:test';
import assert from 'node:assert/strict';
import { branchProjectsFor, branchChoiceSummary, shuffledOptions } from '../src/branch-projects.js';
import { createInitialState, chooseNode, currentNode, currentProject, currentLearningActivity, completeLearningActivity, completeProject, choicesUnlocked, hydrateState } from '../src/game-engine.js';
import { workOptionsForState, completedWorkForState } from '../src/work-options.js';

function prepared() {
  let state = chooseNode(createInitialState(), 'engineering');
  while (currentLearningActivity(state)) state = completeLearningActivity(state, 'engineering', currentLearningActivity(state).index);
  state = { ...state, mastery: 1000 };
  return state;
}

test('each project round offers exactly one meaningful task for every next branch', () => {
  const state = prepared(), node = currentNode(state);
  const rounds = branchProjectsFor(node);
  assert.equal(rounds.length, 5);
  for (const round of rounds) {
    assert.deepEqual(round.choices.map(c => c.branchId), node.children.map(c => c.id));
    assert.equal(new Set(round.choices.map(c => c.id)).size, node.children.length);
    for (const choice of round.choices) {
      assert.ok(choice.title && choice.description && choice.deliverable);
    }
  }
  assert.deepEqual(new Set(workOptionsForState(state).options.map(c => c.id)), new Set(rounds[0].choices.map(c => c.id)));
});

test('distribution counts real selections, survives reload, includes zero counts, and permits every branch', () => {
  let state = prepared();
  const node = currentNode(state);
  const chosen = [0, 1, 0, 1, 0];
  assert.equal(branchChoiceSummary(state, node), null);
  for (let round = 0; round < 5; round++) {
    const project = currentProject(state);
    const before = state;
    assert.equal(completeProject(state, 'invalid'), state);
    state = completeProject(state, project.choices[chosen[round]].id);
    assert.notEqual(state, before);
    state = hydrateState(state);
    if (round < 4) {
      assert.equal(branchChoiceSummary(state, node), null);
      assert.equal(choicesUnlocked(state), false);
    }
  }
  const summary = branchChoiceSummary(state, node);
  assert.equal(summary.total, 5);
  assert.deepEqual(summary.branches.slice(0, 3).map(b => [b.count, b.percent]), [[3, 60], [2, 40], [0, 0]]);
  assert.equal(currentProject(state), null);
  assert.equal(choicesUnlocked(state), true);
  for (const branch of node.children) assert.equal(currentNode(chooseNode(state, branch.id)).id, branch.id);
  assert.equal(completedWorkForState(state).filter(r => r.kind === 'Branch work sample').length, 5);
});

test('shuffling changes positions without changing identities or mutating inputs', () => {
  const options = [{id: 'a'}, {id: 'b'}, {id: 'c'}];
  const shuffled = shuffledOptions(options, () => 0);
  assert.deepEqual(options.map(c => c.id), ['a', 'b', 'c']);
  assert.notDeepEqual(shuffled, options);
  assert.deepEqual(new Set(shuffled), new Set(options));
});

test('legacy branch briefs remain complete without fabricated task preferences', () => {
  const state = { ...prepared(), completedProjectKeys: ['engineering:0'] };
  assert.equal(currentProject(state), null);
  assert.equal(choicesUnlocked(state), true);
  assert.equal(branchChoiceSummary(state, currentNode(state)), null);
});
