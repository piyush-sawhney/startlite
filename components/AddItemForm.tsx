"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { inputClass, Label, primaryButton, quietButton } from "@/components/ui";
import { uploadImageFile } from "@/lib/image-client";

export function AddItemForm({ packUnit }: { packUnit: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unitLabel, setUnitLabel] = useState(packUnit);
  const [priceMode, setPriceMode] = useState<"fixed" | "starting_from" | "quote">(
    "fixed",
  );
  const [available, setAvailable] = useState(true);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
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

    const response = await fetch("/api/v1/merchant/catalog", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        basePrice: priceMode === "quote" ? "0" : price,
        priceMode,
        unitLabel,
        isAvailable: available,
        imageKey,
      }),
    });

    setBusy(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.message ?? "Item not saved. Try again.");
      return;
    }

    setName("");
    setPrice("");
    setImageKey(null);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button className={primaryButton("w-full")} onClick={() => setOpen(true)}>
        Add item
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-line bg-surface p-4"
    >
      <h2 className="text-[15px] font-semibold">New item</h2>

      <div className="mt-3">
        <Label>Name</Label>
        <input
          className={inputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Chocolate cake"
          required
          autoFocus
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
            placeholder="0.00"
            disabled={priceMode === "quote"}
            required={priceMode !== "quote"}
          />
        </div>
        <div>
          <Label>Unit</Label>
          <input
            className={inputClass}
            value={unitLabel}
            onChange={(event) => setUnitLabel(event.target.value)}
            placeholder="piece"
          />
        </div>
      </div>

      <div className="mt-3">
        <Label>Price mode</Label>
        <select
          className={inputClass}
          value={priceMode}
          onChange={(event) =>
            setPriceMode(event.target.value as typeof priceMode)
          }
        >
          <option value="fixed">Fixed price</option>
          <option value="starting_from">Starting from</option>
          <option value="quote">Ask for a quote</option>
        </select>
      </div>

      <div className="mt-3">
        <Label>Photo (optional)</Label>
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

      <div className="mt-4 flex gap-2">
        <button
          className={primaryButton("flex-1")}
          disabled={busy || uploading}
        >
          {busy ? "Saving…" : "Save item"}
        </button>
        <button
          type="button"
          className={quietButton()}
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
