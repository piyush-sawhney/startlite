"use client";

import { X } from "lucide-react";

/** The one close affordance used by every Home sheet. 44 px, labelled, SVG. */
export function SheetClose({
  onClose,
  label = "Close",
}: {
  onClose: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      title={label}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-ink-muted transition hover:bg-muted hover:text-ink"
    >
      <X className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
