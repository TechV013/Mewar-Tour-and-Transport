type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Best-effort in-process limiter. Serverless instances have separate memory,
 * so a shared store should replace this if the site is scaled horizontally.
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
): boolean {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [entry, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(entry);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 64);
  return (request.headers.get("x-real-ip") ?? "unknown").slice(0, 64);
}
