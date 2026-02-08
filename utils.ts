
import { DishwasherData, RobotVacuumData, CalculationResult } from './types';
import { CONSTANTS, ROBOT_CONSTANTS } from './constants';

export const calculateDishwasherROI = (data: DishwasherData): CalculationResult => {
    const { 
        timeValue, 
        householdSize,
        breakfasts,
        lunches,
        dinners, 
        machineCost, 
        installationType 
    } = data;

    // 1. Annual Usage (Transparent Item Count Logic)
    // We calculate total dirty items generated per week based on meal frequency and household size.
    
    const weeklyBreakfastItems = breakfasts * householdSize * CONSTANTS.ITEMS_PER_BREAKFAST;
    const weeklyLunchItems = lunches * householdSize * CONSTANTS.ITEMS_PER_LUNCH;
    const weeklyDinnerItems = dinners * householdSize * CONSTANTS.ITEMS_PER_DINNER;

    const totalWeeklyItems = weeklyBreakfastItems + weeklyLunchItems + weeklyDinnerItems;
    
    // Calculate raw loads based on capacity
    let loadsPerWeek = totalWeeklyItems / CONSTANTS.DISHWASHER_CAPACITY;
    
    // Floor logic: If they cook at all, assume at least 0.5 loads/week (smell factor/batching)
    if (totalWeeklyItems > 0 && loadsPerWeek < 0.5) {
        loadsPerWeek = 0.5;
    }

    const loadsPerYear = loadsPerWeek * 52;

    // 2. Manual Washing Costs (Annual)
    // Defaulting to "Tap" method (worst case) as per simplification requirement
    const manualTimeHours = (loadsPerYear * CONSTANTS.TIME_MANUAL_WASH_PER_LOAD) / 60;
    const manualWaterLitres = loadsPerYear * CONSTANTS.WATER_MANUAL_TAP_PER_LOAD;
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
        loadsPerWeek,
        // Transparency
        itemBreakdown: {
            weeklyBreakfastItems,
            weeklyLunchItems,
            weeklyDinnerItems,
            totalWeeklyItems
        },
        inputs: {
            frequency: parseFloat(loadsPerWeek.toFixed(1)),
            duration: CONSTANTS.TIME_MANUAL_WASH_PER_LOAD,
            rate: timeValue,
            periodLabel: 'loads/wk'
        },
        annualManualLaborCost: costManualTime,
        annualManualLaborHours: manualTimeHours,
        annualManualSuppliesCost: costManualWater + costManualEnergy + costManualSoap
    };
};

export const calculateRobotVacuumROI = (data: RobotVacuumData): CalculationResult => {
    const {
        timeValue,
        robotType,
        machineCost,
        hasPets,
        manualVacFrequency,
        manualVacTime,
        manualMopFrequency,
        manualMopTime
    } = data;

    // 1. Manual Labor Costs (Annual)
    // Vacuuming
    const annualVacHours = (manualVacFrequency * manualVacTime * 52) / 60;
    
    // Mopping (Only applies if user actually mops AND buys a robot that mops)
    // If they buy a vac_only, we don't count mop savings because they still have to mop manually.
    const effectiveMopFreq = robotType === 'vac_mop' ? manualMopFrequency : 0;
    const annualMopHours = (effectiveMopFreq * manualMopTime * 52) / 60;
    
    const totalManualHours = annualVacHours + annualMopHours;
    const annualManualCost = totalManualHours * timeValue;

    // 2. Robot Costs (Annual Operational)
    
    // Electricity
    let annualElec = ROBOT_CONSTANTS.ELEC_BASE;
    if (robotType === 'vac_mop') annualElec += ROBOT_CONSTANTS.ELEC_MOP_ADDON;

    // Consumables
    let annualConsumables = ROBOT_CONSTANTS.CONSUMABLES_BASE;
    if (hasPets) annualConsumables += ROBOT_CONSTANTS.CONSUMABLES_PET_PENALTY;
    if (robotType === 'vac_mop') annualConsumables += ROBOT_CONSTANTS.CONSUMABLES_MOP;

    // Maintenance Labor (Bin emptying, detangling)
    // Assuming robot reduces 95% of labor, but adds 5 mins/week maintenance
    const annualMaintenanceHours = (ROBOT_CONSTANTS.ROBOT_MAINTENANCE_MINS_WEEK * 52) / 60;
    const annualMaintenanceCost = annualMaintenanceHours * timeValue;

    const annualMachineOpCost = annualElec + annualConsumables + annualMaintenanceCost;

    // 3. Ten Year Projection
    
    // Battery Replacements (Years 3, 6, 9) -> 3 times in 10 years
    const totalBatteryCost = ROBOT_CONSTANTS.BATTERY_REPLACEMENT_COST * 3;

    const tenYearManualCost = annualManualCost * 10;
    const tenYearMachineCost = machineCost + (annualMachineOpCost * 10) + totalBatteryCost;
    
    const netSavings10Year = tenYearManualCost - tenYearMachineCost;
    
    // 4. Metrics
    const hoursSavedPerYear = totalManualHours - annualMaintenanceHours;
    
    // Litres saved (Only relevant if mopping)
    const litresSavedPerYear = robotType === 'vac_mop' 
        ? (effectiveMopFreq * ROBOT_CONSTANTS.LITRES_PER_MANUAL_MOP * 52) 
        : 0;

    const totalAnnualBenefit = annualManualCost - annualMachineOpCost - (totalBatteryCost / 10);
    const breakEvenMonths = totalAnnualBenefit > 0 ? (machineCost / totalAnnualBenefit) * 12 : 999;

    // Roast/Warning Logic: If home is massive (>3000 sqft) one robot might die trying
    const isRestaurantMode = data.homeSize > 3000;

    // Calculate aggregated input stats for display
    const totalFreq = manualVacFrequency + effectiveMopFreq;
    // Weighted avg duration if mixed
    const avgDuration = totalFreq > 0 ? (totalManualHours * 60 / 52) / totalFreq : 0;

    return {
        tenYearManualCost,
        tenYearMachineCost,
        netSavings10Year,
        hoursSavedPerYear,
        litresSavedPerYear,
        breakEvenMonths,
        isWorthIt: netSavings10Year > 0,
        isRestaurantMode,
        upfrontCost: machineCost,
        annualManualCost,
        annualMachineOpCost: annualMachineOpCost + (totalBatteryCost/10), // Amortized battery
        loadsPerWeek: totalFreq,
        itemBreakdown: {
            weeklyBreakfastItems: 0,
            weeklyLunchItems: 0,
            weeklyDinnerItems: 0,
            totalWeeklyItems: 0
        },
        inputs: {
            frequency: totalFreq,
            duration: Math.round(avgDuration),
            rate: timeValue,
            periodLabel: 'sessions/wk'
        },
        annualManualLaborCost: annualManualCost,
        annualManualLaborHours: totalManualHours,
        annualManualSuppliesCost: 0
    };
};

export const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

export const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);
};
