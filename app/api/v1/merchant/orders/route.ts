import { z } from "zod";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { money } from "@/lib/money";
import { createOrder, quickLine } from "@/lib/orders";
import { priceLines } from "@/lib/pending";
import { istDateString } from "@/lib/queries";

const lineSchema = z.object({
  itemId: z.string().min(1),
  optionId: z.string().min(1).nullable().optional(),
  extraIds: z.array(z.string().min(1)).max(20).optional(),
  quantity: z.string().regex(/^\d+(\.\d{1,2})?$/),
  note: z.string().max(200).nullable().optional(),
});

const schema = z.object({
  source: z
    .enum(["walk_in", "repeated", "quote", "manual", "opening"])
    .default("walk_in"),
  customerName: z.string().max(80).nullable().optional(),
  customerPhone: z.string().max(20).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
  neededBy: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  timeSlot: z.string().max(20).nullable().optional(),
  lines: z.array(lineSchema).max(50).optional(),
  quickAmount: z.string().optional(),
  paidAmount: z.string().optional(),
  tdsAmount: z.string().optional(),
  paymentMode: z.enum(["cash", "upi", "bank", "other"]).optional(),
});

export async function POST(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError(
      "VALIDATION_FAILED",
      "Check the sale and try again.",
      parsed.error.issues,
    );
  }

  const body = parsed.data;
  let lines;

  if (body.quickAmount) {
    const amount = money(body.quickAmount);
    if (Number(amount) <= 0) {
      return apiError("VALIDATION_FAILED", "Enter an amount above zero.");
    }
    lines = [quickLine(amount)];
  } else {
    if (!body.lines || body.lines.length === 0) {
      return apiError("VALIDATION_FAILED", "Add at least one item.");
    }
    const priced = await priceLines(auth.business.id, body.lines);
    if (!priced.ok) {
      return apiError(priced.code, priced.message);
    }
    lines = priced.cart.lines;
  }

  const result = await createOrder(auth.business.id, {
    source: body.source,
    status: body.source === "quote" ? "quote" : undefined,
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    note: body.note,
    neededBy: body.neededBy ?? istDateString(),
    timeSlot: body.timeSlot,
    lines,
    paidAmount: body.paidAmount,
    tdsAmount: body.tdsAmount,
    paymentMode: body.paymentMode,
  });

  if (!result.ok) {
    return apiError("CONFLICT", result.message);
  }

  return apiData({ orderId: result.orderId }, 201);
}
