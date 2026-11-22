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

describe("Home Dashboard & Order State Division", () => {
  it("divides orders into Ready to Collect and In Progress with Ready to Collect prioritized", () => {
    let state = createGuestState("bakery");
    const today = istDateString();

    // 1. Add order 1: open tab (in progress)
    const res1 = addGuestOrder(state, {
      customerName: "Ramesh",
      customerPhone: "9876543210",
      neededBy: today,
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

    // 2. Add order 2: completed work but payment pending (ready)
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

    // Ready to collect must have order2 (Meena)
    expect(dashboard.readyToCollect.count).toBe(1);
    expect(dashboard.readyToCollect.orders[0].customerName).toBe("Meena");
    expect(dashboard.readyToCollect.orders[0].due).toBe("₹650.00");

    // In progress must have order1 (Ramesh)
    expect(dashboard.inProgress.count).toBe(1);
    expect(dashboard.inProgress.orders[0].customerName).toBe("Ramesh");
    expect(dashboard.inProgress.orders[0].total).toBe("₹900.00");
  });

  it("moves an in-progress order to ready to collect when marked complete", () => {
    let state = createGuestState("bakery");
    const today = istDateString();

    const res = addGuestOrder(state, {
      customerName: "Sana",
      customerPhone: "9876543212",
      neededBy: today,
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
    expect(dashboard.inProgress.count).toBe(1);
    expect(dashboard.readyToCollect.count).toBe(0);

    // Merchant taps [Complete]
    state = setGuestOrderStatus(state, orderId, "ready");
    dashboard = guestHomeDashboard(state, today);

    expect(dashboard.inProgress.count).toBe(0);
    expect(dashboard.readyToCollect.count).toBe(1);
    expect(dashboard.readyToCollect.orders[0].customerName).toBe("Sana");
    expect(dashboard.readyToCollect.orders[0].due).toBe("₹8,000.00");

    // Undo reverts back to open_tab
    state = setGuestOrderStatus(state, orderId, "open_tab");
    dashboard = guestHomeDashboard(state, today);

    expect(dashboard.inProgress.count).toBe(1);
    expect(dashboard.readyToCollect.count).toBe(0);
  });

  it("removes order from ready to collect once fully settled", () => {
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
    expect(dashboard.readyToCollect.count).toBe(1);

    // Full payment collected
    state = addGuestPayment(state, orderId, "1200.00", "upi");
    dashboard = guestHomeDashboard(state, today);

    expect(dashboard.readyToCollect.count).toBe(0);
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
