"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { inputClass, Label, primaryButton, quietButton } from "@/components/ui";
import { uploadImageFile } from "@/lib/image-client";
import type { PublicItem } from "@/lib/queries";

type OptionRow = { id?: string; name: string; price: string; isAvailable: boolean };
type ExtraRow = {
  id?: string;
  name: string;
  priceDelta: string;
  isMultiSelect: boolean;
  isAvailable: boolean;
};

export function EditItemForm({ item }: { item: PublicItem }) {
  const router = useRouter();
  const [name, setName] = useState(item.name);
  const [subtitle, setSubtitle] = useState(item.subtitle ?? "");
  const [basePrice, setBasePrice] = useState(item.basePrice);
  const [priceMode, setPriceMode] = useState(item.priceMode);
  const [unitLabel, setUnitLabel] = useState(item.unitLabel);
  const [available, setAvailable] = useState(item.isAvailable);
  const [prompt, setPrompt] = useState(item.customerPrompt ?? "");
  const [options, setOptions] = useState<OptionRow[]>(
    item.options.map((option) => ({
      id: option.id,
      name: option.name,
      price: option.price,
      isAvailable: option.isAvailable,
    })),
  );
  const [extras, setExtras] = useState<ExtraRow[]>(
    item.extras.map((extra) => ({
      id: extra.id,
      name: extra.name,
      priceDelta: extra.priceDelta,
      isMultiSelect: extra.isMultiSelect,
      isAvailable: extra.isAvailable,
    })),
  );
  const [imageKey, setImageKey] = useState(item.imageKey);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    const result = await uploadImageFile(file);
    setUploading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setImageKey(result.key);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch(`/api/v1/merchant/catalog/${item.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        subtitle: subtitle || null,
        basePrice: priceMode === "quote" ? "0" : basePrice,
        priceMode,
        unitLabel,
        isAvailable: available,
        customerPrompt: prompt || null,
        imageKey,
        options: options
          .filter((option) => option.name.trim())
          .map((option) => ({
            id: option.id,
            name: option.name,
            price: option.price || "0",
            isAvailable: option.isAvailable,
          })),
        extras: extras
          .filter((extra) => extra.name.trim())
          .map((extra) => ({
            id: extra.id,
            name: extra.name,
            priceDelta: extra.priceDelta || "0",
            isMultiSelect: extra.isMultiSelect,
            isAvailable: extra.isAvailable,
          })),
      }),
    });

    setBusy(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.message ?? "Item not saved. Try again.");
      return;
    }
    router.push("/app/catalog");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <input
          className={inputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div>
        <Label>Subtitle (optional)</Label>
        <input
          className={inputClass}
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
          placeholder="One line buyers see"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Price</Label>
          <input
            className={inputClass}
            inputMode="decimal"
            value={basePrice}
            onChange={(event) => setBasePrice(event.target.value)}
            disabled={priceMode === "quote"}
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

      <div>
        <Label>Price mode</Label>
        <select
          className={inputClass}
          value={priceMode}
          onChange={(event) => setPriceMode(event.target.value)}
        >
          <option value="fixed">Fixed price</option>
          <option value="starting_from">Starting from</option>
          <option value="quote">Ask for a quote</option>
        </select>
      </div>

      <div>
        <Label>Question for the buyer (optional)</Label>
        <input
          className={inputClass}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Message on the cake?"
        />
      </div>

      <div>
        <Label>Photo</Label>
        <div className="flex items-center gap-3">
          {imageKey ? (
            <img
              src={`/media/${imageKey}`}
              alt=""
              className="h-14 w-14 rounded-md object-cover"
            />
          ) : (
            <div className="h-14 w-14 rounded-md bg-muted" />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
          <button
            type="button"
            className={quietButton("text-sm")}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : imageKey ? "Change photo" : "Add photo"}
          </button>
          {imageKey ? (
            <button
              type="button"
              className="text-xs text-danger"
              onClick={() => setImageKey(null)}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={available}
          onChange={(event) => setAvailable(event.target.checked)}
          className="h-4 w-4"
        />
        In stock
      </label>

      <section className="rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">Options</h2>
          <button
            type="button"
            className="text-xs font-medium text-accent"
            onClick={() =>
              setOptions((current) => [
                ...current,
                { name: "", price: "", isAvailable: true },
              ])
            }
          >
            Add option
          </button>
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          An option sets the price. For example 500 g and 1 kg.
        </p>
        <div className="mt-3 space-y-2">
          {options.map((option, index) => (
            <div key={option.id ?? index} className="flex gap-2">
              <input
                className={inputClass}
                value={option.name}
                onChange={(event) =>
                  setOptions((current) =>
                    current.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, name: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="500 g"
              />
              <input
                className={`${inputClass} w-24`}
                inputMode="decimal"
                value={option.price}
                onChange={(event) =>
                  setOptions((current) =>
                    current.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, price: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="0.00"
              />
              <button
                type="button"
                className="px-1 text-xs text-danger"
                onClick={() =>
                  setOptions((current) =>
                    current.filter((_, rowIndex) => rowIndex !== index),
                  )
                }
              >
                ×
              </button>
            </div>
          ))}
          {options.length === 0 ? (
            <p className="text-xs text-ink-subtle">No options. One price.</p>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">Extras</h2>
          <button
            type="button"
            className="text-xs font-medium text-accent"
            onClick={() =>
              setExtras((current) => [
                ...current,
                {
                  name: "",
                  priceDelta: "",
                  isMultiSelect: true,
                  isAvailable: true,
                },
              ])
            }
          >
            Add extra
          </button>
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          An extra adds a delta. For example Eggless +50.
        </p>
        <div className="mt-3 space-y-2">
          {extras.map((extra, index) => (
            <div key={extra.id ?? index} className="flex gap-2">
              <input
                className={inputClass}
                value={extra.name}
                onChange={(event) =>
                  setExtras((current) =>
                    current.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, name: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="Eggless"
              />
              <input
                className={`${inputClass} w-24`}
                inputMode="decimal"
                value={extra.priceDelta}
                onChange={(event) =>
                  setExtras((current) =>
                    current.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, priceDelta: event.target.value }
                        : row,
                    ),
                  )
                }
                placeholder="+0.00"
              />
              <button
                type="button"
                className="px-1 text-xs text-danger"
                onClick={() =>
                  setExtras((current) =>
                    current.filter((_, rowIndex) => rowIndex !== index),
                  )
                }
              >
                ×
              </button>
            </div>
          ))}
          {extras.length === 0 ? (
            <p className="text-xs text-ink-subtle">No extras.</p>
          ) : null}
        </div>
      </section>

      {error ? (
        <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" aria-live="polite">
          {error}
        </p>
      ) : null}

      <button className={primaryButton("w-full min-h-12")} disabled={busy}>
        {busy ? "Saving…" : "Save item"}
      </button>
    </form>
  );
}
