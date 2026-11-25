"use client";

import { useEffect, useState } from "react";
import { primaryButton, quietButton } from "@/components/ui";
import type { IncompleteOrder } from "@/lib/home-types";
import type { PublicItem } from "@/lib/queries";
import { SheetClose } from "./SheetClose";

type EditableLine = {
  id: string | null;
  catalogItemId: string | null;
  itemName: string;
  quantity: string;
  unitPrice: string;
  unitLabel: string | null;
  optionId: string | null;
  extras: Array<{
    id: string;
    name: string;
    priceDelta: string;
    optionId?: string | null;
  }>;
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
  items = [],
  onClose,
  onSaved,
}: {
  order: IncompleteOrder | null;
  items?: PublicItem[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [data, setData] = useState<OrderData | null>(null);
  const [lines, setLines] = useState<EditableLine[]>([]);
  const [removedLineIds, setRemovedLineIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderId = order?.id;

  // All hooks run on every render, including while `order` is null. The early
  // return below must stay after the hooks so React never sees a changed hook
  // count when an order is opened or closed.
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    setData(null);
    setLines([]);
    setRemovedLineIds([]);
    setError(null);
    async function load() {
      try {
        const res = await fetch(`/api/v1/merchant/orders/${orderId}`);
        if (!res.ok) throw new Error("Could not load order.");
        const body = await res.json();
        if (cancelled) return;
        setData(body.data.order);
        setLines(
          (body.data.lines ?? []).map((line: any) => ({
            id: line.id,
            catalogItemId: line.catalogItemId ?? null,
            itemName: line.itemName,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            unitLabel: line.unitLabel ?? null,
            optionId: line.optionId ?? null,
            extras: line.extras ?? [],
            note: line.note ?? null,
          })),
        );
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load order.");
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (!order) return null;

  function addLine() {
    setLines([
      ...lines,
      {
        id: null,
        catalogItemId: null,
        itemName: "",
        quantity: "1",
        unitPrice: "0",
        unitLabel: null,
        optionId: null,
        extras: [],
        note: null,
      },
    ]);
  }

  function removeLine(index: number) {
    const line = lines[index];
    const next = lines.filter((_, i) => i !== index);
    setLines(next);
    const removedId = line?.id;
    if (removedId) {
      setRemovedLineIds((prev) => [...prev, removedId]);
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
    if (!data || !orderId) return;
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
      const res = await fetch(`/api/v1/merchant/orders/${orderId}`, {
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
            catalogItemId: line.catalogItemId,
            itemName: line.itemName.trim(),
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            unitLabel: line.unitLabel ?? null,
            optionId: line.optionId,
            optionName: items
              .find((item) => item.id === line.catalogItemId)
              ?.options.find((option) => option.id === line.optionId)?.name ?? null,
            extras: line.extras,
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
      <section className="max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:pb-5">
        <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
          <div className="min-w-0">
            <h2 id="home-edit-order-title" className="truncate text-title font-bold">
              Edit order
            </h2>
            <p className="text-caption text-ink-muted">{data.code}</p>
          </div>
          <SheetClose onClose={onClose} label="Close Edit order" />
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
                    <div className="mb-2 flex items-center gap-2">
                      <span className="grid h-5 w-5 place-items-center rounded-md bg-muted text-caption font-bold text-ink-muted">
                        {index + 1}
                      </span>
                    </div>
                    <div className="mb-1 grid grid-cols-[minmax(0,1fr)_58px_78px_54px] gap-2 text-caption font-bold text-ink-muted">
                      <span>Item</span>
                      <span className="figure">Qty</span>
                      <span className="figure">Rate</span>
                      <span>Unit</span>
                    </div>
                    <div className="grid grid-cols-[minmax(0,1fr)_58px_78px_54px] gap-2">
                      <input
                        aria-label={`Item ${index + 1} name`}
                        className="block min-h-9 w-full rounded-md border border-line bg-surface px-2.5 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                        value={line.itemName}
                        onChange={(e) =>
                          updateLine(index, { itemName: e.target.value })
                        }
                        placeholder="Item name"
                      />
                      <input
                        aria-label={`Item ${index + 1} quantity`}
                        className="figure block min-h-9 w-full rounded-md border border-line bg-surface px-2 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                        inputMode="decimal"
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(index, { quantity: e.target.value })
                        }
                        placeholder="0"
                      />
                      <input
                        aria-label={`Item ${index + 1} rate`}
                        className="figure block min-h-9 w-full rounded-md border border-line bg-surface px-2 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                        inputMode="decimal"
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateLine(index, { unitPrice: e.target.value })
                        }
                        placeholder="0.00"
                      />
                      <input
                        aria-label={`Item ${index + 1} unit`}
                        className="block min-h-9 w-full rounded-md border border-line bg-surface px-2 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                        value={line.unitLabel ?? ""}
                        onChange={(e) =>
                          updateLine(index, { unitLabel: e.target.value })
                        }
                        placeholder="pc"
                      />
                    </div>
                    {(() => {
                      const catalogItem = items.find(
                        (item) => item.id === line.catalogItemId,
                      );
                      if (!catalogItem) return null;
                      const visibleExtras = catalogItem.extras.filter(
                        (extra) =>
                          extra.optionId === null || extra.optionId === line.optionId,
                      );
                      const rateWith = (
                        optionId: string | null,
                        extras: EditableLine["extras"],
                      ) => {
                        const option = catalogItem.options.find(
                          (entry) => entry.id === optionId,
                        );
                        return (
                          Number(option?.price ?? catalogItem.basePrice) +
                          extras.reduce((sum, extra) => sum + Number(extra.priceDelta), 0)
                        ).toFixed(2);
                      };
                      return (
                        <div className="mt-2 space-y-2">
                          {catalogItem.options.length > 0 ? (
                            <div>
                              <label className="mb-1 block text-caption font-semibold text-ink-muted">
                                Variant
                              </label>
                              <select
                                aria-label={`Item ${index + 1} variant`}
                                value={line.optionId ?? ""}
                                onChange={(e) => {
                                  const optionId = e.target.value || null;
                                  const extras = line.extras.filter(
                                    (extra) => extra.optionId === null || extra.optionId === optionId,
                                  );
                                  updateLine(index, {
                                    optionId,
                                    extras,
                                    unitPrice: rateWith(optionId, extras),
                                  });
                                }}
                                className="block min-h-9 w-full rounded-md border border-line bg-surface px-2 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                              >
                                <option value="">Standard</option>
                                {catalogItem.options.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.name} · ₹{option.price}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : null}
                          {visibleExtras.length > 0 ? (
                            <div>
                              <p className="mb-1 text-caption font-semibold text-ink-muted">
                                Add-ons
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {visibleExtras.map((extra) => {
                                  const selected = line.extras.some(
                                    (entry) => entry.id === extra.id,
                                  );
                                  return (
                                    <button
                                      key={extra.id}
                                      type="button"
                                      onClick={() => {
                                        const extras = selected
                                          ? line.extras.filter((entry) => entry.id !== extra.id)
                                          : [...line.extras, extra];
                                        updateLine(index, {
                                          extras,
                                          unitPrice: rateWith(line.optionId, extras),
                                        });
                                      }}
                                      className={`rounded-full border px-2.5 py-1 text-caption font-semibold transition ${
                                        selected
                                          ? "border-accent bg-accent-soft text-accent-strong"
                                          : "border-line text-ink-muted hover:bg-muted"
                                      }`}
                                    >
                                      {extra.name} +₹{extra.priceDelta}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })()}
                    <label className="mt-2 block text-caption font-semibold text-ink-muted">
                      Note for item {index + 1}
                    </label>
                    <input
                      className="mt-1 block min-h-9 w-full rounded-md border border-line bg-surface px-2.5 text-[13px] text-ink focus:border-accent/50 focus:outline-none"
                      value={line.note ?? ""}
                      onChange={(e) =>
                        updateLine(index, { note: e.target.value })
                      }
                      placeholder="Optional"
                    />
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      className="mt-2 text-xs font-semibold text-danger"
                    >
                      Remove item
                    </button>
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
