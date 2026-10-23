import { currentNode } from '../src/game-engine.js?v=0.11.1';
import { escapeHtml as e } from '../src/career-ui.js?v=0.11.1';
import { worldData, worldMetrics, citizenReady, citizenAssignment, assignmentOptions, projectReadiness } from './world-engine.js?v=0.11.1';
import { worldStatus } from './world-status.js?v=0.11.1';
const percent = value => `${Math.round(value * 100)}%`;
const number = value => Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value);
export function mountWorldUI(handlers) {
  const panel = document.querySelector('#world-dashboard');
  panel.innerHTML = `
    <section class="module world-overview" aria-labelledby="world-heading">
      <p class="kicker">One world · many professional lives</p><h2 id="world-heading"></h2>
      <p class="module-intro">Develop one citizen at a time. Their expertise stays in the world when you begin another career. Qualified citizens keep contributing to their assigned work.</p>
      <nav class="world-shortcuts" aria-label="World navigation"><a href="#active-citizen-heading">Develop active citizen →</a><a href="#world-status-heading">World Status</a><a href="#citizens-heading">Citizens</a><a href="#world-projects-heading">Shared projects</a></nav>
      <div class="world-summary" id="world-summary"></div>
      <div class="world-controls">
        <form id="add-citizen-form"><label for="citizen-name">Next citizen</label><input id="citizen-name" name="name" maxlength="80" placeholder="Choose a name" /><label for="citizen-origin">Their arrival</label><select id="citizen-origin" name="origin"><option value="resident">Develop an existing resident</option><option value="newcomer">Welcome a newcomer</option></select><button type="submit">Add citizen</button></form>
        <details><summary>World name and backups</summary><form id="rename-world-form"><label for="world-name-input">World name</label><input id="world-name-input" maxlength="80" required /><button type="submit">Save name</button></form><button id="export-world" type="button">Export world</button><label class="file-label" for="import-world">Import a world backup</label><input type="file" id="import-world" accept="application/json,.json" /><p>Import replaces this world after confirmation. Export it first to keep both.</p></details>
      </div>
      <p id="world-feedback" role="status" aria-live="polite"></p>
      <p class="world-model-note">Starting scenario: ${worldData.scenario.baseline_population} residents and modest baseline services. Named citizens are individuals, not thousands of invisible workers. The measures below are game capacity and service indices.</p>
    </section>
    <section class="module world-status" aria-labelledby="world-status-heading"><p class="kicker">The community's current character</p><h2 id="world-status-heading">World Status</h2><div id="world-status-content"></div></section>
    <section class="module" aria-labelledby="world-metrics-heading"><p class="kicker">Expertise → capabilities → services</p><h2 id="world-metrics-heading">World capacity</h2><div class="world-metrics" id="world-metrics"></div><p class="module-intro">Capacity shows progress toward the required skill mix. Delivered service coverage is limited by the scarcest required capability, facilities, and reliability. Project assignments temporarily remove citizens from routine services.</p></section>
    <section class="module" aria-labelledby="citizens-heading"><p class="kicker">No citizen disappears when a new career begins</p><h2 id="citizens-heading">Your citizens</h2><div id="citizen-roster" class="citizen-roster"></div></section>
    <section class="module" aria-labelledby="world-projects-heading"><p class="kicker">Many contributors · one shared achievement</p><h2 id="world-projects-heading">Shared projects</h2><p class="module-intro">Assign qualified citizens to a project, then commission it once the team meets every requirement. Contributors return to their usual services afterward; the institution adds facility capacity. Career mission scenarios are separate from these world projects.</p><div id="world-projects" class="world-projects"></div></section>`;
  document.querySelector('#add-citizen-form').addEventListener('submit', event => {
    event.preventDefault(); handlers.add(document.querySelector('#citizen-name').value, document.querySelector('#citizen-origin').value);
  });
  document.querySelector('#rename-world-form').addEventListener('submit', event => { event.preventDefault(); handlers.rename(document.querySelector('#world-name-input').value); });
  document.querySelector('#export-world').addEventListener('click', handlers.export);
  document.querySelector('#import-world').addEventListener('change', event => { if (event.target.files[0]) handlers.import(event.target.files[0]); event.target.value = ''; });
  document.querySelector('#citizen-roster').addEventListener('click', event => {
    const button = event.target.closest('[data-switch-citizen]'); if (button) handlers.switch(button.dataset.switchCitizen);
  });
  document.querySelector('#citizen-roster').addEventListener('change', event => {
    const card = event.target.closest('[data-citizen-card]'); if (!card) return;
    const assignment = card.querySelector('[data-assignment]')?.value || null;
    const availability = Number(card.querySelector('[data-availability]').value);
    handlers.assign(card.dataset.citizenCard, assignment, availability);
  });
  document.querySelector('#world-projects').addEventListener('click', event => {
    const button = event.target.closest('[data-commission]'); if (button) handlers.commission(button.dataset.commission);
  });
}
function updateHTML(selector, markup) {
  const container = document.querySelector(selector);
  const opened = new Set([...container.querySelectorAll('details[open]')].map(detail => detail.dataset.detail));
  container.innerHTML = markup;
  for (const detail of container.querySelectorAll('details')) if (opened.has(detail.dataset.detail)) detail.open = true;
}
export function renderWorldUI(world, { force = false, metrics = worldMetrics(world) } = {}) {
  const status = worldStatus(world, metrics);
  document.querySelector('#world-heading').textContent = world.name;
  const nameInput = document.querySelector('#world-name-input');
  if (document.activeElement !== nameInput) nameInput.value = world.name;
  const citizen = world.citizens.find(c => c.id === world.activeCitizenId);
  document.querySelector('#active-citizen-heading').textContent = `${citizen.name} · ${currentNode(citizen.career)?.name || 'Choose a field'}`;
  document.querySelector('#world-summary').innerHTML = `<div><strong>${metrics.population}</strong><span>Residents · explicit scenario population</span></div><div><strong>${metrics.namedCitizens}</strong><span>Playable citizens</span></div><div><strong>${metrics.readyCitizens}</strong><span>Qualified contributors</span></div><div><strong>${metrics.establishedCitizens}</strong><span>Careers mastered</span></div>`;
  document.querySelector('#world-status-content').innerHTML = `<div class="status-column doing-well"><h3>Doing well</h3><ul>${status.doingWell.map(t => `<li><strong>${e(t.title)}</strong><p>${e(t.description)}</p></li>`).join('')}</ul></div><div class="status-column needs-improvement"><h3>Needs improvement</h3><ul>${status.needsImprovement.map(t => `<li><strong>${e(t.title)}</strong><p>${e(t.description)}</p></li>`).join('')}</ul></div>`;
  updateHTML('#world-metrics', metrics.services.map(service => `<article class="world-metric"><h3>${e(service.name)}</h3><strong class="world-capacity">${percent(service.capacity)}</strong><span>Capability target covered</span><meter min="0" max="1" value="${service.capacity}" aria-label="${e(service.name)} capability target"></meter><p>Service coverage <b>${percent(service.coverage)}</b> · baseline ${percent(service.baselineCoverage)} · added ${Math.round(service.addedCoverage * 100)} percentage points</p><p class="metric-bottleneck">Bottleneck: ${e(service.bottleneck)}</p><details data-detail="metric-${service.id}"><summary>Why this number?</summary><p>${e(service.description)}</p><ul>${service.ratios.map(r => `<li>${e(r.label)}: ${number(r.baseline)} baseline + ${number(r.added)} citizen capacity / ${number(r.required)} target</li>`).join('')}</ul><p>Facility capacity: ${percent(service.facility)}. Reliability: ${percent(service.reliability)}. Coverage = minimum of demand, facility, and workforce × reliability.</p><p>Contributors: ${service.contributors.length ? service.contributors.map(c => e(c.name)).join(', ') : 'baseline providers only'}.</p><p>Completed career contributions: ${number(service.completedContributions)} (weighted by work availability). Professional experience supports bounded reliability; it does not add staff.</p></details></article>`).join(''));
  if (force || !document.activeElement?.closest('#citizen-roster')) {
    document.querySelector('#citizen-roster').innerHTML = world.citizens.map(c => {
      const options = assignmentOptions(c).filter(option => !option.id.startsWith('project:') || !world.projects[option.id.slice(8)]);
      const assigned = citizenAssignment(c);
      return `<article class="citizen-card ${c.id === world.activeCitizenId ? 'is-active' : ''}" data-citizen-card="${e(c.id)}"><div><h3>${e(c.name)}</h3><p>${e(currentNode(c.career)?.name || 'Choosing a career')} · ${c.career.careerComplete ? 'career mastered' : citizenReady(c) ? 'qualified contributor' : 'in training'}</p><p>${number(c.career.mastery)} mastery · ${c.origin === 'newcomer' ? 'newcomer' : 'existing resident'}</p></div><div class="citizen-controls"><button type="button" data-switch-citizen="${e(c.id)}" ${c.id === world.activeCitizenId ? 'disabled' : ''}>${c.id === world.activeCitizenId ? 'Active citizen' : 'Continue this citizen'}</button><label>Work assignment<select data-assignment ${!options.length ? 'disabled' : ''}>${options.length ? `<option value="">Usual service</option>${options.map(option => `<option value="${e(option.id)}" ${option.id === assigned && c.assignment ? 'selected' : ''}>${e(option.name)}</option>`).join('')}` : '<option value="">Choose a career first</option>'}</select></label><label>Work availability<select data-availability>${[0,.25,.5,.75,1].map(value => `<option value="${value}" ${c.availability === value ? 'selected' : ''}>${percent(value)}</option>`).join('')}</select></label></div></article>`;
    }).join('');
  }
  updateHTML('#world-projects', worldData.projects.map(definition => {
    const project = projectReadiness(world, definition.id);
    const record = world.projects[project.id];
    return `<article class="world-project ${project.commissioned ? 'is-complete' : ''}"><p class="kicker">${project.commissioned ? 'Established institution' : 'Team project'}</p><h3>${e(project.name)}</h3><p>${e(project.description)}</p><details data-detail="project-${project.id}"><summary>${project.commissioned ? 'Contributors and requirements' : 'Team requirements'}</summary><ul>${project.rows.map(row => `<li>${row.ready ? '✓' : '○'} ${e(row.label)}: ${number(row.supplied)} / ${number(row.required)} game capacity units</li>`).join('')}</ul></details>${record ? `<p>Credited contributors: ${record.contributors.map(id => e(world.citizens.find(c => c.id === id)?.name || id)).join(', ')}.</p>` : ''}<button type="button" data-commission="${project.id}" ${!project.ready || project.commissioned ? 'disabled' : ''}>${project.commissioned ? 'Commissioned · credited once' : project.ready ? 'Commission shared project' : 'Assign and develop the required team'}</button></article>`;
  }).join(''));
}
export function worldFeedback(message) { document.querySelector('#world-feedback').textContent = message; }
