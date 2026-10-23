import { currentNode, pathNodes } from '../src/game-engine.js?v=0.11.1';
import { worldMetrics, citizenProfile, citizenReady } from './world-engine.js?v=0.11.1';
const percent = value => `${Math.round(value * 100)}%`;
const trait = (id, title, description) => ({ id, title, description });
const list = items => items.length < 2 ? items[0] || 'an open possibility' : `${items.slice(0,-1).join(', ')} and ${items.at(-1)}`;
function careerName(citizen) {
  const node = currentNode(citizen.career);
  return node?.jobTitle ? `${citizenReady(citizen) ? '' : 'trainee '}${node.name.toLowerCase()}` : node ? `${node.name.toLowerCase()} explorer` : 'citizen choosing a career';
}
/** Deterministic, evidence-aware flavor: small casts first, then actual service metrics. */
export function worldStatus(world, metrics = worldMetrics(world)) {
  const citizens = world.citizens;
  const doingWell = [], needsImprovement = [];
  const count = citizens.length;
  const small = count <= 5;
  const carpenters = citizens.filter(c => currentNode(c.career)?.id === 'carpenter');
  const engineers = citizens.filter(c => pathNodes(c.career)[0]?.id === 'engineering');
  const artists = citizens.filter(c => pathNodes(c.career)[0]?.id === 'arts-media');
  const roleMix = list(citizens.slice(0,5).map(c => careerName(c)));
  const communication = citizens.some(c => (citizenProfile(c)?.capabilities.culture || 0) + (citizenProfile(c)?.capabilities.governance || 0) >= .5);
  if (count === 1) {
    const citizen = citizens[0];
    doingWell.push(communication
      ? trait('one-voice','Communication: exceptionally short meetings',`${citizen.name} is your ${careerName(citizen)}. With a one-citizen roster, talking to yourself counts as reaching the entire playable population.`)
      : trait('one-founder','A small cast with a very big future',`${citizen.name} is your ${careerName(citizen)}. The playable citizen roll call takes seconds; the possibilities take considerably longer.`));
    needsImprovement.push(trait('one-team','The team photo needs more people','One citizen can learn a lot. Complementary professions will turn that expertise into dependable services. Background residents are still relying on the scenario’s baseline provision.'));
  } else if (small && carpenters.length >= 2 && artists.length) {
    doingWell.push(trait('designer-houses','Your future houses have a design committee',`You have ${carpenters.length} ${carpenters.every(citizenReady) ? '' : 'trainee '}carpenters and ${artists.length} arts-and-media ${artists.length === 1 ? 'citizen' : 'citizens'}. Great-looking houses are on the drawing board; practical delivery still needs the right assignments and team.`));
    needsImprovement.push(trait('houses-not-clinics','Lovely floorboards do not run a clinic','Check health and water coverage next. A qualified care team and water specialists can help the community do more than admire its future living rooms.'));
  } else if (small && carpenters.length && engineers.length && artists.length) {
    doingWell.push(trait('walk-into-world','A carpenter, an engineer, and an artist walk into a world…',`Is this a joke setup or your first project meeting? Your actual cast is ${roleMix}. There is plenty to collaborate on once the required training is complete.`));
  } else if (small) {
    doingWell.push(trait('small-cast','Your opening cast is taking shape',`You have ${roleMix}. This is still a world where the profession mix can fit on one very enthusiastic noticeboard.`));
  }
  const established = metrics.establishedCitizens;
  if (small && established) doingWell.push(trait('established','The alumni are staying in town',`${established} ${established === 1 ? 'citizen has' : 'citizens have'} reached career mastery. Starting another citizen does not send their predecessor into the void.`));
  const activeServices = metrics.services.filter(s => s.addedCoverage > .0001).sort((a,b) => b.addedCoverage - a.addedCoverage || a.id.localeCompare(b.id));
  for (const service of activeServices) {
    if (doingWell.length >= 3) break;
    doingWell.push(trait(`coverage-${service.id}`,`${service.name}: more than a committee`,`${service.contributors.length} assigned ${service.contributors.length === 1 ? 'citizen is' : 'citizens are'} helping deliver ${percent(service.coverage)} scenario service coverage—${Math.round(service.addedCoverage * 100)} percentage points above the baseline. The paperwork has acquired practical consequences.`));
  }
  if (!small) {
    const strongest = [...metrics.services].sort((a,b) => b.capacity - a.capacity || a.id.localeCompare(b.id))[0];
    if (!doingWell.some(t => t.id === `coverage-${strongest.id}`)) doingWell.unshift(trait('strongest-capacity',`${strongest.name}: your deepest bench`,`${percent(strongest.capacity)} of the scenario capability target is available. Service coverage is ${percent(strongest.coverage)}; an impressive team sheet still needs every required position filled.`));
  }
  const commissioned = Object.keys(world.projects).length;
  if (commissioned && doingWell.length < 3) doingWell.push(trait('institutions','Your projects have become places',`${commissioned} shared ${commissioned === 1 ? 'institution is' : 'institutions are'} commissioned. Many contributors, one project credit each: the town has avoided building seven imaginary copies of the same bridge.`));
  if (!doingWell.length) doingWell.push(trait('foundation','A foundation before the fanfare','The scenario’s baseline services are in place. Your next trained and assigned citizen can begin strengthening them.'));
  const traineeCount = count - metrics.readyCitizens;
  if (traineeCount && needsImprovement.length < 3) needsImprovement.push(trait('training','The name badges are ahead of the qualifications',`${traineeCount} ${traineeCount === 1 ? 'citizen is' : 'citizens are'} still preparing. Complete their role training and work samples before counting them as independent service capacity.`));
  const weakest = [...metrics.services].sort((a,b) => a.coverage - b.coverage || a.capacity - b.capacity || a.id.localeCompare(b.id));
  for (const service of weakest) {
    if (needsImprovement.length >= 3) break;
    if (service.coverage >= .95) continue;
    needsImprovement.push(trait(`need-${service.id}`,`${service.name}: a chair is still empty`,`${percent(service.coverage)} scenario service coverage. The current bottleneck is ${service.bottleneck.toLowerCase()}. More mastery in unrelated professions will not magically fill that chair.`));
  }
  if (!needsImprovement.length) needsImprovement.push(trait('stewardship','Keep the good thing running','Service targets are well covered. Preserve staffing and maintenance instead of letting the victory banner do everyone’s job.'));
  return { mode: small ? 'citizen-mix' : 'metrics', doingWell: doingWell.slice(0,3), needsImprovement: needsImprovement.slice(0,3) };
}
