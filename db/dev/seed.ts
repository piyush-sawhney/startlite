import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { eq, inArray } from "drizzle-orm";
import sharp from "sharp";
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
  platformSettings,
  user,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { addDaysIst, istDateString, startOfTodayIst } from "@/lib/date";
import { dec, money, multiply, sum } from "@/lib/money";
import { getPack } from "@/lib/packs";
import { mediaPath } from "@/lib/storage";
import {
  CUSTOMER_NAMES,
  DEV_BUSINESSES,
  DEV_SEED_PASSWORD,
  PACK_COLORS,
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

function dayOf(date: Date): string {
  return istDateString(date);
}

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (char) =>
    char === "<"
      ? "&lt;"
      : char === ">"
        ? "&gt;"
        : char === "&"
          ? "&amp;"
          : char === '"'
            ? "&quot;"
            : "&apos;",
  );
}

function initials(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function logoSvg(name: string, [dark, light]: [string, string]): Buffer {
  const mark = escapeXml(initials(name) || "SL");
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
    <rect width="640" height="640" rx="140" fill="${light}"/>
    <circle cx="320" cy="320" r="232" fill="${dark}"/>
    <text x="320" y="392" text-anchor="middle" font-family="sans-serif" font-size="180" font-weight="700" fill="#FFFFFF">${mark}</text>
  </svg>`);
}

function itemSvg(
  name: string,
  [dark, light]: [string, string],
  variant: number,
): Buffer {
  const label = escapeXml(initials(name) || "IT");
  const offset = (variant % 4) * 34;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
    <rect width="640" height="640" rx="96" fill="${light}"/>
    <circle cx="${210 + offset}" cy="230" r="150" fill="${dark}" opacity="0.92"/>
    <rect x="300" y="286" width="240" height="240" rx="70" fill="${dark}" opacity="0.55"/>
    <text x="320" y="420" text-anchor="middle" font-family="sans-serif" font-size="124" font-weight="700" fill="#FFFFFF">${label}</text>
  </svg>`);
}

async function seedImage(
  businessId: string,
  kind: "logo" | "item",
  catalogItemId: string | null,
  svg: Buffer,
) {
  const rendered = await sharp(svg)
    .webp({ quality: 84 })
    .toBuffer({ resolveWithObject: true });
  const base = `${businessId}/${kind}/${randomUUID()}`;
  const key = `${base}/original.webp`;
  await mkdir(path.dirname(mediaPath(key)), { recursive: true });
  await writeFile(mediaPath(key), rendered.data);

  const variants: Record<string, string> = {};
  for (const width of [320, 640]) {
    if (width > rendered.info.width) continue;
    const variantKey = `${base}/${width}.webp`;
    const data = await sharp(rendered.data).resize({ width }).webp({ quality: 80 }).toBuffer();
    await writeFile(mediaPath(variantKey), data);
    variants[String(width)] = variantKey;
  }

  const [row] = await db
    .insert(media)
    .values({
      businessId,
      kind,
      catalogItemId,
      objectKey: key,
      variants,
      mime: "image/webp",
      width: rendered.info.width,
      height: rendered.info.height,
      bytes: rendered.data.byteLength,
      checksum: createHash("sha256").update(rendered.data).digest("hex"),
      createdAt: atDay(-29, 9),
    })
    .returning();
  return row.objectKey;
}

type SeedOption = { id: string; name: string; price: string };
type SeedExtra = {
  name: string;
  priceDelta: string;
  parentOptionId?: string | null;
};

type SeededItem = {
  id: string;
  name: string;
  basePrice: string;
  unitLabel: string;
  /** First option group; also used by the storefront request seed. */
  options: SeedOption[];
  /** Second option group on the first item, priced as deltas. */
  secondGroupOptions: SeedOption[];
  /** Plain extras plus extras scoped to one option (sub-variants). */
  extras: SeedExtra[];
};

type SeededCustomer = {
  id: string;
  name: string;
  phone: string | null;
};

type SeedLine = {
  item: SeededItem;
  optionIndex?: number;
  secondOptionIndex?: number;
  quantity: string;
  /** Whichever extras to attach, by index into `item.extras`. */
  extraIndexes?: number[];
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
  const definitions = [
    ...pack.starters,
    seed.customItem,
    ...profile.extraItems,
  ];
  const customIndex = pack.starters.length;
  const variantIndexes = new Set([0, customIndex, customIndex + 1]);

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

  const colors = PACK_COLORS[seed.pack] ?? ["#0B6E62", "#E6F4F1"];
  for (const [index, item] of inserted.entries()) {
    const imageKey = await seedImage(
      businessId,
      "item",
      item.id,
      itemSvg(item.name, colors, index),
    );
    await db
      .update(catalogItems)
      .set({ imageKey })
      .where(eq(catalogItems.id, item.id));
  }

  // The first item, the trade-specific item and the first extra item carry
  // variants. The first item also gets a second option group and sub-variants.
  const optionRows: Array<typeof itemOptions.$inferInsert> = [];
  for (const [index, item] of inserted.entries()) {
    if (!variantIndexes.has(index)) continue;
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

  const firstItem = inserted[0];
  if (firstItem) {
    const base = dec(firstItem.basePrice);
    optionRows.push(
      {
        businessId,
        itemId: firstItem.id,
        groupLabel: profile.optionGroup.label,
        name: profile.optionGroup.choices[0],
        price: "0.00",
        sortOrder: 2,
      },
      {
        businessId,
        itemId: firstItem.id,
        groupLabel: profile.optionGroup.label,
        name: profile.optionGroup.choices[1],
        price: money(base.times(0.1)),
        sortOrder: 3,
      },
    );
  }

  const insertedOptions =
    optionRows.length > 0
      ? await db.insert(itemOptions).values(optionRows).returning()
      : [];

  const optionsFor = (itemId: string, groupLabel = "Option") =>
    insertedOptions
      .filter(
        (option) => option.itemId === itemId && option.groupLabel === groupLabel,
      )
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((option) => ({
        id: option.id,
        name: option.name,
        price: option.price,
      }));

  const extraRows: Array<typeof itemExtras.$inferInsert> = [];
  if (firstItem) {
    extraRows.push(
      {
        businessId,
        itemId: firstItem.id,
        name: profile.extra.name,
        priceDelta: profile.extra.priceDelta,
        sortOrder: 0,
      },
      ...profile.extras.map((extra, index) => ({
        businessId,
        itemId: firstItem.id,
        name: extra.name,
        priceDelta: extra.priceDelta,
        sortOrder: index + 1,
      })),
    );

    const parent = insertedOptions.find(
      (option) =>
        option.itemId === firstItem.id && option.name === profile.subVariant.parentVariant,
    );
    extraRows.push({
      businessId,
      itemId: firstItem.id,
      parentOptionId: parent?.id ?? null,
      groupLabel: "Add-on",
      name: profile.subVariant.name,
      priceDelta: profile.subVariant.priceDelta,
      sortOrder: 10,
    });
  }

  const variantExtraItem = inserted[customIndex + 1];
  if (variantExtraItem) {
    extraRows.push({
      businessId,
      itemId: variantExtraItem.id,
      name: profile.extras[0].name,
      priceDelta: profile.extras[0].priceDelta,
      sortOrder: 0,
    });
  }

  const insertedExtras =
    extraRows.length > 0
      ? await db.insert(itemExtras).values(extraRows).returning()
      : [];

  return inserted.map((item) => ({
    id: item.id,
    name: item.name,
    basePrice: item.basePrice,
    unitLabel: item.unitLabel,
    options: optionsFor(item.id),
    secondGroupOptions: optionsFor(item.id, profile.optionGroup.label),
    extras: insertedExtras
      .filter((extra) => extra.itemId === item.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((extra) => ({
        name: extra.name,
        priceDelta: extra.priceDelta,
        parentOptionId: extra.parentOptionId,
      })),
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
  const secondOption =
    line.secondOptionIndex === undefined
      ? null
      : (line.item.secondGroupOptions[line.secondOptionIndex] ?? null);
  const unitPrice = dec(option?.price ?? line.item.basePrice)
    .plus(secondOption?.price ?? 0)
    .toFixed(2);

  const indexes = line.extraIndexes ?? (line.withExtra ? [0] : []);
  const extras = indexes
    .map((index) => line.item.extras[index])
    .filter((extra): extra is SeedExtra => Boolean(extra));
  const optionNames = [option?.name, secondOption?.name].filter(Boolean);
  const lineTotal = multiply(line.quantity, unitPrice);

  return {
    row: {
      catalogItemId: line.item.id,
      itemNameSnapshot: line.item.name,
      optionSnapshot: optionNames.length ? optionNames.join(" · ") : null,
      extrasSnapshot: extras.map(({ name, priceDelta }) => ({ name, priceDelta })),
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

  await seedImage(
    business.id,
    "logo",
    null,
    logoSvg(seed.businessName, PACK_COLORS[seed.pack] ?? ["#0B6E62", "#E6F4F1"]),
  );

  const items = await seedItems(business.id, seed, profile);
  const people = await seedCustomers(business.id, seedIndex, profile);

  const pack = getPack(seed.pack);
  const customIndex = pack.starters.length;
  const [first, second, third] = items;
  const customItem = items[customIndex];
  const variantExtraItem = items[customIndex + 1];
  const plainExtraItem = items[items.length - 1];

  const ordersToSeed: OrderSeed[] = [
    {
      customer: people[0],
      code: "ORD-1001",
      status: "completed",
      source: "walk_in",
      neededBy: dayOf(atDay(-14, 10, 15)),
      timeSlot: "10:45",
      createdAt: atDay(-14, 10, 15),
      lines: [
        { item: first, optionIndex: 1, quantity: "1", withExtra: true },
        { item: second, quantity: "2" },
      ],
      paid: "full",
      paymentMode: "upi",
      billNo: "1",
      deliveryNote: profile.customerNotes[0],
    },
    {
      customer: people[2],
      code: "ORD-1002",
      status: "completed",
      source: "phone",
      neededBy: dayOf(atDay(-9, 16, 40)),
      timeSlot: "18:00",
      createdAt: atDay(-9, 16, 40),
      lines: [
        { item: customItem, optionIndex: 1, quantity: "1" },
        { item: third, quantity: "1" },
      ],
      paid: "full",
      paymentMode: "cash",
      billNo: "2",
      deliveryNote: "Pack it well for gifting",
    },
    {
      customer: people[1],
      code: "ORD-1003",
      status: "ready",
      source: "whatsapp_store",
      neededBy: dayOf(atDay(0, 13, 0)),
      timeSlot: "13:00",
      createdAt: atDay(-2, 9, 20),
      lines: [
        { item: third, quantity: "1" },
        { item: customItem, optionIndex: 0, quantity: "1" },
      ],
      paid: { percent: 30 },
      paymentMode: "cash",
      billNo: "3",
      deliveryNote: profile.deliveryNote,
    },
    {
      customer: people[3],
      code: "ORD-1004",
      status: "accepted",
      source: "phone",
      neededBy: dayOf(atDay(2, 17, 30)),
      timeSlot: "17:30",
      createdAt: atDay(-1, 11, 5),
      lines: [
        { item: first, optionIndex: 0, quantity: "2" },
        { item: plainExtraItem, quantity: "1" },
      ],
      paid: { percent: 40 },
      paymentMode: "upi",
      billNo: "4",
      deliveryNote: profile.customerNotes[1],
    },
    {
      customer: people[4],
      code: "ORD-1005",
      status: "waiting_client",
      source: "whatsapp_store",
      neededBy: dayOf(atDay(1, 11, 0)),
      timeSlot: "11:00",
      createdAt: atDay(0, 7, 45),
      lines: [{ item: customItem, quantity: "1" }],
      paid: "none",
      paymentMode: "upi",
      billNo: null,
      deliveryNote: "Please confirm the price before I pay",
    },
    {
      customer: people[0],
      code: "ORD-1006",
      status: "completed",
      source: "walk_in",
      neededBy: dayOf(atDay(-21, 15, 10)),
      timeSlot: "15:30",
      createdAt: atDay(-21, 15, 10),
      lines: [{ item: second, quantity: "1" }],
      paid: "full",
      paymentMode: "cash",
      billNo: "5",
    },
    {
      customer: people[1],
      code: "ORD-1007",
      status: "cancelled",
      source: "walk_in",
      neededBy: dayOf(atDay(-4, 10, 0)),
      timeSlot: "10:30",
      createdAt: atDay(-4, 10, 0),
      lines: [{ item: third, quantity: "1" }],
      paid: "none",
      paymentMode: "cash",
      billNo: null,
      deliveryNote: "Customer changed the time and did not confirm",
    },
    {
      customer: people[4],
      code: "ORD-1008",
      status: "ready",
      source: "walk_in",
      neededBy: dayOf(atDay(-6, 16, 0)),
      timeSlot: "16:30",
      createdAt: atDay(-6, 16, 0),
      lines: [{ item: customItem, quantity: "1" }],
      paid: "none",
      paymentMode: "cash",
      billNo: "6",
      deliveryNote: "Call before pickup",
    },
    {
      customer: people[2],
      code: "ORD-1009",
      status: "under_review",
      source: "whatsapp_store",
      neededBy: dayOf(atDay(1, 9, 30)),
      timeSlot: "09:30",
      createdAt: atDay(0, 8, 10),
      lines: [
        {
          item: first,
          optionIndex: 0,
          secondOptionIndex: 1,
          extraIndexes: [0, 2],
          quantity: "2",
          note: "No onion, extra napkins",
        },
        { item: plainExtraItem, quantity: "3" },
      ],
      paid: "none",
      paymentMode: "upi",
      billNo: null,
      deliveryNote: profile.customerNotes[1],
    },
    {
      customer: people[1],
      code: "ORD-1010",
      status: "in_progress",
      source: "phone",
      neededBy: dayOf(atDay(-3, 14, 0)),
      timeSlot: null,
      createdAt: atDay(-3, 14, 0),
      lines: [
        { item: first, optionIndex: 1, quantity: "1" },
        { item: second, quantity: "2" },
        { item: variantExtraItem, extraIndexes: [0], quantity: "1" },
      ],
      paid: { percent: 50 },
      paymentMode: "upi",
      billNo: "7",
      deliveryNote: "Call when it is packed",
    },
    {
      customer: people[3],
      code: "ORD-1011",
      status: "accepted",
      source: "whatsapp_store",
      neededBy: dayOf(atDay(3, 12, 0)),
      timeSlot: "Any time",
      createdAt: atDay(0, 13, 20),
      // Six lines exercise the "+N more" summary on Home cards.
      lines: [
        { item: first, optionIndex: 1, quantity: "1" },
        { item: second, quantity: "2" },
        { item: third, quantity: "1" },
        { item: customItem, quantity: "1" },
        { item: variantExtraItem, quantity: "2" },
        { item: plainExtraItem, quantity: "4" },
      ],
      paid: { percent: 25 },
      paymentMode: "cash",
      billNo: "8",
      deliveryNote: profile.deliveryNote,
    },
    {
      customer: people[0],
      code: "ORD-1012",
      status: "declined",
      source: "whatsapp_store",
      neededBy: dayOf(atDay(1, 12, 0)),
      timeSlot: "12:00",
      createdAt: atDay(-1, 12, 30),
      lines: [{ item: customItem, optionIndex: 0, quantity: "1" }],
      paid: "none",
      paymentMode: "upi",
      billNo: null,
    },
    {
      customer: people[1],
      code: "ORD-1013",
      status: "ready",
      source: "walk_in",
      neededBy: dayOf(atDay(0, 18, 0)),
      timeSlot: "18:00",
      createdAt: atDay(-1, 16, 0),
      lines: [
        {
          item: first,
          optionIndex: 1,
          secondOptionIndex: 1,
          extraIndexes: [0, 1, 3],
          quantity: "1",
        },
        { item: second, quantity: "2" },
        { item: third, quantity: "1" },
        { item: plainExtraItem, quantity: "2" },
      ],
      paid: { percent: 60 },
      paymentMode: "upi",
      billNo: "9",
      deliveryNote: "Gate number 4",
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

  function requestLine(
    item: SeededItem,
    quantity = "1",
    optionIndex?: number,
  ) {
    const option = optionIndex === undefined ? null : (item.options[optionIndex] ?? null);
    const unitPrice = option?.price ?? item.basePrice;
    return {
      itemId: item.id,
      itemName: item.name,
      optionId: option?.id ?? null,
      optionName: option?.name ?? null,
      extraIds: [],
      extraNames: [],
      quantity,
      unitPrice,
      lineTotal: multiply(quantity, unitPrice),
      unitLabel: item.unitLabel,
    };
  }

  const requestGroups = [
    {
      code: `REQ-${seedIndex + 1}-${seed.handle.toUpperCase()}`,
      buyer: people[3],
      neededBy: addDaysIst(0),
      timeSlot: "15:00",
      note: profile.deliveryNote,
      lines: [requestLine(first, "1", 0)],
      createdAt: atDay(0, 7, 45),
    },
    {
      code: `REQ-${seedIndex + 1}B-${seed.handle.toUpperCase()}`,
      buyer: people[4],
      neededBy: addDaysIst(0),
      timeSlot: "17:30",
      note: profile.customerNotes[1],
      lines: [
        requestLine(second, "2"),
        requestLine(customItem, "1", 1),
      ],
      createdAt: atDay(0, 8, 10),
    },
    {
      code: `REQ-${seedIndex + 1}C-${seed.handle.toUpperCase()}`,
      buyer: people[2],
      neededBy: addDaysIst(1),
      timeSlot: null,
      note: "Please call when ready",
      lines: [
        requestLine(first, "1", 1),
        requestLine(third, "2"),
        requestLine(plainExtraItem, "3"),
      ],
      createdAt: atDay(0, 9, 5),
    },
  ];

  for (const group of requestGroups) {
    const total = sum(group.lines.map((line) => line.lineTotal));
    await db.insert(pendingOrders).values({
      businessId: business.id,
      code: group.code,
      buyerName: group.buyer.name,
      buyerPhone:
        group.buyer.phone ??
        `98765${String(seedIndex * 10 + 3).padStart(5, "0")}`,
      neededBy: group.neededBy,
      timeSlot: group.timeSlot,
      note: group.note,
      lines: group.lines,
      revenueSubtotal: total,
      grandTotal: total,
      status: "pending",
      createdAt: group.createdAt,
    });
  }

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
    ordersPerBusiness: 13,
    password: DEV_SEED_PASSWORD,
  };
}
