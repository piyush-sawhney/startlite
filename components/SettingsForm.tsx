"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inputClass, Label, primaryButton } from "@/components/ui";
import { ShopLogoModal } from "@/components/home/ShopLogoModal";

type Settings = {
  businessName: string;
  shopLogoUrl?: string | null;
  handle: string;
  tagline: string;
  locality: string;
  whatsappNumber: string;
  upiId: string;
  noticeBanner: string;
  addressPlaceholder: string;
  enableTimeSlots: boolean;
  privacyMode: boolean;
  showBankDetails: boolean;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  advancePolicyText: string;
  defaultLocale: string;
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const settings = { ...form };
    delete settings.shopLogoUrl;

    const response = await fetch("/api/v1/merchant/business", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...settings,
        tagline: form.tagline || null,
        locality: form.locality || null,
        upiId: form.upiId || null,
        noticeBanner: form.noticeBanner || null,
        bankAccountName: form.bankAccountName || null,
        bankAccountNumber: form.bankAccountNumber || null,
        bankIfsc: form.bankIfsc || null,
        advancePolicyText: form.advancePolicyText || null,
      }),
    });

    setBusy(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.message ?? "Settings not saved. Try again.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <section className="space-y-3">
        <h2 className="text-[15px] font-semibold">Shop</h2>
        <div className="flex items-center gap-3">
          {form.shopLogoUrl ? (
            <img
              src={form.shopLogoUrl}
              alt="Shop logo"
              className="h-12 w-12 rounded-xl border border-line object-cover"
            />
          ) : (
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-lg font-bold text-accent-strong">
              {form.businessName.trim().charAt(0).toUpperCase() || "S"}
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Shop logo</p>
            <button
              type="button"
              onClick={() => setShowLogoModal(true)}
              className="mt-1 text-sm font-semibold text-accent-strong"
            >
              {form.shopLogoUrl ? "Change or remove" : "Upload logo"}
            </button>
          </div>
        </div>
        <div>
          <Label>Shop name</Label>
          <input
            className={inputClass}
            value={form.businessName}
            onChange={(event) => set("businessName", event.target.value)}
            required
          />
        </div>
        <div id="link">
          <Label>Store link</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink-muted">startlite.in/b/</span>
            <input
              className={inputClass}
              value={form.handle}
              onChange={(event) => set("handle", event.target.value)}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            />
          </div>
        </div>
        <div>
          <Label>Tagline</Label>
          <input
            className={inputClass}
            value={form.tagline}
            onChange={(event) => set("tagline", event.target.value)}
            placeholder="Fresh cakes, baked to order"
          />
        </div>
        <div>
          <Label>Locality</Label>
          <input
            className={inputClass}
            value={form.locality}
            onChange={(event) => set("locality", event.target.value)}
            placeholder="Kothrud, Pune"
          />
        </div>
        <div>
          <Label>WhatsApp number</Label>
          <input
            className={inputClass}
            inputMode="tel"
            value={form.whatsappNumber}
            onChange={(event) => set("whatsappNumber", event.target.value)}
          />
        </div>
        <div>
          <Label>UPI ID</Label>
          <input
            className={inputClass}
            value={form.upiId}
            onChange={(event) => set("upiId", event.target.value)}
            placeholder="name@okhdfcbank"
          />
          <p className="mt-1 text-xs text-ink-subtle">
            Appears on the bill and the QR. Leave empty to hide it.
          </p>
        </div>
      </section>

      <section className="space-y-3 border-t border-line pt-5">
        <h2 className="text-[15px] font-semibold">Storefront</h2>
        <div>
          <Label>Notice banner</Label>
          <input
            className={inputClass}
            value={form.noticeBanner}
            onChange={(event) => set("noticeBanner", event.target.value)}
            placeholder="Orders closed on Sunday"
          />
        </div>
        <div>
          <Label>Address placeholder</Label>
          <input
            className={inputClass}
            value={form.addressPlaceholder}
            onChange={(event) => set("addressPlaceholder", event.target.value)}
          />
        </div>
        <div>
          <Label>Advance policy</Label>
          <input
            className={inputClass}
            value={form.advancePolicyText}
            onChange={(event) => set("advancePolicyText", event.target.value)}
            placeholder="50% advance for orders above ₹1,000"
          />
        </div>
        <Switch
          label="Show time slots"
          checked={form.enableTimeSlots}
          onChange={(value) => set("enableTimeSlots", value)}
        />
        <Switch
          label="Privacy mode"
          hint="Hides the shop name on bills and replaces it with Consultation Receipt."
          checked={form.privacyMode}
          onChange={(value) => set("privacyMode", value)}
        />
      </section>

      <section className="space-y-3 border-t border-line pt-5">
        <h2 className="text-[15px] font-semibold">Bank details</h2>
        <Switch
          label="Show bank details on the bill"
          checked={form.showBankDetails}
          onChange={(value) => set("showBankDetails", value)}
        />
        {form.showBankDetails ? (
          <>
            <div>
              <Label>Account name</Label>
              <input
                className={inputClass}
                value={form.bankAccountName}
                onChange={(event) => set("bankAccountName", event.target.value)}
              />
            </div>
            <div>
              <Label>Account number</Label>
              <input
                className={inputClass}
                value={form.bankAccountNumber}
                onChange={(event) =>
                  set("bankAccountNumber", event.target.value)
                }
              />
            </div>
            <div>
              <Label>IFSC</Label>
              <input
                className={inputClass}
                value={form.bankIfsc}
                onChange={(event) => set("bankIfsc", event.target.value)}
              />
            </div>
          </>
        ) : null}
      </section>

      <section id="language" className="space-y-3 border-t border-line pt-5">
        <h2 className="text-[15px] font-semibold">Language</h2>
        <div>
          <Label>Storefront language</Label>
          <select
            className={inputClass}
            value={form.defaultLocale}
            onChange={(event) => set("defaultLocale", event.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="hi-Latn">Hinglish</option>
            <option value="mr">मराठी</option>
            <option value="gu">ગુજરાતી</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
      </section>

      {error ? (
        <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" aria-live="polite">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-success" aria-live="polite">
          Settings saved.
        </p>
      ) : null}

      <button className={primaryButton("w-full min-h-12")} disabled={busy}>
        {busy ? "Saving…" : "Save"}
      </button>
      <ShopLogoModal
        isOpen={showLogoModal}
        initialUrl={form.shopLogoUrl ?? null}
        onClose={() => setShowLogoModal(false)}
        onUpdated={(shopLogoUrl) =>
          setForm((current) => ({ ...current, shopLogoUrl }))
        }
      />
    </form>
  );
}

function Switch({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4"
      />
      <span>
        <span className="block font-medium">{label}</span>
        {hint ? <span className="block text-xs text-ink-muted">{hint}</span> : null}
      </span>
    </label>
  );
}
