import { CustomersReport } from "@/components/reports/CustomersReport";
import { getCustomersReport } from "@/lib/queries";
import type { CustomersFilters, ReportSort } from "@/lib/report-types";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

function parseFilters(params: Record<string, string | string[] | undefined>): CustomersFilters {
  const value = (key: string) => {
    const raw = params[key];
    return Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
  };
  const sort = value("sort");
  return {
    query: value("q"),
    withDues: value("dues") === "1",
    sort: (["pending", "name", "recent"].includes(sort)
      ? sort
      : "pending") as ReportSort,
  };
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { business } = await requireBusiness();
  const filters = parseFilters(await searchParams);
  const data = await getCustomersReport(business.id, filters);

  return <CustomersReport data={data} filters={filters} />;
}
