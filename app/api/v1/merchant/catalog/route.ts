import { eq } from "drizzle-orm";
import { db } from "@/db";
import { businesses, catalogItems } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { catalogSchema, cleanPrice, writeOptions } from "@/lib/catalog";
import { getPack } from "@/lib/packs";

export async function POST(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = catalogSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError(
      "VALIDATION_FAILED",
      "Check the item and try again.",
      parsed.error.issues,
    );
  }

  const body = parsed.data;
  const basePrice = cleanPrice(body.basePrice);
  if (basePrice === null) {
    return apiError("VALIDATION_FAILED", "Enter a price of zero or more.");
  }

  const result = await db.transaction(async (tx) => {
    const [item] = await tx
      .insert(catalogItems)
      .values({
        businessId: auth.business.id,
        name: body.name.trim(),
        subtitle: body.subtitle?.trim() || null,
        priceMode: body.priceMode,
        basePrice: body.priceMode === "quote" ? "0.00" : basePrice,
        unitLabel: body.unitLabel.trim() || getPack(auth.business.categoryPack).unit,
        isAvailable: body.isAvailable,
        customerPrompt: body.customerPrompt?.trim() || null,
        askWhatsappMedia: body.askWhatsappMedia,
        imageKey: body.imageKey ?? null,
        sortOrder: Date.now() % 1_000_000,
      })
      .returning({ id: catalogItems.id });

    await writeOptions(tx, auth.business.id, item.id, body);
    return item;
  });

  if (!auth.business.firstItemAt) {
    await db
      .update(businesses)
      .set({ firstItemAt: new Date() })
      .where(eq(businesses.id, auth.business.id));
  }

  return apiData({ itemId: result.id }, 201);
}
