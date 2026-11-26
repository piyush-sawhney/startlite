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
import { HomeHeader } from "@/components/home/Header";
import { SaveShopModal } from "@/components/home/SaveShopModal";
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
  const [showSaveSheet, setShowSaveSheet] = useState(false);

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

  function renderRoute(target: GuestRoute): React.ReactNode {
    switch (target.kind) {
      case "sales":
        return <GuestSalesList {...viewProps} />;
      case "new-sale":
        return (
          <GuestNewSale
            key={`new-sale-${target.customer?.phone ?? ""}`}
            {...viewProps}
            customer={target.customer}
          />
        );
      case "sale":
        return (
          <GuestSaleDetail
            key={target.id}
            {...viewProps}
            orderId={target.id}
          />
        );
      case "customers":
        return <GuestCustomersList {...viewProps} />;
      case "customer":
        return (
          <GuestCustomerDetail
            key={target.key}
            {...viewProps}
            customerKey={target.key}
          />
        );
      case "catalog":
        return <GuestCatalog {...viewProps} />;
      case "item":
        return <GuestItemDetail key={target.id} {...viewProps} itemId={target.id} />;
      case "settings":
        return <GuestSettings {...viewProps} />;
      case "expenses":
        return <GuestExpenses {...viewProps} />;
      case "cash":
        return <GuestCash {...viewProps} />;
      case "more":
        return <GuestMore {...viewProps} />;
      default:
        return <GuestHome {...viewProps} />;
    }
  }

  const isHomeOverlay = stack.length > 1 && stack[0].kind === "home";
  const content = (
    <>
      {stack[0].kind === "home" ? <GuestHome {...viewProps} /> : null}
      {!isHomeOverlay && stack[0].kind !== "home" ? renderRoute(route) : null}
      {isHomeOverlay ? (
        <div
        role="dialog"
        aria-modal="true"
        aria-label="Home action"
        className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      >
        <section className="max-h-[94dvh] w-full max-w-[720px] overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-2xl sm:rounded-2xl sm:p-6">
          <button
            type="button"
            onClick={back}
            className="mb-3 min-h-11 rounded-lg px-3 text-sm text-ink-muted hover:bg-muted"
          >
            Close
          </button>
          {renderRoute(route)}
        </section>
        </div>
      ) : null}
    </>
  );

  return (
    <div className="min-h-dvh lg:flex">
      <GuestNav
        active={isHomeOverlay ? "home" : tabForRoute(route)}
        shopName={state.shop.name}
        signInHref={signInHref}
        onSelect={selectTab}
      />

      <div className="min-w-0 flex-1">
        <HomeHeader
          shopName={state.shop.name}
          metaLine="Sign in to save this shop"
          onMetaAction={() => setShowSaveSheet(true)}
          pillState="guest"
          onGuestSave={() => setShowSaveSheet(true)}
        />
        <div className="mx-auto w-full max-w-[640px] px-4 pb-28 pt-6 lg:max-w-6xl lg:px-8 lg:pb-16 lg:pt-8">
          {content}
        </div>
      </div>

      <SaveShopModal
        isOpen={showSaveSheet}
        onClose={() => setShowSaveSheet(false)}
      />

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
