import { useMemo, useState } from "react";
import type {
  CompletedAction,
  FootprintHistoryEntry,
  UserProfile,
} from "../types";
import { calculateCarbonFootprint } from "../utils/carbonCalculator";
import {
  appendHistory,
  getCompletedActions,
  getHistory,
  getProfile,
  saveCompletedActions,
  saveHistory,
  saveProfile,
  type StorageWriteResult,
} from "../services/storageService";

function getStorageError(status: StorageWriteResult): string | null {
  return status.ok ? null : status.message;
}

export function useEcoTrackState() {
  const [profile, setProfile] = useState<UserProfile | null>(() => getProfile());
  const [completedActions, setCompletedActions] = useState<CompletedAction[]>(
    () => getCompletedActions(),
  );
  const [history, setHistory] = useState<FootprintHistoryEntry[]>(() => getHistory());
  const [storageError, setStorageError] = useState<string | null>(null);
  const result = useMemo(
    () => (profile ? calculateCarbonFootprint(profile) : null),
    [profile],
  );

  function saveProfileState(nextProfile: UserProfile) {
    const profileStatus = saveProfile(nextProfile);
    setProfile(nextProfile);

    const nextResult = calculateCarbonFootprint(nextProfile);
    const entry = {
      recordedAt: new Date().toISOString(),
      totalKg: nextResult.totalKg,
      score: nextResult.score,
    };

    const nextHistory = appendHistory(history, entry);
    const historyStatus: StorageWriteResult =
      nextHistory === history ? { ok: true } : saveHistory(nextHistory);
    setHistory(nextHistory);

    setStorageError(getStorageError(profileStatus) ?? getStorageError(historyStatus));
  }

  function saveCompletedActionState(items: CompletedAction[]) {
    const status = saveCompletedActions(items);
    setCompletedActions(items);
    setStorageError(getStorageError(status));
  }

  return {
    completedActions,
    history,
    profile,
    result,
    storageError,
    saveCompletedActionState,
    saveProfileState,
  };
}

