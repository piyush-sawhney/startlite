"use client";

import { SheetClose } from "./SheetClose";

import { useEffect, useState } from "react";
import { Label, inputClass, primaryButton, quietButton } from "@/components/ui";

export type CustomerAddressInput = {
  line1: string;
  line2?: string;
  line3?: string;
  city?: string;
  state?: string;
  country: string;
  pincode?: string;
};

export type CustomerInput = {
  name: string;
  countryCode: string;
  phone?: string;
  subLabel?: string;
  address: CustomerAddressInput | null;
};

const COUNTRY_CODES = [
  { code: "+91", label: "India +91" },
  { code: "+971", label: "UAE +971" },
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+65", label: "Singapore +65" },
];

export function AddCustomerModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerInput) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [subLabel, setSubLabel] = useState("");
  const [storeAddress, setStoreAddress] = useState(false);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [pincode, setPincode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  function reset() {
    setName("");
    setCountryCode("+91");
    setPhone("");
    setSubLabel("");
    setStoreAddress(false);
    setLine1("");
    setLine2("");
    setLine3("");
    setCity("");
    setState("");
    setCountry("India");
    setPincode("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!name.trim()) {
      setError("Enter customer name.");
      return;
    }
    if (phone.trim() && digits.length < 6) {
      setError("Enter a valid WhatsApp number, or leave it empty.");
      return;
    }
    if (storeAddress && !line1.trim()) {
      setError("Enter address line 1, or turn the address off.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        countryCode,
        phone: digits || undefined,
        subLabel: subLabel.trim() || undefined,
        address: storeAddress
          ? {
              line1: line1.trim(),
              line2: line2.trim() || undefined,
              line3: line3.trim() || undefined,
              city: city.trim() || undefined,
              state: state.trim() || undefined,
              country: country.trim() || "India",
              pincode: pincode.trim() || undefined,
            }
          : null,
      });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add customer");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-customer-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[92dvh] w-full max-w-[440px] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:pb-5">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <h2 id="add-customer-title" className="text-title font-bold text-ink">
            Add customer
          </h2>
          <SheetClose onClose={onClose} label="Close Add customer" />
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label>Name</Label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="e.g. Ramesh Kumar"
              maxLength={80}
              required
              autoFocus
            />
          </div>

          <div>
            <Label>WhatsApp number</Label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(event) => setCountryCode(event.target.value)}
                className={`${inputClass} w-[128px] shrink-0`}
                aria-label="Country code"
              >
                {COUNTRY_CODES.map((entry) => (
                  <option key={entry.code} value={entry.code}>
                    {entry.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={inputClass}
                placeholder="98765 43210"
                maxLength={15}
              />
            </div>
          </div>

          <div>
            <Label>Label</Label>
            <input
              type="text"
              value={subLabel}
              onChange={(event) => setSubLabel(event.target.value)}
              className={inputClass}
              placeholder="e.g. regular, Sector 4"
              maxLength={60}
            />
          </div>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
            <span className="text-sm font-medium text-ink">Store address</span>
            <input
              type="checkbox"
              checked={storeAddress}
              onChange={(event) => setStoreAddress(event.target.checked)}
              className="h-5 w-5"
            />
          </label>

          {storeAddress ? (
            <div className="space-y-3">
              <div>
                <Label>Address line 1</Label>
                <input
                  type="text"
                  value={line1}
                  onChange={(event) => setLine1(event.target.value)}
                  className={inputClass}
                  placeholder="House or shop number, street"
                  maxLength={80}
                />
              </div>
              <div>
                <Label>Address line 2</Label>
                <input
                  type="text"
                  value={line2}
                  onChange={(event) => setLine2(event.target.value)}
                  className={inputClass}
                  placeholder="Area or landmark"
                  maxLength={80}
                />
              </div>
              <div>
                <Label>Address line 3</Label>
                <input
                  type="text"
                  value={line3}
                  onChange={(event) => setLine3(event.target.value)}
                  className={inputClass}
                  placeholder="Optional"
                  maxLength={80}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>City</Label>
                  <input
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className={inputClass}
                    maxLength={60}
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <input
                    type="text"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className={inputClass}
                    maxLength={60}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Country</Label>
                  <input
                    type="text"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    className={inputClass}
                    maxLength={60}
                  />
                </div>
                <div>
                  <Label>Pincode</Label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={pincode}
                    onChange={(event) => setPincode(event.target.value)}
                    className={inputClass}
                    placeholder="411001"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="text-xs text-danger" aria-live="polite">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2 pb-2 sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className={quietButton("flex-1 min-h-11")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className={primaryButton("flex-1 min-h-11")}
            >
              {busy ? "Saving..." : "Add customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
