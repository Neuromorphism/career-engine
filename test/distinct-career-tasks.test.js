import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { careerTree, findNodeById } from '../src/careers.js';
import { learningTrackForNode, createInitialState, chooseNode, completeLearningActivity, hydrateState, practiceRate } from '../src/game-engine.js';
import { completedWorkForState } from '../src/work-options.js';
const legacyNodes = new Set(Object.values(JSON.parse(readFileSync(new URL('./fixtures/legacy-profession-paths.json',import.meta.url),'utf8'))).flat());

test('all stages offer different task subjects rather than approaches to the same task', () => {
  let training = 0, impact = 0;
  function visit(nodes) {
    for (const node of nodes) {
      for (const stage of [...learningTrackForNode(node).activities, ...(node.impactActions || [])]) {
        assert.equal(stage.choices.length, 3);
        assert.equal(new Set(stage.choices.map(c => c.task_subject.toLowerCase())).size, 3, node.id);
        for (const choice of stage.choices) {
          assert.doesNotMatch(choice.title, /^(Investigate:|Rehearse together:|Improve the evidence for:|Prepare a team for:)/);
          if (legacyNodes.has(node.id)) assert.ok(choice.legacy_title);
        }
      }
      training += learningTrackForNode(node).activities.length;
      impact += (node.impactActions || []).length;
      visit(node.children || []);
    }
  }
  visit(careerTree);
  assert.equal(training, 3252);
  assert.equal(impact, 1851);
});

test('career choices reveal different concrete work in engineering, medicine, law, and arts', () => {
  const engineering = learningTrackForNode(findNodeById('engineering').node).activities[0].choices;
  assert.deepEqual(engineering.map(c => c.title), ['Frame a requirement', 'Build a solar-powered lamp', 'Survey escape routes in a crowded community hall']);
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
  assert.equal(completedWorkForState(restored)[0].title, 'Survey escape routes in a crowded community hall');
  assert.equal(practiceRate(restored), practiceRate(next));
  delete restored.learningChoiceTitles;
  const legacy = hydrateState(restored);
  assert.equal(completedWorkForState(legacy)[0].title, 'Rehearse together: Frame a requirement');
  assert.equal(practiceRate(legacy), practiceRate(next));
});

test('every recurring work subject advances through distinct contextual titles', () => {
  function visit(nodes) {
    for (const node of nodes) {
      for (const stage of [...learningTrackForNode(node).activities, ...(node.impactActions || [])]) {
        for (const choice of stage.choices) {
          assert.doesNotMatch(choice.title, /^(Start|Plan|Practice|Verify|Adapt|Lead a program|Build a lasting institution):/);
          assert.doesNotMatch(choice.title, /^(Record a trial of|Find failure cases in|Rework .* under new constraints|Document the outcome of|Review lessons from|Scope a )/);
        }
      }
      for (const stages of [learningTrackForNode(node).activities, node.impactActions || []]) {
        const subjects = new Map();
        for (const stage of stages) for (const choice of stage.choices) {
          const subject = choice.task_subject.replace(/^(Explore|Plan|Practice|Verify|Adapt): /, '');
          const titles = subjects.get(subject) || new Set();
          assert.ok(!titles.has(choice.title), `${node.id}: repeated ${choice.title}`);
          titles.add(choice.title);
          subjects.set(subject, titles);
        }
      }
      visit(node.children || []);
    }
  }
  visit(careerTree);
});

test('evacuation and runaway-reaction titles describe different scenario decisions', () => {
  const evacuation = learningTrackForNode(findNodeById('engineering').node).activities.map(a => a.choices[2].title);
  assert.deepEqual(evacuation, [
    'Survey escape routes in a crowded community hall',
    'Sketch exits for a crowded community hall',
    'Walk through a step-free evacuation route',
    'Check escape capacity with one stair blocked',
    'Reroute the hall evacuation after an exit closes',
  ]);
  const runaway = learningTrackForNode(findNodeById('chemical-engineering').node).activities.map(a => a.choices[2].title);
  assert.deepEqual(runaway, [
    'Identify runaway risks in an accelerating batch reaction',
    'Compare cooling and relief options for an accelerating batch',
    'Simulate a cooling failure during the batch reaction',
    'Check relief capacity against the runaway heat release',
  ]);
});

test('known retired training labels refresh in history without changing saved records', () => {
  let state = chooseNode(createInitialState(), 'engineering');
  const track = learningTrackForNode(findNodeById('engineering').node);
  for (const activity of track.activities) {
    const choice = activity.choices[2];
    state = completeLearningActivity(state, 'engineering', activity.index, choice.id);
  }
  const oldTitles = [
    'Improve an evacuation route', 'Plan: Improve an evacuation route',
    'Practice: Improve an evacuation route', 'Verify: Improve an evacuation route',
    'Adapt: Improve an evacuation route',
  ];
  track.activities.forEach((a, i) => { state.learningChoiceTitles[a.key] = oldTitles[i]; });
  const stored = JSON.stringify(state);
  assert.deepEqual(completedWorkForState(state).map(r => r.title), track.activities.map(a => a.choices[2].title));
  assert.equal(JSON.stringify(state), stored);
  state.learningChoiceTitles[track.activities[0].key] = 'A distinct historical task';
  assert.equal(completedWorkForState(state)[0].title, 'A distinct historical task');
});

test('vaccination work develops the conversation rather than repeating its label', () => {
  const track = learningTrackForNode(findNodeById('medicine').node);
  assert.deepEqual(track.activities.map(a => a.choices[2].title), [
    'Prepare for a vaccination conversation',
    'Plan how to address questions and concerns',
    'Practice explaining benefits and risks',
    'Verify accuracy and check understanding',
    'Adapt your approach to the patient’s needs',
  ]);
});
