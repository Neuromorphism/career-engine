# Career Engine

Career Engine is a text-first incremental game about discovering careers through activities. Players choose a broad field, complete a prerequisite-based learning track and applied work sample, then drill through a variable-depth specialization tree until they reach a recognizable real-world job. Every learning activity adds mastery and lasting practice capacity. Reaching 10,000 mastery after completing a job-level curriculum and its projects completes a run.

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

- six fields: Engineering, Medicine, Law, Skilled Trades, Science, and Business;
- variable-depth paths rather than a fixed number of tiers;
- job leaves ranging from two choices deep to paths such as Electrical Engineering → Digital Design → VLSI / ASIC Design → GPU RTL Design Engineer;
- leaf-role evidence links to O*NET and current employer postings where available;
- prerequisite-based curricula at every field, specialty, and job level;
- specific case sequences—including medical school, residency, professional, technical, scientific, legal, business, and trade scenarios—rather than repeated generic actions;
- small, reviewable work artifacts at every level rather than implausibly large starter projects;
- learning activities that grant immediate mastery and lasting practice capacity;
- a single-score economy and a 10,000-mastery finish line available only at job depth;
- multi-project job samples on selected deep paths;
- autosave and up to four hours of capped offline progress.

The much larger career taxonomy is maintained separately in the parent research project. This prototype intentionally tests the core loop with a small hand-authored set before loading thousands of career records.
