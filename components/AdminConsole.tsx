"use client";

import Link from "next/link";
import { useState } from "react";
import type { AdminBusinessSummary } from "@/lib/admin";
import { formatBillDate } from "@/lib/bill";
import { inputClass, primaryButton, quietButton } from "@/components/ui";

export function AdminConsole({
  initialBusinesses,
}: {
  initialBusinesses: AdminBusinessSummary[];
}) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = businesses.filter((b) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      b.handle.toLowerCase().includes(q) ||
      b.businessName.toLowerCase().includes(q) ||
      b.ownerEmail.toLowerCase().includes(q) ||
      b.whatsappNumber.includes(q)
    );
  });

  async function activate(id: string) {
    setBusyId(id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/v1/admin/businesses/${id}/activate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ note: "Admin console activation" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback(data.error?.message || "Failed to activate pass");
        return;
      }

      setBusinesses((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;
          return {
            ...b,
            status: "live",
            passExpiresAt: new Date(data.data.passExpiresAt),
            disabledAt: null,
          };
        }),
      );
      setFeedback(`Pass activated for ${data.data.invoiceNo}`);
    } catch {
      setFeedback("Network error activating pass");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleSuspend(id: string) {
    setBusyId(id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/v1/admin/businesses/${id}/disable`, {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback(data.error?.message || "Failed to toggle suspension");
        return;
      }

      setBusinesses((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;
          return {
            ...b,
            status: data.data.status,
            disabledAt: data.data.disabled ? new Date() : null,
          };
        }),
      );
      setFeedback(
        data.data.disabled ? "Business suspended" : "Business restored",
      );
    } catch {
      setFeedback("Network error updating status");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="search"
          placeholder="Search by name, handle, email, or phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${inputClass} w-full`}
        />
      </div>

      {feedback ? (
        <div className="rounded-xl border border-line bg-muted px-4 py-2 text-sm text-ink font-medium">
          {feedback}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-muted">
          No matching businesses found.
        </p>
      ) : (
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {filtered.map((b) => {
            const isBusy = busyId === b.id;
            return (
              <div
                key={b.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/businesses/${b.id}`}
                      className="truncate font-semibold hover:text-accent"
                    >
                      {b.businessName}
                    </Link>
                    <span
                      className={
                        b.status === "live"
                          ? "rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success"
                          : b.status === "paused"
                            ? "rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning"
                            : "rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-semibold text-danger"
                      }
                    >
                      {b.status}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-ink-muted">
                    /b/{b.handle} · {b.ownerEmail} · {b.whatsappNumber}
                  </p>

                  <p className="mt-1 text-[11px] text-ink-subtle">
                    {b.passExpiresAt
                      ? `Pass until ${formatBillDate(new Date(b.passExpiresAt))}`
                      : `Trial until ${formatBillDate(new Date(b.trialEndsAt))}`}
                    {" · "}
                    {b.itemCount} items · {b.orderCount} orders
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <a
                    href={`/b/${b.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-9 items-center justify-center rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-ink hover:bg-muted"
                  >
                    Storefront ↗
                  </a>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => activate(b.id)}
                    className="inline-flex min-h-9 items-center justify-center rounded-lg bg-accent px-3 text-xs font-semibold text-white hover:bg-accent-strong disabled:opacity-50"
                  >
                    {isBusy ? "…" : "+90 Days"}
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => toggleSuspend(b.id)}
                    className="inline-flex min-h-9 items-center justify-center rounded-lg border border-line bg-surface px-3 text-xs font-medium text-ink hover:bg-muted disabled:opacity-50"
                  >
                    {b.status === "disabled" ? "Restore" : "Suspend"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
