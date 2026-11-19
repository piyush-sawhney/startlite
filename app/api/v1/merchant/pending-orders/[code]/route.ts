import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { pendingOrders } from "@/db/schema";
import { apiData, apiError } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const { code } = await params;
  const [row] = await db
    .delete(pendingOrders)
    .where(
      and(
        eq(pendingOrders.code, code),
        eq(pendingOrders.businessId, auth.business.id),
        gt(pendingOrders.expiresAt, new Date()),
      ),
    )
    .returning({ id: pendingOrders.id });

  if (!row) return apiError("NOT_FOUND", "This order link has expired.");
  return apiData({ declined: true });
}
