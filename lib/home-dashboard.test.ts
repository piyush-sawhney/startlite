import { describe, expect, it } from "vitest";
import {
  addGuestExpense,
  addGuestOrder,
  addGuestPayment,
  createGuestState,
  guestHomeDashboard,
  setGuestOrderStatus,
} from "./guest-store";
import { istDateString } from "./date";

describe("Home dashboard incomplete orders", () => {
  it("shows cross-day work before ready orders that still need payment", () => {
    let state = createGuestState("bakery");
    const today = istDateString();
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);

    const res1 = addGuestOrder(state, {
      customerName: "Ramesh",
      customerPhone: "9876543210",
      neededBy: yesterday,
      timeSlot: "10:00",
      lines: [
        {
          itemName: "Bread",
          quantity: "2",
          unitPrice: "450.00",
          unitLabel: "loaf",
        },
      ],
    });
    state = res1.state;
    const order1Id = state.orders[0].id;

    const res2 = addGuestOrder(state, {
      customerName: "Meena",
      customerPhone: "9876543211",
      neededBy: today,
      lines: [
        {
          itemName: "Cake",
          quantity: "1",
          unitPrice: "650.00",
          unitLabel: "kg",
        },
      ],
    });
    state = res2.state;
    const order2Id = state.orders[0].id;
    state = setGuestOrderStatus(state, order2Id, "ready");

    const dashboard = guestHomeDashboard(state, today);

    expect(dashboard.incompleteOrders.toFinishCount).toBe(1);
    expect(dashboard.incompleteOrders.readyCount).toBe(1);
    expect(dashboard.incompleteOrders.totalDue).toBe("₹1,550.00");
    expect(dashboard.incompleteOrders.orders.map((order) => order.customerName)).toEqual([
      "Ramesh",
      "Meena",
    ]);
    expect(dashboard.incompleteOrders.orders[0].neededBy).toBe(yesterday);
  });

  it("keeps a fully paid order until work is marked ready", () => {
    let state = createGuestState("bakery");
    const today = istDateString();

    const res = addGuestOrder(state, {
      customerName: "Sana",
      customerPhone: "9876543212",
      neededBy: today,
      status: "accepted",
      paidAmount: "8000.00",
      lines: [
        {
          itemName: "Bridal cake",
          quantity: "1",
          unitPrice: "8000.00",
          unitLabel: "cake",
        },
      ],
    });
    state = res.state;
    const orderId = state.orders[0].id;

    let dashboard = guestHomeDashboard(state, today);
    expect(dashboard.incompleteOrders.toFinishCount).toBe(1);
    expect(dashboard.incompleteOrders.orders[0].duePaise).toBe(0);

    state = setGuestOrderStatus(state, orderId, "ready");
    dashboard = guestHomeDashboard(state, today);
    expect(dashboard.incompleteOrders.totalCount).toBe(0);
  });

  it("removes a ready order after the full balance is collected", () => {
    let state = createGuestState("bakery");
    const today = istDateString();

    const res = addGuestOrder(state, {
      customerName: "Vikram",
      customerPhone: "9876543213",
      neededBy: today,
      lines: [
        {
          itemName: "Pastry",
          quantity: "1",
          unitPrice: "1200.00",
          unitLabel: "box",
        },
      ],
    });
    state = res.state;
    const orderId = state.orders[0].id;
    state = setGuestOrderStatus(state, orderId, "ready");

    let dashboard = guestHomeDashboard(state, today);
    expect(dashboard.incompleteOrders.readyCount).toBe(1);

    state = addGuestPayment(state, orderId, "1200.00", "upi");
    dashboard = guestHomeDashboard(state, today);

    expect(dashboard.incompleteOrders.totalCount).toBe(0);
  });

  it("keeps every order needed today in the day view, whatever its status", () => {
    let state = createGuestState("bakery");
    const today = istDateString();

    const res = addGuestOrder(state, {
      customerName: "Cancelled customer",
      neededBy: today,
      lines: [
        {
          itemName: "Cake",
          quantity: "1",
          unitPrice: "650.00",
          unitLabel: "kg",
        },
      ],
    });
    state = res.state;
    const orderId = state.orders[0].id;
    state = setGuestOrderStatus(state, orderId, "cancelled");

    const dashboard = guestHomeDashboard(state, today);
    const visible = [...dashboard.dayView.anyTime, ...dashboard.dayView.timeline];

    expect(visible.map((order) => order.id)).toContain(orderId);
    expect(visible.find((order) => order.id === orderId)?.status).toBe("cancelled");
  });

  it("does not cap the day view to the five rows visible on mobile", () => {
    let state = createGuestState("bakery");
    const today = istDateString();

    for (let index = 0; index < 7; index += 1) {
      const res = addGuestOrder(state, {
        customerName: `Customer ${index}`,
        neededBy: today,
        lines: [
          {
            itemName: "Bread",
            quantity: "1",
            unitPrice: "100.00",
            unitLabel: "loaf",
          },
        ],
      });
      state = res.state;
    }

    const dashboard = guestHomeDashboard(state, today);
    expect(
      dashboard.dayView.anyTime.length + dashboard.dayView.timeline.length,
    ).toBe(7);
  });

  it("computes the 5 KPI cells accurately including cash left", () => {
    let state = createGuestState("bakery");
    const today = istDateString();

    // Order 1: 500 total, 200 paid -> 300 due
    const res = addGuestOrder(state, {
      customerName: "A",
      customerPhone: "9000000001",
      neededBy: today,
      paidAmount: "200.00",
      lines: [
        {
          itemName: "Flour",
          quantity: "1",
          unitPrice: "500.00",
          unitLabel: "bag",
        },
      ],
    });
    state = res.state;

    // Add expense: 150
    state = addGuestExpense(state, {
      title: "Supplies",
      amount: "150.00",
      date: today,
    });

    const dashboard = guestHomeDashboard(state, today);

    // Today to collect: 300
    expect(dashboard.kpis.todayToCollect.amount).toBe("₹300.00");
    // Today paid: 200
    expect(dashboard.kpis.todayPaid.amount).toBe("₹200.00");
    // This week sales: 500
    expect(dashboard.kpis.thisWeekSales.amount).toBe("₹500.00");
    // This week expenses: 150
    expect(dashboard.kpis.thisWeekExpenses.amount).toBe("₹150.00");
    // This week cash left: 200 - 150 = 50
    expect(dashboard.kpis.thisWeekCashLeft.amount).toBe("₹50.00");
    expect(dashboard.kpis.thisWeekCashLeft.hint).toBe("Received − expenses · not profit");
  });
});
