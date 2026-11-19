import type { Metadata } from "next";
import { AdminConsole } from "@/components/AdminConsole";
import { Card, MetricTile, PageHeader } from "@/components/ui";
import {
  getPlatformSettings,
  getPlatformStats,
  listAdminBusinesses,
} from "@/lib/admin";
import { formatAmount } from "@/lib/money";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Platform Admin · StartLite",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [stats, settings, businesses] = await Promise.all([
    getPlatformStats(),
    getPlatformSettings(),
    listAdminBusinesses(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform Operations"
        title="Admin Console"
        subtitle="Manage shops, manual pass activations, and subscriptions"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricTile
          label="Total Shops"
          value={stats.totalBusinesses}
          period="Registered"
        />
        <MetricTile
          label="Live Storefronts"
          value={stats.liveCount}
          tone="success"
          period="Public"
        />
        <MetricTile
          label="Active Passes"
          value={stats.activePassesCount}
          period="Paid 90d"
        />
        <MetricTile
          label="Pass Revenue"
          value={formatAmount(stats.revenueInr)}
          tone="accent"
          period="Collected"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-ink-muted">
          <div>
            <span className="font-semibold text-ink">Entity: </span>
            {settings.legalName} ({settings.gstin})
          </div>
          <div>
            <span className="font-semibold text-ink">SAC: </span>
            {settings.sac}
            <span className="mx-2">·</span>
            <span className="font-semibold text-ink">Next Invoice: </span>
            {settings.invoicePrefix}-{String(settings.nextInvoiceNo).padStart(4, "0")}
          </div>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-subtle">
          Shops ({businesses.length})
        </h2>
        <AdminConsole initialBusinesses={businesses} />
      </div>
    </div>
  );
}
