"use client";

import { Pencil, Power, Share2 } from "lucide-react";
import { StatePill, type PillState } from "./StatePill";

export function HomeHeader({
  shopName,
  logoUrl,
  handle,
  pillState,
  onGuestSave,
  onEditName,
  onEditLogo,
  onSignIn,
  onShare,
}: {
  shopName: string;
  logoUrl?: string | null;
  handle?: string;
  pillState: PillState;
  onGuestSave?: () => void;
  onEditName?: () => void;
  onEditLogo?: () => void;
  onSignIn?: () => void;
  onShare?: () => void;
}) {
  const initial = shopName.trim().charAt(0).toUpperCase() || "S";
  const showPower = pillState === "guest" || pillState === "expired";

  return (
    <header className="sticky top-0 z-20 flex h-13 items-center justify-between gap-1 border-b border-line bg-white/95 px-3 py-1.5 backdrop-blur-md sm:h-14 sm:gap-2 sm:px-4 sm:py-2 lg:px-8">
      <div className="flex min-w-0 items-center gap-2">
        {onEditLogo ? (
          <button
            type="button"
            onClick={onEditLogo}
            aria-label="Edit shop logo"
            title="Edit shop logo"
            className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft text-sm font-bold text-accent-strong ring-1 ring-accent/25 shadow-[0_1px_2px_rgb(20_18_15/0.06)] sm:h-10 sm:w-10 sm:text-base"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </button>
        ) : (
          <div
            className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft text-sm font-bold text-accent-strong ring-1 ring-accent/25 shadow-[0_1px_2px_rgb(20_18_15/0.06)] sm:h-10 sm:w-10 sm:text-base"
            aria-hidden="true"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-0.5">
            <h1
              className="truncate text-sm font-bold leading-5 text-ink sm:text-base"
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
        {onShare ? (
          <button
            type="button"
            onClick={onShare}
            aria-label="Share storefront"
            title="Share storefront"
            className="relative grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition after:absolute after:-inset-1 after:content-[''] hover:bg-muted hover:text-ink active:bg-muted"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
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
