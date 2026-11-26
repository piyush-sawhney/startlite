"use client";

import Link from "next/link";
import { primaryButton, quietButton } from "@/components/ui";

export function SaveShopModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-shop-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="w-full max-w-[420px] rounded-t-2xl border border-line bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:pb-5">
        <h2 id="save-shop-title" className="text-lg font-bold text-ink">
          Save your shop
        </h2>
        <p className="mt-1 text-small leading-6 text-ink-muted">
          This shop is only on this phone. Sign in to keep it.
        </p>

        <div className="mt-5 space-y-2">
          <Link
            href="/login"
            className={primaryButton("flex w-full min-h-11 items-center justify-center")}
          >
            Sign in
          </Link>
          <Link
            href="/login?mode=signup"
            className={quietButton("flex w-full min-h-11 items-center justify-center")}
          >
            Create account
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-11 rounded-xl text-small font-medium text-ink-muted hover:text-ink"
          >
            Keep using this phone
          </button>
        </div>
      </div>
    </div>
  );
}
