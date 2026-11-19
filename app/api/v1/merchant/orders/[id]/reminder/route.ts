import { apiData, apiError } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { buildBill } from "@/lib/bill-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const bill = await buildBill(auth.business.id, id);
  if (!bill) return apiError("NOT_FOUND", "Order not found.");

  return apiData({
    reminderText: bill.reminderText,
    reminderWhatsappUrl: bill.reminderWhatsappUrl,
    due: bill.due,
  });
}
