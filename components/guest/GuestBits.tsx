"use client";

import Link from "next/link";
import { quietButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { formatBillDate } from "@/lib/bill";

export function SaveBanner({ signInHref }: { signInHref: string }) {
  return (
    <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent-soft via-sand to-canvas p-4">
      <p className="text-[15px] font-semibold text-accent-strong">
        Saved on this phone
      </p>
      <p className="mt-1 text-sm leading-6 text-ink-muted">
        Everything works without an account. Sign in to keep it safe and get
        your store link.
      </p>
      <Link href={signInHref} className={quietButton("mt-3 w-full bg-surface/80")}>
        Save my shop
      </Link>
    </div>
  );
}

export function BackButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-1 text-sm font-medium text-accent"
    >
      ← {label}
    </button>
  );
}

export function MoneyLine({
  label,
  valuePaise,
  tone,
  strong,
}: {
  label: string;
  valuePaise: number;
  tone?: "success" | "danger";
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={strong ? "font-semibold" : "text-sm text-ink-muted"}>
        {label}
      </span>
      <span
        className={cn(
          "tnum",
          strong
            ? "text-2xl font-semibold"
            : tone === "success"
              ? "text-lg font-semibold text-success"
              : tone === "danger"
                ? "text-lg font-semibold text-danger"
                : "text-lg font-semibold",
        )}
      >
        {formatPaise(valuePaise)}
      </span>
    </div>
  );
}

export function shortDate(value: string | Date): string {
  return formatBillDate(value instanceof Date ? value : new Date(value));
}

export function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
        {children}
      </p>
      {action}
    </div>
  );
}
