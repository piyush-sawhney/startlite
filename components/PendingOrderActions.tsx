"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { primaryButton, quietButton } from "@/components/ui";
import { compileOrderAccepted, compileOrderDeclined, formatNeededBy, whatsappLink } from "@/lib/bill";

export function PendingOrderActions({
  code,
  changed,
  customerName,
  customerPhone,
  shopName,
  total,
  neededBy,
}: {
  code: string;
  changed: boolean;
  customerName?: string | null;
  customerPhone?: string | null;
  shopName?: string;
  total?: string;
  neededBy?: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedOrderId, setAcceptedOrderId] = useState<string | null>(null);

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
    setAcceptedOrderId(payload.data.orderId);
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

  if (acceptedOrderId) {
    const confirmationText = compileOrderAccepted({
      shopName: shopName || "Our Shop",
      orderCode: code,
      customerName: customerName || "Customer",
      total,
      neededBy: formatNeededBy(neededBy) ?? neededBy,
    });
    const waUrl = customerPhone ? whatsappLink(customerPhone, confirmationText) : null;

    return (
      <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-2 text-lg font-bold text-ink">Order Accepted!</h3>
        <p className="mt-0.5 text-xs text-ink-muted">
          Order saved to your ledger as #{code}.
        </p>

        {waUrl ? (
          <div className="mt-4 space-y-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#20ba5a]"
            >
              <MessageCircle className="h-4 w-4" />
              Send Confirmation on WhatsApp
            </a>
            <Link
              href={`/app/sales/${acceptedOrderId}`}
              className={quietButton("w-full min-h-11 text-xs font-semibold")}
            >
              View Order Details & Bill →
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <Link
              href={`/app/sales/${acceptedOrderId}`}
              className={primaryButton("w-full min-h-11")}
            >
              View Order Details & Bill →
            </Link>
          </div>
        )}
      </div>
    );
  }

  const declineNoticeText = compileOrderDeclined({
    shopName: shopName || "Our Shop",
    orderCode: code,
    customerName: customerName || "Customer",
  });
  const declineWaUrl = customerPhone ? whatsappLink(customerPhone, declineNoticeText) : null;

  return (
    <div className="mt-5 space-y-3">
      {changed ? (
        <p className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
          A price changed since the buyer sent this. Accept saves at today’s catalog price.
        </p>
      ) : null}

      <button
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-[15px] font-semibold text-white shadow-sm transition hover:bg-accent-strong active:bg-accent-strong disabled:opacity-50"
        onClick={accept}
        disabled={busy}
      >
        <CheckCircle2 className="h-4 w-4" />
        {busy ? "Accepting order…" : "Accept order"}
      </button>

      {confirming ? (
        <div className="rounded-2xl border border-line bg-muted/60 p-3.5">
          <p className="text-xs text-ink-muted">
            Decline this order? The order will be removed from your waiting list.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              className="inline-flex min-h-9 flex-1 items-center justify-center rounded-xl bg-danger/10 px-3 text-xs font-semibold text-danger transition hover:bg-danger/20"
              onClick={decline}
              disabled={busy}
            >
              Decline order
            </button>
            {declineWaUrl ? (
              <a
                href={declineWaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-ink transition hover:bg-muted"
                onClick={decline}
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                Decline & Notify
              </a>
            ) : null}
            <button
              className="inline-flex min-h-9 rounded-xl border border-line bg-surface px-3 text-xs font-medium text-ink transition hover:bg-muted"
              onClick={() => setConfirming(false)}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <button
          className={quietButton("w-full text-ink-muted hover:text-danger")}
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
