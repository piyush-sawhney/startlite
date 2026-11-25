"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatNeededBy } from "@/lib/bill";
import { istDateString } from "@/lib/date";
import type { DayOrderItem, IncompleteOrder } from "@/lib/home-types";
import { StatusPill, primaryButton, quietButton } from "@/components/ui";

export type HomeOrderPreview = Pick<
  DayOrderItem,
  "id" | "code" | "customerName" | "itemsSummary" | "total" | "due" | "status" | "neededBy" | "timeSlot"
> & {
  createdAt?: string;
};

export function OrderDetailsModal({
  order,
  onClose,
  onAccept,
  onMarkReady,
  onCollect,
  onReopen,
  onCancelOrder,
  billHref,
}: {
  order: HomeOrderPreview | IncompleteOrder | null;
  onClose: () => void;
  onAccept: (orderId: string) => void;
  onMarkReady: (orderId: string) => void;
  onCollect: (orderId: string) => void;
  onReopen?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  billHref?: string;
}) {
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  // Reset the confirm state whenever a different order opens.
  useEffect(() => {
    setConfirmingCancel(false);
  }, [order?.id]);

  if (!order) return null;

  const placed = order.createdAt
    ? formatNeededBy(istDateString(new Date(order.createdAt)))
    : null;
  const needed = formatNeededBy(order.neededBy);

  function resetAndClose() {
    setConfirmingCancel(false);
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-order-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <section className="max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
          <div className="min-w-0">
            <h2 id="home-order-title" className="truncate text-lg font-semibold">
              {order.customerName}
            </h2>
            <p className="text-xs text-ink-muted">{order.code}</p>
          </div>
          <StatusPill status={order.status} />
        </div>

        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">Items</dt>
            <dd className="font-medium">{order.itemsSummary}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Dates</dt>
            <dd>
              {placed ? <>Placed {placed}<br /></> : null}
              Needed {needed}
              {order.timeSlot ? ` · ${order.timeSlot}` : " · Any time"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Total</dt>
            <dd className="tnum font-medium">{order.total}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3">
            <dt className="text-ink-muted">Pending</dt>
            <dd className="tnum font-semibold">{order.due}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          {order.status === "under_review" ||
          order.status === "waiting_client" ? (
            <button
              type="button"
              onClick={() => onAccept(order.id)}
              className={primaryButton("min-h-11 flex-1")}
            >
              Accept
            </button>
          ) : null}
          {order.status === "accepted" || order.status === "in_progress" ? (
            <button
              type="button"
              onClick={() => onMarkReady(order.id)}
              className={primaryButton("min-h-11 flex-1")}
            >
              Mark ready
            </button>
          ) : null}
          {order.status === "ready" ? (
            <button
              type="button"
              onClick={() => onCollect(order.id)}
              className={primaryButton("min-h-11 flex-1")}
            >
              Collect
            </button>
          ) : null}
          <button
            type="button"
            onClick={resetAndClose}
            className={quietButton("min-h-11 flex-1")}
          >
            Close
          </button>
        </div>

        {/* Secondary order actions */}
        {onReopen || onCancelOrder || billHref ? (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
            {billHref ? (
              <Link
                href={billHref}
                className={quietButton("min-h-11 flex-1")}
              >
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
                className={quietButton("min-h-11 flex-1 text-danger hover:bg-danger/10")}
              >
                Cancel order
              </button>
            ) : null}
          </div>
        ) : null}

        {confirmingCancel && onCancelOrder ? (
          <div className="mt-3 rounded-xl border border-danger/30 bg-danger/5 p-3">
            <p className="text-sm text-ink">
              Cancel this order? Past bills keep their records.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => onCancelOrder(order.id)}
                className={quietButton("flex-1 text-danger hover:bg-danger/10")}
              >
                Cancel order
              </button>
              <button
                type="button"
                onClick={() => setConfirmingCancel(false)}
                className={quietButton("flex-1")}
              >
                Keep
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
