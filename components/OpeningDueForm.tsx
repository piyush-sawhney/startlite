"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inputClass, Label, primaryButton, quietButton } from "@/components/ui";

export function OpeningDueForm({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <button className={quietButton("w-full")} onClick={() => setOpen(true)}>
        Add previous due
      </button>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch(
      `/api/v1/merchant/customers/${customerId}/opening`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount, date: date || null }),
      },
    );

    setBusy(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Not saved. Try again.");
      return;
    }

    setOpen(false);
    setAmount("");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-line bg-surface p-4"
    >
      <h2 className="text-[15px] font-semibold">Previous due</h2>
      <p className="mt-1 text-xs text-ink-muted">
        Move a paper due into the ledger. It behaves like any other order.
      </p>
      <div className="mt-3">
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
      <div className="mt-3">
        <Label>Date (optional)</Label>
        <input
          className={inputClass}
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      {error ? (
        <p className="mt-2 text-sm text-danger" aria-live="polite">
          {error}
        </p>
      ) : null}
      <div className="mt-3 flex gap-2">
        <button className={primaryButton("flex-1")} disabled={busy}>
          {busy ? "Saving…" : "Add due"}
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
