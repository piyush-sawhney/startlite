"use client";

import { useEffect, useState } from "react";
import { primaryButton, quietButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { IncompleteOrder } from "@/lib/home-types";

type EditableLine = {
  id: string | null;
  itemName: string;
  quantity: string;
  unitPrice: string;
  unitLabel: string | null;
  note: string | null;
};

type OrderData = {
  id: string;
  code: string;
  status: string;
  customerName: string | null;
  customerPhone: string | null;
  neededBy: string;
  timeSlot: string | null;
  deliveryNote: string | null;
  adjustmentAmount: string;
  adjustmentReason: string | null;
  grandTotal: string;
  paidTotal: string;
  createdAt: string;
};

export function EditOrderModal({
  order,
  onClose,
  onSaved,
}: {
  order: IncompleteOrder | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  if (!order) return null;

  const [data, setData] = useState<OrderData | null>(null);
  const [lines, setLines] = useState<EditableLine[]>([]);
  const [removedLineIds, setRemovedLineIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/v1/merchant/orders/${order.id}`);
        if (!res.ok) throw new Error("Could not load order.");
        const body = await res.json();
        setData(body.data.order);
        setLines(
          (body.data.lines ?? []).map((line: any) => ({
            id: line.id,
            itemName: line.itemName,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            unitLabel: line.unitLabel ?? null,
            note: line.note ?? null,
          })),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load order.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [order.id]);

  function addLine() {
    setLines([
      ...lines,
      {
        id: null,
        itemName: "",
        quantity: "1",
        unitPrice: "0",
        unitLabel: null,
        note: null,
      },
    ]);
  }

  function removeLine(index: number) {
    const line = lines[index];
    const next = lines.filter((_, i) => i !== index);
    setLines(next);
    if (line.id) {
      setRemovedLineIds((prev) => [...prev, line.id]);
    }
  }

  function updateLine(index: number, patch: Partial<EditableLine>) {
    setLines((current) =>
      current.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    );
  }

  function totalLinesPaise() {
    return lines.reduce((sum, line) => {
      const qty = Number(line.quantity) || 0;
      const price = Number(line.unitPrice) || 0;
      return sum + qty * price * 100;
    }, 0);
  }

  async function save() {
    if (!data) return;
    setError(null);
    setBusy(true);

    // Validate lines
    for (const line of lines) {
      if (!line.itemName.trim()) {
        setError("Every item needs a name.");
        setBusy(false);
        return;
      }
      if (Number(line.quantity) <= 0) {
        setError("Quantity must be above zero.");
        setBusy(false);
        return;
      }
      if (Number(line.unitPrice) < 0) {
        setError("Price cannot be negative.");
        setBusy(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/v1/merchant/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: data.customerName || null,
          customerPhone: data.customerPhone || null,
          neededBy: data.neededBy,
          timeSlot: data.timeSlot || null,
          deliveryNote: data.deliveryNote || null,
          adjustmentAmount: data.adjustmentAmount || "0",
          adjustmentReason: data.adjustmentReason || null,
          lines: lines.map((line) => ({
            id: line.id ?? undefined,
            itemName: line.itemName.trim(),
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            unitLabel: line.unitLabel ?? null,
            note: line.note ?? null,
          })),
          removedLineIds,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(
          payload?.error?.message || "Could not save changes.",
        );
      }

      await res.json();
      onClose();
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
      setBusy(false);
    }
  }

  if (!data) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-edit-order-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <section className="max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
          <div className="min-w-0">
            <h2 id="home-edit-order-title" className="truncate text-lg font-semibold">
              Edit order
            </h2>
            <p className="text-xs text-ink-muted">{data.code}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={quietButton("min-h-11")}
          >
            Close
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" aria-live="polite">
            {error}
          </p>
        ) : null}

        <div className="mt-4 space-y-4">
          {/* Customer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Customer name
              </label>
              <input
                className="block min-h-10 w-full rounded-md border border-line bg-surface px-3 text-[14px] text-ink focus:border-accent/50 focus:outline-none"
                value={data.customerName ?? ""}
                onChange={(e) =>
                  setData((d) => d ? { ...d, customerName: e.target.value } : d)
                }
                placeholder="Customer name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Phone
              </label>
                <input
                className="block min-h-10 w-full rounded-md border border-line bg-surface px-3 text-[14px] text-ink focus:border-accent/50 focus:outline-none"
                inputMode="tel"
                value={data.customerPhone ?? ""}
                onChange={(e) =>
                  setData((d) => d ? { ...d, customerPhone: e.target.value } : d)
                }
                placeholder="10-digit number"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Needed by
              </label>
              <input
                className="block min-h-10 w-full rounded-md border border-line bg-surface px-3 text-[14px] text-ink focus:border-accent/50 focus:outline-none"
                type="date"
                value={data.neededBy}
                onChange={(e) =>
                  setData((d) => d ? { ...d, neededBy: e.target.value } : d)
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Time slot
              </label>
              <input
                className="block min-h-10 w-full rounded-md border border-line bg-surface px-3 text-[14px] text-ink focus:border-accent/50 focus:outline-none"
                value={data.timeSlot ?? ""}
                onChange={(e) =>
                  setData((d) => d ? { ...d, timeSlot: e.target.value } : d)
                }
                placeholder="10:00"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-2">
              Items
            </label>
            <div className="space-y-2">
              {lines.length === 0 ? (
                <p className="rounded-md border border-dashed border-line px-3 py-4 text-sm text-ink-muted">
                  No items yet.
                </p>
              ) : (
                lines.map((line, index) => (
                  <div
                    key={line.id ?? index}
                    className="rounded-md border border-line bg-surface p-3"
                  >
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-2">
                        <input
                          className="block min-h-9 rounded-md border border-line bg-surface px-2.5 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                          value={line.itemName}
                          onChange={(e) =>
                            updateLine(index, { itemName: e.target.value })
                          }
                          placeholder="Item name"
                        />
                        <input
                          className="block min-h-9 rounded-md border border-line bg-surface px-2.5 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                          inputMode="decimal"
                          value={line.quantity}
                          onChange={(e) =>
                            updateLine(index, { quantity: e.target.value })
                          }
                          placeholder="Qty"
                        />
                        <input
                          className="block min-h-9 rounded-md border border-line bg-surface px-2.5 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                          inputMode="decimal"
                          value={line.unitPrice}
                          onChange={(e) =>
                            updateLine(index, { unitPrice: e.target.value })
                          }
                          placeholder="Price"
                        />
                        <input
                          className="block min-h-9 rounded-md border border-line bg-surface px-2.5 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                          value={line.unitLabel ?? ""}
                          onChange={(e) =>
                            updateLine(index, { unitLabel: e.target.value })
                          }
                          placeholder="Unit"
                        />
                      </div>
                      <input
                        className="block min-h-9 w-full rounded-md border border-line bg-surface px-2.5 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                        value={line.note ?? ""}
                        onChange={(e) =>
                          updateLine(index, { note: e.target.value })
                        }
                        placeholder="Note (optional)"
                      />
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        className="text-xs text-danger font-medium"
                      >
                        Remove item
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={addLine}
              className="text-xs font-medium text-accent hover:underline mt-2"
            >
              + Add item
            </button>
          </div>

          {/* Adjustment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Adjustment (discount)
              </label>
              <input
                className="block min-h-10 w-full rounded-md border border-line bg-surface px-3 text-[14px] text-ink focus:border-accent/50 focus:outline-none"
                inputMode="decimal"
                value={data.adjustmentAmount}
                onChange={(e) =>
                  setData((d) => d ? { ...d, adjustmentAmount: e.target.value } : d)
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Reason
              </label>
              <input
                className="block min-h-10 w-full rounded-md border border-line bg-surface px-3 text-[14px] text-ink focus:border-accent/50 focus:outline-none"
                value={data.adjustmentReason ?? ""}
                onChange={(e) =>
                  setData((d) => d ? { ...d, adjustmentReason: e.target.value } : d)
                }
                placeholder="e.g. Festive discount"
              />
            </div>
          </div>

          {/* Delivery note */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1">
              Delivery note
            </label>
            <textarea
              className="block min-h-10 w-full rounded-md border border-line bg-surface px-3 py-2 text-[14px] text-ink focus:border-accent/50 focus:outline-none"
              value={data.deliveryNote ?? ""}
              onChange={(e) =>
                setData((d) => d ? { ...d, deliveryNote: e.target.value } : d)
              }
              placeholder="Delivery address or special note"
            />
          </div>

          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2.5">
            <span className="text-sm text-ink-muted">Order total</span>
            <span className="tnum text-lg font-semibold text-ink">
              ₹{(totalLinesPaise() / 100).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className={primaryButton("min-h-11 flex-1")}
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={quietButton("min-h-11 flex-1")}
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}
