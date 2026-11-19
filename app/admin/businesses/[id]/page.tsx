import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/ui";
import { getAdminBusinessDetail } from "@/lib/admin";
import { formatBillDate } from "@/lib/bill";
import { formatAmount } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminBusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getAdminBusinessDetail(id);
  if (!detail) notFound();

  const { business, owner, status, items, orders, subscriptionPayments, auditLog } = detail;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm font-medium text-accent">
          ← Back to Admin Console
        </Link>
      </div>

      <PageHeader
        eyebrow={`Shop /b/${business.handle}`}
        title={business.businessName}
        subtitle={`Owner: ${owner.name} (${owner.email})`}
        action={
          <span
            className={
              status === "live"
                ? "rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success"
                : status === "paused"
                  ? "rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning"
                  : "rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger"
            }
          >
            {status.toUpperCase()}
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold text-ink">Shop Details</h2>
          <dl className="mt-3 divide-y divide-line text-xs">
            <div className="flex justify-between py-2">
              <dt className="text-ink-muted">Category Pack</dt>
              <dd className="font-medium text-ink">{business.categoryPack}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-ink-muted">WhatsApp</dt>
              <dd className="font-medium text-ink">{business.whatsappNumber}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-ink-muted">UPI ID</dt>
              <dd className="font-medium text-ink">{business.upiId || "None"}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-ink-muted">Locality</dt>
              <dd className="font-medium text-ink">{business.locality || "None"}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-ink-muted">Storefront URL</dt>
              <dd>
                <a
                  href={`/b/${business.handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent hover:underline"
                >
                  /b/{business.handle} ↗
                </a>
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-ink">Subscription Status</h2>
          <dl className="mt-3 divide-y divide-line text-xs">
            <div className="flex justify-between py-2">
              <dt className="text-ink-muted">Trial Ends</dt>
              <dd className="font-medium text-ink">
                {formatBillDate(business.trialEndsAt)}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-ink-muted">Pass Expires</dt>
              <dd className="font-medium text-ink">
                {business.passExpiresAt
                  ? formatBillDate(business.passExpiresAt)
                  : "No pass active"}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-ink-muted">Account State</dt>
              <dd className="font-medium text-ink">
                {business.disabledAt
                  ? `Suspended on ${formatBillDate(business.disabledAt)}`
                  : "Active"}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-ink-muted">Registered</dt>
              <dd className="font-medium text-ink">
                {formatBillDate(business.createdAt)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-ink">
          Subscription Payments ({subscriptionPayments.length})
        </h2>
        {subscriptionPayments.length === 0 ? (
          <p className="mt-2 text-xs text-ink-muted">No manual passes activated yet.</p>
        ) : (
          <div className="mt-3 divide-y divide-line text-xs">
            {subscriptionPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-semibold text-ink">Invoice {p.invoiceNo}</p>
                  <p className="text-ink-muted">
                    Valid {p.validFrom} to {p.validUntil} · {p.note}
                  </p>
                </div>
                <p className="tnum font-semibold text-ink">
                  {formatAmount(p.amountInr)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-ink">
          Audit Trail ({auditLog.length})
        </h2>
        {auditLog.length === 0 ? (
          <p className="mt-2 text-xs text-ink-muted">No audit events logged.</p>
        ) : (
          <div className="mt-3 divide-y divide-line text-xs">
            {auditLog.map((log) => (
              <div key={log.id} className="py-2">
                <div className="flex justify-between">
                  <span className="font-medium text-ink">{log.action}</span>
                  <span className="text-ink-subtle">
                    {formatBillDate(log.createdAt)}
                  </span>
                </div>
                {log.meta && Object.keys(log.meta).length > 0 ? (
                  <pre className="mt-1 text-[11px] text-ink-muted">
                    {JSON.stringify(log.meta)}
                  </pre>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
