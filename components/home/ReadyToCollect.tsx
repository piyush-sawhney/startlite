"use client";

import Link from "next/link";
import { Card, SectionLabel, primaryButton } from "@/components/ui";
import type { ReadyToCollectOrder } from "@/lib/home-types";

export function ReadyToCollect({
  count,
  totalDue,
  orders,
  isOwner,
  onCollect,
  onOpenOrder,
  onViewAll,
}: {
  count: number;
  totalDue: string;
  orders: ReadyToCollectOrder[];
  isOwner: boolean;
  onCollect: (order: ReadyToCollectOrder) => void;
  onOpenOrder: (id: string) => void;
  onViewAll?: () => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <SectionLabel>Ready to collect</SectionLabel>
          {count > 0 ? (
            <span className="tnum text-xs font-semibold text-warning">
              {count} · {totalDue}
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
          Nothing to collect.
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
                <p className="truncate font-medium text-ink">
                  {order.customerName}
                </p>
                <p className="truncate text-xs text-ink-muted">
                  {order.itemsSummary}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="tnum text-right font-semibold text-warning">
                  {order.due}
                </span>
                <button
                  type="button"
                  onClick={() => onCollect(order)}
                  className={primaryButton(
                    "min-h-8 px-3 text-xs font-semibold bg-accent hover:bg-accent-strong",
                  )}
                >
                  Collect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
