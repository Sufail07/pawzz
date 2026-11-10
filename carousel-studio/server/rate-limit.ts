interface Bucket {
  times: number[];
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfter: number;
  remaining: number;
}

export function checkRateLimit(key: string, limitPerMinute: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - 60_000;
  const bucket = buckets.get(key) ?? { times: [] };
  bucket.times = bucket.times.filter((time) => time > windowStart);

  if (bucket.times.length >= limitPerMinute) {
    const oldest = bucket.times[0] ?? now;
    buckets.set(key, bucket);
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((oldest + 60_000 - now) / 1000)),
      remaining: 0,
    };
  }

  bucket.times.push(now);
  buckets.set(key, bucket);
  return {
    allowed: true,
    retryAfter: 0,
    remaining: Math.max(0, limitPerMinute - bucket.times.length),
  };
}

export function resetRateLimits(): void {
  buckets.clear();
}
