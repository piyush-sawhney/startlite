import { dec, type MoneyInput } from "./money";
import { isCancelled, isClosed, isCompleted } from "./order-status";

/**
 * One order shape for the customer report and customer detail. Amounts are
 * decimal strings from the database; see ADR-040 for the shared report rule.
 */
export type CustomerSummaryOrder = {
  status: string;
  grandTotal: MoneyInput;
  paidTotal: MoneyInput;
  tdsTotal: MoneyInput;
};

export type CustomerSummary = {
  /** Every order, including closed ones. */
  orderCount: number;
  completedCount: number;
  /** Cancelled and declined both mean the order will not happen. */
  cancelledCount: number;
  /** Everything that is not completed, declined, or cancelled. */
  openCount: number;
  /** Lifetime billed amount, including closed orders. */
  totalBilled: ReturnType<typeof dec>;
  /** Lifetime collected amount, including closed orders. */
  totalPaid: ReturnType<typeof dec>;
  /** Positive balance on open orders only. Closed orders never carry dues. */
  pending: ReturnType<typeof dec>;
};

/**
 * The single aggregation used by /customers and /customers/{id}. Counts and
 * lifetime money cover all orders; dues stay on open orders only.
 */
export function summarizeCustomerOrders(
  orders: readonly CustomerSummaryOrder[],
): CustomerSummary {
  const summary: CustomerSummary = {
    orderCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    openCount: 0,
    totalBilled: dec(0),
    totalPaid: dec(0),
    pending: dec(0),
  };

  for (const order of orders) {
    summary.orderCount += 1;
    if (isCompleted(order.status)) summary.completedCount += 1;
    if (isCancelled(order.status)) summary.cancelledCount += 1;
    if (!isClosed(order.status)) summary.openCount += 1;

    const total = dec(order.grandTotal);
    const paid = dec(order.paidTotal);
    summary.totalBilled = summary.totalBilled.plus(total);
    summary.totalPaid = summary.totalPaid.plus(paid);

    if (!isClosed(order.status)) {
      const due = total.minus(paid).minus(dec(order.tdsTotal));
      if (due.greaterThan(0)) summary.pending = summary.pending.plus(due);
    }
  }

  return summary;
}
