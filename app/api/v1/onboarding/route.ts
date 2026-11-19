import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { businesses, catalogItems } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiUser } from "@/lib/api-auth";
import { getPack, PACKS } from "@/lib/packs";
import { slugifyHandle, validateHandle } from "@/lib/shop";

const schema = z.object({
  shopName: z.string().min(2).max(80),
  handle: z.string().min(3).max(32),
  pack: z.string().refine((value) => PACKS.some((entry) => entry.id === value)),
  whatsappNumber: z.string().min(10).max(20),
  upiId: z.string().max(80).nullable().optional(),
  locality: z.string().max(80).nullable().optional(),
  startBlank: z.boolean().optional(),
});

export async function POST(request: Request) {
  const auth = await requireApiUser(request);
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError(
      "VALIDATION_FAILED",
      "Check your shop details and try again.",
      parsed.error.issues,
    );
  }

  const body = parsed.data;
  const handle = slugifyHandle(body.handle);
  const problem = validateHandle(handle);
  if (problem) return apiError("VALIDATION_FAILED", problem);

  const digits = body.whatsappNumber.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return apiError("VALIDATION_FAILED", "Enter a valid WhatsApp number.");
  }

  if (body.upiId && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(body.upiId)) {
    return apiError("VALIDATION_FAILED", "Enter a UPI ID like name@bank.");
  }

  const [existing] = await db
    .select({ id: businesses.id })
    .from(businesses)
    .where(eq(businesses.ownerUserId, auth.user.id))
    .limit(1);
  if (existing) {
    return apiError("CONFLICT", "This account already has a shop.");
  }

  const [taken] = await db
    .select({ id: businesses.id })
    .from(businesses)
    .where(eq(businesses.handle, handle))
    .limit(1);
  if (taken) {
    return apiError("CONFLICT", "That store link is taken. Try another.");
  }

  const pack = getPack(body.pack);

  const business = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(businesses)
      .values({
        ownerUserId: auth.user.id,
        handle,
        businessName: body.shopName.trim(),
        categoryPack: pack.id,
        category: pack.label,
        locality: body.locality?.trim() || null,
        whatsappNumber: digits,
        upiId: body.upiId || null,
        addressPlaceholder: pack.note,
      })
      .returning({ id: businesses.id, handle: businesses.handle });

    if (!body.startBlank) {
      await tx.insert(catalogItems).values(
        pack.starters.map((starter, index) => ({
          businessId: created.id,
          name: starter.name,
          basePrice: starter.price,
          unitLabel: starter.unit,
          sortOrder: index,
        })),
      );
    }

    await tx
      .update(businesses)
      .set({ firstItemAt: new Date() })
      .where(eq(businesses.id, created.id));

    return created;
  });

  return apiData({ handle: business.handle }, 201);
}
