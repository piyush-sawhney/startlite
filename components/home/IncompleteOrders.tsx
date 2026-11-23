"use client";

import { Card, SectionLabel, StatusPill, quietButton } from "@/components/ui";
import { formatNeededBy } from "@/lib/bill";
import { istDateString } from "@/lib/date";
import type { IncompleteOrder } from "@/lib/home-types";

export function IncompleteOrders({
  toFinishCount,
  readyCount,
  totalDue,
  totalCount,
  orders,
  onOpenOrder,
  onCollect,
}: {
  toFinishCount: number;
  readyCount: number;
  totalDue: string;
  totalCount: number;
  orders: IncompleteOrder[];
  onOpenOrder: (order: IncompleteOrder) => void;
  onCollect: (order: IncompleteOrder) => void;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-line px-4 py-3">
        <SectionLabel>Incomplete orders</SectionLabel>
        <p className="mt-1 text-xs text-ink-muted">
          {toFinishCount} to finish · {readyCount} to collect
        </p>
        <p className="tnum mt-0.5 text-sm font-semibold text-ink">
          {totalDue} pending
        </p>
      </div>

      {totalCount === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-ink-muted">
          No incomplete orders.
        </p>
      ) : (
        <div
          aria-label="Incomplete orders"
          className="max-h-[34rem] divide-y divide-line overflow-y-auto overscroll-contain"
        >
          {orders.map((order) => {
            const placed = formatNeededBy(
              istDateString(new Date(order.createdAt)),
            );
            const needed = formatNeededBy(order.neededBy);
            const hasSlot = Boolean(
              order.timeSlot &&
                !["any time", "none"].includes(order.timeSlot.trim().toLowerCase()),
            );
            const actionLabel =
              order.status === "ready"
                ? "Collect"
                : order.status === "quote"
                  ? "Review"
                  : "Mark ready";

            return (
              <article
                key={order.id}
                className="flex items-center gap-2 px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => onOpenOrder(order)}
                  aria-label={`Order details: ${order.customerName}, ${order.itemsSummary}, ${order.due} due`}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-ink">
                      {order.customerName}
                    </span>
                    <StatusPill status={order.status} />
                  </div>
                  <p className="truncate text-xs text-ink-muted">
                    {order.itemsSummary} · {order.code}
                  </p>
                  <p className="mt-1 text-[11px] text-ink-subtle">
                    Placed {placed} · Needed {needed}
                    {hasSlot ? ` · ${order.timeSlot}` : " · Any time"}
                  </p>
                  <p className="tnum mt-1 text-xs font-semibold text-ink">
                    {order.status === "ready"
                      ? `${order.due} due`
                      : `${order.total} total · ${order.due} due`}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    order.status === "ready"
                      ? onCollect(order)
                      : onOpenOrder(order)
                  }
                  className={quietButton(
                    "min-h-10 shrink-0 px-3 text-xs font-semibold",
                  )}
                >
                  {actionLabel}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </Card>
  );
}
