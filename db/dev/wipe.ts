import { sql } from "drizzle-orm";
import { db } from "@/db";
import { assertDevDatabase } from "./guard";

/**
 * Every application table. Order does not matter because the statement uses
 * CASCADE. `__drizzle_migrations` is intentionally absent: schema history is
 * not shop data.
 */
export const APP_TABLES = [
  "audit_log",
  "subscription_payments",
  "expenses",
  "pending_orders",
  "order_payments",
  "order_items",
  "orders",
  "media",
  "item_extras",
  "item_options",
  "catalog_items",
  "customers",
  "businesses",
  "verification",
  "account",
  "session",
  "user",
  "platform_settings",
] as const;

export async function wipeDevDatabase() {
  assertDevDatabase("wipe");

  await db.execute(
    sql.raw(
      `TRUNCATE TABLE ${APP_TABLES.map((table) => `"${table}"`).join(", ")} RESTART IDENTITY CASCADE`,
    ),
  );

  return APP_TABLES.length;
}
