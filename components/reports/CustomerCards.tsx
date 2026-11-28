"use client";

import Link from "next/link";
import {
  AlertCircle,
  Package,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type {
  CustomerSegment,
  CustomerSegmentData,
  CustomersFilters,
} from "@/lib/report-types";

const SEGMENT_META: Record<
  CustomerSegment,
  { label: string; icon: LucideIcon; tone: string }
> = {
  all: {
    label: "All",
    icon: Users,
    tone: "bg-accent-soft text-accent-strong",
  },
  dues: {
    label: "With dues",
    icon: AlertCircle,
    tone: "bg-warning-soft text-warning",
  },
  paid: {
    label: "Has paid",
    icon: Wallet,
    tone: "bg-success-soft text-success",
  },
  active: {
    label: "Active orders",
    icon: Package,
    tone: "bg-info-soft text-info",
  },
};

function segmentHref(segment: CustomerSegment, filters: CustomersFilters): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (segment !== "all") params.set("segment", segment);
  if (filters.sort !== "due" || filters.dir !== "desc") {
    params.set("sort", filters.sort);
    params.set("dir", filters.dir);
  }
  const query = params.toString();
  return query ? `/customers?${query}` : "/customers";
}

type CardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: string;
  active?: boolean;
  href?: string;
};

function Card({ label, value, detail, icon: Icon, tone, active, href }: CardProps) {
  const body = (
    <>
      <span className="flex items-start justify-between gap-2">
        <span className="text-caption font-semibold text-ink-muted">{label}</span>
        <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg", tone)}>
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </span>
      <span className="tnum mt-2 block text-2xl font-semibold leading-7 text-ink">
        {value}
      </span>
      <span className="mt-0.5 block truncate text-caption text-ink-subtle">
        {detail}
      </span>
      {active ? (
        <span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-accent" />
      ) : null}
    </>
  );

  const className = cn(
    "relative block min-h-28 rounded-2xl border p-3.5 text-left transition",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
    active
      ? "border-accent bg-accent-soft shadow-[0_2px_8px_rgb(20_18_15/0.06)]"
      : "border-line bg-surface hover:border-accent/40 hover:bg-muted/40",
  );

  if (href) {
    return (
      <Link href={href} aria-current={active ? "page" : undefined} className={className}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}

/** Four filter cards replace the old metric strip and the duplicate dues pill. */
export function CustomerFilterCards({
  segments,
  filters,
}: {
  segments: CustomerSegmentData[];
  filters: CustomersFilters;
}) {
  return (
    <section
      aria-label="Filter people"
      className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4"
    >
      {segments.map((segment) => {
        const meta = SEGMENT_META[segment.key];
        return (
          <Card
            key={segment.key}
            label={meta.label}
            value={String(segment.count)}
            detail={segment.detail}
            icon={meta.icon}
            tone={meta.tone}
            active={filters.segment === segment.key}
            href={segmentHref(segment.key, filters)}
          />
        );
      })}
    </section>
  );
}
