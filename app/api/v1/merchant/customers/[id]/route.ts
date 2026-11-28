import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { normalizeCustomerAddress } from "@/lib/customer-address";

const addressSchema = z.object({
  line1: z.string().trim().max(120).nullable().optional(),
  line2: z.string().trim().max(120).nullable().optional(),
  line3: z.string().trim().max(120).nullable().optional(),
  locality: z.string().trim().max(80).nullable().optional(),
  city: z.string().trim().max(80).nullable().optional(),
  state: z.string().trim().max(80).nullable().optional(),
  country: z.string().trim().max(80).nullable().optional(),
  pincode: z.string().trim().max(12).nullable().optional(),
});

const updateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  phone: z.string().trim().max(20).nullable().optional(),
  email: z
    .string()
    .trim()
    .max(254)
    .nullable()
    .optional()
    .refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Invalid email address",
    ),
  subLabel: z.string().trim().max(100).nullable().optional(),
  notes: z.string().trim().max(500).nullable().optional(),
  address: addressSchema.nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = updateSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError(
      "VALIDATION_FAILED",
      parsed.error.issues[0]?.message ?? "Check the details.",
    );
  }

  const { id } = await params;
  const [existing] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.businessId, auth.business.id)))
    .limit(1);
  if (!existing) return apiError("NOT_FOUND", "Record not found.");

  const { name, phone, email, subLabel, notes, address } = parsed.data;
  const cleanPhone = phone ? phone.replace(/\D/g, "").slice(-10) || null : null;
  const cleanEmail = email?.trim() || null;

  if (cleanPhone) {
    const [other] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(
        and(
          eq(customers.businessId, auth.business.id),
          eq(customers.phone, cleanPhone),
          ne(customers.id, existing.id),
        ),
      )
      .limit(1);
    if (other) return apiError("CONFLICT", "That phone is already saved.");
  }

  const [updated] = await db
    .update(customers)
    .set({
      name,
      phone: cleanPhone,
      email: cleanEmail,
      subLabel: subLabel || null,
      notes: notes || null,
      address: normalizeCustomerAddress(address),
    })
    .where(eq(customers.id, existing.id))
    .returning();

  return apiData({ customer: updated });
}
