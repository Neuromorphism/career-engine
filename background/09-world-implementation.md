# Persistent world and linked endpoints: implemented

Implementation snapshot: 2026-10-14, v0.9.0. This supersedes the “not implemented” boundary in the original plan for its persistence, capacity, and institution foundations.

## Entry points

- `/`: redirects to `single-path/` (relative URL, so nested hosting works). The game navigation still links all three modes.
- `/single-path/`: original career playthrough; keeps original normal save keys.
- `/world/`: persistent world and named citizens.
- `/ai/`: single-path AI competition; keeps its separate save key.

Every endpoint uses `src/app.js`, `src/career-ui.js`, `src/game-engine.js`, and the same generated career data. Endpoint scripts are small adapters; there are no separate ontology copies. Shared career source remains `data/careers.toml`.

## World model

`data/world.toml` declares profiles for all 182 occupations, 14 capability types, six service domains, a 500-resident baseline, and seven shared projects. Role weights are authored game parameters, not measured occupational productivity. `scripts/compile-world.py` validates coverage, references, weights, and profession-specific project eligibility, then generates `world/world-data.js`.

Citizens keep the existing career state plus a unique ID, name, origin, work availability, and one assignment. Named existing residents come from the baseline population; newcomers increase population by one. Only the active citizen learns. Qualified inactive citizens continue contributing. Independent service readiness requires a job leaf, completed curriculum, and completed work samples; simulated competence is bounded by `min(1, sqrt(mastery / 10000))`.

Each service gets only its assigned citizens' contributions. Capability coverage shows progress toward a skill mix; delivered service coverage uses the weakest required capability, facility limits, and reliability. Baseline and added service are separate. Research and mentoring produce bounded reliability support, not untracked worker multiplication.

Projects have a single world record and explicit eligible professions. Generic software design cannot stand in for bridge design, nor veterinary practice for a human clinic. Assigned project workers are removed from ordinary services until commissioning. The qualified team must meet every requirement; commissioning credits contributors once and returns them to ordinary services. Institutions retain facility benefits.

## World Status

`world/world-status.js` returns deterministic `doingWell` and `needsImprovement` arrays, each containing one to three traits. Up to five playable citizens, humor follows the actual career mix and distinguishes trainees. Examples include the one-person communication department, carpenter/engineer/artist joke setup, and two carpenters with an artist. Larger worlds emphasize capacity, delivered coverage, bottlenecks, and institutions. Statements describe current modeled facts, not imaginary completed houses or clinical outcomes.

## Persistence and checks

`world/save-store.js` copies an existing normal career into the initial citizen once. The original normal and AI save bytes remain untouched. Imported legacy impact missions remain citizen achievements, not retrospective world project completion. World export/import provides backups; unsupported or malformed world saves are preserved for recovery, and quota failures are surfaced rather than silently resetting progress.

World tests cover population accounting, switching and reload, active-only offline learning, mastery bounds, readiness, complementary roles, exclusive assignments, shared project credit, role eligibility, migration isolation, storage failure, all occupation profiles, and early/late status rules. Browser checks cover home and all three endpoints, training choices, AI progress, migration, citizen switching/reload, escaped names, shared commissioning, stable form input, World Status, mobile layout, and resource/runtime errors.

## Still planned

World time, demographic growth, income/GDP, aging/retirement, degradation, disasters, and playable lateral career transitions are not implemented. The original plan remains the roadmap for these. Current metrics are explicitly game indices; career-scale numerical impact models remain separate scenario illustrations.
