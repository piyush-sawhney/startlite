"use client";

import { useState } from "react";
import { formatNeededBy } from "@/lib/bill";
import { primaryButton } from "@/components/ui";
import type { PendingRequestItem } from "@/lib/home-types";
import { MessageSquare, X, Zap } from "lucide-react";

/**
 * One step: every request shows what the buyer wants and a single Accept
 * action. The sheet uses the same cards, labels and buttons as the rest of
 * Home — reading the card is the review, with no detail screen or Back.
 */
export function RequestsPanel({
  requests,
  isOpen,
  onClose,
  onAccept,
}: {
  requests: PendingRequestItem[];
  isOpen: boolean;
  onClose: () => void;
  onAccept: (code: string) => Promise<void>;
}) {
  const [busyCode, setBusyCode] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  if (!isOpen) return null;

  async function accept(code: string) {
    setBusyCode(code);
    setErrorCode(null);
    try {
      await onAccept(code);
    } catch {
      setErrorCode(code);
    } finally {
      setBusyCode(null);
    }
  }

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

        <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5">
          {requests.length === 0 ? (
            <p className="py-10 text-center text-small text-ink-muted">
              No requests.
            </p>
          ) : (
            requests.map((req) => (
              <article
                key={req.id}
                className="rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgb(20_18_15/0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-ink" title={req.buyerName}>
                      {req.buyerName}
                    </p>
                    <p className="mt-0.5 text-caption text-ink-muted">
                      Needed by {formatNeededBy(req.neededBy)}
                      {req.timeSlot ? ` · ${req.timeSlot}` : " · Any time"}
                    </p>
                    {req.buyerPhone ? (
                      <p className="text-caption text-ink-subtle">{req.buyerPhone}</p>
                    ) : null}
                  </div>
                  <p className="figure shrink-0 text-base font-bold text-ink">
                    {req.grandTotal}
                  </p>
                </div>

                <div className="mt-3 rounded-xl bg-muted/70 px-3 py-2">
                  <p className="eyebrow text-ink-subtle">Items</p>
                  <ul className="mt-1 divide-y divide-line">
                    {req.lines.map((line, index) => (
                      <li
                        key={`${line.itemName}-${index}`}
                        className="flex items-center justify-between gap-3 py-1.5 text-small"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-ink">
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
                      </li>
                    ))}
                  </ul>
                </div>

                {req.note ? (
                  <div className="mt-2 rounded-xl border border-warning/30 bg-warning-soft px-3 py-2">
                    <p className="eyebrow inline-flex items-center gap-1 text-warning">
                      <MessageSquare className="h-3 w-3" aria-hidden="true" />
                      Buyer's note
                    </p>
                    <p className="mt-1 text-small font-medium text-ink">{req.note}</p>
                  </div>
                ) : null}

                {errorCode === req.code ? (
                  <p className="mt-2 text-caption font-semibold text-danger" role="alert">
                    Could not accept. Try again.
                  </p>
                ) : null}

                <button
                  type="button"
                  disabled={busyCode !== null}
                  onClick={() => void accept(req.code)}
                  className={primaryButton("mt-3 w-full min-h-11")}
                >
                  {busyCode === req.code ? "Accepting…" : "Accept request"}
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
