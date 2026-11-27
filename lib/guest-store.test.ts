import { describe, expect, it } from "vitest";
import { localityAndPincode } from "./customer-address";
import {
  addGuestCustomer,
  addGuestItem,
  addGuestOrder,
  addGuestPayment,
  createGuestState,
  guestCustomers,
  guestHasContent,
  guestImportPayload,
  guestOrderTotals,
  guestSummary,
  normalizeGuestState,
  setGuestOrderStatus,
  updateGuestItem,
} from "./guest-store";

describe("guest store", () => {
  it("starts with a usable catalog and no content", () => {
    const state = createGuestState("bakery");
    expect(state.items).toHaveLength(3);
    expect(state.shop.name).toBe("My shop");
    expect(guestHasContent(state)).toBe(false);
    expect(guestImportPayload(state)).toBeNull();
  });

  it("totals a sale in paise without floating point drift", () => {
    const state = createGuestState("grocery");
    const result = addGuestOrder(state, {
      customerName: "Ramesh",
      customerPhone: "9876543210",
      lines: [
        {
          itemName: "Rice",
          quantity: "2",
          unitPrice: "60.00",
          unitLabel: "kg",
        },
        {
          itemName: "Oil",
          quantity: "0.5",
          unitPrice: "140.00",
          unitLabel: "litre",
        },
      ],
      paidAmount: "100.00",
    });

    const order = result.state.orders[0];
    const totals = guestOrderTotals(order);
    expect(totals.totalPaise).toBe(19000);
    expect(totals.paidPaise).toBe(10000);
    expect(totals.duePaise).toBe(9000);
    expect(totals.status).toBe("accepted");
  });

  it("completes a ready sale when the due is paid", () => {
    const state = createGuestState("food");
    const created = addGuestOrder(state, {
      customerName: "Meena",
      lines: [
        {
          itemName: "Veg thali",
          quantity: "1",
          unitPrice: "120.00",
          unitLabel: "plate",
        },
      ],
    });
    const ready = setGuestOrderStatus(created.state, created.orderId, "ready");
    const paid = addGuestPayment(ready, created.orderId, "120.00", "upi");
    const order = paid.orders[0];
    expect(guestOrderTotals(order).status).toBe("completed");
    expect(guestSummary(paid).pendingPaise).toBe(0);
    expect(guestSummary(paid).receivedTodayPaise).toBe(12000);
  });

  it("groups named and phone orders into customers", () => {
    let state = createGuestState("tailoring");
    state = addGuestOrder(state, {
      customerName: "Asha",
      customerPhone: "9000000001",
      lines: [
        { itemName: "Blouse", quantity: "1", unitPrice: "350.00", unitLabel: "piece" },
      ],
      paidAmount: "100.00",
    }).state;
    state = addGuestOrder(state, {
      customerName: "Asha",
      customerPhone: "9000000001",
      lines: [
        { itemName: "Alteration", quantity: "2", unitPrice: "100.00", unitLabel: "piece" },
      ],
    }).state;

    const customers = guestCustomers(state);
    expect(customers).toHaveLength(1);
    expect(customers[0].name).toBe("Asha");
    expect(customers[0].pendingPaise).toBe(45000);
    expect(customers[0].orderCount).toBe(2);
    expect(customers[0].completedCount).toBe(0);
    expect(customers[0].cancelledCount).toBe(0);
    expect(customers[0].paidPaise).toBe(10000);
  });

  it("counts cancelled orders without carrying their dues", () => {
    let state = createGuestState("bakery");
    state = addGuestOrder(state, {
      customerName: "Ravi",
      customerPhone: "9000000009",
      lines: [
        { itemName: "Cake", quantity: "1", unitPrice: "500.00", unitLabel: "cake" },
      ],
      paidAmount: "100.00",
    }).state;
    state = setGuestOrderStatus(state, state.orders[0].id, "cancelled");

    const customer = guestCustomers(state)[0];
    expect(customer.orderCount).toBe(1);
    expect(customer.cancelledCount).toBe(1);
    expect(customer.totalPaise).toBe(50000);
    expect(customer.paidPaise).toBe(10000);
    expect(customer.pendingPaise).toBe(0);
  });

  it("keeps the locality and pincode on a guest customer", () => {
    let state = createGuestState("grocery");
    state = addGuestCustomer(state, {
      name: "Meena",
      address: {
        line1: "12 Main Street",
        line2: "",
        line3: "",
        locality: "Kothrud",
        city: "Pune",
        state: "MH",
        country: "India",
        pincode: "411038",
      },
    });

    expect(localityAndPincode(guestCustomers(state)[0].address)).toBe(
      "Kothrud · 411038",
    );
  });

  it("marks custom catalog work as content and builds an import payload", () => {
    let state = createGuestState("salon");
    state = addGuestItem(state, {
      name: "Bridal package",
      price: "5000.00",
      unitLabel: "visit",
    });
    state = updateGuestItem(state, state.items[0].id, { isAvailable: false });

    expect(guestHasContent(state)).toBe(true);
    const payload = guestImportPayload(state);
    expect(payload?.items).toHaveLength(4);
    expect(payload?.items.some((item) => item.name === "Bridal package")).toBe(
      true,
    );
    expect(
      payload?.items.some(
        (item) => item.name === state.items[0].name && !item.isAvailable,
      ),
    ).toBe(true);
  });

  it("drops damaged records when reading storage", () => {
    const normalized = normalizeGuestState({
      shop: { name: "Corner shop", pack: "grocery" },
      items: [{ name: "" }, { name: "Rice", price: "oops" }],
      orders: [{ lines: [] }],
      expenses: [{ title: "", amount: "10" }],
    });

    expect(normalized).not.toBeNull();
    expect(normalized?.shop.name).toBe("Corner shop");
    expect(normalized?.items).toHaveLength(1);
    expect(normalized?.orders).toHaveLength(0);
    expect(normalized?.expenses).toHaveLength(0);
  });
});
