# Persistent-world expansion plan

Status: **original design proposal**. Requested 2026-10-14. Persistence, capacity, institutions, and World Status now have a first implementation; see `09-world-implementation.md`. Later simulation phases remain planned. Each career playthrough becomes a distinct citizen of one persistent player world. Citizen mastery drives world capability; projects and services translate capability into outcomes.

## 1. Player loop

Create a world → create or select a citizen → develop that citizen through the existing career tree and three-action choices → establish their professional contribution → continue with another citizen in the same world.

Replace “begin again” with **Add a citizen** and **Switch citizen**. Keep names, career paths, mastery, selected actions, work samples, and achievements on each citizen. Preserve a citizen at 10,000 mastery as an established professional rather than ending the world. Returning to that citizen permits unfinished legacy missions and, later, supported career transitions.

Offer two or three next-citizen suggestions based on unmet world needs, with free choice of any field. Example: “Your clinic has expertise but insufficient rehabilitation access. Develop a therapist, a nurse, or a community health worker.” Suggestions must not turn careers into a mandatory optimal ordering.

## 2. Population and scale

Distinguish **named playable citizens**, **other residents**, and **qualified supporting workforce**. A named citizen is one actual person, not an unexplained multiplier representing thousands of workers.

Recommended starting scenario: a small settlement with explicitly declared baseline population and services. A playthrough creates a newcomer or develops an existing resident; record which so selecting an existing resident does not increase population. Other households can arrive as housing, services, and opportunities improve. Schools and apprenticeships can expand the supporting workforce over simulated time, subject to real role and credential gates.

Population and workforce growth are later features, not implicit mastery bonuses. For the first release, population and background service baselines are scenario settings. Show player-created additions separately from baseline support. Large projects require an appropriate population/region, staff, facilities, and project scope; exports and regional beneficiaries must be explicit.

## 3. Citizen-to-capability model

For citizen i and capability k:

`contribution[i,k] = role_weight[i,k] × competence[i] × readiness[i,k] × allocation[i,k]`

Proposed initial competence curve:

`competence[i] = min(1, sqrt(mastery[i] / 10,000))`

This is a tunable game balance curve, not empirical productivity or clinical ability. For illustration, 2,500 mastery gives 0.5 and 10,000 gives 1.0. Mastery above the benchmark should not make one citizen an infinite workforce.

- **Role weight:** authored contribution to specific capabilities; includes interdisciplinary work and foundational service careers.
- **Readiness:** simulated training, work-sample, and role/credential prerequisites. Regulated delivery stays unavailable before those gates. Learners may contribute supervised support to suitable work.
- **Allocation:** share of available work committed to a service, project, research, or mentoring. Sum must not exceed the citizen's available work fraction. Preserve time for work/life circumstances rather than assuming everyone is always full-time.

Sum contributions into capability pools such as diagnosis, emergency response, treatment, rehabilitation, structural design, construction, water treatment, maintenance, teaching, research, logistics, food production, care, and governance. Do not sum all career masteries into a single all-purpose world score.

Mentoring develops future workforce and durable institutional knowledge; research improves a specific validated process; practical delivery supplies a service or project. Keep these effects separate, with limits on repeated bonuses and no recursive infinite multiplier loops.

## 4. World metrics

Start with a small explainable set, then add richer measures:

| Domain | Early display | Later measured outcome |
|---|---|---|
| Health | Coverage, accessible clinical capacity, unmet care | Preventable-event rates, functional recovery, waiting time |
| Learning | Teaching access, training capacity | Literacy/skill outcomes, completions, workforce readiness |
| Infrastructure | Usable capacity, condition, maintenance coverage | Water delivered, travel time, outages, reliability |
| Livelihoods | Service availability, useful production capacity | Deliveries, employment access, explicitly modeled household income |
| Resilience | Backup coverage and recovery readiness | Expected disruption, recovery duration |
| Community well-being | Care, inclusion, cultural access, institutional reliability | Resident goals, access disparities, participation |

Use “coverage” and “capacity” honestly. Phase-one normalized indices must be labeled game indices, not life expectancy, GDP, or other purported real-world measurements. Preserve essential care, cleaning, food, logistics, arts, and administrative contributions alongside high-profile specialties.

For each service s:

`throughput[s] = min(demand[s], facility_capacity[s], workforce_capacity[s]) × reliability[s]`

A care network additionally needs different competencies; abundant surgery expertise cannot substitute for anesthesia, nursing, diagnostics, recovery, or follow-up. Use bottlenecks within a delivery chain and complementary benefits between services. Avoid one weak unrelated world domain collapsing every metric.

Show **total service**, **baseline service**, and **increment attributable to the player's additions** separately. Missing staff or data should produce unavailable/limited indicators rather than invented outcome precision.

## 5. Shared projects and institutions

Create world-owned entities: clinic, school, workshop, water works, transit service, cultural venue, emergency network, and major infrastructure.

Projects have a unique ID, scope, demand/baseline, required capabilities, facility/workforce requirements, contributors, status, condition, and outcome records. A bridge engineer's delivery choice proposes or contributes to the world's bridge project. Other citizens contribute design, ground investigation, fabrication, electrical work, construction coordination, inspection, and maintenance. No one citizen produces a completed regional bridge solely by reaching mastery.

Record one project's effects once, with many credited contributors. Existing numeric models become project scenario templates. The bridge's estimated century of crossings is a lifetime projection; it is not added to current-year delivered trips at commissioning. Annual realized service depends on elapsed world time, observed demand, reliability, and condition. Similar controls apply to water volume, avoided emissions, and clinical prevention.

Mission rewards for mastery stay citizen-specific. Project effects belong to the world. Completing research or mentoring records evidence or trained capacity, not the delivery model's original output. Collaborating professionals must not claim the same clinical benefit or infrastructure time savings multiple times.

## 6. Experience and interface

A persistent world overview becomes the home screen: named citizens, active citizen, capabilities, service coverage, established institutions, projects, and unmet needs. A citizen screen retains the existing career tree, route references, three-action decisions, and personal mastery.

For any metric, show its calculation chain: **citizens → capabilities → service/project → outcome**. Display bottlenecks and small actionable suggestions. Identify baseline providers and background staff explicitly. Keep occupational value visible without presenting the player as a omniscient planner who must optimize every person.

Example: “Mobility improved because the regional bridge opened. Structural capacity: Amina; construction coordination: Mateo; certified fabrication team: workshop staff. Maintenance staffing is limiting next year's reliability.”

The normal game is the first integration target. Preserve the AI mode's saved citizen/race state during migration; decide its world-level design separately. Possible later framing: a rival world with different investments. Current AI rates are game parameters, not verified social or economic predictions.

## 7. Proposed state and data architecture

World-owned state:

- `worldId`, name, save schema, scenario/baseline, population, active citizen ID, and simulation date when introduced.
- Citizens keyed by unique citizen ID, each retaining the existing career-state fields and selected actions.
- Institutions, projects, workforce records, assignments, event history, and realized-outcome ledger.

Use citizen IDs for ownership. Existing node/learning/mission IDs are shared definitions, not unique person IDs. Key an event by world + citizen + activity; key project outcomes by project + reporting period to prevent duplicate credit. Derive current capability/coverage metrics from canonical state; persist realized historical outcomes rather than independently saving a second mutable copy of derived totals.

Retain `data/careers.toml` as the career source; add explicit capability weights and qualified service roles. Add a proposed `data/world.toml` for scenario baselines, service definitions, capability dependencies, metric definitions, and project templates. Reuse the existing TOML compilation/validation flow.

Keep modules separate: citizen career progression; world lifecycle/saves; capability aggregation; services/projects; world rendering. Do not overload the current `practiceRate` with units of electricity, health, or economic production.

## 8. Implementation sequence and acceptance criteria

### Phase 1 — Persistent citizens

Wrap a career save in a world; create, name, switch, and continue citizens; preserve one active training track. Established citizens remain in the roster. Keep selected action history per person. Leave other citizens' mastery unchanged by active play. Test two citizens using the same career IDs, switch/reload, continued legacy missions, and no reset of previous citizens.

### Phase 2 — Explainable world capacity

Introduce a small capability vocabulary and review mappings across all 182 existing roles. Aggregate bounded mastery contributions against explicit scenario baseline/demand. Show readiness and role complementarity. Test mastery bounds, unavailable roles, valid baseline handling, fair service-career coverage, and reproducible recomputation.

### Phase 3 — Institutions and shared projects

Ship an initial clinic, school/training service, and bridge/water-work project. Add assignments, team prerequisites, commissioning, capacity limits, maintenance readiness, and unique event credit. Test that extra surgeons cannot replace nurses, one project is credited once, assignments cannot duplicate work time, and mentoring/research cannot masquerade as delivery.

### Phase 4 — Living-world simulation

Add explicit world time, maintained services, demand/population change, supply constraints, outages/recovery, and outcomes accumulated over periods. Separate real-time learning from simulated world time. Initially advance world time through deliberate world turns; keep world consequences paused while absent. Revisit aging, retirement, career changes, and bounded offline world progress only after balance tests. Do not age or harm citizens simply because the player left the browser closed.

### Phase 5 — Broader professional lives

Make existing transition/continuity records playable, add institutions that endure succession, regional projects and trade, and an optional AI-world mode. Use saved scenario versions and explicit migrations when balance or metric definitions change.

## 9. Save migration and failure handling

Create a new world-save schema and preserve the original save as a backup. Import the existing career as the first citizen with its exact mastery, path, selected actions, work samples, completed missions, and applicable AI history. Migrate once using an import marker; never add the same citizen or mission twice after reload.

Treat existing completed impact missions as **historical citizen achievements**. They do not retrospectively commission a bridge, vaccinate a population, or manufacture unspecified world resources. Let the player turn that experience into a new, correctly scoped world project.

During early migration, maintain separate normal/AI world namespaces unless an explicit merge feature is developed. Validate the new save before switching read/write keys; quota failures must leave the original recoverable. Offer export/import before larger world ledgers exhaust browser storage.

## 10. Decisions and boundaries

Defaults proposed here: one active citizen at a time; other citizens retain established professional capacity; explicit scenario baseline; bounded expertise; no mandatory retirement; no automatic credential transfer; no destructive offline world consequences; a small meaningful metric set before monetary simulation.

Population growth rates, capability weights, service production coefficients, work allocation, research/mentoring limits, world-clock speed, and project demand remain balancing questions. They must be labeled game parameters until supported by appropriate evidence. This document records the original plan. Consult `09-world-implementation.md` for the implemented subset and remaining boundaries.
