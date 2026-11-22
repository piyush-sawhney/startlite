"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { cn } from "@/lib/cn";

type IconProps = { active: boolean };
type IconComponent = (props: IconProps) => ReactElement;

function stroke(active: boolean) {
  return {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: active ? 2 : 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

export function HomeIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M4 10.6 12 4l8 6.6V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z"
        {...stroke(active)}
      />
    </svg>
  );
}

export function SalesIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" {...stroke(active)} />
      <path d="M9 8h6M9 12h6M9 16h3" {...stroke(active)} />
    </svg>
  );
}

export function CustomersIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" {...stroke(active)} />
      <path d="M3.5 20c.6-3.4 2.8-5.2 5.5-5.2s4.9 1.8 5.5 5.2" {...stroke(active)} />
      <path d="M15.5 5.4a3 3 0 0 1 0 5.5M17 14.9c2.1.5 3.4 2.2 3.8 5.1" {...stroke(active)} />
    </svg>
  );
}

export function CatalogIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" {...stroke(active)} />
      <rect x="13" y="4" width="7" height="7" rx="1.5" {...stroke(active)} />
      <rect x="4" y="13" width="7" height="7" rx="1.5" {...stroke(active)} />
      <rect x="13" y="13" width="7" height="7" rx="1.5" {...stroke(active)} />
    </svg>
  );
}

export function MoreIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="5.5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="18.5" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function ExpensesIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2.5" {...stroke(active)} />
      <path d="M3 10.5h18" {...stroke(active)} />
      <path d="M16 15.5h2" {...stroke(active)} />
    </svg>
  );
}

export function SettingsIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="12" cy="12" r="3.1" {...stroke(active)} />
      <path
        d="M12 3.2v2M12 18.8v2M4.1 4.1l1.4 1.4M18.5 18.5l1.4 1.4M3.2 12h2M18.8 12h2M4.1 19.9l1.4-1.4M18.5 5.5l1.4-1.4"
        {...stroke(active)}
      />
    </svg>
  );
}

export type NavItem = {
  key: string;
  label: string;
  Icon: IconComponent;
  active: boolean;
  href?: string;
  onClick?: () => void;
  badge?: number;
};

function BrandMark({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-[13px] font-black text-white">
        SL
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight">{label}</p>
        {sub ? (
          <p className="truncate text-[11px] text-ink-subtle">{sub}</p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Desktop-only left navigation. Hidden below `lg`, where the bottom tab bar
 * takes over instead.
 */
export function NavRail({
  brand,
  brandSub,
  items,
  footer,
}: {
  brand: string;
  brandSub?: string;
  items: NavItem[];
  footer?: React.ReactNode;
}) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col border-r border-line bg-surface/80 px-3 py-5 backdrop-blur lg:flex">
      <div className="px-2">
        <BrandMark label={brand} sub={brandSub} />
      </div>

      <nav className="mt-6 flex flex-col gap-0.5" aria-label="Main">
        {items.map((item) => {
          const Icon = item.Icon;
          const inner = (
            <span className="flex w-full items-center gap-2.5">
              <Icon active={item.active} />
              <span className="flex-1 truncate text-left">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="tnum rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-bold text-warning">
                  {item.badge}
                </span>
              ) : null}
            </span>
          );
          const className = cn(
            "flex min-h-10 items-center rounded-xl px-2.5 text-sm transition",
            item.active
              ? "bg-accent-soft font-semibold text-accent-strong"
              : "font-medium text-ink-muted hover:bg-muted hover:text-ink",
          );

          return item.href ? (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={className}
            >
              {inner}
            </Link>
          ) : (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick}
              aria-current={item.active ? "page" : undefined}
              className={className}
            >
              {inner}
            </button>
          );
        })}
      </nav>

      {footer ? <div className="mt-auto space-y-3 px-2">{footer}</div> : null}
    </aside>
  );
}

export function BottomTabs({ noun }: { noun: string }) {
  const pathname = usePathname();

  const items = [
    { href: "/app", label: "Home", icon: HomeIcon, exact: true },
    { href: "/app/sales", label: "Sales", icon: SalesIcon },
    { href: "/app/customers", label: "Customers", icon: CustomersIcon },
    { href: "/app/catalog", label: noun, icon: CatalogIcon },
    { href: "/app/more", label: "More", icon: MoreIcon },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
      aria-label="Main"
    >
      <div className="safe-bottom mx-auto grid w-full max-w-[640px] grid-cols-5">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] leading-4",
                active ? "font-semibold text-accent" : "font-medium text-ink-muted",
              )}
            >
              <Icon active={active} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MerchantNav({
  noun,
  businessName,
  storeHref,
  pendingCount,
}: {
  noun: string;
  businessName: string;
  storeHref: string;
  pendingCount: number;
}) {
  const pathname = usePathname();

  const entries: Array<{
    href: string;
    label: string;
    Icon: IconComponent;
    exact?: boolean;
    badge?: number;
  }> = [
    { href: "/app", label: "Home", Icon: HomeIcon, exact: true },
    { href: "/app/sales", label: "Sales", Icon: SalesIcon, badge: pendingCount },
    { href: "/app/customers", label: "Customers", Icon: CustomersIcon },
    { href: "/app/catalog", label: noun, Icon: CatalogIcon },
    { href: "/app/more", label: "More", Icon: MoreIcon },
  ];

  return (
    <NavRail
      brand={businessName}
      brandSub="StartLite shop"
      items={entries.map((entry) => ({
        key: entry.href,
        label: entry.label,
        Icon: entry.Icon,
        badge: entry.badge,
        href: entry.href,
        active: entry.exact
          ? pathname === entry.href
          : pathname.startsWith(entry.href),
      }))}
      footer={
        <>
          <Link
            href={storeHref}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-[13px] font-semibold text-ink transition hover:bg-muted"
          >
            View store ↗
          </Link>
          <p className="text-center text-[11px] leading-4 text-ink-subtle">
            Saved on this account
          </p>
        </>
      }
    />
  );
}
