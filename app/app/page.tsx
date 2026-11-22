import { getHomeDashboard } from "@/lib/queries";
import { requireBusiness } from "@/lib/session";
import { HomeDashboard } from "@/components/home/HomeDashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { business } = await requireBusiness();
  const data = await getHomeDashboard(business.id);

  return <HomeDashboard initialData={data} isOwner={true} />;
}
