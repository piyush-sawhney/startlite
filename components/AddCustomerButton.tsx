"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddCustomerModal, type CustomerInput } from "@/components/home/AddCustomerModal";
import { primaryButton } from "@/components/ui";

/** The list-page entry point for a new customer record. */
export function AddCustomerButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function submit(data: CustomerInput) {
    const response = await fetch("/api/v1/merchant/customers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone ?? "",
        email: data.email ?? "",
        subLabel: data.subLabel ?? "",
        address: data.address,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error?.message ?? "Could not save customer.");
    }
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={primaryButton("px-3")}
      >
        Add customer
      </button>
      <AddCustomerModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={submit}
      />
    </>
  );
}
