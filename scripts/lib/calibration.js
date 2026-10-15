// Development-only fitting and scoring; never imported by browser entry points.
import { predictMetric, predictMetro, METRIC_IDS } from '../../src/world-models/inference.js';
export { predictMetric, predictMetro, deriveMetrics } from '../../src/world-models/inference.js';
export const TRAIN_END = 2016;
export const HOLDOUT_YEARS = [2017, 2018, 2019];
export { METRIC_IDS };
// Declared before holdout scoring; no target-dependent city corrections.
export const TOLERANCES = { population: .05, labourForce: .10, unemployment: 2, gdp: .10 };
const positive = key => key !== 'unemployment';
function fitTrend(rows, key, window, damping) {
  const usable = rows.filter(r => Number.isFinite(r[key]) && (!positive(key) || r[key] > 0)).slice(-window);
  if (usable.length < 3) throw new Error(`Insufficient training observations for ${key}`);
  const origin = usable.at(-1).year;
  const points = usable.map(r => [r.year - origin, positive(key) ? Math.log(r[key]) : r[key]]);
  const mx = points.reduce((s,p) => s+p[0],0)/points.length;
  const my = points.reduce((s,p) => s+p[1],0)/points.length;
  const slope = points.reduce((s,p) => s+(p[0]-mx)*(p[1]-my),0)/points.reduce((s,p) => s+(p[0]-mx)**2,0);
  // Anchor to the final known observation; residuals evaluate fitted annual increments.
  const last = points.at(-1)[1];
  const errors = points.slice(1).map((p,i) => p[1]-points[i][1]-slope*damping*(p[0]-points[i][0]));
  return { origin, last, slope: slope*damping, window, damping,
    innovation: Math.sqrt(errors.reduce((s,e) => s+e*e,0)/errors.length), count: points.length };
}
export function fitMetro(metro, end = TRAIN_END) {
  const training = metro.observations.filter(r => r.year >= 2010 && r.year <= end);
  if (training.length < 6) throw new Error('At least six training years are required.');
  const fits = {};
  for (const key of METRIC_IDS) {
    let best = null;
    // Rolling one-year validation, strictly within the training period.
    for (const window of [3,4,5,6,7]) for (const damping of [0,.25,.5,.75,1]) {
      let loss=0, n=0;
      for (const target of training.slice(3)) {
        if (!Number.isFinite(target[key])) continue;
        const prefix=training.filter(r=>r.year<target.year);
        if (prefix.filter(r=>Number.isFinite(r[key])).length<3) continue;
        const prediction=predictMetric(fitTrend(prefix,key,window,damping),key,target.year);
        const error=positive(key) ? Math.log(prediction/target[key]) : prediction-target[key];
        loss+=error*error; n++;
      }
      if (n && (!best || loss/n < best.loss-1e-15)) best={window,damping,loss:loss/n};
    }
    if (!best) throw new Error(`Cannot calibrate ${key}`);
    fits[key] = { ...fitTrend(training,key,best.window,best.damping), trainingLoss:best.loss };
  }
  return { metroId:metro.id, trainingStart:2010, trainingEnd:end, fits };
}
export function scoreMetro(metro, fitted=fitMetro(metro)) {
  const points=metro.observations.filter(r=>HOLDOUT_YEARS.includes(r.year)).map(observed=>({ observed, predicted:predictMetro(fitted,observed.year) }));
  const metrics={};
  for (const key of METRIC_IDS) {
    const valid=points.filter(p=>Number.isFinite(p.observed[key]));
    const errors=valid.map(p=>Math.abs(p.predicted[key]-p.observed[key])/(positive(key) ? p.observed[key] : 1));
    const mean=errors.reduce((s,e)=>s+e,0)/errors.length;
    metrics[key]={meanError:mean, maxError:Math.max(...errors), n:valid.length,
      unit:positive(key)?'fraction':'percentage points', tolerance:TOLERANCES[key]??null,
      passed:key in TOLERANCES ? valid.length===3 && mean<=TOLERANCES[key] : null };
  }
  return {metroId:metro.id, name:metro.name, metrics, passed:Object.keys(TOLERANCES).every(k=>metrics[k].passed), points};
}
export function evaluateMetros(metros) {
  const cities=metros.map(m=>scoreMetro(m));
  return {training:'2010–2016; rolling validation within training', holdout:HOLDOUT_YEARS,
    criteria:TOLERANCES, passed:cities.filter(c=>c.passed).length, total:cities.length,
    occupationEffectsValidated:false, sourceVerifiedAgainstPrimary:false, cities};
}
