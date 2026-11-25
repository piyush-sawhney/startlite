"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  HomeDashboardData,
  IncompleteOrder,
  CustomerDue,
} from "@/lib/home-types";
import type { PublicItem } from "@/lib/queries";
import { NewSaleForm } from "@/components/NewSaleForm";
import { HomeHeader } from "./Header";
import {
  RequestBar,
  RequestDesktopBanner,
  RequestDesktopPill,
} from "./RequestBar";
import { RequestsPanel } from "./RequestsPanel";
import { KpiStrip } from "./KpiStrip";
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
import { EditShopNameModal } from "./EditShopNameModal";
import { ShopLogoModal } from "./ShopLogoModal";
import { SaveShopModal } from "./SaveShopModal";
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
  onGuestRenameShop,
  onGuestSelectDay,
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
  onGuestStatusChange?: (orderId: string, status: "ready" | "open_tab") => void;
  onGuestAddCustomer?: (data: CustomerInput) => void;
  onGuestAddItem?: (data: ItemInput) => void;
  onGuestAddExpense?: (data: ExpenseInput) => void;
  onGuestRenameShop?: (name: string) => void;
  onGuestSelectDay?: (day: string) => void;
}) {
  const router = useRouter();
  const [data, setData] = useState<HomeDashboardData>(initialData);
  const [showLaunchSheet, setShowLaunchSheet] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [showRequestsPanel, setShowRequestsPanel] = useState(false);
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditLogo, setShowEditLogo] = useState(false);
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

  // A guest's dashboard is derived from local state, so re-sync when it changes.
  useEffect(() => {
    if (!isOwner) setData(initialData);
  }, [initialData, isOwner]);

  // Launch sheet timing check on fresh device
  useEffect(() => {
    if (!isOwner) {
      const seen = localStorage.getItem("startlite_launch_seen");
      if (
        !seen &&
        data.kpis.todayToCollect.count === 0 &&
        data.kpis.todayPaid.count === 0
      ) {
        setShowLaunchSheet(true);
      }
    }
  }, [isOwner, data]);

  // Toast timer (5s for undo/info)
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

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

  // Day navigation handler
  async function handleSelectDay(day: string) {
    if (isOwner) {
      await refreshDashboard(day);
    } else {
      onGuestSelectDay?.(day);
      setData((prev) => ({ ...prev, selectedDay: day }));
    }
  }

  // Complete action (open_tab -> ready) with 5-second Undo toast
  async function handleCompleteOrder(order: Pick<IncompleteOrder, "id">) {
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
                  body: JSON.stringify({ status: "open_tab" }),
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
          onGuestStatusChange?.(order.id, "open_tab");
          setToast(null);
        },
      });
    }
  }

  async function handleAcceptQuote(orderId: string) {
    if (isOwner) {
      try {
        const response = await fetch(`/api/v1/merchant/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "open_tab" }),
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
      onGuestStatusChange?.(orderId, "open_tab");
    }
    setSelectedOrder(null);
    setToast({ message: "Order accepted" });
  }

  async function handleAcceptRequest(code: string) {
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

  // Rename the shop from the pen in the header
  async function handleRenameShop(name: string) {
    if (isOwner) {
      const res = await fetch("/api/v1/merchant/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: name }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Could not save the name.");
      }
      router.refresh();
      await refreshDashboard();
    } else {
      onGuestRenameShop?.(name);
    }
    setData((prev) => ({ ...prev, shopName: name }));
    setToast({ message: "Shop name saved" });
  }

  // Add Customer submit
  async function handleAddCustomerSubmit(customer: CustomerInput) {
    if (isOwner) {
      const res = await fetch("/api/v1/merchant/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer.name,
          phone: customer.phone ?? "",
          subLabel: customer.subLabel ?? "",
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

  function handleSelectCustomer(id: string) {
    const customer = data.customerDues.find((entry) => entry.id === id);
    if (customer) setSelectedCustomer(customer);
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

  const pillState = isOwner ? "owner" : "guest";

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
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-2 text-xs text-ink-muted border-b border-line bg-surface z-50">
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

      {/* Header */}
      <HomeHeader
        shopName={data.shopName}
        logoUrl={data.shopLogoUrl}
        handle={data.handle}
        pillState={pillState}
        onGuestSave={() => setShowSaveSheet(true)}
        onEditName={() => setShowEditName(true)}
        onEditLogo={isOwner ? () => setShowEditLogo(true) : undefined}
        onSignIn={() => setShowSaveSheet(true)}
      />

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
          <RequestDesktopBanner
            count={data.requests.count}
            oldestAge={data.requests.oldestAge}
            requests={data.requests.requests}
            onReview={() => setShowRequestsPanel(true)}
          />
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

          {/* 2. Cross-day queue; independent of the selected calendar day */}
          <IncompleteOrders
            {...data.incompleteOrders}
            onOpenOrder={setSelectedOrder}
            onCollect={setCollectOrder}
            onEdit={(order) => setEditOrder(order)}
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

          {/* 5. Metrics */}
          <KpiStrip kpis={data.kpis} />

          {/* 6. Customers with dues */}
          <CollectCustomers
            customers={data.customerDues}
            onSelectCustomer={handleSelectCustomer}
          />

          <footer className="pt-2 text-center text-[11px] text-ink-subtle">
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

      {/* Rename shop */}
      <EditShopNameModal
        isOpen={showEditName}
        initialName={data.shopName}
        onClose={() => setShowEditName(false)}
        onSubmit={handleRenameShop}
      />

      <ShopLogoModal
        isOpen={showEditLogo}
        initialUrl={data.shopLogoUrl ?? null}
        onClose={() => setShowEditLogo(false)}
        onUpdated={(shopLogoUrl) =>
          setData((prev) => ({ ...prev, shopLogoUrl }))
        }
      />

      {/* Save or sign in */}
      <SaveShopModal
        isOpen={showSaveSheet}
        onClose={() => setShowSaveSheet(false)}
      />

      {/* Requests slide-out panel */}
      <RequestsPanel
        requests={data.requests.requests}
        isOpen={showRequestsPanel}
        onClose={() => setShowRequestsPanel(false)}
        onAccept={handleAcceptRequest}
      />

      {showAddSale && isOwner ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-add-sale-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <section className="max-h-[94dvh] w-full max-w-[640px] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 shadow-2xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <h2 id="home-add-sale-title" className="text-lg font-semibold">
                Add sale
              </h2>
              <button
                type="button"
                onClick={() => setShowAddSale(false)}
                className="min-h-11 min-w-11 rounded-lg text-ink-muted hover:bg-muted"
                aria-label="Close Add sale"
              >
                ×
              </button>
            </div>
            <NewSaleForm
              items={saleItems}
              onComplete={() => {
                setShowAddSale(false);
                setToast({ message: "Sale saved" });
                void refreshDashboard();
              }}
            />
          </section>
        </div>
      ) : null}

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAccept={handleAcceptQuote}
        onMarkReady={(id) => {
          setSelectedOrder(null);
          void handleCompleteOrder({ id });
        }}
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
          <section className="w-full max-w-[420px] rounded-t-2xl border border-line bg-surface p-5 shadow-2xl sm:rounded-2xl">
            <h2 id="home-customer-title" className="text-lg font-semibold">
              {selectedCustomer.name}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Pending {selectedCustomer.pending}
            </p>
            {selectedCustomer.lastPaidDate ? (
              <p className="mt-1 text-xs text-ink-subtle">
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
          className="fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-[400px] items-center justify-between rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-xl lg:bottom-8 lg:left-[280px] lg:right-8 lg:mx-0 lg:max-w-none"
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
