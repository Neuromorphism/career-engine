# Metropolitan world-model implementation

The `/real-world/` endpoint extends the shared career game with a historical metropolitan laboratory, independent saves, workforce experiments and annual forecasts. Read `../real-world/README.md` for source attribution, data quality, units, model fitting, validation, selection disclosure and limitations.

Current baseline result: 10 of 11 metros meet the declared 2017–2019 mean-error thresholds after fitting on 2010–2016. Madrid fails unemployment; Amsterdam was added after that failure, without removing Madrid or changing model rules. This is adaptive city coverage, not independent evidence of ten-city generalization.

The remaining substantive gap is observed occupation mixes and matched outcomes. Profession allocation effects are explicitly exploratory. No claim that ten profession-dependent city economies have been accurately reproduced is supported yet. The data archive is secondary, pre-imputation, historical OECD-derived data; primary API and boundary vintages remain unverified.

Files: `src/world-models/registry.js` (adapter interface), `scripts/lib/calibration.js` (development-only fit/score), `src/world-models/inference.js` (runtime prediction), `real-world/model-data.js` (generated weights, structure and validation), `real-world.js` (metro simulation and save validation), `professions.js` (182 shared career mappings), `scripts/compile-metros.py` (data generation), `scripts/calibrate-world.mjs` (fitted report and seeded runs), `test/real-world.test.js` (leakage, arithmetic, workforce and save isolation checks). Old world saves and existing career progression are preserved.

Game execution is static and needs no npm or Node.js. Use `python3 -m http.server 4173` locally or any static web host. Development export: `node scripts/calibrate-world.mjs`; the browser never fits or scores models. Existing saves and numerical predictions are preserved.
