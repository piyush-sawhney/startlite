import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/ui";
import { formatBillDate } from "@/lib/bill";
import { formatAmount } from "@/lib/money";
import { getMerchantSnapshot } from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const { business } = await requireBusiness();
  const snapshot = await getMerchantSnapshot(business.id);

  const rows = [...snapshot.customers].sort((a, b) => {
    const pendingA = Number(snapshot.pendingByCustomer.get(a.id) ?? 0);
    const pendingB = Number(snapshot.pendingByCustomer.get(b.id) ?? 0);
    if (pendingB !== pendingA) return pendingB - pendingA;
    return a.name.localeCompare(b.name);
  });

  const withPending = rows.filter((row) =>
    Number(snapshot.pendingByCustomer.get(row.id) ?? 0) > 0,
  ).length;

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle={`${rows.length} people · ${withPending} with pending`}
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No customers yet"
          body="Add a sale with a name or phone, and the customer appears here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {rows.map((customer, index) => {
            const pending = snapshot.pendingByCustomer.get(customer.id) ?? "0.00";
            return (
              <Link
                key={customer.id}
                href={`/app/customers/${customer.id}`}
                className={
                  index > 0
                    ? "block border-t border-line px-4 py-3"
                    : "block px-4 py-3"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{customer.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {customer.phone ?? "No phone"}
                      {customer.lastPaidAt
                        ? ` · Paid ${formatBillDate(customer.lastPaidAt)}`
                        : " · No payments yet"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={
                        Number(pending) > 0
                          ? "tnum font-semibold text-ink"
                          : "tnum font-semibold text-ink-subtle"
                      }
                    >
                      {formatAmount(pending)}
                    </p>
                    <p className="text-[11px] text-ink-subtle">
                      {Number(pending) > 0 ? "Pending" : "No dues"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
