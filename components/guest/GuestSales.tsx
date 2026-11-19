"use client";

import { useMemo, useState } from "react";
import {
  EmptyState,
  PageHeader,
  StatusPill,
  inputClass,
  Label,
  primaryButton,
  quietButton,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  compileBill,
  compileReminder,
  formatNeededBy,
  whatsappLink,
} from "@/lib/bill";
import { formatPaise, fromPaise, multiplyPaise, toPaise } from "@/lib/paise";
import {
  addGuestOrder,
  addGuestPayment,
  guestDay,
  guestOrderTotals,
  guestOrdersNewestFirst,
  guestToday,
  setGuestOrderStatus,
  type GuestOrder,
  type GuestPaymentMode,
} from "@/lib/guest-store";
import { BackButton, SectionTitle, shortDate } from "./GuestBits";
import type { GuestViewProps } from "./types";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "paid", label: "Paid" },
] as const;

export function GuestSalesList({ state, go }: GuestViewProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();
    return guestOrdersNewestFirst(state).filter((order) => {
      const totals = guestOrderTotals(order);
      if (filter === "pending" && totals.status !== "open_tab") return false;
      if (filter === "paid" && totals.status !== "settled") return false;
      if (!search) return true;
      return [order.customerName, order.customerPhone, order.code]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search));
    });
  }, [state, filter, query]);

  return (
    <>
      <PageHeader
        title="Sales"
        subtitle={`${state.orders.length} orders`}
        action={
          <button
            type="button"
            className={primaryButton("px-3")}
            onClick={() => go({ kind: "new-sale" })}
          >
            Add sale
          </button>
        }
      />

      <input
        className={inputClass}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Name, phone, or order code"
        aria-label="Search sales"
      />

      <div className="mt-3 flex gap-2">
        {FILTERS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setFilter(entry.id)}
            className={
              filter === entry.id
                ? "rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white"
                : "rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink-muted"
            }
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {rows.length === 0 ? (
          <EmptyState
            title={query ? "No matching orders" : "No orders here yet"}
            body={
              query
                ? "Try a different name, phone, or order code."
                : "Add a sale and it appears here."
            }
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
            {rows.map((order, index) => {
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
                      <p className="truncate font-medium">
                        {order.customerName || "Walk-in sale"}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {order.code} · {shortDate(order.createdAt)} ·{" "}
                        {order.lines.length} item
                        {order.lines.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="tnum font-semibold">
                        {formatPaise(totals.totalPaise)}
                      </p>
                      <p
                        className={
                          totals.duePaise > 0
                            ? "text-xs font-semibold text-warning"
                            : "text-xs font-medium text-success"
                        }
                      >
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
        )}
      </div>
    </>
  );
}

type CartLine = {
  key: string;
  itemId: string;
  name: string;
  price: string;
  unitLabel: string;
  quantity: string;
};

export function GuestNewSale({
  state,
  update,
  go,
  back,
  toast,
  customer,
}: GuestViewProps & { customer?: { name: string; phone: string } }) {
  const [mode, setMode] = useState<"items" | "quick">(
    state.items.length > 0 ? "items" : "quick",
  );
  const [cart, setCart] = useState<CartLine[]>([]);
  const [quickAmount, setQuickAmount] = useState("");
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [note, setNote] = useState("");
  const [neededBy, setNeededBy] = useState<"today" | "tomorrow">("today");
  const [fullPaid, setFullPaid] = useState(true);
  const [paid, setPaid] = useState("");
  const [error, setError] = useState<string | null>(null);

  const items = [...state.items].sort((a, b) => a.sortOrder - b.sortOrder);
  const cartTotalPaise = cart.reduce(
    (total, line) => total + multiplyPaise(line.quantity, line.price),
    0,
  );
  const totalPaise =
    mode === "quick"
      ? Math.max(0, toPaise(quickAmount))
      : cartTotalPaise;

  function addItem(item: (typeof items)[number]) {
    setCart((current) => {
      const existing = current.find((line) => line.itemId === item.id);
      if (existing) {
        return current.map((line) =>
          line.itemId === item.id
            ? {
                ...line,
                quantity: String(
                  Math.max(0, Number(line.quantity) + 1).toFixed(2),
                ).replace(/\.00$/, ""),
              }
            : line,
        );
      }
      return [
        ...current,
        {
          key: `${item.id}_${Date.now()}`,
          itemId: item.id,
          name: item.name,
          price: item.price,
          unitLabel: item.unitLabel,
          quantity: "1",
        },
      ];
    });
  }

  function updateLine(key: string, quantity: string) {
    setCart((current) =>
      current.map((line) => (line.key === key ? { ...line, quantity } : line)),
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (totalPaise <= 0) {
      setError(
        mode === "quick"
          ? "Enter an amount above zero."
          : "Add at least one item.",
      );
      return;
    }

    const digits = phone.replace(/\D/g, "");
    if (phone.trim() && digits.length < 10) {
      setError("Enter a 10-digit phone number, or leave it empty.");
      return;
    }

    const paidPaise = fullPaid ? totalPaise : toPaise(paid);
    if (paidPaise > totalPaise) {
      setError("Paid is more than the total.");
      return;
    }

    const lines =
      mode === "quick"
        ? [
            {
              itemId: null,
              itemName: "Sale",
              quantity: "1",
              unitPrice: fromPaise(totalPaise),
              unitLabel: "sale",
            },
          ]
        : cart.map((line) => ({
            itemId: line.itemId,
            itemName: line.name,
            quantity: line.quantity,
            unitPrice: line.price,
            unitLabel: line.unitLabel,
          }));

    const result = addGuestOrder(state, {
      customerName: name,
      customerPhone: digits,
      note,
      neededBy: neededBy === "today" ? guestToday() : guestDay(1),
      lines,
      paidAmount: fromPaise(paidPaise),
      paymentMode: "cash",
    });

    if (!result.orderId) {
      setError("Sale not saved. Check the amount and try again.");
      return;
    }

    update(() => result.state);
    toast("Sale saved");
    go({ kind: "sale", id: result.orderId });
  }

  return (
    <>
      <BackButton onClick={back} label="Sales" />
      <PageHeader title="Add sale" subtitle="Three taps for a counter sale" />

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-md bg-muted p-1">
          <button
            type="button"
            onClick={() => setMode("items")}
            className={cn(
              "min-h-10 rounded-[9px] text-sm font-medium",
              mode === "items" ? "bg-surface shadow-sm" : "text-ink-muted",
            )}
          >
            Items
          </button>
          <button
            type="button"
            onClick={() => setMode("quick")}
            className={cn(
              "min-h-10 rounded-[9px] text-sm font-medium",
              mode === "quick" ? "bg-surface shadow-sm" : "text-ink-muted",
            )}
          >
            Quick amount
          </button>
        </div>

        {mode === "quick" ? (
          <div>
            <Label>Amount</Label>
            <input
              className={inputClass}
              inputMode="decimal"
              value={quickAmount}
              onChange={(event) => setQuickAmount(event.target.value)}
              placeholder="0.00"
              autoFocus
            />
            <p className="mt-1 text-xs text-ink-subtle">
              For a sale with no item list. The bill says “Sale”.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label>Add items</Label>
              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="rounded-md border border-dashed border-line px-3 py-4 text-sm text-ink-muted">
                    No items yet. Use quick amount, or add items in your menu.
                  </p>
                ) : (
                  items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!item.isAvailable}
                      onClick={() => addItem(item)}
                      className="flex w-full items-center justify-between gap-3 rounded-md border border-line bg-surface px-3 py-2.5 text-left disabled:opacity-50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {item.name}
                        </span>
                        <span className="block text-xs text-ink-muted">
                          {formatPaise(toPaise(item.price))} / {item.unitLabel}
                          {item.isAvailable ? "" : " · Sold out"}
                        </span>
                      </span>
                      <span className="text-sm font-semibold text-accent">
                        Add
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {cart.map((line) => (
              <div
                key={line.key}
                className="rounded-md border border-line bg-surface p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{line.name}</p>
                  <button
                    type="button"
                    className="text-xs text-danger"
                    onClick={() =>
                      setCart((current) =>
                        current.filter((entry) => entry.key !== line.key),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={quietButton("h-9 min-h-9 w-9 px-0")}
                      onClick={() =>
                        updateLine(
                          line.key,
                          String(Math.max(1, Number(line.quantity) - 1)),
                        )
                      }
                    >
                      −
                    </button>
                    <input
                      className="h-9 w-14 rounded-md border border-line text-center text-sm"
                      inputMode="decimal"
                      value={line.quantity}
                      onChange={(event) =>
                        updateLine(line.key, event.target.value)
                      }
                      aria-label={`Quantity for ${line.name}`}
                    />
                    <button
                      type="button"
                      className={quietButton("h-9 min-h-9 w-9 px-0")}
                      onClick={() =>
                        updateLine(
                          line.key,
                          String(Math.max(1, Number(line.quantity) + 1)),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="tnum text-sm font-semibold">
                    {formatPaise(multiplyPaise(line.quantity, line.price))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Name (optional)</Label>
            <input
              className={inputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Customer name"
            />
          </div>
          <div>
            <Label>Phone (optional)</Label>
            <input
              className={inputClass}
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="10-digit number"
            />
          </div>
        </div>

        <div>
          <Label>Note (optional)</Label>
          <input
            className={inputClass}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Delivery note or item detail"
          />
        </div>

        <div>
          <Label>Needed by</Label>
          <div className="flex gap-2">
            {(["today", "tomorrow"] as const).map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setNeededBy(entry)}
                className={cn(
                  "min-h-11 flex-1 rounded-md border px-3 text-sm font-medium capitalize",
                  neededBy === entry
                    ? "border-accent bg-accent-soft text-accent-strong"
                    : "border-line bg-surface text-ink-muted",
                )}
              >
                {entry}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={fullPaid}
            onChange={(event) => setFullPaid(event.target.checked)}
            className="h-4 w-4"
          />
          Full payment received
        </label>

        {!fullPaid ? (
          <div>
            <Label>Paid now</Label>
            <input
              className={inputClass}
              inputMode="decimal"
              value={paid}
              onChange={(event) => setPaid(event.target.value)}
              placeholder="0.00"
            />
          </div>
        ) : null}

        <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2.5">
          <span className="text-sm text-ink-muted">Total</span>
          <span className="tnum text-lg font-semibold">
            {formatPaise(totalPaise)}
          </span>
        </div>

        {error ? (
          <p
            className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger"
            aria-live="polite"
          >
            {error}
          </p>
        ) : null}

        <button className={primaryButton("w-full min-h-12")}>
          Save sale
        </button>
      </form>
    </>
  );
}

function billFor(order: GuestOrder, shop: GuestViewProps["state"]["shop"]) {
  const totals = guestOrderTotals(order);
  return compileBill({
    shopName: shop.name,
    billNo: String(order.billNo),
    date: new Date(order.createdAt),
    customerName: order.customerName || null,
    lines: order.lines.map((line) => ({
      quantity: line.quantity,
      name: line.itemName,
      option: line.optionName,
      extras: line.extras,
      unitPrice: line.unitPrice,
      lineTotal: fromPaise(
        multiplyPaise(line.quantity, line.unitPrice),
      ),
    })),
    total: fromPaise(totals.totalPaise),
    paid: fromPaise(totals.paidPaise),
    due: fromPaise(totals.duePaise),
    upiId: shop.upi || null,
    neededBy: formatNeededBy(order.neededBy),
    privacyMode: shop.privacyMode,
    bank:
      shop.bankName || shop.bankNumber || shop.bankIfsc
        ? {
            name: shop.bankName,
            number: shop.bankNumber,
            ifsc: shop.bankIfsc,
          }
        : null,
  });
}

export function GuestSaleDetail({
  state,
  update,
  go,
  back,
  toast,
  orderId,
}: GuestViewProps & { orderId: string }) {
  const order = state.orders.find((entry) => entry.id === orderId);
  const [showBill, setShowBill] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!order) {
    return (
      <>
        <BackButton onClick={back} label="Sales" />
        <EmptyState
          title="Order not found"
          body="It may have been removed from this phone."
          action={
            <button
              type="button"
              className={primaryButton()}
              onClick={() => go({ kind: "sales" })}
            >
              Back to sales
            </button>
          }
        />
      </>
    );
  }

  const totals = guestOrderTotals(order);
  const billText = billFor(order, state.shop);
  const reminderText = compileReminder({
    shopName: state.shop.name,
    billNo: String(order.billNo),
    date: new Date(order.createdAt),
    due: fromPaise(totals.duePaise),
    upiId: state.shop.upi || null,
    privacyMode: state.shop.privacyMode,
  });

  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast(message);
    } catch {
      toast("Copy did not work. Select the text and copy it.");
    }
  }

  return (
    <>
      <BackButton onClick={back} label="Sales" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {order.customerName || "Walk-in sale"}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {order.code} · {shortDate(order.createdAt)} · Bill {order.billNo}
          </p>
        </div>
        <StatusPill status={totals.status} />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
        {order.lines.map((line, index) => (
          <div
            key={line.id}
            className={`flex items-start justify-between gap-3 px-4 py-3 ${
              index > 0 ? "border-t border-line" : ""
            }`}
          >
            <div className="min-w-0">
              <p className="font-medium">
                {line.itemName}
                {line.optionName ? ` (${line.optionName})` : ""}
              </p>
              <p className="text-xs text-ink-muted">
                {line.quantity} × {formatPaise(toPaise(line.unitPrice))} /{" "}
                {line.unitLabel}
              </p>
              {line.note ? (
                <p className="mt-0.5 text-xs text-ink-subtle">{line.note}</p>
              ) : null}
            </div>
            <p className="tnum shrink-0 text-sm font-semibold">
              {formatPaise(multiplyPaise(line.quantity, line.unitPrice))}
            </p>
          </div>
        ))}
      </div>

      {order.note ? (
        <p className="mt-3 rounded-md bg-muted px-3 py-2.5 text-sm text-ink-muted">
          {order.note}
        </p>
      ) : null}

      <div className="mt-3 rounded-2xl border border-line bg-surface p-4">
        <div className="space-y-2">
          <Row label="Total" value={formatPaise(totals.totalPaise)} />
          <Row label="Paid" value={formatPaise(totals.paidPaise)} />
          <div className="border-t border-line pt-2">
            <Row
              label="Due"
              value={formatPaise(totals.duePaise)}
              strong
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-subtle">
          Needed by {formatNeededBy(order.neededBy) ?? "Today"}
        </p>
      </div>

      {totals.duePaise > 0 && order.status !== "cancelled" ? (
        <div className="mt-4">
          {!showPayment ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={primaryButton()}
                onClick={() => {
                  setShowPayment(true);
                  setPaymentError(null);
                }}
              >
                Log payment
              </button>
              <button
                type="button"
                className={quietButton()}
                onClick={() => {
                  update((current) =>
                    addGuestPayment(
                      current,
                      order.id,
                      fromPaise(totals.duePaise),
                      "cash",
                    ),
                  );
                  toast("Payment saved");
                }}
              >
                Mark paid
              </button>
            </div>
          ) : (
            <PaymentForm
              duePaise={totals.duePaise}
              error={paymentError}
              onCancel={() => setShowPayment(false)}
              onSave={(amount, mode) => {
                const value = Math.max(0, toPaise(amount));
                if (value <= 0) {
                  setPaymentError("Enter an amount above zero.");
                  return;
                }
                if (value > totals.duePaise) {
                  setPaymentError("Payment is more than the due.");
                  return;
                }
                update((current) =>
                  addGuestPayment(current, order.id, amount, mode),
                );
                setShowPayment(false);
                setPaymentError(null);
                toast("Payment saved");
              }}
            />
          )}
        </div>
      ) : null}

      {order.payments.length > 0 ? (
        <section className="mt-5">
          <SectionTitle>Payments</SectionTitle>
          <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {[...order.payments].reverse().map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium capitalize">
                    {payment.mode}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {shortDate(payment.paidAt)}
                  </p>
                </div>
                <p className="tnum text-sm font-semibold">
                  {formatPaise(toPaise(payment.amount))}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className={quietButton()}
          onClick={() => setShowBill((current) => !current)}
        >
          {showBill ? "Hide bill" : "Send bill"}
        </button>
        <button
          type="button"
          className={quietButton()}
          onClick={() => copy(billText, "Bill copied")}
        >
          Copy bill
        </button>
      </div>

      {showBill ? (
        <div className="mt-3 rounded-2xl border border-line bg-surface p-4">
          <pre className="whitespace-pre-wrap break-words font-sans text-[13px] leading-6 text-ink">
            {billText}
          </pre>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {order.customerPhone ? (
              <a
                href={whatsappLink(order.customerPhone, billText)}
                target="_blank"
                rel="noreferrer"
                className={primaryButton()}
              >
                WhatsApp
              </a>
            ) : (
              <button
                type="button"
                className={quietButton()}
                onClick={() => copy(billText, "Bill copied")}
              >
                Copy bill
              </button>
            )}
            <button
              type="button"
              className={quietButton()}
              onClick={() => copy(reminderText, "Reminder copied")}
            >
              Copy reminder
            </button>
          </div>
          {totals.duePaise > 0 && !order.customerPhone ? (
            <p className="mt-2 text-xs text-ink-subtle">
              Add a phone to the sale to open WhatsApp directly. You can still
              copy and send the bill yourself.
            </p>
          ) : null}
        </div>
      ) : null}

      {order.status !== "cancelled" ? (
        <div className="mt-6">
          {confirming ? (
            <div className="rounded-md border border-line bg-surface p-3">
              <p className="text-sm text-ink-muted">
                Cancel this sale? Past bills keep their records.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className={quietButton("text-danger")}
                  onClick={() => {
                    update((current) =>
                      setGuestOrderStatus(current, order.id, "cancelled"),
                    );
                    setConfirming(false);
                    toast("Sale cancelled");
                  }}
                >
                  Cancel sale
                </button>
                <button
                  type="button"
                  className={quietButton()}
                  onClick={() => setConfirming(false)}
                >
                  Keep
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="text-sm text-ink-subtle"
              onClick={() => setConfirming(true)}
            >
              Cancel this sale
            </button>
          )}
        </div>
      ) : (
        <p className="mt-6 text-center text-xs text-ink-subtle">
          This sale is cancelled. Past records are kept.
        </p>
      )}
    </>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={strong ? "font-semibold" : "text-sm text-ink-muted"}>
        {label}
      </span>
      <span
        className={
          strong ? "tnum text-xl font-semibold" : "tnum text-sm font-semibold"
        }
      >
        {value}
      </span>
    </div>
  );
}

function PaymentForm({
  duePaise,
  error,
  onSave,
  onCancel,
}: {
  duePaise: number;
  error: string | null;
  onSave: (amount: string, mode: GuestPaymentMode) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState(fromPaise(duePaise));
  const [mode, setMode] = useState<GuestPaymentMode>("cash");

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <Label>Amount</Label>
      <input
        className={inputClass}
        inputMode="decimal"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        autoFocus
      />

      <div className="mt-3 flex gap-2">
        {(["cash", "upi", "bank"] as const).map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setMode(entry)}
            className={cn(
              "min-h-10 flex-1 rounded-md border px-2 text-sm font-medium capitalize",
              mode === entry
                ? "border-accent bg-accent-soft text-accent-strong"
                : "border-line bg-surface text-ink-muted",
            )}
          >
            {entry}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mt-3 text-sm text-danger" aria-live="polite">
          {error}
        </p>
      ) : null}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className={primaryButton("flex-1")}
          onClick={() => onSave(amount, mode)}
        >
          Save payment
        </button>
        <button type="button" className={quietButton()} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
