"use client";

import { useState } from "react";
import { Label, inputClass, primaryButton, quietButton } from "@/components/ui";
import type { ReadyToCollectOrder } from "@/lib/home-types";

export function CollectPaymentModal({
  order,
  isOpen,
  onClose,
  onSubmit,
}: {
  order: ReadyToCollectOrder | null;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-[420px] rounded-2xl border border-line bg-surface p-6 shadow-2xl">
        <div className="border-b border-line pb-3">
          <h2 id="collect-payment-title" className="text-lg font-semibold text-ink">
            Collect payment
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            {order.customerName} · Due: {order.due}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label>Amount (₹)</Label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label>Payment mode</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["upi", "cash", "bank", "cheque"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-xl border py-2 text-xs font-semibold capitalize transition ${
                    mode === m
                      ? "border-accent bg-accent-soft text-accent-strong"
                      : "border-line bg-surface text-ink hover:bg-muted"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Note (optional)</Label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
              placeholder="e.g. UPI ref or cash notes"
            />
          </div>

          {error ? <p className="text-xs text-danger">{error}</p> : null}

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
