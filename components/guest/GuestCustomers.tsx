"use client";

import {
  EmptyState,
  PageHeader,
  StatusPill,
  primaryButton,
} from "@/components/ui";
import { formatPaise } from "@/lib/paise";
import {
  guestCustomerOrders,
  guestCustomers,
  guestOrderTotals,
  type GuestCustomer,
} from "@/lib/guest-store";
import { BackButton, SectionTitle, shortDate } from "./GuestBits";
import type { GuestViewProps } from "./types";

export function GuestCustomersList({ state, go }: GuestViewProps) {
  const rows = guestCustomers(state);
  const withPending = rows.filter((row) => row.pendingPaise > 0).length;

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle={`${rows.length} people · ${withPending} with pending`}
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No customers yet"
          body="Add a sale with a name or phone, and the customer appears here."
          action={
            <button
              type="button"
              className={primaryButton()}
              onClick={() => go({ kind: "new-sale" })}
            >
              Add sale
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {rows.map((customer, index) => (
            <button
              key={customer.key}
              type="button"
              onClick={() => go({ kind: "customer", key: customer.key })}
              className={`block w-full px-4 py-3 text-left ${
                index > 0 ? "border-t border-line" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{customer.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {customer.phone || "No phone"}
                    {customer.lastPaidAt
                      ? ` · Paid ${shortDate(customer.lastPaidAt)}`
                      : " · No payments yet"}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={
                      customer.pendingPaise > 0
                        ? "tnum font-semibold text-ink"
                        : "tnum font-semibold text-ink-subtle"
                    }
                  >
                    {formatPaise(customer.pendingPaise)}
                  </p>
                  <p className="text-[11px] text-ink-subtle">
                    {customer.pendingPaise > 0 ? "Pending" : "No dues"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export function GuestCustomerDetail({
  state,
  go,
  back,
  customerKey,
}: GuestViewProps & { customerKey: string }) {
  const customer = guestCustomers(state).find(
    (entry) => entry.key === customerKey,
  );
  const orders = guestCustomerOrders(state, customerKey);

  if (!customer) {
    return (
      <>
        <BackButton onClick={back} label="Customers" />
        <EmptyState title="Customer not found" body="This record is not here." />
      </>
    );
  }

  return (
    <>
      <BackButton onClick={back} label="Customers" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {customer.name}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {customer.phone || "No phone"} · {customer.orderCount} order
            {customer.orderCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="text-right">
          <p className="tnum text-lg font-semibold">
            {formatPaise(customer.pendingPaise)}
          </p>
          <p className="text-[11px] text-ink-subtle">Pending</p>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className={primaryButton("w-full")}
          onClick={() =>
            go({
              kind: "new-sale",
              customer: { name: customer.name, phone: customer.phone },
            })
          }
        >
          Add sale for {customer.name.split(" ")[0]}
        </button>
      </div>

      <section className="mt-6">
        <SectionTitle>Orders</SectionTitle>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {orders.map((order, index) => {
            const totals = guestOrderTotals(order);
            return (
              <button
                key={order.id}
                type="button"
                onClick={() => go({ kind: "sale", id: order.id })}
                className={`block w-full px-4 py-3 text-left ${
                  index > 0 ? "border-t border-line" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-ink-muted">
                      {order.code} · {shortDate(order.createdAt)}
                    </p>
                    <p className="mt-1 truncate text-sm">
                      {order.lines
                        .map((line) => line.itemName)
                        .slice(0, 3)
                        .join(", ")}
                      {order.lines.length > 3 ? "…" : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tnum text-sm font-semibold">
                      {formatPaise(totals.totalPaise)}
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      {totals.duePaise > 0
                        ? `${formatPaise(totals.duePaise)} due`
                        : "Paid"}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <StatusPill status={totals.status} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <CustomerSummary customer={customer} />
    </>
  );
}

function CustomerSummary({ customer }: { customer: GuestCustomer }) {
  return (
    <section className="mt-5 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink-muted">Total billed</span>
        <span className="tnum text-sm font-semibold">
          {formatPaise(customer.totalPaise)}
        </span>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink-muted">Last payment</span>
        <span className="text-sm font-medium">
          {customer.lastPaidAt ? shortDate(customer.lastPaidAt) : "None"}
        </span>
      </div>
    </section>
  );
}
