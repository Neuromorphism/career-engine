import { impactModels } from "./career-data.js?v=0.11.0";
export { impactModels };

export function evaluateImpact(modelId) {
  return impactModels[modelId] || null;
}
