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
  tone?: "plain" | "accent" | "success" | "warning" | "danger";
}) {
  const [showFull, setShowFull] = useState(false);

  const tones = {
    plain: "border-line bg-surface text-ink",
    accent: "border-accent/20 bg-accent-soft text-accent-strong",
    success: "border-success/20 bg-success/8 text-success",
    warning: "border-warning/25 bg-warning/10 text-warning",
    danger: "border-danger/25 bg-danger/8 text-danger",
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
        "cursor-pointer select-none rounded-2xl border p-3 sm:p-3.5 transition active:scale-[0.99]",
        tones[tone],
        className,
      )}
    >
      {/* Header: icon plus the same short label at every width */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg sm:h-7 sm:w-7 sm:rounded-xl",
            iconBg,
            iconColor,
          )}
          aria-hidden="true"
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        <div className="min-w-0">
          <p
            className="truncate text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
            title={kpi.label}
          >
            {shortLabel}
          </p>
        </div>
      </div>

      {/* Amount: compact on mobile, full on desktop or on toggle */}
      <p className="tnum mt-1.5 text-lg font-semibold leading-6 tracking-tight text-ink sm:mt-2 sm:text-xl lg:text-2xl">
        <span className="lg:hidden">{showFull ? kpi.amount : kpi.compactAmount}</span>
        <span className="hidden lg:inline">{kpi.amount}</span>
      </p>

      {/* Count line, only when count > 0 */}
      {kpi.count && kpi.count > 0 && kpi.countLabel ? (
        <p className="mt-0.5 text-[10px] font-medium text-ink-subtle sm:text-[11px]">
          {kpi.countLabel}
        </p>
      ) : null}

      {/* Caption/Hint if present */}
      {kpi.hint ? (
        <p className="mt-1 text-[9px] font-medium text-ink-subtle sm:text-[10px]">
          {kpi.hint}
        </p>
      ) : null}
    </div>
  );
}

export function KpiStrip({ kpis }: { kpis: HomeKpis }) {
  return (
    <section aria-label="Key Performance Indicators">
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {/* 1. Cash In (Today Paid) - Green arrow down-left */}
        <KpiCell
          kpi={kpis.todayPaid}
          shortLabel="Cash in"
          icon={ArrowDownLeft}
          iconColor="text-success"
          iconBg="bg-success/15"
          tone={kpis.todayPaid.rawAmount > 0 ? "success" : "plain"}
        />

        {/* 2. To Collect (Today To Collect) - Amber clock */}
        <KpiCell
          kpi={kpis.todayToCollect}
          shortLabel="To collect"
          icon={Clock}
          iconColor="text-warning"
          iconBg="bg-warning/15"
          tone={kpis.todayToCollect.rawAmount > 0 ? "warning" : "plain"}
        />

        {/* 3. Sales (This Week Sales) - Trending up */}
        <KpiCell
          kpi={kpis.thisWeekSales}
          shortLabel="Sales"
          icon={TrendingUp}
          iconColor="text-accent-strong"
          iconBg="bg-accent/15"
        />

        {/* 4. Cash Out (This Week Expenses) - Red arrow up-right */}
        <KpiCell
          kpi={kpis.thisWeekExpenses}
          shortLabel="Cash out"
          icon={ArrowUpRight}
          iconColor="text-danger"
          iconBg="bg-danger/15"
          tone={kpis.thisWeekExpenses.rawAmount > 0 ? "danger" : "plain"}
        />

        {/* 5. Cash Left (Net) - Wallet */}
        <KpiCell
          kpi={kpis.thisWeekCashLeft}
          shortLabel="Cash left"
          icon={Wallet}
          iconColor="text-ink"
          iconBg="bg-ink/10"
          className="col-span-2"
        />
      </div>
    </section>
  );
}
