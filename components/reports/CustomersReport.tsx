"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import { Card, EmptyState, primaryButton } from "@/components/ui";
import type {
  CustomerReportRow,
  CustomersFilters,
  CustomersReportData,
  ReportDirection,
} from "@/lib/report-types";
import { AddCustomerButton } from "@/components/AddCustomerButton";
import { CustomerFilterCards } from "./CustomerCards";
import { ReportShell } from "./ReportShell";

type ColumnKey = "name" | "phone" | "locality" | "billed" | "paid" | "due" | "orders";
type Column = {
  key: ColumnKey;
  label: string;
  numeric?: boolean;
  width: string;
};

const COLUMNS: Column[] = [
  { key: "name", label: "Name", width: "24%" },
  { key: "phone", label: "Phone", width: "15%" },
  { key: "locality", label: "Landmark", width: "17%" },
  { key: "billed", label: "Billed", width: "12%", numeric: true },
  { key: "paid", label: "Paid", width: "12%", numeric: true },
  { key: "due", label: "Due", width: "12%", numeric: true },
  { key: "orders", label: "Orders", width: "8%", numeric: true },
];

const FILTER_HINTS: Partial<Record<ColumnKey, string>> = {
  name: "Search name or label",
  phone: "Search phone",
  locality: "Search landmark",
};

const CELL =
  "border-b border-line/70 bg-surface px-3 py-3 align-middle transition-colors group-hover:bg-muted/50";

function initialSort(sort: CustomersFilters["sort"]): ColumnKey {
  switch (sort) {
    case "name":
    case "phone":
    case "locality":
    case "billed":
    case "paid":
    case "due":
    case "orders":
      return sort;
    default:
      return "due";
  }
}

function cellValue(row: CustomerReportRow, key: ColumnKey): string | number {
  switch (key) {
    case "name":
      return row.name;
    case "phone":
      return row.phoneMasked ?? "";
    case "locality":
      return [row.locality, row.pincode].filter(Boolean).join(" · ");
    case "billed":
      return row.totalBilledValue;
    case "paid":
      return row.totalPaidValue;
    case "due":
      return row.dueValue;
    case "orders":
      return row.orderCount;
  }
}

/** The Name column shows the label on a second line, so both are searchable. */
function filterValue(row: CustomerReportRow, key: ColumnKey): string {
  if (key === "name") {
    return `${cellValue(row, "name")} ${row.subLabel ?? ""}`.toLowerCase();
  }
  return String(cellValue(row, key)).toLowerCase();
}

function displayValue(row: CustomerReportRow, key: ColumnKey): string {
  switch (key) {
    case "name":
      return row.name;
    case "phone":
      return row.phoneMasked ?? "No phone";
    case "locality":
      return [row.locality, row.pincode].filter(Boolean).join(" · ") || "—";
    case "billed":
      return row.totalBilled;
    case "paid":
      return row.totalPaid;
    case "due":
      return row.hasDues ? row.pending : "—";
    case "orders":
      return String(row.orderCount);
  }
}

export function CustomersReport({
  data,
  filters,
}: {
  data: CustomersReportData;
  filters: CustomersFilters;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.query);
  const [sort, setSort] = useState<ColumnKey>(() => initialSort(filters.sort));
  const [dir, setDir] = useState<ReportDirection>(filters.dir);
  const [columnFilters, setColumnFilters] = useState<Partial<Record<ColumnKey, string>>>(
    {},
  );
  const firstSearch = useRef(true);

  // Live search: keep the query in the URL so a view can be refreshed or shared.
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
      router.replace(next ? `/customers?${next}` : "/customers", { scroll: false });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, router]);

  function toggleSort(key: ColumnKey) {
    if (key === sort) {
      setDir(dir === "asc" ? "desc" : "asc");
      return;
    }
    const numeric = COLUMNS.find((column) => column.key === key)?.numeric;
    setSort(key);
    setDir(numeric ? "desc" : "asc");
  }

  function clearAll() {
    setColumnFilters({});
    setSearch("");
    router.push("/customers");
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
      if (comparison === 0) return left.name.localeCompare(right.name);
      return dir === "asc" ? comparison : -comparison;
    });
  }, [data.rows, columnFilters, sort, dir]);

  const hasColumnFilters = Object.values(columnFilters).some((value) => value?.trim());
  const hasRows = data.rows.length > 0;

  return (
    <ReportShell
      title="Customers"
      action={<AddCustomerButton />}
      tiles={[]}
      summary={<CustomerFilterCards segments={data.segments} filters={filters} />}
      filters={
        <div className="flex flex-wrap items-center gap-2">
          <form
            className="min-w-[12rem] flex-1"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="people-search" className="sr-only">
              Search name, label, mobile or email
            </label>
            <input
              id="people-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, label, mobile or email"
              className="block min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-small text-ink placeholder:text-ink-subtle focus:border-accent/50 focus:outline-none"
            />
          </form>
        </div>
      }
    >
      {!hasRows ? (
        <EmptyState
          title="Nothing here yet."
          body="Add a sale and people show up here."
          action={
            <Link href="/app/sales/new" className={primaryButton()}>
              Add sale
            </Link>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No matches."
          body="Clear the filters to see everyone."
          action={
            <button type="button" onClick={clearAll} className={primaryButton()}>
              Clear filters
            </button>
          }
        />
      ) : (
        <Card className="p-0">
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

          <div className="max-h-[68vh] overflow-auto rounded-b-2xl">
            <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0 text-left">
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
                          } ${
                            active ? "text-accent-strong" : "text-ink-subtle"
                          }`}
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
                        <label htmlFor={`filter-${column.key}`} className="sr-only">
                          Filter by {column.label}
                        </label>
                        <div className="relative">
                          <Search
                            className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle"
                            aria-hidden="true"
                          />
                          <input
                            id={`filter-${column.key}`}
                            type="text"
                            inputMode="search"
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
                {visible.map((row) => {
                  const label = `${row.name}, ${row.phoneMasked ?? "no phone"}, ${row.pending} due`;
                  const nameCell = (
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-soft text-caption font-bold text-accent-strong"
                      >
                        {row.name.charAt(0).toUpperCase()}
                      </span>
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
                    </span>
                  );

                  return (
                    <tr
                      key={row.id}
                      className="group"
                      onClick={
                        row.linked
                          ? () => router.push(`/customers/${row.id}`)
                          : undefined
                      }
                    >
                      {COLUMNS.map((column, index) => {
                        const numeric = Boolean(column.numeric);
                        return (
                          <td
                            key={column.key}
                            className={`${CELL} ${
                              index === 0
                                ? "sticky left-0 z-10"
                                : "border-l border-line/60"
                            } ${numeric ? "figure text-right" : ""} ${
                              row.linked && index === 0 ? "cursor-pointer" : ""
                            }`}
                          >
                            {column.key === "name" ? (
                              row.linked ? (
                                <Link
                                  href={`/customers/${row.id}`}
                                  aria-label={label}
                                  onClick={(event) => event.stopPropagation()}
                                  className="block min-w-0"
                                >
                                  {nameCell}
                                </Link>
                              ) : (
                                <span className="block min-w-0">{nameCell}</span>
                              )
                            ) : (
                              <span
                                className={`block truncate text-small ${
                                  column.key === "phone" ? "tnum" : ""
                                } ${
                                  numeric
                                    ? "whitespace-nowrap " +
                                      (column.key === "due" && row.hasDues
                                        ? "font-bold text-warning"
                                        : "text-ink")
                                    : "text-ink-muted"
                                }`}
                              >
                                {displayValue(row, column.key)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </ReportShell>
  );
}
