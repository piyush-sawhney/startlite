"use client";

import { useState } from "react";
import { formatNeededBy } from "@/lib/bill";
import { primaryButton, quietButton } from "@/components/ui";
import type { PendingRequestItem } from "@/lib/home-types";

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
  const [selected, setSelected] = useState<PendingRequestItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function acceptRequest() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      await onAccept(selected.code);
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not accept request.");
    } finally {
      setBusy(false);
    }
  }

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
            <h2 className="text-lg font-semibold text-ink">
              {selected ? "Review request" : "Storefront requests"}
            </h2>
            <p className="text-xs text-ink-muted">
              {selected ? selected.code : `${requests.length} waiting for review`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setError(null);
              onClose();
            }}
            className="rounded-lg p-1 text-ink-muted hover:bg-muted hover:text-ink"
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {selected ? (
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-ink">{selected.buyerName}</p>
              <p className="mt-1 text-sm text-ink-muted">{selected.buyerPhone}</p>
              <p className="mt-1 text-sm text-ink-muted">
                {selected.itemCount} {selected.itemCount === 1 ? "item" : "items"}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Needed {formatNeededBy(selected.neededBy)}
                {selected.timeSlot ? ` · ${selected.timeSlot}` : " · Any time"}
              </p>
            </div>
            <div className="divide-y divide-line rounded-xl border border-line">
              {selected.lines.map((line, index) => (
                <div
                  key={`${line.itemName}-${index}`}
                  className="flex items-start justify-between gap-3 p-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{line.itemName}</p>
                    <p className="text-xs text-ink-muted">
                      {line.quantity} {line.unitLabel}
                      {line.optionName ? ` · ${line.optionName}` : ""}
                      {line.extraNames.length ? ` · ${line.extraNames.join(", ")}` : ""}
                    </p>
                  </div>
                  <p className="tnum shrink-0 font-medium">{line.lineTotal}</p>
                </div>
              ))}
            </div>
            {selected.note ? (
              <p className="rounded-xl bg-muted p-3 text-sm text-ink-muted">
                Note: {selected.note}
              </p>
            ) : null}
            <p className="tnum border-t border-line pt-3 text-lg font-semibold">
              {selected.grandTotal}
            </p>
            {error ? (
              <p className="text-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setSelected(null);
                  setError(null);
                }}
                className={quietButton("min-h-11 flex-1")}
              >
                Back
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void acceptRequest()}
                className={primaryButton("min-h-11 flex-1")}
              >
                {busy ? "Accepting..." : "Accept"}
              </button>
            </div>
          </div>
        ) : (
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
                      <p
                        className="truncate font-semibold text-ink"
                        title={req.buyerName}
                      >
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
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(req);
                        setError(null);
                      }}
                      className={quietButton("min-h-9 flex-1 py-1.5 text-xs")}
                    >
                      Review order ›
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
