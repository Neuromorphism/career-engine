import { createInitialState, hydrateState, currentNode, currentProject, isLeaf, learningTrackComplete, tick } from '../src/game-engine.js?v=0.11.1';
import { worldData } from './world-data.js?v=0.11.1';
export { worldData };
export const WORLD_SAVE_KEY = 'career-engine-world-save-v1';
const cleanName = (value, fallback) => typeof value === 'string' && value.trim() ? value.trim().slice(0, 80) : fallback;
const unit = value => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 1;
const serviceIds = new Set(worldData.services.map(service => service.id));
const projectIds = new Set(worldData.projects.map(project => project.id));

export function createWorld(name = worldData.scenario.name, career = createInitialState(), importedFrom = null) {
  return {
    schemaVersion: 1,
    name: cleanName(name, worldData.scenario.name),
    activeCitizenId: 'citizen-1', nextCitizenNumber: 2,
    citizens: [{ id: 'citizen-1', name: importedFrom ? 'First citizen · imported career' : 'Citizen 1', origin: 'resident', availability: 1, assignment: null, career: hydrateState(career) }],
    projects: {}, importMarkers: importedFrom ? [importedFrom] : [], savedAt: Date.now(),
  };
}

export function hydrateWorld(input) {
  if (!input || input.schemaVersion !== 1 || !Array.isArray(input.citizens) || !input.citizens.length) throw new Error('This world save is invalid or uses an unsupported version. Export it before making changes.');
  const seen = new Set();
  const citizens = input.citizens.map((citizen, index) => {
    if (typeof citizen.id !== 'string' || seen.has(citizen.id)) throw new Error('World save has missing or duplicate citizen IDs.');
    seen.add(citizen.id);
    const assignment = citizen.assignment;
    if (assignment != null && !validAssignment(assignment)) throw new Error('World save references an unknown assignment.');
    return { id: citizen.id, name: cleanName(citizen.name, `Citizen ${index + 1}`), origin: citizen.origin === 'newcomer' ? 'newcomer' : 'resident', availability: unit(citizen.availability), assignment: assignment || null, career: hydrateState(citizen.career) };
  });
  const projects = {};
  for (const [id, record] of Object.entries(input.projects || {})) {
    if (!projectIds.has(id) || record.status !== 'commissioned') throw new Error('World save references an unsupported project.');
    projects[id] = { status: 'commissioned', contributors: [...new Set((record.contributors || []).filter(id => seen.has(id)))], commissionedAt: Number.isFinite(record.commissionedAt) ? record.commissionedAt : 0 };
  }
  return {
    schemaVersion: 1, name: cleanName(input.name, worldData.scenario.name),
    activeCitizenId: seen.has(input.activeCitizenId) ? input.activeCitizenId : citizens[0].id,
    nextCitizenNumber: Math.max(citizens.length + 1, Number.isSafeInteger(input.nextCitizenNumber) ? input.nextCitizenNumber : 1),
    citizens, projects, importMarkers: Array.isArray(input.importMarkers) ? input.importMarkers.filter(id => typeof id === 'string') : [],
    savedAt: Number.isFinite(input.savedAt) ? input.savedAt : Date.now(),
  };
}
function validAssignment(value) {
  return typeof value === 'string' && (value.startsWith('service:') && serviceIds.has(value.slice(8)) || value.startsWith('project:') && projectIds.has(value.slice(8)));
}
export function activeCitizen(world) { return world.citizens.find(citizen => citizen.id === world.activeCitizenId); }
export function updateActiveCareer(world, career) {
  if (activeCitizen(world).career === career) return world;
  return { ...world, citizens: world.citizens.map(citizen => citizen.id === world.activeCitizenId ? { ...citizen, career } : citizen) };
}
export function addCitizen(world, name, origin = 'resident', populationLimit = worldData.scenario.baseline_population) {
  if ((origin !== 'resident' && origin !== 'newcomer') || !Number.isSafeInteger(populationLimit) || populationLimit < 1) return world;
  if (origin === 'resident' && world.citizens.filter(c => c.origin === 'resident').length >= populationLimit) return world;
  let number = world.nextCitizenNumber;
  while (world.citizens.some(c => c.id === `citizen-${number}`)) number++;
  const id = `citizen-${number}`;
  return { ...world, nextCitizenNumber: number + 1, activeCitizenId: id, citizens: [...world.citizens, { id, name: cleanName(name, `Citizen ${number}`), origin, availability: 1, assignment: null, career: createInitialState() }] };
}
export function switchCitizen(world, citizenId) {
  return world.citizens.some(c => c.id === citizenId) && citizenId !== world.activeCitizenId ? { ...world, activeCitizenId: citizenId } : world;
}
export function tickWorld(world, seconds) {
  const citizen = activeCitizen(world);
  return updateActiveCareer(world, tick(citizen.career, seconds));
}
export function renameWorld(world, name) { return { ...world, name: cleanName(name, world.name) }; }
export function citizenProfile(citizen) { return worldData.role_profiles[currentNode(citizen.career)?.id] || null; }
export function citizenReady(citizen) { return isLeaf(citizen.career) && learningTrackComplete(citizen.career) && !currentProject(citizen.career); }
export function citizenAssignment(citizen) {
  return citizen.assignment || (citizenProfile(citizen) ? `service:${citizenProfile(citizen).service_id}` : null);
}
export function citizenContribution(citizen) {
  const profile = citizenProfile(citizen);
  const competence = Math.min(1, Math.sqrt(citizen.career.mastery / worldData.scenario.competence_mastery));
  return Object.fromEntries(Object.entries(profile?.capabilities || {}).map(([key, weight]) => [key, citizenReady(citizen) ? weight * competence * citizen.availability : 0]));
}
export function assignmentOptions(citizen) {
  const profile = citizenProfile(citizen);
  if (!profile) return [];
  return [
    ...worldData.services.filter(s => Object.keys(profile.capabilities).some(k => s.requirements[k])).map(s => ({ id: `service:${s.id}`, name: s.name })),
    ...worldData.projects.filter(p => p.eligible_roles.includes(currentNode(citizen.career)?.id) && Object.keys(profile.capabilities).some(k => p.requirements[k])).map(p => ({ id: `project:${p.id}`, name: `Project · ${p.name}` })),
  ];
}
export function assignCitizen(world, id, assignment, availability) {
  const citizen = world.citizens.find(c => c.id === id);
  if (!citizen || !Number.isFinite(availability) || availability < 0 || availability > 1 || (assignment !== null && !assignmentOptions(citizen).some(option => option.id === assignment))) return world;
  if (assignment?.startsWith('project:') && world.projects[assignment.slice(8)]) return world;
  return { ...world, citizens: world.citizens.map(c => c.id === id ? { ...c, assignment, availability } : c) };
}
function completedContributions(citizen) {
  if (!citizenReady(citizen)) return 0;
  return currentNode(citizen.career).impactActions.filter(action => citizen.career.completedImpactKeys.includes(action.id)).length;
}
export function worldMetrics(world) {
  const pools = Object.fromEntries(worldData.services.map(s => [s.id, {}]));
  const contributors = Object.fromEntries(worldData.services.map(s => [s.id, []]));
  const counts = Object.fromEntries(worldData.services.map(s => [s.id, 0]));
  for (const citizen of world.citizens) {
    const assignment = citizenAssignment(citizen);
    if (!assignment?.startsWith('service:')) continue;
    const sid = assignment.slice(8);
    const contribution = citizenContribution(citizen);
    // Only capabilities used by this assigned service can contribute to it.
    const requirements = worldData.services.find(s => s.id === sid).requirements;
    let contributed = false;
    for (const [capability, amount] of Object.entries(contribution)) {
      if (!requirements[capability] || amount <= 0) continue;
      pools[sid][capability] = (pools[sid][capability] || 0) + amount;
      contributed = true;
    }
    if (contributed) {
      contributors[sid].push({ citizenId: citizen.id, name: citizen.name, capabilities: contribution });
      counts[sid] += completedContributions(citizen) * citizen.availability;
    }
  }
  const scenario = worldData.scenario;
  const services = worldData.services.map(service => {
    const ratios = Object.entries(service.requirements).map(([capability, required]) => {
      const baseline = required * scenario.baseline_coverage;
      const supplied = baseline + (pools[service.id][capability] || 0);
      return { capability, label: worldData.capabilities[capability].label, required, baseline, added: pools[service.id][capability] || 0, supplied, ratio: Math.min(1, supplied / required) };
    });
    const bonus = worldData.projects.filter(p => p.service_id === service.id && world.projects[p.id]).reduce((sum,p) => sum + p.facility_bonus, 0);
    const facility = Math.min(1, scenario.facility_capacity + bonus);
    const reliability = Math.min(1, scenario.reliability + Math.min(scenario.experience_bonus_cap, counts[service.id] * scenario.experience_bonus_per_milestone));
    const workforce = Math.min(...ratios.map(row => row.ratio));
    const coverage = Math.min(1, facility, workforce) * reliability;
    const baselineCoverage = Math.min(1, scenario.facility_capacity, scenario.baseline_coverage) * scenario.reliability;
    const capacity = ratios.reduce((sum,row) => sum + row.ratio, 0) / ratios.length;
    const limiting = ratios.filter(row => row.ratio <= workforce + .00001).map(row => row.label);
    return { ...service, capacity, coverage, baselineCoverage, addedCoverage: Math.max(0, coverage - baselineCoverage), workforce, facility, reliability, ratios, contributors: contributors[service.id], completedContributions: counts[service.id], bottleneck: facility < workforce ? 'Facility capacity' : limiting.join(', ') };
  });
  return {
    population: scenario.baseline_population + world.citizens.filter(c => c.origin === 'newcomer').length,
    namedCitizens: world.citizens.length, readyCitizens: world.citizens.filter(citizenReady).length,
    establishedCitizens: world.citizens.filter(c => c.career.careerComplete).length,
    totalMastery: world.citizens.reduce((sum,c) => sum + c.career.mastery, 0), services,
  };
}
export function projectReadiness(world, projectId) {
  const definition = worldData.projects.find(p => p.id === projectId);
  if (!definition) return null;
  const citizens = world.citizens.filter(c => citizenAssignment(c) === `project:${projectId}` && citizenReady(c) && definition.eligible_roles.includes(currentNode(c.career)?.id));
  const rows = Object.entries(definition.requirements).map(([capability, required]) => {
    const supplied = citizens.reduce((sum,c) => sum + (citizenContribution(c)[capability] || 0), 0);
    return { capability, label: worldData.capabilities[capability].label, required, supplied, ready: supplied + 1e-9 >= required };
  });
  return { ...definition, commissioned: Boolean(world.projects[projectId]), rows, ready: rows.every(row => row.ready), contributorIds: citizens.filter(c => Object.keys(citizenContribution(c)).some(k => definition.requirements[k] && citizenContribution(c)[k] > 0)).map(c => c.id) };
}
export function commissionProject(world, projectId) {
  const project = projectReadiness(world, projectId);
  if (!project?.ready || project.commissioned) return world;
  return {
    ...world,
    projects: { ...world.projects, [projectId]: { status: 'commissioned', contributors: project.contributorIds, commissionedAt: Date.now() } },
    // Construction commitments end at commissioning. Contributors resume their usual services.
    citizens: world.citizens.map(c => c.assignment === `project:${projectId}` ? { ...c, assignment: null } : c),
  };
}
