"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { primaryButton, quietButton } from "@/components/ui";

export function PendingOrderActions({
  code,
  changed,
}: {
  code: string;
  changed: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    setBusy(true);
    setError(null);
    const response = await fetch(
      `/api/v1/merchant/pending-orders/${code}/accept`,
      { method: "POST" },
    );
    setBusy(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.message ?? "Order not accepted. Try again.");
      return;
    }

    const payload = await response.json();
    router.push(`/app/sales/${payload.data.orderId}`);
    router.refresh();
  }

  async function decline() {
    setBusy(true);
    const response = await fetch(`/api/v1/merchant/pending-orders/${code}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (!response.ok) {
      setError("Order not declined. Try again.");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="mt-5 space-y-3">
      {changed ? (
        <p className="rounded-md bg-warning/10 px-3 py-2 text-sm text-warning">
          A price changed since the buyer sent this. Accept uses today’s price.
        </p>
      ) : null}

      <button
        className={primaryButton("w-full min-h-12")}
        onClick={accept}
        disabled={busy}
      >
        {busy ? "Working…" : "Accept order"}
      </button>

      {confirming ? (
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm text-ink-muted">
            Decline this order? The buyer’s link stops working and nothing is
            saved.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              className={quietButton("min-h-9 px-3 text-xs text-danger")}
              onClick={decline}
              disabled={busy}
            >
              Decline order
            </button>
            <button
              className={quietButton("min-h-9 px-3 text-xs")}
              onClick={() => setConfirming(false)}
            >
              Keep
            </button>
          </div>
        </div>
      ) : (
        <button
          className={quietButton("w-full")}
          onClick={() => setConfirming(true)}
          disabled={busy}
        >
          Decline
        </button>
      )}

      {error ? (
        <p className="text-sm text-danger" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}
