import Link from "next/link";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { getBusinessForUser, requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await requireUser();
  const business = await getBusinessForUser(user.id);
  if (business) redirect("/app");

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[460px] px-5 pb-16 pt-10">
      <Link href="/" className="text-[13px] font-semibold text-accent">
        ← StartLite
      </Link>
      <OnboardingWizard name={user.name} />
    </main>
  );
}
