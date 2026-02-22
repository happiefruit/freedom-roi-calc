
export type AppView = 'home' | 'calculator' | 'result';
export type ApplianceType = 'dishwasher' | 'dryer' | 'robot-vacuum';
export type CulinaryStyle = 'default' | 'asia' | 'europe' | 'usa';

export interface DishwasherData {
    timeValue: number;          // $/hr
    householdSize: number;      // count
    
    // Meal Frequencies (0-7 days/week)
    breakfasts: number;
    lunches: number;
    dinners: number;

    machineCost: number;        // $
    installationType: 'diy' | 'pro';
    
    // New: Regional Profile
    culinaryStyle: CulinaryStyle;
}

export interface RobotVacuumData {
    timeValue: number;
    robotType: 'vac_only' | 'vac_mop';
    machineCost: number;
    homeSize: number;           // sq ft
    hasPets: boolean;
    
    // Habits
    manualVacFrequency: number; // times/week
    manualVacTime: number;      // mins/session
    manualMopFrequency: number; // times/week
    manualMopTime: number;      // mins/session
}

export interface CalculationResult {
    tenYearManualCost: number;
    tenYearMachineCost: number;
    netSavings10Year: number;
    hoursSavedPerYear: number;
    litresSavedPerYear: number;
    breakEvenMonths: number;
    isWorthIt: boolean;
    isRestaurantMode: boolean; // repurposed as high-usage flag
    
    // Cost Breakdown for Charts
    upfrontCost: number;
    annualManualCost: number;
    annualMachineOpCost: number;
    loadsPerWeek: number; // For robot, this is "Sessions per week"
    
    // Transparency Data
    itemBreakdown: {
        weeklyBreakfastItems: number;
        weeklyLunchItems: number;
        weeklyDinnerItems: number;
        totalWeeklyItems: number;
    };
    
    // Detailed Item Breakdown for Tooltip
    breakdown?: {
        bowls: number;
        plates: number;
        pots: number;
        utensils: number;
    };
    
    rackEfficiency?: number; // New metric
    isHygieneTriggered?: boolean; // New flag for low-usage hygiene floor

    // New transparency inputs for tooltips
    inputs: {
        frequency: number;   // e.g., 5 times/week
        duration: number;    // e.g., 20 mins/session
        rate: number;        // e.g., $50/hr
        periodLabel: string; // "loads/week" or "sessions/week"
        
        // Added for Trust/Context
        people?: number;
        cookingStyle?: string;
        region?: string;
    };
    
    // Detailed Breakdown for Manual
    annualManualLaborCost: number;
    annualManualLaborHours: number;
    annualManualSuppliesCost: number; // Water + Energy + Soap
    
    // New: Regional specific advice
    regionCaveat?: string;
}

// Union type for future extensibility
export type CalculatorData = DishwasherData | RobotVacuumData;
