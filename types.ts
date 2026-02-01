
export interface AppliancePreset {
  id: string;
  name: string;
  defaultCost: number;
  defaultFrequency: number; // Uses per week
  defaultTimePerTask: number; // Minutes
  timeTaskLabel: string; // e.g., "Minutes spent driving to cafe"
  snarkyReasons: string[];
  // Special logic flags
  isEspressoMachine?: boolean;
  isHeatPump?: boolean;
  energyKwhPerUse: number; // Kept for eco calc
  waterLitresPerUse: number; // Kept for eco calc
}

export interface RegionalSettings {
  currency: string;
  currencySymbol: string;
  isMetric: boolean;
  electricityRate: number;
  waterRate: number;
}

export interface UserInputs {
  cost: number;
  hourlyWage: number;
  frequency: number;
  timePerTask: number;
  cafePrice?: number;
  cupsPerDay?: number;
}

export interface CalculationResults {
  annualHoursSaved: number;
  annualValueSaved: number;
  breakEvenMonths: number;
  lifetimeRoi: number;
  ecoImpact: {
    waterSaved: number;
    energySaved: number;
    carbonSaved: number;
  };
  comparisons: {
    netflixSeries: number;
    showers: number;
    carMiles: number;
    bulbDays: number;
  };
}
