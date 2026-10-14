// Generated from data/world.toml. Run npm run compile; do not edit.
// Source SHA-256: 28e95db63c5abc7ea833214895a87aec7ed42a1150b4be244825bba6347b7fb1
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
