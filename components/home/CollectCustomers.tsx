"use client";

import { Card, SectionLabel } from "@/components/ui";
import type { CustomerDue } from "@/lib/home-types";

export function CollectCustomers({
  customers,
  onSelectCustomer,
}: {
  customers: CustomerDue[];
  onSelectCustomer: (id: string) => void;
}) {
  return (
    <Card className="p-4">
      <div className="border-b border-line pb-3">
        <SectionLabel>To collect from customers</SectionLabel>
      </div>

      {customers.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-muted">No dues.</p>
      ) : (
        <div className="mt-2 divide-y divide-line">
          {customers.map((c) => (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCustomer(c.id)}
              className="flex cursor-pointer items-center justify-between py-2.5 transition active:bg-muted/40"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink" title={c.name}>
                  {c.name}
                </p>
                {c.lastPaidDate ? (
                  <p className="text-xs text-ink-muted">last {c.lastPaidDate}</p>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <span className="tnum font-semibold text-warning">
                  {c.pending}
                </span>
                <span className="text-ink-subtle" aria-hidden="true">
                  ›
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
