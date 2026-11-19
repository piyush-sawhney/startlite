import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, authorized } = await requireAdmin();

  if (!authorized) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center p-6 text-center">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-danger">
            403 Forbidden
          </p>
          <h1 className="mt-2 text-xl font-bold text-ink">Admin Access Only</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Signed in as {user.email}. This account does not have platform owner
            permissions.
          </p>
          <div className="mt-6">
            <Link
              href="/app"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-white"
            >
              Return to Merchant App
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-bold tracking-tight text-ink">
              StartLite <span className="rounded bg-ink px-1.5 py-0.5 text-[11px] font-semibold text-white">Admin</span>
            </Link>
            <nav className="flex items-center gap-2 pl-4 text-sm">
              <Link href="/admin" className="text-ink-muted hover:text-ink">
                Overview
              </Link>
              <span className="text-line">/</span>
              <Link href="/app" className="text-ink-muted hover:text-ink">
                Merchant App ↗
              </Link>
            </nav>
          </div>
          <p className="text-xs text-ink-subtle">{user.email}</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
