"use client";

import { useEffect, useState } from "react";
import { Label, primaryButton, quietButton } from "@/components/ui";
import { uploadImageFile } from "@/lib/image-client";
import { SheetClose } from "./SheetClose";

export function ShopLogoModal({
  isOpen,
  initialUrl,
  onClose,
  onUpdated,
}: {
  isOpen: boolean;
  initialUrl: string | null;
  onClose: () => void;
  onUpdated: (url: string | null) => void;
}) {
  const [logoUrl, setLogoUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLogoUrl(initialUrl);
      setError(null);
    }
  }, [initialUrl, isOpen]);

  if (!isOpen) return null;

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);
    const result = await uploadImageFile(file, "logo");
    setBusy(false);
    event.target.value = "";

    if ("error" in result) {
      setError(result.error);
      return;
    }
    setLogoUrl(result.url);
    onUpdated(result.url);
  }

  async function handleRemove() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/merchant/media", {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "Could not remove the logo.");
      }
      setLogoUrl(null);
      onUpdated(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove the logo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-logo-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <section className="w-full max-w-[420px] rounded-t-2xl border border-line bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:pb-5">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <h2 id="shop-logo-title" className="text-title font-bold text-ink">
            Shop logo
          </h2>
          <SheetClose onClose={onClose} label="Close Shop logo" />
        </div>

        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Current shop logo"
            className="mx-auto my-5 h-24 w-24 rounded-full border border-line object-cover"
          />
        ) : (
          <p className="my-5 rounded-xl bg-muted p-4 text-center text-sm text-ink-muted">
            No logo uploaded. The shop name initial will be shown instead.
          </p>
        )}

        <div className="space-y-3">
          <div>
            <Label>{logoUrl ? "Change logo" : "Upload logo"}</Label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => void handleUpload(event)}
              disabled={busy}
              className="block min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-accent-soft file:px-3 file:py-1.5 file:font-semibold file:text-accent-strong"
            />
            <p className="mt-1 text-xs text-ink-subtle">
              JPEG, PNG, or WebP up to 5 MB.
            </p>
          </div>

          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
            {logoUrl ? (
              <button
                type="button"
                onClick={() => void handleRemove()}
                disabled={busy}
                className={quietButton("min-h-11 flex-1 text-danger")}
              >
                Remove
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className={primaryButton("min-h-11 flex-1")}
            >
              Done
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
