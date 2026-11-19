"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { inputClass, Label, primaryButton, quietButton } from "@/components/ui";
import { compileOrderReady, compilePaymentReceived, whatsappLink } from "@/lib/bill";

export function OrderActions({
  orderId,
  status,
  due,
  orderCode,
  customerName,
  customerPhone,
  shopName,
  upiId,
}: {
  orderId: string;
  status: string;
  due: string;
  orderCode?: string;
  customerName?: string | null;
  customerPhone?: string | null;
  shopName?: string;
  upiId?: string | null;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(due === "0.00" ? "" : due);
  const [mode, setMode] = useState("upi");
  const [note, setNote] = useState("");
  const [tds, setTds] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [lastPayment, setLastPayment] = useState<{ amount: string; mode: string } | null>(null);

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

    setLastPayment({ amount, mode });
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

  const orderReadyMsg = compileOrderReady({
    shopName: shopName || "Our Shop",
    orderCode: orderCode || orderId.slice(0, 6).toUpperCase(),
    customerName: customerName || "Customer",
    due,
    upiId,
  });
  const orderReadyWaUrl = customerPhone ? whatsappLink(customerPhone, orderReadyMsg) : null;

  return (
    <div className="mt-5 space-y-3">
      {status === "ready" && orderReadyWaUrl ? (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-amber-900">Order is marked Ready!</p>
              <p className="text-[11px] text-amber-700">Send pickup notification to {customerName || "customer"}.</p>
            </div>
            <a
              href={orderReadyWaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#25D366] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#20ba5a]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Notify on WhatsApp
            </a>
          </div>
        </div>
      ) : null}

      {lastPayment && customerPhone ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-emerald-900">Payment Saved ✓</p>
              <p className="text-[11px] text-emerald-700">₹{lastPayment.amount} logged. Send receipt to customer.</p>
            </div>
            <a
              href={whatsappLink(
                customerPhone,
                compilePaymentReceived({
                  shopName: shopName || "Our Shop",
                  customerName: customerName || "Customer",
                  billNo: orderCode || orderId.slice(0, 6),
                  amountPaid: lastPayment.amount,
                  remainingDue: due,
                }),
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#25D366] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#20ba5a]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Send Receipt
            </a>
          </div>
        </div>
      ) : null}

      {!closed && Number(due) > 0 ? (
        showPayment ? (
          <form
            onSubmit={logPayment}
            className="rounded-2xl border border-line bg-surface p-4 shadow-sm"
          >
            <h3 className="text-[15px] font-semibold text-ink">Log payment</h3>
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
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-success px-4 text-[15px] font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800"
            onClick={() => setShowPayment(true)}
          >
            <CheckCircle2 className="h-4 w-4" />
            Log payment
          </button>
        )
      ) : null}

      {!closed ? (
        <div className="flex flex-wrap gap-2">
          {status !== "ready" ? (
            <button
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-warning/40 bg-warning/10 px-3 text-sm font-semibold text-warning transition hover:bg-warning/20"
              disabled={busy}
              onClick={() => changeStatus("ready")}
            >
              Mark ready
            </button>
          ) : (
            <button
              className={quietButton("flex-1")}
              disabled={busy}
              onClick={() => changeStatus("open_tab")}
            >
              Reopen
            </button>
          )}
          {status === "quote" ? (
            <button
              className={quietButton("flex-1")}
              disabled={busy}
              onClick={() => changeStatus("open_tab")}
            >
              Accept quote
            </button>
          ) : null}
          <button
            className={quietButton("text-danger hover:bg-danger/10")}
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
