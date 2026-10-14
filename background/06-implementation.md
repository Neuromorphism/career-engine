# Editing and verification

## Data flow

`data/careers.toml` → `scripts/compile-careers.py` → `src/career-data.js` → career, curriculum, impact, and UI modules.

The generated file has the TOML's SHA-256. `npm run check` rejects a stale generated file. The compiler uses Python's standard-library `tomllib` and a restricted AST arithmetic evaluator; it does not execute arbitrary model expressions.

TOML sections: `meta`, `sources`, `soc_major_groups`, `routes`, `transitions`, `impact_models`, `nodes`, `life_path_examples`. Nodes have stable IDs, a single tree parent, kind, authored description, projects, evidence, curriculum, and occupation-specific route/mapping/mission records. Career transitions are separate edges, not additional tree parents.

## Workflow

1. Read the background notes and inspect the relevant source records.
2. Research the occupation and credential requirements; add source provenance.
3. Add or revise the TOML. Preserve old IDs and paths when possible. Label exact versus broader mappings and supported versus inferred routes accurately.
4. Update metadata occupation count, and explicit count expectations in tests when coverage changes.
5. Run `npm run compile`, `npm test`, `npm run check`.
6. Check the base UI and `/ai/` when changing rendering or progression. Update this folder's counts and limitations.

Compiler checks include duplicate IDs, unknown sources/routes, missing parents, tree cycles, dangling transitions, curricula, work samples, mission sequence, impact references, metric expressions, and occupation totals. Tests exercise all 182 reachable leaves, prerequisite enforcement, duplicate reward prevention, old saves, and key model arithmetic.

Browser verification used headless Chromium against a local-only server. It checked both modes, full-tree search and empty results, a congenital-heart saved path, sequential impact completion and reload, bridge metrics, and 390px overflow. A temporary smoke script and screenshot live under ignored `work/`; they are not runtime dependencies.

The original six roots and all existing node IDs remain stable. Save keys stay unchanged; absent `completedImpactKeys` becomes an empty list. Cache query strings are version 0.9.0. `learningChoices` and `impactChoices` persist the selected alternative per completed step or milestone. Missing choice maps in older saves default to the original action, preserving original rewards and rates. The compiler requires two or three choices per step/milestone and validates unique IDs, distinct titles, rewards, and impact-model references. The AI rival retains existing profiles and falls back to ancestor or default profiles for new careers; those are game parameters, not labor-market forecasts.

The root now redirects to the single-path endpoint; the shared game navigation links all three modes. `single-path/`, `world/`, and `ai/` use one shared career UI and engine. See `09-world-implementation.md` for world data, metrics, status, and save adapters. `npm run compile` and `npm run check` cover both career and world TOML.
