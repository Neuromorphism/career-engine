// One career interface shared by all endpoints.
export function mountCareerUI(mode) {
  document.querySelector('#game-root').innerHTML = TEMPLATE;
  document.querySelector('#edition-label').textContent = mode === 'engineering' ? 'engineering explorer' : mode === 'real-world' ? 'real-world laboratory' : mode === 'world' ? 'persistent world' : mode === 'ai' ? 'AI competition' : 'single path';
  document.querySelector(`[data-endpoint="${mode}"]`).setAttribute('aria-current', 'page');
  if (mode === 'ai') {
    document.body.classList.add('ai-mode');
    document.querySelector('.game-grid').insertAdjacentHTML('beforebegin', `<details class="edition-overview"><summary>AI competition status</summary>${AI_PANEL}</details>`);
  }
  if (mode === 'world' || mode === 'real-world') {
    document.querySelector('#reset-button').textContent = 'add citizen';
    document.querySelector('#world-overview').hidden = false;
    document.querySelector('#active-citizen-label').hidden = false;
    document.querySelector('.goal-score .score-label').textContent = 'Citizen progress';
  }
}
const TEMPLATE = `    <div class="page-shell">
      <header class="masthead">
        <div>
          <p class="eyebrow">Guidance terminal no. 01</p>
          <h1>Career Engine</h1>
        </div>
        <div class="masthead-meta">
          <span class="edition-label" id="edition-label"></span>
          <span id="save-status">local save · ready</span>
          <button class="text-button" id="reset-button" type="button">begin again</button>
          <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false">☾ Dark mode</button>
        </div>
      </header>

      <nav class="mode-nav" aria-label="Ways to play"><a href="../">Career Engine home</a><a href="../single-path/" data-endpoint="single">Single path</a><a href="../engineering/" data-endpoint="engineering">Engineering</a><a href="../world/" data-endpoint="world">World</a><a href="../ai/" data-endpoint="ai">AI competition</a><a href="../world-infra/">World infra</a><a href="../real-world/" data-endpoint="real-world">Real world</a></nav>
      <details id="world-overview" class="edition-overview" hidden><summary>World overview · citizens, status, and shared projects</summary><div id="world-dashboard"></div></details>
      <div id="active-citizen-label" class="active-citizen-heading" hidden><p class="kicker">Active citizen</p><h2 id="active-citizen-heading"></h2></div>
      <section class="console" aria-label="Career guidance console">
        <div class="console-lights" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="console-copy">
          <span class="prompt">&gt;</span>
          <span id="console-message" aria-live="polite">You do not need to know what you want to be. Begin with a verb.</span>
          <span class="cursor" aria-hidden="true"></span>
        </div>
      </section>

      <main>
        <section class="scoreboard" aria-label="Career progress">
          <div class="primary-score">
            <span class="score-label">Current direction</span>
            <strong id="direction-value">Explore professions</strong>
          </div>
          <dl>
            <div><dt>Mastery</dt><dd id="mastery-value">0</dd></div>
            <div><dt>Practice rate</dt><dd><span id="rate-value">0</span><small>/sec</small></dd></div>
          </dl>
          <div class="goal-score">
            <div><span class="score-label">Run objective</span><strong id="goal-status">Reach a job</strong></div>
            <p id="goal-copy">Choose through to a real-world job, then reach 10,000 mastery.</p>
            <div class="goal-meter" id="goal-meter" role="progressbar" aria-label="Progress toward 10,000 mastery"><i></i></div>
          </div>
        </section>

        <div class="game-grid career-sections">
          <section class="module" id="path-module" aria-labelledby="path-heading">
              <div class="module-heading">
                <span class="module-number">01</span>
                <div><p class="kicker" id="path-kicker">Decision 1 · field</p><h2 id="path-heading" tabindex="-1">Choose path</h2></div>
              </div>
              <div id="profession-discovery"></div>
              <div id="profession-goal" class="profession-goal" hidden></div>
              <h3 id="path-prompt" class="path-prompt" tabindex="-1">Choose a field</h3>
              <nav class="path-trail" id="path-trail" aria-label="Selected career path"></nav>
              <p class="module-intro" id="path-intro">Begin broadly. Each choice will reveal only the next useful distinction.</p>
              <div class="choice-list" id="path-choices"></div>
              <nav class="profession-pagination" id="path-choice-pagination" aria-label="More training paths" hidden></nav>
              <p class="lock-note" id="path-lock" hidden>Complete the current starter brief to open the next decision.</p>
              <details class="job-leaf" id="job-leaf" hidden><summary>About this career</summary><div id="career-context"></div></details>
            </section>
          <section class="module" id="work-module" aria-labelledby="work-heading">
            <div class="module-heading">
              <span class="module-number">02</span>
              <div><p class="kicker" id="work-kicker">Work follows your path</p><h2 id="work-heading" tabindex="-1">Do work</h2></div>
            </div>
            <h3 class="work-title" id="work-title"></h3>
            <p class="module-intro" id="work-intro" aria-live="polite"></p>
            <div class="training-summary" id="work-progress" hidden>
              <div><span id="work-progress-copy"></span><small id="work-rate"></small></div>
              <div class="training-meter" id="work-meter" role="progressbar" aria-label="Progress toward the next work stage" aria-valuemin="0" aria-valuemax="100"><i></i></div>
            </div>
            <div id="branch-choice-summary" aria-live="polite"></div>
            <div class="work-options" id="work-options"></div>
            <details class="work-history" id="work-history" hidden>
              <summary>Work completed</summary><div id="work-records"></div>
            </details>
          </section>
        </div>
      </main>

      <footer>
        <p>An exploratory prototype. It suggests activities to investigate; it does not tell you who to become.</p>
        <span>v0.11.1 · progress stays in this browser</span>
      </footer>
    </div>
`;
const AI_PANEL = `        <section class="ai-race" id="ai-race" aria-labelledby="ai-race-heading">
          <div class="ai-race-head">
            <div>
              <p class="kicker">Live competitor model</p>
              <h2 id="ai-race-heading">The other learner</h2>
            </div>
            <span class="ai-status" id="ai-status">awaiting field</span>
          </div>
          <div class="ai-race-body">
            <div class="ai-counter">
              <span>AI mastery</span>
              <strong id="ai-mastery-value">0</strong>
              <small>+<span id="ai-rate-value">0.00</span>/sec</small>
            </div>
            <div class="race-lanes" aria-label="Player and AI race progress">
              <div class="race-lane player-lane">
                <span>You</span>
                <div id="player-race-meter" role="progressbar" aria-label="Your race progress" aria-valuemin="0" aria-valuemax="100"><i></i></div>
              </div>
              <div class="race-lane ai-lane">
                <span>AI</span>
                <div id="ai-meter" role="progressbar" aria-label="AI race progress" aria-valuemin="0" aria-valuemax="100"><i></i></div>
              </div>
            </div>
            <div class="ai-brief">
              <strong id="ai-headline">The rival is waiting for you to choose a field.</strong>
              <p id="ai-detail">Its pace changes with the work.</p>
              <p class="ai-relative" id="ai-relative">The race begins when you choose a field.</p>
            </div>
          </div>
        </section>

`;

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}
export function showLoadError(error) {
  const root = document.querySelector('#game-root');
  root.innerHTML = `<div class="page-shell"><nav class="mode-nav"><a href="../">Career Engine home</a></nav><section class="module"><h1>Save needs attention</h1><p>${escapeHtml(error.message)}</p><p>Your existing save has been preserved. Export it for recovery before editing browser storage.</p><button id="export-recovery" type="button">Export stored progress</button></section></div>`;
  document.querySelector('#export-recovery').addEventListener('click', () => {
    const records = {};
    for (const key of ['career-engine-save-v3','career-engine-save-v2','career-engine-ai-save-v1','career-engine-world-save-v1']) {
      try { records[key] = localStorage.getItem(key); } catch { records[key] = null; }
    }
    downloadJSON(records, 'career-engine-recovery.json');
  });
}
export function downloadJSON(value, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
