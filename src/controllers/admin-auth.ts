import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Admin } from '../models/admin';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { redis } from '../config/redis';
import { ErrorMessage } from '../enums/error-codes';
import { AdminLoginBody } from '../schemas/auth-schemas';

const REFRESH_TTL = 30 * 24 * 60 * 60;

export async function adminLoginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as AdminLoginBody;

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) throw new AppError(401, ErrorMessage.INVALID_CREDENTIALS);

    const valid = await admin.comparePassword(password);
    if (!valid) throw new AppError(401, ErrorMessage.INVALID_CREDENTIALS);

    const tokenId = crypto.randomUUID();
    const payload = { userId: admin.id as string, phone: admin.email, role: 'admin' as const };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ ...payload, tokenId });

    await redis.setex(`refresh:${admin.id}:${tokenId}`, REFRESH_TTL, refreshToken);

    sendSuccess(res, {
      accessToken,
      refreshToken,
      user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
}
