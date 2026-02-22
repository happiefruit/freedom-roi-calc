
import { DishwasherData, RobotVacuumData, CalculationResult } from './types';
import { CONSTANTS, ROBOT_CONSTANTS, CULINARY_PROFILES } from './constants';

export const calculateDishwasherROI = (data: DishwasherData): CalculationResult => {
    const { 
        timeValue, 
        householdSize,
        breakfasts,
        lunches,
        dinners, 
        machineCost, 
        installationType,
        culinaryStyle
    } = data;

    // 1. Culinary Profile & Rack Physics
    const profile = CULINARY_PROFILES[culinaryStyle];
    
    // Base "Meal Units" (How many times people eat)
    const totalWeeklyMeals = (breakfasts + lunches + dinners) * householdSize;
    const cookingStyleLabel = `${breakfasts + lunches + dinners} meals/wk`;

    // Item Generation (Regional Multipliers)
    // We assume a base "Dinner" has the full profile load, lighter meals have partial.
    // Weighted avg: Dinner (100%), Lunch (50%), Breakfast (30%)
    const weightedMealFactor = ((breakfasts * 0.3) + (lunches * 0.5) + (dinners * 1.0)) * householdSize;

    // RECALIBRATED BASE MULTIPLIERS (Home Cook Reality)
    const weeklySmallItems = weightedMealFactor * 3.0 * profile.small;   
    const weeklyLargePlates = weightedMealFactor * 2.0 * profile.plates; 
    const weeklyPots = weightedMealFactor * 0.5 * profile.pots;          
    const weeklyUtensils = weightedMealFactor * 3.0 * profile.utensils;  
    
    const totalWeeklyItems = weeklySmallItems + weeklyLargePlates + weeklyPots + weeklyUtensils;

    // --- RACK PHYSICS ALGORITHM ---
    // Capacities (Arbitrary Physics Units based on standard 24" Tub)
    // Recalibrated: Top rack holds ~50 small items, Bottom holds ~35 plate "slots"
    const TOP_RACK_CAPACITY = 50; 
    const BOTTOM_RACK_CAPACITY = 35; 
    const POT_COST = 5; // 1 Pot = 5 Plate slots
    const UTENSIL_BATCH_COST = 0.05; // Per piece (Basket efficiency)

    let topRackLoad = 0;
    let bottomRackLoad = 0;

    // Calculate usage based on profile bias
    if (profile.rackBias === 'top_rack_bottleneck') {
        // Asia: Top rack fills with bowls/sauce dishes fast. 
        topRackLoad = weeklySmallItems / TOP_RACK_CAPACITY;
        // Bottom rack is plates + woks.
        bottomRackLoad = (weeklyLargePlates + (weeklyPots * POT_COST)) / BOTTOM_RACK_CAPACITY;
    
    } else if (profile.rackBias === 'spacing_inefficiency') {
        // USA: Large items need "Every-other-tine" spacing (1.5x footprint)
        topRackLoad = weeklySmallItems / TOP_RACK_CAPACITY;
        
        // Bottom rack: Plates are fat, Baking sheets are tall.
        const spacedPlateCost = 1.5; 
        bottomRackLoad = ((weeklyLargePlates * spacedPlateCost) + (weeklyPots * POT_COST)) / BOTTOM_RACK_CAPACITY;

    } else {
        // Europe / Default: Standard linear filling
        topRackLoad = weeklySmallItems / TOP_RACK_CAPACITY;
        bottomRackLoad = (weeklyLargePlates + (weeklyPots * POT_COST)) / BOTTOM_RACK_CAPACITY;
    }

    // Add Utensils (negligible but present)
    const utensilLoad = (weeklyUtensils * UTENSIL_BATCH_COST) / BOTTOM_RACK_CAPACITY;
    bottomRackLoad += utensilLoad;

    // The Bottle Neck: The machine runs when the fullest rack is full.
    let loadsPerWeek = Math.max(topRackLoad, bottomRackLoad);

    // --- HYGIENE FLOOR ---
    // A dishwasher should run at least every ~3 days (2.3 times/week) to prevent odors/mold,
    // even if it's not full.
    let isHygieneTriggered = false;
    
    if (totalWeeklyMeals > 0) {
        if (loadsPerWeek < 2.3) {
            loadsPerWeek = 2.3;
            isHygieneTriggered = true;
        }
    } else {
        // No meals, no loads
        loadsPerWeek = 0;
    }

    // Calculate Efficiency: How "full" the machine is on average based on item count vs theoretical capacity
    const theoreticalMaxItems = loadsPerWeek * CONSTANTS.DISHWASHER_CAPACITY;
    const rackEfficiency = theoreticalMaxItems > 0 
        ? Math.round((totalWeeklyItems / theoreticalMaxItems) * 100) 
        : 0;

    // 2. Manual Washing Costs (Regional Tedium Adjustment)
    const loadsPerYear = loadsPerWeek * 52;
    
    let manualMinutesPerLoad = CONSTANTS.TIME_MANUAL_WASH_PER_LOAD; // Base 20
    
    if (culinaryStyle === 'asia') manualMinutesPerLoad = 15; // Fast, small items
    if (culinaryStyle === 'europe') manualMinutesPerLoad = 25; // Scrubbing heavy pots
    if (culinaryStyle === 'usa') manualMinutesPerLoad = 20; // Average
    
    const manualTimeHours = (loadsPerYear * manualMinutesPerLoad) / 60;
    const manualWaterLitres = loadsPerYear * CONSTANTS.WATER_MANUAL_TAP_PER_LOAD;
    const manualEnergyKwh = manualWaterLitres * CONSTANTS.ENERGY_TO_HEAT_WATER_LITRE; 
    
    const costManualTime = manualTimeHours * timeValue;
    const costManualWater = manualWaterLitres * CONSTANTS.COST_WATER_PER_LITRE;
    const costManualEnergy = manualEnergyKwh * CONSTANTS.COST_KWH;
    const costManualSoap = loadsPerYear * CONSTANTS.COST_DETERGENT_MANUAL;

    const annualManualCost = costManualTime + costManualWater + costManualEnergy + costManualSoap;

    // 3. Machine Costs
    const machineTimeHours = (loadsPerYear * CONSTANTS.TIME_MACHINE_LOAD_UNLOAD) / 60;
    const machineWaterLitres = loadsPerYear * CONSTANTS.WATER_MACHINE_PER_LOAD;
    const machineEnergyKwh = (loadsPerYear * CONSTANTS.ENERGY_MACHINE_OPERATIONAL); 
    
    const costMachineTime = machineTimeHours * timeValue;
    const costMachineWater = machineWaterLitres * CONSTANTS.COST_WATER_PER_LITRE;
    const costMachineEnergy = machineEnergyKwh * CONSTANTS.COST_KWH;
    const costMachineSoap = loadsPerYear * CONSTANTS.COST_DETERGENT_MACHINE;

    const annualMachineOpCost = costMachineTime + costMachineWater + costMachineEnergy + costMachineSoap;

    // 4. Results
    const upfrontCost = machineCost + (installationType === 'pro' ? CONSTANTS.COST_INSTALLATION_PRO : 0);
    const tenYearManualCost = annualManualCost * 10;
    const tenYearMachineCost = upfrontCost + (annualMachineOpCost * 10);
    const netSavings10Year = tenYearManualCost - tenYearMachineCost;

    const hoursSavedPerYear = manualTimeHours - machineTimeHours;
    const litresSavedPerYear = manualWaterLitres - machineWaterLitres;
    
    const totalAnnualBenefit = annualManualCost - annualMachineOpCost;
    const breakEvenMonths = totalAnnualBenefit > 0 ? (upfrontCost / totalAnnualBenefit) * 12 : 999;

    // Region Specific Caveats
    let regionCaveat = undefined;
    if (culinaryStyle === 'usa') {
        regionCaveat = "Only worth it if your large cookware (baking sheets, big pots) is dishwasher-safe. If you hand-wash those, your ROI drops by ~40%.";
    } else if (culinaryStyle === 'asia') {
        regionCaveat = "Your top rack fills up 3x faster than the bottom. Look for models with a '3rd Rack' for chopsticks/utensils to optimize density.";
    } else if (culinaryStyle === 'europe') {
        regionCaveat = "Your multi-course meals create heavy bottom-rack loads. Ensure your machine has 'Foldable Tines' to fit large pots.";
    }

    const regionLabel = culinaryStyle === 'usa' ? 'USA' : culinaryStyle.charAt(0).toUpperCase() + culinaryStyle.slice(1);

    return {
        tenYearManualCost,
        tenYearMachineCost,
        netSavings10Year,
        hoursSavedPerYear,
        litresSavedPerYear,
        breakEvenMonths,
        isWorthIt: netSavings10Year > 0,
        isRestaurantMode: loadsPerWeek > 14, // High usage flag
        upfrontCost,
        annualManualCost,
        annualMachineOpCost,
        loadsPerWeek,
        itemBreakdown: {
            weeklyBreakfastItems: 0, 
            weeklyLunchItems: 0,
            weeklyDinnerItems: 0,
            totalWeeklyItems: Math.round(totalWeeklyItems)
        },
        breakdown: {
            bowls: Math.round(weeklySmallItems),
            plates: Math.round(weeklyLargePlates),
            pots: Math.round(weeklyPots),
            utensils: Math.round(weeklyUtensils)
        },
        rackEfficiency,
        isHygieneTriggered,
        inputs: {
            frequency: parseFloat(loadsPerWeek.toFixed(1)),
            duration: manualMinutesPerLoad,
            rate: timeValue,
            periodLabel: 'loads/wk',
            people: householdSize,
            cookingStyle: cookingStyleLabel,
            region: regionLabel
        },
        annualManualLaborCost: costManualTime,
        annualManualLaborHours: manualTimeHours,
        annualManualSuppliesCost: costManualWater + costManualEnergy + costManualSoap,
        regionCaveat
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
