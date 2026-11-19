import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUser() {
  const current = await getSession();
  if (!current?.user) redirect("/login");
  return current.user;
}

export async function getBusinessForUser(userId: string) {
  const [business] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.ownerUserId, userId))
    .limit(1);
  return business ?? null;
}

export async function requireBusiness() {
  const user = await requireUser();
  const business = await getBusinessForUser(user.id);
  if (!business) redirect("/onboarding");
  return { user, business };
}

export async function requireBusinessNoRedirect() {
  const user = await requireUser();
  const business = await getBusinessForUser(user.id);
  return { user, business };
}

export async function businessByHandle(handle: string) {
  const [business] = await db
    .select()
    .from(businesses)
    .where(and(eq(businesses.handle, handle)))
    .limit(1);
  return business ?? null;
}
