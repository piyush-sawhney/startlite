import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { customers, orders } from "@/db/schema";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { normalizeCustomerAddress } from "@/lib/customer-address";
import { dec } from "@/lib/money";
import { isClosed } from "@/lib/order-status";
import { orderDue } from "@/lib/queries";

export async function GET(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const [customerRows, orderRows] = await Promise.all([
    db
      .select()
      .from(customers)
      .where(eq(customers.businessId, auth.business.id))
      .orderBy(desc(customers.createdAt)),
    db
      .select()
      .from(orders)
      .where(eq(orders.businessId, auth.business.id)),
  ]);

  const pendingByCustomer = new Map<string, string>();
  const orderCountByCustomer = new Map<string, number>();

  for (const order of orderRows) {
    if (!order.customerId) continue;
    orderCountByCustomer.set(
      order.customerId,
      (orderCountByCustomer.get(order.customerId) ?? 0) + 1,
    );

    if (!isClosed(order.status)) {
      const current = dec(pendingByCustomer.get(order.customerId) ?? "0.00");
      const due = orderDue(order);
      pendingByCustomer.set(order.customerId, current.plus(due).toFixed(2));
    }
  }

  const result = customerRows.map((c) => ({
    ...c,
    pendingTotal: pendingByCustomer.get(c.id) ?? "0.00",
    orderCount: orderCountByCustomer.get(c.id) ?? 0,
  }));

  result.sort((a, b) => {
    const diff = dec(b.pendingTotal).minus(a.pendingTotal);
    if (!diff.isZero()) return diff.toNumber();
    return a.name.localeCompare(b.name);
  });

  return apiData({ customers: result });
}

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

const createCustomerSchema = z.object({
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

export async function POST(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const parsed = createCustomerSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError(
      "VALIDATION_FAILED",
      parsed.error.issues[0]?.message ?? "Check customer details.",
      parsed.error.issues,
    );
  }

  const { name, phone, email, subLabel, notes, address } = parsed.data;
  const cleanPhone = phone ? phone.replace(/\D/g, "").slice(-10) || null : null;
  const cleanEmail = email?.trim() || null;
  const cleanAddress =
    address === undefined ? undefined : normalizeCustomerAddress(address);

  if (cleanPhone) {
    const [existing] = await db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.businessId, auth.business.id),
          eq(customers.phone, cleanPhone),
        ),
      )
      .limit(1);

    if (existing) {
      // Update name/subLabel if empty on existing
      const [updated] = await db
        .update(customers)
        .set({
          name: name || existing.name,
          email: cleanEmail,
          subLabel: subLabel ?? existing.subLabel,
          notes: notes ?? existing.notes,
          ...(cleanAddress !== undefined ? { address: cleanAddress } : {}),
        })
        .where(eq(customers.id, existing.id))
        .returning();

      return apiData({ customerId: updated.id, customer: updated });
    }
  }

  const [created] = await db
    .insert(customers)
    .values({
      businessId: auth.business.id,
      name,
      phone: cleanPhone,
      email: cleanEmail,
      subLabel: subLabel || null,
      notes: notes || null,
      address: cleanAddress ?? null,
    })
    .returning();

  return apiData({ customerId: created.id, customer: created }, 201);
}
