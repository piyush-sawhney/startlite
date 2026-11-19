import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { catalogItems, itemExtras, itemOptions } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";

const schema = z.object({
  targetId: z.string().min(1),
  scope: z.enum(["item", "option", "extra"]),
  isAvailable: z.boolean(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("VALIDATION_FAILED", "Check the item and try again.");
  }

  const { id } = await params;
  const { targetId, scope, isAvailable } = parsed.data;

  if (scope === "item") {
    const [row] = await db
      .update(catalogItems)
      .set({ isAvailable })
      .where(
        and(
          eq(catalogItems.id, id),
          eq(catalogItems.businessId, auth.business.id),
        ),
      )
      .returning({ id: catalogItems.id });
    if (!row) return apiError("NOT_FOUND", "Item not found.");
    return apiData({ id: row.id, isAvailable });
  }

  if (scope === "option") {
    const [row] = await db
      .update(itemOptions)
      .set({ isAvailable })
      .where(
        and(
          eq(itemOptions.id, targetId),
          eq(itemOptions.itemId, id),
          eq(itemOptions.businessId, auth.business.id),
        ),
      )
      .returning({ id: itemOptions.id });
    if (!row) return apiError("NOT_FOUND", "Option not found.");
    return apiData({ id: row.id, isAvailable });
  }

  const [row] = await db
    .update(itemExtras)
    .set({ isAvailable })
    .where(
      and(
        eq(itemExtras.id, targetId),
        eq(itemExtras.itemId, id),
        eq(itemExtras.businessId, auth.business.id),
      ),
    )
    .returning({ id: itemExtras.id });
  if (!row) return apiError("NOT_FOUND", "Extra not found.");
  return apiData({ id: row.id, isAvailable });
}
