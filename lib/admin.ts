import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  auditLog,
  businesses,
  catalogItems,
  orders,
  platformSettings,
  subscriptionPayments,
  user,
} from "@/db/schema";
import { dec, money, sum } from "./money";
import { storefrontStatus } from "./shop";

export type AdminBusinessSummary = {
  id: string;
  handle: string;
  businessName: string;
  categoryPack: string;
  whatsappNumber: string;
  locality: string | null;
  ownerEmail: string;
  ownerName: string;
  status: "live" | "paused" | "disabled";
  trialEndsAt: Date;
  passExpiresAt: Date | null;
  disabledAt: Date | null;
  createdAt: Date;
  itemCount: number;
  orderCount: number;
};

/**
 * Calculates the next expiry date when adding days to a subscription.
 * - If the pass is currently active, extends from the current pass expiry.
 * - Else if the trial is currently active, extends from the trial end.
 * - Else (already expired), extends from now.
 */
export function calculateNewPassExpiry(
  passExpiresAt: Date | null,
  trialEndsAt: Date,
  days = 90,
  now = new Date(),
): Date {
  const nowMs = now.getTime();
  const passMs = passExpiresAt?.getTime() ?? 0;
  const trialMs = trialEndsAt.getTime();

  let baseMs = nowMs;
  if (passMs > nowMs) {
    baseMs = passMs;
  } else if (trialMs > nowMs) {
    baseMs = trialMs;
  }

  return new Date(baseMs + days * 864e5);
}

/**
 * Formats an official StartLite GST subscription invoice number.
 */
export function formatInvoiceNumber(prefix: string, serial: number): string {
  const cleanPrefix = prefix.trim() || "SL";
  return `${cleanPrefix}-${String(serial).padStart(4, "0")}`;
}

/**
 * Gets or initializes the platform settings (singleton row id = 1).
 */
export async function getPlatformSettings() {
  const [existing] = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.id, 1))
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(platformSettings)
    .values({
      id: 1,
      legalName: "StartLite Technologies Pvt Ltd",
      gstin: "27AAAAA0000A1Z5",
      registeredAddress: "Pune, Maharashtra, India",
      sac: "998314",
      invoicePrefix: "SL",
      nextInvoiceNo: 1,
    })
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  const [fresh] = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.id, 1))
    .limit(1);
  return fresh;
}

/**
 * Aggregates high-level metrics for the platform owner dashboard.
 */
export async function getPlatformStats() {
  const allBusinesses = await db.select().from(businesses);
  const totalUsers = await db.select({ count: sql<number>`count(*)::int` }).from(user);
  const totalOrders = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
  const payments = await db.select().from(subscriptionPayments);

  let liveCount = 0;
  let pausedCount = 0;
  let disabledCount = 0;
  let activePassesCount = 0;
  const now = Date.now();

  for (const b of allBusinesses) {
    const status = storefrontStatus(b);
    if (status === "live") liveCount += 1;
    else if (status === "paused") pausedCount += 1;
    else if (status === "disabled") disabledCount += 1;

    if (b.passExpiresAt && b.passExpiresAt.getTime() > now) {
      activePassesCount += 1;
    }
  }

  const revenueInr = sum(payments.map((p) => p.amountInr));

  return {
    totalBusinesses: allBusinesses.length,
    liveCount,
    pausedCount,
    disabledCount,
    activePassesCount,
    totalUsers: totalUsers[0]?.count ?? 0,
    totalOrders: totalOrders[0]?.count ?? 0,
    totalSubscriptions: payments.length,
    revenueInr,
  };
}

/**
 * Lists all businesses with owner details and storefront status.
 */
export async function listAdminBusinesses(
  searchQuery?: string,
): Promise<AdminBusinessSummary[]> {
  const query = searchQuery?.trim();
  const filter = query
    ? or(
        ilike(businesses.handle, `%${query}%`),
        ilike(businesses.businessName, `%${query}%`),
        ilike(businesses.whatsappNumber, `%${query}%`),
      )
    : undefined;

  const rows = await db
    .select({
      business: businesses,
      owner: user,
    })
    .from(businesses)
    .innerJoin(user, eq(businesses.ownerUserId, user.id))
    .where(filter)
    .orderBy(desc(businesses.createdAt));

  if (rows.length === 0) return [];

  const businessIds = rows.map((r) => r.business.id);

  const [itemCounts, orderCounts] = await Promise.all([
    db
      .select({
        businessId: catalogItems.businessId,
        count: sql<number>`count(*)::int`,
      })
      .from(catalogItems)
      .where(sql`${catalogItems.businessId} IN ${businessIds}`)
      .groupBy(catalogItems.businessId),
    db
      .select({
        businessId: orders.businessId,
        count: sql<number>`count(*)::int`,
      })
      .from(orders)
      .where(sql`${orders.businessId} IN ${businessIds}`)
      .groupBy(orders.businessId),
  ]);

  const itemMap = new Map(itemCounts.map((i) => [i.businessId, i.count]));
  const orderMap = new Map(orderCounts.map((o) => [o.businessId, o.count]));

  return rows.map(({ business, owner }) => ({
    id: business.id,
    handle: business.handle,
    businessName: business.businessName,
    categoryPack: business.categoryPack,
    whatsappNumber: business.whatsappNumber,
    locality: business.locality,
    ownerEmail: owner.email,
    ownerName: owner.name,
    status: storefrontStatus(business),
    trialEndsAt: business.trialEndsAt,
    passExpiresAt: business.passExpiresAt,
    disabledAt: business.disabledAt,
    createdAt: business.createdAt,
    itemCount: itemMap.get(business.id) ?? 0,
    orderCount: orderMap.get(business.id) ?? 0,
  }));
}

/**
 * Gets deep details of a business for the admin inspection view.
 */
export async function getAdminBusinessDetail(businessId: string) {
  const [row] = await db
    .select({
      business: businesses,
      owner: user,
    })
    .from(businesses)
    .innerJoin(user, eq(businesses.ownerUserId, user.id))
    .where(eq(businesses.id, businessId))
    .limit(1);

  if (!row) return null;

  const [items, orderList, payments, audit] = await Promise.all([
    db
      .select()
      .from(catalogItems)
      .where(eq(catalogItems.businessId, businessId))
      .orderBy(desc(catalogItems.createdAt))
      .limit(50),
    db
      .select()
      .from(orders)
      .where(eq(orders.businessId, businessId))
      .orderBy(desc(orders.createdAt))
      .limit(50),
    db
      .select()
      .from(subscriptionPayments)
      .where(eq(subscriptionPayments.businessId, businessId))
      .orderBy(desc(subscriptionPayments.createdAt)),
    db
      .select()
      .from(auditLog)
      .where(eq(auditLog.businessId, businessId))
      .orderBy(desc(auditLog.createdAt))
      .limit(50),
  ]);

  return {
    business: row.business,
    owner: row.owner,
    status: storefrontStatus(row.business),
    items,
    orders: orderList,
    subscriptionPayments: payments,
    auditLog: audit,
  };
}

/**
 * Activates a 90-day subscription pass for a merchant.
 * Generates an official GST invoice record and increments the platform serial number.
 */
export async function activateBusinessPass(
  businessId: string,
  actorUserId: string,
  note?: string,
) {
  return await db.transaction(async (tx) => {
    const [business] = await tx
      .select()
      .from(businesses)
      .where(eq(businesses.id, businessId))
      .limit(1);

    if (!business) throw new Error("Business not found");

    const settings = await getPlatformSettings();
    const invoiceNo = formatInvoiceNumber(
      settings.invoicePrefix,
      settings.nextInvoiceNo,
    );

    const newPassExpiry = calculateNewPassExpiry(
      business.passExpiresAt,
      business.trialEndsAt,
      90,
    );

    await tx
      .update(platformSettings)
      .set({
        nextInvoiceNo: settings.nextInvoiceNo + 1,
        updatedAt: new Date(),
      })
      .where(eq(platformSettings.id, settings.id));

    await tx
      .update(businesses)
      .set({
        passExpiresAt: newPassExpiry,
        disabledAt: null,
        updatedAt: new Date(),
      })
      .where(eq(businesses.id, business.id));

    const todayStr = new Date().toISOString().slice(0, 10);
    const validUntilStr = newPassExpiry.toISOString().slice(0, 10);

    const [payment] = await tx
      .insert(subscriptionPayments)
      .values({
        businessId: business.id,
        invoiceNo,
        amountInr: "130.98",
        method: "manual",
        status: "captured",
        validFrom: todayStr,
        validUntil: validUntilStr,
        activatedBy: actorUserId,
        note: note?.trim() || "Manual activation (90 days)",
      })
      .returning();

    await tx.insert(auditLog).values({
      actorUserId,
      businessId: business.id,
      action: "pass.activated",
      entity: "businesses",
      entityId: business.id,
      meta: {
        invoiceNo,
        amountInr: "130.98",
        passExpiresAt: newPassExpiry.toISOString(),
        paymentId: payment.id,
      },
    });

    return {
      businessId: business.id,
      invoiceNo,
      passExpiresAt: newPassExpiry,
      payment,
    };
  });
}

/**
 * Toggles account suspension (disabled_at).
 */
export async function toggleBusinessSuspension(
  businessId: string,
  actorUserId: string,
  reason?: string,
) {
  return await db.transaction(async (tx) => {
    const [business] = await tx
      .select()
      .from(businesses)
      .where(eq(businesses.id, businessId))
      .limit(1);

    if (!business) throw new Error("Business not found");

    const willDisable = !business.disabledAt;
    const disabledAt = willDisable ? new Date() : null;

    await tx
      .update(businesses)
      .set({
        disabledAt,
        updatedAt: new Date(),
      })
      .where(eq(businesses.id, business.id));

    await tx.insert(auditLog).values({
      actorUserId,
      businessId: business.id,
      action: willDisable ? "business.suspended" : "business.restored",
      entity: "businesses",
      entityId: business.id,
      meta: {
        reason: reason?.trim() || null,
        disabledAt: disabledAt ? disabledAt.toISOString() : null,
      },
    });

    return {
      businessId: business.id,
      disabled: willDisable,
      status: willDisable ? "disabled" : storefrontStatus({ ...business, disabledAt }),
    };
  });
}
