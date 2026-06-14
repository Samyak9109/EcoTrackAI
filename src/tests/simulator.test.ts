import { describe, expect, it } from "vitest";
import { simulateAction } from "../utils/simulator";
import { BASE_PROFILE } from "./fixtures";

describe("simulateAction", () => {
  it("shows savings when a car commuter switches to bus", () => {
    const result = simulateAction(BASE_PROFILE, { transportMode: "bus" });
    expect(result.projected.breakdown.transport).toBeLessThan(
      result.current.breakdown.transport,
    );
    expect(result.deltaKg).toBeGreaterThan(0);
  });

  it("uses a reduced commute-day count", () => {
    const result = simulateAction(BASE_PROFILE, { commuteDaysPerMonth: 10 });
    expect(result.projected.breakdown.transport).toBe(18);
  });

  it("returns a signed delta when a scenario increases emissions", () => {
    const result = simulateAction(
      { ...BASE_PROFILE, transportMode: "bus" },
      { transportMode: "car" },
    );
    expect(result.deltaKg).toBeLessThan(0);
  });
});
