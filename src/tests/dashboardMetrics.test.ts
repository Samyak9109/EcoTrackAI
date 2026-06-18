import { describe, expect, it } from "vitest";
import { calculateCarbonFootprint } from "../utils/carbonCalculator";
import { getDashboardMetrics } from "../utils/dashboardMetrics";
import { BASE_PROFILE } from "./fixtures";

const BASE_RESULT = calculateCarbonFootprint(BASE_PROFILE);

describe("getDashboardMetrics", () => {
  it("calculates recent completed actions using an injectable clock", () => {
    const now = Date.UTC(2026, 5, 17);
    const metrics = getDashboardMetrics(
      BASE_PROFILE,
      BASE_RESULT,
      [
        {
          actionId: "public-transport",
          completedAt: new Date(now - 2 * 86400000).toISOString(),
        },
        {
          actionId: "carpool",
          completedAt: new Date(now - 10 * 86400000).toISOString(),
        },
      ],
      [],
      now,
    );

    expect(metrics.currentWeekCount).toBe(1);
  });

  it("does not produce NaN when total footprint is zero", () => {
    const metrics = getDashboardMetrics(
      BASE_PROFILE,
      {
        ...BASE_RESULT,
        totalKg: 0,
        breakdown: {
          electricity: 0,
          food: 0,
          shopping: 0,
          transport: 0,
          waste: 0,
        },
      },
      [],
      [],
    );

    expect(metrics.highestCategoryShare).toBe(0);
  });
});

