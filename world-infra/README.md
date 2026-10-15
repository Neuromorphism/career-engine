# World infrastructure

Serve the repository with `python3 -m http.server 4173` and open `/world-infra/`, or use **World infra** in the game navigation. This additional version has its own browser save (`career-engine-world-infra-save-v1`), export/import, and model adapter. Founders, single-path, AI and metropolitan saves retain their existing keys. An initial single-path career may be copied, never moved. The browser runs static local assets without build tools or API calls.

## Playing

Develop citizens through the shared career learning and work samples. A qualified citizen with positive work availability supplies their profession to infrastructure unlocks. A carpenter unlocks residential homes; a service plumber upgrades them to indoor plumbing; a commercial or industrial electrician upgrades them to on-demand lighting. No commission button, project assignment, spending or waiting is required. These are community expertise unlocks: citizens can support several unlocks and continue their usual service assignments.

The dashboard shows constructed stock, three household coverage indicators, and four nearest opportunities with missing professions and prerequisite infrastructure. The complete catalog and historical evidence are expandable. Missing maintenance professions are displayed separately: constructed stock persists even if availability falls to zero. This does not promise uninterrupted service, and infrastructure does not silently change the original six service indices or GDP.

The 49-element TOML catalog covers housing, water, energy, transport, health, safety, learning, communication, food, environment, civic services and culture. Each element has prerequisite infrastructure, AND groups of professions with OR alternatives, maintenance groups, description and evidence status. Local water supply/disposal and local electric supply are bundled into the basic household upgrades so the requested carpenter → plumber/electrician progression works without first developing a regional utility. Regional networks are later improvements.

## Model and historical evidence

`data/infrastructure.toml` is the source of truth. `scripts/compile-infrastructure.py` checks shared occupation IDs, nonempty groups, unique IDs, historical observations, and an acyclic prerequisite graph, then generates `infrastructure-data.js`. `src/world-models/infrastructure.js` implements the shared create/hydrate/metrics/tick/step contract. Construction computes a fixed point, independent of catalog ordering, and applies each completion once. Definition hashes prevent silently loading incompatible saved dependencies.

Historical starts are optional before any construction. They initialize assumed homes plus observed plumbing (1940, 1950, 1960) or electricity access as a lighting proxy (1925). Existing stock does not invent professional residents. Adding the missing qualified specialist expands a partial household upgrade to full fictional-community coverage.

Primary evidence, retrieved 2026-10-15:

- [US Census historical plumbing counts, 1940–1990](https://www2.census.gov/programs-surveys/decennial/tables/time-series/coh-plumbing/plumbing-tab.txt): complete and lacking counts from the US rows are retained in TOML. Coverage is complete / (complete + lacking): approximately 54.7%, 64.6%, 83.2%, 93.1%, 97.3%, 98.9%. [Definitions](https://www.census.gov/data/tables/time-series/dec/coh-plumbing.html) require hot/cold water, bathing facilities and a flush toilet. Exclusive use ceased to be required in 1990. Earlier US geography differs, including Alaska/Hawaii coverage.
- [National Park Service, The Electric Light System](https://www.nps.gov/edis/learn/kidsyouth/the-electric-light-system-phonograph-motion-pictures.htm): half of US homes had electricity in 1925. This single rounded proxy supports a starting condition, not an electricity adoption fit.

These national housing-unit shares are not observed metropolitan shares or resident-level service coverage. The snapshot scales a proportion into the fictional world, not an absolute dwelling count. Unspecified historical infrastructure is unknown; the game leaves it to construction rather than inventing observed absence. The scenario is a modern-career counterfactual with historical starting stock, not a reconstruction of historical occupations or technology availability.

A descriptive logistic adoption curve is fitted by ordinary least squares on plumbing log-odds against year (origin 1940), using **1940–1970 only**. Exported coefficients are intercept 0.0130233989 and annual slope 0.0823542733. Held-out predictions are 96.47% for 1980 (observed 97.31%) and 98.42% for 1990 (observed 98.92%), for **0.67 percentage points mean absolute error**. All parameters and per-year errors are generated reproducibly. These are two retrospective holdouts from one national series, with definition changes; they establish no metropolitan or causal profession-response accuracy. Historical starts use observed shares rather than fitted approximations. The runtime exports bounded fitted coverage for research comparisons, and observed/interpolated coverage with explicit clamped extrapolation labels. Unknown elements return null rather than made-up data.

Profession gates, alternatives, maintenance requirements and instantaneous full coverage are authored game rules. The data contain no profession time series, so construction rates or causal effects cannot be estimated from them. Materials, financing, geography, permitting, technology, workforce scale and construction durations are bundled. Regional utility engineering dependencies express gameplay progression rather than an exhaustive engineering bill of materials. Further empirical fitting needs matched occupation, infrastructure stock, construction and access series at consistent boundaries.

## Validation

Run `npm test` and `npm run check`. `npm run compile` regenerates source artifacts. Tests cover chained construction, independent household upgrades, complementary profession gates, qualification/availability, persistent stock and maintenance, historical stock and later upgrades, interpolation/extrapolation, adoption predictions, isolated saves, reload and invalid backups. Compiler checks catch cycles and unknown professions. The implementation uses the existing career UI and save mechanics.
