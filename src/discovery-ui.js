import { discoveryData, populatedCategories, findProfessions, professionById, browsePathLabel, searchHint, canFollowRoute } from './discovery.js?v=0.11.0';
import { learningTrackForNode } from './game-engine.js?v=0.11.0';
import { escapeHtml as e } from './career-ui.js?v=0.11.0';

/** Discovery links always point to a canonical profession; they never change prerequisites. */
export function mountProfessionBrowser(container, { getState, onChooseGoal }) {
  const categories = populatedCategories();
  let categoryId = '', familyId = '', page = 0, previewId = null;
  const pageSize = 24;
  container.innerHTML = `<details class="profession-browser" ${getState().path.length ? '' : 'open'}>
    <summary>Find a profession</summary>
    <p>Search by job title, or browse familiar work areas. A profession can appear in several places.</p>
    <label for="profession-search">Job title or interest</label>
    <input id="profession-search" type="search" placeholder="Try psychology, farming, software, or therapist…" autocomplete="off" />
    <div class="profession-filters"><label for="profession-category">Work area<select id="profession-category"><option value="">All work areas</option>${categories.map(c => `<option value="${e(c.id)}">${e(c.label)}</option>`).join('')}</select></label>
    <label for="profession-family">Work family<select id="profession-family"><option value="">All work families</option></select></label></div>
    <p class="discovery-hint" id="profession-search-hint" hidden></p>
    <div class="profession-category-grid"></div><p id="profession-results-count" aria-live="polite"></p>
    <div class="profession-results"></div><div class="profession-pagination"></div>
  </details>
  <dialog class="profession-preview" aria-labelledby="profession-preview-title"><button type="button" data-close-preview aria-label="Close profession preview">Close</button><div class="profession-preview-content"></div></dialog>`;
  const $ = selector => container.querySelector(selector);
  const details = $('.profession-browser'), search = $('#profession-search'), category = $('#profession-category'), family = $('#profession-family'), dialog = $('dialog');
  function setFamilyOptions() {
    const c = discoveryData.categories.find(c => c.id === categoryId);
    const available = c?.families.filter(f => findProfessions({ categoryId, familyId: f.id }).length) || [];
    family.innerHTML = `<option value="">All work families</option>${available.map(f => `<option value="${e(f.id)}">${e(f.label)}</option>`).join('')}`;
    family.disabled = !categoryId;
  }
  function setCategory(id, selectedFamily = '') {
    categoryId = id; familyId = selectedFamily; category.value = id; page = 0;
    setFamilyOptions(); family.value = selectedFamily; render();
  }
  function preview(id) {
    const role = professionById.get(id);
    if (!role) return;
    previewId = id;
    const canChoose = canFollowRoute(getState(), id);
    const samples = learningTrackForNode(role.node, role.trainingRoute.length).activities[0].choices;
    $('.profession-preview-content').innerHTML = `<p class="kicker">Profession preview</p><h3 id="profession-preview-title">${e(role.label)}</h3>
      <p>${e(role.node.blurb)}</p><p class="profession-home">${e(browsePathLabel(role.primary))}</p>
      ${role.also_found_under.length ? `<p>Also find this profession under:</p><div class="profession-cross-links">${role.also_found_under.map(p => `<button type="button" data-cross-category="${e(p.category_id)}" data-cross-family="${e(p.family_id)}">${e(browsePathLabel(p))}</button>`).join('')}</div>` : ''}
      <details><summary>Examples of the work</summary><ul>${samples.map(c => `<li>${e(c.title)}</li>`).join('')}</ul></details>
      <details open><summary>Training route</summary><ol>${role.trainingRoute.map(n => `<li>${e(n.name)}</li>`).join('')}</ol><p>Complete the work and projects along this route. Exploring a profession does not grant a qualification.</p></details>
      ${!canChoose ? '<p>This profession follows a different route from your current run. Begin a new run, or develop another citizen, to follow it.</p>' : ''}
      <button class="profession-follow" type="button" data-follow-profession="${e(id)}" ${canChoose ? '' : 'disabled'}>${getState().path.at(-1) === id ? 'Keep this profession as your goal' : 'Follow this profession’s training route'}</button>`;
    $('.profession-preview-content').querySelectorAll('[data-cross-category]').forEach(button => button.addEventListener('click', () => {
      dialog.close(); setCategory(button.dataset.crossCategory, button.dataset.crossFamily); details.open = true; search.focus();
    }));
    $('[data-follow-profession]').addEventListener('click', () => {
      if (!canFollowRoute(getState(), id)) return;
      dialog.close(); details.open = false; onChooseGoal(id);
    });
    if (!dialog.open) dialog.showModal();
  }
  function render() {
    const query = search.value;
    const hint = searchHint(query);
    $('#profession-search-hint').hidden = !hint;
    $('#profession-search-hint').textContent = hint?.note || '';
    const browsing = Boolean(query.trim() || categoryId);
    $('.profession-category-grid').hidden = browsing;
    $('.profession-category-grid').innerHTML = browsing ? '' : categories.map(c => {
      const roles = findProfessions({ categoryId: c.id });
      return `<button type="button" class="profession-category" data-browse-category="${e(c.id)}"><strong>${e(c.label)}</strong><span>${e(roles.slice(0, 3).map(r => r.label).join(' · '))}</span><small>${roles.length} professions</small></button>`;
    }).join('');
    $('.profession-category-grid').querySelectorAll('[data-browse-category]').forEach(button => button.addEventListener('click', () => setCategory(button.dataset.browseCategory)));
    const matches = browsing ? findProfessions({ query, categoryId, familyId }) : [];
    page = Math.max(0, Math.min(page, Math.ceil(matches.length / pageSize) - 1));
    $('#profession-results-count').textContent = browsing ? `${matches.length} ${matches.length === 1 ? 'profession' : 'professions'} found` : `${professionById.size} professions across ${categories.length} work areas. Choose an area or search above.`;
    $('.profession-results').innerHTML = browsing ? matches.length ? matches.slice(page * pageSize, (page + 1) * pageSize).map(role => `<button type="button" class="profession-result" data-preview-profession="${e(role.id)}"><strong>${e(role.label)}</strong><span>${e(browsePathLabel(role.primary))}</span>${categoryId && role.primary.category_id !== categoryId ? '<small>Also found in this work area</small>' : ''}</button>`).join('') : '<p>No matching profession. Try a different title or clear the work-area filter.</p>' : '';
    $('.profession-results').querySelectorAll('[data-preview-profession]').forEach(button => button.addEventListener('click', () => preview(button.dataset.previewProfession)));
    $('.profession-pagination').innerHTML = matches.length > pageSize ? `<button type="button" data-page="previous" ${page === 0 ? 'disabled' : ''}>Previous</button><span>Page ${page + 1} of ${Math.ceil(matches.length / pageSize)}</span><button type="button" data-page="next" ${(page + 1) * pageSize >= matches.length ? 'disabled' : ''}>Next</button>` : '';
    $('.profession-pagination').querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => { page += button.dataset.page === 'next' ? 1 : -1; render(); $('#profession-results-count').scrollIntoView({ block: 'nearest' }); }));
  }
  search.addEventListener('input', () => { page = 0; render(); });
  category.addEventListener('change', () => setCategory(category.value));
  family.addEventListener('change', () => { familyId = family.value; page = 0; render(); });
  $('[data-close-preview]').addEventListener('click', () => dialog.close());
  setFamilyOptions(); render();
  const sharedProfession = new URLSearchParams(window.location.search).get('profession');
  if (sharedProfession && professionById.has(sharedProfession)) preview(sharedProfession);
  return {
    refresh() { if (dialog.open && previewId) preview(previewId); },
    open() { details.open = true; search.focus(); },
  };
}
