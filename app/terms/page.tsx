import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service · StartLite",
  description: "Terms and conditions for StartLite storefronts and cash ledger.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm font-medium text-accent">
          ← StartLite
        </Link>
      </div>

      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="Last updated: November 2026"
      />

      <div className="space-y-4 text-sm leading-6 text-ink">
        <Card>
          <h2 className="text-base font-semibold">1. The Service</h2>
          <p className="mt-2 text-ink-muted">
            StartLite provides a digital storefront and cash-flow ledger for micro-businesses
            selling through WhatsApp in India. StartLite is a software tool, not a marketplace
            and not a payment aggregator.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">2. Payments and Money</h2>
          <p className="mt-2 text-ink-muted">
            StartLite never holds, escrow, or processes buyer money. All buyer payments are
            direct merchant-to-buyer transactions via UPI or direct bank transfer.
            Merchants are solely responsible for fulfilling orders and logging payments accurately.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">3. Subscriptions and Fees</h2>
          <p className="mt-2 text-ink-muted">
            New shops receive a 90-day free trial with full access. After the trial, the storefront
            pass is ₹111 + 18% GST (₹130.98 total) per 90-day quarter. If a pass expires, the public
            storefront pauses, but the merchant retains full login access and can export all records
            at any time.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">4. Data and Ownership</h2>
          <p className="mt-2 text-ink-muted">
            You own your catalog, order history, customer contact information, and expenses.
            We will never sell your customer list, advertise to your buyers, or take a commission on your sales.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">5. Acceptable Use</h2>
          <p className="mt-2 text-ink-muted">
            You agree not to use StartLite for illegal goods, prohibited substances, fraudulent schemes,
            or unsolicited bulk messaging. Violations will result in immediate suspension of your store.
          </p>
        </Card>

        <div className="pt-4 text-center text-xs text-ink-subtle">
          Questions? Contact us at{" "}
          <a href="mailto:help@startlite.in" className="text-accent hover:underline">
            help@startlite.in
          </a>
        </div>
      </div>
    </main>
  );
}
