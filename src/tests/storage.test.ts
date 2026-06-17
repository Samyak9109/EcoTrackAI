import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  appendHistory,
  getCompletedActions,
  getHistory,
  getProfile,
} from "../utils/storage";
import { BASE_PROFILE } from "./fixtures";

const values = new Map<string, string>();

beforeEach(() => {
  values.clear();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
});

describe("storage", () => {
  it("normalizes legacy completed actions by dropping copied savings", () => {
    values.set(
      "ecotrack_actions",
      JSON.stringify([
        {
          actionId: "public-transport",
          completedAt: "2026-06-14T08:00:00.000Z",
          estimatedSavingKg: 999,
        },
      ]),
    );

    expect(getCompletedActions()).toEqual([
      {
        actionId: "public-transport",
        completedAt: "2026-06-14T08:00:00.000Z",
      },
    ]);
  });

  it("rejects malformed and out-of-range profiles", () => {
    values.set(
      "ecotrack_profile",
      JSON.stringify({ ...BASE_PROFILE, transportMode: "spaceship" }),
    );
    expect(getProfile()).toBeNull();

    values.set(
      "ecotrack_profile",
      JSON.stringify({ ...BASE_PROFILE, electricityUnitsPerMonth: 999999 }),
    );
    expect(getProfile()).toBeNull();
  });

  it("returns a valid stored profile", () => {
    values.set("ecotrack_profile", JSON.stringify(BASE_PROFILE));
    expect(getProfile()).toEqual(BASE_PROFILE);
  });

  it("drops unknown actions and invalid timestamps", () => {
    values.set(
      "ecotrack_actions",
      JSON.stringify([
        { actionId: "unknown-action", completedAt: "2026-06-14T08:00:00.000Z" },
        { actionId: "public-transport", completedAt: "not-a-date" },
        { actionId: "public-transport", completedAt: "2026-06-14T08:00:00.000Z" },
      ]),
    );

    expect(getCompletedActions()).toEqual([
      {
        actionId: "public-transport",
        completedAt: "2026-06-14T08:00:00.000Z",
      },
    ]);
  });

  it("sanitizes stored history entries and keeps the latest twelve", () => {
    const validEntries = Array.from({ length: 14 }, (_, index) => ({
      recordedAt: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
      totalKg: 200 + index,
      score: 60,
    }));
    values.set(
      "ecotrack_history",
      JSON.stringify([
        { recordedAt: "invalid", totalKg: 10, score: 90 },
        { recordedAt: "2026-01-01T00:00:00.000Z", totalKg: -1, score: 90 },
        ...validEntries,
      ]),
    );

    expect(getHistory()).toEqual(validEntries.slice(-12));
  });

  it("ignores unexpectedly large stored values", () => {
    values.set("ecotrack_profile", " ".repeat(100_001));
    expect(getProfile()).toBeNull();
  });

  it("returns the existing history when the latest estimate is unchanged", () => {
    const history = [
      { recordedAt: "2026-06-14T08:00:00.000Z", totalKg: 200, score: 60 },
    ];
    expect(
      appendHistory(history, {
        recordedAt: "2026-06-14T09:00:00.000Z",
        totalKg: 200,
        score: 60,
      }),
    ).toBe(history);
  });
});
