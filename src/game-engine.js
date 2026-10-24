import { branchProjectsFor, branchProjectRounds, branchWorkProgress } from './branch-projects.js?v=0.11.1';
import { careerTree, fieldForPath, findNode, findNodeById, nodesForPath } from "./careers.js?v=0.11.1";
import { curriculumFor } from "./curricula.js?v=0.11.1";
import { rivalProfileForPath } from "./ai-rival.js?v=0.11.1";
import { canFollowRoute } from './discovery.js?v=0.11.1';

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
    targetOccupationId: null,
    completedLearningKeys: [],
    completedProjectKeys: [],
    completedImpactKeys: [],
    projectChoiceKinds: {},
    projectChoices: {},
    projectChoiceTitles: {},
    learningChoices: {},
    impactChoices: {},
    learningChoiceTitles: {},
    impactChoiceTitles: {},
    impactChoiceOutcomes: {},
    careerComplete: false,
    raceWinner: null,
    lastMessage: "Find a profession to explore. You can refine your goal after trying a small piece of its work.",
    savedAt: Date.now(),
  };
}

function choiceRecord(input) {
  return input && typeof input === "object" && !Array.isArray(input)
    ? Object.fromEntries(Object.entries(input).filter(([, value]) => typeof value === "string")) : {};
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
    targetOccupationId: typeof input.targetOccupationId === 'string' ? input.targetOccupationId : null,
    completedLearningKeys: Array.isArray(input.completedLearningKeys) ? input.completedLearningKeys : [],
    completedProjectKeys: Array.isArray(input.completedProjectKeys) ? input.completedProjectKeys : [],
    completedImpactKeys: Array.isArray(input.completedImpactKeys) ? input.completedImpactKeys.filter(key => typeof key === "string") : [],
    projectChoiceKinds: choiceRecord(input.projectChoiceKinds),
    projectChoices: choiceRecord(input.projectChoices),
    projectChoiceTitles: choiceRecord(input.projectChoiceTitles),
    learningChoices: choiceRecord(input.learningChoices),
    impactChoices: choiceRecord(input.impactChoices),
    learningChoiceTitles: choiceRecord(input.learningChoiceTitles),
    impactChoiceTitles: choiceRecord(input.impactChoiceTitles),
    impactChoiceOutcomes: choiceRecord(input.impactChoiceOutcomes),
    careerComplete: Boolean(input.careerComplete),
    raceWinner: input.raceWinner === "player" || input.raceWinner === "ai" ? input.raceWinner : null,
    lastMessage: typeof input.lastMessage === "string" ? input.lastMessage : fresh.lastMessage,
    savedAt: Number.isFinite(input.savedAt) ? input.savedAt : fresh.savedAt,
  };
  if (state.path.length && !findNode(state.path)) {
    const migrated = careerTree.find(node => node.id === state.path[0])?.previousPaths?.[JSON.stringify(state.path)];
    if (migrated) {
      const previousIds = new Set(state.path);
      state.path = [...migrated];
      state.completedLearningKeys = [...state.completedLearningKeys, ...nodesForPath(state.path)
        .filter(node => !previousIds.has(node.id))
        .flatMap(node => learningTrackForNode(node)?.activities.map(activity => activity.key) || [])];
    } else state.path = [];
  }
  if (!canFollowRoute(state, state.targetOccupationId)) state.targetOccupationId = null;
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
      : `Career mastered. You reached ${GOAL_MASTERY.toLocaleString()} mastery as a ${currentNode(state).name}. Your career legacy missions remain available; begin again whenever you want to explore another path.`,
  };
}

export function projectKey(nodeId, index) {
  return `${nodeId}:${index}`;
}

export function firstProjectComplete(state, node = currentNode(state)) {
  if (node?.children?.length) {
    return branchWorkProgress(state, node).done;
  }
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
      choices: activity.choices.map(choice => ({
        ...choice,
        reward: Math.max(1, Math.round(learningValues(index, depth).reward * choice.reward_multiplier)),
        rate: Number((learningValues(index, depth).rate * choice.rate_multiplier).toFixed(3)),
      })),
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
  if (branchWorkProgress(state, node)?.done) return null;
  const track = learningTrackForNode(node, state.path.length);
  return track?.activities.find((activity) => !state.completedLearningKeys.includes(activity.key)) || null;
}

export function completeLearningActivity(state, nodeId, activityIndex, choiceId = null) {
  const node = currentNode(state);
  const nextActivity = currentLearningActivity(state);
  if (!node || node.id !== nodeId || !nextActivity || nextActivity.index !== activityIndex) return state;
  const choice = choiceId === null ? nextActivity.choices[0] : nextActivity.choices.find(item => item.id === choiceId);
  if (!choice) return state;
  return withGoalCheck({
    ...state,
    mastery: state.mastery + choice.reward,
    actions: state.actions + 1,
    completedLearningKeys: [...state.completedLearningKeys, nextActivity.key],
    learningChoices: { ...state.learningChoices, [nextActivity.key]: choice.id },
    learningChoiceTitles: { ...state.learningChoiceTitles, [nextActivity.key]: choice.title },
    lastMessage: `${choice.title} complete. +${choice.reward} mastery and +${choice.rate}/sec practice capacity.`,
  });
}

export function availableChoices(state) {
  if (!state.path.length) return careerTree;
  return currentNode(state)?.children || [];
}

export function choicesUnlocked(state) {
  if (!state.path.length) return true;
  const progress = branchWorkProgress(state, currentNode(state));
  return progress ? progress.done : learningTrackComplete(state) && firstProjectComplete(state);
}

export function chooseNode(state, nodeId) {
  const choices = availableChoices(state);
  const node = choices.find((item) => item.id === nodeId);
  if (!node || !choicesUnlocked(state)) return state;
  return withGoalCheck({
    ...state,
    path: [...state.path, nodeId],
    targetOccupationId: state.targetOccupationId && canFollowRoute({ ...state, path: [...state.path, nodeId] }, state.targetOccupationId) ? state.targetOccupationId : null,
    lastMessage: node.jobTitle
      ? `${node.name} reached: a real-world job leaf. Its projects are grounded in occupation data and current postings where available.`
      : `${node.name} selected. Choose five work actions before narrowing the path again.`,
  });
}

export function work(state) {
  const activity = currentLearningActivity(state);
  const node = currentNode(state);
  return activity && node ? completeLearningActivity(state, node.id, activity.index) : state;
}

export function practiceRate(state) {
  const learningRate = state.completedLearningKeys.reduce((rate, key) => {
    const separator = key.lastIndexOf(":");
    const nodeId = key.slice(0, separator);
    const index = Number(key.slice(separator + 1));
    const match = findNodeById(nodeId);
    const activity = match && Number.isInteger(index) ? learningTrackForNode(match.node, match.depth)?.activities[index] : null;
    const choice = activity?.choices.find(item => item.id === state.learningChoices?.[key]) || activity?.choices[0];
    return rate + (choice?.rate || 0);
  }, 0);
  const impactRate = pathNodes(state).flatMap(node => node.impactActions || [])
    .filter(action => state.completedImpactKeys.includes(action.id))
    .reduce((sum, action) => {
      const choice = action.choices.find(item => item.id === state.impactChoices?.[action.id]) || action.choices[0];
      return sum + choice.rate;
    }, 0);
  const branchRate = pathNodes(state).reduce((rate, node, depth) => rate + branchProjectsFor(node)
    .filter(project => state.completedProjectKeys.includes(project.key) && ['training', 'project'].includes(state.projectChoiceKinds?.[project.key]))
    .reduce((total, project) => total + learningValues(project.index, depth + 1).rate, 0), 0);
  return learningRate + branchRate + impactRate;
}

export function aiRivalStatus(state) {
  const activity = currentLearningActivity(state);
  const profile = rivalProfileForPath(pathNodes(state), activity);
  const difference = state.mastery - state.aiMastery;
  let relative;
  if (state.raceWinner === "player") relative = "You reached mastery first. The rival has stopped.";
  else if (state.raceWinner === "ai") relative = "AI reached mastery first. You can still finish the career path.";
  else if (!state.path.length) relative = "The race begins when you start a training route.";
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
  if (node.children?.length) {
    const progress = branchWorkProgress(state, node);
    return progress.done ? null : branchProjectsFor(node)[progress.count];
  }
  return (node.projects || [])
    .map((project, index) => ({ ...project, key: projectKey(node.id, index), index }))
    .find((project) => !state.completedProjectKeys.includes(project.key)) || null;
}

/** Family training and work tasks share one five-action budget. */
export function completeBranchWork(state, choiceId) {
  const node = currentNode(state);
  if (!node?.children?.length) return state;
  const project = currentProject(state);
  const choice = project?.choices.find(choice => choice.id === choiceId);
  if (!choice) return state;
  const values = learningValues(project.index, state.path.length);
  return withGoalCheck({
    ...state,
    mastery: state.mastery + values.reward,
    actions: state.actions + 1,
    completedProjectKeys: [...state.completedProjectKeys, project.key],
    projectChoices: { ...state.projectChoices, [project.key]: choice.id },
    projectChoiceTitles: { ...state.projectChoiceTitles, [project.key]: choice.title },
    projectChoiceKinds: { ...state.projectChoiceKinds, [project.key]: choice.kind },
    lastMessage: project.index === branchProjectRounds - 1
      ? 'Five work actions complete. Review your choices and decide which branch to take. You decide whether the results guide you.'
      : `${choice.title} complete. ${project.index + 1} of ${branchProjectRounds} work actions chosen.`,
  });
}

export function completeProject(state, choiceId = null) {
  const project = currentProject(state);
  if (!project || !learningTrackComplete(state) || state.mastery < project.requirement) return state;
  const choice = project.choices?.find(c => c.id === (choiceId ?? project.choices[0].id));
  if (project.choices && !choice) return state;
  return withGoalCheck({
    ...state,
    projectChoices: choice ? { ...state.projectChoices, [project.key]: choice.id } : state.projectChoices,
    projectChoiceTitles: choice ? { ...state.projectChoiceTitles, [project.key]: choice.title } : state.projectChoiceTitles,
    completedProjectKeys: [...state.completedProjectKeys, project.key],
    lastMessage: project.choices
      ? `${choice.title} complete. ${project.index === branchProjectRounds - 1 ? 'Review your task choices. You decide whether they guide your next branch.' : 'Try the next set of branch tasks.'}`
      : `${project.title} complete. Keep the artifact; real careers are built from reviewed work, not mastery alone.`,
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
  return node?.name || "Explore professions";
}

export function pathNodes(state) {
  return nodesForPath(state.path);
}


export function impactActionsForState(state) {
  const node = currentNode(state);
  const roleReady = isLeaf(state) && learningTrackComplete(state) && !currentProject(state);
  return (node?.impactActions || []).map((action, index, actions) => {
    const done = state.completedImpactKeys.includes(action.id);
    const priorDone = index === 0 || state.completedImpactKeys.includes(actions[index - 1].id);
    const unlocked = roleReady && priorDone && state.mastery >= action.requirement;
    const lockReason = !roleReady ? "Complete this role's training and work samples"
      : !priorDone ? "Complete the preceding career mission"
      : state.mastery < action.requirement ? `Reach ${action.requirement.toLocaleString()} mastery`
      : "Ready to lead";
    const selectedChoice = done
      ? action.choices.find(choice => choice.id === state.impactChoices?.[action.id]) || action.choices[0] : null;
    return { ...action, done, selectedChoice, unlocked: unlocked && !done, lockReason };
  });
}

export function completeImpactAction(state, actionId, choiceId = null) {
  const action = impactActionsForState(state).find(item => item.id === actionId);
  if (!action?.unlocked) return state;
  const choice = choiceId === null ? action.choices[0] : action.choices.find(item => item.id === choiceId);
  if (!choice) return state;
  return withGoalCheck({
    ...state,
    mastery: state.mastery + choice.reward,
    actions: state.actions + 1,
    completedImpactKeys: [...state.completedImpactKeys, action.id],
    impactChoices: { ...state.impactChoices, [action.id]: choice.id },
    impactChoiceTitles: { ...state.impactChoiceTitles, [action.id]: choice.title },
    impactChoiceOutcomes: { ...state.impactChoiceOutcomes, [action.id]: choice.outcome },
    lastMessage: `${choice.title} complete. ${choice.outcome} +${choice.reward} mastery; +${choice.rate}/sec practice capacity.`,
  });
}
