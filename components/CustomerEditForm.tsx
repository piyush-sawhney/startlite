"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Label, inputClass, primaryButton, quietButton } from "@/components/ui";

type Address = {
  line1: string;
  line2: string;
  /** Kept for older records; the editor only shows two address lines. */
  line3: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
};

export type CustomerEditValues = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subLabel: string;
  notes: string;
  address: Address;
  lastPaid: string;
  since: string;
};

type FormValues = Omit<CustomerEditValues, "id" | "lastPaid" | "since">;

function initialForm(values: CustomerEditValues): FormValues {
  return {
    name: values.name,
    phone: values.phone,
    email: values.email,
    subLabel: values.subLabel,
    notes: values.notes,
    address: { ...values.address },
  };
}

/** Inline editor for the person record. Money and order rows stay read-only. */
export function CustomerEditForm({ values }: { values: CustomerEditValues }) {
  const router = useRouter();
  const [form, setForm] = useState<FormValues>(() => initialForm(values));
  const signature = JSON.stringify(initialForm(values));
  const [baseline, setBaseline] = useState(signature);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(initialForm(values));
    setBaseline(signature);
    // Re-sync only when the server data behind this form actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const dirty = JSON.stringify(form) !== baseline;
  const field = `${inputClass} lg:min-h-10`;
  const setAddress = (key: keyof Address, value: string) =>
    setForm((current) => ({
      ...current,
      address: { ...current.address, [key]: value },
    }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!dirty || busy) return;
    setBusy(true);
    setError(null);
    setStatus("idle");

    const response = await fetch(`/api/v1/merchant/customers/${values.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });

    setBusy(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = payload?.error?.message ?? "Not saved. Try again.";
      setError(message);
      setStatus("error");
      return;
    }

    setBaseline(JSON.stringify(form));
    setStatus("saved");
    router.refresh();
  }

  function discard() {
    setForm(initialForm(values));
    setStatus("idle");
    setError(null);
  }

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <h2 className="text-small font-bold text-ink">Details</h2>
        <span
          aria-live="polite"
          className={`text-caption font-semibold ${
            status === "error"
              ? "text-danger"
              : status === "saved"
                ? "text-success"
                : dirty
                  ? "text-warning"
                  : "text-ink-subtle"
          }`}
        >
          {status === "error"
            ? "Save failed"
            : status === "saved"
              ? "Saved"
              : dirty
                ? "Unsaved changes"
                : ""}
        </span>
      </div>

      <form onSubmit={submit} className="px-3 py-3 md:px-4">
        <div className="grid gap-x-6 gap-y-3 lg:grid-cols-2">
          <fieldset className="min-w-0">
            <legend className="eyebrow text-ink-subtle">Contact</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="min-w-0 sm:col-span-2">
                <Label>Name</Label>
                <input
                  className={field}
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  maxLength={80}
                  required
                />
              </div>
              <div className="min-w-0">
                <Label>Label</Label>
                <input
                  className={field}
                  value={form.subLabel}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, subLabel: event.target.value }))
                  }
                  placeholder="e.g. Regular"
                  maxLength={100}
                />
              </div>
              <div className="min-w-0">
                <Label>Mobile</Label>
                <input
                  className={field}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  placeholder="98765 43210"
                  maxLength={20}
                />
              </div>
              <div className="min-w-0 sm:col-span-2">
                <Label>Email (optional)</Label>
                <input
                  className={field}
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="name@example.com"
                  maxLength={254}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="min-w-0 lg:border-l lg:border-line/70 lg:pl-6">
            <legend className="eyebrow text-ink-subtle">Address</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="min-w-0 sm:col-span-2">
                <Label>Address 1</Label>
                <input
                  className={field}
                  autoComplete="address-line1"
                  value={form.address.line1}
                  onChange={(event) => setAddress("line1", event.target.value)}
                  maxLength={120}
                />
              </div>
              <div className="min-w-0 sm:col-span-2">
                <Label>Address 2</Label>
                <input
                  className={field}
                  autoComplete="address-line2"
                  value={form.address.line2}
                  onChange={(event) => setAddress("line2", event.target.value)}
                  maxLength={120}
                />
              </div>
              <div className="min-w-0">
                <Label>Landmark</Label>
                <input
                  className={field}
                  autoComplete="address-line3"
                  value={form.address.locality}
                  onChange={(event) => setAddress("locality", event.target.value)}
                  maxLength={80}
                />
              </div>
              <div className="min-w-0">
                <Label>Pincode</Label>
                <input
                  className={`${field} max-w-[9rem]`}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  value={form.address.pincode}
                  onChange={(event) => setAddress("pincode", event.target.value)}
                  maxLength={12}
                />
              </div>
              <div className="min-w-0">
                <Label>City</Label>
                <input
                  className={field}
                  autoComplete="address-level2"
                  value={form.address.city}
                  onChange={(event) => setAddress("city", event.target.value)}
                  maxLength={80}
                />
              </div>
              <div className="min-w-0">
                <Label>State</Label>
                <input
                  className={field}
                  autoComplete="address-level1"
                  value={form.address.state}
                  onChange={(event) => setAddress("state", event.target.value)}
                  maxLength={80}
                />
              </div>
              <div className="min-w-0 sm:col-span-2">
                <Label>Country</Label>
                <input
                  className={field}
                  autoComplete="country-name"
                  value={form.address.country}
                  onChange={(event) => setAddress("country", event.target.value)}
                  maxLength={80}
                />
              </div>
            </div>
          </fieldset>
        </div>

        <div className="mt-3 border-t border-line/70 pt-3">
          <label htmlFor="customer-note" className="eyebrow text-ink-subtle">
            Note
          </label>
          <textarea
            id="customer-note"
            className={`${inputClass} mt-2 min-h-14 resize-y py-2 lg:min-h-12`}
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
            maxLength={500}
            rows={2}
          />
        </div>

        {error ? (
          <p className="text-small text-danger" aria-live="polite">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-caption text-ink-muted">
            <span>
              Last paid: <span className="font-semibold text-ink">{values.lastPaid}</span>
            </span>
            <span>
              Since: <span className="font-semibold text-ink">{values.since}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className={primaryButton()} disabled={!dirty || busy}>
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className={quietButton()}
              onClick={discard}
              disabled={!dirty || busy}
            >
              Discard
            </button>
          </div>
        </div>
      </form>
    </Card>
  );
}
