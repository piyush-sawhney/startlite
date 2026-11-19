import { z } from "zod";
import { toggleBusinessSuspension } from "@/lib/admin";
import { apiData, apiError, readJson } from "@/lib/api";
import { requireApiAdmin } from "@/lib/api-auth";

const schema = z.object({
  reason: z.string().max(200).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiAdmin(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  let reason: string | undefined;

  try {
    const body = await readJson(request);
    const parsed = schema.safeParse(body);
    if (parsed.success) {
      reason = parsed.data.reason;
    }
  } catch {
    // empty body is acceptable
  }

  try {
    const result = await toggleBusinessSuspension(id, auth.user.id, reason);
    return apiData(result);
  } catch (err: any) {
    return apiError("NOT_FOUND", err?.message || "Could not toggle status.");
  }
}
