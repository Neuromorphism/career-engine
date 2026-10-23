import { populatedCategories, findProfessions } from './discovery.js?v=0.11.1';

// Editorial browsing entry points. These do not change career prerequisites.
export const careerDirections = [
  { id: 'care', label: 'Care & support', copy: 'Health, psychology, public safety, and everyday care.', categories: ['healthcare', 'mental-health', 'community', 'personal', 'animals', 'safety'] },
  { id: 'build', label: 'Build & repair', copy: 'Buildings, machines, useful systems, and skilled trades.', categories: ['construction', 'engineering', 'manufacturing', 'facilities', 'technology'] },
  { id: 'discover', label: 'Investigate & discover', copy: 'Science, technology, people, and the natural world.', categories: ['science', 'technology', 'engineering', 'environment', 'mental-health'] },
  { id: 'create', label: 'Create & express', copy: 'Design, stories, food, and experiences for others.', categories: ['arts', 'hospitality', 'sales'] },
  { id: 'organize', label: 'Organize & lead', copy: 'Business, money, public service, and keeping things moving.', categories: ['business', 'finance', 'administration', 'sales', 'public-policy', 'legal', 'transport', 'military'] },
  { id: 'grow', label: 'Grow & guide', copy: 'Plants, animals, learning, fitness, and outdoor work.', categories: ['agriculture', 'animals', 'environment', 'education', 'sport'] },
];
export const discoveryPageSize = 6;
const categories = populatedCategories();
export function directionProfessions(direction) {
  return [...new Map(direction.categories.flatMap(categoryId => findProfessions({ categoryId })).map(role => [role.id, role])).values()];
}
export function discoveryView(input = {}) {
  const direction = careerDirections.find(d => d.id === input.direction);
  const category = categories.find(c => c.id === input.category);
  const family = category?.families.find(f => f.id === input.family);
  const query = String(input.query || '').trim().slice(0, 160);
  let title, copy, items, kind;
  if (query) {
    title = `Explore “${query}”`;
    copy = 'Search results from every work area. Open a profession to see its work and training.';
    items = findProfessions({ query }); kind = 'professions';
  } else if (category && family) {
    title = family.label; copy = 'Open a profession to see the work before deciding.';
    items = findProfessions({ categoryId: category.id, familyId: family.id }); kind = 'professions';
  } else if (category) {
    title = category.label; copy = 'Which part interests you? Choose a family to see its professions.';
    items = category.families.filter(f => findProfessions({ categoryId: category.id, familyId: f.id }).length); kind = 'families';
  } else if (direction || input.all) {
    title = direction?.label || 'Every work area';
    copy = direction ? 'Choose a work area. You can always take another direction.' : 'The full catalog, a few work areas at a time.';
    items = direction ? direction.categories.map(id => categories.find(c => c.id === id)) : categories; kind = 'categories';
  } else {
    title = 'What kind of work draws you in?';
    copy = 'Pick a starting point. Reveal the possibilities one step at a time.';
    items = careerDirections; kind = 'directions';
  }
  const page = Math.min(Math.max(0, Number.parseInt(input.page, 10) || 0), Math.max(0, Math.ceil(items.length / discoveryPageSize) - 1));
  return { title, copy, kind, direction, category, family, query, page, total: items.length,
    items: items.slice(page * discoveryPageSize, (page + 1) * discoveryPageSize) };
}

// Editions can keep exploration rooted in their own work area, including resets.
export function rootedDiscoveryView(input = {}, categoryId = '') {
  if (!categoryId) return input;
  return { category: categoryId, family: input.category === categoryId ? input.family : undefined, query: input.query, page: input.page };
}
