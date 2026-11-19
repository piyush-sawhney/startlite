import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import { formatAmount } from "@/lib/money";
import {
  cashSummary,
  getMerchantSnapshot,
  startOfMonthIst,
  startOfTodayIst,
} from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

const PERIODS = {
  today: { label: "Today", since: startOfTodayIst },
  month: { label: "This month", since: startOfMonthIst },
  all: { label: "All", since: () => null },
} as const;

export default async function CashPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { business } = await requireBusiness();
  const params = await searchParams;
  const key = (params.period as keyof typeof PERIODS) in PERIODS
    ? (params.period as keyof typeof PERIODS)
    : "today";
  const period = PERIODS[key];
  const snapshot = await getMerchantSnapshot(business.id);
  const summary = cashSummary(
    snapshot.orders,
    snapshot.payments,
    snapshot.expenses,
    period.since(),
  );

  return (
    <>
      <div className="mb-1">
        <Link href="/app/more" className="text-sm font-medium text-accent">
          ← More
        </Link>
      </div>
      <PageHeader title="Cash left" subtitle={`Period · ${period.label}`} />

      <div className="flex gap-2">
        {(Object.keys(PERIODS) as Array<keyof typeof PERIODS>).map((entry) => (
          <Link
            key={entry}
            href={`/app/more/cash?period=${entry}`}
            className={
              entry === key
                ? "rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white"
                : "rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink-muted"
            }
          >
            {PERIODS[entry].label}
          </Link>
        ))}
      </div>

      <Card className="mt-4">
        <div className="space-y-3">
          <Line label="Money received" value={summary.received} tone="success" />
          <Line label="Expenses" value={summary.spent} tone="danger" />
          <div className="border-t border-line pt-3">
            <Line label="Cash left" value={summary.left} strong />
          </div>
        </div>
      </Card>

      <p className="mt-4 rounded-md bg-muted px-3 py-2.5 text-xs leading-5 text-ink-muted">
        This is not profit. It is money received minus expenses. Stock, rent due,
        and your own time are not counted here.
      </p>
    </>
  );
}

function Line({
  label,
  value,
  tone,
  strong,
}: {
  label: string;
  value: string;
  tone?: "success" | "danger";
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={strong ? "font-semibold" : "text-sm text-ink-muted"}>
        {label}
      </span>
      <span
        className={
          strong
            ? "tnum text-2xl font-semibold"
            : tone === "success"
              ? "tnum text-lg font-semibold text-success"
              : tone === "danger"
                ? "tnum text-lg font-semibold text-danger"
                : "tnum text-lg font-semibold"
        }
      >
        {formatAmount(value)}
      </span>
    </div>
  );
}
