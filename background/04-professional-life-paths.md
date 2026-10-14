# Professional-life routes

The game has a prerequisite-based **training tree**. The TOML additionally describes a **career-life graph**: transitions and reusable routes that can cross tree branches, recur, or coexist.

## Route patterns

The 29 records cover engineering and licensure; software degree and skills transition; physician, subspecialty, thoracic, and congenital preparation; nursing and regulated allied professions; law; apprenticeship; research; work-experience entry; initial and alternative teacher preparation; libraries; generalist and clinical social work; civilian and military-to-civilian aviation; creative portfolios; expert, management, ownership, and educator development; career-break return; international transition; and portfolio careers.

Important constraints:

- A home-health aide can investigate nursing, but RN education and licensure remain necessary.
- An electrician can move toward engineering; field experience does not itself confer engineering qualification or signing authority.
- A general surgeon may pursue an approved thoracic route; congenital practice adds specialty preparation. Multiple approved pathways exist.
- A scientist moving into environmental law needs qualifying legal preparation and admission.
- A teacher assistant moving into school teaching must satisfy educator requirements.
- A clinical social worker has additional qualifications beyond general support work.
- Military skills can transfer to civilian logistics, communications, or aviation, while civilian authorization still applies.
- No automatic credential restoration after a break or migration is assumed.

Each transition records `from_id`, `to_id`, transferable skills, additional requirements, evidence status, and `automatic_unlock = false`. Most edges are reasoned possibilities, not directly observed individual histories. The seven separately labeled biographies provide actual examples without implying typicality.

The browser shows entry routes, later-life options, and outgoing possibilities at job depth. It currently follows one career training path per run; lateral moves, portfolio work, and re-entry are **represented as investigation content**, not implemented as playable multi-career state transitions.
