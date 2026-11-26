"use client";

import { useEffect, useState } from "react";
import { Label, inputClass, primaryButton, quietButton } from "@/components/ui";
import { SheetClose } from "./SheetClose";

export function EditShopNameModal({
  isOpen,
  initialName,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  initialName: string;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError(null);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = name.trim();
    if (next.length < 2) {
      setError("Enter a shop name with at least 2 letters.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSubmit(next);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the name.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-shop-name-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="w-full max-w-[420px] rounded-t-2xl border border-line bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:pb-5">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <h2 id="edit-shop-name-title" className="text-title font-bold text-ink">
            Shop name
          </h2>
          <SheetClose onClose={onClose} label="Close Shop name" />
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label>Name</Label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="e.g. Anita's Bakes"
              maxLength={80}
              autoFocus
              required
            />
          </div>

          {error ? (
            <p className="text-caption text-danger" aria-live="polite">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
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
              {busy ? "Saving..." : "Save name"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
