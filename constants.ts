
import { DishwasherData } from './types';

// Default initial state
export const DEFAULT_DISHWASHER_DATA: DishwasherData = {
    timeValue: 25,
    householdSize: 2,
    breakfasts: 0,
    lunches: 0,
    dinners: 0,
    washingMethod: 'tap',
    machineCost: 800,
    installationType: 'diy'
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
    COST_INSTALLATION_PRO: 200 // Avg plumber cost
};
