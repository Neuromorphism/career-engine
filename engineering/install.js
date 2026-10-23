import { careerTree, curricula } from '../src/career-data.js?v=0.11.1';
import { discoveryData } from '../src/discovery-data.js?v=0.11.1';
import { engineeringFamilies } from './catalog.js';
export const jobId = title => `eng-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;
let installed = false;
export function installEngineeringEdition() {
  if (installed) return;
  installed = true;
  const root = careerTree.find(node => node.id === 'engineering');
  careerTree.splice(0, careerTree.length, root);
  const existing = new Set();
  function visit(node) { if (node.children?.length) node.children.forEach(visit); else existing.add(node.id); }
  visit(root);
  discoveryData.professions = discoveryData.professions.filter(role => existing.has(role.id)).map(role => ({ ...role, primary: { category_id: 'engineering', family_id: 'established' }, also_found_under: [] }));
  const families = [{ id: 'established', label: 'Original engineering paths' }];
  for (const [label, jobs] of engineeringFamilies) {
    const familyId = jobId(label);
    families.push({ id: familyId, label });
    const family = {
      id: familyId, name: label, blurb: `Explore specialist jobs in ${label.toLowerCase()}.`, decisionLabel: 'engineering job',
      projects: [{ title: `Compare jobs in ${label.toLowerCase()}`, description: 'Compare two jobs by their deliverables, constraints, and failure modes. Explain which work you want to investigate.', deliverable: 'A comparison of responsibilities and one technical question for each job.', requirement: 8 }], children: [],
    };
    curricula[familyId] = structuredClone(curricula.engineering);
    curricula[familyId].title = `${label} foundation`;
    curricula[familyId].activities.forEach((activity, i) => activity.choices.forEach((choice, j) => { choice.id = `${familyId}:learning:${i}:${j}`; }));
    for (const [title, task, constraint, failure] of jobs) {
      const id = jobId(title);
      const subjects = [task, `investigate ${failure}`, `measure ${constraint}`];
      const descriptions = [
        `Develop a bounded model to ${task}. Compare two designs against ${constraint}; state assumptions and justify your choice.`,
        `Reproduce ${failure} in a paper model or simulation. Trace causes, propose a mitigation, and test whether it introduces another failure.`,
        `Design a measurement or simulation study of ${constraint}. Set an acceptance criterion, quantify uncertainty, and explain what the result cannot establish.`,
      ];
      const node = { id, name: title, jobTitle: title,
        blurb: `Work to ${task}, balancing ${constraint} and resilience to ${failure}.`,
        workLabel: task, workDescription: descriptions[0],
        entryRouteIds: ['degree-engineering'], progressionRouteIds: ['expert-track', 'management-track'], continuityRouteIds: ['return-track'],
        credentialNote: 'An authored specialty to explore. Actual entry requirements and regulated responsibilities depend on the employer and jurisdiction. Game projects do not confer qualifications.', evidence: [],
        projects: subjects.map((subject, i) => ({ title: `Work sample: ${subject}`, description: descriptions[i], deliverable: 'A technical note with assumptions, alternatives, results, uncertainty, and a review checklist.', requirement: [14, 22, 30][i] })),
        impactActions: ['Practitioner', 'Team leader', 'Career legacy'].map((stage, i) => ({
          id: `${id}:impact:${i}`, title: `${stage}: ${task}`, description: descriptions[0], stage, requirement: [300, 2000, 7000][i], reward: [80, 250, 600][i], rate: [0.3, 0.7, 1.4][i],
          choices: subjects.map((subject, j) => ({ id: `${id}:impact:${i}:${j}`, title: `${['Deliver a reviewed case', 'Lead a multi-case program', 'Establish a reusable engineering practice'][i]}: ${subject}`, description: `${descriptions[j]} ${['Submit a reviewed technical result.', 'Coordinate interfaces, independent review, and a staged rollout across several cases.', 'Create a maintained method, validation examples, and a handover for future teams.'][i]}`, task_subject: subject, focus: stage, reward: [80, 250, 600][i], rate: [0.3, 0.7, 1.4][i], outcome: `Completed ${stage.toLowerCase()} work to ${subject}; documented review findings and remaining uncertainty.` })),
        })),
      };
      family.children.push(node);
      curricula[id] = { title: `${title} practice`, summary: node.blurb,
        activities: ['Define the problem', 'Compare approaches', 'Build a bounded model', 'Verify the result', 'Adapt to new conditions'].map((stage, i) => ({ title: stage, description: 'Choose a technical case to develop through this stage.', kind: 'lesson', choices: subjects.map((subject, j) => ({ id: `${id}:learning:${i}:${j}`, title: `${stage}: ${subject}`, description: `${descriptions[j]} ${['Record scope, users, and measurable acceptance criteria.', 'Compare alternatives and identify the dominant tradeoff.', 'Produce calculations, pseudocode, or a small simulation with explicit inputs.', 'Check limiting cases and compare against an independent estimate.', 'Change one important assumption and explain whether the recommendation still holds.'][i]}`, task_subject: subject, focus: 'Engineering work sample', reward_multiplier: [1, 1.4, 0.8][j], rate_multiplier: [1, 0.75, 1.35][j] })) })) };
      discoveryData.professions.push({ id, label: title, primary: { category_id: 'engineering', family_id: familyId }, also_found_under: [], search_terms: [task, constraint, failure, label] });
    }
    root.children.push(family);
  }
  discoveryData.categories = [{ id: 'engineering', label: 'Engineering jobs', families }];
  discoveryData.search_routes = [];
}
