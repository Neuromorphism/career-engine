// Browser-safe prediction only. All fitting and scoring lives in scripts/lib/.
export const TREND_STRUCTURE = {
  family: 'anchored-trend', version: 1, forecastHorizon: 10,
  metrics: {
    population: { transform: 'log', min: 0 },
    labourForce: { transform: 'log', min: 0 },
    unemployment: { transform: 'linear', min: 0, max: 100 },
    gdp: { transform: 'log', min: 0 },
    density: { transform: 'log', min: 0 },
    pm25: { transform: 'log', min: 0 },
  },
};
export const METRIC_IDS = Object.keys(TREND_STRUCTURE.metrics);
export function predictMetric(fit, key, year, structure = TREND_STRUCTURE) {
  const metric = structure.metrics[key];
  if (!metric) throw new Error(`Unsupported metric: ${key}`);
  if (!Number.isInteger(year) || year < fit.origin || year > fit.origin + structure.forecastHorizon) throw new Error('Forecast must be within the model horizon.');
  const value = fit.last + fit.slope * (year - fit.origin);
  const decoded = metric.transform === 'log' ? Math.exp(value) : value;
  return Math.max(metric.min, Math.min(metric.max ?? Infinity, decoded));
}
export function predictMetro(fitted, year, structure = TREND_STRUCTURE) {
  const snapshot={year};
  for (const key of Object.keys(structure.metrics)) snapshot[key]=predictMetric(fitted.fits[key],key,year,structure);
  return deriveMetrics(snapshot);
}
export function deriveMetrics(snapshot) {
  const employed=snapshot.labourForce*(1-snapshot.unemployment/100);
  return { ...snapshot, employed, gdpPerCapita:snapshot.gdp*1e6/snapshot.population,
    outputPerEmployed:snapshot.gdp*1e6/employed,
    labourForceToPopulation:snapshot.labourForce/snapshot.population };
}
// Reject stale or unsupported artifacts rather than silently training a replacement.
export function validateModelArtifact(artifact, data) {
  if (artifact?.schemaVersion !== 1 || artifact.modelId !== 'real-world' || artifact.modelVersion !== 1) throw new Error('Unsupported metropolitan model artifact.');
  if (artifact.sourceHash !== data.source.sha256) throw new Error('Model weights do not match the metropolitan observations. Regenerate them during development.');
  const s = artifact.structure;
  if (s?.family !== 'anchored-trend' || s.version !== 1 || !Number.isInteger(s.forecastHorizon) || s.forecastHorizon < 1 || !s.metrics || Object.keys(s.metrics).length !== METRIC_IDS.length) throw new Error('Unsupported metropolitan model structure.');
  for (const key of METRIC_IDS) {
    const metric = s.metrics[key];
    if (!metric || !['log', 'linear'].includes(metric.transform) || !Number.isFinite(metric.min) || (metric.max !== undefined && (!Number.isFinite(metric.max) || metric.max < metric.min))) throw new Error(`Invalid structure for ${key}.`);
  }
  if (!Number.isInteger(artifact.trainingEnd) || !Number.isInteger(artifact.simulationEnd) || artifact.simulationEnd < artifact.trainingEnd || artifact.simulationEnd > artifact.trainingEnd + s.forecastHorizon) throw new Error('Invalid model simulation window.');
  if (!Array.isArray(artifact.fittedModels) || artifact.fittedModels.length !== data.metros.length) throw new Error('Incomplete metropolitan model weights.');
  const ids = new Set();
  for (const model of artifact.fittedModels) {
    if (ids.has(model.metroId) || !data.metros.some(m => m.id === model.metroId) || model.trainingEnd !== artifact.trainingEnd) throw new Error('Invalid metropolitan model coverage.');
    ids.add(model.metroId);
    for (const key of METRIC_IDS) {
      const fit = model.fits?.[key];
      if (!fit || fit.origin !== artifact.trainingEnd || !Number.isFinite(fit.last) || !Number.isFinite(fit.slope) || !Number.isFinite(fit.innovation) || fit.innovation < 0) throw new Error(`Invalid weights for ${model.metroId}/${key}.`);
    }
  }
  if (!artifact.validation || artifact.validation.total !== data.metros.length || !Array.isArray(artifact.validation.cities) || artifact.validation.cities.length !== data.metros.length) throw new Error('Incomplete precomputed validation results.');
  return artifact;
}
