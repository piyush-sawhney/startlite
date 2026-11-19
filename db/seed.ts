import { eq } from "drizzle-orm";
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
  platformSettings,
  user,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { requireEnv } from "@/lib/env";
import { money, multiply, sum } from "@/lib/money";

const EMAIL = requireEnv("SEED_EMAIL");
const PASSWORD = requireEnv("SEED_PASSWORD");
const NAME = process.env.SEED_NAME?.trim() || "Anita Sharma";

async function main() {
  const [existing] = await db.select().from(user).where(eq(user.email, EMAIL));

  if (!existing) {
    await auth.api.signUpEmail({
      body: { email: EMAIL, password: PASSWORD, name: NAME },
    });
  }

  const [owner] = await db.select().from(user).where(eq(user.email, EMAIL));
  if (!owner) throw new Error("Seed user was not created");

  const [settings] = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.id, 1))
    .limit(1);

  if (!settings) {
    await db.insert(platformSettings).values({
      id: 1,
      legalName: "StartLite Technologies Pvt Ltd",
      gstin: "27AAAAA0000A1Z5",
      registeredAddress: "Kothrud, Pune 411038, Maharashtra, India",
      sac: "998314",
      invoicePrefix: "SL",
      nextInvoiceNo: 3,
    });
  }

  const [old] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.handle, "anitas-bakes"));

  if (old) {
    await db.delete(businesses).where(eq(businesses.id, old.id));
  }

  const [business] = await db
    .insert(businesses)
    .values({
      ownerUserId: owner.id,
      handle: "anitas-bakes",
      businessName: "Anita's Bakes",
      categoryPack: "bakery",
      category: "Home bakery",
      locality: "Kothrud, Pune",
      tagline: "Fresh cakes and cookies, baked to order.",
      whatsappNumber: "919876543210",
      upiId: "anita@okhdfcbank",
      showBankDetails: true,
      bankAccountName: "Anita Sharma",
      bankAccountNumber: "50100200300400",
      bankIfsc: "HDFC0001234",
      addressPlaceholder: "Message on cake, delivery area",
      enableTimeSlots: true,
      defaultLocale: "en",
      nextBillNo: 3,
    })
    .returning();

  const cake = await addItem(business.id, {
    name: "Chocolate cake",
    subtitle: "Dark chocolate, baked fresh",
    basePrice: "450.00",
    unitLabel: "cake",
    sortOrder: 1,
    options: [
      { name: "500 g", price: "450.00" },
      { name: "1 kg", price: "900.00" },
    ],
    extras: [{ name: "Eggless", priceDelta: "50.00" }],
    prompt: "Message on the cake?",
  });

  await addItem(business.id, {
    name: "Birthday cake",
    subtitle: "Choose a flavour in the note",
    basePrice: "900.00",
    unitLabel: "cake",
    sortOrder: 2,
    options: [
      { name: "500 g", price: "600.00" },
      { name: "1 kg", price: "900.00" },
    ],
    extras: [
      { name: "Eggless", priceDelta: "50.00" },
      { name: "Photo print", priceDelta: "150.00" },
    ],
  });

  await addItem(business.id, {
    name: "Butter cookies",
    subtitle: "250 g box",
    basePrice: "150.00",
    unitLabel: "box",
    sortOrder: 3,
    options: [],
    extras: [],
  });

  const [rohan] = await db
    .insert(customers)
    .values({
      businessId: business.id,
      name: "Rohan Mehta",
      phone: "919812345678",
      subLabel: "Rohan - office order",
    })
    .returning();

  const [meera] = await db
    .insert(customers)
    .values({
      businessId: business.id,
      name: "Meera Joshi",
      phone: "919898765432",
    })
    .returning();

  // Open order with a partial payment.
  const lineOne = {
    name: "Chocolate cake",
    option: "500 g",
    extras: [{ name: "Eggless", priceDelta: "50.00" }],
    quantity: "2",
    unitPrice: "500.00",
  };
  const lineTwo = {
    name: "Butter cookies",
    option: null as string | null,
    extras: [] as Array<{ name: string; priceDelta: string }>,
    quantity: "1",
    unitPrice: "150.00",
  };
  const openTotal = sum([
    multiply(lineOne.quantity, lineOne.unitPrice),
    multiply(lineTwo.quantity, lineTwo.unitPrice),
  ]);

  const [openOrder] = await db
    .insert(orders)
    .values({
      businessId: business.id,
      customerId: rohan.id,
      orderCode: "ORD-1001",
      status: "open_tab",
      source: "whatsapp_store",
      customerName: rohan.name,
      customerPhone: rohan.phone,
      neededBy: new Date().toISOString().slice(0, 10),
      timeSlot: "Evening",
      deliveryNote: "Gate 2, call on arrival",
      revenueSubtotal: openTotal,
      grandTotal: openTotal,
      paidTotal: "400.00",
      billNo: "1",
    })
    .returning();

  await db.insert(orderItems).values([
    {
      businessId: business.id,
      orderId: openOrder.id,
      catalogItemId: cake.id,
      itemNameSnapshot: lineOne.name,
      optionSnapshot: lineOne.option,
      extrasSnapshot: lineOne.extras,
      quantity: lineOne.quantity,
      unitPrice: lineOne.unitPrice,
      unitLabelSnapshot: "cake",
      lineTotal: multiply(lineOne.quantity, lineOne.unitPrice),
    },
    {
      businessId: business.id,
      orderId: openOrder.id,
      itemNameSnapshot: lineTwo.name,
      quantity: lineTwo.quantity,
      unitPrice: lineTwo.unitPrice,
      unitLabelSnapshot: "box",
      lineTotal: multiply(lineTwo.quantity, lineTwo.unitPrice),
    },
  ]);

  await db.insert(orderPayments).values({
    businessId: business.id,
    orderId: openOrder.id,
    amount: "400.00",
    paymentMode: "upi",
    note: "Advance",
  });

  // A settled order from last week.
  const settledTotal = "150.00";
  const [settled] = await db
    .insert(orders)
    .values({
      businessId: business.id,
      customerId: meera.id,
      orderCode: "ORD-1000",
      status: "settled",
      source: "walk_in",
      customerName: meera.name,
      customerPhone: meera.phone,
      neededBy: new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10),
      revenueSubtotal: settledTotal,
      grandTotal: settledTotal,
      paidTotal: settledTotal,
      billNo: "2",
    })
    .returning();

  await db.insert(orderItems).values({
    businessId: business.id,
    orderId: settled.id,
    itemNameSnapshot: "Butter cookies",
    quantity: "1",
    unitPrice: "150.00",
    unitLabelSnapshot: "box",
    lineTotal: settledTotal,
  });

  await db.insert(orderPayments).values({
    businessId: business.id,
    orderId: settled.id,
    amount: settledTotal,
    paymentMode: "cash",
    paidAt: new Date(Date.now() - 6 * 864e5),
  });

  await db.update(customers).set({ lastPaidAt: new Date() }).where(eq(customers.id, meera.id));

  await db.insert(expenses).values([
    {
      businessId: business.id,
      title: "Flour and chocolate",
      amount: "620.00",
      expenseDate: new Date().toISOString().slice(0, 10),
    },
    {
      businessId: business.id,
      title: "Delivery auto",
      amount: "180.00",
      expenseDate: new Date().toISOString().slice(0, 10),
    },
  ]);

  console.log("Seeded", {
    login: EMAIL,
    passwordSource: "SEED_PASSWORD",
    storefront: "/b/anitas-bakes",
    openOrderTotal: money(openTotal),
  });
}

async function addItem(
  businessId: string,
  input: {
    name: string;
    subtitle?: string;
    basePrice: string;
    unitLabel: string;
    sortOrder: number;
    options: Array<{ name: string; price: string }>;
    extras: Array<{ name: string; priceDelta: string }>;
    prompt?: string;
  },
) {
  const [item] = await db
    .insert(catalogItems)
    .values({
      businessId,
      name: input.name,
      subtitle: input.subtitle,
      basePrice: input.basePrice,
      unitLabel: input.unitLabel,
      sortOrder: input.sortOrder,
      customerPrompt: input.prompt,
    })
    .returning();

  const options = [];
  for (const [index, option] of input.options.entries()) {
    const [row] = await db
      .insert(itemOptions)
      .values({
        businessId,
        itemId: item.id,
        name: option.name,
        price: option.price,
        sortOrder: index,
      })
      .returning();
    options.push(row);
  }

  for (const [index, extra] of input.extras.entries()) {
    await db.insert(itemExtras).values({
      businessId,
      itemId: item.id,
      name: extra.name,
      priceDelta: extra.priceDelta,
      sortOrder: index,
    });
  }

  return item;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
