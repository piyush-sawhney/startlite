import Link from "next/link";
import { NewSaleForm } from "@/components/NewSaleForm";
import { PageHeader } from "@/components/ui";
import { getPublicItems } from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function NewSalePage() {
  const { business } = await requireBusiness();
  const items = await getPublicItems(business.id);

  return (
    <>
      <div className="mb-1">
        <Link href="/app/sales" className="text-sm font-medium text-accent">
          ← Sales
        </Link>
      </div>
      <PageHeader title="Add sale" subtitle="Three taps for a counter sale" />
      <NewSaleForm items={items} />
    </>
  );
}
