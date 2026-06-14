import { describe, expect, it } from "vitest";
import {
  calculateActionStreak,
  getActionSaving,
  getCompletedActionsSaving,
} from "../utils/actionTracking";

describe("action tracking helpers", () => {
  it("derives savings from the action library", () => {
    expect(getActionSaving("public-transport")).toBe(6.5);
    expect(
      getCompletedActionsSaving([
        { actionId: "public-transport", completedAt: "2026-06-14T08:00:00.000Z" },
        { actionId: "public-transport", completedAt: "2026-06-15T08:00:00.000Z" },
        { actionId: "reusable-kit", completedAt: "2026-06-14T09:00:00.000Z" },
      ]),
    ).toBe(7.5);
  });

  it("ignores completion records whose action no longer exists", () => {
    expect(
      getCompletedActionsSaving([
        { actionId: "removed-action", completedAt: "2026-06-14T08:00:00.000Z" },
      ]),
    ).toBe(0);
  });

  it("calculates a consecutive UTC-day streak", () => {
    const currentDate = new Date("2026-06-14T12:00:00.000Z");
    expect(
      calculateActionStreak(
        [
          { actionId: "reusable-kit", completedAt: "2026-06-14T08:00:00.000Z" },
          { actionId: "meal-plan", completedAt: "2026-06-13T08:00:00.000Z" },
          { actionId: "full-load", completedAt: "2026-06-12T08:00:00.000Z" },
        ],
        currentDate,
      ),
    ).toBe(3);
  });
});
