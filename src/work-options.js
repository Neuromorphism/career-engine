import { GOAL_MASTERY, currentNode, currentLearningActivity, currentProject, impactActionsForState, isLeaf, learningTrackForNode, learningTracksForPath, pathNodes, projectKey, practiceRate } from './game-engine.js?v=0.11.1';

/** Select only the work relevant to this citizen's current path and prerequisites. */
export function workOptionsForState(state) {
  const node = currentNode(state);
  if (!node) return { phase: 'choose-path', title: state.targetOccupationId ? 'Begin your selected training route' : 'Find a profession to begin', description: state.targetOccupationId ? 'Start the first training step in Choose path to reveal your work options.' : 'Find a profession in Choose path, then begin its training route.', options: [] };
  const activity = currentLearningActivity(state);
  if (activity) {
    const track = learningTrackForNode(node, state.path.length);
    return {
      phase: 'training', title: activity.title,
      description: 'Choose a task for this stage of your training. Work through fictional cases or controlled exercises; open Task context for details.',
      progress: { value: activity.index, total: track.activities.length, unit: 'steps' },
      options: activity.choices.map(choice => ({ ...choice, kind: 'training', nodeId: node.id, activityIndex: activity.index })),
    };
  }
  const project = currentProject(state);
  if (project) return {
    phase: 'project', title: project.title, description: 'Apply what you have learned to complete this work sample.',
    progress: state.mastery < project.requirement ? { value: state.mastery, total: project.requirement, unit: 'mastery' } : null,
    options: [{ id: project.key, kind: 'project', title: project.title, description: project.description, deliverable: project.deliverable, enabled: state.mastery >= project.requirement }],
  };
  if (!isLeaf(state)) return { phase: 'choose-path', title: 'Your next path is open', description: 'You have completed this stage. Choose your next specialization in Choose path.', options: [] };
  const milestone = impactActionsForState(state).find(action => !action.done);
  if (milestone?.unlocked) return {
    phase: 'impact', title: `${milestone.stage} contribution`, description: 'Choose one of three distinct contributions to make at this stage of your career.',
    options: milestone.choices.map(choice => ({ ...choice, kind: 'impact', actionId: milestone.id })),
  };
  const target = milestone?.requirement || GOAL_MASTERY;
  if (milestone || !state.careerComplete) return {
    phase: 'waiting', title: milestone ? `Next: ${milestone.stage.toLowerCase()} work` : 'Build toward career mastery',
    description: `Your completed work builds ${practiceRate(state).toFixed(2)} mastery per second. More work opens at ${target.toLocaleString()} mastery.`,
    progress: { value: state.mastery, total: target, unit: 'mastery' }, options: [],
  };
  return { phase: 'complete', title: 'Your career work is complete', description: 'Your chosen actions and accomplishments are recorded below.', options: [] };
}

export function completedWorkForState(state) {
  const records = [];
  for (const track of learningTracksForPath(state)) {
    for (const activity of track.activities) {
      if (!state.completedLearningKeys.includes(activity.key)) continue;
      const choice = activity.choices.find(c => c.id === state.learningChoices?.[activity.key]) || activity.choices[0];
      const savedTitle = state.learningChoiceTitles?.[activity.key];
      const title = savedTitle && choice.title_aliases?.includes(savedTitle) ? choice.title : savedTitle || choice.legacy_title || choice.title;
      records.push({ kind: 'Training', title, context: track.nodeName, reward: choice.reward, rate: choice.rate });
    }
  }
  for (const node of pathNodes(state)) {
    (node.projects || []).forEach((project, index) => {
      if (state.completedProjectKeys.includes(projectKey(node.id,index))) records.push({ kind: 'Project', title: project.title, context: node.name });
    });
    for (const action of node.impactActions || []) {
      if (!state.completedImpactKeys.includes(action.id)) continue;
      const choice = action.choices.find(c => c.id === state.impactChoices?.[action.id]) || action.choices[0];
      records.push({ kind: action.stage, title: state.impactChoiceTitles?.[action.id] || choice.legacy_title || choice.title, context: node.name, outcome: state.impactChoiceOutcomes?.[action.id] || choice.legacy_outcome || choice.outcome, reward: choice.reward, rate: choice.rate });
    }
  }
  return records;
}
