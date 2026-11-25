"use client";

import { useState } from "react";
import {
  addGuestCustomer,
  addGuestExpense,
  addGuestItem,
  addGuestPayment,
  guestHomeDashboard,
  setGuestOrderStatus,
  updateGuestShop,
  type GuestPaymentMode,
} from "@/lib/guest-store";
import { istDateString } from "@/lib/date";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import type { GuestViewProps } from "./types";

export function GuestHome({ state, update, go, toast }: GuestViewProps) {
  const [day, setDay] = useState(istDateString());
  const data = guestHomeDashboard(state, day);
  // A shop exists once the merchant has added any record. This decides whether
  // the first-run launch sheet is shown; today's KPI counts must not decide it.
  const hasLocalShop =
    state.items.length > 0 ||
    state.customers.length > 0 ||
    state.orders.length > 0 ||
    state.expenses.length > 0;

  return (
    <HomeDashboard
      initialData={data}
      isOwner={false}
      onGuestAction={(action, id) => {
        if (action === "add-sale") {
          go({ kind: "new-sale" });
        } else if (action === "customer") {
          if (id) go({ kind: "customer", key: id });
          else go({ kind: "customers" });
        } else if (action === "item") {
          go({ kind: "catalog" });
        } else if (action === "expense") {
          go({ kind: "expenses" });
        } else if (action === "sale" && id) {
          go({ kind: "sale", id });
        } else if (action === "sales") {
          go({ kind: "sales" });
        }
      }}
      onGuestPayment={async (orderId, amount, mode) => {
        update((current) =>
          addGuestPayment(
            current,
            orderId,
            amount,
            (mode as GuestPaymentMode) || "upi",
          ),
        );
        toast("Payment recorded");
      }}
      onGuestStatusChange={(orderId, status) => {
        update((current) => setGuestOrderStatus(current, orderId, status));
      }}
      onGuestAddCustomer={(customer) => {
        update((current) =>
          addGuestCustomer(current, {
            name: customer.name,
            countryCode: customer.countryCode,
            phone: customer.phone,
            subLabel: customer.subLabel,
            address: customer.address
              ? {
                  line1: customer.address.line1,
                  line2: customer.address.line2 ?? "",
                  line3: customer.address.line3 ?? "",
                  city: customer.address.city ?? "",
                  state: customer.address.state ?? "",
                  country: customer.address.country,
                  pincode: customer.address.pincode ?? "",
                }
              : null,
          }),
        );
        toast(`Customer ${customer.name} added`);
      }}
      onGuestAddItem={(item) => {
        update((current) =>
          addGuestItem(current, {
            name: item.name,
            price: item.basePrice,
            unitLabel: item.unitLabel,
            category: item.category,
            description: item.description,
            photo: item.photo,
            variants: item.variants,
            availability: item.availability,
          }),
        );
        toast(`Item ${item.name} added`);
      }}
      onGuestAddExpense={(expense) => {
        update((current) =>
          addGuestExpense(current, {
            title: expense.paidTo,
            paidFor: expense.paidFor,
            amount: expense.amount,
            date: expense.date || istDateString(),
          }),
        );
        toast(`Expense ₹${expense.amount} recorded`);
      }}
      onGuestRenameShop={(name) => {
        update((current) => updateGuestShop(current, { name }));
        toast("Shop name saved");
      }}
      onGuestSelectDay={(next) => setDay(next)}
      hasLocalShop={hasLocalShop}
    />
  );
}
