import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { dec } from "@/lib/money";

const schema = z.object({
  status: z.enum(["quote", "open_tab", "ready", "settled", "cancelled"]),
  progressNote: z.string().max(300).nullable().optional(),
  followUpDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
});

const ALLOWED: Record<string, string[]> = {
  quote: ["open_tab", "cancelled"],
  open_tab: ["ready", "settled", "cancelled"],
  ready: ["open_tab", "settled", "cancelled"],
  settled: [],
  cancelled: [],
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("VALIDATION_FAILED", "Check the status and try again.");
  }

  const { id } = await params;
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.businessId, auth.business.id)))
    .limit(1);

  if (!order) return apiError("NOT_FOUND", "Order not found.");
  if (!ALLOWED[order.status]?.includes(parsed.data.status)) {
    return apiError(
      "CONFLICT",
      `An order that is ${order.status} cannot move to ${parsed.data.status}.`,
    );
  }

  if (
    parsed.data.status === "settled" &&
    dec(order.paidTotal).plus(order.tdsTotal).lessThan(order.grandTotal)
  ) {
    return apiError("CONFLICT", "Log the balance before you mark it paid.");
  }

  await db
    .update(orders)
    .set({
      status: parsed.data.status,
      progressNote:
        parsed.data.progressNote === undefined
          ? order.progressNote
          : parsed.data.progressNote,
      followUpDate:
        parsed.data.followUpDate === undefined
          ? order.followUpDate
          : parsed.data.followUpDate,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id));

  return apiData({ orderId: order.id, status: parsed.data.status });
}
