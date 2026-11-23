import { eq, inArray } from "drizzle-orm";
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
  platformSettings,
  user,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { addDaysIst, startOfTodayIst } from "@/lib/date";
import { dec, money, multiply, sum } from "@/lib/money";
import { getPack } from "@/lib/packs";
import {
  CUSTOMER_NAMES,
  DEV_BUSINESSES,
  DEV_SEED_PASSWORD,
  PACK_SEED_PROFILES,
  type DevBusinessSeed,
  type PackSeedProfile,
} from "../dev-seed-data";
import { assertDevDatabase } from "./guard";

const TODAY = startOfTodayIst();

function atDay(dayOffset: number, hour: number, minute = 0): Date {
  return new Date(
    TODAY.getTime() + dayOffset * 864e5 + (hour * 60 + minute) * 60000,
  );
}

type SeededItem = {
  id: string;
  name: string;
  basePrice: string;
  unitLabel: string;
  options: Array<{ id: string; name: string; price: string }>;
  extra: { name: string; priceDelta: string } | null;
};

type SeededCustomer = {
  id: string;
  name: string;
  phone: string | null;
};

type SeedLine = {
  item: SeededItem;
  optionIndex?: number;
  quantity: string;
  withExtra?: boolean;
  note?: string | null;
};

type PaymentSeed = "full" | "none" | { percent: number };

type OrderSeed = {
  customer: SeededCustomer;
  code: string;
  status: string;
  source: string;
  neededBy: string;
  timeSlot: string | null;
  createdAt: Date;
  lines: SeedLine[];
  paid: PaymentSeed;
  paymentMode: string;
  billNo: string | null;
  deliveryNote?: string | null;
};

async function ensurePlatformSettings() {
  const [existing] = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.id, 1))
    .limit(1);

  if (existing) return;

  await db.insert(platformSettings).values({
    id: 1,
    legalName: "StartLite Technologies Pvt Ltd",
    gstin: "27AAAAA0000A1Z5",
    registeredAddress: "Kothrud, Pune 411038, Maharashtra, India",
    sac: "998314",
    invoicePrefix: "SL",
    nextInvoiceNo: 1,
  });
}

async function createOwner(seed: DevBusinessSeed) {
  await auth.api.signUpEmail({
    body: {
      email: seed.email,
      password: DEV_SEED_PASSWORD,
      name: seed.ownerName,
    },
  });

  const [owner] = await db
    .select()
    .from(user)
    .where(eq(user.email, seed.email))
    .limit(1);

  if (!owner) {
    throw new Error(`Sign-up did not create ${seed.email}`);
  }
  return owner;
}

async function seedItems(
  businessId: string,
  seed: DevBusinessSeed,
  profile: PackSeedProfile,
): Promise<SeededItem[]> {
  const pack = getPack(seed.pack);
  const definitions = [...pack.starters, seed.customItem];

  const inserted = await db
    .insert(catalogItems)
    .values(
      definitions.map((item, index) => ({
        businessId,
        name: item.name,
        subtitle: index === 0 ? profile.deliveryNote : null,
        basePrice: item.price,
        unitLabel: item.unit,
        sortOrder: index + 1,
        customerPrompt: index === 0 ? profile.customerNotes[0] : null,
      })),
    )
    .returning();

  // The first item and the custom item carry two variants, so every shop has
  // something to choose between in Add sale.
  const optionRows: Array<typeof itemOptions.$inferInsert> = [];
  for (const item of inserted) {
    const hasVariants =
      item.sortOrder === 1 || item.sortOrder === inserted.length;
    if (!hasVariants) continue;

    const base = dec(item.basePrice);
    optionRows.push(
      {
        businessId,
        itemId: item.id,
        name: profile.variants[0],
        price: money(base.times(0.6)),
        sortOrder: 0,
      },
      {
        businessId,
        itemId: item.id,
        name: profile.variants[1],
        price: money(base),
        sortOrder: 1,
      },
    );
  }

  const insertedOptions =
    optionRows.length > 0
      ? await db.insert(itemOptions).values(optionRows).returning()
      : [];

  const firstItem = inserted.find((item) => item.sortOrder === 1);
  if (firstItem) {
    await db.insert(itemExtras).values({
      businessId,
      itemId: firstItem.id,
      name: profile.extra.name,
      priceDelta: profile.extra.priceDelta,
      sortOrder: 0,
    });
  }

  return inserted.map((item) => ({
    id: item.id,
    name: item.name,
    basePrice: item.basePrice,
    unitLabel: item.unitLabel,
    options: insertedOptions
      .filter((option) => option.itemId === item.id)
      .map((option) => ({
        id: option.id,
        name: option.name,
        price: option.price,
      })),
    extra: item.sortOrder === 1 ? profile.extra : null,
  }));
}

async function seedCustomers(
  businessId: string,
  seedIndex: number,
  profile: PackSeedProfile,
): Promise<SeededCustomer[]> {
  const offset = (seedIndex * 5) % CUSTOMER_NAMES.length;

  const rows = Array.from({ length: 5 }, (_, index) => {
    const name = CUSTOMER_NAMES[(offset + index) % CUSTOMER_NAMES.length];
    const phoneIndex = seedIndex * 10 + index;
    const noPhone = index === 4;

    return {
      businessId,
      name,
      phone: noPhone
        ? null
        : `98765${String(phoneIndex).padStart(5, "0")}`,
      subLabel: index < 2 ? profile.customerNotes[index] : null,
      notes: index === 0 ? profile.deliveryNote : null,
    };
  });

  return db.insert(customers).values(rows).returning();
}

function buildLine(line: SeedLine) {
  const option =
    line.optionIndex === undefined
      ? null
      : (line.item.options[line.optionIndex] ?? null);
  const unitPrice = option?.price ?? line.item.basePrice;
  const extras =
    line.withExtra && line.item.extra ? [line.item.extra] : [];
  const lineTotal = multiply(line.quantity, unitPrice);

  return {
    row: {
      catalogItemId: line.item.id,
      itemNameSnapshot: line.item.name,
      optionSnapshot: option?.name ?? null,
      extrasSnapshot: extras,
      quantity: line.quantity,
      unitPrice,
      unitLabelSnapshot: line.item.unitLabel,
      lineTotal,
      customerNote: line.note ?? null,
    },
    contribution: dec(lineTotal)
      .plus(sum(extras.map((extra) => extra.priceDelta)))
      .toFixed(2),
  };
}

async function seedOrder(businessId: string, input: OrderSeed) {
  const built = input.lines.map(buildLine);
  const revenueSubtotal = sum(built.map((line) => line.contribution));
  const grandTotal = revenueSubtotal;
  const paidTotal =
    input.paid === "full"
      ? grandTotal
      : input.paid === "none"
        ? "0.00"
        : money(dec(grandTotal).times(input.paid.percent).div(100));

  const [order] = await db
    .insert(orders)
    .values({
      businessId,
      customerId: input.customer.id,
      orderCode: input.code,
      status: input.status,
      source: input.source,
      customerName: input.customer.name,
      customerPhone: input.customer.phone,
      deliveryNote: input.deliveryNote ?? null,
      neededBy: input.neededBy,
      timeSlot: input.timeSlot,
      revenueSubtotal,
      grandTotal,
      paidTotal,
      billNo: input.billNo,
      createdAt: input.createdAt,
      updatedAt: input.createdAt,
    })
    .returning();

  await db.insert(orderItems).values(
    built.map((line) => ({
      businessId,
      orderId: order.id,
      ...line.row,
    })),
  );

  if (dec(paidTotal).greaterThan(0)) {
    await db.insert(orderPayments).values({
      businessId,
      orderId: order.id,
      amount: paidTotal,
      paymentMode: input.paymentMode,
      note: input.paid === "full" ? "Paid in full" : "Advance",
      paidAt: new Date(input.createdAt.getTime() + 3600_000),
    });
  }

  return order;
}

async function seedBusiness(seed: DevBusinessSeed, seedIndex: number) {
  const profile = PACK_SEED_PROFILES[seed.pack];
  if (!profile) {
    throw new Error(`No seed profile for pack ${seed.pack}`);
  }

  const owner = await createOwner(seed);

  const [business] = await db
    .insert(businesses)
    .values({
      ownerUserId: owner.id,
      handle: seed.handle,
      businessName: seed.businessName,
      categoryPack: seed.pack,
      category: seed.category,
      locality: seed.locality,
      tagline: seed.tagline,
      whatsappNumber: `9198765${String(seedIndex + 1).padStart(5, "0")}`,
      upiId: `${seed.handle.replace(/-/g, ".")}@okhdfcbank`,
      showBankDetails: seedIndex % 2 === 0,
      bankAccountName: seed.ownerName,
      bankAccountNumber: `50100${String(200300 + seedIndex).padStart(7, "0")}`,
      bankIfsc: "HDFC0001234",
      addressPlaceholder: profile.deliveryNote,
      enableTimeSlots: true,
      defaultLocale: "en",
      nextBillNo: 6,
      firstItemAt: atDay(-30, 10),
      createdAt: atDay(-30, 9),
      updatedAt: atDay(-1, 18),
    })
    .returning();

  const items = await seedItems(business.id, seed, profile);
  const people = await seedCustomers(business.id, seedIndex, profile);

  const customItem = items[items.length - 1];
  const [first, second, third] = items;

  const ordersToSeed: OrderSeed[] = [
    {
      customer: people[0],
      code: "ORD-1001",
      status: "settled",
      source: "walk_in",
      neededBy: addDaysIst(0),
      timeSlot: "10:00",
      createdAt: atDay(0, 9, 15),
      lines: [
        {
          item: first,
          optionIndex: 1,
          quantity: "1",
          withExtra: true,
        },
        { item: second, quantity: "2" },
      ],
      paid: "full",
      paymentMode: "upi",
      billNo: "1",
    },
    {
      customer: people[1],
      code: "ORD-1002",
      status: "ready",
      source: "whatsapp_store",
      neededBy: addDaysIst(0),
      timeSlot: "13:00",
      createdAt: atDay(0, 8, 30),
      lines: [
        { item: third, quantity: "1" },
        { item: customItem, optionIndex: 0, quantity: "1" },
      ],
      paid: { percent: 30 },
      paymentMode: "cash",
      billNo: "2",
      deliveryNote: profile.deliveryNote,
    },
    {
      customer: people[2],
      code: "ORD-1003",
      status: "open_tab",
      source: "phone",
      neededBy: addDaysIst(1),
      timeSlot: "17:00",
      createdAt: atDay(0, 11),
      lines: [{ item: first, optionIndex: 0, quantity: "2" }],
      paid: { percent: 40 },
      paymentMode: "upi",
      billNo: "3",
      deliveryNote: profile.customerNotes[1],
    },
    {
      customer: people[3],
      code: "ORD-1004",
      status: "quote",
      source: "whatsapp_store",
      neededBy: addDaysIst(2),
      timeSlot: "11:00",
      createdAt: atDay(0, 12),
      lines: [{ item: customItem, quantity: "1" }],
      paid: "none",
      paymentMode: "upi",
      billNo: null,
    },
    {
      customer: people[0],
      code: "ORD-1005",
      status: "settled",
      source: "walk_in",
      neededBy: addDaysIst(-7),
      timeSlot: "15:00",
      createdAt: atDay(-7, 15),
      lines: [{ item: second, quantity: "1" }],
      paid: "full",
      paymentMode: "cash",
      billNo: "4",
    },
    {
      customer: people[1],
      code: "ORD-1006",
      status: "cancelled",
      source: "walk_in",
      neededBy: addDaysIst(-1),
      timeSlot: "10:00",
      createdAt: atDay(-1, 10),
      lines: [{ item: third, quantity: "1" }],
      paid: "none",
      paymentMode: "cash",
      billNo: null,
    },
    {
      customer: people[4],
      code: "ORD-1007",
      status: "ready",
      source: "walk_in",
      neededBy: addDaysIst(-2),
      timeSlot: "16:00",
      createdAt: atDay(-2, 16),
      lines: [{ item: customItem, quantity: "1" }],
      paid: "none",
      paymentMode: "cash",
      billNo: "5",
    },
  ];

  for (const order of ordersToSeed) {
    await seedOrder(business.id, order);
  }

  await db
    .update(customers)
    .set({ lastPaidAt: new Date(atDay(0, 10, 15).getTime()) })
    .where(eq(customers.id, people[0].id));

  await db.insert(expenses).values([
    {
      businessId: business.id,
      title: profile.expenses[0],
      amount: money(150 + seedIndex * 17),
      expenseDate: addDaysIst(0),
    },
    {
      businessId: business.id,
      title: profile.expenses[1],
      amount: money(90 + seedIndex * 11),
      expenseDate: addDaysIst(-1),
    },
    {
      businessId: business.id,
      title: profile.expenses[2],
      amount: money(600 + seedIndex * 53),
      expenseDate: addDaysIst(-3),
    },
    {
      businessId: business.id,
      title: `${profile.expenses[0]} — monthly`,
      amount: money(250 + seedIndex * 19),
      expenseDate: addDaysIst(-10),
    },
  ]);

  const requestItem = items[0];
  const requestOption = requestItem.options[0];
  const requestPrice = requestOption?.price ?? requestItem.basePrice;

  await db.insert(pendingOrders).values({
    businessId: business.id,
    code: `REQ-${seedIndex + 1}-${seed.handle.toUpperCase()}`,
    buyerName: people[3].name,
    buyerPhone: people[3].phone ?? `98765${String(seedIndex * 10 + 3).padStart(5, "0")}`,
    neededBy: addDaysIst(0),
    timeSlot: "15:00",
    note: profile.deliveryNote,
    lines: [
      {
        itemId: requestItem.id,
        itemName: requestItem.name,
        optionId: requestOption?.id ?? null,
        optionName: requestOption?.name ?? null,
        extraIds: [],
        extraNames: [],
        quantity: "1",
        unitPrice: requestPrice,
        lineTotal: requestPrice,
        unitLabel: requestItem.unitLabel,
      },
    ],
    revenueSubtotal: requestPrice,
    grandTotal: requestPrice,
    status: "pending",
    createdAt: atDay(0, 7, 45),
  });

  return business;
}

export async function seedDevData() {
  assertDevDatabase("seed");

  if (DEV_SEED_PASSWORD.length < 8) {
    throw new Error("DEV_SEED_PASSWORD must be at least 8 characters.");
  }

  // Validate every shop before deleting anything.
  for (const seed of DEV_BUSINESSES) {
    if (!PACK_SEED_PROFILES[seed.pack]) {
      throw new Error(`No seed profile for pack ${seed.pack}`);
    }
  }

  await ensurePlatformSettings();

  const handles = DEV_BUSINESSES.map((seed) => seed.handle);
  const emails = DEV_BUSINESSES.map((seed) => seed.email);

  // Rerunning the seed must produce the same known credentials. Delete only
  // these dedicated accounts and shops, never other local work.
  await db.delete(businesses).where(inArray(businesses.handle, handles));
  await db.delete(user).where(inArray(user.email, emails));

  for (const [index, seed] of DEV_BUSINESSES.entries()) {
    await seedBusiness(seed, index);
    console.log(
      `  ${String(index + 1).padStart(2, "0")}. ${seed.businessName} (${seed.pack}) → ${seed.email}`,
    );
  }

  return {
    businesses: DEV_BUSINESSES.length,
    ordersPerBusiness: 7,
    password: DEV_SEED_PASSWORD,
  };
}
