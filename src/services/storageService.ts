import type {
  CompletedAction,
  FootprintHistoryEntry,
  UserProfile,
} from "../types";
import { isUserProfile } from "../utils/validation";

const KEYS = {
  profile: "ecotrack_profile",
  actions: "ecotrack_actions",
  history: "ecotrack_history",
} as const;

import { ACTION_LIBRARY } from "../config/constants/actionLibrary";
const ACTION_IDS = new Set(ACTION_LIBRARY.map((action) => action.id));
const MAX_STORED_VALUE_LENGTH = 100_000;
const MAX_COMPLETED_ACTIONS = 1000;

export type StorageWriteResult =
  | { ok: true }
  | { ok: false; message: string };

const STORAGE_WRITE_OK: StorageWriteResult = { ok: true };

function readJson(key: string): unknown {
  try {
    const value = window.localStorage.getItem(key);
    if (!value || value.length > MAX_STORED_VALUE_LENGTH) return null;
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T): StorageWriteResult {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return STORAGE_WRITE_OK;
  } catch {
    return {
      ok: false,
      message: "Browser storage is unavailable, so this change was not saved.",
    };
  }
}

export function saveProfile(profile: UserProfile): StorageWriteResult {
  if (!isUserProfile(profile)) {
    return { ok: false, message: "Profile data is invalid and was not saved." };
  }
  return writeJson(KEYS.profile, profile);
}

export function getProfile(): UserProfile | null {
  const stored = readJson(KEYS.profile);
  return isUserProfile(stored) ? stored : null;
}

export function saveCompletedActions(actions: CompletedAction[]): StorageWriteResult {
  return writeJson(KEYS.actions, sanitizeCompletedActions(actions));
}

export function getCompletedActions(): CompletedAction[] {
  return sanitizeCompletedActions(readJson(KEYS.actions));
}

export function saveHistory(history: FootprintHistoryEntry[]): StorageWriteResult {
  return writeJson(KEYS.history, history.slice(-12));
}

export function getHistory(): FootprintHistoryEntry[] {
  const stored = readJson(KEYS.history);
  if (!Array.isArray(stored)) return [];

  return stored.filter(isHistoryEntry).slice(-12);
}

export function appendHistory(
  history: FootprintHistoryEntry[],
  entry: FootprintHistoryEntry,
): FootprintHistoryEntry[] {
  const latest = history.at(-1);
  const isSameDay =
    latest && latest.recordedAt.split("T")[0] === entry.recordedAt.split("T")[0];

  if (isSameDay) {
    const updatedHistory = [...history];
    updatedHistory[updatedHistory.length - 1] = entry;
    return updatedHistory;
  }

  return [...history, entry].slice(-12);
}


function sanitizeCompletedActions(value: unknown): CompletedAction[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isCompletedAction)
    .map(({ actionId, completedAt }) => ({ actionId, completedAt }))
    .slice(-MAX_COMPLETED_ACTIONS);
}

function isCompletedAction(value: unknown): value is CompletedAction {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.actionId === "string" &&
    ACTION_IDS.has(item.actionId) &&
    typeof item.completedAt === "string" &&
    isValidDate(item.completedAt)
  );
}

function isHistoryEntry(value: unknown): value is FootprintHistoryEntry {
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

function isValidDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}
