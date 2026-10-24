import { curriculumFor } from './curricula.js?v=0.11.1';

export const branchProjectRounds = 5;
const stages = ['Explore the task', 'Compare approaches', 'Build a work sample', 'Check the result', 'Adapt the approach'];
export const branchProjectKey = (nodeId, round) => `${nodeId}:branch-project:${round}`;

function leaves(node) {
  return node.children?.length ? node.children.flatMap(leaves) : [node];
}

/** Each round offers exactly one representative work task per immediate branch. */
export function branchProjectsFor(node) {
  if (!node?.children?.length) return [];
  return stages.map((stage, round) => ({
    key: branchProjectKey(node.id, round), index: round,
    title: `Explore the branches · ${round + 1} of ${branchProjectRounds}`,
    requirement: node.projects?.[0]?.requirement || 8,
    choices: node.children.map((branch, branchIndex) => {
      const roles = leaves(branch);
      const role = roles[round % roles.length];
      const activities = curriculumFor(role.id)?.activities || [];
      const activity = activities[round % (activities.length || 1)];
      const sample = activity?.choices[round % (activity.choices.length || 1)];
      const kind = (round + branchIndex) % 2 === 0 ? 'training' : 'project';
      const context = sample?.description || role.workDescription || role.blurb;
      return {
        kind,
        id: `${node.id}:branch-project:${round}:${branch.id}`, branchId: branch.id, branchLabel: branch.name,
        title: sample?.title || `${stage}: ${role.workLabel || role.name}`,
        description: kind === 'training' ? `Work through a guided example of this task. ${context}` : context,
        deliverable: kind === 'training' ? 'A short explanation of the method, your assumptions, and one practice result.' : `A short work sample: ${stage.toLowerCase()}. Record your assumptions, result, and one question you would investigate next.`,
      };
    }),
  }));
}

export function branchWorkProgress(state, node) {
  if (!node?.children?.length) return null;
  const legacyComplete = state.completedProjectKeys.includes(`${node.id}:0`);
  const trainingCount = (curriculumFor(node.id)?.activities || []).filter((_, index) => state.completedLearningKeys.includes(`${node.id}:${index}`)).length;
  const taskCount = branchProjectsFor(node).filter(project => state.completedProjectKeys.includes(project.key)).length;
  const count = Math.min(branchProjectRounds, trainingCount + taskCount);
  return { count, total: branchProjectRounds, done: legacyComplete || count >= branchProjectRounds };
}

export function branchChoiceSummary(state, node) {
  if (!branchWorkProgress(state, node)?.done) return null;
  const selections = branchProjectsFor(node).flatMap(project => {
    if (!state.completedProjectKeys.includes(project.key)) return [];
    const choice = project.choices.find(c => c.id === state.projectChoices?.[project.key]);
    return choice ? [choice] : [];
  });
  if (!selections.length) return null;
  return {
    total: branchProjectRounds,
    unmapped: branchProjectRounds - selections.length,
    branches: node.children.map(branch => {
      const count = selections.filter(choice => choice.branchId === branch.id).length;
      return { id: branch.id, label: branch.name, count, percent: count / branchProjectRounds * 100 };
    }),
  };
}

export function shuffledOptions(options, random = Math.random) {
  const result = [...options];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
