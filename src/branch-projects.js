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
    choices: node.children.map(branch => {
      const roles = leaves(branch);
      const role = roles[round % roles.length];
      const activities = curriculumFor(role.id)?.activities || [];
      const activity = activities[round % (activities.length || 1)];
      const sample = activity?.choices[round % (activity.choices.length || 1)];
      return {
        id: `${node.id}:branch-project:${round}:${branch.id}`, branchId: branch.id, branchLabel: branch.name,
        title: sample?.title || `${stage}: ${role.workLabel || role.name}`,
        description: sample?.description || role.workDescription || role.blurb,
        deliverable: `A short work sample: ${stage.toLowerCase()}. Record your assumptions, result, and one question you would investigate next.`,
      };
    }),
  }));
}

export function branchChoiceSummary(state, node) {
  const projects = branchProjectsFor(node);
  if (!projects.length) return null;
  // Older completed briefs have no branch selections; never infer preferences from them.
  const selections = projects.flatMap(project => {
    if (!state.completedProjectKeys.includes(project.key)) return [];
    const choice = project.choices.find(c => c.id === state.projectChoices?.[project.key]);
    return choice ? [choice] : [];
  });
  if (selections.length !== projects.length) return null;
  return {
    total: selections.length,
    branches: node.children.map(branch => {
      const count = selections.filter(choice => choice.branchId === branch.id).length;
      return { id: branch.id, label: branch.name, count, percent: count / selections.length * 100 };
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
