"use client";

import { useState } from "react";
import { primaryButton, quietButton } from "@/components/ui";
import { shopUrl, displayShopLink } from "@/lib/shop";
import { SheetClose } from "./SheetClose";

export function ShareStorefrontModal({
  handle,
  isOpen,
  onClose,
}: {
  handle: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const absolute = shopUrl(handle);
  const display = displayShopLink(handle);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `Namaste! Visit our digital store to browse items and place orders directly on WhatsApp:\n${absolute}`,
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-share-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <section className="w-full max-w-[420px] rounded-t-2xl border border-line bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:pb-5">
        <div className="flex items-center justify-between gap-2">
          <h2 id="home-share-title" className="text-title font-bold text-ink">
            Share storefront
          </h2>
          <SheetClose onClose={onClose} label="Close Share storefront" />
        </div>

        <div className="mt-4 rounded-md bg-muted px-3 py-2.5">
          <p className="text-micro font-medium text-ink-muted">Store link</p>
          <p className="mt-1 truncate text-small font-semibold text-accent-strong">
            {display}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={copyLink}
            className={quietButton("w-full min-h-11")}
          >
            {copied ? "Copied" : "Copy link"}
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className={primaryButton("w-full min-h-11")}
          >
            Share on WhatsApp
          </a>

          <button
            type="button"
            onClick={onClose}
            className={quietButton("w-full min-h-11")}
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}
