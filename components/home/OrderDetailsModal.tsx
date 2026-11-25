"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatNeededBy, whatsappLink } from "@/lib/bill";
import { callLink, smsLink } from "@/lib/contact";
import { istDateString } from "@/lib/date";
import type { DayOrderItem, IncompleteOrder } from "@/lib/home-types";
import {
  PaymentPill,
  StatusPill,
  primaryButton,
  quietButton,
} from "@/components/ui";
import { paymentStatus } from "@/lib/payment-status";
import {
  Check,
  Edit2,
  MessageCircle,
  PackageCheck,
  Phone,
  Send,
  Wallet,
  X,
} from "lucide-react";

const contactClass =
  "relative grid h-10 w-10 shrink-0 place-items-center rounded-xl transition after:absolute after:-inset-1 after:content-['']";

export type HomeOrderPreview = Pick<
  DayOrderItem,
  | "id"
  | "code"
  | "customerName"
  | "itemsSummary"
  | "total"
  | "due"
  | "status"
  | "neededBy"
  | "timeSlot"
  | "note"
  | "customerPhone"
  | "customerCountryCode"
  | "lines"
> & {
  createdAt?: string;
  isRequest?: boolean;
};

export function OrderDetailsModal({
  order,
  onClose,
  onAccept,
  onMarkReady,
  onCollect,
  onReopen,
  onCancelOrder,
  onEdit,
  billHref,
}: {
  order: HomeOrderPreview | IncompleteOrder | null;
  onClose: () => void;
  onAccept: (orderId: string) => void;
  onMarkReady: (orderId: string) => void;
  onCollect: (orderId: string) => void;
  onReopen?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onEdit?: () => void;
  billHref?: string;
}) {
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  useEffect(() => {
    setConfirmingCancel(false);
  }, [order?.id]);

  if (!order) return null;

  const placed = order.createdAt
    ? formatNeededBy(istDateString(new Date(order.createdAt)))
    : null;
  const needed = formatNeededBy(order.neededBy);
  const hasDue = order.due !== "₹0.00";
  const phone = order.customerPhone ?? "";
  const hasPhone = phone.trim().length > 0;
  const reminder = `Hi ${order.customerName}, your StartLite order #${order.code} (${order.itemsSummary}) ${order.status === "ready" ? "is ready for collection" : "is pending"}. Amount due: ${order.due}.`;

  function resetAndClose() {
    setConfirmingCancel(false);
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-order-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <section className="max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl border border-line bg-surface pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:pb-5">
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-5 sm:py-3">
          <div className="min-w-0">
            <h2 id="home-order-title" className="truncate text-lg font-bold text-ink">
              {order.customerName}
            </h2>
            <p className="text-xs text-ink-muted">{order.code}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusPill status={order.status} />
            <button
              type="button"
              onClick={resetAndClose}
              aria-label="Close order"
              className="grid h-11 w-11 place-items-center rounded-xl text-ink-muted transition hover:bg-muted hover:text-ink"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <p className="eyebrow mb-2 text-ink-subtle">Items</p>
            <div className="overflow-hidden rounded-xl border border-line">
              <div className="grid grid-cols-[24px_minmax(0,1fr)_52px_76px_84px] gap-2 bg-muted/60 px-3 py-2 text-caption font-bold text-ink-muted">
                <span>#</span>
                <span>Item</span>
                <span className="figure">Qty</span>
                <span className="figure">Rate</span>
                <span className="figure">Amount</span>
              </div>
              {order.lines && order.lines.length > 0 ? (
                order.lines.map((line, index) => (
                  <div
                    key={`${line.itemName}-${index}`}
                    className="grid grid-cols-[24px_minmax(0,1fr)_52px_76px_84px] items-start gap-2 border-t border-line px-3 py-2 text-small"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-md bg-muted text-caption font-bold text-ink-muted">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink" title={line.itemName}>
                        {line.itemName}
                      </p>
                      {line.optionName ? (
                        <p className="truncate text-caption text-ink-muted">
                          Variant: {line.optionName}
                          {line.optionPrice ? ` · ${line.optionPrice}` : ""}
                        </p>
                      ) : null}
                      {line.extras && line.extras.length > 0 ? (
                        <p className="truncate text-caption text-ink-muted">
                          Add-ons:{" "}
                          {line.extras
                            .map((extra) => `${extra.name} +₹${extra.priceDelta}`)
                            .join(", ")}
                        </p>
                      ) : null}
                      {line.note ? (
                        <p className="truncate text-caption text-ink-muted">
                          Note: {line.note}
                        </p>
                      ) : null}
                    </div>
                    <span className="figure tnum text-ink">
                      {line.quantity}
                      {line.unitLabel ? (
                        <span className="block text-caption font-normal text-ink-subtle">
                          {line.unitLabel}
                        </span>
                      ) : null}
                    </span>
                    <span className="figure tnum text-ink-muted">{line.unitPrice}</span>
                    <span className="figure tnum font-semibold text-ink">
                      {line.lineTotal}
                    </span>
                  </div>
                ))
              ) : (
                <p className="px-3 py-3 text-small font-semibold text-ink">
                  {order.itemsSummary}
                </p>
              )}
            </div>
          </div>

          {order.note ? (
            <div className="rounded-xl border border-warning/30 bg-warning-soft px-3.5 py-3">
              <p className="eyebrow text-warning">Buyer's note</p>
              <p className="mt-1 text-small font-medium text-ink">{order.note}</p>
            </div>
          ) : null}

          {/* Every fact carries its own label: order date, needed date, money. */}
          <dl className="divide-y divide-line rounded-xl border border-line px-3.5 text-sm">
            {placed ? (
              <div className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-ink-muted">Placed</dt>
                <dd className="tnum text-right font-semibold text-ink">{placed}</dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-ink-muted">Needed by</dt>
              <dd className="text-right font-semibold text-ink">
                {needed ?? "Any time"}
                {order.timeSlot ? ` · ${order.timeSlot}` : ""}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-ink-muted">Work</dt>
              <dd>
                <StatusPill status={order.status} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-ink-muted">Payment</dt>
              <dd>
                <PaymentPill status={paymentStatus(order.total, order.due)} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-ink-muted">Total</dt>
              <dd className="tnum font-semibold text-ink">{order.total}</dd>
            </div>
            {hasDue ? (
              <div className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-ink-muted">Due</dt>
                <dd className="tnum font-bold text-warning">{order.due}</dd>
              </div>
            ) : null}
          </dl>

          {/* The same contact and edit shortcuts the order card offers. */}
          {hasPhone || onEdit ? (
            <div className="flex items-center gap-2 border-t border-line pt-4">
              <p className="eyebrow mr-auto text-ink-subtle">Message & edit</p>
              <div className="flex items-center gap-2">
                {hasPhone ? (
                  <>
                    <a
                      href={whatsappLink(phone, reminder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${order.customerName}`}
                      className={`${contactClass} bg-success-soft text-success hover:bg-success/20`}
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a
                      href={smsLink(phone, order.customerCountryCode, reminder)}
                      aria-label={`SMS ${order.customerName}`}
                      className={`${contactClass} bg-info-soft text-info hover:bg-info/20`}
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a
                      href={callLink(phone, order.customerCountryCode)}
                      aria-label={`Call ${order.customerName}`}
                      className={`${contactClass} bg-accent-soft text-accent-strong hover:bg-accent/20`}
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </>
                ) : null}
                {onEdit ? (
                  <button
                    type="button"
                    onClick={onEdit}
                    aria-label={`Edit ${order.customerName} order`}
                    className={`${contactClass} border border-line bg-muted text-ink-muted hover:text-ink`}
                  >
                    <Edit2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* One primary action, named after what it does. */}
          <div className="space-y-2">
            {order.status === "under_review" ||
            order.status === "waiting_client" ? (
              <button
                type="button"
                onClick={() => onAccept(order.id)}
                className={primaryButton("w-full min-h-12")}
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Accept request
              </button>
            ) : null}
            {order.status === "accepted" || order.status === "in_progress" ? (
              <button
                type="button"
                onClick={() => onMarkReady(order.id)}
                className={primaryButton("w-full min-h-12")}
              >
                <PackageCheck className="h-4 w-4" aria-hidden="true" />
                Mark ready
              </button>
            ) : null}
            {order.status === "ready" ? (
              <button
                type="button"
                onClick={() => onCollect(order.id)}
                className={primaryButton("w-full min-h-12")}
              >
                <Wallet className="h-4 w-4" aria-hidden="true" />
                Collect payment
              </button>
            ) : null}
            <button
              type="button"
              onClick={resetAndClose}
              className={quietButton("w-full min-h-11")}
            >
              Close
            </button>
          </div>

          {onReopen || onCancelOrder || billHref ? (
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              {billHref ? (
                <Link href={billHref} className={quietButton("min-h-11 flex-1")}>
                  Send bill
                </Link>
              ) : null}
              {onReopen && order.status === "ready" ? (
                <button
                  type="button"
                  onClick={() => onReopen(order.id)}
                  className={quietButton("min-h-11 flex-1")}
                >
                  Reopen
                </button>
              ) : null}
              {onCancelOrder && !confirmingCancel ? (
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(true)}
                  className={quietButton("min-h-11 flex-1 text-danger hover:bg-danger-soft")}
                >
                  Cancel order
                </button>
              ) : null}
            </div>
          ) : null}

          {confirmingCancel && onCancelOrder ? (
            <div className="rounded-xl border border-danger/30 bg-danger-soft p-3">
              <p className="text-sm font-semibold text-ink">Cancel this order?</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => onCancelOrder(order.id)}
                  className={quietButton("min-h-11 flex-1 text-danger")}
                >
                  Yes, cancel
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(false)}
                  className={quietButton("min-h-11 flex-1")}
                >
                  Keep it
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
