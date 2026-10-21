import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateImpact, impactModels } from '../src/impact-models.js';
import { careerStats, careerRoutes, careerTransitions } from '../src/career-data.js';

test('bridge scenario keeps crossings, person-hours, and economic valuation distinct', () => {
  const { metrics, limits } = evaluateImpact('bridge');
  assert.equal(metrics['Vehicle crossings'], 2_190_000_000);
  assert.equal(metrics['Person-hours saved'], 474_500_000);
  assert.equal(metrics['Gross time benefit ($)'], 9_490_000_000);
  assert.match(limits, /discounting/);
  assert.match(limits, /GDP/);
});

test('clinical scenarios distinguish conditional life-years, relative risk, and cases', () => {
  assert.equal(evaluateImpact('cardiac').metrics['Additional life-years in successful-case scenario'], 58);
  assert.equal(evaluateImpact('prevention').metrics['Expected events prevented over five years'], 4000);
  assert.equal(evaluateImpact('vaccine').metrics['Expected cases prevented'], 36000);
});

test('solar output includes annual degradation and correct MWh-to-tonnes conversion', () => {
  const reference = 1000 * 8760 * .25 * Array.from({ length: 25 }, (_, i) => .995 ** i).reduce((a,b) => a+b, 0);
  const model = evaluateImpact('solar');
  assert.ok(Math.abs(model.metrics['Electricity delivered (MWh)'] - reference) < .0001);
  assert.ok(Math.abs(model.metrics['Modeled CO₂ avoided (tonnes)'] - reference * .4) < .0001);
});

test('the source preserves occupational coverage and auditable career routes', () => {
  assert.equal(careerStats.socGroupsRepresented, 23);
  assert.equal(careerStats.impactActions, 1851);
  assert.equal(Object.keys(careerRoutes).length, 32);
  assert.ok(Object.values(careerRoutes).every(route => route.stages.length && Array.isArray(route.credential_gates) && route.notes));
  assert.ok(careerTransitions.every(edge => edge.automatic_unlock === false && edge.additional_requirements.length));
  assert.ok(Object.values(impactModels).every(model => model.assumptions && model.limits && model.references.length));
  assert.equal(evaluateImpact('unknown'), null);
});
