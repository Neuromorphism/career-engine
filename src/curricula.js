import { curricula } from "./career-data.js?v=0.9.0";
export { curricula };

export function curriculumFor(nodeId) {
  return curricula[nodeId] || null;
}
