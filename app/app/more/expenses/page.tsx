import Link from "next/link";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { formatBillDate } from "@/lib/bill";
import { formatAmount, sum } from "@/lib/money";
import {
  cashSummary,
  getMerchantSnapshot,
  startOfMonthIst,
} from "@/lib/queries";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const { business } = await requireBusiness();
  const snapshot = await getMerchantSnapshot(business.id);
  const month = cashSummary(
    snapshot.orders,
    snapshot.payments,
    snapshot.expenses,
    startOfMonthIst(),
  );

  return (
    <>
      <div className="mb-1">
        <Link href="/app/more" className="text-sm font-medium text-accent">
          ← More
        </Link>
      </div>
      <PageHeader
        title="Expenses"
        subtitle={`This month · ${formatAmount(month.spent)}`}
      />

      <AddExpenseForm />

      <Card className="mt-4">
        {snapshot.expenses.length === 0 ? (
          <EmptyState
            title="No expenses yet"
            body="Log flour, gas, rent, or a delivery auto."
          />
        ) : (
          <div className="divide-y divide-line">
            {snapshot.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{expense.title}</p>
                  <p className="text-xs text-ink-muted">
                    {formatBillDate(new Date(expense.expenseDate))}
                  </p>
                </div>
                <p className="tnum text-sm font-semibold">
                  {formatAmount(expense.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <p className="mt-4 text-center text-xs text-ink-subtle">
        Total logged: {formatAmount(sum(snapshot.expenses.map((e) => e.amount)))}
      </p>
    </>
  );
}
