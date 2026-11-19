import { AddItemForm } from "@/components/AddItemForm";
import { CatalogItemRow } from "@/components/CatalogItemRow";
import { EmptyState, PageHeader } from "@/components/ui";
import { getPack } from "@/lib/packs";
import { getPublicItems } from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const { business } = await requireBusiness();
  const items = await getPublicItems(business.id);
  const pack = getPack(business.categoryPack);

  return (
    <>
      <PageHeader
        title={pack.noun}
        subtitle={`${items.length} items · ${business.category ?? pack.label}`}
      />

      <AddItemForm packUnit={pack.unit} />

      <div className="mt-4">
        {items.length === 0 ? (
          <EmptyState
            title={`No ${pack.noun.toLowerCase()} yet`}
            body="Add your first item. Name, price, and availability are enough."
          />
        ) : (
          <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {items.map((item) => (
              <CatalogItemRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-ink-subtle">
        Sold-out items stay visible. Buyers cannot add them.
      </p>
    </>
  );
}
