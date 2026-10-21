import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { careerTree } from '../src/careers.js';
import { createInitialState, chooseNode, currentLearningActivity, hydrateState, choicesUnlocked } from '../src/game-engine.js';
import { discoveryData, professionById, findProfessions, populatedCategories, trainingRouteFor, selectProfessionGoal, nextGoalStep, canFollowRoute } from '../src/discovery.js';

test('every playable profession has one canonical browse record and a valid unchanged training route', () => {
  const leaves=[];
  function visit(nodes) { for (const node of nodes) if (node.children?.length) visit(node.children); else leaves.push(node); }
  visit(careerTree);
  assert.equal(professionById.size,leaves.length);
  assert.equal(new Set(discoveryData.professions.map(r=>r.id)).size,leaves.length);
  for(const node of leaves) {
    assert.equal(professionById.get(node.id).node,node);
    const path=trainingRouteFor(node.id);
    assert.equal(path.at(-1).id,node.id);
    assert.ok(path.length>1);
  }
});

test('cross-linked results reuse the same profession and support aliases and ambiguous interests', () => {
  const mental=findProfessions({categoryId:'mental-health'}).find(r=>r.id==='psychiatrist');
  const medical=findProfessions({categoryId:'healthcare'}).find(r=>r.id==='psychiatrist');
  assert.equal(mental,medical);
  assert.equal(findProfessions({query:'physiotherapist'})[0].id,'physical-therapist');
  const therapy=findProfessions({query:'therapist'}).map(r=>r.id);
  assert.ok(therapy.includes('clinical-social-worker'));
  assert.ok(therapy.includes('physical-therapist'));
  assert.ok(findProfessions({query:'nursery'}).some(r=>r.id==='childcare-worker'));
  assert.ok(findProfessions({categoryId:'agriculture'}).some(r=>r.id==='groundskeeper'));
  assert.ok(findProfessions({query:'SQL nonexistent role !@#$'}).length===0);
  assert.ok(populatedCategories().every(c=>findProfessions({categoryId:c.id}).length));
});

test('choosing a profession guides the next step without bypassing work or rewriting progress', () => {
  const fresh=createInitialState();
  const goal=selectProfessionGoal(fresh,'psychiatrist');
  assert.equal(goal.targetOccupationId,'psychiatrist');
  assert.deepEqual(goal.path,[]);
  assert.equal(nextGoalStep(goal).id,'medicine');
  const started=chooseNode(goal,'medicine');
  assert.deepEqual(started.path,['medicine']);
  assert.ok(currentLearningActivity(started));
  assert.equal(choicesUnlocked(started),false);
  assert.equal(chooseNode(started,nextGoalStep(started).id),started);
  assert.equal(selectProfessionGoal(started,'software-developer'),started);
  assert.equal(canFollowRoute(started,'software-developer'),false);
  const restored=hydrateState(JSON.parse(JSON.stringify(started)));
  assert.equal(restored.targetOccupationId,'psychiatrist');
  assert.deepEqual(restored.path,started.path);
  assert.equal(hydrateState({...started,targetOccupationId:'unknown'}).targetOccupationId,null);
  assert.deepEqual(chooseNode(goal,'engineering').path,['engineering']);
  assert.equal(chooseNode(goal,'engineering').targetOccupationId,null);
});

test('all 182 previously published profession paths remain valid', () => {
  const paths=JSON.parse(readFileSync(new URL('./fixtures/legacy-profession-paths.json',import.meta.url),'utf8'));
  assert.equal(Object.keys(paths).length,182);
  for(const [id,path] of Object.entries(paths)) {
    assert.deepEqual(trainingRouteFor(id).map(node=>node.id),path,id);
    assert.deepEqual(hydrateState({...createInitialState(),path}).path,path,id);
  }
});

test('common missing jobs and ambiguous interests have distinct playable destinations', () => {
  assert.equal(professionById.size,617);
  assert.equal(populatedCategories().length,26);
  const psychology=findProfessions({query:'psychology'}).map(r=>r.id);
  for(const id of ['clinical-psychologist','school-psychologist','research-psychologist','industrial-organizational-psychologist']) assert.ok(psychology.includes(id),id);
  for(const [query,id] of [['horticulturalist','horticulturist'],['rancher','rancher'],['payroll','payroll-clerk'],['CNA','nursing-assistant'],['vet tech','veterinary-technician'],['Uber driver','taxi-rideshare-driver']]) {
    assert.ok(findProfessions({query}).some(r=>r.id===id),query);
  }
  const nursery=findProfessions({query:'nursery'}).map(r=>r.id);
  assert.ok(nursery.includes('plant-nursery-manager'));
  assert.ok(nursery.includes('childcare-worker'));
  const mental=findProfessions({categoryId:'mental-health'}).find(r=>r.id==='school-psychologist');
  assert.equal(mental,findProfessions({categoryId:'education'}).find(r=>r.id==='school-psychologist'));
  assert.equal(mental,findProfessions({categoryId:'science'}).find(r=>r.id==='school-psychologist'));
  assert.deepEqual(trainingRouteFor('school-psychologist').map(n=>n.id),['community-service','school-psychologist']);
});
