import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.redis.url, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 5) return null;
    return Math.min(times * 100, 2000);
  },
});

redis.on('connect', () => console.log('[Redis] Connected'));
redis.on('error', (err) => console.error('[Redis] Error:', err.message));

export async function connectRedis(): Promise<void> {
  await redis.connect();
}
