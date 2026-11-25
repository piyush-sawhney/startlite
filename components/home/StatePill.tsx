"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

export type PillState = "guest" | "owner" | "offline" | "expired";

export function StatePill({
  state,
  onGuestSave,
  className,
}: {
  state: PillState;
  onGuestSave?: () => void;
  className?: string;
}) {
  const configs = {
    guest: {
      dot: "bg-warning",
      text: "Not saved",
      wrapperClass: "text-warning hover:bg-warning/10 cursor-pointer",
    },
    owner: {
      dot: "bg-success",
      text: "Saved",
      wrapperClass: "text-ink-muted hover:bg-muted cursor-default",
    },
    offline: {
      dot: "bg-ink-subtle",
      text: "Offline",
      wrapperClass: "text-ink-subtle hover:bg-muted cursor-pointer",
    },
    expired: {
      dot: "bg-ink-subtle",
      text: "Sign in",
      wrapperClass: "text-ink hover:bg-muted cursor-pointer",
    },
  };

  const config = configs[state];

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-semibold tracking-tight transition sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs",
        config.wrapperClass,
        className,
      )}
      aria-label={`Shop status: ${config.text}`}
    >
      <span className={cn("h-2 w-2 rounded-full", config.dot)} aria-hidden="true" />
      <span>{config.text}</span>
    </span>
  );

  if (state === "guest" && onGuestSave) {
    return (
      <button type="button" onClick={onGuestSave}>
        {content}
      </button>
    );
  }

  if (state === "expired") {
    return (
      <Link href="/login">
        {content}
      </Link>
    );
  }

  return content;
}
