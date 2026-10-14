import { curricula } from "./career-data.js?v=0.10.0";
export { curricula };

export function curriculumFor(nodeId) {
  return curricula[nodeId] || null;
}
