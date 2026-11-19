import Link from "next/link";
import { notFound } from "next/navigation";
import { EditItemForm } from "@/components/EditItemForm";
import { PageHeader } from "@/components/ui";
import { getPublicItems } from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { business } = await requireBusiness();
  const { id } = await params;
  const items = await getPublicItems(business.id);
  const item = items.find((entry) => entry.id === id);
  if (!item) notFound();

  return (
    <>
      <div className="mb-1">
        <Link href="/app/catalog" className="text-sm font-medium text-accent">
          ← Back
        </Link>
      </div>
      <PageHeader title={item.name} subtitle="Edit item" />
      <EditItemForm item={item} />
    </>
  );
}
