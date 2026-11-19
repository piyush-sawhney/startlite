"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { inputClass, Label, primaryButton } from "@/components/ui";

export function LoginForm({
  initialMode,
  next,
}: {
  initialMode: "signin" | "signup";
  next?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    const result =
      mode === "signin"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name });

    setBusy(false);

    if (result.error) {
      setError(result.error.message ?? "Could not sign in. Try again.");
      return;
    }

    router.push(next ?? "/app");
    router.refresh();
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[420px] px-5 pb-16 pt-12">
      <Link href="/" className="text-[13px] font-semibold text-accent">
        ← StartLite
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        {mode === "signin" ? "Welcome back" : "Save your shop"}
      </h1>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        {mode === "signin"
          ? "Sign in to see today's numbers on every device."
          : "Your work on this phone is copied into the shop after you sign in."}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === "signup" ? (
          <div>
            <Label>Your name</Label>
            <input
              className={inputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </div>
        ) : null}

        <div>
          <Label>Email</Label>
          <input
            className={inputClass}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <Label>Password</Label>
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            minLength={8}
            required
          />
          {mode === "signup" ? (
            <p className="mt-1 text-xs text-ink-subtle">At least 8 characters.</p>
          ) : null}
        </div>

        {error ? (
          <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <button className={primaryButton("w-full")} disabled={busy}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Save my shop"}
        </button>
      </form>

      <button
        className="mt-6 text-sm font-medium text-accent"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError(null);
        }}
        type="button"
      >
        {mode === "signin"
          ? "New here? Save your shop"
          : "Already have a shop? Sign in"}
      </button>

      <p className="mt-8 text-xs leading-5 text-ink-subtle">
        You can keep working without an account. Signing in adds a store link,
        sync, and a safe copy of your data.
      </p>
    </div>
  );
}
