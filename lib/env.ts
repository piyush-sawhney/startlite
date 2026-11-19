/**
 * Environment access.
 *
 * Secrets come from the environment only. Nothing here has a code fallback.
 * A missing value fails at startup with a clear message instead of quietly
 * using a weak default.
 */

function read(name: string): string | null {
  const value = process.env[name];
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function requireEnv(name: string): string {
  const value = read(name);
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env.local and set it.`,
    );
  }
  return value;
}

export function optionalEnv(name: string): string | null {
  return read(name);
}

export const serverEnv = {
  get databaseUrl() {
    return requireEnv("DATABASE_URL");
  },
  get betterAuthSecret() {
    const value = requireEnv("BETTER_AUTH_SECRET");
    if (value.length < 32) {
      throw new Error("BETTER_AUTH_SECRET must be at least 32 characters.");
    }
    return value;
  },
  get betterAuthUrl() {
    return requireEnv("BETTER_AUTH_URL");
  },
  get ipHashSecret() {
    return requireEnv("IP_HASH_SECRET");
  },
  get turnstileSecret() {
    return optionalEnv("TURNSTILE_SECRET_KEY");
  },
  get mediaRoot() {
    return requireEnv("MEDIA_ROOT");
  },
};

export function trustedOrigins(fallback: string): string[] {
  const value = read("TRUSTED_ORIGINS");
  const origins = value
    ? value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
  return origins.length > 0 ? origins : [fallback];
}
