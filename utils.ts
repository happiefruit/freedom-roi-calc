
import { RegionalSettings, AppliancePreset, UserInputs, CalculationResults } from './types';

export const getRegionalSettings = (): RegionalSettings => {
  const locale = navigator.language || 'en-US';
  const currency = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' })
    .resolvedOptions().currency || 'USD';
  
  const isMetric = !['US', 'LR', 'MM'].some(country => locale.includes(country));
  
  // Default estimates
  let electricityRate = 0.15;
  let waterRate = 0.002;
  let currencySymbol = '$';

  if (currency === 'GBP') {
    electricityRate = 0.28;
    waterRate = 0.003;
    currencySymbol = '£';
  } else if (currency === 'EUR') {
    electricityRate = 0.22;
    waterRate = 0.0025;
    currencySymbol = '€';
  }

  return { currency, currencySymbol, isMetric, electricityRate, waterRate };
};

export const calculateROI = (
  appliance: AppliancePreset,
  inputs: UserInputs,
  regional: RegionalSettings
): CalculationResults => {
  
  // 1. Calculate Time ROI
  // Formula: (Mins per task * Freq per week * 52) / 60
  // Note: For most appliances, we subtract a small amount of "maintenance time" (loading dishwasher etc), 
  // but for the sake of the prompt's requested precision on "Commute Time", we will treat the input as pure saved time.
  const applianceMaintenanceMins = appliance.isEspressoMachine ? 2 : 5; // minimal interaction
  const netMinutesSavedPerUse = Math.max(0, inputs.timePerTask - applianceMaintenanceMins);
  
  let annualHoursSaved = (netMinutesSavedPerUse * inputs.frequency * 52) / 60;
  let annualValueSaved = annualHoursSaved * inputs.hourlyWage;

  // 2. Calculate Money ROI (Special Espresso Logic)
  // Formula: ((Cafe Price - Home Cost) * Cups * Frequency * 52) - Appliance Cost
  // Note: We add this cash savings to the 'Value Saved' metric
  if (appliance.isEspressoMachine && inputs.cafePrice && inputs.cupsPerDay) {
    const homeCost = 0.50; // Fixed per prompt
    const dailySavings = (inputs.cafePrice - homeCost) * inputs.cupsPerDay;
    // Assuming frequency here represents "Days per week I buy coffee"
    const annualCashSavings = dailySavings * inputs.frequency * 52;
    
    annualValueSaved = annualCashSavings; // Override pure time value for the "Value" metric
    // Reverse calculate "Virtual Hours" to keep the display consistent if users want to see "Time Equivalent"
    // Or we just keep annualHoursSaved as the commute time saved.
    
    // The prompt asks for Money ROI. We will add the Cash Savings to the Time Value for total benefit?
    // Usually ROI combines both. Let's add Time Value + Cash Savings for Total Benefit.
    const timeValue = annualHoursSaved * inputs.hourlyWage;
    annualValueSaved = timeValue + annualCashSavings;
  }

  // 3. Resource ROI
  // Simplify resource calc based on frequency
  let manualWaterAnnual = 0;
  let manualEnergyAnnual = 0;
  
  if (appliance.id === 'dishwasher') {
    manualWaterAnnual = 80 * inputs.frequency * 52; // Hand wash
    manualEnergyAnnual = 2.0 * inputs.frequency * 52; // Hot water heating
  } else if (appliance.isHeatPump) {
    manualEnergyAnnual = appliance.energyKwhPerUse * 2.5 * inputs.frequency * 52; // Vented dryer
  }

  const applianceWaterAnnual = appliance.waterLitresPerUse * inputs.frequency * 52;
  const applianceEnergyAnnual = appliance.energyKwhPerUse * inputs.frequency * 52;

  const waterSaved = Math.max(0, manualWaterAnnual - applianceWaterAnnual);
  const energySaved = Math.max(0, manualEnergyAnnual - applianceEnergyAnnual);

  const resourceSavings = (waterSaved * regional.waterRate) + (energySaved * regional.electricityRate);
  
  // Total Annual Benefit
  const totalAnnualBenefit = annualValueSaved + resourceSavings;

  // 4. Metrics
  const breakEvenMonths = totalAnnualBenefit > 0 ? inputs.cost / (totalAnnualBenefit / 12) : 0;
  const lifetimeRoi = totalAnnualBenefit > 0 ? ((totalAnnualBenefit * 10) / inputs.cost) * 100 : 0;

  // Comparisons
  const netflixSeries = annualHoursSaved / 8;
  const showers = waterSaved / (regional.isMetric ? 60 : 17);
  const carbonSaved = energySaved * 0.4;
  const carMiles = carbonSaved * 2.5;
  const bulbDays = (energySaved / 0.01) / 24;

  return {
    annualHoursSaved,
    annualValueSaved: totalAnnualBenefit,
    breakEvenMonths,
    lifetimeRoi,
    ecoImpact: { waterSaved, energySaved, carbonSaved },
    comparisons: { netflixSeries, showers, carMiles, bulbDays }
  };
};

export const formatCurrency = (val: number, symbol: string) => {
  return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};
