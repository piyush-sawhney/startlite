import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { customers, orderPayments, orders } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { dec, money } from "@/lib/money";

const schema = z.object({
  amount: z.string(),
  tdsDeducted: z.string().optional(),
  paymentMode: z.enum(["cash", "upi", "bank", "other"]).default("upi"),
  note: z.string().max(200).nullable().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("VALIDATION_FAILED", "Check the payment and try again.");
  }

  const { id } = await params;
  const amount = money(parsed.data.amount);
  const tds = money(parsed.data.tdsDeducted ?? "0");

  if (dec(amount).lessThan(0) || dec(tds).lessThan(0)) {
    return apiError("VALIDATION_FAILED", "Amount cannot be negative.");
  }
  if (dec(amount).plus(tds).lessThanOrEqualTo(0)) {
    return apiError("VALIDATION_FAILED", "Enter an amount above zero.");
  }

  const result = await db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .for("update");

    if (!order || order.businessId !== auth.business.id) {
      return { error: "NOT_FOUND" as const };
    }
    if (order.status === "settled" || order.status === "cancelled") {
      return { error: "CONFLICT" as const };
    }

    const due = dec(order.grandTotal)
      .minus(order.paidTotal)
      .minus(order.tdsTotal);

    if (dec(amount).plus(tds).greaterThan(due)) {
      return { error: "OVERPAY" as const, due: due.toFixed(2) };
    }

    await tx.insert(orderPayments).values({
      businessId: auth.business.id,
      orderId: order.id,
      amount,
      tdsDeducted: tds,
      paymentMode: parsed.data.paymentMode,
      note: parsed.data.note || null,
    });

    const paidTotal = dec(order.paidTotal).plus(amount).toFixed(2);
    const tdsTotal = dec(order.tdsTotal).plus(tds).toFixed(2);
    const settled = dec(paidTotal).plus(tdsTotal).greaterThanOrEqualTo(
      order.grandTotal,
    );

    await tx
      .update(orders)
      .set({
        paidTotal,
        tdsTotal,
        status: settled ? "settled" : order.status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    if (order.customerId) {
      await tx
        .update(customers)
        .set({ lastPaidAt: new Date() })
        .where(eq(customers.id, order.customerId));
    }

    return { orderId: order.id, status: settled ? "settled" : order.status };
  });

  if ("error" in result) {
    if (result.error === "NOT_FOUND") {
      return apiError("NOT_FOUND", "Order not found.");
    }
    if (result.error === "OVERPAY") {
      return apiError(
        "CONFLICT",
        `That is more than the due amount of ${result.due}.`,
      );
    }
    return apiError("CONFLICT", "This order is closed.");
  }

  return apiData(result, 201);
}
