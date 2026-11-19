import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { businesses, orders } from "@/db/schema";
import {
  billHeaderName,
  compileBill,
  compileReminder,
  formatNeededBy,
  upiUri,
  whatsappLink,
} from "./bill";
import { dec } from "./money";
import { getOrder } from "./queries";

const BUSINESS_FIELDS = {
  id: businesses.id,
  businessName: businesses.businessName,
  whatsappNumber: businesses.whatsappNumber,
  upiId: businesses.upiId,
  nextBillNo: businesses.nextBillNo,
  privacyMode: businesses.privacyMode,
  showBankDetails: businesses.showBankDetails,
  bankAccountName: businesses.bankAccountName,
  bankAccountNumber: businesses.bankAccountNumber,
  bankIfsc: businesses.bankIfsc,
} as const;

export type BillShop = {
  id: string;
  businessName: string;
  whatsappNumber: string;
  upiId: string | null;
  nextBillNo: number;
  privacyMode: boolean;
  showBankDetails: boolean;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankIfsc: string | null;
};

export async function getBillShop(businessId: string): Promise<BillShop | null> {
  const [shop] = await db
    .select(BUSINESS_FIELDS)
    .from(businesses)
    .where(eq(businesses.id, businessId))
    .limit(1);
  return shop ?? null;
}

async function assignBillNo(shop: BillShop, order: { id: string; billNo: string | null }) {
  if (order.billNo) return order.billNo;

  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({ billNo: orders.billNo })
      .from(orders)
      .where(eq(orders.id, order.id))
      .for("update");

    if (current?.billNo) return current.billNo;

    const [updated] = await tx
      .update(businesses)
      .set({
        nextBillNo: sql`${businesses.nextBillNo} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(businesses.id, shop.id))
      .returning({ nextBillNo: businesses.nextBillNo });

    const billNo = String(updated.nextBillNo - 1);
    await tx.update(orders).set({ billNo }).where(eq(orders.id, order.id));
    return billNo;
  });
}

export async function buildBill(businessId: string, orderId: string) {
  const shop = await getBillShop(businessId);
  const record = await getOrder(orderId, businessId);
  if (!shop || !record) return null;

  const billNo = await assignBillNo(shop, record.order);
  const { order, lines, payments } = record;

  const paid = dec(order.paidTotal).toFixed(2);
  const due = dec(order.grandTotal)
    .minus(order.paidTotal)
    .minus(order.tdsTotal)
    .toFixed(2);
  const neededBy = formatNeededBy(order.neededBy);
  const headerName = billHeaderName(shop.businessName, shop.privacyMode);
  const bank =
    shop.showBankDetails &&
    (shop.bankAccountName || shop.bankAccountNumber || shop.bankIfsc)
      ? {
          name: shop.bankAccountName,
          number: shop.bankAccountNumber,
          ifsc: shop.bankIfsc,
        }
      : null;

  const billText = compileBill({
    shopName: shop.businessName,
    billNo,
    date: order.createdAt,
    customerName: order.customerName,
    lines: lines.map((line) => ({
      quantity: line.quantity,
      name: line.itemNameSnapshot,
      option: line.optionSnapshot,
      extras: line.extrasSnapshot ?? [],
      unitPrice: line.unitPrice,
      lineTotal: line.lineTotal,
    })),
    total: order.grandTotal,
    paid,
    due,
    upiId: shop.upiId,
    neededBy,
    privacyMode: shop.privacyMode,
    bank,
  });

  const reminderText = compileReminder({
    shopName: shop.businessName,
    billNo,
    date: order.createdAt,
    due,
    upiId: shop.upiId,
    privacyMode: shop.privacyMode,
  });

  return {
    order,
    lines,
    payments,
    billNo,
    paid,
    due,
    headerName,
    privacyMode: shop.privacyMode,
    billText,
    reminderText,
    upiUri:
      shop.upiId && dec(due).greaterThan(0)
        ? upiUri({
            upiId: shop.upiId,
            name: shop.businessName,
            amount: due,
          })
        : null,
    billWhatsappUrl: order.customerPhone
      ? whatsappLink(order.customerPhone, billText)
      : null,
    reminderWhatsappUrl: order.customerPhone
      ? whatsappLink(order.customerPhone, reminderText)
      : null,
    customerPhone: order.customerPhone,
    shopPhone: shop.whatsappNumber,
  };
}

export async function findBusinessIdByHandle(handle: string) {
  const [row] = await db
    .select({ id: businesses.id })
    .from(businesses)
    .where(and(eq(businesses.handle, handle), isNull(businesses.disabledAt)))
    .limit(1);
  return row?.id ?? null;
}
