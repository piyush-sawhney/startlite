import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { catalogItems } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { catalogSchema, cleanPrice, writeOptions } from "@/lib/catalog";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = catalogSchema.partial().safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("VALIDATION_FAILED", "Check the item and try again.");
  }

  const { id } = await params;
  const [item] = await db
    .select()
    .from(catalogItems)
    .where(
      and(
        eq(catalogItems.id, id),
        eq(catalogItems.businessId, auth.business.id),
        isNull(catalogItems.deletedAt),
      ),
    )
    .limit(1);

  if (!item) return apiError("NOT_FOUND", "Item not found.");

  const body = parsed.data;
  const basePrice =
    body.basePrice === undefined ? item.basePrice : cleanPrice(body.basePrice);
  if (basePrice === null) {
    return apiError("VALIDATION_FAILED", "Enter a price of zero or more.");
  }

  const priceMode = (body.priceMode ?? item.priceMode) as
    | "fixed"
    | "starting_from"
    | "quote";

  await db.transaction(async (tx) => {
    await tx
      .update(catalogItems)
      .set({
        name: body.name?.trim() ?? item.name,
        subtitle:
          body.subtitle === undefined
            ? item.subtitle
            : body.subtitle?.trim() || null,
        priceMode,
        basePrice: priceMode === "quote" ? "0.00" : basePrice,
        unitLabel: body.unitLabel?.trim() ?? item.unitLabel,
        isAvailable: body.isAvailable ?? item.isAvailable,
        customerPrompt:
          body.customerPrompt === undefined
            ? item.customerPrompt
            : body.customerPrompt?.trim() || null,
        askWhatsappMedia: body.askWhatsappMedia ?? item.askWhatsappMedia,
        imageKey: body.imageKey === undefined ? item.imageKey : body.imageKey,
      })
      .where(eq(catalogItems.id, item.id));

    if (body.options || body.extras) {
      await writeOptions(tx, auth.business.id, item.id, {
        name: body.name ?? item.name,
        priceMode,
        basePrice,
        unitLabel: body.unitLabel ?? item.unitLabel,
        isAvailable: body.isAvailable ?? item.isAvailable,
        askWhatsappMedia:
          body.askWhatsappMedia ?? item.askWhatsappMedia,
        options: body.options ?? [],
        extras: body.extras ?? [],
      });
    }
  });

  return apiData({ itemId: item.id });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const [item] = await db
    .update(catalogItems)
    .set({ deletedAt: new Date(), isAvailable: false })
    .where(
      and(
        eq(catalogItems.id, id),
        eq(catalogItems.businessId, auth.business.id),
      ),
    )
    .returning({ id: catalogItems.id });

  if (!item) return apiError("NOT_FOUND", "Item not found.");
  return apiData({ itemId: item.id });
}
