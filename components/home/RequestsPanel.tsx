"use client";

import { formatNeededBy } from "@/lib/bill";
import type { PendingRequestItem } from "@/lib/home-types";
import { ChevronRight, MessageSquare, X, Zap } from "lucide-react";
import { orderSummary } from "@/lib/order-summary";

/**
 * Requests read like the rest of Home: a list of records you tap to open.
 * Tapping a request opens the same order sheet that an order card opens, so
 * the actions always appear in one predictable place.
 */
export function RequestsPanel({
  requests,
  isOpen,
  onClose,
  onSelectRequest,
}: {
  requests: PendingRequestItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectRequest: (request: PendingRequestItem) => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Storefront requests"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-stretch sm:justify-end"
    >
      <section className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl border border-line bg-surface shadow-2xl sm:h-full sm:max-h-none sm:max-w-[440px] sm:rounded-none sm:border-y-0 sm:border-r-0">
        <header className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning"
            aria-hidden="true"
          >
            <Zap className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-title font-bold text-ink">Requests</h2>
            <p className="text-caption text-ink-muted">
              {requests.length} {requests.length === 1 ? "request" : "requests"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close requests"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-ink-muted transition hover:bg-muted hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 space-y-2 overflow-y-auto overscroll-contain p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-4">
          {requests.length === 0 ? (
            <p className="py-10 text-center text-small text-ink-muted">
              No requests.
            </p>
          ) : (
            requests.map((req) => (
              <button
                key={req.id}
                type="button"
                onClick={() => onSelectRequest(req)}
                className="w-full rounded-xl border border-line border-l-[3px] border-l-warning bg-surface px-3 py-2.5 text-left shadow-[0_1px_2px_rgb(20_18_15/0.04)] transition hover:border-warning/50 hover:bg-warning-soft/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-ink" title={req.buyerName}>
                      {req.buyerName}
                    </p>
                    <p className="mt-0.5 text-caption text-ink-muted">
                      Needed by {formatNeededBy(req.neededBy)}
                      {req.timeSlot ? ` · ${req.timeSlot}` : " · Any time"}
                    </p>
                  </div>
                  <p className="figure shrink-0 text-small font-bold text-ink">
                    {req.grandTotal}
                  </p>
                </div>
                <p className="mt-1.5 text-small text-ink">
                  {orderSummary(req.lines.map((line) => line.itemName))}
                </p>
                {req.note ? (
                  <p className="mt-1 flex items-center gap-1 text-caption text-warning">
                    <MessageSquare className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{req.note}</span>
                  </p>
                ) : null}
                <span className="mt-1.5 inline-flex items-center gap-1 text-caption font-bold text-accent-strong">
                  Review and accept
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
