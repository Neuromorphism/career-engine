const step = (title, description, kind = "lesson") => ({ title, description, kind });

const curriculum = (title, summary, activities) => ({ title, summary, activities });

export const curricula = {
  engineering: curriculum(
    "Engineering foundation",
    "Build the shared habits used before an engineer chooses a discipline.",
    [
      step("Frame a requirement", "Turn a vague request for a safer shelf into measurable load, size, cost, and use constraints."),
      step("Model the load path", "Sketch how force travels from shelf to bracket, fastener, wall anchor, and supporting structure."),
      step("Compare materials", "Screen wood, steel, and aluminum for stiffness, strength, fabrication, cost, and failure behavior."),
      step("Plan a controlled test", "Choose a load sequence, measurements, stop condition, and safety margin for a small prototype."),
      step("Review failure and ethics", "Document who could be harmed, what remains uncertain, and when professional review is required."),
    ],
  ),
  "electrical-engineering": curriculum(
    "Electrical engineering core",
    "Move from circuit fundamentals into measurement, signals, and safe system reasoning.",
    [
      step("Analyze a resistor network", "Calculate voltage, current, and power in a small series-parallel LED circuit before simulating it."),
      step("Read an oscilloscope trace", "Extract period, frequency, amplitude, offset, rise time, and one likely source of noise."),
      step("Choose a sensor interface", "Compare a voltage divider, bridge, and buffered input for a fictional temperature sensor."),
      step("Trace a fault safely", "Use expected node voltages to order de-energized checks for a board whose indicator no longer lights."),
    ],
  ),
  "digital-design": curriculum(
    "Digital design studio",
    "Practice combinational logic, sequential state, timing, and verification as one connected workflow.",
    [
      step("Minimize a control function", "Derive and simplify logic for a three-input safety interlock from a truth table."),
      step("Design a traffic-light FSM", "Define states, transitions, timers, reset behavior, and an emergency override."),
      step("Read a timing diagram", "Identify setup, hold, and latency relationships around a registered four-bit datapath."),
      step("Write a counter testbench", "Cover reset, rollover, enable, simultaneous controls, and an unexpected input sequence."),
    ],
  ),
  "vlsi-design": curriculum(
    "ASIC design flow",
    "Follow a small block from microarchitecture through timing, power, and implementation tradeoffs.",
    [
      step("Specify a ready/valid interface", "Define transfers, back-pressure, reset, and illegal behavior for a two-stage pipeline."),
      step("Pipeline a slow path", "Place one register in a fictional datapath and account for latency, throughput, and control alignment."),
      step("Read a synthesis summary", "Compare area, slack, fanout, and inferred-memory results against the design intent."),
      step("Plan clock and reset crossings", "Classify same-clock, asynchronous, and reset-release risks in a small subsystem diagram."),
    ],
  ),
  "gpu-rtl-design-engineer": curriculum(
    "GPU RTL casebook",
    "Work through representative control, throughput, and correctness problems from a GPU block.",
    [
      step("Resolve a warp-scheduler collision", "Specify arbitration when two ready warps request one execution resource in the same cycle.", "case"),
      step("Handle memory back-pressure", "Trace a load pipeline when the cache cannot accept a request and responses may return later.", "case"),
      step("Recover from a flushed instruction", "Keep tags, scoreboards, and writeback state consistent after a fictional branch recovery.", "case"),
      step("Find a starvation corner", "Construct a request pattern that could starve low-priority work and propose a bounded-fairness rule.", "case"),
      step("Close a timing regression", "Choose between another pipeline stage, simpler arbitration, and replication while recording PPA impact.", "case"),
    ],
  ),
  "asic-digital-design-engineer": curriculum(
    "ASIC block ownership",
    "Practice the recurring decisions an RTL owner takes from specification to handoff.",
    [
      step("Clarify an ambiguous register map", "Resolve access type, reset value, side effects, and software-visible error behavior.", "case"),
      step("Design a low-power idle mode", "Define clock gating, state retention, wake-up ordering, and observability requirements.", "case"),
      step("Triage a failing assertion", "Separate an RTL defect, environment assumption, and specification gap from a short trace.", "case"),
      step("Review a late timing fix", "Assess functional, verification, area, and power consequences of retiming a control path.", "case"),
    ],
  ),
  "design-verification": curriculum(
    "Verification methodology",
    "Turn intent into properties, stimulus, coverage, and useful failure analysis.",
    [
      step("Build a FIFO test matrix", "Cross empty, partial, full, reset, and simultaneous read/write conditions."),
      step("Write protocol assertions", "Express stable-data, legal-handshake, and eventual-response expectations for a small interface."),
      step("Plan constrained random stimulus", "Define transactions, constraints, scoreboarding, and seeds for a packet router."),
      step("Close a coverage hole", "Decide whether an uncovered scenario needs stimulus, a model fix, a waiver, or a spec question."),
    ],
  ),
  "gpu-formal-verification-engineer": curriculum(
    "GPU formal casebook",
    "Apply abstraction and proof thinking to representative GPU control logic.",
    [
      step("Prove mutual exclusion", "Show that two clients can never own a shared execution port in the same cycle.", "case"),
      step("Constrain a legal environment", "Write only the assumptions needed for a cache-request interface without hiding design bugs.", "case"),
      step("Analyze a deep counterexample", "Trace a long scheduler failure back to the earliest state divergence and violated intent.", "case"),
      step("Abstract a queue", "Replace data detail with occupancy and ordering properties while preserving the bug class of interest.", "case"),
    ],
  ),
  "fpga-design": curriculum(
    "FPGA implementation lab",
    "Move a design through constraints, synthesis, bring-up, and field debugging.",
    [
      step("Constrain clocks and pins", "Write a constraint outline for a board clock, reset, LEDs, and a synchronous input bus."),
      step("Interpret utilization", "Explain LUT, register, block-RAM, and DSP use for a small streaming design."),
      step("Debug a failed bring-up", "Order checks for power, clocks, configuration, reset, I/O mapping, and internal logic capture."),
      step("Repair a timing failure", "Choose pipelining, resource duplication, or clock reduction for one failing path."),
    ],
  ),
  "power-systems": curriculum(
    "Power systems core",
    "Study load, faults, protection, voltage, and the one-line diagrams that connect them.",
    [
      step("Build a feeder one-line", "Place source, transformer, breaker, conductor, and three building loads on a single diagram."),
      step("Estimate diversified demand", "Separate connected load from likely peak demand for a small commercial panel."),
      step("Calculate a simple fault", "Use a simplified source impedance to estimate fault current and check interrupting duty."),
      step("Review a voltage-drop complaint", "Trace conductor length, load current, starting behavior, taps, and measurement needs."),
    ],
  ),
  "protection-engineer": curriculum(
    "Protection cases",
    "Coordinate selective, dependable, and secure responses to common power-system faults.",
    [
      step("Clear a downstream feeder fault", "Coordinate a feeder relay and upstream breaker so the smallest practical section opens.", "case"),
      step("Detect a transformer differential fault", "Distinguish internal fault current from inrush and external through-fault behavior.", "case"),
      step("Investigate a nuisance trip", "Compare event records, relay targets, settings, and field conditions before changing protection.", "case"),
      step("Plan a line relay test", "Define injected quantities, trip expectations, timing tolerance, and restoration checks.", "case"),
    ],
  ),
  "power-electronics-engineer": curriculum(
    "Converter cases",
    "Work through topology, switching, thermal, control, and protection decisions.",
    [
      step("Select a DC-DC topology", "Choose buck, boost, or buck-boost for a battery-powered sensor with a changing input.", "case"),
      step("Reduce output ripple", "Compare switching frequency, inductance, capacitance, ESR, and control-loop consequences.", "case"),
      step("Find an overheating switch", "Estimate conduction and switching losses, then identify the next thermal measurement.", "case"),
      step("Handle a load transient", "Set a response target and compare compensation, stored energy, and current-limit behavior.", "case"),
    ],
  ),
  "civil-engineering": curriculum(
    "Civil engineering core",
    "Connect surveying, loads, water, access, and public safety at the site scale.",
    [
      step("Read a site plan", "Locate boundaries, contours, utilities, drainage arrows, easements, and accessible routes."),
      step("Close a level loop", "Reduce a short set of benchmark, backsight, and foresight readings and check closure."),
      step("Trace stormwater", "Map where runoff from a small parking area travels and where it could create harm."),
      step("Review an accessible route", "Check slope, cross-slope, clear width, landings, and likely field conflicts."),
    ],
  ),
  "transportation-engineering": curriculum(
    "Transportation analysis",
    "Observe movement, quantify operations, and frame safety improvements without overclaiming.",
    [
      step("Code turning movements", "Create a fifteen-minute vehicle, bicycle, and pedestrian count for a four-leg intersection."),
      step("Measure queue and delay", "Define consistent observations for maximum queue, stopped delay, and spillback."),
      step("Build a crash diagram", "Place fictional collision types, directions, light conditions, and severities on a plan."),
      step("Compare countermeasures", "Screen timing, markings, lighting, crossing, and geometry changes for one observed pattern."),
    ],
  ),
  "graduate-traffic-engineer": curriculum(
    "Traffic engineering cases",
    "Work through recurring intersection, corridor, school, and work-zone assignments.",
    [
      step("Screen a congested intersection", "Separate demand, signal timing, lane use, and downstream blockage in a peak-hour case.", "case"),
      step("Investigate a pedestrian conflict", "Use exposure, sight distance, speed, yielding, lighting, and accessibility observations.", "case"),
      step("Plan a school arrival study", "Map buses, family vehicles, walking routes, crossings, queues, and supervision windows.", "case"),
      step("Review a work-zone detour", "Check capacity, signing sequence, pedestrian continuity, emergency access, and monitoring triggers.", "case"),
    ],
  ),
  "structural-engineering": curriculum(
    "Structural cases",
    "Follow loads through members and connections while checking strength and serviceability.",
    [
      step("Check a simply supported beam", "Calculate reactions, shear, moment, stress, and a rough deflection check.", "case"),
      step("Trace a wind load path", "Carry façade pressure through diaphragms, collectors, frames, foundations, and soil.", "case"),
      step("Review a steel connection", "Identify bolt shear, bearing, plate yielding, block shear, and constructability checks.", "case"),
      step("Assess a field modification", "List information needed before accepting a new opening cut through an existing member.", "case"),
    ],
  ),
  "mechanical-engineering": curriculum(
    "Mechanical engineering core",
    "Connect free bodies, energy, fluids, materials, and manufacturing decisions.",
    [
      step("Draw a free-body diagram", "Resolve loads and reactions on a wall-mounted folding arm."),
      step("Balance heat and work", "Estimate energy needed to warm a small water volume and list ignored losses."),
      step("Map a pump system", "Place static head, friction, valve losses, and operating point on a simple system sketch."),
      step("Choose a manufacturing process", "Compare machining, sheet-metal forming, molding, and additive production for a bracket."),
    ],
  ),
  "hvac-design-engineer": curriculum(
    "HVAC design cases",
    "Practice load, ventilation, air distribution, controls, and commissioning decisions.",
    [
      step("Cool a west-facing office", "Estimate envelope, solar, people, lighting, and equipment contributions to peak load.", "case"),
      step("Ventilate a conference room", "Translate occupancy and space assumptions into outdoor-air and distribution questions.", "case"),
      step("Resolve a hot perimeter zone", "Check load, airflow, diffuser placement, controls, balancing, and envelope observations.", "case"),
      step("Review an economizer fault", "Use temperatures, damper command, mixed-air response, and operating mode to narrow causes.", "case"),
    ],
  ),
  "mechanical-design-engineer": curriculum(
    "Mechanical design cases",
    "Work through packaging, tolerance, failure, prototype, and release decisions.",
    [
      step("Package a small sensor", "Arrange board, connector, fasteners, sealing, service access, and cable strain relief.", "case"),
      step("Build a tolerance stack", "Check whether three mating dimensions guarantee assembly at worst case.", "case"),
      step("Investigate a cracked latch", "Separate overload, fatigue, notch sensitivity, material, molding, and misuse hypotheses.", "case"),
      step("Release a drawing change", "Document revision scope, affected parts, verification, inventory, and downstream communication.", "case"),
    ],
  ),

  medicine: curriculum(
    "Medical school",
    "Complete a simplified preclinical-to-clinical sequence before selecting a residency path.",
    [
      step("Learn human body", "Connect anatomy, physiology, and cell biology across the cardiovascular, respiratory, renal, and nervous systems."),
      step("Learn mechanisms of disease", "Relate pathology, microbiology, immunology, and pharmacology to why illness presents as it does."),
      step("Practice history and examination", "Organize a patient-centered history, focused examination, vital signs, and clear problem representation."),
      step("Build a differential diagnosis", "Use prevalence, severity, mechanism, and discriminating findings to rank plausible explanations."),
      step("Rotate through core clerkships", "Compare the work of medicine, surgery, pediatrics, obstetrics, psychiatry, family medicine, and neurology."),
      step("Enter residency", "Synthesize a handoff, recognize urgent instability, request help, and define a supervised learning plan.", "milestone"),
    ],
  ),
  "primary-care": curriculum(
    "Primary care residency",
    "Develop continuity, prevention, chronic-care, and coordination habits before independent practice.",
    [
      step("Manage a continuity panel", "Track preventive gaps, uncontrolled chronic disease, recent hospital care, and overdue follow-up."),
      step("Plan preventive care", "Prioritize screening, vaccination, counseling, and shared decisions for a fictional adult."),
      step("Follow multiple chronic conditions", "Reconcile diabetes, hypertension, kidney risk, medications, goals, and monitoring burden."),
      step("Recognize behavioral health needs", "Screen for depression, anxiety, substance use, safety, and barriers to follow-up."),
      step("Coordinate transitions of care", "Reconcile a discharge summary with medications, pending results, warning signs, and appointments.", "milestone"),
    ],
  ),
  "family-medicine-physician": curriculum(
    "Family medicine casebook",
    "Practice common presentations across age, setting, prevention, and continuity.",
    [
      step("Adult hypertension follow-up", "Review home readings, technique, adherence, adverse effects, cardiovascular risk, and follow-up interval.", "case"),
      step("Child with ear pain", "Organize onset, fever, hearing, examination findings, pain control, observation, and return precautions.", "case"),
      step("New diabetes diagnosis", "Explain uncertainty, initial labs, lifestyle context, medication options, monitoring, and team support.", "case"),
      step("Older adult with polypharmacy", "Reconcile indications, duplicates, interactions, falls risk, goals, and deprescribing questions.", "case"),
      step("Adult with low mood", "Assess symptoms, function, safety, supports, treatment preferences, and a concrete follow-up plan.", "case"),
      step("Prenatal counseling visit", "Structure history, medications, exposures, preventive needs, warning signs, and coordinated obstetric care.", "case"),
    ],
  ),
  "emergency-medicine-physician": curriculum(
    "Emergency medicine residency",
    "Enter supervised emergency practice, then work through high-frequency undifferentiated presentations.",
    [
      step("Begin emergency residency", "Use a primary survey, monitored reassessment, concise handoff, and early escalation under supervision.", "milestone"),
      step("Car-collision trauma", "Prioritize airway, breathing, circulation, neurologic status, exposure, hemorrhage, imaging, and disposition.", "case"),
      step("Febrile child", "Account for age, appearance, hydration, breathing, source, immunization, risk, and caregiver return precautions.", "case"),
      step("Possible heart attack", "Organize time of onset, ECG, biomarkers, dangerous alternatives, immediate treatment, and reperfusion pathways.", "case"),
      step("Acute stroke symptoms", "Establish last-known-well, glucose, neurologic deficit, imaging, contraindications, and stroke-team activation.", "case"),
      step("Opioid overdose", "Address ventilation, naloxone response, co-ingestion, recurrence risk, observation, and linkage to treatment.", "case"),
      step("Severe breathing difficulty", "Distinguish asthma, pulmonary edema, infection, obstruction, and embolic risk while supporting oxygenation.", "case"),
    ],
  ),
  "general-pediatrician": curriculum(
    "Pediatrics residency",
    "Enter supervised pediatric care, then practice common newborn-through-adolescent presentations.",
    [
      step("Begin pediatrics residency", "Use age-specific vital signs, weight-based thinking, family-centered communication, and escalation under supervision.", "milestone"),
      step("Newborn jaundice", "Organize age in hours, feeding, weight, risk factors, bilirubin trend, follow-up, and urgent warning signs.", "case"),
      step("Febrile infant", "Treat age and appearance as central risk variables while planning source evaluation and safe disposition.", "case"),
      step("Childhood asthma flare", "Assess work of breathing, oxygenation, response to therapy, triggers, technique, and home plan.", "case"),
      step("Child with abdominal pain", "Separate time-sensitive surgical, infectious, urinary, gastrointestinal, and functional possibilities.", "case"),
      step("Adolescent well visit", "Cover development, mood, safety, substance use, sexual health, confidentiality, and prevention respectfully.", "case"),
      step("Developmental concern", "Gather caregiver observations, milestones, hearing and vision context, screening, strengths, and referral needs.", "case"),
    ],
  ),
  surgery: curriculum(
    "General surgery residency",
    "Surgical cases remain locked until the residency milestone establishes supervised operative practice.",
    [
      step("Begin surgical residency", "Demonstrate sterile practice, informed consent, perioperative communication, and escalation under supervision.", "milestone"),
      step("Evaluate a surgical consult", "Translate symptoms, examination, labs, imaging, stability, and comorbidity into an initial plan.", "case"),
      step("Prepare for an operation", "Confirm indication, alternatives, consent, site, antibiotics, blood needs, positioning, equipment, and team brief.", "case"),
      step("Recognize postoperative deterioration", "Organize fever, hypotension, pain, bleeding, respiratory change, urine output, and urgent reassessment.", "case"),
      step("Manage wound and recovery", "Track healing, infection risk, nutrition, mobility, drains, pathology, and discharge readiness.", "case"),
    ],
  ),
  "general-surgeon": curriculum(
    "General surgery casebook",
    "Work through common acute, elective, and trauma presentations after residency entry.",
    [
      step("Suspected appendicitis", "Integrate migration of pain, examination, labs, imaging, alternative diagnoses, and operative timing.", "case"),
      step("Gallbladder pain and inflammation", "Distinguish biliary colic, cholecystitis, duct obstruction, pancreatitis, and sepsis risk.", "case"),
      step("Small-bowel obstruction", "Assess stability, prior surgery, hernia, imaging, fluids, decompression, ischemia risk, and operative triggers.", "case"),
      step("Symptomatic groin hernia", "Define reducibility, incarceration risk, anatomy, patient factors, approach, and recovery expectations.", "case"),
      step("New breast mass", "Coordinate history, examination, age-appropriate imaging, tissue diagnosis, and multidisciplinary communication.", "case"),
      step("Blunt abdominal trauma", "Combine primary survey, hemodynamics, focused imaging, serial examination, and operative thresholds.", "case"),
    ],
  ),

  law: curriculum(
    "Law school",
    "Complete a simplified sequence in doctrine, research, analysis, advocacy, and professional responsibility.",
    [
      step("Brief a judicial opinion", "Separate procedural posture, facts, issue, rule, reasoning, holding, and unresolved questions."),
      step("Read a statute", "Parse definitions, operative language, exceptions, cross-references, effective date, and ambiguity."),
      step("Research controlling authority", "Build a source trail from jurisdiction and issue to statutes, cases, regulations, and updates."),
      step("Write an objective memo", "Organize issue, short answer, facts, rule synthesis, application, counterarguments, and conclusion."),
      step("Practice oral advocacy", "Answer a difficult bench question directly, support the answer, and return to the requested relief."),
      step("Enter supervised practice", "Identify confidentiality, conflicts, competence, deadlines, client authority, and when to seek review.", "milestone"),
    ],
  ),
  "criminal-law": curriculum(
    "Criminal practice clinic",
    "Follow a fictional case from charging through investigation, motions, negotiation, and hearing.",
    [
      step("Read a charging document", "Map each alleged element to the stated facts and identify what is missing or disputed."),
      step("Build an evidence chronology", "Align reports, video, dispatch, physical evidence, and witness accounts by source and time."),
      step("Research a suppression issue", "Frame the government action, legal standard, disputed facts, remedy, and controlling authority."),
      step("Prepare a plea consultation", "Compare exposure, evidence, defenses, collateral effects, uncertainty, and client priorities."),
    ],
  ),
  "public-defender": curriculum(
    "Public defense casebook",
    "Practice client-centered decisions under time, evidence, and resource constraints.",
    [
      step("First appearance", "Identify liberty status, charging basis, conditions, immediate deadlines, and client communication needs.", "case"),
      step("Conflicting eyewitness accounts", "Plan interviews, test perception and memory, preserve favorable facts, and avoid assuming guilt.", "case"),
      step("Body-camera inconsistency", "Synchronize video, report, dispatch, and testimony before framing a factual or legal challenge.", "case"),
      step("Suppression hearing", "Build examination outlines around standing, state action, justification, scope, credibility, and remedy.", "case"),
      step("Sentencing advocacy", "Present history, harm, accountability, mitigation, services, collateral consequences, and a lawful proposal.", "case"),
    ],
  ),
  "corporate-associate": curriculum(
    "Corporate transactions casebook",
    "Practice recurring contract, diligence, governance, and closing work.",
    [
      step("Mark up a service agreement", "Clarify scope, acceptance, payment, IP, confidentiality, warranties, liability, term, and termination.", "case"),
      step("Review acquisition diligence", "Sort corporate, commercial, employment, IP, privacy, litigation, and consent issues by risk.", "case"),
      step("Prepare a board consent", "State authority, recitals, approvals, conflicts, delegated actions, records, and signature mechanics.", "case"),
      step("Run a closing checklist", "Track documents, conditions, signatures, funds, filings, responsible parties, and post-closing work.", "case"),
    ],
  ),
  "environmental-attorney": curriculum(
    "Environmental law casebook",
    "Trace facts through permits, enforcement, cleanup, and administrative process.",
    [
      step("Factory permit modification", "Identify the changed activity, emissions or discharge, agency, permit terms, and review pathway.", "case"),
      step("Wetland development question", "Map jurisdictional facts, project footprint, alternatives, permits, consultation, and uncertainty.", "case"),
      step("Contaminated property purchase", "Organize site history, diligence, liability pathways, cleanup status, controls, and deal allocation.", "case"),
      step("Respond to an enforcement notice", "Calendar deadlines, preserve facts, assess authority and defenses, and compare response options.", "case"),
    ],
  ),

  trades: curriculum(
    "Trade apprenticeship foundation",
    "Build safe work habits in hazard control, measurement, drawings, tools, and verification.",
    [
      step("Control hazardous energy", "Identify every energy source, isolation point, stored-energy hazard, and verification step on a trainer."),
      step("Measure and lay out", "Read a tape, level, square, and simple dimensioned drawing to mark a small practice assembly."),
      step("Select tools and materials", "Match fastener, fitting, conductor, consumable, or stock to the drawing and service conditions."),
      step("Sequence a supervised task", "Plan setup, access, fabrication, assembly, inspection hold points, cleanup, and return to service."),
      step("Verify workmanship", "Use visual, dimensional, and functional checks while recording defects and corrective work.", "milestone"),
    ],
  ),
  "commercial-electrician": curriculum(
    "Commercial electrical work orders",
    "Practice safe, code-aware planning on de-energized examples and training systems only.",
    [
      step("Install an office branch circuit", "Plan panel space, protection, conductor, raceway, boxes, receptacles, grounding, and testing.", "case"),
      step("Troubleshoot a dead lighting zone", "Use drawings and safe de-energized checks to isolate source, control, connection, and load faults.", "case"),
      step("Lay out an equipment feeder", "Coordinate load, disconnect, overcurrent protection, conductor, raceway, grounding, and route.", "case"),
      step("Commission emergency lighting", "Verify normal supply, transfer behavior, battery or generator mode, duration, labeling, and records.", "case"),
      step("Trace a nuisance breaker trip", "Separate overload, short circuit, ground fault, heat, loose connection, and equipment causes.", "case"),
    ],
  ),
  "structural-welder": curriculum(
    "Structural welding work orders",
    "Practice drawing interpretation, fit-up, qualified procedure use, distortion control, and inspection.",
    [
      step("Fit a fillet-welded frame", "Check joint symbol, material, preparation, gap, alignment, tack sequence, and hold points.", "case"),
      step("Prepare a groove-weld coupon", "Record process, filler, position, preheat, passes, interpass cleaning, and inspection criteria.", "case"),
      step("Control distortion", "Choose restraint, balanced sequence, heat input, preset, and measurement for a long welded assembly.", "case"),
      step("Evaluate visible discontinuities", "Distinguish profile, undercut, overlap, porosity, cracks, arc strikes, and acceptance questions.", "case"),
      step("Repair a rejected weld", "Define authorization, removal limits, preparation, rewelding, reinspection, and traceable records.", "case"),
    ],
  ),
  "service-plumber": curriculum(
    "Service plumbing calls",
    "Diagnose water, waste, vent, fixture, and equipment symptoms in a safe inspection order.",
    [
      step("Slow kitchen sink", "Separate local trap, branch restriction, vent interaction, disposal, and repeated-use symptoms.", "case"),
      step("Toilet that keeps running", "Inspect fill level, valve, flapper or seal, chain, overflow, shutoff, and post-repair test.", "case"),
      step("Low hot-water pressure", "Compare one-fixture versus whole-building symptoms, valves, aerators, scale, heater, and piping.", "case"),
      step("Intermittent water-heater leak", "Identify source, pressure and temperature hazards, relief components, corrosion, and replacement criteria.", "case"),
      step("Sewer odor complaint", "Trace traps, primers, vents, cleanouts, seals, occupancy patterns, and safe testing options.", "case"),
    ],
  ),

  science: curriculum(
    "Scientific practice foundation",
    "Move from a testable question to reproducible evidence and responsible communication.",
    [
      step("Turn curiosity into a hypothesis", "Define a measurable outcome, plausible mechanism, alternative explanations, and falsifying evidence."),
      step("Search and map prior work", "Separate primary evidence, review, method, consensus, and unresolved disagreement."),
      step("Design controls and replication", "Choose positive, negative, process, and measurement controls plus meaningful replicates."),
      step("Analyze uncertainty", "Distinguish variability, bias, precision, effect size, missingness, and limits of inference."),
      step("Make work reproducible", "Record samples, versions, parameters, exclusions, transformations, and provenance for another researcher."),
    ],
  ),
  "life-sciences": curriculum(
    "Life science laboratory core",
    "Develop experimental reasoning around living samples, assays, contamination, and biological variation.",
    [
      step("Plan an aseptic workflow", "Order setup, sterile fields, controls, labeling, handling, cleanup, and contamination checks."),
      step("Build a dose-response experiment", "Choose range, vehicle control, replicates, readout timing, viability, and curve interpretation."),
      step("Normalize a biological assay", "Compare per-cell, protein, housekeeping, spike-in, and batch-aware normalization choices."),
      step("Investigate a failed replicate", "Separate sample variation, reagent, handling, instrument, analysis, and documentation causes."),
    ],
  ),
  "cell-biology-scientist": curriculum(
    "Cell biology experiment set",
    "Practice common culture, imaging, perturbation, validation, and interpretation problems.",
    [
      step("Recover a stressed cell culture", "Review morphology, confluence, medium, incubator conditions, passage history, and contamination.", "case"),
      step("Validate an antibody", "Use target-positive, target-negative, knockout, secondary-only, and orthogonal evidence.", "case"),
      step("Compare two transfection runs", "Track cell state, reagent ratio, timing, efficiency, toxicity, expression, and batch effects.", "case"),
      step("Quantify a microscopy phenotype", "Define segmentation, blinded sampling, field selection, normalization, exclusions, and uncertainty.", "case"),
      step("Interpret a surprising rescue", "Test off-target effects, expression level, pathway feedback, assay artifact, and replication needs.", "case"),
    ],
  ),
  "physical-sciences": curriculum(
    "Physical measurement core",
    "Connect models to calibrated instruments, uncertainty, signal, and experimental controls.",
    [
      step("Calibrate a sensor", "Fit a response curve, inspect residuals, define range, repeatability, hysteresis, and traceability."),
      step("Propagate uncertainty", "Carry independent and shared measurement uncertainties through a derived physical quantity."),
      step("Separate signal from noise", "Compare averaging, filtering, shielding, grounding, bandwidth, and information loss."),
      step("Test a competing model", "Choose measurements whose predicted outcomes differ enough to discriminate two explanations."),
    ],
  ),
  "research-physicist": curriculum(
    "Experimental physics campaigns",
    "Work through alignment, calibration, noise, model comparison, and reproducibility.",
    [
      step("Align an optical measurement", "Set reference, degrees of freedom, safe sequence, diagnostic signals, and acceptance criteria.", "case"),
      step("Find a drifting baseline", "Correlate temperature, warm-up, power, timing, mechanical change, and acquisition settings.", "case"),
      step("Characterize a new detector", "Measure range, linearity, noise, saturation, efficiency, timing, and environmental sensitivity.", "case"),
      step("Resolve model-data disagreement", "Audit units, calibration, selection, background, uncertainty, approximations, and alternative models.", "case"),
      step("Prepare a reproducibility package", "Bundle raw data, metadata, code, environment, parameters, figures, and decision log.", "case"),
    ],
  ),
  "environmental-scientist": curriculum(
    "Environmental field campaigns",
    "Practice defensible sampling, custody, quality control, interpretation, and reporting.",
    [
      step("Investigate an upstream/downstream complaint", "Choose locations, timing, field parameters, analytes, controls, and access constraints.", "case"),
      step("Sample a suspected soil hot spot", "Plan grid and biased locations, depth, equipment decontamination, duplicates, and documentation.", "case"),
      step("Handle a broken custody chain", "Determine affected samples, data usability, notification, corrective action, and resampling needs.", "case"),
      step("Interpret a laboratory qualifier", "Connect detection limits, blanks, surrogate recovery, holding time, and matrix interference to use.", "case"),
      step("Write a bounded conclusion", "State what the data support, spatial and temporal limits, uncertainty, and the next useful sample.", "case"),
    ],
  ),
  "data-scientist": curriculum(
    "Data science casebook",
    "Practice problem framing, data quality, baselines, validation, fairness, and deployment monitoring.",
    [
      step("Predict customer churn", "Define observation window, outcome, leakage risks, baseline, class imbalance, and business action.", "case"),
      step("Forecast weekly demand", "Handle seasonality, promotions, stockouts, hierarchy, uncertainty, and time-aware validation.", "case"),
      step("Detect a fraudulent transaction", "Balance labels, delayed truth, asymmetric cost, drift, review capacity, and adversarial response.", "case"),
      step("Audit a ranking model", "Compare utility and error across groups, positions, query types, feedback loops, and appeal paths.", "case"),
      step("Investigate production drift", "Separate input, concept, pipeline, policy, and population changes using monitored signals.", "case"),
    ],
  ),

  business: curriculum(
    "Business foundation",
    "Build shared fluency in customers, economics, operations, teams, and evidence-based decisions.",
    [
      step("Define a customer problem", "Separate a user's job, pain, current workaround, buying context, and evidence from assumptions."),
      step("Read basic financial statements", "Trace a small transaction through income, cash flow, and balance-sheet effects."),
      step("Map an operating process", "Mark demand, work, queues, handoffs, constraints, defects, capacity, and service level."),
      step("Design a small market test", "State audience, proposition, channel, cost, success metric, guardrail, and stopping rule."),
      step("Write a decision memo", "Make the choice, evidence, economics, risks, dissent, owner, next checkpoint, and reversible step explicit."),
    ],
  ),
  finance: curriculum(
    "Corporate finance rotation",
    "Connect accounting, planning, variance, cash, investment, and management communication.",
    [
      step("Rebuild a monthly P&L", "Map revenue, variable cost, fixed cost, accruals, allocation, and operating profit."),
      step("Explain a budget variance", "Separate price, volume, mix, timing, one-time items, and plan-quality effects."),
      step("Build a driver-based forecast", "Link units, conversion, price, staffing, utilization, and cost assumptions across scenarios."),
      step("Evaluate a small investment", "Compare cash flows, payback, present value, sensitivity, strategic benefit, and implementation risk."),
    ],
  ),
  "fp-and-a-analyst": curriculum(
    "FP&A planning cycles",
    "Practice recurring forecast, close, scenario, and leadership-support assignments.",
    [
      step("Revenue miss at month-end", "Bridge customer count, volume, price, mix, churn, timing, and accounting effects.", "case"),
      step("Hiring-plan overrun", "Reconcile openings, starts, attrition, compensation, contractors, allocation, and forecast timing.", "case"),
      step("Downside scenario", "Translate a demand shock into revenue, margin, cash, capacity, covenant, and response assumptions.", "case"),
      step("New-product business case", "Model adoption, price, cannibalization, cost, headcount, investment, uncertainty, and decision gates.", "case"),
      step("Executive forecast review", "Surface the three decisions, biggest assumption changes, leading indicators, and owner actions.", "case"),
    ],
  ),
  "product-marketing-manager": curriculum(
    "Product marketing launches",
    "Practice segmentation, positioning, enablement, launch, and adoption learning.",
    [
      step("Segment a noisy market", "Group customers by job, context, urgency, buying process, and evidence—not demographics alone.", "case"),
      step("Position against an incumbent", "Choose frame of reference, differentiated value, proof, objection, and audience-specific language.", "case"),
      step("Prepare sales enablement", "Create discovery questions, qualification signals, demo story, proof points, and honest limitations.", "case"),
      step("Plan a product launch", "Align audience, message, channel, readiness, support, risk, measurement, and feedback cadence.", "case"),
      step("Diagnose weak adoption", "Separate awareness, activation, value realization, workflow fit, reliability, pricing, and retention.", "case"),
    ],
  ),
  "supply-chain-analyst": curriculum(
    "Supply chain disruptions",
    "Practice demand, inventory, supplier, capacity, and service tradeoffs.",
    [
      step("Prevent a stockout", "Combine demand, lead time, variability, on-hand, open orders, service priority, and substitutes.", "case"),
      step("Reduce excess inventory", "Separate forecast error, lot size, safety stock, obsolescence, allocation, and supplier terms.", "case"),
      step("Respond to a late supplier", "Map affected orders, alternate supply, expedite cost, capacity, customer priority, and recovery date.", "case"),
      step("Rebalance a constrained network", "Allocate limited capacity across products and locations using margin, service, commitments, and risk.", "case"),
      step("Investigate poor forecast accuracy", "Segment bias and error by item, horizon, event, hierarchy, data, and planning behavior.", "case"),
    ],
  ),
  "product-manager": curriculum(
    "Product decision cases",
    "Practice discovery, prioritization, delivery tradeoffs, launch, and outcome learning.",
    [
      step("Investigate a retention drop", "Segment users, locate the journey break, gather qualitative evidence, and define competing hypotheses.", "case"),
      step("Prioritize three requests", "Translate requests into problems and compare reach, impact, confidence, effort, risk, and strategy.", "case"),
      step("Cut a release scope", "Preserve the smallest coherent outcome while managing dependencies, quality, migration, and stakeholder needs.", "case"),
      step("Define a launch experiment", "Specify cohort, exposure, primary metric, guardrails, duration, interpretation, and rollback.", "case"),
      step("Respond to a failed bet", "Separate execution from premise, preserve learning, communicate clearly, and choose iterate, pivot, or stop.", "case"),
    ],
  ),
  "small-business-owner": curriculum(
    "Owner-operator scenarios",
    "Practice customer acquisition, delivery, pricing, cash, staffing, and operational resilience.",
    [
      step("Win the first ten customers", "Choose a narrow problem, direct outreach, offer, proof, follow-up, and learning record.", "case"),
      step("Price a custom job", "Include material, labor, overhead, uncertainty, rework, payment terms, margin, and customer value.", "case"),
      step("Survive a cash squeeze", "Build a thirteen-week view of collections, payroll, inventory, commitments, and controllable actions.", "case"),
      step("Hire the first employee", "Define work, standards, schedule, pay, legal obligations, training, feedback, and capacity impact.", "case"),
      step("Recover from a service failure", "Protect the customer, diagnose the process, make a fair remedy, and prevent recurrence.", "case"),
    ],
  ),
};

export function curriculumFor(nodeId) {
  return curricula[nodeId] || null;
}
