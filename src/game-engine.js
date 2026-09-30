import { AXES, fields, upgrades } from "./careers.js";

export const SAVE_KEY = "career-engine-save-v1";

export function createInitialState() {
  return {
    insight: 0,
    mastery: 0,
    impact: 0,
    actions: 0,
    field: null,
    specialty: null,
    constellation: Object.fromEntries(AXES.map((axis) => [axis, 0])),
    upgrades: {},
    completedProjects: 0,
    lastMessage: "You do not need to know what you want to be. Begin with a verb.",
    savedAt: Date.now(),
  };
}

export function hydrateState(input) {
  const fresh = createInitialState();
  if (!input || typeof input !== "object") return fresh;
  const state = {
    ...fresh,
    ...input,
    constellation: { ...fresh.constellation, ...(input.constellation || {}) },
    upgrades: { ...(input.upgrades || {}) },
  };
  if (!fields[state.field]) {
    state.field = null;
    state.specialty = null;
  }
  return state;
}

export function practiceRate(state) {
  return upgrades.reduce((rate, upgrade) => rate + (state.upgrades[upgrade.id] ? upgrade.rate : 0), 0);
}

export function canChooseField(state) {
  return !state.field && state.insight >= 12;
}

export function canChooseSpecialty(state) {
  return Boolean(state.field && !state.specialty && state.mastery >= 20);
}

export function explore(state, axis, message) {
  if (!AXES.includes(axis) || state.field) return state;
  return {
    ...state,
    insight: state.insight + 1,
    actions: state.actions + 1,
    constellation: { ...state.constellation, [axis]: state.constellation[axis] + 1 },
    lastMessage: message,
  };
}

export function chooseField(state, fieldId) {
  if (!fields[fieldId] || !canChooseField(state)) return state;
  return {
    ...state,
    field: fieldId,
    lastMessage: `${fields[fieldId].name} selected. You are choosing a lens for this run, not signing a lifetime contract.`,
  };
}

export function work(state) {
  if (!state.field) return state;
  const field = fields[state.field];
  const constellation = { ...state.constellation };
  field.axes.forEach((axis) => { constellation[axis] += 0.2; });
  return {
    ...state,
    insight: state.insight + 0.25,
    mastery: state.mastery + 1,
    actions: state.actions + 1,
    constellation,
    lastMessage: field.workDescription,
  };
}

export function chooseSpecialty(state, specialtyId) {
  if (!canChooseSpecialty(state)) return state;
  const specialty = fields[state.field].specialties.find((item) => item.id === specialtyId);
  if (!specialty) return state;
  return {
    ...state,
    specialty: specialtyId,
    lastMessage: `${specialty.name} unlocked. Deeper knowledge reveals more specific problems—and more people to learn from.`,
  };
}

export function canPurchase(state, upgrade) {
  return !state.upgrades[upgrade.id]
    && state.insight >= upgrade.cost
    && state.mastery >= upgrade.masteryRequired
    && (!upgrade.specialtyRequired || state.specialty);
}

export function purchaseUpgrade(state, upgradeId) {
  const upgrade = upgrades.find((item) => item.id === upgradeId);
  if (!upgrade || !canPurchase(state, upgrade)) return state;
  return {
    ...state,
    insight: state.insight - upgrade.cost,
    upgrades: { ...state.upgrades, [upgrade.id]: true },
    lastMessage: `${upgrade.name} added. Your practice now develops ${upgrade.rate} mastery per second.`,
  };
}

export function currentProject(state) {
  if (!state.field) return null;
  return fields[state.field].projects[state.completedProjects] || null;
}

export function completeProject(state) {
  const project = currentProject(state);
  if (!project || state.mastery < project.requirement) return state;
  return {
    ...state,
    impact: state.impact + project.impact,
    completedProjects: state.completedProjects + 1,
    lastMessage: `${project.title} complete. Impact +${project.impact}. A project ends; the responsibility to learn from it does not.`,
  };
}

export function tick(state, elapsedSeconds) {
  if (!state.field || elapsedSeconds <= 0) return state;
  const rate = practiceRate(state);
  if (rate === 0) return state;
  const elapsed = Math.min(elapsedSeconds, 60 * 60 * 4);
  return { ...state, mastery: state.mastery + rate * elapsed };
}

export function specialtyName(state) {
  if (!state.field) return "Undecided";
  const field = fields[state.field];
  if (!state.specialty) return `${field.name} · exploring`;
  return field.specialties.find((item) => item.id === state.specialty)?.name || field.name;
}

export function leadingPattern(state) {
  const sorted = AXES.map((axis) => [axis, state.constellation[axis]])
    .sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] === 0) return "No pattern yet. Your actions will sketch one.";
  const labels = { analyze: "analysis", build: "making", care: "care", advocate: "advocacy" };
  if (sorted[0][1] === sorted[1][1]) {
    return `Your choices currently connect ${labels[sorted[0][0]]} with ${labels[sorted[1][0]]}.`;
  }
  return `You have returned most often to ${labels[sorted[0][0]]}. That is a clue to investigate, not a verdict.`;
}
