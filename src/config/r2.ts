import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from './env';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.r2.accessKey,
    secretAccessKey: env.r2.secretKey,
  },
});

const mimeToExt: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function uploadAvatar(
  buffer: Buffer,
  mimetype: string,
  userId: string,
): Promise<string> {
  const ext = mimeToExt[mimetype] ?? 'bin';
  const key = `avatars/${userId}-${Date.now()}.${ext}`;
  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.r2.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    }),
  );
  const base = env.r2.publicUrl.replace(/\/$/, '');
  return `${base}/${key}`;
}

export { env as r2Env };
