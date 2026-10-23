import test from 'node:test';
import assert from 'node:assert/strict';
import { careerDirections, directionProfessions, discoveryPageSize, discoveryView } from '../src/discovery-navigation.js';
import { populatedCategories, professionById, findProfessions } from '../src/discovery.js';

function allPages(view) {
  const first = discoveryView(view);
  return Array.from({ length: Math.ceil(first.total / discoveryPageSize) }, (_, page) => discoveryView({ ...view, page }).items).flat();
}

test('six starting directions cover every work area and canonical profession', () => {
  assert.equal(careerDirections.length, 6);
  assert.equal(discoveryView().items.length, 6);
  const areas = new Set(careerDirections.flatMap(d => d.categories));
  assert.deepEqual(areas, new Set(populatedCategories().map(c => c.id)));
  const roles = new Set(careerDirections.flatMap(directionProfessions).map(r => r.id));
  assert.deepEqual(roles, new Set(professionById.keys()));
  for (const direction of careerDirections) {
    const ids = directionProfessions(direction).map(r => r.id);
    assert.equal(new Set(ids).size, ids.length, 'counts deduplicate cross-links');
  }
});

test('progressive browsing reaches every profession through pages of at most six choices', () => {
  const reached = new Set();
  for (const category of allPages({ all: true })) {
    const familyView = { category: category.id };
    assert.equal(discoveryView(familyView).kind, 'families');
    for (const family of allPages(familyView)) {
      const view = { category: category.id, family: family.id };
      const roles = allPages(view);
      assert.deepEqual(roles.map(r => r.id), findProfessions({ categoryId: category.id, familyId: family.id }).map(r => r.id));
      assert.ok(discoveryView(view).items.length <= 6);
      for (const role of roles) reached.add(role.id);
    }
  }
  assert.deepEqual(reached, new Set(professionById.keys()));
});

test('search remains global from deep browsing and preserves alias ranking', () => {
  const result = discoveryView({ direction: 'build', category: 'construction', family: 'electrical-trades', query: 'physiotherapist' });
  assert.equal(result.kind, 'professions');
  assert.equal(result.items[0].id, 'physical-therapist');
  assert.deepEqual(result.items.map(r => r.id), findProfessions({ query: 'physiotherapist' }).slice(0, 6).map(r => r.id));
  assert.equal(discoveryView({ query: 'no-such-profession-xyzzy' }).total, 0);
});

test('pagination is bounded and cross-linked professions retain canonical identity', () => {
  const input = { category: 'mental-health', family: 'psychiatry' };
  assert.equal(discoveryView({ ...input, page: -10 }).page, 0);
  assert.equal(discoveryView({ ...input, page: 999 }).page, 0);
  assert.equal(discoveryView({ ...input, page: 'bad' }).page, 0);
  assert.equal(discoveryView(input).items[0].id, 'psychiatrist');
  assert.ok(allPages({ category: 'healthcare', family: 'mental-health-care' }).find(r => r.id === 'psychiatrist') === discoveryView(input).items[0]);
  assert.equal(discoveryView({ direction: 'unknown', category: 'unknown', family: 'unknown' }).kind, 'directions');
  assert.equal(discoveryView({ query: 'not-a-real-title', page: 999 }).page, 0);
});
