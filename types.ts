
export type AppView = 'home' | 'calculator' | 'result';
export type ApplianceType = 'dishwasher' | 'dryer' | 'robot-vacuum';

export interface DishwasherData {
    timeValue: number;          // $/hr
    householdSize: number;      // count
    
    // Meal Frequencies (0-7 days/week)
    breakfasts: number;
    lunches: number;
    dinners: number;

    washingMethod: 'tap' | 'basin';
    machineCost: number;        // $
    installationType: 'diy' | 'pro';
}

export interface CalculationResult {
    tenYearManualCost: number;
    tenYearMachineCost: number;
    netSavings10Year: number;
    hoursSavedPerYear: number;
    litresSavedPerYear: number;
    breakEvenMonths: number;
    isWorthIt: boolean;
    isRestaurantMode: boolean;
    
    // Cost Breakdown for Charts
    upfrontCost: number;
    annualManualCost: number;
    annualMachineOpCost: number;
}

// Union type for future extensibility
export type CalculatorData = DishwasherData;
