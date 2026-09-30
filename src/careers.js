export const AXES = ["analyze", "build", "care", "advocate"];

export const starterActions = [
  {
    id: "analyze",
    label: "Examine the evidence",
    verb: "Analyze",
    reward: "+1 insight",
    messages: [
      "You compare three explanations. One survives contact with the evidence.",
      "A strange result becomes a useful question.",
      "You find the assumption hiding underneath the numbers.",
    ],
  },
  {
    id: "build",
    label: "Make a rough prototype",
    verb: "Build",
    reward: "+1 insight",
    messages: [
      "The first version is clumsy. It also teaches you more than the sketch did.",
      "You trade polish for a fast answer and learn what to improve.",
      "A physical constraint turns an abstract idea into a design problem.",
    ],
  },
  {
    id: "care",
    label: "Listen to someone affected",
    verb: "Care",
    reward: "+1 insight",
    messages: [
      "The person living with the problem notices something the plan missed.",
      "A careful question reveals the difference between helping and assuming.",
      "You learn that the same outcome can feel very different to two people.",
    ],
  },
  {
    id: "advocate",
    label: "Make the case for a change",
    verb: "Advocate",
    reward: "+1 insight",
    messages: [
      "You turn a complicated issue into a reason someone can act on.",
      "A skeptical listener asks the question your argument needed.",
      "You separate what is persuasive from what is merely loud.",
    ],
  },
];

export const fields = {
  engineering: {
    name: "Engineering",
    blurb: "Design systems and artifacts within physical, technical, and human constraints.",
    workLabel: "Test a design decision",
    workDescription: "Measure, model, prototype, and explain a choice under constraints.",
    axes: ["analyze", "build"],
    specialties: [
      { id: "civil", name: "Civil Engineering", blurb: "Infrastructure, structures, water, transportation, and public systems." },
      { id: "mechanical", name: "Mechanical Engineering", blurb: "Machines, energy, motion, heat, manufacturing, and physical products." },
      { id: "electrical", name: "Electrical Engineering", blurb: "Power, electronics, signals, controls, sensing, and communication." },
    ],
    projects: [
      { title: "Cool the Neighborhood", description: "Develop a heat-resilience intervention that balances comfort, cost, energy, and public access.", requirement: 20, impact: 12 },
      { title: "Make the Crossing Safer", description: "Use observations, constraints, and stakeholder needs to redesign a dangerous intersection.", requirement: 65, impact: 28 },
      { title: "Build for the Next Storm", description: "Coordinate a resilient system whose parts must keep working when conditions deteriorate.", requirement: 145, impact: 60 },
    ],
  },
  medicine: {
    name: "Medicine",
    blurb: "Understand health problems and work with people to prevent, diagnose, or treat them.",
    workLabel: "Reason through a patient case",
    workDescription: "Gather a history, weigh evidence, communicate uncertainty, and plan next steps.",
    axes: ["care", "analyze"],
    specialties: [
      { id: "emergency", name: "Emergency Medicine", blurb: "Rapid assessment, stabilization, uncertainty, and team coordination." },
      { id: "family", name: "Family Medicine", blurb: "Broad, continuous care across ages, conditions, and life circumstances." },
      { id: "pediatrics", name: "Pediatrics", blurb: "Health, development, prevention, and illness in infants, children, and adolescents." },
    ],
    projects: [
      { title: "A Difficult First Visit", description: "Build trust, identify urgent concerns, and make a plan from an incomplete history.", requirement: 20, impact: 12 },
      { title: "The Pattern Behind the Symptoms", description: "Connect several small clues while explaining uncertainty to a worried family.", requirement: 65, impact: 28 },
      { title: "Care Beyond the Clinic", description: "Coordinate care around barriers involving transportation, cost, family, and follow-up.", requirement: 145, impact: 60 },
    ],
  },
  law: {
    name: "Law",
    blurb: "Interpret rules, develop arguments, manage evidence, and advocate within institutions.",
    workLabel: "Develop a case strategy",
    workDescription: "Research authority, test an argument, document facts, and advise a client.",
    axes: ["advocate", "analyze"],
    specialties: [
      { id: "public-defense", name: "Public Defense", blurb: "Represent people accused of crimes and protect procedural rights." },
      { id: "environmental", name: "Environmental Law", blurb: "Work where regulation, land, energy, health, and natural systems meet." },
      { id: "business", name: "Business Law", blurb: "Structure agreements, manage risk, and advise organizations and entrepreneurs." },
    ],
    projects: [
      { title: "The Missing Context", description: "Interview a client, organize conflicting facts, and identify the issue that matters legally.", requirement: 20, impact: 12 },
      { title: "Negotiate Before Trial", description: "Balance leverage, risk, time, and the client’s priorities in a proposed agreement.", requirement: 65, impact: 28 },
      { title: "Change the Rule", description: "Build a record and argument capable of changing how an institution treats future cases.", requirement: 145, impact: 60 },
    ],
  },
  trades: {
    name: "Skilled Trades",
    blurb: "Install, fabricate, diagnose, maintain, and repair the systems daily life depends on.",
    workLabel: "Diagnose and make the repair",
    workDescription: "Read the system, choose tools and materials, work safely, and verify the result.",
    axes: ["build", "analyze"],
    specialties: [
      { id: "welding", name: "Welding & Fabrication", blurb: "Join and shape materials across construction, manufacturing, energy, and repair." },
      { id: "plumbing", name: "Plumbing & Pipefitting", blurb: "Install and maintain water, waste, gas, steam, and process-piping systems." },
      { id: "electrical-trade", name: "Electrical Trade", blurb: "Install, test, and repair power, controls, lighting, and low-voltage systems." },
    ],
    projects: [
      { title: "Find the Failure", description: "Trace a system fault, make a safe repair, and prove that the repair holds.", requirement: 20, impact: 12 },
      { title: "Retrofit an Occupied Building", description: "Plan work around existing systems, code requirements, access, and the people still using the space.", requirement: 65, impact: 28 },
      { title: "Commission the New System", description: "Coordinate multiple trades and verify that every part operates safely as a whole.", requirement: 145, impact: 60 },
    ],
  },
};

export const upgrades = [
  { id: "notebook", name: "Working notebook", description: "Capture observations and turn them into a repeatable practice.", cost: 12, rate: 0.25, masteryRequired: 0 },
  { id: "mentor", name: "Mentor cadence", description: "Regular feedback catches blind spots and accelerates learning.", cost: 28, rate: 0.8, masteryRequired: 8 },
  { id: "peer-team", name: "Peer team", description: "Share work, compare approaches, and compound one another’s strengths.", cost: 60, rate: 2.2, masteryRequired: 24 },
  { id: "workflow", name: "Trusted workflow", description: "Automate the routine so attention can stay on judgment and exceptions.", cost: 130, rate: 6, masteryRequired: 55, specialtyRequired: true },
];
