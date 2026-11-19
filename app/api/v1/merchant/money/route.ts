import { apiData } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import {
  cashSummary,
  getMerchantSnapshot,
  startOfMonthIst,
  startOfTodayIst,
} from "@/lib/queries";

export async function GET(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const periodParam = url.searchParams.get("period") ?? "today";

  let since: Date | null = null;
  if (periodParam === "today") {
    since = startOfTodayIst();
  } else if (periodParam === "month") {
    since = startOfMonthIst();
  }

  const snapshot = await getMerchantSnapshot(auth.business.id);
  const summary = cashSummary(
    snapshot.orders,
    snapshot.payments,
    snapshot.expenses,
    since,
  );

  return apiData({
    period: periodParam,
    received: summary.received,
    spent: summary.spent,
    cashLeft: summary.left,
    expenses: snapshot.expenses.slice(0, 50),
  });
}
