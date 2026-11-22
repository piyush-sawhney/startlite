import { describe, expect, it } from "vitest";
import {
  addPaise,
  formatCompactPaise,
  formatPaise,
  fromPaise,
  multiplyPaise,
  toPaise,
} from "./paise";

describe("paise", () => {
  it("parses amounts without floats", () => {
    expect(toPaise("450.5")).toBe(45050);
    expect(toPaise("0.10")).toBe(10);
    expect(toPaise("bad")).toBe(0);
  });

  it("formats back to rupees", () => {
    expect(fromPaise(115000)).toBe("1150.00");
    expect(formatPaise(115000)).toBe("₹1,150.00");
    expect(formatCompactPaise(10425000)).toBe("₹1.04L");
    expect(formatCompactPaise(425000)).toBe("₹4,250.00");
  });

  it("adds and multiplies", () => {
    expect(addPaise("450.00", "50.00")).toBe(50000);
    expect(multiplyPaise("2", "450.00")).toBe(90000);
    expect(multiplyPaise("0.5", "99.90")).toBe(4995);
  });
});
