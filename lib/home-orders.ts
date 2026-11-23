import type { IncompleteOrder } from "./home-types";

const HOME_ORDER_LIMIT = 10;

function hasScheduledTime(timeSlot: string | null | undefined) {
  const normalized = timeSlot?.trim().toLowerCase();
  return Boolean(normalized && normalized !== "any time" && normalized !== "none");
}

export function sortIncompleteOrders<T extends IncompleteOrder>(orders: T[]) {
  return [...orders].sort((a, b) => {
    const aReady = a.status === "ready";
    const bReady = b.status === "ready";
    if (aReady !== bReady) return aReady ? 1 : -1;

    const aScheduled = hasScheduledTime(a.timeSlot);
    const bScheduled = hasScheduledTime(b.timeSlot);
    if (aScheduled !== bScheduled) return aScheduled ? -1 : 1;

    if (a.neededBy !== b.neededBy) {
      return a.neededBy.localeCompare(b.neededBy);
    }

    if (aScheduled && bScheduled && a.timeSlot !== b.timeSlot) {
      return (a.timeSlot ?? "").localeCompare(b.timeSlot ?? "");
    }

    return a.createdAt.localeCompare(b.createdAt);
  });
}

export function summarizeIncompleteOrders(orders: IncompleteOrder[]) {
  const sorted = sortIncompleteOrders(orders);
  const toFinishCount = sorted.filter((order) => order.status !== "ready").length;
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
