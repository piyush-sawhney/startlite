import { describe, expect, it } from "vitest";
import { summarizeCustomerOrders } from "./customer-summary";

describe("customer summary", () => {
  it("counts every order and keeps lifetime billed and paid", () => {
    const summary = summarizeCustomerOrders([
      { status: "accepted", grandTotal: "100", paidTotal: "40", tdsTotal: "10" },
      { status: "completed", grandTotal: "200", paidTotal: "200", tdsTotal: "0" },
      { status: "cancelled", grandTotal: "300", paidTotal: "50", tdsTotal: "0" },
      { status: "declined", grandTotal: "50", paidTotal: "0", tdsTotal: "0" },
    ]);

    expect(summary.orderCount).toBe(4);
    expect(summary.completedCount).toBe(1);
    expect(summary.cancelledCount).toBe(2);
    expect(summary.openCount).toBe(1);
    expect(summary.totalBilled.toFixed(2)).toBe("650.00");
    expect(summary.totalPaid.toFixed(2)).toBe("290.00");
    expect(summary.pending.toFixed(2)).toBe("50.00");
  });

  it("excludes closed orders from dues and clamps negative balances", () => {
    const summary = summarizeCustomerOrders([
      { status: "completed", grandTotal: "900", paidTotal: "700", tdsTotal: "0" },
      { status: "cancelled", grandTotal: "100", paidTotal: "0", tdsTotal: "0" },
      { status: "ready", grandTotal: "100", paidTotal: "120", tdsTotal: "10" },
      { status: "accepted", grandTotal: "200", paidTotal: "50", tdsTotal: "20" },
    ]);

    expect(summary.pending.toFixed(2)).toBe("130.00");
    expect(summary.totalBilled.toFixed(2)).toBe("1300.00");
  });

  it("returns zeroes for a customer with no orders", () => {
    const summary = summarizeCustomerOrders([]);
    expect(summary.orderCount).toBe(0);
    expect(summary.totalPaid.toFixed(2)).toBe("0.00");
    expect(summary.pending.toFixed(2)).toBe("0.00");
  });
});
