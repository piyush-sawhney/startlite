"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PublicItem } from "@/lib/queries";
import { formatAmount } from "@/lib/money";
import { quietButton } from "@/components/ui";
import { cn } from "@/lib/cn";

export function CatalogItemRow({ item }: { item: PublicItem }) {
  const router = useRouter();
  const [available, setAvailable] = useState(item.isAvailable);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !available;
    setAvailable(next);
    const response = await fetch(
      `/api/v1/merchant/catalog/${item.id}/availability`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          targetId: item.id,
          scope: "item",
          isAvailable: next,
        }),
      },
    );
    if (!response.ok) {
      setAvailable(!next);
      return;
    }
    router.refresh();
  }

  async function remove() {
    setBusy(true);
    const response = await fetch(`/api/v1/merchant/catalog/${item.id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (response.ok) router.refresh();
    setConfirming(false);
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        {item.imageKey ? (
          <img
            src={`/media/${item.imageKey}`}
            alt=""
            className="h-14 w-14 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-muted text-[11px] font-medium text-ink-subtle">
            {item.name.slice(0, 1)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/app/catalog/${item.id}`}
                className="block truncate font-medium"
              >
                {item.name}
              </Link>
              <p className="text-xs text-ink-muted">
                {item.priceMode === "quote"
                  ? "Ask for a quote"
                  : item.priceMode === "starting_from"
                    ? `From ${formatAmount(item.basePrice)}`
                    : `${formatAmount(item.basePrice)} / ${item.unitLabel}`}
                {item.options.length > 0
                  ? ` · ${item.options.length} option${item.options.length === 1 ? "" : "s"}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={toggle}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                available
                  ? "bg-success/10 text-success"
                  : "bg-muted text-ink-subtle",
              )}
            >
              {available ? "In stock" : "Sold out"}
            </button>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <Link
              href={`/app/catalog/${item.id}`}
              className="text-xs font-medium text-accent"
            >
              Edit
            </Link>
            <button
              type="button"
              className="text-xs text-ink-subtle"
              onClick={() => setConfirming(true)}
            >
              Delete
            </button>
          </div>

          {confirming ? (
            <div className="mt-2 rounded-md bg-muted p-2.5">
              <p className="text-xs text-ink-muted">
                Delete this item? Past bills keep their records.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className={quietButton("min-h-9 px-3 text-xs text-danger")}
                  onClick={remove}
                  disabled={busy}
                >
                  {busy ? "Deleting…" : "Delete item"}
                </button>
                <button
                  type="button"
                  className={quietButton("min-h-9 px-3 text-xs")}
                  onClick={() => setConfirming(false)}
                >
                  Keep
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
