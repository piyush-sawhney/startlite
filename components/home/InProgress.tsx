"use client";

import Link from "next/link";
import { Card, SectionLabel, quietButton } from "@/components/ui";
import type { InProgressOrder } from "@/lib/home-types";

export function InProgress({
  count,
  totalAmount,
  orders,
  isOwner,
  onComplete,
  onOpenOrder,
  onViewAll,
}: {
  count: number;
  totalAmount: string;
  orders: InProgressOrder[];
  isOwner: boolean;
  onComplete: (order: InProgressOrder) => void;
  onOpenOrder: (id: string) => void;
  onViewAll?: () => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <SectionLabel>In progress</SectionLabel>
          {count > 0 ? (
            <span className="tnum text-xs font-semibold text-ink-muted">
              {count} · {totalAmount}
            </span>
          ) : null}
        </div>

        {count > 5 ? (
          isOwner ? (
            <Link
              href="/app/sales?filter=pending"
              className="text-xs font-semibold text-accent hover:underline"
            >
              View all {count}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-semibold text-accent hover:underline"
            >
              View all {count}
            </button>
          )
        ) : null}
      </div>

      {orders.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-muted">
          Nothing in progress.
        </p>
      ) : (
        <div className="mt-3 divide-y divide-line">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => onOpenOrder(order.id)}
                className="min-w-0 flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <p
                    className="truncate font-medium text-ink"
                    title={order.customerName}
                  >
                    {order.customerName}
                  </p>
                  {order.status === "quote" ? (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                      Quote
                    </span>
                  ) : null}
                </div>
                <p
                  className="truncate text-xs text-ink-muted"
                  title={`${order.itemsSummary}${order.timeSlot ? ` · ${order.timeSlot}` : ""}`}
                >
                  {order.itemsSummary}
                  {order.timeSlot ? ` · ${order.timeSlot}` : ""}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="tnum text-right font-semibold text-ink">
                  {order.total}
                </span>

                {order.status === "quote" ? (
                  <button
                    type="button"
                    onClick={() => onOpenOrder(order.id)}
                    className={quietButton(
                      "min-h-8 px-3 text-xs font-semibold hover:border-accent/40",
                    )}
                  >
                    Open
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onComplete(order)}
                    className={quietButton(
                      "min-h-8 px-3 text-xs font-semibold hover:border-success/50 hover:text-success",
                    )}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
