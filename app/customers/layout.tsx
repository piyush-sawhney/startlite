import { MerchantShell } from "@/components/MerchantShell";
import { getMerchantHeaderContext } from "@/lib/queries";
import { getPack } from "@/lib/packs";
import { requireBusiness } from "@/lib/session";

export default async function CustomersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { business } = await requireBusiness();
  const header = await getMerchantHeaderContext(business.id);

  return (
    <MerchantShell
      shopName={header.shopName}
      shopLogoUrl={header.shopLogoUrl}
      handle={header.handle}
      passStatus={header.passStatus}
      noun={getPack(business.categoryPack).noun}
      storeHref={`/b/${business.handle}`}
    >
      {children}
    </MerchantShell>
  );
}
