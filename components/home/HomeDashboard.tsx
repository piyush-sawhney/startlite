"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  HomeDashboardData,
  IncompleteOrder,
  CustomerDue,
} from "@/lib/home-types";
import type { PublicItem } from "@/lib/queries";
import { istDateString } from "@/lib/date";
import { dec, formatAmount } from "@/lib/money";
import { AddSaleModal } from "./AddSaleModal";
import { RequestBar, RequestDesktopPill } from "./RequestBar";
import { RequestsPanel } from "./RequestsPanel";
import { QuickActions } from "./QuickActions";
import { DayView } from "./DayView";
import { IncompleteOrders } from "./IncompleteOrders";
import { OrderDetailsModal, type HomeOrderPreview } from "./OrderDetailsModal";
import { EditOrderModal } from "./EditOrderModal";
import { CollectCustomers } from "./CollectCustomers";
import { AddCustomerModal, type CustomerInput } from "./AddCustomerModal";
import { AddItemModal, type ItemInput } from "./AddItemModal";
import { AddExpenseModal, type ExpenseInput } from "./AddExpenseModal";
import { CollectPaymentModal } from "./CollectPaymentModal";
import { LaunchSheet } from "./LaunchSheet";
import { SessionExpired } from "./SessionExpired";

export function HomeDashboard({
  initialData,
  isOwner,
  saleItems = [],
  onGuestAction,
  onGuestPayment,
  onGuestStatusChange,
  onGuestAddCustomer,
  onGuestAddItem,
  onGuestAddExpense,
  onGuestSelectDay,
  hasLocalShop = false,
}: {
  initialData: HomeDashboardData;
  isOwner: boolean;
  saleItems?: PublicItem[];
  onGuestAction?: (
    action: "add-sale" | "customer" | "item" | "expense" | "sale" | "sales",
    id?: string,
  ) => void;
  onGuestPayment?: (
    orderId: string,
    amount: string,
    mode: string,
    note?: string,
  ) => Promise<void>;
  onGuestStatusChange?: (orderId: string, status: "ready" | "accepted" | "cancelled") => void;
  onGuestAddCustomer?: (data: CustomerInput) => void;
  onGuestAddItem?: (data: ItemInput) => void;
  onGuestAddExpense?: (data: ExpenseInput) => void;
  onGuestSelectDay?: (day: string) => void;
  /** Guest-only: a local shop already exists, so skip the first-run sheet. */
  hasLocalShop?: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState<HomeDashboardData>(initialData);
  const [showLaunchSheet, setShowLaunchSheet] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [showRequestsPanel, setShowRequestsPanel] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<HomeOrderPreview | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDue | null>(null);
  const [editOrder, setEditOrder] = useState<IncompleteOrder | null>(null);

  // Quick action sheets
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [collectOrder, setCollectOrder] = useState<{
    id: string;
    customerName: string;
    due: string;
  } | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // Pull-to-refresh (signed-in owner only; guest is a no-op per spec)
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef<number | null>(null);

  // Connectivity is shown in the pill and blocks owner writes while offline.
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    const sync = () => setIsOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  // A guest's dashboard is derived from local state, so re-sync when it changes.
  useEffect(() => {
    if (!isOwner) setData(initialData);
  }, [initialData, isOwner]);

  // Launch sheet is first-run only: no session, no local shop, no prior flag.
  // A returning guest with data must never see it, even on an empty day.
  useEffect(() => {
    if (isOwner || hasLocalShop) return;
    const seen = localStorage.getItem("startlite_launch_seen");
    if (!seen) setShowLaunchSheet(true);
  }, [isOwner, hasLocalShop]);

  // Toast timer (5s for undo/info)
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Keyboard shortcuts (desktop)
  useEffect(() => {
    if (!isOwner) return;
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture when typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        return;
      }

      if (e.key === "Escape") {
        // Close the active overlay
        if (showAddSale) { setShowAddSale(false); return; }
        if (showAddCustomerModal) { setShowAddCustomerModal(false); return; }
        if (showAddItemModal) { setShowAddItemModal(false); return; }
        if (showAddExpenseModal) { setShowAddExpenseModal(false); return; }
        if (selectedOrder) { setSelectedOrder(null); return; }
        if (editOrder) { setEditOrder(null); return; }
        if (selectedCustomer) { setSelectedCustomer(null); return; }
        if (collectOrder) { setCollectOrder(null); return; }
        if (showRequestsPanel) { setShowRequestsPanel(false); return; }
        return;
      }

      if (e.key === "t" || e.key === "T") {
        handleSelectDay(istDateString());
        return;
      }

      if (e.key === "n" || e.key === "N") {
        handleAddSale();
        return;
      }

      // 1-6 switch tabs
      if (e.key >= "1" && e.key <= "6") {
        const tabIndex = parseInt(e.key) - 1;
        const tabRoutes = [
          "/app",
          "/app/sales",
          "/customers",
          "/app/catalog",
          "/app/more/expenses",
          "/app/more/settings",
        ];
        if (tabRoutes[tabIndex]) {
          router.push(tabRoutes[tabIndex]);
        }
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOwner,
    showAddSale,
    showAddCustomerModal,
    showAddItemModal,
    showAddExpenseModal,
    selectedOrder,
    editOrder,
    selectedCustomer,
    collectOrder,
    showRequestsPanel,
  ]);

  // Pull-to-refresh handler (owner only; guest is a no-op per spec)
  const PULL_THRESHOLD = 80;

  function handleTouchStart(e: React.TouchEvent) {
    if (!isOwner) return;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isOwner || touchStartY.current === null || refreshing) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      // Only pull from the top of the page
      if (window.scrollY > 0) return;
      e.preventDefault();
    }
  }

  async function handleTouchEnd(e: React.TouchEvent) {
    if (!isOwner || touchStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    touchStartY.current = null;
    if (delta > PULL_THRESHOLD) {
      setRefreshing(true);
      try {
        await refreshDashboard();
      } finally {
        setRefreshing(false);
      }
    }
  }

  // Refresh dashboard data
  async function refreshDashboard(targetDay = data.selectedDay) {
    if (isOwner) {
      try {
        const res = await fetch(`/api/v1/merchant/home?day=${targetDay}`);
        if (res.ok) {
          const body = await res.json();
          setData(body.data);
        } else if (res.status === 401) {
          setIsSessionExpired(true);
        }
      } catch (err) {
        console.error("Failed to refresh dashboard", err);
      }
    }
  }

  // Owner writes are not queued offline. Tell the merchant why nothing saved.
  function offlineNotice(): boolean {
    if (!isOwner || !isOffline) return false;
    setToast({ message: "You are offline. Saving needs a connection." });
    return true;
  }

  // Day navigation handler
  async function handleSelectDay(day: string) {
    if (isOwner) {
      await refreshDashboard(day);
    } else {
      onGuestSelectDay?.(day);
      setData((prev) => ({ ...prev, selectedDay: day }));
    }
  }

  // Complete action (accepted/in_progress -> ready) with 5-second Undo toast
  async function handleCompleteOrder(order: Pick<IncompleteOrder, "id">) {
    if (offlineNotice()) return;
    if (isOwner) {
      try {
        const res = await fetch(`/api/v1/merchant/orders/${order.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ready" }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error?.message ?? "Could not mark the order ready.");
        }

        router.refresh();
        await refreshDashboard();
        setToast({
          message: "Marked ready",
          actionLabel: "Undo",
          onAction: async () => {
            try {
              const undoResponse = await fetch(
                `/api/v1/merchant/orders/${order.id}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: "accepted" }),
                },
              );
              if (!undoResponse.ok) {
                const body = await undoResponse.json().catch(() => null);
                throw new Error(body?.error?.message ?? "Could not undo.");
              }
              router.refresh();
              await refreshDashboard();
              setToast(null);
            } catch (error) {
              setToast({
                message:
                  error instanceof Error ? error.message : "Could not undo.",
              });
            }
          },
        });
      } catch (error) {
        setToast({
          message:
            error instanceof Error
              ? error.message
              : "Could not mark the order ready.",
        });
      }
    } else {
      onGuestStatusChange?.(order.id, "ready");
      setToast({
        message: "Marked complete",
        actionLabel: "Undo",
        onAction: () => {
          onGuestStatusChange?.(order.id, "accepted");
          setToast(null);
        },
      });
    }
  }

  async function handleAcceptQuote(orderId: string) {
    if (offlineNotice()) return;
    if (isOwner) {
      try {
        const response = await fetch(`/api/v1/merchant/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "accepted" }),
        });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error?.message ?? "Could not accept the order.");
        }
        await refreshDashboard();
      } catch (error) {
        setToast({
          message:
            error instanceof Error ? error.message : "Could not accept the order.",
        });
        return;
      }
    } else {
      onGuestStatusChange?.(orderId, "accepted");
    }
    setSelectedOrder(null);
    setToast({ message: "Order accepted" });
  }

  // Reopen a ready order back to accepted (more work was added).
  async function handleReopenOrder(orderId: string) {
    if (offlineNotice()) return;
    if (isOwner) {
      try {
        const response = await fetch(`/api/v1/merchant/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "accepted" }),
        });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error?.message ?? "Could not reopen the order.");
        }
        await refreshDashboard();
      } catch (error) {
        setToast({
          message:
            error instanceof Error ? error.message : "Could not reopen the order.",
        });
        return;
      }
    } else {
      onGuestStatusChange?.(orderId, "accepted");
    }
    setSelectedOrder(null);
    setToast({ message: "Order reopened" });
  }

  // Cancel an order. Past bills keep their records.
  async function handleCancelOrder(orderId: string) {
    if (offlineNotice()) return;
    if (isOwner) {
      try {
        const response = await fetch(`/api/v1/merchant/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "cancelled" }),
        });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error?.message ?? "Could not cancel the order.");
        }
        await refreshDashboard();
      } catch (error) {
        setToast({
          message:
            error instanceof Error ? error.message : "Could not cancel the order.",
        });
        return;
      }
    } else {
      onGuestStatusChange?.(orderId, "cancelled");
    }
    setSelectedOrder(null);
    setToast({ message: "Order cancelled" });
  }

  async function handleAcceptRequest(code: string) {
    if (offlineNotice()) return;
    const response = await fetch(
      `/api/v1/merchant/pending-orders/${code}/accept`,
      { method: "POST" },
    );
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error?.message ?? "Could not accept the request.");
    }
    setShowRequestsPanel(false);
    await refreshDashboard();
    setToast({ message: "Order accepted" });
  }

  // Collect payment against a ready order
  async function handleCollectSubmit(payment: {
    orderId: string;
    amount: string;
    mode: string;
    note?: string;
  }) {
    if (offlineNotice()) return;
    if (isOwner) {
      const res = await fetch(
        `/api/v1/merchant/orders/${payment.orderId}/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: payment.amount,
            paymentMode: payment.mode,
            note: payment.note ?? null,
          }),
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Could not save the payment.");
      }
      router.refresh();
      await refreshDashboard();
    } else {
      await onGuestPayment?.(
        payment.orderId,
        payment.amount,
        payment.mode,
        payment.note,
      );
    }
    setToast({ message: "Payment recorded" });
  }

  // Add Customer submit
  async function handleAddCustomerSubmit(customer: CustomerInput) {
    if (offlineNotice()) return;
    if (isOwner) {
      const res = await fetch("/api/v1/merchant/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer.name,
          phone: customer.phone ?? "",
          email: customer.email ?? "",
          subLabel: customer.subLabel ?? "",
          address: customer.address,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Could not save customer.");
      }
      router.refresh();
      await refreshDashboard();
    } else {
      onGuestAddCustomer?.(customer);
    }
    setToast({ message: `Customer ${customer.name} added` });
  }

  // Add Item submit
  async function handleAddItemSubmit(item: ItemInput) {
    if (offlineNotice()) return;
    if (isOwner) {
      const res = await fetch("/api/v1/merchant/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          basePrice: item.basePrice,
          unitLabel: item.unitLabel,
          priceMode: "fixed",
          isAvailable: true,
          options: (item.variants ?? []).map((variant) => ({
            name: variant.name,
            price: variant.price,
            isAvailable: true,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Could not save item.");
      }
      router.refresh();
      await refreshDashboard();
    } else {
      onGuestAddItem?.(item);
    }
    setToast({ message: `Item ${item.name} added` });
  }

  // Add Expense submit
  async function handleAddExpenseSubmit(expense: ExpenseInput) {
    if (offlineNotice()) return;
    if (isOwner) {
      const res = await fetch("/api/v1/merchant/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: expense.paidTo,
          amount: expense.amount,
          expenseDate: expense.date,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Could not record expense.");
      }
      router.refresh();
      await refreshDashboard();
    } else {
      onGuestAddExpense?.(expense);
    }
    setToast({ message: `Expense ₹${expense.amount} recorded` });
  }

  // Route navigations
  function handleOpenOrder(id: string) {
    const queued = data.incompleteOrders.orders.find((order) => order.id === id);
    if (queued) {
      setSelectedOrder(queued);
      return;
    }

    const dayOrder = [
      ...data.dayView.anyTime,
      ...data.dayView.timeline,
    ].find((order) => order.id === id);
    if (dayOrder) setSelectedOrder(dayOrder);
  }

  // The order sheet can hand straight off to the edit sheet for queued orders.
  // A storefront request opens the same order sheet as a real order. The
  // sheet then performs the relevant accept action for a pending request.
  function handleSelectRequest(req: (typeof data.requests.requests)[number]) {
    setShowRequestsPanel(false);
    setSelectedOrder({
      id: req.code,
      code: req.code,
      customerName: req.buyerName,
      itemsSummary: req.lines
        .map((line) => line.itemName)
        .join(", "),
      total: req.grandTotal,
      due: req.grandTotal,
      status: "under_review",
      neededBy: req.neededBy,
      timeSlot: req.timeSlot,
      note: req.note,
      customerPhone: req.buyerPhone,
      customerCountryCode: "+91",
      lines: req.lines.map((line) => ({
        itemName: line.itemName,
        quantity: line.quantity,
        unitPrice: line.lineTotal,
        unitLabel: line.unitLabel,
        optionName: line.optionName,
        extraNames: line.extraNames,
        lineTotal: line.lineTotal,
      })),
      isRequest: true,
    });
  }

  function handleEditSelectedOrder() {
    if (!selectedOrder) return;
    const queued = data.incompleteOrders.orders.find(
      (order) => order.id === selectedOrder.id,
    );
    if (!queued) return;
    setSelectedOrder(null);
    setEditOrder(queued);
  }

  // A due row leads straight to payment. The customer total is the sum of
  // their unpaid orders, so prefill from the first order with a balance.
  function handleSelectCustomer(id: string) {
    const customer = data.customerDues.find((entry) => entry.id === id);
    if (!customer) return;
    const unpaidOrder = data.incompleteOrders.orders.find(
      (order) =>
        order.customerName === customer.name && (order.duePaise ?? 0) > 0,
    );
    if (unpaidOrder) {
      setCollectOrder({
        id: unpaidOrder.id,
        customerName: customer.name,
        due: customer.pending,
      });
      return;
    }
    setSelectedCustomer(customer);
  }

  function handleAddSale() {
    if (isOwner) setShowAddSale(true);
    else onGuestAction?.("add-sale");
  }

  // Session expired view
  if (isSessionExpired) {
    return (
      <SessionExpired
        shopName={data.shopName}
        onUsePhoneInstead={() => {
          setIsSessionExpired(false);
          router.push("/");
        }}
      />
    );
  }

  // The two adapters keep these lists disjoint: work to finish, then work
  // that is done with a balance. Ready orders live only in payment due.
  const pendingWorkOrders = data.incompleteOrders.orders;
  const pendingPaymentOrders = data.completedWithDue.orders;

  function dueTotal(orders: IncompleteOrder[]): string {
    return formatAmount(
      orders.reduce((sum, order) => sum.plus(dec(order.duePaise ?? 0).div(100)), dec(0)),
    );
  }

  // Next upcoming day that has a pending order, used when today is empty.
  const nextOrderDay = data.isToday
    ? data.incompleteOrders.orders
        .map((o) => o.neededBy)
        .filter((d) => d >= data.selectedDay)
        .sort()[0]
    : undefined;

  return (
    <div
      className="relative min-h-dvh"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: isOwner ? "pan-y" : "auto" }}
    >
      {refreshing && isOwner ? (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-2 text-caption text-ink-muted border-b border-line bg-surface z-50">
          Refreshing…
        </div>
      ) : null}
      {/* Launch Sheet on fresh device */}
      {showLaunchSheet ? (
        <LaunchSheet
          onStartFresh={() => {
            localStorage.setItem("startlite_launch_seen", "true");
            setShowLaunchSheet(false);
          }}
        />
      ) : null}

      {/* A lapsed pass pauses the storefront but Home keeps working. */}
      {isOwner && data.isPassExpired ? (
        <div
          role="status"
          className="mt-3 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-small font-medium text-ink"
        >
          Your store is paused. Renew to make it live again.
        </div>
      ) : null}

      {/* Requests: compact bar on mobile, banner on desktop */}
      {data.requests.count > 0 ? (
        <div className="mt-3">
          <div className="lg:hidden">
            <RequestBar
              count={data.requests.count}
              oldestAge={data.requests.oldestAge}
              onReview={() => setShowRequestsPanel(true)}
            />
          </div>
        </div>
      ) : null}

      {/* Main grid: single column below 1200, main plus a day column above */}
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_360px] lg:items-start">
        <div className="space-y-6">
          {/* 1. Quick actions */}
          <QuickActions
            onAddSale={handleAddSale}
            onAddCustomer={() => setShowAddCustomerModal(true)}
            onAddItem={() => setShowAddItemModal(true)}
            onAddExpense={() => setShowAddExpenseModal(true)}
          />

          {/* 2. Work still to finish. */}
          <IncompleteOrders
            title="Pending orders"
            orders={pendingWorkOrders}
            totalDue={dueTotal(pendingWorkOrders)}
            totalCount={pendingWorkOrders.length}
            onOpenOrder={setSelectedOrder}
            onCollect={setCollectOrder}
            onEdit={isOwner ? (order) => setEditOrder(order) : undefined}
          />

          {/* 3. Work is done but money is still due. */}
          <IncompleteOrders
            title="Completed · payment due"
            orders={pendingPaymentOrders}
            totalDue={dueTotal(pendingPaymentOrders)}
            totalCount={pendingPaymentOrders.length}
            onOpenOrder={setSelectedOrder}
            onCollect={setCollectOrder}
            onEdit={isOwner ? (order) => setEditOrder(order) : undefined}
          />

          {/* 4. Day view, in flow below 1200 */}
          <div className="lg:hidden">
            <DayView
              selectedDay={data.selectedDay}
              isToday={data.isToday}
              anyTime={data.dayView.anyTime}
              timeline={data.dayView.timeline}
              ghosts={data.dayView.ghosts}
              onSelectDay={handleSelectDay}
              onSelectOrder={handleOpenOrder}
              onSelectGhost={() => setShowRequestsPanel(true)}
              onNewOrder={handleAddSale}
              nextOrderDay={nextOrderDay}
            />
          </div>

          {/* 6. Customers with dues */}
          <CollectCustomers
            customers={data.customerDues}
            summary={data.customerDuesSummary}
            onSelectCustomer={handleSelectCustomer}
            onViewAll={
              isOwner
                ? () => router.push("/customers")
                : () => onGuestAction?.("customer")
            }
          />

          <footer className="pt-2 text-center text-micro text-ink-subtle lg:hidden">
            StartLite · v1
          </footer>
        </div>

        {/* Desktop day column. It defaults to today and is the first thing the
            eye lands on after the header. */}
        <aside className="sticky top-20 hidden space-y-4 lg:block">
          {data.requests.count > 0 ? (
            <div className="flex justify-end">
              <RequestDesktopPill
                count={data.requests.count}
                oldestAge={data.requests.oldestAge}
                onReview={() => setShowRequestsPanel(true)}
              />
            </div>
          ) : null}

          <DayView
            selectedDay={data.selectedDay}
            isToday={data.isToday}
            anyTime={data.dayView.anyTime}
            timeline={data.dayView.timeline}
            ghosts={data.dayView.ghosts}
            onSelectDay={handleSelectDay}
            onSelectOrder={handleOpenOrder}
            onSelectGhost={() => setShowRequestsPanel(true)}
            onNewOrder={handleAddSale}
            nextOrderDay={nextOrderDay}
          />
        </aside>
      </div>

      {/* Add customer */}
      <AddCustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onSubmit={handleAddCustomerSubmit}
      />

      {/* Add item */}
      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onSubmit={handleAddItemSubmit}
      />

      {/* Add expense */}
      <AddExpenseModal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        onSubmit={handleAddExpenseSubmit}
      />

      {/* Collect payment */}
      <CollectPaymentModal
        order={collectOrder}
        isOpen={Boolean(collectOrder)}
        onClose={() => setCollectOrder(null)}
        onSubmit={handleCollectSubmit}
      />

      {/* Requests slide-out panel */}
      <RequestsPanel
        requests={data.requests.requests}
        isOpen={showRequestsPanel}
        onClose={() => setShowRequestsPanel(false)}
        onSelectRequest={handleSelectRequest}
      />

      <AddSaleModal
        isOpen={showAddSale && isOwner}
        onClose={() => setShowAddSale(false)}
        initialItems={saleItems}
        dueOrders={data.incompleteOrders.orders.filter(
          (order) => (order.duePaise ?? 0) > 0,
        )}
        onComplete={(message) => {
          setShowAddSale(false);
          setToast({ message: message ?? "Sale saved" });
          void refreshDashboard();
        }}
        onAddItem={handleAddItemSubmit}
        onAddCustomer={handleAddCustomerSubmit}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAccept={(id) => {
          if (selectedOrder?.isRequest) {
            setSelectedOrder(null);
            void handleAcceptRequest(id).catch((error) =>
              setToast({
                message:
                  error instanceof Error ? error.message : "Could not accept request.",
              }),
            );
            return;
          }
          handleAcceptQuote(id);
        }}
        onMarkReady={(id) => {
          setSelectedOrder(null);
          void handleCompleteOrder({ id });
        }}
        onReopen={isOwner && !selectedOrder?.isRequest ? handleReopenOrder : undefined}
        onCancelOrder={
          isOwner && !selectedOrder?.isRequest ? handleCancelOrder : undefined
        }
        onEdit={
          isOwner &&
          selectedOrder &&
          data.incompleteOrders.orders.some(
            (order) => order.id === selectedOrder.id,
          )
            ? handleEditSelectedOrder
            : undefined
        }
        billHref={
          isOwner && selectedOrder && !selectedOrder.isRequest
            ? `/app/sales/${selectedOrder.id}/bill`
            : undefined
        }
        onCollect={() => {
          if (!selectedOrder) return;
          const order = selectedOrder;
          setSelectedOrder(null);
          setCollectOrder({
            id: order.id,
            customerName: order.customerName,
            due: order.due,
          });
        }}
      />

      <EditOrderModal
        order={editOrder}
        items={saleItems}
        onClose={() => setEditOrder(null)}
        onSaved={() => {
          setEditOrder(null);
          void refreshDashboard();
          setToast({ message: "Order updated" });
        }}
      />

      {selectedCustomer ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-customer-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <section className="w-full max-w-[420px] rounded-t-2xl border border-line bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:pb-5">
            <h2 id="home-customer-title" className="text-body font-bold text-ink">
              {selectedCustomer.name}
            </h2>
            <p className="mt-2 text-small text-ink-muted">
              Pending {selectedCustomer.pending}
            </p>
            {selectedCustomer.lastPaidDate ? (
              <p className="mt-1 text-caption text-ink-subtle">
                Last paid {selectedCustomer.lastPaidDate}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="mt-5 min-h-11 w-full rounded-lg border border-line"
            >
              Close
            </button>
          </section>
        </div>
      ) : null}

      {/* Toast */}
      {toast ? (
        <div
          role="status"
          className="fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-[400px] items-center justify-between rounded-xl bg-ink px-4 py-3 text-small font-medium text-white shadow-xl lg:bottom-8 lg:left-[280px] lg:right-8 lg:mx-0 lg:max-w-none"
        >
          <span>{toast.message}</span>
          {toast.actionLabel && toast.onAction ? (
            <button
              type="button"
              onClick={toast.onAction}
              className="ml-4 font-bold text-accent-soft hover:underline"
            >
              {toast.actionLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
