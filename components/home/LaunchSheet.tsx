"use client";

import Link from "next/link";
import { primaryButton, quietButton } from "@/components/ui";

export function LaunchSheet({
  onStartFresh,
}: {
  onStartFresh: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-sheet-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-[420px] rounded-2xl border border-line bg-surface p-6 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-lg font-black text-white shadow-[0_1px_2px_rgb(20_18_15/0.1)]">
            SL
          </div>
          <p className="eyebrow text-ink-subtle">
            StartLite
          </p>
          <h2
            id="launch-sheet-title"
            className="mt-1 text-2xl font-bold tracking-tight text-ink"
          >
            Your shop
          </h2>
          <p className="mt-3 text-small leading-relaxed text-ink-muted">
            Sign in, or start fresh on this phone.
          </p>
        </div>

        <div className="mt-6 space-y-2.5">
          <Link
            href="/login"
            className={primaryButton("w-full min-h-12 text-small")}
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={onStartFresh}
            className={quietButton("w-full min-h-12 text-small")}
          >
            Start fresh
          </button>
        </div>

        <p className="mt-5 text-center text-caption text-ink-subtle">
          Sign in any time from Settings.
        </p>
      </div>
    </div>
  );
}
