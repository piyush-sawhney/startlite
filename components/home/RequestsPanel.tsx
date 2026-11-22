"use client";

import Link from "next/link";
import { quietButton } from "@/components/ui";
import type { PendingRequestItem } from "@/lib/home-types";

export function RequestsPanel({
  requests,
  isOpen,
  onClose,
}: {
  requests: PendingRequestItem[];
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pending requests"
      className="fixed inset-0 z-50 flex items-center justify-end bg-ink/30 backdrop-blur-sm"
    >
      <div className="h-full w-full max-w-[420px] bg-surface p-6 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Storefront requests</h2>
            <p className="text-xs text-ink-muted">
              {requests.length} waiting for review
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-ink-muted hover:bg-muted hover:text-ink"
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {requests.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-muted">
              No pending requests.
            </p>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-line bg-surface p-4 transition hover:border-accent/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink" title={req.buyerName}>
                      {req.buyerName}
                    </p>
                    <p
                      className="truncate text-xs text-ink-muted"
                      title={`${req.itemCount} items${req.timeSlot ? ` · ${req.timeSlot}` : ""} · ${req.neededBy}`}
                    >
                      {req.itemCount} {req.itemCount === 1 ? "item" : "items"}
                      {req.timeSlot ? ` · ${req.timeSlot}` : ""} · {req.neededBy}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tnum font-semibold text-ink">{req.grandTotal}</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/o/${req.code}`}
                    className={quietButton("flex-1 text-xs py-1.5 min-h-9")}
                  >
                    Review order ›
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
