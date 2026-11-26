"use client";

import { ArrowUpRight, PackagePlus, PlusCircle, UserPlus } from "lucide-react";
import { primaryButton } from "@/components/ui";

export function QuickActions({
  onAddSale,
  onAddCustomer,
  onAddItem,
  onAddExpense,
}: {
  onAddSale?: () => void;
  onAddCustomer: () => void;
  onAddItem: () => void;
  onAddExpense: () => void;
}) {
  return (
    <section aria-label="Quick actions" className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {/* The only filled primary action on the screen. */}
      <button type="button" onClick={onAddSale} className={primaryButton("min-h-12 px-3 text-small font-bold shadow-[0_4px_12px_rgb(11_110_98/0.22)]")}>
        <PlusCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Add sale</span>
      </button>

      <button
        type="button"
        onClick={onAddCustomer}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3 text-small font-semibold text-ink shadow-[0_1px_2px_rgb(20_18_15/0.04)] transition hover:border-info/40 hover:bg-info-soft/60 active:bg-muted"
      >
        <UserPlus className="h-4 w-4 shrink-0 text-info" aria-hidden="true" />
        <span>Add customer</span>
      </button>

      <button
        type="button"
        onClick={onAddItem}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3 text-small font-semibold text-ink shadow-[0_1px_2px_rgb(20_18_15/0.04)] transition hover:border-accent/40 hover:bg-accent-soft/60 active:bg-muted"
      >
        <PackagePlus className="h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
        <span>Add item</span>
      </button>

      <button
        type="button"
        onClick={onAddExpense}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3 text-small font-semibold text-ink shadow-[0_1px_2px_rgb(20_18_15/0.04)] transition hover:border-danger/40 hover:bg-danger-soft/60 active:bg-muted"
      >
        <ArrowUpRight className="h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
        <span>Add expense</span>
      </button>
    </section>
  );
}
