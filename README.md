# Career Engine

Career Engine is a text-first incremental game about discovering meaningful work through a career tech tree. Choose a field, complete prerequisite-based training and a bounded work sample, then specialize into a recognizable occupation. At job depth, unlock practitioner, team-leader, and career-legacy missions as mastery grows.

## Play locally

```bash
python3 -m http.server 4173
```

No npm or Node.js is needed to play or deploy; any static web host can serve these files. `npm start` is an optional alias for the Python command.

Open `http://localhost:4173` to go directly to the single-path game. Its navigation links all four endpoints:

- **Single path** — `/single-path/`: the original career playthrough.
- **World** — `/world/`: develop citizens in one persistent world, combine their capabilities, and build shared institutions.
- **AI competition** — `/ai/`: a single-path race against the AI rival.
- **Real world** — `/real-world/`: shared career play, archived metro observations, fitted annual trends, workforce scenarios, and holdout evidence.

All four endpoints use one career ontology, curriculum library, action system, and core interface. Existing normal saves carry into the single-path subproject on the same site address; AI saves stay separate.

## Career interface

Every mode presents two primary sections: **Choose path** and **Do work**. Choose path offers the next unlocked career decision. Do work presents the current training step’s three actions, then an applied project, then the next unlocked occupation-specific contribution. Mastery progress explains when work opens; completed choices remain in a collapsible work history. World controls and AI competition details are available in compact overview disclosures.

## Persistent world

World mode lets you add, name, switch, and continue citizens. Their mastery and career choices remain when you develop someone else. Qualified citizens supply their assigned services, with bounded expertise and explicit work availability. Six world domains explain capability, service coverage, and bottlenecks; seven shared projects require appropriately qualified teams and count their benefits once.

**World Status** gives one to three playful “Doing well” and “Needs improvement” observations. Small worlds get comments about their exact citizen mix; larger worlds get metric-driven observations. The first world can copy your normal career into its first citizen while preserving the original save. Export/import world backups from the dashboard.

World profiles, service requirements, scenario baselines, and project eligibility live in `data/world.toml`. These are game balance parameters and indices. The initial world has 500 residents; its current model does not simulate demographic growth, GDP, aging, or a world clock.

## Real-world metropolitan model

`/real-world/` uses the same 182 careers with a separate save and a modular world-model adapter. The archived OECD-derived panel contains population, labor force, unemployment, GDP, density, and PM2.5 for eleven functional urban areas. Fit years are 2010–2016; test years are 2017–2019. Ten metros pass the declared baseline criteria; Madrid fails unemployment. Amsterdam was added after the initial failure and is disclosed as adaptive selection.

The profession allocations and service indices are exploratory: this archive contains no occupation mixes, so profession effects were not trained or independently validated. The historical baseline benchmark is not proof of accurate profession-dependent outcomes. These are historical data through 2019, not current estimates. See `real-world/README.md` for methods, limitations, data attribution, and reproduction. During development, run `node scripts/calibrate-world.mjs` (or `npm run calibrate`) to export `real-world/model-data.js` and regenerate the calibration report. The browser only evaluates saved parameters and displays precomputed validation; it never fits models.

## Career source and research

**Edit the shared `data/careers.toml` or `data/world.toml`, then run `npm run compile`.** The compilers generate `src/career-data.js` and `world/world-data.js`; playing the game requires no build step or runtime dependencies. Python 3.11+ is required only to compile/check TOML changes.

Read [`background/README.md`](background/README.md) to resume the investigation. The background folder documents approach, authoritative sources, findings, career-life routes, impact models, implementation, and remaining work.

The source contains 15 game fields, 261 nodes, 182 occupation endpoints, 546 impact missions, 29 route patterns, 54 possible transitions, and seven documented life-path examples. Its curated occupation mappings cover all 23 US SOC major groups. It is a subset of the official lists, not an exhaustive occupation database.

SOC, O*NET-SOC, ESCO, and ISCO provide classification context. Entry and career-development routes use government occupational profiles, licensing and apprenticeship sources, and primary biographies. Mapping precision and inferred transitions are explicit. Game-generated training and mission completion do not grant professional credentials.

## Progression and impact

Training activities grant immediate mastery and lasting practice capacity. Each training step offers three different career tasks. For example, engineering begins with requirements for a shelf, a solar-powered lamp, or an evacuation route. Later steps develop planning, practice, verification, and adaptation through distinct work cases. Choose one to complete the step; each option shows its mastery and lasting practice rewards.

Each occupation has three sequential impact milestones at 300, 2,000, and 7,000 mastery after its curriculum and work samples. Each milestone offers three distinct contributions. An adult cardiac surgeon can work on coronary bypass, valve repair, or aortic aneurysm care; a legal-aid attorney can pursue a general support case, eviction defense, or a disability-benefits appeal. The alternative subjects develop into larger programs and lasting professional capabilities. One choice completes the milestone and awards its own mastery and practice capacity. Project impact estimates apply only to the matching modeled task. The original 10,000-mastery completion condition remains; career missions stay available afterward.

Eleven numeric scenario models show assumptions, calculations, limitations, and methodology references in the game. For example, a modeled 60,000-crossing/day bridge supports 2.19 billion vehicle crossings over 100 years. Estimated time benefits remain distinct from added GDP. Clinical examples do not promise individual prognoses.

The browser includes a searchable full-tree preview, entry routes, later-life options, and possible outgoing career moves. These moves are investigatory content; gameplay still follows one training path per run. Original IDs and paths remain valid, and prior saves receive an empty impact-mission record.

## Verify changes

```bash
npm run compile
npm test
npm run check
```

Checks validate source integrity and generated freshness. Tests cover every reachable career, progression gates, save compatibility, duplicate reward prevention, AI behavior, and important model arithmetic. GitHub Pages can serve the repository root directly; no deployment is performed by these commands.

## Infrastructure world

Open `/world-infra/` for automatic profession-gated infrastructure, a 49-element TOML catalog, and optional historical household starting conditions. See `world-infra/README.md` for the model, evidence, assumptions and validation. This version uses a separate save.
