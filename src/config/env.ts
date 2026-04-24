import dotenv from 'dotenv';
dotenv.config();

const required = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',

  mongo: {
    uri: required('MONGO_URI'),
  },

  redis: {
    url: required('REDIS_URL'),
  },

  r2: {
    accountId: required('R2_ACCOUNT_ID'),
    accessKey: required('R2_ACCESS_KEY'),
    secretKey: required('R2_SECRET_KEY'),
    bucket: required('R2_BUCKET'),
    publicUrl: process.env.R2_PUBLIC_URL || '',
  },

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  telegram: {
    gatewayToken: required('TELEGRAM_GATEWAY_TOKEN'),
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS === '*'
      ? '*'
      : (process.env.ALLOWED_ORIGINS || '*').split(','),
  },
};
