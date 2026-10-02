const profile = (rate, headline, detail) => ({ rate, headline, detail });

const PROFILES = {
  engineering: profile(
    0.75,
    "AI is quick with equations and precedent designs.",
    "It can search and compare tirelessly; you still have to decide which assumptions deserve trust in the physical world.",
  ),
  "electrical-engineering": profile(0.95, "AI is tracing circuits beside you.", "Simulation and pattern matching are its home turf. Measurement judgment and responsibility for safe hardware remain yours."),
  "digital-design": profile(1.35, "AI has seen a lot of logic.", "It can draft HDL and tests at speed, but it does not own the specification or notice every hidden system assumption."),
  "vlsi-design": profile(1.55, "AI is compressing the design loop.", "It can propose RTL and interpret reports continuously. Architecture, sign-off, and silicon consequences still belong to people."),
  "gpu-rtl-design-engineer": profile(1.7, "AI is generating candidate RTL while you read this.", "Its throughput is formidable; your advantage is knowing which microarchitectural tradeoff is actually worth making."),
  "asic-digital-design-engineer": profile(1.65, "AI is tireless at first drafts and lint cleanup.", "It moves fast through familiar patterns. You remain accountable for interfaces, power states, integration, and tape-out risk."),
  "design-verification": profile(1.5, "AI produces tests faster than humans type them.", "The hard part is deciding what must always be true and whether the environment assumptions quietly prove the wrong design."),
  "gpu-formal-verification-engineer": profile(1.35, "AI can suggest properties; proof intent is harder.", "It accelerates assertion drafting and trace reading, but abstraction and meaningful completeness still reward expert judgment."),
  "fpga-design": profile(1.15, "AI is strong before the board powers on.", "Constraints and HDL are easy to generate. Bring-up still meets clocks, pins, probes, cables, and the stubborn physical board."),
  "power-systems": profile(0.65, "AI can calculate a network faster than you.", "Protection consequences, field conditions, public safety, and authority to energize equipment keep the human firmly in the loop."),
  "protection-engineer": profile(0.55, "AI can compare fault records without blinking.", "It cannot accept responsibility for a trip setting that disconnects real customers or fails during a real fault."),
  "power-electronics-engineer": profile(0.9, "AI is sweeping converter options rapidly.", "Thermal behavior, switching noise, lab safety, and hardware failure still slow it at the boundary between model and bench."),
  "civil-engineering": profile(0.45, "AI has the plan set; you have the site.", "It can check patterns and quantities, but it cannot walk the drainage path or carry public-safety responsibility."),
  "transportation-engineering": profile(0.7, "AI sees patterns in traffic data quickly.", "People crossing a real street are not rows in a table. Context, observation, and accountable design remain human work."),
  "graduate-traffic-engineer": profile(0.65, "AI can screen counts and crashes all night.", "It still needs a person to understand the street, defend assumptions, and notice what the dataset never captured."),
  "structural-engineering": profile(0.55, "AI is fast at load combinations, not accountability.", "It can assist calculations and drafting. A qualified engineer still judges the load path and accepts responsibility for safety."),
  "mechanical-engineering": profile(0.6, "AI is fluent in textbook mechanisms.", "Real friction, wear, tolerance, heat, noise, and manufacturing variation keep giving humans something new to learn."),
  "hvac-design-engineer": profile(0.65, "AI can estimate loads without taking a lunch break.", "Occupants, controls, construction, balancing, and the actual building keep the work grounded in human observation."),
  "mechanical-design-engineer": profile(0.75, "AI generates shapes faster than you can sketch.", "A useful part still has to assemble, survive, be manufactured, and solve the customer's actual problem."),

  medicine: profile(0.35, "AI has read more medical text than any student could.", "It can rehearse patterns endlessly, but it has no patient, license, bedside presence, or authority to provide care."),
  "primary-care": profile(0.3, "AI can summarize the chart before the visit.", "Continuity, trust, examination, shared decisions, and responsibility for follow-up remain human clinical work."),
  "family-medicine-physician": profile(0.25, "AI is useful in the inbox, not a substitute for the physician.", "It can draft and organize; broad context across ages, relationships, examination, and accountable care slow its race."),
  "emergency-medicine-physician": profile(0.18, "AI can rank possibilities; it cannot run the resuscitation.", "The emergency department demands physical examination, procedures, team leadership, reassessment, and licensed decisions under pressure."),
  "general-pediatrician": profile(0.16, "AI knows patterns; children do not arrive as clean prompts.", "Age, development, family communication, examination, safeguarding, and rapidly changing illness favor the present clinician."),
  surgery: profile(
    0,
    "AI mastery is paused: it is not allowed to operate on people by itself.",
    "Current surgical systems remain under direct human control. AI can assist planning and analysis, but it cannot complete this supervised physical practice.",
  ),
  "general-surgeon": profile(0, "AI cannot take the scalpel from you.", "It can retrieve evidence and assist planning, but consent, touch, operative judgment, complication management, and accountability remain with the surgical team."),

  law: profile(1.75, "AI has already read a daunting amount of legal language.", "It drafts and reviews quickly, but a lawyer must verify the work, protect confidentiality, exercise judgment, and remain accountable."),
  "criminal-law": profile(0.8, "AI can sort the record; it cannot represent the client.", "Liberty, credibility, strategy, confidential counseling, negotiation, and advocacy keep the licensed human central."),
  "public-defender": profile(0.45, "AI never carries a caseload—but it cannot stand beside the accused.", "It can organize evidence. Trust, client authority, courtroom advocacy, and responsibility for a person's liberty are not automatable counters."),
  "corporate-associate": profile(
    4.2,
    "AI is already faster than you at basic contract templates.",
    "It is tireless and does not require benefits. It also has no law license: a human lawyer still owns accuracy, confidentiality, negotiation, and judgment.",
  ),
  "environmental-attorney": profile(1.25, "AI is fast at the first pass through rules and permits.", "Facts, jurisdiction, technical evidence, agency practice, advocacy, and professional responsibility keep it from closing the matter alone."),

  trades: profile(0.08, "AI can write the plan; it cannot pick up the tools.", "Hazard control, dexterity, access, material feel, inspection, and safe physical execution put you well ahead on the jobsite."),
  "commercial-electrician": profile(0, "AI mastery is paused at the panel door.", "It can explain a drawing, but it cannot verify absence of voltage, bend raceway, terminate conductors, or take responsibility for energization."),
  "structural-welder": profile(0, "AI cannot strike this arc.", "Fit-up, heat, puddle control, position, distortion, inspection, and physical safety keep mastery in human hands."),
  "service-plumber": profile(0, "AI cannot crawl under this sink.", "It can suggest causes, but diagnosis still depends on access, sound, feel, safe disassembly, repair, and a real post-work test."),

  science: profile(1.15, "AI digests papers faster than any lab group.", "It can propose and analyze; experimental validity still depends on real samples, controls, provenance, and skeptical human interpretation."),
  "life-sciences": profile(0.85, "AI is quick with pathways, slower at the bench.", "Living samples, contamination, technique, controls, and biological variation resist purely textual mastery."),
  "cell-biology-scientist": profile(0.7, "AI can analyze images all night.", "It cannot maintain the culture, notice every bench anomaly, or decide that a beautiful result is probably an artifact."),
  "physical-sciences": profile(1.1, "AI is racing through models and residuals.", "Calibration, alignment, noise hunting, apparatus behavior, and the meaning of a discrepancy still demand experimental judgment."),
  "research-physicist": profile(0.95, "AI never tires of parameter sweeps.", "The instrument still drifts in the real room, and someone must decide whether the anomaly is discovery, bias, or a loose cable."),
  "environmental-scientist": profile(0.35, "AI can map the samples; it cannot collect them.", "Weather, access, custody, contamination control, field notes, and defensible observation slow the digital rival."),
  "data-scientist": profile(3.4, "AI is at home in this dataset.", "It can write analysis and models continuously. Your advantage is framing the right decision, detecting invalid evidence, and owning downstream consequences."),

  business: profile(1.5, "AI is generating memos while you are still framing the problem.", "It works continuously, but customers, incentives, politics, trust, and responsibility are not contained in its spreadsheet."),
  finance: profile(2.2, "AI is already rebuilding the model.", "It is relentless with tables and scenarios. Accounting judgment, business context, controls, and accountable recommendations remain human."),
  "fp-and-a-analyst": profile(2.6, "AI can refresh the forecast before the meeting starts.", "It still needs someone to challenge drivers, surface politics, explain the decision, and earn leadership's trust."),
  "product-marketing-manager": profile(2.15, "AI can generate ten positioning drafts before breakfast.", "It cannot interview a customer with genuine curiosity or decide which market truth the company is willing to stand behind."),
  "supply-chain-analyst": profile(2.0, "AI is tireless at exception scanning.", "Suppliers, plants, customers, contracts, and disruptions still require negotiation and accountable tradeoffs."),
  "product-manager": profile(1.8, "AI produces roadmaps cheaply; conviction remains expensive.", "It can synthesize requests and draft specs. Choosing the problem, aligning people, and living with the outcome are still yours."),
  "small-business-owner": profile(0.65, "AI can be your tireless back office.", "It cannot earn local trust, open the shop, deliver the service, make payroll, or face the customer when something goes wrong."),
};

const WAITING = profile(
  0,
  "The rival is waiting for you to choose a field.",
  "Its pace will change with the work. Text and data favor it; physical presence, licensure, trust, and accountability favor you.",
);

export function rivalProfileForPath(nodes, activity = null) {
  if (!nodes.length) return WAITING;
  const selected = [...nodes].reverse().find((node) => PROFILES[node.id]) || nodes[0];
  const base = PROFILES[selected.id] || profile(0.5, "AI is learning beside you.", "Its speed depends on how much of this work can be represented as patterns, text, or data.");
  const activityBoost = activity && base.rate > 0 ? 1 + (activity.index * 0.08) : 1;
  return {
    ...base,
    rate: Number((base.rate * activityBoost).toFixed(2)),
  };
}
