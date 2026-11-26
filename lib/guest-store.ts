/**
 * The guest workspace.
 *
 * StartLite must be usable before login. This module is the local source of
 * truth for a signed-out merchant: shop details, catalog, sales, payments, and
 * expenses live in localStorage until the merchant saves the shop.
 *
 * Money is stored as decimal strings and every derived total uses integer
 * paise. The server recomputes all totals again when guest data is imported.
 */

import { formatDayHeading, istDateString, startOfTodayIst, startOfWeekIst } from "./date";
import { hasScheduledTime, summarizeIncompleteOrders } from "./home-orders";
import { orderSummary } from "./order-summary";
import {
  isCancelled,
  isClosed,
  isCompleted,
  isOrderStatus,
  isReady,
  type OrderStatus,
} from "./order-status";
import type {
  CustomerDue,
  DayOrderItem,
  HomeDashboardData,
  IncompleteOrder,
  OrderLinePreview,
} from "./home-types";
import { getPack } from "./packs";
import {
  formatCompactPaise,
  formatPaise,
  fromPaise,
  multiplyPaise,
  toPaise,
} from "./paise";

export const GUEST_STORE_KEY = "startlite_guest_v2";

export type GuestPaymentMode = "cash" | "upi" | "card" | "bank" | "other";
export type GuestOrderStatus = OrderStatus;

export type GuestShop = {
  name: string;
  pack: string;
  whatsapp: string;
  upi: string;
  locality: string;
  privacyMode: boolean;
  addressPlaceholder: string;
  bankName: string;
  bankNumber: string;
  bankIfsc: string;
};

export type GuestItemVariant = {
  name: string;
  price: string;
  subVariants: Array<{ name: string; price: string }>;
};

export type GuestItemAvailability = { from: string; to: string };

export type GuestItem = {
  id: string;
  name: string;
  price: string;
  unitLabel: string;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
  category: string;
  description: string;
  photo: string | null;
  variants: GuestItemVariant[];
  availability: GuestItemAvailability | null;
};

export type GuestLine = {
  id: string;
  itemId: string | null;
  itemName: string;
  optionName: string | null;
  extras: Array<{ name: string; priceDelta: string }>;
  quantity: string;
  unitPrice: string;
  unitLabel: string;
  note: string | null;
};

export type GuestPayment = {
  id: string;
  amount: string;
  mode: GuestPaymentMode;
  paidAt: string;
};

export type GuestOrder = {
  id: string;
  code: string;
  status: GuestOrderStatus;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCountryCode: string;
  note: string;
  neededBy: string;
  timeSlot: string;
  createdAt: string;
  billNo: number;
  lines: GuestLine[];
  payments: GuestPayment[];
};

export type GuestExpense = {
  id: string;
  title: string;
  paidFor: string;
  amount: string;
  date: string;
  createdAt: string;
};

export type GuestCustomerAddress = {
  line1: string;
  line2: string;
  line3: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
};

export type GuestCustomerRecord = {
  id: string;
  name: string;
  countryCode: string;
  phone: string;
  subLabel: string;
  address: GuestCustomerAddress | null;
  createdAt: string;
};

export type GuestState = {
  version: 2;
  shop: GuestShop;
  items: GuestItem[];
  customers: GuestCustomerRecord[];
  orders: GuestOrder[];
  expenses: GuestExpense[];
  nextBillNo: number;
};

export type GuestOrderInput = {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerCountryCode?: string;
  customerSubLabel?: string;
  note?: string;
  neededBy?: string;
  when?: "now" | "later";
  status?: GuestOrderStatus;
  timeSlot?: string | null;
  lines: Array<{
    itemId?: string | null;
    itemName: string;
    optionName?: string | null;
    extras?: Array<{ name: string; priceDelta: string }>;
    quantity: string;
    unitPrice: string;
    unitLabel: string;
    note?: string | null;
  }>;
  paidAmount?: string;
  paymentMode?: GuestPaymentMode;
};

export type GuestImportPayload = {
  items: Array<{
    name: string;
    price: string;
    unitLabel: string;
    isAvailable: boolean;
  }>;
  orders: Array<{
    code: string;
    customerName: string | null;
    customerPhone: string | null;
    note: string | null;
    neededBy: string;
    createdAt: string;
    status: GuestOrderStatus;
    lines: Array<{
      itemName: string;
      optionName: string | null;
      extras: Array<{ name: string; priceDelta: string }>;
      quantity: string;
      unitPrice: string;
      unitLabel: string;
      note: string | null;
    }>;
    payments: Array<{
      amount: string;
      mode: GuestPaymentMode;
      paidAt: string;
    }>;
  }>;
  expenses: Array<{
    title: string;
    amount: string;
    date: string;
  }>;
};

const MAX_ITEMS = 300;
const MAX_ORDERS = 500;
const MAX_EXPENSES = 500;
const MAX_CUSTOMERS = 1000;
const MAX_LINES = 50;

export function guestToday(): string {
  return new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
}

export function guestDay(offsetDays: number): string {
  return new Date(Date.now() + 5.5 * 3600_000 + offsetDays * 864e5)
    .toISOString()
    .slice(0, 10);
}

export function guestNow(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${prefix}_${random}`;
}

function clampText(value: unknown, max: number, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value.slice(0, max);
}

function cleanMoney(value: unknown): string {
  return fromPaise(toPaise(typeof value === "string" ? value : "0"));
}

function cleanQuantity(value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return "0";
  return text;
}

function cleanDate(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return fallback;
  }
  return value;
}

function cleanTimestamp(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toISOString();
}

function cleanPhone(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\D/g, "").slice(-10);
}

export function starterItems(
  packId: string,
  createdAt = guestNow(),
): GuestItem[] {
  const pack = getPack(packId);
  return pack.starters.map((starter, index) => ({
    id: `seed_${pack.id}_${index}`,
    name: starter.name,
    price: cleanMoney(starter.price),
    unitLabel: starter.unit,
    isAvailable: true,
    sortOrder: index,
    createdAt,
    category: "",
    description: "",
    photo: null,
    variants: [],
    availability: null,
  }));
}

export function createGuestState(packId = "grocery"): GuestState {
  const pack = getPack(packId);
  return {
    version: 2,
    shop: {
      name: "My shop",
      pack: pack.id,
      whatsapp: "",
      upi: "",
      locality: "",
      privacyMode: false,
      addressPlaceholder: pack.note,
      bankName: "",
      bankNumber: "",
      bankIfsc: "",
    },
    items: starterItems(pack.id),
    customers: [],
    orders: [],
    expenses: [],
    nextBillNo: 1,
  };
}

function normalizeShop(value: unknown): GuestShop {
  const raw = (value ?? {}) as Partial<GuestShop>;
  const pack = getPack(clampText(raw.pack, 40, "grocery"));
  return {
    name: clampText(raw.name, 80).trim() || "My shop",
    pack: pack.id,
    whatsapp: cleanPhone(raw.whatsapp),
    upi: clampText(raw.upi, 80).trim(),
    locality: clampText(raw.locality, 80).trim(),
    privacyMode: raw.privacyMode === true,
    addressPlaceholder:
      clampText(raw.addressPlaceholder, 120).trim() || pack.note,
    bankName: clampText(raw.bankName, 80).trim(),
    bankNumber: clampText(raw.bankNumber, 40).trim(),
    bankIfsc: clampText(raw.bankIfsc, 20).trim(),
  };
}

function cleanPhoto(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (value.length > 220_000) return null;
  if (!/^(data:image\/|https?:\/\/)/.test(value)) return null;
  return value;
}

function normalizeItem(value: unknown, index: number, now: string): GuestItem | null {
  const raw = (value ?? {}) as Partial<GuestItem>;
  const name = clampText(raw.name, 80).trim();
  if (!name) return null;

  const variants: GuestItemVariant[] = Array.isArray(raw.variants)
    ? raw.variants
        .slice(0, 20)
        .map((variant) => ({
          name: clampText(variant?.name, 60).trim(),
          price: cleanMoney(variant?.price),
          subVariants: Array.isArray(variant?.subVariants)
            ? variant.subVariants
                .slice(0, 20)
                .map((sub) => ({
                  name: clampText(sub?.name, 60).trim(),
                  price: cleanMoney(sub?.price),
                }))
                .filter((sub) => sub.name)
            : [],
        }))
        .filter((variant) => variant.name)
    : [];

  const availability =
    raw.availability && typeof raw.availability === "object"
      ? {
          from: clampText(raw.availability.from, 5) || "00:00",
          to: clampText(raw.availability.to, 5) || "23:59",
        }
      : null;

  return {
    id: clampText(raw.id, 80) || newId("item"),
    name,
    price: cleanMoney(raw.price),
    unitLabel: clampText(raw.unitLabel, 20).trim() || "item",
    isAvailable: raw.isAvailable !== false,
    sortOrder:
      typeof raw.sortOrder === "number" && Number.isFinite(raw.sortOrder)
        ? raw.sortOrder
        : index,
    createdAt: cleanTimestamp(raw.createdAt, now),
    category: clampText(raw.category, 60).trim(),
    description: clampText(raw.description, 200).trim(),
    photo: cleanPhoto(raw.photo),
    variants,
    availability,
  };
}

function normalizeLine(value: unknown, index: number): GuestLine | null {
  const raw = (value ?? {}) as Partial<GuestLine>;
  const itemName = clampText(raw.itemName, 80).trim();
  if (!itemName) return null;
  const extras = Array.isArray(raw.extras)
    ? raw.extras
        .slice(0, 20)
        .map((extra) => ({
          name: clampText(extra?.name, 80).trim(),
          priceDelta: cleanMoney(extra?.priceDelta),
        }))
        .filter((extra) => extra.name)
    : [];
  return {
    id: clampText(raw.id, 80) || `line_${index}`,
    itemId: clampText(raw.itemId, 80) || null,
    itemName,
    optionName: clampText(raw.optionName, 80).trim() || null,
    extras,
    quantity: cleanQuantity(raw.quantity),
    unitPrice: cleanMoney(raw.unitPrice),
    unitLabel: clampText(raw.unitLabel, 20).trim() || "item",
    note: clampText(raw.note, 200).trim() || null,
  };
}

function normalizePayment(value: unknown): GuestPayment | null {
  const raw = (value ?? {}) as Partial<GuestPayment>;
  const amount = cleanMoney(raw.amount);
  if (toPaise(amount) <= 0) return null;
  const mode =
    raw.mode === "upi" || raw.mode === "bank" || raw.mode === "other"
      ? raw.mode
      : "cash";
  return {
    id: clampText(raw.id, 80) || newId("pay"),
    amount,
    mode,
    paidAt: cleanTimestamp(raw.paidAt, guestNow()),
  };
}

function normalizeOrder(value: unknown, now: string): GuestOrder | null {
  const raw = (value ?? {}) as Partial<GuestOrder>;
  const lines = Array.isArray(raw.lines)
    ? raw.lines
        .slice(0, MAX_LINES)
        .map((line, index) => normalizeLine(line, index))
        .filter((line): line is GuestLine => line !== null)
    : [];
  if (lines.length === 0) return null;

  const payments = Array.isArray(raw.payments)
    ? raw.payments
        .slice(0, MAX_LINES)
        .map(normalizePayment)
        .filter((payment): payment is GuestPayment => payment !== null)
    : [];

  const status: GuestOrderStatus =
    raw.status && isOrderStatus(raw.status) ? raw.status : "accepted";

  return {
    id: clampText(raw.id, 80) || newId("order"),
    code: clampText(raw.code, 20).trim() || guestOrderCode(),
    status,
    customerId: clampText(raw.customerId, 80).trim(),
    customerName: clampText(raw.customerName, 80).trim(),
    customerPhone: cleanPhone(raw.customerPhone),
    customerCountryCode: clampText(raw.customerCountryCode, 6).trim() || "+91",
    note: clampText(raw.note, 500).trim(),
    neededBy: cleanDate(raw.neededBy, guestToday()),
    timeSlot: clampText(raw.timeSlot, 20).trim(),
    createdAt: cleanTimestamp(raw.createdAt, now),
    billNo:
      typeof raw.billNo === "number" && Number.isFinite(raw.billNo)
        ? Math.max(1, Math.floor(raw.billNo))
        : 1,
    lines,
    payments,
  };
}

function normalizeExpense(value: unknown, now: string): GuestExpense | null {
  const raw = (value ?? {}) as Partial<GuestExpense>;
  const title = clampText(raw.title, 80).trim();
  if (!title) return null;
  return {
    id: clampText(raw.id, 80) || newId("expense"),
    title,
    paidFor: clampText(raw.paidFor, 80).trim(),
    amount: cleanMoney(raw.amount),
    date: cleanDate(raw.date, guestToday()),
    createdAt: cleanTimestamp(raw.createdAt, now),
  };
}

function normalizeCustomerAddress(value: unknown): GuestCustomerAddress | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<GuestCustomerAddress>;
  const line1 = clampText(raw.line1, 80).trim();
  if (!line1) return null;
  return {
    line1,
    line2: clampText(raw.line2, 80).trim(),
    line3: clampText(raw.line3, 80).trim(),
    city: clampText(raw.city, 60).trim(),
    state: clampText(raw.state, 60).trim(),
    country: clampText(raw.country, 60).trim() || "India",
    pincode: clampText(raw.pincode, 10).trim(),
  };
}

function normalizeCustomerRecord(
  value: unknown,
  now: string,
): GuestCustomerRecord | null {
  const raw = (value ?? {}) as Partial<GuestCustomerRecord>;
  const name = clampText(raw.name, 80).trim();
  if (!name) return null;
  return {
    id: clampText(raw.id, 80) || newId("customer"),
    name,
    countryCode: clampText(raw.countryCode, 6).trim() || "+91",
    phone: cleanPhone(raw.phone),
    subLabel: clampText(raw.subLabel, 60).trim(),
    address: normalizeCustomerAddress(raw.address),
    createdAt: cleanTimestamp(raw.createdAt, now),
  };
}

export function normalizeGuestState(value: unknown): GuestState | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<GuestState>;
  const now = guestNow();
  const shop = normalizeShop(raw.shop);

  const items = Array.isArray(raw.items)
    ? raw.items
        .slice(0, MAX_ITEMS)
        .map((item, index) => normalizeItem(item, index, now))
        .filter((item): item is GuestItem => item !== null)
    : starterItems(shop.pack, now);

  const orders = Array.isArray(raw.orders)
    ? raw.orders
        .slice(0, MAX_ORDERS)
        .map((order) => normalizeOrder(order, now))
        .filter((order): order is GuestOrder => order !== null)
    : [];

  const expenses = Array.isArray(raw.expenses)
    ? raw.expenses
        .slice(0, MAX_EXPENSES)
        .map((expense) => normalizeExpense(expense, now))
        .filter((expense): expense is GuestExpense => expense !== null)
    : [];

  const customers = Array.isArray(raw.customers)
    ? raw.customers
        .slice(0, MAX_CUSTOMERS)
        .map((customer) => normalizeCustomerRecord(customer, now))
        .filter((customer): customer is GuestCustomerRecord => customer !== null)
    : [];

  const highestBill = orders.reduce(
    (highest, order) => Math.max(highest, order.billNo),
    0,
  );
  const nextBillNo =
    typeof raw.nextBillNo === "number" && Number.isFinite(raw.nextBillNo)
      ? Math.max(Math.floor(raw.nextBillNo), highestBill + 1, 1)
      : highestBill + 1;

  return {
    version: 2,
    shop,
    items,
    customers,
    orders,
    expenses,
    nextBillNo,
  };
}

export function readGuestState(): GuestState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(GUEST_STORE_KEY);
    if (!raw) return null;
    return normalizeGuestState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function loadGuestState(): GuestState {
  return readGuestState() ?? createGuestState();
}

export function writeGuestState(state: GuestState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GUEST_STORE_KEY, JSON.stringify(state));
  } catch {
    // A full or blocked localStorage must never stop a sale.
  }
}

export function clearGuestState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(GUEST_STORE_KEY);
  } catch {
    // Nothing to clear.
  }
}

export function guestOrderCode(): string {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `G-${random}`;
}

export function guestOrderTotals(order: GuestOrder): {
  totalPaise: number;
  paidPaise: number;
  duePaise: number;
  status: GuestOrderStatus;
} {
  const totalPaise = order.lines.reduce(
    (total, line) => total + multiplyPaise(line.quantity, line.unitPrice),
    0,
  );
  const paidPaise = order.payments.reduce(
    (total, payment) => total + toPaise(payment.amount),
    0,
  );
  const duePaise = Math.max(0, totalPaise - paidPaise);
  let status: GuestOrderStatus = order.status;
  if (isCancelled(order.status)) {
    status = order.status;
  } else if (
    (isReady(order.status) || isCompleted(order.status)) &&
    paidPaise >= totalPaise &&
    totalPaise > 0
  ) {
    status = "completed";
  } else if (isCompleted(order.status) && duePaise > 0) {
    status = "ready";
  } else {
    status = order.status;
  }
  return { totalPaise, paidPaise, duePaise, status };
}

export function guestOrdersNewestFirst(state: GuestState): GuestOrder[] {
  return [...state.orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function guestStartOfToday(): number {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  return new Date(
    Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) -
      5.5 * 3600_000,
  ).getTime();
}

export function guestStartOfMonth(): number {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  return new Date(
    Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1) - 5.5 * 3600_000,
  ).getTime();
}

export function guestSummary(state: GuestState) {
  const todayStart = guestStartOfToday();
  const monthStart = guestStartOfMonth();

  let todaySalesPaise = 0;
  let receivedTodayPaise = 0;
  let pendingPaise = 0;
  let monthExpensePaise = 0;

  for (const order of state.orders) {
    if (isCancelled(order.status)) continue;
    const totals = guestOrderTotals(order);
    if (new Date(order.createdAt).getTime() >= todayStart) {
      todaySalesPaise += totals.totalPaise;
    }
    if (!isCompleted(totals.status)) pendingPaise += totals.duePaise;
    for (const payment of order.payments) {
      if (new Date(payment.paidAt).getTime() >= todayStart) {
        receivedTodayPaise += toPaise(payment.amount);
      }
    }
  }

  for (const expense of state.expenses) {
    if (new Date(`${expense.date}T00:00:00`).getTime() >= monthStart) {
      monthExpensePaise += toPaise(expense.amount);
    }
  }

  return {
    todaySalesPaise,
    receivedTodayPaise,
    pendingPaise,
    monthExpensePaise,
    orderCount: state.orders.length,
    itemCount: state.items.length,
    customerCount: guestCustomers(state).length,
  };
}

export type GuestCustomer = {
  key: string;
  id: string;
  countryCode: string;
  name: string;
  phone: string;
  pendingPaise: number;
  totalPaise: number;
  orderCount: number;
  lastPaidAt: string | null;
  subLabel: string;
  address: GuestCustomerAddress | null;
  orderDues: Array<{
    id: string;
    code: string;
    duePaise: number;
    status: GuestOrderStatus;
    neededBy: string;
  }>;
};

export function guestCustomerKey(order: GuestOrder): string | null {
  if (order.customerPhone) {
    return `phone:${order.customerCountryCode || "+91"}${order.customerPhone}`;
  }
  if (order.customerId) return `id:${order.customerId}`;
  const name = order.customerName.trim().toLowerCase();
  if (name) return `legacy-name:${name}`;
  return null;
}

export function guestCustomers(state: GuestState): GuestCustomer[] {
  const map = new Map<string, GuestCustomer>();

  for (const record of state.customers) {
    const key = guestCustomerRecordKey(record);
    map.set(key, {
      key,
      id: record.id,
      countryCode: record.countryCode,
      name: record.name,
      phone: record.phone,
      pendingPaise: 0,
      totalPaise: 0,
      orderCount: 0,
      lastPaidAt: null,
      subLabel: record.subLabel,
      address: record.address,
      orderDues: [],
    });
  }

  for (const order of state.orders) {
    if (isCancelled(order.status)) continue;
    const key = guestCustomerKey(order);
    if (!key) continue;
    const totals = guestOrderTotals(order);
    const entry =
      map.get(key) ??
      ({
        key,
        id: "",
        countryCode: "+91",
        name: order.customerName || "Buyer",
        phone: order.customerPhone,
        pendingPaise: 0,
        totalPaise: 0,
        orderCount: 0,
        lastPaidAt: null,
        subLabel: "",
        address: null,
        orderDues: [],
      } satisfies GuestCustomer);

    entry.name = order.customerName || entry.name;
    entry.phone = order.customerPhone || entry.phone;
    entry.pendingPaise += isCompleted(totals.status) ? 0 : totals.duePaise;
    if (!isCompleted(totals.status) && totals.duePaise > 0) {
      entry.orderDues.push({
        id: order.id,
        code: order.code,
        duePaise: totals.duePaise,
        status: totals.status,
        neededBy: order.neededBy,
      });
    }
    entry.totalPaise += totals.totalPaise;
    entry.orderCount += 1;
    for (const payment of order.payments) {
      if (!entry.lastPaidAt || payment.paidAt > entry.lastPaidAt) {
        entry.lastPaidAt = payment.paidAt;
      }
    }
    map.set(key, entry);
  }

  return [...map.values()].sort((a, b) => {
    if (b.pendingPaise !== a.pendingPaise) {
      return b.pendingPaise - a.pendingPaise;
    }
    return a.name.localeCompare(b.name);
  });
}

export function guestCustomerOrders(
  state: GuestState,
  key: string,
): GuestOrder[] {
  return guestOrdersNewestFirst(state).filter(
    (order) => guestCustomerKey(order) === key,
  );
}

export function addGuestOrder(
  state: GuestState,
  input: GuestOrderInput,
): { state: GuestState; orderId: string } {
  const lines: GuestLine[] = input.lines
    .slice(0, MAX_LINES)
    .map((line, index) => ({
      id: `line_${Date.now()}_${index}`,
      itemId: line.itemId ?? null,
      itemName: line.itemName,
      optionName: line.optionName ?? null,
      extras: line.extras ?? [],
      quantity: cleanQuantity(line.quantity),
      unitPrice: cleanMoney(line.unitPrice),
      unitLabel: line.unitLabel || "item",
      note: line.note?.trim() || null,
    }))
    .filter(
      (line) => multiplyPaise(line.quantity, line.unitPrice) > 0,
    );

  if (lines.length === 0) return { state, orderId: "" };

  // Make sure a selected or typed customer has a record with a stable id.
  // A phone is the only automatic match; a name alone never merges.
  const customerName = input.customerName?.trim().slice(0, 80) ?? "";
  const customerPhone = cleanPhone(input.customerPhone ?? "");
  let baseState = state;
  let customerId = input.customerId?.trim().slice(0, 80) ?? "";
  if (!customerId && (customerName || customerPhone)) {
    baseState = addGuestCustomer(state, {
      name: customerName || `Buyer ${customerPhone.slice(-4)}`,
      countryCode: input.customerCountryCode,
      phone: customerPhone,
      subLabel: input.customerSubLabel,
    });
    customerId = guestCustomerIdFor(baseState, {
      name: customerName,
      phone: customerPhone,
      countryCode: input.customerCountryCode,
    });
  }

  const totalPaise = lines.reduce(
    (total, line) => total + multiplyPaise(line.quantity, line.unitPrice),
    0,
  );

  const paidInput = Math.min(
    Math.max(toPaise(input.paidAmount ?? "0"), 0),
    totalPaise,
  );

  let code = guestOrderCode();
  const codes = new Set(baseState.orders.map((order) => order.code));
  while (codes.has(code)) code = guestOrderCode();

  const order: GuestOrder = {
    id: newId("order"),
    code,
    status:
      input.status ??
      (input.when === "now"
        ? paidInput >= totalPaise
          ? "completed"
          : "ready"
        : "accepted"),
    customerId,
    customerName,
    customerPhone,
    customerCountryCode: input.customerCountryCode?.trim().slice(0, 6) || "+91",
    note: input.note?.trim().slice(0, 500) ?? "",
    neededBy: cleanDate(input.neededBy, guestToday()),
    timeSlot: input.timeSlot?.trim().slice(0, 20) ?? "",
    createdAt: guestNow(),
    billNo: baseState.nextBillNo,
    lines,
    payments:
      paidInput > 0
        ? [
            {
              id: newId("pay"),
              amount: fromPaise(paidInput),
              mode: input.paymentMode ?? "cash",
              paidAt: guestNow(),
            },
          ]
        : [],
  };

  return {
    orderId: order.id,
    state: {
      ...baseState,
      orders: [order, ...baseState.orders].slice(0, MAX_ORDERS),
      nextBillNo: baseState.nextBillNo + 1,
    },
  };
}

export function addGuestPayment(
  state: GuestState,
  orderId: string,
  amount: string,
  mode: GuestPaymentMode,
): GuestState {
  const order = state.orders.find((entry) => entry.id === orderId);
  if (!order || isCancelled(order.status)) return state;
  const totals = guestOrderTotals(order);
  const value = Math.min(Math.max(toPaise(amount), 0), totals.duePaise);
  if (value <= 0) return state;

  const paidPaise = totals.paidPaise + value;
  return {
    ...state,
    orders: state.orders.map((entry) =>
      entry.id === orderId
        ? {
            ...entry,
            status:
              paidPaise >= totals.totalPaise && isReady(entry.status)
                ? "completed"
                : entry.status,
            payments: [
              ...entry.payments,
              {
                id: newId("pay"),
                amount: fromPaise(value),
                mode,
                paidAt: guestNow(),
              },
            ],
          }
        : entry,
    ),
  };
}

export function setGuestOrderStatus(
  state: GuestState,
  orderId: string,
  status: GuestOrderStatus,
): GuestState {
  return {
    ...state,
    orders: state.orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status:
              status === "ready" && guestOrderTotals(order).duePaise === 0
                ? "completed"
                : status,
          }
        : order,
    ),
  };
}

export function addGuestItem(
  state: GuestState,
  input: {
    name: string;
    price: string;
    unitLabel: string;
    category?: string;
    description?: string;
    photo?: string | null;
    variants?: GuestItemVariant[];
    availability?: GuestItemAvailability | null;
  },
): GuestState {
  const name = input.name.trim().slice(0, 80);
  if (!name) return state;
  const item: GuestItem = {
    id: newId("item"),
    name,
    price: cleanMoney(input.price),
    unitLabel: input.unitLabel.trim().slice(0, 20) || "item",
    isAvailable: true,
    sortOrder: state.items.length,
    createdAt: guestNow(),
    category: input.category?.trim().slice(0, 60) ?? "",
    description: input.description?.trim().slice(0, 200) ?? "",
    photo: cleanPhoto(input.photo),
    variants: (input.variants ?? [])
      .map((variant) => ({
        name: variant.name.trim().slice(0, 60),
        price: cleanMoney(variant.price),
        subVariants: (variant.subVariants ?? [])
          .map((sub) => ({
            name: sub.name.trim().slice(0, 60),
            price: cleanMoney(sub.price),
          }))
          .filter((sub) => sub.name),
      }))
      .filter((variant) => variant.name),
    availability: input.availability ?? null,
  };
  return { ...state, items: [...state.items, item].slice(0, MAX_ITEMS) };
}

export function guestCustomerRecordKey(
  record: Pick<GuestCustomerRecord, "id" | "name" | "phone" | "countryCode">,
): string {
  if (record.phone) return `phone:${record.countryCode || "+91"}${record.phone}`;
  return `id:${record.id}`;
}

export function findGuestCustomerByPhone(
  state: GuestState,
  phone: string,
  countryCode = "+91",
): GuestCustomerRecord | null {
  const clean = cleanPhone(phone);
  if (!clean) return null;
  const code = countryCode.trim() || "+91";
  return (
    state.customers.find(
      (record) =>
        record.phone === clean &&
        (record.countryCode || "+91") === code,
    ) ?? null
  );
}

export function findGuestCustomersByName(
  state: GuestState,
  name: string,
): GuestCustomerRecord[] {
  const clean = name.trim().toLowerCase();
  if (!clean) return [];
  return state.customers.filter(
    (record) => record.name.trim().toLowerCase() === clean,
  );
}

export function guestCustomerIdFor(
  state: GuestState,
  input: { name?: string; phone?: string; countryCode?: string },
): string {
  const phone = cleanPhone(input.phone ?? "");
  if (phone) {
    return (
      findGuestCustomerByPhone(state, phone, input.countryCode)?.id ?? ""
    );
  }
  const name = input.name?.trim() ?? "";
  if (!name) return "";
  const matches = findGuestCustomersByName(state, name);
  return matches[matches.length - 1]?.id ?? "";
}

export function addGuestCustomer(
  state: GuestState,
  input: {
    name: string;
    countryCode?: string;
    phone?: string;
    subLabel?: string;
    address?: GuestCustomerAddress | null;
  },
): GuestState {
  const name = input.name.trim().slice(0, 80);
  if (!name) return state;
  const phone = cleanPhone(input.phone ?? "");
  const countryCode = input.countryCode?.trim().slice(0, 6) || "+91";

  // A phone plus its country code is the only automatic match. A name is never
  // a key: two Rameshes are two people, and the merchant confirms a match in
  // the UI instead.
  const existing = phone
    ? state.customers.find(
        (record) =>
          record.phone === phone &&
          (record.countryCode || "+91") === countryCode,
      )
    : undefined;

  if (existing) {
    return {
      ...state,
      customers: state.customers.map((record) =>
        record.id === existing.id
          ? {
              ...record,
              name,
              countryCode: input.countryCode?.trim() || record.countryCode,
              subLabel: input.subLabel?.trim() || record.subLabel,
              address: input.address ?? record.address,
            }
          : record,
      ),
    };
  }

  const record: GuestCustomerRecord = {
    id: newId("customer"),
    name,
    countryCode,
    phone,
    subLabel: input.subLabel?.trim().slice(0, 60) ?? "",
    address: input.address ?? null,
    createdAt: guestNow(),
  };

  return {
    ...state,
    customers: [record, ...state.customers].slice(0, MAX_CUSTOMERS),
  };
}

export function updateGuestItem(
  state: GuestState,
  id: string,
  patch: Partial<Pick<GuestItem, "name" | "price" | "unitLabel" | "isAvailable">>,
): GuestState {
  return {
    ...state,
    items: state.items.map((item) =>
      item.id === id
        ? {
            ...item,
            ...patch,
            name: patch.name?.trim().slice(0, 80) || item.name,
            price:
              patch.price === undefined
                ? item.price
                : cleanMoney(patch.price),
            unitLabel:
              patch.unitLabel?.trim().slice(0, 20) || item.unitLabel,
          }
        : item,
    ),
  };
}

export function deleteGuestItem(state: GuestState, id: string): GuestState {
  return {
    ...state,
    items: state.items.filter((item) => item.id !== id),
  };
}

export function addGuestExpense(
  state: GuestState,
  input: { title: string; paidFor?: string; amount: string; date: string },
): GuestState {
  const title = input.title.trim().slice(0, 80);
  const amount = cleanMoney(input.amount);
  if (!title || toPaise(amount) <= 0) return state;
  const expense: GuestExpense = {
    id: newId("expense"),
    title,
    paidFor: input.paidFor?.trim().slice(0, 80) ?? "",
    amount,
    date: cleanDate(input.date, guestToday()),
    createdAt: guestNow(),
  };
  return { ...state, expenses: [expense, ...state.expenses].slice(0, MAX_EXPENSES) };
}

export function deleteGuestExpense(state: GuestState, id: string): GuestState {
  return {
    ...state,
    expenses: state.expenses.filter((expense) => expense.id !== id),
  };
}

export function updateGuestShop(
  state: GuestState,
  patch: Partial<GuestShop>,
): GuestState {
  const shop = normalizeShop({ ...state.shop, ...patch });
  return { ...state, shop };
}

export function guestCashSummary(
  state: GuestState,
  since: number | null,
): { receivedPaise: number; spentPaise: number; leftPaise: number } {
  let receivedPaise = 0;
  for (const order of state.orders) {
    if (isCancelled(order.status)) continue;
    for (const payment of order.payments) {
      if (since === null || new Date(payment.paidAt).getTime() >= since) {
        receivedPaise += toPaise(payment.amount);
      }
    }
  }

  let spentPaise = 0;
  for (const expense of state.expenses) {
    if (
      since === null ||
      new Date(`${expense.date}T00:00:00`).getTime() >= since
    ) {
      spentPaise += toPaise(expense.amount);
    }
  }

  return {
    receivedPaise,
    spentPaise,
    leftPaise: receivedPaise - spentPaise,
  };
}

export function guestCustomItems(state: GuestState): GuestItem[] {
  const baseline = starterItems(state.shop.pack);
  const baselineByName = new Map(
    baseline.map((item) => [item.name.toLowerCase(), item]),
  );

  return state.items.filter((item) => {
    const original = baselineByName.get(item.name.toLowerCase());
    if (!original) return true;
    return (
      original.price !== item.price ||
      original.unitLabel !== item.unitLabel ||
      original.isAvailable !== item.isAvailable
    );
  });
}

export function guestHasContent(state: GuestState): boolean {
  return (
    state.orders.length > 0 ||
    state.expenses.length > 0 ||
    guestCustomItems(state).length > 0 ||
    state.items.length !== starterItems(state.shop.pack).length
  );
}

export function guestImportPayload(
  state: GuestState,
): GuestImportPayload | null {
  if (!guestHasContent(state)) return null;

  return {
    items: state.items.map((item) => ({
      name: item.name,
      price: item.price,
      unitLabel: item.unitLabel,
      isAvailable: item.isAvailable,
    })),
    orders: guestOrdersNewestFirst(state).map((order) => ({
      code: order.code,
      customerName: order.customerName || null,
      customerPhone: order.customerPhone || null,
      note: order.note || null,
      neededBy: order.neededBy,
      createdAt: order.createdAt,
      status: order.status,
      lines: order.lines.map((line) => ({
        itemName: line.itemName,
        optionName: line.optionName,
        extras: line.extras,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        unitLabel: line.unitLabel,
        note: line.note,
      })),
      payments: order.payments.map((payment) => ({
        amount: payment.amount,
        mode: payment.mode,
        paidAt: payment.paidAt,
      })),
    })),
    expenses: state.expenses.map((expense) => ({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
    })),
  };
}

export function guestSalesCsv(state: GuestState): string {
  const rows = [
    ["order_code", "date", "customer", "phone", "status", "total", "paid", "due"],
  ];
  for (const order of guestOrdersNewestFirst(state)) {
    const totals = guestOrderTotals(order);
    rows.push([
      order.code,
      order.createdAt.slice(0, 10),
      order.customerName || "Walk-in",
      order.customerPhone,
      totals.status,
      fromPaise(totals.totalPaise),
      fromPaise(totals.paidPaise),
      fromPaise(totals.duePaise),
    ]);
  }
  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
}

export function guestHomeDashboard(
  state: GuestState,
  targetDayStr?: string,
): HomeDashboardData {
  const todayStr = istDateString();
  const selectedDay =
    targetDayStr && /^\d{4}-\d{2}-\d{2}$/.test(targetDayStr)
      ? targetDayStr
      : todayStr;
  const isToday = selectedDay === todayStr;
  const selectedDayLabel = formatDayHeading(selectedDay);

  const todayStart = startOfTodayIst().getTime();
  const weekStart = startOfWeekIst().getTime();

  function getOrderLines(order: GuestOrder): OrderLinePreview[] {
    return order.lines.map((line) => ({
      itemName: line.itemName,
      quantity: line.quantity,
      unitPrice: formatPaise(Number(line.unitPrice)),
      unitLabel: line.unitLabel,
      optionName: line.optionName,
      extraNames: line.extras.map((extra) => extra.name),
      extras: line.extras.map((extra) => ({
        name: extra.name,
        priceDelta: formatPaise(Number(extra.priceDelta)),
      })),
      lineTotal: formatPaise(multiplyPaise(line.quantity, line.unitPrice)),
      note: line.note,
    }));
  }

  function getOrderSummary(order: GuestOrder): string {
    return orderSummary(order.lines.map((line) => line.itemName));
  }

  // 1. KPIs
  let todayToCollectDue = 0;
  let todayToCollectCount = 0;

  let todayPaidTotal = 0;
  const ordersPaidToday = new Set<string>();

  let weekSalesTotal = 0;
  let weekSalesCount = 0;

  let weekReceived = 0;

  for (const order of state.orders) {
    if (isCancelled(order.status)) continue;
    const totals = guestOrderTotals(order);
    const orderCreatedAt = new Date(order.createdAt).getTime();

    // Today to collect
    const isTargetToday =
      order.neededBy === todayStr || orderCreatedAt >= todayStart;
    if (isTargetToday && !isCompleted(totals.status) && totals.duePaise > 0) {
      todayToCollectDue += totals.duePaise;
      todayToCollectCount += 1;
    }

    // Week sales
    if (orderCreatedAt >= weekStart) {
      weekSalesTotal += totals.totalPaise;
      weekSalesCount += 1;
    }

    // Payments
    for (const payment of order.payments) {
      const paidAtTime = new Date(payment.paidAt).getTime();
      const amountPaise = toPaise(payment.amount);
      if (paidAtTime >= todayStart) {
        todayPaidTotal += amountPaise;
        ordersPaidToday.add(order.id);
      }
      if (paidAtTime >= weekStart) {
        weekReceived += amountPaise;
      }
    }
  }

  // Week expenses
  let weekExpenseTotal = 0;
  let weekExpenseCount = 0;
  for (const expense of state.expenses) {
    const expenseTime = new Date(`${expense.date}T00:00:00`).getTime();
    if (expenseTime >= weekStart) {
      const amountPaise = toPaise(expense.amount);
      weekExpenseTotal += amountPaise;
      weekExpenseCount += 1;
    }
  }

  const weekCashLeftPaise = weekReceived - weekExpenseTotal;

  const kpis: HomeDashboardData["kpis"] = {
    todayToCollect: {
      label: "Today · To collect",
      amount: formatPaise(todayToCollectDue),
      compactAmount: formatCompactPaise(todayToCollectDue),
      rawAmount: todayToCollectDue / 100,
      count: todayToCollectCount,
      countLabel: `${todayToCollectCount} ${todayToCollectCount === 1 ? "order" : "orders"}`,
      period: "Today",
    },
    todayPaid: {
      label: "Today · Paid",
      amount: formatPaise(todayPaidTotal),
      compactAmount: formatCompactPaise(todayPaidTotal),
      rawAmount: todayPaidTotal / 100,
      count: ordersPaidToday.size,
      countLabel: `${ordersPaidToday.size} ${ordersPaidToday.size === 1 ? "order" : "orders"}`,
      period: "Today",
    },
    thisWeekSales: {
      label: "This week · Sales",
      amount: formatPaise(weekSalesTotal),
      compactAmount: formatCompactPaise(weekSalesTotal),
      rawAmount: weekSalesTotal / 100,
      count: weekSalesCount,
      countLabel: `${weekSalesCount} ${weekSalesCount === 1 ? "order" : "orders"}`,
      period: "Monday to Sunday",
    },
    thisWeekExpenses: {
      label: "This week · Expenses",
      amount: formatPaise(weekExpenseTotal),
      compactAmount: formatCompactPaise(weekExpenseTotal),
      rawAmount: weekExpenseTotal / 100,
      count: weekExpenseCount,
      countLabel: `${weekExpenseCount} ${weekExpenseCount === 1 ? "entry" : "entries"}`,
      period: "Monday to Sunday",
    },
    thisWeekCashLeft: {
      label: "This week · Cash left",
      amount: formatPaise(weekCashLeftPaise),
      compactAmount: formatCompactPaise(weekCashLeftPaise),
      rawAmount: weekCashLeftPaise / 100,
      period: "Monday to Sunday",
      hint: "Received − expenses · not profit",
    },
  };

  // 2. Day view. Every order needed on the selected day, whatever its status,
  // so the guest view matches the owner view.
  const dayOrders = state.orders.filter(
    (order) => order.neededBy === selectedDay,
  );

  const anyTime: DayOrderItem[] = [];
  const timeline: DayOrderItem[] = [];

  for (const order of dayOrders) {
    const totals = guestOrderTotals(order);
    const item: DayOrderItem = {
      id: order.id,
      code: order.code,
      customerName: order.customerName || "Walk-in sale",
      itemsSummary: getOrderSummary(order),
      total: formatPaise(totals.totalPaise),
      due: totals.duePaise > 0 ? formatPaise(totals.duePaise) : "₹0.00",
      status: totals.status,
      timeSlot: order.timeSlot || null,
      neededBy: order.neededBy,
      note: order.note || null,
      customerPhone: order.customerPhone || undefined,
      customerCountryCode: order.customerCountryCode || "+91",
      lines: getOrderLines(order),
      isGhost: false,
    };
    if (hasScheduledTime(order.timeSlot)) timeline.push(item);
    else anyTime.push(item);
  }

  timeline.sort((a, b) =>
    (a.timeSlot ?? "").localeCompare(b.timeSlot ?? ""),
  );

  // 4. Cross-day queue; fully paid work remains until its ready status is set.
  const incompleteOrderRows: IncompleteOrder[] = state.orders.flatMap((order) => {
    const totals = guestOrderTotals(order);
    // Ready work belongs to the payment-due list, not the work queue.
    if (isClosed(totals.status) || isReady(totals.status)) {
      return [];
    }

    return [{
      id: order.id,
      code: order.code,
      customerName: order.customerName || "Walk-in sale",
      customerPhone: order.customerPhone || undefined,
      customerCountryCode: order.customerCountryCode || "+91",
      itemsSummary: getOrderSummary(order),
      total: formatPaise(totals.totalPaise),
      due: formatPaise(totals.duePaise),
      duePaise: totals.duePaise,
      status: totals.status,
      neededBy: order.neededBy,
      timeSlot: order.timeSlot || null,
      createdAt: order.createdAt,
      note: order.note || null,
      lines: getOrderLines(order),
    }];
  });
  const incompleteSummary = summarizeIncompleteOrders(incompleteOrderRows);
  const incompleteOrders: HomeDashboardData["incompleteOrders"] = {
    toFinishCount: incompleteSummary.toFinishCount,
    readyCount: incompleteSummary.readyCount,
    totalCount: incompleteSummary.totalCount,
    totalDue: formatPaise(incompleteSummary.totalDuePaise),
    orders: incompleteSummary.orders,
  };

  // Done work with a balance still due.
  const completedDueOrders: IncompleteOrder[] = state.orders.flatMap((order) => {
    const totals = guestOrderTotals(order);
    if (!isReady(totals.status) && !isCompleted(totals.status)) return [];
    if (totals.duePaise <= 0) return [];
    return [{
      id: order.id,
      code: order.code,
      customerName: order.customerName || "Walk-in sale",
      customerPhone: order.customerPhone || undefined,
      customerCountryCode: order.customerCountryCode || "+91",
      itemsSummary: getOrderSummary(order),
      total: formatPaise(totals.totalPaise),
      due: formatPaise(totals.duePaise),
      duePaise: totals.duePaise,
      status: totals.status,
      neededBy: order.neededBy,
      timeSlot: order.timeSlot || null,
      createdAt: order.createdAt,
      note: order.note || null,
      lines: getOrderLines(order),
    }];
  });
  const completedSummary = summarizeIncompleteOrders(completedDueOrders);
  const completedWithDue: HomeDashboardData["completedWithDue"] = {
    totalCount: completedSummary.totalCount,
    totalDue: formatPaise(completedSummary.totalDuePaise),
    orders: completedSummary.orders,
  };

  // 5. To collect from customers
  const customers = guestCustomers(state)
    .filter((c) => c.pendingPaise > 0)
    .sort((a, b) => b.pendingPaise - a.pendingPaise);

  const customerDues: CustomerDue[] = customers.slice(0, 5).map((c) => ({
    id: c.key,
    name: c.name || c.phone,
    phone: c.phone || undefined,
    countryCode: c.countryCode || "+91",
    pending: formatPaise(c.pendingPaise),
    lastPaidDate: c.lastPaidAt ? c.lastPaidAt.slice(0, 10) : null,
    orderDues: c.orderDues.map((order) => ({
      id: order.id,
      code: order.code,
      due: formatPaise(order.duePaise),
      status: order.status,
      neededBy: order.neededBy,
    })),
  }));
  const customerDuesSummary = {
    count: customers.length,
    total: formatPaise(customers.reduce((sum, c) => sum + c.pendingPaise, 0)),
  };

  return {
    shopName: state.shop.name,
    handle: state.shop.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    isOwner: false,
    isPassExpired: false,
    selectedDay,
    selectedDayLabel,
    isToday,
    kpis,
    requests: {
      count: 0,
      oldestAge: "",
      requests: [],
    },
    dayView: {
      anyTime,
      timeline,
      ghosts: [],
    },
    incompleteOrders,
    completedWithDue,
    customerDues,
    customerDuesSummary,
  };
}
