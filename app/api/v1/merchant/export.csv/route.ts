import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  customers,
  expenses,
  orderItems,
  orderPayments,
  orders,
} from "@/db/schema";
import { requireApiBusiness } from "@/lib/api-auth";
import { dec } from "@/lib/money";
import { isClosed } from "@/lib/order-status";

function cell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function row(values: unknown[]): string {
  return values.map(cell).join(",");
}

export async function GET(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const businessId = auth.business.id;
  const [orderRows, itemRows, paymentRows, expenseRows, customerRows] =
    await Promise.all([
      db
        .select()
        .from(orders)
        .where(eq(orders.businessId, businessId))
        .orderBy(desc(orders.createdAt)),
      db
        .select()
        .from(orderItems)
        .where(eq(orderItems.businessId, businessId)),
      db
        .select()
        .from(orderPayments)
        .where(eq(orderPayments.businessId, businessId))
        .orderBy(desc(orderPayments.paidAt)),
      db
        .select()
        .from(expenses)
        .where(eq(expenses.businessId, businessId)),
      db
        .select()
        .from(customers)
        .where(eq(customers.businessId, businessId)),
    ]);

  const orderById = new Map(orderRows.map((order) => [order.id, order]));
  const pendingByCustomer = new Map<string, ReturnType<typeof dec>>();
  for (const order of orderRows) {
    if (isClosed(order.status)) continue;
    if (!order.customerId) continue;
    const due = dec(order.grandTotal)
      .minus(order.paidTotal)
      .minus(order.tdsTotal);
    pendingByCustomer.set(
      order.customerId,
      (pendingByCustomer.get(order.customerId) ?? dec(0)).plus(due),
    );
  }

  const lines: string[] = [];
  lines.push("Orders");
  lines.push(
    row([
      "Order code",
      "Created",
      "Status",
      "Source",
      "Customer",
      "Phone",
      "Revenue subtotal",
      "Non-revenue",
      "Grand total",
      "Paid",
      "TDS",
      "Adjustment",
      "Adjustment reason",
    ]),
  );
  for (const order of orderRows) {
    lines.push(
      row([
        order.orderCode,
        order.createdAt.toISOString(),
        order.status,
        order.source,
        order.customerName,
        order.customerPhone,
        order.revenueSubtotal,
        order.nonRevenueTotal,
        order.grandTotal,
        order.paidTotal,
        order.tdsTotal,
        order.adjustmentAmount,
        order.adjustmentReason,
      ]),
    );
  }

  lines.push("");
  lines.push("Items");
  lines.push(
    row([
      "Order code",
      "Item",
      "Option",
      "Extras",
      "Quantity",
      "Unit price",
      "Line total",
      "Kind",
    ]),
  );
  for (const item of itemRows) {
    lines.push(
      row([
        orderById.get(item.orderId)?.orderCode ?? "",
        item.itemNameSnapshot,
        item.optionSnapshot,
        (item.extrasSnapshot ?? []).map((extra) => extra.name).join("; "),
        item.quantity,
        item.unitPrice,
        item.lineTotal,
        item.lineKind,
      ]),
    );
  }

  lines.push("");
  lines.push("Payments");
  lines.push(row(["Order code", "Amount", "TDS", "Mode", "Date", "Note"]));
  for (const payment of paymentRows) {
    lines.push(
      row([
        orderById.get(payment.orderId)?.orderCode ?? "",
        payment.amount,
        payment.tdsDeducted,
        payment.paymentMode,
        payment.paidAt.toISOString(),
        payment.note,
      ]),
    );
  }

  lines.push("");
  lines.push("Expenses");
  lines.push(row(["Title", "Amount", "Date"]));
  for (const expense of expenseRows) {
    lines.push(row([expense.title, expense.amount, expense.expenseDate]));
  }

  lines.push("");
  lines.push("Customers");
  lines.push(row(["Name", "Phone", "Sub label", "Pending"]));
  for (const customer of customerRows) {
    lines.push(
      row([
        customer.name,
        customer.phone,
        customer.subLabel,
        (pendingByCustomer.get(customer.id) ?? dec(0)).toFixed(2),
      ]),
    );
  }

  const csv = `\uFEFF${lines.join("\r\n")}`;
  const filename = `startlite-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
