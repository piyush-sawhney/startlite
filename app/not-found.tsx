import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
        StartLite
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        This page is not here
      </h1>
      <p className="mt-3 text-[15px] leading-6 text-ink-muted">
        The link may have expired, or the shop may be closed. Ask the shop to
        send a new link.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-accent px-5 text-[15px] font-semibold text-white"
      >
        Go to StartLite
      </Link>
    </main>
  );
}
