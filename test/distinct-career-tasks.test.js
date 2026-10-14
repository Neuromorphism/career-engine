import test from 'node:test';
import assert from 'node:assert/strict';
import { careerTree, findNodeById } from '../src/careers.js';
import { learningTrackForNode, createInitialState, chooseNode, completeLearningActivity, hydrateState, practiceRate } from '../src/game-engine.js';
import { completedWorkForState } from '../src/work-options.js';

test('all stages offer different task subjects rather than approaches to the same task', () => {
  let training = 0, impact = 0;
  function visit(nodes) {
    for (const node of nodes) {
      for (const stage of [...learningTrackForNode(node).activities, ...(node.impactActions || [])]) {
        assert.equal(stage.choices.length, 3);
        assert.equal(new Set(stage.choices.map(c => c.task_subject.toLowerCase())).size, 3, node.id);
        for (const choice of stage.choices) {
          assert.doesNotMatch(choice.title, /^(Investigate:|Rehearse together:|Improve the evidence for:|Prepare a team for:)/);
          assert.ok(choice.legacy_title);
        }
      }
      training += learningTrackForNode(node).activities.length;
      impact += (node.impactActions || []).length;
      visit(node.children || []);
    }
  }
  visit(careerTree);
  assert.equal(training, 1077);
  assert.equal(impact, 546);
});

test('career choices reveal different concrete work in engineering, medicine, law, and arts', () => {
  const engineering = learningTrackForNode(findNodeById('engineering').node).activities[0].choices;
  assert.deepEqual(engineering.map(c => c.title), ['Frame a requirement', 'Build a solar-powered lamp', 'Improve an evacuation route']);
  for (const stage of findNodeById('cardiac-surgeon').node.impactActions) {
    assert.match(stage.choices[0].title, /coronary bypass/i);
    assert.match(stage.choices[1].title, /heart valve/i);
    assert.match(stage.choices[2].title, /aortic aneurysm/i);
    assert.ok(stage.choices.slice(1).every(c => !c.modelId));
  }
  assert.match(findNodeById('legal-aid-attorney').node.impactActions[0].choices[2].title, /disability benefits/i);
  assert.match(findNodeById('musician').node.impactActions[0].choices[1].title, /score/i);
  assert.match(findNodeById('musician').node.impactActions[0].choices[2].title, /ensemble/i);
});

test('new task history persists across reload while legacy practice rates stay unchanged', () => {
  const start = chooseNode(createInitialState(), 'engineering');
  const first = learningTrackForNode(findNodeById('engineering').node).activities[0];
  const next = completeLearningActivity(start, 'engineering', 0, first.choices[2].id);
  const restored = hydrateState(JSON.parse(JSON.stringify(next)));
  assert.equal(completedWorkForState(restored)[0].title, 'Improve an evacuation route');
  assert.equal(practiceRate(restored), practiceRate(next));
  delete restored.learningChoiceTitles;
  const legacy = hydrateState(restored);
  assert.equal(completedWorkForState(legacy)[0].title, 'Rehearse together: Frame a requirement');
  assert.equal(practiceRate(legacy), practiceRate(next));
});
