"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { PendingRequestItem } from "@/lib/home-types";

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
        "flex h-11 items-center justify-between rounded-xl border border-accent/30 bg-accent-soft px-3.5 text-sm transition hover:border-accent/50",
        className,
      )}
    >
      <div className="flex items-center gap-2 font-medium text-ink">
        <span className="text-base text-accent-strong" aria-hidden="true">
          ⚡
        </span>
        <span className="text-xs sm:text-sm">
          <strong>{count}</strong> {count === 1 ? "request" : "requests"} · oldest {oldestAge}
        </span>
      </div>

      <button
        type="button"
        onClick={onReview}
        className="text-xs sm:text-sm font-bold text-accent-strong hover:underline"
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
      className="hidden rounded-2xl border-2 border-accent/40 bg-gradient-to-r from-accent-soft via-surface to-accent-soft/80 p-4 shadow-[0_2px_12px_rgb(20_18_15/0.06)] lg:block"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-base font-black text-white shadow-sm">
            ⚡
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold tracking-tight text-ink">
                Storefront Requests ({count} waiting)
              </h2>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-bold text-accent-strong">
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
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-accent px-4 text-xs font-bold text-white shadow transition hover:bg-accent-strong active:scale-95"
        >
          Review All ({count}) ›
        </button>
      </div>

      {requests.length > 0 ? (
        <div className="mt-3.5 grid grid-cols-3 gap-2.5 border-t border-accent/20 pt-3">
          {requests.slice(0, 3).map((req) => (
            <Link
              key={req.id}
              href={`/o/${req.code}`}
              className="group flex flex-col justify-between rounded-xl border border-line bg-surface p-3 transition hover:border-accent hover:shadow-sm"
            >
              <div className="min-w-0">
                <p
                  className="truncate text-xs font-bold text-ink group-hover:text-accent-strong"
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
              <div className="mt-2.5 flex items-center justify-between border-t border-line/60 pt-2">
                <span className="tnum text-xs font-bold text-ink">
                  {req.grandTotal}
                </span>
                <span className="text-[11px] font-bold text-accent-strong group-hover:underline">
                  Review ›
                </span>
              </div>
            </Link>
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
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-3 text-xs font-bold text-accent-strong shadow-[0_1px_2px_rgb(20_18_15/0.05)] transition hover:bg-accent/20"
    >
      <span aria-hidden="true">⚡</span>
      <span>
        {count} {count === 1 ? "request" : "requests"}
      </span>
    </button>
  );
}
