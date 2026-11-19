import Link from "next/link";
import { notFound } from "next/navigation";
import { PendingOrderActions } from "@/components/PendingOrderActions";
import { Card, PageHeader } from "@/components/ui";
import { formatBillDate, formatNeededBy } from "@/lib/bill";
import { formatAmount } from "@/lib/money";
import { lineChanged, priceLines } from "@/lib/pending";
import { getPendingOrder } from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ReviewOrderPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { business } = await requireBusiness();
  const { code } = await params;
  const pending = await getPendingOrder(business.id, code);
  if (!pending) notFound();

  const priced = await priceLines(
    business.id,
    pending.lines.map((line) => ({
      itemId: line.itemId,
      optionId: line.optionId,
      extraIds: line.extraIds,
      quantity: line.quantity,
    })),
  );

  const currentByIndex = priced.ok ? priced.cart.lines : [];
  const anyChanged =
    !priced.ok ||
    pending.lines.some((line, index) => {
      const current = currentByIndex[index];
      return current ? lineChanged(line, current) : true;
    });

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[460px] px-4 pb-16 pt-6">
      <PageHeader
        title={pending.buyerName}
        subtitle={`New order · ${formatBillDate(pending.createdAt)}`}
        action={
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-strong">
            New
          </span>
        }
      />

      <Card className="bg-accent-soft/60">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-ink-muted">Buyer total</p>
            <p className="tnum text-2xl font-semibold">
              {formatAmount(pending.grandTotal)}
            </p>
          </div>
          {priced.ok && priced.cart.grandTotal !== pending.grandTotal ? (
            <div className="text-right">
              <p className="text-xs text-ink-muted">Today</p>
              <p className="tnum text-lg font-semibold">
                {formatAmount(priced.cart.grandTotal)}
              </p>
            </div>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          {pending.buyerPhone ? `+91 ${pending.buyerPhone}` : "No phone"}
          {pending.timeSlot ? ` · ${pending.timeSlot}` : ""}
          {pending.neededBy
            ? ` · Needed ${formatNeededBy(pending.neededBy)}`
            : ""}
        </p>
        {pending.note ? (
          <p className="mt-2 rounded-md bg-surface px-3 py-2 text-sm">
            {pending.note}
          </p>
        ) : null}
      </Card>

      <Card className="mt-4">
        <h2 className="text-[15px] font-semibold">Items</h2>
        {!priced.ok ? (
          <p className="mt-2 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
            {priced.message}
          </p>
        ) : null}
        <div className="mt-2 divide-y divide-line">
          {pending.lines.map((line, index) => {
            const current = currentByIndex[index];
            const changed = current ? lineChanged(line, current) : true;
            return (
              <div key={`${line.itemId}-${index}`} className="py-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {Number(line.quantity)} × {line.itemName}
                      {line.optionName ? (
                        <span className="text-ink-muted"> ({line.optionName})</span>
                      ) : null}
                    </p>
                    {line.extraNames.length > 0 ? (
                      <p className="text-xs text-ink-muted">
                        {line.extraNames.join(" · ")}
                      </p>
                    ) : null}
                    {changed && current ? (
                      <p className="mt-1 text-[11px] font-medium text-warning">
                        Now {formatAmount(current.lineTotal)} · was{" "}
                        {formatAmount(line.lineTotal)}
                      </p>
                    ) : null}
                  </div>
                  <p className="tnum shrink-0 font-medium">
                    {formatAmount(line.lineTotal)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <PendingOrderActions code={pending.code} changed={anyChanged} />

      <p className="mt-4 text-center text-xs text-ink-subtle">
        Accepting saves the order at today’s price. It does not send a bill.
      </p>
      <p className="mt-2 text-center text-xs text-ink-subtle">
        <Link href="/app" className="font-medium text-accent">
          Back to Home
        </Link>
      </p>
    </main>
  );
}
