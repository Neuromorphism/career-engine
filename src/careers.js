export const AXES = ["analyze", "build", "care", "advocate"];

const p = (title, description, deliverable, requirement, impact) => ({
  title, description, deliverable, requirement, impact,
});

const source = (label, url, note, type = "occupation_reference") => ({ label, url, note, type });

const onet = (code, label, note) => source(
  `O*NET · ${label}`,
  `https://www.onetonline.org/link/summary/${code}`,
  note,
);

export const careerTree = [
  {
    id: "engineering",
    name: "Engineering",
    decisionLabel: "engineering discipline",
    blurb: "Design, test, and improve systems under technical and human constraints.",
    workLabel: "Run a small design cycle",
    workDescription: "Define the need, make one assumption explicit, test it, and record what changed.",
    axes: ["analyze", "build"],
    projects: [p(
      "Compare a shelf bracket",
      "A small wall shelf needs a bracket. Compare two shapes or materials using load, cost, manufacturability, and safety—not intuition alone.",
      "A one-page trade study with a sketch, assumptions, a simple test, and a recommendation.",
      3, 3,
    )],
    children: [
      {
        id: "electrical-engineering", name: "Electrical Engineering", decisionLabel: "electrical focus",
        blurb: "Circuits, power, electronics, controls, signals, and computing hardware.",
        projects: [p("Test an LED circuit", "Choose a resistor, predict current, assemble or simulate the circuit, then compare measurement with prediction.", "Schematic, calculation, measurement table, and one paragraph on the mismatch.", 8, 4)],
        children: [
          {
            id: "digital-design", name: "Digital Design", decisionLabel: "digital-design specialty",
            blurb: "Represent behavior with logic, state, clocks, and hardware description languages.",
            projects: [p("Design a four-bit counter", "Write its state behavior, account for reset, and test normal and boundary cases in a simulator or on paper.", "Truth/state table, timing diagram, and a short test list.", 14, 5)],
            children: [
              {
                id: "vlsi-design", name: "VLSI / ASIC Design", decisionLabel: "chip-design job",
                blurb: "Turn digital functions into manufacturable integrated-circuit blocks under power, timing, and area constraints.",
                projects: [p("Specify a tiny RTL block", "Define a register block or arbiter before implementation: interface, latency, reset behavior, and failure cases.", "A one-page microarchitecture specification and block diagram.", 22, 7)],
                children: [
                  {
                    id: "gpu-rtl-design-engineer", name: "GPU RTL Design Engineer", jobTitle: "GPU RTL Design Engineer",
                    blurb: "Design GPU subsystem logic, document microarchitecture, implement RTL, and work toward verified, synthesis- and timing-clean blocks.",
                    projects: [
                      p("Specify a two-client GPU arbiter", "Define fairness, priority, latency, reset, and back-pressure behavior for a deliberately tiny scheduler block.", "Microarchitecture note with interface table, state diagram, and five corner cases.", 30, 10),
                      p("Implement and verify the arbiter", "Write pseudocode or HDL, then construct a small testbench that attacks simultaneous requests, starvation, and reset.", "RTL or structured pseudocode plus a self-checking test plan and results.", 46, 16),
                      p("Close one design tradeoff", "Compare two implementations against frequency, latency, area, and power proxies; recommend one and document what remains uncertain.", "A concise PPA tradeoff review suitable for a design meeting.", 68, 24),
                    ],
                    evidence: [
                      source("NVIDIA · ASIC Design Engineer", "https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/ASIC-Design-Engineer_JR2015189-1", "Posting emphasizes microarchitecture documents, power/area-efficient RTL, verification, synthesis, timing, and GPU IP.", "job_posting"),
                      onet("17-2071.00", "Electrical Engineers", "Federal task and occupation reference."),
                    ],
                  },
                  {
                    id: "asic-digital-design-engineer", name: "ASIC Digital Design Engineer", jobTitle: "ASIC Digital Design Engineer",
                    blurb: "Own microarchitecture and RTL for a chip block and coordinate with verification, timing, and physical-design teams.",
                    projects: [p("Review an RTL interface", "Find ambiguity in a small interface specification and turn it into explicit protocol assertions.", "Annotated interface spec with assertions and unresolved questions.", 30, 10)],
                    evidence: [source("NVIDIA · ASIC Design Engineer, Boot and Power", "https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/ASIC-Design-Engineer--BOOT-and-Power-Management_JR2020597", "Posting connects RTL ownership to architectural tradeoffs, verification, timing, and silicon validation.", "job_posting")],
                  },
                ],
              },
              {
                id: "design-verification", name: "Design Verification", decisionLabel: "verification job",
                blurb: "Prove that digital hardware behaves correctly before fabrication.",
                projects: [p("Break a FIFO specification", "List properties a small queue must always satisfy, then construct edge cases for full, empty, reset, and simultaneous operations.", "Verification matrix with assertions, stimulus, and expected outcomes.", 22, 7)],
                children: [{
                  id: "gpu-formal-verification-engineer", name: "GPU Formal Verification Engineer", jobTitle: "GPU Formal Verification Engineer",
                  blurb: "Use assertions, abstraction, and formal tools to find correctness failures in complex graphics and processor logic.",
                  projects: [p("Prove a scheduler invariant", "Express and test a property such as mutual exclusion or eventual service on a small abstract GPU scheduler.", "Property set, assumptions, counterexample analysis, and a revised property.", 30, 10)],
                  evidence: [source("AMD · Staff Formal Verification Engineer (GPU)", "https://careers.amd.com/careers-home/jobs/87249?lang=en-us", "Posting highlights SystemVerilog assertions, abstraction, processor/GPU control and datapath, and formal methodology.", "job_posting")],
                }],
              },
              {
                id: "fpga-design", name: "FPGA Design", jobTitle: "FPGA Design Engineer",
                blurb: "Implement and debug reconfigurable digital hardware for prototypes and deployed systems.",
                projects: [p("Map a counter to an FPGA", "Define clocks, reset, pins, and resource expectations, then review a mock synthesis report.", "Constraint file outline, utilization notes, and bench test procedure.", 22, 8)],
                evidence: [onet("17-2071.00", "Electrical Engineers", "Broad federal occupation reference; employer titles vary by application.")],
              },
            ],
          },
          {
            id: "power-systems", name: "Power Systems", decisionLabel: "power specialty",
            blurb: "Generate, convert, protect, transmit, and distribute electrical energy.",
            projects: [p("Map a small building load", "Inventory a few loads, estimate demand, identify the protective device, and flag uncertainty.", "One-line diagram and a checked load table.", 14, 5)],
            children: [
              { id: "protection-engineer", name: "Protection & Controls Engineer", jobTitle: "Protection and Controls Engineer", blurb: "Design and test schemes that detect faults and isolate only the affected power-system equipment.", projects: [p("Coordinate two protective devices", "Given simplified time-current curves, choose settings so the downstream device acts first.", "Coordination sketch, chosen settings, and assumptions.", 22, 9)], evidence: [onet("17-2071.00", "Electrical Engineers", "Power-system work appears under the broader electrical-engineer occupation.")] },
              { id: "power-electronics-engineer", name: "Power Electronics Engineer", jobTitle: "Power Electronics Engineer", blurb: "Design converters, inverters, drives, and power-control hardware.", projects: [p("Compare two DC converters", "Choose between simplified converter options for a low-power device using efficiency, ripple, parts, and control complexity.", "Topology comparison and recommended operating point.", 22, 9)], evidence: [onet("17-2072.00", "Electronics Engineers", "Federal occupation reference for electronics design roles.")] },
            ],
          },
        ],
      },
      {
        id: "civil-engineering", name: "Civil Engineering", decisionLabel: "civil focus",
        blurb: "Structures, transportation, water, land, and public infrastructure.",
        projects: [p("Document a sidewalk defect", "Measure one small site, note drainage and accessibility constraints, and distinguish observation from assumption.", "Dimensioned field sketch, photo log outline, and issue statement.", 8, 4)],
        children: [
          { id: "transportation-engineering", name: "Transportation Engineering", decisionLabel: "transportation job", blurb: "Analyze and design systems that move people and goods safely.", projects: [p("Count one crossing", "Observe a crossing for fifteen minutes and separate vehicle, bicycle, pedestrian, and conflict observations.", "Movement count sheet, annotated plan, and two questions for further study.", 14, 5)], children: [{ id: "graduate-traffic-engineer", name: "Graduate Traffic Engineer", jobTitle: "Graduate Traffic Engineer", blurb: "Collect traffic data, evaluate operations and safety, and prepare early designs for signs, markings, signals, and lighting.", projects: [p("Screen a small intersection", "Use a short count and site notes to identify one operational issue and one safety issue without overclaiming.", "Two-page screening memo with a simple diagram and next-data recommendation.", 22, 10)], evidence: [source("TKDA · Graduate Traffic Engineer", "https://jobs.lever.co/tkda/49f89404-8497-407c-9a99-c2e6c1e4f8c9", "Posting names traffic counts, intersection operations, safety and multimodal evaluation, studies, and preliminary design.", "job_posting")] }] },
          { id: "structural-engineering", name: "Structural Engineering", jobTitle: "Structural Engineer", blurb: "Analyze and design structures to carry expected loads with appropriate safety and serviceability.", projects: [p("Check a simple beam", "Calculate reactions and sketch shear and bending for a simply supported beam under one load case.", "Calculation sheet with load path, assumptions, and a reasonableness check.", 14, 8)], evidence: [onet("17-2051.00", "Civil Engineers", "Structural engineering is represented within the broader civil occupation.")] },
        ],
      },
      {
        id: "mechanical-engineering", name: "Mechanical Engineering", decisionLabel: "mechanical focus",
        blurb: "Machines, products, motion, heat, fluids, energy, and manufacturing.",
        projects: [p("Measure a mechanism", "Observe a hinge, latch, or linkage and identify motion, forces, wear surfaces, and likely failure points.", "Free-body sketch and a short failure-mode list.", 8, 4)],
        children: [
          { id: "hvac-design-engineer", name: "HVAC Design Engineer", jobTitle: "HVAC Design Engineer", blurb: "Size and lay out heating, cooling, ventilation, and controls for individual buildings and spaces.", projects: [p("Estimate one room's heat gain", "Use room size, windows, people, equipment, and assumptions to estimate a small cooling load—not a neighborhood system.", "Room load worksheet, assumptions, and a proposed measurement to improve it.", 14, 9)], evidence: [onet("17-2141.00", "Mechanical Engineers", "HVAC design is an application area within mechanical engineering.")] },
          { id: "mechanical-design-engineer", name: "Mechanical Design Engineer", jobTitle: "Mechanical Design Engineer", blurb: "Develop parts and assemblies, tolerances, drawings, prototypes, and tests.", projects: [p("Redesign a simple enclosure", "Improve a small electronics enclosure for assembly, access, stiffness, and manufacturability.", "Annotated CAD sketch or drawing with three design decisions.", 14, 9)], evidence: [onet("17-2141.00", "Mechanical Engineers", "Federal occupation reference for mechanical design work.")] },
        ],
      },
    ],
  },
  {
    id: "medicine", name: "Medicine", decisionLabel: "medical practice area",
    blurb: "Prevent, diagnose, and treat illness while communicating uncertainty and coordinating care.",
    workLabel: "Reason through a teaching case", workDescription: "Organize a fictional case, identify missing information, and explain the next safe step.", axes: ["care", "analyze"],
    projects: [p("Build a focused history", "From a fictional, non-emergency teaching vignette, organize symptoms by timeline and identify questions that would change the next step.", "Problem representation, five follow-up questions, and a red-flag checklist.", 3, 3)],
    children: [
      { id: "primary-care", name: "Primary Care", decisionLabel: "primary-care specialty", blurb: "First-contact, continuous, comprehensive care and prevention.", projects: [p("Prepare a preventive visit", "Review a fictional chart and identify preventive topics, medication questions, and follow-up needs without diagnosing.", "Pre-visit planning note and prioritized agenda.", 8, 5)], children: [{ id: "family-medicine-physician", name: "Family Medicine Physician", jobTitle: "Family Medicine Physician", blurb: "Provide broad care across ages and conditions, often over long relationships with patients and families.", projects: [p("Coordinate a follow-up plan", "Reconcile a fictional patient's concerns, medications, test follow-up, and practical barriers into a clear plan.", "Plain-language after-visit summary and follow-up checklist.", 14, 10)], evidence: [source("Mayo Clinic · Family Medicine careers", "https://jobs.mayoclinic.org/familymedicine", "Career page describes outpatient, inpatient, urgent-care, obstetric, academic, and community practice settings.", "job_posting_collection"), onet("29-1215.00", "Family Medicine Physicians", "Federal occupation reference.")] }] },
      { id: "emergency-medicine-physician", name: "Emergency Medicine Physician", jobTitle: "Emergency Medicine Physician", blurb: "Rapidly evaluate undifferentiated illness or injury, stabilize urgent problems, and coordinate disposition.", projects: [p("Triage three teaching cases", "Rank three fictional cases by urgency using airway, breathing, circulation, mental status, and time sensitivity.", "Triage order with reasons, missing data, and escalation triggers.", 8, 10)], evidence: [onet("29-1214.00", "Emergency Medicine Physicians", "Federal task and occupation reference.")] },
      { id: "general-pediatrician", name: "General Pediatrician", jobTitle: "General Pediatrician", blurb: "Support health, development, prevention, and illness care from infancy through adolescence.", projects: [p("Prepare a well-child visit", "Organize a fictional visit around growth, development, prevention, family questions, and age-appropriate communication.", "Visit agenda and parent-facing question list.", 8, 10)], evidence: [onet("29-1221.00", "Pediatricians, General", "Federal task and occupation reference.")] },
    ],
  },
  {
    id: "law", name: "Law", decisionLabel: "legal practice area",
    blurb: "Interpret rules, investigate facts, advise clients, negotiate, and advocate within institutions.",
    workLabel: "Analyze a short fact pattern", workDescription: "Separate facts, assumptions, legal questions, client goals, and next research steps.", axes: ["advocate", "analyze"],
    projects: [p("Spot the issues", "Read a fictional one-page dispute and distinguish known facts, disputed facts, legal questions, and practical client goals.", "Four-column issue sheet and three research questions.", 3, 3)],
    children: [
      { id: "criminal-law", name: "Criminal Law", decisionLabel: "criminal-law role", blurb: "Cases involving alleged offenses, liberty, evidence, procedure, and constitutional rights.", projects: [p("Build a case chronology", "Organize a fictional police report, witness note, and video timestamp without deciding guilt.", "Sourced timeline with contradictions and missing evidence.", 8, 5)], children: [{ id: "public-defender", name: "Public Defender", jobTitle: "Public Defender", blurb: "Represent clients who cannot afford counsel through interviews, research, negotiation, hearings, trials, and appeals.", projects: [p("Plan an initial client interview", "Turn a fictional charging document into a client-centered interview plan that protects confidentiality and tests the timeline.", "Interview outline, immediate-deadline checklist, and investigation requests.", 14, 10)], evidence: [source("Chester County · Attorney I, Public Defender", "https://www.governmentjobs.com/jobs/5346212-0/attorney-i-t-public-defender", "Posting lists client and witness interviews, legal research, evaluating defenses, hearings, negotiation, and reporting.", "job_posting"), onet("23-1011.00", "Lawyers", "Federal occupation reference.")] }] },
      { id: "corporate-associate", name: "Corporate Associate", jobTitle: "Corporate Associate Attorney", blurb: "Draft and negotiate business agreements and advise organizations on transactions and governance.", projects: [p("Mark up a simple service agreement", "Identify parties, obligations, payment, term, termination, confidentiality, and the two most important ambiguities.", "Issue list and annotated fictional contract excerpt.", 8, 10)], evidence: [onet("23-1011.00", "Lawyers", "Corporate practice is included in the broader lawyer occupation.")] },
      { id: "environmental-attorney", name: "Environmental Attorney", jobTitle: "Environmental Attorney", blurb: "Work with environmental statutes, permits, enforcement, land, energy, and regulated activities.", projects: [p("Trace a permit question", "Map a fictional small facility change to the facts, agency, permit, rule, and unanswered technical questions.", "Regulatory research trail and a short client-question list.", 8, 10)], evidence: [onet("23-1011.00", "Lawyers", "Environmental practice is included in the broader lawyer occupation.")] },
    ],
  },
  {
    id: "trades", name: "Skilled Trades", decisionLabel: "trade",
    blurb: "Install, fabricate, diagnose, maintain, and repair physical systems safely.",
    workLabel: "Plan and verify a safe task", workDescription: "Identify hazards, tools, materials, sequence, inspection points, and a final functional test.", axes: ["build", "analyze"],
    projects: [p("Write a safe work plan", "For a fictional bench repair, identify energy sources, isolation steps, PPE, tools, and the check before return to service.", "Pre-task plan and verification checklist. Never practice on live systems.", 3, 3)],
    children: [
      { id: "commercial-electrician", name: "Commercial Electrician", jobTitle: "Commercial Electrician", blurb: "Install and troubleshoot building power, lighting, controls, raceways, panels, and equipment.", projects: [p("Map a training-board circuit", "On paper or a de-energized trainer, trace source, protection, switch, load, grounding, and test points.", "Marked-up schematic, material list, and safe test sequence.", 8, 10)], evidence: [onet("47-2111.00", "Electricians", "Federal tasks include installing, maintaining, and testing electrical wiring and equipment.")] },
      { id: "structural-welder", name: "Structural Welder", jobTitle: "Structural Welder", blurb: "Fit and join structural components to drawings and qualified procedures, then inspect the result.", projects: [p("Plan a weld coupon", "Read a simplified joint symbol and identify process, position, preparation, sequence, PPE, and inspection criteria.", "Coupon plan, parameter record, and visual-inspection checklist.", 8, 10)], evidence: [onet("51-4121.00", "Welders, Cutters, Solderers, and Brazers", "Federal occupation reference for welding tasks and titles.")] },
      { id: "service-plumber", name: "Service Plumber", jobTitle: "Service Plumber", blurb: "Diagnose and repair water, waste, vent, fixture, and related building systems.", projects: [p("Diagnose a slow fixture", "Use a fictional symptom set to distinguish local trap, vent, branch, and supply possibilities before choosing a safe inspection order.", "Diagnostic tree, tool list, and post-repair test checklist.", 8, 10)], evidence: [onet("47-2152.00", "Plumbers, Pipefitters, and Steamfitters", "Federal tasks include layout, installation, testing, diagnosis, and repair.")] },
    ],
  },
  {
    id: "science", name: "Science", decisionLabel: "scientific domain",
    blurb: "Ask testable questions, gather evidence, quantify uncertainty, and revise explanations.",
    workLabel: "Run a small investigation", workDescription: "State a testable question, define one variable, record observations, and separate results from interpretation.", axes: ["analyze", "care"],
    projects: [p("Measure one variable", "Choose a safe everyday phenomenon, make five consistent measurements, and record conditions that could distort the result.", "Question, method, data table, tiny chart, and uncertainty note.", 3, 3)],
    children: [
      { id: "life-sciences", name: "Life Sciences", decisionLabel: "life-science focus", blurb: "Living systems from molecules and cells to organisms and ecosystems.", projects: [p("Design a controlled comparison", "Create a harmless paper experiment plan with control, treatment, replicate, measurement, and contamination risks.", "Experimental matrix and predicted outcomes.", 8, 5)], children: [{ id: "cell-biology-scientist", name: "Cell Biology Research Scientist", jobTitle: "Cell Biology Research Scientist", blurb: "Design and execute cell-based experiments, maintain cultures, validate reagents, analyze data, and communicate results.", projects: [p("Plan an antibody validation", "Design a simplified control matrix comparing target-positive, target-negative, and process-control samples.", "Plate map, acceptance criteria, and a result-interpretation guide.", 14, 10)], evidence: [source("Thermo Fisher · Scientist I", "https://jobs.thermofisher.com/global/en/job/R-01365624", "Posting includes cell culture, biological samples, antibody validation, titer checks, planning, documentation, and teamwork.", "job_posting"), onet("19-1029.00", "Biological Scientists", "Federal occupation reference.")] }] },
      { id: "physical-sciences", name: "Physical Sciences", decisionLabel: "physical-science focus", blurb: "Matter, energy, forces, fields, space, and measurable physical behavior.", projects: [p("Calibrate a simple measurement", "Measure the same quantity two ways, look for bias and scatter, and explain which method you trust for what purpose.", "Calibration plot and uncertainty statement.", 8, 5)], children: [{ id: "research-physicist", name: "Experimental Research Physicist", jobTitle: "Experimental Research Physicist", blurb: "Build measurements, operate instruments, analyze signals, test models, and document reproducible results.", projects: [p("Design a sensor characterization", "Plan how to measure range, noise, repeatability, drift, and one environmental sensitivity for a small sensor.", "Test matrix, analysis plan, and lab-notebook template.", 14, 10)], evidence: [onet("19-2012.00", "Physicists", "Federal task and occupation reference.")] }] },
      { id: "environmental-scientist", name: "Environmental Field Scientist", jobTitle: "Environmental Field Scientist", blurb: "Collect defensible field data, maintain chain of custody, interpret environmental results, and support reports or compliance work.", projects: [p("Plan a three-point sampling day", "Choose sampling locations, field observations, labels, blanks, custody steps, and conditions that would invalidate a sample.", "Field sheet, sample map, and QA/QC checklist.", 8, 10)], evidence: [onet("19-2041.00", "Environmental Scientists and Specialists", "Federal tasks include investigations, sampling, analysis, reporting, and regulatory work.")] },
      { id: "data-scientist", name: "Data Scientist", jobTitle: "Data Scientist", blurb: "Turn ambiguous questions into datasets, models, experiments, and decisions while checking validity and bias.", projects: [p("Audit a tiny dataset", "Inspect a small table for missingness, leakage, ambiguous labels, skew, and whether the proposed metric matches the question.", "Data-quality memo and baseline-analysis plan.", 8, 10)], evidence: [onet("15-2051.00", "Data Scientists", "Federal task and occupation reference.")] },
    ],
  },
  {
    id: "business", name: "Business", decisionLabel: "business function",
    blurb: "Coordinate people, customers, money, operations, and information to create and sustain value.",
    workLabel: "Prepare a small decision", workDescription: "Define the decision, customer or stakeholder, evidence, economics, risks, and next reversible step.", axes: ["analyze", "advocate"],
    projects: [p("Write a one-page decision memo", "Compare two small options using customer value, cost, risk, evidence quality, and what can be tested cheaply.", "Recommendation, table of evidence, key risk, and next experiment.", 3, 3)],
    children: [
      { id: "finance", name: "Finance", decisionLabel: "finance job", blurb: "Measure performance, plan resources, evaluate investments, and communicate financial implications.", projects: [p("Explain a budget variance", "Compare a tiny plan and actuals table, separate price and volume effects, and identify the question behind the variance.", "Variance bridge and three questions for the operating team.", 8, 5)], children: [{ id: "fp-and-a-analyst", name: "FP&A / Financial Analyst", jobTitle: "Financial Planning & Analysis Analyst", blurb: "Build budgets and forecasts, analyze results, and help business leaders understand financial tradeoffs.", projects: [p("Build a three-month forecast", "Use a simple historical dataset and explicit drivers to forecast revenue and expense under base and downside cases.", "Driver-based forecast, assumptions, and management summary.", 14, 10)], evidence: [source("JPMorgan Chase · Finance & Business Management Analyst", "https://careers.jpmorgan.com/global/en/students/programs/finance-fulltime-analyst", "Program describes analysis, reporting, budgets, forecasts, financial statements, controls, and strategic decisions.", "job_posting_collection"), onet("13-2051.00", "Financial and Investment Analysts", "Federal occupation reference.")] }] },
      { id: "product-marketing-manager", name: "Product Marketing Manager", jobTitle: "Product Marketing Manager", blurb: "Understand markets and customers, shape positioning, coordinate launches, and measure adoption and business results.", projects: [p("Position a simple product", "Interview or synthesize three customer needs, choose a primary audience, and distinguish benefit from feature.", "Positioning statement, evidence table, and launch-learning metric.", 8, 10)], evidence: [source("Microsoft · Product Marketing Manager overview", "https://careers.microsoft.com/v2/global/en/recentgraduate", "Career material describes revenue, scorecard, market share, customer feedback, and cross-functional product work.", "career_posting_reference"), onet("11-2021.00", "Marketing Managers", "Federal occupation reference.")] },
      { id: "supply-chain-analyst", name: "Supply Chain Analyst", jobTitle: "Supply Chain Analyst", blurb: "Analyze demand, inventory, suppliers, capacity, service levels, and operational risk.", projects: [p("Find the inventory bottleneck", "Review a tiny demand, lead-time, and stock table; identify one likely shortage and one costly excess.", "Exception list and a recommendation with service-risk tradeoff.", 8, 10)], evidence: [onet("13-1081.00", "Logisticians", "Federal occupation reference for supply-chain analysis and coordination.")] },
      { id: "product-manager", name: "Product Manager", jobTitle: "Product Manager", blurb: "Define customer problems, prioritize outcomes, align teams, and learn whether a product decision worked.", projects: [p("Prioritize three requests", "Turn feature requests into underlying problems, score evidence and impact, and choose one small test.", "Prioritization memo and success metric.", 8, 10)], evidence: [onet("11-2021.00", "Marketing Managers", "Product management spans several statistical occupations; this is a nearby federal reference.")] },
      { id: "small-business-owner", name: "Small Business Owner", jobTitle: "Small Business Owner / Operator", blurb: "Find customers, deliver the work, manage cash and risk, and improve a repeatable operating system.", projects: [p("Test one customer problem", "Talk with three potential customers about an actual problem before designing a full solution.", "Interview notes, problem statement, and smallest paid-or-observable test.", 8, 10)], evidence: [onet("11-1021.00", "General and Operations Managers", "Owner-operators often combine management, sales, finance, and direct production work.")] },
    ],
  },
];

export const upgrades = [
  { id: "notebook", name: "Working notebook", description: "Capture observations and turn them into a repeatable practice.", cost: 8, rate: 0.2, masteryRequired: 3 },
  { id: "mentor", name: "Mentor cadence", description: "Regular feedback catches blind spots and accelerates learning.", cost: 20, rate: 0.7, masteryRequired: 10 },
  { id: "peer-team", name: "Peer review", description: "Compare approaches and catch errors before they compound.", cost: 45, rate: 1.8, masteryRequired: 22 },
  { id: "workflow", name: "Trusted workflow", description: "Systematize routine work so attention stays on judgment and exceptions.", cost: 90, rate: 4.5, masteryRequired: 40, leafRequired: true },
];

export function findNode(path) {
  let nodes = careerTree;
  let current = null;
  for (const id of path) {
    current = nodes.find((node) => node.id === id) || null;
    if (!current) return null;
    nodes = current.children || [];
  }
  return current;
}

export function nodesForPath(path) {
  const result = [];
  let nodes = careerTree;
  for (const id of path) {
    const node = nodes.find((item) => item.id === id);
    if (!node) break;
    result.push(node);
    nodes = node.children || [];
  }
  return result;
}

export function fieldForPath(path) {
  return path.length ? careerTree.find((node) => node.id === path[0]) || null : null;
}
