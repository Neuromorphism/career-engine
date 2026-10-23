import { populatedCategories, findProfessions, professionById, browsePathLabel, searchHint, canFollowRoute } from './discovery.js?v=0.11.1';
import { discoveryPageSize, discoveryView, directionProfessions, rootedDiscoveryView } from './discovery-navigation.js?v=0.11.1';
import { learningTrackForNode } from './game-engine.js?v=0.11.1';
import { escapeHtml as e } from './career-ui.js?v=0.11.1';

const hashPrefix = '#careers?';
function readLocation() {
  if (!location.hash.startsWith(hashPrefix)) return {};
  const params = new URLSearchParams(location.hash.slice(hashPrefix.length));
  return { direction: params.get('direction'), category: params.get('category'), family: params.get('family'), query: params.get('query'), all: params.get('all') === '1', page: params.get('page') };
}
function browseLink(view) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(view)) {
    if (value != null && value !== '' && value !== false && value !== 0) params.set(key, value === true ? '1' : value);
  }
  return `${hashPrefix}${params}`;
}

/** Discovery uses canonical professions; browsing never changes saved progress. */
export function mountProfessionBrowser(container, { getState, onChooseGoal, onOpen = () => {}, rootCategory = '' }) {
  const rootView = { category: rootCategory };
  const scopedView = input => rootedDiscoveryView(input, rootCategory);
  let view = scopedView(readLocation()), previewId = null, previewSignature = '';
  const initiallyOpen = !getState().path.length && !getState().targetOccupationId;
  container.innerHTML = `<details class="profession-browser" ${initiallyOpen ? 'open' : ''}>
    <summary>Explore professions</summary>
    <div class="discovery-step"></div>
    <form class="profession-search-form"><label for="profession-search">Have a title in mind? Search every profession.</label>
      <div class="profession-search-row"><input id="profession-search" name="query" maxlength="160" type="search" placeholder="${rootCategory ? 'Try thermal, robotics, or protection' : 'Try psychology, plants, or electrician'}" autocomplete="off" /><button type="submit">Search</button></div>
    </form>
    <a class="discovery-all" href="${browseLink(rootCategory ? rootView : { all: true })}">${rootCategory ? 'Browse engineering families' : 'Browse every work area'} →</a>
    <p class="discovery-note">${professionById.size} professions · ${populatedCategories().length} work areas. Exploring is not a commitment.</p>
  </details>
  <dialog class="profession-preview" aria-labelledby="profession-preview-title"><button type="button" data-close-preview aria-label="Close profession preview">Close</button><div class="profession-preview-content"></div></dialog>`;
  const $ = selector => container.querySelector(selector);
  const details = $('.profession-browser'), search = $('#profession-search'), dialog = $('dialog');

  function go(nextView) {
    const hash = browseLink(nextView);
    if (location.hash === hash) { view = scopedView(nextView); render(true); }
    else location.hash = hash;
  }
  function preview(id) {
    const role = professionById.get(id);
    if (!role) return;
    previewId = id;
    previewSignature = JSON.stringify([getState().path, getState().targetOccupationId]);
    const canChoose = canFollowRoute(getState(), id);
    const samples = learningTrackForNode(role.node, role.trainingRoute.length).activities[0].choices;
    $('.profession-preview-content').innerHTML = `<p class="kicker">Profession preview</p><h3 id="profession-preview-title">${e(role.label)}</h3>
      <p>${e(role.node.blurb)}</p><p class="profession-home">${e(browsePathLabel(role.primary))}</p>
      <h4>What might you work on?</h4><ul class="profession-work-samples">${samples.map(c => `<li>${e(c.title)}</li>`).join('')}</ul>
      <details><summary>Training route · ${role.trainingRoute.length} stages</summary><ol>${role.trainingRoute.map(n => `<li>${e(n.name)}</li>`).join('')}</ol><p>Complete the work and projects along this route. Exploring a profession does not grant a qualification.</p></details>
      ${role.also_found_under.length ? `<details><summary>Other ways to find this profession</summary><div class="profession-cross-links">${role.also_found_under.map(p => `<a href="${e(browseLink({ category: p.category_id, family: p.family_id }))}" data-cross-link>${e(browsePathLabel(p))}</a>`).join('')}</div></details>` : ''}
      ${!canChoose ? '<p>This profession follows a different route from your current run. Begin a new run, or develop another citizen, to follow it. Your current progress is preserved.</p>' : ''}
      <button class="profession-follow" type="button" data-follow-profession="${e(id)}" ${canChoose ? '' : 'disabled'}>${getState().path.at(-1) === id ? 'Keep this profession as your goal' : 'Follow this profession’s training route'}</button>`;
    $('.profession-preview-content').querySelectorAll('[data-cross-link]').forEach(link => link.addEventListener('click', () => dialog.close()));
    $('[data-follow-profession]').addEventListener('click', () => {
      if (!canFollowRoute(getState(), id)) return;
      if (location.hash.startsWith(hashPrefix)) history.replaceState(null, '', location.pathname + location.search);
      dialog.close(); details.open = false; onChooseGoal(id);
      document.querySelector('#path-heading').focus();
    });
    if (!dialog.open) dialog.showModal();
  }

  function render(focus = false) {
    const result = discoveryView(view);
    const { direction, category, family } = result;
    const crumbs = rootCategory ? [{ label: 'Engineering', view: rootView }] : [{ label: 'Start', view: {} }];
    if (!result.query) {
      if (direction) crumbs.push({ label: direction.label, view: { direction: direction.id } });
      else if (view.all) crumbs.push({ label: 'All work areas', view: { all: true } });
      if (category && !rootCategory) crumbs.push({ label: category.label, view: { direction: direction?.id, category: category.id, all: view.all } });
      if (family) crumbs.push({ label: family.label, view });
    }
    const breadcrumbMarkup = crumbs.map((c, index) => index === crumbs.length - 1 && !result.query ? `<span aria-current="location">${e(c.label)}</span>` : `<a href="${e(browseLink(c.view))}">${e(c.label)}</a>`).join('<span aria-hidden="true">/</span>');
    const cards = result.items.map(item => {
      let url, label = item.label, copy = '', meta = '';
      if (result.kind === 'directions') {
        url = { direction: item.id }; copy = item.copy; meta = `${directionProfessions(item).length} professions to discover`;
      } else if (result.kind === 'categories') {
        url = { ...view, category: item.id, page: 0 };
        copy = item.families.slice(0, 2).map(f => f.label).join(' · ');
        meta = `${findProfessions({ categoryId: item.id }).length} professions`;
      } else if (result.kind === 'families') {
        url = { ...view, family: item.id, page: 0 };
        meta = `${findProfessions({ categoryId: category.id, familyId: item.id }).length} professions`;
      } else {
        copy = browsePathLabel(item.primary);
        if (category && item.primary.category_id !== category.id) meta = 'Also found in this work area';
      }
      const content = `<span><strong>${e(label)}</strong>${copy ? `<span>${e(copy)}</span>` : ''}${meta ? `<small>${e(meta)}</small>` : ''}</span><span class="discovery-arrow" aria-hidden="true">→</span>`;
      return url ? `<a class="discovery-choice" href="${e(browseLink(url))}">${content}</a>` : `<button type="button" class="discovery-choice profession-result" data-preview-profession="${e(item.id)}">${content}</button>`;
    }).join('');
    const hint = searchHint(result.query);
    const parent = result.query ? rootView : crumbs.length > 1 ? crumbs.at(-2).view : null;
    $('.discovery-step').innerHTML = `<nav class="discovery-breadcrumbs" aria-label="Career exploration path">${breadcrumbMarkup}${result.query ? '<span aria-current="location">Search results</span>' : ''}</nav>
      ${parent ? `<a class="discovery-back" href="${e(browseLink(parent))}">← Back</a>` : ''}
      <h3 id="discovery-heading" tabindex="-1">${e(result.title)}</h3><p>${e(result.copy)}</p>
      ${hint ? `<p class="discovery-hint">${e(hint.note)}</p>` : ''}
      <p class="discovery-count" role="status">${result.total} ${result.kind === 'professions' ? 'professions found' : result.kind === 'directions' ? 'starting directions' : result.kind === 'families' ? 'work families' : 'work areas'}</p>
      <div class="discovery-choices ${result.kind === 'professions' ? 'is-profession-list' : ''}">${cards || '<p>No matching profession. Try another title or browse every work area below.</p>'}</div>
      ${result.total > discoveryPageSize ? `<nav class="profession-pagination" aria-label="More career choices">${result.page ? `<a href="${e(browseLink({ ...view, page: result.page - 1 }))}">← Previous</a>` : '<span></span>'}<span>${result.page * discoveryPageSize + 1}–${Math.min((result.page + 1) * discoveryPageSize, result.total)} of ${result.total}</span>${(result.page + 1) * discoveryPageSize < result.total ? `<a href="${e(browseLink({ ...view, page: result.page + 1 }))}">Next →</a>` : '<span></span>'}</nav>` : ''}`;
    search.value = result.query;
    $('.discovery-step').querySelectorAll('[data-preview-profession]').forEach(button => button.addEventListener('click', () => preview(button.dataset.previewProfession)));
    if (focus) $('#discovery-heading').focus();
  }
  $('.profession-search-form').addEventListener('submit', event => {
    event.preventDefault(); go({ query: search.value.trim() });
  });
  details.addEventListener('toggle', () => { if (details.open) onOpen(); });
  window.addEventListener('hashchange', event => {
    const browsing = location.hash.startsWith(hashPrefix);
    if (!browsing && !new URL(event.oldURL).hash.startsWith(hashPrefix)) return;
    if (dialog.open) dialog.close();
    view = scopedView(readLocation());
    if (browsing) details.open = true;
    render(browsing || (!location.hash && details.open));
  });
  $('[data-close-preview]').addEventListener('click', () => dialog.close());
  render();
  if (location.hash.startsWith(hashPrefix)) details.open = true;
  const sharedProfession = new URLSearchParams(window.location.search).get('profession');
  if (sharedProfession && professionById.has(sharedProfession)) preview(sharedProfession);
  return {
    refresh() {
      if (dialog.open && previewId && previewSignature !== JSON.stringify([getState().path, getState().targetOccupationId])) preview(previewId);
    },
    open() { details.open = true; $('#discovery-heading').focus(); },
    close() { details.open = false; },
    reset() {
      if (dialog.open) dialog.close();
      view = scopedView({}); previewId = null;
      // Citizen switches and resets must not inherit the previous citizen's browsing context.
      if (location.hash.startsWith(hashPrefix)) history.replaceState(null, '', location.pathname + location.search);
      details.open = !getState().path.length && !getState().targetOccupationId;
      render();
    },
  };
}
