"use client";

import { useCallback, useEffect, useState } from "react";
import {
  GUEST_STORE_KEY,
  loadGuestState,
  readGuestState,
  writeGuestState,
  type GuestState,
} from "@/lib/guest-store";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";
import { GuestHome } from "./GuestHome";
import { GuestSalesList, GuestNewSale, GuestSaleDetail } from "./GuestSales";
import { GuestCustomersList, GuestCustomerDetail } from "./GuestCustomers";
import { GuestCatalog, GuestItemDetail } from "./GuestCatalog";
import {
  GuestMore,
  GuestSettings,
  GuestExpenses,
  GuestCash,
} from "./GuestMore";
import { GuestNav } from "./GuestTabs";
import { tabForRoute, type GuestRoute, type GuestTab } from "./types";

export function GuestApp() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<GuestState | null>(null);
  const [stack, setStack] = useState<GuestRoute[]>([{ kind: "home" }]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setState(loadGuestState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && state) writeGuestState(state);
  }, [ready, state]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== GUEST_STORE_KEY) return;
      setState(readGuestState() ?? loadGuestState());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const update = useCallback(
    (updater: (current: GuestState) => GuestState) => {
      setState((current) => (current ? updater(current) : current));
    },
    [],
  );

  const go = useCallback((route: GuestRoute) => {
    setStack((current) => [...current, route]);
  }, []);

  const back = useCallback(() => {
    setStack((current) =>
      current.length > 1 ? current.slice(0, -1) : current,
    );
  }, []);

  const selectTab = useCallback((tab: GuestTab) => {
    setStack([{ kind: tab }]);
  }, []);

  const toast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  if (!ready || !state) {
    return <HomeSkeleton />;
  }

  const route = stack[stack.length - 1];
  const signInHref = "/login?mode=signup&next=/onboarding";

  const viewProps = {
    state,
    update,
    go,
    back,
    toast,
    signInHref,
  };

  let content: React.ReactNode;
  switch (route.kind) {
    case "sales":
      content = <GuestSalesList {...viewProps} />;
      break;
    case "new-sale":
      content = (
        <GuestNewSale
          key={`new-sale-${route.customer?.phone ?? ""}`}
          {...viewProps}
          customer={route.customer}
        />
      );
      break;
    case "sale":
      content = (
        <GuestSaleDetail key={route.id} {...viewProps} orderId={route.id} />
      );
      break;
    case "customers":
      content = <GuestCustomersList {...viewProps} />;
      break;
    case "customer":
      content = (
        <GuestCustomerDetail
          key={route.key}
          {...viewProps}
          customerKey={route.key}
        />
      );
      break;
    case "catalog":
      content = <GuestCatalog {...viewProps} />;
      break;
    case "item":
      content = (
        <GuestItemDetail key={route.id} {...viewProps} itemId={route.id} />
      );
      break;
    case "settings":
      content = <GuestSettings {...viewProps} />;
      break;
    case "expenses":
      content = <GuestExpenses {...viewProps} />;
      break;
    case "cash":
      content = <GuestCash {...viewProps} />;
      break;
    case "more":
      content = <GuestMore {...viewProps} />;
      break;
    default:
      content = <GuestHome {...viewProps} />;
  }

  return (
    <div className="min-h-dvh lg:flex">
      <GuestNav
        active={tabForRoute(route)}
        shopName={state.shop.name}
        signInHref={signInHref}
        onSelect={selectTab}
      />

      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[640px] px-4 pb-28 pt-6 lg:max-w-6xl lg:px-8 lg:pb-16 lg:pt-8">
          {content}
        </div>
      </div>

      {toastMessage ? (
        <div
          role="status"
          className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-[400px] rounded-xl bg-ink px-4 py-3 text-center text-sm font-medium text-white shadow-lg lg:bottom-8 lg:left-[280px] lg:right-8 lg:mx-0 lg:max-w-none"
        >
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
