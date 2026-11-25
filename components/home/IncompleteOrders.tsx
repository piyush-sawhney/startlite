"use client";

import { useMemo, useState } from "react";
import { Card, StatusPill } from "@/components/ui";
import { whatsappLink } from "@/lib/bill";
import { formatNeededBy } from "@/lib/bill";
import { callLink, phoneDigits, smsLink } from "@/lib/contact";
import { istDateString } from "@/lib/date";
import { isReady } from "@/lib/order-status";
import {
  CalendarClock,
  ClipboardList,
  MessageCircle,
  MessageSquare,
  Package,
  ChevronDown,
  Phone,
  Send,
  Edit2,
} from "lucide-react";
import type { IncompleteOrder } from "@/lib/home-types";

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

function isOverdue(order: IncompleteOrder): boolean {
  if (!order.neededBy) return false;
  return order.neededBy < istDateString();
}

const contactClass =
  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition after:absolute after:-inset-1 after:content-['']";

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
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [showSort, setShowSort] = useState(false);
  const visibleOrders = useMemo(
    () => sortOrders(orders.slice(0, HOME_ORDER_LIMIT), sortKey),
    [orders, sortKey],
  );
  const toFinish = visibleOrders.filter((order) => !isReady(order.status));
  const readyToCollect = visibleOrders.filter((order) => isReady(order.status));

  function renderOrder(order: IncompleteOrder) {
    const placed = formatNeededBy(
      istDateString(new Date(order.createdAt)),
    );
    const needed = formatNeededBy(order.neededBy);
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
        : "Mark ready";

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
        className={`rounded-xl border border-line border-l-[3px] bg-surface px-3 py-2.5 shadow-[0_1px_2px_rgb(20_18_15/0.04)] 2xl:grid 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-center 2xl:gap-3 lg:px-3 lg:py-2 ${
          isCollectGroup ? "border-l-warning" : "border-l-accent/60"
        }`}
      >
        <button
          type="button"
          onClick={() => onOpenOrder(order)}
          aria-label={`Order details: ${order.customerName}, ${order.itemsSummary}, ${order.due} due`}
          className="block w-full min-w-0 text-left 2xl:col-start-1 2xl:min-w-0"
        >
          {/* One tight block: deadline and items lead, details sit below. */}
          {/* Deadline and money lead; items and the buyer's note follow. */}
          <div className="flex items-start justify-between gap-2 2xl:items-center 2xl:gap-4">
            <div className="min-w-0 2xl:flex-1">
              <p className="flex items-center gap-1.5 text-caption text-ink-subtle">
                <CalendarClock
                  className="h-3.5 w-3.5 shrink-0 text-accent-strong"
                  aria-hidden="true"
                />
                Needed by
              </p>
              <p className="mt-0.5 truncate text-body font-bold text-ink">
                {needed ?? "Any time"}
                {hasSlot && order.timeSlot ? ` · ${order.timeSlot}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <p
                className={`figure text-small font-bold ${
                  isCollectGroup ? "text-warning" : "text-ink"
                }`}
              >
                {isCollectGroup
                  ? `${order.due} due`
                  : `${order.due} due · ${order.total} total`}
              </p>
              <div className="flex flex-wrap items-center justify-end gap-1">
                {isOverdue(order) ? (
                  <span className="rounded-full bg-danger px-2 py-0.5 text-caption font-bold text-white">
                    Overdue
                  </span>
                ) : null}
                <StatusPill status={order.status} />
              </div>
            </div>
          </div>

          <div className="2xl:mt-1 2xl:flex 2xl:items-start 2xl:gap-4">
            <div className="mt-2 min-w-0 flex-1 2xl:mt-0">
              <p className="flex items-start gap-1.5 text-small leading-5">
                <Package
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted"
                  aria-hidden="true"
                />
                <span className="font-semibold text-ink">{order.itemsSummary}</span>
              </p>
              {order.note ? (
                <p className="mt-1 flex items-start gap-1.5 rounded-lg bg-warning-soft px-2 py-1 text-caption leading-4 text-ink">
                  <MessageSquare
                    className="mt-0.5 h-3 w-3 shrink-0 text-warning"
                    aria-hidden="true"
                  />
                  <span>{order.note}</span>
                </p>
              ) : null}
            </div>

            <p className="mt-1.5 truncate text-caption text-ink-muted 2xl:mt-0 2xl:w-[160px] 2xl:shrink-0">
              <span className="font-semibold text-ink">{order.customerName}</span>
              <span className="tnum"> · #{order.code}</span>
              <span className="tnum"> · Placed {placed}</span>
            </p>
          </div>
        </button>

        {/* Contact shortcuts and the single row action share one bar. */}
        <div className="mt-2.5 flex items-center gap-2 2xl:col-start-2 2xl:row-start-1 2xl:mt-0 2xl:shrink-0 2xl:border-l 2xl:border-line 2xl:pl-3">
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
              className={`${contactClass} border border-line bg-muted text-ink-muted hover:bg-line hover:text-ink`}
            >
              <Edit2 className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={() =>
              isCollectGroup ? onCollect(order) : onOpenOrder(order)
            }
            className={
              isCollectGroup
                ? "ml-auto inline-flex min-h-9 shrink-0 items-center justify-center rounded-xl border border-warning/30 bg-warning-soft px-3 text-xs font-bold text-warning transition hover:bg-warning/15 lg:min-h-10"
                : "ml-auto inline-flex min-h-9 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft px-3 text-xs font-bold text-accent-strong transition hover:bg-accent/15 lg:min-h-10"
            }
          >
            {actionLabel}
          </button>
        </div>
      </article>
    );
  }

  function renderGroup(
    id: string,
    title: string,
    count: number,
    dotClass: string,
    orders: IncompleteOrder[],
  ) {
    if (orders.length === 0) return null;
    return (
      <section key={id} aria-labelledby={`queue-${id}`}>
        <div className="flex items-center gap-2 border-b border-line bg-muted/60 px-4 py-2">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden="true" />
          <h3
            id={`queue-${id}`}
            className="text-xs font-bold uppercase tracking-[0.08em] text-ink"
          >
            {title}
          </h3>
          <span className="ml-auto rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-ink-muted">
            {count}
          </span>
        </div>
        <div className="space-y-2 p-2">{orders.map(renderOrder)}</div>
      </section>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-2.5 lg:gap-3 lg:py-2">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"
          aria-hidden="true"
        >
          <ClipboardList className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-small font-bold text-ink lg:text-body">
            Pending orders
          </h2>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-caption text-ink-muted">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {toFinishCount} to finish
            </span>
            <span className="text-ink-subtle" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
              {readyCount} to collect
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {totalCount > 0 ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSort(!showSort)}
                aria-expanded={showSort}
                aria-label={`Sort orders: ${SORT_LABELS[sortKey]}`}
                className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-caption font-bold text-accent-strong transition hover:bg-accent-soft"
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
                        key === sortKey
                          ? "font-bold text-accent-strong"
                          : "text-ink-muted"
                      }`}
                    >
                      {SORT_LABELS[key]}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="text-right">
            <p className="eyebrow text-ink-subtle">Due</p>
            <p className="figure text-small font-bold text-ink">{totalDue}</p>
          </div>
        </div>
      </div>

      {/* Mobile scrolls with the page. Only the desktop card scrolls inside
          itself, with overscroll contained so it never moves the page. */}
      {totalCount === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-ink-muted">
          No pending orders.
        </p>
      ) : (
        <div
          aria-label="Pending orders"
          className="space-y-2 p-2 lg:max-h-[34rem] lg:overflow-y-auto lg:overscroll-contain"
        >
          {renderGroup("to-finish", "To finish", toFinishCount, "bg-accent", toFinish)}
          {renderGroup(
            "ready-to-collect",
            "Ready to collect",
            readyCount,
            "bg-warning",
            readyToCollect,
          )}
        </div>
      )}
    </Card>
  );
}
