import { describe, expect, it } from "vitest";
import { orderSummary } from "./order-summary";

describe("order summary on Home cards", () => {
  it("shows up to three item names, then folds the rest into a count", () => {
    expect(
      orderSummary(["Cake", "Bread", "Tea", "Cookie", "Jam"]),
    ).toBe("Cake, Bread, Tea · +2 more");
  });

  it("does not add a remainder when there are three or fewer items", () => {
    expect(orderSummary(["Cake", "Bread"])).toBe("Cake, Bread");
    expect(orderSummary(["Cake"])).toBe("Cake");
  });

  it("keeps a readable fallback for an order without item rows", () => {
    expect(orderSummary([])).toBe("1 item");
  });
});
