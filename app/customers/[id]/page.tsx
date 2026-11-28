import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { OpeningDueForm } from "@/components/OpeningDueForm";
import { CustomerEditForm } from "@/components/CustomerEditForm";
import type { CustomerEditValues } from "@/components/CustomerEditForm";
import { Card, PageHeader, StatusPill } from "@/components/ui";
import { whatsappLink } from "@/lib/bill";
import { summarizeCustomerOrders } from "@/lib/customer-summary";
import { callLink, smsLink } from "@/lib/contact";
import { isReady, isToFinish } from "@/lib/order-status";
import { formatDateDMY, istDateString } from "@/lib/date";
import { dec, formatAmount } from "@/lib/money";
import {
  getCustomer,
  getCustomerOrders,
  getCustomerTopItems,
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

  const [orders, topItems] = await Promise.all([
    getCustomerOrders(business.id, customer.id),
    getCustomerTopItems(business.id, customer.id),
  ]);
  const rows = orders.map((order) => ({
    order,
    total: dec(order.grandTotal),
    paid: dec(order.paidTotal),
    due: dec(orderDue(order)),
  }));
  const summary = summarizeCustomerOrders(orders);
  const { pending } = summary;

  const reminder = pending.greaterThan(0)
    ? `Namaste ${customer.name}, gentle reminder from ${business.businessName} regarding pending balance of ${formatAmount(pending)}.`
    : `Namaste ${customer.name}, thank you for your business at ${business.businessName}.`;

  const formValues: CustomerEditValues = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone ?? "",
    email: customer.email ?? "",
    subLabel: customer.subLabel ?? "",
    notes: customer.notes ?? "",
    address: customer.address ?? {
      line1: "",
      line2: "",
      line3: "",
      locality: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    lastPaid: customer.lastPaidAt
      ? formatDateDMY(istDateString(customer.lastPaidAt))
      : "—",
    since: formatDateDMY(istDateString(customer.createdAt)),
  };

  const readyCount = orders.filter((order) => isReady(order.status)).length;
  const toFinishCount = orders.filter((order) => isToFinish(order.status)).length;

  type Stat = {
    label: string;
    value: string;
    tone?: string;
    parts?: Array<{ label: string; tone: string }>;
  };
  const stats: Stat[] = [
    {
      label: "Orders",
      value: String(summary.orderCount),
      parts: [
        { label: `${summary.completedCount} done`, tone: "text-success" },
        { label: `${readyCount} ready`, tone: "text-warning" },
        { label: `${toFinishCount} to finish`, tone: "text-info" },
        { label: `${summary.cancelledCount} cancelled`, tone: "text-ink-subtle" },
      ],
    },
    { label: "Billed", value: formatAmount(summary.totalBilled) },
    { label: "Paid", value: formatAmount(summary.totalPaid) },
    {
      label: "Due",
      value: formatAmount(pending),
      tone: pending.greaterThan(0) ? "text-warning" : "text-ink",
    },
  ];

  const contactLink =
    "inline-flex items-center gap-1 text-caption font-semibold text-ink-muted transition hover:text-accent-strong";

  return (
    <>
      <Link href="/customers" className="text-small font-semibold text-accent-strong">
        ← Back
      </Link>

      <PageHeader
        title={customer.name}
        action={
          customer.phone || customer.email ? (
            <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 pt-1">
              {customer.phone ? (
                <>
                  <a href={callLink(customer.phone, "+91")} className={contactLink}>
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    Call
                  </a>
                  <a
                    href={smsLink(customer.phone, "+91", reminder)}
                    className={contactLink}
                  >
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                    SMS
                  </a>
                  <a
                    href={whatsappLink(customer.phone, reminder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${contactLink} hover:text-success`}
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    WhatsApp
                  </a>
                </>
              ) : null}
              {customer.email ? (
                <a href={`mailto:${customer.email}`} className={contactLink}>
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  Email
                </a>
              ) : null}
            </div>
          ) : null
        }
      />

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
              <p className="mt-0.5 flex max-w-[260px] flex-wrap gap-x-1.5 text-caption">
                {stat.parts.map((part, partIndex) => (
                  <span key={part.label} className={part.tone}>
                    {partIndex > 0 ? (
                      <span className="text-ink-subtle">· </span>
                    ) : null}
                    {part.label}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <CustomerEditForm values={formValues} />
          <div className="mt-3">
            <OpeningDueForm customerId={customer.id} />
          </div>
        </div>

        <div className="space-y-3 xl:sticky xl:top-4 xl:self-start">
          <Card className="p-0">
            <div className="border-b border-line px-3 py-2">
              <h2 className="text-small font-bold text-ink">Top items</h2>
            </div>
            {topItems.length === 0 ? (
              <p className="px-3 py-5 text-center text-small text-ink-muted">
                No items yet.
              </p>
            ) : (
              <ol className="divide-y divide-line">
                {topItems.map((item, index) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between gap-2 px-3 py-2"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="tnum grid h-5 w-5 shrink-0 place-items-center rounded-md bg-muted text-caption font-bold text-ink-muted">
                        {index + 1}
                      </span>
                      <span className="truncate text-small text-ink">{item.name}</span>
                    </span>
                    <span className="tnum shrink-0 text-caption font-semibold text-ink-muted">
                      {item.count} ordered
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          <Card className="p-0">
            <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
              <h2 className="text-small font-bold text-ink">Orders</h2>
              <span className="tnum text-caption text-ink-muted">{rows.length}</span>
            </div>
            {rows.length === 0 ? (
              <p className="px-3 py-8 text-center text-small text-ink-muted">
                No orders yet.
              </p>
            ) : (
              <div className="max-h-[52vh] divide-y divide-line overflow-auto">
                {rows.map(({ order, total, paid, due }) => (
                  <Link
                    key={order.id}
                    href={`/app/sales/${order.id}`}
                    className="block px-3 py-2.5 transition hover:bg-muted/60"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-small font-bold text-ink">
                        #{order.orderCode}
                      </span>
                      <StatusPill status={order.status} />
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-2 text-caption text-ink-muted">
                      <span>Needed {formatDateDMY(order.neededBy)}</span>
                      <span className="tnum">
                        {formatAmount(total)} · Paid {formatAmount(paid)}
                      </span>
                    </span>
                    {due.greaterThan(0) ? (
                      <span className="mt-0.5 block text-caption font-bold text-warning">
                        {formatAmount(due)} due
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
