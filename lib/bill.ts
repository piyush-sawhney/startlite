import { dec, formatAmount, money, multiply } from "./money";

export type BillLine = {
  quantity: string;
  name: string;
  option?: string | null;
  extras?: Array<{ name: string; priceDelta: string }>;
  unitPrice: string;
  lineTotal: string;
};

export type BillInput = {
  shopName: string;
  billNo: string;
  date: Date;
  customerName?: string | null;
  lines: BillLine[];
  total: string;
  paid: string;
  due: string;
  upiId?: string | null;
  neededBy?: string | null;
  referral?: boolean;
  privacyMode?: boolean;
  bank?: { name?: string | null; number?: string | null; ifsc?: string | null } | null;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatBillDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;
}

function trimQuantity(quantity: string): string {
  return dec(quantity).toFixed(2).replace(/\.00$/, "");
}

export function formatNeededBy(value: string | null | undefined): string | null {
  if (!value) return null;
  const today = new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 5.5 * 3600_000 + 864e5)
    .toISOString()
    .slice(0, 10);
  if (value === today) return "Today";
  if (value === tomorrow) return "Tomorrow";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return formatBillDate(date);
}

export function billHeaderName(shopName: string, privacyMode?: boolean): string {
  return privacyMode ? "Consultation Receipt" : shopName;
}

/**
 * The WhatsApp bill. Plain text, one message where possible.
 * Bold only the shop name, as WhatsApp renders *text* as bold.
 */
export function compileBill(input: BillInput): string {
  const rows: string[] = [
    `*${billHeaderName(input.shopName, input.privacyMode)}*`,
    `Bill ${input.billNo} · ${formatBillDate(input.date)}`,
  ];

  if (input.customerName) rows.push(input.customerName);
  rows.push("────────────────────────────");

  for (const line of input.lines) {
    if (input.privacyMode) {
      const amount = multiply(line.quantity, line.unitPrice);
      rows.push(
        `${trimQuantity(line.quantity)} × Service   ${formatAmount(amount)}`,
      );
      continue;
    }

    const label = line.option ? `${line.name} (${line.option})` : line.name;
    const parentAmount = multiply(line.quantity, line.unitPrice);
    rows.push(
      `${trimQuantity(line.quantity)} × ${label}   ${formatAmount(parentAmount)}`,
    );
    for (const extra of line.extras ?? []) {
      const amount = multiply(line.quantity, extra.priceDelta);
      const negative = dec(amount).lessThan(0);
      rows.push(
        `   ${extra.name}   ${negative ? "-" : "+"}${formatAmount(dec(amount).abs())}`,
      );
    }
  }

  rows.push("");
  rows.push(`Total    ${formatAmount(input.total)}`);
  rows.push(`Paid     ${formatAmount(input.paid)}`);
  rows.push(`Due      ${formatAmount(input.due)}`);

  if (dec(input.due).greaterThan(0) && input.upiId) {
    rows.push("");
    rows.push(`Pay by UPI: ${input.upiId}`);
    rows.push("PhonePe · GPay · Paytm");
  }

  if (input.bank && (input.bank.name || input.bank.number || input.bank.ifsc)) {
    rows.push("");
    rows.push("Bank transfer");
    if (input.bank.name) rows.push(input.bank.name);
    if (input.bank.number) rows.push(`A/c ${input.bank.number}`);
    if (input.bank.ifsc) rows.push(`IFSC ${input.bank.ifsc}`);
  }

  if (input.neededBy) {
    rows.push("");
    rows.push(`Needed by: ${input.neededBy}`);
  }

  if (input.referral !== false) {
    rows.push("");
    rows.push("Thank you for your business! 🙏");
    rows.push("StartLite · Simple shop catalog & ledger");
  }

  return rows.join("\n");
}

export function compileOrderAccepted(input: {
  shopName: string;
  orderCode: string;
  customerName: string;
  total?: string;
  neededBy?: string | null;
}): string {
  const rows = [
    `*Order Confirmed · ${input.shopName}*`,
    `Namaste ${input.customerName}! 🙏`,
    `Your order #${input.orderCode} has been accepted and is being prepared.`,
  ];
  if (input.total) {
    rows.push(`Total: ${formatAmount(input.total)}`);
  }
  if (input.neededBy) {
    rows.push(`Needed by: ${input.neededBy}`);
  }
  rows.push("");
  rows.push("We will notify you on WhatsApp as soon as your order is ready!");
  return rows.join("\n");
}

export function compileOrderReady(input: {
  shopName: string;
  orderCode: string;
  customerName: string;
  due: string;
  upiId?: string | null;
}): string {
  const rows = [
    `*Order Ready · ${input.shopName}*`,
    `Namaste ${input.customerName}! 🎉`,
    `Good news — your order #${input.orderCode} is ready!`,
  ];
  if (dec(input.due).greaterThan(0)) {
    rows.push("");
    rows.push(`Amount due: ${formatAmount(input.due)}`);
    if (input.upiId) {
      rows.push(`Pay by UPI: ${input.upiId}`);
      rows.push("PhonePe · GPay · Paytm");
    }
  } else {
    rows.push("Payment: Fully Paid ✓");
  }
  rows.push("");
  rows.push("Thank you for supporting our shop!");
  return rows.join("\n");
}

export function compileOrderDeclined(input: {
  shopName: string;
  orderCode: string;
  customerName: string;
  reason?: string | null;
}): string {
  const rows = [
    `*Order Update · ${input.shopName}*`,
    `Namaste ${input.customerName},`,
    `We regret to inform you that we cannot fulfill order #${input.orderCode} right now${
      input.reason ? `: ${input.reason}` : "."
    }`,
    "",
    "We sincerely apologize for the inconvenience and hope to serve you next time.",
  ];
  return rows.join("\n");
}

export function compilePaymentReceived(input: {
  shopName: string;
  customerName: string;
  billNo: string;
  amountPaid: string;
  remainingDue: string;
}): string {
  const rows = [
    `*Payment Received · ${input.shopName}*`,
    `Namaste ${input.customerName}! 🙏`,
    `We have received your payment of ${formatAmount(input.amountPaid)} for Bill ${input.billNo}.`,
  ];
  if (dec(input.remainingDue).greaterThan(0)) {
    rows.push(`Remaining balance: ${formatAmount(input.remainingDue)}`);
  } else {
    rows.push("Balance: Fully Settled ✓ (No dues remaining)");
  }
  rows.push("");
  rows.push("Thank you for your business!");
  return rows.join("\n");
}

export function compileReminder(input: {
  shopName: string;
  billNo: string;
  date: Date;
  due: string;
  upiId?: string | null;
  privacyMode?: boolean;
}): string {
  const rows = [
    `*${billHeaderName(input.shopName, input.privacyMode)}*`,
    `Bill ${input.billNo} · ${formatBillDate(input.date)}`,
    `Due ${formatAmount(input.due)}`,
  ];
  if (input.upiId) {
    rows.push("");
    rows.push(`Pay by UPI: ${input.upiId}`);
  }
  return rows.join("\n");
}

export function upiUri(input: {
  upiId: string;
  name: string;
  amount: string;
}): string {
  const params = new URLSearchParams({
    pa: input.upiId,
    pn: input.name,
    am: money(input.amount),
    cu: "INR",
  });
  return `upi://pay?${params.toString()}`;
}

export function whatsappLink(phone: string, text: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
