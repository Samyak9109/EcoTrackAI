import type { SelectOption } from "../config/constants/domainMetadata";

export function parseNumberInput(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return Number.NaN;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}


export function parseSelectValue<T extends string>(
  value: string,
  options: SelectOption<T>[],
  fallback: T,
): T {
  return options.some((option) => option.value === value) ? (value as T) : fallback;
}

