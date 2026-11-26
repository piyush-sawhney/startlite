/**
 * Shapes shared by the report pages and their guest and owner adapters.
 * One page component renders both sources. See ADR-040.
 */

export type ReportTone = "plain" | "warning" | "success" | "info";

export type ReportTile = {
  label: string;
  value: string;
  period: string;
  tone?: ReportTone;
  hint?: string;
};

export type ReportSort = "pending" | "name" | "recent";

export type CustomersFilters = {
  query: string;
  withDues: boolean;
  sort: ReportSort;
};

export type CustomerReportRow = {
  id: string;
  name: string;
  phone?: string;
  subLabel?: string;
  orderCount: number;
  lastPaidDate: string | null;
  createdDate: string;
  totalBilled: string;
  paid: string;
  pending: string;
  hasDues: boolean;
  /** False for a buyer found in orders with no customer record. */
  linked: boolean;
};

export type CustomersReportData = {
  tiles: ReportTile[];
  totalCount: number;
  withDuesCount: number;
  pendingTotal: string;
  rows: CustomerReportRow[];
};
