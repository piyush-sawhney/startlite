"use client";

import { useState } from "react";
import {
  EmptyState,
  PageHeader,
  inputClass,
  Label,
  primaryButton,
  quietButton,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatPaise, toPaise } from "@/lib/paise";
import {
  addGuestItem,
  deleteGuestItem,
  updateGuestItem,
} from "@/lib/guest-store";
import { BackButton } from "./GuestBits";
import { AddItemModal } from "@/components/home/AddItemModal";
import type { GuestViewProps } from "./types";

export function GuestCatalog({ state, update, go, toast }: GuestViewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Items"
        subtitle={`${state.items.length} items`}
        action={
          <button
            type="button"
            className={primaryButton("px-3")}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? "Close" : "Add item"}
          </button>
        }
      />

      <AddItemModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={async (item) => {
          update((current) =>
            addGuestItem(current, {
              name: item.name,
              price: item.basePrice,
              unitLabel: item.unitLabel,
              category: item.category,
              description: item.description,
              photo: item.photo,
              variants: item.variants,
              availability: item.availability,
            }),
          );
          setOpen(false);
          toast("Item added");
        }}
      />

      <div className={open ? "mt-4" : ""}>
        {state.items.length === 0 ? (
          <EmptyState
            title="No items yet"
            body="Add your first item. Name, price, and availability are enough."
            action={
              <button
                type="button"
                className={primaryButton()}
                onClick={() => setOpen(true)}
              >
                Add item
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-muted text-[11px] font-medium text-ink-subtle">
                  {item.name.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => go({ kind: "item", id: item.id })}
                        className="block truncate text-left font-medium"
                      >
                        {item.name}
                      </button>
                      <p className="text-xs text-ink-muted">
                        {formatPaise(toPaise(item.price))} / {item.unitLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        update((current) =>
                          updateGuestItem(current, item.id, {
                            isAvailable: !item.isAvailable,
                          }),
                        )
                      }
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        item.isAvailable
                          ? "bg-success/10 text-success"
                          : "bg-muted text-ink-subtle",
                      )}
                    >
                      {item.isAvailable ? "In stock" : "Sold out"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => go({ kind: "item", id: item.id })}
                    className="mt-2 text-xs font-medium text-accent"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-ink-subtle">
        Sold-out items stay visible. Buyers cannot add them.
      </p>
    </>
  );
}

export function GuestItemDetail({
  state,
  update,
  back,
  go,
  toast,
  itemId,
}: GuestViewProps & { itemId: string }) {
  const item = state.items.find((entry) => entry.id === itemId);
  const [name, setName] = useState(item?.name ?? "");
  const [price, setPrice] = useState(item?.price ?? "");
  const [unitLabel, setUnitLabel] = useState(item?.unitLabel ?? "");
  const [available, setAvailable] = useState(item?.isAvailable ?? true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!item) {
    return (
      <>
        <BackButton onClick={back} label="Catalog" />
        <EmptyState title="Item not found" body="It may have been deleted." />
      </>
    );
  }

  return (
    <>
      <BackButton onClick={back} label="Catalog" />
      <PageHeader title="Edit item" subtitle={item.name} />

      <form
        className="rounded-2xl border border-line bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          if (!name.trim()) {
            setError("Enter an item name.");
            return;
          }
          if (toPaise(price) <= 0) {
            setError("Enter a price above zero.");
            return;
          }
          update((current) =>
            updateGuestItem(current, item.id, {
              name,
              price,
              unitLabel,
              isAvailable: available,
            }),
          );
          toast("Item saved");
          go({ kind: "catalog" });
        }}
      >
        <div>
          <Label>Name</Label>
          <input
            className={inputClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <Label>Price</Label>
            <input
              className={inputClass}
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>
          <div>
            <Label>Unit</Label>
            <input
              className={inputClass}
              value={unitLabel}
              onChange={(event) => setUnitLabel(event.target.value)}
            />
          </div>
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={available}
            onChange={(event) => setAvailable(event.target.checked)}
            className="h-4 w-4"
          />
          In stock
        </label>

        {error ? (
          <p className="mt-3 text-sm text-danger" aria-live="polite">
            {error}
          </p>
        ) : null}

        <button className={primaryButton("mt-4 w-full")}>Save item</button>
      </form>

      <div className="mt-5">
        {confirming ? (
          <div className="rounded-md border border-line bg-surface p-3">
            <p className="text-sm text-ink-muted">
              Delete this item? Past bills keep their records.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className={quietButton("text-danger")}
                onClick={() => {
                  update((current) => deleteGuestItem(current, item.id));
                  toast("Item deleted");
                  go({ kind: "catalog" });
                }}
              >
                Delete item
              </button>
              <button
                type="button"
                className={quietButton()}
                onClick={() => setConfirming(false)}
              >
                Keep
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="text-sm text-ink-subtle"
            onClick={() => setConfirming(true)}
          >
            Delete this item
          </button>
        )}
      </div>
    </>
  );
}
