import { AXES, careerTree, fieldForPath, findNode, nodesForPath, upgrades } from "./careers.js?v=0.2.0";

export const SAVE_KEY = "career-engine-save-v2";

export function createInitialState() {
  return {
    insight: 0,
    mastery: 0,
    impact: 0,
    actions: 0,
    path: [],
    constellation: Object.fromEntries(AXES.map((axis) => [axis, 0])),
    upgrades: {},
    completedProjectKeys: [],
    lastMessage: "Choose a field. You can refine the direction after trying a small piece of its work.",
    savedAt: Date.now(),
  };
}

export function hydrateState(input) {
  const fresh = createInitialState();
  if (!input || typeof input !== "object") return fresh;
  const state = {
    ...fresh,
    ...input,
    path: Array.isArray(input.path) ? input.path : [],
    constellation: { ...fresh.constellation, ...(input.constellation || {}) },
    upgrades: { ...(input.upgrades || {}) },
    completedProjectKeys: Array.isArray(input.completedProjectKeys) ? input.completedProjectKeys : [],
  };
  if (state.path.length && !findNode(state.path)) state.path = [];
  return state;
}

export function currentNode(state) {
  return findNode(state.path);
}

export function currentField(state) {
  return fieldForPath(state.path);
}

export function isLeaf(state) {
  const node = currentNode(state);
  return Boolean(node && (!node.children || node.children.length === 0));
}

export function projectKey(nodeId, index) {
  return `${nodeId}:${index}`;
}

export function firstProjectComplete(state, node = currentNode(state)) {
  if (!node || !node.projects?.length) return true;
  return state.completedProjectKeys.includes(projectKey(node.id, 0));
}

export function availableChoices(state) {
  if (!state.path.length) return careerTree;
  return currentNode(state)?.children || [];
}

export function choicesUnlocked(state) {
  if (!state.path.length) return true;
  return firstProjectComplete(state);
}

export function chooseNode(state, nodeId) {
  const choices = availableChoices(state);
  const node = choices.find((item) => item.id === nodeId);
  if (!node || !choicesUnlocked(state)) return state;
  const field = state.path.length ? currentField(state) : node;
  const constellation = { ...state.constellation };
  if (!state.path.length) field.axes.forEach((axis) => { constellation[axis] += 1; });
  return {
    ...state,
    path: [...state.path, nodeId],
    constellation,
    lastMessage: node.jobTitle
      ? `${node.name} reached: a real-world job leaf. Its projects are grounded in occupation data and current postings where available.`
      : `${node.name} selected. Try its starter brief before narrowing the path again.`,
  };
}

export function work(state) {
  const node = currentNode(state);
  const field = currentField(state);
  if (!node || !field) return state;
  const constellation = { ...state.constellation };
  field.axes.forEach((axis) => { constellation[axis] += 0.2; });
  return {
    ...state,
    insight: state.insight + 1,
    mastery: state.mastery + 1,
    actions: state.actions + 1,
    constellation,
    lastMessage: node.workDescription || field.workDescription,
  };
}

export function practiceRate(state) {
  return upgrades.reduce((rate, upgrade) => rate + (state.upgrades[upgrade.id] ? upgrade.rate : 0), 0);
}

export function canPurchase(state, upgrade) {
  return Boolean(state.path.length)
    && !state.upgrades[upgrade.id]
    && state.insight >= upgrade.cost
    && state.mastery >= upgrade.masteryRequired
    && (!upgrade.leafRequired || isLeaf(state));
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
  const node = currentNode(state);
  if (!node) return null;
  return (node.projects || [])
    .map((project, index) => ({ ...project, key: projectKey(node.id, index), index }))
    .find((project) => !state.completedProjectKeys.includes(project.key)) || null;
}

export function completeProject(state) {
  const project = currentProject(state);
  if (!project || state.mastery < project.requirement) return state;
  return {
    ...state,
    impact: state.impact + project.impact,
    completedProjectKeys: [...state.completedProjectKeys, project.key],
    lastMessage: `${project.title} complete. Impact +${project.impact}. Keep the artifact; real careers are built from reviewed work, not just accumulated points.`,
  };
}

export function tick(state, elapsedSeconds) {
  if (!state.path.length || elapsedSeconds <= 0) return state;
  const rate = practiceRate(state);
  if (rate === 0) return state;
  const elapsed = Math.min(elapsedSeconds, 60 * 60 * 4);
  return { ...state, mastery: state.mastery + rate * elapsed };
}

export function directionName(state) {
  const node = currentNode(state);
  return node?.name || "Choose a field";
}

export function pathNodes(state) {
  return nodesForPath(state.path);
}

export function leadingPattern(state) {
  const sorted = AXES.map((axis) => [axis, state.constellation[axis]]).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] === 0) return "No pattern yet. Choosing a field will sketch the first connection.";
  const labels = { analyze: "analysis", build: "making", care: "care", advocate: "advocacy" };
  if (sorted[0][1] === sorted[1][1]) return `Your choices currently connect ${labels[sorted[0][0]]} with ${labels[sorted[1][0]]}.`;
  return `You have returned most often to ${labels[sorted[0][0]]}. That is a clue to investigate, not a verdict.`;
}
