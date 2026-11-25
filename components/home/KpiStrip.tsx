"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { HomeKpi, HomeKpis } from "@/lib/home-types";

function KpiCell({
  kpi,
  shortLabel,
  icon: Icon,
  iconColor,
  iconBg,
  className,
  tone = "plain",
}: {
  kpi: HomeKpi;
  shortLabel: string;
  icon: typeof ArrowDownLeft;
  iconColor: string;
  iconBg: string;
  className?: string;
  tone?: "plain" | "accent" | "success" | "warning" | "danger" | "dark";
}) {
  const [showFull, setShowFull] = useState(false);
  const dark = tone === "dark";

  const tones = {
    plain: "border-line bg-surface",
    accent: "border-accent/25 bg-accent-soft",
    success: "border-success/25 bg-success-soft",
    warning: "border-warning/25 bg-warning-soft",
    danger: "border-danger/25 bg-danger-soft",
    dark: "border-accent-strong bg-accent-strong",
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={kpi.label}
      onClick={() => setShowFull(!showFull)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setShowFull(!showFull);
      }}
      className={cn(
        "cursor-pointer select-none rounded-xl border p-2.5 shadow-[0_1px_2px_rgb(20_18_15/0.04)] transition hover:shadow-[0_4px_12px_rgb(20_18_15/0.08)] active:scale-[0.99] sm:p-3",
        tones[tone],
        dark ? "text-white" : "text-ink",
        className,
      )}
    >
      {/* Header: the same short label and icon at every width. */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-lg sm:h-8 sm:w-8 sm:rounded-xl",
            iconBg,
            iconColor,
          )}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <p
          className={cn(
            "truncate text-xs font-semibold uppercase tracking-[0.08em]",
            dark ? "text-white/80" : "text-ink-muted",
          )}
          title={kpi.label}
        >
          {shortLabel}
        </p>
      </div>

      {/* Amount: compact on mobile, full on desktop or on tap. */}
      <p
        className={cn(
          "tnum mt-2 text-xl font-bold leading-7 tracking-tight sm:text-2xl",
          dark ? "text-white" : "text-ink",
        )}
      >
        <span className="lg:hidden">{showFull ? kpi.amount : kpi.compactAmount}</span>
        <span className="hidden lg:inline">{kpi.amount}</span>
      </p>

      {kpi.count && kpi.count > 0 && kpi.countLabel ? (
        <p
          className={cn(
            "mt-0.5 text-[11px] font-semibold",
            dark ? "text-white/75" : "text-ink-muted",
          )}
        >
          {kpi.countLabel}
        </p>
      ) : null}

      {kpi.hint ? (
        <p
          className={cn(
            "mt-1 text-[10px] font-medium",
            dark ? "text-white/70" : "text-ink-subtle",
          )}
        >
          {kpi.hint}
        </p>
      ) : null}
    </div>
  );
}

export function KpiStrip({ kpis }: { kpis: HomeKpis }) {
  return (
    <section aria-label="Key performance indicators">
      <p className="eyebrow mb-2 text-ink-subtle">Money</p>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Money in today — positive green. */}
        <KpiCell
          kpi={kpis.todayPaid}
          shortLabel="Cash in"
          icon={ArrowDownLeft}
          iconColor="text-success"
          iconBg="bg-success-soft"
          tone={kpis.todayPaid.rawAmount > 0 ? "success" : "plain"}
        />

        {/* Money owed on today's orders — amber, an action waiting. */}
        <KpiCell
          kpi={kpis.todayToCollect}
          shortLabel="To collect"
          icon={Clock}
          iconColor="text-warning"
          iconBg="bg-warning-soft"
          tone={kpis.todayToCollect.rawAmount > 0 ? "warning" : "plain"}
        />

        {/* Week's sales — brand teal. */}
        <KpiCell
          kpi={kpis.thisWeekSales}
          shortLabel="Sales"
          icon={TrendingUp}
          iconColor="text-accent-strong"
          iconBg="bg-accent-soft"
          tone="accent"
        />

        {/* Money out — red, the only destructive hue on the screen. */}
        <KpiCell
          kpi={kpis.thisWeekExpenses}
          shortLabel="Cash out"
          icon={ArrowUpRight}
          iconColor="text-danger"
          iconBg="bg-danger-soft"
          tone={kpis.thisWeekExpenses.rawAmount > 0 ? "danger" : "plain"}
        />

        {/* Net position — a deep teal anchor for the whole screen. */}
        <KpiCell
          kpi={kpis.thisWeekCashLeft}
          shortLabel="Cash left"
          icon={Wallet}
          iconColor="text-white"
          iconBg="bg-white/15"
          tone="dark"
          className="col-span-2"
        />
      </div>
    </section>
  );
}
