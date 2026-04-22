import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), '.logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
);

export const logger = winston.createLogger({
  level: 'info',
  format: jsonFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
    ...(process.env.NODE_ENV !== 'production'
      ? [new winston.transports.Console({ format: consoleFormat })]
      : []),
  ],
});

export const httpLogStream = {
  write: (message: string) => logger.info(message.trim()),
};
