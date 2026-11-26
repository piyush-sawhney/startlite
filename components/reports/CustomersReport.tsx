"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, EmptyState, primaryButton } from "@/components/ui";
import { ListHeader } from "@/components/home/ListHeader";
import type {
  CustomersFilters,
  CustomersReportData,
  ReportSort,
} from "@/lib/report-types";
import { ChevronDown } from "lucide-react";
import { ReportShell } from "./ReportShell";

const SORT_LABELS: Record<ReportSort, string> = {
  pending: "Pending",
  name: "Name",
  recent: "Recently added",
};

const GRID =
  "grid grid-cols-1 gap-x-4 gap-y-1 px-3 py-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_72px_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] lg:items-center";

export function CustomersReport({
  data,
  filters,
}: {
  data: CustomersReportData;
  filters: CustomersFilters;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.query);
  const [collapsed, setCollapsed] = useState(false);
  const [showSort, setShowSort] = useState(false);

  function update(next: Partial<CustomersFilters>) {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams();
    if (merged.query.trim()) params.set("q", merged.query.trim());
    if (merged.withDues) params.set("dues", "1");
    if (merged.sort !== "pending") params.set("sort", merged.sort);
    const query = params.toString();
    router.push(query ? `/customers?${query}` : "/customers");
  }

  const subtitle = `${data.totalCount} ${data.totalCount === 1 ? "person" : "people"} · All`;
  const hasRows = data.rows.length > 0;

  return (
    <ReportShell
      title="Customers"
      subtitle={subtitle}
      tiles={data.tiles}
      filters={
        <div className="flex flex-wrap items-center gap-2">
          <form
            className="min-w-[12rem] flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              update({ query: search });
            }}
          >
            <label htmlFor="customer-search" className="sr-only">
              Search name or phone
            </label>
            <input
              id="customer-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or phone"
              className="block min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-small text-ink placeholder:text-ink-subtle focus:border-accent/50 focus:outline-none"
            />
          </form>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-pressed={!filters.withDues}
              onClick={() => update({ withDues: false })}
              className={`min-h-11 rounded-xl px-3 text-caption font-bold transition ${
                !filters.withDues
                  ? "bg-accent-soft text-accent-strong"
                  : "text-ink-muted hover:bg-muted"
              }`}
            >
              All
            </button>
            <button
              type="button"
              aria-pressed={filters.withDues}
              onClick={() => update({ withDues: true })}
              className={`min-h-11 rounded-xl px-3 text-caption font-bold transition ${
                filters.withDues
                  ? "bg-accent-soft text-accent-strong"
                  : "text-ink-muted hover:bg-muted"
              }`}
            >
              With dues
            </button>
          </div>
        </div>
      }
    >
      {!hasRows ? (
        <EmptyState
          title={
            data.totalCount === 0
              ? "No customers yet."
              : "No customers for this filter."
          }
          action={
            data.totalCount === 0 ? (
              <Link href="/app/sales/new" className={primaryButton()}>
                Add sale
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  router.push("/customers");
                }}
                className={primaryButton()}
              >
                Clear filters
              </button>
            )
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <ListHeader
            title="Customers"
            count={data.totalCount}
            totalLabel="Pending"
            controlsId="customers-report-list"
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSort(!showSort)}
                aria-expanded={showSort}
                aria-label={`Sort customers: ${SORT_LABELS[filters.sort]}`}
                className="relative inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-caption font-bold text-ink transition after:absolute after:-inset-1 after:content-[''] hover:bg-muted"
              >
                {SORT_LABELS[filters.sort]}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              {showSort ? (
                <div className="absolute right-0 top-12 z-20 w-40 overflow-hidden rounded-xl border border-line bg-surface shadow-lg">
                  {(Object.keys(SORT_LABELS) as ReportSort[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setShowSort(false);
                        update({ sort: key });
                      }}
                      className={`block w-full px-3 py-2 text-left text-small transition hover:bg-muted ${
                        key === filters.sort ? "font-bold text-ink" : "text-ink"
                      }`}
                    >
                      {SORT_LABELS[key]}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </ListHeader>

          {collapsed ? null : (
            <div id="customers-report-list">
              <div
                aria-hidden="true"
                className={`${GRID} hidden border-b border-line py-2 lg:grid`}
              >
                <span className="eyebrow text-ink-subtle">Customer</span>
                <span className="eyebrow text-ink-subtle">Phone</span>
                <span className="eyebrow text-ink-subtle">Orders</span>
                <span className="eyebrow text-ink-subtle">Billed</span>
                <span className="eyebrow text-ink-subtle">Last paid</span>
                <span className="eyebrow text-right text-ink-subtle">Pending</span>
              </div>
              <div className="divide-y divide-line">
                {data.rows.map((row) => {
                  const content = (
                    <>
                      <span className="min-w-0">
                        <span className="block truncate text-small font-bold text-ink">
                          {row.name}
                        </span>
                        {row.subLabel ? (
                          <span className="block truncate text-caption text-ink-muted">
                            {row.subLabel}
                          </span>
                        ) : null}
                      </span>
                      <span className="truncate text-caption text-ink-muted">
                        {row.phone ?? "No phone"}
                      </span>
                      <span className="text-caption text-ink-muted">
                        {row.orderCount} {row.orderCount === 1 ? "order" : "orders"}
                      </span>
                      <span className="figure text-small text-ink">
                        {row.totalBilled}
                      </span>
                      <span className="text-caption text-ink-muted">
                        {row.lastPaidDate ?? "—"}
                      </span>
                      <span className="text-left lg:text-right">
                        <span
                          className={`figure block text-small font-bold ${row.hasDues ? "text-warning" : "text-ink-muted"}`}
                        >
                          {row.pending}
                        </span>
                        <span
                          className={`mt-0.5 block text-caption font-semibold lg:hidden ${row.hasDues ? "text-warning" : "text-ink-subtle"}`}
                        >
                          {row.hasDues ? "Pending" : "No dues"}
                        </span>
                      </span>
                    </>
                  );

                  const className = `${GRID} transition hover:bg-muted/60`;
                  return row.linked ? (
                    <Link
                      key={row.id}
                      href={`/customers/${row.id}`}
                      aria-label={`${row.name}, ${row.pending} pending`}
                      className={className}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div
                      key={row.id}
                      role="group"
                      aria-label={`${row.name}, ${row.pending} pending`}
                      className={className}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      )}
    </ReportShell>
  );
}
