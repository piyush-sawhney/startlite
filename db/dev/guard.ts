/**
 * Guards for the destructive development database tools.
 *
 * These checks are deliberately blunt. A seed that runs against production is
 * worse than a seed that refuses to run.
 */

const LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
  "host.docker.internal",
]);

export function assertDevDatabase(action: string) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Refusing to ${action} the database: NODE_ENV is production.`,
    );
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      `Refusing to ${action} the database: DATABASE_URL is not set.`,
    );
  }

  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    throw new Error(
      `Refusing to ${action} the database: DATABASE_URL is not a valid URL.`,
    );
  }

  if (!LOCAL_HOSTS.has(host) && process.env.ALLOW_REMOTE_DEV_DB !== "1") {
    throw new Error(
      `Refusing to ${action} a non-local database (${host}). ` +
        "Set ALLOW_REMOTE_DEV_DB=1 only when the database is a disposable development database.",
    );
  }
}
