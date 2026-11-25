import { istDateString } from "./date";
import type { IncompleteOrder } from "./home-types";
import { isReady } from "./order-status";

const HOME_ORDER_LIMIT = 10;

/** "Any time" and "none" are commitments without a slot, not late commitments. */
export function hasScheduledTime(timeSlot: string | null | undefined): boolean {
  const normalized = timeSlot?.trim().toLowerCase();
  return Boolean(normalized && normalized !== "any time" && normalized !== "none");
}

/**
 * Urgency of the deadline, independent of the calendar day the merchant is
 * viewing. An order whose deadline has passed is the most important work in
 * the queue, even when it has no time slot. An undated order comes last.
 */
function urgency(order: IncompleteOrder, today: string): number {
  if (!order.neededBy) return 3;
  if (order.neededBy < today) return 0;
  if (order.neededBy === today) return 1;
  return 2;
}

/**
 * Priority order for the Home queue, most important first:
 * 1. Work still to finish, then ready work that still needs payment.
 * 2. Overdue, then due today, then upcoming, then undated.
 * 3. Earliest deadline first inside each band.
 * 4. A timed commitment before an "any time" one on the same day.
 * 5. Earliest time slot, then oldest placed order as a stable tiebreaker.
 */
export function sortIncompleteOrders<T extends IncompleteOrder>(
  orders: T[],
  today: string = istDateString(),
) {
  return [...orders].sort((a, b) => {
    const aReady = isReady(a.status);
    const bReady = isReady(b.status);
    if (aReady !== bReady) return aReady ? 1 : -1;

    const aUrgency = urgency(a, today);
    const bUrgency = urgency(b, today);
    if (aUrgency !== bUrgency) return aUrgency - bUrgency;

    const aNeededBy = a.neededBy ?? "";
    const bNeededBy = b.neededBy ?? "";
    if (aNeededBy !== bNeededBy) return aNeededBy.localeCompare(bNeededBy);

    const aScheduled = hasScheduledTime(a.timeSlot);
    const bScheduled = hasScheduledTime(b.timeSlot);
    if (aScheduled !== bScheduled) return aScheduled ? -1 : 1;

    if (aScheduled && bScheduled && a.timeSlot !== b.timeSlot) {
      return (a.timeSlot ?? "").localeCompare(b.timeSlot ?? "");
    }

    return a.createdAt.localeCompare(b.createdAt);
  });
}

export function summarizeIncompleteOrders(
  orders: IncompleteOrder[],
  today: string = istDateString(),
) {
  const sorted = sortIncompleteOrders(orders, today);
  const toFinishCount = sorted.filter((order) => !isReady(order.status)).length;
  const readyCount = sorted.length - toFinishCount;
  const totalDuePaise = sorted.reduce(
    (total, order) => total + (order.duePaise ?? 0),
    0,
  );

  return {
    toFinishCount,
    readyCount,
    totalCount: sorted.length,
    totalDuePaise,
    orders: sorted.slice(0, HOME_ORDER_LIMIT),
  };
}
