const HITS = new Map<string, number[]>();

/**
 * A small fixed-window limiter. One process, one map.
 * A multi-instance deploy moves this to Postgres or Redis.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const hits = (HITS.get(key) ?? []).filter((time) => time > cutoff);

  if (hits.length >= limit) {
    const retryAfter = Math.ceil((hits[0] + windowMs - now) / 1000);
    HITS.set(key, hits);
    return { ok: false, remaining: 0, retryAfter: Math.max(retryAfter, 1) };
  }

  hits.push(now);
  HITS.set(key, hits);

  if (HITS.size > 5_000) {
    for (const [entry, times] of HITS) {
      if (times.every((time) => time <= cutoff)) HITS.delete(entry);
    }
  }

  return { ok: true, remaining: limit - hits.length, retryAfter: 0 };
}
