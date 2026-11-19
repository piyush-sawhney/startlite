import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { validateHandle } from "@/lib/shop";

const schema = z.object({
  businessName: z.string().min(1).max(80).optional(),
  handle: z.string().min(3).max(32).optional(),
  tagline: z.string().max(140).nullable().optional(),
  locality: z.string().max(80).nullable().optional(),
  whatsappNumber: z.string().max(20).optional(),
  upiId: z.string().max(80).nullable().optional(),
  noticeBanner: z.string().max(140).nullable().optional(),
  addressPlaceholder: z.string().max(80).optional(),
  enableTimeSlots: z.boolean().optional(),
  privacyMode: z.boolean().optional(),
  showBankDetails: z.boolean().optional(),
  bankAccountName: z.string().max(80).nullable().optional(),
  bankAccountNumber: z.string().max(30).nullable().optional(),
  bankIfsc: z.string().max(15).nullable().optional(),
  advancePolicyText: z.string().max(140).nullable().optional(),
  defaultLocale: z.string().max(10).optional(),
});

export async function PATCH(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("VALIDATION_FAILED", "Check the settings and try again.");
  }

  const body = parsed.data;

  if (body.whatsappNumber) {
    const digits = body.whatsappNumber.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      return apiError("VALIDATION_FAILED", "Enter a valid WhatsApp number.");
    }
  }

  if (body.upiId && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(body.upiId)) {
    return apiError("VALIDATION_FAILED", "Enter a UPI ID like name@bank.");
  }

  let handle = auth.business.handle;
  if (body.handle && body.handle !== auth.business.handle) {
    const problem = validateHandle(body.handle);
    if (problem) return apiError("VALIDATION_FAILED", problem);
    const [taken] = await db
      .select({ id: businesses.id })
      .from(businesses)
      .where(eq(businesses.handle, body.handle))
      .limit(1);
    if (taken) {
      return apiError("CONFLICT", "That store link is taken. Try another.");
    }
    handle = body.handle;
  }

  await db
    .update(businesses)
    .set({
      businessName: body.businessName ?? auth.business.businessName,
      handle,
      tagline:
        body.tagline === undefined ? auth.business.tagline : body.tagline || null,
      locality:
        body.locality === undefined
          ? auth.business.locality
          : body.locality || null,
      whatsappNumber:
        body.whatsappNumber?.replace(/\D/g, "") ?? auth.business.whatsappNumber,
      upiId: body.upiId === undefined ? auth.business.upiId : body.upiId || null,
      noticeBanner:
        body.noticeBanner === undefined
          ? auth.business.noticeBanner
          : body.noticeBanner || null,
      addressPlaceholder:
        body.addressPlaceholder ?? auth.business.addressPlaceholder,
      enableTimeSlots:
        body.enableTimeSlots ?? auth.business.enableTimeSlots,
      privacyMode: body.privacyMode ?? auth.business.privacyMode,
      showBankDetails: body.showBankDetails ?? auth.business.showBankDetails,
      bankAccountName:
        body.bankAccountName === undefined
          ? auth.business.bankAccountName
          : body.bankAccountName || null,
      bankAccountNumber:
        body.bankAccountNumber === undefined
          ? auth.business.bankAccountNumber
          : body.bankAccountNumber || null,
      bankIfsc:
        body.bankIfsc === undefined
          ? auth.business.bankIfsc
          : body.bankIfsc || null,
      advancePolicyText:
        body.advancePolicyText === undefined
          ? auth.business.advancePolicyText
          : body.advancePolicyText || null,
      defaultLocale: body.defaultLocale ?? auth.business.defaultLocale,
      updatedAt: new Date(),
    })
    .where(eq(businesses.id, auth.business.id));

  return apiData({ handle });
}
