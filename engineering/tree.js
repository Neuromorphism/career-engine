// One canonical hierarchy for engineering training and profession discovery.
export function organizeEngineeringTree(root, curricula) {
  const oldPaths = [];
  function record(node, path = []) {
    const next = [...path, node.id]; oldPaths.push(next);
    node.children?.forEach(child => record(child, next));
  }
  record(root);
  const nodes = new Map(root.children.map(node => [node.id, node]));
  function branch(id, name, children) {
    const node = { id: `eng-area-${id}`, name, blurb: `Choose the part of ${name.toLowerCase()} you want to explore.`, decisionLabel: 'engineering direction', children };
    curricula[node.id] = structuredClone(curricula.engineering);
    curricula[node.id].title = `${name} foundation`;
    curricula[node.id].activities.forEach((activity, i) => activity.choices.forEach((choice, j) => { choice.id = `${node.id}:learning:${i}:${j}`; }));
    return node;
  }
  const take = (...ids) => ids.map(id => {
    const node = nodes.get(id);
    if (!node) throw new Error(`Missing engineering branch: ${id}`);
    nodes.delete(id); return node;
  });
  const group = (id, name, ...ids) => branch(id, name, take(...ids));
  root.children = [
    branch('electrical', 'Electrical, electronics & control', [
      ...take('electrical-engineering', 'eng-power-energy', 'eng-controls-robotics'),
      group('electronics', 'Chips & electronic hardware', 'eng-chips-electronics', 'computer-hardware-engineer', 'electrical-electronics-engineer'),
      group('communications', 'Communications & electronics services', 'electronics-engineering-technician', 'telecommunications-technician', 'audiovisual-installer', 'telecommunications-lineworker'),
    ]),
    branch('built-environment', 'Civil infrastructure & environment', [
      ...take('civil-engineering', 'eng-structures-ground', 'eng-water-environment'),
      group('civil-practice', 'Civil & environmental practice', 'civil-engineer', 'environmental-engineer', 'gis-specialist'),
    ]),
    branch('machines', 'Machines, flight & medical devices', [
      group('mechanical', 'Mechanical & thermal engineering', 'mechanical-engineering', 'mechanical-engineer', 'eng-machines-thermal-systems'),
      group('flight', 'Aircraft & spacecraft', 'aerospace-engineering', 'aerospace-engineer', 'eng-aerospace-space-systems'),
      group('medical', 'Biomedical & assistive engineering', 'biomedical-engineering', 'biomedical-engineer', 'eng-medical-devices-human-systems'),
    ]),
    branch('process-production', 'Materials, processes & production', [
      ...take('chemical-engineering', 'eng-materials-chemistry', 'materials-engineer', 'industrial-engineering', 'eng-manufacturing-quality'),
    ]),
    branch('computing', 'Software, data & computing infrastructure', [
      group('software', 'Software development & verification', 'software-engineering', 'computer-programmer', 'software-qa-tester', 'web-developer', 'eng-software-infrastructure'),
      group('data', 'Data, research & analysis', 'computer-research-scientist', 'systems-analyst', 'database-administrator-architect', 'data-analyst'),
      group('it', 'Networks & IT operations', 'it-support-technician', 'systems-administrator', 'network-architect', 'it-specialist', 'it-manager'),
    ]),
    branch('assurance-practice', 'Systems assurance & engineering practice', [
      ...take('eng-systems-reliability-assurance', 'engineering-manager', 'engineering-specialist'),
      group('technical-practice', 'Technical design, support & repair', 'technical-drafter', 'engineering-technician', 'office-equipment-repair-technician'),
    ]),
  ];
  if (nodes.size) throw new Error(`Ungrouped engineering nodes: ${[...nodes.keys()]}`);
  // The eight chip specialties form two meaningful choices, each below six.
  const chips = root.children[0].children.find(n => n.id === 'eng-area-electronics').children[0];
  const byId = new Map(chips.children.map(n => [n.id, n]));
  const chipGroup = (id, label, ids) => branch(id, label, ids.map(id => byId.get(id)));
  chips.children = [
    chipGroup('chip-design', 'Circuit design & programmable logic', ['eng-analog-ic-design-engineer', 'eng-rf-circuit-engineer', 'eng-fpga-engineer', 'eng-signal-integrity-engineer']),
    chipGroup('chip-delivery', 'Verification, implementation & fabrication', ['eng-mixed-signal-verification-engineer', 'eng-physical-design-engineer', 'eng-design-for-test-engineer', 'eng-semiconductor-process-engineer']),
  ];
  const newPaths = new Map();
  function index(node, path = []) {
    const next = [...path, node.id]; newPaths.set(node.id, next);
    node.children?.forEach(child => index(child, next));
  }
  index(root);
  root.previousPaths = Object.fromEntries(oldPaths.map(path => [JSON.stringify(path), newPaths.get(path.at(-1))]));
}
