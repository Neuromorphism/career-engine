import test from "node:test";
import assert from "node:assert/strict";
import { upgrades } from "../src/careers.js";
import {
  canChooseField,
  chooseField,
  chooseSpecialty,
  completeProject,
  createInitialState,
  explore,
  practiceRate,
  purchaseUpgrade,
  tick,
  work,
} from "../src/game-engine.js";

test("exploration builds insight and the chosen constellation axis", () => {
  const initial = createInitialState();
  const next = explore(initial, "build", "made something");
  assert.equal(next.insight, 1);
  assert.equal(next.constellation.build, 1);
  assert.equal(next.lastMessage, "made something");
});

test("a field unlocks at twelve insight", () => {
  let state = createInitialState();
  for (let i = 0; i < 12; i += 1) state = explore(state, "analyze", "observe");
  assert.equal(canChooseField(state), true);
  state = chooseField(state, "engineering");
  assert.equal(state.field, "engineering");
});

test("manual practice leads to a specialty", () => {
  let state = { ...createInitialState(), insight: 12 };
  state = chooseField(state, "medicine");
  for (let i = 0; i < 20; i += 1) state = work(state);
  state = chooseSpecialty(state, "family");
  assert.equal(state.specialty, "family");
  assert.equal(state.mastery, 20);
});

test("purchased upgrades produce mastery over time", () => {
  let state = { ...createInitialState(), insight: 20, field: "law" };
  state = purchaseUpgrade(state, "notebook");
  assert.equal(practiceRate(state), upgrades[0].rate);
  state = tick(state, 10);
  assert.equal(state.mastery, 2.5);
});

test("projects reward impact without spending mastery", () => {
  let state = { ...createInitialState(), field: "trades", mastery: 20 };
  state = completeProject(state);
  assert.equal(state.completedProjects, 1);
  assert.equal(state.impact, 12);
  assert.equal(state.mastery, 20);
});
