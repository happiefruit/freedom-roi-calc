
import { DishwasherData, RobotVacuumData } from './types';

// Default initial state
export const DEFAULT_DISHWASHER_DATA: DishwasherData = {
    timeValue: 25,
    householdSize: 2,
    breakfasts: 0,
    lunches: 0,
    dinners: 0,
    machineCost: 800,
    installationType: 'diy',
    culinaryStyle: 'default'
};

export const DEFAULT_ROBOT_DATA: RobotVacuumData = {
    timeValue: 25,
    robotType: 'vac_only',
    machineCost: 400,
    homeSize: 1500,
    hasPets: false,
    manualVacFrequency: 1,
    manualVacTime: 30,
    manualMopFrequency: 0, // Hidden by default
    manualMopTime: 20
};

// Physics & Economics
export const CONSTANTS = {
    // Time (Minutes)
    TIME_MANUAL_WASH_PER_LOAD: 20,
    TIME_MACHINE_LOAD_UNLOAD: 5,
    
    // Water (Litres)
    WATER_MANUAL_TAP_PER_LOAD: 100, // ~26 gallons (High)
    WATER_MANUAL_BASIN_PER_LOAD: 40, // ~10 gallons (Efficient manual)
    WATER_MACHINE_PER_LOAD: 13,     // ~3.5 gallons (Energy Star)
    
    // Costs ($ USD)
    COST_WATER_PER_LITRE: 0.002, // Avg municipal rate
    COST_KWH: 0.16,
    
    // Energy (kWh) - Mostly heating water
    ENERGY_TO_HEAT_WATER_LITRE: 0.03, // Rough est to heat 1L by 40C
    ENERGY_MACHINE_OPERATIONAL: 1.0,  // Motor + internal heater
    
    // Detergent
    COST_DETERGENT_MANUAL: 0.05,
    COST_DETERGENT_MACHINE: 0.25,

    // Services
    COST_INSTALLATION_PRO: 200, // Avg plumber cost

    // Transparency: Mess Coefficients (Items per person per meal)
    // NOTE: These are now base values modified by CULINARY_PROFILES in utils
    ITEMS_PER_BREAKFAST: 2, 
    ITEMS_PER_LUNCH: 3,     
    ITEMS_PER_DINNER: 6,    
    
    // Machine Capacity (Total individual items standard load)
    // Recalibrated to 110 (Approx 12 Place Settings x 9 items + extras)
    DISHWASHER_CAPACITY: 110
};

export const ROBOT_CONSTANTS = {
    // Annual Costs
    ELEC_BASE: 4,
    ELEC_MOP_ADDON: 6,
    CONSUMABLES_BASE: 55, // Bags (30) + Brushes/Filters (25)
    CONSUMABLES_PET_PENALTY: 20,
    CONSUMABLES_MOP: 40,
    
    // Maintenance
    BATTERY_REPLACEMENT_COST: 70,
    BATTERY_LIFESPAN_YEARS: 3,
    
    // Maintenance Labor (Robot isn't 0 labor)
    ROBOT_MAINTENANCE_MINS_WEEK: 5, // Emptying bin, untangling hair
    
    // Water (Mopping)
    LITRES_PER_MANUAL_MOP: 5
};

export const CULINARY_PROFILES = {
    default: {
        small: 1.0,  // Bowls/Cups
        plates: 1.0, // Large Plates
        pots: 1.0,   // Cookware
        utensils: 1.0,
        rackBias: 'balanced'
    },
    asia: {
        // Targeted for: 2 Pax Meal = 9 Small (Prep+Serving), 0 Plates, 2 Pots, 4 Utensils
        // Math: Multiplier = Target / (Factor[2] * Base)
        small: 1.5,  // 9 / (2*3) = 1.5
        plates: 0.1, // Near zero large plates
        pots: 2.0,   // 2 / (2*0.5) = 2.0
        utensils: 0.7, // 4 / (2*3) = 0.66
        rackBias: 'top_rack_bottleneck'
    },
    europe: {
        small: 2.0,
        plates: 2.5, // Multi-course plating
        pots: 3.5,   // Heavy course-based cookware
        utensils: 3.0, // Fork/Knife/Spoon x Courses
        rackBias: 'bottom_rack_bottleneck'
    },
    usa: {
        small: 0.5,
        plates: 1.5, // Large plates (28cm+)
        pots: 2.0,   // Baking sheets, large pans
        utensils: 2.0,
        rackBias: 'spacing_inefficiency' // Need gap for spray arms
    }
};
