import { AXES, careerTree, upgrades } from "./careers.js";
import {
  SAVE_KEY,
  availableChoices,
  canPurchase,
  choicesUnlocked,
  chooseNode,
  completeProject,
  createInitialState,
  currentField,
  currentNode,
  currentProject,
  directionName,
  hydrateState,
  isLeaf,
  leadingPattern,
  pathNodes,
  practiceRate,
  purchaseUpgrade,
  tick,
  work,
} from "./game-engine.js";

const $ = (selector) => document.querySelector(selector);
const elements = {
  console: $("#console-message"), direction: $("#direction-value"), insight: $("#insight-value"),
  mastery: $("#mastery-value"), impact: $("#impact-value"), rate: $("#rate-value"),
  pathKicker: $("#path-kicker"), pathHeading: $("#path-heading"), pathTrail: $("#path-trail"),
  pathIntro: $("#path-intro"), pathChoices: $("#path-choices"), pathLock: $("#path-lock"),
  jobLeaf: $("#job-leaf"), practiceModule: $("#practice-module"), actionIntro: $("#action-intro"),
  workButton: $("#work-button"), workButtonLabel: $("#work-button-label"), workDescription: $("#work-description"),
  upgrades: $("#upgrade-list"), projectsModule: $("#projects-module"), projectCard: $("#project-card"),
  projectLock: $("#project-lock"), pattern: $("#pattern-note"), saveStatus: $("#save-status"),
};

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const next = hydrateState(parsed);
    return parsed?.savedAt ? tick(next, (Date.now() - parsed.savedAt) / 1000) : next;
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

function indefiniteArticle(phrase) {
  return /^[aeiou]/i.test(phrase) ? "an" : "a";
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
  elements.jobLeaf.hidden = !node || !isLeaf(state);
  if (node && isLeaf(state)) {
    const evidence = (node.evidence || []).map((item) => `
      <li><a href="${item.url}" target="_blank" rel="noreferrer">${item.label}</a><span>${item.note}</span></li>
    `).join("");
    elements.jobLeaf.innerHTML = `
      <p class="job-stamp">Specific occupation reached</p>
      <p>This branch stops here because it already names recognizable work. Other branches need more levels.</p>
      ${evidence ? `<details><summary>Evidence behind this job</summary><ul>${evidence}</ul></details>` : ""}
    `;
  }
}

function renderPractice() {
  const node = currentNode(state);
  const field = currentField(state);
  const enabled = Boolean(node && field);
  elements.practiceModule.classList.toggle("is-unlocked", enabled);
  elements.workButton.disabled = !enabled;
  if (!enabled) {
    elements.actionIntro.textContent = "Choose a field to receive your first small work cycle.";
    elements.workButtonLabel.textContent = "Choose a field first";
    elements.workDescription.textContent = "The first decision now comes before any point-building.";
    return;
  }
  elements.actionIntro.textContent = `Practice within ${node.name}. Manual work builds the insight used to improve your engine.`;
  elements.workButtonLabel.textContent = node.workLabel || field.workLabel;
  elements.workDescription.textContent = node.workDescription || field.workDescription;
}

function renderUpgrades() {
  elements.upgrades.innerHTML = upgrades.map((upgrade) => {
    const owned = Boolean(state.upgrades[upgrade.id]);
    const missing = upgrade.leafRequired && !isLeaf(state)
      ? "job leaf required"
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
  const node = currentNode(state);
  const project = currentProject(state);
  elements.projectsModule.classList.toggle("is-unlocked", Boolean(node));
  elements.projectLock.hidden = Boolean(node);
  if (!node) {
    elements.projectCard.innerHTML = "";
    return;
  }
  if (!project) {
    const hasNext = Boolean(node.children?.length);
    elements.projectCard.innerHTML = `
      <div class="project-card project-done">
        <span class="project-label">${hasNext ? "Starter brief complete" : "Role sample complete"}</span>
        <h3>${hasNext ? "The next decision is open" : "You reached the end of this prototype branch"}</h3>
        <p class="project-complete">${hasNext ? "Return to module 01 and choose the next specialization." : "Begin again to compare the work and path of another job."}</p>
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
      <button class="project-button" type="button" ${state.mastery < project.requirement ? "disabled" : ""}>
        ${state.mastery < project.requirement ? `${format(state.mastery, 1)} / ${project.requirement} mastery` : `Submit project · +${project.impact} impact`}
      </button>
    </div>`;
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

function dynamicSignature() {
  const project = currentProject(state);
  return [choicesUnlocked(state), project ? state.mastery >= project.requirement : "none", ...upgrades.map((upgrade) => canPurchase(state, upgrade))].join("|");
}

function render() {
  elements.console.textContent = state.lastMessage;
  elements.direction.textContent = directionName(state);
  elements.insight.textContent = format(state.insight, state.insight % 1 ? 1 : 0);
  elements.mastery.textContent = format(state.mastery, state.mastery % 1 ? 1 : 0);
  elements.impact.textContent = format(state.impact);
  elements.rate.textContent = format(practiceRate(state), 2);
  renderPath(); renderPractice(); renderUpgrades(); renderProject(); renderConstellation();
  lastDynamicSignature = dynamicSignature();
}

elements.workButton.addEventListener("click", () => commit(work(state), elements.mastery));
$("#reset-button").addEventListener("click", () => {
  if (window.confirm("Begin a new run? Your current local progress will be replaced.")) {
    state = createInitialState(); save(); render();
  }
});

function frame(now) {
  const elapsed = (now - lastFrame) / 1000;
  lastFrame = now;
  const next = tick(state, elapsed);
  if (next !== state) {
    state = next;
    if (now - lastSaved > 2000) { save(); lastSaved = now; }
    elements.mastery.textContent = format(state.mastery, 1);
    const signature = dynamicSignature();
    if (signature !== lastDynamicSignature) {
      renderPath(); renderProject(); renderUpgrades(); lastDynamicSignature = signature;
    }
  }
  requestAnimationFrame(frame);
}

render();
requestAnimationFrame(frame);
