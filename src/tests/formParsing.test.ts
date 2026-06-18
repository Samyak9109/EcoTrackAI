import { describe, expect, it } from "vitest";
import { TRANSPORT_OPTIONS } from "../config/constants/domainMetadata";
import { parseNumberInput, parseSelectValue } from "../utils/formParsing";

describe("form parsing", () => {
  it("keeps empty numeric input invalid instead of coercing it to zero", () => {
    expect(parseNumberInput("")).toBeNaN();
    expect(parseNumberInput("   ")).toBeNaN();
  });

  it("parses finite numeric input", () => {
    expect(parseNumberInput("12.5")).toBe(12.5);
  });

  it("falls back when a select value is not allowed", () => {
    expect(parseSelectValue("spaceship", TRANSPORT_OPTIONS, "car")).toBe("car");
    expect(parseSelectValue("bus", TRANSPORT_OPTIONS, "car")).toBe("bus");
  });
});

