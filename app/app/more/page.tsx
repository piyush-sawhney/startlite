import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { SignOutButton } from "@/components/SignOutButton";
import { Card, PageHeader } from "@/components/ui";
import { formatBillDate } from "@/lib/bill";
import { getPack } from "@/lib/packs";
import { storefrontStatus } from "@/lib/shop";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function MorePage() {
  const { user, business } = await requireBusiness();
  const status = storefrontStatus(business);
  const pack = getPack(business.categoryPack);
  const link = `/b/${business.handle}`;
  const absolute = `${(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "")}${link}`;

  const rows = [
    { href: "/app/more/expenses", label: "Expenses" },
    { href: "/app/more/cash", label: "Cash left" },
  ];

  const shopRows = [
    { href: "/app/more/settings", label: "Store settings" },
    { href: "/app/more/settings#link", label: "Store link" },
  ];

  return (
    <>
      <PageHeader title="More" subtitle={business.businessName} />

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[15px] font-semibold">{business.businessName}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {pack.label} · {business.locality ?? "No locality"}
            </p>
          </div>
          <span
            className={
              status === "live"
                ? "rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success"
                : "rounded-full bg-warning/10 px-2.5 py-1 text-[11px] font-semibold text-warning"
            }
          >
            {status === "live" ? "Live" : "Paused"}
          </span>
        </div>

        <div className="mt-4 rounded-md bg-muted px-3 py-2.5">
          <p className="text-[11px] font-medium text-ink-muted">Store link</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{link}</p>
            <CopyButton value={absolute} />
          </div>
        </div>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `See my shop: ${absolute}`,
          )}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line bg-surface text-sm font-medium"
        >
          Share on WhatsApp
        </a>

        <p className="mt-3 text-[11px] text-ink-subtle">
          {business.passExpiresAt
            ? `Pass valid until ${formatBillDate(business.passExpiresAt)}`
            : `Trial until ${formatBillDate(business.trialEndsAt)}`}
          {status === "live" ? " · Storefront is live" : " · Storefront is paused"}
        </p>
      </Card>

      <Group title="Money">
        {rows.map((row) => (
          <Row key={row.href} href={row.href} label={row.label} />
        ))}
      </Group>

      <Group title="Shop">
        {shopRows.map((row) => (
          <Row key={row.href} href={row.href} label={row.label} />
        ))}
        <Row href="/app/more/settings#language" label="Language · English" />
      </Group>

      <Group title="Data">
        <a
          href="/api/v1/merchant/export.csv"
          className="flex min-h-12 items-center justify-between px-4 text-[15px]"
        >
          Download data
          <span className="text-ink-subtle">↓</span>
        </a>
      </Group>

      <Group title="Help">
        <Row href="/" label="How it works" />
        <a
          href="mailto:help@startlite.in"
          className="flex min-h-12 items-center justify-between px-4 text-[15px]"
        >
          Contact us
          <span className="text-ink-subtle">→</span>
        </a>
      </Group>

      <div className="mt-6 space-y-3">
        <p className="text-center text-xs text-ink-subtle">
          Signed in as {user.email}
        </p>
        <SignOutButton />
      </div>
    </>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
        {title}
      </h2>
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {children}
      </div>
    </section>
  );
}

function Row({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-12 items-center justify-between px-4 text-[15px]"
    >
      {label}
      <span className="text-ink-subtle">→</span>
    </Link>
  );
}
