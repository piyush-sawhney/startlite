import { describe, expect, it } from "vitest";
import {
  sortIncompleteOrders,
  summarizeIncompleteOrders,
} from "./home-orders";
import type { IncompleteOrder } from "./home-types";

function order(
  id: string,
  patch: Partial<IncompleteOrder> = {},
): IncompleteOrder {
  return {
    id,
    code: id,
    customerName: id,
    itemsSummary: "Item",
    total: "₹10.00",
    due: "₹10.00",
    duePaise: 1000,
    status: "accepted",
    neededBy: "2026-11-24",
    timeSlot: null,
    createdAt: "2026-11-23T10:00:00.000Z",
    ...patch,
  };
}

describe("Home incomplete-order queue", () => {
  it("prioritizes unfinished work, then scheduled date and time", () => {
    const orders = [
      order("ready", { status: "ready", neededBy: "2026-11-20", timeSlot: "09:00" }),
      order("unscheduled", { neededBy: "2026-11-20", createdAt: "2026-11-22T10:00:00.000Z" }),
      order("late-slot", { timeSlot: "14:00" }),
      order("early-date", { neededBy: "2026-11-23", timeSlot: "16:00" }),
      order("early-slot", { timeSlot: "09:00" }),
    ];

    expect(sortIncompleteOrders(orders).map((entry) => entry.id)).toEqual([
      "early-date",
      "early-slot",
      "late-slot",
      "unscheduled",
      "ready",
    ]);
  });

  it("summarizes every incomplete order but returns no more than ten rows", () => {
    const orders = Array.from({ length: 11 }, (_, index) =>
      order(`order-${index}`, { createdAt: `2026-11-${String(index + 1).padStart(2, "0")}T10:00:00.000Z` }),
    );

    const summary = summarizeIncompleteOrders(orders);

    expect(summary.totalCount).toBe(11);
    expect(summary.toFinishCount).toBe(11);
    expect(summary.readyCount).toBe(0);
    expect(summary.totalDuePaise).toBe(11000);
    expect(summary.orders).toHaveLength(10);
  });
});
