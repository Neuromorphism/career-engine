import { careerTree, fieldForPath, findNode, nodesForPath, upgrades } from "./careers.js?v=0.4.0";

export const SAVE_KEY = "career-engine-save-v2";
export const GOAL_MASTERY = 10_000;

export function createInitialState() {
  return {
    mastery: 0,
    actions: 0,
    path: [],
    upgrades: {},
    completedProjectKeys: [],
    careerComplete: false,
    lastMessage: "Choose a field. You can refine the direction after trying a small piece of its work.",
    savedAt: Date.now(),
  };
}

export function hydrateState(input) {
  const fresh = createInitialState();
  if (!input || typeof input !== "object") return fresh;
  const state = {
    ...fresh,
    mastery: Number.isFinite(input.mastery) ? Math.max(0, input.mastery) : 0,
    actions: Number.isFinite(input.actions) ? Math.max(0, input.actions) : 0,
    path: Array.isArray(input.path) ? input.path : [],
    upgrades: { ...(input.upgrades || {}) },
    completedProjectKeys: Array.isArray(input.completedProjectKeys) ? input.completedProjectKeys : [],
    careerComplete: Boolean(input.careerComplete),
    lastMessage: typeof input.lastMessage === "string" ? input.lastMessage : fresh.lastMessage,
    savedAt: Number.isFinite(input.savedAt) ? input.savedAt : fresh.savedAt,
  };
  if (state.path.length && !findNode(state.path)) state.path = [];
  state.careerComplete = isLeaf(state) && state.mastery >= GOAL_MASTERY;
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

function withGoalCheck(state) {
  if (state.careerComplete || !isLeaf(state) || state.mastery < GOAL_MASTERY) return state;
  return {
    ...state,
    careerComplete: true,
    lastMessage: `Career mastered. You reached ${GOAL_MASTERY.toLocaleString()} mastery as a ${currentNode(state).name}. Begin again whenever you want to explore another path.`,
  };
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
  return withGoalCheck({
    ...state,
    path: [...state.path, nodeId],
    lastMessage: node.jobTitle
      ? `${node.name} reached: a real-world job leaf. Its projects are grounded in occupation data and current postings where available.`
      : `${node.name} selected. Try its starter brief before narrowing the path again.`,
  });
}

export function work(state) {
  const node = currentNode(state);
  const field = currentField(state);
  if (!node || !field) return state;
  return withGoalCheck({
    ...state,
    mastery: state.mastery + 1,
    actions: state.actions + 1,
    lastMessage: node.workDescription || field.workDescription,
  });
}

export function practiceRate(state) {
  return upgrades.reduce((rate, upgrade) => rate + (state.upgrades[upgrade.id] ? upgrade.rate : 0), 0);
}

export function canPurchase(state, upgrade) {
  return Boolean(state.path.length)
    && !state.upgrades[upgrade.id]
    && state.mastery >= upgrade.cost
    && (!upgrade.leafRequired || isLeaf(state));
}

export function purchaseUpgrade(state, upgradeId) {
  const upgrade = upgrades.find((item) => item.id === upgradeId);
  if (!upgrade || !canPurchase(state, upgrade)) return state;
  return {
    ...state,
    mastery: state.mastery - upgrade.cost,
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
    completedProjectKeys: [...state.completedProjectKeys, project.key],
    lastMessage: `${project.title} complete. The next decision is open. Keep the artifact; real careers are built from reviewed work, not mastery alone.`,
  };
}

export function tick(state, elapsedSeconds) {
  if (!state.path.length || elapsedSeconds <= 0) return state;
  const rate = practiceRate(state);
  if (rate === 0) return state;
  const elapsed = Math.min(elapsedSeconds, 60 * 60 * 4);
  return withGoalCheck({ ...state, mastery: state.mastery + rate * elapsed });
}

export function goalProgress(state) {
  return Math.max(0, Math.min(1, state.mastery / GOAL_MASTERY));
}

export function directionName(state) {
  const node = currentNode(state);
  return node?.name || "Choose a field";
}

export function pathNodes(state) {
  return nodesForPath(state.path);
}
