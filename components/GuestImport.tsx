"use client";

import { useEffect, useRef, useState } from "react";
import {
  clearGuestState,
  guestImportPayload,
  readGuestState,
} from "@/lib/guest-store";

export function GuestImport() {
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">(
    "idle",
  );
  const started = useRef(false);

  async function run() {
    const state = readGuestState();
    if (!state) return;

    const payload = guestImportPayload(state);
    if (!payload) {
      clearGuestState();
      return;
    }

    setStatus("busy");
    try {
      const response = await fetch("/api/v1/merchant/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("import failed");
      clearGuestState();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void run();
    // The import runs once per signed-in session. A retry uses the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== "done") return;
    const timer = window.setTimeout(() => setStatus("idle"), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

  if (status === "done") {
    return (
      <p className="mb-3 rounded-md bg-success/10 px-3 py-2 text-xs font-medium text-success">
        Phone data copied into your shop.
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="mb-3 rounded-md border border-warning/30 bg-warning/10 px-3 py-2.5">
        <p className="text-sm font-medium text-warning">
          Phone data is not copied yet
        </p>
        <p className="mt-0.5 text-xs leading-5 text-ink-muted">
          Your shop is ready. The orders and items on this phone are still safe.
        </p>
        <button
          type="button"
          className="mt-2 text-xs font-semibold text-accent"
          onClick={() => void run()}
        >
          Try again
        </button>
      </div>
    );
  }

  return null;
}
