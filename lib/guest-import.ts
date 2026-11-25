import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  catalogItems,
  customers,
  expenses,
  orderItems,
  orderPayments,
  orders,
} from "@/db/schema";
import { dec, money, sum } from "./money";
import type { GuestImportPayload } from "./guest-store";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type GuestImportResult = {
  items: number;
  orders: number;
  expenses: number;
  skippedOrders: number;
};

/**
 * Copies the phone workspace into a real shop.
 *
 * Orders are recomputed from their lines. A code that already exists is
 * skipped, so a retry after a dropped response is safe.
 */
export async function importGuestData(
  tx: Tx,
  businessId: string,
  payload: GuestImportPayload,
): Promise<GuestImportResult> {
  const result: GuestImportResult = {
    items: 0,
    orders: 0,
    expenses: 0,
    skippedOrders: 0,
  };

  for (const [index, item] of payload.items.entries()) {
    const name = item.name.trim().slice(0, 80);
    if (!name) continue;
    const [existing] = await tx
      .select({ id: catalogItems.id })
      .from(catalogItems)
      .where(
        and(
          eq(catalogItems.businessId, businessId),
          isNull(catalogItems.deletedAt),
          sql`lower(${catalogItems.name}) = lower(${name})`,
        ),
      )
      .limit(1);

    if (existing) {
      await tx
        .update(catalogItems)
        .set({
          basePrice: money(item.price),
          unitLabel: item.unitLabel.trim().slice(0, 20) || "item",
          isAvailable: item.isAvailable,
        })
        .where(eq(catalogItems.id, existing.id));
    } else {
      await tx.insert(catalogItems).values({
        businessId,
        name,
        basePrice: money(item.price),
        unitLabel: item.unitLabel.trim().slice(0, 20) || "item",
        isAvailable: item.isAvailable,
        sortOrder: index,
      });
    }
    result.items += 1;
  }

  for (const order of payload.orders) {
    const [taken] = await tx
      .select({ id: orders.id })
      .from(orders)
      .where(
        and(
          eq(orders.businessId, businessId),
          eq(orders.orderCode, order.code),
        ),
      )
      .limit(1);

    if (taken) {
      result.skippedOrders += 1;
      continue;
    }

    const lines = order.lines
      .map((line) => {
        const name = line.itemName.trim().slice(0, 80);
        if (!name) return null;
        const lineTotal = money(
          dec(line.quantity).times(dec(line.unitPrice)),
        );
        return {
          itemName: name,
          optionName: line.optionName?.trim().slice(0, 80) || null,
          extras: (line.extras ?? []).slice(0, 20).map((extra) => ({
            name: extra.name.trim().slice(0, 80),
            priceDelta: money(extra.priceDelta),
          })),
          note: line.note?.trim().slice(0, 200) || null,
          quantity: money(line.quantity),
          unitPrice: money(line.unitPrice),
          unitLabel: line.unitLabel.trim().slice(0, 20) || "item",
          lineTotal,
        };
      })
      .filter((line): line is NonNullable<typeof line> => line !== null);

    if (lines.length === 0) {
      result.skippedOrders += 1;
      continue;
    }

    const total = sum(lines.map((line) => line.lineTotal));
    if (dec(total).lessThanOrEqualTo(0)) {
      result.skippedOrders += 1;
      continue;
    }

    const paid = sum(order.payments.map((payment) => payment.amount));
    if (dec(paid).greaterThan(total)) {
      result.skippedOrders += 1;
      continue;
    }

    const cleanPhone =
      order.customerPhone?.replace(/\D/g, "").slice(-10) || null;
    const cleanName = order.customerName?.trim().slice(0, 80) || null;

    let customerId: string | null = null;
    if (cleanPhone) {
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
      order.status === "cancelled" || order.status === "declined"
        ? order.status
        : dec(paid).greaterThanOrEqualTo(total)
          ? "completed"
          : "accepted";

    const [created] = await tx
      .insert(orders)
      .values({
        businessId,
        customerId,
        orderCode: order.code.slice(0, 20),
        status,
        source: "manual",
        customerName: cleanName,
        customerPhone: cleanPhone,
        deliveryNote: order.note?.trim().slice(0, 500) || null,
        neededBy: order.neededBy,
        revenueSubtotal: total,
        grandTotal: total,
        paidTotal: paid,
        tdsTotal: "0.00",
        createdAt: new Date(order.createdAt),
      })
      .returning({ id: orders.id });

    await tx.insert(orderItems).values(
      lines.map((line) => ({
        businessId,
        orderId: created.id,
        catalogItemId: null,
        lineKind: "standard",
        itemNameSnapshot: line.itemName,
        optionSnapshot: line.optionName,
        extrasSnapshot: line.extras,
        customerNote: line.note,
        unitLabelSnapshot: line.unitLabel,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineTotal: line.lineTotal,
      })),
    );

    if (order.payments.length > 0) {
      await tx.insert(orderPayments).values(
        order.payments.map((payment) => ({
          businessId,
          orderId: created.id,
          amount: money(payment.amount),
          tdsDeducted: "0.00",
          paymentMode: payment.mode,
          paidAt: new Date(payment.paidAt),
        })),
      );
    }

    result.orders += 1;
  }

  for (const expense of payload.expenses) {
    const title = expense.title.trim().slice(0, 80);
    if (!title || dec(expense.amount).lessThanOrEqualTo(0)) continue;
    await tx.insert(expenses).values({
      businessId,
      title,
      amount: money(expense.amount),
      expenseDate: expense.date,
    });
    result.expenses += 1;
  }

  return result;
}
