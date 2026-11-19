"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import {
  CatalogIcon,
  CustomersIcon,
  HomeIcon,
  MoreIcon,
  NavRail,
  SalesIcon,
} from "@/components/BottomTabs";
import { cn } from "@/lib/cn";
import type { GuestTab } from "./types";

const ITEMS: Array<{
  id: GuestTab;
  label: string;
  Icon: (props: { active: boolean }) => ReactElement;
}> = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "sales", label: "Sales", Icon: SalesIcon },
  { id: "customers", label: "Customers", Icon: CustomersIcon },
  { id: "catalog", label: "Menu", Icon: CatalogIcon },
  { id: "more", label: "More", Icon: MoreIcon },
];

export function GuestNav({
  active,
  noun,
  shopName,
  signInHref,
  onSelect,
}: {
  active: GuestTab;
  noun: string;
  shopName: string;
  signInHref: string;
  onSelect: (tab: GuestTab) => void;
}) {
  const labelFor = (item: (typeof ITEMS)[number]) =>
    item.id === "catalog" ? noun : item.label;

  return (
    <>
      <NavRail
        brand={shopName}
        brandSub="Saved on this phone"
        items={ITEMS.map((item) => ({
          key: item.id,
          label: labelFor(item),
          Icon: item.Icon,
          active: item.id === active,
          onClick: () => onSelect(item.id),
        }))}
        footer={
          <>
            <Link
              href={signInHref}
              className="flex min-h-10 items-center justify-center rounded-xl bg-accent text-[13px] font-semibold text-white transition hover:bg-accent-strong"
            >
              Save my shop
            </Link>
            <p className="text-center text-[11px] leading-4 text-ink-subtle">
              Works without an account
            </p>
          </>
        }
      />

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
        aria-label="Main"
      >
        <div className="safe-bottom mx-auto grid w-full max-w-[640px] grid-cols-5">
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
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] leading-4",
                  isActive
                    ? "font-semibold text-accent"
                    : "font-medium text-ink-muted",
                )}
              >
                <Icon active={isActive} />
                <span>{labelFor(item)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
