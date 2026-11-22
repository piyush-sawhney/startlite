"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  HomeDashboardData,
  InProgressOrder,
  ReadyToCollectOrder,
} from "@/lib/home-types";
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
import { InProgress } from "./InProgress";
import { ReadyToCollect } from "./ReadyToCollect";
import { CollectCustomers } from "./CollectCustomers";
import { AddCustomerModal, type CustomerInput } from "./AddCustomerModal";
import { AddItemModal, type ItemInput } from "./AddItemModal";
import { AddExpenseModal, type ExpenseInput } from "./AddExpenseModal";
import { CollectPaymentModal } from "./CollectPaymentModal";
import { EditShopNameModal } from "./EditShopNameModal";
import { SaveShopModal } from "./SaveShopModal";
import { LaunchSheet } from "./LaunchSheet";
import { SessionExpired } from "./SessionExpired";

export function HomeDashboard({
  initialData,
  isOwner,
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

  // Quick action sheets
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [collectOrder, setCollectOrder] = useState<ReadyToCollectOrder | null>(
    null,
  );

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

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
  async function handleCompleteOrder(order: InProgressOrder) {
    if (isOwner) {
      try {
        const res = await fetch(`/api/v1/merchant/orders/${order.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ready" }),
        });

        if (res.ok) {
          router.refresh();
          await refreshDashboard();

          setToast({
            message: "Marked complete",
            actionLabel: "Undo",
            onAction: async () => {
              await fetch(`/api/v1/merchant/orders/${order.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "open_tab" }),
              });
              router.refresh();
              await refreshDashboard();
              setToast(null);
            },
          });
        }
      } catch (err) {
        console.error("Failed to mark order complete", err);
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
    if (isOwner) {
      router.push(`/app/sales/${id}`);
    } else {
      onGuestAction?.("sale", id);
    }
  }

  function handleSelectCustomer(id: string) {
    if (isOwner) {
      router.push(`/app/customers/${id}`);
    } else {
      onGuestAction?.("customer", id);
    }
  }

  function handleAddSale() {
    if (isOwner) router.push("/app/sales/new");
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

  return (
    <div className="relative min-h-dvh">
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
        handle={data.handle}
        pillState={pillState}
        onGuestSave={() => setShowSaveSheet(true)}
        onEditName={() => setShowEditName(true)}
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
            isOwner={isOwner}
            onAddSale={handleAddSale}
            onAddCustomer={() => setShowAddCustomerModal(true)}
            onAddItem={() => setShowAddItemModal(true)}
            onAddExpense={() => setShowAddExpenseModal(true)}
          />

          {/* 2. Ready to collect: order complete, payment incomplete */}
          <ReadyToCollect
            count={data.readyToCollect.count}
            totalDue={data.readyToCollect.totalDue}
            orders={data.readyToCollect.orders}
            isOwner={isOwner}
            onCollect={(order) => setCollectOrder(order)}
            onOpenOrder={handleOpenOrder}
            onViewAll={() => {
              if (isOwner) router.push("/app/sales?filter=ready");
              else onGuestAction?.("sales");
            }}
          />

          {/* 3. In progress: order incomplete */}
          <InProgress
            count={data.inProgress.count}
            totalAmount={data.inProgress.totalAmount}
            orders={data.inProgress.orders}
            isOwner={isOwner}
            onComplete={handleCompleteOrder}
            onOpenOrder={handleOpenOrder}
            onViewAll={() => {
              if (isOwner) router.push("/app/sales?filter=pending");
              else onGuestAction?.("sales");
            }}
          />

          {/* 4. Day view, in flow below 1200 */}
          <div className="lg:hidden">
            <DayView
              selectedDay={data.selectedDay}
              isToday={data.isToday}
              anyTime={data.dayView.anyTime}
              timeline={data.dayView.timeline}
              ghosts={data.dayView.ghosts}
              isOwner={isOwner}
              onSelectDay={handleSelectDay}
              onSelectOrder={handleOpenOrder}
              onSelectGhost={() => setShowRequestsPanel(true)}
              onNewOrder={handleAddSale}
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
            isOwner={isOwner}
            onSelectDay={handleSelectDay}
            onSelectOrder={handleOpenOrder}
            onSelectGhost={() => setShowRequestsPanel(true)}
            onNewOrder={handleAddSale}
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
      />

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
