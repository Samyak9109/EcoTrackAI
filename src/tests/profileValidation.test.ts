import { describe, expect, it } from "vitest";
import {
  PROFILE_LIMITS,
  isUserProfile,
  validateProfile,
} from "../utils/profileValidation";
import { BASE_PROFILE } from "./fixtures";

describe("profile validation", () => {
  it("accepts a valid profile", () => {
    expect(validateProfile(BASE_PROFILE)).toEqual({});
    expect(isUserProfile(BASE_PROFILE)).toBe(true);
  });

  it("reports numeric values outside the supported range", () => {
    const errors = validateProfile({
      ...BASE_PROFILE,
      commuteKmPerDay: PROFILE_LIMITS.commuteKmPerDay + 1,
      electricityUnitsPerMonth: -1,
      onlineOrdersPerMonth: Number.NaN,
    });

    expect(errors).toHaveProperty("commuteKmPerDay");
    expect(errors).toHaveProperty("electricityUnitsPerMonth");
    expect(errors).toHaveProperty("onlineOrdersPerMonth");
  });

  it("rejects invalid enum and boolean values from untrusted data", () => {
    expect(
      isUserProfile({
        ...BASE_PROFILE,
        dietType: "invalid",
        recyclesWaste: "yes",
      }),
    ).toBe(false);
  });
});
