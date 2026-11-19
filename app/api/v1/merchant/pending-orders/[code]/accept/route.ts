import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import {
  customers,
  orderItems,
  orders,
  pendingOrders,
} from "@/db/schema";
import { apiData, apiError } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { newOrderCode } from "@/lib/orders";
import { priceLines } from "@/lib/pending";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const { code } = await params;
  const [pending] = await db
    .select()
    .from(pendingOrders)
    .where(
      and(
        eq(pendingOrders.code, code),
        eq(pendingOrders.businessId, auth.business.id),
        eq(pendingOrders.status, "pending"),
        gt(pendingOrders.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!pending) {
    return apiError("NOT_FOUND", "This order link has expired.");
  }

  const priced = await priceLines(
    auth.business.id,
    pending.lines.map((line) => ({
      itemId: line.itemId,
      optionId: line.optionId,
      extraIds: line.extraIds,
      quantity: line.quantity,
    })),
  );

  if (!priced.ok) {
    return apiError(priced.code, priced.message);
  }

  const result = await db.transaction(async (tx) => {
    const [locked] = await tx
      .select()
      .from(pendingOrders)
      .where(
        and(
          eq(pendingOrders.code, code),
          eq(pendingOrders.businessId, auth.business.id),
          eq(pendingOrders.status, "pending"),
          gt(pendingOrders.expiresAt, new Date()),
        ),
      )
      .for("update");

    if (!locked) {
      return { error: "NOT_FOUND" as const };
    }

    const phone = locked.buyerPhone.replace(/\D/g, "").slice(-10) || null;
    let customerId: string | null = null;

    if (phone) {
      const [existing] = await tx
        .select({ id: customers.id })
        .from(customers)
        .where(
          and(
            eq(customers.businessId, auth.business.id),
            eq(customers.phone, phone),
          ),
        )
        .limit(1);
      customerId = existing?.id ?? null;
    }

    if (!customerId) {
      const [created] = await tx
        .insert(customers)
        .values({
          businessId: auth.business.id,
          name: locked.buyerName,
          phone,
        })
        .returning({ id: customers.id });
      customerId = created.id;
    }

    const [order] = await tx
      .insert(orders)
      .values({
        businessId: auth.business.id,
        customerId,
        orderCode: newOrderCode(),
        status: "open_tab",
        source: "whatsapp_store",
        customerName: locked.buyerName,
        customerPhone: phone,
        deliveryNote: locked.note,
        neededBy: locked.neededBy,
        timeSlot: locked.timeSlot,
        revenueSubtotal: priced.cart.revenueSubtotal,
        grandTotal: priced.cart.grandTotal,
      })
      .returning({ id: orders.id });

    await tx.insert(orderItems).values(
      priced.cart.lines.map((line) => ({
        businessId: auth.business.id,
        orderId: order.id,
        catalogItemId: line.itemId,
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

    await tx
      .delete(pendingOrders)
      .where(eq(pendingOrders.id, locked.id));

    return { orderId: order.id };
  });

  if ("error" in result) {
    return apiError("NOT_FOUND", "This order link has expired.");
  }

  return apiData({ orderId: result.orderId }, 201);
}
