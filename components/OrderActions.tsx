"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inputClass, Label, primaryButton, quietButton } from "@/components/ui";

export function OrderActions({
  orderId,
  status,
  due,
}: {
  orderId: string;
  status: string;
  due: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(due === "0.00" ? "" : due);
  const [mode, setMode] = useState("upi");
  const [note, setNote] = useState("");
  const [tds, setTds] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const closed = status === "settled" || status === "cancelled";

  async function logPayment(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch(`/api/v1/merchant/orders/${orderId}/payments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        amount,
        paymentMode: mode,
        note: note || null,
        tdsDeducted: tds || "0",
      }),
    });

    setBusy(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Payment not saved. Try again.");
      return;
    }

    setShowPayment(false);
    setAmount("");
    setNote("");
    setTds("");
    router.refresh();
  }

  async function changeStatus(next: string) {
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/v1/merchant/orders/${orderId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Status not saved. Try again.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-5 space-y-3">
      {!closed && Number(due) > 0 ? (
        showPayment ? (
          <form
            onSubmit={logPayment}
            className="rounded-2xl border border-line bg-surface p-4"
          >
            <h3 className="text-[15px] font-semibold">Log payment</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <Label>Amount</Label>
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Mode</Label>
                <select
                  className={inputClass}
                  value={mode}
                  onChange={(event) => setMode(event.target.value)}
                >
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <Label>TDS (optional)</Label>
              <input
                className={inputClass}
                inputMode="decimal"
                value={tds}
                onChange={(event) => setTds(event.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="mt-3">
              <Label>Note (optional)</Label>
              <input
                className={inputClass}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Advance, balance, UPI reference"
              />
            </div>
            {error ? (
              <p className="mt-3 text-sm text-danger" aria-live="polite">
                {error}
              </p>
            ) : null}
            <div className="mt-4 flex gap-2">
              <button className={primaryButton("flex-1")} disabled={busy}>
                {busy ? "Saving…" : "Save payment"}
              </button>
              <button
                type="button"
                className={quietButton()}
                onClick={() => setShowPayment(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            className={primaryButton("w-full min-h-12")}
            onClick={() => setShowPayment(true)}
          >
            Log payment
          </button>
        )
      ) : null}

      {!closed ? (
        <div className="flex flex-wrap gap-2">
          {status !== "ready" ? (
            <button
              className={quietButton()}
              disabled={busy}
              onClick={() => changeStatus("ready")}
            >
              Mark ready
            </button>
          ) : (
            <button
              className={quietButton()}
              disabled={busy}
              onClick={() => changeStatus("open_tab")}
            >
              Reopen
            </button>
          )}
          {status === "quote" ? (
            <button
              className={quietButton()}
              disabled={busy}
              onClick={() => changeStatus("open_tab")}
            >
              Accept quote
            </button>
          ) : null}
          <button
            className={quietButton("text-danger")}
            disabled={busy}
            onClick={() => changeStatus("cancelled")}
          >
            Cancel order
          </button>
        </div>
      ) : null}

      {error && !showPayment ? (
        <p className="text-sm text-danger" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}
