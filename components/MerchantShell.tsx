"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BottomTabs, MerchantNav } from "@/components/BottomTabs";
import { GuestImport } from "@/components/GuestImport";
import { HomeHeader } from "@/components/home/Header";
import { EditShopNameModal } from "@/components/home/EditShopNameModal";
import { ShopLogoModal } from "@/components/home/ShopLogoModal";
import { ShareStorefrontModal } from "@/components/home/ShareStorefrontModal";
import type { PassStatus } from "@/lib/pass-status";

/**
 * The one shell for every owner page. It owns the header and the three
 * header actions, so the header stays identical across pages. See ADR-041.
 */
export function MerchantShell({
  shopName: initialShopName,
  shopLogoUrl: initialLogoUrl,
  handle,
  passStatus,
  noun,
  storeHref,
  children,
}: {
  shopName: string;
  shopLogoUrl?: string | null;
  handle: string;
  passStatus?: PassStatus;
  noun: string;
  storeHref: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [shopName, setShopName] = useState(initialShopName);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl ?? null);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditLogo, setShowEditLogo] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setShopName(initialShopName);
    setLogoUrl(initialLogoUrl ?? null);
  }, [initialShopName, initialLogoUrl]);

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

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function renameShop(name: string) {
    if (isOffline) {
      setToast("You are offline. Saving needs a connection.");
      return;
    }
    const response = await fetch("/api/v1/merchant/business", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName: name }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error?.message ?? "Could not save the name.");
    }
    setShopName(name);
    setToast("Shop name saved");
    router.refresh();
  }

  return (
    <div className="min-h-dvh lg:flex">
      <MerchantNav
        businessName={shopName}
        logoUrl={logoUrl}
        storeHref={storeHref}
        pendingCount={0}
      />

      <div className="min-w-0 flex-1">
        <HomeHeader
          shopName={shopName}
          logoUrl={logoUrl}
          metaLine={passStatus?.label}
          metaTone={passStatus?.tone}
          storefrontHref={handle ? `/b/${handle}` : undefined}
          pillState={isOffline ? "offline" : "owner"}
          onEditName={() => setShowEditName(true)}
          onEditLogo={() => setShowEditLogo(true)}
          onShare={() => setShowShare(true)}
        />

        <div className="mx-auto w-full max-w-[640px] px-4 pb-28 pt-6 lg:max-w-6xl lg:px-8 lg:pb-16 lg:pt-8">
          <GuestImport />
          {children}
        </div>
      </div>

      <BottomTabs noun={noun} />

      <EditShopNameModal
        isOpen={showEditName}
        initialName={shopName}
        onClose={() => setShowEditName(false)}
        onSubmit={renameShop}
      />
      <ShopLogoModal
        isOpen={showEditLogo}
        initialUrl={logoUrl}
        onClose={() => setShowEditLogo(false)}
        onUpdated={setLogoUrl}
      />
      <ShareStorefrontModal
        handle={handle}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />

      {toast ? (
        <div
          role="status"
          className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-[400px] rounded-xl bg-ink px-4 py-3 text-center text-small font-medium text-white shadow-xl lg:bottom-8 lg:left-[280px] lg:right-8 lg:mx-0 lg:max-w-none"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
