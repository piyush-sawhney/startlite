"use client";

import { Card, SectionLabel } from "@/components/ui";
import { whatsappLink } from "@/lib/bill";
import { MessageCircle, Phone, Send, Wallet } from "lucide-react";
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

const contactClass =
  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition after:absolute after:-inset-1 after:content-['']";

export function CollectCustomers({
  customers,
  onSelectCustomer,
}: {
  customers: CustomerDue[];
  onSelectCustomer: (id: string) => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2.5 border-b border-line pb-3">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning"
          aria-hidden="true"
        >
          <Wallet className="h-4 w-4" />
        </span>
        <SectionLabel>To collect from customers</SectionLabel>
        {customers.length > 0 ? (
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-ink-muted">
            {customers.length}
          </span>
        ) : null}
      </div>

      {customers.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-muted">No dues.</p>
      ) : (
        <div className="mt-1 divide-y divide-line">
          {customers.map((c) => {
            // `hasPhone` guards rendering; the fallback keeps the link helpers
            // (which require a string) type-safe without changing runtime data.
            const phone = c.phone ?? "";
            const countryCode = c.countryCode;
            const hasPhone = phone.trim().length > 0;
            const reminderMessage = `Hi ${c.name}, this is a friendly reminder that you have ₹${c.pending} pending with us. Please clear the balance at your earliest. Thank you!`;

            return (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectCustomer(c.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectCustomer(c.id);
                  }
                }}
                className="flex cursor-pointer items-center justify-between gap-2 rounded-lg py-2.5 transition hover:bg-muted/60 active:bg-muted"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink" title={c.name}>
                    {c.name}
                  </p>
                  {c.lastPaidDate ? (
                    <p className="text-xs text-ink-muted">last {c.lastPaidDate}</p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="tnum font-bold text-warning">{c.pending}</span>

                  {hasPhone ? (
                    <>
                      <a
                        href={whatsappLink(phone, reminderMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${c.name}`}
                        className={`${contactClass} bg-success-soft text-success hover:bg-success/20`}
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <a
                        href={smsLink(phone, countryCode, reminderMessage)}
                        aria-label={`SMS ${c.name}`}
                        className={`${contactClass} bg-info-soft text-info hover:bg-info/20`}
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <a
                        href={callLink(phone, countryCode)}
                        aria-label={`Call ${c.name}`}
                        className={`${contactClass} bg-accent-soft text-accent-strong hover:bg-accent/20`}
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
