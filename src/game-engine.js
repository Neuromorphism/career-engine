import { careerTree, fieldForPath, findNode, findNodeById, nodesForPath } from "./careers.js?v=0.6.0";
import { curriculumFor } from "./curricula.js?v=0.6.0";
import { rivalProfileForPath } from "./ai-rival.js?v=0.6.0";

export const SAVE_KEY = "career-engine-save-v3";
export const AI_SAVE_KEY = "career-engine-ai-save-v1";
export const GOAL_MASTERY = 10_000;

const REWARDS = [1, 2, 3, 5, 8, 13, 21];
const RATES = [0.04, 0.07, 0.11, 0.17, 0.26, 0.38, 0.55];

export function createInitialState() {
  return {
    mastery: 0,
    aiMastery: 0,
    actions: 0,
    path: [],
    completedLearningKeys: [],
    completedProjectKeys: [],
    careerComplete: false,
    raceWinner: null,
    lastMessage: "Choose a field. You can refine the direction after trying a small piece of its work.",
    savedAt: Date.now(),
  };
}

export function hydrateState(input) {
  const fresh = createInitialState();
  if (!input || typeof input !== "object") return fresh;
  const hasLearningProgress = Array.isArray(input.completedLearningKeys);
  const state = {
    ...fresh,
    mastery: Number.isFinite(input.mastery) ? Math.max(0, input.mastery) : 0,
    aiMastery: Number.isFinite(input.aiMastery) ? Math.max(0, input.aiMastery) : 0,
    actions: Number.isFinite(input.actions) ? Math.max(0, input.actions) : 0,
    path: Array.isArray(input.path) ? input.path : [],
    completedLearningKeys: Array.isArray(input.completedLearningKeys) ? input.completedLearningKeys : [],
    completedProjectKeys: Array.isArray(input.completedProjectKeys) ? input.completedProjectKeys : [],
    careerComplete: Boolean(input.careerComplete),
    raceWinner: input.raceWinner === "player" || input.raceWinner === "ai" ? input.raceWinner : null,
    lastMessage: typeof input.lastMessage === "string" ? input.lastMessage : fresh.lastMessage,
    savedAt: Number.isFinite(input.savedAt) ? input.savedAt : fresh.savedAt,
  };
  if (state.path.length && !findNode(state.path)) state.path = [];
  if (!hasLearningProgress && state.path.length > 1) {
    state.completedLearningKeys = nodesForPath(state.path).slice(0, -1).flatMap((node, index) => (
      learningTrackForNode(node, index + 1)?.activities.map((activity) => activity.key) || []
    ));
  }
  state.careerComplete = false;
  return withGoalCheck(state);
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
  if (
    state.careerComplete
    || !isLeaf(state)
    || !learningTrackComplete(state)
    || currentProject(state)
    || state.mastery < GOAL_MASTERY
  ) return state;
  return {
    ...state,
    careerComplete: true,
    raceWinner: state.raceWinner || "player",
    lastMessage: state.raceWinner === "ai"
      ? `Career mastered—but the AI reached ${GOAL_MASTERY.toLocaleString()} first. You finished the path; begin again to try a different race.`
      : `Career mastered. You reached ${GOAL_MASTERY.toLocaleString()} mastery as a ${currentNode(state).name}. Begin again whenever you want to explore another path.`,
  };
}

export function projectKey(nodeId, index) {
  return `${nodeId}:${index}`;
}

export function firstProjectComplete(state, node = currentNode(state)) {
  if (!node || !node.projects?.length) return true;
  return state.completedProjectKeys.includes(projectKey(node.id, 0));
}

export function learningKey(nodeId, index) {
  return `${nodeId}:${index}`;
}

function learningValues(index, depth) {
  const reward = Math.round((REWARDS[index] || REWARDS.at(-1) + ((index - REWARDS.length + 1) * 13)) * depth);
  const rate = Number(((RATES[index] || RATES.at(-1) + ((index - RATES.length + 1) * 0.17)) * depth).toFixed(2));
  return { reward, rate };
}

export function learningTrackForNode(node, depth = 1) {
  const curriculum = node ? curriculumFor(node.id) : null;
  if (!curriculum) return null;
  return {
    ...curriculum,
    nodeId: node.id,
    nodeName: node.name,
    activities: curriculum.activities.map((activity, index) => ({
      ...activity,
      ...learningValues(index, depth),
      index,
      key: learningKey(node.id, index),
    })),
  };
}

export function learningTracksForPath(state) {
  return pathNodes(state).map((node, index) => learningTrackForNode(node, index + 1)).filter(Boolean);
}

export function learningTrackComplete(state, node = currentNode(state)) {
  if (!node) return false;
  const match = findNodeById(node.id);
  const track = learningTrackForNode(node, match?.depth || state.path.length || 1);
  return Boolean(track?.activities.length)
    && track.activities.every((activity) => state.completedLearningKeys.includes(activity.key));
}

export function currentLearningActivity(state) {
  const node = currentNode(state);
  if (!node) return null;
  const track = learningTrackForNode(node, state.path.length);
  return track?.activities.find((activity) => !state.completedLearningKeys.includes(activity.key)) || null;
}

export function completeLearningActivity(state, nodeId, activityIndex) {
  const node = currentNode(state);
  const nextActivity = currentLearningActivity(state);
  if (!node || node.id !== nodeId || !nextActivity || nextActivity.index !== activityIndex) return state;
  return withGoalCheck({
    ...state,
    mastery: state.mastery + nextActivity.reward,
    actions: state.actions + 1,
    completedLearningKeys: [...state.completedLearningKeys, nextActivity.key],
    lastMessage: `${nextActivity.title} complete. +${nextActivity.reward} mastery and +${nextActivity.rate}/sec practice capacity.`,
  });
}

export function availableChoices(state) {
  if (!state.path.length) return careerTree;
  return currentNode(state)?.children || [];
}

export function choicesUnlocked(state) {
  if (!state.path.length) return true;
  return learningTrackComplete(state) && firstProjectComplete(state);
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
      : `${node.name} selected. Complete its learning track and applied brief before narrowing the path again.`,
  });
}

export function work(state) {
  const activity = currentLearningActivity(state);
  const node = currentNode(state);
  return activity && node ? completeLearningActivity(state, node.id, activity.index) : state;
}

export function practiceRate(state) {
  return state.completedLearningKeys.reduce((rate, key) => {
    const separator = key.lastIndexOf(":");
    const nodeId = key.slice(0, separator);
    const index = Number(key.slice(separator + 1));
    const match = findNodeById(nodeId);
    return rate + (match && Number.isInteger(index) ? learningValues(index, match.depth).rate : 0);
  }, 0);
}

export function aiRivalStatus(state) {
  const activity = currentLearningActivity(state);
  const profile = rivalProfileForPath(pathNodes(state), activity);
  const difference = state.mastery - state.aiMastery;
  let relative;
  if (state.raceWinner === "player") relative = "You reached mastery first. The rival has stopped.";
  else if (state.raceWinner === "ai") relative = "AI reached mastery first. You can still finish the career path.";
  else if (!state.path.length) relative = "The race begins when you choose a field.";
  else if (Math.abs(difference) < 1) relative = "You are running nearly even.";
  else if (difference > 0) relative = `You lead by ${Math.floor(difference).toLocaleString()} mastery.`;
  else relative = `AI leads by ${Math.floor(Math.abs(difference)).toLocaleString()} mastery.`;
  return { ...profile, relative };
}

export function aiPracticeRate(state) {
  return state.raceWinner ? 0 : aiRivalStatus(state).rate;
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
  if (!project || !learningTrackComplete(state) || state.mastery < project.requirement) return state;
  return withGoalCheck({
    ...state,
    completedProjectKeys: [...state.completedProjectKeys, project.key],
    lastMessage: `${project.title} complete. The next decision is open. Keep the artifact; real careers are built from reviewed work, not mastery alone.`,
  });
}

export function tick(state, elapsedSeconds, { aiMode = false } = {}) {
  if (!state.path.length || elapsedSeconds <= 0) return state;
  const elapsed = Math.min(elapsedSeconds, 60 * 60 * 4);
  const rate = practiceRate(state);
  const aiRate = aiMode ? aiPracticeRate(state) : 0;
  if (rate === 0 && aiRate === 0) return state;

  let raceWinner = state.raceWinner;
  let lastMessage = state.lastMessage;
  const nextMastery = state.mastery + (rate * elapsed);
  let nextAiMastery = state.aiMastery + (aiRate * elapsed);

  if (aiMode && !raceWinner) {
    const playerEligible = isLeaf(state) && learningTrackComplete(state) && !currentProject(state) && rate > 0;
    const playerFinishTime = playerEligible && state.mastery < GOAL_MASTERY
      ? (GOAL_MASTERY - state.mastery) / rate
      : Number.POSITIVE_INFINITY;
    const aiFinishTime = aiRate > 0 && state.aiMastery < GOAL_MASTERY
      ? (GOAL_MASTERY - state.aiMastery) / aiRate
      : Number.POSITIVE_INFINITY;

    if (aiFinishTime <= elapsed && aiFinishTime < playerFinishTime) {
      raceWinner = "ai";
      nextAiMastery = GOAL_MASTERY;
      lastMessage = "AI reached 10,000 mastery first. The path remains open—finish it, learn where the rival slowed down, and race again.";
    } else if (playerFinishTime <= elapsed) {
      raceWinner = "player";
    }
  }

  return withGoalCheck({
    ...state,
    mastery: nextMastery,
    aiMastery: nextAiMastery,
    raceWinner,
    lastMessage,
  });
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
