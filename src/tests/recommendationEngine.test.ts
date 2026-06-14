import { describe, expect, it } from "vitest";
import { calculateCarbonFootprint } from "../utils/carbonCalculator";
import {
  generateRecommendations,
  getActionsForCategory,
} from "../utils/recommendationEngine";
import { BASE_PROFILE } from "./fixtures";

describe("generateRecommendations", () => {
  it("prioritizes transport actions for a high-transport profile", () => {
    const profile = {
      ...BASE_PROFILE,
      commuteKmPerDay: 100,
      electricityUnitsPerMonth: 0,
      dietType: "vegan" as const,
      shoppingFrequency: "low" as const,
      onlineOrdersPerMonth: 0,
    };
    const result = calculateCarbonFootprint(profile);
    const actions = generateRecommendations(profile, result, 3);
    expect(result.highestCategory).toBe("transport");
    expect(actions.every((action) => action.category === "transport")).toBe(true);
  });

  it("prioritizes electricity actions for a high-electricity profile", () => {
    const profile = {
      ...BASE_PROFILE,
      commuteKmPerDay: 0,
      electricityUnitsPerMonth: 600,
      dietType: "vegan" as const,
      usesACDaily: true,
    };
    const result = calculateCarbonFootprint(profile);
    const actions = generateRecommendations(profile, result, 3);
    expect(result.highestCategory).toBe("electricity");
    expect(actions.every((action) => action.category === "electricity")).toBe(true);
  });

  it("does not give a vegetarian user beginner meat-reduction actions", () => {
    const profile = { ...BASE_PROFILE, dietType: "vegetarian" as const };
    const actions = generateRecommendations(
      profile,
      calculateCarbonFootprint(profile),
      18,
    );
    expect(actions.map((action) => action.id)).not.toContain("vegetarian-meals");
    expect(actions.map((action) => action.id)).not.toContain("meat-free-day");
  });

  it("gives an existing recycler an advanced sorting action", () => {
    const actions = getActionsForCategory("waste", BASE_PROFILE, 5);
    expect(actions.map((action) => action.id)).toContain("recycling-check");
    expect(actions.map((action) => action.id)).not.toContain("separate-waste");
  });
});
