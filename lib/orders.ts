import { randomInt } from "node:crypto";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  customers,
  orderItems,
  orderPayments,
  orders,
} from "@/db/schema";
import { dec, money, sum } from "./money";
import type { PricedLine } from "./pending";

export type CreateOrderInput = {
  source: string;
  status?: string;
  customerId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  note?: string | null;
  neededBy: string;
  timeSlot?: string | null;
  lines: PricedLine[];
  paidAmount?: string;
  tdsAmount?: string;
  paymentMode?: string;
  progressNote?: string | null;
};

export function newOrderCode(): string {
  return `ORD-${randomInt(1000, 10000)}`;
}

/**
 * Writes one order, its lines, and an optional payment in a single transaction.
 * Totals come from the priced lines. The caller never supplies a total.
 */
export async function createOrder(
  businessId: string,
  input: CreateOrderInput,
): Promise<{ ok: true; orderId: string } | { ok: false; message: string }> {
  if (input.lines.length === 0) {
    return { ok: false, message: "Add at least one item." };
  }

  const revenueSubtotal = sum(input.lines.map((line) => line.lineTotal));
  const paid = money(input.paidAmount ?? "0");
  const tds = money(input.tdsAmount ?? "0");

  if (dec(paid).lessThan(0) || dec(tds).lessThan(0)) {
    return { ok: false, message: "Amount cannot be negative." };
  }

  if (dec(paid).plus(tds).greaterThan(revenueSubtotal)) {
    return { ok: false, message: "Paid is more than the total." };
  }

  const settled = dec(paid).plus(tds).greaterThanOrEqualTo(revenueSubtotal);

  return db.transaction(async (tx) => {
    const cleanPhone = input.customerPhone?.replace(/\D/g, "").slice(-10) || null;
    const cleanName = input.customerName?.trim().slice(0, 80) || null;

    let customerId: string | null = input.customerId ?? null;
    if (!customerId && cleanPhone) {
      const [existing] = await tx
        .select({ id: customers.id })
        .from(customers)
        .where(
          and(
            eq(customers.businessId, businessId),
            eq(customers.phone, cleanPhone),
          ),
        )
        .limit(1);
      customerId = existing?.id ?? null;
    }

    if (!customerId && cleanName && !cleanPhone) {
      const [existing] = await tx
        .select({ id: customers.id })
        .from(customers)
        .where(
          and(
            eq(customers.businessId, businessId),
            isNull(customers.phone),
            sql`lower(${customers.name}) = lower(${cleanName})`,
          ),
        )
        .limit(1);
      customerId = existing?.id ?? null;
    }

    if (!customerId && (cleanName || cleanPhone)) {
      const [created] = await tx
        .insert(customers)
        .values({
          businessId,
          name: cleanName ?? `Buyer ${cleanPhone?.slice(-4) ?? ""}`.trim(),
          phone: cleanPhone,
        })
        .returning({ id: customers.id });
      customerId = created.id;
    }

    const status =
      input.status ?? (settled ? "settled" : "open_tab");

    const [order] = await tx
      .insert(orders)
      .values({
        businessId,
        customerId,
        orderCode: newOrderCode(),
        status,
        source: input.source,
        customerName: input.customerName?.trim() || null,
        customerPhone: input.customerPhone?.replace(/\D/g, "").slice(-10) || null,
        deliveryNote: input.note?.trim() || null,
        neededBy: input.neededBy,
        timeSlot: input.timeSlot || null,
        progressNote: input.progressNote || null,
        revenueSubtotal,
        grandTotal: revenueSubtotal,
        paidTotal: paid,
        tdsTotal: tds,
      })
      .returning({ id: orders.id });

    await tx.insert(orderItems).values(
      input.lines.map((line) => ({
        businessId,
        orderId: order.id,
        catalogItemId: line.itemId.startsWith("quick") ? null : line.itemId,
        lineKind: "standard",
        itemNameSnapshot: line.itemName,
        optionSnapshot: line.optionName,
        extrasSnapshot: line.extras.map((extra) => ({
          name: extra.name,
          priceDelta: extra.priceDelta,
        })),
        customerNote: line.customerNote,
        unitLabelSnapshot: line.unitLabel,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineTotal: line.lineTotal,
      })),
    );

    if (dec(paid).greaterThan(0) || dec(tds).greaterThan(0)) {
      await tx.insert(orderPayments).values({
        businessId,
        orderId: order.id,
        amount: paid,
        tdsDeducted: tds,
        paymentMode: input.paymentMode ?? "cash",
      });
    }

    return { ok: true as const, orderId: order.id };
  });
}

export function quickLine(amount: string, label = "Sale"): PricedLine {
  const value = money(amount);
  return {
    itemId: `quick-${Date.now()}`,
    itemName: label,
    optionId: null,
    optionName: null,
    extraIds: [],
    extraNames: [],
    extras: [],
    quantity: "1.00",
    unitPrice: value,
    lineTotal: value,
    unitLabel: "sale",
    customerNote: null,
  };
}
