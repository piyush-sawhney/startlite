"use client";

import { cn } from "@/lib/cn";
import type { PendingRequestItem } from "@/lib/home-types";
import { Zap } from "lucide-react";

export function RequestBar({
  count,
  oldestAge,
  onReview,
  className,
}: {
  count: number;
  oldestAge: string;
  onReview: () => void;
  className?: string;
}) {
  if (count <= 0) return null;

  return (
    <div
      role="region"
      aria-label="Storefront requests"
      className={cn(
        "flex min-h-11 items-center justify-between gap-2 rounded-xl border border-warning/30 bg-warning-soft px-3 py-1.5 transition hover:border-warning/60",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-warning text-white"
          aria-hidden="true"
        >
          <Zap className="h-3.5 w-3.5" />
        </span>
        <span className="truncate text-xs font-semibold text-ink sm:text-sm">
          <strong>{count}</strong> {count === 1 ? "request" : "requests"} · oldest {oldestAge}
        </span>
      </div>

      <button
        type="button"
        onClick={onReview}
        className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-bold text-warning transition hover:bg-warning/10 sm:text-sm"
      >
        Review ›
      </button>
    </div>
  );
}

export function RequestDesktopBanner({
  count,
  oldestAge,
  requests,
  onReview,
}: {
  count: number;
  oldestAge: string;
  requests: PendingRequestItem[];
  onReview: () => void;
}) {
  if (count <= 0) return null;

  return (
    <div
      role="region"
      aria-label="Storefront requests"
      className="hidden rounded-2xl border border-warning/30 bg-surface p-4 shadow-[0_4px_16px_rgb(20_18_15/0.06)] lg:block"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-warning text-white">
            <Zap className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[15px] font-bold tracking-tight text-ink">
                Storefront requests ({count} waiting)
              </h2>
              <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-bold text-warning">
                Oldest {oldestAge}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">
              Buyers submitted these orders through your public WhatsApp storefront.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReview}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-warning/40 bg-warning-soft px-4 text-xs font-bold text-warning transition hover:bg-warning/15"
        >
          Review all ({count}) ›
        </button>
      </div>

      {requests.length > 0 ? (
        <div className="mt-3.5 grid grid-cols-3 gap-2.5 border-t border-line pt-3">
          {requests.slice(0, 3).map((req) => (
            <button
              key={req.id}
              type="button"
              onClick={onReview}
              className="group flex flex-col justify-between rounded-xl border border-line bg-surface p-3 text-left transition hover:border-warning/50 hover:bg-warning-soft/40"
            >
              <div className="min-w-0">
                <p
                  className="truncate text-xs font-bold text-ink"
                  title={req.buyerName}
                >
                  {req.buyerName}
                </p>
                <p
                  className="truncate text-[11px] text-ink-muted"
                  title={`${req.itemCount} items${req.timeSlot ? ` · ${req.timeSlot}` : ""} · ${req.neededBy}`}
                >
                  {req.itemCount} {req.itemCount === 1 ? "item" : "items"}
                  {req.timeSlot ? ` · ${req.timeSlot}` : ""}
                </p>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2">
                <span className="tnum text-xs font-bold text-ink">
                  {req.grandTotal}
                </span>
                <span className="text-[11px] font-bold text-warning group-hover:underline">
                  Review ›
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function RequestDesktopPill({
  count,
  onReview,
}: {
  count: number;
  onReview: () => void;
}) {
  if (count <= 0) return null;

  return (
    <button
      type="button"
      onClick={onReview}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-warning/40 bg-warning-soft px-3 text-xs font-bold text-warning shadow-[0_1px_2px_rgb(20_18_15/0.05)] transition hover:bg-warning/15"
    >
      <Zap className="h-3.5 w-3.5" aria-hidden="true" />
      <span>
        {count} {count === 1 ? "request" : "requests"}
      </span>
    </button>
  );
}
