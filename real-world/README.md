# Real-world metropolitan laboratory

Serve the repository with `python3 -m http.server 4173` and open `http://localhost:4173/real-world/`, or copy it to any static web host. No npm, Node.js, installation, or build step is required to execute the game. The browser loads only local static files; there are no remote API calls. `npm start` remains an optional alias. Shared career learning, work samples and missions remain playable. The new laboratory has its own save, annual clock, citizen roster, aggregate workforce allocations, exports/imports, and comparison views.

The broader requested goal is **not yet fully established**: ten cities meet the historical baseline criteria, but profession-dependent real-world outcomes have not been validated. The current source has no occupation mixes. Service indices and output multipliers remain explicitly exploratory.

## Data and provenance

Source: [OECD City Statistics archive by Marco Di Maio and Pasquale Somma](https://github.com/Marco210210/City-Statistics-OECD-FUA-Analysis/blob/17162d21c78016d7af31fed4553ebfcd64621013/dataset/intermediate/Clean_dataset_with_NA.csv), commit `17162d21c78016d7af31fed4553ebfcd64621013`, retrieved 2026-10-14. The mirror identifies these as [OECD functional urban areas](https://www.oecd.org/en/data/datasets/oecd-definition-of-cities-and-functional-urban-areas.html). The archive is secondary evidence: original API observations and historical boundary versions have not been independently reverified. Some OECD economic FUA estimates are downscaled from larger regions, rather than directly measured at FUA level; see [OECD Economy–FUAs methodology](https://data-explorer.oecd.org/vis?df%5Bag%5D=OECD.CFE.EDS&df%5Bid%5D=DSD_FUA_ECO%40DF_ECONOMY).

The retained input is the mirror's **pre-imputation** file, rather than its interpolated outputs. Missing values stay null. `scripts/compile-metros.py` joins by country, city and exact variable label; London, UK is not confused with London, Canada. It generates `metro-data.js`, including the raw file SHA-256. The selected eleven areas contain 121 snapshots for 2009–2019, six metrics and four missing cells, all in 2009. Fitting starts in 2010, where all selected metrics are complete.

The source archive's license is **CC BY-NC-SA 4.0**: attribution, noncommercial use, and share-alike conditions apply to the archived data and this data adaptation. This does not change the provenance of pre-existing game code. See [the authors’ license statement](https://github.com/Marco210210/City-Statistics-OECD-FUA-Analysis#-license) and [license terms](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Units are preserved:

- Population: all ages. Labor force and unemployment: ages 15–64. Labor-force/all-age-population ratio is not a working-age participation rate.
- GDP: **million USD at constant 2015 prices and constant PPP**. It is not current USD, household income, or wages.
- Employed people: labor force × (1 − unemployment/100), derived for ages 15–64. GDP/this number is an approximate output ratio, not official all-age productivity.
- Density: people/km². PM2.5: population-weighted exposure in µg/m³. There is no emissions mechanism.

## Model fitting and simulation

`scripts/lib/calibration.js` fits each metro during development and metric on 2010–2016. Count/output/environment series use log trends; unemployment uses a bounded linear trend. Parameters are the recent window (3–7 years), slope and trend damping (0, .25, .5, .75 or 1). Rolling one-year validation entirely within the training years selects window and damping. The final model anchors to the last training observation. No 2017–2019 value is read by fitting or hyperparameter selection. Tests poison all held-out observations and confirm that fitted parameters remain identical.

`node scripts/calibrate-world.mjs` exports `real-world/model-data.js`: a static data module with versioned model structure (transforms, bounds and forecast horizon), fitted weights, the observation-source hash and precomputed validation scores. A JavaScript data module matches the existing buildless data format and needs no JSON import support or asynchronous startup. The browser's `src/world-models/inference.js` only evaluates parameters; fitting and scoring code is outside the browser dependency graph. Unknown artifact versions, unsupported structures, source mismatches and invalid weights are rejected instead of triggering runtime fitting. Existing saves retain the same model version and observation hash.

Simulation advances from the 2016 anchor to 2019 without reading the observations for the simulated year. Career learning time is separate; closing the browser does not advance calendar years. Population, labor force, unemployment, GDP, density and PM2.5 evolve from fitted parameters. Derived identities compute GDP/head and employment; these do not count as independent validation outcomes. Fitted trends are descriptive, not a structural model of births, deaths, migration, capital, trade or institutions.

The batch script produces 6,600 seeded GDP draws (11 metros × 3 years × 200) and 132 workforce scenarios (11 × 3 × 4). Ranges use training annual-innovation dispersion with square-root-horizon scaling. They assume log-normal innovations and are not empirically calibrated coverage guarantees. Workforce scenarios are deterministic; no fictional profession observations are used for fitting.

## Historical accuracy

Criteria were declared before the first scoring run. Each of the four metrics must have all three held-out years. Pass means **mean** absolute relative error ≤5% population, ≤10% labor force, ≤10% GDP, and mean absolute unemployment error ≤2 percentage points. Individual years may exceed those means; per-year values and maxima remain available in the JSON artifact. Density and PM2.5 are reported but do not determine pass/fail.

| Functional urban area | Population MAPE | Labor force MAPE | GDP MAPE | Unemployment MAE, pp | Baseline |
|---|---:|---:|---:|---:|---|
| London | 1.12% | 2.29% | 4.43% | 0.35 | Pass |
| Paris | 0.14% | 0.55% | 2.10% | 0.83 | Pass |
| Berlin | 0.94% | 0.38% | 0.44% | 0.27 | Pass |
| Madrid | 1.78% | 1.71% | 0.27% | 2.96 | Fail |
| Tokyo | 0.16% | 2.59% | 2.31% | 0.14 | Pass |
| Seoul | 0.65% | 1.21% | 1.18% | 0.07 | Pass |
| Greater Sydney | 0.63% | 0.42% | 4.95% | 0.50 | Pass |
| Toronto | 1.56% | 2.34% | 3.55% | 0.17 | Pass |
| Mexico City | 0.02% | 2.93% | 6.92% | 0.80 | Pass |
| Santiago | 2.39% | 6.21% | 0.99% | 0.27 | Pass |
| Amsterdam | 0.39% | 0.21% | 0.77% | 1.77 | Pass |

**Selection disclosure:** the initial ten included Madrid. Amsterdam was added after Madrid failed, while keeping Madrid visible and keeping all thresholds and fitted model rules unchanged. Thus ten passing cities is an adaptive coverage result, not an unbiased ten-city accuracy estimate. This panel does not establish global performance, out-of-era accuracy, or causal responses to profession changes.

## Mapping to career gameplay

All 182 shared occupations map to an authored broad profession category and the existing capability/service profile. Occupation categories are not employer industries: a software developer may work in a hospital, bank or software company. No observed workforce split is invented. All baseline employed workers remain unclassified until the player makes a scenario allocation.

Each aggregate assignment reserves headcount from the modeled employed workforce; every named citizen reserves one additional place, and only a qualified named citizen supplies professional capabilities. A professional is one person, never thousands of implicit workers. Allocations must be nonnegative safe integers and fit the workforce budget. Complementary game capabilities constrain the service index, so nurses alone do not supply all health capabilities. Indices describe the scenario's assigned workers only, not the entire metro's delivered services.

The output multiplier defaults to 1. Players may change it to ask a hypothetical productivity question. Scenario output = baseline GDP × [1 + (assumed multiplier − 1) × allocated share]. This assumption does not alter the historical forecast and is not trained from evidence. It cannot justify a claim that a given profession mix raises actual GDP.

## Architecture and compatibility

`src/world-models/registry.js` supplies the common `create`, `hydrate`, `metrics`, `tick`, `step` adapter contract. The original `founders` model wraps the original world engine; `real-world` supplies metropolitan forecasts. Career learning remains in `src/game-engine.js`. The existing `/world/` store uses the same model adapter mechanism. Its version-1 save format and original keys remain valid.

Real-world saves require `modelId`, `modelVersion`, `metroId`, simulation year and workforce assumptions; corrupt/unsupported saves are preserved and rejected. Single-path, AI, founders and real-world saves are separate. JSON backups include career progress and model state.

## Deploy and reproduce

For deployment, copy the repository's static HTML, CSS, JavaScript and supporting data files, preserving relative paths. Include `real-world/model-data.js`, `real-world/metro-data.js`, the shared `src/` and `world/` assets, and the linked `data/real-world/` reports and input CSV. Development scripts, tests, TOML sources and `package.json` are not needed by the deployed game. A static HTTP(S) host is needed for browser ES modules; double-clicking via `file://` is not supported.

Play without npm:

```sh
python3 -m http.server 4173
```

Regenerate model artifacts during development without npm (Node.js is needed only for this development command):

```sh
node scripts/calibrate-world.mjs
node scripts/calibrate-world.mjs --check
node --test
```

To regenerate observation data first, run `python3 scripts/compile-metros.py`. Existing `npm run compile`, `npm run calibrate`, `npm test`, and `npm run check` remain convenient development aliases.

`data/real-world/calibration-report.json` contains every fitted coefficient, training loss, holdout prediction, per-metric error, maximum error, pass/fail, scenario and source hash. The check command verifies generated-data, model-weights and report freshness. Exported predictions are tested against fresh development fits for every metro and simulation year, and a dependency check verifies that browser entry points never load development scripts or Node dependencies. No model training requires external libraries or live network access.

## Evidence still needed to complete the original goal

Acquire metro-by-year employment **by occupation**, harmonized ISCO/SOC mappings, same-boundary economic/service outcomes, and preferably exogenous interventions or a longer panel for identification. Preserve source URLs, years, counts, coverage, boundary vintages, sampling uncertainty and licensing. Fit profession-response parameters on training metros/years and reserve new metros/years for validation, comparing against this demographic-only baseline. Add matched outcome metrics such as staffing-sensitive service access, infrastructure reliability and housing supply only when corresponding measurements exist. Do not treat another city definition, national occupation shares, or game weights as measured FUA occupation data.
