
import { DishwasherData, CalculationResult } from './types';
import { CONSTANTS } from './constants';

export const calculateDishwasherROI = (data: DishwasherData): CalculationResult => {
    const { 
        timeValue, 
        householdSize,
        breakfasts,
        lunches,
        dinners, 
        washingMethod, 
        machineCost, 
        installationType 
    } = data;

    // 1. Annual Usage (New Pots & Pans Logic)
    // Capacity: 15 Units per load
    const breakfastUnits = breakfasts * (0.5 + (householdSize * 0.5));
    const lunchUnits = lunches * (1.5 + (householdSize * 1));
    const dinnerUnits = dinners * (3 + (householdSize * 1)); // Dinners are heavy on pots

    const totalWeeklyUnits = breakfastUnits + lunchUnits + dinnerUnits;
    
    // Calculate raw loads, ensuring at least 0.5 loads/week if they selected any cooking,
    // otherwise 0 if they literally never cook (which is rare, but formula handles 0).
    let loadsPerWeek = totalWeeklyUnits / 15;
    if (loadsPerWeek > 0 && loadsPerWeek < 0.5) {
        loadsPerWeek = 0.5;
    }

    const loadsPerYear = loadsPerWeek * 52;

    // 2. Manual Washing Costs (Annual)
    const manualTimeHours = (loadsPerYear * CONSTANTS.TIME_MANUAL_WASH_PER_LOAD) / 60;
    const manualWaterLitres = loadsPerYear * (washingMethod === 'tap' ? CONSTANTS.WATER_MANUAL_TAP_PER_LOAD : CONSTANTS.WATER_MANUAL_BASIN_PER_LOAD);
    const manualEnergyKwh = manualWaterLitres * CONSTANTS.ENERGY_TO_HEAT_WATER_LITRE; // Heating the water
    
    const costManualTime = manualTimeHours * timeValue;
    const costManualWater = manualWaterLitres * CONSTANTS.COST_WATER_PER_LITRE;
    const costManualEnergy = manualEnergyKwh * CONSTANTS.COST_KWH;
    const costManualSoap = loadsPerYear * CONSTANTS.COST_DETERGENT_MANUAL;

    const annualManualCost = costManualTime + costManualWater + costManualEnergy + costManualSoap;

    // 3. Machine Washing Costs (Annual)
    const machineTimeHours = (loadsPerYear * CONSTANTS.TIME_MACHINE_LOAD_UNLOAD) / 60;
    const machineWaterLitres = loadsPerYear * CONSTANTS.WATER_MACHINE_PER_LOAD;
    const machineEnergyKwh = (loadsPerYear * CONSTANTS.ENERGY_MACHINE_OPERATIONAL); // Includes heating
    
    const costMachineTime = machineTimeHours * timeValue;
    const costMachineWater = machineWaterLitres * CONSTANTS.COST_WATER_PER_LITRE;
    const costMachineEnergy = machineEnergyKwh * CONSTANTS.COST_KWH;
    const costMachineSoap = loadsPerYear * CONSTANTS.COST_DETERGENT_MACHINE;

    const annualMachineOpCost = costMachineTime + costMachineWater + costMachineEnergy + costMachineSoap;

    // 4. Investment
    const upfrontCost = machineCost + (installationType === 'pro' ? CONSTANTS.COST_INSTALLATION_PRO : 0);

    // 5. Ten Year Projection
    const tenYearManualCost = annualManualCost * 10;
    const tenYearMachineCost = upfrontCost + (annualMachineOpCost * 10);
    const netSavings10Year = tenYearManualCost - tenYearMachineCost;

    // 6. Savings Metrics
    const hoursSavedPerYear = manualTimeHours - machineTimeHours;
    const litresSavedPerYear = manualWaterLitres - machineWaterLitres;
    
    const totalAnnualBenefit = annualManualCost - annualMachineOpCost;
    const breakEvenMonths = totalAnnualBenefit > 0 ? (upfrontCost / totalAnnualBenefit) * 12 : 999;

    // Roast Logic: If they are cooking > 5 dinners a week or generating massive load volume
    const isRestaurantMode = dinners >= 6 || loadsPerWeek > 10;

    return {
        tenYearManualCost,
        tenYearMachineCost,
        netSavings10Year,
        hoursSavedPerYear,
        litresSavedPerYear,
        breakEvenMonths,
        isWorthIt: netSavings10Year > 0,
        isRestaurantMode,
        // Chart Data Support
        upfrontCost,
        annualManualCost,
        annualMachineOpCost,
        loadsPerWeek
    };
};

export const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

export const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);
};
