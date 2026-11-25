import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { dec } from "@/lib/money";
import { canTransition } from "@/lib/order-status";

const lineSchema = z.object({
  id: z.string().optional(),
  catalogItemId: z.string().nullable().optional(),
  itemName: z.string().min(1).max(100),
  quantity: z.string().regex(/^\d+(\.\d{1,2})?$/),
  unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
  unitLabel: z.string().max(20).optional().nullable(),
  optionId: z.string().nullable().optional(),
  optionName: z.string().nullable().optional(),
  extras: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        priceDelta: z.string(),
      }),
    )
    .max(20)
    .optional(),
  note: z.string().max(200).nullable().optional(),
});

const editSchema = z.object({
  status: z
    .enum([
      "under_review",
      "waiting_client",
      "accepted",
      "in_progress",
      "ready",
      "completed",
      "declined",
      "cancelled",
    ])
    .optional(),
  customerName: z.string().max(80).nullable().optional(),
  customerPhone: z.string().max(20).nullable().optional(),
  neededBy: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  timeSlot: z.string().max(20).nullable().optional(),
  deliveryNote: z.string().max(500).nullable().optional(),
  adjustmentAmount: z.string().regex(/^-?\d+(\.\d{1,2})?$/).optional(),
  adjustmentReason: z.string().max(200).nullable().optional(),
  lines: z.array(lineSchema).max(50).optional(),
  removedLineIds: z.array(z.string()).max(50).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.businessId, auth.business.id)))
    .limit(1);

  if (!order) return apiError("NOT_FOUND", "Order not found.");

  const lines = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(orderItems.createdAt);

  return apiData({
    order: {
      id: order.id,
      code: order.orderCode,
      status: order.status,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      neededBy: order.neededBy,
      timeSlot: order.timeSlot,
      deliveryNote: order.deliveryNote,
      adjustmentAmount: order.adjustmentAmount,
      adjustmentReason: order.adjustmentReason,
      grandTotal: order.grandTotal,
      paidTotal: order.paidTotal,
      createdAt: order.createdAt,
    },
    lines: lines.map((line) => ({
      id: line.id,
      catalogItemId: line.catalogItemId,
      itemName: line.itemNameSnapshot,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      unitLabel: line.unitLabelSnapshot,
      optionId: null,
      optionName: line.optionSnapshot,
      extras: line.extrasSnapshot,
      note: line.customerNote,
      lineTotal: line.lineTotal,
    })),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = editSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("VALIDATION_FAILED", "Check the changes and try again.");
  }

  const { id } = await params;
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.businessId, auth.business.id)))
    .limit(1);

  if (!order) return apiError("NOT_FOUND", "Order not found.");

  const data = parsed.data;

  // Build the update set for order-level fields
  const updateSet: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  // Status transition, validated against the funnel in lib/order-status.ts.
  if (data.status !== undefined && data.status !== order.status) {
    if (!canTransition(order.status, data.status)) {
      return apiError(
        "CONFLICT",
        `An order that is ${order.status} cannot move to ${data.status}.`,
      );
    }
    if (
      data.status === "completed" &&
      dec(order.paidTotal).plus(order.tdsTotal).lessThan(order.grandTotal)
    ) {
      return apiError(
        "CONFLICT",
        "Log the balance before you mark it completed.",
      );
    }
    // Marking a fully paid order ready completes it in one step.
    updateSet.status =
      data.status === "ready" &&
      dec(order.paidTotal)
        .plus(order.tdsTotal)
        .greaterThanOrEqualTo(order.grandTotal)
        ? "completed"
        : data.status;
  }

  if (data.customerName !== undefined) updateSet.customerName = data.customerName;
  if (data.customerPhone !== undefined) updateSet.customerPhone = data.customerPhone;
  if (data.neededBy !== undefined) updateSet.neededBy = data.neededBy;
  if (data.timeSlot !== undefined) updateSet.timeSlot = data.timeSlot;
  if (data.deliveryNote !== undefined) updateSet.deliveryNote = data.deliveryNote;
  if (data.adjustmentAmount !== undefined) updateSet.adjustmentAmount = data.adjustmentAmount;
  if (data.adjustmentReason !== undefined) updateSet.adjustmentReason = data.adjustmentReason;

  await db.update(orders).set(updateSet).where(eq(orders.id, order.id));

  // Handle line item changes
  if (data.lines !== undefined) {
    // Remove deleted lines
    if (data.removedLineIds && data.removedLineIds.length > 0) {
      await db
        .delete(orderItems)
        .where(
          and(
            eq(orderItems.orderId, order.id),
            inArray(orderItems.id, data.removedLineIds),
          ),
        );
    }

    // Upsert lines: existing lines by id are updated, new lines are inserted
    for (const line of data.lines) {
      const qty = dec(line.quantity);
      const price = dec(line.unitPrice);
      const lineTotal = qty.times(price).toFixed(2);

      if (line.id) {
        await db
          .update(orderItems)
          .set({
            catalogItemId: line.catalogItemId ?? null,
            itemNameSnapshot: line.itemName,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            unitLabelSnapshot: line.unitLabel ?? null,
            optionSnapshot: line.optionName ?? null,
            extrasSnapshot: line.extras ?? [],
            customerNote: line.note ?? null,
            lineTotal,
          })
          .where(
            and(
              eq(orderItems.id, line.id),
              eq(orderItems.orderId, order.id),
            ),
          );
      } else {
        await db.insert(orderItems).values({
          orderId: order.id,
          businessId: auth.business.id,
          catalogItemId: line.catalogItemId ?? null,
          itemNameSnapshot: line.itemName,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          unitLabelSnapshot: line.unitLabel ?? null,
          optionSnapshot: line.optionName ?? null,
          extrasSnapshot: line.extras ?? [],
          customerNote: line.note ?? null,
          lineTotal,
        });
      }
    }

    // Recalculate order totals from lines
    const updatedLines = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    const revenueSubtotal = updatedLines.reduce(
      (sum, line) => sum.plus(dec(line.lineTotal)),
      dec(0),
    );

    await db
      .update(orders)
      .set({
        revenueSubtotal: revenueSubtotal.toFixed(2),
        grandTotal: revenueSubtotal
          .plus(dec(data.adjustmentAmount ?? order.adjustmentAmount ?? "0"))
          .toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));
  }

  return apiData({ orderId: order.id });
}
