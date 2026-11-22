import { describe, expect, it } from "vitest";
import {
  formatAmount,
  formatCompactAmount,
  formatPlainAmount,
  money,
  multiply,
  sum,
} from "./money";

describe("money", () => {
  it("rounds half up to two decimals", () => {
    expect(money("10.005")).toBe("10.01");
    expect(money(2.345)).toBe("2.35");
  });

  it("adds without floating point drift", () => {
    expect(sum(["0.10", "0.20"])).toBe("0.30");
    expect(sum(["1150.00", "0.10", "-0.10"])).toBe("1150.00");
  });

  it("multiplies quantity by unit price", () => {
    expect(multiply("2", "500.00")).toBe("1000.00");
    expect(multiply("0.5", "99.90")).toBe("49.95");
  });

  it("formats Indian grouping with two decimals", () => {
    expect(formatAmount("100000")).toBe("₹1,00,000.00");
    expect(formatPlainAmount("1150")).toBe("1,150.00");
    expect(formatCompactAmount("104250")).toBe("₹1.04L");
    expect(formatCompactAmount("4250")).toBe("₹4,250.00");
  });
});
