import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { customers, orders } from "@/db/schema";
import { apiData } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { dec } from "@/lib/money";
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

    if (order.status !== "settled" && order.status !== "cancelled") {
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
