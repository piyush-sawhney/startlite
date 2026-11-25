"use client";

import Link from "next/link";
import { primaryButton, quietButton } from "@/components/ui";
import { StatePill } from "./StatePill";

export function SessionExpired({
  shopName,
  onUsePhoneInstead,
}: {
  shopName: string;
  onUsePhoneInstead: () => void;
}) {
  const initial = shopName.trim().charAt(0).toUpperCase() || "S";

  return (
    <div className="mx-auto min-h-[500px] w-full max-w-[500px] px-4 py-8">
      {/* Header with expired pill */}
      <div className="flex h-14 items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-base font-bold text-accent-strong">
            {initial}
          </div>
          <p className="truncate text-base font-semibold text-ink">
            {shopName}
          </p>
        </div>
        <StatePill state="expired" />
      </div>

      {/* Content */}
      <div className="mt-12 rounded-2xl border border-line bg-surface p-6 text-center shadow-[0_1px_2px_rgb(20_18_15/0.05)]">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Your session ended.
        </h2>
        <p className="mt-2 text-[15px] text-ink-muted">
          Sign in to open your shop.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/login"
            className={primaryButton("w-full min-h-12 text-base")}
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={onUsePhoneInstead}
            className={quietButton("w-full min-h-12 text-base")}
          >
            Use this phone instead
          </button>
        </div>
      </div>
    </div>
  );
}
