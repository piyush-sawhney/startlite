import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function GET() {
  let database = "down";
  try {
    await db.execute(sql`select 1`);
    database = "up";
  } catch {
    database = "down";
  }

  return Response.json(
    {
      status: database === "up" ? "ok" : "degraded",
      database,
      build: process.env.GIT_SHA ?? "dev",
      time: new Date().toISOString(),
    },
    { status: database === "up" ? 200 : 503 },
  );
}
