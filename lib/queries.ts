import { and, asc, desc, eq, gt, inArray, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  businesses,
  catalogItems,
  customers,
  expenses,
  itemExtras,
  itemOptions,
  media,
  orderItems,
  orderPayments,
  orders,
  pendingOrders,
} from "@/db/schema";
import { dec, formatAmount, formatCompactAmount } from "./money";
import { summarizeIncompleteOrders } from "./home-orders";
import type {
  CustomerDue,
  DayOrderItem,
  HomeDashboardData,
  IncompleteOrder,
  HomeKpi,
  PendingRequestItem,
} from "./home-types";

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

export async function getShopLogoUrl(businessId: string): Promise<string | null> {
  const [logo] = await db
    .select({ objectKey: media.objectKey })
    .from(media)
    .where(and(eq(media.businessId, businessId), eq(media.kind, "logo")))
    .orderBy(desc(media.createdAt))
    .limit(1);

  return logo ? `/media/${logo.objectKey}` : null;
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

export function startOfWeekIst(): Date {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  const day = ist.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(ist.getTime() + diff * 864e5);
  return new Date(
    Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate()) -
      5.5 * 3600_000,
  );
}

export function formatDayHeading(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${days[date.getUTCDay()]}, ${d} ${months[date.getUTCMonth()]}`;
}

export function formatAge(date: Date): string {
  const diffMs = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${Math.max(1, minutes)}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
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

export async function getHomeDashboard(
  businessId: string,
  targetDayStr?: string,
): Promise<HomeDashboardData> {
  const [business] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.id, businessId))
    .limit(1);

  if (!business) {
    throw new Error("Business not found");
  }

  const now = new Date();
  const isPassExpired = Boolean(
    (business.passExpiresAt && business.passExpiresAt.getTime() < now.getTime()) ||
      (!business.passExpiresAt &&
        business.trialEndsAt &&
        business.trialEndsAt.getTime() < now.getTime()),
  );

  const todayStr = istDateString();
  const selectedDay =
    targetDayStr && /^\d{4}-\d{2}-\d{2}$/.test(targetDayStr)
      ? targetDayStr
      : todayStr;
  const isToday = selectedDay === todayStr;
  const selectedDayLabel = formatDayHeading(selectedDay);

  const todayStart = startOfTodayIst();
  const weekStart = startOfWeekIst();

  const [
    orderRows,
    incompleteRows,
    paymentRows,
    expenseRows,
    pendingRows,
    customerRows,
    itemsList,
    logoRows,
  ] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(eq(orders.businessId, businessId))
      .orderBy(desc(orders.createdAt))
      .limit(200),
    db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.businessId, businessId),
          inArray(orders.status, ["quote", "open_tab", "ready"]),
        ),
      ),
    db
      .select()
      .from(orderPayments)
      .where(eq(orderPayments.businessId, businessId))
      .orderBy(desc(orderPayments.paidAt))
      .limit(1000),
    db
      .select()
      .from(expenses)
      .where(eq(expenses.businessId, businessId))
      .orderBy(desc(expenses.expenseDate))
      .limit(200),
    db
      .select()
      .from(pendingOrders)
      .where(
        and(
          eq(pendingOrders.businessId, businessId),
          eq(pendingOrders.status, "pending"),
          gt(pendingOrders.expiresAt, now),
        ),
      )
      .orderBy(asc(pendingOrders.createdAt)),
    db
      .select()
      .from(customers)
      .where(eq(customers.businessId, businessId)),
    db
      .select({
        orderId: orderItems.orderId,
        name: orderItems.itemNameSnapshot,
      })
      .from(orderItems)
      .where(eq(orderItems.businessId, businessId)),
    db
      .select({ objectKey: media.objectKey })
      .from(media)
      .where(and(eq(media.businessId, businessId), eq(media.kind, "logo")))
      .orderBy(desc(media.createdAt))
      .limit(1),
  ]);

  // Map order item names
  const itemsByOrder = new Map<string, string[]>();
  for (const item of itemsList) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item.name);
    itemsByOrder.set(item.orderId, list);
  }

  function getOrderSummary(orderId: string): string {
    const items = itemsByOrder.get(orderId) ?? [];
    if (items.length === 0) return "1 item";
    if (items.length === 1) return items[0];
    return `${items[0]} · +${items.length - 1}`;
  }

  // 1. KPIs
  // Today's orders to collect (orders needed or created today where due > 0 and not settled/cancelled)
  let todayToCollectDue = dec(0);
  let todayToCollectCount = 0;
  for (const order of orderRows) {
    if (order.status === "settled" || order.status === "cancelled") continue;
    const isTargetToday =
      order.neededBy === todayStr ||
      order.createdAt.getTime() >= todayStart.getTime();
    if (!isTargetToday) continue;

    const due = dec(order.grandTotal)
      .minus(order.paidTotal)
      .minus(order.tdsTotal);
    if (due.greaterThan(0)) {
      todayToCollectDue = todayToCollectDue.plus(due);
      todayToCollectCount += 1;
    }
  }

  // Today's payments
  let todayPaidTotal = dec(0);
  const ordersPaidToday = new Set<string>();
  for (const p of paymentRows) {
    if (p.paidAt.getTime() >= todayStart.getTime()) {
      todayPaidTotal = todayPaidTotal.plus(p.amount);
      ordersPaidToday.add(p.orderId);
    }
  }

  // This week's sales (revenue subtotal)
  let weekSalesTotal = dec(0);
  let weekSalesCount = 0;
  for (const order of orderRows) {
    if (order.status === "cancelled") continue;
    if (order.createdAt.getTime() >= weekStart.getTime()) {
      weekSalesTotal = weekSalesTotal.plus(order.revenueSubtotal);
      weekSalesCount += 1;
    }
  }

  // This week's expenses
  let weekExpenseTotal = dec(0);
  let weekExpenseCount = 0;
  for (const e of expenseRows) {
    if (new Date(`${e.expenseDate}T00:00:00`).getTime() >= weekStart.getTime()) {
      weekExpenseTotal = weekExpenseTotal.plus(e.amount);
      weekExpenseCount += 1;
    }
  }

  // This week's cash left
  const weekCash = cashSummary(orderRows, paymentRows, expenseRows, weekStart);

  const kpis: HomeDashboardData["kpis"] = {
    todayToCollect: {
      label: "Today · To collect",
      amount: formatAmount(todayToCollectDue),
      compactAmount: formatCompactAmount(todayToCollectDue),
      rawAmount: todayToCollectDue.toNumber(),
      count: todayToCollectCount,
      countLabel: `${todayToCollectCount} ${todayToCollectCount === 1 ? "order" : "orders"}`,
      period: "Today",
    },
    todayPaid: {
      label: "Today · Paid",
      amount: formatAmount(todayPaidTotal),
      compactAmount: formatCompactAmount(todayPaidTotal),
      rawAmount: todayPaidTotal.toNumber(),
      count: ordersPaidToday.size,
      countLabel: `${ordersPaidToday.size} ${ordersPaidToday.size === 1 ? "order" : "orders"}`,
      period: "Today",
    },
    thisWeekSales: {
      label: "This week · Sales",
      amount: formatAmount(weekSalesTotal),
      compactAmount: formatCompactAmount(weekSalesTotal),
      rawAmount: weekSalesTotal.toNumber(),
      count: weekSalesCount,
      countLabel: `${weekSalesCount} ${weekSalesCount === 1 ? "order" : "orders"}`,
      period: "Monday to Sunday",
    },
    thisWeekExpenses: {
      label: "This week · Expenses",
      amount: formatAmount(weekExpenseTotal),
      compactAmount: formatCompactAmount(weekExpenseTotal),
      rawAmount: weekExpenseTotal.toNumber(),
      count: weekExpenseCount,
      countLabel: `${weekExpenseCount} ${weekExpenseCount === 1 ? "entry" : "entries"}`,
      period: "Monday to Sunday",
    },
    thisWeekCashLeft: {
      label: "This week · Cash left",
      amount: formatAmount(weekCash.left),
      compactAmount: formatCompactAmount(weekCash.left),
      rawAmount: dec(weekCash.left).toNumber(),
      period: "Monday to Sunday",
      hint: "Received − expenses · not profit",
    },
  };

  // 2. Pending storefront requests
  const oldestPending = pendingRows[0];
  const oldestAge = oldestPending ? formatAge(oldestPending.createdAt) : "";
  const requests: HomeDashboardData["requests"] = {
    count: pendingRows.length,
    oldestAge,
    requests: pendingRows.map((p) => ({
      id: p.id,
      code: p.code,
      buyerName: p.buyerName,
      buyerPhone: p.buyerPhone,
      note: p.note,
      lines: p.lines.map((line) => ({
        itemName: line.itemName,
        optionName: line.optionName,
        extraNames: line.extraNames,
        quantity: line.quantity,
        unitLabel: line.unitLabel,
        lineTotal: formatAmount(line.lineTotal),
      })),
      itemCount: p.lines.length,
      grandTotal: formatAmount(p.grandTotal),
      createdAt: p.createdAt.toISOString(),
      timeSlot: p.timeSlot,
      neededBy: p.neededBy,
    })),
  };

  // 3. Day view for selectedDay
  const dayOrders = orderRows.filter(
    (order) => order.neededBy === selectedDay && order.status !== "cancelled",
  );

  const anyTime: DayOrderItem[] = [];
  const timeline: DayOrderItem[] = [];

  for (const order of dayOrders) {
    const due = dec(order.grandTotal)
      .minus(order.paidTotal)
      .minus(order.tdsTotal);
    const item: DayOrderItem = {
      id: order.id,
      code: order.orderCode,
      customerName: order.customerName || "Walk-in sale",
      itemsSummary: getOrderSummary(order.id),
      total: formatAmount(order.grandTotal),
      due: due.greaterThan(0) ? formatAmount(due) : "₹0.00",
      status: order.status as DayOrderItem["status"],
      timeSlot: order.timeSlot,
      neededBy: order.neededBy,
      isGhost: false,
    };

    if (
      !order.timeSlot ||
      order.timeSlot.trim().toLowerCase() === "any time" ||
      order.timeSlot.trim().toLowerCase() === "none"
    ) {
      anyTime.push(item);
    } else {
      timeline.push(item);
    }
  }

  // Sort timeline by timeSlot
  timeline.sort((a, b) => (a.timeSlot ?? "").localeCompare(b.timeSlot ?? ""));

  // Ghosts: pending orders for this day
  const ghosts: DayOrderItem[] = pendingRows
    .filter((p) => p.neededBy === selectedDay)
    .map((p) => ({
      id: p.id,
      code: p.code,
      customerName: p.buyerName,
      itemsSummary: `${Array.isArray(p.lines) ? p.lines.length : 1} items requested`,
      total: formatAmount(p.grandTotal),
      due: formatAmount(p.grandTotal),
      status: "quote",
      timeSlot: p.timeSlot,
      neededBy: p.neededBy,
      isGhost: true,
    }));

  // 4. All-date incomplete order queue. The API status only becomes settled
  // after work is ready and the full balance has been paid.
  const incompleteOrderRows: IncompleteOrder[] = incompleteRows.flatMap((order) => {
    if (
      order.status !== "quote" &&
      order.status !== "open_tab" &&
      order.status !== "ready"
    ) {
      return [];
    }
    const due = dec(order.grandTotal)
      .minus(order.paidTotal)
      .minus(order.tdsTotal)
      .greaterThan(0)
      ? dec(order.grandTotal).minus(order.paidTotal).minus(order.tdsTotal)
      : dec(0);
    if (order.status === "ready" && !due.greaterThan(0)) return [];

    return [{
      id: order.id,
      code: order.orderCode,
      customerName: order.customerName || "Walk-in sale",
      itemsSummary: getOrderSummary(order.id),
      total: formatAmount(order.grandTotal),
      due: formatAmount(due),
      duePaise: due.times(100).toNumber(),
      status: order.status,
      neededBy: order.neededBy,
      timeSlot: order.timeSlot,
      createdAt: order.createdAt.toISOString(),
    }];
  });
  const incompleteSummary = summarizeIncompleteOrders(incompleteOrderRows);
  const incompleteOrders: HomeDashboardData["incompleteOrders"] = {
    toFinishCount: incompleteSummary.toFinishCount,
    readyCount: incompleteSummary.readyCount,
    totalCount: incompleteSummary.totalCount,
    totalDue: formatAmount(dec(incompleteSummary.totalDuePaise).div(100)),
    orders: incompleteSummary.orders,
  };

  // 6. To collect from customers (Top 5 customers with pending balances)
  const customerDuesMap = new Map<string, { due: ReturnType<typeof dec>; lastPaid: Date | null }>();
  for (const order of orderRows) {
    if (order.status === "settled" || order.status === "cancelled") continue;
    if (!order.customerId) continue;

    const due = dec(order.grandTotal)
      .minus(order.paidTotal)
      .minus(order.tdsTotal);
    if (!due.greaterThan(0)) continue;

    const existing = customerDuesMap.get(order.customerId) ?? {
      due: dec(0),
      lastPaid: null,
    };
    customerDuesMap.set(order.customerId, {
      due: existing.due.plus(due),
      lastPaid: existing.lastPaid,
    });
  }

  // Associate customer details
  const customerDues: CustomerDue[] = [];
  for (const c of customerRows) {
    const entry = customerDuesMap.get(c.id);
    if (entry && entry.due.greaterThan(0)) {
      customerDues.push({
        id: c.id,
        name: c.name,
        pending: formatAmount(entry.due),
        lastPaidDate: c.lastPaidAt ? istDateString(c.lastPaidAt) : null,
      });
    }
  }

  // Sort by highest pending amount
  customerDues.sort((a, b) => {
    const aNum = Number(a.pending.replace(/[^0-9.]/g, ""));
    const bNum = Number(b.pending.replace(/[^0-9.]/g, ""));
    return bNum - aNum;
  });

  return {
    shopName: business.businessName,
    shopLogoUrl: logoRows[0] ? `/media/${logoRows[0].objectKey}` : null,
    handle: business.handle,
    isOwner: true,
    isPassExpired,
    selectedDay,
    selectedDayLabel,
    isToday,
    kpis,
    requests,
    dayView: {
      anyTime,
      timeline,
      ghosts,
    },
    incompleteOrders,
    customerDues: customerDues.slice(0, 5),
  };
}
