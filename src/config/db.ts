import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  try {
    await mongoose.connect(env.mongo.uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('[MongoDB] Connected successfully');
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected');
    isConnected = false;
  });
}
