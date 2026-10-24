import test from 'node:test';
import assert from 'node:assert/strict';
import { branchProjectsFor, branchChoiceSummary, shuffledOptions } from '../src/branch-projects.js';
import { createInitialState, chooseNode, currentNode, currentProject, currentLearningActivity, completeLearningActivity, completeProject, completeBranchWork, choicesUnlocked, hydrateState } from '../src/game-engine.js';
import { workOptionsForState, completedWorkForState } from '../src/work-options.js';

function prepared() {
  let state = chooseNode(createInitialState(), 'engineering');
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
  const chosen = [0, 0, 1, 1, 0];
  assert.equal(branchChoiceSummary(state, node), null);
  for (let round = 0; round < 5; round++) {
    const project = currentProject(state);
    const before = state;
    assert.equal(completeBranchWork(state, 'invalid'), state);
    state = completeBranchWork(state, project.choices[chosen[round]].id);
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
  assert.equal(completedWorkForState(state).length, 5);
  assert.equal(state.actions, 5);
  assert.ok(completedWorkForState(state).some(r => r.kind === 'Training'));
  assert.ok(completedWorkForState(state).some(r => r.kind === 'Branch work sample'));
  assert.equal(currentLearningActivity(state), null);
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

test('partial legacy training counts toward the five-action limit after reload', () => {
  let state = prepared();
  for (let i = 0; i < 3; i++) state = completeLearningActivity(state, 'engineering', currentLearningActivity(state).index);
  assert.equal(workOptionsForState(state).progress.value, 3);
  for (let i = 0; i < 2; i++) {
    state = completeBranchWork(state, workOptionsForState(state).options[0].id);
    state = hydrateState(state);
  }
  assert.equal(state.actions, 5);
  assert.equal(choicesUnlocked(state), true);
  assert.equal(currentProject(state), null);
  assert.equal(currentLearningActivity(state), null);
  const summary = branchChoiceSummary(state, currentNode(state));
  assert.equal(summary.unmapped, 3);
  assert.equal(summary.branches.reduce((sum, b) => sum + b.count, 0), 2);
});

test('every family reaches its next choice in exactly five UI work actions', async () => {
  const { careerTree } = await import('../src/careers.js');
  const { practiceRate } = await import('../src/game-engine.js');
  let families = 0;
  function visit(nodes, parentState) {
    for (const node of nodes) {
      let state = chooseNode(parentState, node.id);
      assert.equal(currentNode(state).id, node.id);
      if (!node.children?.length) continue;
      families++;
      const initialActions = state.actions;
      for (let i = 0; i < 5; i++) {
        const view = workOptionsForState(state);
        assert.equal(view.phase, 'branch-work');
        assert.equal(view.progress.value, i);
        assert.equal(choicesUnlocked(state), false);
        assert.deepEqual(new Set(view.options.map(c => c.branchId)), new Set(node.children.map(c => c.id)));
        const choice = view.options[0];
        const previous = state;
        state = hydrateState(completeBranchWork(state, choice.id));
        assert.ok(state.mastery > previous.mastery);
        assert.ok(practiceRate(state) > practiceRate(previous));
        assert.equal(completeBranchWork(state, choice.id), state);
      }
      assert.equal(state.actions - initialActions, 5);
      assert.equal(choicesUnlocked(state), true);
      assert.equal(workOptionsForState(state).phase, 'choose-path');
      assert.equal(currentLearningActivity(state), null);
      assert.equal(currentProject(state), null);
      assert.equal(branchChoiceSummary(state, node).unmapped, 0);
      visit(node.children, state);
    }
  }
  visit(careerTree, createInitialState());
  assert.ok(families > 50);
});
