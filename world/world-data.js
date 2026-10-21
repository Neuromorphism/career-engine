// Generated from data/world.toml. Run npm run compile; do not edit.
// Source SHA-256: 340d458b1dc388cf0ad1e25bdd571d0dd4edf0aba0c6ab736dbb3ceb2cce8313
export const worldData = {
  "scenario": {
    "id": "founders-settlement",
    "name": "Founders’ World",
    "baseline_population": 500,
    "baseline_coverage": 0.15,
    "facility_capacity": 0.65,
    "reliability": 0.85,
    "competence_mastery": 10000,
    "experience_bonus_per_milestone": 0.015,
    "experience_bonus_cap": 0.15
  },
  "capabilities": {
    "clinical": {
      "label": "Clinical practice"
    },
    "nursing": {
      "label": "Nursing"
    },
    "design": {
      "label": "Engineering design"
    },
    "construction": {
      "label": "Construction"
    },
    "maintenance": {
      "label": "Maintenance"
    },
    "teaching": {
      "label": "Teaching"
    },
    "research": {
      "label": "Research"
    },
    "logistics": {
      "label": "Logistics"
    },
    "food": {
      "label": "Food production"
    },
    "care": {
      "label": "Care and support"
    },
    "governance": {
      "label": "Coordination and governance"
    },
    "culture": {
      "label": "Culture and communication"
    },
    "electrical": {
      "label": "Electrical systems"
    },
    "water": {
      "label": "Water systems"
    }
  },
  "services": [
    {
      "id": "health",
      "name": "Health",
      "description": "Care access and a coordinated clinical workforce.",
      "requirements": {
        "clinical": 0.35,
        "nursing": 0.2,
        "care": 0.15
      }
    },
    {
      "id": "learning",
      "name": "Learning",
      "description": "Teaching, investigation, and sustained learning opportunities.",
      "requirements": {
        "teaching": 0.45,
        "research": 0.15
      }
    },
    {
      "id": "infrastructure",
      "name": "Infrastructure",
      "description": "Design, construction, maintenance, and reliable utility systems.",
      "requirements": {
        "design": 0.2,
        "construction": 0.2,
        "maintenance": 0.15,
        "electrical": 0.1,
        "water": 0.1
      }
    },
    {
      "id": "livelihoods",
      "name": "Livelihoods",
      "description": "Food, logistics, and dependable organizational work.",
      "requirements": {
        "food": 0.2,
        "logistics": 0.25,
        "governance": 0.2
      }
    },
    {
      "id": "resilience",
      "name": "Resilience",
      "description": "Preparedness, repairs, emergency care, and coordinated response.",
      "requirements": {
        "clinical": 0.1,
        "maintenance": 0.2,
        "logistics": 0.2,
        "governance": 0.15
      }
    },
    {
      "id": "community",
      "name": "Community well-being",
      "description": "Everyday care, culture, communication, and trustworthy institutions.",
      "requirements": {
        "care": 0.3,
        "culture": 0.3,
        "governance": 0.15
      }
    }
  ],
  "role_profiles": {
    "gpu-rtl-design-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "asic-digital-design-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "gpu-formal-verification-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "fpga-design": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "physical-design-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "dft-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "protection-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "electrical": 0.6,
        "design": 0.4
      }
    },
    "power-electronics-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "electrical": 0.6,
        "design": 0.4
      }
    },
    "embedded-systems-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "control-systems-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "rf-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "graduate-traffic-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "rail-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "bridge-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "structural-engineering": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "water-resources-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "water": 0.6,
        "design": 0.3,
        "research": 0.1
      }
    },
    "water-treatment-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "water": 0.6,
        "design": 0.3,
        "research": 0.1
      }
    },
    "geotechnical-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "hvac-design-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "mechanical-design-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "robotics-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "manufacturing-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "thermal-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "software-developer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "security-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "sre-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "process-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "bioprocess-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "aircraft-systems-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "space-systems-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "medical-device-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "prosthetics-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "industrial-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.65,
        "research": 0.2,
        "maintenance": 0.15
      }
    },
    "family-medicine-physician": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "geriatrician": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "emergency-medicine-physician": {
      "service_id": "resilience",
      "capabilities": {
        "clinical": 0.35,
        "maintenance": 0.3,
        "logistics": 0.35
      }
    },
    "general-pediatrician": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "general-surgeon": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "cardiac-surgeon": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "congenital-heart-surgeon": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "thoracic-surgeon": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "neurosurgeon": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "orthopedic-surgeon": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "transplant-surgeon": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "vascular-surgeon": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "cardiologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "oncologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "neurologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "nephrologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "pulmonologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "endocrinologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "infectious-disease-physician": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "interventional-cardiologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "electrophysiologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "radiologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "pathologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "anesthesiologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "psychiatrist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "rehabilitation-physician": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.55,
        "care": 0.45
      }
    },
    "registered-nurse": {
      "service_id": "health",
      "capabilities": {
        "nursing": 0.8,
        "care": 0.2
      }
    },
    "physical-therapist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.55,
        "care": 0.45
      }
    },
    "clinical-pharmacist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "dentist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 0.8,
        "care": 0.2
      }
    },
    "public-defender": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "prosecutor": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "appellate-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "corporate-associate": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "environmental-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "civil-rights-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "legal-aid-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "immigration-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "patent-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "privacy-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "labor-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "tax-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "family-law-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "estate-attorney": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.8,
        "care": 0.2
      }
    },
    "commercial-electrician": {
      "service_id": "infrastructure",
      "capabilities": {
        "electrical": 0.6,
        "construction": 0.2,
        "maintenance": 0.2
      }
    },
    "structural-welder": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.85,
        "maintenance": 0.15
      }
    },
    "service-plumber": {
      "service_id": "infrastructure",
      "capabilities": {
        "water": 0.5,
        "maintenance": 0.3,
        "construction": 0.2
      }
    },
    "lineworker": {
      "service_id": "infrastructure",
      "capabilities": {
        "electrical": 0.6,
        "construction": 0.2,
        "maintenance": 0.2
      }
    },
    "industrial-electrician": {
      "service_id": "infrastructure",
      "capabilities": {
        "electrical": 0.6,
        "construction": 0.2,
        "maintenance": 0.2
      }
    },
    "solar-installer": {
      "service_id": "infrastructure",
      "capabilities": {
        "electrical": 0.6,
        "construction": 0.2,
        "maintenance": 0.2
      }
    },
    "hvac-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 0.85,
        "construction": 0.15
      }
    },
    "pipefitter": {
      "service_id": "infrastructure",
      "capabilities": {
        "water": 0.5,
        "maintenance": 0.3,
        "construction": 0.2
      }
    },
    "refrigeration-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 0.85,
        "construction": 0.15
      }
    },
    "carpenter": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.85,
        "maintenance": 0.15
      }
    },
    "mason": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.85,
        "maintenance": 0.15
      }
    },
    "elevator-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 0.85,
        "construction": 0.15
      }
    },
    "cnc-machinist": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.45,
        "maintenance": 0.55
      }
    },
    "industrial-mechanic": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 0.85,
        "construction": 0.15
      }
    },
    "automotive-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 0.85,
        "construction": 0.15
      }
    },
    "cell-biology-scientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "immunologist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "geneticist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "neuroscientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "clinical-trial-scientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "research-physicist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "photonics-scientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "quantum-scientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "astrophysicist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "environmental-scientist": {
      "service_id": "resilience",
      "capabilities": {
        "research": 0.5,
        "maintenance": 0.3,
        "governance": 0.2
      }
    },
    "data-scientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "analytical-chemist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "materials-scientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "medicinal-chemist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "climate-scientist": {
      "service_id": "resilience",
      "capabilities": {
        "research": 0.5,
        "maintenance": 0.3,
        "governance": 0.2
      }
    },
    "geologist": {
      "service_id": "resilience",
      "capabilities": {
        "research": 0.5,
        "maintenance": 0.3,
        "governance": 0.2
      }
    },
    "hydrologist": {
      "service_id": "infrastructure",
      "capabilities": {
        "water": 0.6,
        "design": 0.3,
        "research": 0.1
      }
    },
    "ecologist": {
      "service_id": "resilience",
      "capabilities": {
        "research": 0.5,
        "maintenance": 0.3,
        "governance": 0.2
      }
    },
    "biostatistician": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "operations-research-scientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.75,
        "teaching": 0.25
      }
    },
    "fp-and-a-analyst": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "investment-analyst": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "risk-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "actuary": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "product-marketing-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "supply-chain-analyst": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.75,
        "governance": 0.25
      }
    },
    "product-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "small-business-owner": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "accountant": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "auditor": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "operations-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.75,
        "governance": 0.25
      }
    },
    "human-resources-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "organizational-development-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "social-enterprise-founder": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "healthcare-administrator": {
      "service_id": "health",
      "capabilities": {
        "governance": 0.7,
        "care": 0.3
      }
    },
    "construction-manager": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.5,
        "governance": 0.5
      }
    },
    "elementary-teacher": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 0.85,
        "research": 0.15
      }
    },
    "special-education-teacher": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 0.85,
        "research": 0.15
      }
    },
    "secondary-teacher": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 0.85,
        "research": 0.15
      }
    },
    "teacher-assistant": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 0.85,
        "research": 0.15
      }
    },
    "vocational-instructor": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 0.85,
        "research": 0.15
      }
    },
    "adult-educator": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 0.85,
        "research": 0.15
      }
    },
    "university-lecturer": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 0.85,
        "research": 0.15
      }
    },
    "librarian": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 0.85,
        "research": 0.15
      }
    },
    "graphic-designer": {
      "service_id": "community",
      "capabilities": {
        "culture": 0.85,
        "research": 0.15
      }
    },
    "ux-designer": {
      "service_id": "community",
      "capabilities": {
        "culture": 0.85,
        "research": 0.15
      }
    },
    "journalist": {
      "service_id": "community",
      "capabilities": {
        "culture": 0.85,
        "research": 0.15
      }
    },
    "technical-writer": {
      "service_id": "community",
      "capabilities": {
        "culture": 0.85,
        "research": 0.15
      }
    },
    "film-director": {
      "service_id": "community",
      "capabilities": {
        "culture": 0.85,
        "research": 0.15
      }
    },
    "musician": {
      "service_id": "community",
      "capabilities": {
        "culture": 0.85,
        "research": 0.15
      }
    },
    "game-designer": {
      "service_id": "community",
      "capabilities": {
        "culture": 0.85,
        "research": 0.15
      }
    },
    "museum-conservator": {
      "service_id": "community",
      "capabilities": {
        "culture": 0.85,
        "research": 0.15
      }
    },
    "social-worker": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "governance": 0.2
      }
    },
    "clinical-social-worker": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "governance": 0.2
      }
    },
    "community-health-worker": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "governance": 0.2
      }
    },
    "career-counselor": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "governance": 0.2
      }
    },
    "firefighter": {
      "service_id": "resilience",
      "capabilities": {
        "clinical": 0.35,
        "maintenance": 0.3,
        "logistics": 0.35
      }
    },
    "paramedic": {
      "service_id": "resilience",
      "capabilities": {
        "clinical": 0.35,
        "maintenance": 0.3,
        "logistics": 0.35
      }
    },
    "emergency-manager": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "public-safety-officer": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "farmer": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.85,
        "research": 0.15
      }
    },
    "forester": {
      "service_id": "resilience",
      "capabilities": {
        "research": 0.5,
        "maintenance": 0.3,
        "governance": 0.2
      }
    },
    "agronomist": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.85,
        "research": 0.15
      }
    },
    "veterinarian": {
      "service_id": "livelihoods",
      "capabilities": {
        "clinical": 0.5,
        "food": 0.5
      }
    },
    "chef": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.85,
        "governance": 0.15
      }
    },
    "baker": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.85,
        "governance": 0.15
      }
    },
    "hotel-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.7,
        "governance": 0.3
      }
    },
    "event-planner": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.7,
        "governance": 0.3
      }
    },
    "barber": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "culture": 0.2
      }
    },
    "childcare-worker": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "governance": 0.2
      }
    },
    "fitness-trainer": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "culture": 0.2
      }
    },
    "funeral-director": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "culture": 0.2
      }
    },
    "sales-representative": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "real-estate-agent": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "customer-service-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "administrative-coordinator": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "bookkeeper": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "medical-records-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "airline-pilot": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.85,
        "maintenance": 0.15
      }
    },
    "air-traffic-controller": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.85,
        "maintenance": 0.15
      }
    },
    "ship-captain": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.85,
        "maintenance": 0.15
      }
    },
    "truck-driver": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.85,
        "maintenance": 0.15
      }
    },
    "transit-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.85,
        "maintenance": 0.15
      }
    },
    "warehouse-technician": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.75,
        "governance": 0.25
      }
    },
    "military-logistics-specialist": {
      "service_id": "resilience",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "military-communications-specialist": {
      "service_id": "resilience",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "home-health-aide": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "governance": 0.2
      }
    },
    "custodian": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 0.85,
        "construction": 0.15
      }
    },
    "groundskeeper": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 0.85,
        "construction": 0.15
      }
    },
    "agricultural-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.85,
        "research": 0.15
      }
    },
    "chief-executive": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "legislator": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "advertising-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "sales-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "public-relations-fundraising-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "administrative-services-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "facilities-manager": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "it-manager": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "finance-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "training-development-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "production-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "purchasing-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "logistics-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "education-childcare-administrator": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 1
      }
    },
    "engineering-manager": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "restaurant-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "entertainment-recreation-manager": {
      "service_id": "community",
      "capabilities": {
        "care": 0.5,
        "teaching": 0.5
      }
    },
    "science-program-manager": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "postmaster": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "property-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "community-service-manager": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "personal-services-manager": {
      "service_id": "community",
      "capabilities": {
        "care": 1
      }
    },
    "general-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "talent-agent": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "retail-wholesale-buyer": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "purchasing-agent": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "claims-adjuster": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "compliance-officer": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "cost-estimator": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "hr-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "compensation-benefits-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "project-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "management-consultant": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "fundraiser": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "market-research-analyst": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "business-operations-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "property-appraiser": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "budget-analyst": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "credit-analyst": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "financial-advisor": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "insurance-underwriter": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "financial-examiner": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "loan-officer-credit-counselor": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "tax-examiner-revenue-agent": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "tax-preparer": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "financial-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "computer-research-scientist": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "systems-analyst": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "computer-programmer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "software-qa-tester": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "web-developer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "it-support-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "database-administrator-architect": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "systems-administrator": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "network-architect": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "it-specialist": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "mathematical-science-specialist": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "architect": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "landscape-architect": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "surveyor-cartographer": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "aerospace-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "biomedical-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "civil-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "computer-hardware-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "electrical-electronics-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "environmental-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "materials-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "mechanical-engineer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "engineering-specialist": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "architectural-civil-drafter": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "technical-drafter": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "electronics-engineering-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "engineering-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 1
      }
    },
    "survey-mapping-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "agricultural-food-scientist": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.8,
        "maintenance": 0.2
      }
    },
    "biological-scientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "physical-scientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "economist": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "clinical-psychologist": {
      "service_id": "health",
      "capabilities": {
        "care": 1
      }
    },
    "school-psychologist": {
      "service_id": "learning",
      "capabilities": {
        "care": 0.6,
        "teaching": 0.4
      }
    },
    "psychologist": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.6,
        "care": 0.4
      }
    },
    "urban-planner": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "social-scientist": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "agricultural-food-science-technician": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.8,
        "maintenance": 0.2
      }
    },
    "biological-technician": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "chemical-technician": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "science-technician": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "occupational-safety-specialist": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "addiction-counselor": {
      "service_id": "health",
      "capabilities": {
        "care": 1
      }
    },
    "marriage-family-therapist": {
      "service_id": "health",
      "capabilities": {
        "care": 1
      }
    },
    "mental-health-counselor": {
      "service_id": "health",
      "capabilities": {
        "care": 1
      }
    },
    "counselor": {
      "service_id": "health",
      "capabilities": {
        "care": 1
      }
    },
    "child-family-social-worker": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "healthcare-social-worker": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "probation-officer": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "social-human-service-assistant": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "community-service-specialist": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "clergy-member": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "religious-education-director": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "religious-worker": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "lawyer": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "judge-magistrate": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "paralegal": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "title-examiner": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "legal-support-specialist": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "preschool-kindergarten-teacher": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 1
      }
    },
    "middle-school-teacher": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 1
      }
    },
    "tutor": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 1
      }
    },
    "instructor": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 1
      }
    },
    "museum-archive-specialist": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "library-technician": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 1
      }
    },
    "education-support-specialist": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 1
      }
    },
    "visual-artist": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "industrial-designer": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "fashion-designer": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "florist": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "interior-designer": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "visual-merchandiser": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "design-specialist": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "actor": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "professional-athlete": {
      "service_id": "community",
      "capabilities": {
        "care": 0.5,
        "teaching": 0.5
      }
    },
    "sports-coach": {
      "service_id": "community",
      "capabilities": {
        "care": 0.5,
        "teaching": 0.5
      }
    },
    "sports-official": {
      "service_id": "community",
      "capabilities": {
        "care": 0.5,
        "teaching": 0.5
      }
    },
    "dancer-choreographer": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "composer-music-director": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "dj": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "entertainer": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "radio-announcer": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "public-relations-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "editor": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "writer-author": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "interpreter-translator": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "court-reporter-captioner": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "communications-specialist": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "sound-lighting-broadcast-technician": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "photographer": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "camera-operator-video-editor": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "chiropractor": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "dietitian-nutritionist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "optometrist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "physician-assistant": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "audiologist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "occupational-therapist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "respiratory-therapist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "speech-language-pathologist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "therapy-specialist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "nurse-anesthetist": {
      "service_id": "health",
      "capabilities": {
        "nursing": 0.8,
        "care": 0.2
      }
    },
    "nurse-practitioner": {
      "service_id": "health",
      "capabilities": {
        "nursing": 0.8,
        "care": 0.2
      }
    },
    "acupuncturist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "health-practitioner": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "clinical-laboratory-technician": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "dental-hygienist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "cardiovascular-technician": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "medical-sonographer": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "radiologic-technologist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "mri-technologist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "nuclear-medicine-technologist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "emt": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "pharmacy-technician": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "psychiatric-technician": {
      "service_id": "health",
      "capabilities": {
        "care": 1
      }
    },
    "surgical-technologist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "veterinary-technician": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "ophthalmic-technician": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "licensed-practical-vocational-nurse": {
      "service_id": "health",
      "capabilities": {
        "nursing": 0.8,
        "care": 0.2
      }
    },
    "optician": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "health-technologist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "healthcare-technical-specialist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "personal-care-aide": {
      "service_id": "community",
      "capabilities": {
        "care": 1
      }
    },
    "nursing-assistant": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "hospital-orderly": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "occupational-therapy-assistant": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "physical-therapist-assistant": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "massage-therapist": {
      "service_id": "community",
      "capabilities": {
        "care": 1
      }
    },
    "dental-assistant": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "medical-assistant": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "medical-transcriptionist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "pharmacy-aide": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "veterinary-assistant": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "phlebotomist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "healthcare-support-worker": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "corrections-supervisor": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "police-supervisor": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "fire-service-supervisor": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "security-supervisor": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "fire-inspector": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "bailiff": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "correctional-officer": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "detective-criminal-investigator": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "private-investigator": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "security-guard": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "crossing-guard-flagger": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "transportation-security-screener": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "school-bus-monitor": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "protective-service-worker": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "food-service-supervisor": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "cook": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "food-preparation-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "bartender": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "fast-food-counter-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "server-waiter": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "cafeteria-institutional-food-server": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "dining-room-attendant": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "dishwasher": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "restaurant-host": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "cleaning-supervisor": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "groundskeeping-supervisor": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "housekeeper": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "pest-control-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "arborist-tree-trimmer": {
      "service_id": "resilience",
      "capabilities": {
        "maintenance": 0.7,
        "research": 0.3
      }
    },
    "grounds-maintenance-worker": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "personal-services-supervisor": {
      "service_id": "community",
      "capabilities": {
        "care": 1
      }
    },
    "animal-trainer": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "animal-caretaker": {
      "service_id": "community",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "gaming-casino-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "usher-ticket-taker": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "entertainment-attendant": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "hairstylist-cosmetologist": {
      "service_id": "community",
      "capabilities": {
        "care": 1
      }
    },
    "nail-technician": {
      "service_id": "community",
      "capabilities": {
        "care": 1
      }
    },
    "esthetician-skincare-specialist": {
      "service_id": "community",
      "capabilities": {
        "care": 1
      }
    },
    "beauty-services-specialist": {
      "service_id": "community",
      "capabilities": {
        "care": 1
      }
    },
    "concierge-baggage-porter": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "tour-guide": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "recreation-worker": {
      "service_id": "community",
      "capabilities": {
        "care": 0.5,
        "teaching": 0.5
      }
    },
    "residential-advisor": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    },
    "personal-services-worker": {
      "service_id": "community",
      "capabilities": {
        "care": 1
      }
    },
    "retail-supervisor": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "sales-team-supervisor": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "cashier": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "rental-counter-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "parts-salesperson": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "retail-sales-associate": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "advertising-sales-agent": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "insurance-agent": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "financial-services-sales-agent": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "travel-agent": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "service-sales-representative": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "product-promoter-model": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "sales-engineer": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "telemarketer": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "direct-seller-street-vendor": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "sales-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.5,
        "governance": 0.5
      }
    },
    "office-supervisor": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "telephone-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "debt-collector": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "billing-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "casino-cage-cashier": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "payroll-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "procurement-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "bank-teller": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "financial-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "court-license-clerk": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "credit-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "benefits-eligibility-interviewer": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "file-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "hotel-front-desk-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "survey-interviewer": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "library-assistant": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 1
      }
    },
    "loan-processing-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "order-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "hr-assistant": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "receptionist": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "reservation-ticket-agent": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "information-records-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "freight-agent": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "courier": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "emergency-dispatcher": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.5,
        "care": 0.5
      }
    },
    "dispatcher": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "utility-meter-reader": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "postal-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "mail-carrier": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "mail-sorter": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "production-planning-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "shipping-inventory-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "weighing-sampling-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "executive-assistant": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "legal-secretary": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "medical-secretary": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "data-entry-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "typist-word-processor": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "insurance-processing-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "governance": 1
      }
    },
    "mailroom-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "office-clerk": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "office-machine-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "proofreader": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "statistical-assistant": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "administrative-support-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 0.6,
        "governance": 0.4
      }
    },
    "agricultural-forestry-supervisor": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.8,
        "maintenance": 0.2
      }
    },
    "agricultural-grader-sorter": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.8,
        "maintenance": 0.2
      }
    },
    "fishing-hunting-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.8,
        "maintenance": 0.2
      }
    },
    "forest-conservation-worker": {
      "service_id": "resilience",
      "capabilities": {
        "maintenance": 0.7,
        "research": 0.3
      }
    },
    "logger": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.8,
        "maintenance": 0.2
      }
    },
    "construction-supervisor": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "floor-tile-installer": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "concrete-finisher": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "construction-laborer": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "construction-equipment-operator": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "drywall-installer-taper": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "glazier": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "insulation-installer": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "painter-paperhanger": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "pipelayer": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "plasterer-stucco-mason": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "roofer": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "sheet-metal-worker": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "ironworker": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "construction-trades-helper": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "building-inspector": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "fence-installer": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "hazardous-materials-removal-worker": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "highway-maintenance-worker": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "construction-specialist": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "oil-gas-drilling-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "earth-driller": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "underground-mining-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "extraction-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "maintenance-supervisor": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "office-equipment-repair-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "telecommunications-technician": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "electric-motor-power-tool-repairer": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "audiovisual-installer": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "alarm-systems-installer": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "aircraft-mechanic": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "auto-body-repairer": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "auto-glass-technician": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "diesel-mechanic": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "heavy-equipment-mechanic": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "small-engine-mechanic": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "vehicle-equipment-technician": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "control-valve-technician": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "appliance-repair-technician": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "maintenance-worker": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "machinery-maintenance-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "millwright": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "telecommunications-lineworker": {
      "service_id": "infrastructure",
      "capabilities": {
        "design": 0.6,
        "maintenance": 0.4
      }
    },
    "precision-equipment-repairer": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "vending-amusement-machine-technician": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "locksmith": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "repair-installation-specialist": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "production-supervisor": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "electronics-assembler": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "metal-fabricator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "assembler": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "butcher-meat-processor": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "logistics": 0.5
      }
    },
    "food-batchmaker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "food-processing-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "press-cutting-machine-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "grinding-polishing-machine-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "machinist": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "foundry-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "molding-machine-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "tool-die-maker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "metal-plastics-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "printing-press-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "laundry-dry-cleaning-worker": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "garment-presser": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "sewing-machine-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "tailor-dressmaker": {
      "service_id": "community",
      "capabilities": {
        "care": 1
      }
    },
    "textile-machine-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "upholsterer": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "cabinetmaker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "furniture-finisher": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "woodworker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "power-plant-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "stationary-engineer-boiler-operator": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "water-treatment-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "plant-system-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "chemical-process-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "mixing-grinding-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "industrial-cutting-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "forming-extrusion-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "quality-inspector": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "jeweler": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "medical-dental-appliance-technician": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "packaging-machine-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "industrial-painter": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "photographic-processing-technician": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "molder-caster": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "production-helper": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "production-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "transport-warehouse-supervisor": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "flight-attendant": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "ambulance-driver": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "school-bus-driver": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "shuttle-driver-chauffeur": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "taxi-rideshare-driver": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "vehicle-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "locomotive-engineer": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "railroad-conductor-yardmaster": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "rail-transport-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "sailor-marine-oiler": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "parking-attendant": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "transport-service-attendant": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "transportation-inspector": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "passenger-attendant": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "transport-operations-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "crane-operator": {
      "service_id": "infrastructure",
      "capabilities": {
        "construction": 0.7,
        "maintenance": 0.3
      }
    },
    "hoist-dredge-conveyor-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "forklift-operator": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "vehicle-cleaner": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "material-handler": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "machine-feeder": {
      "service_id": "livelihoods",
      "capabilities": {
        "maintenance": 0.7,
        "construction": 0.3
      }
    },
    "packer": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "stocker-order-picker": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "waste-recycling-collector": {
      "service_id": "infrastructure",
      "capabilities": {
        "maintenance": 1
      }
    },
    "material-moving-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "logistics": 1
      }
    },
    "counseling-psychologist": {
      "service_id": "health",
      "capabilities": {
        "care": 1
      }
    },
    "industrial-organizational-psychologist": {
      "service_id": "livelihoods",
      "capabilities": {
        "research": 0.5,
        "governance": 0.5
      }
    },
    "research-psychologist": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "clinical-neuropsychologist": {
      "service_id": "health",
      "capabilities": {
        "care": 0.6,
        "research": 0.4
      }
    },
    "rancher": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.8,
        "maintenance": 0.2
      }
    },
    "horticulturist": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.5,
        "research": 0.5
      }
    },
    "greenhouse-grower": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.8,
        "maintenance": 0.2
      }
    },
    "plant-nursery-manager": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.8,
        "maintenance": 0.2
      }
    },
    "livestock-farm-worker": {
      "service_id": "livelihoods",
      "capabilities": {
        "food": 0.8,
        "maintenance": 0.2
      }
    },
    "public-policy-analyst": {
      "service_id": "community",
      "capabilities": {
        "governance": 0.7,
        "research": 0.3
      }
    },
    "public-administration-manager": {
      "service_id": "community",
      "capabilities": {
        "governance": 1
      }
    },
    "mental-health-nurse": {
      "service_id": "health",
      "capabilities": {
        "nursing": 0.8,
        "care": 0.2
      }
    },
    "school-counselor": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 1
      }
    },
    "infantry-service-member": {
      "service_id": "resilience",
      "capabilities": {
        "governance": 0.6,
        "logistics": 0.4
      }
    },
    "ob-gyn-physician": {
      "service_id": "health",
      "capabilities": {
        "clinical": 1
      }
    },
    "ophthalmologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 1
      }
    },
    "dermatologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 1
      }
    },
    "urologist": {
      "service_id": "health",
      "capabilities": {
        "clinical": 1
      }
    },
    "nurse-midwife": {
      "service_id": "health",
      "capabilities": {
        "nursing": 0.8,
        "care": 0.2
      }
    },
    "dietetic-technician": {
      "service_id": "health",
      "capabilities": {
        "care": 0.8,
        "maintenance": 0.2
      }
    },
    "psychiatric-aide": {
      "service_id": "health",
      "capabilities": {
        "care": 1
      }
    },
    "animator": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "illustrator": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "tv-media-producer": {
      "service_id": "community",
      "capabilities": {
        "culture": 1
      }
    },
    "gis-specialist": {
      "service_id": "infrastructure",
      "capabilities": {
        "research": 0.5,
        "design": 0.5
      }
    },
    "data-analyst": {
      "service_id": "learning",
      "capabilities": {
        "research": 0.8,
        "governance": 0.2
      }
    },
    "statistician": {
      "service_id": "learning",
      "capabilities": {
        "research": 1
      }
    },
    "conservation-scientist": {
      "service_id": "resilience",
      "capabilities": {
        "research": 0.6,
        "maintenance": 0.4
      }
    },
    "corporate-trainer": {
      "service_id": "learning",
      "capabilities": {
        "teaching": 1
      }
    },
    "health-educator": {
      "service_id": "community",
      "capabilities": {
        "care": 0.6,
        "governance": 0.4
      }
    }
  },
  "projects": [
    {
      "id": "community-clinic",
      "eligible_roles": [
        "family-medicine-physician",
        "geriatrician",
        "emergency-medicine-physician",
        "general-pediatrician",
        "general-surgeon",
        "cardiac-surgeon",
        "congenital-heart-surgeon",
        "thoracic-surgeon",
        "neurosurgeon",
        "orthopedic-surgeon",
        "transplant-surgeon",
        "vascular-surgeon",
        "cardiologist",
        "oncologist",
        "neurologist",
        "nephrologist",
        "pulmonologist",
        "endocrinologist",
        "infectious-disease-physician",
        "interventional-cardiologist",
        "electrophysiologist",
        "radiologist",
        "pathologist",
        "anesthesiologist",
        "psychiatrist",
        "rehabilitation-physician",
        "registered-nurse",
        "physical-therapist",
        "clinical-pharmacist",
        "dentist",
        "home-health-aide",
        "social-worker",
        "clinical-social-worker",
        "community-health-worker",
        "healthcare-administrator"
      ],
      "name": "Community clinic",
      "service_id": "health",
      "requirements": {
        "clinical": 0.35,
        "nursing": 0.35,
        "care": 0.15
      },
      "facility_bonus": 0.35,
      "description": "Establish a coordinated clinic with qualified clinical, nursing, and support capacity."
    },
    {
      "id": "learning-center",
      "eligible_roles": [
        "gpu-rtl-design-engineer",
        "asic-digital-design-engineer",
        "gpu-formal-verification-engineer",
        "fpga-design",
        "physical-design-engineer",
        "dft-engineer",
        "embedded-systems-engineer",
        "control-systems-engineer",
        "rf-engineer",
        "graduate-traffic-engineer",
        "rail-engineer",
        "bridge-engineer",
        "structural-engineering",
        "water-resources-engineer",
        "water-treatment-engineer",
        "geotechnical-engineer",
        "hvac-design-engineer",
        "mechanical-design-engineer",
        "robotics-engineer",
        "manufacturing-engineer",
        "thermal-engineer",
        "software-developer",
        "security-engineer",
        "sre-engineer",
        "process-engineer",
        "bioprocess-engineer",
        "aircraft-systems-engineer",
        "space-systems-engineer",
        "medical-device-engineer",
        "prosthetics-engineer",
        "industrial-engineer",
        "public-defender",
        "prosecutor",
        "appellate-attorney",
        "corporate-associate",
        "environmental-attorney",
        "civil-rights-attorney",
        "legal-aid-attorney",
        "immigration-attorney",
        "patent-attorney",
        "privacy-attorney",
        "labor-attorney",
        "tax-attorney",
        "family-law-attorney",
        "estate-attorney",
        "cell-biology-scientist",
        "immunologist",
        "geneticist",
        "neuroscientist",
        "clinical-trial-scientist",
        "research-physicist",
        "photonics-scientist",
        "quantum-scientist",
        "astrophysicist",
        "environmental-scientist",
        "data-scientist",
        "analytical-chemist",
        "materials-scientist",
        "medicinal-chemist",
        "climate-scientist",
        "geologist",
        "hydrologist",
        "ecologist",
        "biostatistician",
        "operations-research-scientist",
        "fp-and-a-analyst",
        "investment-analyst",
        "risk-manager",
        "actuary",
        "product-marketing-manager",
        "supply-chain-analyst",
        "product-manager",
        "small-business-owner",
        "accountant",
        "auditor",
        "operations-manager",
        "human-resources-manager",
        "organizational-development-specialist",
        "social-enterprise-founder",
        "healthcare-administrator",
        "construction-manager",
        "elementary-teacher",
        "special-education-teacher",
        "secondary-teacher",
        "teacher-assistant",
        "vocational-instructor",
        "adult-educator",
        "university-lecturer",
        "librarian",
        "graphic-designer",
        "ux-designer",
        "journalist",
        "technical-writer",
        "film-director",
        "musician",
        "game-designer",
        "museum-conservator",
        "social-worker",
        "clinical-social-worker",
        "community-health-worker",
        "career-counselor",
        "emergency-manager",
        "public-safety-officer",
        "farmer",
        "forester",
        "agronomist",
        "chef",
        "baker",
        "hotel-manager",
        "event-planner",
        "childcare-worker",
        "sales-representative",
        "real-estate-agent",
        "customer-service-specialist",
        "administrative-coordinator",
        "bookkeeper",
        "medical-records-specialist",
        "warehouse-technician",
        "military-logistics-specialist",
        "military-communications-specialist",
        "home-health-aide",
        "agricultural-worker"
      ],
      "name": "Learning and apprenticeship center",
      "service_id": "learning",
      "requirements": {
        "teaching": 0.5,
        "research": 0.2,
        "governance": 0.2
      },
      "facility_bonus": 0.35,
      "description": "Build a lasting place for instruction, practical learning, and career development."
    },
    {
      "id": "water-works",
      "eligible_roles": [
        "water-resources-engineer",
        "water-treatment-engineer",
        "geotechnical-engineer",
        "structural-engineering",
        "service-plumber",
        "pipefitter",
        "commercial-electrician",
        "industrial-electrician",
        "protection-engineer",
        "control-systems-engineer",
        "industrial-mechanic",
        "construction-manager",
        "carpenter",
        "structural-welder"
      ],
      "name": "Community water works",
      "service_id": "infrastructure",
      "requirements": {
        "water": 0.4,
        "design": 0.2,
        "construction": 0.25,
        "maintenance": 0.15,
        "electrical": 0.15
      },
      "facility_bonus": 0.35,
      "description": "Commission a maintained water service with design, installation, controls, and upkeep."
    },
    {
      "id": "local-crossing",
      "eligible_roles": [
        "structural-engineering",
        "bridge-engineer",
        "geotechnical-engineer",
        "graduate-traffic-engineer",
        "rail-engineer",
        "carpenter",
        "structural-welder",
        "mason",
        "construction-manager",
        "industrial-mechanic"
      ],
      "name": "Local bridge and crossing",
      "service_id": "infrastructure",
      "requirements": {
        "design": 0.35,
        "construction": 0.5,
        "maintenance": 0.15
      },
      "facility_bonus": 0.2,
      "description": "Build a local crossing suited to this 500-resident starting scenario. Century-scale regional bridge estimates remain separate career scenarios."
    },
    {
      "id": "food-cooperative",
      "eligible_roles": [
        "emergency-medicine-physician",
        "public-defender",
        "prosecutor",
        "appellate-attorney",
        "corporate-associate",
        "environmental-attorney",
        "civil-rights-attorney",
        "legal-aid-attorney",
        "immigration-attorney",
        "patent-attorney",
        "privacy-attorney",
        "labor-attorney",
        "tax-attorney",
        "family-law-attorney",
        "estate-attorney",
        "environmental-scientist",
        "climate-scientist",
        "geologist",
        "ecologist",
        "fp-and-a-analyst",
        "investment-analyst",
        "risk-manager",
        "actuary",
        "product-marketing-manager",
        "supply-chain-analyst",
        "product-manager",
        "small-business-owner",
        "accountant",
        "auditor",
        "operations-manager",
        "human-resources-manager",
        "organizational-development-specialist",
        "social-enterprise-founder",
        "healthcare-administrator",
        "construction-manager",
        "social-worker",
        "clinical-social-worker",
        "community-health-worker",
        "career-counselor",
        "firefighter",
        "paramedic",
        "emergency-manager",
        "public-safety-officer",
        "farmer",
        "forester",
        "agronomist",
        "veterinarian",
        "chef",
        "baker",
        "hotel-manager",
        "event-planner",
        "childcare-worker",
        "sales-representative",
        "real-estate-agent",
        "customer-service-specialist",
        "administrative-coordinator",
        "bookkeeper",
        "medical-records-specialist",
        "airline-pilot",
        "air-traffic-controller",
        "ship-captain",
        "truck-driver",
        "transit-operator",
        "warehouse-technician",
        "military-logistics-specialist",
        "military-communications-specialist",
        "home-health-aide",
        "agricultural-worker"
      ],
      "name": "Community food cooperative",
      "service_id": "livelihoods",
      "requirements": {
        "food": 0.4,
        "logistics": 0.3,
        "governance": 0.2
      },
      "facility_bonus": 0.35,
      "description": "Coordinate local production, dependable distribution, and accountable operations."
    },
    {
      "id": "emergency-network",
      "eligible_roles": [
        "gpu-rtl-design-engineer",
        "asic-digital-design-engineer",
        "gpu-formal-verification-engineer",
        "fpga-design",
        "physical-design-engineer",
        "dft-engineer",
        "embedded-systems-engineer",
        "control-systems-engineer",
        "rf-engineer",
        "graduate-traffic-engineer",
        "rail-engineer",
        "bridge-engineer",
        "structural-engineering",
        "geotechnical-engineer",
        "hvac-design-engineer",
        "mechanical-design-engineer",
        "robotics-engineer",
        "manufacturing-engineer",
        "thermal-engineer",
        "software-developer",
        "security-engineer",
        "sre-engineer",
        "process-engineer",
        "bioprocess-engineer",
        "aircraft-systems-engineer",
        "space-systems-engineer",
        "medical-device-engineer",
        "prosthetics-engineer",
        "industrial-engineer",
        "family-medicine-physician",
        "geriatrician",
        "emergency-medicine-physician",
        "general-pediatrician",
        "general-surgeon",
        "cardiac-surgeon",
        "congenital-heart-surgeon",
        "thoracic-surgeon",
        "neurosurgeon",
        "orthopedic-surgeon",
        "transplant-surgeon",
        "vascular-surgeon",
        "cardiologist",
        "oncologist",
        "neurologist",
        "nephrologist",
        "pulmonologist",
        "endocrinologist",
        "infectious-disease-physician",
        "interventional-cardiologist",
        "electrophysiologist",
        "radiologist",
        "pathologist",
        "anesthesiologist",
        "psychiatrist",
        "rehabilitation-physician",
        "physical-therapist",
        "clinical-pharmacist",
        "dentist",
        "public-defender",
        "prosecutor",
        "appellate-attorney",
        "corporate-associate",
        "environmental-attorney",
        "civil-rights-attorney",
        "legal-aid-attorney",
        "immigration-attorney",
        "patent-attorney",
        "privacy-attorney",
        "labor-attorney",
        "tax-attorney",
        "family-law-attorney",
        "estate-attorney",
        "commercial-electrician",
        "structural-welder",
        "service-plumber",
        "lineworker",
        "industrial-electrician",
        "solar-installer",
        "hvac-technician",
        "pipefitter",
        "refrigeration-technician",
        "carpenter",
        "mason",
        "elevator-technician",
        "cnc-machinist",
        "industrial-mechanic",
        "automotive-technician",
        "environmental-scientist",
        "climate-scientist",
        "geologist",
        "ecologist",
        "fp-and-a-analyst",
        "investment-analyst",
        "risk-manager",
        "actuary",
        "product-marketing-manager",
        "supply-chain-analyst",
        "product-manager",
        "small-business-owner",
        "accountant",
        "auditor",
        "operations-manager",
        "human-resources-manager",
        "organizational-development-specialist",
        "social-enterprise-founder",
        "healthcare-administrator",
        "construction-manager",
        "social-worker",
        "clinical-social-worker",
        "community-health-worker",
        "career-counselor",
        "firefighter",
        "paramedic",
        "emergency-manager",
        "public-safety-officer",
        "forester",
        "chef",
        "baker",
        "hotel-manager",
        "event-planner",
        "childcare-worker",
        "sales-representative",
        "real-estate-agent",
        "customer-service-specialist",
        "administrative-coordinator",
        "bookkeeper",
        "medical-records-specialist",
        "airline-pilot",
        "air-traffic-controller",
        "ship-captain",
        "truck-driver",
        "transit-operator",
        "warehouse-technician",
        "military-logistics-specialist",
        "military-communications-specialist",
        "home-health-aide",
        "custodian",
        "groundskeeper"
      ],
      "name": "Emergency response network",
      "service_id": "resilience",
      "requirements": {
        "clinical": 0.2,
        "logistics": 0.3,
        "governance": 0.25,
        "maintenance": 0.2
      },
      "facility_bonus": 0.35,
      "description": "Connect trained responders, logistics, planning, and maintained equipment."
    },
    {
      "id": "community-center",
      "eligible_roles": [
        "family-medicine-physician",
        "geriatrician",
        "general-pediatrician",
        "general-surgeon",
        "cardiac-surgeon",
        "congenital-heart-surgeon",
        "thoracic-surgeon",
        "neurosurgeon",
        "orthopedic-surgeon",
        "transplant-surgeon",
        "vascular-surgeon",
        "cardiologist",
        "oncologist",
        "neurologist",
        "nephrologist",
        "pulmonologist",
        "endocrinologist",
        "infectious-disease-physician",
        "interventional-cardiologist",
        "electrophysiologist",
        "radiologist",
        "pathologist",
        "anesthesiologist",
        "psychiatrist",
        "rehabilitation-physician",
        "registered-nurse",
        "physical-therapist",
        "clinical-pharmacist",
        "dentist",
        "public-defender",
        "prosecutor",
        "appellate-attorney",
        "corporate-associate",
        "environmental-attorney",
        "civil-rights-attorney",
        "legal-aid-attorney",
        "immigration-attorney",
        "patent-attorney",
        "privacy-attorney",
        "labor-attorney",
        "tax-attorney",
        "family-law-attorney",
        "estate-attorney",
        "environmental-scientist",
        "climate-scientist",
        "geologist",
        "ecologist",
        "fp-and-a-analyst",
        "investment-analyst",
        "risk-manager",
        "actuary",
        "product-marketing-manager",
        "supply-chain-analyst",
        "product-manager",
        "small-business-owner",
        "accountant",
        "auditor",
        "operations-manager",
        "human-resources-manager",
        "organizational-development-specialist",
        "social-enterprise-founder",
        "healthcare-administrator",
        "construction-manager",
        "graphic-designer",
        "ux-designer",
        "journalist",
        "technical-writer",
        "film-director",
        "musician",
        "game-designer",
        "museum-conservator",
        "social-worker",
        "clinical-social-worker",
        "community-health-worker",
        "career-counselor",
        "emergency-manager",
        "public-safety-officer",
        "forester",
        "chef",
        "baker",
        "hotel-manager",
        "event-planner",
        "barber",
        "childcare-worker",
        "fitness-trainer",
        "funeral-director",
        "sales-representative",
        "real-estate-agent",
        "customer-service-specialist",
        "administrative-coordinator",
        "bookkeeper",
        "medical-records-specialist",
        "warehouse-technician",
        "military-logistics-specialist",
        "military-communications-specialist",
        "home-health-aide"
      ],
      "name": "Community and cultural center",
      "service_id": "community",
      "requirements": {
        "care": 0.3,
        "culture": 0.4,
        "governance": 0.2
      },
      "facility_bonus": 0.35,
      "description": "Create a shared institution for care, participation, culture, and community trust."
    }
  ]
};
