import { z } from "zod";
import { db } from "@/db";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { importGuestData } from "@/lib/guest-import";

const moneyText = z.string().regex(/^\d+(\.\d{1,2})?$/);
const signedMoneyText = z.string().regex(/^-?\d+(\.\d{1,2})?$/);
const quantityText = z.string().regex(/^\d+(\.\d{1,2})?$/);
const dateText = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const isoText = z
  .string()
  .max(40)
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Invalid date",
  });

const itemSchema = z.object({
  name: z.string().min(1).max(80),
  price: moneyText,
  unitLabel: z.string().max(20).default("item"),
  isAvailable: z.boolean().default(true),
});

const lineSchema = z.object({
  itemName: z.string().min(1).max(80),
  optionName: z.string().max(80).nullable().default(null),
  extras: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        priceDelta: signedMoneyText,
      }),
    )
    .max(20)
    .default([]),
  quantity: quantityText,
  unitPrice: moneyText,
  unitLabel: z.string().max(20).default("item"),
  note: z.string().max(200).nullable().default(null),
});

const paymentSchema = z.object({
  amount: moneyText,
  mode: z.enum(["cash", "upi", "bank", "other"]).default("cash"),
  paidAt: isoText,
});

const orderSchema = z.object({
  code: z.string().min(2).max(20),
  customerName: z.string().max(80).nullable().default(null),
  customerPhone: z.string().max(20).nullable().default(null),
  note: z.string().max(500).nullable().default(null),
  neededBy: dateText,
  createdAt: isoText,
  status: z.enum(["open_tab", "settled", "cancelled"]).default("open_tab"),
  lines: z.array(lineSchema).min(1).max(50),
  payments: z.array(paymentSchema).max(50).default([]),
});

const schema = z.object({
  items: z.array(itemSchema).max(300).default([]),
  orders: z.array(orderSchema).max(500).default([]),
  expenses: z
    .array(
      z.object({
        title: z.string().min(1).max(80),
        amount: moneyText,
        date: dateText,
      }),
    )
    .max(500)
    .default([]),
});

export async function POST(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError(
      "VALIDATION_FAILED",
      "This phone data could not be read.",
      parsed.error.issues,
    );
  }

  const result = await db.transaction((tx) =>
    importGuestData(tx, auth.business.id, parsed.data),
  );

  return apiData(result);
}
