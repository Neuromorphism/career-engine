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
  currentField,
  currentLearningActivity,
  currentNode,
  currentProject,
  directionName,
  goalProgress,
  hydrateState,
  isLeaf,
  learningTrackComplete,
  learningTracksForPath,
  pathNodes,
  practiceRate,
  tick,
} from "./game-engine.js?v=0.9.0";

import { careerTree } from "./careers.js?v=0.9.0";
import { careerRoutes, careerTransitions, careerStats } from "./career-data.js?v=0.9.0";
import { evaluateImpact } from "./impact-models.js?v=0.9.0";

import { mountCareerUI } from "./career-ui.js?v=0.9.0";
import { createCareerStore } from "./save-store.js?v=0.9.0";

export function startCareerApp({ mode = 'single', store = createCareerStore(mode), onChange = () => {}, onAddCitizen = () => {} } = {}) {
mountCareerUI(mode);
const aiMode = mode === "ai";
const worldMode = mode === "world";
const saveLabel = worldMode ? "world save" : aiMode ? "AI save" : "local save";

const $ = (selector) => document.querySelector(selector);
const elements = {
  impactActions: $("#impact-actions"),
  console: $("#console-message"), direction: $("#direction-value"), mastery: $("#mastery-value"),
  rate: $("#rate-value"), goal: $("#goal-status"), goalMeter: $("#goal-meter"), goalCopy: $("#goal-copy"),
  pathKicker: $("#path-kicker"), pathHeading: $("#path-heading"), pathTrail: $("#path-trail"),
  pathIntro: $("#path-intro"), pathChoices: $("#path-choices"), pathLock: $("#path-lock"),
  jobLeaf: $("#job-leaf"), practiceModule: $("#practice-module"), actionIntro: $("#action-intro"),
  trainingSummary: $("#training-summary"), trainingProgress: $("#training-progress"),
  trainingRate: $("#training-rate"), trainingMeter: $("#training-meter"), learningPath: $("#learning-path"),
  projectsModule: $("#projects-module"), projectCard: $("#project-card"),
  projectLock: $("#project-lock"), saveStatus: $("#save-status"),
  aiPanel: $("#ai-race"), aiMastery: $("#ai-mastery-value"), aiRate: $("#ai-rate-value"),
  aiStatus: $("#ai-status"), aiHeadline: $("#ai-headline"), aiDetail: $("#ai-detail"),
  aiRelative: $("#ai-relative"), aiMeter: $("#ai-meter"), playerRaceMeter: $("#player-race-meter"),
};

let state = store.load();
let lastFrame = performance.now();
let lastSaved = 0;
let lastWorldRender = 0;
let lastDynamicSignature = "";

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
  const choices = availableChoices(state);
  const unlocked = choicesUnlocked(state);
  const depth = state.path.length + 1;
  const trail = pathNodes(state);

  elements.pathTrail.innerHTML = trail.length
    ? trail.map((item, index) => `<span>${index + 1}. ${item.name}</span>`).join("<i>→</i>")
    : "";

  if (!node) {
    elements.pathKicker.textContent = "Decision 1 · field";
    elements.pathHeading.textContent = "Choose a field";
    elements.pathIntro.textContent = "Begin broadly. Each choice reveals only the next useful distinction.";
  } else if (choices.length) {
    const label = node.decisionLabel || "specialization";
    elements.pathKicker.textContent = `Decision ${depth} · ${label}`;
    elements.pathHeading.textContent = `Choose ${indefiniteArticle(label)} ${label}`;
    elements.pathIntro.textContent = node.blurb;
  } else {
    elements.pathKicker.textContent = "Real-world job leaf";
    elements.pathHeading.textContent = node.jobTitle || node.name;
    elements.pathIntro.textContent = node.blurb;
  }

  elements.pathChoices.innerHTML = choices.map((choice) => `
    <button class="choice-button" type="button" data-node="${choice.id}" ${unlocked ? "" : "disabled"}>
      <strong>${choice.name}</strong><span>${choice.blurb}</span>
      ${choice.jobTitle ? '<em>job leaf</em>' : `<em>${choice.children?.length || 0} paths</em>`}
    </button>
  `).join("");
  elements.pathChoices.querySelectorAll("[data-node]").forEach((button) => {
    button.addEventListener("click", () => commit(chooseNode(state, button.dataset.node), elements.direction));
  });

  elements.pathLock.hidden = unlocked || choices.length === 0;
  elements.pathLock.textContent = "Complete the current training path and applied project to open the next decision.";
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
    elements.jobLeaf.innerHTML = `
      <p class="job-stamp">Specific occupation reached</p>
      <p>You have reached a specific occupation. Unlock practitioner, team-leader, and career-legacy missions as you advance. Build ${GOAL_MASTERY.toLocaleString()} mastery at this full job depth to complete the run.</p>
      ${evidence ? `<details><summary>Evidence behind this job</summary><ul>${evidence}</ul></details>` : ""}
      <details><summary>Routes into this career</summary><p>Possible routes, with US-oriented credential references. Game training simulates work; it does not grant professional authority.</p>${routeMarkup(node.entryRouteIds)}</details>
      <details><summary>Ways to develop your professional life</summary>${routeMarkup(node.progressionRouteIds)}${routeMarkup(node.continuityRouteIds)}</details>
      ${nextRoutes ? `<details><summary>Possible future career moves</summary><p>Investigated possibilities, not guaranteed promotions. A new game run explores a different training path.</p><ul>${nextRoutes}</ul></details>` : ''}

    `;
  }
}

function renderPractice() {
  const node = currentNode(state);
  const enabled = Boolean(node && currentField(state));
  const tracks = learningTracksForPath(state);
  const activeTrack = tracks.at(-1);
  const nextActivity = currentLearningActivity(state);
  elements.practiceModule.classList.toggle("is-unlocked", enabled);
  if (!enabled) {
    elements.actionIntro.textContent = "Choose a field to reveal its learning sequence.";
    elements.trainingSummary.hidden = true;
    elements.learningPath.innerHTML = '<p class="empty-training">Training adapts to the field, specialty, and role you choose.</p>';
    return;
  }

  const completed = activeTrack.activities.filter((activity) => state.completedLearningKeys.includes(activity.key)).length;
  const percent = (completed / activeTrack.activities.length) * 100;
  elements.actionIntro.textContent = nextActivity
    ? `${activeTrack.title}: choose one of three actions at each step. Investigation favors immediate mastery; teamwork builds more practice capacity.`
    : `${activeTrack.title} complete. Finish the applied project to open the next career decision.`;
  elements.trainingSummary.hidden = false;
  elements.trainingProgress.textContent = `${completed} / ${activeTrack.activities.length} complete`;
  elements.trainingRate.textContent = `+${format(practiceRate(state), 2)}/sec total capacity`;
  elements.trainingMeter.style.setProperty("--training-fill", `${percent}%`);
  elements.trainingMeter.setAttribute("aria-valuenow", String(Math.round(percent)));
  elements.trainingMeter.setAttribute("aria-valuemin", "0");
  elements.trainingMeter.setAttribute("aria-valuemax", "100");

  elements.learningPath.innerHTML = tracks.map((track, trackIndex) => {
    const isCurrent = trackIndex === tracks.length - 1;
    const trackDone = track.activities.every((activity) => state.completedLearningKeys.includes(activity.key));
    return `
      <section class="learning-stage ${trackDone ? "is-complete" : ""} ${isCurrent ? "is-current" : "is-history"}">
        <header>
          <span>${String(trackIndex + 1).padStart(2, "0")}</span>
          <div><small>${track.nodeName}</small><h3>${track.title}</h3></div>
          <b>${trackDone ? "complete" : isCurrent ? "in progress" : "locked"}</b>
        </header>
        ${isCurrent ? `<p>${track.summary}</p><div class="activity-list">${track.activities.map((activity) => {
          const done = state.completedLearningKeys.includes(activity.key);
          const active = nextActivity?.key === activity.key;
          const status = done ? "complete" : active ? "available" : "locked";
          const selected = done ? activity.choices.find(choice => choice.id === state.learningChoices[activity.key]) || activity.choices[0] : null;
          const buttons = activity.choices.map(choice => `
            <button class="learning-activity is-${status}" type="button" data-node="${track.nodeId}" data-activity="${activity.index}" data-choice="${choice.id}" ${active ? "" : "disabled"}>
              <span class="activity-marker">${String(activity.index + 1).padStart(2, "0")}</span>
              <span class="activity-copy"><small>${choice.focus}</small><strong>${choice.title}</strong><span>${choice.description}</span></span>
              <span class="activity-reward"><b>+${choice.reward}</b><small>mastery</small><em>+${choice.rate}/s</em></span>
            </button>`).join('');
          return `<section class="learning-step is-${status}" aria-label="${activity.title}">
            <h4>${done ? '✓' : String(activity.index + 1).padStart(2, '0')}. ${activity.title}</h4>
            ${active ? `<p class="choice-instruction">Choose one action to complete this step.</p><div class="stage-choices">${buttons}</div>`
              : done ? `<p class="selected-action">Chosen: ${selected.title} · +${selected.reward} mastery · +${selected.rate}/s</p>`
              : `<details><summary>Preview three actions · complete the preceding step first</summary><div class="stage-choices">${buttons}</div></details>`}
          </section>`;
        }).join("")}</div>` : ""}
      </section>`;
  }).join("");

  elements.learningPath.querySelectorAll("[data-activity]").forEach((button) => {
    button.addEventListener("click", () => commit(
      completeLearningActivity(state, button.dataset.node, Number(button.dataset.activity), button.dataset.choice),
      elements.mastery,
    ));
  });
}

function renderProject() {
  const node = currentNode(state);
  const project = currentProject(state);
  const trainingComplete = learningTrackComplete(state);
  elements.projectsModule.classList.toggle("is-unlocked", Boolean(node));
  elements.projectLock.hidden = Boolean(node);
  if (!node) {
    elements.projectCard.innerHTML = "";
    return;
  }
  if (!project) {
    const hasNext = Boolean(node.children?.length);
    const leafMessage = state.careerComplete
      ? "Career mastered. Your career-legacy missions remain available in module 04."
      : `Keep building your practice engine until you reach ${GOAL_MASTERY.toLocaleString()} mastery.`;
    elements.projectCard.innerHTML = `
      <div class="project-card project-done">
        <span class="project-label">${hasNext ? "Starter brief complete" : "Role sample complete"}</span>
        <h3>${hasNext ? "The next decision is open" : state.careerComplete ? "Career mastered" : "Build toward full mastery"}</h3>
        <p class="project-complete">${hasNext ? "Return to module 01 and choose the next specialization." : leafMessage}</p>
      </div>`;
    return;
  }
  const nodeProjectCount = node.projects?.length || 1;
  const percent = Math.min(100, (state.mastery / project.requirement) * 100);
  elements.projectCard.innerHTML = `
    <div class="project-card">
      <span class="project-label">${node.jobTitle ? `Job sample ${project.index + 1} of ${nodeProjectCount}` : "Starter brief"} · ${node.name}</span>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="deliverable"><b>Deliverable</b><span>${project.deliverable}</span></div>
      <div class="project-meter" style="--project-fill:${percent}%"><i></i></div>
      <button class="project-button" type="button" ${!trainingComplete || state.mastery < project.requirement ? "disabled" : ""}>
        ${!trainingComplete
          ? "Finish the training path first"
          : state.mastery < project.requirement
            ? `${format(state.mastery, 1)} / ${project.requirement} mastery`
            : "Submit project"}
      </button>
    </div>`;
  elements.projectCard.querySelector("button")?.addEventListener("click", () => commit(completeProject(state), elements.mastery));
}


function renderImpact() {
  const actions = impactActionsForState(state);
  if (!actions.length) {
    elements.impactActions.innerHTML = '<p class="empty-training">Reach a specific occupation to reveal its three career missions. Unlocks begin at 300, 2,000, and 7,000 mastery after role training and work samples.</p>';
    return;
  }
  const number = value => Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(value);
  const renderModel = (modelId) => {
    const model = evaluateImpact(modelId);
    return model ? `
      <details class="impact-assumptions"><summary>${worldMode ? 'Career scenario projection · separate from world projects' : 'Projected impact for this project'}</summary>
        <div class="impact-metrics">${Object.entries(model.metrics).map(([label, value]) => `<div><strong>${number(value)}</strong><span>${label}</span></div>`).join("")}</div>
        <p>${model.assumptions}</p><p>${model.formula}</p><p>${model.limits}</p>
        <p>Methodology references: ${model.references.map(ref => `<a href="${ref.url}" target="_blank" rel="noreferrer">${ref.label}</a>`).join(" · ")}. Scenario inputs are game assumptions, not values taken from these references.</p>
      </details>` : '';
  };
  elements.impactActions.innerHTML = actions.map(action => {
    const choices = action.done ? [action.selectedChoice] : action.choices;
    return `<article class="impact-card ${action.done ? 'is-complete' : action.unlocked ? 'is-available' : 'is-locked'}">
      <span class="project-label">${action.stage} · ${action.requirement.toLocaleString()} mastery</span>
      <h3>${action.done ? 'Stage complete' : `Choose your ${action.stage.toLowerCase()} contribution`}</h3>
      <p>${action.done ? 'Your chosen action is recorded below.' : action.unlocked ? 'Choose one of three actions to complete this stage.' : action.lockReason + '.'}</p>
      <div class="stage-choices">${choices.map(choice => `<section class="impact-choice">
        <small>${choice.focus}</small><h4>${choice.title}</h4><p>${choice.description}</p>
        ${renderModel(choice.modelId)}
        ${action.done ? `<p class="impact-outcome">✓ ${choice.outcome}</p>` : ''}
        <button type="button" data-impact="${action.id}" data-choice="${choice.id}" ${action.unlocked ? '' : 'disabled'}>${action.done ? 'Chosen action completed' : action.unlocked ? `Choose action · +${choice.reward} mastery · +${choice.rate}/s` : `+${choice.reward} mastery · +${choice.rate}/s · locked`}</button>
      </section>`).join('')}</div>
    </article>`;
  }).join('');
  elements.impactActions.querySelectorAll('[data-impact]').forEach(button => {
    button.addEventListener('click', () => commit(completeImpactAction(state, button.dataset.impact, button.dataset.choice), elements.mastery));
  });
}

function renderAtlas(query = '') {
  const needle = query.trim().toLowerCase();
  let count = 0;
  const branch = (nodes, ancestors = []) => nodes.map(node => {
    const path = [...ancestors, node.name];
    if (!node.children?.length) {
      if (needle && !path.join(' ').toLowerCase().includes(needle)) return '';
      count++;
      return `<li class="atlas-job"><strong>${node.name}</strong><span>${node.impactActions.at(-1).title}</span></li>`;
    }
    const children = branch(node.children, path);
    return children ? `<li><details ${needle ? 'open' : ''}><summary>${node.name}</summary><ul>${children}</ul></details></li>` : '';
  }).join('');
  const tree = branch(careerTree);
  $('#atlas-count').textContent = `${count} careers ${needle ? 'match this search' : `across ${careerStats.fields} fields`}. Preview their legacy projects, then progress through the training tree to unlock them.`;
  $('#atlas-tree').innerHTML = tree ? `<ul>${tree}</ul>` : '<p>No matching career. Try another specialty or field.</p>';
}

$('#atlas-search').addEventListener('input', event => renderAtlas(event.target.value));
renderAtlas();

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
  renderPath(); renderPractice(); renderProject(); renderImpact();
  lastDynamicSignature = dynamicSignature();
  onChange(state);
}

$("#reset-button").addEventListener("click", () => {
  if (worldMode) { onAddCitizen(); return; }
  if (window.confirm("Begin a new run? Your current local progress will be replaced.")) {
    state = createInitialState(); save(); render();
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
    if (worldMode && now - lastWorldRender > 1000) { onChange(state); lastWorldRender = now; }
    const signature = dynamicSignature();
    if (signature !== lastDynamicSignature) {
      renderPath(); renderPractice(); renderProject(); renderImpact(); lastDynamicSignature = signature;
    }
  }
  requestAnimationFrame(frame);
}

render();
requestAnimationFrame(frame);

return {
  getState: () => state,
  save,
  replaceState(next) { state = next; lastFrame = performance.now(); render(); return save(); },
};
}
