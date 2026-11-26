"use client";

import { ExternalLink, Pencil, Share2 } from "lucide-react";
import type { PassTone } from "@/lib/pass-status";
import { StatePill, type PillState } from "./StatePill";

const META_TONE: Record<PassTone, string> = {
  good: "text-success",
  soon: "text-warning",
  expired: "text-danger",
};

export function HomeHeader({
  shopName,
  logoUrl,
  metaLine,
  metaTone,
  onMetaAction,
  storefrontHref,
  pillState,
  onGuestSave,
  onEditName,
  onEditLogo,
  onShare,
}: {
  shopName: string;
  logoUrl?: string | null;
  /** Trial or quarterly pass line for an owner, sign-in prompt for a guest. */
  metaLine?: string;
  metaTone?: PassTone;
  onMetaAction?: () => void;
  /** Owner-only link to the public storefront. */
  storefrontHref?: string;
  pillState: PillState;
  onGuestSave?: () => void;
  onEditName?: () => void;
  onEditLogo?: () => void;
  onShare?: () => void;
}) {
  const initial = shopName.trim().charAt(0).toUpperCase() || "S";

  return (
    <header className="sticky top-0 z-20 flex h-13 items-center gap-2 border-b border-line bg-white/95 px-3 py-1.5 backdrop-blur-md sm:h-14 sm:gap-3 sm:px-4 sm:py-2 lg:h-16 lg:gap-4 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-3">
        {onEditLogo ? (
          <button
            type="button"
            onClick={onEditLogo}
            aria-label="Edit shop logo"
            title="Edit shop logo"
            className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft text-small font-bold text-accent-strong ring-1 ring-accent/25 shadow-[0_1px_2px_rgb(20_18_15/0.06)] sm:h-10 sm:w-10 sm:text-body"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </button>
        ) : (
          <div
            className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft text-small font-bold text-accent-strong ring-1 ring-accent/25 shadow-[0_1px_2px_rgb(20_18_15/0.06)] sm:h-10 sm:w-10 sm:text-body"
            aria-hidden="true"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </div>
        )}
        <div className="flex min-w-0 flex-1 items-center gap-1 lg:gap-2">
          <h1
            className="min-w-0 max-w-[9rem] truncate text-small font-bold text-ink sm:max-w-[13rem] sm:text-body lg:max-w-none"
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
              className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl text-ink-muted transition after:absolute after:-inset-1 after:content-[''] hover:bg-muted hover:text-ink active:bg-muted"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
          {metaLine ? (
            <>
              <span
                className="hidden shrink-0 text-ink-subtle lg:inline"
                aria-hidden="true"
              >
                ·
              </span>
              {onMetaAction ? (
                <button
                  type="button"
                  onClick={onMetaAction}
                  title={metaLine}
                  className={`relative hidden min-w-0 shrink-0 whitespace-nowrap text-left text-small font-semibold hover:underline after:absolute after:-inset-y-3.5 after:-inset-x-1 after:content-[''] lg:inline-block ${metaTone ? META_TONE[metaTone] : "text-accent-strong"}`}
                >
                  {metaLine}
                </button>
              ) : (
                <span
                  className={`hidden min-w-0 shrink-0 whitespace-nowrap text-small font-semibold lg:inline-block ${metaTone ? META_TONE[metaTone] : "text-ink-muted"}`}
                  title={metaLine}
                >
                  {metaLine}
                </span>
              )}
            </>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 lg:gap-2">
        {storefrontHref ? (
          <a
            href={storefrontHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open storefront"
            title="Open storefront"
            className="relative inline-flex h-9 items-center gap-2 rounded-xl border border-line bg-surface px-2 text-ink-muted transition after:absolute after:-inset-1 after:content-[''] hover:border-accent/30 hover:bg-muted hover:text-accent-strong active:bg-muted sm:h-10 sm:px-3"
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden text-small font-semibold xl:inline">
              Open storefront
            </span>
          </a>
        ) : null}
        {onShare ? (
          <button
            type="button"
            onClick={onShare}
            aria-label="Share your store instantly"
            title="Share your store instantly"
            className="relative inline-flex h-9 items-center gap-2 rounded-xl border border-line bg-surface px-2 text-accent-strong transition after:absolute after:-inset-1 after:content-[''] hover:border-accent/30 hover:bg-muted active:bg-muted sm:h-10 sm:px-3"
          >
            <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden text-small font-semibold xl:inline">
              Share your store instantly
            </span>
          </button>
        ) : null}
        <StatePill state={pillState} onGuestSave={onGuestSave} />
      </div>
    </header>
  );
}
