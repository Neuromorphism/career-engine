# Career Engine

Career Engine is a text-first incremental game about discovering careers through activities. Players begin undecided, try four kinds of work, choose a field, build mastery manually, automate a professional practice, specialize, and complete projects with visible community impact.

The interface takes inspiration from the progressive disclosure and compact modular rhythm of incremental games while using an original visual system, content, and mechanics.

## Play locally

```bash
npm start
```

Then open `http://localhost:4173`.

## Test

```bash
npm test
npm run check
```

There is no build step or runtime dependency. GitHub Pages can serve the repository root directly.

## Current prototype

- four opening activity types: Analyze, Build, Care, and Advocate;
- four fields: Engineering, Medicine, Law, and Skilled Trades;
- three specialties per field;
- an upgrade engine producing mastery over time;
- three projects per field;
- an activity constellation that records choices without presenting itself as an aptitude test;
- autosave and up to four hours of capped offline progress.

The much larger career taxonomy is maintained separately in the parent research project. This prototype intentionally tests the core loop with a small hand-authored set before loading thousands of career records.
