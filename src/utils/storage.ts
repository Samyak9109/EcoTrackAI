import type {
  CompletedAction,
  FootprintHistoryEntry,
  UserProfile,
} from "../types";

const KEYS = {
  profile: "ecotrack_profile",
  actions: "ecotrack_actions",
  history: "ecotrack_history",
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }
}

export function saveProfile(profile: UserProfile): void {
  writeJson(KEYS.profile, profile);
}

export function getProfile(): UserProfile | null {
  return readJson<UserProfile | null>(KEYS.profile, null);
}

export function saveCompletedActions(actions: CompletedAction[]): void {
  writeJson(KEYS.actions, actions);
}

export function getCompletedActions(): CompletedAction[] {
  const stored = readJson<Array<CompletedAction & { estimatedSavingKg?: number }>>(
    KEYS.actions,
    [],
  );
  return stored
    .filter(
      (item) =>
        typeof item?.actionId === "string" && typeof item?.completedAt === "string",
    )
    .map(({ actionId, completedAt }) => ({ actionId, completedAt }));
}

function saveHistory(history: FootprintHistoryEntry[]): void {
  writeJson(KEYS.history, history.slice(-12));
}

export function getHistory(): FootprintHistoryEntry[] {
  return readJson<FootprintHistoryEntry[]>(KEYS.history, []);
}

export function appendHistory(
  history: FootprintHistoryEntry[],
  entry: FootprintHistoryEntry,
): FootprintHistoryEntry[] {
  const latest = history.at(-1);
  if (latest && latest.totalKg === entry.totalKg && latest.score === entry.score) {
    return history;
  }
  const updatedHistory = [...history, entry].slice(-12);
  saveHistory(updatedHistory);
  return updatedHistory;
}
