"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import { LogIn, UserPlus } from "lucide-react";
import {
  CatalogIcon,
  CustomersIcon,
  ExpensesIcon,
  HomeIcon,
  NavRail,
  SalesIcon,
  SettingsIcon,
} from "@/components/BottomTabs";
import { cn } from "@/lib/cn";
import type { GuestTab } from "./types";

const ITEMS: Array<{
  id: GuestTab;
  label: string;
  Icon: (props: { active: boolean }) => ReactElement;
}> = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "sales", label: "Orders", Icon: SalesIcon },
  { id: "customers", label: "Customers", Icon: CustomersIcon },
  { id: "catalog", label: "Items", Icon: CatalogIcon },
  { id: "expenses", label: "Expenses", Icon: ExpensesIcon },
  { id: "more", label: "Settings", Icon: SettingsIcon },
];

/** The sidebar keeps its own order and labels; the bottom bar has all six. */
const SIDEBAR_ITEMS = [
  ITEMS[0],
  ITEMS[2],
  ITEMS[1],
  ITEMS[3],
  { id: "more" as GuestTab, label: "Store settings", Icon: SettingsIcon },
];

export function GuestNav({
  active,
  shopName,
  signInHref,
  onSelect,
}: {
  active: GuestTab;
  shopName: string;
  signInHref: string;
  onSelect: (tab: GuestTab) => void;
}) {
  return (
    <>
      <NavRail
        brand={shopName}
        brandSub="Saved on this phone"
        items={SIDEBAR_ITEMS.map((item) => ({
          key: item.id,
          label: item.label,
          Icon: item.Icon,
          active: item.id === active,
          onClick: () => onSelect(item.id),
        }))}
        footer={
          <>
            <Link
              href="/login"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-small font-semibold text-ink transition hover:bg-muted"
            >
              Sign in
            </Link>
            <Link
              href={signInHref}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent text-small font-semibold text-white transition hover:bg-accent-strong"
            >
              Create account
            </Link>
            <p className="text-center text-micro leading-4 text-ink-subtle">
              Works without an account
            </p>
          </>
        }
        collapsedFooter={
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/login"
              aria-label="Sign in"
              title="Sign in"
              className="grid h-11 w-11 place-items-center rounded-xl text-ink-muted transition hover:bg-muted hover:text-accent-strong"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={signInHref}
              aria-label="Create account"
              title="Create account"
              className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent-strong transition hover:bg-accent/15"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        }
      />

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
        aria-label="Main"
      >
        <div className="safe-bottom mx-auto grid w-full max-w-[640px] grid-cols-6">
          {ITEMS.map((item) => {
            const isActive = item.id === active;
            const Icon = item.Icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-micro leading-3",
                  isActive
                    ? "font-semibold text-accent"
                    : "font-medium text-ink-muted",
                )}
              >
                <Icon active={isActive} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
