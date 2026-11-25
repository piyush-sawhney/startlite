/**
 * The one place that owns order statuses.
 *
 * See ADR-037. A screen never hardcodes a status string; it imports a helper or
 * a label from here. The funnel is generic: it names the state of the work, not
 * the trade, so a bakery, a salon, a kirana, and a repair shop all map onto it.
 */

export type OrderStatus =
  | "under_review"
  | "waiting_client"
  | "accepted"
  | "in_progress"
  | "ready"
  | "completed"
  | "declined"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "under_review",
  "waiting_client",
  "accepted",
  "in_progress",
  "ready",
  "completed",
  "declined",
  "cancelled",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  under_review: "Under review",
  waiting_client: "Waiting for client",
  accepted: "Accepted",
  in_progress: "In progress",
  ready: "Ready",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
};

/** Work that is not ready yet. Shown under **To finish** on Home. */
export const TO_FINISH_STATUSES: OrderStatus[] = [
  "under_review",
  "waiting_client",
  "accepted",
  "in_progress",
];

/** Work that is done and waiting for payment or collection. */
export const READY_STATUSES: OrderStatus[] = ["ready"];

/** Closed orders. Never shown in the Home queue. */
export const CLOSED_STATUSES: OrderStatus[] = [
  "completed",
  "declined",
  "cancelled",
];

/** Every status that still needs the merchant's attention. */
export const OPEN_STATUSES: OrderStatus[] = [
  ...TO_FINISH_STATUSES,
  ...READY_STATUSES,
];

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as string[]).includes(value);
}

export function isToFinish(status: string): boolean {
  return (TO_FINISH_STATUSES as string[]).includes(status);
}

export function isReady(status: string): boolean {
  return status === "ready";
}

export function isCompleted(status: string): boolean {
  return status === "completed";
}

export function isClosed(status: string): boolean {
  return (CLOSED_STATUSES as string[]).includes(status);
}

/** Declined and cancelled both mean the order will not happen. */
export function isCancelled(status: string): boolean {
  return status === "cancelled" || status === "declined";
}

export function isOpen(status: string): boolean {
  return (OPEN_STATUSES as string[]).includes(status);
}

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  under_review: ["waiting_client", "accepted", "declined", "cancelled"],
  waiting_client: ["accepted", "declined", "cancelled"],
  accepted: ["in_progress", "ready", "cancelled"],
  in_progress: ["ready", "cancelled"],
  ready: ["completed", "accepted", "cancelled"],
  completed: [],
  declined: [],
  cancelled: [],
};

export function canTransition(from: string, to: string): boolean {
  if (!isOrderStatus(from) || !isOrderStatus(to)) return false;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function statusLabel(status: string): string {
  return isOrderStatus(status) ? STATUS_LABELS[status] : status;
}
