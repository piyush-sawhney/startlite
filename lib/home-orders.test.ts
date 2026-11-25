import { describe, expect, it } from "vitest";
import {
  sortIncompleteOrders,
  summarizeIncompleteOrders,
} from "./home-orders";
import type { IncompleteOrder } from "./home-types";

const TODAY = "2026-11-24";

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
    neededBy: TODAY,
    timeSlot: null,
    createdAt: "2026-11-23T10:00:00.000Z",
    ...patch,
  };
}

describe("Home incomplete-order queue", () => {
  it("puts overdue work first, then today, then upcoming, then undated", () => {
    const orders = [
      order("undated", { neededBy: "" }),
      order("ready", { status: "ready", neededBy: "2026-11-20", timeSlot: "09:00" }),
      order("upcoming", { neededBy: "2026-11-25", timeSlot: "10:00" }),
      order("today-late", { timeSlot: "14:00" }),
      order("overdue-recent", { neededBy: "2026-11-23", timeSlot: "16:00" }),
      order("overdue-old-unscheduled", { neededBy: "2026-11-20" }),
      order("today-early", { timeSlot: "09:00" }),
    ];

    expect(sortIncompleteOrders(orders, TODAY).map((entry) => entry.id)).toEqual([
      "overdue-old-unscheduled",
      "overdue-recent",
      "today-early",
      "today-late",
      "upcoming",
      "undated",
      "ready",
    ]);
  });

  it("keeps work to finish ahead of ready work even when the ready order is overdue", () => {
    const orders = [
      order("ready-overdue", { status: "ready", neededBy: "2026-11-20" }),
      order("future-work", { neededBy: "2026-11-26", timeSlot: "10:00" }),
    ];

    expect(sortIncompleteOrders(orders, TODAY).map((entry) => entry.id)).toEqual([
      "future-work",
      "ready-overdue",
    ]);
  });

  it("uses the placed time as the final tiebreaker inside one slot", () => {
    const orders = [
      order("placed-later", { timeSlot: "10:00", createdAt: "2026-11-23T12:00:00.000Z" }),
      order("placed-earlier", { timeSlot: "10:00", createdAt: "2026-11-23T08:00:00.000Z" }),
    ];

    expect(sortIncompleteOrders(orders, TODAY).map((entry) => entry.id)).toEqual([
      "placed-earlier",
      "placed-later",
    ]);
  });

  it("summarizes every incomplete order but returns no more than ten rows", () => {
    const orders = Array.from({ length: 11 }, (_, index) =>
      order(`order-${index}`, {
        neededBy: TODAY,
        createdAt: `2026-11-${String(index + 1).padStart(2, "0")}T10:00:00.000Z`,
      }),
    );

    const summary = summarizeIncompleteOrders(orders, TODAY);

    expect(summary.totalCount).toBe(11);
    expect(summary.toFinishCount).toBe(11);
    expect(summary.readyCount).toBe(0);
    expect(summary.totalDuePaise).toBe(11000);
    expect(summary.orders).toHaveLength(10);
  });
});
