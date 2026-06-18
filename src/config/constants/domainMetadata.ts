import type {
  CarbonCategory,
  DietType,
  ShoppingFrequency,
  TransportMode,
} from "../types";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

export const TRANSPORT_OPTIONS: SelectOption<TransportMode>[] = [
  { value: "car", label: "Car" },
  { value: "bike", label: "Motorbike / scooter" },
  { value: "bus", label: "Bus" },
  { value: "train", label: "Train / metro" },
  { value: "cycle", label: "Bicycle" },
  { value: "walk", label: "Walk" },
  { value: "work_from_home", label: "Work from home" },
];

export const DIET_OPTIONS: SelectOption<DietType>[] = [
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "mixed", label: "Mixed diet" },
  { value: "high_meat", label: "High meat" },
];

export const SHOPPING_OPTIONS: SelectOption<ShoppingFrequency>[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const CATEGORY_LABELS: Record<CarbonCategory, string> = {
  transport: "Transport",
  electricity: "Electricity",
  food: "Food",
  shopping: "Shopping",
  waste: "Waste",
};

export function formatEnumLabel(value: string): string {
  return value.replaceAll("_", " ");
}
