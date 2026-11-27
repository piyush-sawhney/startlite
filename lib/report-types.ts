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

/** A customer group you can filter the list to by tapping a summary card. */
export type CustomerSegment = "all" | "dues" | "paid" | "active";

export type CustomersFilters = {
  query: string;
  segment: CustomerSegment;
  sort: ReportSort;
};

export type CustomerReportRow = {
  id: string;
  name: string;
  /** Display string only. Raw digits never leave the adapter. */
  phoneMasked?: string;
  subLabel?: string;
  /** From the customer's stored address, when one exists. */
  locality?: string;
  pincode?: string;
  /** Every order, including closed ones. */
  orderCount: number;
  completedCount: number;
  cancelledCount: number;
  /** Orders that are neither completed nor cancelled. */
  openCount: number;
  lastPaidDate: string | null;
  createdDate: string;
  /** Lifetime totals; pending is open orders only. */
  totalBilled: string;
  totalPaid: string;
  pending: string;
  hasDues: boolean;
  /** False for a buyer found in orders with no customer record. */
  linked: boolean;
};

export type CustomerSegmentData = {
  key: CustomerSegment;
  count: number;
  /** Secondary line on the card, for example the amount involved. */
  detail: string;
};

export type CustomersReportData = {
  /** Counts for every segment, independent of the active filter. */
  segments: CustomerSegmentData[];
  totalCount: number;
  pendingTotal: string;
  rows: CustomerReportRow[];
};
