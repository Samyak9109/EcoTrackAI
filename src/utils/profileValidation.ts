import type {
  DietType,
  ShoppingFrequency,
  TransportMode,
  UserProfile,
} from "../types";

export const PROFILE_LIMITS = {
  commuteKmPerDay: 500,
  electricityUnitsPerMonth: 5000,
  onlineOrdersPerMonth: 1000,
} as const;

export type ProfileErrors = Partial<
  Record<
    "commuteKmPerDay" | "electricityUnitsPerMonth" | "onlineOrdersPerMonth",
    string
  >
>;

const TRANSPORT_MODES = new Set<TransportMode>([
  "car",
  "bike",
  "bus",
  "train",
  "cycle",
  "walk",
  "work_from_home",
]);
const DIET_TYPES = new Set<DietType>([
  "vegan",
  "vegetarian",
  "mixed",
  "high_meat",
]);
const SHOPPING_FREQUENCIES = new Set<ShoppingFrequency>([
  "low",
  "medium",
  "high",
]);

function isNumberInRange(value: unknown, maximum: number): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= maximum
  );
}

export function validateProfile(profile: UserProfile): ProfileErrors {
  const errors: ProfileErrors = {};

  if (!isNumberInRange(profile.commuteKmPerDay, PROFILE_LIMITS.commuteKmPerDay)) {
    errors.commuteKmPerDay = `Enter a distance between 0 and ${PROFILE_LIMITS.commuteKmPerDay} km.`;
  }
  if (
    !isNumberInRange(
      profile.electricityUnitsPerMonth,
      PROFILE_LIMITS.electricityUnitsPerMonth,
    )
  ) {
    errors.electricityUnitsPerMonth =
      `Enter electricity use between 0 and ${PROFILE_LIMITS.electricityUnitsPerMonth} units.`;
  }
  if (
    !isNumberInRange(
      profile.onlineOrdersPerMonth,
      PROFILE_LIMITS.onlineOrdersPerMonth,
    )
  ) {
    errors.onlineOrdersPerMonth =
      `Enter an order count between 0 and ${PROFILE_LIMITS.onlineOrdersPerMonth}.`;
  }

  return errors;
}

export function isUserProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== "object") return false;

  const profile = value as Record<string, unknown>;
  return (
    isNumberInRange(profile.commuteKmPerDay, PROFILE_LIMITS.commuteKmPerDay) &&
    typeof profile.transportMode === "string" &&
    TRANSPORT_MODES.has(profile.transportMode as TransportMode) &&
    isNumberInRange(
      profile.electricityUnitsPerMonth,
      PROFILE_LIMITS.electricityUnitsPerMonth,
    ) &&
    typeof profile.dietType === "string" &&
    DIET_TYPES.has(profile.dietType as DietType) &&
    isNumberInRange(
      profile.onlineOrdersPerMonth,
      PROFILE_LIMITS.onlineOrdersPerMonth,
    ) &&
    typeof profile.shoppingFrequency === "string" &&
    SHOPPING_FREQUENCIES.has(
      profile.shoppingFrequency as ShoppingFrequency,
    ) &&
    typeof profile.recyclesWaste === "boolean" &&
    typeof profile.usesACDaily === "boolean"
  );
}
