/** Item names shown before the remainder is folded into "+N more". */
const VISIBLE_ITEM_COUNT = 3;

/**
 * One summary shape for the owner and guest adapters. Home cards lead with
 * items, so show three of them before summarising the rest: "Cake, Bread,
 * Tea · +2 more". A long item list never pushes the needed-by date away.
 */
export function orderSummary(itemNames: string[]): string {
  if (itemNames.length === 0) return "1 item";
  const visible = itemNames.slice(0, VISIBLE_ITEM_COUNT);
  const rest = itemNames.length - visible.length;
  return `${visible.join(", ")}${rest > 0 ? ` · +${rest} more` : ""}`;
}
