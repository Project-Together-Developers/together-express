import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { redis } from '../config/redis';

export async function healthCheck(_req: Request, res: Response): Promise<void> {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'ok' : 'error';
  let redisStatus = 'error';
  try {
    await redis.ping();
    redisStatus = 'ok';
  } catch {}

  const healthy = mongoStatus === 'ok' && redisStatus === 'ok';

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    timestamp: new Date().toISOString(),
    services: {
      mongo: mongoStatus,
      redis: redisStatus,
    },
  });
}
