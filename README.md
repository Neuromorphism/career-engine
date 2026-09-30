# Career Engine

Career Engine is a text-first incremental game about discovering careers through activities. Players first choose a broad field, complete a small representative work sample, then reuse the same decision module to drill through a variable-depth specialization tree until they reach a recognizable real-world job.

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
- small, reviewable work artifacts at every level rather than implausibly large starter projects;
- an upgrade engine producing mastery over time;
- multi-project job samples on selected deep paths;
- an activity constellation that records choices without presenting itself as an aptitude test;
- autosave and up to four hours of capped offline progress.

The much larger career taxonomy is maintained separately in the parent research project. This prototype intentionally tests the core loop with a small hand-authored set before loading thousands of career records.
