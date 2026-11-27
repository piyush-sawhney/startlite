import { describe, expect, it } from "vitest";
import { maskPhoneLast4 } from "./contact";

describe("maskPhoneLast4", () => {
  it("hides everything except the last four digits", () => {
    expect(maskPhoneLast4("9876543210")).toBe("••••••3210");
  });

  it("keeps short numbers and reports missing numbers", () => {
    expect(maskPhoneLast4("123")).toBe("123");
    expect(maskPhoneLast4(null)).toBe("No phone");
    expect(maskPhoneLast4("")).toBe("No phone");
  });

  it("ignores separators and a country code prefix", () => {
    expect(maskPhoneLast4("+91 98765 43210")).toBe("••••••••3210");
  });
});
