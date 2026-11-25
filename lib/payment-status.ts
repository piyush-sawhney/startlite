import { dec, formatAmount } from "./money";

export type PaymentStatus = "paid" | "partial" | "due";

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  partial: "Part paid",
  due: "Due",
};

function amount(value: string): number {
  return Number(value.replace(/[^0-9.]/g, "")) || 0;
}

/**
 * Work status and payment status are different facts. A ready order can still
 * be unpaid; an in-progress order can already be paid in full.
 */
export function paidAmount(total: string, due: string): string {
  return formatAmount(
    dec(amount(total)).minus(amount(due)).toFixed(2),
  );
}

export function paymentStatus(total: string, due: string): PaymentStatus {
  const amountDue = amount(due);
  if (amountDue <= 0) return "paid";
  if (amount(total) > 0 && amountDue < amount(total)) return "partial";
  return "due";
}
