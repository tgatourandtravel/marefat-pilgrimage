import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const isConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit = isConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: false,
    })
  : null;

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean }> {
  if (!ratelimit) return { allowed: true };
  const { success } = await ratelimit.limit(ip);
  return { allowed: success };
}