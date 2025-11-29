export const WORKER_SKILLS = {
  construction: [
    "Masonry",
    "Plastering",
    "Tiling",
    "Painting",
    "Carpentry",
    "Roofing",
    "Flooring",
    "Concrete Work",
    "Brick Laying",
    "Stone Work",
  ],
  electrical: [
    "Electrical Wiring",
    "Panel Installation",
    "Lighting Installation",
    "Motor Wiring",
    "Generator Installation",
    "Solar Installer",
    "EV Technician",
    "EV Charger Installation",
    "Smart Home Wiring",
    "Industrial Electrical",
  ],
  plumbing: [
    "Pipe Fitting",
    "Drainage",
    "Water Supply",
    "Bathroom Fitting",
    "Sewage Work",
    "Water Heater Installation",
  ],
  hvac: [
    "AC Installation",
    "AC Repair",
    "Ventilation",
    "Refrigeration",
    "Duct Work",
  ],
  heavy_equipment: [
    "JCB Operator",
    "Crane Operator",
    "Excavator Operator",
    "Bulldozer Operator",
    "Forklift Operator",
    "Tower Crane Operator",
  ],
  specialized: [
    "Welding",
    "Steel Fabrication",
    "Scaffolding",
    "Demolition",
    "Waterproofing",
    "Insulation",
    "Glass Work",
    "Aluminum Work",
  ],
  renewable_energy: [
    "Solar Panel Installation",
    "Solar System Maintenance",
    "EV Charging Station Setup",
    "Battery Storage Systems",
    "Inverter Installation",
    "Net Metering Setup",
  ],
};

export const ALL_SKILLS = Object.values(WORKER_SKILLS).flat();

export const SKILL_CATEGORIES = [
  { id: "construction", name: "Construction", skills: WORKER_SKILLS.construction },
  { id: "electrical", name: "Electrical", skills: WORKER_SKILLS.electrical },
  { id: "plumbing", name: "Plumbing", skills: WORKER_SKILLS.plumbing },
  { id: "hvac", name: "HVAC", skills: WORKER_SKILLS.hvac },
  { id: "heavy_equipment", name: "Heavy Equipment", skills: WORKER_SKILLS.heavy_equipment },
  { id: "specialized", name: "Specialized", skills: WORKER_SKILLS.specialized },
  { id: "renewable_energy", name: "Renewable Energy", skills: WORKER_SKILLS.renewable_energy },
];

export const USER_ROLES = [
  {
    id: "client",
    name: "Client",
    description: "Homeowner or property developer looking to hire workers for projects",
    icon: "home",
  },
  {
    id: "contractor",
    name: "Contractor",
    description: "Construction contractor managing teams and taking on large projects",
    icon: "hardhat",
  },
  {
    id: "worker",
    name: "Worker",
    description: "Skilled tradesperson offering services in construction and related fields",
    icon: "wrench",
  },
] as const;

export type UserRole = "worker" | "employer" | "admin" | "contractor" | "client";
