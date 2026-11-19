import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "VALIDATION_FAILED"
  | "AUTH_REQUIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "TURNSTILE_FAILED"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "PASS_EXPIRED"
  | "INTERNAL";

const STATUS: Record<ApiErrorCode, number> = {
  VALIDATION_FAILED: 422,
  AUTH_REQUIRED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TURNSTILE_FAILED: 400,
  PAYLOAD_TOO_LARGE: 413,
  RATE_LIMITED: 429,
  PASS_EXPIRED: 403,
  INTERNAL: 500,
};

export function apiError(
  code: ApiErrorCode,
  message: string,
  details: unknown[] = [],
) {
  return NextResponse.json(
    {
      error: { code, message, details },
      requestId: randomUUID(),
    },
    { status: STATUS[code] },
  );
}

export function apiData<T>(data: T, status = 200) {
  return NextResponse.json(
    { data, requestId: randomUUID() },
    { status },
  );
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "0.0.0.0";
}
