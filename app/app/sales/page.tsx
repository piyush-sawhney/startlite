import { OrdersReport } from "@/components/reports/OrdersReport";
import { getOrdersReport } from "@/lib/queries";
import type {
  OrderPeriod,
  OrdersFilters,
  OrderSegment,
  OrderSort,
  ReportDirection,
} from "@/lib/report-types";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

const PERIODS: OrderPeriod[] = ["today", "month", "all"];
const SEGMENTS: OrderSegment[] = [
  "all",
  "to_finish",
  "payment_due",
  "paid",
  "cancelled",
];
const SORTS: OrderSort[] = [
  "newest",
  "needed",
  "code",
  "customer",
  "status",
  "payment",
  "items",
  "total",
  "paid",
  "due",
];

function parseFilters(
  params: Record<string, string | string[] | undefined>,
): OrdersFilters {
  const value = (key: string) => {
    const raw = params[key];
    return Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
  };
  const periodParam = value("period");
  const segmentParam = value("segment");
  const sortParam = value("sort");
  const dirParam = value("dir");
  const textSort = ["code", "customer", "needed", "status", "payment"].includes(
    sortParam,
  );

  return {
    query: value("q"),
    period: PERIODS.includes(periodParam as OrderPeriod)
      ? (periodParam as OrderPeriod)
      : "all",
    segment: SEGMENTS.includes(segmentParam as OrderSegment)
      ? (segmentParam as OrderSegment)
      : "all",
    sort: SORTS.includes(sortParam as OrderSort) ? (sortParam as OrderSort) : "newest",
    dir:
      dirParam === "asc" || dirParam === "desc"
        ? (dirParam as ReportDirection)
        : textSort
          ? "asc"
          : "desc",
  };
}

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { business } = await requireBusiness();
  const filters = parseFilters(await searchParams);
  const data = await getOrdersReport(business.id, filters);

  return <OrdersReport data={data} filters={filters} />;
}
