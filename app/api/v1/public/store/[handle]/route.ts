import { apiData, apiError } from "@/lib/api";
import { getPublicItems, getShop } from "@/lib/queries";
import { storefrontStatus } from "@/lib/shop";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;
  const shop = await getShop(handle);

  if (!shop) {
    return apiError("NOT_FOUND", "Shop not found.");
  }

  const status = storefrontStatus(shop);
  if (status === "disabled") {
    return apiError("NOT_FOUND", "Shop not found.");
  }

  const items = status === "live" ? await getPublicItems(shop.id) : [];

  return apiData({
    shop: {
      handle: shop.handle,
      businessName: shop.businessName,
      categoryPack: shop.categoryPack,
      category: shop.category,
      locality: shop.locality,
      tagline: shop.tagline,
      whatsappNumber: shop.whatsappNumber,
      upiId: shop.upiId,
      showBankDetails: shop.showBankDetails,
      bankAccountName: shop.showBankDetails ? shop.bankAccountName : null,
      bankAccountNumber: shop.showBankDetails ? shop.bankAccountNumber : null,
      bankIfsc: shop.showBankDetails ? shop.bankIfsc : null,
      noticeBanner: shop.noticeBanner,
      enableTimeSlots: shop.enableTimeSlots,
      advancePolicyText: shop.advancePolicyText,
      addressPlaceholder: shop.addressPlaceholder,
      privacyMode: shop.privacyMode,
      defaultLocale: shop.defaultLocale,
      status,
    },
    items,
  });
}
