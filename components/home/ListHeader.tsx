"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * The one header anatomy for every Home list card. Type follows the shared
 * scale: title is body strong, metadata is caption, totals use the figure
 * utility. The sort control and the collapse button sit in one trailing group.
 */
export function ListHeader({
  title,
  count,
  total,
  totalLabel,
  controlsId,
  collapsed,
  onToggle,
  children,
}: {
  title: string;
  count: number;
  total?: string;
  totalLabel: string;
  controlsId: string;
  collapsed: boolean;
  onToggle: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <span className="truncate text-small font-bold text-ink lg:text-body">
          {title}:
        </span>
        <span className="shrink-0 text-caption font-semibold text-ink-muted">
          Total {count}
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {total ? (
          <span className="whitespace-nowrap text-caption text-ink-muted">
            <span className="hidden sm:inline">{totalLabel}: </span>
            <span className="figure text-small font-bold text-ink">{total}</span>
          </span>
        ) : null}
        {children}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-controls={controlsId}
          aria-label={`${collapsed ? "Expand" : "Collapse"} ${title}`}
          className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl text-ink transition after:absolute after:-inset-1 after:content-[''] hover:bg-muted"
        >
          <ChevronDown
            className={`h-4 w-4 transition ${collapsed ? "-rotate-90" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
