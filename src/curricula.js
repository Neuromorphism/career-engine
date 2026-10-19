import { curricula } from "./career-data.js?v=0.10.1";
export { curricula };

export function curriculumFor(nodeId) {
  return curricula[nodeId] || null;
}
