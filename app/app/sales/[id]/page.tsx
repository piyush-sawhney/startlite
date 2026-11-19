import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderActions } from "@/components/OrderActions";
import { Card, PageHeader, StatusPill, quietButton } from "@/components/ui";
import { formatBillDate, formatNeededBy } from "@/lib/bill";
import { formatAmount, multiply } from "@/lib/money";
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
  const neededBy = formatNeededBy(order.neededBy);

  return (
    <>
      <PageHeader
        title={order.customerName ?? "Walk-in sale"}
        subtitle={`${order.orderCode} · ${formatBillDate(order.createdAt)}`}
        action={<StatusPill status={order.status} />}
      />

      <div className="flex flex-wrap gap-2">
        <Link href={`/app/sales/${order.id}/bill`} className={quietButton()}>
          Send bill
        </Link>
        {order.customerPhone ? (
          <a
            href={`tel:${order.customerPhone}`}
            className={quietButton()}
          >
            Call
          </a>
        ) : null}
      </div>

      {order.deliveryNote || neededBy ? (
        <Card className="mt-4 bg-muted/50">
          {neededBy ? (
            <p className="text-sm">
              <span className="text-ink-muted">Needed by · </span>
              {neededBy}
            </p>
          ) : null}
          {order.timeSlot ? (
            <p className="mt-1 text-sm">
              <span className="text-ink-muted">Time · </span>
              {order.timeSlot}
            </p>
          ) : null}
          {order.deliveryNote ? (
            <p className="mt-1 text-sm">{order.deliveryNote}</p>
          ) : null}
        </Card>
      ) : null}

      <Card className="mt-4">
        <h2 className="text-[15px] font-semibold">Items</h2>
        <div className="mt-2 divide-y divide-line">
          {lines.map((line) => (
            <div key={line.id} className="py-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {Number(line.quantity)} × {line.itemNameSnapshot}
                    {line.optionSnapshot ? (
                      <span className="text-ink-muted"> ({line.optionSnapshot})</span>
                    ) : null}
                  </p>
                  {(line.extrasSnapshot ?? []).length > 0 ? (
                    <p className="text-xs text-ink-muted">
                      {(line.extrasSnapshot ?? [])
                        .map((extra) => extra.name)
                        .join(" · ")}
                    </p>
                  ) : null}
                  {line.customerNote ? (
                    <p className="mt-1 text-xs text-ink-muted">
                      Note: {line.customerNote}
                    </p>
                  ) : null}
                </div>
                <p className="tnum shrink-0 font-medium">
                  {formatAmount(line.lineTotal)}
                </p>
              </div>
              {line.unitPrice ? (
                <p className="mt-0.5 text-[11px] text-ink-subtle">
                  {formatAmount(line.unitPrice)} each
                  {line.unitLabelSnapshot
                    ? ` per ${line.unitLabelSnapshot}`
                    : ""}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Total</dt>
            <dd className="tnum">{formatAmount(order.grandTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Paid</dt>
            <dd className="tnum">{formatAmount(order.paidTotal)}</dd>
          </div>
          {Number(order.tdsTotal) > 0 ? (
            <div className="flex justify-between">
              <dt className="text-ink-muted">TDS</dt>
              <dd className="tnum">{formatAmount(order.tdsTotal)}</dd>
            </div>
          ) : null}
          <div
            className={
              Number(due) > 0
                ? "flex justify-between font-semibold text-warning"
                : "flex justify-between font-semibold text-success"
            }
          >
            <dt>{Number(due) > 0 ? "Due" : "Status"}</dt>
            <dd className="tnum">{Number(due) > 0 ? formatAmount(due) : "Fully settled"}</dd>
          </div>
        </dl>
      </Card>

      {payments.length > 0 ? (
        <Card className="mt-4">
          <h2 className="text-[15px] font-semibold">Payments</h2>
          <div className="mt-2 divide-y divide-line">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between gap-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {formatAmount(payment.amount)} · {payment.paymentMode}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {formatBillDate(payment.paidAt)}
                    {payment.note ? ` · ${payment.note}` : ""}
                  </p>
                </div>
                {Number(payment.tdsDeducted) > 0 ? (
                  <p className="tnum text-xs text-ink-muted">
                    TDS {formatAmount(payment.tdsDeducted)}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      ) : null}

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
