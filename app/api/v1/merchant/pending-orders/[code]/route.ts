import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { pendingOrders } from "@/db/schema";
import { apiData, apiError } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { lineChanged, priceLines } from "@/lib/pending";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const { code } = await params;
  const [pending] = await db
    .select()
    .from(pendingOrders)
    .where(
      and(
        eq(pendingOrders.code, code),
        eq(pendingOrders.businessId, auth.business.id),
        eq(pendingOrders.status, "pending"),
        gt(pendingOrders.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!pending) return apiError("NOT_FOUND", "This order link has expired.");

  const priced = await priceLines(
    auth.business.id,
    pending.lines.map((line) => ({
      itemId: line.itemId,
      optionId: line.optionId,
      extraIds: line.extraIds,
      quantity: line.quantity,
    })),
  );

  const currentByIndex = priced.ok ? priced.cart.lines : [];
  const anyChanged =
    !priced.ok ||
    pending.lines.some((line, index) => {
      const current = currentByIndex[index];
      return current ? lineChanged(line, current) : true;
    });

  return apiData({
    pendingOrder: pending,
    currentLines: currentByIndex,
    anyChanged,
  });
}

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
