"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PublicItem } from "@/lib/queries";
import {
  addPaise,
  formatPaise,
  fromPaise,
  multiplyPaise,
  toPaise,
} from "@/lib/paise";
import { inputClass, Label, primaryButton, quietButton } from "@/components/ui";
import { cn } from "@/lib/cn";

type CartLine = {
  key: string;
  item: PublicItem;
  optionId: string | null;
  extraIds: string[];
  quantity: string;
};

function lineUnitPaise(item: PublicItem, optionId: string | null, extraIds: string[]) {
  const option = item.options.find((entry) => entry.id === optionId);
  const base = item.priceMode === "quote" ? "0" : option?.price ?? item.basePrice;
  const extras = item.extras.filter((extra) => extraIds.includes(extra.id));
  return addPaise(base, ...extras.map((extra) => extra.priceDelta));
}

function lineTotalPaise(line: CartLine) {
  return multiplyPaise(
    line.quantity || "0",
    fromPaise(lineUnitPaise(line.item, line.optionId, line.extraIds)),
  );
}

export function NewSaleForm({ items }: { items: PublicItem[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"quick" | "items">(
    items.length > 0 ? "items" : "quick",
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [quickAmount, setQuickAmount] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [fullPaid, setFullPaid] = useState(true);
  const [paid, setPaid] = useState("");
  const [neededBy, setNeededBy] = useState<"today" | "tomorrow">("today");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const totalPaise =
    mode === "quick" ? toPaise(quickAmount) : addPaise(...cart.map(lineTotalPaise));

  function addItem(item: PublicItem) {
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

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (totalPaise <= 0) {
      setError("Enter an amount above zero.");
      return;
    }

    setBusy(true);
    const body =
      mode === "quick"
        ? {
            source: "walk_in",
            quickAmount: fromPaise(totalPaise),
            customerName: name || null,
            customerPhone: phone || null,
            note: note || null,
            neededBy: neededBy === "today" ? todayString() : tomorrowString(),
            paidAmount: fullPaid ? fromPaise(totalPaise) : paid || "0",
            paymentMode: "cash",
          }
        : {
            source: "walk_in",
            customerName: name || null,
            customerPhone: phone || null,
            note: note || null,
            neededBy: neededBy === "today" ? todayString() : tomorrowString(),
            lines: cart.map((line) => ({
              itemId: line.item.id,
              optionId: line.optionId,
              extraIds: line.extraIds,
              quantity: line.quantity,
            })),
            paidAmount: fullPaid ? fromPaise(totalPaise) : paid || "0",
            paymentMode: "cash",
          };

    const response = await fetch("/api/v1/merchant/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.message ?? "Sale not saved. Try again.");
      return;
    }

    const payload = await response.json();
    router.push(`/app/sales/${payload.data.orderId}`);
    router.refresh();
  }

  return (
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
                        {item.priceMode === "quote"
                          ? "Quote"
                          : `${formatPaise(toPaise(item.basePrice))} / ${item.unitLabel}`}
                        {item.isAvailable ? "" : " · Sold out"}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-accent">Add</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {cart.length > 0 ? (
            <div className="space-y-2">
              {cart.map((line) => (
                <div
                  key={line.key}
                  className="rounded-md border border-line bg-surface p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{line.item.name}</p>
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

                  {line.item.options.length > 0 ? (
                    <select
                      className={`${inputClass} mt-2`}
                      value={line.optionId ?? ""}
                      onChange={(event) =>
                        updateLine(line.key, { optionId: event.target.value })
                      }
                    >
                      {line.item.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name} · {formatPaise(toPaise(option.price))}
                        </option>
                      ))}
                    </select>
                  ) : null}

                  {line.item.extras.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {line.item.extras.map((extra) => (
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
                  ) : null}

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
                          updateLine(line.key, { quantity: event.target.value })
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
                    <p className="tnum text-sm font-semibold">
                      {formatPaise(lineTotalPaise(line))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">Add an item above.</p>
          )}
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
        <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" aria-live="polite">
          {error}
        </p>
      ) : null}

      <button className={primaryButton("w-full min-h-12")} disabled={busy}>
        {busy ? "Saving…" : "Save sale"}
      </button>
    </form>
  );
}

function todayString() {
  return new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
}

function tomorrowString() {
  return new Date(Date.now() + 5.5 * 3600_000 + 864e5)
    .toISOString()
    .slice(0, 10);
}
