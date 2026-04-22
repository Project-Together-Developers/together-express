import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import { env } from './config/env';
import app from './app';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

async function bootstrap(): Promise<void> {
  await connectDB();
  await connectRedis();

  const httpServer = createServer(app);

  const io = new SocketServer(httpServer, {
    cors: {
      origin: env.cors.allowedOrigins,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(env.port, () => {
    console.log(`[Server] Running on port ${env.port} in ${env.nodeEnv} mode`);
  });
}

bootstrap().catch((err) => {
  console.error('[Bootstrap] Fatal error:', err);
  process.exit(1);
});
