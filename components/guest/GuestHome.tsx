"use client";

import Link from "next/link";
import {
  EmptyState,
  MetricTile,
  PageHeader,
  SectionLabel,
  StatusPill,
  primaryButton,
  quietButton,
} from "@/components/ui";
import { formatPaise } from "@/lib/paise";
import {
  guestOrdersNewestFirst,
  guestOrderTotals,
  guestSummary,
} from "@/lib/guest-store";
import { SaveBanner, shortDate } from "./GuestBits";
import type { GuestViewProps } from "./types";

export function GuestHome({ state, go, signInHref }: GuestViewProps) {
  const summary = guestSummary(state);
  const recent = guestOrdersNewestFirst(state).slice(0, 5);
  const active = guestOrdersNewestFirst(state).filter(
    (order) => guestOrderTotals(order).status === "open_tab",
  );

  return (
    <>
      <PageHeader
        eyebrow="Today at your shop"
        title="Namaste"
        subtitle={state.shop.name}
        action={
          <button
            type="button"
            className={primaryButton("hidden lg:inline-flex")}
            onClick={() => go({ kind: "new-sale" })}
          >
            Add sale
          </button>
        }
      />

      <div className="grid gap-2.5 sm:grid-cols-3">
        <MetricTile
          label="Today's sales"
          value={formatPaise(summary.todaySalesPaise)}
          period="Today"
        />
        <MetricTile
          label="Received today"
          value={formatPaise(summary.receivedTodayPaise)}
          period="Cash and UPI"
          tone="success"
        />
        <MetricTile
          label="Pending"
          value={formatPaise(summary.pendingPaise)}
          period="All bills"
          tone="warning"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          {active.length > 0 ? (
            <section className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <SectionLabel>To collect</SectionLabel>
                <button
                  type="button"
                  className="text-sm font-semibold text-accent"
                  onClick={() => go({ kind: "sales" })}
                >
                  See all
                </button>
              </div>
              <div className="space-y-2">
                {active.slice(0, 3).map((order) => {
                  const totals = guestOrderTotals(order);
                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => go({ kind: "sale", id: order.id })}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-accent/25 bg-accent-soft px-4 py-3 text-left transition hover:border-accent/45"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">
                          {order.customerName || "Walk-in sale"}
                        </span>
                        <span className="block text-xs text-ink-muted">
                          {order.code} · {shortDate(order.createdAt)}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="tnum block font-semibold">
                          {formatPaise(totals.duePaise)}
                        </span>
                        <span className="text-[11px] font-semibold text-accent-strong">
                          Collect →
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section>
            <div className="mb-2 flex items-center justify-between">
              <SectionLabel>Recent orders</SectionLabel>
              {recent.length > 0 ? (
                <button
                  type="button"
                  className="text-sm font-semibold text-accent"
                  onClick={() => go({ kind: "sales" })}
                >
                  See all
                </button>
              ) : null}
            </div>

            {recent.length === 0 ? (
              <EmptyState
                title="No orders yet"
                body="Add your first sale. It takes three taps."
              />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                {recent.map((order, index) => {
                  const totals = guestOrderTotals(order);
                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => go({ kind: "sale", id: order.id })}
                      className={`block w-full px-4 py-3 text-left transition hover:bg-muted/60 ${
                        index > 0 ? "border-t border-line" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {order.customerName || "Walk-in sale"}
                          </p>
                          <p className="mt-0.5 text-xs text-ink-muted">
                            {order.code} · {shortDate(order.createdAt)} ·{" "}
                            {order.lines.length} item
                            {order.lines.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="tnum font-semibold">
                            {formatPaise(totals.totalPaise)}
                          </p>
                          <p className="mt-0.5 text-xs text-ink-muted">
                            {totals.duePaise > 0
                              ? `${formatPaise(totals.duePaise)} due`
                              : "Paid"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <StatusPill status={totals.status} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <SectionLabel>Quick actions</SectionLabel>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                className={primaryButton("w-full")}
                onClick={() => go({ kind: "new-sale" })}
              >
                Add sale
              </button>
              <button
                type="button"
                className={quietButton("w-full")}
                onClick={() => go({ kind: "customers" })}
              >
                See customers
              </button>
              <button
                type="button"
                className={quietButton("w-full")}
                onClick={() => go({ kind: "catalog" })}
              >
                Edit menu
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] leading-5 text-ink-subtle">
              {state.items.length} items · {summary.customerCount} customers
            </p>
          </div>

          <SaveBanner signInHref={signInHref} />
        </aside>
      </div>

      <div className="mt-6 lg:hidden">
        <button
          type="button"
          className={primaryButton("w-full min-h-12 text-base")}
          onClick={() => go({ kind: "new-sale" })}
        >
          Add sale
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-ink-subtle lg:mt-8">
        Your store link is created when you save.{" "}
        <Link href={signInHref} className="font-semibold text-accent">
          Save now
        </Link>
      </p>
    </>
  );
}
