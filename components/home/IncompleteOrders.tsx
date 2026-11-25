"use client";

import { Card, SectionLabel, StatusPill, quietButton } from "@/components/ui";
import { whatsappLink } from "@/lib/bill";
import { formatNeededBy } from "@/lib/bill";
import { istDateString } from "@/lib/date";
import { isReady } from "@/lib/order-status";
import {
  CalendarClock,
  ClipboardList,
  MessageCircle,
  MessageSquare,
  Package,
  Phone,
  Send,
  Edit2,
} from "lucide-react";
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
  const visibleOrders = orders.slice(0, HOME_ORDER_LIMIT);
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
        className={`rounded-xl border border-line border-l-[3px] bg-surface px-3.5 py-3 shadow-[0_1px_2px_rgb(20_18_15/0.04)] ${
          isCollectGroup ? "border-l-accent" : "border-l-warning"
        }`}
      >
        <button
          type="button"
          onClick={() => onOpenOrder(order)}
          aria-label={`Order details: ${order.customerName}, ${order.itemsSummary}, ${order.due} due`}
          className="block w-full min-w-0 text-left"
        >
          {/* One tight block: deadline and items lead, details sit below. */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="flex min-w-0 items-center gap-1.5 text-small">
                <CalendarClock
                  className="h-3.5 w-3.5 shrink-0 text-accent-strong"
                  aria-hidden="true"
                />
                <span className="eyebrow shrink-0 text-ink-subtle">Needed by</span>
                <span className="truncate font-bold text-ink">
                  {needed ?? "Any time"}
                  {hasSlot && order.timeSlot ? ` · ${order.timeSlot}` : ""}
                </span>
              </p>
              <p className="mt-1.5 flex items-start gap-1.5 text-small leading-5">
                <Package
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted"
                  aria-hidden="true"
                />
                <span className="line-clamp-2 font-semibold text-ink" title={order.itemsSummary}>
                  {order.itemsSummary}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              {isOverdue(order) ? (
                <span className="rounded-full bg-danger px-2 py-0.5 text-caption font-bold text-white">
                  Overdue
                </span>
              ) : null}
              <StatusPill status={order.status} />
            </div>
          </div>

          {order.note ? (
            <p className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-warning-soft px-2 py-1 text-caption leading-4 text-ink">
              <MessageSquare
                className="mt-0.5 h-3 w-3 shrink-0 text-warning"
                aria-hidden="true"
              />
              <span className="line-clamp-2">{order.note}</span>
            </p>
          ) : null}

          <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-2">
            <p className="min-w-0 truncate text-caption text-ink-muted">
              <span className="font-semibold text-ink">{order.customerName}</span>
              <span className="tnum"> · #{order.code}</span>
              <span className="tnum"> · Placed {placed}</span>
            </p>
            <p
              className={`figure shrink-0 text-small font-bold ${
                isCollectGroup ? "text-accent-strong" : "text-ink"
              }`}
            >
              {isCollectGroup
                ? `${order.due} due`
                : `${order.total} total · ${order.due} due`}
            </p>
          </div>
        </button>

        {/* Contact shortcuts and the single row action share one bar. */}
        <div className="mt-2.5 flex items-center gap-2">
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
                ? "ml-auto min-h-10 shrink-0 rounded-xl border border-accent/30 bg-accent-soft px-3.5 text-xs font-bold text-accent-strong transition hover:bg-accent/15"
                : quietButton("ml-auto min-h-10 shrink-0 px-3.5 text-xs font-semibold")
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
      <div className="flex items-start gap-3 border-b border-line px-4 py-3.5">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"
          aria-hidden="true"
        >
          <ClipboardList className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <SectionLabel>Pending orders</SectionLabel>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
              {toFinishCount} to finish
            </span>
            <span className="text-ink-subtle" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {readyCount} to collect
            </span>
          </div>
        </div>
        <p className="tnum shrink-0 self-center text-sm font-bold text-ink">
          {totalDue}
          <span className="block text-[10px] font-medium text-ink-subtle">pending</span>
        </p>
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
          {renderGroup("to-finish", "To finish", toFinishCount, "bg-warning", toFinish)}
          {renderGroup(
            "ready-to-collect",
            "Ready to collect",
            readyCount,
            "bg-accent",
            readyToCollect,
          )}
        </div>
      )}
    </Card>
  );
}
