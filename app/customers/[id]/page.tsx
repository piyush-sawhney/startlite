import Link from "next/link";
import { notFound } from "next/navigation";
import { OpeningDueForm } from "@/components/OpeningDueForm";
import { Card, MetricTile, PageHeader, StatusPill } from "@/components/ui";
import { whatsappLink } from "@/lib/bill";
import { callLink, smsLink } from "@/lib/contact";
import { formatDateDMY, istDateString } from "@/lib/date";
import { dec, formatAmount } from "@/lib/money";
import { isClosed } from "@/lib/order-status";
import { getCustomer, getCustomerOrders, orderDue } from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

const ORDER_GRID =
  "grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] lg:items-center";

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
  const rows = orders.map((order) => ({
    order,
    total: dec(order.grandTotal),
    paid: dec(order.paidTotal),
    due: dec(orderDue(order)),
  }));
  const openRows = rows.filter((row) => !isClosed(row.order.status));
  const billed = rows.reduce((sum, row) => sum.plus(row.total), dec(0));
  const paid = openRows.reduce((sum, row) => sum.plus(row.paid), dec(0));
  const pending = openRows.reduce((sum, row) => sum.plus(row.due), dec(0));

  const reminder = pending.greaterThan(0)
    ? `Namaste ${customer.name}, gentle reminder from ${business.businessName} regarding pending balance of ${formatAmount(pending)}.`
    : `Namaste ${customer.name}, thank you for your business at ${business.businessName}.`;

  return (
    <>
      <div className="mb-1">
        <Link href="/customers" className="text-small font-semibold text-accent-strong">
          ← Customers
        </Link>
      </div>

      <PageHeader
        title={customer.name}
        subtitle={
          customer.phone
            ? `${customer.phone}${customer.subLabel ? ` · ${customer.subLabel}` : ""}`
            : customer.subLabel || "No phone"
        }
      />

      <section aria-label="Customer summary" className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
        <MetricTile label="Orders" value={String(rows.length)} period="All" />
        <MetricTile label="Billed" value={formatAmount(billed)} period="All" />
        <MetricTile label="Paid" value={formatAmount(paid)} period="All" tone="success" />
        <MetricTile
          label="Pending"
          value={formatAmount(pending)}
          period="All"
          tone={pending.greaterThan(0) ? "warning" : "plain"}
        />
      </section>

      {customer.phone ? (
        <div className="mb-4 grid grid-cols-3 gap-2">
          <a
            href={callLink(customer.phone, "+91")}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-surface text-small font-semibold text-ink transition hover:bg-muted"
          >
            Call
          </a>
          <a
            href={smsLink(customer.phone, "+91", reminder)}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-surface text-small font-semibold text-ink transition hover:bg-muted"
          >
            SMS
          </a>
          <a
            href={whatsappLink(customer.phone, reminder)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-success/30 bg-success-soft text-small font-semibold text-success transition hover:bg-success/15"
          >
            WhatsApp
          </a>
        </div>
      ) : null}

      <Card className="mb-4 p-0">
        <div className="border-b border-line px-3 py-2.5">
          <h2 className="text-small font-bold text-ink">Customer details</h2>
        </div>
        <dl className="divide-y divide-line px-3">
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-caption text-ink-muted">Phone</dt>
            <dd className="text-small font-semibold text-ink">{customer.phone ?? "No phone"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-caption text-ink-muted">Label</dt>
            <dd className="text-small font-semibold text-ink">{customer.subLabel ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-caption text-ink-muted">Last paid</dt>
            <dd className="text-small font-semibold text-ink">
              {customer.lastPaidAt ? formatDateDMY(istDateString(customer.lastPaidAt)) : "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-caption text-ink-muted">Customer since</dt>
            <dd className="text-small font-semibold text-ink">
              {formatDateDMY(istDateString(customer.createdAt))}
            </dd>
          </div>
        </dl>
        {customer.notes ? (
          <p className="border-t border-line px-3 py-2.5 text-small text-ink-muted">
            Note: <span className="font-bold text-ink">{customer.notes}</span>
          </p>
        ) : null}
      </Card>

      <Card className="mb-4 overflow-hidden p-0">
        <div className="border-b border-line px-3 py-2.5">
          <h2 className="text-small font-bold text-ink">Orders</h2>
        </div>
        {rows.length === 0 ? (
          <p className="px-3 py-6 text-center text-small text-ink-muted">No orders yet.</p>
        ) : (
          <>
            <div aria-hidden="true" className={`${ORDER_GRID} hidden border-b border-line py-2 lg:grid`}>
              <span className="eyebrow text-ink-subtle">Order</span>
              <span className="eyebrow text-ink-subtle">Needed by</span>
              <span className="eyebrow text-ink-subtle">Placed on</span>
              <span className="eyebrow text-ink-subtle">Status</span>
              <span className="eyebrow text-right text-ink-subtle">Total</span>
              <span className="eyebrow text-right text-ink-subtle">Due</span>
            </div>
            <div className="divide-y divide-line">
              {rows.map(({ order, total, due }) => (
                <Link
                  key={order.id}
                  href={`/app/sales/${order.id}`}
                  aria-label={`Order ${order.orderCode}, ${formatAmount(due)} due`}
                  className={ORDER_GRID}
                >
                  <span className="truncate text-small font-bold text-ink">
                    #{order.orderCode}
                  </span>
                  <span className="text-caption text-ink-muted">
                    {formatDateDMY(order.neededBy)}
                  </span>
                  <span className="text-caption text-ink-muted">
                    {formatDateDMY(istDateString(order.createdAt))}
                  </span>
                  <span><StatusPill status={order.status} /></span>
                  <span className="figure text-small text-ink">{formatAmount(total)}</span>
                  <span
                    className={`figure text-small font-bold ${due.greaterThan(0) ? "text-warning" : "text-success"}`}
                  >
                    {due.greaterThan(0) ? formatAmount(due) : "Paid"}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </Card>

      <OpeningDueForm customerId={customer.id} />
    </>
  );
}
