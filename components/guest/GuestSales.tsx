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
import { isCancelled, isClosed, isCompleted } from "@/lib/order-status";
import {
  addGuestOrder,
  addGuestPayment,
  guestCustomers,
  guestOrderTotals,
  guestOrdersNewestFirst,
  guestToday,
  setGuestOrderStatus,
  type GuestCustomer,
  type GuestItem,
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
      if (filter === "pending" && isClosed(totals.status)) return false;
      if (filter === "paid" && !isCompleted(totals.status)) return false;
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
  variantName: string;
  subVariantName: string;
  price: string;
  unitLabel: string;
  quantity: string;
  note: string;
};

type SellableOption = {
  key: string;
  itemId: string;
  name: string;
  variantName: string;
  subVariantName: string;
  price: string;
  unitLabel: string;
};

const PAYMENT_MODES: Array<{ id: GuestPaymentMode; label: string }> = [
  { id: "cash", label: "Cash" },
  { id: "upi", label: "UPI" },
  { id: "card", label: "Card" },
  { id: "bank", label: "Bank" },
  { id: "other", label: "Other" },
];

const COUNTRY_CODES = ["+91", "+971", "+1", "+44", "+65"];

function sellableOptions(items: GuestItem[]): SellableOption[] {
  const out: SellableOption[] = [];
  for (const item of items) {
    const variants = item.variants ?? [];
    if (variants.length === 0) {
      out.push({
        key: item.id,
        itemId: item.id,
        name: item.name,
        variantName: "",
        subVariantName: "",
        price: item.price,
        unitLabel: item.unitLabel,
      });
      continue;
    }
    for (const variant of variants) {
      const subs = variant.subVariants ?? [];
      if (subs.length === 0) {
        out.push({
          key: `${item.id}:${variant.name}`,
          itemId: item.id,
          name: item.name,
          variantName: variant.name,
          subVariantName: "",
          price: variant.price || item.price,
          unitLabel: item.unitLabel,
        });
        continue;
      }
      for (const sub of subs) {
        out.push({
          key: `${item.id}:${variant.name}:${sub.name}`,
          itemId: item.id,
          name: item.name,
          variantName: variant.name,
          subVariantName: sub.name,
          price: sub.price || variant.price || item.price,
          unitLabel: item.unitLabel,
        });
      }
    }
  }
  return out;
}

function optionLabel(option: SellableOption) {
  return [option.name, option.variantName, option.subVariantName]
    .filter(Boolean)
    .join(" · ");
}

export function GuestNewSale({
  state,
  update,
  go,
  back,
  toast,
  customer,
}: GuestViewProps & { customer?: { name: string; phone: string } }) {
  const [tab, setTab] = useState<"sale" | "payment">("sale");
  const [mode, setMode] = useState<"items" | "quick">(
    state.items.length > 0 ? "items" : "quick",
  );
  const [cart, setCart] = useState<CartLine[]>([]);
  const [quickAmount, setQuickAmount] = useState("");
  const [itemQuery, setItemQuery] = useState("");

  const [query, setQuery] = useState("");
  const initialCustomer = customer
    ? (guestCustomers(state).find(
        (entry) =>
          (customer.phone &&
            entry.phone === customer.phone.replace(/\D/g, "")) ||
          entry.name.trim().toLowerCase() ===
            customer.name.trim().toLowerCase(),
      ) ?? null)
    : null;
  const [selectedKey, setSelectedKey] = useState<string | null>(
    initialCustomer?.key ?? null,
  );
  const [showNewCustomer, setShowNewCustomer] = useState(!initialCustomer);
  const [newName, setNewName] = useState(customer?.name ?? "");
  const [newPhone, setNewPhone] = useState(customer?.phone ?? "");
  const [newCountryCode, setNewCountryCode] = useState("+91");
  const [newSubLabel, setNewSubLabel] = useState("");
  const [nameMatchDismissed, setNameMatchDismissed] = useState(false);

  const [when, setWhen] = useState<"now" | "later">("now");
  const [laterDate, setLaterDate] = useState(guestToday());
  const [laterTime, setLaterTime] = useState("10:00");
  const [estimate, setEstimate] = useState(false);

  const [paymentChoice, setPaymentChoice] = useState<"full" | "partial" | "due">(
    "full",
  );
  const [paid, setPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState<GuestPaymentMode>("cash");
  const [note, setNote] = useState("");

  const [payOrderId, setPayOrderId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState<GuestPaymentMode>("cash");

  const [error, setError] = useState<string | null>(null);

  const customers = guestCustomers(state);
  const selected = customers.find((entry) => entry.key === selectedKey) ?? null;  const search = query.trim().toLowerCase();
  const suggestions = search
    ? customers
        .filter(
          (entry) =>
            entry.name.toLowerCase().includes(search) ||
            entry.phone.includes(search.replace(/\D/g, "")),
        )
        .slice(0, 5)
    : [];

  const newPhoneDigits = newPhone.replace(/\D/g, "");
  const phoneMatch = newPhoneDigits
    ? (customers.find(
        (entry) =>
          entry.phone === newPhoneDigits &&
          (entry.countryCode || "+91") === newCountryCode,
      ) ?? null)
    : null;
  const nameMatches =
    !newPhoneDigits && newName.trim()
      ? customers.filter(
          (entry) =>
            !entry.phone &&
            entry.name.trim().toLowerCase() === newName.trim().toLowerCase(),
        )
      : [];

  const sortedItems = [...state.items].sort((a, b) => a.sortOrder - b.sortOrder);
  const options = sellableOptions(sortedItems);
  const itemSearch = itemQuery.trim().toLowerCase();
  const visibleOptions = itemSearch
    ? options.filter((option) =>
        optionLabel(option).toLowerCase().includes(itemSearch),
      )
    : options;

  const dueOrders = state.orders
    .filter((order) => {
      const totals = guestOrderTotals(order);
      return !isCancelled(order.status) && totals.duePaise > 0;
    })
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const payOrder = dueOrders.find((order) => order.id === payOrderId) ?? null;
  const payDuePaise = payOrder ? guestOrderTotals(payOrder).duePaise : 0;

  const cartTotalPaise = cart.reduce(
    (total, line) => total + multiplyPaise(line.quantity, line.price),
    0,
  );
  const totalPaise =
    mode === "quick" ? Math.max(0, toPaise(quickAmount)) : cartTotalPaise;
  const paidPaise =
    paymentChoice === "full"
      ? totalPaise
      : paymentChoice === "due"
        ? 0
        : Math.min(Math.max(0, toPaise(paid)), totalPaise);
  const duePaise = Math.max(0, totalPaise - paidPaise);
  const previewStatus: GuestOrder["status"] =
    when === "later"
      ? estimate
        ? "waiting_client"
        : "accepted"
      : duePaise === 0 && totalPaise > 0
        ? "completed"
        : "ready";

  function addOption(option: SellableOption) {
    setCart((current) => {
      const existing = current.find((line) => line.key === option.key);
      if (existing) {
        return current.map((line) =>
          line.key === option.key
            ? { ...line, quantity: String(Number(line.quantity) + 1) }
            : line,
        );
      }
      return [
        ...current,
        {
          key: option.key,
          itemId: option.itemId,
          name: option.name,
          variantName: option.variantName,
          subVariantName: option.subVariantName,
          price: option.price,
          unitLabel: option.unitLabel,
          quantity: "1",
          note: "",
        },
      ];
    });
  }

  function updateLine(key: string, patch: Partial<CartLine>) {
    setCart((current) =>
      current.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    );
  }

  function useCustomer(entry: GuestCustomer) {
    setSelectedKey(entry.key);
    setQuery("");
    setShowNewCustomer(false);
    setError(null);
  }

  function submitSale(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (totalPaise <= 0) {
      setError(
        mode === "quick" ? "Enter an amount above zero." : "Add at least one item.",
      );
      return;
    }
    if (paymentChoice === "partial" && toPaise(paid) > totalPaise) {
      setError("Paid is more than the total.");
      return;
    }
    if (when === "later" && !laterDate) {
      setError("Pick a date for the later sale.");
      return;
    }

    const name = selected?.name ?? newName.trim();
    const phone = selected?.phone ?? newPhoneDigits;
    const countryCode = selected?.countryCode ?? newCountryCode;

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
            optionName:
              [line.variantName, line.subVariantName].filter(Boolean).join(" · ") ||
              null,
            quantity: line.quantity,
            unitPrice: line.price,
            unitLabel: line.unitLabel,
            note: line.note || null,
          }));

    const result = addGuestOrder(state, {
      customerId: selected?.id || undefined,
      customerName: name,
      customerPhone: phone,
      customerCountryCode: countryCode,
      customerSubLabel: selected ? undefined : newSubLabel.trim(),
      note,
      neededBy: when === "now" ? guestToday() : laterDate,
      timeSlot: when === "later" ? laterTime : null,
      when,
      status: previewStatus,
      lines,
      paidAmount: fromPaise(paidPaise),
      paymentMode,
    });

    if (!result.orderId) {
      setError("Sale not saved. Check the amount and try again.");
      return;
    }

    update(() => result.state);
    toast("Sale saved");
    go({ kind: "sale", id: result.orderId });
  }

  function submitPayment(event: React.FormEvent) {
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
    update((current) =>
      addGuestPayment(current, payOrder.id, payAmount, payMode),
    );
    toast("Payment recorded");
    go({ kind: "sale", id: payOrder.id });
  }

  return (
    <>
      <BackButton onClick={back} label="Sales" />
      <PageHeader
        title="Add sale"
        subtitle="One screen for a sale or a payment"
      />

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
                  order ? fromPaise(guestOrderTotals(order).duePaise) : "",
                );
              }}
            >
              <option value="">Pick an order</option>
              {dueOrders.map((order) => {
                const totals = guestOrderTotals(order);
                return (
                  <option key={order.id} value={order.id}>
                    {order.customerName || "Walk-in"} · {formatPaise(totals.duePaise)}{" "}
                    due · {order.code}
                  </option>
                );
              })}
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
                  setPayMode(event.target.value as GuestPaymentMode)
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

          {error ? (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" aria-live="polite">
              {error}
            </p>
          ) : null}

          <button className={primaryButton("w-full min-h-12")}>
            Record payment
          </button>
        </form>
      ) : (
        <form onSubmit={submitSale} className="space-y-4">
          {/* Who */}
          <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-sm font-semibold text-ink">Who</h2>

            {selected ? (
              <div className="flex items-center justify-between gap-3 rounded-md bg-accent-soft px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{selected.name}</p>
                  <p className="text-xs text-ink-muted">
                    {selected.phone || "No phone"}
                    {selected.pendingPaise > 0
                      ? ` · ${formatPaise(selected.pendingPaise)} due`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedKey(null)}
                  className="shrink-0 text-xs font-semibold text-accent"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <input
                  className={inputClass}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search name or phone"
                />

                {suggestions.length > 0 ? (
                  <div className="divide-y divide-line overflow-hidden rounded-md border border-line">
                    {suggestions.map((entry) => (
                      <button
                        key={entry.key}
                        type="button"
                        onClick={() => useCustomer(entry)}
                        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm"
                      >
                        <span className="min-w-0">
                          <span className="block truncate">{entry.name}</span>
                          <span className="block text-xs text-ink-muted">
                            {entry.phone || "No phone"}
                          </span>
                        </span>
                        {entry.pendingPaise > 0 ? (
                          <span className="shrink-0 text-xs text-warning">
                            {formatPaise(entry.pendingPaise)} due
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setShowNewCustomer((current) => !current)}
                  className="text-sm font-semibold text-accent"
                >
                  {showNewCustomer ? "Use an existing customer" : "+ New customer"}
                </button>

                {showNewCustomer ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Name</Label>
                        <input
                          className={inputClass}
                          value={newName}
                          onChange={(event) => {
                            setNewName(event.target.value);
                            setNameMatchDismissed(false);
                          }}
                          placeholder="Customer name"
                        />
                      </div>
                      <div>
                        <Label>Country code</Label>
                        <select
                          className={inputClass}
                          value={newCountryCode}
                          onChange={(event) =>
                            setNewCountryCode(event.target.value)
                          }
                        >
                          {COUNTRY_CODES.map((code) => (
                            <option key={code} value={code}>
                              {code}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>WhatsApp number</Label>
                      <input
                        className={inputClass}
                        inputMode="tel"
                        value={newPhone}
                        onChange={(event) => setNewPhone(event.target.value)}
                        placeholder="10-digit number"
                      />
                    </div>

                    <div>
                      <Label>Identification label</Label>
                      <input
                        className={inputClass}
                        value={newSubLabel}
                        onChange={(event) => setNewSubLabel(event.target.value)}
                        placeholder="regular, Sector 4"
                      />
                    </div>

                    {phoneMatch ? (
                      <p className="rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">
                        This number is saved as {phoneMatch.name}.{" "}
                        <button
                          type="button"
                          onClick={() => useCustomer(phoneMatch)}
                          className="font-semibold underline"
                        >
                          Use {phoneMatch.name}
                        </button>
                      </p>
                    ) : null}

                    {nameMatches.length > 0 && !nameMatchDismissed ? (
                      <p className="rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">
                        You already have {nameMatches[0].name}. Same person?{" "}
                        <button
                          type="button"
                          onClick={() => useCustomer(nameMatches[0])}
                          className="font-semibold underline"
                        >
                          Use {nameMatches[0].name}
                        </button>{" "}
                        <button
                          type="button"
                          onClick={() => setNameMatchDismissed(true)}
                          className="font-semibold underline"
                        >
                          No, new
                        </button>
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </section>

          {/* What */}
          <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-sm font-semibold text-ink">What</h2>

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
                  For a sale with no item list. The bill says “Sale”.
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
                  {visibleOptions.length === 0 ? (
                    <p className="rounded-md border border-dashed border-line px-3 py-4 text-sm text-ink-muted">
                      No items yet. Use quick amount, or add items first.
                    </p>
                  ) : (
                    visibleOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => addOption(option)}
                        className="flex w-full items-center justify-between gap-3 rounded-md border border-line bg-surface px-3 py-2 text-left"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {optionLabel(option)}
                          </span>
                          <span className="block text-xs text-ink-muted">
                            {formatPaise(toPaise(option.price))} / {option.unitLabel}
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-accent">
                          Add
                        </span>
                      </button>
                    ))
                  )}
                </div>

                {cart.length > 0 ? (
                  <div className="space-y-2">
                    {cart.map((line) => (
                      <div
                        key={line.key}
                        className="rounded-md border border-line bg-surface p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">
                            {[line.name, line.variantName, line.subVariantName]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
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

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <Label>Price</Label>
                            <input
                              className={inputClass}
                              inputMode="decimal"
                              value={line.price}
                              onChange={(event) =>
                                updateLine(line.key, { price: event.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label>Line note</Label>
                            <input
                              className={inputClass}
                              value={line.note}
                              onChange={(event) =>
                                updateLine(line.key, { note: event.target.value })
                              }
                              placeholder="Optional"
                            />
                          </div>
                        </div>

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
                              aria-label={`Quantity for ${line.name}`}
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
                          <p className="tnum text-sm font-semibold">
                            {formatPaise(
                              multiplyPaise(line.quantity, line.price),
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </section>

          {/* When */}
          <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-sm font-semibold text-ink">When</h2>
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
            <h2 className="text-sm font-semibold text-ink">Payment</h2>
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
                  setPaymentMode(event.target.value as GuestPaymentMode)
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
                <span className="tnum font-semibold">{formatPaise(totalPaise)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-ink-muted">Paid now</span>
                <span className="tnum font-medium">{formatPaise(paidPaise)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-ink-muted">Due</span>
                <span className="tnum font-medium">{formatPaise(duePaise)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-muted">Will save as</span>
              <StatusPill status={previewStatus} />
            </div>
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

          {error ? (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" aria-live="polite">
              {error}
            </p>
          ) : null}

          <button className={primaryButton("w-full min-h-12")}>Save sale</button>
        </form>
      )}
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

      {totals.duePaise > 0 && !isCancelled(order.status) ? (
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

      {!isCancelled(order.status) ? (
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
