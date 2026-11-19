import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy · StartLite",
  description: "Subscription cancellation, trials, and refund policy for StartLite.",
};

export default function RefundPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm font-medium text-accent">
          ← StartLite
        </Link>
      </div>

      <PageHeader
        eyebrow="Legal"
        title="Refund & Cancellation"
        subtitle="Last updated: November 2026"
      />

      <div className="space-y-4 text-sm leading-6 text-ink">
        <Card>
          <h2 className="text-base font-semibold">90-Day Free Trial</h2>
          <p className="mt-2 text-ink-muted">
            Every merchant starts with a 90-day free trial with full features. No credit card or upfront
            payment is required. You can test your storefront, catalog, and ledger risk-free.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Quarterly Subscription Pass</h2>
          <p className="mt-2 text-ink-muted">
            StartLite charges ₹111 + 18% GST (₹130.98 per 90-day quarter). Subscriptions are prepaid
            and manual—there are no unexpected AutoPay deductions from your bank or card.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Refund Policy</h2>
          <p className="mt-2 text-ink-muted">
            Because a generous 90-day free trial is provided before any payment is collected,
            subscription payments are non-refundable once activated. If you experience technical issues
            preventing store usage, reach out to support for resolution or pass extension.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">What Happens on Expiry</h2>
          <p className="mt-2 text-ink-muted">
            When a pass expires and is not renewed, your public storefront URL simply pauses (showing
            a polite notice to visitors). Your account remains active: you can log in, view all records,
            record local sales, and download a complete CSV export anytime.
          </p>
        </Card>

        <div className="pt-4 text-center text-xs text-ink-subtle">
          Assistance:{" "}
          <a href="mailto:help@startlite.in" className="text-accent hover:underline">
            help@startlite.in
          </a>
        </div>
      </div>
    </main>
  );
}
