import { impactModels } from "./career-data.js?v=0.10.1";
export { impactModels };

export function evaluateImpact(modelId) {
  return impactModels[modelId] || null;
}
