"use client";

import { useState } from "react";
import { Label, inputClass, primaryButton, quietButton } from "@/components/ui";
import { SheetClose } from "./SheetClose";

type CollectableOrder = {
  id: string;
  customerName: string;
  due: string;
};

export function CollectPaymentModal({
  order,
  isOpen,
  onClose,
  onSubmit,
}: {
  order: CollectableOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    orderId: string;
    amount: string;
    mode: string;
    note?: string;
  }) => Promise<void>;
}) {
  const [amount, setAmount] = useState(
    order?.due.replace(/[^0-9.]/g, "") ?? "",
  );
  const [mode, setMode] = useState("upi");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!order) return;
    if (!amount || Number(amount) <= 0) {
      setError("Enter an amount above zero.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSubmit({
        orderId: order.id,
        amount,
        mode,
        note: note || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="collect-payment-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[92dvh] w-full max-w-[420px] overflow-y-auto rounded-t-2xl border border-line bg-surface p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:pb-6">
        <div className="flex items-start justify-between gap-2 border-b border-line pb-3">
          <div className="min-w-0">
            <h2 id="collect-payment-title" className="text-title font-bold text-ink">
              Collect payment
            </h2>
            <p className="mt-0.5 text-caption text-ink-muted">
              {order.customerName} · {order.due} due
            </p>
          </div>
          <SheetClose onClose={onClose} label="Close Collect payment" />
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label>Amount</Label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
              placeholder="₹0.00"
              required
            />
          </div>

          <div>
            <Label>Mode</Label>
            <div className="grid grid-cols-3 gap-2">
              {([
                ["upi", "UPI"],
                ["cash", "Cash"],
                ["card", "Card"],
                ["bank", "Bank"],
                ["other", "Other"],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={`min-h-11 rounded-xl border text-caption font-bold transition ${
                    mode === id
                      ? "border-accent bg-accent-soft text-accent-strong"
                      : "border-line bg-surface text-ink-muted hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Note</Label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
              placeholder="e.g. UPI ref or cash notes"
            />
          </div>

          {error ? <p className="text-caption text-danger">{error}</p> : null}

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className={quietButton("flex-1 min-h-10")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className={primaryButton("flex-1 min-h-10")}
            >
              {busy ? "Saving..." : "Record payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
