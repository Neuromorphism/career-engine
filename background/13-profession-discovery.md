# Profession discovery and US employment coverage

Revision v0.11.0, researched 2026-10-20.

The player-facing ontology has 26 work areas, work families, canonical professions, secondary browse links, and search vocabulary. **Mental Health & Psychology** and **Agriculture & Horticulture** are direct starting points. Psychology is also discoverable through healthcare, science, education, and workplace contexts where appropriate. Plant work appears through agriculture, environment, and grounds care. These are navigational relationships, not equivalent credentials or automatic career transitions.

`data/discovery.json` is the editable browse graph; `scripts/compile-discovery.py` validates it and generates `src/discovery-data.js`. Every playable occupation has exactly one canonical record and primary home. Secondary links reuse that record. Search supports aliases, common spellings, abbreviations, and ambiguity hints for psychology, therapist, horticulture, rancher, nursery, and mechanic. The browser filters by work area and family, paginates results, and previews actual work and the training route. It never grants qualifications.

A selected profession is an optional goal saved as `targetOccupationId`. It guides the next available training choice. Selecting a goal does not complete training, skip projects, rewrite the current path, or reset a run. Incompatible goals remain previewable, with an explanation that another run or citizen is needed. Clearing a goal preserves progress. Existing saves have no goal until one is selected. All 182 previously published profession routes retain their IDs and ancestors; a regression fixture records those paths.

The 15 existing training roots remain the prerequisite graph. A new browse category does not require moving a saved training node. New professions are attached to an appropriate existing training root and have five case-development stages, three distinct subjects at each stage, an applied work sample, and three sequential career milestones. Fictional case choices advance through assessment, planning, a bounded trial, verification, and changed constraints. They do not award real professional credentials. Source education and scope notes distinguish psychology, architecture, nursing, advanced nursing, medicine, and support work.

## Employment cutoff

The user chose **US employed people** as the denominator. The benchmark is the [BLS Current Population Survey, 2025 table 11b](https://www.bls.gov/cps/cpsaat11b.htm): civilian employed people aged 16 and over, including self-employed and part-time workers. It counts people rather than payroll positions. Published total: **163,493,000**. The strict greater-than-one-in-10,000 cutoff is **16,349.3 people**.

`data/employment-coverage.json` records all 595 numeric table rows, their published point estimates, whether they are detailed occupations or rollups, the threshold decision, and mapped canonical profession IDs. All **490 qualifying detailed occupation groups** have playable representation. The expanded catalog has **617 professions**, including 435 additions. Existing rare specialties are retained; additional specialties from the approved ontology are also included without inventing separate employment estimates.

Important limits:

- The published figures are rounded to thousands and are survey estimates. This is a cutoff on published point estimates, not a confidence-bound claim about borderline occupations.
- BLS's 2025 estimates are 11-month averages, excluding October because of the federal government shutdown. They are not strictly comparable to other annual averages.
- Detailed CPS groups sometimes combine several professions or contain residual “other” categories. The mapping records playable examples of a group. A parent-group count is **not** assigned separately to every specialty or search synonym.
- Coverage of all qualifying published groups does not establish a frequency for every possible self-description, such as each physician specialty, professor's subject, job-board title, or freelance label. Additional recognizable specialties can be represented without claiming that a survey measured their individual frequency.
- Military roles are available in the game but are outside this civilian employment benchmark.
- No new detailed SOC/O*NET identifiers are invented. Added occupations carry major-group metadata and explicit mapping precision; the source is not a formal detailed crosswalk or a complete SOC/O*NET export.

`scripts/check-employment-coverage.py` verifies the denominator, strict threshold, complete table audit, detailed-group decisions, mapping references, and catalog totals. It runs with `npm run check`.

## Research behind the browsing design

`data/discovery-research.json` preserves the reviewed source bibliography and findings. Government references include SOC, O*NET reported titles, OPM's psychology series, and BLS occupational profiles. IRS Schedule C and Census NAICS illustrate business activity classifications; these are not person-level occupation codes. Army and Navy recruiting categories and O*NET military crosswalks illustrate recognizable work areas across service contexts. SEEK and Reed illustrate job-board vocabulary and browse families. Forum discussions illustrate confusion around therapist/counselor labels and the overlap between horticulture, nursery, and landscaping work.

Forum anecdotes are not representative usability research or licensing authorities. Job-board structures differ between countries and employers. The implemented graph is an editorial design informed by those references, not a claim that all members of the public share one taxonomy. Future player search and navigation evidence should inform revisions.

## World behavior and maintenance

Every new profession has an explicit authored capability profile in `data/world.toml`, so all game modes share the expanded catalog. These are game assumptions, not observed occupation productivity coefficients. Existing shared-project eligibility lists remain explicit; browsing a related category does not confer infrastructure or clinical eligibility. The historical metro calibration and source observations are unchanged.

Edit canonical work content in `data/careers.toml`, browse relationships in `data/discovery.json`, and world profiles in `data/world.toml`. Run `npm run compile`, `npm test`, and `npm run check`. Generated career JavaScript uses compact JSON to reduce the download size of the expanded library; the TOML remains readable and authoritative.
