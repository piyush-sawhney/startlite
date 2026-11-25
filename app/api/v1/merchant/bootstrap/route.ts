import { and, desc, eq, gt, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  catalogItems,
  customers,
  orders,
  pendingOrders,
} from "@/db/schema";
import { apiData } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { dec, formatAmount } from "@/lib/money";
import {
  getMerchantSnapshot,
  getPublicItems,
  orderDue,
  startOfTodayIst,
} from "@/lib/queries";
import { storefrontStatus } from "@/lib/shop";
import { isCancelled, isClosed } from "@/lib/order-status";

export async function GET(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const { business, user } = auth;
  const status = storefrontStatus(business);

  const [catalog, snapshot, pendingRows] = await Promise.all([
    getPublicItems(business.id),
    getMerchantSnapshot(business.id),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(pendingOrders)
      .where(
        and(
          eq(pendingOrders.businessId, business.id),
          eq(pendingOrders.status, "pending"),
          gt(pendingOrders.expiresAt, new Date()),
        ),
      ),
  ]);

  const today = startOfTodayIst();

  const todaySales = snapshot.orders
    .filter(
      (order) =>
        !isCancelled(order.status) &&
        order.createdAt.getTime() >= today.getTime(),
    )
    .reduce((total, order) => total.plus(dec(order.revenueSubtotal)), dec(0));

  const receivedToday = snapshot.payments
    .filter((payment) => payment.paidAt.getTime() >= today.getTime())
    .reduce((total, payment) => total.plus(dec(payment.amount)), dec(0));

  const pendingAmount = snapshot.orders
    .filter((order) => !isClosed(order.status))
    .reduce((total, order) => total.plus(dec(orderDue(order))), dec(0));

  return apiData({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      locale: user.locale,
    },
    business,
    status,
    catalog,
    orders: snapshot.orders.slice(0, 30),
    customers: snapshot.customers,
    pendingCount: pendingRows[0]?.count ?? 0,
    metrics: {
      todaySales: todaySales.toFixed(2),
      receivedToday: receivedToday.toFixed(2),
      pendingAmount: pendingAmount.toFixed(2),
    },
  });
}
