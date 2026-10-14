import test from 'node:test';
import assert from 'node:assert/strict';
import { careerTree, findNode } from '../src/careers.js';
import { createInitialState, chooseNode, work, currentLearningActivity, currentProject, completeProject, hydrateState, completeImpactAction, SAVE_KEY, AI_SAVE_KEY } from '../src/game-engine.js';
import { createWorld, hydrateWorld, addCitizen, activeCitizen, updateActiveCareer, switchCitizen, tickWorld, citizenContribution, citizenReady, worldMetrics, assignCitizen, projectReadiness, commissionProject, worldData, WORLD_SAVE_KEY } from '../world/world-engine.js';
import { createWorldStore } from '../world/save-store.js';
import { createCareerStore } from '../src/save-store.js';
import { worldStatus } from '../world/world-status.js';
function pathFor(id, nodes = careerTree, prefix = []) {
  for (const node of nodes) {
    if (node.id === id) return [...prefix, id];
    const found = pathFor(id, node.children || [], [...prefix, node.id]);
    if (found) return found;
  }
  return null;
}
function careerAt(id, mastery = 10000) {
  let career = createInitialState();
  for (const nodeId of pathFor(id)) {
    career = chooseNode(career, nodeId);
    while (currentLearningActivity(career)) career = work(career);
    while (currentProject(career)) {
      career = { ...career, mastery: Math.max(career.mastery, currentProject(career).requirement) };
      career = completeProject(career);
    }
  }
  return hydrateState({ ...career, mastery });
}
function addProfessional(world, id, name) {
  world = addCitizen(world, name);
  return updateActiveCareer(world, careerAt(id));
}
function memoryStorage() {
  const records = new Map();
  return { getItem: key => records.get(key) ?? null, setItem: (key,value) => records.set(key,value), records };
}

test('new citizens preserve earlier careers, choices, and established contributions', () => {
  let first = careerAt('carpenter');
  const action = findNode(first.path).impactActions[0];
  first = completeImpactAction(first, action.id, action.choices[2].id);
  let world = createWorld('Our world', first);
  const previous = activeCitizen(world);
  world = addCitizen(world, 'Amina');
  assert.equal(world.citizens.length, 2);
  assert.equal(world.citizens[0], previous);
  assert.equal(activeCitizen(world).career.mastery, 0);
  world = switchCitizen(world, previous.id);
  assert.deepEqual(activeCitizen(world).career.impactChoices, first.impactChoices);
  const restored = hydrateWorld(JSON.parse(JSON.stringify(world)));
  assert.equal(restored.citizens.length, 2);
  assert.equal(activeCitizen(restored).career.careerComplete, true);
});

test('only the active citizen learns, including capped offline progress', () => {
  let world = createWorld(undefined, careerAt('registered-nurse', 2500));
  world = addProfessional(world, 'family-medicine-physician', 'Doctor');
  const frozen = world.citizens[0].career.mastery;
  const start = activeCitizen(world).career.mastery;
  world = tickWorld(world, 1000000);
  assert.equal(world.citizens[0].career.mastery, frozen);
  assert.ok(activeCitizen(world).career.mastery > start);
  assert.ok(activeCitizen(world).career.mastery < start + 1000000);
});

test('resident development and immigration have explicit distinct population accounting', () => {
  let world = createWorld();
  assert.equal(worldMetrics(world).population, 500);
  world = addCitizen(world, 'Existing neighbor', 'resident');
  assert.equal(worldMetrics(world).population, 500);
  world = addCitizen(world, 'New neighbor', 'newcomer');
  assert.equal(worldMetrics(world).population, 501);
  assert.equal(worldMetrics(world).namedCitizens, 3);
});

test('unqualified mastery cannot supply services and qualified expertise is bounded', () => {
  const prepared = careerAt('registered-nurse');
  const world = createWorld(undefined, { ...prepared, completedLearningKeys: [], mastery: 100000000 });
  assert.equal(citizenReady(activeCitizen(world)), false);
  assert.ok(Object.values(citizenContribution(activeCitizen(world))).every(value => value === 0));
  const low = createWorld(undefined, careerAt('registered-nurse',2500));
  const high = createWorld(undefined, careerAt('registered-nurse',1000000));
  assert.equal(citizenContribution(activeCitizen(low)).nursing, .4);
  assert.equal(citizenContribution(activeCitizen(high)).nursing, .8);
});

test('more doctors do not replace missing nursing, while a complementary team improves health', () => {
  let world = createWorld(undefined, careerAt('family-medicine-physician'));
  const baseline = worldMetrics(world).services.find(s=>s.id==='health').baselineCoverage;
  for (let i=0;i<4;i++) world = addProfessional(world,'family-medicine-physician',`Doctor ${i}`);
  assert.equal(worldMetrics(world).services.find(s=>s.id==='health').coverage,baseline);
  world = addProfessional(world,'registered-nurse','Nurse');
  const health = worldMetrics(world).services.find(s=>s.id==='health');
  assert.ok(health.coverage > baseline);
  assert.equal(health.capacity,1);
});

test('an assignment cannot contribute to two services or a service and a project at once', () => {
  let world = createWorld(undefined,careerAt('registered-nurse'));
  const id=activeCitizen(world).id;
  const count = w => worldMetrics(w).services.filter(s=>s.contributors.some(c=>c.citizenId===id)).length;
  assert.equal(count(world),1);
  world=assignCitizen(world,id,'service:community',.5);
  assert.equal(count(world),1);
  assert.equal(worldMetrics(world).services.find(s=>s.id==='health').contributors.length,0);
  assert.equal(citizenContribution(activeCitizen(world)).nursing,.4);
  world=assignCitizen(world,id,'project:community-clinic',1);
  assert.equal(count(world),0);
  assert.equal(assignCitizen(world,id,'service:missing',1),world);
  assert.equal(assignCitizen(world,id,null,2),world);
});

test('shared projects require a real team and are commissioned and credited exactly once', () => {
  let world=createWorld(undefined,careerAt('structural-engineering'));
  const engineerId=activeCitizen(world).id;
  world=assignCitizen(world,engineerId,'project:local-crossing',1);
  assert.equal(projectReadiness(world,'local-crossing').ready,false);
  assert.equal(commissionProject(world,'local-crossing'),world);
  world=addProfessional(world,'carpenter','Builder');
  const carpenterId=activeCitizen(world).id;
  world=assignCitizen(world,carpenterId,'project:local-crossing',1);
  assert.equal(projectReadiness(world,'local-crossing').ready,true);
  world=commissionProject(world,'local-crossing');
  assert.equal(Object.keys(world.projects).length,1);
  assert.deepEqual(world.projects['local-crossing'].contributors,[engineerId,carpenterId]);
  assert.ok(world.citizens.every(c=>c.assignment===null));
  assert.equal(commissionProject(world,'local-crossing'),world);
  const restored=hydrateWorld(JSON.parse(JSON.stringify(world)));
  assert.equal(commissionProject(restored,'local-crossing'),restored);
  assert.ok(Math.abs(worldMetrics(restored).services.find(s=>s.id==='infrastructure').facility - .85) < 1e-9);
});

test('research and mentoring improve bounded reliability without inventing project delivery or workers', () => {
  let career=careerAt('registered-nurse');
  for (const action of findNode(career.path).impactActions) career=completeImpactAction(career,action.id,action.choices[1].id);
  const world=createWorld(undefined,career);
  const metrics=worldMetrics(world);
  const health=metrics.services.find(s=>s.id==='health');
  assert.equal(health.choiceCounts.research,3);
  assert.ok(health.reliability>.85);
  assert.equal(metrics.namedCitizens,1);
  assert.equal(Object.keys(world.projects).length,0);
});

test('all shared career endpoints have valid profiles and at least one usable assignment', () => {
  let count=0;
  const visit = nodes => nodes.forEach(node=>{
    if(node.children?.length) { visit(node.children); return; }
    count++;
    const career=careerAt(node.id),citizen=activeCitizen(createWorld(undefined,career));
    assert.ok(worldData.role_profiles[node.id],node.id);
    assert.ok(Object.values(citizenContribution(citizen)).some(value=>value>0),node.id);
  });
  visit(careerTree);
  assert.equal(count,182);
});

test('world migration copies single-path progress once and never changes either original endpoint save', () => {
  const storage=memoryStorage(),career=careerAt('carpenter');
  const bytes=JSON.stringify(career),aiBytes=JSON.stringify({mastery:23,aiMastery:17});
  storage.setItem(SAVE_KEY,bytes);storage.setItem(AI_SAVE_KEY,aiBytes);
  let store=createWorldStore(storage);
  assert.equal(store.load().mastery,career.mastery);
  assert.deepEqual(store.getWorld().importMarkers,[SAVE_KEY]);
  store.save(activeCitizen(store.getWorld()).career);
  store=createWorldStore(storage);store.load();
  assert.equal(store.getWorld().citizens.length,1);
  assert.equal(Object.keys(store.getWorld().projects).length,0);
  assert.equal(storage.getItem(SAVE_KEY),bytes);
  assert.equal(storage.getItem(AI_SAVE_KEY),aiBytes);
});

test('world reload advances only the active citizen and switching does not replay inactive time', () => {
  const storage=memoryStorage();
  let world=createWorld(undefined,careerAt('carpenter',2500));
  world=addProfessional(world,'registered-nurse','Nurse');world.savedAt=1000;
  storage.setItem(WORLD_SAVE_KEY,JSON.stringify(world));
  const store=createWorldStore(storage,()=>11000);store.load();
  assert.equal(store.getWorld().citizens[0].career.mastery,2500);
  const switched=switchCitizen(store.getWorld(),'citizen-1');
  assert.equal(activeCitizen(switched).career.mastery,2500);
});

test('bad or future world saves are preserved and storage failure is explicit', () => {
  const storage=memoryStorage();const bytes=JSON.stringify({schemaVersion:900,citizens:[]});
  storage.setItem(WORLD_SAVE_KEY,bytes);
  assert.throws(()=>createWorldStore(storage).load(),/unsupported/);
  assert.equal(storage.getItem(WORLD_SAVE_KEY),bytes);
  const failing={getItem:()=>null,setItem:()=>{throw new Error('Quota exceeded');}};
  const store=createWorldStore(failing);const career=store.load();
  assert.throws(()=>store.save(career),/Quota/);
  assert.ok(store.getWorld().citizens.length);
});

test('normal and AI endpoints retain isolated save stores', () => {
  const storage=memoryStorage();
  createCareerStore('single',storage).save({...createInitialState(),mastery:11});
  createCareerStore('ai',storage).save({...createInitialState(),mastery:7,aiMastery:5});
  assert.equal(createCareerStore('single',storage).load().mastery,11);
  assert.equal(createCareerStore('ai',storage).load().aiMastery,5);
  assert.equal(storage.getItem(WORLD_SAVE_KEY),null);
});

test('World Status gives one to three deterministic traits in each category', () => {
  let world=createWorld();
  for (let i=0;i<12;i++) {
    const status=worldStatus(world);
    assert.ok(status.doingWell.length>=1 && status.doingWell.length<=3);
    assert.ok(status.needsImprovement.length>=1 && status.needsImprovement.length<=3);
    assert.deepEqual(worldStatus(world),status);
    assert.equal(status.mode,world.citizens.length<=5?'citizen-mix':'metrics');
    world=addCitizen(world,`Neighbor ${i}`);
  }
});

test('small-world humor follows the exact citizen mix without claiming invented services', () => {
  const single=createWorld(undefined,careerAt('journalist'));
  assert.match(worldStatus(single).doingWell[0].description,/talking to yourself/);
  let world=createWorld(undefined,careerAt('carpenter'));
  world=addProfessional(world,'mechanical-design-engineer','Engineer');
  world=addProfessional(world,'graphic-designer','Artist');
  assert.ok(worldStatus(world).doingWell.some(t=>t.id==='walk-into-world'));
  world=createWorld(undefined,careerAt('carpenter'));
  world=addProfessional(world,'carpenter','Second carpenter');
  world=addProfessional(world,'graphic-designer','Artist');
  const status=worldStatus(world);
  assert.ok(status.doingWell.some(t=>t.id==='designer-houses'));
  assert.ok(status.needsImprovement.some(t=>t.id==='houses-not-clinics'));
  assert.equal(Object.keys(world.projects).length,0);
});

test('project eligibility respects the profession as well as generic capability weights', () => {
  let world=createWorld(undefined,careerAt('software-developer'));
  assert.equal(assignCitizen(world,activeCitizen(world).id,'project:local-crossing',1),world);
  // Even a forged assignment cannot use software design as qualified bridge design.
  world={...world,citizens:world.citizens.map(c=>({...c,assignment:'project:local-crossing'}))};
  assert.equal(projectReadiness(world,'local-crossing').rows.find(r=>r.capability==='design').supplied,0);
  world=createWorld(undefined,careerAt('veterinarian'));
  assert.equal(assignCitizen(world,activeCitizen(world).id,'project:community-clinic',1),world);
});
