import { apiData, apiError } from "@/lib/api";
import { requireApiBusiness } from "@/lib/api-auth";
import { getHomeDashboard } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireApiBusiness(request);
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const day = url.searchParams.get("day") ?? undefined;

  try {
    const data = await getHomeDashboard(auth.business.id, day);
    return apiData(data);
  } catch (error) {
    return apiError(
      "INTERNAL",
      error instanceof Error ? error.message : "Failed to load home dashboard",
    );
  }
}
