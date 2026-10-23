import {
  GOAL_MASTERY,
  aiRivalStatus,
  availableChoices,
  choicesUnlocked,
  chooseNode,
  completeLearningActivity,
  completeProject,
  completeImpactAction,
  impactActionsForState,
  createInitialState,
  currentNode,
  currentProject,
  directionName,
  goalProgress,
  isLeaf,
  pathNodes,
  practiceRate,
  tick,
} from "./game-engine.js?v=0.11.1";

import { careerTree } from "./careers.js?v=0.11.1";
import { careerRoutes, careerTransitions, careerStats } from "./career-data.js?v=0.11.1";
import { evaluateImpact } from "./impact-models.js?v=0.11.1";

import { mountCareerUI, escapeHtml as e } from "./career-ui.js?v=0.11.1";
import { workOptionsForState, completedWorkForState } from "./work-options.js?v=0.11.1";
import { createCareerStore } from "./save-store.js?v=0.11.1";
import { professionById, nextGoalStep, selectProfessionGoal } from './discovery.js?v=0.11.1';
import { mountProfessionBrowser } from './discovery-ui.js?v=0.11.1';

export function startCareerApp({ mode = 'single', store = createCareerStore(mode), onChange = () => {}, onAddCitizen = () => {} } = {}) {
mountCareerUI(mode);
const aiMode = mode === "ai";
const worldMode = mode === "world" || mode === "real-world";
const saveLabel = worldMode ? "world save" : aiMode ? "AI save" : "local save";

const $ = (selector) => document.querySelector(selector);
const elements = {
  console: $("#console-message"), direction: $("#direction-value"), mastery: $("#mastery-value"),
  rate: $("#rate-value"), goal: $("#goal-status"), goalMeter: $("#goal-meter"), goalCopy: $("#goal-copy"),
  pathKicker: $("#path-kicker"), pathHeading: $("#path-heading"), pathTrail: $("#path-trail"),
  pathIntro: $("#path-intro"), pathChoices: $("#path-choices"), pathLock: $("#path-lock"),
  jobLeaf: $("#job-leaf"), careerContext: $("#career-context"), pathPrompt: $("#path-prompt"),
  workKicker: $("#work-kicker"), workTitle: $("#work-title"), workIntro: $("#work-intro"),
  workOptions: $("#work-options"), workProgress: $("#work-progress"), workProgressCopy: $("#work-progress-copy"),
  workRate: $("#work-rate"), workMeter: $("#work-meter"), workHistory: $("#work-history"), workRecords: $("#work-records"),
  saveStatus: $("#save-status"),
  aiPanel: $("#ai-race"), aiMastery: $("#ai-mastery-value"), aiRate: $("#ai-rate-value"),
  aiStatus: $("#ai-status"), aiHeadline: $("#ai-headline"), aiDetail: $("#ai-detail"),
  aiRelative: $("#ai-relative"), aiMeter: $("#ai-meter"), playerRaceMeter: $("#player-race-meter"),
};

let state = store.load();
let lastFrame = performance.now();
let lastSaved = 0;
let lastWorldRender = 0;
let lastDynamicSignature = "";
let workView = null;
let legacyBrowsing = false;
let pathChoicePage = 0;
let pathChoiceContext = '';

function format(value, digits = 0) {
  if (value >= 1000) return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
  return value.toFixed(digits);
}

function indefiniteArticle(phrase) {
  return /^[aeiou]/i.test(phrase) ? "an" : "a";
}

function save() {
  state.savedAt = Date.now();
  try { store.save(state); }
  catch (error) {
    elements.saveStatus.textContent = `${saveLabel} · unavailable`;
    elements.console.textContent = 'Progress could not be saved. Export your world or stored progress before closing this page.';
    return false;
  }
  elements.saveStatus.textContent = `${saveLabel} · complete`;
  window.setTimeout(() => { elements.saveStatus.textContent = `${saveLabel} · ready`; }, 700);
  return true;
}

function pulse(element) {
  element.classList.remove("pulse");
  void element.offsetWidth;
  element.classList.add("pulse");
}

function commit(nextState, pulseTarget) {
  if (nextState === state) return;
  state = nextState;
  render();
  if (pulseTarget) pulse(pulseTarget);
  save();
}

function pathNameForId(id, nodes = careerTree) {
  for (const node of nodes) {
    if (node.id === id) return node.name;
    const found = pathNameForId(id, node.children || []);
    if (found) return found;
  }
  return null;
}

function renderPath() {
  const node = currentNode(state);
  const nextStep = nextGoalStep(state);
  const choices = nextStep ? availableChoices(state).filter(choice => choice.id === nextStep.id) : availableChoices(state);
  const goal = professionById.get(state.targetOccupationId);
  const unlocked = choicesUnlocked(state);
  const depth = state.path.length + 1;
  const trail = pathNodes(state);
  const choiceContext = `${state.path.join('/')}|${state.targetOccupationId || ''}`;
  if (pathChoiceContext !== choiceContext) { pathChoiceContext = choiceContext; pathChoicePage = 0; }
  const pageSize = 6;
  pathChoicePage = Math.min(pathChoicePage, Math.max(0, Math.ceil(choices.length / pageSize) - 1));
  const showTraining = Boolean(node || goal || legacyBrowsing);
  elements.pathPrompt.hidden = !showTraining;
  elements.pathIntro.hidden = !showTraining;
  const goalElement = $('#profession-goal');
  goalElement.hidden = !goal && Boolean(node);
  goalElement.innerHTML = goal ? `<strong>Your goal: ${e(goal.label)}</strong><p>Complete the next training step below.</p><button type="button" data-change-goal>Change direction</button><button type="button" data-clear-goal>Clear goal</button>` : `<button type="button" data-broad-browse>${legacyBrowsing ? 'Explore professions instead' : 'Choose as I go instead'}</button>`;
  goalElement.querySelector('[data-change-goal]')?.addEventListener('click', () => professionBrowser.open());
  goalElement.querySelector('[data-clear-goal]')?.addEventListener('click', () => {
    commit({ ...state, targetOccupationId: null }, elements.direction); professionBrowser.open();
  });
  goalElement.querySelector('[data-broad-browse]')?.addEventListener('click', () => {
    legacyBrowsing = !legacyBrowsing;
    if (legacyBrowsing) professionBrowser.close(); else professionBrowser.open();
    renderPath();
  });
  professionBrowser.refresh();

  elements.pathTrail.innerHTML = trail.length
    ? trail.map((item, index) => `<span>${index + 1}. ${item.name}</span>`).join("<i>→</i>")
    : "";

  if (!node) {
    elements.pathKicker.textContent = showTraining ? "Decision 1 · field" : "Explore · one step at a time";
    elements.pathPrompt.textContent = goal ? `Start training toward ${goal.label}` : "Choose a training field";
    elements.pathIntro.textContent = goal ? 'Begin with the first step on this profession’s route. Each completed stage opens the next.' : "Begin broadly. Each choice reveals only the next useful distinction.";
  } else if (choices.length) {
    const label = node.decisionLabel || "specialization";
    elements.pathKicker.textContent = `Decision ${depth} · ${label}`;
    elements.pathPrompt.textContent = unlocked ? `Choose ${indefiniteArticle(label)} ${label}` : node.name;
    elements.pathIntro.textContent = node.blurb;
  } else {
    elements.pathKicker.textContent = "Real-world job leaf";
    elements.pathPrompt.textContent = node.jobTitle || node.name;
    elements.pathIntro.textContent = node.blurb;
  }

  elements.pathChoices.innerHTML = choices.slice(pathChoicePage * pageSize, (pathChoicePage + 1) * pageSize).map((choice) => `
    <button class="choice-button" type="button" data-node="${choice.id}" ${unlocked ? "" : "disabled"}>
      <strong>${choice.name}</strong><span>${choice.blurb}</span>
      ${choice.jobTitle ? '<em>job leaf</em>' : `<em>${choice.children?.length || 0} paths</em>`}
    </button>
  `).join("");
  elements.pathChoices.querySelectorAll("[data-node]").forEach((button) => {
    button.addEventListener("click", () => commit(chooseNode(state, button.dataset.node), elements.direction));
  });

  elements.pathChoices.hidden = !unlocked || !showTraining;
  const pagination = $('#path-choice-pagination');
  pagination.hidden = elements.pathChoices.hidden || choices.length <= pageSize;
  pagination.innerHTML = pagination.hidden ? '' : `<button type="button" data-path-page="previous" ${pathChoicePage ? '' : 'disabled'}>← Previous</button><span>${pathChoicePage * pageSize + 1}–${Math.min((pathChoicePage + 1) * pageSize, choices.length)} of ${choices.length}</span><button type="button" data-path-page="next" ${(pathChoicePage + 1) * pageSize < choices.length ? '' : 'disabled'}>Next →</button>`;
  pagination.querySelectorAll('[data-path-page]').forEach(button => button.addEventListener('click', () => {
    pathChoicePage += button.dataset.pathPage === 'next' ? 1 : -1; renderPath(); elements.pathPrompt.focus();
  }));
  elements.pathLock.hidden = unlocked || choices.length === 0;
  elements.pathLock.textContent = "Do work to open your next path choice.";
  elements.jobLeaf.hidden = !node || !isLeaf(state);
  if (node && isLeaf(state)) {
    const evidence = (node.evidence || []).map((item) => `
      <li><a href="${item.url}" target="_blank" rel="noreferrer">${item.label}</a><span>${item.note}</span></li>
    `).join("");
    const routeMarkup = (ids) => ids.map(id => {
      const route = careerRoutes[id];
      return `<details><summary>${route.label}</summary><ol>${route.stages.map(stage => `<li>${stage}</li>`).join('')}</ol><p>${route.credential_gates.join(' · ')}</p><p>${route.notes}</p></details>`;
    }).join('');
    const transitions = careerTransitions.filter(edge => edge.from_id === node.id);
    const nextRoutes = transitions.map(edge => {
      const target = pathNameForId(edge.to_id);
      return `<li><strong>${target}</strong><span>Transferable: ${edge.transferable_skills.join(', ')}. Additional requirements: ${edge.additional_requirements.join('; ')}.</span></li>`;
    }).join('');
    elements.careerContext.innerHTML = `
      <p class="job-stamp">Specific occupation reached</p>
      <p>You have reached a specific occupation. Do work to unlock practitioner, team-leader, and career-legacy contributions as you advance. Build ${GOAL_MASTERY.toLocaleString()} mastery at this full job depth to complete the run.</p>
      ${evidence ? `<details><summary>Evidence behind this job</summary><ul>${evidence}</ul></details>` : ""}
      <details><summary>Routes into this career</summary><p>Possible routes, with US-oriented credential references. Game training simulates work; it does not grant professional authority.</p>${routeMarkup(node.entryRouteIds)}</details>
      <details><summary>Ways to develop your professional life</summary>${routeMarkup(node.progressionRouteIds)}${routeMarkup(node.continuityRouteIds)}</details>
      ${nextRoutes ? `<details><summary>Possible future career moves</summary><p>Investigated possibilities, not guaranteed promotions. A new game run explores a different training path.</p><ul>${nextRoutes}</ul></details>` : ''}

    `;
  }
}

function renderModel(modelId) {
  const model = evaluateImpact(modelId);
  if (!model) return '';
  const number = value => Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(value);
  return `<details class="impact-assumptions"><summary>${worldMode ? 'Career scenario projection · separate from world projects' : 'Projected impact'}</summary>
    <div class="impact-metrics">${Object.entries(model.metrics).map(([label, value]) => `<div><strong>${number(value)}</strong><span>${e(label)}</span></div>`).join('')}</div>
    <p>${e(model.assumptions)}</p><p>${e(model.formula)}</p><p>${e(model.limits)}</p>
    <p>Methodology references: ${model.references.map(ref => `<a href="${e(ref.url)}" target="_blank" rel="noreferrer">${e(ref.label)}</a>`).join(' · ')}. Scenario inputs are game assumptions.</p>
  </details>`;
}

function updateWorkProgress() {
  const progress = workView?.progress;
  elements.workProgress.hidden = !progress;
  if (!progress) return;
  const value = progress.unit === 'mastery' ? state.mastery : progress.value;
  const percent = Math.min(100, value / progress.total * 100);
  elements.workProgressCopy.textContent = `${format(value, progress.unit === 'mastery' ? 1 : 0)} / ${progress.total.toLocaleString()} ${progress.unit === 'mastery' ? 'mastery' : 'steps complete'}`;
  elements.workRate.textContent = `+${format(practiceRate(state), 2)} mastery/sec`;
  elements.workMeter.style.setProperty('--training-fill', `${percent}%`);
  elements.workMeter.setAttribute('aria-valuenow', String(Math.round(percent)));
}

function renderWork() {
  workView = workOptionsForState(state);
  elements.workKicker.textContent = { training: 'Learn through work', project: 'Apply your skills', impact: 'Make a contribution', waiting: 'Growing your expertise', complete: 'Career mastered', 'choose-path': 'Your next step' }[workView.phase];
  elements.workTitle.textContent = workView.title;
  elements.workIntro.textContent = workView.description;
  updateWorkProgress();
  elements.workOptions.innerHTML = workView.options.map(option => `<article class="work-card">
    <small>${e(option.focus || (option.kind === 'project' ? 'Applied project' : option.kind))}</small>
    <h3>${e(option.title)}</h3>
    ${option.kind === 'project' ? `<p>${e(option.description)}</p>` : option.description.replace(/[.!?]$/, '') === option.title ? '' : `<details><summary>Task context</summary><p>${e(option.description)}</p></details>`}
    ${option.deliverable ? `<details><summary>Work sample to submit</summary><p>${e(option.deliverable)}</p></details>` : ''}
    ${renderModel(option.modelId)}
    <button type="button" data-work="${e(option.id)}" ${option.enabled === false ? 'disabled' : ''}>
      ${option.kind === 'project' ? option.enabled ? 'Complete project' : 'Building mastery for this project' : `Choose this action · +${option.reward} mastery · +${option.rate}/s`}
    </button>
  </article>`).join('');
  if (workView.phase === 'choose-path' && state.path.length) elements.workOptions.innerHTML = '<a class="work-next-link" href="#path-heading">Choose your next path →</a>';
  if (workView.phase === 'complete') elements.workOptions.innerHTML = `<button class="work-next-button" type="button" data-next-citizen>${worldMode ? 'Develop another citizen' : 'Explore another career'}</button>`;
  elements.workOptions.querySelectorAll('[data-work]').forEach(button => button.addEventListener('click', () => {
    const option = workView.options.find(option => option.id === button.dataset.work);
    if (!option) return;
    const next = option.kind === 'training' ? completeLearningActivity(state, option.nodeId, option.activityIndex, option.id)
      : option.kind === 'project' ? completeProject(state)
      : completeImpactAction(state, option.actionId, option.id);
    if (next === state) return;
    commit(next, elements.mastery);
    $('#work-heading').focus({ preventScroll: true });
  }));
  elements.workOptions.querySelector('[data-next-citizen]')?.addEventListener('click', () => $('#reset-button').click());
  const records = completedWorkForState(state);
  elements.workHistory.hidden = records.length === 0;
  elements.workRecords.innerHTML = records.map(record => `<div class="work-record"><small>${e(record.kind)} · ${e(record.context)}</small><strong>${e(record.title)}</strong>${record.outcome ? `<p>${e(record.outcome)}</p>` : ''}</div>`).join('');
}

const professionBrowser = mountProfessionBrowser($('#profession-discovery'), {
  getState: () => state,
  onChooseGoal: id => { legacyBrowsing = false; commit(selectProfessionGoal(state, id), elements.direction); },
  onOpen: () => { if (legacyBrowsing) { legacyBrowsing = false; renderPath(); } },
});

function dynamicSignature() {
  const project = currentProject(state);
  return [
    state.careerComplete,
    choicesUnlocked(state),
    state.completedLearningKeys.length,
    state.completedImpactKeys.length,
    impactActionsForState(state).map(action => action.unlocked).join(","),
    project ? state.mastery >= project.requirement : "none",
  ].join("|");
}

function renderGoal() {
  const atJob = isLeaf(state);
  const progress = goalProgress(state);
  elements.goal.textContent = aiMode
    ? state.raceWinner === "player" ? "You won" : state.raceWinner === "ai" ? "AI won" : "Beat the AI"
    : state.careerComplete ? "Career mastered" : atJob ? `${Math.floor(progress * 100)}%` : "Reach a job";
  elements.goalCopy.textContent = aiMode
    ? state.raceWinner
      ? state.raceWinner === "player" ? "You reached career mastery first." : "Finish the path, then race again."
      : `Reach a real-world job and ${GOAL_MASTERY.toLocaleString()} mastery before the rival.`
    : state.careerComplete
      ? `${GOAL_MASTERY.toLocaleString()} mastery reached at full job depth.`
      : atJob
        ? `${format(state.mastery, 0)} / ${GOAL_MASTERY.toLocaleString()} mastery`
        : `Choose through to a real-world job, then reach ${GOAL_MASTERY.toLocaleString()} mastery.`;
  elements.goalMeter.style.setProperty("--goal-fill", `${progress * 100}%`);
  elements.goalMeter.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
  elements.goalMeter.setAttribute("aria-valuemin", "0");
  elements.goalMeter.setAttribute("aria-valuemax", "100");
  elements.goalMeter.parentElement.classList.toggle("is-complete", state.careerComplete);
}

function renderAI() {
  if (!aiMode || !elements.aiPanel) return;
  const rival = aiRivalStatus(state);
  const aiProgress = Math.max(0, Math.min(1, state.aiMastery / GOAL_MASTERY));
  const playerProgress = goalProgress(state);
  const paused = rival.rate === 0 && state.path.length > 0 && !state.raceWinner;
  elements.aiMastery.textContent = format(state.aiMastery, state.aiMastery % 1 ? 1 : 0);
  elements.aiRate.textContent = format(state.raceWinner ? 0 : rival.rate, 2);
  elements.aiHeadline.textContent = rival.headline;
  elements.aiDetail.textContent = rival.detail;
  elements.aiRelative.textContent = rival.relative;
  elements.aiStatus.textContent = state.raceWinner
    ? state.raceWinner === "player" ? "race won" : "race lost"
    : paused ? "AI paused" : state.path.length ? "AI learning" : "awaiting field";
  elements.aiMeter.style.setProperty("--ai-fill", `${aiProgress * 100}%`);
  elements.playerRaceMeter.style.setProperty("--player-fill", `${playerProgress * 100}%`);
  elements.aiMeter.setAttribute("aria-valuenow", String(Math.round(aiProgress * 100)));
  elements.playerRaceMeter.setAttribute("aria-valuenow", String(Math.round(playerProgress * 100)));
  elements.aiPanel.classList.toggle("is-paused", paused);
  elements.aiPanel.classList.toggle("ai-ahead", state.aiMastery > state.mastery && !state.raceWinner);
  elements.aiPanel.classList.toggle("player-ahead", state.mastery > state.aiMastery && !state.raceWinner);
  elements.aiPanel.classList.toggle("race-complete", Boolean(state.raceWinner));
}

function render() {
  elements.console.textContent = state.lastMessage;
  elements.direction.textContent = directionName(state);
  elements.mastery.textContent = format(state.mastery, state.mastery % 1 ? 1 : 0);
  elements.rate.textContent = format(practiceRate(state), 2);
  renderGoal();
  renderAI();
  renderPath(); renderWork();
  lastDynamicSignature = dynamicSignature();
  onChange(state);
}

$("#reset-button").addEventListener("click", () => {
  if (worldMode) { onAddCitizen(); return; }
  if (window.confirm("Begin a new run? Your current local progress will be replaced.")) {
    state = createInitialState(); legacyBrowsing = false; professionBrowser.reset(); save(); render();
  }
});

function frame(now) {
  const elapsed = (now - lastFrame) / 1000;
  lastFrame = now;
  const next = tick(state, elapsed, { aiMode });
  if (next !== state) {
    const completedNow = !state.careerComplete && next.careerComplete;
    const raceResolvedNow = aiMode && !state.raceWinner && next.raceWinner;
    state = next;
    if (completedNow || raceResolvedNow) {
      render();
      save();
      pulse(raceResolvedNow && elements.aiMastery ? elements.aiMastery : elements.goal);
      requestAnimationFrame(frame);
      return;
    }
    if (now - lastSaved > 2000) { save(); lastSaved = now; }
    elements.mastery.textContent = format(state.mastery, 1);
    renderGoal();
    renderAI();
    updateWorkProgress();
    if (worldMode && now - lastWorldRender > 1000) { onChange(state); lastWorldRender = now; }
    const signature = dynamicSignature();
    if (signature !== lastDynamicSignature) {
      renderPath(); renderWork(); lastDynamicSignature = signature;
    }
  }
  requestAnimationFrame(frame);
}

render();
requestAnimationFrame(frame);

return {
  getState: () => state,
  save,
  replaceState(next) { state = next; legacyBrowsing = false; professionBrowser.reset(); lastFrame = performance.now(); render(); return save(); },
};
}
