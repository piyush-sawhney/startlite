import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Data Deletion Instructions · StartLite",
  description: "How to export or permanently delete your StartLite account and shop data.",
};

export default function DataDeletionPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm font-medium text-accent">
          ← StartLite
        </Link>
      </div>

      <PageHeader
        eyebrow="Privacy & Compliance"
        title="Data Deletion Instructions"
        subtitle="Last updated: November 2026"
      />

      <div className="space-y-4 text-sm leading-6 text-ink">
        <Card>
          <h2 className="text-base font-semibold">1. Self-Service Data Export</h2>
          <p className="mt-2 text-ink-muted">
            You can export your complete business data at any time (even if your storefront pass has expired).
            Sign in, navigate to <strong className="text-ink">More → Download data</strong>, or visit{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/api/v1/merchant/export.csv</code>.
            This generates a standard UTF-8 CSV containing all sales, customer dues, items, and expenses.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">2. Guest Workspace Deletion</h2>
          <p className="mt-2 text-ink-muted">
            If you used StartLite before creating an account, all records are stored solely in your device&apos;s
            browser storage. You can instantly delete all guest data by opening the app, tapping{" "}
            <strong className="text-ink">More → Start fresh</strong>, or by clearing your browser cache/cookies.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">3. Permanent Account Deletion Request</h2>
          <p className="mt-2 text-ink-muted">
            To permanently delete your registered merchant account, shop storefront, uploaded media,
            and all associated database records:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink-muted">
            <li>
              Send an email to{" "}
              <a href="mailto:privacy@startlite.in" className="text-accent hover:underline">
                privacy@startlite.in
              </a>{" "}
              from your registered account email address.
            </li>
            <li>Use the subject line: <strong className="text-ink">Permanent Account Deletion Request</strong>.</li>
            <li>Include your shop name or storefront link (e.g., <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/b/your-shop</code>).</li>
          </ol>
          <p className="mt-3 text-ink-muted">
            Our team will confirm your request and permanently erase your account and tenant records within 14 business days.
          </p>
        </Card>

        <div className="pt-4 text-center text-xs text-ink-subtle">
          Support contact:{" "}
          <a href="mailto:help@startlite.in" className="text-accent hover:underline">
            help@startlite.in
          </a>
        </div>
      </div>
    </main>
  );
}
