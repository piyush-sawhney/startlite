import { CustomersReport } from "@/components/reports/CustomersReport";
import { getCustomersReport } from "@/lib/queries";
import type {
  CustomerSegment,
  CustomersFilters,
  ReportDirection,
  ReportSort,
} from "@/lib/report-types";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

const SORT_KEYS: ReportSort[] = [
  "name",
  "label",
  "phone",
  "locality",
  "billed",
  "paid",
  "due",
  "orders",
  "recent",
];

function parseFilters(
  params: Record<string, string | string[] | undefined>,
): CustomersFilters {
  const value = (key: string) => {
    const raw = params[key];
    return Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
  };
  const sortParam = value("sort");
  const sort: ReportSort =
    sortParam === "pending"
      ? "due"
      : SORT_KEYS.includes(sortParam as ReportSort)
        ? (sortParam as ReportSort)
        : "due";
  const dirParam = value("dir");
  const textSort =
    sort === "name" || sort === "label" || sort === "phone" || sort === "locality";
  const dir: ReportDirection =
    dirParam === "asc" || dirParam === "desc"
      ? dirParam
      : textSort
        ? "asc"
        : "desc";

  const rawSegment = value("segment");
  const segment: CustomerSegment =
    rawSegment === "dues" ||
    rawSegment === "paid" ||
    rawSegment === "active"
      ? rawSegment
      : value("dues") === "1"
        ? "dues"
        : "all";

  return { query: value("q"), segment, sort, dir };
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
