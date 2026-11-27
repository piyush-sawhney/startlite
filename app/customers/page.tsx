import { CustomersReport } from "@/components/reports/CustomersReport";
import { getCustomersReport } from "@/lib/queries";
import type {
  CustomerSegment,
  CustomersFilters,
  ReportSort,
} from "@/lib/report-types";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

function parseFilters(params: Record<string, string | string[] | undefined>): CustomersFilters {
  const value = (key: string) => {
    const raw = params[key];
    return Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
  };
  const sort = value("sort");
  const rawSegment = value("segment");
  const segment: CustomerSegment =
    rawSegment === "dues" ||
    rawSegment === "paid" ||
    rawSegment === "active"
      ? rawSegment
      : value("dues") === "1"
        ? "dues"
        : "all";
  return {
    query: value("q"),
    segment,
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
