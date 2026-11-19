import { listAdminBusinesses } from "@/lib/admin";
import { apiData } from "@/lib/api";
import { requireApiAdmin } from "@/lib/api-auth";

export async function GET(request: Request) {
  const auth = await requireApiAdmin(request);
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? undefined;

  const businesses = await listAdminBusinesses(q);
  return apiData({ businesses });
}
