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
  status: "quote" | "open_tab" | "ready" | "settled" | "cancelled";
  timeSlot?: string | null; // e.g. "10:00", "11:30"
  neededBy: string; // YYYY-MM-DD
  isGhost?: boolean;
};

export type ReadyToCollectOrder = {
  id: string;
  code: string;
  customerName: string;
  itemsSummary: string;
  due: string;
  duePaise?: number;
  createdAt: string;
  readyAt?: string | null;
};

export type InProgressOrder = {
  id: string;
  code: string;
  customerName: string;
  itemsSummary: string;
  total: string;
  status: "quote" | "open_tab";
  timeSlot?: string | null;
  neededBy: string;
  createdAt: string;
};

export type CustomerDue = {
  id: string;
  name: string;
  pending: string;
  lastPaidDate: string | null;
};

export type PendingRequestItem = {
  id: string;
  code: string;
  buyerName: string;
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
  readyToCollect: {
    count: number;
    totalDue: string;
    orders: ReadyToCollectOrder[];
  };
  inProgress: {
    count: number;
    totalAmount: string;
    orders: InProgressOrder[];
  };
  customerDues: CustomerDue[];
};
