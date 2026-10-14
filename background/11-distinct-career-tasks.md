# Different work choices, not three approaches to one task

Revision v0.10.0 (2026-10-14) responds to the user's request that choices teach the variety of a career. All 1,077 training stages and 546 career milestones now offer three different task subjects, still totaling 4,869 choices across 261 nodes and 182 occupations.

## Authoring approach

The existing task is generally retained as the first option. Two additional work subjects were individually authored for each node, using the profession's actual scope, its existing curriculum and mission descriptions, and the occupational references already recorded in `data/careers.toml`. This revision adds authored educational scenarios, not a newly downloaded occupational task database. Broad branches likewise get concrete work, not just the occupation name inserted into a template.

Training subjects develop through exploration, planning, controlled practice, verification, and (for longer curricula) adaptation, completion, and review. A player can follow a recurring work subject or sample different subjects as their skills grow. The step heading describes the learning phase; it no longer implies that all three options concern the first option's case. Career alternatives progress from reviewed professional cases to coordinated programs and durable practice or service capabilities. These scenarios teach representative work; completing them does not confer credentials or professional authority.

Examples:

| Path | Three different work subjects |
|---|---|
| Engineering foundation | Shelf requirements; solar lamp energy budget; evacuation-route circulation |
| Adult cardiac surgery | Coronary bypass; valve repair; aortic aneurysm repair |
| Bridge engineering | Vehicle crossing; wildlife overpass; pedestrian bridge |
| Legal aid | Client-led support case; eviction defense; disability-benefits appeal |
| GPU RTL | Scheduling; memory coalescing; texture-cache replacement |
| Music | Performance; composing a production score; arranging for a mixed-ability ensemble |

The canonical, fully expanded choices are in `data/careers.toml`; there is no runtime content generator or second occupation catalog. `task_subject` is an authored semantic label for validation, not a formal ontology identifier. The compiler checks that each menu has different subjects and rejects the retired approach prefixes. Semantic realism still needs human review; these checks cannot prove task equivalence or professional accuracy.

## Rewards, outcomes, and old saves

Choice IDs and numerical reward/rate values are preserved. Historical suffixes such as `:investigate`, `:collaborate`, `:improve`, and `:teach` are opaque compatibility IDs, not current meanings. New completions save their selected title and (for impact work) outcome in optional string maps. Existing completions without those snapshots use `legacy_title` / `legacy_outcome`, so an old investigation is not presented as a newly completed surgical procedure or other replacement task. Save keys, mastery gates, and completed step/project/milestone IDs remain unchanged.

Numerical scenario models remain attached only to the original matching task. Alternative contributions have qualitative outcomes and do not inherit an unrelated bridge, clinical, energy, or user-time estimate.

## World effects

World reliability no longer infers research or mentoring from an ID suffix. Any completed career milestone contributes bounded experience support to the citizen's assigned service, weighted by availability. Current authored balance: +0.015 reliability per weighted milestone, capped at +0.15. All three choices get this experience credit; their mastery and practice-rate rewards remain different. Existing worlds recalculate this derived index with the revised balance. Population, role eligibility, capability allocation, facilities, and shared project credit are unchanged.

## Validation

Checks cover all task menus, representative occupation-specific subjects, sequencing and choice dispatch, legacy rates and history, reload of new title snapshots, equal experience credit for each alternative, and availability weighting. Source compilation and all existing game, world, and impact-model tests also run. Browser checks exercise all three endpoints and both new and legacy histories.
