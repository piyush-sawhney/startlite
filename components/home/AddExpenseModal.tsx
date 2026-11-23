"use client";

import { useEffect, useState } from "react";
import { Label, inputClass, primaryButton, quietButton } from "@/components/ui";

export type ExpenseInput = {
  paidTo: string;
  paidFor: string;
  amount: string;
  date: string;
};

export function AddExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  today,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseInput) => Promise<void>;
  today?: string;
}) {
  const defaultDate = today ?? new Date().toISOString().slice(0, 10);
  const [paidTo, setPaidTo] = useState("");
  const [paidFor, setPaidFor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setDate(today ?? new Date().toISOString().slice(0, 10));
    }
  }, [isOpen, today]);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!paidTo.trim()) {
      setError("Enter who was paid.");
      return;
    }
    if (!paidFor.trim()) {
      setError("Enter what the payment was for.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter an amount above zero.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSubmit({
        paidTo: paidTo.trim(),
        paidFor: paidFor.trim(),
        amount: amount.trim(),
        date,
      });
      setPaidTo("");
      setPaidFor("");
      setAmount("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record expense");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-expense-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="w-full max-w-[420px] rounded-t-2xl border border-line bg-surface p-5 shadow-2xl sm:rounded-2xl">
        <div className="border-b border-line pb-3">
          <h2 id="add-expense-title" className="text-lg font-semibold text-ink">
            Add expense
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            Money that left the shop today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label>Paid to</Label>
            <input
              type="text"
              value={paidTo}
              onChange={(event) => setPaidTo(event.target.value)}
              className={inputClass}
              placeholder="e.g. Flour mill, auto, packaging"
              maxLength={80}
              required
              autoFocus
            />
          </div>

          <div>
            <Label>Paid for</Label>
            <input
              type="text"
              value={paidFor}
              onChange={(event) => setPaidFor(event.target.value)}
              className={inputClass}
              placeholder="e.g. Flour, rent, packaging"
              maxLength={80}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Amount (₹)</Label>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className={inputClass}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label>Date</Label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {error ? (
            <p className="text-xs text-danger" aria-live="polite">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2 pb-2 sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className={quietButton("flex-1 min-h-11")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className={primaryButton("flex-1 min-h-11")}
            >
              {busy ? "Saving..." : "Add expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
