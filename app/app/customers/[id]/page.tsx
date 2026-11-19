import Link from "next/link";
import { notFound } from "next/navigation";
import { OpeningDueForm } from "@/components/OpeningDueForm";
import { Card, PageHeader, StatusPill } from "@/components/ui";
import { formatBillDate } from "@/lib/bill";
import { formatAmount } from "@/lib/money";
import {
  getCustomer,
  getCustomerOrders,
  orderDue,
} from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { business } = await requireBusiness();
  const { id } = await params;
  const customer = await getCustomer(business.id, id);
  if (!customer) notFound();

  const orders = await getCustomerOrders(business.id, customer.id);
  const pending = orders
    .filter((order) => order.status !== "settled" && order.status !== "cancelled")
    .reduce((total, order) => total + Number(orderDue(order)), 0)
    .toFixed(2);

  return (
    <>
      <div className="mb-1">
        <Link href="/app/customers" className="text-sm font-medium text-accent">
          ← Customers
        </Link>
      </div>
      <PageHeader
        title={customer.name}
        subtitle={customer.phone ?? "No phone"}
        action={
          <div className="text-right">
            <p
              className={
                Number(pending) > 0
                  ? "tnum text-lg font-bold text-warning"
                  : "tnum text-lg font-semibold text-success"
              }
            >
              {formatAmount(pending)}
            </p>
            <p
              className={
                Number(pending) > 0
                  ? "text-[11px] font-semibold text-warning"
                  : "text-[11px] font-medium text-success"
              }
            >
              {Number(pending) > 0 ? "Pending" : "No dues"}
            </p>
          </div>
        }
      />

      {customer.phone ? (
        <div className="flex gap-2">
          <a
            href={`tel:${customer.phone}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-line bg-surface text-sm font-medium transition hover:bg-muted"
          >
            Call
          </a>
          <a
            href={`https://wa.me/91${customer.phone.replace(/\D/g, "").slice(-10)}${
              Number(pending) > 0
                ? `?text=${encodeURIComponent(
                    `Namaste ${customer.name}, gentle reminder from ${business.businessName} regarding pending balance of ${formatAmount(pending)}.`,
                  )}`
                : ""
            }`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface text-sm font-semibold text-ink transition hover:bg-muted"
          >
            WhatsApp
          </a>
        </div>
      ) : null}

      <Card className="mt-4">
        <h2 className="text-[15px] font-semibold">Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">No orders yet.</p>
        ) : (
          <div className="mt-2 divide-y divide-line">
            {orders.map((order) => {
              const due = orderDue(order);
              return (
                <Link
                  key={order.id}
                  href={`/app/sales/${order.id}`}
                  className="flex items-start justify-between gap-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{order.orderCode}</p>
                    <p className="text-xs text-ink-muted">
                      {formatBillDate(order.createdAt)} ·{" "}
                      {Number(due) > 0 ? `${formatAmount(due)} due` : "Paid"}
                    </p>
                    <div className="mt-1">
                      <StatusPill status={order.status} />
                    </div>
                  </div>
                  <p className="tnum shrink-0 text-sm font-semibold">
                    {formatAmount(order.grandTotal)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      <div className="mt-4">
        <OpeningDueForm customerId={customer.id} />
      </div>

      {customer.notes ? (
        <p className="mt-4 text-sm text-ink-muted">{customer.notes}</p>
      ) : null}
    </>
  );
}
