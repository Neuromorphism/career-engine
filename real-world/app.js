import { startCareerApp } from '../src/app.js?v=0.11.0';
import { escapeHtml as e, downloadJSON, showLoadError } from '../src/career-ui.js?v=0.11.0';
import { currentNode } from '../src/game-engine.js?v=0.11.0';
import { activeCitizen, addCitizen, switchCitizen, citizenReady } from '../world/world-engine.js?v=0.11.0';
import { getWorldModel } from '../src/world-models/registry.js?v=0.11.0';
import { allocateWorkers, predictRealWorld } from '../src/world-models/real-world.js?v=0.11.0';
import { professions } from '../src/world-models/professions.js?v=0.11.0';
import { worldModelData } from './model-data.js?v=0.11.0';
import { metroData } from './metro-data.js?v=0.11.0';
import { createRealWorldStore } from './save-store.js?v=0.11.0';
const model=getWorldModel('real-world'), store=createRealWorldStore();
const report=worldModelData.validation;
const format=(n,d=0)=>Intl.NumberFormat('en',{maximumFractionDigits:d}).format(n);
const money=n=>`$${format(n,0)}`;
const percent=n=>`${format(n*100,1)}%`;
let app, mounted=false, lastSignature='';
function feedback(text) {document.querySelector('#lab-feedback').textContent=text;}
function change(transform,message) {
  try {
    store.syncCareer(app.getState());
    const next=transform(store.getWorld());
    store.updateWorld(next);
    const saved=app.replaceState(activeCitizen(next).career);
    feedback(saved?message:'Changed in this tab. Storage is unavailable; export before closing.');
  } catch(error) {feedback(error.message);}
}
function mount() {
  const detail=document.querySelector('#world-overview');
  detail.querySelector('summary').textContent='Metropolitan laboratory · observations, forecasts and workforce';
  detail.open=true;
  document.querySelector('#world-dashboard').innerHTML=`
    <section class="module" aria-labelledby="lab-heading">
      <p class="kicker">Historical metropolitan laboratory · 2010–2019</p><h2 id="lab-heading">A world grounded in observations</h2>
      <p>Develop careers below, allocate the wider workforce here, and advance one year at a time. Each named citizen is one person. Population and economic trends are fitted to the archived data.</p>
      <div class="metro-controls"><label>Metropolitan area<select id="metro-select">${metroData.metros.map(m=>`<option value="${m.id}">${e(m.name)} · ${e(m.country)}</option>`).join('')}</select></label><button id="advance-year" type="button">Advance one year</button><button id="restart-year" type="button">Return to 2016</button><button id="export-lab" type="button">Export laboratory</button><label>Import laboratory<input id="import-lab" type="file" accept="application/json,.json" /></label></div>
      <p id="lab-feedback" role="status" aria-live="polite"></p><p id="metro-context"></p>
      <div id="metro-stats" class="metro-stats"></div>
      <div class="lab-note">Historical baseline fit: <b>${report.passed}/${report.total} metros pass</b> the declared criteria. Madrid fails unemployment. Amsterdam was added after that failure; it remains visible in the full results. Profession effects are exploratory and have not been trained against observed occupation mixes.</div>
      <div class="lab-panel"><h3>Economic trajectory</h3><div id="lab-chart"></div><div class="lab-scroll"><table class="lab-table"><caption>Annual GDP · million USD at constant 2015 prices and PPP</caption><thead><tr><th scope="col">Year</th><th scope="col">Archived</th><th scope="col">Model</th><th scope="col">Error</th></tr></thead><tbody id="trajectory-rows"></tbody></table></div></div>
      <div class="lab-grid"><section class="lab-panel"><h3>Workforce experiment</h3><p>Headcounts reserve people from the modeled employed workforce. Existing workers’ occupations are unobserved in this archive; unclassified workers continue their real work. These allocations are your scenario, not a census.</p>
      <form id="allocation-form" class="metro-controls"><label>Profession<select id="profession-select">${professions.map(p=>`<option value="${e(p.id)}">${e(p.name)}</option>`).join('')}</select></label><label>Total allocated to this profession<input id="worker-count" type="number" min="0" step="1" value="0" required /></label><button type="submit">Set workforce</button></form>
      <p id="workforce-summary"></p><div id="allocations"></div>
      <label>Assumed relative productivity of allocated workers<select id="productivity-multiplier">${[.5,.75,1,1.25,1.5,2].map(n=>`<option value="${n}" ${n===1?'selected':''}>${n} × existing workforce</option>`).join('')}</select></label><p id="scenario-output"></p><p>This multiplier is a sensitivity assumption. The historical GDP forecast remains unchanged. There is no observed evidence here that reallocating these professions causes an output gain.</p>
      </section><section class="lab-panel"><h3>Services supported by the scenario</h3><p>These game indices use the existing career capability weights. They measure only the allocated and qualified named workers. They are not measured service coverage, health, or education outcomes.</p><div id="service-indices" class="lab-index"></div><h3>Your professional lives</h3><form id="lab-add-form" class="metro-controls"><label>Name<input id="lab-name" maxlength="80" placeholder="Next citizen" /></label><button type="submit">Develop resident</button></form><div id="lab-roster" class="lab-roster"></div></section></div>
      <details class="lab-panel"><summary>Calibration, all metros and source provenance</summary><p>Fit: 2010–2016. Window and trend damping selected by rolling one-year validation inside training. Test: 2017–2019. Pass means mean absolute error ≤5% population, ≤10% labor force, ≤10% GDP, and ≤2 percentage points unemployment over all three test years. No profession parameters were fitted. Derived ratios are not independent outcomes.</p><div class="lab-scroll"><table class="lab-table"><caption>Temporal holdout results; secondary archive, not independent primary-source verification</caption><thead><tr><th>Metro</th><th>Population</th><th>Labor force</th><th>GDP</th><th>Unemployment</th><th>Baseline</th></tr></thead><tbody>${report.cities.map(c=>`<tr><th scope="row">${e(c.name)}</th><td>${percent(c.metrics.population.meanError)}</td><td>${percent(c.metrics.labourForce.meanError)}</td><td>${percent(c.metrics.gdp.meanError)}</td><td>${format(c.metrics.unemployment.meanError,2)} pp</td><td class="${c.passed?'lab-pass':'lab-fail'}">${c.passed?'Pass':'Fail'}</td></tr>`).join('')}</tbody></table></div>
      <p><a href="${metroData.source.url}" target="_blank" rel="noreferrer">Archived observations · Di Maio &amp; Somma</a> · <a href="${metroData.source.upstream}" target="_blank" rel="noreferrer">OECD FUA definitions</a> · <a href="../data/real-world/calibration-report.json">Download full calibration and simulation report</a> · <a href="../data/real-world/raw/pre-imputation.csv">Archived input CSV</a></p><p>${e(metroData.source.quality)}</p><p>${e(metroData.source.license)} Retrieved ${metroData.source.retrieved}. Years: ${e(metroData.source.coverage)}. Model ranges use training innovations; they are not validated confidence intervals. Pollution trends do not include profession or emissions mechanisms.</p></details>
    </section>`;
  document.querySelector('#metro-select').addEventListener('change',event=>change(w=>({...w,metroId:event.target.value,year:worldModelData.trainingEnd,allocations:{}}),'Metro changed. Named careers retained; workforce allocation reset.'));
  document.querySelector('#advance-year').addEventListener('click',()=>change(model.step,'Advanced one simulated year. Career learning time is separate.'));
  document.querySelector('#restart-year').addEventListener('click',()=>change(w=>({...w,year:worldModelData.trainingEnd}),'Returned to the final training year.'));
  document.querySelector('#allocation-form').addEventListener('submit',event=>{event.preventDefault();change(w=>allocateWorkers(w,document.querySelector('#profession-select').value,Number(document.querySelector('#worker-count').value)),'Workforce experiment updated.');});
  document.querySelector('#profession-select').addEventListener('change',()=>{document.querySelector('#worker-count').value=store.getWorld().allocations[document.querySelector('#profession-select').value]||0;});
  document.querySelector('#productivity-multiplier').addEventListener('change',event=>change(w=>({...w,productivityMultiplier:Number(event.target.value)}),'Output sensitivity assumption updated.'));
  document.querySelector('#lab-add-form').addEventListener('submit',event=>{event.preventDefault();change(w=>addCitizen(w,document.querySelector('#lab-name').value,'resident',Math.floor(model.metrics(w).population)),'New resident ready to develop a career.');document.querySelector('#lab-name').value='';});
  document.querySelector('#lab-roster').addEventListener('click',event=>{const b=event.target.closest('[data-switch]');if(b)change(w=>switchCitizen(w,b.dataset.switch),'Continuing this citizen’s professional life.');});
  document.querySelector('#export-lab').addEventListener('click',()=>{store.syncCareer(app.getState());downloadJSON(store.getWorld(),'career-engine-real-world.json');feedback('Laboratory exported.');});
  document.querySelector('#import-lab').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try {const next=model.hydrate(JSON.parse(await file.text()));if(window.confirm('Replace this laboratory with the imported backup? Export first to keep it.')) change(()=>next,'Laboratory imported.');}catch(error){feedback(`Import failed: ${error.message}`);}event.target.value='';
  });
}
function chart(metro) {
  const observations=metro.observations.filter(r=>r.year>=2010);
  const forecasts=Array.from({length:worldModelData.simulationEnd-worldModelData.trainingEnd+1},(_,i)=>predictRealWorld(metro.id,worldModelData.trainingEnd+i));
  const all=[...observations,...forecasts].map(r=>r.gdp),low=Math.min(...all)*.96,high=Math.max(...all)*1.04;
  const x=y=>50+(y-2010)/9*680,y=v=>205-(v-low)/(high-low)*175;
  const path=rows=>rows.map(r=>`${x(r.year)},${y(r.gdp)}`).join(' ');
  document.querySelector('#lab-chart').innerHTML=`<svg viewBox="0 0 770 250" role="img" aria-label="Archived GDP from 2010 to 2019 in green; model forecast from 2016 in brown. Exact values are in the table below."><rect x="${x(2016.5)}" y="20" width="${x(2019)-x(2016.5)}" height="190" fill="#ded8c9"/><text x="${x(2017)}" y="18">Holdout</text><polyline points="${path(observations)}" fill="none" stroke="#37634a" stroke-width="3"/><polyline points="${path(forecasts)}" fill="none" stroke="#95623e" stroke-width="3" stroke-dasharray="7 4"/>${[2010,2013,2016,2019].map(year=>`<text x="${x(year)-12}" y="230">${year}</text>`).join('')}<text x="55" y="18">${e(format(high/1000,1))}B</text><text x="55" y="205">${e(format(low/1000,1))}B</text></svg><p>Green: archived GDP. Brown dashed: forecast from 2016. Shaded: held-out years.</p>`;
  document.querySelector('#trajectory-rows').innerHTML=forecasts.map(p=>{
    const o=observations.find(r=>r.year===p.year);return `<tr><th scope="row">${p.year}${p.year===2016?' · anchor':''}</th><td>${format(o.gdp)}</td><td>${format(p.gdp)}</td><td>${percent(Math.abs(p.gdp/o.gdp-1))}</td></tr>`;
  }).join('');
}
function render(world) {
  const metrics=model.metrics(world), citizen=activeCitizen(world);
  document.querySelector('#active-citizen-heading').textContent=`${citizen.name} · ${currentNode(citizen.career)?.name||'Choose a field'}`;
  const signature=JSON.stringify([world.metroId,world.year,world.allocations,world.productivityMultiplier,world.activeCitizenId,world.citizens.map(c=>[c.id,c.name,currentNode(c.career)?.id,citizenReady(c),c.availability])]);
  if(lastSignature===signature)return;lastSignature=signature;
  document.querySelector('#metro-select').value=world.metroId;
  document.querySelector('#advance-year').disabled=world.year>=worldModelData.simulationEnd;
  document.querySelector('#restart-year').disabled=world.year===worldModelData.trainingEnd;
  document.querySelector('#productivity-multiplier').value=world.productivityMultiplier;
  if(document.activeElement!==document.querySelector('#worker-count')) document.querySelector('#worker-count').value=world.allocations[document.querySelector('#profession-select').value]||0;
  document.querySelector('#metro-context').textContent=`${metrics.metro.name} · ${metrics.metro.country} · ${world.year} ${world.year===worldModelData.trainingEnd?'training anchor':'model forecast'} · ${metrics.metro.geography}.`;
  const observed=metrics.observed;
  const rows=[['Population',format(metrics.population),`All ages · archived ${format(observed.population)}`],['Labor force',format(metrics.labourForce),`Aged 15–64 · archived ${format(observed.labourForce)}`],['Unemployment',`${format(metrics.unemployment,1)}%`,`Aged 15–64 · archived ${format(observed.unemployment,1)}%`],['Annual GDP',`${money(metrics.gdp/1000)}B`,`2015 USD PPP · archived ${money(observed.gdp/1000)}B`],['GDP per resident',money(metrics.gdpPerCapita),'Derived; not a separate validation'],['PM2.5 exposure',`${format(metrics.pm25,1)} µg/m³`,`Archived ${format(observed.pm25,1)} µg/m³ · no emissions mechanism`]];
  document.querySelector('#metro-stats').innerHTML=rows.map(([label,val,note])=>`<div class="metro-stat"><span>${label}</span><strong>${val}</strong><small>${note}</small></div>`).join('');
  document.querySelector('#workforce-summary').textContent=`${format(metrics.employed)} modeled employed people aged 15–64. ${format(metrics.experiment.assigned)} allocated or qualified named workers; ${format(metrics.experiment.unclassified)} unclassified. ${world.citizens.length} named residents reserve one workforce place each.`;
  document.querySelector('#allocations').innerHTML=Object.entries(world.allocations).filter(([,n])=>n>0).map(([id,n])=>`<p>${e(professions.find(p=>p.id===id).name)}: ${format(n)}</p>`).join('')||'<p>No aggregate allocations. Choose a profession and headcount above.</p>';
  document.querySelector('#scenario-output').textContent=`Hypothetical output with your assumption: ${money(metrics.scenarioGdp/1000)}B per year (${percent(metrics.experiment.outputFactor-1)} change). Historical model forecast: ${money(metrics.gdp/1000)}B.`;
  document.querySelector('#service-indices').innerHTML=metrics.experiment.services.map(s=>`<details><summary>${e(s.name)} · ${percent(s.index)}</summary><meter min="0" max="1" value="${s.index}" aria-label="${e(s.name)} scenario game index"></meter><ul>${s.rows.map(r=>`<li>${e(r.label)}: ${format(r.supplied,1)} / ${format(r.required,1)} target capability units</li>`).join('')}</ul><p>The scarcest capability limits this scenario index. The target scales the founders game requirements per 500 residents.</p></details>`).join('');
  document.querySelector('#lab-roster').innerHTML=world.citizens.map(c=>`<div class="lab-citizen"><strong>${e(c.name)}</strong><span>${e(currentNode(c.career)?.name||'Choosing a field')} · ${citizenReady(c)?'qualified':'in training'}</span><button type="button" data-switch="${e(c.id)}" ${c.id===world.activeCitizenId?'disabled':''}>${c.id===world.activeCitizenId?'Active':'Continue'}</button></div>`).join('');
  chart(metrics.metro);
}
try {
  app=startCareerApp({mode:'real-world',store,onAddCitizen(){document.querySelector('#world-overview').open=true;document.querySelector('#lab-name').focus();},onChange(career){store.syncCareer(career);if(!mounted){mount();mounted=true;}render(store.getWorld());}});
  app.save();
} catch(error) {showLoadError(error);}
