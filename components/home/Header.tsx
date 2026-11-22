"use client";

import { Pencil, Power } from "lucide-react";
import { StatePill, type PillState } from "./StatePill";

export function HomeHeader({
  shopName,
  handle,
  pillState,
  onGuestSave,
  onEditName,
  onSignIn,
}: {
  shopName: string;
  handle?: string;
  pillState: PillState;
  onGuestSave?: () => void;
  onEditName?: () => void;
  onSignIn?: () => void;
}) {
  const initial = shopName.trim().charAt(0).toUpperCase() || "S";
  const showPower = pillState === "guest" || pillState === "expired";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-line bg-canvas/90 px-1 py-2 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2">
        <div
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-base font-bold text-accent-strong shadow-[0_1px_2px_rgb(20_18_15/0.06)]"
          aria-hidden="true"
        >
          {initial}
        </div>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-0.5">
            <h1
              className="truncate text-base font-semibold leading-5 text-ink"
              title={shopName}
            >
              {shopName}
            </h1>
            {onEditName ? (
              <button
                type="button"
                onClick={onEditName}
                aria-label="Edit shop name"
                title="Edit shop name"
                className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted transition after:absolute after:-inset-1 after:content-[''] hover:bg-muted hover:text-ink active:bg-muted"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
          {handle ? (
            <p
              className="hidden truncate text-xs text-ink-muted md:block"
              title={`@${handle}`}
            >
              @{handle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <StatePill state={pillState} onGuestSave={onGuestSave} />
        {showPower && onSignIn ? (
          <button
            type="button"
            onClick={onSignIn}
            aria-label="Sign in to save this shop"
            title="Sign in"
            className="relative grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition after:absolute after:-inset-1 after:content-[''] hover:bg-muted hover:text-ink active:bg-muted"
          >
            <Power className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
