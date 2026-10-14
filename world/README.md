# World endpoint

Open `/world/` through the Career Engine home screen. This endpoint uses the shared career engine, ontology, curricula, action choices, impact scenarios, and career UI in `../src/`.

Each playthrough is a named citizen of one persistent world. Add existing residents or newcomers, switch citizens, and keep earlier citizens' expertise. Only the active citizen earns learning progress; qualified inactive citizens continue supplying their assigned services. World state uses its own browser save key and can be exported/imported as JSON.

The first world copies an existing single-path save into its first citizen without changing the original. Historical career achievements do not automatically create world institutions.

`../data/world.toml` supplies reviewed game-role weights for all shared occupations, an explicit 500-resident baseline, six service definitions, profession-specific project eligibility, and seven project templates. `../scripts/compile-world.py` generates `world-data.js`. Competence is bounded; readiness requires the shared role curriculum and work samples. Work assignments are exclusive, and availability scales contribution. Services are constrained by complementary capabilities, facilities, and reliability. These are game indices, not measured health or GDP forecasts.

World Status gives one to three **Doing well** and **Needs improvement** traits. Up to five playable citizens, rules describe the actual mix with gentle humor. Larger worlds emphasize current service capacity, coverage, and bottlenecks. Rules are deterministic and do not invent delivered services.

Shared projects are commissioned once when an appropriately qualified team meets all requirements. Their facility benefits remain, and contributors return to routine services. Research and mentoring choices supply bounded reliability support; they do not create imaginary staff or deliver career-scenario lifetime totals.

Future work includes deliberate world time, population growth, maintenance events, supported career changes, and retirement. The current game has persistent citizens, metrics, assignments, institutions, and status commentary, without a demographic or economic time simulation.
