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

/** Every column in the People table is sortable. `recent` is kept for old links. */
export type ReportSort =
  | "name"
  | "label"
  | "phone"
  | "locality"
  | "billed"
  | "paid"
  | "due"
  | "orders"
  | "recent";

export type ReportDirection = "asc" | "desc";

export type OrderPeriod = "today" | "month" | "all";
export type OrderSegment =
  | "all"
  | "to_finish"
  | "payment_due"
  | "paid"
  | "cancelled";
export type OrderSort =
  | "newest"
  | "needed"
  | "placed"
  | "code"
  | "customer"
  | "status"
  | "payment"
  | "items"
  | "total"
  | "paid"
  | "due";

export type OrdersFilters = {
  query: string;
  period: OrderPeriod;
  segment: OrderSegment;
  sort: OrderSort;
  dir: ReportDirection;
};

export type OrderReportRow = {
  id: string;
  code: string;
  customerName: string;
  phoneMasked?: string;
  neededBy: string;
  placed: string;
  status: string;
  payment: "paid" | "partial" | "due";
  itemCount: number;
  totalBilled: string;
  totalPaid: string;
  pending: string;
  totalValue: number;
  paidValue: number;
  dueValue: number;
  fromStore: boolean;
};

export type OrdersReportData = {
  rows: OrderReportRow[];
  /** Count before the 100-row cap. */
  totalCount: number;
  totals: {
    orders: number;
    toFinish: number;
    due: string;
    received: string;
  };
  /** Counts for every segment, independent of the active segment. */
  counts: Record<OrderSegment, number>;
};

/** A group you can filter the list to by tapping a summary card. */
export type CustomerSegment = "all" | "dues" | "paid" | "active";

export type CustomersFilters = {
  query: string;
  segment: CustomerSegment;
  sort: ReportSort;
  dir: ReportDirection;
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
  /** Rupee numbers behind the formatted figures, for sorting and column filters. */
  totalBilledValue: number;
  totalPaidValue: number;
  dueValue: number;
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
