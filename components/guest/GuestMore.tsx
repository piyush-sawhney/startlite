"use client";

import { useState } from "react";
import {
  Card,
  EmptyState,
  PageHeader,
  inputClass,
  Label,
  primaryButton,
  quietButton,
} from "@/components/ui";
import { formatPaise, toPaise } from "@/lib/paise";
import { getPack, PACKS } from "@/lib/packs";
import { slugifyHandle } from "@/lib/shop";
import {
  addGuestExpense,
  clearGuestState,
  deleteGuestExpense,
  guestCashSummary,
  guestSalesCsv,
  guestStartOfMonth,
  guestStartOfToday,
  guestSummary,
  guestToday,
  updateGuestShop,
} from "@/lib/guest-store";
import {
  BackButton,
  MoneyLine,
  SaveBanner,
  SectionTitle,
  shortDate,
} from "./GuestBits";
import type { GuestViewProps } from "./types";

export function GuestMore({ state, go, signInHref }: GuestViewProps) {
  const pack = getPack(state.shop.pack);
  const [confirming, setConfirming] = useState(false);
  const summary = guestSummary(state);
  const handle = slugifyHandle(state.shop.name);

  function download() {
    const blob = new Blob([guestSalesCsv(state)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `startlite-sales-${guestToday()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader title="More" subtitle={state.shop.name} />

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[15px] font-semibold">{state.shop.name}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {pack.label} · {state.shop.locality || "No locality"}
            </p>
          </div>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent-strong">
            On this phone
          </span>
        </div>

        <div className="mt-4 rounded-md bg-muted px-3 py-2.5">
          <p className="text-[11px] font-medium text-ink-muted">Store link</p>
          <p className="mt-1 text-sm text-ink-muted">
            Created after you save
            {handle.length >= 3 ? ` · /b/${handle}` : ""}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={quietButton("text-sm")}
            onClick={() => go({ kind: "settings" })}
          >
            Shop settings
          </button>
          <button
            type="button"
            className={quietButton("text-sm")}
            onClick={download}
          >
            Download sales
          </button>
        </div>

        <p className="mt-3 text-[11px] text-ink-subtle">
          {state.orders.length} orders · {state.items.length} items ·{" "}
          {summary.customerCount} customers. Nothing leaves this phone until you
          save.
        </p>
      </Card>

      <div className="mt-5">
        <SaveBanner signInHref={signInHref} />
      </div>

      <Group title="Money">
        <Row label="Expenses" onClick={() => go({ kind: "expenses" })} />
        <Row label="Cash left" onClick={() => go({ kind: "cash" })} />
      </Group>

      <Group title="Shop">
        <Row label="Shop settings" onClick={() => go({ kind: "settings" })} />
        <Row label="Sales CSV" onClick={download} />
      </Group>

      <Group title="Help">
        <a
          href="mailto:help@startlite.in"
          className="flex min-h-12 items-center justify-between px-4 text-[15px]"
        >
          Contact us
          <span className="text-ink-subtle">→</span>
        </a>
      </Group>

      <div className="mt-6">
        {confirming ? (
          <div className="rounded-md border border-line bg-surface p-3">
            <p className="text-sm text-ink-muted">
              Clear this phone? Orders, items, and expenses will be removed.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className={quietButton("text-danger")}
                onClick={() => {
                  clearGuestState();
                  window.location.reload();
                }}
              >
                Clear data
              </button>
              <button
                type="button"
                className={quietButton()}
                onClick={() => setConfirming(false)}
              >
                Keep
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="w-full text-center text-xs text-ink-subtle"
            onClick={() => setConfirming(true)}
          >
            Start fresh on this phone
          </button>
        )}
      </div>
    </>
  );
}

export function GuestSettings({
  state,
  update,
  go,
  back,
  toast,
}: GuestViewProps) {
  const [name, setName] = useState(state.shop.name);
  const [pack, setPack] = useState(state.shop.pack);
  const [whatsapp, setWhatsapp] = useState(state.shop.whatsapp);
  const [upi, setUpi] = useState(state.shop.upi);
  const [locality, setLocality] = useState(state.shop.locality);
  const [privacyMode, setPrivacyMode] = useState(state.shop.privacyMode);
  const [bankName, setBankName] = useState(state.shop.bankName);
  const [bankNumber, setBankNumber] = useState(state.shop.bankNumber);
  const [bankIfsc, setBankIfsc] = useState(state.shop.bankIfsc);
  const [error, setError] = useState<string | null>(null);

  const handle = slugifyHandle(name);

  return (
    <>
      <BackButton onClick={back} label="More" />
      <PageHeader title="Shop settings" subtitle="What buyers see" />

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          if (name.trim().length < 2) {
            setError("Enter your shop name.");
            return;
          }
          if (whatsapp.trim() && whatsapp.replace(/\D/g, "").length < 10) {
            setError("Enter a WhatsApp number with 10 digits, or leave it empty.");
            return;
          }
          if (upi && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi)) {
            setError("Enter a UPI ID like name@bank.");
            return;
          }
          update((current) =>
            updateGuestShop(current, {
              name,
              pack,
              whatsapp,
              upi,
              locality,
              privacyMode,
              bankName,
              bankNumber,
              bankIfsc,
              addressPlaceholder: getPack(pack).note,
            }),
          );
          toast("Shop settings saved");
          go({ kind: "more" });
        }}
      >
        <div>
          <Label>Shop name</Label>
          <input
            className={inputClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
          />
        </div>

        <div>
          <Label>Store link</Label>
          <div className="flex items-center gap-1">
            <span className="shrink-0 text-sm text-ink-muted">/b/</span>
            <input
              className={inputClass}
              value={handle}
              readOnly
              placeholder="your-shop"
            />
          </div>
          <p className="mt-1 text-xs text-ink-subtle">
            Created when you save your shop. You can change it then.
          </p>
        </div>

        <div>
          <Label>What do you sell?</Label>
          <select
            className={inputClass}
            value={pack}
            onChange={(event) => setPack(event.target.value)}
          >
            {PACKS.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>WhatsApp number</Label>
          <input
            className={inputClass}
            inputMode="tel"
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            placeholder="98765 43210"
          />
        </div>

        <div>
          <Label>UPI ID (optional)</Label>
          <input
            className={inputClass}
            value={upi}
            onChange={(event) => setUpi(event.target.value)}
            placeholder="anita@okhdfcbank"
          />
        </div>

        <div>
          <Label>Locality (optional)</Label>
          <input
            className={inputClass}
            value={locality}
            onChange={(event) => setLocality(event.target.value)}
            placeholder="Kothrud, Pune"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={privacyMode}
            onChange={(event) => setPrivacyMode(event.target.checked)}
            className="h-4 w-4"
          />
          Privacy mode on bills
        </label>

        <details className="rounded-md border border-line bg-surface p-3">
          <summary className="cursor-pointer text-sm font-medium">
            Bank details (optional)
          </summary>
          <div className="mt-3 space-y-3">
            <div>
              <Label>Account name</Label>
              <input
                className={inputClass}
                value={bankName}
                onChange={(event) => setBankName(event.target.value)}
              />
            </div>
            <div>
              <Label>Account number</Label>
              <input
                className={inputClass}
                value={bankNumber}
                onChange={(event) => setBankNumber(event.target.value)}
              />
            </div>
            <div>
              <Label>IFSC</Label>
              <input
                className={inputClass}
                value={bankIfsc}
                onChange={(event) => setBankIfsc(event.target.value)}
              />
            </div>
          </div>
        </details>

        {error ? (
          <p
            className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger"
            aria-live="polite"
          >
            {error}
          </p>
        ) : null}

        <button className={primaryButton("w-full min-h-12")}>
          Save settings
        </button>
      </form>
    </>
  );
}

export function GuestExpenses({ state, update, back, toast }: GuestViewProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(guestToday());
  const [error, setError] = useState<string | null>(null);
  const summary = guestSummary(state);

  return (
    <>
      <BackButton onClick={back} label="More" />
      <PageHeader
        title="Expenses"
        subtitle={`This month · ${formatPaise(summary.monthExpensePaise)}`}
      />

      <form
        className="rounded-2xl border border-line bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          if (!title.trim()) {
            setError("Enter what you spent on.");
            return;
          }
          if (toPaise(amount) <= 0) {
            setError("Enter an amount above zero.");
            return;
          }
          update((current) =>
            addGuestExpense(current, { title, amount, date }),
          );
          setTitle("");
          setAmount("");
          toast("Expense saved");
        }}
      >
        <h2 className="text-[15px] font-semibold">Add expense</h2>
        <div className="mt-3">
          <Label>What for?</Label>
          <input
            className={inputClass}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Flour, gas, rent, delivery"
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <Label>Amount</Label>
            <input
              className={inputClass}
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label>Date</Label>
            <input
              className={inputClass}
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        </div>
        {error ? (
          <p className="mt-3 text-sm text-danger" aria-live="polite">
            {error}
          </p>
        ) : null}
        <button className={primaryButton("mt-4 w-full")}>Save expense</button>
      </form>

      <div className="mt-4">
        {state.expenses.length === 0 ? (
          <EmptyState
            title="No expenses yet"
            body="Log flour, gas, rent, or a delivery auto."
          />
        ) : (
          <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {state.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{expense.title}</p>
                  <p className="text-xs text-ink-muted">
                    {shortDate(`${expense.date}T00:00:00`)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="tnum text-sm font-semibold">
                    {formatPaise(toPaise(expense.amount))}
                  </p>
                  <button
                    type="button"
                    className="text-[11px] text-ink-subtle"
                    onClick={() => {
                      update((current) =>
                        deleteGuestExpense(current, expense.id),
                      );
                      toast("Expense removed");
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const PERIODS = {
  today: { label: "Today", since: guestStartOfToday },
  month: { label: "This month", since: guestStartOfMonth },
  all: { label: "All", since: () => null },
} as const;

export function GuestCash({ state, back }: GuestViewProps) {
  const [period, setPeriod] = useState<keyof typeof PERIODS>("today");
  const summary = guestCashSummary(state, PERIODS[period].since());

  return (
    <>
      <BackButton onClick={back} label="More" />
      <PageHeader title="Cash left" subtitle={`Period · ${PERIODS[period].label}`} />

      <div className="flex gap-2">
        {(Object.keys(PERIODS) as Array<keyof typeof PERIODS>).map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setPeriod(entry)}
            className={
              entry === period
                ? "rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white"
                : "rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink-muted"
            }
          >
            {PERIODS[entry].label}
          </button>
        ))}
      </div>

      <Card className="mt-4">
        <div className="space-y-3">
          <MoneyLine
            label="Money received"
            valuePaise={summary.receivedPaise}
            tone="success"
          />
          <MoneyLine
            label="Expenses"
            valuePaise={summary.spentPaise}
            tone="danger"
          />
          <div className="border-t border-line pt-3">
            <MoneyLine
              label="Cash left"
              valuePaise={summary.leftPaise}
              strong
            />
          </div>
        </div>
      </Card>

      <p className="mt-4 rounded-md bg-muted px-3 py-2.5 text-xs leading-5 text-ink-muted">
        This is not profit. It is money received minus expenses. Stock, rent due,
        and your own time are not counted here.
      </p>
    </>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
        {title}
      </h2>
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {children}
      </div>
    </section>
  );
}

function Row({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-12 w-full items-center justify-between px-4 text-left text-[15px]"
    >
      {label}
      <span className="text-ink-subtle">→</span>
    </button>
  );
}
