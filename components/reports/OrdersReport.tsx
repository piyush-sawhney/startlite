"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import { formatDateDMY } from "@/lib/date";
import { PAYMENT_LABELS } from "@/lib/payment-status";
import { STATUS_LABELS } from "@/lib/order-status";
import {
  Card,
  EmptyState,
  PaymentPill,
  StatusPill,
  primaryButton,
} from "@/components/ui";
import type {
  OrderPeriod,
  OrderReportRow,
  OrdersFilters,
  OrdersReportData,
  OrderSegment,
  ReportDirection,
} from "@/lib/report-types";

type ColumnKey =
  | "code"
  | "customer"
  | "needed"
  | "placed"
  | "status"
  | "payment"
  | "items"
  | "total"
  | "paid"
  | "due";
type Column = {
  key: ColumnKey;
  label: string;
  width: string;
  numeric?: boolean;
};

// Widths follow typical value length: names and status words get room,
// counts and pincode-like figures stay narrow.
const COLUMNS: Column[] = [
  { key: "code", label: "Order", width: "10%" },
  { key: "customer", label: "Customer", width: "18%" },
  { key: "needed", label: "Needed", width: "11%" },
  { key: "placed", label: "Placed", width: "11%" },
  { key: "status", label: "Status", width: "16%" },
  { key: "payment", label: "Payment", width: "11%" },
  { key: "items", label: "Items", width: "6%", numeric: true },
  { key: "total", label: "Total", width: "9%", numeric: true },
  { key: "paid", label: "Paid", width: "9%", numeric: true },
  { key: "due", label: "Due", width: "9%", numeric: true },
];

const PERIOD_LABELS: Record<OrderPeriod, string> = {
  today: "Today",
  month: "This month",
  all: "All",
};
const SEGMENT_LABELS: Record<OrderSegment, string> = {
  all: "All",
  to_finish: "To finish",
  payment_due: "Payment due",
  paid: "Paid",
  cancelled: "Cancelled",
};
const FILTER_HINTS: Partial<Record<ColumnKey, string>> = {
  code: "Search code",
  customer: "Search name or mobile",
  needed: "Search date",
  placed: "Search date",
  status: "Search status",
  payment: "Search payment",
};

const CELL =
  "border-b border-line/70 bg-surface px-3 py-2.5 align-middle transition-colors group-hover:bg-muted/50";

function statusLabel(status: string): string {
  return STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status;
}

function cellValue(row: OrderReportRow, key: ColumnKey): string | number {
  switch (key) {
    case "code":
      return row.code;
    case "customer":
      return row.customerName;
    case "needed":
      return row.neededBy;
    case "placed":
      return row.placed;
    case "status":
      return statusLabel(row.status);
    case "payment":
      return { due: 0, partial: 1, paid: 2 }[row.payment];
    case "items":
      return row.itemCount;
    case "total":
      return row.totalValue;
    case "paid":
      return row.paidValue;
    case "due":
      return row.dueValue;
  }
}

function filterValue(row: OrderReportRow, key: ColumnKey): string {
  switch (key) {
    case "code":
      return row.code.toLowerCase();
    case "customer":
      return `${row.customerName} ${row.phoneMasked ?? ""}`.toLowerCase();
    case "needed":
      return `${row.neededBy} ${formatDateDMY(row.neededBy)}`.toLowerCase();
    case "placed":
      return `${row.placed} ${formatDateDMY(row.placed)}`.toLowerCase();
    case "status":
      return statusLabel(row.status).toLowerCase();
    case "payment":
      return `${PAYMENT_LABELS[row.payment]} ${row.payment}`.toLowerCase();
    default:
      return String(cellValue(row, key)).toLowerCase();
  }
}

export function OrdersReport({
  data,
  filters,
}: {
  data: OrdersReportData;
  filters: OrdersFilters;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.query);
  const [sort, setSort] = useState<ColumnKey>(
    filters.sort === "needed" ||
      filters.sort === "code" ||
      filters.sort === "customer" ||
      filters.sort === "status" ||
      filters.sort === "payment" ||
      filters.sort === "items" ||
      filters.sort === "total" ||
      filters.sort === "paid" ||
      filters.sort === "due"
      ? filters.sort
      : "placed",
  );
  const [dir, setDir] = useState<ReportDirection>(filters.dir);
  const [columnFilters, setColumnFilters] = useState<Partial<Record<ColumnKey, string>>>(
    {},
  );
  const firstSearch = useRef(true);

  useEffect(() => {
    if (firstSearch.current) {
      firstSearch.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const query = search.trim();
      if (query) params.set("q", query);
      else params.delete("q");
      const next = params.toString();
      router.replace(next ? `/app/sales?${next}` : "/app/sales", { scroll: false });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, router]);

  function hrefFor(next: Partial<OrdersFilters>) {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams();
    if (merged.query.trim()) params.set("q", merged.query.trim());
    if (merged.period !== "all") params.set("period", merged.period);
    if (merged.segment !== "all") params.set("segment", merged.segment);
    if (merged.sort !== "newest" || merged.dir !== "desc") {
      params.set("sort", merged.sort);
      params.set("dir", merged.dir);
    }
    const query = params.toString();
    return query ? `/app/sales?${query}` : "/app/sales";
  }

  function toggleSort(key: ColumnKey) {
    if (key === sort) {
      setDir(dir === "asc" ? "desc" : "asc");
      return;
    }
    setSort(key);
    setDir(
      COLUMNS.find((column) => column.key === key)?.numeric ? "desc" : "asc",
    );
  }

  function clearAll() {
    setColumnFilters({});
    setSearch("");
    router.push("/app/sales");
  }

  const visible = useMemo(() => {
    const matched = data.rows.filter((row) =>
      COLUMNS.every((column) => {
        if (column.numeric) return true;
        const raw = columnFilters[column.key]?.trim();
        return !raw || filterValue(row, column.key).includes(raw.toLowerCase());
      }),
    );

    return [...matched].sort((left, right) => {
      const a = cellValue(left, sort);
      const b = cellValue(right, sort);
      const comparison =
        typeof a === "number" && typeof b === "number"
          ? a - b
          : String(a).localeCompare(String(b));
      if (comparison === 0) {
        return right.placed.localeCompare(left.placed);
      }
      return dir === "asc" ? comparison : -comparison;
    });
  }, [data.rows, columnFilters, sort, dir]);

  const hasColumnFilters = Object.values(columnFilters).some((value) => value?.trim());
  const hasRows = data.rows.length > 0;
  const stats = [
    {
      label: "Orders",
      value: String(data.totals.orders),
      parts: [
        { label: `${data.counts.to_finish} to finish`, tone: "text-info" },
        { label: `${data.counts.payment_due} due`, tone: "text-warning" },
      ],
    },
    { label: "To finish", value: String(data.totals.toFinish) },
    { label: "Due", value: data.totals.due, tone: "text-warning" },
    { label: "Received", value: data.totals.received, tone: "text-success" },
  ];
  const chip =
    "inline-flex min-h-9 items-center rounded-full px-3 text-caption font-semibold transition";

  return (
    <>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow text-ink-subtle">Report</p>
          <h1 className="text-[26px] font-semibold leading-8 tracking-tight lg:text-[32px] lg:leading-10">
            Orders
          </h1>
          <p className="mt-1 text-sm text-ink-muted lg:text-[15px]">
            {data.totals.orders} orders · {PERIOD_LABELS[filters.period]}
          </p>
        </div>
        <Link href="/app/sales/new" className={primaryButton("px-3")}>
          Add sale
        </Link>
      </header>

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
              <p className="mt-0.5 flex max-w-[240px] flex-wrap gap-x-1.5 text-caption">
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

      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <form className="min-w-[12rem] flex-1 lg:max-w-sm" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="orders-search" className="sr-only">
            Search name, mobile or order code
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
              aria-hidden="true"
            />
            <input
              id="orders-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, mobile or order code"
              className="block min-h-11 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-small text-ink placeholder:text-ink-subtle focus:border-accent/50 focus:outline-none"
            />
          </div>
        </form>
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(PERIOD_LABELS) as OrderPeriod[]).map((period) => (
            <Link
              key={period}
              href={hrefFor({ period })}
              aria-current={filters.period === period ? "page" : undefined}
              className={`${chip} ${
                filters.period === period
                  ? "bg-accent text-white"
                  : "border border-line bg-surface text-ink-muted hover:bg-muted"
              }`}
            >
              {PERIOD_LABELS[period]}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
          {(Object.keys(SEGMENT_LABELS) as OrderSegment[]).map((segment) => (
            <Link
              key={segment}
              href={hrefFor({ segment })}
              aria-current={filters.segment === segment ? "page" : undefined}
              className={`${chip} ${
                filters.segment === segment
                  ? "bg-accent text-white"
                  : "border border-line bg-surface text-ink-muted hover:bg-muted"
              }`}
            >
              {SEGMENT_LABELS[segment]}
            </Link>
          ))}
        </div>
      </div>

      {!hasRows ? (
        <EmptyState
          title="No orders."
          body="Add a sale and it appears here."
          action={
            <Link href="/app/sales/new" className={primaryButton()}>
              Add sale
            </Link>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No orders for this filter."
          body="Clear the filters to see every order."
          action={
            <button type="button" onClick={clearAll} className={primaryButton()}>
              Clear filters
            </button>
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          {hasColumnFilters ? (
            <div className="flex justify-end border-b border-line px-3 py-1">
              <button
                type="button"
                onClick={() => setColumnFilters({})}
                className="min-h-9 rounded-lg px-2 text-caption font-bold text-accent-strong hover:bg-muted"
              >
                Clear filters
              </button>
            </div>
          ) : null}

          <div className="max-h-[70vh] overflow-auto rounded-b-2xl">
            <table className="w-full min-w-[1240px] table-fixed border-separate border-spacing-0 text-left">
              <colgroup>
                {COLUMNS.map((column) => (
                  <col key={column.key} style={{ width: column.width }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {COLUMNS.map((column, index) => {
                    const active = sort === column.key;
                    return (
                      <th
                        key={column.key}
                        scope="col"
                        aria-sort={
                          active
                            ? dir === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                        className={`sticky top-0 z-30 h-12 border-b border-line bg-muted/70 px-3 ${
                          index === 0 ? "sticky left-0 z-40" : "border-l border-line/60"
                        } ${column.numeric ? "text-right" : "text-left"}`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(column.key)}
                          className={`inline-flex h-11 w-full items-center gap-1.5 whitespace-nowrap eyebrow transition hover:text-accent-strong ${
                            column.numeric ? "justify-end" : "justify-start"
                          } ${active ? "text-accent-strong" : "text-ink-subtle"}`}
                        >
                          <span>{column.label}</span>
                          {active ? (
                            dir === "asc" ? (
                              <ArrowUp className="h-3 w-3" aria-hidden="true" />
                            ) : (
                              <ArrowDown className="h-3 w-3" aria-hidden="true" />
                            )
                          ) : (
                            <ArrowUpDown
                              className="h-3 w-3 opacity-40"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </th>
                    );
                  })}
                </tr>
                <tr>
                  {COLUMNS.map((column, index) => {
                    if (column.numeric) {
                      return (
                        <th
                          key={column.key}
                          scope="col"
                          className={`sticky top-12 z-20 h-12 border-b border-line bg-surface ${
                            index === 0 ? "sticky left-0 z-30" : "border-l border-line/60"
                          }`}
                        />
                      );
                    }
                    const term = columnFilters[column.key] ?? "";
                    return (
                      <th
                        key={column.key}
                        scope="col"
                        className={`sticky top-12 z-20 h-12 border-b border-line bg-surface px-2 ${
                          index === 0 ? "sticky left-0 z-30" : "border-l border-line/60"
                        }`}
                      >
                        <label htmlFor={`order-filter-${column.key}`} className="sr-only">
                          Filter by {column.label}
                        </label>
                        <div className="relative">
                          <Search
                            className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle"
                            aria-hidden="true"
                          />
                          <input
                            id={`order-filter-${column.key}`}
                            type="text"
                            value={term}
                            onChange={(event) =>
                              setColumnFilters((current) => ({
                                ...current,
                                [column.key]: event.target.value,
                              }))
                            }
                            placeholder={FILTER_HINTS[column.key]}
                            className={`block h-9 w-full rounded-lg border border-line bg-surface pl-7 text-caption text-ink placeholder:text-ink-subtle focus:border-accent/50 focus:outline-none ${
                              term ? "pr-8" : "pr-2"
                            }`}
                          />
                          {term ? (
                            <button
                              type="button"
                              onClick={() =>
                                setColumnFilters((current) => ({
                                  ...current,
                                  [column.key]: "",
                                }))
                              }
                              aria-label={`Clear ${column.label} filter`}
                              className="absolute right-1 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-ink-subtle transition hover:bg-muted hover:text-ink"
                            >
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          ) : null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr
                    key={row.id}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/app/sales/${row.id}`)}
                  >
                    {COLUMNS.map((column, index) => {
                      const numeric = Boolean(column.numeric);
                      return (
                        <td
                          key={column.key}
                          className={`${CELL} ${
                            index === 0 ? "sticky left-0 z-10" : "border-l border-line/60"
                          } ${numeric ? "figure text-right" : "max-w-[240px]"}`}
                        >
                          {column.key === "code" ? (
                            <Link
                              href={`/app/sales/${row.id}`}
                              aria-label={`Order ${row.code}, ${row.customerName}, ${row.pending} due`}
                              onClick={(event) => event.stopPropagation()}
                              className="block min-w-0"
                            >
                              <span className="block truncate text-small font-bold text-ink">
                                #{row.code}
                              </span>
                              {row.fromStore ? (
                                <span className="block truncate text-caption text-ink-subtle">
                                  From store
                                </span>
                              ) : null}
                            </Link>
                          ) : column.key === "customer" ? (
                            <span className="block min-w-0">
                              <span className="block truncate text-small font-semibold text-ink">
                                {row.customerName}
                              </span>
                              <span className="tnum block truncate text-caption text-ink-muted">
                                {row.phoneMasked ?? "No phone"}
                              </span>
                            </span>
                          ) : column.key === "status" ? (
                            <span className="block min-w-0">
                              <StatusPill status={row.status} />
                            </span>
                          ) : column.key === "payment" ? (
                            <span className="block min-w-0">
                              <PaymentPill status={row.payment} />
                            </span>
                          ) : (
                            <span
                              className={`block truncate text-small ${
                                numeric
                                  ? "whitespace-nowrap " +
                                    (column.key === "due" && row.dueValue > 0
                                      ? "font-bold text-warning"
                                      : "text-ink")
                                  : "text-ink-muted"
                              }`}
                            >
                              {column.key === "needed" || column.key === "placed"
                                ? formatDateDMY(String(cellValue(row, column.key)))
                                : numeric
                                  ? column.key === "total"
                                    ? row.totalBilled
                                    : column.key === "paid"
                                      ? row.totalPaid
                                      : row.dueValue > 0
                                        ? row.pending
                                        : "—"
                                  : String(cellValue(row, column.key))}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.totalCount > data.rows.length ? (
            <p className="border-t border-line px-3 py-2 text-caption text-ink-subtle">
              Showing {data.rows.length} of {data.totalCount} orders
            </p>
          ) : null}
        </Card>
      )}
    </>
  );
}
