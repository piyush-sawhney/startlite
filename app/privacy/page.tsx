import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy · StartLite",
  description: "How StartLite handles your data, your customer contacts, and storage.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm font-medium text-accent">
          ← StartLite
        </Link>
      </div>

      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Last updated: November 2026"
      />

      <div className="space-y-4 text-sm leading-6 text-ink">
        <Card>
          <h2 className="text-base font-semibold">1. Information We Collect</h2>
          <p className="mt-2 text-ink-muted">
            For merchants, we store your name, email, WhatsApp phone number, shop name,
            catalog items, and billing ledger. For buyers, we temporarily receive contact details
            (name and phone) entered during WhatsApp order handoff to allow the merchant to review and accept the order.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">2. Guest Workspace & Local Storage</h2>
          <p className="mt-2 text-ink-muted">
            Before signing in, your sales and catalog data stay strictly on your device inside
            browser localStorage (key: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">startlite_guest_v2</code>).
            Clearing your browser storage deletes unsaved guest work. When you create an account,
            this data is transferred securely to your shop.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">3. We Do Not Sell Data</h2>
          <p className="mt-2 text-ink-muted">
            StartLite does not display third-party advertisements and never sells or rents
            your customer phone numbers or business records to data brokers or third parties.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">4. Security & Storage</h2>
          <p className="mt-2 text-ink-muted">
            Every shop&apos;s data is isolated at the database level. Server communications use TLS encryption.
            Uploaded catalog images are stored on isolated volumes without public bucket exposure.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">5. Data Retention & Deletion</h2>
          <p className="mt-2 text-ink-muted">
            Pending orders that are not accepted expire and are purged automatically after 7 days.
            You can export your complete data as CSV at any time or request permanent account deletion.
          </p>
        </Card>

        <div className="pt-4 text-center text-xs text-ink-subtle">
          Privacy questions? Write to us at{" "}
          <a href="mailto:privacy@startlite.in" className="text-accent hover:underline">
            privacy@startlite.in
          </a>
        </div>
      </div>
    </main>
  );
}
