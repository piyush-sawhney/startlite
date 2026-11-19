import { and, asc, desc, eq, gt, inArray, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  businesses,
  catalogItems,
  customers,
  expenses,
  itemExtras,
  itemOptions,
  orderItems,
  orderPayments,
  orders,
  pendingOrders,
} from "@/db/schema";
import { dec } from "./money";

export type PublicItem = {
  id: string;
  name: string;
  subtitle: string | null;
  itemType: string;
  priceMode: string;
  basePrice: string;
  unitLabel: string;
  isAvailable: boolean;
  imageKey: string | null;
  customerPrompt: string | null;
  options: Array<{
    id: string;
    name: string;
    price: string;
    isAvailable: boolean;
  }>;
  extras: Array<{
    id: string;
    name: string;
    priceDelta: string;
    isMultiSelect: boolean;
    optionId: string | null;
    isAvailable: boolean;
  }>;
};

export type PaymentRow = typeof orderPayments.$inferSelect;

export async function getShop(handle: string) {
  const [business] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.handle, handle))
    .limit(1);
  return business ?? null;
}

export async function getPublicItems(
  businessId: string,
): Promise<PublicItem[]> {
  const items = await db
    .select()
    .from(catalogItems)
    .where(
      and(
        eq(catalogItems.businessId, businessId),
        isNull(catalogItems.deletedAt),
      ),
    )
    .orderBy(asc(catalogItems.sortOrder), asc(catalogItems.createdAt));

  if (items.length === 0) return [];
  const itemIds = items.map((item) => item.id);

  const [options, extras] = await Promise.all([
    db
      .select()
      .from(itemOptions)
      .where(inArray(itemOptions.itemId, itemIds))
      .orderBy(asc(itemOptions.sortOrder)),
    db
      .select()
      .from(itemExtras)
      .where(inArray(itemExtras.itemId, itemIds))
      .orderBy(asc(itemExtras.sortOrder)),
  ]);

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    subtitle: item.subtitle,
    itemType: item.itemType,
    priceMode: item.priceMode,
    basePrice: item.basePrice,
    unitLabel: item.unitLabel,
    isAvailable: item.isAvailable,
    imageKey: item.imageKey,
    customerPrompt: item.customerPrompt,
    options: options
      .filter((option) => option.itemId === item.id)
      .map((option) => ({
        id: option.id,
        name: option.name,
        price: option.price,
        isAvailable: option.isAvailable,
      })),
    extras: extras
      .filter((extra) => extra.itemId === item.id)
      .map((extra) => ({
        id: extra.id,
        name: extra.name,
        priceDelta: extra.priceDelta,
        isMultiSelect: extra.isMultiSelect,
        optionId: extra.parentOptionId,
        isAvailable: extra.isAvailable,
      })),
  }));
}

export async function getAllPayments(
  businessId: string,
  limit = 1000,
): Promise<PaymentRow[]> {
  return db
    .select()
    .from(orderPayments)
    .where(eq(orderPayments.businessId, businessId))
    .orderBy(desc(orderPayments.paidAt))
    .limit(limit);
}

export async function getMerchantSnapshot(businessId: string) {
  const [
    orderRows,
    customerRows,
    itemRows,
    expenseRows,
    pendingRows,
    paymentRows,
    countRows,
  ] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(eq(orders.businessId, businessId))
      .orderBy(desc(orders.createdAt))
      .limit(100),
    db
      .select()
      .from(customers)
      .where(eq(customers.businessId, businessId))
      .orderBy(asc(customers.name)),
    getPublicItems(businessId),
    db
      .select()
      .from(expenses)
      .where(eq(expenses.businessId, businessId))
      .orderBy(desc(expenses.expenseDate))
      .limit(100),
    db
      .select()
      .from(pendingOrders)
      .where(
        and(
          eq(pendingOrders.businessId, businessId),
          eq(pendingOrders.status, "pending"),
        ),
      )
      .orderBy(desc(pendingOrders.createdAt)),
    getAllPayments(businessId),
    db
      .select({
        orderId: orderItems.orderId,
        count: sql<number>`count(*)::int`,
      })
      .from(orderItems)
      .where(eq(orderItems.businessId, businessId))
      .groupBy(orderItems.orderId),
  ]);

  const itemCounts = new Map<string, number>();
  for (const row of countRows) itemCounts.set(row.orderId, row.count);

  const pendingByCustomer = new Map<string, string>();
  for (const order of orderRows) {
    if (order.status === "settled" || order.status === "cancelled") continue;
    if (!order.customerId) continue;
    const due = dec(order.grandTotal)
      .minus(order.paidTotal)
      .minus(order.tdsTotal);
    if (due.lessThanOrEqualTo(0)) continue;
    pendingByCustomer.set(
      order.customerId,
      dec(pendingByCustomer.get(order.customerId) ?? 0).plus(due).toFixed(2),
    );
  }

  const openOrders = orderRows.filter(
    (order) => order.status !== "settled" && order.status !== "cancelled",
  );

  const pendingTotal = openOrders
    .reduce(
      (total, order) =>
        total.plus(
          dec(order.grandTotal).minus(order.paidTotal).minus(order.tdsTotal),
        ),
      dec(0),
    )
    .toFixed(2);

  return {
    orders: orderRows,
    openOrders,
    customers: customerRows,
    items: itemRows,
    expenses: expenseRows,
    pendingOrders: pendingRows,
    payments: paymentRows,
    itemCounts,
    pendingByCustomer,
    pendingTotal,
  };
}

export function startOfTodayIst(): Date {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  return new Date(
    Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) -
      5.5 * 3600_000,
  );
}

export function startOfMonthIst(): Date {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  return new Date(
    Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1) - 5.5 * 3600_000,
  );
}

export function istDateString(date = new Date()): string {
  const ist = new Date(date.getTime() + 5.5 * 3600_000);
  return ist.toISOString().slice(0, 10);
}

export function addDaysIst(days: number): string {
  return istDateString(new Date(Date.now() + days * 864e5));
}

export function orderDue(order: {
  grandTotal: string;
  paidTotal: string;
  tdsTotal: string;
}): string {
  return dec(order.grandTotal)
    .minus(order.paidTotal)
    .minus(order.tdsTotal)
    .toFixed(2);
}

/**
 * Money received against revenue lines. A payment covers revenue first.
 * Expenses are subtracted separately. This is cash left, never profit.
 */
export function cashSummary(
  orderRows: Array<{
    id: string;
    revenueSubtotal: string;
    status: string;
  }>,
  paymentRows: Array<{ orderId: string; amount: string; paidAt: Date }>,
  expenseRows: Array<{ amount: string; expenseDate: string }>,
  since: Date | null,
) {
  const orderById = new Map(orderRows.map((order) => [order.id, order]));
  const allocated = new Map<string, ReturnType<typeof dec>>();
  let received = dec(0);

  const sorted = [...paymentRows].sort(
    (a, b) => a.paidAt.getTime() - b.paidAt.getTime(),
  );

  for (const payment of sorted) {
    const order = orderById.get(payment.orderId);
    if (!order || order.status === "cancelled") continue;

    const revenue = dec(order.revenueSubtotal);
    const already = allocated.get(order.id) ?? dec(0);
    const room = revenue.minus(already);
    const amount = dec(payment.amount);
    const covered = amount.lessThan(room) ? amount : room;
    const positive = covered.greaterThan(0) ? covered : dec(0);

    allocated.set(order.id, already.plus(positive));

    if (!since || payment.paidAt.getTime() >= since.getTime()) {
      received = received.plus(positive);
    }
  }

  const spent = expenseRows
    .filter(
      (expense) =>
        !since || new Date(expense.expenseDate).getTime() >= since.getTime(),
    )
    .reduce((total, expense) => total.plus(expense.amount), dec(0));

  return {
    received: received.toFixed(2),
    spent: spent.toFixed(2),
    left: received.minus(spent).toFixed(2),
  };
}

export async function getPendingOrder(businessId: string, code: string) {
  const [row] = await db
    .select()
    .from(pendingOrders)
    .where(
      and(
        eq(pendingOrders.businessId, businessId),
        eq(pendingOrders.code, code),
        eq(pendingOrders.status, "pending"),
        gt(pendingOrders.expiresAt, new Date()),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function getOrder(id: string, businessId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.businessId, businessId)))
    .limit(1);
  if (!order) return null;
  const [lines, payments] = await Promise.all([
    db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id))
      .orderBy(asc(orderItems.createdAt)),
    db
      .select()
      .from(orderPayments)
      .where(eq(orderPayments.orderId, order.id))
      .orderBy(asc(orderPayments.paidAt)),
  ]);
  return { order, lines, payments };
}

export async function getCustomer(businessId: string, id: string) {
  const [row] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.businessId, businessId)))
    .limit(1);
  return row ?? null;
}

export async function getCustomerOrders(businessId: string, customerId: string) {
  return db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.businessId, businessId),
        eq(orders.customerId, customerId),
      ),
    )
    .orderBy(desc(orders.createdAt));
}

export async function nextBillNo(businessId: string) {
  const [business] = await db
    .select({ nextBillNo: businesses.nextBillNo })
    .from(businesses)
    .where(eq(businesses.id, businessId));
  return business?.nextBillNo ?? 1;
}
