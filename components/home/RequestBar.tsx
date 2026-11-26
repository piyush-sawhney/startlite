"use client";

import { cn } from "@/lib/cn";
import { ChevronRight, Zap } from "lucide-react";

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
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-warning text-white"
          aria-hidden="true"
        >
          <Zap className="h-4 w-4" />
        </span>
        <span className="truncate text-small font-semibold text-ink">
          <strong>{count}</strong> {count === 1 ? "request" : "requests"} · oldest {oldestAge}
        </span>
      </div>

      <button
        type="button"
        onClick={onReview}
        className="inline-flex min-h-9 shrink-0 items-center gap-0.5 rounded-xl px-2 text-caption font-bold text-warning transition hover:bg-warning/10"
      >
        Review
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * A signal, not a second list. The sidebar already shows every request, so
 * Home only states that requests exist and offers one way in.
 */
export function RequestDesktopBanner({
  count,
  oldestAge,
  onReview,
}: {
  count: number;
  oldestAge: string;
  onReview: () => void;
}) {
  if (count <= 0) return null;

  return (
    <div
      role="region"
      aria-label="Storefront requests"
      className="hidden items-center gap-3 rounded-xl border border-warning/30 bg-warning-soft px-3 py-2 lg:flex"
    >
      <Zap className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      <p className="flex-1 text-small font-semibold text-ink">
        {count} {count === 1 ? "request" : "requests"} waiting
        <span className="font-normal text-ink-muted"> · oldest {oldestAge}</span>
      </p>
      <button
        type="button"
        onClick={onReview}
        className="inline-flex min-h-9 items-center gap-0.5 rounded-xl px-2.5 text-caption font-bold text-warning transition hover:bg-warning/15"
      >
        Review
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

/** The one desktop request affordance, placed above the day view. */
export function RequestDesktopPill({
  count,
  oldestAge,
  onReview,
}: {
  count: number;
  oldestAge: string;
  onReview: () => void;
}) {
  if (count <= 0) return null;

  return (
    <button
      type="button"
      onClick={onReview}
      className="flex w-full items-center gap-2 rounded-xl border border-warning/30 bg-warning-soft px-3 py-2 text-left transition hover:bg-warning/15"
    >
      <Zap className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      <span className="flex-1 text-small font-bold text-ink">
        {count} {count === 1 ? "request" : "requests"}
        <span className="font-normal text-ink-muted"> · oldest {oldestAge}</span>
      </span>
      <span className="inline-flex items-center gap-0.5 text-caption font-bold text-warning">
        Review
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </button>
  );
}
