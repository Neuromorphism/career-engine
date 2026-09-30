import { AXES, fields, starterActions, upgrades } from "./careers.js";
import {
  SAVE_KEY,
  canChooseField,
  canChooseSpecialty,
  canPurchase,
  chooseField,
  chooseSpecialty,
  completeProject,
  createInitialState,
  currentProject,
  explore,
  hydrateState,
  leadingPattern,
  practiceRate,
  purchaseUpgrade,
  specialtyName,
  tick,
  work,
} from "./game-engine.js";

const $ = (selector) => document.querySelector(selector);
const elements = {
  console: $("#console-message"),
  direction: $("#direction-value"),
  insight: $("#insight-value"),
  mastery: $("#mastery-value"),
  impact: $("#impact-value"),
  rate: $("#rate-value"),
  starterActions: $("#starter-actions"),
  actionIntro: $("#action-intro"),
  workAction: $("#work-action"),
  workButton: $("#work-button"),
  workButtonLabel: $("#work-button-label"),
  workDescription: $("#work-description"),
  fieldModule: $("#field-module"),
  fieldChoices: $("#field-choices"),
  fieldLock: $("#field-lock"),
  specialtyModule: $("#specialty-module"),
  specialtyChoices: $("#specialty-choices"),
  specialtyLock: $("#specialty-lock"),
  upgrades: $("#upgrade-list"),
  projectsModule: $("#projects-module"),
  projectCard: $("#project-card"),
  projectLock: $("#project-lock"),
  pattern: $("#pattern-note"),
  saveStatus: $("#save-status"),
};

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const next = hydrateState(parsed);
    if (parsed?.savedAt) {
      return tick(next, (Date.now() - parsed.savedAt) / 1000);
    }
    return next;
  } catch {
    return createInitialState();
  }
}

let state = load();
let lastFrame = performance.now();
let lastSaved = 0;
let lastDynamicSignature = "";

function format(value, digits = 0) {
  if (value >= 1000) return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
  return value.toFixed(digits);
}

function save() {
  state.savedAt = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  elements.saveStatus.textContent = "local save · complete";
  window.setTimeout(() => { elements.saveStatus.textContent = "local save · ready"; }, 700);
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

function renderStarterActions() {
  if (state.field) {
    elements.starterActions.hidden = true;
    elements.workAction.hidden = false;
    elements.actionIntro.textContent = "You chose a field. Practice its central loop manually before your engine compounds it.";
    const field = fields[state.field];
    elements.workButtonLabel.textContent = field.workLabel;
    elements.workDescription.textContent = field.workDescription;
    return;
  }
  elements.starterActions.hidden = false;
  elements.workAction.hidden = true;
  elements.starterActions.innerHTML = starterActions.map((action) => `
    <button class="task-button" type="button" data-axis="${action.id}">
      <span>${action.label}</span>
      <span><em>${action.verb}</em><small>${action.reward}</small></span>
    </button>
  `).join("");
  elements.starterActions.querySelectorAll("[data-axis]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = starterActions.find((item) => item.id === button.dataset.axis);
      const message = action.messages[state.actions % action.messages.length];
      commit(explore(state, action.id, message), elements.insight);
    });
  });
}

function renderFields() {
  const unlocked = canChooseField(state) || Boolean(state.field);
  elements.fieldModule.classList.toggle("is-unlocked", unlocked);
  elements.fieldLock.hidden = unlocked;
  elements.fieldChoices.innerHTML = Object.entries(fields).map(([id, field]) => `
    <button class="choice-button ${state.field === id ? "is-selected" : ""}" type="button" data-field="${id}" ${!canChooseField(state) && state.field !== id ? "disabled" : ""}>
      <strong>${field.name}</strong><span>${field.blurb}</span>
    </button>
  `).join("");
  elements.fieldChoices.querySelectorAll("[data-field]").forEach((button) => {
    button.addEventListener("click", () => commit(chooseField(state, button.dataset.field), elements.direction));
  });
}

function renderSpecialties() {
  const unlocked = canChooseSpecialty(state) || Boolean(state.specialty);
  elements.specialtyModule.classList.toggle("is-unlocked", unlocked);
  elements.specialtyLock.hidden = unlocked;
  if (!state.field) {
    elements.specialtyChoices.innerHTML = "";
    return;
  }
  elements.specialtyChoices.innerHTML = fields[state.field].specialties.map((specialty) => `
    <button class="choice-button ${state.specialty === specialty.id ? "is-selected" : ""}" type="button" data-specialty="${specialty.id}" ${!canChooseSpecialty(state) && state.specialty !== specialty.id ? "disabled" : ""}>
      <strong>${specialty.name}</strong><span>${specialty.blurb}</span>
    </button>
  `).join("");
  elements.specialtyChoices.querySelectorAll("[data-specialty]").forEach((button) => {
    button.addEventListener("click", () => commit(chooseSpecialty(state, button.dataset.specialty), elements.direction));
  });
}

function renderUpgrades() {
  elements.upgrades.innerHTML = upgrades.map((upgrade) => {
    const owned = Boolean(state.upgrades[upgrade.id]);
    const missing = upgrade.specialtyRequired && !state.specialty
      ? "specialty required"
      : state.mastery < upgrade.masteryRequired
        ? `${upgrade.masteryRequired} mastery required`
        : `${upgrade.cost} insight`;
    return `
      <button class="upgrade-button ${owned ? "is-owned" : ""}" type="button" data-upgrade="${upgrade.id}" ${owned || !canPurchase(state, upgrade) ? "disabled" : ""}>
        <span><strong>${upgrade.name}</strong><span>${upgrade.description}</span></span>
        <b>${owned ? `installed · +${upgrade.rate}/s` : missing}</b>
      </button>
    `;
  }).join("");
  elements.upgrades.querySelectorAll("[data-upgrade]").forEach((button) => {
    button.addEventListener("click", () => commit(purchaseUpgrade(state, button.dataset.upgrade), elements.rate));
  });
}

function renderProject() {
  const project = currentProject(state);
  elements.projectsModule.classList.toggle("is-unlocked", Boolean(state.field));
  elements.projectLock.hidden = Boolean(state.field);
  if (!state.field) {
    elements.projectCard.innerHTML = "";
    return;
  }
  if (!project) {
    elements.projectCard.innerHTML = `<div class="project-card"><span class="project-label">Run complete</span><h3>A practice with momentum</h3><p class="project-complete">You completed every project in this prototype. Begin again to compare another field and constellation.</p></div>`;
    return;
  }
  const percent = Math.min(100, (state.mastery / project.requirement) * 100);
  elements.projectCard.innerHTML = `
    <div class="project-card">
      <span class="project-label">Project ${state.completedProjects + 1} of ${fields[state.field].projects.length}</span>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-meter" style="--project-fill:${percent}%"><i></i></div>
      <button class="project-button" type="button" ${state.mastery < project.requirement ? "disabled" : ""}>
        ${state.mastery < project.requirement ? `${format(state.mastery, 1)} / ${project.requirement} mastery` : `Complete project · +${project.impact} impact`}
      </button>
    </div>
  `;
  elements.projectCard.querySelector("button")?.addEventListener("click", () => commit(completeProject(state), elements.impact));
}

function renderConstellation() {
  const max = Math.max(1, ...AXES.map((axis) => state.constellation[axis]));
  AXES.forEach((axis) => {
    $(`#${axis}-value`).textContent = format(state.constellation[axis], 1);
    $(`.axis.${axis}`).style.setProperty("--fill", `${(state.constellation[axis] / max) * 100}%`);
  });
  elements.pattern.textContent = leadingPattern(state);
}

function render() {
  elements.console.textContent = state.lastMessage;
  elements.direction.textContent = specialtyName(state);
  elements.insight.textContent = format(state.insight, state.insight % 1 ? 1 : 0);
  elements.mastery.textContent = format(state.mastery, state.mastery % 1 ? 1 : 0);
  elements.impact.textContent = format(state.impact);
  elements.rate.textContent = format(practiceRate(state), 2);
  renderStarterActions();
  renderFields();
  renderSpecialties();
  renderUpgrades();
  renderProject();
  renderConstellation();
  lastDynamicSignature = dynamicSignature();
}

function dynamicSignature() {
  const project = currentProject(state);
  return [
    canChooseSpecialty(state),
    project ? state.mastery >= project.requirement : "none",
    ...upgrades.map((upgrade) => canPurchase(state, upgrade)),
  ].join("|");
}

elements.workButton.addEventListener("click", () => commit(work(state), elements.mastery));
$("#reset-button").addEventListener("click", () => {
  if (window.confirm("Begin a new run? Your current local progress will be replaced.")) {
    state = createInitialState();
    save();
    render();
  }
});

function frame(now) {
  const elapsed = (now - lastFrame) / 1000;
  lastFrame = now;
  const next = tick(state, elapsed);
  if (next !== state) {
    state = next;
    if (now - lastSaved > 2000) {
      save();
      lastSaved = now;
    }
    elements.mastery.textContent = format(state.mastery, 1);
    const signature = dynamicSignature();
    if (signature !== lastDynamicSignature) {
      renderProject();
      renderSpecialties();
      renderUpgrades();
      lastDynamicSignature = signature;
    }
  }
  requestAnimationFrame(frame);
}

render();
requestAnimationFrame(frame);
