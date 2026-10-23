import { infrastructureMetrics, infrastructureData } from '../src/world-models/infrastructure.js?v=0.11.1';
import { professions } from '../src/world-models/professions.js?v=0.11.1';
import { escapeHtml as e } from '../src/career-ui.js?v=0.11.1';
const names=new Map(professions.map(p=>[p.id,p.name]));
const elementNames=new Map(infrastructureData.elements.map(p=>[p.id,p.name]));
const groupsLabel=groups=>groups.map(g=>g.map(id=>names.get(id)||id).join(' or ')).join(' + ');
const pct=x=>`${Math.round(x*100)}%`;
let lastMarkup;
export function mountInfrastructureUI(onScenario) {
  document.querySelector('#world-overview').open=true;
  document.querySelector('#world-overview > summary').textContent='World overview · infrastructure, citizens and status';
  const section=document.createElement('section');
  section.className='module'; section.id='infrastructure'; section.setAttribute('aria-labelledby','infrastructure-heading');
  section.innerHTML=`<p class="kicker">Your professions build the community</p><h2 id="infrastructure-heading">Infrastructure</h2>
    <p>Construction happens automatically when qualified, available residents cover every required profession. Develop a carpenter to build homes, then a plumber and electrician to upgrade them.</p>
    <div id="infrastructure-content" aria-live="polite"></div>
    <details><summary>Historical starting conditions</summary><p>Optional US household snapshots, scaled to this fictional community. These are national housing-unit shares, not measured city conditions. Existing homes are assumed; other infrastructure is unknown until constructed.</p>
      <form id="infra-history-form"><label for="infra-history">Starting snapshot</label><select id="infra-history"><option value="us-1925">1925 · 50% electricity access proxy</option><option value="us-1940">1940 · about 55% complete plumbing</option><option value="us-1950">1950 · about 65% complete plumbing</option><option value="us-1960">1960 · about 83% complete plumbing</option></select><button id="infra-history-button">Use historical start</button></form><p>Available only before construction. This adds existing stock; it does not add imaginary professions.</p></details>
    <details><summary>All infrastructure and model evidence</summary><div id="infra-catalog"></div><p>One qualified specialist unlocks a community-scale improvement instantly. Materials, financing, land, technology availability and construction duration are bundled game assumptions. Missing maintenance staff do not erase buildings. Household coverage is separate from the original service indices.</p><p>${infrastructureData.sources.map(s=>`<a href="${e(s.url)}" target="_blank" rel="noopener">${e(s.id)}</a>: ${e(s.note)}`).join('</p><p>')}</p><p>Plumbing adoption uses a logistic curve fitted to 1940–1970 national counts. Held-out 1980/1990 mean error: ${infrastructureData.adoptionFit.holdoutMaePP.toFixed(2)} percentage points. Historical starts use observed shares. Profession unlocks remain authored game rules.</p><a href="../data/infrastructure.toml">Infrastructure TOML</a> · <a href="README.md">Model documentation</a></details>`;
  document.querySelector('#world-status-heading').closest('section').before(section);
  document.querySelector('.world-shortcuts').insertAdjacentHTML('beforeend','<a href="#infrastructure-heading">Infrastructure</a>');
  document.querySelector('#infra-history-form').addEventListener('submit',event=>{event.preventDefault();onScenario(document.querySelector('#infra-history').value);});
}
function card(item) {
  const built=item.coverage>0;
  return `<article class="world-project ${built?'is-complete':''}"><p class="kicker">${e(item.category)} · ${built?'Constructed':'Next opportunity'}</p><h4>${e(item.name)}</h4><p>${e(item.description)}</p>
    ${built?`<p><strong>${pct(item.coverage)} infrastructure coverage</strong> · ${item.origin==='historical'?'historical access estimate':item.origin==='assumed'?'assumed starting stock':'automatically constructed'}</p><p>${item.operational?'Maintenance professions present':`Maintenance needs: ${e(groupsLabel(item.maintenanceMissing))}`}</p>`:''}
    ${item.coverage<1?`<p>Requires: ${e(groupsLabel(item.profession_groups))}.</p><p>${item.missingProfessions.length?`Still needed: ${e(groupsLabel(item.missingProfessions))}.`:'Profession requirements met.'} ${item.missingInfrastructure.length?`Build first: ${e(item.missingInfrastructure.map(id=>elementNames.get(id)).join(', '))}.`:''}</p>`:''}</article>`;
}
export function renderInfrastructureUI(world) {
  const m=infrastructureMetrics(world);
  const markup=`<p><strong>${m.constructed.length} of ${m.elements.length} elements constructed</strong> · ${e(world.infrastructureScenario==='settlement'?'New settlement':world.infrastructureScenario.replace('us-','US household snapshot '))}</p>
    <div class="world-summary">${m.homeUpgrades.map(x=>`<div><strong>${pct(x.coverage)}</strong><span>${e(x.name)} · housing coverage</span></div>`).join('')}</div>
    <h3>Already constructed</h3><div class="world-projects">${m.constructed.length?m.constructed.map(card).join(''):'<p>No infrastructure yet. Your first qualified carpenter will start building homes.</p>'}</div>
    <h3>Next opportunities</h3><div class="world-projects">${m.upcoming.length?m.upcoming.map(card).join(''):'<p>All infrastructure is constructed.</p>'}</div>`;
  if(markup!==lastMarkup) {document.querySelector('#infrastructure-content').innerHTML=markup;lastMarkup=markup;}
  const catalog=document.querySelector('#infra-catalog');
  const catalogMarkup=`<ul>${m.elements.map(x=>`<li><strong>${e(x.name)}</strong> — ${e(groupsLabel(x.profession_groups))}${x.requires.length?`; after ${e(x.requires.map(id=>elementNames.get(id)).join(', '))}`:''}</li>`).join('')}</ul>`;
  if(catalog.innerHTML!==catalogMarkup) catalog.innerHTML=catalogMarkup;
  document.querySelector('#infra-history-button').disabled=!!m.constructed.length||world.infrastructureScenario!=='settlement';
}
