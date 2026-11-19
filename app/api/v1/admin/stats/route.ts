import { getPlatformStats } from "@/lib/admin";
import { apiData } from "@/lib/api";
import { requireApiAdmin } from "@/lib/api-auth";

export async function GET(request: Request) {
  const auth = await requireApiAdmin(request);
  if ("error" in auth) return auth.error;

  const stats = await getPlatformStats();
  return apiData(stats);
}
