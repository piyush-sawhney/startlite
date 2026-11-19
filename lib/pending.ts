import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/db";
import { catalogItems, itemExtras, itemOptions } from "@/db/schema";
import { dec, money, multiply, sum } from "./money";

export type LineInput = {
  itemId: string;
  optionId?: string | null;
  extraIds?: string[];
  quantity: string;
  note?: string | null;
};

export type PricedLine = {
  itemId: string;
  itemName: string;
  optionId: string | null;
  optionName: string | null;
  extraIds: string[];
  extraNames: string[];
  extras: Array<{ id: string; name: string; priceDelta: string }>;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
  unitLabel: string;
  customerNote: string | null;
};

export type PricedCart = {
  lines: PricedLine[];
  revenueSubtotal: string;
  grandTotal: string;
};

export type PriceResult =
  | { ok: true; cart: PricedCart }
  | { ok: false; code: "NOT_FOUND" | "CONFLICT"; message: string };

function validQuantity(value: string): boolean {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return false;
  const quantity = dec(value);
  return quantity.greaterThan(0) && quantity.lessThanOrEqualTo(999);
}

/**
 * The only place a buyer's line becomes a price.
 * The client sends ids and quantities. It never sends a total.
 */
export async function priceLines(
  businessId: string,
  inputs: LineInput[],
): Promise<PriceResult> {
  if (inputs.length === 0) {
    return { ok: false, code: "CONFLICT", message: "Your cart is empty." };
  }

  if (inputs.length > 50) {
    return {
      ok: false,
      code: "CONFLICT",
      message: "This order has more than 50 lines. Send it in two parts.",
    };
  }

  for (const input of inputs) {
    if (!validQuantity(input.quantity)) {
      return {
        ok: false,
        code: "CONFLICT",
        message: "Choose a quantity between 0 and 999.",
      };
    }
  }

  const itemIds = [...new Set(inputs.map((input) => input.itemId))];
  const items = await db
    .select()
    .from(catalogItems)
    .where(
      and(
        eq(catalogItems.businessId, businessId),
        inArray(catalogItems.id, itemIds),
        isNull(catalogItems.deletedAt),
      ),
    );

  if (items.length !== itemIds.length) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "An item is no longer on the menu. Refresh and try again.",
    };
  }

  const [options, extras] = await Promise.all([
    db
      .select()
      .from(itemOptions)
      .where(
        and(
          eq(itemOptions.businessId, businessId),
          inArray(itemOptions.itemId, itemIds),
        ),
      ),
    db
      .select()
      .from(itemExtras)
      .where(
        and(
          eq(itemExtras.businessId, businessId),
          inArray(itemExtras.itemId, itemIds),
        ),
      ),
  ]);

  const itemById = new Map(items.map((item) => [item.id, item]));
  const lines: PricedLine[] = [];

  for (const input of inputs) {
    const item = itemById.get(input.itemId);
    if (!item) {
      return {
        ok: false,
        code: "NOT_FOUND",
        message: "An item is no longer on the menu. Refresh and try again.",
      };
    }

    if (!item.isAvailable) {
      return {
        ok: false,
        code: "CONFLICT",
        message: `${item.name} is sold out. Remove it and try again.`,
      };
    }

    const itemOptionsForItem = options.filter(
      (option) => option.itemId === item.id,
    );
    let option = null;

    if (input.optionId) {
      option =
        itemOptionsForItem.find((entry) => entry.id === input.optionId) ?? null;
      if (!option || !option.isAvailable) {
        return {
          ok: false,
          code: "CONFLICT",
          message: `Choose another option for ${item.name}.`,
        };
      }
    } else if (itemOptionsForItem.length > 0) {
      return {
        ok: false,
        code: "CONFLICT",
        message: `Choose an option for ${item.name}.`,
      };
    }

    const selectedExtras = [];
    for (const extraId of input.extraIds ?? []) {
      const extra = extras.find(
        (entry) => entry.id === extraId && entry.itemId === item.id,
      );
      if (!extra || !extra.isAvailable) {
        return {
          ok: false,
          code: "CONFLICT",
          message: `An extra for ${item.name} is not available.`,
        };
      }
      if (extra.parentOptionId && extra.parentOptionId !== option?.id) {
        return {
          ok: false,
          code: "CONFLICT",
          message: "An extra does not match the chosen option.",
        };
      }
      selectedExtras.push(extra);
    }

    const basePrice =
      item.priceMode === "quote" ? "0.00" : option?.price ?? item.basePrice;
    const deltaPerUnit = sum(
      selectedExtras.map((extra) => extra.priceDelta),
    );
    const allInUnit = dec(basePrice).plus(deltaPerUnit).toFixed(2);
    const quantity = dec(input.quantity).toFixed(2);

    lines.push({
      itemId: item.id,
      itemName: item.name,
      optionId: option?.id ?? null,
      optionName: option?.name ?? null,
      extraIds: selectedExtras.map((extra) => extra.id),
      extraNames: selectedExtras.map((extra) => extra.name),
      extras: selectedExtras.map((extra) => ({
        id: extra.id,
        name: extra.name,
        priceDelta: extra.priceDelta,
      })),
      quantity,
      unitPrice: money(basePrice),
      lineTotal: multiply(quantity, allInUnit),
      unitLabel: item.unitLabel,
      customerNote: input.note?.trim().slice(0, 200) || null,
    });
  }

  const subtotal = sum(lines.map((line) => line.lineTotal));
  return {
    ok: true,
    cart: { lines, revenueSubtotal: subtotal, grandTotal: subtotal },
  };
}

export function lineChanged(
  snapshot: {
    itemName: string;
    optionName: string | null;
    extraNames: string[];
    quantity: string;
    unitPrice: string;
    lineTotal: string;
  },
  current: PricedLine,
): boolean {
  return (
    snapshot.itemName !== current.itemName ||
    (snapshot.optionName ?? null) !== current.optionName ||
    snapshot.extraNames.join("|") !== current.extraNames.join("|") ||
    dec(snapshot.quantity).toFixed(2) !== current.quantity ||
    dec(snapshot.unitPrice).toFixed(2) !== current.unitPrice ||
    dec(snapshot.lineTotal).toFixed(2) !== current.lineTotal
  );
}
