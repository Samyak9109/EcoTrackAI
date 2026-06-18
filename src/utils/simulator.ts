import { DEFAULT_COMMUTE_DAYS } from "../config/constants/emissionFactors";
import type {
  SimulationChanges,
  SimulationResult,
  UserProfile,
} from "../types";
import { calculateCarbonFootprint } from "./carbonCalculator";

export function simulateAction(
  profile: UserProfile,
  changes: SimulationChanges,
): SimulationResult {
  const nextProfile: UserProfile = {
    ...profile,
    transportMode: changes.transportMode ?? profile.transportMode,
    electricityUnitsPerMonth:
      changes.electricityUnitsPerMonth ?? profile.electricityUnitsPerMonth,
    dietType: changes.dietType ?? profile.dietType,
    onlineOrdersPerMonth:
      changes.onlineOrdersPerMonth ?? profile.onlineOrdersPerMonth,
  };

  const current = calculateCarbonFootprint(profile);
  const projected = calculateCarbonFootprint(
    nextProfile,
    changes.commuteDaysPerMonth ?? DEFAULT_COMMUTE_DAYS,
  );

  return {
    current,
    projected,
    deltaKg: Math.round((current.totalKg - projected.totalKg) * 10) / 10,
  };
}
