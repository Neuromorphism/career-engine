import test from "node:test";
import assert from "node:assert/strict";
import { careerTree, upgrades } from "../src/careers.js";
import {
  GOAL_MASTERY,
  availableChoices,
  choicesUnlocked,
  chooseNode,
  completeProject,
  createInitialState,
  currentNode,
  currentProject,
  goalProgress,
  hydrateState,
  isLeaf,
  practiceRate,
  purchaseUpgrade,
  tick,
  work,
} from "../src/game-engine.js";

function chooseAndComplete(state, nodeId) {
  let next = chooseNode(state, nodeId);
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
  assert.equal(state.constellation.analyze, 1);
  assert.equal(state.constellation.build, 1);
});

test("the next specialization is exposed but locked until the starter brief is complete", () => {
  let state = chooseNode(createInitialState(), "engineering");
  assert.equal(availableChoices(state).length, 3);
  assert.equal(choicesUnlocked(state), false);
  assert.equal(chooseNode(state, "electrical-engineering"), state);
  for (let i = 0; i < 3; i += 1) state = work(state);
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

test("purchased upgrades produce mastery over time", () => {
  let state = chooseNode(createInitialState(), "science");
  state = { ...state, mastery: 12 };
  state = purchaseUpgrade(state, "notebook");
  assert.equal(state.mastery, 4);
  assert.equal(practiceRate(state), upgrades[0].rate);
  state = tick(state, 10);
  assert.equal(state.mastery, 6);
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
  assert.equal(state.careerComplete, true);
});

test("legacy saves keep mastery without reviving retired score currencies", () => {
  const state = hydrateState({ mastery: 37, insight: 99, impact: 12, path: [] });
  assert.equal(state.mastery, 37);
  assert.equal("insight" in state, false);
  assert.equal("impact" in state, false);
});

test("all tree ids are unique and every leaf has projects and evidence", () => {
  const ids = [];
  const leaves = [];
  const visit = (nodes) => nodes.forEach((node) => {
    ids.push(node.id);
    if (node.children?.length) visit(node.children);
    else leaves.push(node);
  });
  visit(careerTree);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(leaves.every((node) => node.jobTitle && node.projects?.length && node.evidence?.length), true);
});
