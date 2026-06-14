import { describe, expect, it } from "vitest";
import { generateAssistantReply } from "../utils/assistantEngine";
import { calculateCarbonFootprint } from "../utils/carbonCalculator";
import { BASE_PROFILE } from "./fixtures";

const result = calculateCarbonFootprint(BASE_PROFILE);

describe("generateAssistantReply", () => {
  it("returns seven actions for a seven-day plan", () => {
    const reply = generateAssistantReply(
      "Give me a 7 day plan",
      BASE_PROFILE,
      result,
    );
    expect(reply.intent).toBe("seven_day_plan");
    expect(reply.suggestedActions).toHaveLength(7);
    expect(reply.message).toContain("Day 7:");
  });

  it("still returns seven actions for an already low-impact profile", () => {
    const lowImpactProfile = {
      ...BASE_PROFILE,
      commuteKmPerDay: 0,
      transportMode: "walk" as const,
      electricityUnitsPerMonth: 0,
      dietType: "vegan" as const,
      onlineOrdersPerMonth: 0,
      shoppingFrequency: "low" as const,
      recyclesWaste: true,
    };
    const reply = generateAssistantReply(
      "Create a weekly plan",
      lowImpactProfile,
      calculateCarbonFootprint(lowImpactProfile),
    );
    expect(reply.suggestedActions).toHaveLength(7);
  });

  it("returns personalized transport advice", () => {
    const reply = generateAssistantReply(
      "How can I reduce transport emissions?",
      BASE_PROFILE,
      result,
    );
    expect(reply.intent).toBe("transport_help");
    expect(reply.message).toContain("10 km");
    expect(reply.suggestedActions.every((action) => action.category === "transport")).toBe(
      true,
    );
  });

  it("explains a score using the biggest category", () => {
    const reply = generateAssistantReply(
      "Why is my score low?",
      BASE_PROFILE,
      result,
    );
    expect(reply.intent).toBe("score_explanation");
    expect(reply.message).toContain(`${result.score}/100`);
    expect(reply.message).toContain(result.highestCategory);
  });

  it("returns general personalized advice for an unknown message", () => {
    const reply = generateAssistantReply("Hello there", BASE_PROFILE, result);
    expect(reply.intent).toBe("general_reduce");
    expect(reply.message).toContain(result.highestCategory);
    expect(reply.suggestedActions.length).toBeGreaterThan(0);
  });
});
