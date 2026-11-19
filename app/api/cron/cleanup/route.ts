import { and, lt } from "drizzle-orm";
import { db } from "@/db";
import { pendingOrders, verification } from "@/db/schema";
import { apiData, apiError } from "@/lib/api";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    const cronHeader = request.headers.get("x-cron-secret");
    const url = new URL(request.url);
    const querySecret = url.searchParams.get("secret");

    const provided =
      authHeader?.replace(/^Bearer\s+/i, "") || cronHeader || querySecret;

    if (provided !== secret) {
      return apiError("AUTH_REQUIRED", "Invalid cron secret.");
    }
  }

  const now = new Date();

  const [deletedOrders, deletedVerifications] = await Promise.all([
    db
      .delete(pendingOrders)
      .where(lt(pendingOrders.expiresAt, now))
      .returning({ id: pendingOrders.id }),
    db
      .delete(verification)
      .where(lt(verification.expiresAt, now))
      .returning({ id: verification.id }),
  ]);

  return apiData({
    deletedPendingOrders: deletedOrders.length,
    deletedVerifications: deletedVerifications.length,
    cleanedAt: now.toISOString(),
  });
}

export async function GET(request: Request) {
  return POST(request);
}
