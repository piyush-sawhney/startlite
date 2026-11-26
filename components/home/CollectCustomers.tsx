"use client";

import { useState } from "react";
import { Card, RowAction } from "@/components/ui";
import { whatsappLink } from "@/lib/bill";
import { callLink, smsLink } from "@/lib/contact";
import { formatDateDMY } from "@/lib/date";
import { MessageCircle, Phone, Send, Wallet } from "lucide-react";
import type { CustomerDue } from "@/lib/home-types";
import { ListHeader } from "./ListHeader";

const contactClass =
  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition after:absolute after:-inset-1 after:content-['']";

const ORDER_LINES = 2;

export function CollectCustomers({
  customers,
  summary,
  onSelectCustomer,
  onViewAll,
}: {
  customers: CustomerDue[];
  summary: { count: number; total: string };
  onSelectCustomer: (id: string) => void;
  onViewAll: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Card className="overflow-hidden p-0">
      <ListHeader
        title="Customer dues"
        count={summary.count}
        total={summary.count > 0 ? summary.total : undefined}
        totalLabel="To collect"
        controlsId="customer-dues-list"
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {collapsed ? null : customers.length === 0 ? (
        <p className="px-3 py-6 text-center text-small text-ink-muted">
          No dues.
        </p>
      ) : (
        <>
          <div id="customer-dues-list" className="divide-y divide-line">
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
                  className="flex items-center gap-2 rounded-lg px-3 py-3 transition hover:bg-muted/60"
                >
                  <button
                    type="button"
                    onClick={() => onSelectCustomer(c.id)}
                    aria-label={`Customer dues: ${c.name}, ${c.pending} pending`}
                    className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-small font-bold text-ink">
                        {c.name}
                      </span>
                      {c.lastPaidDate ? (
                        <span className="mt-0.5 block text-caption text-ink-muted">
                          last {c.lastPaidDate}
                        </span>
                      ) : null}
                      {c.orderDues.slice(0, ORDER_LINES).map((order) => (
                        <span
                          key={order.id}
                          className="mt-0.5 block truncate text-caption text-ink-muted"
                          title={`Order ${order.code} · ${order.due} due · needed ${formatDateDMY(order.neededBy)}`}
                        >
                          #{order.code} ·{" "}
                          <span className="tnum font-semibold text-warning">
                            {order.due}
                          </span>{" "}
                          due
                          {order.neededBy
                            ? ` · ${formatDateDMY(order.neededBy)}`
                            : ""}
                        </span>
                      ))}
                      {c.orderDues.length > ORDER_LINES ? (
                        <span className="mt-0.5 block text-caption text-ink-subtle">
                          +{c.orderDues.length - ORDER_LINES} more orders
                        </span>
                      ) : null}
                    </span>
                    <span className="figure shrink-0 text-small font-bold text-warning sm:min-w-[7rem]">
                      {c.pending}
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center gap-2">
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
                    <RowAction
                      icon={Wallet}
                      label="Collect"
                      ariaLabel={`Collect from ${c.name}`}
                      tone="warning"
                      onClick={() => onSelectCustomer(c.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {summary.count > 0 ? (
            <div className="flex justify-end border-t border-line px-3 py-2">
              <button
                type="button"
                onClick={onViewAll}
                className="relative min-h-11 rounded-xl px-2 text-small font-semibold text-accent-strong transition hover:bg-muted hover:underline after:absolute after:-inset-x-1 after:content-['']"
              >
                View all dues
              </button>
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
}
