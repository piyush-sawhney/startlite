import Link from "next/link";
import { notFound } from "next/navigation";
import { BillPreview } from "@/components/BillPreview";
import { PageHeader } from "@/components/ui";
import { formatBillDate } from "@/lib/bill";
import { buildBill } from "@/lib/bill-service";
import { formatAmount } from "@/lib/money";
import { requireBusiness } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function BillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { business } = await requireBusiness();
  const { id } = await params;
  const bill = await buildBill(business.id, id);
  if (!bill) notFound();

  return (
    <>
      <div className="mb-1">
        <Link
          href={`/app/sales/${bill.order.id}`}
          className="text-sm font-medium text-accent"
        >
          ← Order
        </Link>
      </div>
      <PageHeader
        title={`Bill ${bill.billNo}`}
        subtitle={bill.order.customerName ?? "Walk-in sale"}
      />

      <BillPreview
        billText={bill.billText}
        reminderText={bill.reminderText}
        billWhatsappUrl={bill.billWhatsappUrl}
        reminderWhatsappUrl={bill.reminderWhatsappUrl}
        receipt={{
          shopName: bill.headerName,
          billNo: bill.billNo,
          date: formatBillDate(bill.order.createdAt),
          customerName: bill.order.customerName,
          lines: bill.lines.map((line) => ({
            quantity: String(Number(line.quantity)),
            label: bill.privacyMode
              ? "Service"
              : line.optionSnapshot
                ? `${line.itemNameSnapshot} (${line.optionSnapshot})`
                : line.itemNameSnapshot,
            amount: formatAmount(line.lineTotal),
          })),
          total: formatAmount(bill.order.grandTotal),
          paid: formatAmount(bill.paid),
          due: formatAmount(bill.due),
          upiUri: bill.upiUri,
          phone: bill.shopPhone,
          referral: "Run a business on WhatsApp? StartLite.in",
        }}
      />
    </>
  );
}
