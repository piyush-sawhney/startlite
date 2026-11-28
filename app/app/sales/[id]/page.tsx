import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderActions } from "@/components/OrderActions";
import {
  Card,
  PageHeader,
  PaymentPill,
  StatusPill,
} from "@/components/ui";
import { formatBillDate, formatNeededBy } from "@/lib/bill";
import { formatAmount } from "@/lib/money";
import { paymentStatus } from "@/lib/payment-status";
import { getOrder, orderDue } from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { business } = await requireBusiness();
  const { id } = await params;
  const record = await getOrder(id, business.id);
  if (!record) notFound();

  const { order, lines, payments } = record;
  const due = orderDue(order);
  const hasDue = Number(due) > 0;
  const neededBy = formatNeededBy(order.neededBy);
  const pay = paymentStatus(order.grandTotal, due);
  const units = lines.reduce((total, line) => total + Number(line.quantity), 0);

  const stats = [
    { label: "Total", value: formatAmount(order.grandTotal) },
    { label: "Paid", value: formatAmount(order.paidTotal) },
    {
      label: "Due",
      value: hasDue ? formatAmount(due) : "—",
      tone: hasDue ? "text-warning" : "text-ink",
    },
    {
      label: "Items",
      value: String(lines.length),
      parts: [{ label: `${units} units`, tone: "text-ink-subtle" }],
    },
  ];

  const detailLink =
    "inline-flex items-center gap-1 text-caption font-semibold text-ink-muted transition hover:text-accent-strong";
  const facts = [
    { label: "Needed", value: neededBy },
    { label: "Time", value: order.timeSlot ?? "" },
    { label: "Placed", value: formatBillDate(order.createdAt) },
    {
      label: "Source",
      value: order.source === "whatsapp_store" ? "Storefront" : "In person",
    },
    { label: "Note", value: order.deliveryNote ?? "" },
  ].filter((fact) => fact.value);

  return (
    <>
      <Link href="/app/sales" className="text-small font-semibold text-accent-strong">
        ← Orders
      </Link>

      <PageHeader
        title={order.customerName ?? "Walk-in sale"}
        subtitle={`#${order.orderCode} · ${formatBillDate(order.createdAt)}`}
        action={<StatusPill status={order.status} />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Link href={`/app/sales/${order.id}/bill`} className={detailLink}>
          Send bill
        </Link>
        {order.customerPhone ? (
          <a href={`tel:${order.customerPhone}`} className={detailLink}>
            Call
          </a>
        ) : null}
        <PaymentPill status={pay} />
      </div>

      <section
        aria-label="Summary"
        className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-2.5"
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`min-w-[96px] px-1 ${
              index > 0 ? "border-l border-line pl-6" : "pl-0"
            }`}
          >
            <p className="eyebrow text-ink-subtle">{stat.label}</p>
            <p className={`tnum mt-0.5 text-body font-semibold ${stat.tone ?? "text-ink"}`}>
              {stat.value}
            </p>
            {stat.parts ? (
              <p className="mt-0.5 text-caption text-ink-subtle">
                {stat.parts.map((part) => part.label).join(" · ")}
              </p>
            ) : null}
          </div>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="h-fit min-w-0 p-0">
          <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
            <h2 className="text-small font-bold text-ink">Items</h2>
            <span className="tnum text-caption text-ink-muted">{lines.length}</span>
          </div>
          {lines.length === 0 ? (
            <p className="px-3 py-6 text-center text-small text-ink-muted">
              No items.
            </p>
          ) : (
            <div className="divide-y divide-line px-3">
              {lines.map((line) => {
                const extras = (line.extrasSnapshot ?? [])
                  .map((extra) => extra.name)
                  .join(" · ");
                return (
                  <div key={line.id} className="flex items-start justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-small font-semibold text-ink">
                        {Number(line.quantity)} × {line.itemNameSnapshot}
                        {line.optionSnapshot ? (
                          <span className="font-medium text-ink-muted">
                            {" "}
                            ({line.optionSnapshot})
                          </span>
                        ) : null}
                      </p>
                      {extras ? (
                        <p className="truncate text-caption text-ink-muted">{extras}</p>
                      ) : null}
                      {line.customerNote ? (
                        <p className="truncate text-caption text-ink-subtle">
                          Note: {line.customerNote}
                        </p>
                      ) : null}
                      <p className="mt-0.5 text-caption text-ink-subtle">
                        {formatAmount(line.unitPrice)} each
                        {line.unitLabelSnapshot ? ` per ${line.unitLabelSnapshot}` : ""}
                      </p>
                    </div>
                    <p className="tnum shrink-0 text-small font-semibold text-ink">
                      {formatAmount(line.lineTotal)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <dl className="space-y-1 border-t border-line px-3 py-3 text-small">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Total</dt>
              <dd className="tnum font-semibold text-ink">
                {formatAmount(order.grandTotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Paid</dt>
              <dd className="tnum text-ink">{formatAmount(order.paidTotal)}</dd>
            </div>
            {Number(order.tdsTotal) > 0 ? (
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">TDS</dt>
                <dd className="tnum text-ink">{formatAmount(order.tdsTotal)}</dd>
              </div>
            ) : null}
            <div
              className={`flex justify-between gap-3 font-bold ${
                hasDue ? "text-warning" : "text-success"
              }`}
            >
              <dt>{hasDue ? "Due" : "Settled"}</dt>
              <dd className="tnum">
                {hasDue ? formatAmount(due) : "Fully settled"}
              </dd>
            </div>
          </dl>
        </Card>

        <div className="space-y-3 xl:sticky xl:top-4 xl:self-start">
          <Card className="p-0">
            <div className="border-b border-line px-3 py-2">
              <h2 className="text-small font-bold text-ink">Details</h2>
            </div>
            <dl className="divide-y divide-line px-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-start justify-between gap-3 py-2"
                >
                  <dt className="shrink-0 text-caption text-ink-muted">
                    {fact.label}
                  </dt>
                  <dd className="min-w-0 text-right text-small font-semibold text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          {payments.length > 0 ? (
            <Card className="p-0">
              <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
                <h2 className="text-small font-bold text-ink">Payments</h2>
                <span className="tnum text-caption text-ink-muted">
                  {payments.length}
                </span>
              </div>
              <div className="max-h-[40vh] divide-y divide-line overflow-auto px-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-start justify-between gap-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-small font-semibold text-ink">
                        {formatAmount(payment.amount)} · {payment.paymentMode}
                      </p>
                      <p className="truncate text-caption text-ink-muted">
                        {formatBillDate(payment.paidAt)}
                        {payment.note ? ` · ${payment.note}` : ""}
                      </p>
                    </div>
                    {Number(payment.tdsDeducted) > 0 ? (
                      <p className="tnum shrink-0 text-caption text-ink-muted">
                        TDS {formatAmount(payment.tdsDeducted)}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>
      </div>

      <OrderActions
        orderId={order.id}
        status={order.status}
        due={due}
        orderCode={order.orderCode}
        customerName={order.customerName}
        customerPhone={order.customerPhone}
        shopName={business.businessName}
        upiId={business.upiId}
      />
    </>
  );
}
