"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { quietButton } from "@/components/ui";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      className={quietButton("w-full text-small")}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

/** The collapsed sidebar shows the same action as an icon-only control. */
export function SignOutIconButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      aria-label="Sign out"
      title="Sign out"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
      className="relative grid h-11 w-11 place-items-center rounded-xl text-ink-muted transition after:absolute after:-inset-1 after:content-[''] hover:bg-muted hover:text-danger"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
