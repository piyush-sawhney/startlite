import Link from "next/link";
import {
  EmptyState,
  MetricTile,
  PageHeader,
  SectionLabel,
  StatusPill,
  primaryButton,
  quietButton,
} from "@/components/ui";
import { dec, formatAmount } from "@/lib/money";
import { formatBillDate } from "@/lib/bill";
import { getMerchantSnapshot, startOfTodayIst } from "@/lib/queries";
import { requireBusiness } from "@/lib/session";
import { displayShopLink } from "@/lib/shop";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { user, business } = await requireBusiness();
  const snapshot = await getMerchantSnapshot(business.id);
  const today = startOfTodayIst();

  const todaySales = snapshot.orders
    .filter(
      (order) =>
        order.status !== "cancelled" &&
        order.createdAt.getTime() >= today.getTime(),
    )
    .reduce((total, order) => total.plus(order.revenueSubtotal), dec(0));

  const receivedToday = snapshot.payments
    .filter((payment) => payment.paidAt.getTime() >= today.getTime())
    .reduce((total, payment) => total.plus(payment.amount), dec(0));

  const firstName = user.name.split(" ")[0] || "there";

  return (
    <>
      <PageHeader
        eyebrow="Today at your shop"
        title={`Namaste, ${firstName}`}
        subtitle={business.businessName}
        action={
          <Link href="/app/sales/new" className={primaryButton("hidden lg:inline-flex")}>
            Add sale
          </Link>
        }
      />

      <div className="grid gap-2.5 sm:grid-cols-3">
        <MetricTile
          label="Today's sales"
          value={formatAmount(todaySales.toFixed(2))}
          period="Today"
        />
        <MetricTile
          label="Received today"
          value={formatAmount(receivedToday.toFixed(2))}
          period="Cash and UPI"
          tone="success"
        />
        <MetricTile
          label="Pending"
          value={formatAmount(snapshot.pendingTotal)}
          period="All bills"
          tone="warning"
          hint="Tap Customers to remind"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          {snapshot.pendingOrders.length > 0 ? (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <SectionLabel>New orders</SectionLabel>
                <span className="text-xs font-medium text-ink-subtle">
                  {snapshot.pendingOrders.length} waiting
                </span>
              </div>
              <div className="space-y-2">
                {snapshot.pendingOrders.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href={`/o/${order.code}`}
                    className="block rounded-2xl border border-accent/25 bg-accent-soft px-4 py-3 transition hover:border-accent/45"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{order.buyerName}</p>
                        <p className="text-sm text-ink-muted">
                          {order.lines.length} item
                          {order.lines.length === 1 ? "" : "s"} ·{" "}
                          {formatBillDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="tnum font-semibold">
                          {formatAmount(order.grandTotal)}
                        </p>
                        <span className="text-xs font-semibold text-accent-strong">
                          Review →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <SectionLabel>Recent orders</SectionLabel>
              <Link href="/app/sales" className="text-sm font-semibold text-accent">
                See all
              </Link>
            </div>

            {snapshot.orders.length === 0 ? (
              <EmptyState
                title="No orders yet"
                body="Add your first sale to start the ledger."
                action={
                  <Link href="/app/sales/new" className={primaryButton()}>
                    Add sale
                  </Link>
                }
              />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                {snapshot.orders.slice(0, 5).map((order, index) => {
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
                            {formatBillDate(order.createdAt)} ·{" "}
                            {snapshot.itemCounts.get(order.id) ?? 0} item
                            {(snapshot.itemCounts.get(order.id) ?? 0) === 1
                              ? ""
                              : "s"}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="tnum font-semibold">
                            {formatAmount(order.grandTotal)}
                          </p>
                          <p
                            className={
                              due > 0
                                ? "mt-0.5 text-xs font-semibold text-warning"
                                : "mt-0.5 text-xs font-medium text-success"
                            }
                          >
                            {due > 0 ? `${formatAmount(due)} due` : "Paid"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <StatusPill status={order.status} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <SectionLabel>Quick actions</SectionLabel>
            <div className="mt-3 grid gap-2">
              <Link href="/app/sales/new" className={primaryButton("w-full")}>
                Add sale
              </Link>
              <Link href="/app/customers" className={quietButton("w-full")}>
                Send a reminder
              </Link>
              <Link href="/app/catalog" className={quietButton("w-full")}>
                Update prices
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-gradient-to-br from-accent-soft via-sand to-canvas p-4">
            <SectionLabel>Your store</SectionLabel>
            <p className="mt-1 break-all text-sm font-semibold text-accent-strong">
              {displayShopLink(business.handle)}
            </p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">
              Share this link on WhatsApp. Buyers order without an account.
            </p>
            <Link
              href={`/b/${business.handle}`}
              target="_blank"
              rel="noreferrer"
              className={quietButton("mt-3 w-full bg-surface/80")}
            >
              Open storefront ↗
            </Link>
          </div>
        </aside>
      </div>

      <div className="mt-6 lg:hidden">
        <Link
          href="/app/sales/new"
          className={primaryButton("w-full min-h-12 text-base")}
        >
          Add sale
        </Link>
      </div>
    </>
  );
}
