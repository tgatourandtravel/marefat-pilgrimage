import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const isConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = isConfigured ? Redis.fromEnv() : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: false,
    })
  : null;

// Stricter limiter for the admin login endpoint
const adminLoginRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: false,
    })
  : null;

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean }> {
  if (!ratelimit) return { allowed: true };
  try {
    const { success } = await Promise.race([
      ratelimit.limit(ip),
      new Promise<{ success: boolean }>((_, reject) => {
        setTimeout(() => reject(new Error("rate_limit_timeout")), 2500);
      }),
    ]);
    return { allowed: success };
  } catch (error) {
    console.error("Rate limit check failed; allowing request:", error);
    return { allowed: true };
  }
}

export async function checkAdminLoginRateLimit(ip: string): Promise<{ allowed: boolean }> {
  if (!adminLoginRatelimit) return { allowed: true };
  try {
    const { success } = await adminLoginRatelimit.limit(`admin_login:${ip}`);
    return { allowed: success };
  } catch (error) {
    console.error("Admin login rate limit check failed; allowing request:", error);
    return { allowed: true };
  }
}