
import { DishwasherData, RobotVacuumData } from './types';

// Default initial state
export const DEFAULT_DISHWASHER_DATA: DishwasherData = {
    timeValue: 25,
    householdSize: 2,
    breakfasts: 0,
    lunches: 0,
    dinners: 0,
    machineCost: 800,
    installationType: 'diy'
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
    ITEMS_PER_BREAKFAST: 2, // Bowl, Spoon
    ITEMS_PER_LUNCH: 3,     // Plate, Fork, Glass
    ITEMS_PER_DINNER: 6,    // Plate, Cutlery, Glass, Pot/Pan share (aggregated)
    
    // Machine Capacity (Total individual items standard load)
    DISHWASHER_CAPACITY: 45
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
