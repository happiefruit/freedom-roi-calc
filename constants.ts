
import { AppliancePreset } from './types';

export const APPLIANCES: AppliancePreset[] = [
  {
    id: 'robot-vacuum',
    name: 'Robot Vacuum',
    defaultCost: 500,
    defaultFrequency: 3,
    defaultTimePerTask: 45,
    timeTaskLabel: 'Minutes per vacuum session',
    energyKwhPerUse: 0.05,
    waterLitresPerUse: 0,
    snarkyReasons: [
      "Because dust bunnies aren't actually pets, no matter what you name them.",
      "Your cat deserves a noble electric chariot to ride into battle.",
      "Spending Saturday morning pushing a plastic tube around is a cry for help."
    ]
  },
  {
    id: 'espresso-machine',
    name: 'Auto Espresso Machine',
    defaultCost: 800,
    defaultFrequency: 5, // Days per week
    defaultTimePerTask: 20,
    timeTaskLabel: 'Mins roundtrip to cafe',
    energyKwhPerUse: 0.1,
    waterLitresPerUse: 0.2,
    isEspressoMachine: true,
    snarkyReasons: [
      "Talking to a barista before 8 AM is a genuine social hazard.",
      "Amortize your caffeine addiction into a tax-free lifestyle asset.",
      "Your kitchen now smells like a Milanese plaza instead of desperation."
    ]
  },
  {
    id: 'robot-mower',
    name: 'Robot Mower',
    defaultCost: 1200,
    defaultFrequency: 1,
    defaultTimePerTask: 60,
    timeTaskLabel: 'Minutes mowing lawn',
    energyKwhPerUse: 0.1,
    waterLitresPerUse: 0,
    snarkyReasons: [
      "Grass grows while you sleep; you should mow while you sleep too.",
      "Never hear a neighbor complain about your lawn length again.",
      "Saturday mornings are for brunch and mimosas, not seasonal allergies."
    ]
  },
  {
    id: 'dishwasher',
    name: 'Dishwasher',
    defaultCost: 600,
    defaultFrequency: 7,
    defaultTimePerTask: 30,
    timeTaskLabel: 'Minutes scrubbing dishes',
    energyKwhPerUse: 1.2,
    waterLitresPerUse: 12,
    snarkyReasons: [
      "You are a human being, not a sponge.",
      "Hand-washing dishes is a relic from 1850. Stop LARPing as a peasant.",
      "Arguments about 'who scrubs the lasagna pan' are the leading cause of divorce."
    ]
  },
  {
    id: 'heat-pump-dryer',
    name: 'Heat Pump Dryer',
    defaultCost: 900,
    defaultFrequency: 4,
    defaultTimePerTask: 20,
    timeTaskLabel: 'Mins hanging wet clothes',
    energyKwhPerUse: 1.5,
    waterLitresPerUse: 0,
    isHeatPump: true,
    snarkyReasons: [
      "The indoor drying rack aesthetic is officially cancelled.",
      "Stop paying the electric company enough to heat the entire neighborhood.",
      "Fluffier towels, smaller bills, and you didn't have to touch a clothespin."
    ]
  }
];
