import { DEFAULT_COMMUTE_DAYS, EMISSION_FACTORS } from "../config/constants/emissionFactors";
import type {
  CarbonCategory,
  CarbonResult,
  CategoryBreakdown,
  UserProfile,
} from "../types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Climate Champion";
  if (score >= 60) return "Eco Improver";
  if (score >= 40) return "Getting Started";
  return "High Impact Lifestyle";
}

export function getHighestEmissionCategory(
  result: Pick<CarbonResult, "breakdown"> | CategoryBreakdown,
): CarbonCategory {
  const breakdown = "breakdown" in result ? result.breakdown : result;
  return (Object.entries(breakdown) as [CarbonCategory, number][]).reduce(
    (highest, entry) => (entry[1] > highest[1] ? entry : highest),
  )[0];
}

export function calculateCarbonFootprint(
  profile: UserProfile,
  commuteDays = DEFAULT_COMMUTE_DAYS,
): CarbonResult {
  const safeCommuteDays = clamp(commuteDays, 0, 31);
  const transport =
    Math.max(0, profile.commuteKmPerDay) *
    safeCommuteDays *
    EMISSION_FACTORS.transportKgPerKm[profile.transportMode];
  const electricity =
    Math.max(0, profile.electricityUnitsPerMonth) *
    EMISSION_FACTORS.electricityKgPerUnit;
  const food = EMISSION_FACTORS.dietKgPerMonth[profile.dietType];
  const shopping =
    EMISSION_FACTORS.shoppingKgPerMonth[profile.shoppingFrequency] +
    Math.max(0, profile.onlineOrdersPerMonth) * EMISSION_FACTORS.onlineOrderKg;
  const waste = profile.recyclesWaste
    ? EMISSION_FACTORS.wasteKgPerMonth.recycles
    : EMISSION_FACTORS.wasteKgPerMonth.doesNotRecycle;

  const breakdown: CategoryBreakdown = {
    transport: round(transport),
    electricity: round(electricity),
    food: round(food),
    shopping: round(shopping),
    waste: round(waste),
  };
  const totalKg = round(Object.values(breakdown).reduce((sum, value) => sum + value, 0));
  const score = Math.round(clamp(100 - totalKg / 5, 0, 100));

  return {
    totalKg,
    score,
    scoreLabel: getScoreLabel(score),
    highestCategory: getHighestEmissionCategory(breakdown),
    breakdown,
  };
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
