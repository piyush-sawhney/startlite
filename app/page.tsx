import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GuestApp } from "@/components/guest/GuestApp";
import { getBusinessForUser, getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false, follow: false },
};

export default async function HomePage() {
  let session: Awaited<ReturnType<typeof getSession>> = null;

  try {
    session = await getSession();
  } catch {
    // The workspace must open even when the network or database is down.
    session = null;
  }

  if (session?.user) {
    let hasShop = false;
    try {
      hasShop = Boolean(await getBusinessForUser(session.user.id));
    } catch {
      hasShop = false;
    }
    redirect(hasShop ? "/app" : "/onboarding");
  }

  return <GuestApp />;
}
