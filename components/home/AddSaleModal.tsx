"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicItem } from "@/lib/queries";
import { AddItemModal, type ItemInput } from "./AddItemModal";
import { AddCustomerModal, type CustomerInput } from "./AddCustomerModal";
import { SheetClose } from "./SheetClose";
import { inputClass, Label, primaryButton, quietButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  addPaise,
  formatPaise,
  fromPaise,
  multiplyPaise,
  toPaise,
} from "@/lib/paise";
import type { IncompleteOrder } from "@/lib/home-types";

type CustomerSummary = {
  id: string;
  name: string;
  phone: string | null;
  pendingTotal: string;
};

type CartLine = {
  key: string;
  item: PublicItem;
  optionId: string | null;
  extraIds: string[];
  quantity: string;
  note: string;
};

type PaymentChoice = "full" | "partial" | "due";
type PaymentMode = "cash" | "upi" | "card" | "bank" | "other";

const PAYMENT_MODES: Array<{ id: PaymentMode; label: string }> = [
  { id: "cash", label: "Cash" },
  { id: "upi", label: "UPI" },
  { id: "card", label: "Card" },
  { id: "bank", label: "Bank" },
  { id: "other", label: "Other" },
];

function lineUnitPaise(
  item: PublicItem,
  optionId: string | null,
  extraIds: string[],
) {
  const option = item.options.find((entry) => entry.id === optionId);
  const base =
    item.priceMode === "quote" ? "0" : option?.price ?? item.basePrice;
  const extras = item.extras.filter(
    (extra) =>
      extraIds.includes(extra.id) &&
      (extra.optionId === null || extra.optionId === optionId),
  );
  return addPaise(base, ...extras.map((extra) => extra.priceDelta));
}

/** Extras and sub-variants, grouped by their label for the chosen option. */
function groupedExtras(item: PublicItem, optionId: string | null) {
  const visible = item.extras.filter(
    (extra) =>
      extra.isAvailable &&
      (extra.optionId === null || extra.optionId === optionId),
  );
  const groups = new Map<string, typeof visible>();
  for (const extra of visible) {
    const label = extra.groupLabel || "Extra";
    groups.set(label, [...(groups.get(label) ?? []), extra]);
  }
  return [...groups.entries()];
}

function lineTotalPaise(line: CartLine) {
  return multiplyPaise(
    line.quantity || "0",
    fromPaise(lineUnitPaise(line.item, line.optionId, line.extraIds)),
  );
}

function todayString() {
  return new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
}

export function AddSaleModal({
  isOpen,
  onClose,
  initialItems,
  dueOrders,
  onComplete,
  onAddItem,
  onAddCustomer,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialItems: PublicItem[];
  dueOrders: IncompleteOrder[];
  onComplete: (message?: string) => void;
  onAddItem: (data: ItemInput) => Promise<void>;
  onAddCustomer: (data: CustomerInput) => Promise<void>;
}) {
  const [tab, setTab] = useState<"sale" | "payment">("sale");
  const [mode, setMode] = useState<"items" | "quick">("items");
  const [quickAmount, setQuickAmount] = useState("");
  const [items, setItems] = useState<PublicItem[]>(initialItems);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSummary | null>(null);
  const [customerQuery, setCustomerQuery] = useState("");
  const [itemQuery, setItemQuery] = useState("");
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);

  const [when, setWhen] = useState<"now" | "later">("now");
  const [laterDate, setLaterDate] = useState(todayString());
  const [laterTime, setLaterTime] = useState("10:00");
  const [estimate, setEstimate] = useState(false);

  const [paymentChoice, setPaymentChoice] = useState<PaymentChoice>("full");
  const [paid, setPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");
  const [note, setNote] = useState("");

  const [payOrderId, setPayOrderId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState<PaymentMode>("cash");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // A nested add-item / add-customer sheet owns Escape. Without this, the
  // dashboard would close the whole sale and lose the cart.
  useEffect(() => {
    if (!showNewItem && !showNewCustomer) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      setShowNewItem(false);
      setShowNewCustomer(false);
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [showNewItem, showNewCustomer]);

  // Reset the form only when the sheet opens, never when items refresh after
  // an inline add (that would wipe the cart).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setTab("sale");
      setMode("items");
      setQuickAmount("");
      setCart([]);
      setSelectedCustomer(null);
      setCustomerQuery("");
      setItemQuery("");
      setWhen("now");
      setLaterDate(todayString());
      setLaterTime("10:00");
      setEstimate(false);
      setPaymentChoice("full");
      setPaid("");
      setPaymentMode("cash");
      setNote("");
      setPayOrderId("");
      setPayAmount("");
      setPayMode("cash");
      setError(null);
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  // Load customers and fresh items when the sheet opens.
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setItems(initialItems);
    let cancelled = false;
    async function load() {
      try {
        const [customersRes, itemsRes] = await Promise.all([
          fetch("/api/v1/merchant/customers"),
          fetch("/api/v1/merchant/catalog"),
        ]);
        if (cancelled) return;
        if (customersRes.ok) {
          const body = await customersRes.json();
          setCustomers(body.data.customers ?? []);
        }
        if (itemsRes.ok) {
          const body = await itemsRes.json();
          setItems(body.data.items ?? initialItems);
        }
      } catch {
        // Keep the initial items; the sale still works.
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isOpen, initialItems]);

  if (!isOpen) return null;

  const customerSearch = customerQuery.trim().toLowerCase();
  const customerMatches = customerSearch
    ? customers
        .filter(
          (entry) =>
            entry.name.toLowerCase().includes(customerSearch) ||
            (entry.phone ?? "").includes(customerSearch.replace(/\D/g, "")),
        )
        .slice(0, 6)
    : [];

  const itemSearch = itemQuery.trim().toLowerCase();
  const visibleItems = itemSearch
    ? items.filter((item) => item.name.toLowerCase().includes(itemSearch))
    : items;

  const cartTotalPaise =
    mode === "quick"
      ? Math.max(0, toPaise(quickAmount))
      : cart.reduce((total, line) => total + lineTotalPaise(line), 0);
  const paidPaise =
    paymentChoice === "full"
      ? cartTotalPaise
      : paymentChoice === "due"
        ? 0
        : Math.min(Math.max(0, toPaise(paid)), cartTotalPaise);
  const duePaise = Math.max(0, cartTotalPaise - paidPaise);

  const previewStatus =
    when === "later"
      ? estimate
        ? "waiting_client"
        : "accepted"
      : duePaise === 0 && cartTotalPaise > 0
        ? "completed"
        : "ready";

  // Plain outcome instead of an internal status name.
  const outcome =
    previewStatus === "completed"
      ? "Paid in full"
      : previewStatus === "ready"
        ? "Payment pending"
        : previewStatus === "accepted"
          ? "Booked"
          : "Estimate";

  const payOrder = dueOrders.find((order) => order.id === payOrderId) ?? null;
  const payDuePaise = payOrder?.duePaise ?? 0;

  function addItemToCart(item: PublicItem) {
    const firstOption =
      item.options.find((option) => option.isAvailable)?.id ?? null;
    setCart((current) => [
      ...current,
      {
        key: `${item.id}-${Date.now()}`,
        item,
        optionId: firstOption,
        extraIds: [],
        quantity: "1",
        note: "",
      },
    ]);
  }

  function updateLine(key: string, patch: Partial<CartLine>) {
    setCart((current) =>
      current.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    );
  }

  function toggleExtra(line: CartLine, extraId: string) {
    const has = line.extraIds.includes(extraId);
    updateLine(line.key, {
      extraIds: has
        ? line.extraIds.filter((id) => id !== extraId)
        : [...line.extraIds, extraId],
    });
  }

  async function handleAddItem(data: ItemInput) {
    await onAddItem(data);
    // Refresh the item list so the new item can be added to the cart.
    try {
      const res = await fetch("/api/v1/merchant/catalog");
      if (res.ok) {
        const body = await res.json();
        setItems(body.data.items ?? items);
      }
    } catch {
      // The item was saved; the list refreshes on the next open.
    }
  }

  async function handleAddCustomer(data: CustomerInput) {
    await onAddCustomer(data);
    try {
      const res = await fetch("/api/v1/merchant/customers");
      if (res.ok) {
        const body = await res.json();
        const list: CustomerSummary[] = body.data.customers ?? [];
        setCustomers(list);
        const created = list.find(
          (entry) =>
            entry.name.trim().toLowerCase() === data.name.trim().toLowerCase() &&
            (entry.phone ?? "") === (data.phone ?? ""),
        );
        if (created) setSelectedCustomer(created);
      }
    } catch {
      // The customer was saved; the list refreshes on the next open.
    }
  }

  async function submitSale(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (cartTotalPaise <= 0) {
      setError(
        mode === "quick" ? "Enter an amount above zero." : "Add at least one item.",
      );
      return;
    }
    if (paymentChoice === "partial" && toPaise(paid) > cartTotalPaise) {
      setError("Paid is more than the total.");
      return;
    }
    if (when === "later" && !laterDate) {
      setError("Pick a date for the later sale.");
      return;
    }

    setBusy(true);
    try {
      const body = {
        source: "walk_in",
        status: previewStatus,
        customerName: selectedCustomer?.name ?? null,
        customerPhone: selectedCustomer?.phone ?? null,
        note: note || null,
        neededBy: when === "now" ? todayString() : laterDate,
        timeSlot: when === "later" ? laterTime : null,
        ...(mode === "quick"
          ? { quickAmount: fromPaise(cartTotalPaise) }
          : {
              lines: cart.map((line) => ({
                itemId: line.item.id,
                optionId: line.optionId,
                extraIds: line.extraIds,
                quantity: line.quantity,
                note: line.note || null,
              })),
            }),
        paidAmount: fromPaise(paidPaise),
        paymentMode,
      };

      const res = await fetch("/api/v1/merchant/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error?.message ?? "Sale not saved. Try again.");
      }

      onComplete("Sale saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sale not saved. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submitPayment(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!payOrder) {
      setError("Pick an order with a due.");
      return;
    }
    if (toPaise(payAmount) <= 0) {
      setError("Enter an amount above zero.");
      return;
    }
    if (toPaise(payAmount) > payDuePaise) {
      setError("The payment is more than the due.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(
        `/api/v1/merchant/orders/${payOrder.id}/payments`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            amount: payAmount,
            paymentMode: payMode,
          }),
        },
      );
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error?.message ?? "Could not save the payment.");
      }
      onComplete("Payment recorded");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save the payment.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-add-sale-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <section className="max-h-[94dvh] w-full max-w-[640px] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 pb-0 shadow-2xl sm:rounded-2xl sm:pb-5">
        <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
          <h2 id="home-add-sale-title" className="text-lg font-semibold">
            Add sale
          </h2>
          <SheetClose onClose={onClose} label="Close Add sale" />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-md bg-muted p-1">
          <button
            type="button"
            onClick={() => {
              setTab("sale");
              setError(null);
            }}
            className={cn(
              "min-h-10 rounded-[9px] text-sm font-medium",
              tab === "sale" ? "bg-surface shadow-sm" : "text-ink-muted",
            )}
          >
            New sale
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("payment");
              setError(null);
            }}
            className={cn(
              "min-h-10 rounded-[9px] text-sm font-medium",
              tab === "payment" ? "bg-surface shadow-sm" : "text-ink-muted",
            )}
          >
            Record payment
          </button>
        </div>

        {error ? (
          <p
            className="mb-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger"
            aria-live="polite"
          >
            {error}
          </p>
        ) : null}

        {tab === "payment" ? (
          <form onSubmit={submitPayment} className="space-y-4">
            <div>
              <Label>Order with a due</Label>
              <select
                className={inputClass}
                value={payOrderId}
                onChange={(event) => {
                  const id = event.target.value;
                  setPayOrderId(id);
                  const order = dueOrders.find((entry) => entry.id === id);
                  setPayAmount(
                    order ? fromPaise(order.duePaise ?? 0) : "",
                  );
                }}
              >
                <option value="">Pick an order</option>
                {dueOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.customerName} · {order.due} due · {order.code}
                  </option>
                ))}
              </select>
            </div>

            {payOrder ? (
              <div className="rounded-md bg-muted px-3 py-2 text-sm">
                Due {formatPaise(payDuePaise)}
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Amount</Label>
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={payAmount}
                  onChange={(event) => setPayAmount(event.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Mode</Label>
                <select
                  className={inputClass}
                  value={payMode}
                  onChange={(event) =>
                    setPayMode(event.target.value as PaymentMode)
                  }
                >
                  {PAYMENT_MODES.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className={primaryButton("w-full min-h-12")}
              disabled={busy}
            >
              {busy ? "Saving…" : "Record payment"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitSale} className="space-y-4">
            {/* Who */}
            <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
              <h3 className="text-sm font-bold text-ink">Customer</h3>

              {selectedCustomer ? (
                <div className="flex items-center justify-between gap-3 rounded-md bg-accent-soft px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {selectedCustomer.name}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {selectedCustomer.phone || "No phone"}
                      {Number(selectedCustomer.pendingTotal) > 0
                        ? ` · ₹${selectedCustomer.pendingTotal} due`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(null)}
                    className="shrink-0 text-xs font-semibold text-accent"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <input
                    className={inputClass}
                    value={customerQuery}
                    onChange={(event) => setCustomerQuery(event.target.value)}
                    placeholder="Search name or phone"
                  />
                  {customerMatches.length > 0 ? (
                    <div className="divide-y divide-line overflow-hidden rounded-md border border-line">
                      {customerMatches.map((entry) => (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => {
                            setSelectedCustomer(entry);
                            setCustomerQuery("");
                          }}
                          className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm"
                        >
                          <span className="min-w-0">
                            <span className="block truncate">{entry.name}</span>
                            <span className="block text-xs text-ink-muted">
                              {entry.phone || "No phone"}
                            </span>
                          </span>
                          {Number(entry.pendingTotal) > 0 ? (
                            <span className="shrink-0 text-xs text-warning">
                              ₹{entry.pendingTotal} due
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setShowNewCustomer(true)}
                    className="text-sm font-semibold text-accent"
                  >
                    + New customer
                  </button>
                </>
              )}
            </section>

            {/* What */}
            <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
              <h3 className="text-sm font-bold text-ink">Items</h3>

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
                  />
                  <p className="mt-1 text-xs text-ink-subtle">
                    No item list. One amount.
                  </p>
                </div>
              ) : (
                <>
              <input
                className={inputClass}
                value={itemQuery}
                onChange={(event) => setItemQuery(event.target.value)}
                placeholder="Search items"
              />

              <div className="max-h-56 space-y-1.5 overflow-y-auto">
                {visibleItems.length === 0 ? (
                  <p className="rounded-md border border-dashed border-line px-3 py-4 text-sm text-ink-muted">
                    No items match. Add a new item below.
                  </p>
                ) : (
                  visibleItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!item.isAvailable}
                      onClick={() => addItemToCart(item)}
                      className="flex w-full items-center justify-between gap-3 rounded-md border border-line bg-surface px-3 py-2 text-left disabled:opacity-50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {item.name}
                        </span>
                        <span className="block text-xs text-ink-muted">
                          {item.priceMode === "quote"
                            ? "Quote"
                            : `${formatPaise(toPaise(item.basePrice))} / ${item.unitLabel}`}
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

              <button
                type="button"
                onClick={() => setShowNewItem(true)}
                className="text-sm font-semibold text-accent"
              >
                + New item
              </button>

              {cart.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-caption font-bold text-ink-muted">
                    <span>Item</span>
                    <span className="figure">Amount</span>
                  </div>
                  {cart.map((line, index) => (
                    <div
                      key={line.key}
                      className="rounded-md border border-line bg-surface p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-start gap-2">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-muted text-caption font-bold text-ink-muted">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">
                              {line.item.name}
                            </p>
                            <p className="text-caption text-ink-muted">
                              Rate {formatPaise(toPaise(line.item.basePrice))} /{" "}
                              {line.item.unitLabel}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-danger"
                          onClick={() =>
                            setCart((current) =>
                              current.filter(
                                (entry) => entry.key !== line.key,
                              ),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>

                      {line.item.options.length > 0 ? (
                        <select
                          className={`${inputClass} mt-2`}
                          value={line.optionId ?? ""}
                          onChange={(event) => {
                            const optionId = event.target.value;
                            updateLine(line.key, {
                              optionId,
                              // Sub-variant extras belong to one chosen option.
                              extraIds: line.extraIds.filter((id) => {
                                const extra = line.item.extras.find(
                                  (entry) => entry.id === id,
                                );
                                return extra?.optionId === null || extra?.optionId === optionId;
                              }),
                            });
                          }}
                        >
                          {line.item.options.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name} ·{" "}
                              {formatPaise(toPaise(option.price))}
                            </option>
                          ))}
                        </select>
                      ) : null}

                      {groupedExtras(line.item, line.optionId).map(
                        ([label, entries]) => (
                          <div key={label} className="mt-2">
                            <p className="eyebrow mb-1 text-ink-subtle">{label}</p>
                            <div className="flex flex-wrap gap-2">
                              {entries.map((extra) => (
                                <button
                                  key={extra.id}
                                  type="button"
                                  onClick={() => toggleExtra(line, extra.id)}
                                  className={cn(
                                    "rounded-full border px-2.5 py-1 text-xs",
                                    line.extraIds.includes(extra.id)
                                      ? "border-accent bg-accent-soft font-medium text-accent-strong"
                                      : "border-line text-ink-muted",
                                  )}
                                >
                                  {extra.name}
                                  {Number(extra.priceDelta) > 0
                                    ? ` +${formatPaise(toPaise(extra.priceDelta))}`
                                    : ""}
                                </button>
                              ))}
                            </div>
                          </div>
                        ),
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className={quietButton("h-9 min-h-9 w-9 px-0")}
                            onClick={() =>
                              updateLine(line.key, {
                                quantity: String(
                                  Math.max(1, Number(line.quantity) - 1),
                                ),
                              })
                            }
                          >
                            −
                          </button>
                          <input
                            className="h-9 w-14 rounded-md border border-line text-center text-sm"
                            inputMode="decimal"
                            value={line.quantity}
                            onChange={(event) =>
                              updateLine(line.key, {
                                quantity: event.target.value,
                              })
                            }
                            aria-label={`Quantity for ${line.item.name}`}
                          />
                          <button
                            type="button"
                            className={quietButton("h-9 min-h-9 w-9 px-0")}
                            onClick={() =>
                              updateLine(line.key, {
                                quantity: String(Number(line.quantity) + 1),
                              })
                            }
                          >
                            +
                          </button>
                        </div>
                        <p className="figure tnum text-sm font-semibold text-ink">
                          {formatPaise(lineTotalPaise(line))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-muted">Add an item above.</p>
              )}
                </>
              )}
            </section>

            {/* When */}
            <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
              <h3 className="text-sm font-bold text-ink">Schedule</h3>
              <div className="grid grid-cols-2 gap-2">
                {(["now", "later"] as const).map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => setWhen(entry)}
                    className={cn(
                      "min-h-11 rounded-md border px-3 text-sm font-medium capitalize",
                      when === entry
                        ? "border-accent bg-accent-soft text-accent-strong"
                        : "border-line bg-surface text-ink-muted",
                    )}
                  >
                    {entry}
                  </button>
                ))}
              </div>

              {when === "later" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Date</Label>
                    <input
                      className={inputClass}
                      type="date"
                      value={laterDate}
                      onChange={(event) => setLaterDate(event.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <input
                      className={inputClass}
                      type="time"
                      value={laterTime}
                      onChange={(event) => setLaterTime(event.target.value)}
                    />
                  </div>
                  <label className="col-span-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={estimate}
                      onChange={(event) => setEstimate(event.target.checked)}
                      className="h-4 w-4"
                    />
                    This is an estimate
                  </label>
                </div>
              ) : null}
            </section>

            {/* Payment */}
            <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
              <h3 className="text-sm font-bold text-ink">Payment</h3>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "full", label: "Full" },
                    { id: "partial", label: "Partial" },
                    { id: "due", label: "Due later" },
                  ] as const
                ).map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setPaymentChoice(entry.id)}
                    className={cn(
                      "min-h-10 rounded-md border px-2 text-xs font-medium",
                      paymentChoice === entry.id
                        ? "border-accent bg-accent-soft text-accent-strong"
                        : "border-line bg-surface text-ink-muted",
                    )}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>

              {paymentChoice === "partial" ? (
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

              <div>
                <Label>Mode</Label>
                <select
                  className={inputClass}
                  value={paymentMode}
                  onChange={(event) =>
                    setPaymentMode(event.target.value as PaymentMode)
                  }
                >
                  {PAYMENT_MODES.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-md bg-muted px-3 py-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-muted">Total</span>
                  <span className="tnum font-semibold">
                    {formatPaise(cartTotalPaise)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-ink-muted">Paid now</span>
                  <span className="tnum font-medium">
                    {formatPaise(paidPaise)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-ink-muted">Due</span>
                  <span className="tnum font-medium">
                    {formatPaise(duePaise)}
                  </span>
                </div>
              </div>

              <p className="rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-ink">
                {outcome}
              </p>
            </section>

            <div>
              <Label>Note</Label>
              <input
                className={inputClass}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Delivery note or item detail"
              />
            </div>

            {/* The save action stays reachable while the long form scrolls. */}
            <div className="sticky bottom-0 -mx-5 border-t border-line bg-surface px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:px-0 sm:pb-0">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-ink-muted">Total</span>
                <span className="tnum font-bold text-ink">
                  {formatPaise(cartTotalPaise)}
                </span>
              </div>
              <button
                className={primaryButton("w-full min-h-12")}
                disabled={busy}
              >
                {busy ? "Saving…" : "Save sale"}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Inline add item */}
      <AddItemModal
        isOpen={showNewItem}
        onClose={() => setShowNewItem(false)}
        onSubmit={handleAddItem}
      />

      {/* Inline add customer */}
      <AddCustomerModal
        isOpen={showNewCustomer}
        onClose={() => setShowNewCustomer(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
}
