import test from "node:test";
import assert from "node:assert/strict";
import { careerTree } from "../src/careers.js";
import {
  GOAL_MASTERY,
  aiPracticeRate,
  aiRivalStatus,
  availableChoices,
  choicesUnlocked,
  chooseNode,
  completeLearningActivity,
  completeProject,
  createInitialState,
  currentLearningActivity,
  currentNode,
  currentProject,
  goalProgress,
  hydrateState,
  isLeaf,
  learningTrackComplete,
  learningTrackForNode,
  practiceRate,
  tick,
  work,
} from "../src/game-engine.js";

function completeTraining(state) {
  let next = state;
  while (currentLearningActivity(next)) {
    const activity = currentLearningActivity(next);
    next = completeLearningActivity(next, currentNode(next).id, activity.index);
  }
  return next;
}

function chooseAndComplete(state, nodeId) {
  let next = completeTraining(chooseNode(state, nodeId));
  const project = currentProject(next);
  next = { ...next, mastery: Math.max(next.mastery, project.requirement) };
  return completeProject(next);
}

test("the first interaction is a choice among six fields", () => {
  const state = createInitialState();
  assert.equal(state.path.length, 0);
  assert.deepEqual(availableChoices(state).map((node) => node.name), [
    "Engineering", "Medicine", "Law", "Skilled Trades", "Science", "Business",
  ]);
  assert.equal(work(state), state);
});

test("choosing a field immediately starts its small starter project", () => {
  const state = chooseNode(createInitialState(), "engineering");
  assert.deepEqual(state.path, ["engineering"]);
  assert.equal(currentProject(state).title, "Compare a shelf bracket");
});

test("the next specialization stays locked until training and the applied brief are complete", () => {
  let state = chooseNode(createInitialState(), "engineering");
  assert.equal(availableChoices(state).length, 3);
  assert.equal(choicesUnlocked(state), false);
  assert.equal(chooseNode(state, "electrical-engineering"), state);
  state = { ...state, mastery: 100 };
  assert.equal(completeProject(state), state);
  state = completeTraining(state);
  assert.equal(learningTrackComplete(state), true);
  state = completeProject(state);
  assert.equal(choicesUnlocked(state), true);
  state = chooseNode(state, "electrical-engineering");
  assert.equal(currentNode(state).name, "Electrical Engineering");
});

test("a long branch can reach the specific GPU RTL job leaf", () => {
  let state = createInitialState();
  for (const id of ["engineering", "electrical-engineering", "digital-design", "vlsi-design"]) {
    state = chooseAndComplete(state, id);
  }
  state = chooseNode(state, "gpu-rtl-design-engineer");
  assert.equal(isLeaf(state), true);
  assert.equal(currentNode(state).jobTitle, "GPU RTL Design Engineer");
  assert.equal(currentProject(state).title, "Specify a two-client GPU arbiter");
  assert.equal(currentNode(state).evidence.some((item) => item.type === "job_posting"), true);
});

test("short branches can reach a job after one specialization decision", () => {
  let state = chooseAndComplete(createInitialState(), "trades");
  state = chooseNode(state, "service-plumber");
  assert.equal(isLeaf(state), true);
  assert.deepEqual(state.path, ["trades", "service-plumber"]);
});

test("completed learning activities produce mastery over time", () => {
  let state = chooseNode(createInitialState(), "science");
  state = work(state);
  assert.equal(state.mastery, 1);
  assert.equal(practiceRate(state), 0.04);
  state = tick(state, 10);
  assert.equal(state.mastery, 1.4);
});

test("medical specialties require medical school completion", () => {
  let state = chooseNode(createInitialState(), "medicine");
  assert.equal(availableChoices(state).some((node) => node.id === "surgery"), true);
  assert.equal(chooseNode(state, "surgery"), state);
  state = completeTraining(state);
  state = completeProject(state);
  state = chooseNode(state, "surgery");
  assert.equal(currentNode(state).name, "Surgery");
});

test("surgical cases are sequential and locked behind the residency milestone", () => {
  let state = chooseAndComplete(createInitialState(), "medicine");
  state = chooseNode(state, "surgery");
  const track = learningTrackForNode(currentNode(state), state.path.length);
  assert.equal(track.activities[0].title, "Begin surgical residency");
  assert.equal(currentLearningActivity(state).title, "Begin surgical residency");
  assert.equal(completeLearningActivity(state, "surgery", 2), state);
  state = completeLearningActivity(state, "surgery", 0);
  assert.equal(currentLearningActivity(state).title, "Evaluate a surgical consult");
});

test("the AI rival pauses for supervised surgical practice", () => {
  let state = chooseAndComplete(createInitialState(), "medicine");
  state = chooseNode(state, "surgery");
  assert.equal(aiPracticeRate(state), 0);
  assert.match(aiRivalStatus(state).headline, /not allowed to operate/i);
});

test("the AI rival accelerates on basic corporate contract work", () => {
  let state = chooseAndComplete(createInitialState(), "law");
  state = chooseNode(state, "corporate-associate");
  assert.ok(aiPracticeRate(state) >= 4);
  assert.match(aiRivalStatus(state).headline, /contract templates/i);
  assert.match(aiRivalStatus(state).detail, /benefits/i);
});

test("AI mode advances the rival and records when it wins", () => {
  let state = chooseNode(createInitialState(), "engineering");
  state = tick(state, 10, { aiMode: true });
  assert.equal(state.aiMastery, 7.5);
  state = { ...state, aiMastery: GOAL_MASTERY - 1 };
  state = tick(state, 2, { aiMode: true });
  assert.equal(state.aiMastery, GOAL_MASTERY);
  assert.equal(state.raceWinner, "ai");
});

test("the run completes only at 10,000 mastery and full job depth", () => {
  let state = createInitialState();
  for (const id of ["engineering", "electrical-engineering", "digital-design", "vlsi-design"]) {
    state = chooseAndComplete(state, id);
  }
  state = { ...state, mastery: GOAL_MASTERY };
  assert.equal(state.careerComplete, false);
  assert.equal(goalProgress(state), 1);
  state = chooseNode(state, "gpu-rtl-design-engineer");
  assert.equal(state.careerComplete, false);
  state = completeTraining(state);
  while (currentProject(state)) state = completeProject(state);
  assert.equal(state.careerComplete, true);
});

test("legacy saves keep mastery without reviving retired systems", () => {
  const state = hydrateState({ mastery: 37, insight: 99, impact: 12, constellation: { analyze: 8 }, path: [] });
  assert.equal(state.mastery, 37);
  assert.equal("insight" in state, false);
  assert.equal("impact" in state, false);
  assert.equal("constellation" in state, false);
  assert.equal("upgrades" in state, false);
});

test("legacy paths treat previously passed training stages as complete", () => {
  const state = hydrateState({
    mastery: 22,
    path: ["engineering", "electrical-engineering", "digital-design"],
    completedProjectKeys: ["engineering:0", "electrical-engineering:0"],
  });
  const priorKeys = learningTrackForNode(careerTree[0], 1).activities.map((activity) => activity.key);
  assert.equal(priorKeys.every((key) => state.completedLearningKeys.includes(key)), true);
  assert.equal(currentLearningActivity(state).title, "Minimize a control function");
});

test("all tree ids are unique and every node has a specific curriculum", () => {
  const ids = [];
  const leaves = [];
  const visit = (nodes) => nodes.forEach((node) => {
    ids.push(node.id);
    assert.ok(learningTrackForNode(node)?.activities.length >= 4, `${node.id} needs a substantive curriculum`);
    if (node.children?.length) visit(node.children);
    else leaves.push(node);
  });
  visit(careerTree);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(leaves.every((node) => node.jobTitle && node.projects?.length && node.evidence?.length), true);
});
