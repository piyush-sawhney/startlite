import type { OrderStatus } from "./order-status";

export type HomeKpi = {
  label: string;
  amount: string; // Indian format, e.g. "₹4,250.00"
  compactAmount: string; // e.g. "₹1.04L" or "₹4,250.00"
  rawAmount: number;
  count?: number;
  countLabel?: string; // e.g. "7 orders", "18 entries"
  period: string; // "Today", "Monday to Sunday"
  hint?: string; // e.g. "Received − expenses · not profit"
};

export type HomeKpis = {
  todayToCollect: HomeKpi;
  todayPaid: HomeKpi;
  thisWeekSales: HomeKpi;
  thisWeekExpenses: HomeKpi;
  thisWeekCashLeft: HomeKpi;
};

export type DayOrderItem = {
  id: string;
  code: string;
  customerName: string;
  itemsSummary: string; // e.g. "Facial" or "2 items"
  total: string;
  due: string;
  status: OrderStatus;
  timeSlot?: string | null; // e.g. "10:00", "11:30"
  neededBy: string; // YYYY-MM-DD
  note?: string | null; // buyer's delivery note, shown on the card
  isGhost?: boolean;
};

export type IncompleteOrder = {
  id: string;
  code: string;
  customerName: string;
  customerPhone?: string;
  customerCountryCode?: string;
  itemsSummary: string;
  total: string;
  due: string;
  duePaise?: number;
  status: OrderStatus;
  neededBy: string;
  timeSlot?: string | null;
  createdAt: string;
  note?: string | null;
};

export type CustomerDue = {
  id: string;
  name: string;
  phone?: string;
  countryCode?: string;
  pending: string;
  lastPaidDate: string | null;
};

export type PendingRequestItem = {
  id: string;
  code: string;
  buyerName: string;
  buyerPhone: string;
  note: string | null;
  lines: Array<{
    itemName: string;
    optionName: string | null;
    extraNames: string[];
    quantity: string;
    unitLabel: string;
    lineTotal: string;
  }>;
  itemCount: number;
  grandTotal: string;
  createdAt: string;
  timeSlot?: string | null;
  neededBy: string;
};

export type PendingRequestSummary = {
  count: number;
  oldestAge: string; // e.g. "2h" or "3d"
  requests: PendingRequestItem[];
};

export type HomeDashboardData = {
  shopName: string;
  shopLogoUrl?: string | null;
  handle: string;
  isOwner: boolean;
  isPassExpired?: boolean;
  selectedDay: string; // YYYY-MM-DD
  selectedDayLabel: string; // e.g. "Sat, 21 Nov"
  isToday: boolean;
  kpis: HomeKpis;
  requests: PendingRequestSummary;
  dayView: {
    anyTime: DayOrderItem[];
    timeline: DayOrderItem[];
    ghosts: DayOrderItem[];
  };
  incompleteOrders: {
    toFinishCount: number;
    readyCount: number;
    totalDue: string;
    totalCount: number;
    orders: IncompleteOrder[];
  };
  customerDues: CustomerDue[];
};
