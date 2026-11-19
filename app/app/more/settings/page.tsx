import Link from "next/link";
import { SettingsForm } from "@/components/SettingsForm";
import { PageHeader } from "@/components/ui";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { business } = await requireBusiness();

  return (
    <>
      <div className="mb-1">
        <Link href="/app/more" className="text-sm font-medium text-accent">
          ← More
        </Link>
      </div>
      <PageHeader title="Store settings" subtitle="What buyers see" />
      <SettingsForm
        initial={{
          businessName: business.businessName,
          handle: business.handle,
          tagline: business.tagline ?? "",
          locality: business.locality ?? "",
          whatsappNumber: business.whatsappNumber,
          upiId: business.upiId ?? "",
          noticeBanner: business.noticeBanner ?? "",
          addressPlaceholder: business.addressPlaceholder,
          enableTimeSlots: business.enableTimeSlots,
          privacyMode: business.privacyMode,
          showBankDetails: business.showBankDetails,
          bankAccountName: business.bankAccountName ?? "",
          bankAccountNumber: business.bankAccountNumber ?? "",
          bankIfsc: business.bankIfsc ?? "",
          advancePolicyText: business.advancePolicyText ?? "",
          defaultLocale: business.defaultLocale,
        }}
      />
    </>
  );
}
