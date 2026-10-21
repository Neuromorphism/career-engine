import { discoveryData } from './discovery-data.js?v=0.11.0';
import { careerTree } from './careers.js?v=0.11.0';
export { discoveryData };
const normalize = text => String(text || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const categoryById = new Map(discoveryData.categories.map(c => [c.id, c]));
const routes = new Map();
function index(nodes, ancestors = []) {
  for (const node of nodes) {
    const path = [...ancestors, node];
    if (node.children?.length) index(node.children, path);
    else routes.set(node.id, path);
  }
}
index(careerTree);
export function trainingRouteFor(professionId) { return routes.get(professionId) || null; }
export function browsePathLabel(path) {
  const category = categoryById.get(path.category_id);
  const family = category?.families.find(f => f.id === path.family_id);
  return category && family ? `${category.label} → ${family.label}` : '';
}
const records = discoveryData.professions.map(role => {
  const route = trainingRouteFor(role.id);
  const node = route.at(-1);
  const paths = [role.primary, ...role.also_found_under];
  const direct = [role.label, node.name, node.jobTitle, ...role.search_terms].filter(Boolean).map(normalize);
  return { ...role, node, trainingRoute: route, paths, direct, search: normalize([...direct, ...paths.map(browsePathLabel)].join(' ')) };
});
export const professionById = new Map(records.map(r => [r.id, r]));
export function searchHint(query) {
  const needle = normalize(query);
  return discoveryData.search_routes.find(route => [route.query, ...route.aliases].some(term => normalize(term) === needle)) || null;
}
export function findProfessions({ query = '', categoryId = '', familyId = '' } = {}) {
  const needle = normalize(query), terms = needle.split(' ').filter(Boolean), hint = searchHint(query);
  return records.filter(role => (!categoryId || role.paths.some(p => p.category_id === categoryId && (!familyId || p.family_id === familyId)))
    && (!needle || terms.every(term => role.search.includes(term)) || hint?.role_ids.includes(role.id)))
    .map(role => ({ role, score: !needle ? 0 : role.direct.includes(needle) ? 100 : role.direct.some(title => title.startsWith(needle)) ? 75 : hint?.role_ids.includes(role.id) ? 50 : 10 }))
    .sort((a, b) => b.score - a.score || a.role.label.localeCompare(b.role.label)).map(item => item.role);
}
export function populatedCategories() {
  return discoveryData.categories.filter(c => records.some(r => r.paths.some(p => p.category_id === c.id)));
}
export function nextGoalStep(state) {
  const route = trainingRouteFor(state.targetOccupationId);
  if (!route || !state.path.every((id, index) => route[index]?.id === id)) return null;
  return route[state.path.length] || null;
}
export function canFollowRoute(state, professionId) {
  const route = trainingRouteFor(professionId);
  return Boolean(route && state.path.every((id, index) => route[index]?.id === id));
}
export function selectProfessionGoal(state, professionId) {
  if (!professionById.has(professionId) || !canFollowRoute(state, professionId)) return state;
  return { ...state, targetOccupationId: professionId, lastMessage: `Explore ${professionById.get(professionId).label}. Complete the training steps along its route.` };
}
