import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { itemExtras, itemOptions } from "@/db/schema";
import { money } from "./money";

export const optionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(60),
  price: z.string(),
  isAvailable: z.boolean().default(true),
});

export const extraSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(60),
  priceDelta: z.string(),
  parentOptionId: z.string().nullable().optional(),
  isMultiSelect: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
});

export const catalogSchema = z.object({
  name: z.string().min(1).max(80),
  subtitle: z.string().max(120).nullable().optional(),
  priceMode: z.enum(["fixed", "starting_from", "quote"]).default("fixed"),
  basePrice: z.string().default("0"),
  unitLabel: z.string().max(20).default("item"),
  isAvailable: z.boolean().default(true),
  customerPrompt: z.string().max(120).nullable().optional(),
  askWhatsappMedia: z.boolean().default(false),
  imageKey: z.string().max(300).nullable().optional(),
  options: z.array(optionSchema).max(20).default([]),
  extras: z.array(extraSchema).max(30).default([]),
});

export type CatalogPayload = z.infer<typeof catalogSchema>;

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export function cleanPrice(value: string): string | null {
  const amount = money(value);
  return Number(amount) >= 0 ? amount : null;
}

export async function writeOptions(
  tx: Tx,
  businessId: string,
  itemId: string,
  body: CatalogPayload,
) {
  await tx.delete(itemExtras).where(eq(itemExtras.itemId, itemId));
  await tx.delete(itemOptions).where(eq(itemOptions.itemId, itemId));

  const idMap = new Map<string, string>();
  for (const [index, option] of body.options.entries()) {
    const [row] = await tx
      .insert(itemOptions)
      .values({
        businessId,
        itemId,
        name: option.name.trim(),
        price: cleanPrice(option.price) ?? "0.00",
        isAvailable: option.isAvailable,
        sortOrder: index,
      })
      .returning({ id: itemOptions.id });
    if (option.id) idMap.set(option.id, row.id);
  }

  for (const [index, extra] of body.extras.entries()) {
    await tx.insert(itemExtras).values({
      businessId,
      itemId,
      parentOptionId: extra.parentOptionId
        ? idMap.get(extra.parentOptionId) ?? null
        : null,
      name: extra.name.trim(),
      priceDelta: cleanPrice(extra.priceDelta) ?? "0.00",
      isMultiSelect: extra.isMultiSelect,
      isAvailable: extra.isAvailable,
      sortOrder: index,
    });
  }
}
