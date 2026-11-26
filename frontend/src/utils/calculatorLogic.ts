export const CEA_EMISSION_FACTOR = 0.82; // kg CO2 per kWh (Central Electricity Authority India Baseline)
export const TREE_CO2_PER_YEAR_KG = 21.77; // Annual CO2 absorption per mature tree
export const OPTIMIZATION_RATE = 0.18; // Conservative 18% waste reduction via anomaly & slab management
export const FIXED_METER_CHARGE = 150; // INR/month

export interface SlabBreakdown {
  bill: number;
  topSlabRate: number;
  slabLabel: string;
}

export function calculateSlabBill(units: number): SlabBreakdown {
  let remaining = Math.max(0, units);
  let energyCharge = 0;

  const s1 = Math.min(remaining, 100);
  energyCharge += s1 * 3.5;
  remaining -= s1;

  const s2 = Math.min(remaining, 200); // 101 - 300
  energyCharge += s2 * 5.5;
  remaining -= s2;

  const s3 = Math.min(remaining, 200); // 301 - 500
  energyCharge += s3 * 7.5;
  remaining -= s3;

  const s4 = remaining; // > 500
  energyCharge += s4 * 9.0;

  let topSlabRate = 3.5;
  let slabLabel = "Slab 1 (0–100 kWh)";
  if (units > 500) {
    topSlabRate = 9.0;
    slabLabel = "Slab 4 (500+ kWh)";
  } else if (units > 300) {
    topSlabRate = 7.5;
    slabLabel = "Slab 3 (301–500 kWh)";
  } else if (units > 100) {
    topSlabRate = 5.5;
    slabLabel = "Slab 2 (101–300 kWh)";
  }

  return {
    bill: Math.round(energyCharge + FIXED_METER_CHARGE),
    topSlabRate,
    slabLabel,
  };
}

export function estimateUnitsFromBill(targetBill: number): number {
  const energyBudget = Math.max(0, targetBill - FIXED_METER_CHARGE);
  if (energyBudget <= 350) return Math.round(energyBudget / 3.5);
  if (energyBudget <= 1450) return Math.round(100 + (energyBudget - 350) / 5.5);
  if (energyBudget <= 2950) return Math.round(300 + (energyBudget - 1450) / 7.5);
  return Math.round(500 + (energyBudget - 2950) / 9.0);
}

export function computeWattWiseImpact(inputMode: "units" | "bill", value: number) {
  const baselineUnits = inputMode === "units" ? value : estimateUnitsFromBill(value);
  const current = calculateSlabBill(baselineUnits);

  const optimizedUnits = Math.round(baselineUnits * (1 - OPTIMIZATION_RATE));
  const savedUnitsMonthly = Math.max(1, baselineUnits - optimizedUnits);
  const projected = calculateSlabBill(optimizedUnits);

  const monthlySavingsInr = Math.max(0, current.bill - projected.bill);
  const annualSavingsInr = monthlySavingsInr * 12;

  const monthlyCo2SavedKg = Number((savedUnitsMonthly * CEA_EMISSION_FACTOR).toFixed(1));
  const annualCo2SavedKg = Math.round(monthlyCo2SavedKg * 12);
  const treesPlantedEquivalent = Math.max(1, Math.round(annualCo2SavedKg / TREE_CO2_PER_YEAR_KG));

  const slabDropped = projected.topSlabRate < current.topSlabRate;

  return {
    baselineUnits,
    optimizedUnits,
    savedUnitsMonthly,
    currentBill: current.bill,
    projectedBill: projected.bill,
    currentSlab: current.slabLabel,
    projectedSlab: projected.slabLabel,
    slabDropped,
    monthlySavingsInr,
    annualSavingsInr,
    monthlyCo2SavedKg,
    annualCo2SavedKg,
    treesPlantedEquivalent,
  };
}
