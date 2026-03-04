// Developed by Karim Mohamed (@kareemoopp760)
// © 2026 Karim Mohamed. All rights reserved.

const bucket = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max = 50, windowMs = 60_000) {
  const now = Date.now();
  const entry = bucket.get(key);
  if (!entry || now > entry.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }
  if (entry.count >= max) return { ok: false, remaining: 0 };
  entry.count += 1;
  return { ok: true, remaining: max - entry.count };
}
