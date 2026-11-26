"use client";

import { useMemo, useState } from "react";
import { Card, PaymentPill, RowAction, StatusPill } from "@/components/ui";
import { whatsappLink } from "@/lib/bill";
import { callLink, smsLink } from "@/lib/contact";
import { formatDateDMY, istDateString } from "@/lib/date";

/** IST date and time from a stored ISO timestamp. */
function placedAt(iso: string): string {
  const ist = new Date(new Date(iso).getTime() + 5.5 * 3600_000).toISOString();
  return `${formatDateDMY(ist.slice(0, 10))} · ${ist.slice(11, 16)}`;
}
import { isReady } from "@/lib/order-status";
import {
  Check,
  ChevronDown,
  Edit2,
  MessageCircle,
  PackageCheck,
  Phone,
  Send,
  Wallet,
} from "lucide-react";
import { paidAmount, paymentStatus } from "@/lib/payment-status";
import type { IncompleteOrder } from "@/lib/home-types";
import { ListHeader } from "./ListHeader";

const HOME_ORDER_LIMIT = 10;

type SortKey = "priority" | "needed" | "newest" | "due";

const SORT_LABELS: Record<SortKey, string> = {
  priority: "Priority",
  needed: "Needed date",
  newest: "Newest",
  due: "Amount due",
};

function sortOrders(orders: IncompleteOrder[], key: SortKey) {
  if (key === "priority") return orders;
  const sorted = [...orders];
  if (key === "needed") {
    return sorted.sort(
      (a, b) =>
        (a.neededBy || "").localeCompare(b.neededBy || "") ||
        (a.timeSlot ?? "").localeCompare(b.timeSlot ?? "") ||
        a.createdAt.localeCompare(b.createdAt),
    );
  }
  if (key === "newest") {
    return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return sorted.sort((a, b) => (b.duePaise ?? 0) - (a.duePaise ?? 0));
}

/** Deadline hue only: past is red, today is amber, later is plain ink. */
function neededTone(neededBy: string): string {
  if (!neededBy) return "text-ink";
  const today = istDateString();
  if (neededBy < today) return "text-danger";
  if (neededBy === today) return "text-warning";
  return "text-ink";
}

const contactClass =
  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition after:absolute after:-inset-1 after:content-['']";

export function IncompleteOrders({
  title = "Pending orders",
  totalDue,
  totalCount,
  orders,
  onOpenOrder,
  onCollect,
  onEdit,
}: {
  title?: string;
  totalDue: string;
  totalCount: number;
  orders: IncompleteOrder[];
  onOpenOrder: (order: IncompleteOrder) => void;
  onCollect: (order: IncompleteOrder) => void;
  onEdit?: (order: IncompleteOrder) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [showSort, setShowSort] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const controlsId = `order-list-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const visibleOrders = useMemo(
    () => sortOrders(orders.slice(0, HOME_ORDER_LIMIT), sortKey),
    [orders, sortKey],
  );

  function renderOrder(order: IncompleteOrder) {
    const placed = placedAt(order.createdAt);
    const needed = formatDateDMY(order.neededBy);
    const hasSlot = Boolean(
      order.timeSlot &&
        !["any time", "none"].includes(order.timeSlot.trim().toLowerCase()),
    );
    const isCollectGroup = isReady(order.status);
    // The row action names the next action, and opens the sheet that performs
    // it. No "Review" intermediary step.
    const actionLabel = isCollectGroup
      ? "Collect"
      : order.status === "under_review" || order.status === "waiting_client"
        ? "Accept"
        : "Mark done";
    const actionIcon = isCollectGroup
      ? Wallet
      : order.status === "under_review" || order.status === "waiting_client"
        ? Check
        : PackageCheck;
    const payStatus = paymentStatus(order.total, order.due);
    const paid = paidAmount(order.total, order.due);
    const itemCount = order.lines?.length ?? 0;

    // `hasPhone` guards rendering; the fallback keeps the link helpers
    // (which require a string) type-safe without changing runtime data.
    const phone = order.customerPhone ?? "";
    const countryCode = order.customerCountryCode;
    const hasPhone = phone.trim().length > 0;

    const customerMessage =
      `Hi ${order.customerName}, your StartLite order #${order.code} (${order.itemsSummary}) ${isCollectGroup ? "is ready for collection" : "is pending"}. Amount due: ${order.due}.`;

    return (
      <article
        key={order.id}
        className="rounded-xl px-3.5 py-3.5 transition hover:bg-muted/40 lg:py-3"
      >
        <button
          type="button"
          onClick={() => onOpenOrder(order)}
          aria-label={`Order details: ${order.customerName}, ${order.itemsSummary}, ${order.due} due`}
          className="block w-full min-w-0 text-left"
        >
          <div className="grid gap-x-5 gap-y-1.5 lg:grid-cols-[minmax(0,1fr)_auto]">
            <p className="min-w-0 truncate text-body font-bold text-ink">
              {order.customerName || "Walk-in"}
              <span className="ml-2 text-small font-medium text-ink">
                · #{order.code}
              </span>
            </p>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <StatusPill status={order.status} />
              <PaymentPill status={payStatus} />
            </div>

            <p className="min-w-0 text-small text-ink">
              Note:{" "}
              {order.note ? (
                <span className="font-bold">“{order.note}”</span>
              ) : (
                <span>—</span>
              )}
            </p>
            <p className="text-small font-medium text-ink">
              Needed by:{" "}
              <span className={`font-bold ${neededTone(order.neededBy)}`}>
                {needed ?? "Any time"}
                {hasSlot && order.timeSlot ? ` · ${order.timeSlot}` : ""}
              </span>
            </p>

            <p className="min-w-0 truncate text-small font-medium text-ink" title={order.itemsSummary}>
              {order.itemsSummary}
              {itemCount > 0 ? (
                <span className="ml-1 text-small text-ink">
                  · {itemCount} total {itemCount === 1 ? "item" : "items"}
                </span>
              ) : null}
            </p>
            <p className="text-small text-ink">
              Placed on: <span className="font-semibold">{placed}</span>
            </p>

            <p className="text-small font-medium text-ink">
              Paid: <span className="figure font-bold text-success">{paid}</span>
              <span className="mx-1.5">·</span>
              Due: <span className="figure font-bold text-warning">{order.due}</span>
            </p>
            <p className="text-small font-medium text-ink">
              Total: <span className="figure font-bold">{order.total}</span>
            </p>
          </div>
        </button>

        {/* One left-aligned action row, consistent on mobile and desktop. */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-2.5">
          {hasPhone ? (
            <>
              <a
                href={whatsappLink(phone, customerMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${order.customerName}`}
                className={`${contactClass} bg-success-soft text-success hover:bg-success/20`}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={smsLink(phone, countryCode, customerMessage)}
                aria-label={`SMS ${order.customerName}`}
                className={`${contactClass} bg-info-soft text-info hover:bg-info/20`}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={callLink(phone, countryCode)}
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
              onClick={() => onEdit(order)}
              aria-label={`Edit ${order.customerName} order`}
              className={`${contactClass} gap-1.5 border border-line bg-muted px-2 text-ink-muted hover:bg-line hover:text-ink sm:w-auto`}
            >
              <Edit2 className="h-4 w-4" aria-hidden="true" />
              <span className="hidden text-caption font-bold sm:inline">Edit order</span>
            </button>
          ) : null}

          <div className="flex items-center gap-1.5">
            <RowAction
              icon={actionIcon}
              label={actionLabel}
              tone={isCollectGroup ? "warning" : "accent"}
              onClick={() =>
                isCollectGroup ? onCollect(order) : onOpenOrder(order)
              }
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <ListHeader
        title={title}
        count={totalCount}
        total={totalDue}
        totalLabel="Total due"
        controlsId={controlsId}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      >
        {totalCount > 0 ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSort(!showSort)}
              aria-expanded={showSort}
              aria-label={`Sort orders: ${SORT_LABELS[sortKey]}`}
              className="relative inline-flex min-h-9 items-center gap-1 rounded-xl px-2 text-caption font-bold text-ink transition after:absolute after:-inset-1 after:content-[''] hover:bg-muted"
            >
              <span className="hidden sm:inline">Sort: </span>
              {SORT_LABELS[sortKey]}
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {showSort ? (
              <div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-line bg-surface shadow-lg">
                {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSortKey(key);
                      setShowSort(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-small transition hover:bg-muted ${
                      key === sortKey ? "font-bold text-ink" : "text-ink"
                    }`}
                  >
                    {SORT_LABELS[key]}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </ListHeader>
      {!collapsed ? (
        <div
          id={controlsId}
          className="space-y-2 p-2 lg:max-h-[24rem] lg:overflow-y-auto lg:overscroll-contain"
        >
          {totalCount === 0 ? (
            <p className="py-4 text-center text-small text-ink-muted">No orders.</p>
          ) : (
            visibleOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(20_18_15/0.05)]"
              >
                {renderOrder(order)}
              </div>
            ))
          )}
        </div>
      ) : null}
    </Card>
  );
}
