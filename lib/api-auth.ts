import { eq } from "drizzle-orm";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { apiError } from "./api";
import { auth } from "./auth";

export async function requireApiBusiness(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return { error: apiError("AUTH_REQUIRED", "Sign in to continue.") };
  }

  const [business] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.ownerUserId, session.user.id))
    .limit(1);

  if (!business) {
    return { error: apiError("FORBIDDEN", "Finish setting up your shop first.") };
  }

  return { business, user: session.user };
}

export async function requireApiUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return { error: apiError("AUTH_REQUIRED", "Sign in to continue.") };
  }
  return { user: session.user };
}
