import Link from "next/link";
import {
  EmptyState,
  PageHeader,
  StatusPill,
  inputClass,
  primaryButton,
  quietButton,
} from "@/components/ui";
import { formatBillDate } from "@/lib/bill";
import { formatAmount } from "@/lib/money";
import { isClosed, isCompleted } from "@/lib/order-status";
import { getMerchantSnapshot } from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "paid", label: "Paid" },
];

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const { business } = await requireBusiness();
  const params = await searchParams;
  const filter = FILTERS.some((entry) => entry.id === params.filter)
    ? (params.filter as string)
    : "all";
  const query = (params.q ?? "").trim().toLowerCase();
  const snapshot = await getMerchantSnapshot(business.id);

  const rows = snapshot.orders.filter((order) => {
    if (filter === "pending" && isClosed(order.status)) {
      return false;
    }
    if (filter === "paid" && !isCompleted(order.status)) return false;
    if (!query) return true;
    return [order.customerName, order.customerPhone, order.orderCode]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(query));
  });

  return (
    <>
      <PageHeader
        title="Sales"
        subtitle={`${snapshot.orders.length} orders`}
        action={
          <Link href="/app/sales/new" className={primaryButton("px-3")}>
            Add sale
          </Link>
        }
      />

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <form className="flex gap-2 lg:max-w-md lg:flex-1" action="/app/sales">
          <input type="hidden" name="filter" value={filter} />
          <input
            className={inputClass}
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Name, phone, or order code"
            aria-label="Search sales"
          />
          <button className={quietButton("shrink-0 px-3")}>Search</button>
        </form>

        <div className="flex gap-2">
          {FILTERS.map((entry) => {
            const href = `/app/sales?filter=${entry.id}${
              params.q ? `&q=${encodeURIComponent(params.q)}` : ""
            }`;
            const active = entry.id === filter;
            return (
              <Link
                key={entry.id}
                href={href}
                className={
                  active
                    ? "rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white"
                    : "rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink-muted transition hover:bg-muted"
                }
              >
                {entry.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {rows.length === 0 ? (
          <EmptyState
            title={query ? "No matching orders" : "No orders here yet"}
            body={
              query
                ? "Try a different name, phone, or order code."
                : "Add a sale and it appears here."
            }
            action={
              <Link href="/app/sales/new" className={primaryButton()}>
                Add sale
              </Link>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            {rows.map((order, index) => {
              const due =
                Number(order.grandTotal) -
                Number(order.paidTotal) -
                Number(order.tdsTotal);
              return (
                <Link
                  key={order.id}
                  href={`/app/sales/${order.id}`}
                  className={
                    index > 0
                      ? "block border-t border-line px-4 py-3 transition hover:bg-muted/60"
                      : "block px-4 py-3 transition hover:bg-muted/60"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {order.customerName ?? "Walk-in sale"}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {order.orderCode} · {formatBillDate(order.createdAt)} ·{" "}
                        {snapshot.itemCounts.get(order.id) ?? 0} item
                        {(snapshot.itemCounts.get(order.id) ?? 0) === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="tnum font-semibold">
                        {formatAmount(order.grandTotal)}
                      </p>
                      <p
                        className={
                          due > 0
                            ? "text-xs font-semibold text-warning"
                            : "text-xs font-medium text-success"
                        }
                      >
                        {due > 0 ? `${formatAmount(due)} due` : "Paid"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusPill status={order.status} />
                    {order.source === "whatsapp_store" ? (
                      <span className="text-[11px] text-ink-subtle">From store</span>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
