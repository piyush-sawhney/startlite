"use client";

import { formatNeededBy } from "@/lib/bill";
import type { PendingRequestItem } from "@/lib/home-types";
import { ChevronRight, MessageSquare, X } from "lucide-react";

/**
 * A minimal list: tap a request to open the same order sheet an order opens.
 * All actions stay in that one predictable place.
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
      <section className="flex max-h-[90dvh] w-full flex-col rounded-t-2xl border border-line bg-surface shadow-2xl sm:h-full sm:max-h-none sm:max-w-[420px] sm:rounded-none sm:border-y-0 sm:border-r-0">
        <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-2.5">
          <h2 className="flex-1 text-small font-bold text-ink">Requests</h2>
          <span className="text-caption text-ink-muted">{requests.length}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close requests"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition hover:bg-muted hover:text-ink"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain p-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {requests.length === 0 ? (
            <p className="py-10 text-center text-small text-ink-muted">
              No requests.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {requests.map((req) => (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => onSelectRequest(req)}
                  className="w-full px-2 py-2.5 text-left transition hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-ink">{req.buyerName}</p>
                      <p className="text-caption text-ink-muted">
                        Needed by {formatNeededBy(req.neededBy)}
                        {req.timeSlot ? ` · ${req.timeSlot}` : " · Any time"}
                      </p>
                      {req.buyerPhone ? (
                        <p className="text-caption text-ink-subtle">{req.buyerPhone}</p>
                      ) : null}
                    </div>
                    <p className="figure shrink-0 text-small font-bold text-ink">
                      {req.grandTotal}
                    </p>
                  </div>

                  <div className="mt-2 rounded-lg bg-muted/60 px-2.5">
                    <p className="eyebrow py-1 text-ink-subtle">Items</p>
                    <div className="divide-y divide-line">
                      {req.lines.map((line, index) => (
                        <div
                          key={`${line.itemName}-${index}`}
                          className="flex items-center justify-between gap-2 py-1.5 text-small"
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-medium text-ink">
                              {line.itemName}
                            </span>
                            <span className="block truncate text-caption text-ink-muted">
                              {line.quantity} {line.unitLabel}
                              {line.optionName ? ` · ${line.optionName}` : ""}
                              {line.extraNames.length
                                ? ` · ${line.extraNames.join(", ")}`
                                : ""}
                            </span>
                          </span>
                          <span className="figure shrink-0 font-semibold text-ink">
                            {line.lineTotal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {req.note ? (
                    <p className="mt-2 flex items-start gap-1.5 text-caption text-warning">
                      <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                      <span>Note: {req.note}</span>
                    </p>
                  ) : null}

                  <span className="mt-2 inline-flex items-center gap-1 text-caption font-bold text-accent-strong">
                    Open to accept
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
