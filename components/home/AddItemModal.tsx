"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { Label, inputClass, primaryButton, quietButton } from "@/components/ui";

export type SubVariantInput = { name: string; price: string };
export type VariantInput = {
  name: string;
  price: string;
  subVariants: SubVariantInput[];
};
export type ItemInput = {
  name: string;
  basePrice: string;
  unitLabel: string;
  category?: string;
  description?: string;
  photo?: string | null;
  variants?: VariantInput[];
  availability?: { from: string; to: string } | null;
};

type DraftSubVariant = { key: string; name: string; price: string };
type DraftVariant = {
  key: string;
  name: string;
  price: string;
  subVariants: DraftSubVariant[];
};

function newKey() {
  return Math.random().toString(36).slice(2);
}

async function shrinkPhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 320 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not read that photo.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.7);
}

export function AddItemModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ItemInput) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [unitLabel, setUnitLabel] = useState("item");
  const [basePrice, setBasePrice] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [variants, setVariants] = useState<DraftVariant[]>([]);
  const [slotOn, setSlotOn] = useState(false);
  const [from, setFrom] = useState("10:00");
  const [to, setTo] = useState("18:00");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  function reset() {
    setName("");
    setCategory("");
    setDescription("");
    setUnitLabel("item");
    setBasePrice("");
    setPhoto(null);
    setVariants([]);
    setSlotOn(false);
    setFrom("10:00");
    setTo("18:00");
  }

  function addVariant() {
    setVariants((current) => [
      ...current,
      { key: newKey(), name: "", price: "", subVariants: [] },
    ]);
  }

  function patchVariant(key: string, patch: Partial<DraftVariant>) {
    setVariants((current) =>
      current.map((entry) => (entry.key === key ? { ...entry, ...patch } : entry)),
    );
  }

  function addSubVariant(key: string) {
    setVariants((current) =>
      current.map((entry) =>
        entry.key === key
          ? {
              ...entry,
              subVariants: [
                ...entry.subVariants,
                { key: newKey(), name: "", price: "" },
              ],
            }
          : entry,
      ),
    );
  }

  async function handlePhoto(file: File | undefined) {
    if (!file) return;
    try {
      setPhoto(await shrinkPhoto(file));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that photo.");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const cleanVariants = variants
      .map((entry) => ({
        name: entry.name.trim(),
        price: entry.price.trim(),
        subVariants: entry.subVariants
          .map((sub) => ({ name: sub.name.trim(), price: sub.price.trim() }))
          .filter((sub) => sub.name),
      }))
      .filter((entry) => entry.name);

    const anyVariantPrice = cleanVariants.some(
      (entry) => Number(entry.price) > 0,
    );
    if (!name.trim()) {
      setError("Enter item name.");
      return;
    }
    if (!(Number(basePrice) > 0) && !anyVariantPrice) {
      setError("Enter a price, or price at least one variant.");
      return;
    }
    if (slotOn && from >= to) {
      setError("The slot end time must be after the start time.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        basePrice: basePrice.trim() || "0",
        unitLabel: unitLabel.trim() || "item",
        category: category.trim() || undefined,
        description: description.trim() || undefined,
        photo,
        variants: cleanVariants,
        availability: slotOn ? { from, to } : null,
      });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-item-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[92dvh] w-full max-w-[460px] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 shadow-2xl sm:rounded-2xl">
        <div className="border-b border-line pb-3">
          <h2 id="add-item-title" className="text-lg font-semibold text-ink">
            Add item
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            A product, a dish, or a service. Variants are optional.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Basics */}
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
                placeholder="e.g. Samosa, Haircut, Repair"
                maxLength={80}
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <input
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={inputClass}
                  placeholder="e.g. Snacks"
                  maxLength={60}
                />
              </div>
              <div>
                <Label>Unit</Label>
                <input
                  type="text"
                  value={unitLabel}
                  onChange={(event) => setUnitLabel(event.target.value)}
                  className={inputClass}
                  placeholder="piece, kg, hour"
                  maxLength={20}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className={`${inputClass} min-h-16 resize-y`}
                placeholder="What the buyer gets"
                maxLength={200}
              />
            </div>

            <div>
              <Label>Photo</Label>
              <div className="flex items-center gap-3">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt="Item photo preview"
                    className="h-16 w-16 rounded-xl border border-line object-cover"
                  />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-xl border border-dashed border-line text-ink-subtle">
                    <ImagePlus className="h-5 w-5" aria-hidden="true" />
                  </div>
                )}
                <label className="cursor-pointer text-sm font-semibold text-accent">
                  {photo ? "Change photo" : "Add photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handlePhoto(event.target.files?.[0])}
                  />
                </label>
                {photo ? (
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    className="text-xs text-ink-subtle"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-3 border-t border-line pt-4">
            <div>
              <Label>Price (₹)</Label>
              <input
                type="text"
                inputMode="decimal"
                value={basePrice}
                onChange={(event) => setBasePrice(event.target.value)}
                className={inputClass}
                placeholder="0.00"
              />
              <p className="mt-1 text-xs text-ink-subtle">
                Leave at 0 if every variant has its own price.
              </p>
            </div>

            {variants.map((variant, index) => (
              <div
                key={variant.key}
                className="rounded-xl border border-line bg-canvas/40 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Variant {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setVariants((current) =>
                        current.filter((entry) => entry.key !== variant.key),
                      )
                    }
                    className="text-ink-subtle hover:text-danger"
                    aria-label={`Remove variant ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(event) =>
                      patchVariant(variant.key, { name: event.target.value })
                    }
                    className={inputClass}
                    placeholder="Name, e.g. Large"
                    maxLength={60}
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    value={variant.price}
                    onChange={(event) =>
                      patchVariant(variant.key, { price: event.target.value })
                    }
                    className={inputClass}
                    placeholder="Price"
                  />
                </div>

                {variant.subVariants.map((sub, subIndex) => (
                  <div key={sub.key} className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(event) =>
                        patchVariant(variant.key, {
                          subVariants: variant.subVariants.map((entry) =>
                            entry.key === sub.key
                              ? { ...entry, name: event.target.value }
                              : entry,
                          ),
                        })
                      }
                      className={inputClass}
                      placeholder={`Sub-variant ${subIndex + 1}`}
                      maxLength={60}
                    />
                    <input
                      type="text"
                      inputMode="decimal"
                      value={sub.price}
                      onChange={(event) =>
                        patchVariant(variant.key, {
                          subVariants: variant.subVariants.map((entry) =>
                            entry.key === sub.key
                              ? { ...entry, price: event.target.value }
                              : entry,
                          ),
                        })
                      }
                      className={inputClass}
                      placeholder="Price"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addSubVariant(variant.key)}
                  className="mt-2 text-xs font-semibold text-accent"
                >
                  + Sub-variant
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="flex min-h-10 items-center gap-1 text-sm font-semibold text-accent"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add variant
            </button>
          </div>

          {/* Availability */}
          <div className="space-y-3 border-t border-line pt-4">
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-ink">
                Only available in a time slot
              </span>
              <input
                type="checkbox"
                checked={slotOn}
                onChange={(event) => setSlotOn(event.target.checked)}
                className="h-5 w-5"
              />
            </label>
            {slotOn ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>From</Label>
                  <input
                    type="time"
                    value={from}
                    onChange={(event) => setFrom(event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label>To</Label>
                  <input
                    type="time"
                    value={to}
                    onChange={(event) => setTo(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="text-xs text-danger" aria-live="polite">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2 pb-2 sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className={quietButton("flex-1 min-h-11")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className={primaryButton("flex-1 min-h-11")}
            >
              {busy ? "Saving..." : "Add item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
