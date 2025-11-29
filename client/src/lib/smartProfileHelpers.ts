// PATCH: smart-profile
// Created by Replit AI in SAFE MODE
// DO NOT MODIFY without human approval
// Pure functions for dynamic form behavior based on profession

export type ProfessionType = 
  | "mason"
  | "electrician"
  | "plumber"
  | "carpenter"
  | "painter"
  | "welder"
  | "other";

export interface ProfessionConfig {
  label: string;
  minWageDaily: number;
  maxWageDaily: number;
  minContractPrice: number;
  maxContractPrice: number;
  possibleSpecializations: string[];
  typicalExperience: number;
  possibleTools: string[];
  description: string;
}

// Pure function: Get profession configuration
export function getProfessionConfig(profession: ProfessionType): ProfessionConfig {
  const configs: Record<ProfessionType, ProfessionConfig> = {
    mason: {
      label: "Mason",
      minWageDaily: 400,
      maxWageDaily: 1200,
      minContractPrice: 25000,
      maxContractPrice: 500000,
      possibleSpecializations: [
        "Brick laying",
        "Block work",
        "Plastering",
        "Finishing",
        "Foundation work",
        "RCC work"
      ],
      typicalExperience: 5,
      possibleTools: ["Trowel", "Spirit level", "Measuring tape", "Mason's chisel"],
      description: "Brickwork, plastering, and concrete work specialist"
    },
    electrician: {
      label: "Electrician",
      minWageDaily: 600,
      maxWageDaily: 1500,
      minContractPrice: 35000,
      maxContractPrice: 750000,
      possibleSpecializations: [
        "Domestic wiring",
        "Commercial wiring",
        "Industrial wiring",
        "Solar installation",
        "Panel board setup",
        "Troubleshooting"
      ],
      typicalExperience: 3,
      possibleTools: [
        "Multimeter",
        "Wire stripper",
        "Screwdriver set",
        "Testing kit",
        "Insulated gloves"
      ],
      description: "Electrical installation and maintenance expert"
    },
    plumber: {
      label: "Plumber",
      minWageDaily: 500,
      maxWageDaily: 1300,
      minContractPrice: 30000,
      maxContractPrice: 600000,
      possibleSpecializations: [
        "Pipe fitting",
        "Fixture installation",
        "Repairs",
        "Water treatment",
        "Sanitation systems",
        "Underground piping"
      ],
      typicalExperience: 4,
      possibleTools: [
        "Adjustable wrench",
        "Pipe cutter",
        "Plunger",
        "Auger",
        "Propane torch"
      ],
      description: "Plumbing installation and repair professional"
    },
    carpenter: {
      label: "Carpenter",
      minWageDaily: 550,
      maxWageDaily: 1400,
      minContractPrice: 40000,
      maxContractPrice: 800000,
      possibleSpecializations: [
        "Furniture making",
        "Door/window fitting",
        "Roofing",
        "Flooring",
        "Framing",
        "Woodwork finishing"
      ],
      typicalExperience: 5,
      possibleTools: [
        "Saw",
        "Hammer",
        "Chisel",
        "Measuring tape",
        "Level",
        "Sander"
      ],
      description: "Woodwork and structural carpentry specialist"
    },
    painter: {
      label: "Painter",
      minWageDaily: 400,
      maxWageDaily: 1000,
      minContractPrice: 20000,
      maxContractPrice: 400000,
      possibleSpecializations: [
        "Interior painting",
        "Exterior painting",
        "Texture work",
        "Decorative painting",
        "Waterproofing",
        "Wall finishing"
      ],
      typicalExperience: 2,
      possibleTools: [
        "Paintbrush",
        "Roller",
        "Spray gun",
        "Drop cloth",
        "Paint scraper",
        "Primer"
      ],
      description: "Interior and exterior painting professional"
    },
    welder: {
      label: "Welder",
      minWageDaily: 700,
      maxWageDaily: 1800,
      minContractPrice: 50000,
      maxContractPrice: 1000000,
      possibleSpecializations: [
        "MIG welding",
        "TIG welding",
        "Arc welding",
        "Structural welding",
        "Pipe welding",
        "Fabrication"
      ],
      typicalExperience: 4,
      possibleTools: [
        "MIG welder",
        "TIG welder",
        "Electrode holder",
        "Safety gear",
        "Grinding machine",
        "Clamps"
      ],
      description: "Metal welding and fabrication expert"
    },
    other: {
      label: "Other",
      minWageDaily: 300,
      maxWageDaily: 2000,
      minContractPrice: 10000,
      maxContractPrice: 1500000,
      possibleSpecializations: [
        "General labor",
        "Scaffolding",
        "Safety management",
        "Supervision",
        "Quality control"
      ],
      typicalExperience: 1,
      possibleTools: ["Safety equipment", "Basic tools"],
      description: "Other construction-related work"
    }
  };

  return configs[profession];
}

// Pure function: Validate wage range
export function validateWageRange(minWage: number, maxWage: number, profession: ProfessionType): { valid: boolean; error?: string } {
  const config = getProfessionConfig(profession);
  
  if (minWage < config.minWageDaily) {
    return { valid: false, error: `Minimum wage cannot be less than ₹${config.minWageDaily}` };
  }
  if (maxWage > config.maxWageDaily) {
    return { valid: false, error: `Maximum wage cannot exceed ₹${config.maxWageDaily}` };
  }
  if (minWage >= maxWage) {
    return { valid: false, error: "Minimum wage must be less than maximum wage" };
  }

  return { valid: true };
}

// Pure function: Validate contract price range
export function validateContractRange(minPrice: number, maxPrice: number, profession: ProfessionType): { valid: boolean; error?: string } {
  const config = getProfessionConfig(profession);
  
  if (minPrice < config.minContractPrice) {
    return { valid: false, error: `Minimum price cannot be less than ₹${config.minContractPrice}` };
  }
  if (maxPrice > config.maxContractPrice) {
    return { valid: false, error: `Maximum price cannot exceed ₹${config.maxContractPrice}` };
  }
  if (minPrice >= maxPrice) {
    return { valid: false, error: "Minimum price must be less than maximum price" };
  }

  return { valid: true };
}

// Pure function: Get availability options based on profession
export function getAvailabilityOptions(profession: ProfessionType): string[] {
  const baseOptions = ["Available", "Busy", "Unavailable"];
  const specialOptions: Record<ProfessionType, string[]> = {
    mason: ["Full-time", "Part-time", "Weekends only", "Flexible"],
    electrician: ["24/7 emergency", "Business hours", "Flexible", "Not available"],
    plumber: ["24/7 emergency", "Business hours", "Flexible", "Not available"],
    carpenter: ["Full-time", "Part-time", "Project-based", "Flexible"],
    painter: ["Full-time", "Part-time", "Contract", "Flexible"],
    welder: ["Full-time", "Part-time", "Industrial shifts", "Flexible"],
    other: ["As needed", "Regular", "Flexible", "Not available"]
  };

  return specialOptions[profession] || baseOptions;
}

// Pure function: Get major cities in India
export function getMajorCities(): string[] {
  return [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Pune",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Ludhiana",
    "Indore",
    "Kochi",
    "Surat",
    "Nagpur",
    "Nagpur",
    "Lucknow",
    "Chandigarh"
  ];
}

// Pure function: Calculate suggested wage based on experience
export function calculateSuggestedWage(profession: ProfessionType, experience: number): { min: number; max: number } {
  const config = getProfessionConfig(profession);
  const range = config.maxWageDaily - config.minWageDaily;
  const experienceMultiplier = Math.min(experience / config.typicalExperience, 1);
  
  const suggestedMin = Math.round(config.minWageDaily + range * 0.2 * experienceMultiplier);
  const suggestedMax = Math.round(config.minWageDaily + range * 0.9 * experienceMultiplier);

  return { min: suggestedMin, max: suggestedMax };
}

// Pure function: Get profile completeness score
export function getCompletenessScore(profile: any): number {
  let score = 0;
  const fields = ["profession", "minWage", "maxWage", "experience", "specialization", "availability", "city", "toolsOwned"];
  
  fields.forEach((field) => {
    if (profile[field]) score += 100 / fields.length;
  });

  return Math.round(score);
}

// Pure function: Generate smart suggestions
export function generateSuggestions(profession: ProfessionType, experience: number): string[] {
  const config = getProfessionConfig(profession);
  const suggestions: string[] = [];

  if (experience < config.typicalExperience) {
    suggestions.push(`You have less experience than typical ${config.label}s. Consider completing training courses.`);
  } else if (experience === config.typicalExperience) {
    suggestions.push(`Your experience matches the typical ${config.label}. You're at a competitive level.`);
  } else {
    suggestions.push(`Your ${experience}+ years of experience makes you highly competitive in the market.`);
  }

  suggestions.push(`Consider learning one of these specializations: ${config.possibleSpecializations.slice(0, 3).join(", ")}`);
  suggestions.push("Complete profile verification to increase job opportunities by 3x.");

  return suggestions;
}

// END PATCH
