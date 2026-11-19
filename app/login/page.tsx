import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getBusinessForUser, getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function safeNext(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode === "signup" ? "signup" : "signin";
  const next = safeNext(params.next);

  let session: Awaited<ReturnType<typeof getSession>> = null;
  try {
    session = await getSession();
  } catch {
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

  return <LoginForm initialMode={mode} next={next} />;
}
