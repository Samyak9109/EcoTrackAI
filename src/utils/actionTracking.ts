import { ACTION_LIBRARY } from "../config/constants/actionLibrary";
import type { CompletedAction } from "../types";

const ACTION_BY_ID = new Map(ACTION_LIBRARY.map((action) => [action.id, action]));

export function getActionSaving(actionId: string): number {
  return ACTION_BY_ID.get(actionId)?.estimatedSavingKg ?? 0;
}

export function getCompletedActionsSaving(items: CompletedAction[]): number {
  const completedActionIds = new Set(items.map((item) => item.actionId));
  return [...completedActionIds].reduce(
    (sum, actionId) => sum + getActionSaving(actionId),
    0,
  );
}

export function getUtcDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function calculateActionStreak(
  items: CompletedAction[],
  currentDate = new Date(),
): number {
  const dates = new Set(items.map((item) => getUtcDateKey(new Date(item.completedAt))));
  const cursor = new Date(currentDate);
  if (!dates.has(getUtcDateKey(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;
  while (dates.has(getUtcDateKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
