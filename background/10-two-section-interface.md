# Two-section career interface

UI revision v0.9.1 (2026-10-14) implements the requested two primary career sections in all three endpoints: **Choose path** and **Do work**.

`src/career-ui.js` mounts their shared structure. Choose path contains the next unlocked decision, the chosen trail, and optional career reference disclosures. Do work presents only the relevant current step, rather than separate training, project, and impact panels. `src/work-options.js` is a pure selector over existing engine state: choose a field → current training step (three choices) → current applied project → next specialization, or sequential job impact choices. Mastery thresholds show a progress meter and next unlock. Completed choices are kept in a collapsed history, including fallback labels for legacy saves.

The selector does not change rewards, prerequisites, save schemas, or source data. Project submissions still pass the engine's curriculum and mastery checks. Impact choices remain sequential and each milestone offers three alternatives. `src/app.js` dispatches each work choice through the existing engine action, refreshes the available work, and updates mastery meters between unlocks.

World management and AI competition details are collapsed overview panels. The active citizen label stays outside the world overview; adding or switching citizens closes the overview and returns to that citizen's career. The header's Add citizen control opens and focuses the creation form. Shared world projects remain world management controls.

Validation: existing engine/world/impact tests; new selector tests for ordered work, prerequisite gates, all three impact choices, and legacy history; generated-data and JavaScript checks. Browser checks cover exactly two career sections in all modes, training-to-project and impact transitions, history reload, citizen adding/switching and save isolation, AI progress, root redirect, and 390px mobile layout. No runtime or resource errors appeared.

The v0.10.0 action-content revision is documented in `11-distinct-career-tasks.md`; it preserves this two-section interface while replacing the repeated task approaches.
