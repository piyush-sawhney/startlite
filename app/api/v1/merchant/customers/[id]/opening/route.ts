import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { createOrder, quickLine } from "@/lib/orders";
import { istDateString } from "@/lib/queries";

const schema = z.object({
  amount: z.string(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("VALIDATION_FAILED", "Enter an amount and try again.");
  }

  const { id } = await params;
  const [customer] = await db
    .select()
    .from(customers)
    .where(
      and(
        eq(customers.id, id),
        eq(customers.businessId, auth.business.id),
      ),
    )
    .limit(1);

  if (!customer) return apiError("NOT_FOUND", "Customer not found.");

  if (Number(parsed.data.amount) <= 0) {
    return apiError("VALIDATION_FAILED", "Enter an amount above zero.");
  }

  const result = await createOrder(auth.business.id, {
    source: "opening",
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    neededBy: parsed.data.date ?? istDateString(),
    lines: [quickLine(parsed.data.amount, "Previous due")],
  });

  if (!result.ok) return apiError("CONFLICT", result.message);
  return apiData({ orderId: result.orderId }, 201);
}
