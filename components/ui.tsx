import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function primaryButton(extra?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgb(20_18_15/0.08)] transition hover:bg-accent-strong active:bg-accent-strong disabled:opacity-50",
    extra,
  );
}

export function quietButton(extra?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-[15px] font-medium text-ink transition hover:bg-muted active:bg-muted disabled:opacity-50",
    extra,
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgb(20_18_15/0.05)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

const TONES = {
  plain: "border-line bg-surface",
  accent: "border-accent/20 bg-accent-soft",
  success: "border-success/20 bg-success/8",
  warning: "border-warning/25 bg-warning/10",
  info: "border-info/20 bg-info/8",
  dark: "border-transparent bg-ink text-white",
} as const;

const VALUE_TONES = {
  plain: "text-ink",
  accent: "text-accent-strong",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
  dark: "text-white",
} as const;

const LABEL_TONES = {
  plain: "text-ink-muted",
  accent: "text-accent-strong",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
  dark: "text-white/70",
} as const;

export type MetricTone = keyof typeof TONES;

/**
 * One money figure with a label and a period. Tones let the important number
 * (usually money owed) stand out without adding a second accent colour.
 */
export function MetricTile({
  label,
  value,
  period,
  tone = "plain",
  hint,
  className,
}: {
  label: string;
  value: string | number;
  period?: string;
  tone?: MetricTone;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-3.5",
        TONES[tone],
        className,
      )}
    >
      <p
        className={cn(
          "text-[11px] font-semibold leading-4",
          LABEL_TONES[tone],
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "tnum mt-1 text-xl font-semibold leading-7 tracking-tight",
          VALUE_TONES[tone],
        )}
      >
        {value}
      </p>
      {period ? (
        <p
          className={cn(
            "mt-0.5 text-[10px]",
            tone === "dark" ? "text-white/55" : "text-ink-subtle",
          )}
        >
          {period}
        </p>
      ) : null}
      {hint ? (
        <p
          className={cn(
            "mt-1 text-[10px] font-semibold",
            LABEL_TONES[tone],
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  action,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-[26px] font-semibold leading-8 tracking-tight lg:text-[32px] lg:leading-10">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-ink-muted lg:text-[15px]">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-[13px] font-medium text-ink-muted">
      {children}
    </span>
  );
}

export const inputClass =
  "block min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-[15px] text-ink placeholder:text-ink-subtle focus:border-accent/50 focus:outline-none";

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    under_review: { label: "Under review", className: "bg-muted text-ink-muted" },
    waiting_client: {
      label: "Waiting for client",
      className: "bg-info/10 text-info",
    },
    accepted: { label: "Accepted", className: "bg-accent-soft text-accent-strong" },
    in_progress: { label: "In progress", className: "bg-accent-soft text-accent-strong" },
    ready: { label: "Ready", className: "bg-warning/10 text-warning" },
    completed: { label: "Completed", className: "bg-success/10 text-success" },
    declined: { label: "Declined", className: "bg-danger/10 text-danger" },
    cancelled: { label: "Cancelled", className: "bg-danger/10 text-danger" },
  };
  const entry = map[status] ?? { label: status, className: "bg-muted text-ink-muted" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        entry.className,
      )}
    >
      {entry.label}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface/60 px-5 py-9 text-center">
      <p className="font-semibold">{title}</p>
      {body ? <p className="mt-1 text-sm text-ink-muted">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/** Small uppercase label used above grouped sections. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
      {children}
    </p>
  );
}
