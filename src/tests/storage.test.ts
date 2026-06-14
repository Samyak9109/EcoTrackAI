import { beforeEach, describe, expect, it, vi } from "vitest";
import { appendHistory, getCompletedActions } from "../utils/storage";

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
