# Career investigation: start here

Research snapshot: **2026-10-14**. The user's goal is an expansive career tech tree with motivating, occupation-specific actions and defensible impact estimates. They explicitly requested a researched TOML source and concise background notes for future sessions.

## Current result

- **Source of truth:** `data/careers.toml`.
- **Coverage:** 15 game fields, 261 nodes, 182 occupation endpoints, with at least one endpoint in each of the 23 US SOC major groups.
- **Content:** 546 impact milestones, each with three contribution choices; 29 reusable entry/development/continuity route patterns; 54 explicit possible career transitions; 7 documented individual life-path examples; 11 quantitative scenario models.
- **Action choices:** three alternatives at every training step and impact milestone, authored in the TOML (4,869 choices total).
- **Browser data:** `src/career-data.js`, generated from the TOML. Do not edit it directly.
- **Commands:** `npm run compile`, `npm test`, `npm run check`; `npm start` serves the base game and `/ai/` mode.
- **Requirements:** Python 3.11+ for the standard-library TOML compiler; Node for tests/checks. Playing the generated game needs no build or runtime dependencies.

This is a **curated playable subset**, not all 867 SOC occupations or 1,016 O*NET taxonomy titles. Career-route possibilities are not transition probabilities. Numeric mission outcomes are transparent scenarios, not empirical forecasts.

Read `01-approach.md` and `03-results-and-coverage.md` first. Use `02-sources.md` for authoritative references and `06-implementation.md` before editing. `07-next-investigations.md` lists remaining gaps. No site deployment or publication was performed.

## Persistent world and linked endpoints

The user requested one persistent world populated by citizens from successive career playthroughs, with world metrics driven by citizen mastery. Read `09-world-implementation.md` for the three endpoints, persistent citizens, world metrics, projects, and World Status. `08-persistent-world-plan.md` retains the original design and future roadmap. World time and demographic/economic simulation remain planned. Read `10-two-section-interface.md` for the current Choose path / Do work interface and its progression selector.
