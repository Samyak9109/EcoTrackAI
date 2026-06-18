import type {
  CompletedAction,
  FootprintHistoryEntry,
  UserProfile,
  TransportMode,
  DietType,
  ShoppingFrequency,
} from "../types";

export const PROFILE_LIMITS = {
  commuteKmPerDay: 500,
  electricityUnitsPerMonth: 5000,
  onlineOrdersPerMonth: 1000,
} as const;

export const TRANSPORT_MODES = new Set<TransportMode>([
  "car",
  "bike",
  "bus",
  "train",
  "cycle",
  "walk",
  "work_from_home",
]);
export const DIET_TYPES = new Set<DietType>([
  "vegan",
  "vegetarian",
  "mixed",
  "high_meat",
]);
export const SHOPPING_FREQUENCIES = new Set<ShoppingFrequency>([
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

export function isValidDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export function isUserProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== "object") return false;

  const p = value as Record<string, unknown>;
  return (
    isNumberInRange(p.commuteKmPerDay, PROFILE_LIMITS.commuteKmPerDay) &&
    typeof p.transportMode === "string" &&
    TRANSPORT_MODES.has(p.transportMode as TransportMode) &&
    isNumberInRange(
      p.electricityUnitsPerMonth,
      PROFILE_LIMITS.electricityUnitsPerMonth,
    ) &&
    typeof p.dietType === "string" &&
    DIET_TYPES.has(p.dietType as DietType) &&
    isNumberInRange(p.onlineOrdersPerMonth, PROFILE_LIMITS.onlineOrdersPerMonth) &&
    typeof p.shoppingFrequency === "string" &&
    SHOPPING_FREQUENCIES.has(p.shoppingFrequency as ShoppingFrequency) &&
    typeof p.recyclesWaste === "boolean" &&
    typeof p.usesACDaily === "boolean"
  );
}

// Storage validation helpers (used by storageService)
const ACTION_IDS = new Set(
  ACTION_LIBRARY.map((a: { id: string }) => a.id),
);
import { ACTION_LIBRARY } from "../config/constants/actionLibrary";

export function isCompletedAction(value: unknown): value is CompletedAction {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.actionId === "string" &&
    ACTION_IDS.has(item.actionId) &&
    typeof item.completedAt === "string" &&
    isValidDate(item.completedAt)
  );
}

export function isHistoryEntry(value: unknown): value is FootprintHistoryEntry {
  if (!value || typeof value !== "object") return false;

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.recordedAt === "string" &&
    isValidDate(entry.recordedAt) &&
    typeof entry.totalKg === "number" &&
    Number.isFinite(entry.totalKg) &&
    entry.totalKg >= 0 &&
    typeof entry.score === "number" &&
    Number.isFinite(entry.score) &&
    entry.score >= 0 &&
    entry.score <= 100
  );
}