import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { pendingOrders } from "@/db/schema";
import { apiData } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";

export async function GET(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const rows = await db
    .select()
    .from(pendingOrders)
    .where(
      and(
        eq(pendingOrders.businessId, auth.business.id),
        eq(pendingOrders.status, "pending"),
        gt(pendingOrders.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(pendingOrders.createdAt));

  return apiData({ pendingOrders: rows });
}
