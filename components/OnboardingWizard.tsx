"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { inputClass, Label, primaryButton, quietButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PACKS } from "@/lib/packs";
import { guestHasContent, readGuestState } from "@/lib/guest-store";

const STEP_COUNT = 4;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function OnboardingWizard({ name }: { name: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [shopName, setShopName] = useState("");
  const [handle, setHandle] = useState("");
  const [handleTouched, setHandleTouched] = useState(false);
  const [pack, setPack] = useState("grocery");
  const [whatsapp, setWhatsapp] = useState("");
  const [upi, setUpi] = useState("");
  const [locality, setLocality] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [startBlank, setStartBlank] = useState(false);

  useEffect(() => {
    const guest = readGuestState();
    if (!guest) return;
    if (guest.shop.name !== "My shop") {
      setShopName(guest.shop.name);
      setHandle(slugify(guest.shop.name));
    }
    setPack(guest.shop.pack);
    setWhatsapp(guest.shop.whatsapp);
    setUpi(guest.shop.upi);
    setLocality(guest.shop.locality);
    setStartBlank(guestHasContent(guest));
  }, []);

  function next() {
    setError(null);
    if (step === 1) {
      if (shopName.trim().length < 2) {
        setError("Enter your shop name.");
        return;
      }
      if (!handleTouched) setHandle(slugify(shopName));
    }
    if (step === 2) {
      if (handle.length < 3) {
        setError("Use at least 3 characters for the link.");
        return;
      }
    }
    setStep((current) => Math.min(STEP_COUNT, current + 1));
  }

  async function finish() {
    setError(null);
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Enter a WhatsApp number with 10 digits.");
      return;
    }

    setBusy(true);
    const response = await fetch("/api/v1/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        shopName,
        handle,
        pack,
        whatsappNumber: digits,
        upiId: upi || null,
        locality: locality || null,
        startBlank,
      }),
    });
    setBusy(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = payload?.error?.message ?? "Shop not created. Try again.";
      setError(message);
      if (response.status === 409) setStep(2);
      return;
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: STEP_COUNT }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              index < step ? "bg-accent" : "bg-line",
            )}
          />
        ))}
      </div>
      <p className="mt-3 text-xs font-medium text-ink-subtle">
        Step {step} of {STEP_COUNT}
      </p>

      {step === 1 ? (
        <section className="mt-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            What is your shop called, {name.split(" ")[0]}?
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Buyers see this name on your store link and your bills.
          </p>
          <div className="mt-6">
            <Label>Shop name</Label>
            <input
              className={inputClass}
              value={shopName}
              onChange={(event) => {
                setShopName(event.target.value);
                if (!handleTouched) setHandle(slugify(event.target.value));
              }}
              placeholder="Anita's Bakes"
              autoFocus
            />
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="mt-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Pick your store link
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            One link for WhatsApp. Lowercase letters, numbers, and hyphens.
          </p>
          <div className="mt-6">
            <Label>Store link</Label>
            <div className="flex items-center gap-1">
              <span className="shrink-0 text-sm text-ink-muted">/b/</span>
              <input
                className={inputClass}
                value={handle}
                onChange={(event) => {
                  setHandleTouched(true);
                  setHandle(slugify(event.target.value));
                }}
                placeholder="anitas-bakes"
                autoFocus
              />
            </div>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="mt-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            What do you sell?
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            This sets your words, units, and starter items.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {PACKS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setPack(entry.id)}
                className={cn(
                  "rounded-md border px-3 py-3 text-left text-sm",
                  pack === entry.id
                    ? "border-accent bg-accent-soft font-semibold text-accent-strong"
                    : "border-line bg-surface text-ink",
                )}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="mt-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Where do buyers reach you?
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            WhatsApp is where you take orders. UPI is how buyers pay.
          </p>
          <div className="mt-6 space-y-4">
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
          </div>
        </section>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" aria-live="polite">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex gap-2">
        {step > 1 ? (
          <button
            type="button"
            className={quietButton("flex-1")}
            onClick={() => {
              setError(null);
              setStep((current) => Math.max(1, current - 1));
            }}
          >
            Back
          </button>
        ) : null}
        {step < STEP_COUNT ? (
          <button type="button" className={primaryButton("flex-1")} onClick={next}>
            Next
          </button>
        ) : (
          <button
            type="button"
            className={primaryButton("flex-1")}
            onClick={finish}
            disabled={busy}
          >
            {busy ? "Creating…" : "Create shop"}
          </button>
        )}
      </div>
    </div>
  );
}
