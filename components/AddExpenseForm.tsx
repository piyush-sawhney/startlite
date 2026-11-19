"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inputClass, Label, primaryButton, quietButton } from "@/components/ui";

export function AddExpenseForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <button className={primaryButton("w-full")} onClick={() => setOpen(true)}>
        Add expense
      </button>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch("/api/v1/merchant/expenses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, amount }),
    });

    setBusy(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.message ?? "Expense not saved. Try again.");
      return;
    }

    setTitle("");
    setAmount("");
    setOpen(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-line bg-surface p-4"
    >
      <h2 className="text-[15px] font-semibold">New expense</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <Label>What for</Label>
          <input
            className={inputClass}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Flour, auto, gas"
            required
            autoFocus
          />
        </div>
        <div>
          <Label>Amount</Label>
          <input
            className={inputClass}
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-danger" aria-live="polite">
          {error}
        </p>
      ) : null}
      <div className="mt-3 flex gap-2">
        <button className={primaryButton("flex-1")} disabled={busy}>
          {busy ? "Saving…" : "Save expense"}
        </button>
        <button
          type="button"
          className={quietButton()}
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
