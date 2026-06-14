import { describe, expect, it } from "vitest";
import {
  calculateCarbonFootprint,
  getHighestEmissionCategory,
} from "../utils/carbonCalculator";
import { BASE_PROFILE } from "./fixtures";

describe("calculateCarbonFootprint", () => {
  it("calculates transport emissions from distance, commute days, and mode", () => {
    const result = calculateCarbonFootprint(BASE_PROFILE);
    expect(result.breakdown.transport).toBe(39.6);
  });

  it("calculates electricity emissions and allows zero usage", () => {
    expect(calculateCarbonFootprint(BASE_PROFILE).breakdown.electricity).toBe(82);
    expect(
      calculateCarbonFootprint({
        ...BASE_PROFILE,
        electricityUnitsPerMonth: 0,
      }).breakdown.electricity,
    ).toBe(0);
  });

  it("adds all categories into the total footprint", () => {
    const result = calculateCarbonFootprint(BASE_PROFILE);
    const categoryTotal = Object.values(result.breakdown).reduce(
      (sum, value) => sum + value,
      0,
    );
    expect(result.totalKg).toBe(categoryTotal);
  });

  it("keeps the score between zero and one hundred", () => {
    expect(
      calculateCarbonFootprint({
        ...BASE_PROFILE,
        commuteKmPerDay: 1000,
        electricityUnitsPerMonth: 10000,
      }).score,
    ).toBe(0);
    expect(
      calculateCarbonFootprint({
        ...BASE_PROFILE,
        commuteKmPerDay: 0,
        electricityUnitsPerMonth: 0,
        dietType: "vegan",
        shoppingFrequency: "low",
        onlineOrdersPerMonth: 0,
      }).score,
    ).toBeLessThanOrEqual(100);
  });

  it("works when commute distance is zero", () => {
    const result = calculateCarbonFootprint({
      ...BASE_PROFILE,
      commuteKmPerDay: 0,
    });
    expect(result.breakdown.transport).toBe(0);
  });
});

describe("getHighestEmissionCategory", () => {
  it("returns the category with the largest value", () => {
    expect(
      getHighestEmissionCategory({
        transport: 20,
        electricity: 70,
        food: 40,
        shopping: 10,
        waste: 5,
      }),
    ).toBe("electricity");
  });
});
