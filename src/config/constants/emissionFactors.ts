import type {
  DietType,
  ShoppingFrequency,
  TransportMode,
} from "../types";

export const EMISSION_FACTORS = {
  transportKgPerKm: {
    car: 0.18,
    bike: 0.08,
    bus: 0.05,
    train: 0.035,
    cycle: 0,
    walk: 0,
    work_from_home: 0,
  } satisfies Record<TransportMode, number>,
  electricityKgPerUnit: 0.82,
  dietKgPerMonth: {
    vegan: 90,
    vegetarian: 120,
    mixed: 180,
    high_meat: 260,
  } satisfies Record<DietType, number>,
  onlineOrderKg: 2.5,
  shoppingKgPerMonth: {
    low: 20,
    medium: 50,
    high: 90,
  } satisfies Record<ShoppingFrequency, number>,
  wasteKgPerMonth: {
    recycles: 15,
    doesNotRecycle: 35,
  },
} as const;

export const DEFAULT_COMMUTE_DAYS = 22;
