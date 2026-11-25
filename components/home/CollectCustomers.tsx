"use client";

import { Card, SectionLabel } from "@/components/ui";
import { whatsappLink } from "@/lib/bill";
import { MessageCircle, Phone, Send } from "lucide-react";
import type { CustomerDue } from "@/lib/home-types";

function phoneDigits(phone: string, countryCode = "+91"): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return digits.slice(1);
  const cc = countryCode.replace("+", "");
  if (!digits.startsWith(cc)) return cc + digits;
  return digits;
}

function smsLink(phone: string, countryCode: string | undefined, text: string): string {
  const to = phoneDigits(phone, countryCode);
  return `sms:${to}?body=${encodeURIComponent(text)}`;
}

function callLink(phone: string, countryCode: string | undefined): string {
  const to = phoneDigits(phone, countryCode);
  return `tel:${to}`;
}

export function CollectCustomers({
  customers,
  onSelectCustomer,
}: {
  customers: CustomerDue[];
  onSelectCustomer: (id: string) => void;
}) {
  return (
    <Card className="p-4">
      <div className="border-b border-line pb-3">
        <SectionLabel>To collect from customers</SectionLabel>
      </div>

      {customers.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-muted">No dues.</p>
      ) : (
        <div className="mt-2 divide-y divide-line">
          {customers.map((c) => {
            const phone = c.phone;
            const countryCode = c.countryCode;
            const hasPhone = Boolean(phone && phone.trim().length > 0);
            const reminderMessage = `Hi ${c.name}, this is a friendly reminder that you have ₹${c.pending} pending with us. Please clear the balance at your earliest. Thank you!`;

            return (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectCustomer(c.id)}
                className="flex cursor-pointer items-center justify-between py-2.5 transition active:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink" title={c.name}>
                    {c.name}
                  </p>
                  {c.lastPaidDate ? (
                    <p className="text-xs text-ink-muted">last {c.lastPaidDate}</p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="tnum font-semibold text-warning">
                    {c.pending}
                  </span>

                  {hasPhone ? (
                    <>
                      <a
                        href={whatsappLink(phone, reminderMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        type="button"
                        aria-label={`WhatsApp ${c.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <a
                        href={smsLink(phone, countryCode, reminderMessage)}
                        type="button"
                        aria-label={`SMS ${c.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <a
                        href={callLink(phone, countryCode)}
                        type="button"
                        aria-label={`Call ${c.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
