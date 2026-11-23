"use client";

import { ArrowUpRight, PackagePlus, PlusCircle, UserPlus } from "lucide-react";
import { primaryButton, quietButton } from "@/components/ui";

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
  const saleClass = primaryButton(
    "w-full min-h-11 px-2.5 sm:px-3 text-xs sm:text-[14px] font-semibold flex items-center justify-center gap-1.5",
  );

  return (
    <section aria-label="Quick actions" className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
      {/* 1. Add sale (primary accent button) */}
      <button type="button" onClick={onAddSale} className={saleClass}>
        <PlusCircle className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
        <span>Add sale</span>
      </button>

      {/* 2. Add customer */}
      <button
        type="button"
        onClick={onAddCustomer}
        className={quietButton(
          "w-full min-h-11 px-2.5 sm:px-3 text-xs sm:text-[14px] font-medium flex items-center justify-center gap-1.5 hover:border-accent/40",
        )}
      >
        <UserPlus className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
        <span>Add customer</span>
      </button>

      {/* 3. Add item */}
      <button
        type="button"
        onClick={onAddItem}
        className={quietButton(
          "w-full min-h-11 px-2.5 sm:px-3 text-xs sm:text-[14px] font-medium flex items-center justify-center gap-1.5 hover:border-accent/40",
        )}
      >
        <PackagePlus className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
        <span>Add item</span>
      </button>

      {/* 4. Add expense */}
      <button
        type="button"
        onClick={onAddExpense}
        className={quietButton(
          "w-full min-h-11 px-2.5 sm:px-3 text-xs sm:text-[14px] font-medium flex items-center justify-center gap-1.5 hover:border-danger/40 hover:text-danger",
        )}
      >
        <ArrowUpRight className="h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
        <span>Add expense</span>
      </button>
    </section>
  );
}
