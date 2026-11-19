import { describe, expect, it } from "vitest";
import {
  compileBill,
  compileOrderAccepted,
  compileOrderDeclined,
  compileOrderReady,
  compilePaymentReceived,
  compileReminder,
  formatNeededBy,
  upiUri,
  whatsappLink,
} from "./bill";

const bill = {
  shopName: "Anita's Bakes",
  billNo: "42",
  date: new Date(2026, 10, 18),
  customerName: "Rohan Mehta",
  lines: [
    {
      quantity: "2",
      name: "Chocolate cake",
      option: "500 g",
      extras: [{ name: "Eggless extra", priceDelta: "50.00" }],
      unitPrice: "450.00",
      lineTotal: "1000.00",
    },
  ],
  total: "1000.00",
  paid: "400.00",
  due: "600.00",
  upiId: "anita@okhdfcbank",
  neededBy: "Today",
};

describe("bill text", () => {
  it("renders the WhatsApp layout", () => {
    const text = compileBill(bill);
    expect(text).toContain("*Anita's Bakes*");
    expect(text).toContain("Bill 42 · 18 Nov 2026");
    expect(text).toContain("2 × Chocolate cake (500 g)   ₹900.00");
    expect(text).toContain("Eggless extra   +₹100.00");
    expect(text).toContain("Total    ₹1,000.00");
    expect(text).toContain("Paid     ₹400.00");
    expect(text).toContain("Due      ₹600.00");
    expect(text).toContain("Pay by UPI: anita@okhdfcbank");
    expect(text).toContain("Needed by: Today");
    expect(text.trim().endsWith("StartLite · Simple shop catalog & ledger")).toBe(
      true,
    );
  });

  it("hides UPI when nothing is due", () => {
    const text = compileBill({ ...bill, due: "0.00", upiId: "anita@okhdfcbank" });
    expect(text).not.toContain("Pay by UPI");
  });

  it("hides the shop and item names in privacy mode", () => {
    const text = compileBill({ ...bill, privacyMode: true });
    expect(text).toContain("*Consultation Receipt*");
    expect(text).not.toContain("Anita's Bakes");
    expect(text).not.toContain("Chocolate cake");
    expect(text).toContain("2 × Service   ₹900.00");
    expect(text).toContain("Total    ₹1,000.00");
  });

  it("adds a bank block only when details are present", () => {
    const text = compileBill({
      ...bill,
      bank: {
        name: "Anita Sharma",
        number: "1234567890",
        ifsc: "HDFC0000123",
      },
    });
    expect(text).toContain("Bank transfer");
    expect(text).toContain("A/c 1234567890");
    expect(text).toContain("IFSC HDFC0000123");
    expect(compileBill(bill)).not.toContain("Bank transfer");
  });

  it("makes a short reminder", () => {
    const text = compileReminder({
      shopName: "Anita's Bakes",
      billNo: "42",
      date: new Date(2026, 10, 18),
      due: "600.00",
      upiId: "anita@okhdfcbank",
    });
    expect(text).toBe(
      "*Anita's Bakes*\nBill 42 · 18 Nov 2026\nDue ₹600.00\n\nPay by UPI: anita@okhdfcbank",
    );
  });

  it("formats needed-by words", () => {
    const today = new Date(Date.now() + 5.5 * 3600_000)
      .toISOString()
      .slice(0, 10);
    expect(formatNeededBy(today)).toBe("Today");
    expect(formatNeededBy("2027-03-09")).toBe("9 Mar 2027");
    expect(formatNeededBy(null)).toBeNull();
  });

  it("builds a total-only UPI link", () => {
    expect(
      upiUri({
        upiId: "anita@okhdfcbank",
        name: "Anita's Bakes",
        amount: "600",
      }),
    ).toBe(
      "upi://pay?pa=anita%40okhdfcbank&pn=Anita%27s+Bakes&am=600.00&cu=INR",
    );
  });

  it("adds the country code to a ten digit WhatsApp number", () => {
    expect(whatsappLink("9876543210", "Hi")).toBe(
      "https://wa.me/919876543210?text=Hi",
    );
  });

  it("compiles order accepted message", () => {
    const text = compileOrderAccepted({
      shopName: "Anita's Bakes",
      orderCode: "K39P",
      customerName: "Rohan",
      total: "570.00",
      neededBy: "Tomorrow",
    });
    expect(text).toContain("*Order Confirmed · Anita's Bakes*");
    expect(text).toContain("Namaste Rohan!");
    expect(text).toContain("#K39P");
    expect(text).toContain("₹570.00");
  });

  it("compiles order ready message", () => {
    const text = compileOrderReady({
      shopName: "Anita's Bakes",
      orderCode: "K39P",
      customerName: "Rohan",
      due: "570.00",
      upiId: "anita@okhdfcbank",
    });
    expect(text).toContain("*Order Ready · Anita's Bakes*");
    expect(text).toContain("Amount due: ₹570.00");
    expect(text).toContain("anita@okhdfcbank");
  });

  it("compiles order declined message", () => {
    const text = compileOrderDeclined({
      shopName: "Anita's Bakes",
      orderCode: "K39P",
      customerName: "Rohan",
      reason: "Out of fresh strawberries",
    });
    expect(text).toContain("*Order Update · Anita's Bakes*");
    expect(text).toContain("Out of fresh strawberries");
  });

  it("compiles payment received receipt", () => {
    const text = compilePaymentReceived({
      shopName: "Anita's Bakes",
      customerName: "Rohan",
      billNo: "42",
      amountPaid: "570.00",
      remainingDue: "0.00",
    });
    expect(text).toContain("*Payment Received · Anita's Bakes*");
    expect(text).toContain("Bill 42");
    expect(text).toContain("Fully Settled");
  });
});
