"use client";

import { Card, SectionLabel, StatusPill, quietButton } from "@/components/ui";
import { whatsappLink } from "@/lib/bill";
import { formatNeededBy } from "@/lib/bill";
import { istDateString } from "@/lib/date";
import { MessageCircle, Phone, Send, Edit2 } from "lucide-react";
import type { IncompleteOrder } from "@/lib/home-types";

const HOME_ORDER_LIMIT = 10;

function phoneDigits(phone: string, countryCode = "+91"): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return digits.slice(1);
  const cc = countryCode.replace("+", "");
  if (!digits.startsWith(cc)) return cc + digits;
  return digits;
}

function smsLink(phone: string, countryCode: string | undefined, text: string): string {
  const to = phoneDigits(phone, countryCode);
  return `sms:${to}?body=${encodeURIComponent(text)}`;
}

function callLink(phone: string, countryCode: string | undefined): string {
  const to = phoneDigits(phone, countryCode);
  return `tel:${to}`;
}

function isOverdue(order: IncompleteOrder): boolean {
  if (!order.neededBy) return false;
  return order.neededBy < istDateString();
}

export function IncompleteOrders({
  toFinishCount,
  readyCount,
  totalDue,
  totalCount,
  orders,
  onOpenOrder,
  onCollect,
  onEdit,
}: {
  toFinishCount: number;
  readyCount: number;
  totalDue: string;
  totalCount: number;
  orders: IncompleteOrder[];
  onOpenOrder: (order: IncompleteOrder) => void;
  onCollect: (order: IncompleteOrder) => void;
  onEdit?: (order: IncompleteOrder) => void;
}) {
  const visibleOrders = orders.slice(0, HOME_ORDER_LIMIT);

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-line px-4 py-3">
        <SectionLabel>Pending orders</SectionLabel>
        <p className="mt-1 text-xs text-ink-muted">
          {toFinishCount} to finish · {readyCount} to collect
        </p>
        <p className="tnum mt-0.5 text-sm font-semibold text-ink">
          {totalDue} pending
        </p>
      </div>

      {totalCount === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-ink-muted">
          No pending orders.
        </p>
      ) : (
        <div
          aria-label="Pending orders"
          className="max-h-[34rem] divide-y divide-line overflow-y-auto overscroll-contain"
        >
          {visibleOrders.map((order) => {
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

            const phone = order.customerPhone;
            const countryCode = order.customerCountryCode;
            const hasPhone = Boolean(phone && phone.trim().length > 0);

            const customerMessage =
              `Hi ${order.customerName}, your StartLite order #${order.code} (${order.itemsSummary}) ${order.status === "ready" ? "is ready for collection" : "is pending"}. Amount due: ${order.due}.`;

            return (
              <article
                key={order.id}
                className="flex items-start gap-2 px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => onOpenOrder(order)}
                  aria-label={`Order details: ${order.customerName}, ${order.itemsSummary}, ${order.due} due`}
                  className="min-w-0 flex-1 flex flex-col gap-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-ink">
                      {needed ?? "Any time"}
                      {hasSlot && order.timeSlot ? ` · ${order.timeSlot}` : ""}
                      {!hasSlot && <span className="text-ink-muted">· Any time</span>}
                    </span>
                    {isOverdue(order) && (
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-warning text-ink">
                        Overdue
                      </span>
                    )}
                    <StatusPill status={order.status} />
                  </div>
                  <p className="truncate text-sm text-ink-muted">
                    {order.itemsSummary}
                    {order.total ? ` · ${order.total}` : ""}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-subtle">
                    {order.customerName}{order.customerName ? " · " : ""}Placed {placed}
                  </p>
                  <p className="tnum mt-0.5 text-xs font-semibold text-ink">
                    {order.status === "ready"
                      ? `${order.due} due`
                      : `${order.total} total · ${order.due} due`}
                  </p>
                </button>

                <div className="flex flex-col gap-1.5 shrink-0">
                  {hasPhone ? (
                    <>
                      <a
                        href={whatsappLink(phone, customerMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        type="button"
                        aria-label={`WhatsApp ${order.customerName}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <a
                        href={smsLink(phone, countryCode, customerMessage)}
                        type="button"
                        aria-label={`SMS ${order.customerName}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <a
                        href={callLink(phone, countryCode)}
                        type="button"
                        aria-label={`Call ${order.customerName}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </>
                  ) : null}

                  {onEdit ? (
                    <button
                      type="button"
                      onClick={() => onEdit(order)}
                      aria-label={`Edit ${order.customerName} order`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-ink-muted hover:bg-muted transition"
                    >
                      <Edit2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() =>
                      order.status === "ready"
                        ? onCollect(order)
                        : onOpenOrder(order)
                    }
                    className={quietButton(
                      "min-h-10 shrink-0 px-3 text-xs font-semibold w-full",
                    )}
                  >
                    {actionLabel}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Card>
  );
}
