import { BottomTabs, MerchantNav } from "@/components/BottomTabs";
import { GuestImport } from "@/components/GuestImport";
import { getPack } from "@/lib/packs";
import { requireBusiness } from "@/lib/session";

export default async function MerchantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { business } = await requireBusiness();
  const noun = getPack(business.categoryPack).noun;

  return (
    <div className="min-h-dvh lg:flex">
      <MerchantNav
        noun={noun}
        businessName={business.businessName}
        storeHref={`/b/${business.handle}`}
        pendingCount={0}
      />

      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[640px] px-4 pb-28 pt-6 lg:max-w-6xl lg:px-8 lg:pb-16 lg:pt-8">
          <GuestImport />
          {children}
        </div>
      </div>

      <BottomTabs noun={noun} />
    </div>
  );
}
