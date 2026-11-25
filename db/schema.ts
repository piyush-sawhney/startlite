import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const id = () =>
  uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`);

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

/* ------------------------------------------------------------------ */
/* Better Auth                                                         */
/* ------------------------------------------------------------------ */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("owner"),
  locale: text("locale").notNull().default("en"),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Platform                                                            */
/* ------------------------------------------------------------------ */

export const platformSettings = pgTable("platform_settings", {
  id: smallint("id").primaryKey().default(1),
  legalName: text("legal_name").notNull(),
  gstin: text("gstin").notNull(),
  registeredAddress: text("registered_address").notNull(),
  sac: text("sac").notNull().default("998314"),
  invoicePrefix: text("invoice_prefix").notNull().default("SL"),
  nextInvoiceNo: integer("next_invoice_no").notNull().default(1),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const businesses = pgTable(
  "businesses",
  {
    id: id(),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    handle: text("handle").notNull().unique(),
    businessName: text("business_name").notNull(),
    categoryPack: text("category_pack").notNull().default("grocery"),
    category: text("category"),
    locality: text("locality"),
    tagline: text("tagline"),
    whatsappNumber: text("whatsapp_number").notNull(),
    upiId: text("upi_id"),
    showBankDetails: boolean("show_bank_details").notNull().default(false),
    bankAccountName: text("bank_account_name"),
    bankAccountNumber: text("bank_account_number"),
    bankIfsc: text("bank_ifsc"),
    defaultLocale: text("default_locale").notNull().default("en"),
    noticeBanner: text("notice_banner"),
    enableTimeSlots: boolean("enable_time_slots").notNull().default(false),
    advancePolicyText: text("advance_policy_text"),
    addressPlaceholder: text("address_placeholder")
      .notNull()
      .default("Delivery address or special note"),
    privacyMode: boolean("privacy_mode").notNull().default(false),
    nextBillNo: integer("next_bill_no").notNull().default(1),
    firstItemAt: timestamp("first_item_at", { withTimezone: true }),
    trialEndsAt: timestamp("trial_ends_at", { withTimezone: true })
      .notNull()
      .default(sql`now() + interval '90 days'`),
    passExpiresAt: timestamp("pass_expires_at", { withTimezone: true }),
    disabledAt: timestamp("disabled_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("business_owner_idx").on(t.ownerUserId)],
);

/* ------------------------------------------------------------------ */
/* Customers                                                           */
/* ------------------------------------------------------------------ */

export const customers = pgTable(
  "customers",
  {
    id: id(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone"),
    subLabel: text("sub_label"),
    notes: text("notes"),
    lastPaidAt: timestamp("last_paid_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("customer_phone_unique")
      .on(t.businessId, t.phone)
      .where(sql`phone IS NOT NULL`),
    index("customer_business_idx").on(t.businessId, t.name),
  ],
);

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */

export const catalogItems = pgTable(
  "catalog_items",
  {
    id: id(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    subtitle: text("subtitle"),
    itemType: text("item_type").notNull().default("product"),
    priceMode: text("price_mode").notNull().default("fixed"),
    basePrice: numeric("base_price", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    unitLabel: text("unit_label").notNull().default("item"),
    allowDecimalQty: boolean("allow_decimal_qty").notNull().default(false),
    customerPrompt: text("customer_prompt"),
    askWhatsappMedia: boolean("ask_whatsapp_media").notNull().default(false),
    isAvailable: boolean("is_available").notNull().default(true),
    slotsLeft: integer("slots_left"),
    imageKey: text("image_key"),
    sortOrder: integer("sort_order").notNull().default(0),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [
    index("catalog_business_idx").on(
      t.businessId,
      t.isAvailable,
      t.sortOrder,
    ),
  ],
);

export const itemOptions = pgTable(
  "item_options",
  {
    id: id(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => catalogItems.id, { onDelete: "cascade" }),
    groupLabel: text("group_label").notNull().default("Option"),
    name: text("name").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    isAvailable: boolean("is_available").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("options_item_idx").on(t.itemId, t.sortOrder)],
);

export const itemExtras = pgTable(
  "item_extras",
  {
    id: id(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => catalogItems.id, { onDelete: "cascade" }),
    parentOptionId: uuid("parent_option_id").references(() => itemOptions.id, {
      onDelete: "cascade",
    }),
    groupLabel: text("group_label").notNull().default("Extra"),
    name: text("name").notNull(),
    priceDelta: numeric("price_delta", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    isMultiSelect: boolean("is_multi_select").notNull().default(true),
    isAvailable: boolean("is_available").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("extras_item_idx").on(t.itemId, t.parentOptionId, t.sortOrder)],
);

export const media = pgTable(
  "media",
  {
    id: id(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    kind: text("kind").notNull().default("item"),
    catalogItemId: uuid("catalog_item_id").references(() => catalogItems.id, {
      onDelete: "set null",
    }),
    objectKey: text("object_key").notNull(),
    variants: jsonb("variants").$type<Record<string, string>>().notNull().default({}),
    mime: text("mime").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    bytes: integer("bytes").notNull(),
    checksum: text("checksum").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("media_business_idx").on(t.businessId, t.kind)],
);

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

export const orders = pgTable(
  "orders",
  {
    id: id(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    orderCode: text("order_code").notNull(),
    status: text("status").notNull().default("accepted"),
    source: text("source").notNull().default("walk_in"),
    customerName: text("customer_name"),
    customerPhone: text("customer_phone"),
    deliveryNote: text("delivery_note"),
    neededBy: date("needed_by").notNull().defaultNow(),
    timeSlot: text("time_slot"),
    followUpDate: date("follow_up_date"),
    progressNote: text("progress_note"),
    adjustmentAmount: numeric("adjustment_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    adjustmentReason: text("adjustment_reason"),
    revenueSubtotal: numeric("revenue_subtotal", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    nonRevenueTotal: numeric("non_revenue_total", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    grandTotal: numeric("grand_total", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    paidTotal: numeric("paid_total", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    tdsTotal: numeric("tds_total", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    billNo: text("bill_no"),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("order_business_idx").on(t.businessId, t.status, t.createdAt),
    index("order_code_idx").on(t.businessId, t.orderCode),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: id(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    catalogItemId: uuid("catalog_item_id").references(() => catalogItems.id, {
      onDelete: "set null",
    }),
    lineKind: text("line_kind").notNull().default("standard"),
    itemNameSnapshot: text("item_name_snapshot").notNull(),
    optionSnapshot: text("option_snapshot"),
    extrasSnapshot: jsonb("extras_snapshot")
      .$type<Array<{ name: string; priceDelta: string }>>()
      .notNull()
      .default([]),
    customerNote: text("customer_note"),
    unitLabelSnapshot: text("unit_label_snapshot"),
    quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    lineTotal: numeric("line_total", { precision: 10, scale: 2 }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const orderPayments = pgTable(
  "order_payments",
  {
    id: id(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    tdsDeducted: numeric("tds_deducted", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    paymentMode: text("payment_mode").notNull().default("upi"),
    note: text("note"),
    paidAt: timestamp("paid_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("payment_order_idx").on(t.orderId)],
);

export const pendingOrders = pgTable(
  "pending_orders",
  {
    id: id(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    code: text("code").notNull().unique(),
    buyerName: text("buyer_name").notNull(),
    buyerPhone: text("buyer_phone").notNull(),
    neededBy: date("needed_by").notNull().defaultNow(),
    timeSlot: text("time_slot"),
    note: text("note"),
    lines: jsonb("lines")
      .$type<
        Array<{
          itemId: string;
          itemName: string;
          optionId: string | null;
          optionName: string | null;
          extraIds: string[];
          extraNames: string[];
          quantity: string;
          unitPrice: string;
          lineTotal: string;
          unitLabel: string;
        }>
      >()
      .notNull(),
    revenueSubtotal: numeric("revenue_subtotal", { precision: 10, scale: 2 })
      .notNull(),
    grandTotal: numeric("grand_total", { precision: 10, scale: 2 }).notNull(),
    status: text("status").notNull().default("pending"),
    acceptedOrderId: uuid("accepted_order_id"),
    ipHash: text("ip_hash"),
    createdAt: createdAt(),
    expiresAt: timestamp("expires_at", { withTimezone: true })
      .notNull()
      .default(sql`now() + interval '7 days'`),
  },
  (t) => [
    index("pending_business_idx").on(t.businessId, t.createdAt),
    index("pending_expiry_idx").on(t.expiresAt),
  ],
);

/* ------------------------------------------------------------------ */
/* Money and platform records                                          */
/* ------------------------------------------------------------------ */

export const expenses = pgTable(
  "expenses",
  {
    id: id(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    expenseDate: date("expense_date").notNull().defaultNow(),
    createdAt: createdAt(),
  },
  (t) => [index("expense_business_idx").on(t.businessId, t.expenseDate)],
);

export const subscriptionPayments = pgTable("subscription_payments", {
  id: id(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  invoiceNo: text("invoice_no").notNull(),
  amountInr: numeric("amount_inr", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull().default("manual"),
  status: text("status").notNull().default("captured"),
  validFrom: date("valid_from").notNull(),
  validUntil: date("valid_until").notNull(),
  activatedBy: text("activated_by"),
  note: text("note"),
  createdAt: createdAt(),
});

export const auditLog = pgTable(
  "audit_log",
  {
    id: id(),
    actorUserId: text("actor_user_id"),
    businessId: uuid("business_id"),
    action: text("action").notNull(),
    entity: text("entity"),
    entityId: text("entity_id"),
    meta: jsonb("meta").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: createdAt(),
  },
  (t) => [index("audit_business_idx").on(t.businessId, t.createdAt)],
);
