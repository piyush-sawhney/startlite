import { z } from "zod";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { money } from "@/lib/money";
import { istDateString } from "@/lib/queries";

const schema = z.object({
  title: z.string().min(1).max(80),
  amount: z.string(),
  expenseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export async function POST(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("VALIDATION_FAILED", "Check the expense and try again.");
  }

  const amount = money(parsed.data.amount);
  if (Number(amount) <= 0) {
    return apiError("VALIDATION_FAILED", "Enter an amount above zero.");
  }

  const [row] = await db
    .insert(expenses)
    .values({
      businessId: auth.business.id,
      title: parsed.data.title.trim(),
      amount,
      expenseDate: parsed.data.expenseDate ?? istDateString(),
    })
    .returning({ id: expenses.id });

  return apiData({ expenseId: row.id }, 201);
}
